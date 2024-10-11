
// Array to store network calls
export const networkLogs = [];

// Save the original fetch function
const originalFetch = window.fetch;

window.fetch = async function (...args) {
    const [resource, config] = args;
    const startTime = performance.now(); // Capture the start time

    try {
        // Make the fetch call
        const response = await originalFetch.apply(this, args);

        // Clone the response so it can be read more than once
        const clonedResponse = response.clone();
        const responseData = await clonedResponse.json();
        const endTime = performance.now(); // Capture the end time

        // Log the details of the network call, excluding the hot reload call 
        if(!resource.includes('/main')){
            networkLogs.push({
                url: resource,
                method: config?.method || "GET",
                requestData: config,
                responseData,
                status: response.status,
                duration: (endTime - startTime).toFixed(2) + " ms", // Calculate duration
            });
        }

        // Keep only the last 100 network calls (or any number you prefer)
        if (networkLogs.length > 20) {
        networkLogs.shift();
        }

        return response;
    } catch (error) {
        const endTime = performance.now(); // Capture the end time in case of an error
        networkLogs.push({
            url: resource,
            method: config?.method || "GET",
            error: error.message,
            duration: (endTime - startTime).toFixed(2) + " ms", // Calculate duration
        });
        throw error;
    }
};

export default networkLogs;