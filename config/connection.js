const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/psychic-giggle', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})

module.exports = mongoose.connection;