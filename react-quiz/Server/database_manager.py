from mysql.connector.pooling import MySQLConnectionPool
from mysql.connector import errorcode
import time
import traceback

class DatabaseManager:

	def __init__(self):
		
		self.createConnectionPool()	
		
			
	def createConnectionPool(self):
		dbconfig = {
		"user": "root",
		"password":"ePBsjLQV",
		"database":'desapi'
		}

		try:
		
			self.cnxpool = MySQLConnectionPool(
														pool_name = "mypool",
														pool_size = 32,
														**dbconfig)
		except:
			# sleep and retry - the MySQL container probably not up and running yet
			print("Exception... sleeping for 5 seconds then retry")
			tb = traceback.format_exc()
			print(tb)
			time.sleep(5)
			# try again
			return self.createConnectionPool()