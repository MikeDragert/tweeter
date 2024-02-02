/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//function to display error with given error text
const displayError = function(errorMessage) {
  $(".new-tweet-error>span").text(errorMessage);
  $(".new-tweet-error").slideDown({
    start: function() {
      $(this).css({
        display: "flex"
      });
    }
  });
};

//function to hide error text
const hideError = function() {
  $(".new-tweet-error").slideUp();
};

//function to show the new tweet box
const showNewTweet = function() {
  $(".new-tweet-form").slideDown({
    start: function() {
      $(this).css({
        display: "flex"
      });
    }
  });
  $(".nav-bar-right > i").removeClass("fa-angles-down");
  $(".nav-bar-right > i").addClass("fa-angles-up");
  $("#tweet-text").focus();
};

//function to hide the new tweet box
const hideNewTweet = function() {
  $(".new-tweet-form").slideUp();
  $(".nav-bar-right > i").removeClass("fa-angles-up");
  $(".nav-bar-right > i").addClass("fa-angles-down");
};

//function to to tobble the new tweet box
const toggleNewTweet = function() {
  if ($(".new-tweet-form").is(":visible")) {
    hideNewTweet();
  } else {
    showNewTweet();
  }
};

//function to create one new tweet artible based on the given data
const createTweetElement = function(tweetData) {
  const { user, content, created_at } = tweetData;
  let $article = $("<article>");
  //header section first
  let $header = $("<header>");
  let $headerDiv = $("<div>");
  let $image = $("<img>").attr('src', user.avatars);
  let $name = $("<div>").text(user.name);
  let $handleAside = $("<aside>").text(user.handle);
  $article.append(
    $header.append(
      $headerDiv.append(
        $image
      ).append(
        $name
      )
    ).append(
      $handleAside
    )
  );
  // middle section with tweet text
  let $section = $("<span>").text(content.text);
  $article.append($section);
  // footer section
  let $footer = $("<footer>");
  let $footerTimeDiv = $("<div>").text(timeago.format(created_at));
  let $footerButtonDiv = $("<div>");
  let $footerFlag = $("<i>").addClass("fa-solid fa-flag");
  let $footerReTweet = $("<i>").addClass("fa-solid fa-retweet");
  let $footerHeart = $("<i>").addClass("fa-solid fa-heart");
  $article.append(
    $footer.append(
      $footerTimeDiv
    ).append(
      $footerButtonDiv.append(
        $footerFlag
      ).append(
        $footerReTweet
      ).append(
        $footerHeart
      )
    )
  );
  return $article;
};

//function to render all tweets given
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    $('#tweets-container').prepend(newTweet);
  }
};

//function to load the tweets from the server
const loadTweetsFromServer = function(callback) {
  $.ajax({
    url: "http://localhost:8080/tweets",
    context: document.body,
    method: "GET",
    success: function(data, textStatus, jqXHR) {
      callback(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      displayError('Problem loading tweets');
    }
  });
};

//function to determine if the new tweet is valide
const isNewTweetValid = function(newTweetText) {
  if (!newTweetText) {
    displayError('Nothing to submit. Try typing something 😜');
    return false;
  }
  let tweetLength = newTweetText.length;
  if ((tweetLength < 1) || (tweetLength > 140)) {
    displayError('Too long!  Plz respect arbitrary limit of 140 chars.');
    return false;
  }
  return true;
};

//function to add the new tweet text from the server tweet data to the display
//NOTE: Ideally we would have the logged in user, picture, name etc, and passed those to the server with the tweet
//      But we don't!! So let's re-request the server tweets so that we can show what the server created for us
//      We will only prepend the new one that we don't have yet - identified by the first one not used that matches the tweet text
//      starting at the end of the tweets and looking back for the first matching text - this seems to be the best way...
const addNewTweetToDisplay = function(tweetData, newTweetText) {
  const currentTweetCount = $("#tweets-container>article").length;
  const newTweetCount = tweetData.length;
  for (let index = newTweetCount - 1; index >= currentTweetCount; index--) {
    let tweetToAdd = tweetData[index];
    if (tweetToAdd.content.text === newTweetText) {
      const newTweet = createTweetElement(tweetToAdd);
      $('#tweets-container').prepend(newTweet);
      break;
    }
  }
};

//function to reset the new tweet box
const resetNewTweetBox = function() {
  $("#tweet-text").val("");
  $("#tweet-text").parent().find(".counter").val(140);
};

//document ready, initialize tweet data and set up handlers
$("document").ready(function() {
  loadTweetsFromServer(renderTweets);

  //down arrow button handler to show/hide new tweet on click
  $(".nav-bar-right > i").on("click", function() {
    toggleNewTweet();
  });
  
  // form submit handler to save new tweet to server and update display
  $('.new-tweet-form').on("submit", function(event) {
    event.preventDefault();
    hideError();
    let newTweetText = $("#tweet-text").val();
    if (isNewTweetValid(newTweetText)) {
      $.ajax({
        url: "http://localhost:8080/tweets",
        context: document.body,
        data: $("#tweet-text").serialize(),
        method: "POST",
        success: function(data, textStatus, jqXHR) {
          loadTweetsFromServer((tweets) => {
            addNewTweetToDisplay(tweets, newTweetText);
          });
          resetNewTweetBox();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          displayError('Problem saving tweet');
        }
      });
    }
  });
});