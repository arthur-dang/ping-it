import React, { Component } from 'react';
import './Dashboards.css'

import {Link} from 'react-router-dom';
/* import Test from '../Test/Test' */
//import Metriques from '../Metriques/Metriques'
/* import { BrowserRouter as Router, Route } from 'react-router-dom' */
//import Ajout from '../Ajout/Ajout'
import axios from 'axios'
import DnD from '../DnD/DnD'
//import Graphes from '../Graphes/Graphes'
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Dashboards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
            machine: '',
            mesmachines: [],
            user: this.props.user,
            copied: false
        };
        this.gotodash = this.gotodash.bind(this);
        this.goback = this.goback.bind(this);
        this.DashMachine = null;
    }

    //Au montage du component, récupère les maachines de l'user
    componentDidMount() {
        this.getmachine();
    }

    componentWillReceiveProps(nextProps) {
        //Problème avant parce que quand recevait le nouveau props avec l'user, n'appelait pas getMachine et le component se mountait avant de recevoir le props
        if (nextProps.user !== this.state.user) {
            this.setState({ user: nextProps.user }, () => {
                this.getmachine();
            });
        }
    }

    //Affichage des machines disponibles et cliquer pour afficher les graphes de cette machine
    affichage(machine) {
        //const chemin = '/ip/' + machine.ip
        return (
            <div className="element">
                <span className="cbutton" value={machine} onClick={() => this.gotodash(machine)}>   <i class="fas fa-server"></i>   {' '+machine.nom}  /  {machine.ip}  </span>
              
            </div>
        );
    }
    // <button className="cbutton" value={machine.ip} onClick={() => this.gotodash(machine.ip)}>  {machine.nom} <p> {machine.ip} </p> </button>
    //<a className="cbutton" href={chemin}> {machine.nom} <p> {machine.ip} </p> </a>
    //<Route path={chemin}  render={(props) => <Metriques machine={machine} {...props} />} />

    gotodash(m) {
        this.setState({ showComponent: true });
        this.setState({ machine: m });
    }
    goback() {
        this.setState({ showComponent: false });
        this.getmachine();
    }
    getmachine() {
        this.setState({ mesmachines: [] })
        //Récupère les IPmachines de l'user à partir de son email
        console.log(this.state.user.email)
        axios.post('/back/sql/IPbyEmail/', { "email": this.state.user.email })
            .then(res => {
                this.setState({ mesmachines: res.data })
            }); // [{"ip":"lol","nom":"ok"}]  this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
    }

    render() {
        const machine = this.state.mesmachines;
        /* console.log('m : ' + typeof this.state.mesmachines) */
        // {machine.map(m => this.affichage(m))}
        /* console.log('ut dash : ' + this.props.user) */
        let form
        if (this.props.isLogin) {  // si il est log 
            if(this.state.mesmachines.length==0){// si il n'a pas de machine
                form=(
                    <section className="section">
                        <div className="ajoutmachine">  
                            <h1 className="page-title">Dashboards</h1>
                            
                            <h2> Aucune machine à afficher.</h2>
                            <p>  Pour ajouter une machine : <Link  to="/ajoutmachine"> <span>Ajouter une machine</span> </Link></p>
                        </div>
                    </section>
                );
            }else{// si il a des machines
                form = (
                <section className="section">
                    <div className="dashoard section">
                       
                        <div  >
                            {!this.state.showComponent ?
                            <div> 
                             <h1 className="page-title">Dashboards</h1>
                                <div className="machines" id="conteneur" >
                                    {machine.map(m => this.affichage(m))}
                                </div>  </div> : null}
    
                            {this.state.showComponent ? <div>
                                <h1 className="page-title">  {this.state.machine.nom}  /  {this.state.machine.ip} </h1>
                                <div className="buttonajout">
                                    <div class="button is-link is-outlined" onClick={this.goback}>
                                        <span class="icon">
                                        <i class="fas fa-arrow-left"></i>
                                        </span>
                                        <span>Retour à mes Dashboards </span>
                                    </div>
                                </div>
                                <div>
                                    <DnD user={this.state.user} machine={this.state.machine} />
                                </div>
                            </div> : null}
                        </div>
                    </div>
                </section>
                );
            }
            
      
          } else {// si il n'est pas log redirection au front
            
            this.props.history.push('/');
          }
        return (
            <section >
                <div>
                    {form}
                    { /* <UserList liste_users={this.state.liste_users} handleDeleteUsers={this.handleDeleteUsers}/> */}
                </div>
            </section>
           
        );
    }
}
// <Metriques machine={this.state.machine} user={this.props.user} /> 
//     

export default Dashboards;

/*
 {!this.state.showComponent ?
                    <div id="conteneur" >
                        {machines.map(machine => this.affichage(machine))}
                    </div> : null}

                {this.state.showComponent ? <div>
                 
                     <button className="cbutton"    onClick={this.goback} > Retour a mes Dashboardss </button> 
                     <div>  <Test ip_pass={this.state.ip} /> </div>
                     </div>  : null}


                      <Router>


                    <div id="conteneur" >
                        {machines.map(machine => this.affichage(machine))}
                    </div>

            
                </Router>

*/