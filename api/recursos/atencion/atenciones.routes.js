const express = require('express')
const _ = require('underscore')
const passport = require('passport')

const validarAtencion = require('./atenciones.validate')
const log = require('../../../utils/logger')
const examenController = require('./atenciones.controller')

const jwtAutenticate = passport.authenticate('jwt', { session: false })
const atencionesRouter = express.Router()
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

atencionesRouter.get('/', (req, res) => {
    examenController.obtenerAtenciones()
        .then(Atenciones => {            
            res.json(Atenciones)
        })
        .catch(err => {
            res.status(500).send('Error al leer las Atenciones de la base de datos.')
        })
})

atencionesRouter.post('/', [jwtAutenticate, validarAtencion] , (req, res) => {
    // examenController.crearAtencion(req.body, req.user.username)
    examenController.crearAtencion(req.body)
        .then(atencion => {
            log.info("Atencion agregada a la colección Atencion", atencion)
            res.status(201).json(atencion)
        })
        .catch(err => {
            log.error("Atencion no pudo ser creada", err)
            res.status(500).send('Error ocurrió al tratar de crear el Atencion.')
        })

})

atencionesRouter.get('/:id', validarIdDeMongo, (req, res) => {
    let id = req.params.id
    examenController.obtenerProducto(id)
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

atencionesRouter.put('/:id', [jwtAutenticate, validarAtencion], async (req, res) => {
    let id = req.params.id
    let requestUsuario = req.user.username
    let productoAReemplazar

    try {
        productoAReemplazar = await examenController.obtenerProducto(id)
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

    examenController.reemplazarProducto(id, req.body, requestUsuario)
        .then(producto => {
            res.json(producto)
            log.info(`Producto con id [${id}] reemplazado con nuevo producto`, producto)
        })
        .catch(err => {
            log.error(`Excepción ocurrió al procesar el borrado de producto con id [${id}]`, err)
            res.status(404).send(`Error ocurrio borrado producto con id[${id}]`)
        })
})

atencionesRouter.delete('/:id', [jwtAutenticate, validarIdDeMongo], async (req, res) => {
    let id = req.params.id
    let productoABorrar

    try {
        productoABorrar = await examenController.obtenerProducto(id)
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
        let productoBorrado = await examenController.borrarProfesion(id)
        log.info(`Profesion con id [${id}] fue borrado`)
        res.json(productoBorrado)

    } catch (err) {
        res.status(500).send(`Error ocurrió borrando Profesion con id[ ${id}]`)
    }
})

module.exports = atencionesRouter