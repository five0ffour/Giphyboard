//---------------------------
// $(document).ready() -  calls when the page loads,  holds our functions, handlers and global variables
//---------------------------
$(document).ready(function () {

    // GLOBAL VARIABLES 
    var searches = []; //  hold the metadata about each giphy submission
    var cartoonItem = {
        gifMetaData: [], // array of query data objets
        gifImg: [], // array of <img> objects
        animated: false // display the static image as the default
    }


    //---------------------------
    // buildQueryURL() - utility function to build the API query based on a title parameter
    //                 - returns {string} URL for GIPHY API based on form inputs
    //---------------------------
    function buildQueryURL(title) {
        // queryURL is the url we'll use to query the API
        var queryURL = "https://api.giphy.com/v1/gifs/search?";

        // Set the API key
        var queryParams = {
            "api_key": "Ww8IcKqOH2Bk4bPI36jF4Q5KGQswhwog"
        };

        // Add the remaining parameters including the item to search for
        queryParams.q = title;
        queryParams.limit = "10";
        queryParams.offset = "0";
        // queryParams.rating = "G";
        queryParams.lang = "en";

        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));

        return queryURL + $.param(queryParams);
    }

    //---------------------------
    // updatePage(giphyData) - called by AJAX resposne, turns JSON  into elements on the page
    //---------------------------
    function updatePage(giphyData) {

        // Cap the number of gifs to display at 10 images
        const numGifs = giphyData.data.length < 10 ? giphyData.data.length : 10;

        // save the button search meta data so we can recall it later
        searches.push(cartoonItem);

        // Log the giphyData to console, where it will show up as an object
        console.log(giphyData);
        console.log("------------------------------------");

        // Loop through and build buttons for the defined number of gifs
        for (var i = 0; i < numGifs; i++) {
            // Get specific gif metadata for current index
            var gif = giphyData.data[i];

            // Create the  list group to contain the articles and add the article content for each
            var gifList = $("<ul>");
            gifList.addClass("list-group");

            // Add the newly created element to the DOM
            $("#cartoons").append(gifList);

            var gifListItem = $("<li class='list-item'>");

            gifListItem.append(
                "<span class='label'>" +
                "<strong>" + gif.title + "</strong>" +
                "</span>" +
                " - " +
                "<span> Rating: " + gif.rating + "</span>" +
                "<br></br>"
            );

            // Create a new <img> element
            var gifImg = $("<img>");

            // Save the metadata and link it to the DOM elements  for use by the image click event
            cartoonItem.gifMetaData.push(gif);

            // Update the screen item, with indexes it to the saved metadata
            $(gifImg).addClass("cartoon-img");
            $(gifImg).attr("src", gif.images.fixed_height_still.url);
            $(gifImg).attr("alt", gif.title);
            $(gifImg).attr("data-searchIdx", searches.length - 1);
            $(gifImg).attr("data-gifIdx", cartoonItem.gifMetaData.length - 1);
            gifListItem.append(gifImg);
            gifList.append(gifListItem);
        }
    }


    //-----------------------
    // clear() -  empty out the images on the screen in advance of a refresh
    //-----------------------
    function clear() {
        $("#cartoons").empty();
    }

    // ==========================================================
    // CLICK HANDLERS
    // ==========================================================

    //-----------------------
    // $("#addCartoon").on("click") - event handler for "Add Button" event - adds a new button and associated images to the screen
    //-----------------------
    $("#addCartoon").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the search
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();

        // Empty the region associated with the gifs
        clear();

        // Grab text the user typed into the search input and build a query string around it
        var cartoonTitle = $("#cartoon-input")
            .val()
            .trim();

        // Build the query URL for the ajax request to the NYT API
        var queryURL = buildQueryURL(cartoonTitle);

        // Add a button to the main title screen
        var btn = $("<button>");
        btn.text(cartoonTitle);
        btn.addClass("cartoon-btn");
        $("#cartoonButtons").append(btn);

        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The data then gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
    });

    //-----------------------
    //  $("#clear-all").on("click") - clear button to clear the screen (when we add one)
    //-----------------------
    $("#clear-all").on("click", clear);

    //-----------------------
    // $(document).on("click", ".cartoon-btn") - generatic function to fresh screen on query button clicks
    //-----------------------
    $(document).on("click", ".cartoon-btn", function () {
        alert("clicked button!");
    });

    //-----------------------
    // $(document).on("click",".cartoon-img")  - generic function to animate specific image on any image click
    //-----------------------
    $(document).on("click", ".cartoon-img", function () {

        var cartoonItem = searches[$(this).attr("data-searchIdx")];
        var gifMeta = cartoonItem.gifMetaData[$(this).attr("data-gifIdx")];
        if (cartoonItem) {
            cartoonItem.animated = !cartoonItem.animated;
            if (cartoonItem.animated) {
                $(this).attr("src", gifMeta.images.fixed_height.url);
            } else {
                $(this).attr("src", gifMeta.images.fixed_height_still.url);
            }
        }
    });

});