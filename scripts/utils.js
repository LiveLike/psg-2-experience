const getQueryParam = (name) => {
    if (window && window.location && window.location.search) {

        const urlSerachParams = new URLSearchParams(window.location.search);
        return urlSerachParams.get(name);
    }
}

const getProgramId = () => {
    return getQueryParam("program_id");
};

const getLeaderboardIdAsync = async ({ programId }) => {
    console.log(programId)
    const response = await fetch(`${baseUrl}/programs/${programId}/`);
    if (response.ok) {
        const program = await response.json();
        if (program && program.leaderboards && program.leaderboards.length) {
            return program.leaderboards[0].id;
        }
        console.error("The program has no linked leaderboards!");
    }
    console.error("Invalid program id!");
};

const profileIsValid = () => {
    const value = localStorage.getItem('ProfileIsValid');
    if (value) {
        return true;
    }

    const nickname = document.querySelector('#form-user-nickName').value;
    if (nickname) {
        return true;
    }

    return false;
};

const performUserFormValidation = () => {
    if (profileIsValid()) {
        document.querySelector('#createProfileButton').removeAttribute('disabled');
    } else {
        document
            .querySelector('#createProfileButton')
            .setAttribute('disabled', 'disabled');
    }
};

const showAllTabs = () => {
    document.querySelector('#timeline-nav-tab').style.display = 'block';
    document.querySelector('#leaderboard-nav-tab').style.display = 'block';
    document.getElementById('profile-nav-tab').style.display = 'none';
    document.querySelector('#widget-tab').click();
    const staticHeaderImage = document.getElementById("static-header-image");
    staticHeaderImage.setAttribute("src", "./images/small-header.jpg");
    staticHeaderImage.style.height = "120px";

};

const updateUserProfile = ({ nickname }) => {
    LiveLike.updateUserProfile({
        accessToken: LiveLike.userProfile.access_token,
        options: {
            nickname: nickname,
            //custom_data: JSON.stringify({}),
        },
    })
        .then((res) => {
            localStorage.setItem('ProfileIsValid', true);
            refreshProfileData();
            showAllTabs();
            document.getElementById("player").style.display = "grid";
        })
        .catch((err) => {
            console.warn(err);
        });
};

const refreshProfileData = () => {
    document.querySelector('#form-user-nickName').value = "";//LiveLike.userProfile.nickname;
    var customData = JSON.parse(LiveLike.userProfile.custom_data);
    if (customData) {
        if (customData.fullName) {
            document.querySelector('#form-user-fullName').value = customData.fullName;
        }
    }
    performUserFormValidation();
};

const handleCreateUserProfile = (e) => {
    if (profileIsValid()) {
        updateUserProfile({
            nickname: document.querySelector('#form-user-nickName').value,
        });
    }
};

const showProfileTab = () => {
    document.querySelector('#timeline-nav-tab').style.display = 'none';
    document.querySelector('#leaderboard-nav-tab').style.display = 'none';
    document.getElementById('profile-tab-label').click();
    const staticHeaderImage = document.getElementById('static-header-image');
    staticHeaderImage.setAttribute("src", "./images/login-header.jpg");
    staticHeaderImage.style.height = "220px";
};

const showProfileTabIfFirstTimeVisiting = () => {
    performUserFormValidation();
    if (!profileIsValid()) {
        showProfileTab();
    } else {
        document.getElementById("player").style.display = "grid";
        document.getElementById('profile-nav-tab').style.display = 'none';
        document.getElementById('widget-tab').click();
    }
};