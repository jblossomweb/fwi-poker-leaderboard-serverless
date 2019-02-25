const connectToDatabase = require('./db')
const models = require('./models')
const Player = models.Player

module.exports.ping = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Pong!',
      // event, // useful debug
    }),
  }
}

module.exports.createPlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      Player.create(JSON.parse(event.body))
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the player.'
        }))
    })
}

module.exports.getPlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      Player.findById(event.pathParameters.id)
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the player.'
        }))
    })
}

module.exports.getPlayers = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      Player.find()
        .then(players => callback(null, {
          statusCode: 200,
          body: JSON.stringify(players)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the players.'
        }))
    })
}

module.exports.updatePlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      Player.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the players.'
        }))
    })
}

module.exports.deletePlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log('deleting player...')

  connectToDatabase()
    .then(() => {
      Player.findByIdAndRemove(event.pathParameters.id)
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed player with id: ' + player._id, player: player })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the players.'
        }))
    })
}
