/*13/02/2024, https://stackoverflow.com/questions/30872351/toggle-and-untoggle-three-buttons, Ted*/

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