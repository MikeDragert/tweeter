/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

const hideError = function() {
  $(".new-tweet-error").slideUp();
};

const createTweetElement = function(tweetData) {
  const { user, content, created_at } = tweetData;

  let $article = $("<article>");
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

  let $section = $("<span>").text(content.text);
  $article.append($section);

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


const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    $('#tweets-container').append(newTweet);
  }
};

const loadTweets = function(callback) {
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

$(document).ready(function() {
  
  loadTweets(renderTweets);
  
  $('#new-tweet-form').on("submit", function(event) {
    event.preventDefault();
    hideError();
    let newTweetText = $("#tweet-text").val();

    if (!newTweetText) {
      displayError('Nothing to submit. Try typing something 😜');
      return false;
    }

    let tweetLength = newTweetText.length;

    if ((tweetLength < 1) || (tweetLength > 140)) {
      displayError('Too long!  Plz respect arbitrary limit of 140 chars.');
      return false;
    }

    $.ajax({
      url: "http://localhost:8080/tweets",
      context: document.body,
      data: $("#tweet-text").serialize(),
      method: "POST",
      success: function(data, textStatus, jqXHR) {

        //NOTE: ideally we would have the logged in user, picture, name etc, and passed those to the server
        // but we don't!! so let's reget the server tweets so that we can show what the server created
        // only prepend the new one that we don't have yet
        // starting at the end and looking back for the first matching text seems to be the best way
        loadTweets((tweets) => {
          const currentTweetCount = $("#tweets-container>article").length;
          const newTweetCount = tweets.length;
          for (index = newTweetCount - 1; index >= currentTweetCount; index--) {
            let tweetToAdd = tweets[index];
            if (tweetToAdd.content.text === newTweetText) {
              const newTweet = createTweetElement(tweetToAdd);
              $('#tweets-container').prepend(newTweet);
              break;
            }
          }
        });

        $("#tweet-text").val("");
        $("#tweet-text").parent().find(".counter").val(140);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        displayError('Problem saving tweet');
      }
    });
  });
});