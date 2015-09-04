#!/bin/sh

# install mongo shell
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list
apt-get update
apt-get install -y mongodb-org-shell

# fill the database
mongo --host $DB_1_PORT_27017_TCP_ADDR faces demo/faces.js

# copy the images
mkdir -p public/images/faces
cp demo/faces/*.jpg public/images/faces/

# run server
PORT=3000 node server/www