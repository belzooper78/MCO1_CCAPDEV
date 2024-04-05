const editBtn = document.getElementById('edit-profile');
const editProfileForm =  document.getElementById('edit-profile-Form');
const editPfp = document.getElementById("edit-profile-image-form");

editBtn.addEventListener("click", async (e) => {
    event.preventDefault();
    $('#editProfileModal').modal('show');


});

function goBack() {
    window.history.back();
}


editPfp.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editPfp);

    try {
        const response = await fetch("/update-profile", {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log("Profile image updated successfully");
        } else {
            console.error("Failed to update profile image:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});