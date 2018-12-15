const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('express-cors')

const productosRouter = require('./api/recursos/productos/productos.routes')
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes')
const profesionesRouter = require('./api/recursos/profesiones/profesiones.routes')
const examenesRouter = require('./api/recursos/examenes/examenes.routes')

const logger = require('./utils/logger')
const authJWT = require('./api/libs/auth')
const config = require('./config')
const errorHandler = require('./api/libs/errorHandler')

passport.use(authJWT)

mongoose.connect('mongodb://127.0.0.1:27017/vendetucorota', { useNewUrlParser: true })
mongoose.connection.on('error', () => {
    logger.error('falló la conexion a mongodb')
    process.exit(1)
})

const app = express()
app.use(bodyParser.json())

app.use(cors({
    allowedOrigins: [
        'http://localhost:9000', 'localhost'
    ]
}))

app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use(passport.initialize())

app.use('/usuarios', usuariosRouter)
app.use('/productos', productosRouter)
app.use('/profesiones', profesionesRouter)
app.use('/examenes', examenesRouter)

app.use(errorHandler.procesarErroresDeDB)
if (config.ambiente === 'prod') {
  app.use(errorHandler.erroresEnProducción)
} else {
  app.use(errorHandler.erroresEnDesarrollo)
}



app.listen(config.puerto, () => {
    logger.info(`Corriendo en el puerto ${config.puerto}.`)
})