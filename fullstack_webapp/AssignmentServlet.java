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

@WebServlet("/AssignmentServlet")
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
                conn = DBManager.getConnection();
                
                if (conn != null && conn.isValid(2)) {
                    System.out.println("Connected to the database.");
                    
                    // Initialize prepared statements
                    createAssignmentStatement = conn.prepareStatement(
                        "INSERT INTO assignment (courseID, aName, dueDate, dueTime, descr) " +
                        "VALUES (?, ?, ?, ?, ?)", PreparedStatement.RETURN_GENERATED_KEYS);
                    
                    deleteAssignmentStatement = conn.prepareStatement(
                        "DELETE FROM assignment WHERE assignmentID = ?");
                    
                    updateAssignmentStatement = conn.prepareStatement(
                        "UPDATE assignment SET " +
                        "aName = ?, dueDate = ?, dueTime = ?, descr = ? " +
                        "WHERE assignmentID = ?");
                    
                    getAssignmentStatement = conn.prepareStatement(
                        "SELECT * FROM assignment WHERE assignmentID = ?");
                    
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
     
        try {
            createAssignmentStatement.setInt(1, a.getCourseID());            // course_id
            createAssignmentStatement.setString(2, a.getAssignmentName());   // redundant: was setInt before
            createAssignmentStatement.setString(3, a.getDueDate());          // due_date
            createAssignmentStatement.setString(4, a.getDueTime());          // due_date
            createAssignmentStatement.setString(5, a.getDescription());      // description

            int rows = createAssignmentStatement.executeUpdate();

            if (rows > 0) {
                ResultSet generatedKeys = createAssignmentStatement.getGeneratedKeys();
                int assignmentID = -1;
                if (generatedKeys.next()) {
                    assignmentID = generatedKeys.getInt(1);
                }

                response.setContentType("application/json");
                PrintWriter out = response.getWriter();
                out.write("{\"status\": \"created\", \"assignmentID\": " + assignmentID + "}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (SQLException e) {
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
	        updateAssignmentStatement.setString(2, a.getDueDate());
	        updateAssignmentStatement.setString(3, a.getDueTime());
	        updateAssignmentStatement.setString(4, a.getDescription());
	        updateAssignmentStatement.setInt(5, a.getAssignmentID());

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
//    	Assignment a = new Gson().fromJson(request.getReader(), Assignment.class);
    	int assignmentID = Integer.parseInt(request.getParameter("assignmentID"));
    	
    	 try 
    	 {
	        deleteAssignmentStatement.setInt(1, assignmentID);
	        int rows = deleteAssignmentStatement.executeUpdate();
	        response.getWriter().write("{\"deleted\":" + (rows > 0) + "}");
    	    
    	 } 
    	 
    	 catch (SQLException e) 
    	 {
	        e.printStackTrace();
	       response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    	 }
    }
    
    
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        // Always default to UTF‑8 for safety
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"missing action parameter\"}");
            return;
        }


        try {
            switch (action.toLowerCase()) {
                case "create":
                    createAssignment(request, response);
                    break;

                case "update":
                case "edit":      // allow either keyword
                    editAssignment(request, response);
                    break;

                case "delete":
                    deleteAssignment(request, response);
                    break;

                default:
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter()
                            .write("{\"error\":\"unknown action: "
                                   + action + "\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter()
                    .write("{\"error\":\"internal server error\"}");
        }
    }

    
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        String courseIdParam = request.getParameter("courseID");
        if (courseIdParam == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"error\": \"Missing courseID parameter\"}");
            return;
        }

        int courseID;
        try {
            courseID = Integer.parseInt(courseIdParam);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"error\": \"Invalid courseID format\"}");
            return;
        }

        List<Assignment> assignments = new ArrayList<>();

        String query = "SELECT * FROM Assignment WHERE courseID = ?";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, courseID);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                int assignmentID = rs.getInt("assignmentID");
                String assignmentName = rs.getString("aName");
                String description = rs.getString("descr");
                String dueDate = rs.getString("dueDate");
                String dueTime = rs.getString("dueTime");

                assignments.add(new Assignment(courseID, assignmentID, assignmentName, dueDate, dueTime, description));
            }

            out.write(gson.toJson(assignments));

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\": \"Database query failed\"}");
        }
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
