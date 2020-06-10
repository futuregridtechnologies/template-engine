import { create } from "domain";

const fs = require("fs");
const videoshow = require('videoshow')
const path = require("path");
const nodeHtmlToImage = require('node-html-to-image')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var ffprobe = require('ffprobe-static');
ffmpeg.setFfprobePath(ffprobe.path);


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


const createPDF = async function (html, format) {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.setContent(html, { waitUntil: 'networkidle0' })
   await page.pdf({ path: 'foo.pdf', format: format, landscape: true, printBackground: true });
   await browser.close();
}

const createImage = async function (html, nameOfImage = 'image') {
   nameOfImage = './output/' + nameOfImage + '.jpeg'
   await nodeHtmlToImage({
      output: nameOfImage,
      html: html
   })
      .then(() => console.log('The image was created successfully!'))

}

const createVideo = async function (html) {
   const images = getFiles('./output');
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


export const TemplateHandler = async (req, res) => {
   const data = req.query;
   const outputType = data.outputType;
   const outputFolder = data.template;
   var methods = require('./templates/' + outputFolder + '/index');
   const function_name = "create" + data.templateName + "HTML";
   const html = await methods[function_name](data);
   switch (outputType) {
      case 'pdf':
         const format = 'A4'
         createPDF(html, format);
         // const file = './foo.pdf';
         // fs.readFile(file, function (err, info) {
         //    res.contentType('application/pdf');
         //    res.send(info)
         // });
         break;
      case 'image':
         createImage(html);
         break;
      case 'video':
         createVideo(html);
         break;
   }
   res.send(html);

}