const postBtn = document.getElementById("confirm_post");
const post_form = document.forms.createPost_form;

postBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(post_form);
    sessionStorage.getItem('user');
    if(form_data.get("title") !== "" && form_data.get("content") !== ""){
    console.log('submit');
    const Obj = { 
        title: form_data.get("title"),
        content: form_data.get("content"),
    };
    console.log(Obj);
    const jString = JSON.stringify(Obj);
    console.log(jString);

    try {
        const response = await fetch("/userPosts", {
            method: 'POST',
            body: jString,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(response);
        if (response.status === 200) {
            location.reload();
        } else {
            console.log("Status code received: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }

  } else{
    console.log('submit failed: forms empty');
  }

});

const searchBtn = document.querySelector('.searchConfirmBtn');

////https://datatracker.ietf.org/doc/html/rfc3986#section-3
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
searchBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const input = document.querySelector('.searchBar').value;
    
    window.location.href = `/posts?search=${encodeURIComponent(input)}`;    
    
});


const postSorter = document.getElementById('postSorter');

postSorter?.addEventListener('change', async (e) => {
    e.preventDefault();
    const select = postSorter.value;
    window.location.href = `/posts?sort=${select}`;    
    
    
});



const deletePostBtn = document.getElementById("confirmDeletePost");

// applies for either posts or comments
deletePostBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("delete...")
    const postId = document.getElementById("post_value").value;

    //this checks if the render of postComment.hbs is for a post or comment/reply
    forReply = document.getElementById("isItReply").value;


      if(forReply == 'true'){
        try {
          const response = await fetch(`/comments/${postId}/delete`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          
          console.log(response);
          if (response.status === 200) {
              location.reload();
          } else {
              console.log("Status code received: " + response.status);
          }
      } catch (err) {
          console.error(err);
      }
      window.location.reload();

      }
      else {
        try {
            const response = await fetch(`/posts/${postId}/delete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Status code received: " + response.status);
            }
        } catch (err) {
            console.error(err);
        }
        window.location.reload();
     } 

  

});

//this works for editing either posts or comments
const editPostBtn = document.getElementById("confirmEditPost");
const editPost_form = document.forms.editPostForm;

editPostBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(editPost_form);
    const postId = document.getElementById("post_value").value;

    //this checks if the render of postComment.hbs is for a post or comment/reply
    forReply = document.getElementById("isItReply").value;

    if(form_data.get("editContent") !== ""){
      console.log('submit');
      const Obj = { 
          content: form_data.get("editContent"),
      };
      console.log(Obj);
      const jString = JSON.stringify(Obj);
      console.log(jString);

      if(forReply == 'true'){
        try {
          const response = await fetch(`/comments/${postId}/edit`, {
              method: 'PUT',
              body: jString,
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          
          console.log(response);
          if (response.status === 200) {
              location.reload();
          } else {
              console.log("Status code received: " + response.status);
          }
      } catch (err) {
          console.error(err);
      }
      window.location.reload();

      }
      else {
        try {
            const response = await fetch(`/posts/${postId}/edit`, {
                method: 'PUT',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 200) {
                location.reload();
            } else {
                console.log("Status code received: " + response.status);
            }
        } catch (err) {
            console.error(err);
        }
        window.location.reload();
     } 
    }else{
      console.log('submit failed: forms empty');
  }
  

});

//improved upon with Mistral.ai

const upvoteIcons = document.querySelectorAll('.fa-thumbs-up.post');
const downvoteIcons = document.querySelectorAll('.fa-thumbs-down.post');
const post = document.querySelector('.post-actions');
var postClassList = post.classList;

if(postClassList.contains('enable')){
upvoteIcons.forEach((icon) => {
  icon.addEventListener('click', async (event) => {
    const postId = event.target.closest('.fa-thumbs-up.post').dataset.id;
    const response = await fetch(`/posts/${postId}/upvote`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    window.location.reload();
  });
});

downvoteIcons.forEach((icon) => {
  icon.addEventListener('click', async (event) => {
    const postId = event.target.closest('.fa-thumbs-down.post').dataset.id;
    const response = await fetch(`/posts/${postId}/downvote`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    window.location.reload();
  });
});
}

