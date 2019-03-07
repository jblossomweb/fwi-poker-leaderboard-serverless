const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({  
  name: { type: String, required: [true, 'required']},
  country: { type: String, required: [true, 'required']},
  winnings: { type: Number, required: [true, 'required']},
  email: { type: String },
  twitterHandle: { type: String },
})

module.exports = {
  Player: mongoose.model('Player', PlayerSchema)
}
