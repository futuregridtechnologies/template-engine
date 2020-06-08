
//for making graphql query
import { client } from './lib/graphql'
import { GET_RECIPE } from './graphql/recipe'
//making video from images
const videoshow = require('videoshow')
//for reading file
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeHtmlToImage = require('node-html-to-image')
const merge = require('easy-pdf-merge');
//for merging multiple html into single one
const cheerio = require('cheerio');
//required for videoshow module
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);

//for pdf generation
const utils = require('util')
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)

function getFiles(dir, files_) {
   files_ = files_ || [];
   var files = fs.readdirSync(dir);
   for (var i in files) {
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
         getFiles(name, files_);
      } else {
         files_.push(name);
      }
   }
   return files_;
}


function createHTML(files, htmlInput) {
   var outputHTML = `
   <html lang="en">
   <head>
      <meta charset="UTF-8">
      <style>@import url('https://fonts.googleapis.com/css?family=Pacifico');</style> 
   </head> 
   <body 
   border: 1px solid #111111;
   margin: auto;
   background: #FFFFFF;
   font-family: Arial;
   font-style: normal;
   >
   `
   if (Array.isArray(files)) {
      files.forEach(file => {
         let templateHtml = fs.readFileSync(file, 'utf8');
         let template = handlebars.compile(templateHtml);
         let html = template(htmlInput);
         var $page = cheerio.load(html);
         outputHTML += $page('body').html();
      })
   } else {
      let templateHtml = fs.readFileSync(files, 'utf8');
      let template = handlebars.compile(templateHtml);
      let html = template(htmlInput);
      var $page = cheerio.load(html);
      outputHTML += $page('body').html();
   }
   outputHTML += '</body></html>';
   return outputHTML;
}

const createPDF = async function (files, htmlInput) {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();

   var pdfFiles = [];

   for (var i = 0; i < files.length; i++) {
      var html = createHTML(files[i], htmlInput)
      await page.setContent(html, { waitUntil: 'networkidle0' })
      var pdfFileName = 'sample' + (i + 1) + '.pdf';
      pdfFiles.push(pdfFileName);
      await page.pdf({ path: pdfFileName, format: 'A4', landscape: true });
   }

   await browser.close();
   if (pdfFiles.length > 1) {
      await mergeMultiplePDF(pdfFiles);
   }
}

const mergeMultiplePDF = (pdfFiles) => {
   return new Promise((resolve, reject) => {
      merge(pdfFiles, 'samplefinal.pdf', function (err) {
         if (err) {
            console.log(err);
            reject(err)
         }
         console.log('Success');
         resolve()
      });
   });
};

const createImage = async function (html) {
   await nodeHtmlToImage({
      output: './image.jpeg',
      html: html,
      waitUntil: 'networkidle0'
   })
      .then(() => console.log('The image was created successfully!'))

}

export const TemplateHandler = async (req, res) => {
   const data = req.query;
   const outputType = data.outputType;
   const template = data.template; // labels or recipecards
   const outputFolder = data.outputFolder
   const directoryPath = path.join(__dirname, '/templates/' + template + '/' + outputFolder);
   const listOfFiles = getFiles(directoryPath)
   let htmlInput;
   switch (template) {
      case 'recipeCards':
         htmlInput = await client.request(GET_RECIPE, { id: data.id });
         htmlInput = htmlInput.simpleRecipe;
         break;
      case 'labels':
         htmlInput = data;
         break;
   }
   const html = createHTML(listOfFiles, htmlInput)
   switch (outputType) {
      case 'pdf':
         createPDF(listOfFiles, htmlInput)
         break;
      case 'image':
         createImage(html)
         break;
      case 'video':
         //createVideo()
         break;
   }
   res.send(html)
}