//--------------- Page pour se créer un compte sur Ping-it -------------------
import React, { Component } from 'react';
import Facebook from './Facebook';
import Google from './Google';

import {Link} from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      emailError: false,
      passwordError: false,
      exist:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  //Méthode pour mettre à jour le state sur saisie des données
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  //Méthode pour créer un compte en envoyant les données rentrées dans le formulaire au back, vérifie la conformité des données
  handleRegister(e) {
    e.preventDefault();

    this.setState({emailError: !this.validateEmail(this.state.email)}, ()=>{
      console.log(this.state.emailError);
    });

    this.setState({passwordError: !this.validatePassword(this.state.password)}, ()=>{
      console.log(this.state.passwordError);
    });

    if (this.validateEmail(this.state.email) && this.validatePassword(this.state.password)) {

      //POST pour envoyer le nouveau user au back
      var details = {
        'email': this.state.email,
        'password': this.state.password
      };

      let user = []; //body envoyé sous format x-www-urlencoded
       
      for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        user.push(encodedKey + "=" + encodedValue);
      }
      user = user.join("&");
    
      //POST 
      fetch('/back/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: user
      })
        .then((res) => {
          if(res.ok){
            this.props.handleIsLogin() //Promise qui renvoie true quand isLogin et User sont mis a jour dans le state
              .then( (res) => {
                  if(res) {
                      this.props.history.push('/dashboard'); //Redirection sur la page des graphes à la connexion
                      alert("Votre compte a bien été crée !");
                  }
              })
          }else{
            this.setState({exist:true})
          }    
        });
    }
  }

  //Méthode pour vérifier la conformité de l'email rentrée
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
  }

  //Méthode pour vérifier la conformité du mot de passe rentrée (4 caractère dont 1min, 1maj, 1chiffre, 1symbole)
  validatePassword(pw) {
    return /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw) &&
      pw.length >= 4;
  }

  render() {
    return (
      <section className="section">
        <h2 className="page-title">Créer un compte</h2>

        {/* Formulaire pour se créer un compte sur ping-it */}
        <form onSubmit={this.handleRegister} className="form">

        {!this.state.emailError ? (
          <div className="field">
          {this.state.exist?<p className="help is-danger">Un compte ping-it existe deja avec cet email</p> :null }
          <div className="control has-icons-left has-icons-right">
            <input className="input" type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" autoComplete="off" />
            <span className="icon is-small is-left"><i className="fas fa-envelope"></i></span>
            <span className="icon is-small is-right"><i className="fas fa-check"></i></span>
          </div>
        </div>
        ) : (
          <div className="field">
            <div className="control has-icons-left has-icons-right">
              <input className="input is-danger" type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" autoComplete="off" />
              <span className="icon is-small is-left"><i className="fas fa-envelope"></i></span>
              <span className="icon is-small is-right"><i className="fas fa-check"></i></span>
            </div>
            <p className="help is-danger">Email invalide</p>
          </div>
        )}
          
        {!this.state.passwordError ? (
          <div className="field">
            <div className="control has-icons-left">
              <input className="input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
              <span className="icon is-small is-left"><i className="fas fa-lock"></i></span>
            </div>
            <p className="help">Le mot de passe doit contenir : une minuscule, une masjuscule, un chiffre et un caractère spécial</p>
          </div>
        ) : (
          <div className="field">
            <div className="control has-icons-left">
              <input className="input is-danger" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
              <span className="icon is-small is-left"><i className="fas fa-lock"></i></span>
            </div>
            <p className="help">Le mot de passe doit contenir : une minuscule, une masjuscule, un chiffre et un caractère spécial</p>
            <p className="help is-danger">Mot de passe invalide</p>
          </div>
        )}

          <input type="submit" className="button is-link is-rounded" value="Register" />
          <span className="right">Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link> </span>

        </form>
        
        {/* Création de compte par facebook et google (sachant que c'est le même component pour créer et se login car fb crée un compte ping-it si il n'existait pas) */}
        <div className="api-login">
          <h2 className="section-title divider">ou créer un compte avec </h2>
          <Facebook {...this.props} handleIsLogin={this.props.handleIsLogin}/>
          <Google  {...this.props} handleIsLogin={this.props.handleIsLogin}/>
        </div>

      </section>
    )
  }
}

export default Register;




