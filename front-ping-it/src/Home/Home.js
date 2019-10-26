import React, { Component } from 'react';

import './Home.css';
import logo from '../logo_blanc.svg';

import {Link} from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    //Affiche connexion réussie si isLogin passe de false à True
    /* if(this.props.isLogin != nextProps.isLogin && nextProps.isLogin == true){
      alert('Connexion réussie !');
    } */
  }

  render() {
    return (
        <div className="img">
          <div className='pingit'>
            <img src={logo} className="logo" alt="logo" />
            <span className="main-text">Ping-It</span>
            
            <div className="link-bar">
              {this.props.isLogin ? (
                <Link  to="/dashboard">
                  <span className="link-text">Dashboards</span>
                </Link>
              ) : (
                <Link  to="/login" >
                  <span className="link-text">Se Connecter</span>
                </Link>
              )} 

              <Link  to="/agent" >
                  <span className="link-text">Agent ping it</span>
              </Link>
            </div>
           
          </div>
         
        </div>
    )
  }
}

export default Home;