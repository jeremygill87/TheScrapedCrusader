// Grab articles as json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        //Display information on page
        $("#articles").append("<p data-id=" + data[i]._id + ">" + data[i].title + "<br/>" + data[i].link + "</p>");
    }
});

// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
    
// })