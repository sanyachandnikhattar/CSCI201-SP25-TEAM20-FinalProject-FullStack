package backend;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;

@WebServlet("/CourseEnrolledServlet")
public class CourseEnrolledServlet extends HttpServlet {

    private static final String URL =
            "jdbc:mysql://localhost/FinalProject?user=root&password=strong_pass";

    @Override
    protected void doGet(HttpServletRequest req,
                         HttpServletResponse resp) throws ServletException, IOException {

        String userParam  = req.getParameter("userID");
        String courseParam = req.getParameter("courseID");

        if (userParam == null || courseParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"error\":\"missing userID or courseID\"}");
            return;
        }

        int userID, courseID;
        try {
            userID   = Integer.parseInt(userParam);
            courseID = Integer.parseInt(courseParam);
        } catch (NumberFormatException ex) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"error\":\"invalid parameter format\"}");
            return;
        }

        boolean enrolled = false;

        String sql = "SELECT 1 FROM UserCourse WHERE user_id = ? AND courseID = ? LIMIT 1";
        try (Connection conn = DriverManager.getConnection(URL);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userID);
            ps.setInt(2, courseID);

            try (ResultSet rs = ps.executeQuery()) {
                enrolled = rs.next();        
            }

        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"error\":\"database error\"}");
            return;
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(new Gson().toJson(
                new EnrollResponse(enrolled)
        ));
    }

    private record EnrollResponse(boolean enrolled) {}
}
