const express = require('express');
const { resolve } = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});
function getAllRestaurants() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM restaurants';
    db.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/restaurants', async(req, res) => {
  try {
    let result = await getAllRestaurants();
    if (result == null) {
      res.status(404).json('No restaurants available');
    }
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json('Error :' + err.message());
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
