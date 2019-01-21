const mongoose = require('mongoose')

const atencionesSchema = new mongoose.Schema({
    EstAtencion: {
        type: Boolean,
        required: [true, 'La EstAtencion debe de tener un debe de tener un estado de atencion']
    },
    FechaAtencion: {
        type: Date,
        required: [true, 'La FechaAtencion debe de tener una fecha de atencion']
    },
    IdPaciente: {
        type: String,
        required: [true, 'El IdPaciente debe de tener un id']
    },
    Examen:  {
        type: Array,
        required: [true, 'El Examen debe de tener un un array de examenes']
    }
})


module.exports = mongoose.model('atenciones', atencionesSchema)
