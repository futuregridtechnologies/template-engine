const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeHtmlToImage = require('node-html-to-image')

const utils = require('util')
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)

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

export const createMoonlightPDF = async function (request) {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   const html = createMoonlightHTML(request)
   await page.setContent(html, { waitUntil: 'networkidle0' })
   await page.pdf({ path: 'foo.pdf', format: 'A4', landscape: true });
   await browser.close();
}

export const createMoonlightImage = async function (request) {
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
