const villains = (connection, Sequelize) => connection.define('villains', {
  id: { type: Sequelize.integer, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  movie: { type: Sequelize.STRING },
  slug: { type: Sequelize.STRING }
}, { paranoid: true })

module.exports = villains

