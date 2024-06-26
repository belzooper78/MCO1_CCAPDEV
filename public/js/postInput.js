const postBtn = document.getElementById("confirm_post");
const post_form = document.forms.createPost_form;

const post_upvoteBtn = document.getElementById("upvoteBtnPost");
const post_downvoteBtn = document.getElementById("downvoteBtnPost");

post_upvoteBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log('upvoted');
    let Obj1 = Object.assign({});
    console.log(document.getElementById("upvote_bool").value);
    if(document.getElementById("upvote_bool").value === "false"){
        Object.assign(Obj1, {
        post: document.getElementById("post_value").value,
        upvote: document.getElementById("upvote_value").value + 1,
        isUpvoted: true
       });
       console.log("1");

    }
    else if(document.getElementById("upvote_bool").value === "true"){
        Object.assign(Obj1, { 
            post: document.getElementById("post_value").value,
            upvote: document.getElementById("upvote_value").value - 1,
            isUpvoted: false
        });
        console.log("2");
    }
    if(document.getElementById("downvote_bool").value === "true"){
        Object.assign(Obj1, { 
            downvote: document.getElementById("downvote_value").value - 1,
            isDownvoted: false
        });
        console.log("3");
    }
    
    const jString = JSON.stringify(Obj1);
    console.log(jString)
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

post_downvoteBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log('downvoted');
    let Obj1 = Object.assign({});
    if(document.getElementById("upvote_bool").value === "true"){
        Object.assign(Obj1, {  
            upvote: document.getElementById("upvote_value").value - 1,
            isUpvoted: false
        });
    
    }
    if(document.getElementById("downvote_bool").value === "false"){
        Object.assign(Obj1, { 
            post: document.getElementById("post_value").value,
            downvote: document.getElementById("downvote_value").value + 1,
            isDownvoted: true
        });
        
    }
    else if(document.getElementById("downvote_bool").value === "true"){
        Object.assign(Obj1, {  
            post: document.getElementById("post_value").value,
            downvote: document.getElementById("downvote_value").value - 1,
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

postBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(post_form);

    if(form_data.get("title") !== "" && form_data.get("content") !== ""){
    console.log('submit');
    const Obj = { 
        title: form_data.get("title"),
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
