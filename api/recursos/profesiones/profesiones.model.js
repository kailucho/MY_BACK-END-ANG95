const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Producto debe tener un titulo']
    },
    precio: {
        type: Number,
        required: [true, 'Producto debe tener un precio']
    },
    moneda: {
        type: String,
        maxlength: 3,
        minlength: 3,
        required: [true, 'Producto debe tener una moneda']
    },
    dueño: {
        type: String,
        required: [true, 'Producto debe estar asociado a un usuario']
    }
})
module.exports = mongoose.model('profesion', productSchema)