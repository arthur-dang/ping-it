# MySQL 
### Création et initialisation de la base de donnée
1. install mysql  8.0
2. CREATE DATABASE pingit ;
3. CREATE USER 'back'@'localhost' identified by 'back' ; 
4. GRANT all privileges ON pingit.* to 'back'@'localhost'; 
5. ALTER USER 'back'@'localhost' IDENTIFIED WITH mysql_native_password BY 'back'; 

# Back
### Installer les packages et lancer le back
1. cd /back-ping-it 
2. npm install
3. npm start

### Fonctionnement du back
Le back communique avec le front via le fichier « route »  <br />
La base de données est en SQL. Son fichier de configuration se situe dans « database_config »  <br />
Les models de la base de données se trouve dans le fichier « models »  <br />
Le système d’authentification utilise les session node et passeport. Les fichiers de confis sont dans « controllers » et « passeport »  <br />
Le setup général du back se trouve dans « app.js »

# Front
### Installer les packages et lancer le front
1. install node 
2. cd /front-ping-it 
3. npm install
4. npm run build pour build en production or npm start dev server

# Agent
1. cd /agent-ping-it
2. run npm setings -h 
3.  la variable (pour communique avec le back) proxy est soit proxy='http://localhost:3000/back' (en local) ou proxy='https://ping-it.cs-campus.fr/back' (le back de notre serveur ping it)
4. changer proxy dans main.py   dans /Services  dans /apache/apache.py  et  /mongno/mongno.py  et  /docker/docker.py 
plus d'info : https://ping-it.cs-campus.fr/agent





