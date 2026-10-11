/* =========================================================
   MONESTRA — SERVERS
   Discord-style frontend
   Backend integration later.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const serverList =
        document.getElementById("serverList");

    const serverEmpty =
        document.getElementById("serverEmpty");

    const addServerButton =
        document.getElementById("addServerButton");

    const exploreServerButton =
        document.getElementById("exploreServerButton");

    const serverModal =
        document.getElementById("serverModal");

    const closeServerModal =
        document.getElementById("closeServerModal");

    const serverModalBackdrop =
        document.querySelector(".server-modal-backdrop");

    const createServerButton =
        document.getElementById("createServerButton");

    const joinServerButton =
        document.getElementById("joinServerButton");

    const channelItems =
        document.querySelectorAll(".channel-item");

    const currentChannelName =
        document.getElementById("currentChannelName");

    const serverMessageInput =
        document.getElementById("serverMessageInput");

    const serverSendButton =
        document.getElementById("serverSendButton");

    const serverChat =
        document.getElementById("serverChat");

    const serverWelcome =
        document.getElementById("serverWelcome");

    const membersButton =
        document.getElementById("membersButton");

    const membersPanel =
        document.getElementById("membersPanel");

    const closeMembers =
        document.getElementById("closeMembers");

    const channelSearch =
        document.getElementById("channelSearch");

    const serverUsername =
        document.getElementById("serverUsername");


    /* =====================================================
       USERNAME
    ====================================================== */

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (loggedInUser && serverUsername) {
        serverUsername.textContent =
            loggedInUser;
    }


    /* =====================================================
       MODAL
    ====================================================== */

    function openServerModal() {

        if (!serverModal) return;

        serverModal.hidden = false;

        document.body.style.overflow = "hidden";

    }


    function closeModal() {

        if (!serverModal) return;

        serverModal.hidden = true;

        document.body.style.overflow = "";

    }


    addServerButton?.addEventListener(
        "click",
        openServerModal
    );

    exploreServerButton?.addEventListener(
        "click",
        openServerModal
    );

    closeServerModal?.addEventListener(
        "click",
        closeModal
    );

    serverModalBackdrop?.addEventListener(
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
       CREATE SERVER
    ====================================================== */

    createServerButton?.addEventListener(
        "click",
        () => {

            closeModal();

            alert(
                "Server creation will be connected to the backend later."
            );

        }
    );


    /* =====================================================
       JOIN SERVER
    ====================================================== */

    joinServerButton?.addEventListener(
        "click",
        () => {

            closeModal();

            alert(
                "Server joining will be connected to the backend later."
            );

        }
    );


    /* =====================================================
       CHANNEL SELECTION
    ====================================================== */

    channelItems.forEach((channel) => {

        channel.addEventListener(
            "click",
            () => {

                channelItems.forEach((item) => {
                    item.classList.remove("active");
                });

                channel.classList.add("active");


                const channelName =
                    channel.dataset.channel ||
                    channel.querySelector("span")?.textContent ||
                    "general";


                if (currentChannelName) {

                    currentChannelName.textContent =
                        channelName;

                }


                if (serverMessageInput) {

                    serverMessageInput.placeholder =
                        `Message #${channelName}`;

                }


                /* Show clean channel empty state */

                if (serverWelcome) {

                    serverWelcome.innerHTML = `
                        <div class="server-welcome-icon">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                        </div>

                        <h2>#${channelName}</h2>

                        <p>
                            This is the beginning of the
                            #${channelName} channel.
                        </p>

                        <span>
                            Real messages will appear here
                            after backend integration.
                        </span>
                    `;

                }

            }
        );

    });


    /* =====================================================
       SEND MESSAGE
       FRONTEND PREVIEW ONLY
    ====================================================== */

    function sendMessage() {

        if (!serverMessageInput || !serverChat) {
            return;
        }

        const text =
            serverMessageInput.value.trim();

        if (!text) return;


        /* Hide welcome */

        if (serverWelcome) {
            serverWelcome.style.display = "none";
        }


        /* MESSAGE */

        const message =
            document.createElement("article");

        message.className =
            "server-message";


        const avatar =
            document.createElement("div");

        avatar.className =
            "server-message-avatar";

        avatar.innerHTML =
            `<ion-icon name="person-outline"></ion-icon>`;


        const content =
            document.createElement("div");

        content.className =
            "server-message-content";


        const meta =
            document.createElement("div");

        meta.className =
            "server-message-meta";


        const username =
            document.createElement("strong");

        username.textContent =
            loggedInUser || "Guest";


        const time =
            document.createElement("time");

        time.textContent =
            "now";


        meta.appendChild(username);
        meta.appendChild(time);


        const paragraph =
            document.createElement("p");

        paragraph.textContent =
            text;


        content.appendChild(meta);
        content.appendChild(paragraph);


        message.appendChild(avatar);
        message.appendChild(content);


        serverChat.appendChild(message);


        serverMessageInput.value = "";


        serverChat.scrollTop =
            serverChat.scrollHeight;

    }


    serverSendButton?.addEventListener(
        "click",
        sendMessage
    );


    /* =====================================================
       ENTER TO SEND
    ====================================================== */

    serverMessageInput?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =====================================================
       MEMBERS
    ====================================================== */

    membersButton?.addEventListener(
        "click",
        () => {

            if (!membersPanel) return;

            membersPanel.style.display =
                "flex";

        }
    );


    closeMembers?.addEventListener(
        "click",
        () => {

            if (!membersPanel) return;

            membersPanel.style.display =
                "none";

        }
    );


    /* =====================================================
       CHANNEL SEARCH
    ====================================================== */

    channelSearch?.addEventListener(
        "input",
        () => {

            const query =
                channelSearch.value
                    .trim()
                    .toLowerCase();


            channelItems.forEach((channel) => {

                const name =
                    channel
                        .querySelector("span")
                        ?.textContent
                        .toLowerCase() || "";


                channel.style.display =
                    name.includes(query)
                        ? "flex"
                        : "none";

            });

        }
    );


    /* =====================================================
       SERVER HOME
    ====================================================== */

    document
        .getElementById("serversHomeButton")
        ?.addEventListener(
            "click",
            () => {

                channelItems.forEach((item) => {
                    item.classList.remove("active");
                });

                currentChannelName.textContent =
                    "general";

                if (serverMessageInput) {
                    serverMessageInput.placeholder =
                        "Message #general";
                }

            }
        );


    /* =====================================================
       GLOBAL OBJECT
    ====================================================== */

    window.MonestraServers = {

        openServerModal,
        closeModal,
        sendMessage

    };

});
