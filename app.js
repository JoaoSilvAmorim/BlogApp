// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const router = require('./routes/admin')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//configuraçoes 
//sessao
app.use(session({
    secret: "cursodenode",
    resave: "true",
    saveUninitialized: true
}))
//flash
app.use(flash())

//middelawe
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
// body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// mongoose
mongoose.connect('mongodb://localhost:27017/blogapp', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado ao mongo")
}).catch((erro) => {
    console.log("Erro" + erro)
})
//
app.use(express.static(path.join(__dirname, "public")))
//rotas

app.use('/admin', admin)









// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servido rodando!!!")
})