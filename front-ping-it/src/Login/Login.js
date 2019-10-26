//--------- Page de Connexion au site Ping it -----------------------
import React, { Component } from 'react';

import Facebook from './Facebook';
import Google from './Google';

import {Link} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: false,
      passwordError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  //Change les valeurs de state pendant la frappe, controlled component, rajouter value="this.state.***" et onChange={handleChange} aux inputs
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  //Connecte l'user au site Ping-it en envoyant ses données rentrées dans le formulaire
  handleLogin(e) {
    e.preventDefault();
    this.setState({emailError: false, passwordError: false}); //Réinitialise à false au changement

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

    //POST avec cette méthode marche
    fetch('/back/users/login', {
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
                    this.props.history.push('/dashboard'); //Redirection à la page des graphes après connexion
                }
            })
        }else{
          this.setState({emailError: true});
        }
      })
  }

  render() {
    return (
      <section className="section">
        <h2 className="page-title">Se Connecter</h2>
        
        {/* Formulaire de Connexion au site Ping-it */}
        <form onSubmit={this.handleLogin} className="form">
          {!this.state.emailError ? ( 
            <div className="field">
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
            </div>
          )}

          {!this.state.emailError ? (
            <div className="field">
            <div className="control has-icons-left">
              <input className="input" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>
          ) : (
            <div className="field">
              <div className="control has-icons-left">
                <input className="input is-danger" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
              <p className="help is-danger">Email ou mot de passe invalide</p>
            </div>
          )}  
          
          <button className="button is-link is-rounded" onClick={this.handleLogin}>Connexion</button>
          <span className="right">Nouveau sur ping-it ? <Link to="/register">Créer votre compte</Link></span>

        </form>
        
        {/* Autre moyen de connexion par Facebook et Google */}
        <div className="api-login">
          <h2 className="section-title divider">ou connectez-vous avec </h2>
          <Facebook {...this.props} handleIsLogin={this.props.handleIsLogin}/>
          <Google  {...this.props} handleIsLogin={this.props.handleIsLogin}/>
        </div>

      </section>
    )
  }
}

export default Login;