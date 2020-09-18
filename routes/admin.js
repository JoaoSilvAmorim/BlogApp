const express = require('express')
const router = express()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req, res) => {
    res.render("../views/layouts/admin/index.handlebars")
})

router.get('/posts', (req, res) => {
    res.send("Pagina posts")
})

router.get('/categorias', (req, res) => {
    //res.render("../views/layouts/admin/categorias.handlebars") 
    Categoria.find().lean().then((categorias) => {
        {
            res.render('../views/layouts/admin/categorias.handlebars', { categorias: categorias })
        }
    }).catch((erro) => {
        req.flash("erro_msg", "Errou ao listar!!!")
        res.redirect("/admin")
    })

})

router.get('/categorias/add', (req, res) => {
    res.render("../views/layouts/admin/addcategorias.handlebars")
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render('../views/layouts/admin/editcategorias.handlebars', { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Essa categoria não existe!!!")
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria salva!!!")
            res.redirect('/admin/categorias')
        }).catch(() => {
            req.flash("error_msg", "Error ao editar1!!!")
        })

    }).catch((error) => {
        req.flash("error_msg", "Erro ao editar2")
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/nova', (req, res) => {
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug invalido" })
    }

    if (req.body.nome.length <= 2) {
        erros.push({ texto: "Slug invalido" })
    }

    if (erros.length > 0) {
        res.render("../views/layouts/admin/addcategorias.handlebars", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada!!!")
            res.redirect('/admin/categorias')
            console.log(erros)
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao criar categoria!!!")
            res.redirect("/admin")
        })
    }


})

module.exports = router