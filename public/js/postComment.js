const commentBtn = document.getElementById("confirm_commentPost");
const comment_form = document.forms.createCommentPostForm;

commentBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(comment_form);
    console.log(document.getElementById("post_value").value);
    forReply = document.getElementById("isItReply").value;
    if(form_data.get("content") !== ""){
    console.log('submit');
    const Obj = { 
        post: document.getElementById("post_value").value,
        content: form_data.get("content"),
    };
    console.log(Obj);
    const jString = JSON.stringify(Obj);
    console.log(jString);

    if(forReply == 'true'){
        try {
            const response = await fetch("/replies", {
                method: 'POST',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 200) {
                location.href("/");
            } else {
                console.log("Status code received: " + response.status);
            }
            
        } catch (err) {
            console.error(err);
        }
    } 
    else {
        try {
            const response = await fetch("/comments", {
                method: 'POST',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 200) {
                location.href("/");
            } else {
                console.log("Status code received: " + response.status);
            }
            
        } catch (err) {
            console.error(err);
        }
    }
    window.location.reload();
} else{
    console.log('submit failed: forms empty');
}

});


const commentUpvoteIcons = document.querySelectorAll('.fa-thumbs-up.comment');
const commentDownvoteIcons = document.querySelectorAll('.fa-thumbs-down.comment');
const comment = document.querySelector('.comment-likes');
var commentClassList = comment.classList;

if(commentClassList.contains('enable')){
    commentUpvoteIcons.forEach((icon) => {
        icon.addEventListener('click', async (event) => {
            const commentId = event.target.closest('.fa-thumbs-up.comment').dataset.id;
            const response = await fetch(`/comments/${commentId}/upvote`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            });
            window.location.reload();
        });
    });

    commentDownvoteIcons.forEach((icon) => {
        icon.addEventListener('click', async (event) => {
            const commentId = event.target.closest('.fa-thumbs-down.comment').dataset.id;
            const response = await fetch(`/comments/${commentId}/downvote`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            });
            window.location.reload();
        });
    });
}