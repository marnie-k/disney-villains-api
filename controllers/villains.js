const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll()

  return response.send(villains)
}
const getVillainBySlug = async (request, response) => {
  const { slug } = request.params
  const matchedVillains = await models.villains.findOne({ where: { slug } })

  return matchedVillains
    ? response.send(matchedVillains)
    : response.sendStatus(404)
}

module.exports = {
  getAllVillains,
  getVillainBySlug
}
