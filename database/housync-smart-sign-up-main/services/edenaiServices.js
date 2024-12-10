const fetch = require('node-fetch');
const FormData = require('form-data');

const EDENAI_API_KEY = process.env.EDENAI_API_KEY; // Load from .env

exports.uploadFile = async (fileBuffer, filename) => {
    const url = "https://api.edenai.run/v2/workflow/15599fc1-9bdd-41dc-a17f-e68f4f6eb439/execution/";
    const formData = new FormData();
    formData.append('file', fileBuffer, filename);

    const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${EDENAI_API_KEY}` },
        body: formData,
    });

    const result = await response.json();
    if (!result.id) throw new Error(result.message || 'Error uploading file.');
    return result.id; // Return execution ID
};

exports.checkStatus = async (executionId) => {
    const url = `https://api.edenai.run/v2/workflow/15599fc1-9bdd-41dc-a17f-e68f4f6eb439/execution/${executionId}/`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${EDENAI_API_KEY}` },
    });

    return response.json();
};