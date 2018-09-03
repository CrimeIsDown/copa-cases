#!/bin/sh

set -ex

cd /tmp
if test ! -d copa-cases; then
    git clone git@github.com:CrimeIsDown/copa-cases.git
fi
cd copa-cases

git pull

yarn install

yarn run scrape

git add cases.csv
git commit -m "Incidents as of `date +"%F"`"
git push
