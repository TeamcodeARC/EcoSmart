import fetch from 'node-fetch';

const ML_API_URL = 'http://localhost:5001';

export async function getPredictions(damData) {
    try {
        // Validate input data before making request
        if (!damData) {
            throw new Error('No dam data provided');
        }

        if (!damData.readings || !Array.isArray(damData.readings)) {
            throw new Error('Historical readings data is missing or invalid');
        }

        if (typeof damData.currentLevel !== 'number') {
            throw new Error('Current water level is missing or invalid');
        }

        const response = await fetch(`${ML_API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                historicalData: damData.readings || [],
                currentLevel: damData.currentLevel,
                flowRate: damData.flowRate,
                precipitation: damData.precipitation,
                safetyThreshold: damData.safetyThreshold,
                criticalLevel: damData.criticalLevel
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        if (!data.predictions || !Array.isArray(data.predictions)) {
            throw new Error('Invalid prediction data received from ML service');
        }

        if (!data.recommendations) {
            throw new Error('Missing recommendations in ML service response');
        }

        return data;
    } catch (error) {
        console.error('AI Service Error:', error);
        // Add more context to the error
        const enhancedError = new Error(`Failed to get predictions: ${error.message}`);
        enhancedError.originalError = error;
        enhancedError.status = error.status || 500;
        throw enhancedError;
    }
}

export async function checkModelHealth() {
    try {
        const response = await fetch(`${ML_API_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout for the request
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            console.error(`Model health check failed with status: ${response.status}`);
            return { 
                status: 'error', 
                error: `Model API returned status ${response.status}`,
                serviceAvailable: false
            };
        }

        const data = await response.json();
        return {
            ...data,
            serviceAvailable: true
        };
    } catch (error) {
        console.error('Health Check Error:', error);
        return { 
            status: 'error', 
            error: error.message,
            serviceAvailable: false 
        };
    }
}