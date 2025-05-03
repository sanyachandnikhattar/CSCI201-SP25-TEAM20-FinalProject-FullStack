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

    // GET for search
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        String query = request.getParameter("query");
        List<Course> results = new ArrayList<>();

        try {
            Connection conn = dbManager.connection();
if (conn != null) {
                String sql = "SELECT * FROM courses WHERE name LIKE '%" + query + "%'";
                ResultSet rs = dbManager.executeQuery(sql);

                while (rs != null && rs.next()) {
                    String courseName = rs.getString("name");
                    int courseId = rs.getInt("id");
                    results.add(new Course(courseName, courseId));
                }
                dbManager.disconnection();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        for (Course course : results) {
            out.println("<p>" + course.getName() + " (ID: " + course.getId() + ")</p>");
        }
    }

    // POST for joining a course
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        int courseId = Integer.parseInt(request.getParameter("courseId"));
        String userId = request.getParameter("userId");

        boolean success = false;

        try {
            Connection conn = dbManager.connection();
            if (conn != null) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)");
		    
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
