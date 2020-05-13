export const GET_RECIPE = `
   query simpleRecipe($id: Int!) {
      simpleRecipe(id: $id) {
      cuisine
      cookingTime
      author
      assets
      description
      image
      ingredients
      name
      procedures
   }
   }
`