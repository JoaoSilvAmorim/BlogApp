const express = require('express')
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require('../models/Categoria')
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model('postagens')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get("/registro", (req, res) => {
    res.render("../views/usuarios/registro.handlebars")
})

router.post("/registro", (req, res) => {
    var erros = []
    var senhahash = req.body.senha
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(senhahash, salt)



    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido" })
    }


    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email invalido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha invalida" })
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas não coincidem" })

    }

    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros })
    }

    else {

        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Email ja existe")
                res.redirect("/usuarios/registro")
            } else {


                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                }


                novoUsuario.senha = hash
                new Usuario(novoUsuario).save().then(() => {
                    req.flash("success_msg", "Usuario cadastrado com sucesso")
                    res.redirect("/")

                }).catch((erro) => {
                    req.flash("error_msg", "Erro ao cadastrar usuario")
                    res.redirect("/usuarios/registro")
                })

            }

        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })


    }

})

router.post('/delete', (req, res) => { 
    Usuario.deleteOne({_id: req.body.id}).then(() =>{
        req.flash('success_msg', 'Deletado')
        res.redirect('/login')
    }).catch(() => {
        req.flash('error_msg', 'Error ao deletar usuario')
        res.redirect('/')
    })
})

router.get('/home', (req, res) => {
    res.render("../views/usuarios/home.handlebars")
})


router.get("/login", (req, res) => {
    res.render("../views/usuarios/login.handlebars")
})



router.post("/login", (req, res) => {

    var email = req.body.email
    var senha = req.body.senha 

    Usuario.findOne({email: req.body.email}, 'nome senha email _id', function(err, usuario){
        
        if (usuario != undefined) {
  
            //fazendo hash
            var correct = bcrypt.compareSync(senha, usuario.senha)

                   if (correct) {

                      //usuario que sera renderizado na home
                     const user = {
                          nome: usuario.nome,
                          id: usuario._id
                      }
       
                       req.session.usuario = {
                           id: usuario._id,
                           email: usuario.email
                       }

                    Categoria.find({}, 'nome', function(err, categorias) {

                        res.render('../views/usuarios/home.handlebars', {user: user, categorias: categorias})

                    }).lean()
                
       
                   } else {
                       res.redirect("/usuarios/login")
                   }
               } else {
                   res.redirect("/usuarios/login")
               } 
               
               
        
    })
})


router.get('/posts', (req, res) => {
    Postagem.findOne({titulo: 'teste'}).populate('usuario').exec((err, usuarios) => {
        console.log('lala: ' + usuarios.usuario.nome)

       // res.render('../views/usuarios/usuariosposts.handlebars', {postagem: postagem})
    }) 
}) 



module.exports = router