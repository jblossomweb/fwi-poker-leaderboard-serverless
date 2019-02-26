const objectID = require('mongodb').ObjectID
const { applyMiddleware } = require('./middleware')
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

module.exports.createPlayer = applyMiddleware((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let postedPlayer
  try {
    postedPlayer = JSON.parse(event.body)
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
      Player.create(postedPlayer)
        .then(player => callback(null, {
          statusCode: 200,
          body: JSON.stringify(player)
        }))
        .catch(err => {
          let code = err.statusCode || 500
          if (err.name === 'ValidationError') {
            code = 400
          }
          return callback(null, {
            statusCode: code,
            body: JSON.stringify({
              name: err.name,
              code,
              message: err.message,
            })
          })
        })
    })
})

module.exports.getPlayer = applyMiddleware((event, context, callback) => {
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
})

module.exports.getPlayers = applyMiddleware((event, context, callback) => {
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
})

module.exports.updatePlayer = applyMiddleware((event, context, callback) => {
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

  let update
  try {
    update = JSON.parse(event.body)
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
        .catch(err => {
          let code = err.statusCode || 500
          if (err.name === 'ValidationError') {
            code = 400
          }
          return callback(null, {
            statusCode: code,
            body: JSON.stringify({
              name: err.name,
              code,
              message: err.message,
            })
          })
        })
    })
})

module.exports.deletePlayer = applyMiddleware((event, context, callback) => {
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
})
