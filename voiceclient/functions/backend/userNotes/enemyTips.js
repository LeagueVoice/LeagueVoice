let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');

let $ = cheerio.load('http://lolcounter.com/tips/ahri/zed');
jsonframe($); // initializes the plugin

var frame = {
	"tips": {           // setting the parent item as "companies"
		"tip": "_tip",    // defines the elements to search for
		"data": [{              // "data": [{}] defines a list of items
			"name": ".header [itemprop=name]",          // inline selector defining "name" so "company"."name"
			"description": ".header [rel=description]", // inline selector defining "description" as "company"."description"
			"url": {                                    // defining "url" by an attribute with "attr" and "selector" in an object
				"selector": ".header [itemprop=name]",      // is actually the same as the inline selector
				"attr": "href"                              // the attribute name to retrieve
			},
			"contact": {                                // set up a parent "contact" element as "company"."contact"
				"selector": ".contact",                 // defines the element to search for
				"data": {                               // defines the data which "contact" will contain
					"telephone": {                          // using "type" to use "telephone" parser to extract only the telephone
						"selector": "[itemprop=telephone]",     // simple selector for "telephone"                
						"type": "telephone"                     // using "telephone" plugin parser
					},
					"employee": {                           // setting a parent node "employee" as "company"."contact"."employee"
						"name": "[itemprop=employeeName]",          // inline selector defining "name"
						"jobTitle": "[itemprop=employeeJobTitle]",  // inline selector defining "jobtitle"
						"email": {                          // using "type" to use "email" parser to extract only the email
							"selector": "[itemprop=email]",     // simple selector for "email"
							"type": "email"                     // using "email" plugin parser
						}
					}
				}
			}
		}]
	}

};

var companiesList = $('.list.items').scrape(frame);
console.log(companiesList);