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

@WebServlet("/SearchServlet")
public class SearchServlet extends HttpServlet {
    

    // GET for search
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        String query = request.getParameter("query");
        List<Course> results = new ArrayList<>();

        try (Connection conn = DBManager.getConnection()) {
            String courseSql =
                "SELECT * FROM Course WHERE courseName LIKE ?";
            try (PreparedStatement cs = conn.prepareStatement(courseSql)) {
                cs.setString(1, "%" + query + "%");
                try (ResultSet crs = cs.executeQuery()) {

                    while (crs.next()) {
                        int    courseID   = crs.getInt("courseID");
                        String courseName = crs.getString("courseName");
                        String dates      = crs.getString("courseDates");
                        String time       = crs.getString("courseTime");

                        List<Assignment> assignments = new ArrayList<>();
                        String aSql =
                            "SELECT * FROM Assignment WHERE courseID = ?";
                        try (PreparedStatement as = conn.prepareStatement(aSql)) {
                            as.setInt(1, courseID);
                            try (ResultSet ars = as.executeQuery()) {
                                while (ars.next()) {
                                    assignments.add(new Assignment(
                                        ars.getInt   ("courseID"),
                                        ars.getInt   ("assignmentID"),
                                        ars.getString("aName"),
                                        ars.getString("dueDate"),
                                        ars.getString("dueTime"),
                                        ars.getString("descr")
                                    ));
                                }
                            }
                        }

                        results.add(
                            new Course(courseID, courseName, dates, time, assignments)
                        );
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                               "Database error");
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new com.google.gson.Gson().toJson(results));
    }

}