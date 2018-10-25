    //---------------------------
    // buildOMDBQueryURL() - utility function to build the API query based on a title parameter
    //                 - returns {string} URL for GIPHY API based on form inputs
    //---------------------------
    function buildOMDBQueryURL(movie) {
        // queryURL is the url we'll use to query the API
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        // Logging the URL so we have access to it for troubleshooting
        console.log("buildOMDBQueryURL() - " + queryURL);

        return queryURL;
    }

    //---------------------------
    // performOMDBSearch(title) - uses the passed parameter to run a query against the Giphy back end API
    //-----------------------------
    function performOMDBSearch(movie) {

        // Build the query URL for the ajax request to the NYT API
        var queryURL = buildOMDBQueryURL(movie);

        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The response data gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log("--------- performOMDBSearch() response data ------------");
            console.log(response);
            console.log("--------------------------------------------------------");

          // Creating a div to hold the movie
          var movieDiv = $("<div class='movie'>");

          // Storing the rating data
          var rating = response.Rated;

          // Creating an element to have the rating displayed
          var pRating = $("<p>").text("Rating: " + rating);

          // Displaying the rating
          movieDiv.append(pRating);

          // Storing the release year
          var released = response.Released;

          // Creating an element to hold the release year
          var pReleased = $("<p>").text("Released: " + released);

          // Displaying the release year
          movieDiv.append(pReleased);

          // Storing the plot
          var plot = response.Plot;

          // Creating an element to hold the plot
          var pPlot = $("<p>").text("Plot: " + plot);

          // Appending the plot
          movieDiv.append(pPlot);

          // Retrieving the URL for the image
          var imgPosterURL = response.Poster;

          // Creating an element to hold the image
          var image = $("<img>").attr("src", imgPosterURL);

          // Appending the image
          movieDiv.append(image);

          // Replace the displayed card with the new movie
          $("#poster").empty();
          $("#poster").append(movieDiv);
        });
    }
