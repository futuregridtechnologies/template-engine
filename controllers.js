const fs = require("fs");

export const TemplateHandler = async (req, res) => {
   const data = req.query;
   const outputType = data.outputType;
   const outputFolder = data.template;

   var methods = require('./templates/' + outputFolder + '/index');
   if (outputType === 'html') {
      const function_name = "create" + data.templateName + "HTML";
      res.send(await methods[function_name](data));
      // const filepath2 = path.join(__dirname, './templates/recipeCards/moonlight/a4_back.html');
      // const templateHtml = fs.readFileSync(filepath2, 'utf8');
      // const template = handlebars.compile(templateHtml);
      // const html = template();
      // res.write(html);
      // res.end()
   }
   else if (outputType === 'pdf') {
      const function_name = "create" + data.templateName + "PDF";
      await methods[function_name](data);
      const file = './foo.pdf';
      fs.readFile(file, function (err, info) {
         res.contentType('application/pdf');
         res.send(info)
      });
      // fs.unlink(file, function (err) {
      //    if (err) throw err;
      //    // if no error, file has been deleted successfully
      //    console.log('File deleted!');
      // });
   } else {
      const function_name = "create" + data.templateName + "Image";
      res.send(await methods[function_name](data));
   }

}