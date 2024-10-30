<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<div class = "flex justify-center items-center h-screen bg-indigo-600">
	<form action="Login" method="post">
	<div class = "w-96 h-96 p-6 shadow-lg bg-white rounded-md">
		<h1 class ="text-3xl block text-center font-semibold">Login</h1>
		<hr class = "mt-3">
		<div class = "mt-3"> 
			<label for= "email" class ="block text-base mb-2">Email: </label>
			<input type="text" class = "border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" 
			placeholder = "Enter an Email"name="email">			
		</div>
		<div class = "mt-3"> 
			<label for= "password" class ="block text-base mb-2">Password: </label>
			<input type="password" class = "border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" 
			placeholder = "Enter a Password"name="password">
		</div>
		<div class = "mt-5">
			<button class="border-2 border-indigo-700 bg-indigo-700 text-white py-1 my-1 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold" 
			type="submit" value="register">Register</button>		
		</div>	
	</div>
	</form>
</div>
</body>
</html>