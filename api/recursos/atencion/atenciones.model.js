const mongoose = require('mongoose')

const atencionesSchema = new mongoose.Schema({
    EstAtencion: {
        type: Boolean,
        required: [true, 'La EstAtencion debe de tener un nombre']
    },
    FechaAtencion: {
        type: Date,
        required: [true, 'La FechaAtencion debe de tener un nombre']
    },
    IdPaciente: {
        type: String,
        required: [true, 'La IdPaciente debe de tener un nombre']
    },
    Examen:  {
        type: Array,
        required: [true, 'La Examen debe de tener un nombre']
    }
})


module.exports = mongoose.model('atenciones', atencionesSchema)
