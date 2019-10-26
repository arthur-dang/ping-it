# -*- coding: utf-8 -*s

import time
import schedule
import datetime
import requests
import sys
import yaml
import os
import re
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'




with open('./../../settings.yml', 'r') as f:
  settings = yaml.load(f)





IPmachine = settings.get("IPmachine")
email_warning = settings.get("email_warning")
token = settings.get("token")

#print(CpuAlert,MemAlert)
init = False
# choose your proxy 
#proxy='http://localhost:3000/back'
proxy='https://ping-it.cs-campus.fr/back'
print( bcolors.OKGREEN+"Docker launched !" + bcolors.ENDC)

# envoi les metrique au back
def sendMetrique(date,heure,metrique):
    try:
        
        global init
        if init:
            global token
            global IPmachine
            r = requests.post(proxy+'/sql/insertMetrique',
            json={ "token": token, "IPmachine": IPmachine, "date":date, "heure":heure, "metrique": metrique, "service":"docker"})
        init=True
           
    except requests.exceptions.RequestException as e:
        print( bcolors.FAIL  + 'Docker Stop'  + bcolors.ENDC)
        print (bcolors.BOLD+bcolors.HEADER+ str(e) + bcolors.ENDC)
        sys.exit(1)
            
# envoi les alert au back
def sendAlert(Cpu,Mem,Container_Id):
    
    global token
    global IPmachine
    global email_warning
    msg="Container : "+str(Container_Id)+ " cpu : "+str(Cpu)+"% "+" mem "+str(Mem)+"% "
    value={"cpu":Cpu,"mem":Mem}
    r = requests.post(proxy+'/mail/send',
    json={ "token": token, "IPmachine": IPmachine, "mail": email_warning, "msg": msg, "service":"docker","value":value})
# ajout un conatienr au back
def ajoutConatainer(): 
    list_service=[]
    mon_pipe = os.popen("docker container ls", "r")
    resultat_commande = mon_pipe.read()
    mon_pipe.close()

    lines =  resultat_commande.splitlines()
    
    for line in lines :

        sub=re.sub(' +',' ',line).split(" ")
        if not sub[0]== 'CONTAINER':
           
           
            
            list_service.append({"container_id":sub[0],"container_name":sub[-1]})

    r = requests.post(proxy+'/sql/insertContainer',
    json={ "token": token, "IPmachine": IPmachine, "list_service":list_service})

# envoie les alert au back
def alertchecker():

    print("alert")
    mon_pipe = os.popen("docker stats  --no-stream", "r")
    resultat_commande = mon_pipe.read()
    mon_pipe.close()
    lines =  resultat_commande.splitlines()
    for line in lines :

        sub=re.sub(' +',' ',line).split(" ")
        if not sub[0]== 'CONTAINER':
            Container_Id=sub[0]
            Name=sub[1]
            Cpu=float(sub[2].replace("%", ""))
            Mem=float(sub[6].replace("%", ""))
            sendAlert(Cpu,Mem,Container_Id)
            


            
    
    

        
        

        

# traite les donné pour les envoyer au bon forma
def sendtoDB():
    date  = datetime.datetime.now()
    date0 = str(date)
    date1 = date0.split(' ')
    jour = date1[0]
    date2 = date1[1].split('.')
    heure = date2[0]
    mon_pipe = os.popen("docker stats  --no-stream", "r")
    # mon_pipe peut ensuite être lu comme un fichier
    resultat_commande = mon_pipe.read()
 
    
    # On referme ensuite le pipe
    mon_pipe.close()
    lines =  resultat_commande.splitlines()
    
    for line in lines :

        sub=re.sub(' +',' ',line).split(" ")
        if not sub[0]== 'CONTAINER':
            Container_Id=sub[0]
            Name=sub[1]
            Cpu=float(sub[2].replace("%", ""))
            Mem=float(sub[6].replace("%", ""))
            #alertchecker(Cpu,Mem,Container_Id,Name)


            json_metrique = {"Container_Id": Container_Id, "Name": Name, "Cpu": Cpu,"Mem":Mem, "service":"docker"}
            sendMetrique(jour,heure,json_metrique)



    
   


schedule.every().hours.do(sendtoDB) # envoi le nombre de requttes toutes les heures
schedule.every(10).minutes.do(ajoutConatainer) # envoi les nouveau container toutes les 10 minute
schedule.every(10).minutes.do(alertchecker) # envoi les alert toute les 10 minutes

while True:
   schedule.run_pending()




  