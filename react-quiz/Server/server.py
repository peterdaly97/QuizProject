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