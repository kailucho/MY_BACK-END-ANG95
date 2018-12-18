const Usuario = require('./loginusuarios.model')

function obtenerUsuarios() {
    return Usuario.find({})
}

function crearUsuario(usuario, hashedPassword) {
    return new Usuario({
        ...usuario,
        password: hashedPassword
    }).save()
}

function usuarioExiste(username, email) {
    return new Promise((resolve, reject) => {
        Usuario.find().or([{
                'username': username
            }, {
                'email': email
            }])
            .then(usuarios => {
                resolve(usuarios.length > 0)
            })
            .catch(err => {
                reject(err)
            })
    })
}

function obtenerUsuario({
    username: username,
    id: id
}) {
    if (username) return Usuario.findOne({
        username: username
    })
    if (id) return Usuario.findById(id)
    throw new Error("Función obtener usuario del controller fue llamada sin especificar username o id.")
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    usuarioExiste,
    obtenerUsuario
}