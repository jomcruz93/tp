const router = require('express').Router()
const db = require('../db')

// Get all rows from Restaurants table.
router.route('/').get((req, res) => {
  const query = 
  `
  SELECT restaurantId as rid, name as rname
  FROM Restaurants
  ORDER BY restaurantId
  `;
  db.query(query, null, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json('Error: ' + error)
    } else {
      res.status(200).json(result.rows)
    }
  })
})

router.route('/getRid').get((req, res) => {
  const query = 
  `
  SELECT restaurantId as rid FROM Restaurants where name=$1;
  `;
  const values = [req.query.rname];
  db.query(query, values, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json('Error: ' + error)
    } else {
      res.status(200).json(result.rows)
    }
  })
})

module.exports = router