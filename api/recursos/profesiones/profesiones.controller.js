const Profesion = require('./profesiones.model')

// Crea / inserta profesion
function crearProfesion(producto, dueño) {
    return new Profesion({
        ...producto
    }).save()
}

// obtiene Profesiones sin filtrar por nada todos lo registros
function obtenerProfesiones() {
     return Profesion.find({})
}

// obtiene producto  filtra por ID
function obtenerProfesion(id) {
    return Profesion.findById(id)
}

// ELIMINA una Profesion por ID
function borrarProfesion(id) {
    return Profesion.findByIdAndDelete(id)
}

function reemplazarProfesion(id, producto, username) {
    return Profesion.findOneAndUpdate({
        _id: id
    }, {
        ...producto,
        dueño: username
    }, {
        new: true // La opción new es para que la llamada regrese el nuevo documento modificado
    })
}

module.exports = {
    crearProfesion,
    obtenerProfesiones,
    obtenerProfesion,
    borrarProfesion,
    reemplazarProfesion
}