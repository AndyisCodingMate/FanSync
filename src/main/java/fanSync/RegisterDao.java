package fanSync;
import java.sql.Connection;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RegisterDao {
	private String dburl="jdbc:mysql://localhost:3306/libtrack";
	private String dbuname="root";
	private String dbpassword="Apes2getherstrong!";
	private String dbdriver="com.mysql.cj.jdbc.Driver";
	
	public void loadDriver(String dbdriver) {
		try {
			Class.forName(dbdriver);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	public Connection getConnection() {
		Connection con = null;
		try {
			con = DriverManager.getConnection(dburl, dbuname, dbpassword);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return con;
		
	}
	
	public String insert(Member member) {
		loadDriver(dbdriver);
		Connection con = getConnection();
		String result = "data entered successfully";
		String sql = "insert into FanSync.members (Name, Email, Password) VALUES(?, ?, ?)";
		try {
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, member.getName());
			ps.setString(2, member.getEmail());
			ps.setString(3, member.getPassword());
			ps.executeUpdate();
		} catch (SQLException e) {
			result = "Data not entered";
			e.printStackTrace();
		}
		return result;
	}
	
	public Member Login(String email, String password) {
		loadDriver(dbdriver);
		Connection con = getConnection();
		Member member  = null;
		String query = "SELECT MemberID, Name, Email, Password FROM FanSync.members WHERE Email = ? AND Password = ? ";
		try {
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, email);
			ps.setString(2, password);
			ResultSet rs = ps.executeQuery();
			
			if(rs.next()) {
				int id = rs.getInt("MemberID");
				String name = rs.getString("Name");
				String email1 = rs.getString("Email");
				String pass = rs.getString("Password");
				
				member = new Member(name, email1, pass);
				member.setID(id);
			};
		} 
		catch (SQLException e) {
			e.printStackTrace();
		}
		return member;
	}
}
