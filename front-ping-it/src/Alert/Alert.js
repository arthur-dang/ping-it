import React, { Component } from 'react';
// You can also include the js that also bundle the ccs (do not work with server-side rendering)
import Switch from 'react-bulma-switch/full';
import './Alert.css'
import axios from 'axios'

class Alert extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            apacheSeuil:0,
            dockerSeuilCpu:0,
            dockerSeuilMem:0,
            mongodbSeuil:0,
            services: [
                
            ],
            save:[true,true,true],
            saved:[false,false,false]

        };
        this.handleChange = this.handleChange.bind(this)
        this.handleChanges = this.handleChanges.bind(this)

    }
    handleChanges(event) { // set le seuil d'un service
        const target = event.target;
        const name = target.name;
        console.log(name)
        this.setState({ [name]: event.target.value });}

    handleChange(name) { //set l'activation ou desactivation de l'alert 
        console.log(this.state.apacheSeuil)
        let value = !this.state[name]
        console.log({ value, name })
        axios.post('/back/mail/setWarning', { "IPmachine": this.props.machine.ip, "warning": value, "service": name }).then(() => this.setState({ [name]: value }));

    }

    componentDidMount() { // set l'état des alert (activé / desactivé) et leur seuil à l'apple du component
        axios.post('/back/mail/getWarning', { "IPmachine": this.props.machine.ip }).then(res => this.setState({ services: res.data.services })).then(() => this.state.services.map((s) => { this.setState({ [s.service]: s.active }) }));
        axios.post('/back/mail/getWarningSettings', { "IPmachine": this.props.machine.ip }).then(res => {
            this.setState({apacheSeuil:res.data.apache })
            this.setState({mongodbSeuil:res.data.mongodb })
            this.setState({dockerSeuilCpu:res.data.docker.cpu })
            this.setState({dockerSeuilMem:res.data.docker.mem })


        } );

    }
    send(service,i){ // envoi le seuil des services au back
        switch(service) {
            case "apache":
                console.log("apache")
                axios.post('/back/mail/settings_warning', { "IPmachine": this.props.machine.ip, "value": this.state.apacheSeuil, "service": "apache" }).then(() => {this.state.save[i]=true;this.state.saved[i]=true;this.forceUpdate();;this.forceUpdate();});
                break;
            case "docker":
                axios.post('/back/mail/settings_warning', { "IPmachine": this.props.machine.ip, "value": {"cpu":this.state.dockerSeuilCpu,"mem":this.state.dockerSeuilMem}, "service": "docker" }).then(() => {this.state.save[i]=true;this.state.saved[i]=true;this.forceUpdate();;this.forceUpdate();});
                console.log("docker")
                break;
            case "mongodb":
                axios.post('/back/mail/settings_warning', { "IPmachine": this.props.machine.ip, "value": this.state.mongodbSeuil, "service": "mongodb" }).then(() => {this.state.save[i]=true;this.state.saved[i]=true;this.forceUpdate();;this.forceUpdate();});
                console.log("mongodb")
                break;
            
        }
    }
    button(name,i) {
        return (
            <div className="boxalert">
                <Switch value={this.state[name]} rounded={true} outlined onClick={() => this.handleChange(name)}>  alerte {name}
                    {this.state[name] ? ' activée ' : null}
                    {!this.state[name] ? ' desactivée ' : null}

                </Switch>
                 {/* apache */}
                {(this.state[name]) && (name == 'apache') ? <div className="apache">
                    Entrez le nombre de code 500 avant l'envoi de mail d'alert (default pas de limite)
            <div class="ffield">
             {/* seuil  */}
            <div class="ccontrol">
                            <input class="input is-info" type="text" placeholder="Nombre code 500" name="apacheSeuil" value={this.state.apacheSeuil} onChange={this.handleChanges} />
                            {this.state.apacheSeuil}
                        </div>
                        {/* sauvegarder  */}
                      
                    {this.state.save[i]?   <div  class="button is-success" onClick={()=>{this.state.save[i]=false;this.forceUpdate();this.send("apache",i)}}><span>Save</span></div>:null} 
                       {/* en cour de sauvergarde   */}
                       
                   {!this.state.save[i]?  <div class="button is-success is-loading"></div>:null} 
                    {/*sauvergardé  */}
                   {this.state.saved[i]&&this.state.save[i]?  
                        <div class="button is-static is-success ">
                        <span class="icon is-small">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>Saved</span>
                    </div>
                   :null} 
                    </div>
                    
                </div> : null}
                 {/* mongodb */}

                {(this.state[name]) && (name == 'mongodb') ? <div className="apache">
                    Entrez la Vzise (en G) max avant l'envoi de mail (default pas de limite)
            <div class="ffield">
            {/* seuil  */}
                    <div class="ccontrol">

                            <input class="input is-info" type="number" placeholder="vsize" name="mongodbSeuil" value={this.state.mongodbSeuil} onChange={this.handleChanges} />
                        </div>
                         {/* sauvegarder  */}
                        {this.state.save[i]?   <div  class="button is-success" onClick={()=>{this.state.save[i]=false;this.forceUpdate();this.send("mongodb",i)}}><span>Save</span></div>:null} 
                       {/* en cour de sauvergarde   */}

                    {!this.state.save[i]?  <div class="button is-success is-loading"></div>:null} 
                    {/*sauvergardé  */}
                    {this.state.saved[i]&&this.state.save[i]?  
                        <div class="button is-static is-success ">
                        <span class="icon is-small">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>Saved</span>
                    </div>
                   :null}
                    </div>
                    
                </div> : null}



                 {/* docker */}

                {(this.state[name]) && (name == 'docker') ? <div className="apache">
                    Entrez le pourcentage d'utilisation max du cpu et de la memoire des container avant l'envoi de mail (default pas de limite)
            <div class="ffield">
            {/* seuil  */}
                        <div class="ccontrol">
                            <input class="input is-info" type="number" placeholder="Mémoire 0 à 1OO"  name="dockerSeuilMem" value={this.state.dockerSeuilMem} onChange={this.handleChanges}/>
                            <p class="help is-success"> Mémoire 0 à 1OO</p>

                        </div>
                        {/* seuil  */}
                        <div class="control">
                        
                        <input class="input is-info" type="number"placeholder="CPU  0 à 1OO"  name="dockerSeuilCpu" value={this.state.dockerSeuilCpu} onChange={this.handleChanges}/>
                        <p class="help is-success"> CPU  0 à 1OO </p>
                    </div>
                         {/* sauvegarder  */}

                     {this.state.save[i]?   <div  class="button is-success" onClick={()=>{this.state.save[i]=false;this.forceUpdate();this.send("docker",i)}}><span>Save</span></div>:null} 
                       {/* en cour de sauvergarde   */}

                    {!this.state.save[i]?  <div class="button is-success is-loading"></div>:null} 
                    {/*sauvergardé  */}
                    {this.state.saved[i]&&this.state.save[i]?  
                        <div class="button is-static is-success ">
                        <span class="icon is-small">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>Saved</span>
                    </div>
                   :null}
                    </div>
                   
                    
                </div> : null}

                

            </div>
        )
    }



    render() {
        return (
            <section className="section">
                <div className="alert">
                    <p> Ici vous pouvez configurer les alerts</p>
                    {this.state.services.map((s,i) => this.button(s.service,i))}
                </div>
            </section>
        );
    }
}

export default Alert;

            /*
{ip: 0.0.0.0,
                    services[
        {service: apache,
                active:boolean,
                },
        {

                }


                ]
            
            }
            
            
*/