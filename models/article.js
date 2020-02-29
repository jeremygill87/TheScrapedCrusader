var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Use Schema constructor to create a new UserSchema object
var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

// Creates model from above schema
var Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;