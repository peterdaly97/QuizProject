from flask import Flask, url_for, Response, request
import pypyodbc
import json
from database_manager import DatabaseManager
from passlib.hash import pbkdf2_sha256

app = Flask(__name__)

database_manager = DatabaseManager()
settings = {
	'debug':True	#includes autoreload
}

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
    
    stored_password = result[0][0]+



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
    connection = database_manager.cnxpool.get_connection()
    cursor = connection.cursor(buffered=True) 
    cursor.execute("SELECT p.*, pf.* FROM info p INNER JOIN info_content pf ON pf.info_title_id = p.id")
    result = cursor.fetchall()
    
    infoTitles = []
    infoContent = []

    index = 0
    for i in result :

      if i[1] not in infoTitles : 
        infoTitles.append(i[1])
        newContentArray = []

        j = index
        while j < len(result) and i[0] == result[j][0] :
            newContentArray.append(result[j][3])
            j += 1
          
        
        infoContent.append(newContentArray)
      index += 1
    
    wholeArray = []
    k = 0
    while k < len(infoTitles) :
      object = {"title" : infoTitles[k], "content" : infoContent[k]}

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

    index = 0
    for i in result :

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
      object = {"question" : quizQuestions[k], "correct" : quizCorrect[k], "category" : quizCategory[k], "answers" : quizContent[k]}

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




if __name__ == '__main__':
    app.run()