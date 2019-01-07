const Atencion = require('./atenciones.model')

// inserta atenciones que se realizan en el laboratorio
function crearAtencion(producto, dueño) {
    return new Atencion({
        ...producto
    }).save()
}

// obtiene Examenes sin filtrar por nada - todos lo registros
function obtenerExamenes() {    
    // console.log('==>', Examen.find({}));
    
     return Atencion.find()
}

// obtiene producto  filtra por ID
function obtenerProducto(id) {
    return Atencion.findById(id)
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
    crearAtencion,
    obtenerExamenes,
    obtenerProducto,
    borrarProfesion,
    reemplazarProducto
}