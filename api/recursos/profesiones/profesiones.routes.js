const express = require('express')
const _ = require('underscore')
const passport = require('passport')

const validarProfesion = require('./profesiones.validate')
const log = require('./../../../utils/logger')
const profesionController = require('./profesiones.controller')

const jwtAutenticate = passport.authenticate('jwt', { session: false })
const profesionesRouter = express.Router()
// -------------------------requires----------------------------♥


function validarIdDeMongo(req, res, next) {
    let id = req.params.id
    // regex = expresion regular
    if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
        res.status(400).send(`El id [${id}] suminstrado en el URL no es válido.`)
        return
    }
    next()
}

profesionesRouter.get('/', (req, res) => {
    profesionController.obtenerProfesiones()
        .then(profesiones => {
            res.json(profesiones)
        })
        .catch(err => {
            res.status(500).send('Error al leer los productos de la base de datos.')
        })
})

profesionesRouter.post('/',  (req, res) => {
    profesionController.crearProfesion(req.body, req.user.username)
        .then(profesion => {
            log.info("Profesion agregada a la colección profesion", profesion)
            res.status(201).json(profesion)
        })
        .catch(err => {
            log.error("Profesion no pudo ser creado", err)
            res.status(500).send('Error ocurrió al tratar de crear el producto.')
        })

})

profesionesRouter.get('/:id', validarIdDeMongo, (req, res) => {
    let id = req.params.id
    profesionController.obtenerProducto(id)
        .then(producto => {
            if (!producto) {
                res.status(404).send(`Producto con id [${id}] no existe.`)
            } else {
                res.json(producto)
            }
        })
        .catch(err => {
            log.error(`Excepción ocurrió al tratar de obtener por id [${id}] el producto`, err)
            res.status(500).send(`Error ocurrió al tratar de obtener el producto con id [${id}].-------`, err)
        })
})

profesionesRouter.put('/:id', [jwtAutenticate, validarProfesion], async (req, res) => {
    let id = req.params.id
    let requestUsuario = req.user.username
    let productoAReemplazar

    try {
        productoAReemplazar = await profesionController.obtenerProducto(id)
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

    profesionController.reemplazarProducto(id, req.body, requestUsuario)
        .then(producto => {
            res.json(producto)
            log.info(`Producto con id [${id}] reemplazado con nuevo producto`, producto)
        })
        .catch(err => {
            log.error(`Excepción ocurrió al procesar el borrado de producto con id [${id}]`, err)
            res.status(404).send(`Error ocurrio borrado producto con id[${id}]`)
        })
})

profesionesRouter.delete('/:id', [jwtAutenticate, validarIdDeMongo], async (req, res) => {
    let id = req.params.id
    let productoABorrar

    try {
        productoABorrar = await profesionController.obtenerProducto(id)
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
        let productoBorrado = await profesionController.borrarProducto(id)
        log.info(`Producto con id [${id}] fue borrado`)
        res.json(productoBorrado)

    } catch (err) {
        res.status(500).send(`Error ocurrió borrando producto con id[ ${id}]`)
    }
})

module.exports = profesionesRouter