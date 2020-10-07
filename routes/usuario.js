const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get("/registro", (req, res) => {
    res.render("../views/usuarios/registro.handlebars")
})

router.post("/registro", (req, res) => {
    var erros = []

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
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){ 
        erros.push({texto: "As senhas não coincidem"})

    } 
    
    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros })
    } 
    
    else {

        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Email ja existe")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                }
                
               new Usuario(novoUsuario).save().then(() => {
                    req.flash("success_msg", "Usuario cadastrado com sucesso")
                    res.redirect("/")
        
                }).catch((erro) => {
                    req.flash("error_msg", "Erro ao cadastrar usuario")
                    res.redirect("/usuarios/registro")
                })

                /*bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Erro ao salvar")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash;
                        novoUsuario().save().then(() => {
                            req.flash("success_msg", "Usuario cadastrado com sucesso")
                            res.redirect("/")
                
                        }).catch((erro) => {
                            req.flash("error_msg", "Erro ao cadastrar usuario")
                            res.redirect("/usuarios/registro")
                        })


                    })
                })*/

            }

        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })


    }

})

router.get("/login", (req, res) => {
    res.render("../views/usuarios/login.handlebars")
})
/*
router.post("/login", (req, res) => {
    //Usuario.findOne({email: req.body.email, senha: req.body.senha})
})*/

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})




module.exports = router