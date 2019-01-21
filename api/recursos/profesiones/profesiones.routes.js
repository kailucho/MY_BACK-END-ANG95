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

profesionesRouter.post('/', [jwtAutenticate, validarProfesion] , (req, res) => {
    // profesionController.crearProfesion(req.body, req.user.username)
    profesionController.crearProfesion(req.body)
        .then(profesion => {
            log.info("Profesion agregada a la colección profesion", profesion)
            res.status(201).json(profesion)
        })
        .catch(err => {
            log.error("Profesion no pudo ser creada", err)
            res.status(500).send('Error ocurrió al tratar de crear el producto.')
        })

})

profesionesRouter.get('/:id', validarIdDeMongo, (req, res) => {
    let id = req.params.id
    profesionController.obtenerProfesion(id)
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
    let profesionAReemplazar

    try {
        profesionAReemplazar = await profesionController.obtenerProfesion(id)
    } catch (err) {
        log.error(`Excepción ocurrió al procesar el borrado de profesion con id [${id}]`, err)
        res.status(404).send(`Error ocurrio borrado profesion con id[${id}]`)
        return
    }

    if (!profesionAReemplazar) {
        res.status(404).send(`La profesion con id [${id}] no existe.`)
        return
    }

    // if (profesionAReemplazar.dueño !== requestUsuario) {
    //     log.warn(`Usuario [${requestUsuario}] no es dueño de la profesion con id [${id}]. Dueño real es [${profesionAReemplazar.dueño}]. Request no será procesado`)
    //     res.status(401).send(`No eres dueño del profesion con id [${id}]. Solo puedes modificar profesions creados por ti.`)
    // }

    profesionController.reemplazarProfesion(id, req.body, requestUsuario)
        .then(profesion => {
            res.json(profesion)
            log.info(`profesion con id [${id}] reemplazado con nuevo profesion`, profesion)
        })
        .catch(err => {
            log.error(`Excepción ocurrió al procesar el borrado de profesino con id [${id}]`, err)
            res.status(404).send(`Error ocurrio borrado profesino con id[${id}]`)
        })
})

profesionesRouter.delete('/:id', [jwtAutenticate, validarIdDeMongo], async (req, res) => {
    let id = req.params.id
    let profesionABorrar

    try {
        profesionABorrar = await profesionController.obtenerProfesion(id)
    } catch (err) {
        log.error(`Excepción ocurrió al procesar el borrado de la profesion con id [${id}]`, err)
        res.status(404).send(`Error ocurrio borrando profesion con id[${id}]`)
        return
    }


    if (!profesionABorrar) {
        log.info(`profesion con id [${id}] no existe. Nada que borrar`)
        res.status(404).send(`Prrofesion con id [${id}] no existe. Nada que borrar.`)
        return
    }

    // let usuarioAutenticado = req.user.username
    // if (profesionABorrar.dueño !== usuarioAutenticado) {
    //     log.info(`Usuario [${usuarioAutenticado}] no es dueño de producto con id [${id}]. Dueño real es [${profesionABorrar.dueño}]. Request no será procesado`)
    //     res.status(401).send(`No eres dueño de Prrofesion con id [${id}]. Solo puedes borrar productos creados por ti.`)
    //     return
    // }

    try {
        let profesionBorrada = await profesionController.borrarProfesion(id)
        log.info(`Profesion con id [${id}] fue borrado`)
        res.json(profesionBorrada)

    } catch (err) {
        res.status(500).send(`Error ocurrió borrando Profesion con id[ ${id}]`)
    }
})

module.exports = profesionesRouter