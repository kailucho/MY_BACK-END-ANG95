const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 1,
    required: [true, 'Usuario debe tener un username']
  },
  password: {
    type: String,
    minlength: 1,
    required: [true, 'Usuario debe tener una contraseña']
  },
  email: {
    type: String,
    minlength: 1,
    required: [true, 'Usuario debe tener un email']
  }
})

module.exports = mongoose.model('loginusuarios', usuarioSchema)