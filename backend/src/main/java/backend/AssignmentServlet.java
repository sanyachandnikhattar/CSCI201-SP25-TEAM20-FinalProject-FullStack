package backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

@WebServlet("/api/assignments/*")
public class AssignmentServlet extends HttpServlet 
{
    private static final long serialVersionUID = 1L;
    
    private Connection conn = null;
    private PreparedStatement createAssignmentStatement = null;
    private PreparedStatement deleteAssignmentStatement = null;
    private PreparedStatement updateAssignmentStatement = null;
    private PreparedStatement getAssignmentStatement = null;
    private PreparedStatement getAllAssignmentsStatement = null;
    
    public AssignmentServlet() throws ClassNotFoundException {
        super();
        initializeDatabase();
    }
    
    private void initializeDatabase() throws ClassNotFoundException {
        if (conn == null) {
            System.out.println("Initializing database connection...");
            try 
            {
            	Class.forName("com.mysql.cj.jdbc.Driver");
                //DriverManager.registerDriver(new com.mysql.cj.jdbc.Driver());
                conn = DriverManager.getConnection("jdbc:mysql://localhost/FinalProject?user=root&password=strong_pass");
                
                if (conn != null && conn.isValid(2)) {
                    System.out.println("Connected to the database.");
                    
                    // Initialize prepared statements
                    createAssignmentStatement = conn.prepareStatement(
                        "INSERT INTO assignments (course_name, course_id, assignment_name, due_date, description) " +
                        "VALUES (?, ?, ?, ?, ?)", PreparedStatement.RETURN_GENERATED_KEYS);
                    
                    deleteAssignmentStatement = conn.prepareStatement(
                        "DELETE FROM assignments WHERE assignment_id = ?");
                    
                    updateAssignmentStatement = conn.prepareStatement(
                        "UPDATE assignments SET course_name = ?, course_id = ?, " +
                        "assignment_name = ?, due_date = ?, description = ? " +
                        "WHERE assignment_id = ?");
                    
                    getAssignmentStatement = conn.prepareStatement(
                        "SELECT * FROM assignments WHERE assignment_id = ?");
                    
                    getAllAssignmentsStatement = conn.prepareStatement(
                        "SELECT * FROM assignments");
                    
                } else {
                    System.out.println("Failed to connect to the database.");
                }
            } catch (SQLException e) {
                System.out.println("Database connection error: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    
    private void createAssignment(HttpServletRequest request, HttpServletResponse response) throws IOException 
    {
        Assignment a = new Gson().fromJson(request.getReader(), Assignment.class);
        
        //now use a.getAssignmentName(), etc.
        try {
            createAssignmentStatement.setString(1, a.getAssignmentName());
            createAssignmentStatement.setInt(2, a.getCourseID());
            createAssignmentStatement.setInt(3, a.getAssignmentID());
            createAssignmentStatement.setString(4, a.getDueDate());
            createAssignmentStatement.setString(5, a.getDescription());

            int rows = createAssignmentStatement.executeUpdate();
            if (rows > 0) {
                response.getWriter().write("{\"status\":\"created\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } 
        
        catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
  
    private void editAssignment(HttpServletRequest request, HttpServletResponse response) throws JsonSyntaxException, JsonIOException, IOException
    {
    	Assignment a = new Gson().fromJson(request.getReader(), Assignment.class);
    	
    	  try 
    	  {
	        updateAssignmentStatement.setString(1, a.getAssignmentName());
	        updateAssignmentStatement.setInt(2, a.getCourseID());
	        updateAssignmentStatement.setInt(3, a.getAssignmentID());
	        updateAssignmentStatement.setString(4, a.getDueDate());
	        updateAssignmentStatement.setString(5, a.getDescription());

	        int rows = updateAssignmentStatement.executeUpdate();
	        response.getWriter().write("{\"updated\":" + (rows > 0) + "}");
    	 } 
    	  
    	  catch (SQLException e) 
    	  {
	        e.printStackTrace();
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    	  }
    }
   
    private void deleteAssignment(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
    	Assignment a = new Gson().fromJson(request.getReader(), Assignment.class);
    	
    	 try 
    	 {
	        deleteAssignmentStatement.setInt(1, a.getAssignmentID());
	        int rows = deleteAssignmentStatement.executeUpdate();
	        response.getWriter().write("{\"deleted\":" + (rows > 0) + "}");
    	    
    	 } 
    	 
    	 catch (SQLException e) 
    	 {
	        e.printStackTrace();
	       response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    	 }
    }
    
    //don't need doGet(), only doPost() --> change state in database; none just return data
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException 
    {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String action = request.getParameter("action");
        
        System.out.println(action);
   }
    
    @Override
    public void destroy() {
        // Close database resources when servlet is destroyed
        try {
            if (createAssignmentStatement != null) createAssignmentStatement.close();
            if (deleteAssignmentStatement != null) deleteAssignmentStatement.close();
            if (updateAssignmentStatement != null) updateAssignmentStatement.close();
            if (getAssignmentStatement != null) getAssignmentStatement.close();
            if (getAllAssignmentsStatement != null) getAllAssignmentsStatement.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            System.out.println("Error closing database resources: " + e.getMessage());
            e.printStackTrace();
        }
        super.destroy();
    }
}
