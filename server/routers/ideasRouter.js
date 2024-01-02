const express = require('express');
const ideasRouter = express.Router();
const db = require('../db.js');
const checkMillionDollarIdea = require('../checkMillionDollarIdea.js');

const isValidIdea = (obj) => {
    const { name, description, weeklyRevenue, numWeeks } = obj;
    const checks = [(typeof name === 'string'), (typeof description === 'string'), (typeof weeklyRevenue === 'number' && isFinite(weeklyRevenue)), (typeof numWeeks === 'number' && isFinite(numWeeks))];
    return checks.every(x => x);
}

const isValidIdeaId = (req, res, next, id) => {
    const exists = db.getFromDatabaseById('ideas', id);
    if (exists) {
        req.idea = exists;
        req.id = id;
        next();
    } else {
        res.status(404).send('Idea not found');
    }
}

const getAllIdeas = (req, res, next) => {
    res.send(db.getAllFromDatabase('ideas'));
}

const createIdea = (req, res, next) => {
    if (isValidIdea(req.body)) {
        const newIdea = db.addToDatabase('ideas', req.body);
        res.status(201).send(newIdea);
    } else {
        res.status(404).send('Invalid idea object.');
    }
}

const getIdeaById = (req, res, next) => {
    res.status(200).send(req.idea);
}

const deleteIdeaById = (req, res, next) => {
    db.deleteFromDatabasebyId('ideas', req.id);
    res.status(204).send();
}

const updateIdea = (req, res, next) => {
    if (isValidIdea(req.body)) {
        const updatedIdea = db.updateInstanceInDatabase('ideas', req.body);
        res.status(200).send(updatedIdea);
    } else {
        res.status(404).send('Invalid idea object')
    }
}

ideasRouter.param('ideaId', isValidIdeaId);
ideasRouter.get('/', getAllIdeas);
ideasRouter.get('/:ideaId', getIdeaById);
ideasRouter.post('/', checkMillionDollarIdea, createIdea);
ideasRouter.put('/:ideaId', updateIdea);
ideasRouter.delete('/:ideaId', deleteIdeaById);

module.exports = ideasRouter;