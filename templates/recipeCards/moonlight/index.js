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

export const createMoonlightHTML = async function (request) {
   const htmlInput = await client.request(GET_RECIPE, { id: request.id })
   handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
   });
   const templateHtml = fs.readFileSync(filepath, 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(htmlInput.simpleRecipe);
   return html;
}


export const createMoonlightPDF = async function (request) {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   const html = await createMoonlightHTML(request)
   await page.setContent(html, { waitUntil: 'networkidle0' })
   await page.pdf({ path: 'foo.pdf', format: 'A4', landscape: true });
   await browser.close();
}

export const createMoonlightImage = async function (request) {

   const html = await createMoonlightHTML(request)
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