#!/bin/bash
docker-compose down
if [ ! -z $1 ] 
then 
    : git checkout $1
else
    : git checkout master
fi
git pull 
cd frontend
cd formulavis
npm install
npm run build
docker-compose up --build -d


