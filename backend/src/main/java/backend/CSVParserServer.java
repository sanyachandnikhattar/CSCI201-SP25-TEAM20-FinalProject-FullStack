package backend;

import java.io.*;
import java.sql.*;
import java.util.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/CSVParserServer")
public class CSVParser extends HttpServlet {
    private DBManager dbManager;

    @Override
    public void init() throws ServletException {
        dbManager = new DBManager();
    }

    // POST to upload and parse CSV
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        
        try (
            BufferedReader reader = new BufferedReader(new InputStreamReader(filePart.getInputStream()));
            Connection conn = dbManager.connection()
        ) {
            if (conn == null) {
                out.println("Database connection failed.");
                return;
            }

            String line;
            String[] fields = line.split(",");
            if (fields.length < 5) continue; // skip bad lines
           
            int successCount = 0;  // Initialize successCount

            String userEmail = fields[0].trim();
            int courseId = Integer.parseInt(fields[1].trim());
            String courseName = fields[2].trim();
            String courseDates = fields[3].trim();
            String courseTime = fields[4].trim();

            // Insert into Course
            PreparedStatement stmt = conn.prepareStatement(
                      "INSERT IGNORE INTO Course" +
                      " (userEmail, CourseID, CourseName, CourseDates, CourseTime) " +
                      "VALUES (?, ?, ?, ?, ?)"
                );
                stmt.setString(1, userEmail);
                stmt.setInt(2, courseId);
                stmt.setString(3, courseName);
                stmt.setString(4, courseDates);
                stmt.setString(5, courseTime);

                if (stmt.executeUpdate() > 0) successCount++;

                stmt.close();
            }

            dbManager.disconnection();
            out.println("CSV upload complete. Courses added: " + successCount);

        } catch (Exception e) {
            e.printStackTrace();
            out.println("Error processing CSV: " + e.getMessage());
        }
    }
}
