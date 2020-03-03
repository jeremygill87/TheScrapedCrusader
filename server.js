var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models/Index");

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Routes
var results = [];
function empty() {
    results = [];
}
// A GET route for scraping the Vice Election 2020 website
app.get("/scrape", function(req, res) {
    empty();
    // Grab the body of the html with axios
    axios.get("https://www.vice.com/en_us/topic/2020").then(function(response) {
        // Load into cheerio and save it to $
        var $ = cheerio.load(response.data);
        console.log($);
        // Grab everything under the className topics-card__heading-link
            $(".topics-card__heading-link").each(function(i, element) {
                // Add the text and href of the links
                var title = $(element).text();
                var link = $(element).attr("href");
                
                results.push({
                    title: title,
                    link: link
                })
                db.Article.create(results)
                    .then(function(dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function(err) {
                        console.log(err);
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

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        })
})

// Start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});