//---------- Component du bouton de déconnexion simultanée du site, Facebook et Google ----------------
import React, { Component } from 'react';

import axios from 'axios'

import { withRouter } from "react-router";

import './Authentification.css';

/* global gapi */

class Deconnexion extends Component {
  constructor(props) {
    super(props);
    this.handleDeconnexion = this.handleDeconnexion.bind(this);
  }
  
  //Callback du bouton de déconnexion
  handleDeconnexion() {
    //Déconnexion Ping it
    axios.post('/back/users/logout', {})
      .then(res => {
        this.props.handleIsLogin();
        this.props.history.push('/');
      });

    try { // ! try catch sur la deconexion facebook
      //Déconnexion Facebook
      window.FB.getLoginStatus( (response) => {
        if (response.status === 'connected') {
          window.FB.logout( () => {} );
        } 
      });
    } catch (error) {
      console.log('error facebook : '+error)
    }
    
    //Déconnexion Google
    try {
      this.googleAuth = gapi.auth2.getAuthInstance();
      this.googleUser = this.googleAuth.currentUser.get();
      if(this.googleUser.isSignedIn()) {
        this.googleAuth.signOut().then( () => {});
      };
    } catch(error) {
      console.log('eror google: '+error)
    }
  }

  render() {
    return (
      <div >
        <button type="button" className="button is-danger" onClick={this.handleDeconnexion}>
          <span className="icon deconnexion-icon"><i className="fas fa-sign-out-alt"></i></span>
          Déconnexion
        </button>
      </div>
    )
  }
}

export default withRouter(Deconnexion);