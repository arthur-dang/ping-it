import React, { Component } from 'react';

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import './DnD.css'
import {Nav, NavItem} from 'react-bootstrap';
//import Metriques from '../Metriques/Metriques'
import TimePicker from 'react-bootstrap-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Graphes from '../Graphes/Graphes'

import axios from 'axios'
import NavMetrique from '../NavMetrique/NavMetrique'
/*
formart du dashboard :
variable box : 
[ 
{"service":"apache","metrique":"Requettes", "reglages":{"couleur":"#000000","titre":"nbconst","graphe":1,"solid":1}, id:0},
{"service":"apache","metrique":"Requettes", "reglages":{"couleur":"#000000","titre":"nbconst","graphe":1,"solid":1}, id:1},
{"service":"apache","metrique":"Requettes", "reglages":{"couleur":"#000000","titre":"nbconst","graphe":1,"solid":1}, id:2},

]
variable data :
{
  id1: [data],
  id2: [data]
}


*/
class DnD extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      drage: '', // ne sert plus
      box: [], // le dashboard 
      date: '', // date de consulation
      hdebut: '00:00:00',  // heure debut consulation
      hfin: '23:00:00', // heure fin consultation 
      modif: false,// etat du dashboard false: mode affiche true: mode modification
      user:JSON, // info utilisateur 
      machine:JSON,// info sur la machine courante 
      tsd:0, // timestamp debut 
      tsf:0,// timestamp fin
      user:this.props.user, // on set les info user
      machine:this.props.machine, // on set les info machine
      data:{} // data de chaque graphe
      

    };
    // bind 
    this.state.date=moment();
    this.add=this.add.bind(this)
    this.delette=this.delette.bind(this)
    this.clearAll=this.clearAll.bind(this)
    this.remplacer=this.remplacer.bind(this)
    this.state.box=[ ]
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleHD = this.handleHD.bind(this);
    this.handleHF = this.handleHF.bind(this);
    this.handleModif=this.handleModif.bind(this);
    this.remplacer=this.remplacer.bind(this)
    this.deletteFromGraphe=this.deletteFromGraphe.bind(this)
    this.getData=this.getData.bind(this)
  }

  componentDidMount() {
    this.getDashboard();
  }
 
  getData(){ // atribu les donnée sur chaques graphes
    var date = this.formatdate(this.state.date) 
    var hdebut=this.state.hdebut;
    var hfin=this.state.hfin;
    //! Route pas bonne, il faut une route getData pour récupérer les valeurs des données du graphe
    
     this.state.box.map(b=> { console.log({ "IPmachine": this.state.machine.ip ,
     "id":b.id,
     "jour":date,
     "metrique":b.metrique,
     "service":b.service,
     "heure_debut":hdebut,
     "heure_fin":hfin
 }); axios.post('/back/sql/getMetrique_'+b.service+'/',
      { "IPmachine": this.state.machine.ip ,
        "id":b.id,
        "jour":date,
        "metrique":b.metrique,
        "service":b.service,
        "heure_debut":hdebut,
        "heure_fin":hfin
    })
     .then(res =>  { var da=res.data.data; var id=res.data.id;  ;this.setState(prevState => ({
      data:{
        ...prevState.data,
        [id]:da
      }
    }))})})
   // console.log('dnd data '+ this.state.data.data)
  }

 
  getDashboard(){ // recupere le dashboard 
    axios.post('/back/dashboard/getDashboard/', { "IPmachine": this.state.machine.ip })
        .then(res => {  
          console.log(res.data); //Récupère un array avec les données
          this.setState({ box: res.data })}).then(()=>{this.getData()}); 
  }

  updateDashboard(){ // met a jour le dash board
   // console.log(this.state.box);
    axios.post('/back/dashboard/updateDashboard/', { "IPmachine": this.state.machine.ip, "dashboard":this.state.box })
  }
  
  rerender(){ // pemert de force render 
    this.setState({modif: !this.state.modif})
  }

  delette(e) { // suprime un graphe en drag & drop
    var array = [...this.state.box]; // make a separate copy of the array
    var index = e.dragData.id 
    array.splice(index, 1);
    
    for( var i = index, len=array.length ; i <len; i++){
      array[i].id-=1
    }

    this.setState({box: array});
    this.getData()
    this.rerender();
    this.rerender();
  }

  deletteFromGraphe(index) { // suprime un graphe avec un bouton
    var array = [...this.state.box]; // make a separate copy of the array
    array.splice(index, 1);
    for( var i = index, len=array.length ; i <len; i++){
      array[i].id-=1
    }
    this.setState({box: array});
  }
 

 

  Nav(){ // onglet de navigation
    return(
      <div className="navdnd"> 
        {/*   Enregistrer les modification */}
        <div className="button is-success" onClick={this.handleModif}>
            <span className="icon is-small">
              <i className="fas fa-check"></i>
            </span>
            <span> enregistrer</span>
        </div>

        <div> 
          <NavMetrique machine={this.state.machine}/>
        </div>
   
        {/*   Suprimer tout le dashboard */}
        <div className="button is-danger is-outlined" onClick={this.clearAll} >
            <span>Tout suprimer</span>
            <span className="icon is-small">
              <i className="fas fa-times"></i>
            </span>
        </div>
      </div>
    );
  }

 
  choisit(dragData, currentTarget, x, y){
    //console.log('choisit ' +dragData.id)
    
  }
  boxrender(b,tsd,tsf){ // affiche les graphes 
    // si le dasboard est en court de modification les graphe son dragable (draguer dans la corbeille)
    // sinon les graph ne son pas dragable et la croix du drag n'est plus afficher 
   // console.log("data : "+this.state.data[b.id])

    return(
      
    <div className="child">

    {this.state.modif ?
          <div key={b.id} className="target">
          <DropTarget targetKey="foo" dropData={b} value={b.id}  >  {/*  cette target "foo" ne sert plus mais pourait servire de nouveau  */}
      <div className="element">
        {/*  cette target permet de graguer le graphe sur la poubelle qui va suprimer le graphe  */}
        <DragDropContainer noDragging={!this.state.modif} draggable="false"  targetKey="delette" dragData={b}  onDrop={this.drop} >
        {/*  cette target ne sert plus mais pourait servire de nouveau  */}
        <DragDropContainer  noDragging={!this.state.modif} draggable="false" targetKey="foo" dragData={b} onDragEnd={this.choisit} > 
        
        {/* afiche le graphe  */}
        {/*   data: données du graphes   */}
        {/* deletteFromGraphe:  fonction qui permet de surpimer un graphe du dashboard depui le component graphe */}
        {/*  remplacer : permet la modification des reglages du graph dans le dashboard */}
        {/* tsd: timestamp debut  */}
        {/* tsf: time stamp fin  */}
        {/* drag : tien le graphe au courant si le dashboard est en court de modification */}
        < Graphes element={b} data={this.state.data[b.id]} deletteFromGraphe={this.deletteFromGraphe} remplacer={this.remplacer} tsd={tsd} tsf={tsf} drag={this.state.modif} />
        </DragDropContainer> 

        </DragDropContainer> 
        
        </div>
        </DropTarget>



</div>: null}
        
        {!this.state.modif ?  < Graphes data={this.state.data[b.id]} element={b} deletteFromGraphe={this.deletteFromGraphe} remplacer={this.remplacer} tsd={tsd} tsf={tsf} drag={this.state.modif} /> : null}


   
  </div>
  
  )
  }
  add(e){ // ajout un graphe
    var d = e.dragData
    d.id=this.state.box.length 
    this.setState({ box: [...this.state.box, d ]})
    this.getData()

  }
  clearAll(){ // suprimer tout les graph
    this.setState({box:[]})
  }
  handleModif(){ // met a jour l'état du graphe en court de modifcation ou non
    if(this.state.modif){
      this.updateDashboard()
    }
    this.setState({modif: !this.state.modif})
  }
  // consultation //
  handleChangeDate(dat) {
     
    this.setState({ date: dat});
  }
  formatdate(d) { // reformarte la date de  type moment() en YYYY-MM-DD
    var dd = new Date(d)
    // dd.setMonth(dd.getMonth() +1)

    const date = dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2) + '-'
      + ('0' + dd.getDate()).slice(-2)

      ;
    return date
  }
  handleHD(hd) { // modifie l'heur de début
    var hh = '';
    const hr = hd / 3600
    if ((hr) < 10) {
      hh = '0' + hr.toString()
    } else {
      hh = hr.toString()
    }

    const h = hh + ':00:00'

    this.setState({ hdebut: h });
    
  }
  handleHF(hf) {// modifie l'heur de fin
    var hh = '';
    const hr = hf / 3600
    if ((hr) < 10) {
      hh = '0' + hr.toString()
    } else {
      hh = hr.toString()
    }
    const h = hh + ':00:00'


    this.setState({ hfin: h });
  }


  consultation(){ // permet de changer la date l'heur de debut et de fin de consultation
  


    return( 
      <div className="consultation">
      <div className="consultel">  <DatePicker
        dateFormat="DD/MM/YYYY"
        selected={this.state.date}
        onChange={this.handleChangeDate} /></div>

        <div className="consultel"> Début :</div>
     <div className="consultel">  
      <TimePicker  initialValue={this.state.hdebut} start={'00:00:00'} onChange={this.handleHD} step={60} format={24} />
     </div>
     <div className="consultel">      Fin :</div>

     <div className="consultel">
 
      <TimePicker  initialValue={this.state.hfin} start={this.state.hdebut} onChange={this.handleHF} step={60} format={24} />
   
     </div>
      <div className="consultel"> <button className="button is-info is-rounded" onClick={this.getData} > Consulter </button></div>
      <div className="modif">  <button className="button is-success is-outlined" onClick={this.handleModif}>
      Ajouter/Suprimer un graphe
    </button> </div>
    </div>);
   
  }
  
  remplacer(element,nouveau){ // fonction non utiliser  a laisser

    var array = [...this.state.box]; 
    var index = element.id 
    array[index].reglages=nouveau;
    this.setState({box: array});
    this.updateDashboard();
  }
  /* --------------- */
  render() {

    var date = this.formatdate(this.state.date) 
    var tsd = new Date(date + 'T' + this.state.hdebut).getTime()
    var tsf = new Date(date + 'T' + this.state.hfin).getTime()
    return (

      <div > 
        {/* affiche la bar des services si le dashboard et en cour de mofication  */}
        {this.state.modif ? this.Nav() : null}
        {/* sinon on affiche le menu de consultaion */}
        {!this.state.modif ? this.consultation() : null}
        <div className="dashtrash"> 
        {/* DropTarget add qui est le dashboard permet de drop les container metriques des services */}
        <DropTarget targetKey="add" onHit={this.add}  >
          <div className='box'> 
            {this.state.box.map(b => this.boxrender(b,tsd,tsf))}
          </div>
        </DropTarget>
        {/* affcihe la poubelle en mode modification  */}
        {this.state.modif ?  <div className="p" >

          <DropTarget  targetKey="delette" onHit={this.delette}  >
            <div className="poubelle"> 
            <img className="imagep" src={require("./garbage.png")}  height="80" width="80" alt="reglage" ></img>
            </div>
            


          </DropTarget></div>
        : null}
        </div>
      </div>
    );
  }
}

export default DnD;

