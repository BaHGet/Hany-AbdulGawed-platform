const express = require("express");
const router = express.Router();

const Issue = require("../models/issue");

const generateCodes = () => {
    let Code = "";
    let str =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";

    for (let i = 1; i <= 5; i++) {
        var char = Math.floor(Math.random() * str.length + 1);
        Code += str.charAt(char);
    }
    return Code;
};

router.get("/", async (req, res) => {
    try {
        const issues = await Issue.find(); // find all issues
        if (!issues) { // if there are no issues
            return res.status(200).send({ message: "there are no issues" });
        } 
        return res.status(200).json(issues); // send the found issues
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const issue = await Issue.findOne({ id: req.params.id }); // find an issue
        if (!issue) { // if there are no issues
            return res.status(200).send({ message: "there are no issues" });
        } 
        return res.status(200).json(issue); // send the found issue
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    const issue = new Issue( { // create a new issue
        id: req.body.user.id?.slice(0, 8)+'-'+ generateCodes(),
        logs: req.body.logs,
        networkLogs: req.body.networkLogs,
        user: req.body.user
    })
    console.log(issue)
    try {
        const newIssue = await issue.save(); // save the new issue
        return res.status(200).json(newIssue); // send the new issue
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Issue.findOneAndRemove({ id: req.params.id }) ; // delete all issues
        return res.json({ message: "issues deleted" }); // send a message
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router