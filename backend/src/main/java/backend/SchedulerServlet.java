package backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/SchedulerServlet")
public class SchedulerServlet extends HttpServlet {
    
    private DBManager dbManager;

    @Override
    public void init() throws ServletException {
        dbManager = new DBManager();
    }

    // POST for joining a course
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
	String email = request.getParameter("email");
        int courseId = Integer.parseInt(request.getParameter("courseId"));


        boolean success = false;

        try {
            Connection conn = dbManager.connection();
            if (conn != null) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO UserCourse (userEmail, courseID) VALUES (?, ?)");
		    
                stmt.setString(1, userId);
                stmt.setInt(2, courseId);
                success = stmt.executeUpdate() > 0;

                stmt.close();
                dbManager.disconnection();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
	if (success) {
	    out.println("Successfully joined course.");
	} else {
	    out.println("Failed to join course.");
	}
    }
}
