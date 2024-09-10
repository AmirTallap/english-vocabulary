const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

//Checking if progress file exists!
const sqlite3 = require('sqlite3').verbose();
const dbFile = require('./db');
if (fs.existsSync('progress/database.db'));
else dbFile.initProgress();  

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Route to render the index.ejs
const db = new sqlite3.Database('progress/database.db');
app.get('/',  (req, res) => {
   db.all('SELECT count(*) as count FROM entries', (err, rows) => {
     res.render('index', {wordsCount:rows[0].count});
  });
});
app.post("/getRandomQuestion", (req, res)=>{
  db.all('SELECT * FROM words where status is null limit 1', (err, row) => {
    console.log(row);
    res.json(row[0]);
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
