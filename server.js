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

// A GET route for scraping the Vice Election 2020 website
app.get("/scrape", function(req, res) {
    // Grab the body of the html with axios
    axios.get("https://www.vice.com/en_us/topic/2020").then(function(response) {
        // Load into cheerio and save it to $
        var $ = cheerio.load(response.data);
        console.log($);
        var results = [];
            $(".topics-card__heading-link").each(function(i, element) {
                var title = $(element).text();
                var link = $(element).attr("href");
            

            results.push({
                title: title,
                link: link,
            });
            });
        
        res.send("Scrape Complete");
        console.log(results);        
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({_id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});