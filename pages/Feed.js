/* =========================================
   MONESTRA FEED — FRONTEND ONLY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const createPanel = document.getElementById("createPanel");
    const openCreatePost = document.getElementById("openCreatePost");
    const emptyCreatePost = document.getElementById("emptyCreatePost");
    const closeCreatePost = document.getElementById("closeCreatePost");

    const postForm = document.getElementById("postForm");
    const postText = document.getElementById("postText");
    const postImages = document.getElementById("postImages");
    const postVideo = document.getElementById("postVideo");

    const selectedImages = document.getElementById("selectedImages");
    const postsContainer = document.getElementById("postsContainer");
    const emptyFeed = document.getElementById("emptyFeed");

    const addStory = document.getElementById("addStory");
    const storyFile = document.getElementById("storyFile");

    let selectedFiles = [];
    let objectUrls = [];


    /* =====================================
       CREATE PANEL
    ===================================== */

    function showComposer() {
        createPanel.hidden = false;
        postText.focus();

        createPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function hideComposer() {
        createPanel.hidden = true;
    }

    openCreatePost?.addEventListener("click", showComposer);
    emptyCreatePost?.addEventListener("click", showComposer);
    closeCreatePost?.addEventListener("click", hideComposer);


    /* =====================================
       FILE PREVIEWS
    ===================================== */

    function clearPreviews() {
        objectUrls.forEach(url => URL.revokeObjectURL(url));
        objectUrls = [];
        selectedImages.replaceChildren();
        selectedFiles = [];
    }

    function addPreview(file, isVideo = false) {
        const url = URL.createObjectURL(file);
        objectUrls.push(url);
        selectedFiles.push({ file, isVideo });

        const media = document.createElement(isVideo ? "video" : "img");
        media.src = url;

        if (isVideo) {
            media.controls = true;
            media.muted = true;
        } else {
            media.alt = "Selected image preview";
        }

        selectedImages.appendChild(media);
    }

    postImages?.addEventListener("change", () => {
        const files = Array.from(postImages.files || []);

        if (!files.length) return;

        clearPreviews();

        files.forEach(file => {
            if (file.type.startsWith("image/")) {
                addPreview(file, false);
            }
        });

        postVideo.value = "";
    });

    postVideo?.addEventListener("change", () => {
        const file = postVideo.files?.[0];

        if (!file) return;

        clearPreviews();

        if (file.type.startsWith("video/")) {
            addPreview(file, true);
        }

        postImages.value = "";
    });


    /* =====================================
       EMPTY STATE
    ===================================== */

    function updateEmptyFeed() {
        const hasPosts =
            postsContainer.querySelector(".post-card") !== null;

        emptyFeed.hidden = hasPosts;
    }


    /* =====================================
       CREATE FRONTEND PREVIEW POST
    ===================================== */

    postForm?.addEventListener("submit", event => {
        event.preventDefault();

        const content = postText.value.trim();

        if (!content && selectedFiles.length === 0) {
            postText.focus();
            postText.placeholder =
                "Write something or add a photo/video first...";
            return;
        }

        const card = document.createElement("article");
        card.className = "post-card";

        const top = document.createElement("div");
        top.className = "post-top";

        const avatar = document.createElement("div");
        avatar.className = "post-user-avatar";

        const avatarIcon = document.createElement("ion-icon");
        avatarIcon.setAttribute("name", "person-outline");
        avatar.appendChild(avatarIcon);

        const details = document.createElement("div");
        details.className = "post-user-details";

        const username = document.createElement("strong");
        username.textContent =
            localStorage.getItem("loggedInUser") || "Your account";

        const time = document.createElement("span");
        time.textContent = "Preview · just now";

        details.append(username, time);

        const menuIcon = document.createElement("ion-icon");
        menuIcon.className = "post-menu";
        menuIcon.setAttribute("name", "ellipsis-horizontal");

        top.append(avatar, details, menuIcon);
        card.appendChild(top);

        if (content) {
            const copy = document.createElement("p");
            copy.className = "post-copy";
            copy.textContent = content;
            card.appendChild(copy);
        }

        if (selectedFiles.length) {
            const media = document.createElement("div");
            media.className = "post-media";

            if (selectedFiles.length === 1) {
                media.classList.add("single");
            }

            selectedFiles.forEach(({ file, isVideo }) => {
                const url = URL.createObjectURL(file);
                objectUrls.push(url);

                const element = document.createElement(
                    isVideo ? "video" : "img"
                );

                element.src = url;

                if (isVideo) {
                    element.controls = true;
                    element.playsInline = true;
                } else {
                    element.alt = "Post image";
                }

                media.appendChild(element);
            });

            card.appendChild(media);
        }

        const actions = document.createElement("div");
        actions.className = "post-actions";

        const like = makeAction("heart-outline", "Like");
        const comment = makeAction("chatbubble-outline", "Comment");
        const share = makeAction("paper-plane-outline", "Share");
        const save = makeAction("bookmark-outline", "");

        save.classList.add("bookmark-action");
        save.setAttribute("aria-label", "Save post");
        save.title = "Save post";

        like.addEventListener("click", () => {
            const liked = like.classList.toggle("liked");
            like.querySelector("ion-icon").setAttribute(
                "name",
                liked ? "heart" : "heart-outline"
            );
            like.querySelector("span").textContent =
                liked ? "Liked" : "Like";
        });

        comment.addEventListener("click", () => {
            alert("Comments will be connected in a later step.");
        });

        share.addEventListener("click", async () => {
            const shareData = {
                title: "Monestra post",
                text: content || "Check out this post on Monestra."
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    if (error.name !== "AbortError") {
                        alert("Sharing isn't available right now.");
                    }
                }
            } else if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(shareData.text);
                    alert("Post text copied.");
                } catch {
                    alert("Sharing isn't available in this browser.");
                }
            } else {
                alert(shareData.text);
            }
        });

        save.addEventListener("click", () => {
            const saved = save.classList.toggle("saved");
            save.querySelector("ion-icon").setAttribute(
                "name",
                saved ? "bookmark" : "bookmark-outline"
            );
            save.title = saved ? "Saved in this preview" : "Save post";
        });

        actions.append(like, comment, share, save);
        card.appendChild(actions);

        const note = document.createElement("p");
        note.className = "post-preview-note";
        note.textContent =
            "Temporary preview — this post has not been published or saved.";
        card.appendChild(note);

        postsContainer.prepend(card);

        updateEmptyFeed();
        hideComposer();

        postText.value = "";
        postImages.value = "";
        postVideo.value = "";
        clearPreviews();

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });


    function makeAction(iconName, label) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "post-action";

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", iconName);

        button.appendChild(icon);

        if (label) {
            const text = document.createElement("span");
            text.textContent = label;
            button.appendChild(text);
        }

        return button;
    }


    /* =====================================
       STORIES — PICK FILE
    ===================================== */

    addStory?.addEventListener("click", () => {
        storyFile.click();
    });

    storyFile?.addEventListener("change", () => {
        const file = storyFile.files?.[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        const isVideo = file.type.startsWith("video/");

        const preview = window.open("", "_blank");

        if (!preview) {
            URL.revokeObjectURL(previewUrl);
            alert("Allow pop-ups to preview this story.");
            storyFile.value = "";
            return;
        }

        preview.document.title = "Monestra — Story Preview";
        preview.document.body.style.cssText =
            "margin:0;background:#0b0e11;color:#E8E6D9;" +
            "font-family:Arial,sans-serif;display:grid;" +
            "place-items:center;min-height:100vh;";

        const media = preview.document.createElement(
            isVideo ? "video" : "img"
        );

        media.src = previewUrl;
        media.style.cssText =
            "max-width:92vw;max-height:82vh;object-fit:contain;";

        if (isVideo) {
            media.controls = true;
            media.autoplay = true;
            media.playsInline = true;
        }

        const label = preview.document.createElement("p");
        label.textContent =
            "Story preview only — publishing will be added later.";
        label.style.cssText =
            "position:fixed;bottom:12px;text-align:center;" +
            "font-size:12px;color:#7084A6;";

        preview.document.body.append(media, label);

        preview.addEventListener("pagehide", () => {
            URL.revokeObjectURL(previewUrl);
        });

        storyFile.value = "";
    });


    updateEmptyFeed();

});
