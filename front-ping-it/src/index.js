import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));  //Affiche dans le index.html la vue du dossier App avec le id root
registerServiceWorker();
