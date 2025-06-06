package backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.sql.Statement;

public class DBManager {
	Connection conn; 
	Statement st;
	ResultSet rs; 
	
	//establish a connection to the database 
	public Connection connection() throws SQLException, ClassNotFoundException 
	{
		conn = null; 
		Class.forName("com.mysql.cj.jdbc.Driver");
		try {
			//replace empty String with correct address for our database 
			conn = DriverManager.getConnection("jdbc:mysql://localhost/FinalProject?user=root&password=strong_pass"); 
			return conn;
		}
		catch(SQLException sqle) {
			System.out.println("Connection error: " + sqle.getMessage());
			return null;
		}
	}
	
	//execute a query on the database 
	public ResultSet executeQuery(String query) {
		st = null;
		rs = null; 

		try {
			st = conn.createStatement(); 
			rs = st.executeQuery(query); 
		}
		catch(SQLException sqle) {
			System.out.println("Query execution error: " + sqle.getMessage()); 
		}
		
		return rs; 
	}
	
	public void disconnection() {
		try {
			if(rs != null) {
				rs.close();
			}
			if(st != null) {
				st.close(); 
			}
			if(conn != null) {
				conn.close(); 
			}
		}
		catch(SQLException sqle) {
			System.out.println("Issue with disconnecting: " + sqle.getMessage()); 
		}
	}
}
