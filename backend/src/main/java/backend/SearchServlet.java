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
                 String sql = "SELECT * FROM Course WHERE CourseName LIKE ?";
	         PreparedStatement stmt = conn.prepareStatement(sql);
	         stmt.setString(1, "%" + query + "%");
                 ResultSet rs = stmt.executeQuery();

                while (rs.next()) {
                    String courseName = rs.getString("name");
                    int courseId = rs.getInt("id");
                    results.add(new Course(courseName, courseId));
                }
		 stmt.close();
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
}
