import { client } from '../../../lib/graphql'
import { GET_RECIPE } from '../../../graphql/recipe'

const videoshow = require('videoshow')
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeHtmlToImage = require('node-html-to-image')
const merge = require('easy-pdf-merge');
const cheerio = require('cheerio');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);


const utils = require('util')
const puppeteer = require('puppeteer')
const readFile = utils.promisify(fs.readFile)

const filepath = path.join(__dirname, '/a4_front.html');
const filepath2 = path.join(__dirname, '/a4_back.html');

export const createMoonlightHTML = async function (request) {
   const htmlInput = await client.request(GET_RECIPE, { id: request.id })
   handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
   });
   var outputHTML = '<html><head><link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet"><style type = "text/css"><!--@page rotated { size : landscape }--></style></head><body style="border: 1px solid #111111;margin: auto;margin-bottom: auto;background: #FFFFFF;width: 792px;font-family: Arial;">';
   let templateHtml = fs.readFileSync(filepath, 'utf8');
   let template = handlebars.compile(templateHtml);
   let html = template(htmlInput.simpleRecipe);
   templateHtml = fs.readFileSync(filepath2, 'utf8');
   template = handlebars.compile(templateHtml);
   let html2 = template(htmlInput.simpleRecipe);
   var $front = cheerio.load(html);
   var $back = cheerio.load(html2);
   outputHTML += $front('body').html()
   outputHTML += '<div style="width:100%;height:0px; border-top:1px solid "></div>';
   outputHTML += $back('body').html()
   outputHTML += '</body></html>';
   return outputHTML;
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

export const createMoonlightPDF = async function (request) {
   const data = await client.request(GET_RECIPE, { id: request.id });
   console.log(data.simpleRecipe)
   handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
   });
   await getTemplateHtml(filepath)
      .then(async (res) => {
         console.log("Compiling the template with handlebars  1")
         const template = handlebars.compile(res, { strict: true });
         const result = template(data.simpleRecipe);

         const browser = await puppeteer.launch();
         const page = await browser.newPage()

         await page.setContent(result)

         await page.pdf({ path: 'Page1.pdf', format: 'A4', landscape: true })
         await browser.close();
         console.log("PDF Generated")

      })
      .catch(err => {
         console.error(err)
      });
   await getTemplateHtml(filepath2)
      .then(async (res) => {
         console.log("Compiling the template with handlebars 2")
         const template = handlebars.compile(res, { strict: true });
         const result = template(data.simpleRecipe);
         const html = result;
         console.log(html);
         const browser = await puppeteer.launch();
         const page = await browser.newPage()

         await page.setContent(html)

         await page.pdf({ path: 'Page2.pdf', format: 'A4', landscape: true })

         await browser.close();
         console.log("PDF Generated")

      })
      .catch(err => {
         console.error(err)
      });

   merge(['Page1.pdf', 'Page2.pdf'], 'foo.pdf', function (err) {
      if (err) {
         return console.log(err)
      }
      console.log('Successfully merged!')
      fs.unlink('Page1.pdf', function (err) {
         if (err) throw err;
         // if no error, file has been deleted successfully
         console.log('File deleted!');
      });
      fs.unlink('Page2.pdf', function (err) {
         if (err) throw err;
         // if no error, file has been deleted successfully
         console.log('File deleted!');
      });
   });

}

export const createMoonlightImage = async function (request) {

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

export const createMoonlightVideo = async function (request) {
   var images = [
      './assets/images/step1.jpg',
      './assets/images/step2.jpeg',
      './assets/images/step3.png',
   ]

   await videoshow(images)
      .save('video.mp4')
      .on('start', function () {
         console.log("started")
      })
      .on('error', function (err, stdout, stderr) {
         console.error('Error:', err)
         console.error('ffmpeg stderr:', stderr)
      })
      .on('end', function (output) {
         console.error('Video created in:', output)
      })
}