from database_manager import DatabaseManager
import matplotlib.pyplot as plt
import numpy as np

database_manager = DatabaseManager()
settings = {
	'debug':True	#includes autoreload
}

# Establish mySQL connection to database from connection pool
connection = database_manager.cnxpool.get_connection()
cursor = connection.cursor(buffered=True) 

cursor.execute("SELECT COUNT(*) FROM userdata WHERE event = 'Start Quiz';") # Execute select statement
result = cursor.fetchall() # Store result of this statement

startQuizAmount = result[0][0] # Assign amount of quiz page visits to variable

cursor.execute("SELECT COUNT(*) FROM userdata WHERE event = 'Enter Result Page';") # Execute select statement
result = cursor.fetchall() # Store result of this statement

finishQuizAmount = result[0][0] # Assign amount of result page visits to variable

# Set up bar chart variables
objects = ('Start Quiz', 'Finish Quiz')
y_pos = np.arange(len(objects))
performance = [startQuizAmount, finishQuizAmount]
 
 # Set up bar chart
plt.bar(y_pos, performance, align='center', alpha=0.5)
plt.xticks(y_pos, objects)
plt.ylabel('Times Page Visited')
plt.title('Page Visits')
 
plt.savefig('Graphs/Graph1.png') # Save bar chart as png
plt.show() # Display bar chart to screen