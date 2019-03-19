from flask import Flask, url_for, Response, request
import pypyodbc
import json
from database_manager import DatabaseManager
from passlib.hash import pbkdf2_sha256
from export_file import FileExporter

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
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
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



    connection.commit()
    cursor.close()
    connection.close()
   
    if len(result) > 0 and pbkdf2_sha256.verify(password, stored_password) :
        accept = True
        return Response(
            json.dumps(accept),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
    else :
        accept = False
        return Response(
            json.dumps(accept),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )


@app.route('/score', methods=['POST'])
def api_check_score():
    username = request.get_json()['username']
    #print(request.get_json()['score'])
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT highscore FROM Users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()
    val = request.get_json()['score']
    if result[0][0] < val :
        cursor.execute("UPDATE Users SET highscore = %s WHERE username = %s;", (str(val), str(username)))
        connection.commit()

    cursor.execute("SELECT highscore FROM Users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()

    connection.commit()
    cursor.close()
    connection.close()
    return Response(
        json.dumps(result),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )




@app.route('/info', methods=['GET'])
def api_info_points():  
    result = exporter.download_file(service, file_id, "text/plain","./")

    return Response(
        json.dumps(result),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
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

    connection.commit()
    cursor.close()
    connection.close()

    return Response(
        json.dumps(array),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
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


    connection.commit()
    cursor.close()
    connection.close()

    return Response(
        json.dumps(array),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

#Function for seeing if a user exists in the database, specified by username
@app.route('/check_username/<username>', methods=['GET'])
def api_check_username(username):
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = %s;", (str(username),))
    result = cursor.fetchall()
    
    exist = False
    if result[0][0] > 0: 
        exist = True

    connection.commit()
    cursor.close()
    connection.close()

    return Response(
        json.dumps(exist),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/quiz', methods=['GET'])
def api_quiz():
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT p.*, pf.* FROM quiz_questions p INNER JOIN quiz_answers pf ON pf.quiz_question_id = p.id")
    result = cursor.fetchall()

    quizQuestions = []
    quizCorrect = []
    quizCategory = []
    quizContent = []
    quizId = []

    index = 0
    for i in result :
        if i[0] not in quizId :
            quizId.append(i[0])

        if i[1] not in quizQuestions : 
            quizQuestions.append(i[1])
            quizCorrect.append(i[2])
            quizCategory.append(i[3])
            newContentArray = []

            j = index
            while j < len(result) and i[0] == result[j][0] :
                newContentArray.append(result[j][5])
                j += 1
            
            
            quizContent.append(newContentArray)
        index += 1
    
    wholeArray = []
    k = 0
    while k < len(quizQuestions) :
        object = {"id" : quizId[k], "question" : quizQuestions[k], "correct" : quizCorrect[k], "category" : quizCategory[k], "answers" : quizContent[k]}

        wholeArray.append(object)
        k += 1
    
    result = wholeArray

    connection.commit()
    cursor.close()
    connection.close()

    return Response(
        json.dumps(result),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
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
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

# Needs to be updated to use ID's
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
    

# Needs to be updated to use ID's
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

if __name__ == '__main__':
    app.run()