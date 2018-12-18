const _ = require('underscore')
const bcrypt = require('bcryptjs')
const passportJWT = require('passport-jwt')

const log = require('../../utils/logger')
const config = require('./../../config')
const usuarioController = require('../recursos/loginusuarios/loginusuarios.controller')


// Token debe de ser especificado mediante el header "Autorization. Eje:
// Autorization: bearer (y el token)

let jwtOptions = {
    secretOrKey: config.jwt.secreto,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}
module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    usuarioController.obtenerUsuario({
            id: jwtPayload.id
        })
        .then(usuario => {
            if (!usuario) {
                log.info(`JWT token no es válido. Usuario con id ${jwtPayload.id} no existe.`)
                next(null, false)
                return
            }

            log.info(`Usuario ${usuario.username} suministro un token valido. Autenticación completada.`)
            next(null, {
                username: usuario.username,
                id: usuario.id
            })
        })
        .catch(err => {
            log.error("Error ocurrió al tratar de validar un token.", err)
            next(err)
        })
})

