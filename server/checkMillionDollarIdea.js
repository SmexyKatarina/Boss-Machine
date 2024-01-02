const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    if ((numWeeks === null || weeklyRevenue === null) || (isNaN(parseInt(numWeeks)) || isNaN(parseInt(weeklyRevenue)))) {
        res.status(400).send('Invalid values.');
    }
    if ((Number(numWeeks) * Number(weeklyRevenue)) >= 1000000) {
        next();
    } else {
        res.status(400).send('Value is under a million.');
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
