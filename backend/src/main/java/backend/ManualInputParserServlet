package backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/ManualInputParserServlet")
public class ManualInputParserServlet extends HttpServlet {

    private DBManager dbManager;

    @Override
    public void init() throws ServletException {
        dbManager = new DBManager();
    }

    // POST to manually add a course
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        String email = request.getParameter("email"); // currently unused
        String courseName = request.getParameter("courseName");
        String courseDates = request.getParameter("courseDates");
        String courseTime = request.getParameter("courseTime");

        int courseId = -1;
        boolean success = false;

        try {
            courseId = Integer.parseInt(request.getParameter("courseId"));

            Connection conn = dbManager.connection();
            if (conn != null) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO Course (courseID, courseName, courseDates, courseTime) VALUES (?, ?, ?, ?)");

                stmt.setInt(1, courseId);
                stmt.setString(2, courseName);
                stmt.setString(3, courseDates);
                stmt.setString(4, courseTime);

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
            out.println("Successfully added course.");
        } else {
            out.println("Failed to add course.");
        }
    }
}
