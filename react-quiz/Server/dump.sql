-- MySQL dump 10.17  Distrib 10.3.12-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: quiztestdb
-- ------------------------------------------------------
-- Server version	10.3.12-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `quiztestdb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `quiztestdb` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `quiztestdb`;

--
-- Table structure for table `info`
--

DROP TABLE IF EXISTS `info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `info` (
  `id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info`
--

LOCK TABLES `info` WRITE;
/*!40000 ALTER TABLE `info` DISABLE KEYS */;
INSERT INTO `info` VALUES (1,'Getting Coeliac Disease'),(2,'Foods To Avoid'),(3,'Good Foods'),(4,'Symptoms'),(5,'Health'),(6,'Genetics'),(7,'Coeliac as a Disease'),(8,'Tips for Eating Out');
/*!40000 ALTER TABLE `info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `info_content`
--

DROP TABLE IF EXISTS `info_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `info_content` (
  `info_title_id` int(11) NOT NULL,
  `info_point` varchar(120) NOT NULL,
  PRIMARY KEY (`info_title_id`,`info_point`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info_content`
--

LOCK TABLES `info_content` WRITE;
/*!40000 ALTER TABLE `info_content` DISABLE KEYS */;
INSERT INTO `info_content` VALUES (1,'A person can become intolerant to gluten at any age'),(1,'An intolerance to gluten can develop at any time'),(1,'Coeliac disease is incurable'),(1,'Coeliac disease often runs in families'),(1,'Research shows that coeliac disease is strongly associated with a number of genetic mutations'),(2,'Bread'),(2,'Cereal'),(2,'Most seasonings and spices'),(2,'Pasta'),(2,'Pizza'),(3,'Fruit and vegetables'),(3,'Gluten-free flours, including rice, corn, soy and potato'),(3,'Meat and fish (although not breaded or battered)'),(3,'Most dairy products, such as cheese, butter and milk'),(3,'Potatoes'),(3,'Rice and rice noodles'),(4,'Anaemia ( breathlessness and an irregular heartbeat, caused by a lack of iron in the blood)'),(4,'Bloating'),(4,'Indigestion'),(4,'Loss of appetite'),(4,'Mild abdominal (stomach) pain'),(4,'Occasional changes in bowel habit, such as episodes of mild diarrhoea or constipation'),(4,'Some loss of hair (alopecia, usually only affects adults)'),(4,'Tingling and numbness in your hands and feet (neuropathy)'),(4,'Vomiting (usually only affects children)'),(5,'A GIP test can determine if you have ingested gluten'),(5,'However, in coeliac disease, the damage and inflammation to the lining of your gut flattens the villi'),(5,'If you have coeliac disease, eating gluten results in damage to your intestines'),(5,'Never ingesting gluten is the only way to not experience the symptoms of Coeliac disease'),(5,'The surface of the gut lining is usually covered with millions of tiny tube-shaped growths called villi'),(5,'Villi increase the surface area of your gut and help it to digest food more effectively'),(5,'Which reduces their ability to help with digestion'),(5,'Women are 3 times more likely to develop Coeliac disease'),(6,'Coeliac disease is not contagious'),(6,'Coeliac disease often runs in families'),(6,'Genes are responsible for the development of the immune system, and may be passed down through a family'),(6,'If you have an identical twin with coeliac disease, there is an 85% chance that you will also develop the condition'),(6,'The risk of developing coeliac disease if you have a close relative with it is approximately 10%'),(7,' Coeliac disease is considered to be more prevalent in people with autoimmune conditions'),(7,'An autoimmune disease is a condition in which your immune system mistakenly attacks your body'),(7,'Coeliac disease is an auto-immune disease'),(7,'Other autoimmune diseases are type 1 diabetes and Rheumatoid arthritis'),(8,'Be very specific in your questions about each item'),(8,'Confirm your order before eating'),(8,'Have your food prepared on a clean cooking surface, with clean utensils'),(8,'Medic alert bracelets help give credibility to the seriousness of your diet restrictions'),(8,'Time your meal either before or after the busiest meal time'),(8,'You may need to ask extensive questions about the foods and preparation'),(8,'You will have more time and easier access to the people who can help you');
/*!40000 ALTER TABLE `info_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_answers`
--

DROP TABLE IF EXISTS `quiz_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_answers` (
  `quiz_question_id` int(11) NOT NULL,
  `answer` varchar(100) NOT NULL,
  PRIMARY KEY (`quiz_question_id`,`answer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_answers`
--

LOCK TABLES `quiz_answers` WRITE;
/*!40000 ALTER TABLE `quiz_answers` DISABLE KEYS */;
INSERT INTO `quiz_answers` VALUES (1,'Antibiotics'),(1,'Snake Oil'),(1,'There is no cure'),(2,'Fever'),(2,'Indigestion'),(2,'Jaundice'),(3,'Bread'),(3,'Carrots'),(3,'Chicken'),(4,'1'),(4,'14'),(4,'Any Age'),(5,'Both are Equal'),(5,'Men'),(5,'Women'),(6,'No'),(6,'Yes'),(7,'Don\'t ingest gluten'),(7,'Stop eating'),(7,'Take exercise'),(8,'15%'),(8,'30%'),(8,'85%'),(9,'Early'),(9,'Late'),(9,'Rush Hour'),(10,'Both'),(10,'Clean Cooking Surface'),(10,'Clean Utensils'),(11,'Confirm your Order'),(11,'Forget your Order'),(11,'Go on their Break'),(12,'A Lifestyle'),(12,'A Virus'),(12,'An Autoimmune Disease'),(13,'Attacks Itself'),(13,'Gets Stronger'),(13,'Stops Working'),(14,'Influenza'),(14,'Measles'),(14,'Type 1 Diabetes');
/*!40000 ALTER TABLE `quiz_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(80) NOT NULL,
  `correct` varchar(80) NOT NULL,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
INSERT INTO `quiz_questions` VALUES (1,'What is the cure for coeliac disease?','There is no cure','Getting Coeliac Disease'),(2,'Which of these is a sympton of gluten ingestion?','Indigestion','Symptoms'),(3,'Which of these foods contain gluten?','Bread','Foods To Avoid'),(4,'What age do you have to be to develop Coeliacs disease?','Any Age','Getting Coeliac Disease'),(5,'Which gender is more likely to develop Coeliacs disease?','Women','Health'),(6,'Do fruit and vegetables contain gluten?','No','Good Foods'),(7,'How does a Coeliac stop experiencing Coeliac symptoms','Don\'t ingest gluten','Good Foods'),(8,'If your identical twin has Coeliac Disease, what are the chances you\'ll get it?','85%','Genetics'),(9,'What is the worst time to go to a restaurant?','Rush Hour','Tips for Eating Out'),(10,'What needs to be clean when the chef prepares food?','Both','Tips for Eating Out'),(11,'What should you ask the waiter to do after they take your order?','Confirm your Order','Tips for Eating Out'),(12,'Coeliac Disease is...','An Autoimmune Disease','Coeliac as a Disease'),(13,'An autoimmune disease is when the body\'s immune system..','Attacks Itself','Coeliac as a Disease'),(14,'Which is another autoimmune disease?','Type 1 Diabetes','Coeliac as a Disease');
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `highscore` int(11) DEFAULT 0,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin',730,'admin'),('peterDaly',720,'adminpasswd'),('testing',1100,'testing');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-21 20:03:15
