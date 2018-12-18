const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    // nombProfesion: {
    //     type: String,
    //     required: [true, 'La profesión debe de tener un nombre']
    // }
})
module.exports = mongoose.model('usuarios', usuarioSchema)