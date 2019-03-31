from flask import Flask, url_for, Response, request
import pypyodbc
import json
from database_manager import DatabaseManager
from passlib.hash import pbkdf2_sha256
from export_file import FileExporter
from datetime import datetime   

app = Flask(__name__)

database_manager = DatabaseManager()
settings = {
	'debug':True	#includes autoreload
}

exporter = FileExporter()
service = exporter.init()
file_id='14PaKknXLogPAKaPBhqQsBLO8DohPpEufB1o2szCUCfw'

@app.route('/SignUp', methods=['POST'])
def api_SignUp():
    username = request.get_json()['username']
    password = request.get_json()['password']
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT password FROM Users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()

    if len(result) > 0 :
        connection.commit()
        cursor.close()
        connection.close()

        accept = False
    
    else:
        
        pwdhash = pbkdf2_sha256.encrypt(password)
        cursor.execute("Insert into users(username, password, highscore) values (%s, %s, 0);", (str(username), str(pwdhash),))

        connection.commit()
        cursor.close()
        connection.close()
        accept = True

    return Response(
        json.dumps(accept),
        mimetype='application/json'
    )

    

@app.route('/LogIn', methods=['POST'])
def api_LogIn():
    #print(request.get_json()['score'])
    username = request.get_json()['username']
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT password FROM Users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()

    password = request.get_json()['password']
    
    if len(result) > 0 :
        stored_password = result[0][0]

    cursor.close()
    connection.close()
   
    if len(result) > 0 and pbkdf2_sha256.verify(password, stored_password) :
        accept = True
        return Response(
            json.dumps(accept),
            mimetype='application/json'
        )
    else :
        accept = False
        return Response(
            json.dumps(accept),
            mimetype='application/json'
        )


@app.route('/score', methods=['POST'])
def api_check_score():
    username = request.get_json()['username']
    #print(request.get_json()['score'])
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT highscore FROM users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()
    val = request.get_json()['score']

    if len(result) > 0:
        if result[0][0] < val :
            cursor.execute("UPDATE users SET highscore = %s WHERE username = %s;", (str(val), str(username)))
            connection.commit()

    cursor.execute("SELECT highscore FROM users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()

    cursor.close()
    connection.close()
    return Response(
        json.dumps(result),
        mimetype='application/json'
    )




@app.route('/info', methods=['GET'])
def api_info_points():  
    result = exporter.download_file(service, file_id, "text/plain","./")

    return Response(
        json.dumps(result),
        mimetype='application/json'
    )

@app.route('/get_challenges/<username>', methods=['GET'])
def api_get_challenges(username):
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT challenger, questions_ids FROM challenges WHERE challenged = %s AND status = %s;", (str(username), "Not Completed",))
    result = cursor.fetchall()

    array = []
    object = {}

    for i in result :
        object = {"challenger" : i[0], "questions" : i[1]}
        array.append(object)

    cursor.close()
    connection.close()

    return Response(
        json.dumps(array),
        mimetype='application/json'
    )

# Function for getting all reports belonging to a user, specified by username
@app.route('/get_reports/<username>', methods=['GET'])
def api_get_reports(username):
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT challengerScore,challengedScore,id, challenged FROM challenges WHERE challenger = %s AND status = %s;", (str(username), "Completed",))
    result = cursor.fetchall()

    array = []

    for i in result :
        object = {}
        response = "Error"

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
        array.append(object)

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
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()
    
    exist = False
    if result[0][0] > 0: 
        exist = True

    message = ""

    cursor.execute("SELECT COUNT(*) FROM challenges WHERE challenged = %s AND challenger = %s AND status = %s;", (str(username), str(challenger), "Not Completed",))
    result = cursor.fetchall()

    if result[0][0] > 0: 
        message = "Can't challenge user twice!"

    object = {"exist" : exist, "message" : message}

    cursor.close()
    connection.close()

    return Response(
        json.dumps(object),
        mimetype='application/json'
    )


@app.route('/post_challenge', methods=['POST'])
def api_post_challenge():
    challenger = request.get_json()['challenger']
    questions = request.get_json()['questions']
    challenged = request.get_json()['challenged']
    score = request.get_json()['score']

    questionIds = ""

    for i in questions :
        questionIds = questionIds + str(i["id"]) + ","


    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("Insert into challenges(challenger, challenged, challengerScore, questions_ids) \
        values (%s, %s, %s, %s);", (str(challenger), str(challenged), str(score), str(questionIds),))

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
    challenger = request.get_json()['challenger']
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("UPDATE challenges SET status = %s WHERE challenger = %s;", ("Completed", str(challenger)))

    connection.commit()
    cursor.close()
    connection.close()

    return "Success"
    

# API call for discarding report, this will set report to be read so now it will not appear
# in the users report section
@app.route('/discard_report', methods=['POST'])
def api_discard_report():
    id = request.get_json()['id']

    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("UPDATE challenges SET status = %s WHERE id = %s;", ("Discarded", str(id)))

    connection.commit()
    cursor.close()
    connection.close()

    return "Success"


@app.route('/respond_to_challenge', methods=['POST'])
def api_respond_to_challenge():
    challenged = request.get_json()['challenged']
    challenger = request.get_json()['challenger']
    score = request.get_json()['score']

    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    challengeResult = ""
    cursor.execute("SELECT challengerScore FROM challenges WHERE challenged = %s AND challenger = %s AND status = %s;", (str(challenged), str(challenger), "Not Completed",))
    result = cursor.fetchall()

    if result[0][0] > score :
        challengeResult = "You lost"
    else :
        challengeResult = "You won"

    cursor.execute("UPDATE challenges SET status = %s, challengedScore = %s WHERE challenged = %s AND challenger = %s AND status = %s;", ("Completed", str(score), str(challenged), str(challenger), "Not Completed",))

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
    user = request.get_json()['user']
    title = request.get_json()['title']

    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(user),))
    result = cursor.fetchall()

    newTitles = title + ','

    if len(result) > 0:
        newTitles = result[0][0] + title + ','
        cursor.execute("Update personalisedpoints set title = %s where user = %s;", (str(newTitles), str(user),))
    else :
        cursor.execute("Insert into personalisedpoints(title, user) values (%s, %s);", (str(newTitles), str(user),))
    
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
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(username),))
    result = cursor.fetchall()
    
    info_headings = []
    
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
    user = request.get_json()['user']
    titleToRemove = request.get_json()['title']

    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT title FROM personalisedpoints WHERE user = %s;", (str(user),))
    result = cursor.fetchall()

    if len(result) > 0:
        titlesArray = result[0][0].split(',')
        for i in titlesArray: 
            if i == titleToRemove:
                titlesArray.remove(i)
        
        newTitles = ''
        for i in titlesArray:
            if i != titlesArray[-1]:
                newTitles = newTitles + i + ','
        cursor.execute("Update personalisedpoints set title = %s  where user = %s;", (str(newTitles), str(user),))
        connection.commit()

    accepted = True

    cursor.close()
    connection.close()

    return Response(
        json.dumps(accepted),
        mimetype='application/json'
    )   

#API call for deleting specific title from list of saved info points
@app.route('/update_user_info', methods=['POST'])
def api_update_page_count():
    user = request.get_json()['user']
    evt1 = request.get_json()['event1']
    evt2 = request.get_json()['event2']

    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 

    cursor.execute("SELECT id FROM Users WHERE username = %s;", (str(user),))
    result = cursor.fetchall()

    if len(result) > 0:
        dateTimeObj = datetime.now()     
        timestampStr = dateTimeObj.strftime('%Y-%m-%d %H:%M:%S')

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