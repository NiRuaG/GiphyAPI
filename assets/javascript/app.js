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
  const DOM_ID = {
    searchResults: "searchResults",
    favorites: "favorites",
  }
  
  const $searchResults = $(`#${DOM_ID.searchResults}`);
  const $favorites = $(`#${DOM_ID.favorites}`);

  let $searchTermButtonsArea = $("#searchTermButtonsArea");
  let $clearAllResults = $("#clearAllResults");
  let $pauseAllResults = $("#pauseAllResults");
  let $playAllResults = $("#playAllResults");
  let $clearAllFavs = $("#clearAllFavs");
  let $pauseAllFavs = $("#pauseAllFavs");
  let $playAllFavs = $("#playAllFavs");
  let $imgResult = $("#imgResult");


  const DOM_CLASS = {
    searchButton: "searchButton",
    gifImg: "gifImg",
    rating: "rating",
    imgResult: "imgResult",
    favImg: "favImg",
  };

  // Dynamic Selections
  let DOM_SELECT = {
    gifImg_any      : `.${DOM_CLASS.gifImg}`,
    gifImg_results  : `#${DOM_ID.searchResults} .${DOM_CLASS.gifImg}`,
    gifImg_favorites: `#${DOM_ID.favorites} .${DOM_CLASS.gifImg}`,
    searchButtons: `.${DOM_CLASS.searchButton}`,
    favImg: `.${DOM_CLASS.favImg}`,
  };

  topics.forEach(topic => {
    $searchTermButtonsArea.append(
      $("<button>")
        .text(topic)
        .addClass(DOM_CLASS.searchButton)
    );
  });
  $searchResults.append(
    $("#imgResultTemp")
      .clone()
      .contents()
  );

  function pauseGif($jqResult) {
    $jqResult.each(function(index, element) {
      $(this).attr("src", $(this).attr("data-still-url"));
      $(this).attr("data-state", "still");
    });
  }

  function playGif($jQResult) {
    $jQResult.each(function(index, element) {
      $(this).attr("src", $(this).attr("data-animate-url"));
      $(this).attr("data-state", "animate");
    });
  }

  $clearAllResults.click(function() {
    $searchResults.empty();
  });
  $pauseAllResults.click(function() {
    pauseGif($(DOM_SELECT.gifImg_results));
  });
  $playAllResults.click(function() {
    playGif($(DOM_SELECT.gifImg_results));
  });
  $pauseAllFavs.click(function() {
    pauseGif($(`#favorites .${DOM_CLASS.gifImg}`));
  });
  $playAllFavs.click(function() {
    playGif($(`#favorites .${DOM_CLASS.gifImg}`));
  });

  $(document).on("click", DOM_SELECT.favImg, function(event) {
    let $this = $(this);
    $this.toggleClass("favorited");

    if ($this.hasClass("favorited")){
      $("#favorites").append($this.closest(".imgResult").clone());
    }
    else {
      console.log($this.closest(".imgResult"));
      $this.closest(".imgResult").remove();
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

  function searchForGifsOf(searchTerm) {
    let scheme = "https://";
    let host = "api.giphy.com";
    let path = "/v1/gifs/search";

    let queryParams = $.param({
      api_key: "dc6zaTOxFJmzC",
      q: searchTerm,
      limit: 3,
      fmt: "json"
    });
    let queryURL = scheme + host + path + "?" + queryParams;

    $.ajax({
      url: queryURL,
      method: "GET"
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
      response.data.forEach(datum => {
        let $clone = $("#imgResultTemp").clone().contents();

        $clone
          .find("img")
            .attr({
              "data-still-url"  : datum.images.fixed_width_still.url,
              "data-animate-url": datum.images.fixed_width.url,
              "src": datum.images.fixed_width_still.url,
              "data-state": "still"
            });

        $clone
          .find(`.${DOM_CLASS.rating}`).text(datum.rating);

        $searchResults
          .append($clone);
      });
      // $searchResults.append(
      //   $("<img>").attr("src", response.data[0].images.fixed_width_small.url),
      //   $("<img>").attr("src", response.data[1].images.fixed_width_small.url),
      //   $("<img>").attr("src", response.data[2].images.fixed_width_small.url)
      // );
      console.log(response);
    });
  }

  $(document).on("click", DOM_SELECT.searchButtons, function(event) {
    $searchResults.empty();
    searchForGifsOf($(this).text());
  });
});
