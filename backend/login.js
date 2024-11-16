// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('http://localhost:8081/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (response.ok) {
                messageDiv.textContent = 'Login successful!';
                messageDiv.style.color = 'green';
                // Store user data if needed
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect after successful login (adjust the path as needed)
                setTimeout(() => {
                    window.location.href = '/main.html';
                }, 1500);
            } else {
                messageDiv.textContent = data.error || 'Login failed';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred during login';
            messageDiv.style.color = 'red';
        }
    });
});