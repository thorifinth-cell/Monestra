/* =========================================================
   MONESTRA — LIVE
   Frontend only
   Streaming backend will be connected later.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const startLiveButton =
        document.getElementById("startLiveButton");

    const liveModal =
        document.getElementById("liveModal");

    const closeLiveModal =
        document.getElementById("closeLiveModal");

    const liveModalBackdrop =
        document.querySelector(".live-modal-backdrop");

    const followButton =
        document.getElementById("followButton");

    const liveChatInput =
        document.getElementById("liveChatInput");

    const liveChatSend =
        document.getElementById("liveChatSend");

    const liveChatMessages =
        document.getElementById("liveChatMessages");

    const chatEmpty =
        document.querySelector(".chat-empty");


    /* =====================================================
       OPEN MODAL
    ====================================================== */

    function openLiveModal() {

        if (!liveModal) return;

        liveModal.hidden = false;

        document.body.style.overflow = "hidden";

    }


    /* =====================================================
       CLOSE MODAL
    ====================================================== */

    function closeModal() {

        if (!liveModal) return;

        liveModal.hidden = true;

        document.body.style.overflow = "";

    }


    startLiveButton?.addEventListener(
        "click",
        openLiveModal
    );


    closeLiveModal?.addEventListener(
        "click",
        closeModal
    );


    liveModalBackdrop?.addEventListener(
        "click",
        closeModal
    );


    /* =====================================================
       ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeModal();

            }

        }
    );


    /* =====================================================
       FOLLOW
    ====================================================== */

    followButton?.addEventListener(
        "click",
        () => {

            const isFollowing =
                followButton.classList.toggle(
                    "following"
                );


            if (isFollowing) {

                followButton.innerHTML = `
                    <ion-icon name="checkmark-outline"></ion-icon>
                    Following
                `;

            } else {

                followButton.innerHTML = `
                    <ion-icon name="heart-outline"></ion-icon>
                    Follow
                `;

            }

        }
    );


    /* =====================================================
       LIVE CHAT
       Frontend preview only.
    ====================================================== */

    function sendChatMessage() {

        if (!liveChatInput || !liveChatMessages) {
            return;
        }

        const message =
            liveChatInput.value.trim();

        if (!message) return;


        /* Hide empty state */

        if (chatEmpty) {
            chatEmpty.style.display = "none";
        }


        /* Create message */

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "live-message";


        const username =
            document.createElement("strong");

        username.textContent =
            localStorage.getItem("loggedInUser")
            || "Guest";


        const text =
            document.createElement("span");

        text.textContent =
            message;


        messageElement.appendChild(username);
        messageElement.appendChild(text);


        liveChatMessages.appendChild(
            messageElement
        );


        liveChatInput.value = "";


        liveChatMessages.scrollTop =
            liveChatMessages.scrollHeight;

    }


    liveChatSend?.addEventListener(
        "click",
        sendChatMessage
    );


    /* =====================================================
       ENTER TO SEND
    ====================================================== */

    liveChatInput?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );


    /* =====================================================
       START STREAM
    ====================================================== */

    document
        .querySelector(".modal-live-primary")
        ?.addEventListener(
            "click",
            () => {

                closeModal();

                alert(
                    "Live streaming will be connected to the backend later."
                );

            }
        );


    /* =====================================================
       STREAM SETTINGS
    ====================================================== */

    document
        .querySelector(".modal-live-secondary")
        ?.addEventListener(
            "click",
            () => {

                alert(
                    "Stream settings will be available after backend integration."
                );

            }
        );


    /* =====================================================
       GLOBAL OBJECT
    ====================================================== */

    window.MonestraLive = {

        openLiveModal,
        closeModal,
        sendChatMessage

    };

});
