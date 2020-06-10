import { client } from '../../../lib/graphql'
import { GET_RECIPE } from '../../../graphql/recipe'

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const utils = require('util')
const readFile = utils.promisify(fs.readFile)

const filepath = path.join(__dirname, '/a4.html');

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
