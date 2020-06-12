const express = require('express');
const fs = require('fs');
const app = express();
const accountsRouter = require('./routes/accounts.js');

global.fileName = 'accounts.json';

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, function () {
  try {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
      if (err) {
        const initialJason = {
          nextId: 1,
          account: [],
        };
        fs.writeFile(global.fileName, JSON.stringify(initialJason), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  console.log('API started');
});
