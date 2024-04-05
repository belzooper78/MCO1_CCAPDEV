/*13/02/2024, https://stackoverflow.com/questions/30872351/toggle-and-untoggle-three-buttons, Ted*/
 
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


  $(".editBtn").click(function() {
    $("#forum-content").modal('toggle');
    $("#edit-forum").modal('show');
  })

  $(".cancelChanges").click(function() {
    $("#edit-forum").modal('toggle');
    $("#forum-content").modal('show');
  })

  $(".delBtn").click(function() {
    $("#forum-content").modal('toggle');
    $("#delWarning").modal('show');
  })

  $(".cancelDelete").click(function() {
    $("#delWarning").modal('toggle');
    $("#forum-content").modal('show');
  })
  /*from ccinfom old project, saving user in url*/ 
  var urlParams = new URLSearchParams(window.location.search); /* URLSearchParams asked from chatgpt*/
  var key = urlParams.get('user');
  $(document).ready(function() {
    $('.user-profile-name').text(key);
});
/*chat gpt for css animation for profile*/
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
          

          const tab= this.getAttribute("data-tab");
         
          loadUserPosts(tab);
          updateUnderlinePosition();
      });
  });
  const username =  document.getElementById("usernameData").getAttribute("data-username");
  function loadUserPosts(tab) {
    fetch(`/profiles/${username}/${tab}`)
      .then(response => {
        if(!response.ok){
          throw new Error(`error :${response.status}`);
        }
      })
  }
  const activeTab = tabList.querySelector(".active");
  const tabab = activeTab.getAttribute("data-tab");
  loadUserPosts(tabab);

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

document.getElementsByClassName('edit-profile').addEventListener('click', function () {
  
  $('#editprofileModal').modal('show');
});