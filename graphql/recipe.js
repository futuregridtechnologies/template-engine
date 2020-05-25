export const GET_RECIPE = `
   query simpleRecipe($id: Int!) {
      simpleRecipe(id: $id) {
         assets
         cuisine
         procedures
         ingredients
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