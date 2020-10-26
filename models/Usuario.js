const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: { 
        type: String,
        required: true
    },

    email: {
        type: String,
        reuqired: true
    },

    eAdmin: {
        type: String,
        default: 0
    },

    senha: {
        type: String,
        required: true,
        select: true
    },

    postagem: {
        type: Schema.Types.ObjectId,
        ref: 'postagens'
    }
})

mongoose.model("usuarios", Usuario)