const loginBtn = document.getElementById("loginConfirmBtn");
const login_Form = document.forms.loginForm;


loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const form_data = new FormData(login_Form);
    
    if(form_data.get("username") != "" && form_data.get("password") != ""){
        const Obj ={ 
            username: form_data.get("username"),
            password: form_data.get("password")
        };
        const jString = JSON.stringify(Obj);

        try {
            const response = await fetch("/login", {
                method: 'POST',
                body: jString,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response);
            if (response.status === 200) {
                window.location.href = "/";
            } else {
                console.log("Status code received: " + response.status);
            }
        } catch (err) {
            console.error(err);
        }
    }
    
});

