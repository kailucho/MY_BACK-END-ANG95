const Joi = require('joi')

// blue print atencion
const blueprintExamen = Joi.object().keys({
    EstAtencion: Joi.string().max(100).required(),
    EstAtencion: Joi.required(),
    FechaAtencion:Joi.string().max(100).required(),
    IdPaciente:Joi.string().max(100).required(),
    Examen: Joi.required()
})

// mi middelware para validar inputs del view
const validarAtencion = (req, res, next) => {
    let resultado = Joi.validate(req.body, blueprintExamen, {
        abortEarly: false,
        convert: false
    })
    if (resultado.error === null) {
        next()

    } else {
        let erroresDeValidacion = resultado.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")

        res.status(400).send(`La Atención en el body debe especificar un nombre.
       errores en tu request: ${erroresDeValidacion}`)
    }
}

module.exports = validarAtencion;