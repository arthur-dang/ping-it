/* Page de Documentation pour l'installation de l'Agent */
import React, { Component } from 'react';
import './infoAgent.css';

class infoAgent extends Component {
  render() {
    return (
      <div className="back">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/zlU56bb2LyQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <div className="doc">
          <div className="element">
              <h1>Services available </h1>
              <p> Apache</p>
              <p> Docker</p>
              <p> Mongodb</p>
          </div>

          <div className="line"> </div>
          <div className="element">
            <h1> Agent ping-it settings</h1>
            <span className="code"> git clone https://github.com/Agent-ping-it/Agent-ping-it </span>
          </div>

          <div className="line"> </div>
          <div className="element">
            <h1> General Settings</h1>
            <p> go to /Agent</p>
            <p> Help</p>
            <span className="code">python3 settings.py -h </span>
            <p> Setting</p>
            <div className="element"> <span className="code">python3 settings.py   </span> </div>
            <div className="element"><span className="code">-token   your_pingit_token </span></div>
            <div className="element"><span className="code">-email_warning   your_email_warning  </span></div>
            <div className="element"><span className="code">-IPmachine   your_IPmachine </span></div>
            <div className="element"><span className="code">-nom_machine    your_machine_name </span></div>
            <div className="element"><span className="code"> -services   apache docker all_your_sevices </span></div>
          </div>

          <div className="line"> </div>
          <div className="element"> 
            <h1> Apache </h1>
            <p> go to /Agent/Services/apache</p>
            <span className="code"> python3 apache_settings.py -access_log_path path_to_apache_access_log </span>
            <p> default path : /var/log/apache2/</p>
          </div>

          <div className="line"> </div>
            <div className="element"> 
            <h1> Docker </h1>
            <p> no settings</p>
          </div>

          <div className="line"> </div>
            <div className="element"> 
            <h1> mongodb </h1>
            <p> no settings</p>
          </div>

        </div>
      </div>
    );
  }
}

export default infoAgent;

