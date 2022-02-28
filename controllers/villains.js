const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.villains.findAll()

    return response.send(villains)
  } catch (error) {
    return response.status(500).send('Unable to retreive villain. Please try again.')
  }
}
const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params
    const matchedVillains = await models.villains.findOne({ where: { slug } })

    return matchedVillains
      ? response.send(matchedVillains)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retreive villain. Please try again.')
  }
}

const saveNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.status(400).send('The following paraneters are required: name, movie, slug')
    }
    const newVillain = await models.villains.create({ name, movie, slug }) //  villains.js:35:53 tests/controllers/villains.test.js:117:13

    return response.status(201).send(newVillain)
  } catch (error) {
    return response.status(500).send('Unable to create villain. Please try again.')
  }
}

module.exports = {
  getAllVillains,
  getVillainBySlug,
  saveNewVillain,
}
