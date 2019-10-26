import React, { Component } from 'react';
import './Graphes.css'
import '../../node_modules/react-vis/dist/style.css';
import {DiscreteColorLegend , XYPlot, LineSeries, Hint, LineMarkSeries, MarkSeries, VerticalBarSeries, AreaSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis/*, Crosshair, DiscreteColorLegend */ } from 'react-vis';
//import axios from 'axios'
import { SketchPicker } from 'react-color';
import { ToggleButtonGroup, ButtonToolbar, ToggleButton } from 'react-bootstrap';


/*
 "reglages":{"couleur":"#000000","titre":"default"}
 */



class Graphes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couleur: '',
      reglage: false,
      modifcouleur: false,
      titre: '',
      graphe: this.props.element.reglages.graphe,
      solid: this.props.element.reglages.solid,
      hovered: null,
      data: this.props.data,


    };
    this.modifRegales = this.modifRegales.bind(this)
    this.handleCouleur = this.handleCouleur.bind(this)
    this.handleReglage = this.handleReglage.bind(this)
    this.handleModifCouleur = this.handleModifCouleur.bind(this)
    this.handleTitre = this.handleTitre.bind(this)
    this.state.couleur = this.props.element.reglages.couleur
    this.state.titre = this.props.element.reglages.titre
    this.handleGraphe = this.handleGraphe.bind(this)
    this.handleSolid = this.handleSolid.bind(this)
    this.supresion = this.supresion.bind(this)

  }
  componentWillReceiveProps(nextProps) {
    //Problème avant parce que quand recevait le nouveau props avec l'user, n'appelait pas getMachine et le component se mountait avant de recevoir le props
    if (nextProps.data !== this.state.data) {
        this.setState({ data: nextProps.data }, () => {
          
        });
    }
}
  modifRegales() {

    this.props.remplacer(this.props.element, { "couleur": this.state.couleur, "titre": this.state.titre, "graphe": this.state.graphe, "solid": this.state.solid });

  }
  graphes(data, color, x, y, titre, i, tsd, tsf) {
    let service=""
    var serv=this.props.element.service
    console.log({data, color, x, y, titre, i, tsd, tsf,serv})
    const ds = ['solid', "dashed"]
    const colors ={"cpu":"red","mem":"blue"}
    const ITEMS=[]

    var hovered = this.state.hovered;
    if (hovered !== null) {
      var date = (new Date(hovered.x)).toLocaleString()
    }
    if(data.length==2){
      if(data[0].type==undefined){
        service=""
      }else{
        service="docker"
      }
    }
    // && (data.length==2  )&&(this.props.element.service=='docker' )
    //&& !(this.props.element.service=='docker' )&& !(data.length==2  )


    return (
      <div >      {!this.props.drag && !this.state.reglage ? <button className="reglagebt" onClick={this.handleReglage}> </button> : null}
        <div key={i} className="axe" >

          { !(service=="docker" ) ? titre  :null}
          { (service=="docker" ) ? titre + ' ID: ' + y :null}
                
          <XYPlot xDomain={[tsd, tsf]} xType="time" height={300} width={300} title="test">
          { (service=="docker" ) ? <div> cpu red mem blue</div> : null}
            <VerticalGridLines />
            
            <XAxis title={x} />
          
            { !(service=="docker" ) ? <YAxis title={y} /> :null}
            { (service=="docker" ) ? <YAxis title={'usage en %'} /> :null}
            
            
            {hovered && <Hint value={{ date, 'y': hovered.y }} />}
            {/* affichage des graphes  docker */ }
            {(this.state.graphe  == 1)&& (service=="docker")  ? data.map((d,i)=>{ return( <LineSeries data={d.data} color={colors[d.type]}  strokeStyle={ds[this.state.solid - 1]} />);}) : null}
            {(this.state.graphe  ==2)&& (service=="docker" )&&(this.props.element.service=='docker' )  ? data.map((d,i)=>{ return( <VerticalBarSeries data={d.data} color={colors[d.type]}  strokeStyle={ds[this.state.solid - 1]} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })} />);}) : null}
            {(this.state.graphe  == 3)&& (service=="docker"  )&&(this.props.element.service=='docker' )  ? data.map((d,i)=>{return( <AreaSeries data={d.data} color={colors[d.type]}   strokeStyle={ds[this.state.solid - 1]} />);}) : null}
            {(this.state.graphe  == 4)&& (service=="docker"  )&&(this.props.element.service=='docker' )  ? data.map((d,i)=>{ return( <LineMarkSeries data={d.data} color={colors[d.type]}  strokeStyle={ds[this.state.solid - 1]} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })}/>);}) : null}
            {(this.state.graphe  == 5)&& (service=="docker"  )&&(this.props.element.service=='docker' ) ? data.map((d,i)=>{ return( <MarkSeries data={d.data} color={colors[d.type]}  strokeStyle={ds[this.state.solid - 1]} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })}/>);}) : null}
            {/* affichage des graphes  non  docker */ }
            {(this.state.graphe  == 1)&& !(service=="docker" ) ? <LineSeries data={data} color={color}  cstrokeStyle={ds[this.state.solid - 1]} /> : null}
            {(this.state.graphe == 2)&& !(service=="docker" ) ? <VerticalBarSeries data={data} color={color} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })} /> : null}
            {(this.state.graphe == 3)&& !(service=="docker" ) ? <AreaSeries data={data} color={color} /> : null}
            {(this.state.graphe == 4)&& !(service=="docker"  ) ? <LineMarkSeries data={data} color={color} strokeStyle={ds[this.state.solid - 1]} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })} /> : null}
            {(this.state.graphe == 5)&& !(service=="docker" )  ? <MarkSeries data={data} color={color} strokeStyle={ds[this.state.solid - 1]} onValueMouseOver={d => this.setState({ hovered: d })} onValueMouseOut={d => this.setState({ hovered: false })} /> : null}

          </XYPlot>
        </div>
      </div>

    );
  }
  handleCouleur = (color) => { // change la couleur du graphe
    this.setState({ couleur: color.hex });
  }; 
  handleReglage() { // affiche les reglages ou non 
    if (this.state.reglage) {

      this.modifRegales()
    }
    this.setState({ reglage: !this.state.reglage })


  }
  handleModifCouleur() { // affiche le panneau des couleur ou non
    this.setState({ modifcouleur: !this.state.modifcouleur })
  }
  handleTitre(evt) {
    this.setState({ titre: evt.target.value })
  }
  reglage() { // paneau de réglages
    return (
      <div className='reglage'>
        {/* boutton enregistremnt de modification de couleur*/}
        {!this.state.modifcouleur ?
          <div class="button is-success" onClick={this.handleReglage}>

            <span class="icon is-small">
              <i class="fas fa-check"></i>

            </span>
            <p>save </p>
          </div>


          : null}
           {/* modification du titre*/}
        {!this.state.modifcouleur ? <input class="input" type="text" value={this.state.titre} onChange={this.handleTitre} /> : null}

        {/* modification des couleur si graphe n'est pas docker*/}
        {this.state.modifcouleur && !(this.props.element.service=='docker')? this.couleur() : null}
          {/* bouton pour modififier la couleur*/}
        {!this.state.modifcouleur &&!(this.props.element.service=='docker') ? <button className="button is-primary is-outlined" onClick={this.handleModifCouleur}> Modifier la couleur</button> : null}
            {/* changment de type de gprahe drop down menu*/}

        {!this.state.modifcouleur ? this.typegraphe() : null}



      </div>

    );
  }
  couleur() {
    return (
      <div >
        <button className="button is-success is-outlined" onClick={this.handleModifCouleur}> ok</button>

        <SketchPicker color={this.state.couleur} onChangeComplete={this.handleCouleur}
        /></div>
    );
  }
  handleGraphe(event) {  // set les donné de reglages du graphe
   // console.log('graphe ' + event.target.value)
    this.setState({ graphe: event.target.value });
  }
  handleSolid(e) { // type de graphe solide ou pointillé

    this.setState({ solid: e.target.value })
  }
  typegraphe() { // selection du type de graphe 
    return (
      <div>
        <div class="select">
          <select value={this.state.graphe} onChange={this.handleGraphe}>
            <option value={1}>Line</option>
            <option value={2}>Chart</option>
            <option value={3}>Air</option>
            <option value={4}>LineMark</option>
            <option value={5}>Mark</option>
          </select>
        </div>
        <div class="select">
          <select value={this.state.solid} onChange={this.handleSolid}>
            <option value={1}>Solide</option>
            <option value={2}>Pointillé</option>
          </select>
        </div>
      </div>
    
    );

  }
  supresion() { // supresion du graphe (plus utilisé)
    this.props.deletteFromGraphe(this.props.element.id)
  }

  render() {

    // type de data si non docker => const data = [ [{ x: this.props.tsd, y: 4 }, { x: this.props.tsd + 3600 * 1000, y: 20 }, { x: this.props.tsf - 3 * 3600 * 1000, y: 5 }, { x: this.props.tsf, y: 15 }],[{ x: this.props.tsd, y: 3 }, { x: this.props.tsd + 3600 * 1000, y: 7 }, { x: this.props.tsf - 3 * 3600 * 1000, y: 12 }, { x: this.props.tsf, y: 8 }]]

   
         
      var d=this.props.data
      console.log({d})


    return (
      <div className="Graphes" >

        {this.state.reglage ? this.reglage() : null}
   
        { d? this.graphes(this.state.data, this.state.couleur, 'heure', this.props.element.metrique, this.props.element.service + ' : ' + this.state.titre, this.props.element.id, this.props.tsd, this.props.tsf):null}




      </div>

    );
  }
}

export default Graphes
/*
       {data.map(data=>{this.graphes(data, this.state.couleur, 'heure', this.props.element.metrique, this.props.element.service + ' : ' + this.state.titre, this.props.element.id, this.props.tsd, this.props.tsf)}
 )}
     
 */

 /*
type de data docker :

"data":[
  {
    "type":"cpu",
    "data":[{ x: this.props.tsd, y: 4 }, { x: this.props.tsd + 3600 * 1000, y: 20 }, { x: this.props.tsf - 3 * 3600 * 1000, y: 5 }, { x: this.props.tsf, y: 15 }],
  },
  {
    "type":"mem",
    "data":[{ x: this.props.tsd, y: 3 }, { x: this.props.tsd + 3600 * 1000, y: 7 }, { x: this.props.tsf - 3 * 3600 * 1000, y: 12 }, { x: this.props.tsf, y: 8 }]
  }
]





 */