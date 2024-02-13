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
