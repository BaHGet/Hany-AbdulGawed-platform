const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    Recordedname: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const issueSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    logs: {
        type: Array,
        required: true,
    },
    networkLogs: {
        type: Array,
        required: true,
    },
    user: {
        type: userSchema,
        required: true,
    },
});

module.exports = mongoose.model("Issues", issueSchema);