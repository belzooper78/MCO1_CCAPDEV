const signupBtn = document.getElementById("signupFormBtn");
const signup_Form = document.forms.signupForm;


signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(signup_Form);
    
    if(form_data.get("username") != "" && form_data.get("password") != ""){
        const Obj ={ 
            username: form_data.get("username"),
            password: form_data.get("password")
        };
        const jString = JSON.stringify(Obj);

        try {
            const response = await fetch("/signup", {
                method: 'POST',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 201) {
                window.location.href = "/login";
            } else if (response.status === 401){
                location.reload();
                
            } else
            console.log("Status code received: " + response.status);
        } catch (err) {
            console.error(err);
        }
    }
    
});

