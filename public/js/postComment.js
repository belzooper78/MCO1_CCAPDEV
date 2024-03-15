const commentBtn = document.getElementById("confirm_commentPost");
const comment_form = document.forms.createCommentPostForm;

const cmnt_upvoteBtn = document.getElementById("upvoteBtnCmnt");
const cmnt_downvoteBtn = document.getElementById("downvoteBtnCmnt");

cmnt_upvoteBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log('upvoted');
    let Obj1 = Object.assign({});
    console.log(document.getElementById("cupvote_bool").value);
    if(document.getElementById("cupvote_bool").value === "false"){
        Object.assign(Obj1, {
        comment: document.getElementById("comment_value").value,
        upvote: document.getElementById("cupvote_value").value + 1,
        isUpvoted: true
       });
       console.log("1");

    }
    else if(document.getElementById("cupvote_bool").value === "true"){
        Object.assign(Obj1, { 
            comment: document.getElementById("comment_value").value,
            upvote: document.getElementById("cupvote_value").value - 1,
            isUpvoted: false
        });
        console.log("2");
    }
    if(document.getElementById("cdownvote_bool").value === "true"){
        Object.assign(Obj1, { 
            downvote: document.getElementById("cdownvote_value").value - 1,
            isDownvoted: false
        });
        console.log("3");
    }
    
    const jString = JSON.stringify(Obj1);
    console.log("logggg",jString);
    try {
        const response = await fetch("/update", {
            method: 'POST',
            body: jString,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            location.reload();
        } else {
            console.log("Status code received: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }
   
    
});

cmnt_downvoteBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log('downvoted');
    let Obj1 = Object.assign({});
    if(document.getElementById("cupvote_bool").value === "true"){
        Object.assign(Obj1, {  
            upvote: document.getElementById("cupvote_value").value - 1,
            isUpvoted: false
        });
    
    }
    if(document.getElementById("cdownvote_bool").value === "false"){
        Object.assign(Obj1, { 
            comment: document.getElementById("comment_value").value,
            downvote: document.getElementById("cdownvote_value").value + 1,
            isDownvoted: true
        });
        
    }
    else if(document.getElementById("cdownvote_bool").value === "true"){
        Object.assign(Obj1, {  
            comment: document.getElementById("comment_value").value,
            downvote: document.getElementById("cdownvote_value").value - 1,
            isDownvoted: false
        });
       
    }
    const jString = JSON.stringify(Obj1);
    console.log(jString);
    try {
        const response = await fetch("/update", {
            method: 'POST',
            body: jString,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            location.reload();
        } else {
            console.log("Status code received: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }
    
});


commentBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(comment_form);
    console.log(document.getElementById("post_value").value);
    if(form_data.get("content") !== ""){
    console.log('submit');
    const Obj = { 
        post: document.getElementById("post_value").value,
        content: form_data.get("content"),
        upvote: 0,
        downvote: 0,
        isEdited: false,
        isUpvoted: false,
        isDownvoted: false
    };
    console.log(Obj);
    const jString = JSON.stringify(Obj);
    console.log(jString);

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
