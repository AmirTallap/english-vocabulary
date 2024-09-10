const sqlite3 = require('sqlite3').verbose();
const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const copyFile = async(sourcePath, destinationPath) => {
  try {
    await new Promise((resolve, reject) => {
      fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log('File copied successfully.');
  } catch (err) {
    console.error('Error:', err);
  }
}
const dbCommand = async (db, command, silent=false) => {
  try {
    await new Promise( async (resolve, reject) => {
      await db.run(command, (err) => {
        if(err) {
          if(!silent)
          console.log(err); 
          reject("DB command failed!");
        }
        else {
          if(!silent)
          console.log(command + "--> Success ✅");
          resolve();
        }
      });
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

const query = async (db, query) => {
  try {
    await new Promise( async (resolve, reject) => {
      await db.all(query, (err, results) => {
        if(err) {
          reject(err);
        }
        else {
          resolve(results);
        }
      });
    });
  } catch (err) {
    console.error('Error:', err);
  }
}
const initProgress = async () => {
  const sqlite3 = require('sqlite3').verbose();
  await copyFile("sqlite3/dictionary.db", "progress/database.db");
  const db = new sqlite3.Database('progress/database.db');
  // Progress DB initalization
  await dbCommand(db, `
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      updated_at DATETIME NULL,
      status INTEGER CHECK (status BETWEEN 0 AND 9),
      word varchar(25) NULL,
      wordtype varchar(20) NULL,
      definition text NULL 
    )
  `);
await dbCommand(db, `INSERT INTO words (word, wordtype, definition)
    SELECT entries.word, entries.wordtype, entries.definition
    FROM entries`);
}
module.exports = {
  initProgress, dbCommand,
};