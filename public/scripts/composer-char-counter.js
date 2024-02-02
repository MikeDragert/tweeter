
//document ready
$("document").ready(function() {  
  //tweet text input handler to update counter
  $("#tweet-text").on("input", function() {
    let newLength = $(this).val().length;
    if (newLength > 140) {
      $(this).parent().find(".counter").css({"color": "red"});
    } else {
      $(this).parent().find(".counter").css({"color": ""});
    }
    $(this).parent().find(".counter").val(140 - newLength);
  });
});