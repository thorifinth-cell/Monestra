/* ==========================================
   MONESTRA — PROFILE LOGIC
   Frontend demo using localStorage.
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const logoutButton = $("logoutButton");
    const editModal = $("editModal");
    const editProfileButton = $("editProfileButton");
    const closeModalButton = $("closeModalButton");
    const cancelEditButton = $("cancelEditButton");
    const editProfileForm = $("editProfileForm");

    const editUsername = $("editUsername");
    const editBio = $("editBio");
    const editUsernameError = $("editUsernameError");
    const bioCharCount = $("bioCharCount");
    const modalMessage = $("modalMessage");

    const avatarInput = $("avatarInput");
    const coverInput = $("coverInput");

    const DEFAULT_BIO =
        "No bio yet. Tell the community a little about yourself.";

    let currentUsername = "";
    let currentEmail = "";
    let profile = {};
    let toastTimer = null;

    /*
      Account/profile storage helpers.
      The profile key is unique to the current demo username.
    */
    function profileStorageKey(username) {
        return "monestraProfile_" + username.toLowerCase();
    }

    function readDemoAccounts() {
        try {
            const accounts = JSON.parse(
                localStorage.getItem("monestraDemoAccounts") || "[]"
            );

            return Array.isArray(accounts) ? accounts : [];
        } catch {
            return [];
        }
    }

    function getCurrentAccount() {
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (!loggedInUser) {
            return null;
        }

        const accounts = readDemoAccounts();

        return accounts.find((account) =>
            account &&
            typeof account.username === "string" &&
            account.username.toLowerCase() === loggedInUser.toLowerCase()
        ) || null;
    }

    function loadProfile(username) {
        const key = profileStorageKey(username);

        try {
            const saved = JSON.parse(localStorage.getItem(key) || "{}");

            return saved && typeof saved === "object" && !Array.isArray(saved)
                ? saved
                : {};
        } catch {
            return {};
        }
    }

    function saveProfile() {
        try {
            localStorage.setItem(
                profileStorageKey(currentUsername),
                JSON.stringify(profile)
            );

            return true;
        } catch {
            showToast(
                "Could not save. The browser may be out of storage space.",
                false
            );

            return false;
        }
    }

    /*
      Safe text rendering: user content is always assigned using textContent.
    */
    function renderProfile() {
        const bio = profile.bio || "";

        $("profileUsername").textContent = currentUsername;
        $("detailUsername").textContent = currentUsername;

        $("profileEmail").textContent = currentEmail || "Email not available";
        $("detailEmail").textContent = currentEmail || "Email not available";

        $("profileBio").textContent = bio.trim() || DEFAULT_BIO;
        $("detailBio").textContent = bio.trim() || "No bio added";

        const joinedDate = profile.joinedAt
            ? new Date(profile.joinedAt)
            : null;

        $("joinedDate").textContent =
            joinedDate && !Number.isNaN(joinedDate.getTime())
                ? joinedDate.toLocaleDateString("en", {
                    month: "short",
                    year: "numeric"
                })
                : "recently";

        const defaultAvatar = "../Pictures/Monestra-logo.png";

        $("profileAvatar").src = profile.avatar || defaultAvatar;

        $("profileAvatar").onerror = () => {
            $("profileAvatar").onerror = null;
            $("profileAvatar").src = defaultAvatar;
        };

        const coverArea = $("coverArea");

        if (profile.cover) {
            coverArea.style.backgroundImage =
                `url("${profile.cover}")`;
        } else {
            coverArea.style.backgroundImage = "";
        }

        /*
          Stats remain zero until real game/community data is connected.
          No fake followers or activity are displayed.
        */
        $("gamesCount").textContent = "0";
        $("communityCount").textContent = "0";
        $("postsCount").textContent = "0";
    }

    /*
      Toast notification
    */
    function showToast(message, success = true) {
        const toast = $("toast");

        $("toastText").textContent = message;

        const icon = toast.querySelector("ion-icon");

        icon.setAttribute(
            "name",
            success ? "checkmark-circle-outline" : "alert-circle-outline"
        );

        icon.style.color = success ? "var(--green)" : "var(--red)";

        toast.classList.add("show");

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    /*
      Edit profile modal
    */
    function openEditModal() {
        editUsername.value = currentUsername;
        editBio.value = profile.bio || "";
        bioCharCount.textContent = editBio.value.length;

        editUsernameError.textContent = "";
        editUsername.classList.remove("invalid");
        modalMessage.textContent = "";
        modalMessage.classList.remove("show");

        editModal.hidden = false;
        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => {
            editUsername.focus();
        });
    }

    function closeEditModal() {
        editModal.hidden = true;
        document.body.style.overflow = "";
        editProfileButton.focus();
    }

    editProfileButton.addEventListener("click", openEditModal);
    closeModalButton.addEventListener("click", closeEditModal);
    cancelEditButton.addEventListener("click", closeEditModal);

    editModal.addEventListener("click", (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !editModal.hidden) {
            closeEditModal();
        }
    });

    editBio.addEventListener("input", () => {
        bioCharCount.textContent = editBio.value.length;
    });

    editUsername.addEventListener("input", () => {
        editUsernameError.textContent = "";
        editUsername.classList.remove("invalid");
        modalMessage.classList.remove("show");
    });

    editProfileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newUsername = editUsername.value.trim();
        const newBio = editBio.value.trim();

        if (!/^[a-zA-Z0-9_]{3,24}$/.test(newUsername)) {
            editUsernameError.textContent =
                "Use 3–24 characters: letters, numbers or underscores.";

            editUsername.classList.add("invalid");
            editUsername.focus();
            return;
        }

        const accounts = readDemoAccounts();

        const usernameTaken = accounts.some((account) =>
            account &&
            typeof account.username === "string" &&
            account.username.toLowerCase() === newUsername.toLowerCase() &&
            account.username.toLowerCase() !== currentUsername.toLowerCase()
        );

        if (usernameTaken) {
            editUsernameError.textContent =
                "That username is already used by another demo account.";

            editUsername.classList.add("invalid");
            editUsername.focus();
            return;
        }

        /*
          Update the demo account list and profile storage together.
          This is local-only and is not a secure server-side account update.
        */
        const oldUsername = currentUsername;
        const oldKey = profileStorageKey(oldUsername);
        const newKey = profileStorageKey(newUsername);

        const accountIndex = accounts.findIndex((account) =>
            account &&
            typeof account.username === "string" &&
            account.username.toLowerCase() === oldUsername.toLowerCase()
        );

        if (accountIndex === -1) {
            modalMessage.textContent =
                "Your demo account could not be found. Please sign up again.";
            modalMessage.classList.add("show");
            return;
        }

        const previousAccountUsername = accounts[accountIndex].username;

        accounts[accountIndex].username = newUsername;

        const previousLoggedInUser = localStorage.getItem("loggedInUser");

        currentUsername = newUsername;
        profile.bio = newBio;

        try {
            localStorage.setItem(
                "monestraDemoAccounts",
                JSON.stringify(accounts)
            );

            localStorage.setItem("loggedInUser", newUsername);

            /*
              Preserve the profile's original creation date.
            */
            localStorage.setItem(newKey, JSON.stringify(profile));

            if (oldKey !== newKey) {
                localStorage.removeItem(oldKey);
            }

            renderProfile();
            closeEditModal();
            showToast("Your profile has been updated.");
        } catch {
            currentUsername = previousAccountUsername;
            localStorage.setItem("loggedInUser", previousLoggedInUser);

            modalMessage.textContent =
                "Could not save your changes. Check browser storage and try again.";

            modalMessage.classList.add("show");
        }
    });

    /*
      Image uploads.
      Use small images to avoid browser localStorage limits.
    */
    function readImageFile(file, callback) {
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showToast("Choose a JPG, PNG or WebP image.", false);
            return;
        }

        const maxSize = 1.5 * 1024 * 1024;

        if (file.size > maxSize) {
            showToast("Please choose an image smaller than 1.5 MB.", false);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") {
                showToast("The image could not be read.", false);
                return;
            }

            callback(reader.result);
        };

        reader.onerror = () => {
            showToast("The image could not be read.", false);
        };

        reader.readAsDataURL(file);
    }

    /*
      Profile picture
    */
    $("changeAvatarButton").addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files && avatarInput.files[0];

        readImageFile(file, (imageData) => {
            const previousAvatar = profile.avatar;

            profile.avatar = imageData;

            if (saveProfile()) {
                renderProfile();
                showToast("Profile picture updated.");
            } else {
                profile.avatar = previousAvatar;
            }

            avatarInput.value = "";
        });
    });

    /*
      Cover image
    */
    $("changeCoverButton").addEventListener("click", () => {
        coverInput.click();
    });

    coverInput.addEventListener("change", () => {
        const file = coverInput.files && coverInput.files[0];

        readImageFile(file, (imageData) => {
            const previousCover = profile.cover;

            profile.cover = imageData;

            if (saveProfile()) {
                renderProfile();
                showToast("Cover photo updated.");
            } else {
                profile.cover = previousCover;
            }

            coverInput.value = "";
        });
    });

    /*
      Logout
    */
    logoutButton.addEventListener("click", () => {
        const confirmed = window.confirm("Are you sure you want to log out?");

        if (!confirmed) return;

        try {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("monestraProfileEmail");
        } catch {
            // Continue to the login page.
        }

        window.location.href = "log in.html";
    });

    /*
      Initialize profile using the demo account created by Sign Up.
    */
    const account = getCurrentAccount();

    if (!account) {
        window.location.replace("log in.html");
        return;
    }

    currentUsername = account.username;

    currentEmail =
        account.email ||
        localStorage.getItem("monestraProfileEmail") ||
        "";

    profile = loadProfile(currentUsername);

    if (!profile.joinedAt && account.createdAt) {
        profile.joinedAt = account.createdAt;
    }

    /*
      Save default profile data once, without overriding user edits.
    */
    if (!profile.joinedAt) {
        profile.joinedAt = new Date().toISOString();
    }

    try {
        localStorage.setItem(
            profileStorageKey(currentUsername),
            JSON.stringify(profile)
        );
    } catch {
        // The profile can still be displayed without saving.
    }

    renderProfile();
});
