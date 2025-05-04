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


@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet 
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
                
                createUserStatement = conn.prepareStatement("INSERT INTO USERS VALUES (?, ?, ?, ?)");
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
        LoginData loginData = gson.fromJson(request.getReader(), LoginData.class);
        

        String email    = loginData.getEmail();
        String password = loginData.getPassword();
        
        // Set response type and get writer
        response.setContentType("application/json");
        PrintWriter writer = response.getWriter();
        


        try {
        	loginStatement.setString(1, email);

            loginStatement.setString(2, password);
     
            ResultSet result = loginStatement.executeQuery();
            boolean success = result.next();

            int status_code = success ? 1 : 0;
            String user_id = success ? Integer.toString(result.getInt("user_id")) : "";

            String json = String.format("{\"login_status\": %d, \"user_id\": \"%s\"}", status_code, user_id);
            writer.print(json);


    	   

        } catch (SQLException e) {
        	System.out.print(e);

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