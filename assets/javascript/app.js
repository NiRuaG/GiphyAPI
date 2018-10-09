$(document).ready(function() {
  "use strict";

  console.log("READY!");

  let topics = [
    "earthbound",
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
    "dark souls",
    "fortnite",
    "galaga",
    "space invader",
    "god of war"
  ];

  // Static IDs
  let $searchTermButtonsArea = $("#searchTermButtonsArea");
  let $searchResults = $("#searchResults");
  let $pauseAll = $("#pauseAll");
  let $playAll = $("#playAll");

  const DOM_CLASS_SearchButton = "searchButton";

  topics.forEach(topic => {
    $searchTermButtonsArea.append(
      $("<button>")
        .text(topic)
        .addClass(DOM_CLASS_SearchButton)
    );
  });

  // Dynamic Selections
  let DOM_Selectors = {
    gifImgs: ".gifImg",
    searchButtons: `.${DOM_CLASS_SearchButton}`
  };

  let pauseGif = $jqResult => {
    $jqResult.each(function(index, element) {
      $(this).attr("src", $(this).attr("data-still-url"));
      $(this).attr("data-state", "still");
    });
  };

  let playGif = $jQResult => {
    $jQResult.each(function(index, element) {
      $(this).attr("src", $(this).attr("data-animate-url"));
      $(this).attr("data-state", "animate");
    });
  };

  $pauseAll.click(function() {
    pauseGif($(DOM_Selectors.gifImgs));
  });
  $playAll.click(function() {
    playGif($(DOM_Selectors.gifImgs));
  });

  $(document).on("click", DOM_Selectors.gifImgs, function(event) {
    // Check current state, by data attri, and toggle
    if ($(this).attr("data-state") === "still") {
      playGif($(this));
    } else {
      pauseGif($(this));
    }
  });

  function searchForGifsOf(searchTerm) {

    let protocol = "https://"
    let host = "api.giphy.com";
    let path = {
        url_path: "/v1/gifs/search",
        method: "GET"
    };

    let queryParams = $.param({
        api_key: "dc6zaTOxFJmzC",
        q: searchTerm,
        limit: 10,
        fmt: "json"
    });
    let queryURL = protocol+host+path.url_path+'?'+queryParams;

    console.log(queryURL);

    $.ajax({
         url: queryURL,
      method: path.method,
    }).then(function(response) {
      // $searchResults.append(
      //   $("<img>").attr("src", response.data[0].images["480w_still"].url),
      //   $("<img>").attr("src", response.data[1].images["480w_still"].url),
      //   $("<img>").attr("src", response.data[2].images["480w_still"].url)
      // );
      // $searchResults.append(
      //   $("<img>").attr("src", response.data[0].images.original.url),
      //   $("<img>").attr("src", response.data[1].images.original.url),
      //   $("<img>").attr("src", response.data[2].images.original.url)
      // );
      response.data.forEach( (datum) => {
        $searchResults.append(
            $("<img>")
              .addClass("gifImg")
              .attr("data-still-url", datum.images.fixed_width_still.url)
              .attr("data-animate-url", datum.images.fixed_width.url)
              .attr("src", datum.images.fixed_width_still.url)
              .attr("data-state", "still"));
      });      
      // $searchResults.append(
      //   $("<img>").attr("src", response.data[0].images.fixed_width_small.url),
      //   $("<img>").attr("src", response.data[1].images.fixed_width_small.url),
      //   $("<img>").attr("src", response.data[2].images.fixed_width_small.url)
      // );
      console.log(response.data[0].images);
    });
  }

  $(document).on("click", `.${DOM_CLASS_SearchButton}`, function(event) {
    //   console.log("Searching for ", $(this).text());
    $searchResults.empty();
    searchForGifsOf($(this).text());
  });
});
