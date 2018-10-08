$(document).ready(function() {
  "use strict";

  console.log("READY!");

  var queryURL =
    "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=3";

    // DOM IDs
  let $searchResults = $("#searchResults");
  let $pauseAll = $("#pauseAll");
  let  $playAll = $("#playAll");
  

  $(document).on("click", ".gifImg", function() {
      console.log(`clicked gif`, this);

      var state = $(this).attr("data-state");
      // If the clicked image's state is still, update its src attribute to what its data-animate value is.
      // Then, set the image's data-state to animate
      // Else set src to the data-still value
      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate-url"));
        $(this).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still-url"));
        $(this).attr("data-state", "still");
      }
  });

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
         $("<img>")
            .addClass("gifImg")
            .attr("data-still-url"  , response.data[0].images.fixed_width_still.url)
            .attr("data-animate-url", response.data[0].images.fixed_width      .url)
            .attr("src"             , response.data[0].images.fixed_width_still.url)
            .attr("data-state", "still")
        ,$("<img>")
            .addClass("gifImg")
            .attr("data-still-url"  , response.data[1].images.fixed_width_still.url)
            .attr("data-animate-url", response.data[1].images.fixed_width      .url)
            .attr("src"             , response.data[1].images.fixed_width_still.url)
            .attr("data-state", "still")
        ,$("<img>")
            .addClass("gifImg")
            .attr("data-still-url"  , response.data[2].images.fixed_width_still.url)
            .attr("data-animate-url", response.data[2].images.fixed_width      .url)
            .attr("src"             , response.data[2].images.fixed_width_still.url)
            .attr("data-state", "still")
        );
    // $searchResults.append(
    //   $("<img>").attr("src", response.data[0].images.fixed_width_small.url),
    //   $("<img>").attr("src", response.data[1].images.fixed_width_small.url),
    //   $("<img>").attr("src", response.data[2].images.fixed_width_small.url)
    // );
    console.log(response.data[0].images);
  });
});
