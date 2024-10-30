package fanSync;

public class Main {
	public static void main(String[] args) {
		RegisterDao dao = new RegisterDao();
		Member test = dao.Login("jimiscool@gmail.com", "jimiscool@gmail.com");
		System.out.print(test.getName());	
	}
}
