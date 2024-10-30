package fanSync;

public class Member {
	private String name,email,password;
	private int id;

	public Member() {
		super();
	}
	
	public Member(String name, String email, String password) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public int getID() {
		return id;
	}
	
	public void setID(int id) {
		this.id = id;
	}
	


}