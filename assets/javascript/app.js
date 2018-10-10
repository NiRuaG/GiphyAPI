$(document).ready(function() {
  "use strict";

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

  // let favoritesSet = new Set();
  // read from storage

  // Static IDs
  const DOM_ID = {
    searchResults: "searchResults",
    favorites: "favorites"
  };

  const JQ_ID = {
    $searchResults: $(`#${DOM_ID.searchResults}`),
    $favorites: $(`#${DOM_ID.favorites}`),
    $searchTermButtonsArea: $("#searchTermButtonsArea"),
    $clearAllResults: $("#clearAllResults"),
    $pauseAllResults: $("#pauseAllResults"),
    $playAllResults: $("#playAllResults"),
    $pauseAllFavs: $("#pauseAllFavs"),
    $playAllFavs: $("#playAllFavs"),
    $moveAllFavs: $("#moveAllFavs"),
    $imgResultTemplate: $("#imgResultTemp"),
    $addSearch_input: $("#addSearch_input"),
    $addSearch_submit: $("#addSearch_submit")
  };

  //   let $clearAllFavs = $("#clearAllFavs");

  const DOM_CLASS = {
    searchButton: "searchButton",
    gifImg: "gifImg",
    rating: "rating",
    imgResult: "imgResult",
    favImg: "favImg",
    favorited: "favorited",
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

  function appendSearchButton(text) {
    JQ_ID.$searchTermButtonsArea.append(
      $("<button>")
        .text(text)
        .addClass(DOM_CLASS.searchButton)
    );
  }

  topics.forEach(topic => {
    appendSearchButton(topic);
  });

  JQ_ID.$addSearch_submit.click(function(event) {
    event.preventDefault();
    let input = JQ_ID.$addSearch_input.val().trim();
    if (!input) {
      return;
    }
    if (topics.includes(input)) {
      // handle duplicate search add.. highlight in current list?, perform gif search?
    } else {
      topics.push(input);
      appendSearchButton(input);
      JQ_ID.$addSearch_input.val("");
      JQ_ID.$searchResults.empty();
      searchForGifsOf(input);
    }
  });

  // FOR TESTING
  let $tempImg = JQ_ID.$imgResultTemplate.clone().contents();
  $tempImg.find("img").attr("src", "https://loremflickr.com/240/160");
  JQ_ID.$searchResults.append($tempImg);
  // ENDFORTESTING

  function pauseGif($jqResult) {
    $jqResult.each(function(index, element) {
      let $this = $(this);
      $this
        .one("error", function() {
          console.log("Pausing img problem", this);
        })
        .attr({
          src: $this.attr("data-still-url"),
          "data-state": "still"
        });
    });
  }

  function playGif($jQResult) {
    $jQResult.each(function(index, element) {
      let $this = $(this)
      $this
        .one("error", function() {
          console.log("Playing img problem", this);
        })
        .attr({
          src: $this.attr("data-animate-url"),
          "data-state": "animate"
        });
    });
  }

  JQ_ID.$clearAllResults.click(function() {
    JQ_ID.$searchResults.empty();
  });

  JQ_ID.$pauseAllResults.click(function() {
    pauseGif($(DOM_SELECT.gifImg_inResults));
  });

  JQ_ID.$playAllResults.click(function() {
    playGif($(DOM_SELECT.gifImg_inResults));
  });

  JQ_ID.$pauseAllFavs.click(function() {
    pauseGif($(DOM_SELECT.gifImg_inFavorites));
  });
  JQ_ID.$playAllFavs.click(function() {
    playGif($(DOM_SELECT.gifImg_inFavorites));
  });
  JQ_ID.$moveAllFavs.click(function() {
    // check if at least one favorite?
    JQ_ID.$searchResults.empty().
    append(
      $(DOM_SELECT.gifImg_inFavorites).closest(".imgResult").clone()
    );
  });

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
      JQ_ID.$favorites.prepend($this.closest(".imgResult").clone());
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

  function searchForGifsOf(searchTerm) {
    let scheme = "https://";
    let host = "api.giphy.com";
    let path = "/v1/gifs/search";

    let queryParams = $.param({
      api_key: "dc6zaTOxFJmzC",
      q: searchTerm,
      limit: 10,
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
      response.data.forEach( datum => {
        let $clone = JQ_ID.$imgResultTemplate.clone().contents();

        $clone
          .find("img")
          .one("error", function() {
            console.log("Loading img error", this);
          })
          .attr({
            src: datum.images.fixed_width_still.url,
            "data-still-url": datum.images.fixed_width_still.url,
            "data-animate-url": datum.images.fixed_width.url,
            "data-state": "still",
            alt: datum.title || `${searchTerm} gif img`
          });

        $clone.find(`.${DOM_CLASS.rating}`).text(datum.rating);

        JQ_ID.$searchResults.append($clone);
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
    JQ_ID.$searchResults.empty();
    searchForGifsOf($(this).text());
  });
});
