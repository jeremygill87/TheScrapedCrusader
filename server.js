var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/articlePopulate", { useNewUrlParser: true });

// Routes

// A GET route for scraping the NYTimes website
app.get("/scrape", function(req, res) {
    // Grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function(response) {
        // Load into cheerio and save it to $
        var $ = cheerio.load(response.data);

        // Empty array
        var results = [];

        $("article").each(function(i, element) {

            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");

            // Save results in an object that will be pushed into the results array defined earlier
            results.push({
                title: title,
                link: link
            });
        });

        console.log(results);        
    });
});