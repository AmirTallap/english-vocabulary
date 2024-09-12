const express = require('express');

const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: false }))
const port = 3000;

//Checking if progress file exists!
const sqlite3 = require('sqlite3').verbose();
const dbOps = require('./db');
if (fs.existsSync('progress/database.db'));
else dbOps.initProgress();  

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Route to render the index.ejs
const db = new sqlite3.Database('progress/database.db');
app.get('/',  async (req, res) => {
  const countAll = await dbOps.squery(db, 'SELECT count(*) as count FROM words;');
  const status = await dbOps.query(db, 'SELECT DISTINCT status from words;');
  let statusArr = [];
  // status.forEach(async i => {
  //     if(i.status){
  //       const x = (await dbOps.squery(db, `SELECT count(*) as count FROM words where status = ${i.status};`)).count;
  //       statusArr.push(x);
  //     }
  // }); 
  res.render('index', {wordsCount:countAll.count});
});


app.post("/processQuestion",  async (req, res) => {
  await dbOps.dbCommand(db, `UPDATE words SET status=${req.body.score}, updated_at=${Date.now()} where id = ${req.body.id}`).then(()=>{
    res.send("success!");
  });
});

app.post("/getRandomQuestion", (req, res)=>{
  db.all('SELECT * FROM words where status is null limit 1', (err, row) => {
    res.json(row[0]);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
