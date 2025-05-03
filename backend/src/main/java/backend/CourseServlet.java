package backend;

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


@WebServlet("/CourseServlet")
public class CourseServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Course> courses = new ArrayList<>();
       
    	try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/FinalProject?user=root&password=strong_pass")) {

            String courseQuery = "SELECT * FROM Course";
            PreparedStatement ps = conn.prepareStatement(courseQuery);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int courseId = rs.getInt("courseID");
                String courseName = rs.getString("courseName");
                String meetingDay = rs.getString("meetingDay");
                String meetingTime = rs.getString("meetingTime");

                List<Assignment> assignments = new ArrayList<>();
                String assignmentQuery = "SELECT * FROM Assignment WHERE courseID = ?";
                PreparedStatement aps = conn.prepareStatement(assignmentQuery);
                aps.setInt(1, courseId);
                ResultSet ars = aps.executeQuery();

                while (ars.next()) {
                	int courseID = ars.getInt("courseID");
                	int assignmentID = ars.getInt("assignmentID");
                    String assignmentName = ars.getString("assignmentName");
                    String description = ars.getString("description");
                    String dueDate = ars.getString("dueDate");
                    String dueTime = ars.getString("dueTime");
                    

                    assignments.add(new Assignment(courseID, assignmentID, assignmentName, dueDate, dueTime,description));
                }

                courses.add(new Course(courseId, courseName, meetingDay, meetingTime, assignments));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        Gson gson = new Gson();
        String json = gson.toJson(courses);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}

    
   
    
