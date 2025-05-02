package backend;
import java.util.List;
import java.sql.*;
import java.util.ArrayList;

public class Scheduler
{
    private DBManager dbManager;
    private List<Course> courses;

    public Scheduler() 
    {
        this.dbManager = new DBManager();
        courses = new ArrayList<>();
    }
    
    public Scheduler(DBManager dbManager) 
    {
        this.dbManager = dbManager;
        courses = new ArrayList<>();
    }
   
    public List<Course> searchCourse(String query) 
    {
        List<Course> results = new ArrayList<>();
        try {
            dbManager.connection();
            String stmt = "SELECT * FROM courses WHERE name LIKE '%" + query + "%'";
            ResultSet rs = dbManager.executeQuery(stmt);
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

    public boolean joinCourse(int courseId, String userId) 
    {
        boolean success = false;
        try 
        {
            Connection conn = dbManager.connection();
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)"
            );
            stmt.setString(1, userId);
            stmt.setInt(2, courseId);

            success = stmt.executeUpdate() > 0;
            
            dbManager.disconnection();
        } 
        
        catch (SQLException e) 
        {
            e.printStackTrace();
        }
        
        return success;
    }
}


