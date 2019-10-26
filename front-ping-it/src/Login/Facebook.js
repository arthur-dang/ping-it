//------ Component du bouton de Connexion à Facebook qui Crée aussi le compte sur le site si il n'existait pas ------------
import React, { Component } from "react";

import './Authentification.css';

export default class Facebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false, //isLogin statut de connection à FB pas forcément à au site Ping-it
      profile: { id : "", name: "", image: "", email: ""},
      compte_exist:false,
      email:""
    };
  }

  componentDidMount() {
    //Charge le SDK de Facebook pour Javascript (developpement kit) puis lance l'initialisation de FB
    window.fbAsyncInit = () => {
      window.FB.init({
        appId            : '485715288572249',
        cookie           : true,
        xfbml            : true,
        version          : 'v3.1'
      });

      //LISTENER qui s'active sur changement de status (donnée interne, state de connexion fb et profil)
      window.FB.Event.subscribe('auth.statusChange', (response) => {
        if(response.status === "connected") {
          this.setState({ isLogin: true });
          this.handleProfile();
        } else {
          this.setState({ 
            isLogin: false,
            profile:{ id : "", name: "", image: "", email: "" } 
          });
        }
      });
    
      this.initializeFacebookLogin();
    };
    
    //Initialise le SDK
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/fr_FR/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  componentWillUnmount() {
    /* window.FB.Event.unsubscribe('auth.statusChange', () => {} ); */
  }
  
  //Méthode appelée après initialisation de l'objet facebook pour récupéré l'état et le profil de l'user
  initializeFacebookLogin = () => {
    /* console.log("Facebook ready"); */
    window.FB.getLoginStatus( (response) => {
      if (response.status === 'connected') {
        this.setState({ isLogin: true });
        this.handleProfile()
          .then( (email) => {
            this.sendToken()
           })
      } 
    });
  };

  //Récupère les données du profil à la connexion et envoie le token avec les infos de connexion au back pour le connecter au site
  handleProfile = () => {
    return new Promise((resolve) => {
      window.FB.api('/me', 'GET', {fields: 'id, name, picture, email'}, (response) => {
        const profile = { id : response.id, name: response.name, image: response.picture, email: response.email };
        //Quand l'email récupéré, l'envoie au back email
        this.setState({ profile : profile }, resolve(this.state.profile.email));
      });
    })
  };
  
  //Envoie le token de connexion à fb au back pour le connecter au sitePing)it
  sendToken = () => {
    window.FB.getLoginStatus( (response) => {
      //Récupère le token du user supposant connecté
      this.tokenEmail = {
        "userToken": response.authResponse.accessToken,
        "email": this.state.profile.email
      };
      //Requête au back en envoyant le token et l'email
      fetch('back/users/facebookAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.tokenEmail)
      })
        .then( (res) => {
          if(res.ok){
          //Si connexion ok, maj de isLogin global
          this.props.handleIsLogin() //Promise qui renvoie true quand isLogin et User sont mis a jour dans le state
            .then( (res) => {
                if(res) {
                    this.props.history.push('/dashboard'); //Redirection à la page des graphes après connexion 
                }
            })
          }else{
            this.setState({email:this.state.profile.email})
            this.setState({compte_exist:true})
            window.FB.logout( () => {
            });
          }
        })
    });
  }

  onSignIn = () => {
    window.FB.login( (response) => { 
      if(response.authResponse) {
        this.handleProfile() //Récupère le mail et envoie le token quand c'est bon
          .then( (email) => {
            this.sendToken()
          })
      } else {
        console.log("User cancelled login or did not fully authorize");
      } 
    }, {scope: 'public_profile, email'}); //donnée partagée par l'utilisateur à sa connexion
  }

  onSignOut = () => {
    window.FB.logout( () => {
    });
  };

  render() {
    let affichage;

    if (!this.state.isLogin) {
        affichage = (
          <div>
            <button type='button' className="loginBtn loginBtn--facebook" onClick={this.onSignIn}>Facebook</button>
            { this.state.compte_exist? <p className="help is-danger">Un compte ping existe déjà avec l'adress : {this.state.email}</p> :null }
          </div>
      );
    } else { //Affiche quand Facebook est connecté mais ne va pas s'afficher si aussi connecté sur Ping it
        affichage = (
          <div>
            <button type='button' className="loginBtn loginBtn--facebook" onClick={this.onSignOut}>Logout with Facebook</button>
          </div>
      );
    }

    return (
        <div style={{textAlign: 'center'}}>
            {affichage}
        </div>
    )       
  }
}
