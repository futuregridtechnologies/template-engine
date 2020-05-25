export const GET_RECIPE = `
   query simpleRecipe($id: Int!) {
      simpleRecipe(id: $id) {
         name
         utensils
         procedures
         image
         description
         cuisine
         cookingTime
         author
         simpleRecipeYields {
           ingredientSachets {
             ingredientSachet {
               ingredient {
                 image
               }
             }
             slipName
             isVisible
           }
         }
       }  
   }
   
`