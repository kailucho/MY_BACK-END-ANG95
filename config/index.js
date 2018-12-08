const ambiente = process.env.NODE_ENV || 'development'

const configuraciónBase = {
  jwt: {},
  puerto: 3000,
  suprimirLogs: false
}

let configuraciónDeAmbiente = {}

switch (ambiente) {
  case 'desarrollo':
  case 'dev':
  case 'development':
    configuraciónDeAmbiente = require('./dev')
    break
  case 'producción':
  case 'prod':
    configuraciónDeAmbiente = require('./prod')
    break
  case 'test':
    configuraciónDeAmbiente = require('./test')
    break
  default:
    configuraciónDeAmbiente = require('./dev')
}

module.exports = {
  ...configuraciónBase,
  ...configuraciónDeAmbiente
}