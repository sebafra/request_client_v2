#!/bin/bash

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs

npm install -g nodemon

sudo npm install

# Create systemd service to manage node process, if not exists
FILE="/etc/systemd/system/app.service"

if [ ! -f $FILE ]; then
    if [ $stage = "production" ]; then
        /bin/cat <<EOM >> $FILE
[Unit]
Description=App_mobile

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/app_api
Environment=NODE_ENV=production NODE_PORT=2077
ExecStart=/usr/bin/nodemon /usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOM
    else
        /bin/cat <<EOM >> $FILE
[Unit]
Description=App_mobile

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/app_api
Environment=NODE_ENV=test NODE_PORT=3077
ExecStart=/usr/bin/nodemon /usr/bin/npm test
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOM
    fi
fi

# Restart app service
systemctl stop app
systemctl start app

rm /etc/nginx/sites-available/default
cp ./default /etc/nginx/sites-available/

sudo /etc/init.d/nginx reload

exit 0