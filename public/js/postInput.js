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