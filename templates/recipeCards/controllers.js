import { client } from '../../lib/graphql'
import { GET_RECIPE } from '../../graphql/recipe'

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const pdf = require('html-pdf');

const createHTML = async (data) => {
   const recipeData = await client.request(GET_RECIPE, { id: data.id })
   const templateHtml = fs.readFileSync(path.join(process.cwd(), '/templates/recipeCards/views/' + data.templateName + '.html'), 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(recipeData.simpleRecipe);
   return html; s
}

const createPDF = async (data) => {
   const recipeData = await client.request(GET_RECIPE, { id: data.id })
   var templateHtml = fs.readFileSync(path.join(process.cwd(), '/templates/recipeCards/views/' + data.templateName + '.html'), 'utf8');
   var template = handlebars.compile(templateHtml);
   const html = template(recipeData.simpleRecipe);
   pdf.create(html).toStream(function (err, stream) {
      stream.pipe(fs.createWriteStream('./foo.pdf'));
   });
}

export const RecipeCardHandler = async (req, res) => {
   const outputType = req.params.outputType;
   const data = req.params;
   if (outputType === 'pdf') {
      const html = await createPDF(data);
      const file = './foo.pdf';
      fs.readFile(file, function (err, info) {
         res.contentType('application/pdf');
         res.send(info)
      });
      // try {
      //    fs.unlinkSync(file)
      // } catch (err) {
      //    console.error(err)
      // }
   }
   else if (outputType === 'html') {
      const html1 = await createHTML(data);
      res.send(html1);
   }

}