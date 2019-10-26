//------------- Premier component comprtant la Navbar et les routes pour afficher les autres pages, ainsi que le statut de connexion et info de l'user ---------------
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import axios from 'axios';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Login from './Login/Login';
import Register from './Login/Register';
import Deconnexion from './Login/Deconnexion';
import Dashboards from './Dashboards/Dashboards';
import Recup from './Recup/Recup';
import Oublier from './Recup/Oublier';
import Home from './Home/Home';
import infoAgent from './infoAgent/infoAgent';
import MachinesAlert from './Alert/MachinesAlert';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
      user: {},
      copied: false,
      newtoken: false,
    };
    this.copied = this.copied.bind(this)
    this.newToken=this.newToken.bind(this)
  }

  //Vérifie le statue de connexion au chargement du component
  componentDidMount() {
    this.handleIsLogin();
  }

  //Mets à jour le state de isLogin en demandant au back si un user est connecté
  handleIsLogin = () => {
    //Renvoie un Promise pour avertir quand isLogin et User sont mis à jour pour lancer la redirection ensuite
    return new Promise( (resolve,reject) =>
      axios.get('/back/users/isLogin')
        .then(res => {
          this.setState({ isLogin: res.data.flag }, () => {
            this.handleProfile()
              .then( (res) => {
                resolve(res);
              })
          });
        })
    )
  };

  //Fonction pour récupérer les infos du profil de l'utilisateur connecté et les mettre dans le state
  handleProfile = () => {
    return new Promise( (resolve,rejet) => {
      if (this.state.isLogin) {
        axios.get('/back/users/profile')
          .then(res => {
            const user = res.data;
            this.setState({ user: user }, () => {
              resolve(true);
            } );
          })
      } 
    })  
  }

  //Méthode pour générer un nouveau token pour ajouter ses machines
  newToken(){
    axios.put('/back/users/updateToken',{"email":this.state.user.email})
      .then(res => {
        if(res.data.flag){
          this.handleProfile();
          this.setState({newtoken:true})
          this.forceUpdate()
        }
      })
  }

  //Méthode pour sauvegarder le token
  copied(value) {
    this.setState({ copied: value })
    this.setState({newtoken:false})
  }

  //Component pour la page d'ajout de machine en copiant le token de l'utilisateur, peut se mettre dans un autre fichier
  ajoutMachine = () => {
    return (
      <section className="section">
        <div className="ajoutmachine">
          <h2 className="page-title">Ajouter une machine</h2>
          <p>  Pour ajouter une machine, rentrez votre token dans les réglages de l'agent. Pout plus d'information : <Link to="/agent"> <span>Documentation de l'agent</span> </Link></p>
          <p> Votre token : <span className="token"> {this.state.user.token} </span> </p>
          {!this.state.copied ?
            <CopyToClipboard text={this.state.user.token} onCopy={() => this.copied(true)}>
              <button class="button is-primary">Cliquez pour copier le token </button>
            </CopyToClipboard> 
          : null}
          {this.state.copied ? <span style={{ color: 'red' }}>Copié</span> : null}
          <br></br>
          <br></br>
          <div>
            <h2> Vous pouvez également génerer un nouveau token.</h2>
            <p> Attention une fois le nouveau token géneré, les machines possédant l'ancien token ne pourront plus envoyer de métriques !</p>
            {!this.state.newtoken ? <button class="button is-danger is-outlined" onClick={this.newToken}>Génerer un nouveau token</button> : null}
            {this.state.newtoken ? <div class="button is-success is-outlined is-static  ">
              <span class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>nouveau token géneré !</span>
            </div> : null}
          </div>
        </div>
      </section>
    )
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {/* -------------- NAVBAR avec les liens vers les autres pages ----------------- */}
            <nav className=" navbar  is-dark navbar-default " >

              {/* Logo et Titre Ping-it */}
              <div className="navbar-brand">
                <div className="navbar-item">
                  <Link to="/" className="link">
                    <img className="App-logo" src={logo} alt="logo" />
                  </Link>
                  <Link to="/" className="link">
                    <h1 className="App-title">Ping-It</h1>
                  </Link>
                </div>
              </div>

              <div className="navbar-end">
                {/* Link Dashboard quand connecté */}
                {this.state.isLogin &&
                <div className="navbar-item item">
                  <Link to="/dashboard" className="link">
                    <span className="icon"><i className="fas fa-chart-bar"></i></span>
                    <span>Dashboards</span>
                  </Link>
                </div>}
                  
                {/* Link Alert quand connecté */}
                {this.state.isLogin && 
                <div className="navbar-item item">
                <Link to="/alert" className="link">
                    <span className="icon"><i className="fas fa-exclamation-triangle"></i></span>
                    <span>Alert</span>
                  </Link>
                </div>}

                {/* Link Login quand pas connecté */}
                {!this.state.isLogin &&
                <div className="navbar-item item">
                  <Link to="/login" className="link">
                    <span className="icon"><i className="fas fa-sign-in-alt"></i></span>
                    <span>Se connecter</span>
                  </Link>
                </div>}
                
                {/* Link Création de compte quand pas connecté */}
                {!this.state.isLogin &&
                <div className="navbar-item item">
                  <Link to="/register" className="link">
                    <span className="icon"><i className="fas fa-plus-circle"></i></span>  
                    <span>Créer un compte</span>
                  </Link>
                </div>}

                {/* Link quand n'est pas connecté (recupération de mdp) */}
                {!this.state.isLogin &&
                <div className="navbar-item item ">
                  <Link to="/oublier" className="link">
                    <span className="icon"><i className="fas fa-key"></i></span>
                    <span>Mot de passe oublié</span>
                  </Link>
                </div>}

                {/* Link quand est connecté (ajouter une machine)*/}
                {this.state.isLogin &&
                <div className="navbar-item item " onClick={() => this.copied(false)}>
                  <Link to="/ajoutmachine" className="link" >
                    <span className="icon"><i className="fas fa-plus-circle"></i></span>
                    <span>Ajouter une machine</span>
                  </Link>
                </div>}

                {/* Link quand est connecté (déconnexion)*/}
                {this.state.isLogin &&
                <div className="navbar-item deconnexion  ">
                  <Link to="/" className="link">
                    <Deconnexion handleIsLogin={this.handleIsLogin} />
                  </Link>
                </div>}

              </div>
            </nav>
          </header>
          
          {/* Affichage des pages selon la route */}
          <Switch>
            
            {/* Les différentes routes */}
            <Route name="home" exact path="/" render={(props) => (<Home {...props} isLogin={this.state.isLogin} />)} />
            <Route name="agent" path="/agent" component={infoAgent} />

            {this.state.isLogin ? <Route name="dashboard" path="/dashboard" render={(props) => (<Dashboards {...props} user={this.state.user} isLogin={this.state.isLogin} />)} /> : null}
            {this.state.isLogin ? <Route name="ajoutmachine" path="/ajoutmachine" component={this.ajoutMachine} /> : null}
            {this.state.isLogin ? <Route name="alert" path="/alert" render={(props) => (<MachinesAlert {...props} user={this.state.user} isLogin={this.state.isLogin} />)} /> : null}

            {!this.state.isLogin ? <Route name="login" path="/login" render={(props) => (<Login {...props} isLogin={this.state.isLogin} handleIsLogin={this.handleIsLogin} />)} /> : null}
            {!this.state.isLogin ? <Route name="register" path="/register" render={(props) => (<Register {...props} isLogin={this.state.isLogin} handleIsLogin={this.handleIsLogin} />)} /> : null}
            {!this.state.isLogin ? <Route name="oublier" path="/oublier" render={(props) => (<Oublier />)} /> : null}
            {!this.state.isLogin ? <Route name="recuperation" path="/recuperation/:t" component={Recup} /> : null}

            <Route path="*" component={redirection} />
          </Switch>
        </div>
      </Router>
    );
  }
}

//Component de redirection à l'accueil lorsque la page recherchée n'existe pas
function redirection() {
  return <Redirect to='/' />
}

export default App;

