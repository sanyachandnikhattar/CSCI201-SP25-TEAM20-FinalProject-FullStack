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
import com.google.gson.Gson;


@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet 
{
    
    private Connection conn = null;
    private PreparedStatement createUserStatement = null;
    private PreparedStatement checkEmailStatement = null;
    private PreparedStatement loginStatement = null;
    

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Initialize database connection if needed
        if (conn == null) {
            System.out.println("Connecting to database...");
            try 
            {
            	Class.forName("com.mysql.cj.jdbc.Driver");
                conn = DBManager.getConnection();
                
                if(conn != null && conn.isValid(2)) {
                    System.out.println("Connected to the database.");
                } else {
                    System.out.println("Failed to connect to the database.");
                }
                
                createUserStatement = conn.prepareStatement("INSERT INTO USERS(email, full_name, university, password) VALUES (?, ?, ?, ?)");
                checkEmailStatement = conn.prepareStatement("SELECT * FROM USERS WHERE email = ?");
                loginStatement = conn.prepareStatement("SELECT * FROM USERS WHERE email = ? AND password = ?");
                
            } 
            
            catch (SQLException | ClassNotFoundException e) 
            {
                System.out.println(e.getMessage());
            }
        }
        
        // Get parameters from request
        Gson gson = new Gson();
        RegisterData registerData = gson.fromJson(request.getReader(), RegisterData.class);
        
        String fullname = registerData.getUsername();
        String email    = registerData.getEmail();
        String password = registerData.getPassword();
        String university = registerData.getUniversity();
        
        // Set response type and get writer
        response.setContentType("application/json");
        PrintWriter writer = response.getWriter();
        
        try {
        	createUserStatement.setString(1, email);
        	createUserStatement.setString(2, fullname);
            createUserStatement.setString(3, university);
            createUserStatement.setString(4, password);
     
            int result = createUserStatement.executeUpdate();
            int userId = 0;

            if (result > 0) {
                checkEmailStatement.setString(1, email);
                ResultSet rs = checkEmailStatement.executeQuery();
                if (rs.next()) {
                    userId = rs.getInt("user_id");
                }
            }

            writer.print("{\"register_status\": " + result + ", \"user_id\": " + userId + "}");

        } catch (SQLException e) {
        	System.out.print(e);
        	writer.print("{\"register_status\":  0 }");
        }
   
    }
    
    
    @Override
    public void destroy() {
        // Close database connections when servlet is destroyed
        try {
            if (createUserStatement != null) createUserStatement.close();
            if (checkEmailStatement != null) checkEmailStatement.close();
            if (loginStatement != null) loginStatement.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        super.destroy();
    }
}