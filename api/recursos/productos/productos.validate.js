const Joi = require('joi')

// blue print producto
const blueprintProducto = Joi.object().keys({
    titulo: Joi.string().max(100).required(),
    precio: Joi.number().positive().precision(2).required(),
    moneda: Joi.string().length(3).uppercase()
})

// mi middelware para validar inputs del view
const validarProducto = (req, res, next) => {
    let resultado = Joi.validate(req.body, blueprintProducto, {
        abortEarly: false,
        convert: false
    })
    if (resultado.error === null) {
        next()

    } else {
        let erroresDeValidacion = resultado.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")

        res.status(400).send(`El producto en el body debe especificar titulo, precio y moneda.
       errores en tu request: ${erroresDeValidacion}`)
    }
}

module.exports = validarProducto;