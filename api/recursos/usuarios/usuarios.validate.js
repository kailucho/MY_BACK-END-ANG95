const Joi = require('joi')
const log = require('../../../utils/logger')

const blueprintUsuarios = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(200).required(),
    email: Joi.string().email().required()
})

let validarUsuario = (req, res, next) => {
    const resultado = Joi.validate(req.body, blueprintUsuarios, {
        abortEarly: false,
        convert: false
    })

    if (resultado.error === null) {
        next()
    } else {

        log.info("producto falló la validación", resultado.error.details.map(error => error.message))
        res.status(400).send("Información del usuario no cumple los requisitos. El nombre del usuario debe ser alfanúmerico y tener entre 3 y 30 caractéres. La contraseña debe tener entre 6 y 200 carácteres. Asegurate de que el email se válida.")
    }
}

const blueprintPedidoDeLogin = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})

let validarPedidoDeLogin = (req, res, next) => {
    const resultado = Joi.validate(req.body, blueprintPedidoDeLogin, {
        abortEarly: false,
        convert: false
    })

    if (resultado.error === null) {
        next()
    } else {
        res.status(400).send(`Login falló. Debes especificar el username y contraseña del usuario. Ambos deben string.`)
    }
}

module.exports = {
    validarPedidoDeLogin,
    validarUsuario
}