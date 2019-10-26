// affichage des services et des metriques

import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import axios from 'axios'

class NavMetrique extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: [],
      navKey: 0, // navigation des services,
      container:[]
    };
    this.handleSelect = this.handleSelect.bind(this)
    this.getService(); // get les services de l'utilsateur

  }
  componentDidMount() { // get les contaienr docker
    this.getDocker();
  }
  getService() { // get les sevices

    axios.post('/back/sql/ServiceByIP/', { "IPmachine": this.props.machine.ip })
      .then(res => {

        this.setState({ service: res.data.services })
      });
  }
  handleSelect(eventKey) { // permet de change de changer d'onglet de navigation navkey est un chiffre 1, 2 .. 

    this.setState({ navKey: eventKey })
  }
  
  metApache() {// affiche les metriques apache
    {/*  formart des donné des Containers   */ }
    {/*  regles : parametre du graphe, graphe : type de graphe 1 corespond a un linegraph, solid 1 le graphe n'est pas en pointillé  */ }
    const Requettes = { "service": "apache", "metrique": "nbRequete", "reglages": { "couleur": "#000000", "titre": "Requete", "graphe": 1, "solid": 1 } };
    const Err = { "service": "apache", "metrique": "nbErreur", "reglages": { "couleur": "#000000", "titre": "Erreur", "graphe": 1, "solid": 1 } };
    const Ut = { "service": "apache", "metrique": "nbUtilisateur", "reglages": { "couleur": "#000000", "titre": "Utilisateur", "graphe": 1, "solid": 1 } };
    return (
      <div>
        {/*  DragDropContainer ne peut etre droper que sur DropTarget add   */}
        <DragDropContainer targetKey="add" dragData={Requettes} onDrop={this.drop} >
          <div className="container"> Requettes </div>
          
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={Err} onDrop={this.drop} >
          <div className="container"> Erreurs</div>
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={Ut} onDrop={this.drop} >
          <div className="container"> Utitlisateur</div>
        </DragDropContainer>
      </div>
    );
  }

  metMongodb() { // metrique docker pareil que metrique apache
    const insert = { "service": "mongodb", "metrique": "insert", "reglages": { "couleur": "#000000", "titre": "insert", "graphe": 1, "solid": 1 } };
    const query = { "service": "mongodb", "metrique": "query", "reglages": { "couleur": "#000000", "titre": "query", "graphe": 1, "solid": 1 } };
    const update = { "service": "mongodb", "metrique": "update", "reglages": { "couleur": "#000000", "titre": "update", "graphe": 1, "solid": 1 } };
    const del = { "service": "mongodb", "metrique": "delete", "reglages": { "couleur": "#000000", "titre": "delete", "graphe": 1, "solid": 1 } };
    const vsize = { "service": "mongodb", "metrique": "vsize", "reglages": { "couleur": "#000000", "titre": "vsize", "graphe": 1, "solid": 1 } };
    return (
      <div>
        <DragDropContainer targetKey="add" dragData={insert} onDrop={this.drop} >
          <div className="container">Insert</div>
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={query} onDrop={this.drop} >
          <div className="container"> Query</div>
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={update} onDrop={this.drop} >
          <div className="container"> Update</div>
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={del} onDrop={this.drop} >
          <div className="container"> Delete</div>
        </DragDropContainer>

        <DragDropContainer targetKey="add" dragData={vsize} onDrop={this.drop} >
          <div className="container"> Vsize</div>
        </DragDropContainer>
      </div>
    );

  }

  getDocker() { // get les contaienr docker
   
    axios.post('/back/sql/containerByIP', { "IPmachine": this.props.machine.ip })
      .then(res => {
        let data=res.data
   
        
        this.setState({container:res.data.container})
        
      });
      
    
    
  }
  metDocker(m) {// affiche les metrique docker
    
    const c = { "service": "docker", "metrique": m.container_id, "reglages": { "couleur": "#000000", "titre": m.container_name, "graphe": 1, "solid": 1 } };

    return (

      <DragDropContainer targetKey="add" dragData={c} onDrop={this.drop} >
        <div className="container"> {m.container_name}</div>
      </DragDropContainer>
    );



  }



  render() {

    return (
      <div>
          {/*  bar de navigation (choix des services */}
        <div>
          <div class="tabs">
            <ul>
              {(this.state.service.includes('apache'))&& (this.state.navKey!=1 ) ? <li  onClick={() => this.handleSelect(1)}><a><i class="fas fa-feather-alt"></i> Apache</a></li> : null}
              {(this.state.service.includes('apache')) && (this.state.navKey==1 )? <li class="is-active" onClick={() => this.handleSelect(1)}><a><i class="fas fa-feather-alt"></i> Apache</a></li> : null}
              {(this.state.service.includes('mongodb'))&& (this.state.navKey!=2 ) ? <li  onClick={() => this.handleSelect(2)}> <a><i class="fab fa-envira"></i>Mongodb</a></li> : null}
              {(this.state.service.includes('mongodb')) && (this.state.navKey==2 )? <li class="is-active" onClick={() => this.handleSelect(2)}><a><i class="fab fa-envira"></i>Mongodb</a></li> : null}
              {(this.state.service.includes('docker'))&& (this.state.navKey!=3 ) ? <li  onClick={() => this.handleSelect(3)}><a><i class="fab fa-docker"></i> Docker</a></li> : null}
              {(this.state.service.includes('docker')) && (this.state.navKey==3 )? <li class="is-active" onClick={() => this.handleSelect(3)}><a><i class="fab fa-docker"></i> Docker</a></li> : null}


            </ul>
          </div>
        

          {/*   Services  permet d'aficher les metriques avec des container drag & drop */}
          {/*   navkey 1 apache / 2 docker / N celui qu'on veux  */}
          {(this.state.navKey == 1) ? <div className='contapache'> {this.metApache()} </div> : null}
          {(this.state.navKey == 2) ? <div className='contapache'> {this.metMongodb()} </div> : null}
          {(this.state.navKey == 3) ? <div className='contapache'> { this.state.container.map(m => this.metDocker(m))} </div> : null}
        </div>


      </div>

    );
  }
}

export default NavMetrique;

