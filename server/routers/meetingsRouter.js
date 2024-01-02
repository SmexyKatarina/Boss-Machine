const express = require('express');
const meetingsRouter = express.Router();
const db = require('../db.js');

const getAllMeetings = (req, res, next) => {
    res.send(db.getAllFromDatabase('meetings'));
}

const createMeeting = (req, res, next) => {
    const newMeeting = db.addToDatabase('meetings', db.createMeeting());
    res.status(201).send(newMeeting);
}

const deleteMeetings = (req, res, next) => {
    db.deleteAllFromDatabase('meetings');
    res.status(204).send();
}

meetingsRouter.get('/', getAllMeetings);
meetingsRouter.post('/', createMeeting);
meetingsRouter.delete('/', deleteMeetings);

module.exports = meetingsRouter;