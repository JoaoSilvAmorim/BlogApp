const express = require('express')
const router = express() 
const mongoose = require('mongoose')

require("../models/Categoria")
const Categoria = mongoose.model("categorias")

require("../models/Postagem")
const Postagem = mongoose.model("postagens")


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

router.post('/categorias/deletar', (req, res) => {
 
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', "Deletado")
        res.redirect('/admin/categorias')
    }).catch((error) => {
        req.flash('err_sucsess', 'Erro ao deletar')
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
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao criar categoria!!!")
            res.redirect("/admin")
        })
    }


})


router.get("/postagens", (req, res) => {

    Postagem.find().lean().populate("categoria").then((postagens) => {
        res.render("../views/layouts/admin/postagens.handlebars", {postagens: postagens})
    }).catch((error) => {
        
    })
   
})

router.post("/postagens/deletar", (req, res) => {
    
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao deletar postagem")
        res.redirect("/admin/postagens")
    })

})



router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("../views/layouts/admin/addpostagem.handlebars", { categorias: categorias })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao carregar formualrio!!!")
        res.redirect("/admin")
    })

}) 


router.post("/postagens/nova", (req, res) => {
    var erros = []
    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria invalida, registre uma categoria" })
    }
    if (erros.length > 0) {
        res.render("../views/layouts/admin/addpostagem.handlebars", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem cadastrada com sucesso!!!")
            res.redirect("/admin/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao criar postagens!!!")
            res.redirect("/admin/postagens")
        })
    }
})





module.exports = router