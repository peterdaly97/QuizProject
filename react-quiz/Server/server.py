from flask import Flask, url_for, Response, request
import pypyodbc
import json
from database_manager import DatabaseManager
from passlib.hash import pbkdf2_sha256
from export_file import FileExporter
from datetime import datetime   

app = Flask(__name__)

# Instantiate our database manager
database_manager = DatabaseManager()
settings = {
	'debug':True	#includes autoreload
}

# Intstantiate and initialise file exporter object
exporter = FileExporter() 
service = exporter.init()

# File id for the Google Doc that our data is stored in
file_id='14PaKknXLogPAKaPBhqQsBLO8DohPpEufB1o2szCUCfw'

# API call fo when a user wants to make an account on the application
# Call receives username and password
@app.route('/SignUp', methods=['POST'])
def api_SignUp():
    # Get variables passed by request
    username = request.get_json()['username']
    password = request.get_json()['password']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT password FROM Users WHERE username = %s;", (str(username),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if len(result) > 0 :
        # If password already exists, close connection and don't accept sign up
        
        cursor.close()
        connection.close()

        accept = False
    
    else:
        # Encrypt password using sha256
        pwdhash = pbkdf2_sha256.encrypt(password)
        cursor.execute("Insert into users(username, password, highscore) values (%s, %s, 0);", (str(username), str(pwdhash),)) # Execute insert statement

        # Close connection
        connection.commit()
        cursor.close()
        connection.close()

        accept = True # Accept sign up

    return Response(
        json.dumps(accept),
        mimetype='application/json'
    )

# API call for when a user tries to log in, entered password is sent and checked against stored pasword
# Function returns whether or not password was accepted
@app.route('/LogIn', methods=['POST'])
def api_LogIn():
    
    # Get variables passed by request
    username = request.get_json()['username']
    password = request.get_json()['password']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT password FROM Users WHERE username = %s;", (str(username),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if len(result) > 0 :
        # If user has password, assign it to stored password
        stored_password = result[0][0]

    # Close connection
    cursor.close()
    connection.close()
   
    if len(result) > 0 and pbkdf2_sha256.verify(password, stored_password) :
        # Checks if entered password matches stored password
        # Sha256.verify used as stored password is encrypted using sha256

        # Return that password was accepted
        accept = True
        return Response(
            json.dumps(accept),
            mimetype='application/json'
        )
    else :

        # Return that password wasn't accepted
        accept = False
        return Response(
            json.dumps(accept),
            mimetype='application/json'
        )

# API call for when a user has completed the quiz, this call receives users score in quiz
# It then checks this score against the current highscore. If the new score is higher, it becomes the new highscore
@app.route('/score', methods=['POST'])
def api_check_score():

    # Get variables passed by request
    username = request.get_json()['username']
    val = request.get_json()['score']
    
    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT highscore FROM users WHERE username = %s;", (str(username),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if len(result) > 0:
        if result[0][0] < val :
            # If new score is greater than highscore, update highscore to be new score
            cursor.execute("UPDATE users SET highscore = %s WHERE username = %s;", (str(val), str(username)))
            connection.commit() 

    cursor.execute("SELECT highscore FROM users WHERE username = %s;", (str(username),)) # Get current highscore
    result = cursor.fetchall()  # Store result of this statement

    # Close the connection
    cursor.close()
    connection.close()

    return Response(
        json.dumps(result),
        mimetype='application/json'
    )


# API call for getting all information in the application
# This includes all info points and quiz questions
# Object returned is formatted in such a way as questions are linked to their relevant info points
@app.route('/info', methods=['GET'])
def api_info_points(): 

    # Call the exporter function to download and format all data stored in Google Doc
    #  This data is then returned as a formatted JSON object
    result = exporter.download_file(service, file_id, "text/plain","./")

    return Response(
        json.dumps(result),
        mimetype='application/json'
    )

# API call for getting all challenges belonging to a user
@app.route('/get_challenges/<username>', methods=['GET'])
def api_get_challenges(username):
    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT challenger, questions_ids FROM challenges WHERE challenged = %s AND status = %s;", (str(username), "Not Completed",)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    array = [] # Array to hold all challenges
    object = {} # Object for storing values of a challenge

    for i in result :
        # Loops through every challenge
        object = {"challenger" : i[0], "questions" : i[1]} # Assigns challenge values to object
        array.append(object) # Stores object in array

    # Close connection
    cursor.close()
    connection.close()

    return Response(
        json.dumps(array),
        mimetype='application/json'
    )

# Function for getting all reports belonging to a user, specified by username
@app.route('/get_reports/<username>', methods=['GET'])
def api_get_reports(username):
    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT challengerScore,challengedScore,id, challenged FROM challenges WHERE challenger = %s AND status = %s;", (str(username), "Completed",)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    # Array to hold all reports belonging to user
    array = []

    for i in result :
        # Loops through every report
        object = {}
        response = "Error"

        # Checks the scores of the challenged user and the user that issued the challenge
        # Based on the scores, the response will be if the challenger won, lost or if the challenge was rejected
        if i[1] == -1 :
            response = "Rejected!"
        elif i[0] > i[1] :
            response = "You Won!"
        else :
            response = "You Lost!"
        object = { 
            "id" : i[2],
            "response" : response,
            "challenged" : i[3]
        }
        array.append(object) # Store report in array

    # Close connection
    cursor.close()
    connection.close()

    return Response(
        json.dumps(array),
        mimetype='application/json'
    )

#Function for seeing if a user exists in the database, specified by username.
#Also checks if user has already been challenged by user trying to issue challenge
@app.route('/check_username/<username>/challenged_by/<challenger>', methods=['GET'])
def api_check_username(username, challenger):
    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = %s;", (str(username),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement
    
    exist = False
    if result[0][0] > 0: 
        # Checks if an amount is returned, if so that user exists in database
        exist = True

    message = ""

    cursor.execute("SELECT COUNT(*) FROM challenges WHERE challenged = %s AND challenger = %s AND status = %s;", (str(username), str(challenger), "Not Completed",)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if result[0][0] > 0: 
        # Checks if an amount is returned, if so that has already been challenged
        message = "Can't challenge user twice!"

    # Create object to store error message and whether or not challenged user exists
    object = {"exist" : exist, "message" : message}

    # Close connection
    cursor.close()
    connection.close()

    return Response(
        json.dumps(object),
        mimetype='application/json'
    )

# API call for when a user wants to challenge another user
@app.route('/post_challenge', methods=['POST'])
def api_post_challenge():
    # Get variables passed by request
    challenger = request.get_json()['challenger']
    questions = request.get_json()['questions']
    challenged = request.get_json()['challenged']
    score = request.get_json()['score']

    questionIds = "" # String to hold all question ids

    for i in questions :
        # Loop through every question and add id to string
        # Format is (question1id, question2id,... questionNid,)
        questionIds = questionIds + str(i["id"]) + ","


    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    # Execute insert statement
    cursor.execute("Insert into challenges(challenger, challenged, challengerScore, questions_ids) \
        values (%s, %s, %s, %s);", (str(challenger), str(challenged), str(score), str(questionIds),))

    # Close connection
    connection.commit()
    cursor.close()
    connection.close()

    accept = True

    return Response(
        json.dumps(accept),
        mimetype='application/json'
    )

# API call for when user wwants to reject a challenge from someone
# This will stop the challenge from appearing in the users challenge section
@app.route('/reject_challenge', methods=['POST'])
def api_reject_challenge():
    # Get variables passed by request
    challenger = request.get_json()['challenger']
    challenged = request.get_json()['challenged']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("UPDATE challenges SET status = %s WHERE challenger = %s and challenged = %s;", ("Completed", str(challenger), str(challenged),)) # Execute update statement

    # Close connection
    connection.commit()
    cursor.close()
    connection.close()

    return "Success"
    
# API call for discarding report, this will set report to be read so now it will not appear
# in the users report section
@app.route('/discard_report', methods=['POST'])
def api_discard_report():
    # Get variables passed by request
    id = request.get_json()['id']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("UPDATE challenges SET status = %s WHERE id = %s;", ("Discarded", str(id))) # Execute update statement

    # Close connection
    connection.commit()
    cursor.close()
    connection.close()

    return "Success"

# Api call for once the challenged user has completed the challenge
# Sets challenge to be complete and updates it with the challenged users score
@app.route('/respond_to_challenge', methods=['POST'])
def api_respond_to_challenge():
    # Get variables passed by request
    challenged = request.get_json()['challenged']
    challenger = request.get_json()['challenger']
    score = request.get_json()['score']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    challengeResult = ""
    cursor.execute("SELECT challengerScore FROM challenges WHERE challenged = %s AND challenger = %s AND status = %s;", (str(challenged), str(challenger), "Not Completed",)) # Executes select statement
    result = cursor.fetchall() # Store result of this statement

    # Checks which user has a higher score and will set the return value to be
    # whether or not the challenged user won
    if result[0][0] > score :
        challengeResult = "You lost"
    else :
        challengeResult = "You won"

    # Execute update statement
    cursor.execute("UPDATE challenges SET status = %s, challengedScore = %s WHERE challenged = %s AND challenger = %s AND status = %s;", ("Completed", str(score), str(challenged), str(challenger), "Not Completed",))

    # Close connection
    connection.commit()
    cursor.close()
    connection.close()

    return Response(
        json.dumps(challengeResult),
        mimetype='application/json'
    )

# API call to add personalised info point to database
@app.route('/post_personal_info', methods=['POST'])
def api_post_info_point():
    # Get variables passed by request
    user = request.get_json()['user']
    title = request.get_json()['title']

    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(user),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    newTitle = title + ',' # Adds comma to end of title so that it keeps with the format for storing info point titles

    if len(result) > 0: # If user alreadys has some info points saved
        newTitles = result[0][0] + newTitle # Adds new title on to the end of the stored title 
        cursor.execute("Update personalisedpoints set title = %s where user = %s;", (str(newTitles), str(user),)) # Execute update statement
    else : # User doesn't have any info points saved yet
        cursor.execute("Insert into personalisedpoints(title, user) values (%s, %s);", (str(newTitles), str(user),)) # Execute Insert statement
    
    # Close connection
    connection.commit()
    cursor.close()
    connection.close()

    returnVal = "Accepted"

    return Response(
        json.dumps(returnVal),
        mimetype='application/json'
    )    

#API call for getting all personal info points belonging to user 
@app.route('/get_personalised_points/<username>', methods=['GET'])
def api_get_points(username):
    # Establish mySQL connection to database from connection pool
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(username),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement
    
    info_headings = [] # Array to store all info headings
    
    if len(result) > 0:
        info_headings = result[0]

    cursor.close()
    connection.close()

    return Response(
        json.dumps(info_headings),
        mimetype='application/json'
    )

#API call for deleting specific title from list of saved info points
@app.route('/remove_personalised_point', methods=['POST'])
def api_remove_point():

     # Get variables passed in request
    user = request.get_json()['user']
    titleToRemove = request.get_json()['title']

    # Establish mySQL connection to database
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(user),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if len(result) > 0:
        titlesArray = result[0][0].split(',') # Split string into array of titles
        for i in titlesArray: # Loops through the titles
            if i == titleToRemove:
                # If title store is equal to title to be remove, delete it from the array
                titlesArray.remove(i)
        
        newTitles = ''
        # This for loop loops through every title that needs to be stored and adds them to a string
        for i in titlesArray:
            if i != titlesArray[-1]:
                newTitles = newTitles + i + ','
        cursor.execute("Update personalisedpoints set title = %s  where user = %s;", (str(newTitles), str(user),)) # Execute update statement
        connection.commit()

    accepted = True

    cursor.close()
    connection.close()

    return Response(
        json.dumps(accepted),
        mimetype='application/json'
    )   

#API call for updating user data so that we can track page visits
@app.route('/update_user_info', methods=['POST'])
def api_update_page_count():

    # Get variables passed in request
    user = request.get_json()['user']
    evt1 = request.get_json()['event1']
    evt2 = request.get_json()['event2']

    # Establish mySQL connection to database
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT id FROM Users WHERE username = %s;", (str(user),)) # Execute select statement
    result = cursor.fetchall() # Store result of this statement

    if len(result) > 0:
        # Create and format current date and time object
        dateTimeObj = datetime.now()     
        timestampStr = dateTimeObj.strftime('%Y-%m-%d %H:%M:%S')
        
        # Execute insert statement
        cursor.execute('Insert into userdata(userid, event, timestamp) values (%s, %s, %s), (%s, %s, %s);', \
            (str(result[0][0]), str(evt1), timestampStr, str(result[0][0]), str(evt2), timestampStr,))
        connection.commit()
    
    accepted = True

    cursor.close()
    connection.close()

    return Response(
        json.dumps(accepted),
        mimetype='application/json'
    )   

if __name__ == '__main__':
    app.run()