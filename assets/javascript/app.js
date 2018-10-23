//---------------------------
// $(document).ready() -  calls when the page loads,  holds our functions, handlers and global variables
//---------------------------
$(document).ready(function () {

    // GLOBAL VARIABLES 
    const numGifsPerSearch = 10;

    // List of buttons to preload when page starts
    var topics = [
        "inside out",
        "WALL-E",
        "toy story",
        "finding nemo",
        "the incredibles",
        "ratatouille",
        "up",
        "monsters, inc.",
        "pixar cars",
        "a bug's life",
        "pixar brave",
        "disney shrek",
        "aladdin",
        "the lion king",
    ];
    var gifItem = {
        lastTopicSearch: "", // topic of this query
        gifUrls: [],         // array of animated gif urls
        gifStillUrls: [],    // array of still gif urls 
    }

    /******************************************* */
    /* initalize the page with our seeded topics */
    /******************************************* */
    loadPage();

    //-----------------------------
    // loadPage() - runs as soon as the page is refreshed (loaded), it creates the default buttons of our topic    
    //-----------------------------
    function loadPage() {

        // Loop through each of the topics adding a button of that name
        for (var i = 0;
            (i < topics.length); i++) {
            var title = topics[i];
            addButton(title);
        }
        // search and display the first button's topic
        performGiphySearch(topics[0]);
    }

    // addButton() - adds a button to the title
    function addButton(title) {

        // Add a button to the main title screen
        var btn = $("<button>");
        btn.text(title);
        btn.addClass("gif-btn");
        btn.attr("data-topic", title);
        $("#gifButtons").append(btn);
    }

    //---------------------------
    // performGiphySearch(title) - uses the passed parameter to run a query against the Giphy back end API
    //-----------------------------
    function performGiphySearch(title) {

        // Build the query URL for the ajax request to the NYT API
        var queryURL = buildQueryURL(title);

        // Save this search to a global variable
        gifItem.lastTopicSearch = title;

        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The response data gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
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
        queryParams.limit = numGifsPerSearch;
        queryParams.offset = "0";
        queryParams.lang = "en";

        // Logging the URL so we have access to it for troubleshooting
        console.log(queryURL + $.param(queryParams));

        return queryURL + $.param(queryParams);
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
    //                  <img src=url'(stillUrl)' alt="gif title" class="gif-img" data-animated="false" data-topicIdx=0 data-gifIdx=0>
    //                  <br>
    //                  <span>Rated: G</span>
    //                  <br>
    //              </li>
    //          </ul>
    //      </div>
    //---------------------------
    function updatePage(responseData) {

        // Cap the number of gifs to display at numGifsPerSearch (10) images
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
            gifSpanTitle.html("<strong>" + gifData.title + "</strong>");
            gifListItemElem.append(gifSpanTitle);
            gifListItemElem.append($("<br>"));

            // Find the index of the current item and save it as metadata to the element
            var topicIdx = topics.indexOf(gifItem.lastTopicSearch);

            // Save some url data and link it to the DOM elements  for use by the image click event
            gifItem.gifUrls.push(gifData.images.fixed_height.url);
            gifItem.gifStillUrls.push(gifData.images.fixed_height_still.url);

            // Update the screen item, with indexes it to the saved metadata
            var gifImgElem = $("<img>");
            $(gifImgElem).addClass("gif-img");
            $(gifImgElem).attr("src", gifData.images.fixed_height_still.url);
            $(gifImgElem).attr("alt", gifData.title);
            $(gifImgElem).attr("data-animated", false);
            $(gifImgElem).attr("data-topicIdx", topicIdx);
            $(gifImgElem).attr("data-gifIdx", gifItem.gifStillUrls.length - 1);

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
        clear();
        performGiphySearch($(this).attr("data-topic"));
    });

    //-----------------------
    // $("#addGif").on("click") - event handler for "Add Button" event - adds a new button and associated images to the screen
    //-----------------------
    $("#addGif").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the topic
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();

        // Empty the region associated with the gifs
        clear();

        // Grab text the user typed into the search input and build a query string around it
        var title = $("#gif-input").val().trim();
        addButton(title);
        performGiphySearch(title);
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
        var gifImgIdx = imgElem.attr("data-gifIdx");
        if (gifImgIdx) {

            // flip the animated flag's state and display the appropriate url
            var animated = (imgElem.attr("data-animated") === "true");
            var animated = !animated;
            if (animated) {
                imgElem.attr("src", gifItem.gifUrls[gifImgIdx]);
            } else {
                imgElem.attr("src", gifItem.gifStillUrls[gifImgIdx]);
            }
            imgElem.attr("data-animated",animated);

        }
    });
});