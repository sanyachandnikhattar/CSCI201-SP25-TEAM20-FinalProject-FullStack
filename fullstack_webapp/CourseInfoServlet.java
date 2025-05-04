package backend;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/CourseInfoServlet")
public class CourseInfoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp)
            throws ServletException, IOException {

        String idParam = req.getParameter("courseID");
        if (idParam == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                           "Missing courseID");
            return;
        }

        int courseID;
        try {
            courseID = Integer.parseInt(idParam);
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                           "Invalid courseID");
            return;
        }

        CourseInfo dto;
        String sql = """
            SELECT courseID, courseName, courseDates, courseTime
            FROM   Course
            WHERE  courseID = ?
            """;

        try (Connection conn = DBManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, courseID);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND,
                                   "Course not found");
                    return;
                }
                dto = new CourseInfo(
                        rs.getInt("courseID"),
                        rs.getString("courseName"),
                        rs.getString("courseDates"),  // meetingDay
                        rs.getString("courseTime")    // meetingTime
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                           "Database error");
            return;
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(new Gson().toJson(dto));
        out.flush();
    }

    static class CourseInfo {
        int    courseID;
        String courseName;
        String meetingDay;
        String meetingTime;

        CourseInfo(int id, String name, String day, String time) {
            this.courseID     = id;
            this.courseName   = name;
            this.meetingDay   = day;
            this.meetingTime  = time;
        }
    }
}
