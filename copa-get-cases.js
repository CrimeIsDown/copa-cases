'use strict';

let fs = require('fs');
let Minimize = require('minimize');
let cheerio = require('cheerio');
let json2csv = require('json2csv');

fs.readFile('cases.html', 'utf8', (error, html) => {
  if (error) {
    throw error
  } else {
    html = html.replace(/<!--/g, '').replace(/-->/g, '');
    let miniHtml = new Minimize().parse(html); // pull out all the extra spaces, tabs, newlines, and other wierd stuff
    generateCsv(cheerio.load(miniHtml)); // load that HTML into cheerio and start parsing
  }
});

function generateCsv($) {
  let headers = [
    'URL',
    'Log#',
    'Incident Types',
    'IPRA/COPA Notification Date',
    'Incident Date & Time',
    'District of Occurrence'
  ];
  let rows = [];

  // write the individual rows
  $('table tbody tr').each((i, elem) => {
    rows[i] = {};
    rows[i][headers[0]] = $(elem).children('th').children('a').attr('href');  // URL
    rows[i][headers[1]] = $(elem).children('th').text();                      // Log#
    rows[i][headers[2]] = $(elem).children('td:nth-of-type(8)').text();       // Incident Types
    rows[i][headers[3]] = $(elem).children('td:nth-of-type(3)')[0].childNodes[1]?.nodeValue || 'N/A';       // COPA Notification Date
    rows[i][headers[4]] = $(elem).children('td:nth-of-type(1)')[0].childNodes[1]?.nodeValue || 'N/A';       // Incident Date & Time
    rows[i][headers[5]] = $(elem).children('td:nth-of-type(2)').text();       // District of Occurrence
  });

  rows = sortByKey(rows, headers[1]); // sort by Log#

  let csv = json2csv({data: rows, fields: headers}); // convert to a CSV

  // write the new CSV
  fs.writeFile('cases.csv', csv + "\n", (err) => {
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
