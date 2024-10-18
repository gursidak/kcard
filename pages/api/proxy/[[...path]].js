// pages/api/proxy/[[...path]].js

export default async function handler(req, res) {
    const { path = [] } = req.query; // Extract the path from the URL

    // Construct the full target URL based on the path
    const apiUrl = `https://api.ludhianacard.com/v1/${path.join('/')}`;

    // Handle request options (headers, body, etc.)
    const options = {
        method: req.method,
        headers: {
            'Content-Type': req.headers['content-type'] || 'application/json', // Default content type to JSON
            ...(req?.headers || {})
            // You can forward more headers if needed, but don't set Content-Length manually
        },
    };

    // Only include the body for non-GET methods like POST, PUT, etc.
    if (req.method !== 'GET') {
        const body = JSON.stringify(req.body); // Ensure the body is a JSON string
        options.body = body;
        options.headers['Content-Length'] = Buffer.byteLength(body); // Set the correct Content-Length
    }

    try {
        // Forward the request to the target API
        const response = await fetch(apiUrl, options);

        const data = await response.json();

        // Return the response to the client
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while proxying the request' });
    }
}
