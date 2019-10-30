const express = require('express')
const app = express()
const port = 9122;

const db2 = require('./db2');

db2.connect();

app.get('/', async (req, res) => {
  const resultSet = await db2.executeStatement('SELECT * from qiws.qcustcdt');

  res.json(resultSet);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))