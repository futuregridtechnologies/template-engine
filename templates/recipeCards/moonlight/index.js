import { client } from '../../../lib/graphql'

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const utils = require('util')
const readFile = utils.promisify(fs.readFile)

const filepath = path.join(__dirname, '/a4.html');

const GET_RECIPE = `
   query MyQuery($id:INT!) {
      orderMealKitProduct(id: $id) {
        simpleRecipeProduct {
          name
          simpleRecipe {
            author
            cookingTime
            cuisine
            image
            procedures
            type
            utensils
          }
          tags
        }
        simpleRecipeProductOption {
          simpleRecipeYield {
            yield
            ingredientSachets {
              slipName
            }
          }
        }
      }
    }
`


export const createMoonlightHTML = async function (request) {
   const htmlInput = await client.request(GET_RECIPE, { id: request.id })
   handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
   });
   const templateHtml = fs.readFileSync(filepath, 'utf8');
   const template = handlebars.compile(templateHtml);
   const html = template(htmlInput.orderMealKitProduct);
   return html;
}


 // query simpleRecipe($id: Int!) {
   //    simpleRecipe(id: $id) {
   //       name
   //       utensils
   //       procedures
   //       image
   //       description
   //       cuisine
   //       cookingTime
   //       author
   //       simpleRecipeYields {
   //         ingredientSachets {
   //           ingredientSachet {
   //             ingredient {
   //               image
   //             }
   //           }
   //           slipName
   //           isVisible
   //         }
   //       }
   //     }  
   // }