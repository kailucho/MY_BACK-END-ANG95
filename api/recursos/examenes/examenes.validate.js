const Joi = require('joi')

// blue print profesion
const blueprintProfesion = Joi.object().keys({
    nombProfesion: Joi.string().max(100).required()
    
})

// mi middelware para validar inputs del view
const validarProfesion = (req, res, next) => {
    let resultado = Joi.validate(req.body, blueprintProfesion, {
        abortEarly: false,
        convert: false
    })
    if (resultado.error === null) {
        next()

    } else {
        let erroresDeValidacion = resultado.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")

        res.status(400).send(`La profesión en el body debe especificar un nombre.
       errores en tu request: ${erroresDeValidacion}`)
    }
}

module.exports = validarProfesion;