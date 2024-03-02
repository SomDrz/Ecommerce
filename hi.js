const express = require("express")
const app = express()

const axios = require('axios');
const cheerio = require('cheerio');

const url = '';

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);

    // Use Cheerio selectors to loop through elements
    $('a').each((index, element) => {
      const linkText = $(element).text();
      const linkHref = $(element).attr('href');
      console.log(`Link ${index + 1}: ${linkText} (${linkHref})`);
    });
  })
  .catch(error => {
    console.error('Error fetching the page:', error);
  });




app.listen(8000,()=>{
    console.log("server => 8000")
}) 