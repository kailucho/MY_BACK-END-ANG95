const express = require('express')
const _ = require('underscore')
const uuidv4 = require('uuid/v4')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const log = require('../../../utils/logger')
const validarUsuario = require('./loginusuarios.validate').validarUsuario
const validarPedidoDeLogin = require('./loginusuarios.validate').validarPedidoDeLogin
const config = require('../../../config')
const usuarioController = require('./loginusuarios.controller')

const usuariosRouter = express.Router()

usuariosRouter.get('/', (req, res) => {
    usuarioController.obtenerUsuarios()
        .then(usuarios => {
            res.json(usuarios)
        })
        .catch(err =>{
            log.error(`Error al obtener todos los usuarios`, err)
            res.sendStatus(500)
        })
})

usuariosRouter.post('/', validarUsuario, (req, res) => {
    let nuevoUsuario = req.body

    usuarioController.usuarioExiste(nuevoUsuario.username, nuevoUsuario.email)
        .then(usuarioExiste => {
            if (usuarioExiste) {
                log.warn(`Email [${nuevoUsuario.email}] o username [${nuevoUsuario.username}] ya existen en la base de datos`)
                res.status(409).send(`El email o usuario ya estan asociados con un cuenta`)
                return
            }

            bcrypt.hash(nuevoUsuario.password, 10, (err, hashedPassword) => {
                if (err) {
                    log.error(`Error ocurrió al tratar de obtener el hash de una contraseña`, err)
                    res.status(500).send(`Error procesando creación del contraseña.`)
                    return
                }

                usuarioController.crearUsuario(nuevoUsuario, hashedPassword)
                    .then(nuevoUsario => {
                        res.status(201).send('Usuario creado exitósamente.')
                    })
                    .catch(err => {
                        log.error(`Error ocurrió al tratar de obtener el hash de un nuevo usuario`, err)
                        res.status(500).send(`Error ocurrió al tratar de crear nuevo usuario.`)
                    })
            })
        })
})

usuariosRouter.post('/login', validarPedidoDeLogin, async (req, res) => {
    let usuarioNoAutenticado = req.body
    let usuarioRegistrado

    try{
        usuarioRegistrado = await usuarioController.obtenerUsuario({
            username: usuarioNoAutenticado.username
        })
    } catch(err){
        log.error(`Error ocurrió al tratar de determinar si el usuario [${usuarioNoAutenticado.username}], ya existe`, err)
        res.status(500).send(`Error ocurrió durante el proceso de login.`)
        return
    }

    if (!usuarioRegistrado) {
        log.info(`Usuario [${usuarioNoAutenticado.username}] no existe. No pudo ser autenticado`)
        res.status(400).send('Credenciales incorrectas. Asegurese que el username y contraseña sean correctos.')
        return
    }

    let contraseñaCorrecta
    try{
        contraseñaCorrecta = bcrypt.compare(usuarioNoAutenticado.password, usuarioRegistrado.password)
    }catch(err){
        log.error(`Error ocurrió al tratar de verificar si la contraseña es correcta`, err)
        res.status(500).send(`Error ocurrió durante el proceso de login (contraseña).`)
        return
    }
     let userUsername = usuarioNoAutenticado.username
    if (contraseñaCorrecta) {
        let token = jwt.sign({ id: usuarioRegistrado.id }, config.jwt.secreto, { expiresIn: config.jwt.tiempoDeExpiración })
        log.info(`Usuario ${usuarioNoAutenticado.username} completo autenticación exitosamente.`)
        res.status(200).json({ token, userUsername})
    } else {
        log.info(`Usuario ${usuarioNoAutenticado.username} no completo autenticación. Contraseña incorrecta`)
        res.status(400).send('Credenciales incorrectas. Asegúrese que el username y contraseña sean correctas')
        return
    }
})

module.exports = usuariosRouter