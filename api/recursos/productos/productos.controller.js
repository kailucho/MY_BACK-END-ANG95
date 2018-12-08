const Producto = require('./productos.model')

function crearProducto(producto, dueño) {
    return new Producto({ 
        ...producto,
        dueño: dueño
    }).save()
}
// obtiene productos sin filtrar por nada todos lo registros
function obtenerProductos(){
    return Producto.find({})
}

// obtiene producto  filtra por ID
function obtenerProducto(id){
    return Producto.findById(id)
}
// ELIMINA un producto por ID
function borrarProducto(id){
    return Producto.findByIdAndDelete(id)
}

function reemplazarProducto(id, producto, username) {
    return Producto.findOneAndUpdate({ _id: id }, {
      ...producto,
      dueño: username
    }, {
      new: true // La opción new es para que la llamada regrese el nuevo documento modificado
    })
  }
  
  module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    borrarProducto,
    reemplazarProducto
  }