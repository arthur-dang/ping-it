import React, { Component } from 'react';
import axios from 'axios';

class Recup extends Component {
  constructor(props){
    super(props);

    this.state = {
      token :this.props.location.search.substr(1),
      password:'',
      confirm_password:'',
      modif:false,
      pswvalid:false,
      pswok:false,
      time:true,
      load:false,
    };
    this.handleChange=this.handleChange.bind(this);
    this.modifpsw=this.modifpsw.bind(this);
    this.handlepsw=this.handlepsw.bind(this)
    this.handleconfpsw=this.handleconfpsw.bind(this)
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({ [name]: event.target.value });
  }
  modifpsw(){
      console.log(this.state.password,this.state.confirm_password)
    if(this.state.password===this.state.confirm_password){
      if(this.validatePassword(this.state.password)){
        axios.post('/back/forgotpsw/reset/', { "token":this.state.token, "password":this.state.password})
        .then(res=>{
          if(res.data.time){
            if(res.data.flag){this.setState({modif: true})}
            else{
            }
          }else{
            this.setState({time: true})
            this.setState({load: false})
          }
          
        }); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
        
      }else{
        this.setState({pswok: true})
        this.setState({load: false})
      }
        

    }else{
        this.setState({pswvalid: true})
        this.setState({load: false})
    }

  }
  handlepsw(e){
    this.setState({password:e.target.value})
  }
  handleconfpsw(e){
    this.setState({confirm_password:e.target.value})
  }
  validatePassword(pw) {
    return /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw) &&
      pw.length >= 4;
  }

  render() {
  
    return (
<div> 
{ this.state.time? <div> 

  { this.state.modif? <div> mot de pass modifier </div> : null}
  {!this.state.modif? 
      <div>
      <h2 className="section-title">Modifier mot de pass</h2>
      <form onSubmit={this.modifpsw}>
        
      <div className="field">
          <p className="control has-icons-left">
  
            <input className="input" type="password"  value={this.state.password} onChange={this.handlepsw} placeholder="Password" />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
  
        </div>
        
        <div className="field">
          <p className="control has-icons-left">
  
            <input className="input" type="password" value={this.state.confirm_password} onChange={this.handleconfpsw} placeholder="Confirmer Password" />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
          { this.state.pswvalid?<p className="help is-danger">Les mot de pass sont différent</p>:null}
          { this.state.pswok?<p className="help is-danger">Le mot de passe doit contenir : une minuscule, une masjuscule, un chiffre et un caractère spécial</p>:null}
  
        </div>
        
      </form>
      { !this.state.load?  <div className="envoyer"><button className="button is-link is-rounded " onClick={this.modifpsw}>Envoyer</button> </div> :null}
    { this.state.load?  <div className="envoyer"><button className="button is-link is-rounded is-loading" >Envoyer</button> </div> :null}
    </div>
    :null}

</div> : null}


{ !this.state.time? <div> 

Le temps de validé de mofication de mot de pass à expirée
  
</div> : null}


    </div> 
    );
  }
}

export default Recup;

