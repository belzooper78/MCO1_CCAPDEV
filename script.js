$( ".upvote" ).click(function() {
    if(!$( this ).hasClass('active')){
    $( this ).toggleClass( "active" );
    $( this ).siblings( '.downvote' ).removeClass( "active" );}
    else{
        $( this ).removeClass( "active" );
    }
  });

  $( ".downvote" ).click(function() {
    if(!$( this ).hasClass('active')){
    $( this ).toggleClass( "active" );
    $( this ).siblings( '.upvote' ).removeClass( "active" );}
    else{
        $( this ).removeClass( "active" );
    }
  });

  $( ".badge" ).click(function() {
    if(!$( this ).hasClass('active')){
    $( this ).toggleClass( "active" );}
    else{
        $( this ).removeClass( "active" );
    }
  });
  var urlParams = new URLSearchParams(window.location.search);
  var key = urlParams.get('user');
  $(document).ready(function() {
    $('.user-profile-name').text(key);
});

document.addEventListener("DOMContentLoaded", function() {
  var underline = document.querySelector(".underline-activities");
  var listItems = document.querySelectorAll(".user-activitues li");

  updateUnderlinePosition();

  listItems.forEach(function(item) {
      item.addEventListener("click", function() {
        
          listItems.forEach(function(li) {
              li.classList.remove("active");
          });

          item.classList.add("active");

          updateUnderlinePosition();
      });
  });

  function updateUnderlinePosition() {
      var activeItem = document.querySelector(".user-activitues li.active");
      if (activeItem) {
          var leftOffset = activeItem.offsetLeft;
          var width = activeItem.offsetWidth;
          underline.style.width = width + "px";
          underline.style.transform = "translateX(" + leftOffset + "px)";
      }
  }
});