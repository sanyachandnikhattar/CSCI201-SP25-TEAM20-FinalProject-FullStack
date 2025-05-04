package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        String userIdParam = request.getParameter("user_id");

        if (userIdParam == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing user_id parameter");
            return;
        }

        int userId = Integer.parseInt(userIdParam);

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try (Connection conn = DBManager.getConnection()) {

            String courseQuery = "SELECT c.courseID, c.courseName, c.courseDates, c.courseTime FROM Course c " +
                                 "JOIN UserCourse uc ON c.courseID = uc.courseID " +
                                 "WHERE uc.user_id = ?";
            PreparedStatement ps = conn.prepareStatement(courseQuery);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int courseId = rs.getInt("courseID");
                String courseName = rs.getString("courseName");
                String meetingDay = rs.getString("courseDates");
                String meetingTime = rs.getString("courseTime");

                List<Assignment> assignments = new ArrayList<>();
                String assignmentQuery = "SELECT * FROM Assignment WHERE courseID = ?";
                PreparedStatement aps = conn.prepareStatement(assignmentQuery);
                aps.setInt(1, courseId);
                ResultSet ars = aps.executeQuery();

                while (ars.next()) {
                    int assignmentID = ars.getInt("assignmentID");
                    String assignmentName = ars.getString("aName");
                    String description = ars.getString("descr");
                    String dueDate = ars.getString("dueDate");
                    String dueTime = ars.getString("dueTime");

                    assignments.add(new Assignment(courseId, assignmentID, assignmentName, dueDate, dueTime, description));
                }

                courses.add(new Course(courseId, courseName, meetingDay, meetingTime, assignments));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        response.getWriter().write(gson.toJson(courses));
    }
    
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        if (action == null || !action.equalsIgnoreCase("create")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Unsupported or missing action");
            return;
        }

        request.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();

        CoursePayload payload;
        if ("application/json".equalsIgnoreCase(request.getContentType())) {
            payload = gson.fromJson(request.getReader(), CoursePayload.class);
        } else {
            payload = new CoursePayload();
            payload.courseName  = request.getParameter("courseName");
            payload.meetingDay  = request.getParameter("meetingDay");
            payload.meetingTime = request.getParameter("meetingTime");
        }

        if (payload.courseName  == null || payload.courseName.isBlank() ||
            payload.meetingDay  == null || payload.meetingDay.isBlank() ||
            payload.meetingTime == null || payload.meetingTime.isBlank()) {

            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Missing required fields");
            return;
        }

        int generatedID;

        try { Class.forName("com.mysql.cj.jdbc.Driver"); }
        catch (ClassNotFoundException e) { throw new ServletException(e); }

        String sql = "INSERT INTO Course (courseName, courseDates, courseTime) "
                   + "VALUES (?, ?, ?)";

        try (Connection conn = DBManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                    sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, payload.courseName);
            ps.setString(2, payload.meetingDay);
            ps.setString(3, payload.meetingTime);


            if (ps.executeUpdate() == 0)
                throw new SQLException("Creating course failed, no rows affected.");

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (!keys.next())
                    throw new SQLException("Creating course failed, no ID obtained.");

                generatedID = keys.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Database error");
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String,Object> res = new HashMap<>();
        res.put("status", "created");
        res.put("courseID", generatedID);

        response.getWriter().write(gson.toJson(res));
    }

    /* helper for deserialising incoming JSON */
    private static class CoursePayload {
        String courseName;
        String meetingDay;
        String meetingTime;
    }

    
}

    
   
    
