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
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getRestaurantById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM restaurants where id=?';
    db.all(query, [id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/restaurants/details/:id', async(req, res) => {
  try {
    let id=req.params.id;
    let result = await getRestaurantById(id);
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getRestaurantByCuisine(cuisine) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM restaurants where cuisine=?';
    db.all(query, [cuisine], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/restaurants/cuisine/:cuisine', async(req, res) => {
  try {
    let cuisine=req.params.cuisine;
    let result = await getRestaurantByCuisine(cuisine);
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getRestaurantByFilters(isVeg,hasOutdoorSeating,isLuxury) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM restaurants where isVeg=? and hasOutdoorSeating=? and isLuxury=?';
    db.all(query, [isVeg,hasOutdoorSeating,isLuxury], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/restaurants/filter', async(req, res) => {
  try {
    let isVeg=req.query.isVeg;
    let hasOutdoorSeating=req.query.hasOutdoorSeating;
    let isLuxury=req.query.isLuxury;
    let result = await getRestaurantByFilters(isVeg,hasOutdoorSeating,isLuxury);
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

app.get('/restaurants/sort-by-rating', async(req, res) => {
  try {
    let result = await getAllRestaurants();
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
   //console.log(result);
    result.sort((res1,res2)=> res2.rating-res1.rating)
    res.status(200).json({ restaurants: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getAllDishes() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM dishes';
    db.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/dishes', async(req, res) => {
  try {
    let result = await getAllDishes();
    if (result.length==0) {
      res.status(404).json({message:'No dishes available'});
    }
    res.status(200).json({ dishes: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getDishesById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM dishes where id=?';
    db.all(query, [id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/dishes/details/:id', async(req, res) => {
  try {
    let id=req.params.id;
    let result = await getDishesById(id);
    if (result.length==0) {
      res.status(404).json({message:'No dishes available'});
    }
    res.status(200).json({ dishes: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

function getDishesByFilter(isVeg) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM dishes where isVeg=?';
    db.all(query, [isVeg], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows); 
    });
  });
}

app.get('/dishes/filter', async(req, res) => {
  try {
    let isVeg=req.query.isVeg;
    let result = await getDishesByFilter(isVeg);
    if (result.length==0) {
      res.status(404).json({message:'No dishes available'});
    }
    res.status(200).json({ dishes: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});

app.get('/dishes/sort-by-price', async(req, res) => {
  try {
    let result = await getAllDishes();
    if (result.length==0) {
      res.status(404).json({message:'No restaurants available'});
    }
    result.sort((dis1,dis2)=> dis1.price-dis2.price)
    res.status(200).json({ dishes: result });
  } catch (err) {
    res.status(500).json({Error : err.message});
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
