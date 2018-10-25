//---------------------------
// $(document).ready() -  calls when the page loads,  holds our functions, handlers and global variables
//---------------------------
$(document).ready(function () {

    // GLOBAL VARIABLES 
    var numGifsPerSearch = 10;
    var gifRating = "none";

    // List of buttons to preload when page starts, in order of release date
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
    var lastTopicSearch = topics[topics.length - 1]; // note tracking the last topic searched

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
        btn.addClass("btn btn-primary gif-btn m-1");
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
        queryParams.q = title + " pixar";
        queryParams.limit = numGifsPerSearch;
        queryParams.offset = "0";

        // Add a rating filter if applicable
        if (gifRating != "none") {
            queryParams.rating = gifRating;
        }

        queryParams.lang = "en";

        // Logging the URL so we have access to it for troubleshooting
        console.log("buildQueryURL()- " + queryURL + $.param(queryParams));

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
    //---------------------------
    function updatePage(responseData) {

        // Cap the number of gifs to display at the user set limit of numGifsPerSearch 
        const numGifs = responseData.data.length < numGifsPerSearch ? responseData.data.length : numGifsPerSearch;

        // Log the giphyData to console, where it will show up as an object
        console.log("-----------UpdatePage() response data -----------------------");
        console.log(responseData);
        console.log("-------------------------------------------------------------");

        // Create unordered list element and attach to main HTML element 
        var gifListElem = $("<ul>");
        gifListElem.addClass("list-group");
        $("#gifs").append(gifListElem);

        // Loop through and build buttons for the defined number of gifs
        for (var i = 0; i < numGifs; i++) {
            addGifImgElements(responseData.data[i], i+1, gifListElem);
        }
    }

    //---------------------------------------
    // addGifImgElements(gifData, position, parentElem) -- creates the HTML necessary to embed the gif img and favorite buttons to the page
    //          gifData -  the ajax response data from Giphy for one gif entry
    //          position - the screen position to add to the title
    //          parentElem - the UI element on which to chain this all under
    //
    // Appends/creates the following UI elements:
    //      <div id="gifs">
    //          <ul class="list-group">         <----- parent element passed from updatePage()
    //              <li class="list-item">     
    //                  <span class="label"><strong>Title</strong></span><br>
    //                  <div class="img-wrapper">
    //                      <div class="gif-img img-responsive">
    //                          <img src=url'(stillUrl)' alt="gif title" class="gif-img" data-animated="still" 
    //                              data-stillURL="url(still_gif_url)" data-animateUrl="url(animate_gif_url)">
    //                      </div>
    //                      <div class="img-overlay">
    //                          <button>heart-icon</button>
    //                      </div>
    //                  </div>
    //                  <p>Rated: G</p>
    //              </li>
    //          </ul>
    //      </div>
    //---------------------------------------
    function addGifImgElements(gifData, position, parentElem) {
        var gifListItemElem = $("<li class='list-item p-0 m-1'>");

        // Add Title
        var gifSpanTitle = $("<span>");
        gifSpanTitle.addClass("title-lbl");
        gifSpanTitle.html("<strong>" + position + ") " + gifData.title + "</strong>");
        parentElem.append(gifSpanTitle);
        parentElem.append($("<br>"));

        // Update the screen element with an img and  indexes it to the saved metadata
        var imgDiv = $("<div>");
        imgDiv.addClass("img-wrapper");

        // create our gif image with the needed metadata 
        var gifImgElem = $("<img>");
        $(gifImgElem).addClass("gif-img img-responsive");
        $(gifImgElem).attr("src", gifData.images.fixed_height_still.url);
        $(gifImgElem).attr("alt", gifData.title);
        $(gifImgElem).attr("data-animated", "still");
        $(gifImgElem).attr("data-animateUrl", gifData.images.fixed_height.url);
        $(gifImgElem).attr("data-stillUrl", gifData.images.fixed_height_still.url);

        // create our favoties button, with some metadata, to float over the gif (placed in a wrapper for positioning)
        var btnDiv = $("<div>");
        btnDiv.addClass("img-overlay");

        var favoriteBtn = $("<button>");
        favoriteBtn.addClass("btn btn-sm btn-outline-light text-danger fav-btn");
        favoriteBtn.html("<i class='fas fa-heart'></i>");
        favoriteBtn.attr("title", gifData.title);
        favoriteBtn.attr("data-animated", "still");
        favoriteBtn.attr("data-animateUrl", gifData.images.fixed_height.url);
        favoriteBtn.attr("data-stillUrl", gifData.images.fixed_height_still.url);
        btnDiv.append(favoriteBtn);

        // Chain it all to the DOM embedded in a wrapper div (to position the favorite button)
        imgDiv.append(gifImgElem);
        imgDiv.append(btnDiv);
        gifListItemElem.append(imgDiv);

        // Add Rating
        var pRating = $("<p>");
        pRating.addClass("rating-lbl");
        pRating.html("Rated: " + gifData.rating.toUpperCase());
        gifListItemElem.append(pRating);

        parentElem.append(gifListItemElem);
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
    // $(document).on("click", ".gif-btn") - generic function to fresh screen on query button clicks
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
    $("#numGifs").change("click", function () {
        // Use the form control's value to set the global variable for the number of images to display per search
        var item = $(this);
        numGifsPerSearch = $(this).val();
        clear();
        performGiphySearch(lastTopicSearch);
        performOMDBSearch(lastTopicSearch);
    });

    //--------------------------------
    // $(numGifs).click()  -- sets the number of gif images to display with each search event
    //--------------------------------
    $("#rating").change("click", function () {
        // Use the form control's value to set the global variable for the number of images to display per search
        var item = $(this);
        gifRating = $(this).val();
        clear();
        performGiphySearch(lastTopicSearch);
        performOMDBSearch(lastTopicSearch);
    });

    //-----------------------------------------
    // $(document).on("click", ".fav-btn") -- generic function to handle the processing of a favorite button being clicked
    //-----------------------------------------
    $(document).on("click", ".fav-btn", function () {
        console.log("on click fav-btn() - " + $(this).attr("title"));

        var btnElem = $(this);
        var imgElem = $("<img>");
        imgElem.addClass("gif-img img-responsive m-1");
        imgElem.attr("alt", btnElem.attr("data-title"));
        imgElem.attr("src", btnElem.attr("data-stillUrl"));
        imgElem.attr("data-animated", "still");
        imgElem.attr("data-animateUrl", btnElem.attr("data-animateUrl"));
        imgElem.attr("data-stillUrl", btnElem.attr("data-stillUrl"));
        $("#favorites").append(imgElem);

    });

});