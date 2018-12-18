const express = require('express')
const _ = require('underscore')
const passport = require('passport')

const validarProfesion = require('./usuarios.validate')
const log = require('../../../utils/logger')
const usuarioController = require('./usuarios.controller')

const jwtAutenticate = passport.authenticate('jwt', { session: false })
const usuariosRouter = express.Router()
// -------------------------requires----------------------------♥


function validarIdDeMongo(req, res, next) {
    let id = req.params.id
    // regex = expresion regular
    if (id.match(/^[a-fA-F0-9]{8}$/) === null) {
        res.status(400).send(`El id [${id}] suminstrado en el URL no es válido.`)
        return
    }
    next()
}

usuariosRouter.get('/', (req, res) => {
    usuarioController.obtenerUsuarios()
        .then(usuarios => {
            res.json(usuarios)
        })
        .catch(err => {
            res.status(500).send('Error al leer los usuarios de la base de datos.')
        })
})

usuariosRouter.post('/', [jwtAutenticate, validarProfesion] , (req, res) => {
    console.log('tu log>: ', req)
    // usuarioController.crearProfesion(req.body, req.user.username)
    usuarioController.crearProfesion(req.body)
        .then(profesion => {
            log.info("Profesion agregada a la colección profesion", profesion)
            res.status(201).json(profesion)
        })
        .catch(err => {
            log.error("Profesion no pudo ser creada", err)
            res.status(500).send('Error ocurrió al tratar de crear el producto.')
        })

})

usuariosRouter.get('/:id', validarIdDeMongo, (req, res) => {
    let id = req.params.id
    console.log('el id>>', req.params)
    usuarioController.obtenerUsuario(id)
        .then(usuario => {
            if (!usuario) {
                res.status(404).send(`usuario con id [${id}] no existe.`)
            } else {
                res.json(usuario)
            }
        })
        .catch(err => {
            log.error(`Excepción ocurrió al tratar de obtener por id [${id}] el usuario`, err)
            res.status(500).send(`Error ocurrió al tratar de obtener el usuario con id [${id}].-------`, err)
        })
})

usuariosRouter.put('/:id', [jwtAutenticate, validarProfesion], async (req, res) => {
    let id = req.params.id
    let requestUsuario = req.user.username
    let productoAReemplazar

    try {
        productoAReemplazar = await usuarioController.obtenerUsuario(id)
    } catch (err) {
        log.error(`Excepción ocurrió al procesar el borrado de producto con id [${id}]`, err)
        res.status(404).send(`Error ocurrio borrado producto con id[${id}]`)
        return
    }

    if (!productoAReemplazar) {
        res.status(404).send(`El producto con id [${id}] no existe.`)
        return
    }

    if (productoAReemplazar.dueño !== requestUsuario) {
        log.warn(`Usuario [${requestUsuario}] no es dueño de producto con id [${id}]. Dueño real es [${productoAReemplazar.dueño}]. Request no será procesado`)
        res.status(401).send(`No eres dueño del producto con id [${id}]. Solo puedes modificar productos creados por ti.`)
    }

    usuarioController.reemplazarProducto(id, req.body, requestUsuario)
        .then(producto => {
            res.json(producto)
            log.info(`Producto con id [${id}] reemplazado con nuevo producto`, producto)
        })
        .catch(err => {
            log.error(`Excepción ocurrió al procesar el borrado de producto con id [${id}]`, err)
            res.status(404).send(`Error ocurrio borrado producto con id[${id}]`)
        })
})

usuariosRouter.delete('/:id', [jwtAutenticate, validarIdDeMongo], async (req, res) => {
    let id = req.params.id
    let productoABorrar

    try {
        productoABorrar = await usuarioController.obtenerProducto(id)
    } catch (err) {
        log.error(`Excepción ocurrió al procesar el borrado de producto con id [${id}]`, err)
        res.status(404).send(`Error ocurrio borrado producto con id[${id}]`)
        return
    }


    if (!productoABorrar) {
        log.info(`Producto con id [${id}] no existe. Nada que borrar`)
        res.status(404).send(`Producto con id [${id}] no existe. Nada que borrar.`)
        return
    }

    let usuarioAutenticado = req.user.username
    if (productoABorrar.dueño !== usuarioAutenticado) {
        log.info(`Usuario [${usuarioAutenticado}] no es dueño de producto con id [${id}]. Dueño real es [${productoABorrar.dueño}]. Request no será procesado`)
        res.status(401).send(`No eres dueño del producto con id [${id}]. Solo puedes borrar productos creados por ti.`)
        return
    }

    try {
        let productoBorrado = await usuarioController.borrarProfesion(id)
        log.info(`Profesion con id [${id}] fue borrado`)
        res.json(productoBorrado)

    } catch (err) {
        res.status(500).send(`Error ocurrió borrando Profesion con id[ ${id}]`)
    }
})

module.exports = usuariosRouter