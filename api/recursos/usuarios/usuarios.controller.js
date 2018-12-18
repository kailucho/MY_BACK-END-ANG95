const Usuario = require('./usuarios.model')

function crearProfesion(producto, dueño) {
    return new Profesion({
        ...producto
    }).save()
}

// obtiene Usuarios sin filtrar por nada todos lo registros
function obtenerUsuarios() {
     return Usuario.find({})
}

// obtiene producto  filtra por ID
function obtenerUsuario(id) {
    return Usuario.find({dni: id})
}

// ELIMINA una Profesion por ID
function borrarProfesion(id) {
    return Profesion.findByIdAndDelete(id)
}

function reemplazarProducto(id, producto, username) {
    return Producto.findOneAndUpdate({
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
    obtenerUsuarios,
    obtenerUsuario,
    borrarProfesion,
    reemplazarProducto
}