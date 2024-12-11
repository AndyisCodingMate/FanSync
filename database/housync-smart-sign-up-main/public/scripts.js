document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const userType = document.getElementById('user-type').value;
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
    const mainRep = document.getElementById('main-rep').value === 'true'; // Convert to boolean

    let verified = false; // Default to unverified
    let govIdNumber = null; // Default to null
    let uploadedImagePath = null; // Default to null

    try {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('http://localhost:3000/upload', { method: 'POST', body: formData });
            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status ${uploadResponse.status}`);
            }

            const uploadResult = await uploadResponse.json();
            uploadedImagePath = uploadResult.uploadedImage;

            let status = 'processing';
            while (status === 'processing') {
                await new Promise(resolve => setTimeout(resolve, 5000));

                const statusResponse = await fetch(`http://localhost:3000/status/${uploadResult.executionId}`);
                if (!statusResponse.ok) {
                    throw new Error(`Status check failed with status ${statusResponse.status}`);
                }

                const verificationResult = await statusResponse.json();
                status = verificationResult.status;

                if (status === 'succeeded' && verificationResult.results.recognized) {
                    verified = true;
                    govIdNumber = verificationResult.results.gov_id_number;
                }
            }
        }

        const userFormData = { 
            firstName, 
            lastName, 
            email, 
            password, 
            userType, 
            verified, 
            govIdNumber, 
            uploadedImage: uploadedImagePath,
            mainRep // Include main representative field
        };

        const registerResponse = await fetch('http://localhost:3000/signup', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(userFormData) 
        });

        if (!registerResponse.ok) {
            throw new Error(await registerResponse.text());
        }

        document.getElementById('message').textContent =
            verified ? 'User registered and verified successfully!' : 'User registered but not verified.';
        document.getElementById('message').style.color = verified ? 'green' : 'orange';
    } catch (error) {
        console.error('Error during signup process:', error);

        document.getElementById('message').textContent =
            error.message || 'Error during verification or registration.';
        document.getElementById('message').style.color = 'red';
    }
});
