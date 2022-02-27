const searchUser = document.querySelector("#searchuser");
const profile = document.querySelector("#profile");
const leadParagraph = document.querySelector(".lead");

//api call
async function getUser(user) {
    try {
        const url = `https://api.github.com/users/${user}?client_id=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`;
        const repoUrl = `https://api.github.com/users/${user}/repos?per_page=5&sort="created: asc"&client_id=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`;

        const repoResponse = await fetch(repoUrl);
        const response = await fetch(url);

        const repoData = await repoResponse.json();
        const data = await response.json();
        console.log(repoData);
        return {
            data,
            repoData
        };
    }
    catch (error) {
        return leadParagraph.innerHTML = showError(error);
    }
}

//clear profile
function clearProfile() {
    profile.innerHTML = "";
}

//function to show error
function showError(message) {
    if (!message) {
        message = "Unknown error occured";
    }
    return `<p class="btn btn-outline-warning">${message}</p>`;
};

//clear error 
function clearError() {
    leadParagraph.innerHTML = "Enter a username to fetch a user profile and repos";

}

// showProfile function

function showProfile(user) {
    profile.innerHTML = `
    <div class = "card card-body mb-3">
        <div class = "col-md-3">
            <img class = "img-fluid" mb-2" src = "${user.avatar_url}">
            <a href = "${user.html_url}" target ="_blank" class="btn btn-primary btn-block mb-2">View profile</a>
        </div>
        <div class = "col-md-9">
            <span class = "btn btn-dark">Public Repos: ${user.public_repos}</span>
            <span class = "btn btn-info">Public Repos: ${user.public_gists}</span>
            <span class = "btn btn-success">Followers: ${user.followers}</span>
            <span class = "btn btn-primary">Following: ${user.following}</span>
            <br><br>
            <ul class= "list-group>
                <li class= "list-group-item">Company: ${user.organizations_url}</li>
                <li class= "list-group-item">Location: ${user.location}</li>
                <li class= "list-group-item">Member since: ${user.created_at}</li>
                <li class= "list-group-item">Last updated: ${user.updated_at}</li>
            </ul>
        </div>
    </div>
    <h3 class = "page-heading mb-3 repos"> Latest Repos: ${user.repos_url}</h3>`;
}


//function to show repos
function showRepos(repos) {
    let output = "";

    repos.forEach((repo) => {
        output += `
        <div class= "card card-body mb-2>
        <div class= "row">
            <div class= "col-md-6 mb-4">
                <a href="${repo.html_url}" target="_blank"> ${repo.name}</a>
            </div>
            <div class= "col-md-6">
                <span class = "btn btn-dark ">Stargazers count: ${repo.stargazers_count}</span>
                <span class = "btn btn-primary">Watchers: ${repo.watchers_count}</span>
                <span class = "btn btn-warning">Forks: ${repo.forks_count}</span>
            </div>
        </div>
    </div>`;
    });
    const reposContainer = document.querySelector(".repos");
    reposContainer.innerHTML = output;

};

// event listner on keydown
searchUser.addEventListener("keyup", (e) => {

    const userText = e.target.value;
    if (userText) {
        getUser(userText)
            .then(response => {
                if (response.data.message === "Not Found") {
                    leadParagraph.innerHTML = showError("User not found");
                    setTimeout(clearError, 3000);
                }
                else {
                    showProfile(response.data);
                    showRepos(response.repoData);
                }
            });
    } else {
        clearProfile();
    };
});

