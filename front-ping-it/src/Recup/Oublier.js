import React, { Component } from 'react';
import axios from 'axios'
import './Oublier.css'
class Oublier extends Component {
  constructor(props){
    super(props);

    this.state = {
    
      mail:'',
      modif:false,
      emailvalid:false,
      load:false
    };
    this.handlemail=this.handlemail.bind(this);
    this.mail=this.mail.bind(this);

  }
 
  mail(){// envoi du mail 
    this.setState({load: true})
        axios.post('/back/forgotpsw/', { "email":this.state.email})
        .then((res)=>{
          if(res.data.flag){this.setState({modif: true})} // email valid
          else{
            this.setState({emailvalid: true}),this.setState({load: false}) // email non valid
          }
        
        }); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
       

  }
  handlemail(e){ // set le mail 
    this.setState({email:e.target.value})
  }
 

  render() {
  
    return (
      <section className="section"> 
        { this.state.modif? <div> Un lien vous a été envoyer</div> : null}
        {!this.state.modif ? 
          <div>
            <h2 className="section-title">Mot de passe oublié</h2>
            <form onSubmit={this.mail} style={{width: '80vw', marginLeft: 'auto', marginRight: 'auto'}}>
              
              <div className="field">
                  <p className="control has-icons-left">
                    <input className="input" type="email"  value={this.state.email} onChange={this.handlemail} placeholder="Email" />
                    <span className="icon is-small is-left"><i className="fas fa-envelope"></i></span>
                    <span className="icon is-small is-left">
                    </span>
                  </p>
                  {/* email non valid */}
                  { this.state.emailvalid?<p className="help is-danger">L'email n'est pas un compte ping it</p>:null}
              </div>
        
            </form>
            {/* email valid */}
            { !this.state.load?  <div className="envoyer"><button className="button is-link is-rounded " onClick={this.mail}>Envoyer</button> </div> :null}
            { this.state.load?  <div className="envoyer"><button className="button is-link is-rounded is-loading" >Envoyer</button> </div> :null}
          

          </div>
        :null}
    </section> 
    );
  }
}

export default Oublier;

