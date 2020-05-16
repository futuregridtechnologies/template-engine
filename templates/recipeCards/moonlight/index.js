const fs = require("fs");
const path = require("path");
const pdf = require('html-pdf');
const handlebars = require("handlebars");

//file path
const filepath = path.join(__dirname, '/index.html');

const createMoonlightHTML = async function (request) {
   const htmlInput = request.params;
   const templateHtml = fs.readFileSync(filepath, 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   return html;
}


const createMoonlightPDF = async function (request) {
   const htmlInput = request.params;
   var templateHtml = fs.readFileSync(filepath, 'utf8');
   var template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   pdf.create(html).toStream(function (err, stream) {
      stream.pipe(fs.createWriteStream('./foo.pdf'));
   });
}

module.exports = { createMoonlightHTML, createMoonlightPDF }
