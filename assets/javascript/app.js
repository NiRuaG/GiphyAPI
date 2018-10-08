$(document).ready(function() {
  "use strict";

  console.log("READY!");

  var queryURL =
    "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=3";

  let $searchResults = $("#searchResults");

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
    $searchResults.append(
      $("<img>").attr("src", response.data[0].images.fixed_width.url),
      $("<img>").attr("src", response.data[1].images.fixed_width.url),
      $("<img>").attr("src", response.data[2].images.fixed_width.url)
    );
    // $searchResults.append(
    //   $("<img>").attr("src", response.data[0].images.fixed_width_small.url),
    //   $("<img>").attr("src", response.data[1].images.fixed_width_small.url),
    //   $("<img>").attr("src", response.data[2].images.fixed_width_small.url)
    // );
    console.log(response.data[0].images);
  });
});
