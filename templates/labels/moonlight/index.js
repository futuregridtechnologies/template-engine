const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

export const createMoonlightHTML = async function (request) {
   const width = request.width;
   const height = request.height;
   const filepath = path.join(__dirname, '/index' + width + 'x' + height + '.html');
   const htmlInput = request;
   const templateHtml = fs.readFileSync(filepath, 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(htmlInput);
   return html;
}