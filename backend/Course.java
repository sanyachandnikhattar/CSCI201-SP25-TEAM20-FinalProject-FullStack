package final_project;

import java.util.List;

public class Course {
	private int courseID; 
	private String courseName; 
	private List<Assignment> courseAssignments; 
	private String courseDates; 
	private String courseTime; 
	DBManager dbManager; 
	
	public Course(DBManager dbManager) {
		this.dbManager = dbManager; 
	}
	
	
	public Course(List<Assignment> courseAssignments, int courseID, String courseName, String courseDates, String courseTime, DBManager dbManager) {
		this.courseAssignments = courseAssignments; 
		this.courseID = courseID; 
		this.courseName = courseName; 
		this.courseDates = courseDates; 
		this.courseTime = courseTime; 
		this.dbManager = dbManager; 
	}
	
	public Course(int courseID, String courseName, String courseDates, String courseTime, DBManager dbManager) {
		this.courseID = courseID; 
		this.courseName = courseName; 
		this.courseDates = courseDates; 
		this.courseTime = courseTime; 
		this.dbManager = dbManager; 
	}
	
	public void addAssignment(Assignment assignment) {
		courseAssignments.add(assignment); 
	}
	
	public Assignment findAssignment(Assignment assignment) {
		for(int i=0; i<courseAssignments.size(); i++) {
			if(assignment.assignmentID == courseAssignments[i].assignmentID) {
				return courseAssignments[i]; 
			}
		}
	}
	
	public void deleteAssignment(Assignment assignment) {
		for(int i=0; i<courseAssignments.size(); i++) {
			if(assignment.assignmentID == courseAssignment[i].assignmentID) {
				courseAssignments.remove(i); 
			}
		}
	}
	
	//add to the Course table in the database
	public void createCourse() { 
		dbManager.connection(); 
		String toExecString = "INSERT INTO Course (courseID, courseName, courseDates, courseTime) VALUES (" + courseID + "," + courseName + "," + courseDates + "," + courseTime + ")"; 
		dbManager.executeQuery(toExecString); 
		dbManager.disconnection(); 
		
	}
	
	//if a logged-in User creates a course, they should automatically join the course 
	public void loggedIncreateCourse(String userID, Scheduler scheduler) {
		//add the course to the database 
		createCourse(); 
		
		//automatically have the User join the course 
		scheduler.join(courseID, userID); 
	}
	
	//remove from the Course table in the database 
	public void deleteCourse() {
		dbManager.connection(); 
		String toExecString = "DELETE FROM Course WHERE courseID = " + courseID; 
		dbManager.executeQuery(toExecString); 
		dbManager.disconnection(); 
	}
	
	
	//getters 
	public int courseID() {
		return courseID; 
	}
	
	public String courseName() {
		return courseName; 
	}
	
	public String courseDates() {
		return courseDates; 
	}
	
	public String courseTime() {
		return courseTime; 
	}
	
	public List<Assignment> courseAssignments() {
		return courseAssignments; 
	}
	
	
	//setters 
	public void setCourseID(int courseID) {
		this.courseID = courseID; 
	}
	
	public void setCourseName(String courseName) {
		this.courseName = courseName; 
	}
	
	public void setCourseDate(String courseDates) {
		this.courseDates = courseDates; 
	}
	
	public void setCourseTime(String courseTime) {
		this.courseTime = courseTime; 
	}
	
	public void setCourseAssignments(List<Assignment> courseAssignments) {
		this.courseAssignments = courseAssignments; 
	}
	
	
	
}
