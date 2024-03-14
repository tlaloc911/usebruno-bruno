const fs = require('fs');
const path = require('path');
const xmlFormatter = require('xml-formatter');

const makeHtmlOutput = async (results, outputPath) => {

    results.results.forEach(result => {
		console.log(result)
	  if (result.request.headers.hasOwnProperty('Authorization')) {

		result.request.headers.Authorization = '*****';
	  }
	  
	  
	  if(result.response.data[0]=='<')
	  {
		  try
		  {
			result.response.beautydata = xmlFormatter(result.response.data,{collapseContent: true});
		  }
		  catch (error)
		  {
			  console.log(error)
			  result.response.beautydata = ""
		  }
	  }
	});
  
  const resultsJson = JSON.stringify(results, null, 2);

  const reportPath = path.join(__dirname, 'html-template.html');
  const template = fs.readFileSync(reportPath, 'utf8');

  fs.writeFileSync(outputPath, template.replace('__RESULTS_JSON__', resultsJson));
};

module.exports = makeHtmlOutput;
