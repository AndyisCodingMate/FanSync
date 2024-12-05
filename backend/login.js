// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:8081/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Login successful!';
                messageDiv.style.color = 'green';

                // Store user info and redirect
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/tickets.html';
            } else {
                messageDiv.textContent = data.error || 'Invalid email or password.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during login:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.style.color = 'red';
        }
    });
});