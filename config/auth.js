const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios');

module.exports = function (passport) {

  passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
    
    Usuario.findOne({ email: email}).then((usuario) => {
    
      if (!usuario) {
        console.log("1")

        return done(null, false, { message: "Esta conta não existe" })
      }
      bcrypt.compareSync(senha, usuario.senha, (erro, batem) => {
        if (batem) {
          console.log("2")
          return done(null, usuario)

        } else {
          console.log("3")
          return done(null, false, { message: "senha incorreta" })

        }
      })

    })

  }))

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })

}


/*
module.exports = function(passport){
var passport = require('passport')
,LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email'}, {usernameField: 'senha'},
  (email, senha, done) => function(username, password, done) {
    Usuario.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
))
}*/