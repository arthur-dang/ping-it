import React, { Component } from 'react';
import axios from 'axios'

import './Machines.css'
class Machines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: '',
            ip:'',
          mails: [], 
          email:'',
          user:''
        };
        this.state.user=this.props.user
       
        this.state.nom=this.props.machine.nom;
        this.state.ip=this.props.machine.ip;
        this.mail();
        this.updateNom=this.updateNom.bind(this)
        this.changnom=this.changnom.bind(this)
        this.updateMail=this.updateMail.bind(this)
        this.changemail=this.changemail.bind(this)
        this.suprmachine=this.suprmachine.bind(this)
       
      }

    mail(){
        axios.post('/back/mail/getMailofIPmachine', { "IPmachine":this.state.ip})
        .then(res => this.setState({ email: res.data.email})); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
       
    }
    changnom(){
        axios.put('/back/sql/updateNom', { "IPmachine":this.state.ip,"nom":this.state.nom})
        .then(res => this.setState({ nom: res.data.nom })); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
         
    }
    changemail(){
      this.changnom()
      console.log(this.state.ip,this.state.email)
      axios.put('/back/mail/updateMail', { "IPmachine":this.state.ip,"email":this.state.email})
      .then(res => this.setState({ mails: res.data.email })); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
     
    }
    suprmachine(){
      axios.post('/back/sql/deleteMachine', { "IPmachine":this.state.ip})
        .then(res => res); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
       
    }
    updateNom(evt){
        this.setState({
            nom: evt.target.value
          });
          
          
    }
    updateMail(evt){
      this.setState({
          email: evt.target.value
        });
        
        
  }
  render() {
    console.log('ip mach : '+this.state.ip)
    return (
      <section className="section"> 
      <div className="reg">
         
          <div> 
<h1> Modifier le nom de votre machine :{this.state.nom}</h1>
<div className="imp"> 
<input className="form-control" value={this.state.nom} onChange={this.updateNom}/>
</div>


          </div>

                   <div> 
<h1> Modifier l'email : {this.state.email}</h1>
<div className="imp">
<input className="form-control" value={this.state.email} onChange={this.updateMail}/>
 </div>

<button className="btn btn-primary" onClick={this.changemail}> ok </button>


          </div>
         

      </div>
      <div className="sup"> 
          <button className="btn btn-danger mx-sm-3 mb-2" onClick={this.suprmachine}> Suprimer  </button>
          </div>
        
      </section>
    );
  }
}

export default Machines;

