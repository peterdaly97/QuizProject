from flask import Flask, url_for, Response
import pypyodbc
import mysql.connector as mariadb
import json

app = Flask(__name__)

mariadb_connection = mariadb.connect(user='root', 
                                    password='adminpasswd', 
                                    database='quiztestdb')

@app.route('/')
def api_root():
    return 'Welcome'

@app.route('/users', methods=['GET'])
def api_users():
    cursor = mariadb_connection.cursor(buffered=True) 
    cursor.execute("SELECT * FROM Users")
    result = cursor.fetchall()
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
    cursor = mariadb_connection.cursor(buffered=True) 
    cursor.execute("SELECT p.*, pf.* FROM info p INNER JOIN info_content pf ON pf.info_title_id = p.id")
    result = cursor.fetchall()
    print(result);
    
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
    cursor = mariadb_connection.cursor(buffered=True) 
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