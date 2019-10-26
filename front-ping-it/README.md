# # 1 # # 

#mysql #
1 install mysql  8.0
#  creation de la base de donnée 
2 CREATE DATABASE pingit ;
# créer un utilisateur ici le back
3 CREATE USER 'back'@'localhost' identified by 'back' ; 
# donne les droits au back pour consulter la base de données
4 GRANT all privileges ON pingit.* to 'back'@'localhost'; 
# met le mot de passe en native car node n'est pas à jour avec la dernière version de mysql
5 ALTER USER 'back'@'localhost' IDENTIFIED WITH mysql_native_password BY 'back'; 


# # 2 # # 

 # back #
# installer les packages
 1 npm install

# lancer le back
2 npm start

# fonctionnement du back
Le back communique avec le front via le fichier « route »
La base de données est en SQL. Son fichier de configuration se situe dans « database_config »
Les models de la base de données se trouve dans le fichier « models »
Le système d’authentification utilise les session node et passeport. Les fichiers de confis sont dans « controllers » et « passeport »
Le setup général du back se trouve dans « app.js »

# # 3 # # 

#front# 
1 install node 
2 ouvrir /front-ping-it 
3 npm install

4 npm run build pour build en production
or 
4 npm start dev server
# # 4 # # 

#agent# 
1 cd /Agent 
2 run npm setings -h 
3  la variable (pour communique avec le back) proxy est  soit proxy='http://localhost:3000/back' (en local) ou proxy='https://ping-it.cs-campus.fr/back' (le back de notre serveur ping it)

4 changer proxy dans main.py   dans /Services  dans /apache/apache.py  et  /mongno/mongno.py  et  /docker/docker.py 
plus d'info : https://ping-it.cs-campus.fr/agent




