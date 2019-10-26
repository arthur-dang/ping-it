
/* plus utilisé*/
import React, { Component } from 'react';
import axios from 'axios'
import './Ajout.css'
class Ajout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: '',
            ip:'',
          mails: '', // test
          user:''
        };
        this.state.user=this.props.user
       this.handleChange=this.handleChange.bind(this)
       this.ajouter_ip=this.ajouter_ip.bind(this)
       
      }
      handleChange(event){
        const target = event.target;
        const name = target.name;
    
        this.setState({[name]: event.target.value});
      }

ajouter_ip(){
    console.log(this.state.ip,this.state.mails,this.state.nom,this.state.user)
    axios.post('/back/sql/ajoutIP/', { "IPmachine":this.state.ip,"nom":this.state.nom,"email":this.state.mails,"username":this.state.user})

    .then(res => console.log(res.data)); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
   
}
  render() {
    
    return (
    
        <div className="aj">    
        
     <form className="form-inline" onSubmit={this.handleRegister}>

<div className="form-group mb-2">
  <label> IP Machine </label> 
  <input type="text" name="ip" className="form-control" value={this.state.ip} onChange={this.handleChange} placeholder="ex : 0.0.0.0" />
</div>

<div className="form-group mx-sm-3 mb-2">
  <label>Nom Machine </label> 
  <input type="text" name="nom" className="form-control" value={this.state.nom} onChange={this.handleChange} placeholder="ex : DTY" />
</div>

<div className="form-group mx-sm-3 mb-2">
  <label>Email </label>
  <input type="text" name="mails" className="form-control" value={this.state.mails} onChange={this.handleChange}  placeholder="ex : dty@dty.dty"/>
</div>



<button type="button" className="btn btn-primary" onClick={this.ajouter_ip}> Ajouter</button>
</form> 
  
          
          
           </div>
    
    );
  }
}

export default Ajout;

