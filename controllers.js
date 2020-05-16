var methods = require('./templates/index');
const fs = require("fs");

export const TemplateHandler = async (req, res) => {
   const data = req.query;
   const outputType = data.outputType;
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
   }

}