//---------------------------
// $(document).ready() -  calls when the page loads,  holds our functions, handlers and global variables
//---------------------------
$(document).ready(function () {

    // GLOBAL VARIABLES 
    var numGifsPerSearch = 10;
    var gifRating = "none";

    // List of buttons to preload when page starts
    var topics = [
        "Toy Story",
        "A Bug's Life",
        "Monsters, Inc.",
        "Finding Nemo",
        "The Incredibles",
        "Cars",
        "Ratatouille",
        "WALL-E",
        "Up",
        "Brave",
        "Inside Out",
        "The Good Dinosaur",
        "Coco"
    ];
    var lastTopicSearch = topics[topics.length-1];     // note tracking the last topic searched

    /******************************************* */
    /* initalize the page with our seeded topics */
    /******************************************* */
    loadPage(lastTopicSearch);

    //-----------------------------
    // loadPage() - runs as soon as the page is refreshed (loaded), it creates the default buttons of our topic    
    //-----------------------------
    function loadPage(title) {

        // Loop through each of the topics adding a button of that name
        for (var i = 0;
            (i < topics.length); i++) {
            var btnLbl = topics[i];
            addButton(btnLbl);
        }
        // search and display the first button's topic
        performGiphySearch(title);
        performOMDBSearch(title);
    }

    //-----------------------------------------------
    // addButton() - adds a button to the title bar
    //-----------------------------------------------
    function addButton(title) {

        // Add a button to the main title screen
        var btn = $("<button>");
        btn.text(title);
        btn.addClass("gif-btn");
        btn.attr("data-topic", title);
        $("#gifButtons").append(btn);
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
        // add the keyword "pixar" to the search to help boost pixar related content
        queryParams.q = title + " pixar";
        queryParams.limit = numGifsPerSearch;
        queryParams.offset = "0";

        // Add a rating filter if applicable
        if (gifRating != "none") {
            queryParams.rating = gifRating;
        }

        queryParams.lang = "en";

        // Logging the URL so we have access to it for troubleshooting
        console.log(queryURL + $.param(queryParams));

        return queryURL + $.param(queryParams);
    }

    //---------------------------
    // performGiphySearch(title) - uses the passed parameter to run a query against the Giphy back end API
    //-----------------------------
    function performGiphySearch(title) {

        // Build the query URL for the ajax request to the NYT API
        var queryURL = buildQueryURL(title);

        // Save this search to a global variable
        lastTopicSearch = title;

        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The response data gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
    }

    //---------------------------
    // updatePage(responseData) - called by AJAX resposne, turns JSON  into elements on the page
    //
    //      Appends/creates the following UI element:
    //      <div id="gifs">
    //          <ul class="list-group">
    //              <li class="list-item>">
    //                  <span class="label"><strong>Title</strong></span>
    //                  <br>
    //                  <img src=url'(stillUrl)' alt="gif title" class="gif-img" data-animated="still" data-topicIdx=0 
    //                       data-stillURL="url(still_gif_url)" data-animateUrl="url(animate_gif_url)">
    //                  <br>
    //                  <span>Rated: G</span>
    //                  <br>
    //              </li>
    //          </ul>
    //      </div>
    //---------------------------
    function updatePage(responseData) {

        // Cap the number of gifs to display at the user set limit of numGifsPerSearch 
        const numGifs = responseData.data.length < numGifsPerSearch ? responseData.data.length : numGifsPerSearch;

        // Log the giphyData to console, where it will show up as an object
        console.log(responseData);
        console.log("------------------------------------");

        // Create unordered list element and attach to main HTML element 
        var gifListElem = $("<ul>");
        gifListElem.addClass("list-group");
        $("#gifs").append(gifListElem);

        // Loop through and build buttons for the defined number of gifs
        for (var i = 0; i < numGifs; i++) {

            // Get specific gif metadata for current index
            var gifData = responseData.data[i];
            var gifListItemElem = $("<li class='list-item'>");

            // Add Title
            var gifSpanTitle = $("<span>");
            gifSpanTitle.addClass("label");
            gifSpanTitle.html("<strong>" + (i+1) + ") " + gifData.title + "</strong>");
            gifListItemElem.append(gifSpanTitle);
            gifListItemElem.append($("<br>"));

            // Find the index of the current item and save it as metadata to the element
            var topicIdx = topics.indexOf(lastTopicSearch);

            // Update the screen item, with indexes it to the saved metadata
            var gifImgElem = $("<img>");
            $(gifImgElem).addClass("gif-img");
            $(gifImgElem).attr("src", gifData.images.fixed_height_still.url);
            $(gifImgElem).attr("alt", gifData.title);
            $(gifImgElem).attr("data-animated",  "still");
            $(gifImgElem).attr("data-topicIdx", topicIdx);
            $(gifImgElem).attr("data-animateUrl", gifData.images.fixed_height.url);
            $(gifImgElem).attr("data-stillUrl", gifData.images.fixed_height_still.url);

            // Chain it all to the DOM
            gifListItemElem.append(gifImgElem);

            // Add Rating
            var gifSpanRating = $("<span>");
            gifListItemElem.append($("<br>"));
            gifSpanRating.html("Rated: " + gifData.rating.toUpperCase());
            gifListItemElem.append(gifSpanRating);
            gifListItemElem.append($("<br>"));

            gifListElem.append(gifListItemElem);
        }
    }


    //-----------------------
    // clear() -  empty out the images on the screen in advance of a refresh
    //-----------------------
    function clear() {
        $("#gifs").empty();
    }

    // ==========================================================
    // CLICK HANDLERS
    // ==========================================================

    //-----------------------
    // $(document).on("click", ".gif-btn") - generatic function to fresh screen on query button clicks
    //-----------------------
    $(document).on("click", ".gif-btn", function () {
        var title = $(this).attr("data-topic");
        clear();
        performGiphySearch(title);
        performOMDBSearch(title);
    });

    //-----------------------
    // $("#addGif").on("click") - event handler for "Add Gif" button event -
    //                            adds a new button and associated images to the screen
    //                            submits a query using the selected filters
    //-----------------------
    $("#addGif").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the topic
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();

        // Grab text the user typed into the search input and build a query string around it
        var title = $("#gif-input").val().trim();
        topics.push(title);

        // save this as the last search item in our global variable
        lastTopicSearch = title;

        // Empty the region associated with the gifs, add a button and rebuild the page
        clear();
        addButton(title);
        performGiphySearch(title);
        performOMDBSearch(title);
    });

    //-----------------------
    //  $("#clear-all").on("click") - clear button to clear the screen (when we add one)
    //-----------------------
    $("#clear-all").on("click", clear);

    //-----------------------
    // $(document).on("click",".gif-img")  - generic function to animate specific image on any image click
    //-----------------------
    $(document).on("click", ".gif-img", function () {

        // Use our saved response data to flip the url from static to animated
        var imgElem = $(this);

        // flip the animated flag's state and display the appropriate url
        if (imgElem.attr("data-animated") === "animate") {
            // Currently animated, make it still
            var stillUrl = imgElem.attr("data-stillUrl");
            imgElem.attr("data-animated", "still");
            imgElem.attr("src", stillUrl);
        } else {
            // Currently still, make it animated
            var animatedUrl = imgElem.attr("data-animateUrl");
            imgElem.attr("data-animated", "animate");
            imgElem.attr("src", animatedUrl);
        }
    });

    //--------------------------------
    // $(numGifs).click()  -- sets the number of gif images to display with each search event
    //--------------------------------
    $("#numGifs").change("click", function() {
        // Use the form control's value to set the global variable for the number of images to display per search
        var item=$(this);
        numGifsPerSearch = $(this).val();
        clear();
        performGiphySearch(lastTopicSearch);
        performOMDBSearch(lastTopicSearch);
    });

        //--------------------------------
    // $(numGifs).click()  -- sets the number of gif images to display with each search event
    //--------------------------------
    $("#rating").change("click", function() {
        // Use the form control's value to set the global variable for the number of images to display per search
        var item=$(this);
        gifRating = $(this).val();
        clear();
        performGiphySearch(lastTopicSearch);
    });

});