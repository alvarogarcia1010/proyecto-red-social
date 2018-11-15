//credenciales de conexion a la base de datos
module.exports = {
    mongodb:
    {
        URI: 'mongodb://localhost/ayuda_un_peludo',
        user: '',
        password:'',
        server:'localhost',
        db: 'ayuda_un_peludo'
    },
    sessionSecret: 'ayudaUnPeludo',
    email:
    {
        email: 'ayudaunpeludoprueba@gmail.com',
        password: 'peludo1234'
    },
    facebook:
    {
        id:'2244999985824962',
        secret: '2d1b0a70a89ab4d60cb3613644e3a7e0'
    },
    google:
    {
        idG:'437924089720-ebua0bcp3vd9gb69s5il3i5uug01nn9n.apps.googleusercontent.com',
        secretG: 'm8xh-lQGgL-Gf-LihyLymkkH'
    },
}
