# -*- coding: utf-8 -*s

import yaml
import os
import sys
import signal
import requests
from multiprocessing.dummy import Pool as ThreadPool
import multiprocessing
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
with open('settings.yml', 'r') as f:
  settings = yaml.load(f)

IPmachine = settings.get("IPmachine")
token = settings.get("token")
services = settings.get("services")
email_warning = settings.get("email_warning")
nom_machine = settings.get("nom_machine")
# choose your proxy 
#proxy='http://localhost:3000/back'
proxy='https://ping-it.cs-campus.fr/back'
# ajout une ip dans le back et permet une modification 
try :
    r = requests.post(proxy+'/sql/ajoutIP',
        json={ "token": token, "IPmachine": IPmachine,
        "email_warning": email_warning, "nom_machine": nom_machine,"service": services})
    print( bcolors.BOLD+bcolors.OKBLUE+"Connexion succes !" + bcolors.ENDC)

except requests.exceptions.RequestException as e:
    print( bcolors.FAIL  + 'Connexion Failed'  + bcolors.ENDC)
    print (bcolors.BOLD+bcolors.HEADER+ str(e) + bcolors.ENDC)
    sys.exit(1)

# lancer en thread un service 
def worker(service):

    os.system("cd Services/"+ service +"/&& python3 " + service +".py")

    return
# lance en multi-threading les services
def init() : 
    jobs=[]
    for s in services:
        p = multiprocessing.Process(target=worker, args=(s,))
        jobs.append(p)
        p.start()
    

    
init()

