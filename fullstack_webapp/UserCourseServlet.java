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


@WebServlet("/UserCourseServlet")
public class UserCourseServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        String action   = req.getParameter("action");   // join / leave
        int userID      = Integer.parseInt(req.getParameter("userID"));
        int courseID    = Integer.parseInt(req.getParameter("courseID"));

        String sql = action.equals("join")
            ? "INSERT IGNORE INTO UserCourse(user_id, courseID) VALUES (?,?)"
            : "DELETE FROM UserCourse WHERE user_id=? AND courseID=?";

        try (Connection c = DBManager.getConnection();
        		PreparedStatement ps = c.prepareStatement(sql)){ 
            ps.setInt(1, userID);
            ps.setInt(2, courseID);
            ps.executeUpdate();
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            resp.sendError(500, e.getMessage());
        }
    }
}
