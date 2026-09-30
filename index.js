function getProfileData(username) {
  return fetch(`https://api.github.com/users/${username}`).then((raw) => {
    if (!raw.ok) {
      if (raw.status === 404) {
        throw new Error("User not found");
      }

      if (raw.status === 403) {
        throw new Error("GitHub API rate limit exceeded");
      }

      throw new Error("Failed to fetch profile");
    }

    return raw.json();
  });
}

function getRepos(username) {
  return fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
  ).then((raw) => {
    if (!raw.ok) {
      if (raw.status === 403) {
        throw new Error("GitHub API rate limit exceeded");
      }

      if (raw.status === 404) {
        throw new Error("Repositories not found");
      }

      throw new Error("Failed to fetch repositories");
    }

    return raw.json();
  });
}

function decorateProfileData(details) {
  console.log("Profile Details:", details);

  const profileHTML = `
    <img
      class="avatar"
      src="${details.avatar_url}"
      alt="${details.login}"
    />

    <div class="profile-info">

      <div class="profile-name-row">
        <h2 class="profile-name">
          ${details.name || details.login}
        </h2>

        <span class="verified">✓</span>
      </div>

      <p class="username">
        @${details.login}
      </p>

      <p class="bio">
        ${details.bio || "No bio available"}
      </p>

      <div class="meta">

        <div class="meta-item">
          <span class="meta-icon">📍</span>
          <span>
            ${details.location || "Location not available"}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-icon">🏢</span>
          <span>
            ${details.company || "No company"}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-icon">🔗</span>

          <a
            href="${details.html_url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Profile
          </a>
        </div>

      </div>

      <div class="stats">

        <div class="stat">
          <strong>${details.public_repos}</strong>
          <span>Repositories</span>
        </div>

        <div class="stat">
          <strong>${details.followers}</strong>
          <span>Followers</span>
        </div>

        <div class="stat">
          <strong>${details.following}</strong>
          <span>Following</span>
        </div>

        <div class="stat">
          <strong>${details.public_gists}</strong>
          <span>Gists</span>
        </div>
         <div class="stat">
          <strong>${details.email}</strong>
          <span>Email</span>
        </div>

         <div class="stat">
          <strong>${details.company}</strong>
          <span>Company</span>
        </div>

      </div>

    </div>
  `;

  // Display profile in profile card
  const profileCard = document.querySelector(".profile-card");

  if (profileCard) {
    profileCard.innerHTML = profileHTML;
  }

  return profileHTML;
}

function displayRepos(repos) {
  //console.log("Repositories:", repos);

  repos.forEach((repo) => {
    //console.log(repo.name);
  });
}

const searchButton = document.querySelector(".search");
const userInputField = document.querySelector(".userInputField");

searchButton.addEventListener("click", () => {
  const username = userInputField.value.trim();

  // Check empty input
  if (!username) {
    alert("Please enter a GitHub username");
    return;
  }

  // Get profile
  getProfileData(username)
    .then((profileData) => {
    //  console.log("Profile:", profileData);

      decorateProfileData(profileData);

      // Get repositories
      return getRepos(username);
    })
    .then((repos) => {
      displayRepos(repos);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert(error.message);
    });
});
