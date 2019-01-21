const Examen = require('./examenes.model')

function crearProfesion(producto, dueño) {
    return new Examen({
        ...producto
    }).save()
}

// obtiene Examenes sin filtrar por nada - todos lo registros
function obtenerExamenes() {    
    
    return Examen.find()
}

// obtiene producto  filtra por ID
function obtenerProducto(id) {
    return Examen.findById(id)
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
    obtenerExamenes,
    obtenerProducto,
    borrarProfesion,
    reemplazarProducto
}