//------ Component du bouton de Connexion à Google qui crée aussi le compte sur le site si il n'existait pas ------------
import React, {Component} from 'react';

import './Authentification.css';

/* global gapi */

class Google extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile : { id : "", name : "", image : "", email: ""},
            isLogin : false, //Etat de connexion à google pas forcément au site Ping-it (en props)
            compte_exist: false,
            email:""
        }
    }

    componentDidMount() {
        //Load le script pour charger le google api platform library
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;
        script.defer = true;
        script.id = "googleEvent";
        script.addEventListener('load', this.onLoadCallback);
        document.head.appendChild(script);
    };

    componentWillUnmount() {
            document.getElementById("googleEvent").removeEventListener('load', () => {} );
    }

    onLoadCallback = () => {
        //Charge la librairie gapi auth2
        gapi.load('auth2', () => { 
            this.initializeGoogleLogin();
        });
    };

    //Après importation des objets et librairies google, récupère le statut de connexion et le profil de l'user
    initializeGoogleLogin = () => {
        /* console.log('google ready'); */
        gapi.auth2.init({
            client_id: '104679163324-93ufgs40atd6p2bruhh01gm8h2tf97e6.apps.googleusercontent.com'
        })
        .then( () => {
            this.googleAuth = gapi.auth2.getAuthInstance();
            this.googleUser = this.googleAuth.currentUser.get();
            //Regarde si est déjà connecté et prends les infos users si oui
            this.setState({isLogin : this.googleUser.isSignedIn()})
            if(this.googleUser.isSignedIn()) {
                //Récupère les données utilisateurs
                const profile = this.googleUser.getBasicProfile();
                const state_profile = { id : profile.getId(), name : profile.getName(), image : profile.getImageUrl(), email : profile.getEmail() };
                this.setState({profile: state_profile});

                //Connecte à Ping it si déjà connecté
                this.sendToken();
            }
            
            //Listener qui fait la fonction callback sur changement d'état de connexion (isLogin interne à google)
            this.googleAuth.isSignedIn.listen( (boolean) => {
                if(boolean){
                    this.setState({isLogin : this.googleUser.isSignedIn()})
                    //Récupère les données utilisateurs
                    const profile = this.googleUser.getBasicProfile();
                    const state_profile = { id : profile.getId(), name : profile.getName(), image : profile.getImageUrl(), email : profile.getEmail()
                    };
                    this.setState({profile: state_profile});
                } else {
                    this.setState({
                        isLogin: this.googleUser.isSignedIn(),
                        profile: { id : "", name : "", image : "", email: ""
                        }
                    });
                }
            });
        })
    };

    onSignIn = () => {
        this.googleAuth.signIn()
            .then( () => {
                this.sendToken();
            });
    }   

    //Envoie le token de connexion de google au back pour le connecter au site Ping-it
    sendToken = () => {
        const id_token = "idtoken="+this.googleUser.getAuthResponse().id_token;
        fetch('back/users/googleAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                },
            body: id_token
        })
        .then( (res) => {
            if(res.ok){
                //Si connecté à Ping it ok, met à jour le status de connexion et de user global
                this.props.handleIsLogin() //Promise qui renvoie true quand isLogin et User sont mis a jour dans le state
                    .then( (res) => {
                        if(res) {
                            this.props.history.push('/dashboard'); //Redirection ) la page des graphes après connexion 
                        }
                    })
            } else {
                this.setState({email:this.state.profile.email})
                this.setState({compte_exist: true})
                this.googleAuth.signOut().then( () => {});
            }
        });
    }

    onSignOut = () => {
        this.googleAuth.signOut().then( () => {
        });
    };

    getInfo = () => {
        console.log(this.state.profile);
    };

    isSignedIn = () => {
        console.log(this.state.isLogin);
    };

    render() {
        let affichage;
        
        if (!this.state.isLogin) {
            affichage = (
                <div>
                    <button type="button" className="loginBtn loginBtn--google" onClick={this.onSignIn}>Google</button>
                    { this.state.compte_exist? <p className="help is-danger">Un compte ping existe déjà avec l'adresse : {this.state.email}</p>:null}
                </div>
            );
        } else {
            affichage = ( //Affiche si connecté sur Google mais ne s'affichera pas si aussi connecté à Ping-it (pour voir si pb)
                <div>
                    <button type="button" className="loginBtn loginBtn--google" onClick={this.onSignOut}>Logout with google</button>
                    <button type="button" className="button is-info" onClick={this.getInfo}>INFO</button>                    
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

export default Google