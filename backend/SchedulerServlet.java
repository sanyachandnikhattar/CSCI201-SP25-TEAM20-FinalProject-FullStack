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

@WebServlet ("/SchedulerServlet")
public class SchedulerServlet extends HttpServlet 
{
    private List<Course> courses;
    private DBManager dbManager;
    public SchedulerServlet() {
        this.dbManager = new DBManager();
        courses = new ArrayList<>();
    }
    
    public SchedulerServlet(DBManager dbManager) 
    {
        this.dbManager = dbManager;
        courses = new ArrayList<>();
    }
   
    public List<Course> searchCourse(String query) {
        List<Course> results = new ArrayList<>();
        try {
            dbManager.connection();
            String sql = "SELECT * FROM courses WHERE name LIKE '%" + query + "%'";
            ResultSet rs = dbManager.executeQuery(sql);
            while (rs.next()) {
                String courseName = rs.getString("name");
                int courseId = rs.getInt("id");
                results.add(new Course(courseId, courseName, "", "", dbManager));
            }
            dbManager.disconnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return results;
    }

    public boolean joinCourse(int courseId, String userId) {
        boolean success = false;
        try {
            Connection conn = dbManager.connection();
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)"
            );
            stmt.setString(1, userId);
            stmt.setInt(2, courseId);

            success = stmt.executeUpdate() > 0;
            
            dbManager.disconnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return success;
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
        //redirect GET requests to POST method
        doPost(request, response);
        System.out.println("function doGet called");
    }
    
    
    
}
