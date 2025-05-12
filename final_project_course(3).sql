-- CREATE DATABASE FinalProject;
USE FinalProject;
DROP TABLE IF EXISTS UserCourse;
DROP TABLE IF EXISTS Assignment;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS users;

 CREATE TABLE users
 (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    university VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_ VARCHAR(255) NOT NULL
);

CREATE TABLE Course 
(
	courseID INT PRIMARY KEY AUTO_INCREMENT,
	courseName TEXT(100),
    courseDates TEXT(100),
    courseTime TEXT(100) 
); 

CREATE TABLE UserCourse 
(
	user_id INT,
    courseID INT, -- matches Course table's primary key
    PRIMARY KEY (user_id, courseID),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, -- deleting from the reference table also deletes this --> cascading effect 
    FOREIGN KEY (courseID) REFERENCES course(courseID) ON DELETE CASCADE
);

CREATE TABLE Assignment
(
	assignmentID INT PRIMARY KEY AUTO_INCREMENT,
	courseID INT NOT NULL,
    aName VARCHAR(100),
    dueDate VARCHAR(45) NOT NULL,
    dueTime VARCHAR(45) NOT NULL,
    descr TEXT,
    FOREIGN KEY (courseID) REFERENCES COURSE(courseID) ON DELETE CASCADE
);

-- INSERT SAMPLE USERS
INSERT INTO users (full_name, university, email, password_)
VALUES 
('Alice Jones', 'UCLA', 'alicejones@ucla.edu', 'hashed_pw1'),
('John Traveler', 'USC', 'john@usc.edu', 'hashed_pw2');



-- INSERT SAMPLE COURSES
INSERT INTO Course (courseName, courseDates, courseTime)
VALUES
('CSCI 270', 'Tuesday / Thursday', '9:30 AM'),
('CSCI 270', 'Tuesday / Thursday', '12:30 PM'),
('CSCI 310', 'Monday / Wednesday', '10:00 AM'),
('CSCI 201', 'Tuesday / Thursday', '11:00 AM');




-- INSERT SAMPLE ASSIGNMENTS
INSERT INTO Assignment (courseID, aName, dueDate, dueTime, descr)
VALUES
(1, 'Final', '05-14-2025', '11:59 PM', 'final 270!'),
(2, 'Final', '05-14-2025', '11:59 PM', 'final 270!'),
(3, 'Syllabus', '09-02-2025', '10:00 AM', 'welcome to 310'),
(4, 'Final Project', '05-13-2025', '11:59 PM', 'Congratulations, 201!');



-- ENROLL USERS IN COURSES
INSERT INTO UserCourse (user_id, courseID)
VALUES
(1, 1),
(1, 3),
(1, 4),
(2, 2),
(2, 3), 
(2, 4);



