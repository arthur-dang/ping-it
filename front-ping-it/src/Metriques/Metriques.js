import React, { Component } from 'react';
import './Metriques.css'
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, /* VerticalBarSeries, */ VerticalGridLines, HorizontalGridLines, XAxis, YAxis/*, Crosshair, DiscreteColorLegend */ } from 'react-vis';
import axios from 'axios'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Machines from '../Machines/Machines'

import TimePicker from 'react-bootstrap-time-picker';




class Metriques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nbRequete: Array,
      nbErreur: Array,
      nbUtilisateur: Array,
      date: '',
      hdebut: '00:00:00',
      hfin: '00:00:00',
      reglages: false,
      user:''

    };
    this.state.nbRequete = [];
    this.state.nbErreur = [];
    this.state.nbUtilisateur = [];
    this.state.date = moment();
    this.sql = this.sql.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleHD = this.handleHD.bind(this);
    this.handleHF = this.handleHF.bind(this);
    this.reglages = this.reglages.bind(this)
    this.state.user=this.props.user
  }
  reglages(){
    this.setState({ reglages: !this.state.reglages})

  }
  handleChangeDate(dat) {

    this.setState({ date: dat });
  }
  formatdate(d) {
    var dd = new Date(d)
    // dd.setMonth(dd.getMonth() +1)

    const date = dd.getFullYear() + '-' + ('0' + (dd.getMonth() + 1)).slice(-2) + '-'
      + ('0' + dd.getDate()).slice(-2)

      ;
    return date
  }
  handleHD(hd) {
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
  handleHF(hf) {
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

  sql(date) {
    console.log('sql : ' + date)
    axios.post('/back/sql/metric/', { "jour": date, "heure_debut": this.state.hdebut, "heure_fin": this.state.hfin, "ip_machine": this.props.machine.ip, "metric": "nbRequete" })
      .then(res => this.setState({ nbRequete: JSON.parse(res.data) })); // this.setState({ nbRequete: res.data }) console.log('data : '+res.data)
      
      axios.post('/back/sql/metric/', { "jour": date, "heure_debut": this.state.hdebut, "heure_fin": this.state.hfin, "ip_machine": this.props.machine.ip, "metric": "nbErreur" })
      .then(res => this.setState({ nbErreur: JSON.parse(res.data) }));
      axios.post('/back/sql/metric/', { "jour": date, "heure_debut": this.state.hdebut, "heure_fin": this.state.hfin, "ip_machine": this.props.machine.ip, "metric": "nbUtilisateur" })
      .then(res => this.setState({ nbUtilisateur: JSON.parse(res.data) }));
    }

  graphes(data, color, x, y, titre, i, tsd, tsf) {

    return (
      <div key={i} className="el" >
        {titre}
        <XYPlot xDomain={[tsd, tsf]} xType="time" height={300} width={300} title="test">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis title={x} />
          <YAxis title={y} />
          <LineSeries data={data} color={color} />
        </XYPlot>
      </div>
    );
  }

  render() {

    /* const metric = 'nbRequetes' */
    //const date = '2018-09-17'
    const date = this.formatdate(this.state.date)
    /* const hdebut = '' */
    /* const hfin = '17:00:00' */
    //const tsd = new Date(date + 'T' + this.state.hdebut).getTime()
    //const tsf = new Date(date + 'T' + this.state.hfin).getTime()
   // console.log('props : ' +this.props.machine.nom)


    return (
      <div className="machine" > 
<h1> Machine : {this.props.machine.nom}  {this.props.machine.ip} </h1>
     
{!this.state.reglages?
  <div>
  <div className="fix"> 
  <button className="btn btn-primary" onClick={this.reglages}> Réglages {this.state.reglages} </button>

</div>
  <div id="cont" >
  <div className="raf">
    <DatePicker
      dateFormat="DD/MM/YYYY"
      selected={this.state.date}
      onChange={this.handleChangeDate} />
    Heure de début {this.state.hdebut}
    <TimePicker initialValue={this.state.hdebut} start={'00:00:00'} onChange={this.handleHD} step={60} format={24} />
    Heure de Fin {this.state.hfin}
    <TimePicker initialValue={this.state.hfin} start={this.state.hdebut} onChange={this.handleHF} step={60} format={24} />
 
  <button className="cbutton" value={date} onClick={() => this.sql(date)} > Consulter </button>
  </div>


  {/*Enlever l'erreur dans la console en changeant la concaténation des strings de '..'+date à `${}*/}
 


</div>
</div>
  
  : null}

  {this.state.reglages ? <div>
                 <div className="fix"> 
                 <button className="btn btn-primary"    onClick={this.reglages} > Retour </button> 
                  </div>
                 <Machines machine={this.props.machine} user={this.state.user}/> 
                 </div>  : null}

     
       </div>

    );
  }
}

export default Metriques;

/*
 {this.graphes(this.state.nbRequete, 'blue', 'heur', 'nbut', 'nbRequete' + ' ' + date, 1, tsd, tsf)} 

  {this.graphes(this.state.nbErreur, 'red', 'heur', 'nbut', 'nbErreur' + ' ' + date, 1, tsd, tsf)}

  {this.graphes(this.state.nbUtilisateur, 'green', 'heur', 'nbut', 'nbUtilisateur' + ' ' + date, 1, tsd, tsf)}
{met.map( (m,i) => this.graphes(m.data,m.color,m.x_title,m.y_title,m.titre,i))}
              
<div className="element" onClick = {(event)=>{alert("Nombre d'utilisateur par jour");}}>Nombre d'utilisateur par jour
              {this.graphes(data,'dark','jour','utilisateurs')} </div>
              <div className="element" onClick = {(event)=>{alert("Nombre de requêtes par heur");}}>Nombre de requêtes par heur
              {this.graphes(data,'red','heur','requêtes')}</div>
*/
/*
nbRequete
nbErreur
nbUtilisateur
*/