const connectToDatabase = require('./db')
const objectID = require('mongodb').ObjectID
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

  try {
    const newPlayer = JSON.parse(event.body)
  } catch (err) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        name: err.name,
        code: 400,
        message: err.message,
      })
    })
  }

  connectToDatabase()
    .then(() => {
      Player.create(newPlayer)
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          body: JSON.stringify({
            name: err.name,
            code: err.statusCode || 500,
            message: err.message,
          })
        }))
    })
}

module.exports.getPlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const id = event.pathParameters.id
  if (!objectID.isValid(id)) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        name: 'RequestError',
        code: 400,
        message: 'invalid value supplied for id',
      })
    })
  }

  connectToDatabase()
    .then(() => {
      Player.findById(id)
        .then(player => {
          if (!player) {
            return callback(null, {
              statusCode: 404,
              body: JSON.stringify({
                name: 'NotFound',
                code: 404,
                message: `player id ${id} was not found`,
              })
            })
          }
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(player)
          })
        })
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          body: JSON.stringify({
            name: err.name,
            code: err.statusCode || 500,
            message: err.message,
          })
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
          body: JSON.stringify({
            name: err.name,
            code: err.statusCode || 500,
            message: err.message,
          })
        }))
    })
}

module.exports.updatePlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const id = event.pathParameters.id
  if (!objectID.isValid(id)) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        name: 'RequestError',
        code: 400,
        message: 'invalid value supplied for id',
      })
    })
  }

  try {
    const update = JSON.parse(event.body)
  } catch (err) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        name: err.name,
        code: 400,
        message: err.message,
      })
    })
  }

  connectToDatabase()
    .then(() => {
      Player.findByIdAndUpdate(id, update, { new: true })
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          body: JSON.stringify({
            name: err.name,
            code: err.statusCode || 500,
            message: err.message,
          })
        }))
    })
}

module.exports.deletePlayer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const id = event.pathParameters.id
  if (!objectID.isValid(id)) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        name: 'RequestError',
        code: 400,
        message: 'invalid value supplied for id',
      })
    })
  }

  connectToDatabase()
    .then(() => {
      Player.findByIdAndRemove(id)
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed player with id: ' + player._id, player: player })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          body: JSON.stringify({
            name: err.name,
            code: err.statusCode || 500,
            message: err.message,
          })
        }))
    })
}
