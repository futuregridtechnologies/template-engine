const fs = require("fs");

export const TemplateHandler = async (req, res) => {
   const data = req.query;
   const outputType = data.outputType;
   const outputFolder = data.template;
   console.log(data);

   var methods = require('./templates/' + outputFolder + '/index');
   if (outputType === 'html') {
      const function_name = "create" + data.templateName + "HTML";
      res.send(await methods[function_name](data));
   }
   else if (outputType === 'pdf') {
      const function_name = "create" + data.templateName + "PDF";
      await methods[function_name](data);
      const file = './foo.pdf';
      fs.readFile(file, function (err, info) {
         res.contentType('application/pdf');
         res.send(info)
      });
   } else {
      const function_name = "create" + data.templateName + "Image";
      await methods[function_name](data);
   }

}