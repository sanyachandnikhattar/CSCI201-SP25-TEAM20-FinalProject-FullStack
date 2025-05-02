package backend;

import java.util.List;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.PreparedStatement;

public class Course {
	private int courseID; 
	private String courseName; 
	private List<Assignment> courseAssignments; 
	private String courseDates; 
	private String courseTime; 
	DBManager dbManager; 
	
	public Course(DBManager dbManager) 
	{
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
	
	public Assignment findAssignment(Assignment assignment) 
	{
		for(int i=0; i<courseAssignments.size(); i++) {
			if(assignment.getAssignmentID() == courseAssignments.get(i).getAssignmentID()) 
			{
				return courseAssignments.get(i); 
			}
		}
		
		return null; //return statement when no match is found
	}
	
	public void deleteAssignment(Assignment assignment) 
	{
		for(int i=0; i<courseAssignments.size(); i++) 
		{
			if(assignment.getAssignmentID() == courseAssignments.get(i).getAssignmentID()) 
			{
				courseAssignments.remove(i); 
			}
		}
	}
	
	//add to the Course table in the database
	public void createCourse() 
	{ 
		Connection conn = null;
		String toExecString = "";
		PreparedStatement stmt = null;
		
		try
		{
			conn = dbManager.connection(); 
			toExecString = "INSERT INTO Course (courseID, courseName, courseDates, courseTime) VALUES (" + courseID + "," + courseName + "," + courseDates + "," + courseTime + ")"; 
			//dbManager.executeQuery(toExecString);
			stmt = conn.prepareStatement(toExecString);
		}
		
		catch (SQLException e) 
		{
	        e.printStackTrace();
	        // Handle exception appropriately - maybe log it or throw a custom exception
		} 
		
		finally 
		{
        //always close resources in finally block
	        try 
	        {
	          if (toExecString != null) stmt.close();
	        } 
	        
	        catch (SQLException e) 
	        {
	            e.printStackTrace();
	        }
	        
	        // Always disconnect in finally block
	        if (conn != null) {
	            dbManager.disconnection();
	        }
	    }
		
	}
	
	//if a logged-in User creates a course, they should automatically join the course 
	public void loggedIncreateCourse(String userID, Scheduler scheduler) 
	{
		//add the course to the database 
		createCourse(); 
		
		//automatically have the User join the course 
		scheduler.joinCourse(courseID, userID); 
	}
	
	//remove from the Course table in the database 
	public void deleteCourse() 
	{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try 
		{
			conn = dbManager.connection(); 
			String toExecString = "DELETE FROM Course WHERE courseID = " + courseID; 
			stmt = conn.prepareStatement(toExecString);
		}
		
		catch (SQLException e) 
		{
	        e.printStackTrace();
	        // Handle exception appropriately
	    } 
		
		finally 
		{
	        // Always close resources in finally block
	        try 
	        {
	        	if (stmt != null) stmt.close();
	        } 
	        
	        catch (SQLException e) 
	        {
	            e.printStackTrace();
	        }
	        
	        // Always disconnect in finally block
	        if (conn != null) 
	        {
	            dbManager.disconnection();
	        }
		}
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
