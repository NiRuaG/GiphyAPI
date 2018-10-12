$(document).ready(function() {
  "use strict";

  let topics = [
    "final fantasy",
    "mario",
    "mortal kombat",
    "pacman",
    "skyrim",
    "sonic",
    "starcraft",
    "starfox",
    "street fighter",
    "smash bros",
    "tetris",
    "zelda",
    "warcraft",
    "overwatch",
    "fortnite",
    "galaga",
    "space invader",
    "god of war"
  ];

  // TODO: save/read from storage
  // let favoritesSet = new Set(); only allow unique favorites?

  // Static IDs
  const DOM_ID = {
    searchResults : "searchResults",
        favorites : "favorites"
  };

  const JQ_SELECT = {
    $searchResults        : $(`#${DOM_ID.searchResults}`),
    $favorites            : $(`#${DOM_ID.favorites}`    ),
    $searchTermButtonsArea: $("#searchTermButtonsArea"  ),
    $clearAllResults      : $("#clearAllResults"        ),
    $pauseAllResults      : $("#pauseAllResults"        ),
    $playAllResults       : $("#playAllResults"         ),
    $moveAllFavs          : $("#moveAllFavs"            ),
    $pauseAllFavs         : $("#pauseAllFavs"           ),
    $playAllFavs          : $("#playAllFavs"            ),
    $clearAllFavs         : $("#clearAllFavs"           ),
    $imgResultTemplate    : $("#imgResultTemp"          ),
    $addSearch_input      : $("#addSearch_input"        ),
    $addSearch_submit     : $(".addSearch_submit"       ),
  };
  
  const DOM_CLASS = {
    searchButton : "searchButton",
          gifImg : "gifImg"      ,
          rating : "rating"      ,
       imgResult : "imgResult"   ,
          favImg : "favImg"      ,
       favorited : "favorited"   ,
  };

  // Dynamic Selections
  let DOM_SELECT = {
    gifImg_any        : `.${DOM_CLASS.gifImg}`,
    gifImg_inResults  : `#${DOM_ID.searchResults} .${DOM_CLASS.gifImg}`,
    gifImg_inFavorites: `#${DOM_ID.favorites    } .${DOM_CLASS.gifImg}`,

    // favImg_any        : `.${DOM_CLASS.favImg}`,
    favImg_inResults  : `#${DOM_ID.searchResults} .${DOM_CLASS.favImg}`,
    favImg_inFavorites: `#${DOM_ID.favorites    } .${DOM_CLASS.favImg}`,

    searchButtons     : `.${DOM_CLASS.searchButton}`
  };

  // #region Utility Functions
  function pauseGif($jqResult) {
    $jqResult.each(function (index, element) {
      let $this = $(this);
      $this
        .one("error", function () {
          console.log("Pausing img problem", this);
        })
        .attr({
          src: $this.attr("data-still-url"),
          "data-state": "still"
        });
    });
  }

  function playGif($jQResult) {
    $jQResult.each(function (index, element) {
      let $this = $(this)
      $this
        .one("error", function () {
          console.log("Playing img problem", this);
        })
        .attr({
          src: $this.attr("data-animate-url"),
          "data-state": "animate"
        });
    });
  }

  function appendSearchButton(text) {
    JQ_SELECT.$searchTermButtonsArea.append(
      $("<div>")
        .addClass("searchButtonWrap")
        .append(
          $("<button>")
            .text(text)
            .addClass(DOM_CLASS.searchButton))
    );
  }
  // #endregion Utility Functions

  // Populate inital set of gif Topic buttons
  topics.forEach(topic => {
    appendSearchButton(topic);
  });

  // FOR TESTING
  // let $tempImg = JQ_SELECT.$imgResultTemplate.clone().contents();
  // $tempImg.find("img").attr("src", "https://loremflickr.com/240/160");
  // JQ_SELECT.$searchResults.append($tempImg);
  // ENDFORTESTING



  // User Adds a New Search Term & will auto call giphy on the new term
  JQ_SELECT.$addSearch_submit.click(function(event) {
    event.preventDefault(); // stop page from default reloading on form submit
    let input = JQ_SELECT.$addSearch_input.val().trim();
    if (!input) { // don't do anything with empty input
      return;
    }
    if (topics.includes(input)) {
      // handle duplicate search add.. highlight in current list?, perform gif search?
    } else {
      topics.push(input); // At this point, without persisting user info, adding to array doesn't do much
      appendSearchButton(input); // add to header list
      JQ_SELECT.$addSearch_input.val(""); // clear add search input area
      JQ_SELECT.$searchResults.empty(); // clear previous results
      searchForGifsOf(input);
    }
  });

  // #region Static Button Clicks
  JQ_SELECT.$clearAllResults.click(function() {
    JQ_SELECT.$searchResults.empty();
  });

  JQ_SELECT.$pauseAllResults.click(function() {
    pauseGif($(DOM_SELECT.gifImg_inResults));
  });

  JQ_SELECT.$playAllResults.click(function() {
    playGif($(DOM_SELECT.gifImg_inResults));
  });

  JQ_SELECT.$pauseAllFavs.click(function() {
    pauseGif($(DOM_SELECT.gifImg_inFavorites));
  });

  JQ_SELECT.$playAllFavs.click(function() {
    playGif($(DOM_SELECT.gifImg_inFavorites));
  });

  JQ_SELECT.$moveAllFavs.click(function() {
    // check if at least one favorite?
    JQ_SELECT.$searchResults
      .empty()
      .append(
        $(DOM_SELECT.gifImg_inFavorites).closest(".imgResult").clone());
  });

  JQ_SELECT.$clearAllFavs.click(function() {
    JQ_SELECT.$favorites.empty();
  });
  // #endregion Static Button Clicks

  // #region Dynamic Select Clicks
  $(document).on("click", DOM_SELECT.favImg_inFavorites, function(event) {
    $(this)
      .toggleClass(DOM_CLASS.favorited, false)
      .closest(".imgResult")
        .remove();
  });

  $(document).on("click", DOM_SELECT.favImg_inResults, function(event) {
    let $this = $(this);
    $this.toggleClass(DOM_CLASS.favorited);

    if ($this.hasClass(DOM_CLASS.favorited)) {
      JQ_SELECT.$favorites.prepend($this.closest(".imgResult").clone());
    } else {
      // find it in favorites?
      // console.log($this.closest(".imgResult"));
      // $this.closest(".imgResult").remove();
    }
  });

  $(document).on("click", DOM_SELECT.gifImg_any, function(event) {
    // Check current state, by data attr, and toggle
    let $gif = $(this);
    if ($gif.attr("data-state") === "still") {
      playGif($gif);
    } else {
      pauseGif($gif);
    }
  });

  $(document).on("click", DOM_SELECT.searchButtons, function(event) {
    JQ_SELECT.$searchResults.empty();
    searchForGifsOf($(this).text());
  });
  // #endregion Dynamic Select Clicks

  // Call the Giphy API given a search term, populates the results area with images
  function searchForGifsOf(searchTerm) {
    let scheme = "https://";
    let host = "api.giphy.com";
    let path = "/v1/gifs/search";

    let queryParams = $.param({
      api_key : "dc6zaTOxFJmzC",
            q : searchTerm,
        limit : 10,
          fmt : "json"
    });
    let queryURL = scheme + host + path + "?" + queryParams;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      response.data.forEach( datum => {
        // Make a clone of our template for an image result
        let $clone = JQ_SELECT.$imgResultTemplate.clone().contents();

        // Give the clone's image element attributes with data from the Giphy response
        $clone
          .find("img")
          .one("error", function() {
            console.log("Loading img error", this);
          })
          .attr({
                           src: datum.images.fixed_width_still.url,
                           alt: datum.title || `${searchTerm} gif img`,
              "data-still-url": datum.images.fixed_width_still.url,
            "data-animate-url": datum.images.fixed_width.url,
                  "data-state": "still",
          });

        // Add the Rating property to the clone
        $clone.find(`.${DOM_CLASS.rating}`).text(datum.rating);

        // Append the clone to the results area
        JQ_SELECT.$searchResults.append($clone);
      });
    });
  }
});
