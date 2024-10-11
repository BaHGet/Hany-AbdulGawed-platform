// Create an array to store logs
const logs = [];

// Override the console.log method
const originalConsoleLog = console.log;

// Create a new console.log method that adds the log to the logs array
console.log = function (...args) {
    // Add the log to the logs array
    args.map((arg) => {
        if (typeof arg === "object") {
            logs.push(JSON.stringify(arg));
        } else {
            logs.push(arg);
        }
    })
    logs.push(args.join(" "));

    // Keep only the last 100 logs (or any number you prefer)
    if (logs.length > 40) {
        logs.shift();
    }

    // Call the original console.log method
    originalConsoleLog.apply(console, args);
};

export default logs;