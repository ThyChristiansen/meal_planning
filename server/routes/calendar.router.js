const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/:date', (req, res) => {
    date = new Date(req.params.date).toUTCString();
    // console.log(date)
    const queryText = `SELECT * FROM "mealPlan" WHERE date = $1 ORDER BY meal_type ASC;`;
    pool.query(queryText, [date])
        .then((result) => {
            console.log('------>',result.rows)
            res.send(result.rows);
        })
        .catch((error) =>
            console.log(error)
        );
});

router.post('/', (req, res) => {
    const mealTitle = req.body.mealTitle
    const mealType = req.body.mealType
    const mealDescription = req.body.mealDescription
    const selectedDate = req.body.selectedDate

    console.log('--------->', mealTitle, mealType, mealDescription, selectedDate);

    const queryText = 'INSERT INTO "mealPlan" (meal_title,meal_type,meal_description,date) VALUES ($1, $2, $3, $4) RETURNING id';
    pool.query(queryText, [mealTitle, mealType, mealDescription, selectedDate])
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
});

router.put('/', (req, res) => {
    const mealTitle = req.body.mealTitle
    const mealType = req.body.mealType
    const mealDescription = req.body.mealDescription
    const selectedDate = req.body.selectedDate

    console.log('--------->', mealTitle, mealType, mealDescription, selectedDate);

    const queryText = `UPDATE "mealPlan" SET meal_title = $1, meal_description = $2 WHERE meal_type = $3 AND date = $4 ;`;
    pool.query(queryText, [mealTitle, mealDescription, mealType, selectedDate])
        .then(() => res.sendStatus(201))
        .catch((error) => {
            console.log(error);
            res.sendStatus(500)
        }
        );
});



module.exports = router;