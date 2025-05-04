package backend;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;


@WebServlet("/ManualInputServlet")
public class ManualInputServlet extends HttpServlet {


    private final Gson gson = new Gson();


    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        Payload body;
        try { body = gson.fromJson(request.getReader(), Payload.class); }
        catch (Exception e) {
            response.sendError(400, "Malformed JSON");
            return;
        }

        if (!body.isValid()) {
            response.sendError(400, "Missing required fields");
            return;
        }

        int assignmentID;

        try { Class.forName("com.mysql.cj.jdbc.Driver"); }
        catch (ClassNotFoundException e) { throw new ServletException(e); }

        try (Connection conn = DBManager.getConnection()) {

            conn.setAutoCommit(false);

            int courseID;
            try (PreparedStatement find =
                         conn.prepareStatement(
                             "SELECT courseID FROM Course WHERE courseName = ?")) {
                find.setString(1, body.courseName);
                try (ResultSet rs = find.executeQuery()) {
                    if (!rs.next()) {
                        conn.rollback();
                        response.sendError(404, "Course not found");
                        return;
                    }
                    courseID = rs.getInt(1);
                }
            }

          
            String sql = """
                         INSERT INTO Assignment
                         (courseID, aName, descr, dueDate, dueTime)
                         VALUES (?,?,?,?,?)
                         """;

            try (PreparedStatement ins =
                         conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

                ins.setInt   (1, courseID);
                ins.setString(2, body.assignmentName);
                ins.setString(3, body.description == null ? "" : body.description);
                ins.setString(4, body.dueDate);
                ins.setString(5, body.dueTime);

                if (ins.executeUpdate() == 0)
                    throw new SQLException("Insert failed");

                try (ResultSet keys = ins.getGeneratedKeys()) {
                    if (!keys.next()) throw new SQLException("No key returned");
                    assignmentID = keys.getInt(1);
                }
            }

            conn.commit();

        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(500, "Database error");
            return;
        }

       
        response.setStatus(HttpServletResponse.SC_CREATED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String,Object> out = new HashMap<>();
        out.put("status", "created");
        out.put("assignmentID", assignmentID);

        response.getWriter().write(gson.toJson(out));
    }


    private static class Payload {
        String courseName;
        String assignmentName;
        String dueDate;
        String dueTime;
        String description;   

        boolean isValid() {
            return courseName     != null && !courseName.isBlank() &&
                   assignmentName  != null && !assignmentName.isBlank() &&
                   dueDate         != null && !dueDate.isBlank() &&
                   dueTime         != null && !dueTime.isBlank();
        }
    }
}
