# -*- coding: utf-8 -*s

import time
import schedule
import datetime
import requests
import sys
import yaml
import os
import re
from subprocess import Popen, PIPE
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

# metrique 
insert=0
query=0
update=0
delete=0
vsize=0
count =0
# choose your proxy 
#proxy='http://localhost:3000/back'
proxy='https://ping-it.cs-campus.fr/back'
print (bcolors.OKGREEN+"Mongodb launched !" + bcolors.ENDC)

# envoi metrique au bacj
def sendMetrique(date,heure,metrique):
    try:

        global token
        global IPmachine
        r = requests.post(proxy+'/sql/insertMetrique',
        json={ "token": token, "IPmachine": IPmachine, "date":date, "heure":heure, "metrique": metrique, "service":"mongodb", "service":"mongodb"})
        #print("Mongodb")
    except requests.exceptions.RequestException as e:
         
        print( bcolors.FAIL  + 'Mongodb Stop'  + bcolors.ENDC)
        print (bcolors.BOLD+bcolors.HEADER+ str(e) + bcolors.ENDC)
        sys.exit(1)
# envoi les alert au back
def sendAlert():
    try:

        global vsize
        global count
        global token
        global IPmachine
        global email_warning
        if not count==0:
            print('envoie mongo')
            r = requests.post(proxy+'/mail/send',
            json={ "token": token, "IPmachine": IPmachine, "mail": email_warning, "msg": " Out of vsize  valeur : "+str(vsize/count)+" G","value":vsize/count, "service":"mongodb"})
    except requests.exceptions.RequestException as e:
         
        print( bcolors.FAIL  + 'Mongodb Stop'  + bcolors.ENDC)
        print (bcolors.BOLD+bcolors.HEADER+ str(e) + bcolors.ENDC)
        sys.exit(1)
    



# fait une moyenne 

def sendtoDB():
    global insert
    global query
    global update        
    global delete
    global vsize
    global count 
        
    
    
    if not count==0:
        date  = datetime.datetime.now()
        date0 = str(date)
        date1 = date0.split(' ')
        jour = date1[0]
        date2 = date1[1].split('.')
        heure = date2[0]
        
        json_metrique = {"insert": str(insert), "query": str(query), "update": str(update),"delete":str(delete),"vsize":vsize/count, "service":"mongodb"}
        #print(json_metrique)
        sendMetrique(jour,heure,json_metrique)
        insert=0
        query=0
        update=0
        delete=0
        vsize=0
        count =0
    

# recuperation des metrique 
def metriques(line):
    #print(line)
    sub=re.sub(' +',' ',line).split(" ")
    
    if not sub[0]=="insert":
        global insert
        global query
        global update
        global delete
        global vsize
        global count
        #print(count)
        count +=1
        
        insert += int(sub[1].replace("*", ""))
        query  += int(sub[2].replace("*", ""))
        update += int(sub[3].replace("*", ""))
        delete += int(sub[4].replace("*", ""))
        vsize += float(sub[10].split("G")[0])

       # print("insert",insert,"query",query,"update",update,"delete",delete,"vsize",vsize)
    #else: print("refresh")



schedule.every().hours.do(sendtoDB) # envoi le nombre de requttes toutes les heures
schedule.every(10).minutes.do(sendAlert)# envoi les alert au bacj toute les 10 minute


process = Popen("mongostat", stdout=PIPE, shell=True) # lance la commande mongostat



while True:
    schedule.run_pending()
    line = process.stdout.readline().decode("utf-8") # lecture de la ligne de commande
    metriques(line)
   # print(line)
    if not line :
        time.sleep(1)


        
        


        


  