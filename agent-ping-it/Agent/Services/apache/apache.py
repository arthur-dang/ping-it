# -*- coding: utf-8 -*s

import time
import schedule
import datetime
import requests
import sys
import yaml
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
# recuper les settings apache
with open('apache_settings.yml', 'r') as f:
  apache_settings = yaml.load(f)

access_log_path = apache_settings.get("access_log_path")
# recupere les setings global
with open('./../../settings.yml', 'r') as f:
  settings = yaml.load(f)

IPmachine = settings.get("IPmachine")
email_warning = settings.get("email_warning")
token = settings.get("token")
# choose your proxy 
#proxy='http://localhost:3000/back'
proxy='https://ping-it.cs-campus.fr/back'

nbrequete=0
nberr=0
ip=[]
nbip=0
init = False

print(bcolors.OKGREEN+"Apache launched !" + bcolors.ENDC)
# envoi les données au back
def sendMetrique(date,heure,metrique):
    try:

        global init

        if init:


            global token
            global IPmachine
            r = requests.post(proxy+'/sql/insertMetrique',
            json={ "token": token, "IPmachine": IPmachine, "date":date, "heure":heure, "metrique": metrique, "service":"apache"})
       
            

    except requests.exceptions.RequestException as e:
        print(bcolors.FAIL  + 'Apache Stop'  + bcolors.ENDC)
        print (bcolors.BOLD+bcolors.HEADER+ str(e) + bcolors.ENDC)
        sys.exit(1)
#envoi l'alert au back
def sendAlert():
    global token
    global IPmachine
    global email_warning
    r = requests.post(proxy+'/mail/send',
    json={ "token": token, "IPmachine": IPmachine, "mail": email_warning, "msg": "erreur critique status 5OO", "service":"apache"})


#path du dossier où se trouvent les fichiers de log”
path_apache = access_log_path

#fonction qui ouvre soit le fichier d’access log
#soit le fichier d’error_log qui se trouvent dans le path
def readfile(path,error_access):
  if(error_access == 'e'):
      file = open(path +'error_log','r')
      return file
  if(error_access == 'a'):
      file = open(path +'access_log','r')
      return file

#fonction qui découpe le log et stock les infos proprement
def proper_data_acclog(line):
   #print(line)

   if line !='':
       l1 = line.split('[')
       l11 = l1[0].split(' ')
       ipClient = l11[0]
       idClient = l11[2]
       l21 = l1[1].split(']')
       l211 = l21[0].split(' ')
       dateheure = l211[0]
       timeZone = l211[1]
       l22 = l21[1].split('"')
       if l22[1] != '-':
           l221 = l22[1].split(' ')
           methode = l221[0]
           ressource = l221[1]
           protocole = l221[2]
       else :
           methode = '-'
           ressource = '-'
           protocole = '-'
        
       l23 = l22[2].split(' ')
       status = l23[1]
       taille = l23[1]


       global nbrequete
       nbrequete+=1
      # print(status[:1])
       if status[:1]=='5': #si erreur 5XX
           #print('rr')
           global init
           if init:
            sendAlert()
            global nberr
            nberr +=1

       global ip
       if  not (ipClient in ip):
           global nbip

           nbip +=1
           ip.append(ipClient)


file = readfile(path_apache,'a')



# envoi au back les données
def sendtoDB():
   #print('Apache')
   global nbrequete
  
   global ip
   global nbip

   global nberr # global pour agir sur  la variable global


   date  = datetime.datetime.now()
   date0 = str(date)
   date1 = date0.split(' ')
   jour = date1[0]
   date2 = date1[1].split('.')
   heure = date2[0]
   global IPmachine
   json_metrique = {"nbErreur": nberr, "nbRequete": nbrequete, "nbUtilisateur": nbip, "service":"apache"}
   sendMetrique(jour,heure,json_metrique)
   nbrequete=0
   nbip=0
   nberr=0


schedule.every(1).seconds.do(sendtoDB) # envoi le nombre de requttes toutes les heures



while True:

    schedule.run_pending()

    current_log = file.tell()
    line = file.readline()
    
     
    if not line: # si pas de nouvelle ligne on attend
        time.sleep(1)
        file.seek(current_log)
        init=True
    else: # sinon on stock les données
        proper_data_acclog(line)
    

