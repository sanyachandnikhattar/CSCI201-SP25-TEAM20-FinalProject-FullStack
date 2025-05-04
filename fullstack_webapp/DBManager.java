package backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBManager {

        private static final String USER     = "root";
    private static final String PASSWORD = "strong_pass";  
    private static final String URL      = "jdbc:mysql://localhost/FinalProject" + "?user=" + USER +"&password=" + PASSWORD;
                                         

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        }
    }

    public static Connection getConnection() {
//        return DriverManager.getConnection(URL);
    	try {
        	return DriverManager.getConnection(URL);
    	}
    	catch(SQLException sqle) {
    		return null;
    	}
		

    }
}
