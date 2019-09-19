# QuizProject
My final year project for college. Building a web application in React with a 
python backend. Project has an information section and a quiz section. Theme of
the information is Coeliac Disease. Project was carried out as part of a bigger ERASMUS+ 
project to create an application to help adolescent Coeliac patients comply with a 
gluten-free diet. Application was tested with Coeliac patients in Austria and Seville.

Features of this project include: 
- All quiz and info pages information is read into the backend from a Google Doc, allows it to be easily edited and added to.
  Especially useful when working with people who have no programming knowledge but which to help add info to the project.
- Quiz results are assessed and a personalised information page is generated that presents info that the user has proven not to know.
  This is beneficial as it streamlines information to the user in bullet points and not bogging down the user in info they already know.
- Multiplayer aspect where users can challenge each other to quizzes. Adds a social aspect to the application and provides an incentive 
  to learn the info provided so that they can beat their friends.
- Confidential information encrypted in the database, database secure from SQL injections and no private info ever stored in the frontend.
- Page visits and time on pages stored in database. Graph manager in server generates graphs based on this information. This allows for constant
  feedback on the popularity of different pages.
- Connection pool created in server to allow for multiple connections to the database to occur at any time.
