
$(document).ready(function() {
  
  $("#tweet-text").on("input", function() {
    let newLength = $(this).val().length;
    if (newLength > 140) {
      $(this).parent().find(".counter").css({"color": "red"});
      // this was to lock it at 140, which works but was not the requirement
      // $(this).val($(this).val().substring(0,140))
      // newLength = 140;
    } else {
      $(this).parent().find(".counter").css({"color": ""});
    }
    $(this).parent().find(".counter").val(140 - newLength);
  });
});