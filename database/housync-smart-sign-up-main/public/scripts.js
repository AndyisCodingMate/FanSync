document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    const fileInput = document.getElementById('file-upload'); // File input field for ID/selfie
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        document.getElementById('message').textContent = 'Please upload a file.';
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Step 1: Upload the file to Eden AI
    try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.executionId) {
            throw new Error(uploadResult.message || 'Error uploading file');
        }

        const executionId = uploadResult.executionId;

        // Step 2: Poll for results from Eden AI
        let status = 'processing';
        let verificationResult;

        while (status === 'processing') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

            const statusResponse = await fetch(`http://localhost:3000/status/${executionId}`);
            verificationResult = await statusResponse.json();
            status = verificationResult.status; // Check status from response
        }

        if (status === 'succeeded') {
            console.log("Verification succeeded:", verificationResult.results);

            // Step 3: Register the user after successful verification
            const userFormData = {
                firstName,
                lastName,
                email,
                password,
                userType,
                verified: true, // Mark user as verified after successful ID check
            };

            const registerResponse = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userFormData),
            });

            const registerResult = await registerResponse.json();

            if (registerResponse.status === 201) {
                document.getElementById('message').textContent = 'User registered successfully!';
                document.getElementById('message').style.color = 'green';
            } else {
                throw new Error(registerResult.message || 'Error signing up');
            }
        } else {
            throw new Error("Verification failed");
        }
    } catch (error) {
        console.error(error);
        document.getElementById('message').textContent =
            error.message || 'Error during verification or registration.';
        document.getElementById('message').style.color = 'red';
    }
});