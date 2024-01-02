const express = require('express');
const minionsRouter = express.Router({mergeParams: true});
const db = require('../db.js');

const isValidMinionId = (req, res, next, id) => {
    const exists = db.getFromDatabaseById('minions', id);
    if (exists) {
        req.minion = exists;
        req.id = id;
        next();
    } else {
        res.status(404).send('Minion not found.');
    }
}

const isValidWorkId = (req, res, next, id) => {
    const exists = db.getFromDatabaseById('work', id);
    if (exists) {
        req.work = exists;
        req.workId = id;
        next();
    } else {
        res.status(404).send('Work not found.');
    }
}

const isValidMinion = (obj) => {
    const { name, title, salary, weaknesses } = obj;
    const checks = [(typeof name === 'string'), (typeof title === 'string'), (typeof weaknesses === 'string'), (typeof salary === 'number' && isFinite(salary))];
    return checks.every(x => x);
}

const isValidWork = (obj) => {
    const { title, description, hours, minionId } = obj;
    const checks = [(typeof title === 'string'), (typeof description === 'string'), (typeof hours === 'number' && isFinite(hours)), (typeof minionId === 'string'), ]
    return checks.every(x => x);
}

// Get all minions
const getAllMinions = (req, res, next) => {
    res.send(db.getAllFromDatabase('minions'));
}

// Create minion
const createMinion = (req, res, next) => {
    if (isValidMinion(req.body)) {
        const newMinion = db.addToDatabase('minions', req.body);
        res.status(201).send(newMinion);
    } else {
        res.status(404).send('Invalid minion data');
    }
}

const getMinionById = (req, res, next) => {
    res.status(200).send(req.minion);
}

const updateMinion = (req, res, next) => {
    if (isValidMinion(req.body)) {
        const updated = db.updateInstanceInDatabase('minions', req.body);
        res.status(200).send(updated);
    } else {
        res.status(404).send('Not a valid minion');
    }
}

const deleteMinionById = (req, res, next) => {
    db.deleteFromDatabasebyId('minions', req.id);
    res.status(204).send();
}


const getAllMinionWork = (req, res, next) => {
    const work = db.getAllFromDatabase('work').filter(x => x.minionId === req.id);
    if (work.length === 0 || work === null) {
        res.status(400).send('No work found for that minion');
    }
    res.send(db.getAllFromDatabase('work').filter(x => x.minionId === req.id));
}

const updateWork = (req, res, next) => {
    if (isValidWork(req.body) && req.body.minionId === req.id) {
        const updatedWork = db.updateInstanceInDatabase('work', req.body);
        res.status(200).send(updatedWork);
    } else {
        res.status(400).send();
    }
}

const createWork = (req, res, next) => {
    if (isValidWork(req.body)) {  
        const newWork = db.addToDatabase('work', req.body);
        res.status(201).send(newWork);
    } else {
        res.status(404).send('Invalid work object');
    }
}

const deleteWork = (req, res, next) => {
    db.deleteFromDatabasebyId('work', req.workId);
    res.status(204).send();
}

minionsRouter.param('minionId', isValidMinionId);
minionsRouter.param('workId', isValidWorkId);
minionsRouter.get('/', getAllMinions);
minionsRouter.get('/:minionId', getMinionById);
minionsRouter.put('/:minionId', updateMinion);
minionsRouter.post('/', createMinion);
minionsRouter.delete('/:minionId', deleteMinionById);

minionsRouter.get('/:minionId/work', getAllMinionWork);
minionsRouter.put('/:minionId/work/:workId', updateWork);
minionsRouter.post('/:minionId/work', createWork);
minionsRouter.delete('/:minionId/work/:workId', deleteWork);


module.exports = minionsRouter;