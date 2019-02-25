const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({  
  name: String,
  country: String,
  winnings: Number,
})

module.exports = {
  Player: mongoose.model('Player', PlayerSchema)
}
