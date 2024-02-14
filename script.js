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

