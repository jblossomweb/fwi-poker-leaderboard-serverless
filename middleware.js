const middlewares = require('middy')
const { cors } = require('middy/middlewares')

module.exports.applyMiddleware = controller => middlewares(controller)
  .use(cors({
    origins: [
      // 'http://localhost:3000', // dev
      'https://fwi-poker-leaderboard.firebaseapp.com', // prod
    ]
  }))
