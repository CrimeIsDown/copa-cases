'use strict';

let fs = require('fs');
let request = require('request');
let Minimize = require('minimize');
let cheerio = require('cheerio');
let json2csv = require('json2csv');

let url = "http://www.iprachicago.org/wp-content/themes/ipra/DynamicSearch.php?ss=&alt-ipracats=&notificationStartDate=&alt-notificationStartDate=&notificationEndDate=&alt-notificationEndDate=&incidentStartDate=&alt-incidentStartDate=&incidentEndDate=&alt-incidentEndDate=&district=";

request(url, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    let html = JSON.parse(body).caseSearch.items; // get the HTML inside the JSON
    let miniHtml = new Minimize().parse(html); // pull out all the extra spaces, tabs, newlines, and other wierd stuff
    generateCsv(cheerio.load(miniHtml)); // load that HTML into cheerio and start parsing
  } else {
    throw error;
  }
});

function generateCsv($) {
  let headers = [];
  let rows = [];

  $('table thead th').each((i, elem) => {
    headers[i] = $(elem).text(); // pull out column headers
  });

  headers.unshift('URL'); // add URL to the beginning of the array

  // write the individual rows
  $('table tbody tr').each((i, elem) => {
    rows[i] = {};
    rows[i][headers[0]] = $(elem).children('th').children('a').attr('href');  // URL
    rows[i][headers[1]] = $(elem).children('th').text();                      // Log#
    rows[i][headers[2]] = $(elem).children('td:nth-of-type(1)').text();       // Incident Types
    rows[i][headers[3]] = $(elem).children('td:nth-of-type(2)').text();       // IPRA Notification Date
    rows[i][headers[4]] = $(elem).children('td:nth-of-type(3)').text();       // Incident Date & Time
    rows[i][headers[5]] = $(elem).children('td:nth-of-type(4)').text();       // District of Occurrence
  });

  rows = sortByKey(rows, headers[1]); // sort by Log#

  let csv = json2csv({data: rows, fields: headers}); // convert to a CSV

  // write the new CSV
  fs.writeFile('cases.csv', csv, (err) => {
    if (err) throw err;
    console.log('file saved successfully');
  });
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
