const express = require('express')
const { getAllVillains } = require('./controllers/villains')

const app = express()

app.get('.villains', getAllVillains)

app.listen(1337, () => {
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
