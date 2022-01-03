const express = require('express')
const { getAllVillains, getVillainBySlug } = require('./controllers/villains')

const app = express()

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.listen(1337, () => {
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
