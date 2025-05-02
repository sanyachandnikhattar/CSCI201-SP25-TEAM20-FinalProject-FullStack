package backend;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet("/Register_Login_Servlet/*")
public class Register_Login_Servlet {

	public Register_Login_Servlet()
	{
		super();
	}

	Function UserInput() 
	{
		Const freshlyLoadedElement = document.getElementById(“isNameValid”);

		if(freshlyLoadedElem.value == “true”) 
		{
			freshlyLoadedElem.value = “false”;
			checkEmail();
			checkPassword();
		}
		
		if(document.getElementById(“isEmailValid”).value === “true” && document.getElementById(“isPasswordValid”).value === “true”) 
		{
			document.getElementById(“submit”).disabled = false;
		}
		
		
		else 
		{
		document.getElementById(“submit”).disabled = true;
		}
	}
Function CheckPassword() 
{
	Const validElement = document.getElementById(“isPasswordValid”);
	
	if(/^(\w{4,})$/.test(document.getElementById(“password”).value)) {
		document.getElementById(“passwordMsg”).innerHTML = “Password is required.”;
		validElement.value = “false;
	}
	checkInputs();

}
Function CheckEmail()
{
	Const validElement = document.getElementById(“isEmailValid”);
	
	if(/^(\w+(?:\.\w+)*@\w(?:\.\w+)+)$/.test(email)) {
		document.getElementById(“emailMsg”).innerHTML = “Email must be valid.”;
		validElement.value = “false;
	}
	checkInputs();

}

Function register() 
{
	Const email = document.getElementById(“email”).value;
	Const password = document.getElementById(“password”).value;

	Const xhttp = new XMLHttpRequest();
	xhttp.open(“POST”, ____Servlet”, true);
	xhttp.setRequestHeader(“Content-Type”, “application/x-www-form-urlencoded”);
	Xhttp.onload = function() {
		Const validElement = document.getELementById(“isEmailValid”);
		Const response = JSON.parse(this.responseText).msg;

		console.log(response, response.length);
		document.getElementById(“emailMsg”).innerHTML = response;
		validElement.value = “false”;
		checkInputs();
	};
	xhttp.send(`source=register&email=${email}&password=${password}`);
}

Function login() {
	Const email = document.getElementById(“email”).value;
	Const password = document.getElementById(“password”).value;

	Const xhttp = new XMLHttpRequest();
	xhttp.open(“POST”, ____Servlet”, true);
	xhttp.setRequestHeader(“Content-Type”, “application/x-www-form-urlencoded”);
	Xhttp.onload = function() {
		Const response = JSON.parse(this.responseText).msg;
		
		console.log(response, response.length);
		document.getElementById(“passwordMsg”).innerHTML = response;
		document.getElementById(“submit”).disabled = true;
		checkInputs();
		
		}
	}
	xhttp.send(`source=login&email=${email}&password=${password}`);
}

Protected void doGet(HTTPServletRequest request, HTTPServletResponse response) throws ServletException, IOException {
	If (conn == null) {
		System.out.println(“Connecting to database…”);
		Try {
			DriverManager.registerDriver(new com.mysql.cj.jdbc.Driver());
			if(conn != null && conn.isValid(2)) {
				System.print.outln(“Connected to the database.”);
			} else {
				System.print.outln(“Failed to connect to the database.”);
			}
			CreateUserStatement = conn.prepareStatement(“INSERT INTO USERS VALUES (?, ?, ?)”);
checkEmailStatement = conn.prepareStatement(“SELECT * FROM USERS where email = ?”);
loginStatement = conn.prepareStatement(“SELECT * FROM USERS where email = ? and password = ?”);

	} catch (SQLException e) {
		System.out.println(e.getMessage());
	}
}
	String source = request.getParameter(“source”);
	String email = request.getParameter(“name”);
	String password = request.getParameter(“password”);
	
	response.setContentType(“application/json”);
	PrintWriter writer = response.getWriter();
	If (source == null) {
		writer.println(“{\”msg\”: \ “Unrecognized source.”\”}”);
	} else if (source.equals(“register”)) {
		Try {
			createUserStatement.setString(1, email);
			createUserStatement.setString(2 password);
			createUserStatement.setString(3, “”);
			Int result = createUserStatement.executeUpdate();

			System.out.println(email + “does not exists.”);
System.out.println(String.format(“%d user was added to database.”, result));
} catch (SQLException e) {
	writer.print(“{\”msg\”: \ “User with this email already exists.\”}”);
	System.out.println(email + “	already exists.”);
} else if (source.equals(“login”)) {
		Try {
			loginStatement.setString(1, email);
			loginStatement.setString(2 password);
			
			ResultSet rs = loginStatement.executeQuery();
			if (!rs.next()) {
				writer.print(“{\”msg\”: \ “Password or email is incorrect.\”}”);

			}
} catch (SQLException e) {
	e.printStackTrace();
} else {
	writer.print(“{\”msg\”: \ “Unrecognized Source.\”}”);

}


}
