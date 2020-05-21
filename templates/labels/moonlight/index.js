const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeHtmlToImage = require('node-html-to-image')

const utils = require('util')
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)
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


async function getTemplateHtml(filepath) {
   console.log("Loading template file in memory")
   try {
      const invoicePath = path.resolve(filepath);
      return await readFile(invoicePath, 'utf8');
   } catch (err) {
      return Promise.reject("Could not load html template");
   }
}

const createMoonlightPDF = async function (request) {
   const width = request.width;
   const height = request.height;
   const filepath = path.join(__dirname, '/index' + width + 'x' + height + '.html');
   const data = request;
   getTemplateHtml(filepath)
      .then(async (res) => {
         console.log("Compilng the template with handlebars")
         const template = handlebars.compile(res, { strict: true });
         const result = template(data);
         const html = result;

         const browser = await puppeteer.launch();
         const page = await browser.newPage()

         await page.setContent(html)

         await page.pdf({ path: 'foo.pdf', format: 'A4' })

         await browser.close();
         console.log("PDF Generated")

      })
      .catch(err => {
         console.error(err)
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
