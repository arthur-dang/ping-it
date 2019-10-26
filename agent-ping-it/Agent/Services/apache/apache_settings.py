import argparse
import yaml
import os

parser = argparse.ArgumentParser(description='stores the settings in settings.yaml')

parser.add_argument('-access_log_path', '--access_log_path', type=str,
                    help='enter the token you got from Ping It to identify your agent')


args = parser.parse_args()
if args.access_log_path == None:
    args.access_log_path="/var/log/apache2/"
    print("defaul path : /var/log/apache2/")

apache_settings = {
'access_log_path': args.access_log_path

}

with open('apache_settings.yml', 'w') as outfile:
    yaml.dump(apache_settings, outfile, default_flow_style=False)
