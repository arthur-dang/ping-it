import argparse
import os
os.system("pip install pyyaml")
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

parser = argparse.ArgumentParser(description='stores the settings in settings.yaml')

parser.add_argument('-token', '--token', type=str,
                    help='enter the token you got from Ping It to identify your agent')

parser.add_argument('-email_warning', '--email_warning', type=str,
                    help='enter the email where you want to receive your warnings')

parser.add_argument('-IPmachine', '--IPmachine', type=str,
                    help='enter the IP of this machine')

parser.add_argument('-nom_machine', '--nom_machine', type=str,
                    help='enter the name you have given to this machine')

parser.add_argument('-services', '--services', nargs='+',
                    help='enter the list of the services you want')

args = parser.parse_args()

if(args.token== None):
    print( bcolors.BOLD+'no value token set to default' +bcolors.OKGREEN+'("")'+bcolors.ENDC)
    args.token=""
if(args.email_warning== None):
    print( bcolors.BOLD+'no value email_warning set to default' +bcolors.OKGREEN+'("")'+bcolors.ENDC)
    args.email_warning=""
if(args.IPmachine== None):
    print( bcolors.BOLD+'no value IPmachine set to default' +bcolors.OKGREEN+'("")'+bcolors.ENDC)
    args.IPmachine=""
if(args.nom_machine== None):
    print( bcolors.BOLD+'no value nom_machine set to default' +bcolors.OKGREEN+'("")'+bcolors.ENDC)
    args.nom_machine=""
if(args.services== None):
    print( bcolors.BOLD+'no value services set to default' +bcolors.OKGREEN+'("")'+bcolors.ENDC)
    args.services=""

print('token',args.token)
print('email_warning',args.email_warning)
print('IPmachine', args.IPmachine)
print('nom_machine',args.nom_machine)
print('services',args.services)

settings = {
'token': args.token,
'email_warning': args.email_warning,
'IPmachine': args.IPmachine,
'nom_machine': args.nom_machine,
'services': args.services
}

with open('settings.yml', 'w') as outfile:
    yaml.dump(settings, outfile, default_flow_style=False)



#install pip
os.system("pip3 install time")
os.system("pip3 install schedule")
os.system("pip3 install datetime")
os.system("pip3 install requests")
os.system("pip3 install re")
os.system("pip3 install subprocess")

