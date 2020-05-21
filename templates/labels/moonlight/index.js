const fs = require("fs");
const path = require("path");
const pdf = require('html-pdf');
const handlebars = require("handlebars");
const nodeHtmlToImage = require('node-html-to-image')
//file path


const createMoonlightHTML = async function (request) {
   const width = request.width;
   const height = request.height;
   const filepath = path.join(__dirname, '/index' + width + 'x' + height + '.html');
   const htmlInput = request;
   console.log(htmlInput)
   const templateHtml = fs.readFileSync(filepath, 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   return html;
}


const createMoonlightPDF = async function (request) {
   const width = request.width;
   const height = request.height;
   const filepath = path.join(__dirname, '/index' + width + 'x' + height + '.html');

   const htmlInput = request;
   var templateHtml = fs.readFileSync(filepath, 'utf8');
   var template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   console.log(html)
   pdf.create(html).toStream(function (err, stream) {
      stream.pipe(fs.createWriteStream('./foo.pdf'));
   });
}

const createMoonlightImage = async function (request) {
   const width = request.width;
   const height = request.height;
   const filepath = path.join(__dirname, '/index' + width + 'x' + height + '.html');
   const htmlInput = request;
   var templateHtml = fs.readFileSync(filepath, 'utf8');
   var template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   await nodeHtmlToImage({
      output: './image.jpeg',
      html: html
   })
      .then(() => console.log('The image was created successfully!'))

}

module.exports = { createMoonlightHTML, createMoonlightPDF, createMoonlightImage }
