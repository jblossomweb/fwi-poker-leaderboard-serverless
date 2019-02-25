const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

mongoose.Promise = global.Promise
let isConnected

module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection')
    return Promise.resolve()
  }

  console.log('=> using new database connection')
  return mongoose.connect(process.env.DB_CONNECT)
    .then(db => { 
      isConnected = db.connections[0].readyState
    })
}
