#!/bin/bash

set -euo pipefail

git pull

curl -fSs "https://www.chicagocopa.org/wp-content/themes/copa/DynamicSearch.php?ss=&alt-ipracats=&notificationStartDate=&alt-notificationStartDate=&notificationEndDate=&alt-notificationEndDate=&incidentStartDate=&alt-incidentStartDate=&incidentEndDate=&alt-incidentEndDate=&district=" | \
jq -r '.caseSearch.items' > cases.html

npm run scrape

rm cases.html

git add cases.csv
git commit -m "Incidents as of `date +"%F"`"

git remote set-url origin git@github.com:CrimeIsDown/copa-cases.git
git push
