const express = require('express');
const fs = require('fs');
const router = express.Router();

router.post('/', (req, res) => {
  let account = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.account.push(account);

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
          console.log(err);
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }

      let json = JSON.parse(data);
      const account = json.account.find(
        (account) => account.id === parseInt(req.params.id, 10)
      );
      if (account) {
        res.send(account);
      } else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let accounts = json.account.filter(
        (account) => account.id !== parseInt(req.params.id, 10)
      );
      json.account = accounts;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put('/', (req, res) => {
  let newAccount = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let oldIndex = json.account.findIndex(
        (account) => account.id === newAccount.id
      );
      json.account[oldIndex].name = newAccount.name;
      json.account[oldIndex].balance = newAccount.balance;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.post('/transaction', (req, res) => {
  let params = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let index = json.account.findIndex((account) => account.id === params.id);
      // prettier-ignore
      if ((params.value < 0) && ((json.account[index].balance + params.value) < 0)) {
        throw new Error('Não há saldo suficiente');
      }
      json.account[index].balance += params.value;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.send(json.account[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});
module.exports = router;
