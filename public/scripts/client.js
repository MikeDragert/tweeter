/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const displayError = function(errorMessage) {
  $(".new-tweet-error>span").text(errorMessage);
  $(".new-tweet-error").slideDown({
    start: function () {
      $(this).css({
        display: "flex"
      })
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

  let $section = $("<section>").text(content.text);
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

const loadTweets = function() {
  $.ajax({
    url: "http://localhost:8080/tweets",
    context: document.body,
    method: "GET",
    success: function(data, textStatus, jqXHR) {
      renderTweets(data);
    },
    error: function(jqXHR, trextStatus, errorThrown) {
      displayError('Problem loading tweets');
    }
  });
};

$(document).ready(function() {
  
  loadTweets();
  
  $('#new-tweet-form').on("submit", function(event) {
    event.preventDefault();
    hideError();

    if (!$("#tweet-text").val()) {
      displayError('Nothing to submit. Try typing something 😜');
      return false;
    }

    tweetLength = $("#tweet-text").val().length;

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

        //todo: this is working, but without a login and actual user info, it is not ideal
        //todo: would it be better to get the saved tweet back from the server? But the server doesn't return it unless we get the whole list
        const newTweet = createTweetElement({
          user: {
            avatars: $(".page-header img").attr("src"),
            name:  $("#header-name").text(),
            handle: "@handle"
          },
          content: {text: $("#tweet-text").val()},
          created_at: (new Date())
        });
        $('#tweets-container').prepend(newTweet);

        $("#tweet-text").val("");
        $("#tweet-text").parent().find(".counter").val(140);
      },
      error: function(jqXHR, trextStatus, errorThrown) {
        displayError('Problem saving tweet');
      }
    });
  });
});

