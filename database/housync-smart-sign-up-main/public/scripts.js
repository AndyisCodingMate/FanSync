document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form reload

    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0]; // Get the selected file (if any)

    let verified = false; // Default to unverified
    let govIdNumber = null; // Default to null
    let uploadedImagePath = null; // Default to null

    try {
        if (file) {
            // Step 1: Upload file to backend and Eden AI
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
            uploadedImagePath = uploadResult.uploadedImage; // Save uploaded image path

            // Step 2: Poll Eden AI for results
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

                if (verificationResult.results && verificationResult.results.recognized) {
                    verified = true; // Mark as verified only if ID is recognized
                    govIdNumber = verificationResult.results.gov_id_number; // Extract parsed government ID number
                } else {
                    console.warn("Unrecognized ID:", verificationResult.results);
                    document.getElementById('message').textContent =
                        'ID not recognized. You will be added as unverified.';
                    document.getElementById('message').style.color = 'orange';
                }
            } else {
                console.error("Verification failed:", verificationResult);
                document.getElementById('message').textContent =
                    'Verification failed. You will be added as unverified.';
                document.getElementById('message').style.color = 'red';
            }
        }

        // Step 3: Register user with additional fields
        const userFormData = {
            firstName,
            lastName,
            email,
            password,
            userType,
            verified,
            govIdNumber,
            uploadedImage: uploadedImagePath, // Include uploaded image path (if any)
        };

        const registerResponse = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userFormData),
        });

        const registerResult = await registerResponse.json();

        if (registerResponse.status === 201) {
            document.getElementById('message').textContent =
                verified ? 'User registered and verified successfully!' : 'User registered but not verified.';
            document.getElementById('message').style.color = verified ? 'green' : 'orange';
        } else {
            throw new Error(registerResult.message || 'Error signing up');
        }
    } catch (error) {
        console.error(error);
        document.getElementById('message').textContent =
            error.message || 'Error during verification or registration.';
        document.getElementById('message').style.color = 'red';
    }
});
