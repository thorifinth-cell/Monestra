/* =========================================================
   MONESTRA — MESSAGES
   Messenger-style frontend
   Backend will be connected later.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const messagesApp =
        document.querySelector(".messages-app");

    const chatEmpty =
        document.getElementById("chatEmpty");

    const chatInterface =
        document.getElementById("chatInterface");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatUserName =
        document.getElementById("chatUserName");

    const messageInput =
        document.getElementById("messageInput");

    const sendMessageButton =
        document.getElementById("sendMessageButton");

    const newMessageButton =
        document.getElementById("newMessageButton");

    const emptyNewMessage =
        document.getElementById("emptyNewMessage");

    const startMessageButton =
        document.getElementById("startMessageButton");

    const mobileBackButton =
        document.getElementById("mobileBackButton");

    const messageModal =
        document.getElementById("messageModal");

    const closeMessageModal =
        document.getElementById("closeMessageModal");

    const modalBackdrop =
        document.querySelector(".message-modal-backdrop");

    const conversationSearch =
        document.getElementById("conversationSearch");


    /* =====================================================
       OPEN NEW MESSAGE MODAL
    ====================================================== */

    function openMessageModal() {

        if (!messageModal) return;

        messageModal.hidden = false;

        document.body.style.overflow = "hidden";

        const input =
            document.getElementById("newMessageSearch");

        setTimeout(() => {
            input?.focus();
        }, 100);

    }


    /* =====================================================
       CLOSE MODAL
    ====================================================== */

    function closeModal() {

        if (!messageModal) return;

        messageModal.hidden = true;

        document.body.style.overflow = "";

    }


    newMessageButton?.addEventListener(
        "click",
        openMessageModal
    );

    emptyNewMessage?.addEventListener(
        "click",
        openMessageModal
    );

    startMessageButton?.addEventListener(
        "click",
        openMessageModal
    );

    closeMessageModal?.addEventListener(
        "click",
        closeModal
    );

    modalBackdrop?.addEventListener(
        "click",
        closeModal
    );


    /* =====================================================
       ESC CLOSE
    ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeModal();

        }

    });


    /* =====================================================
       PREPARE CHAT
       This function will later be connected
       to the real selected user.
    ====================================================== */

    function openChat(username = "User") {

        if (!messagesApp) return;

        chatEmpty.hidden = true;

        chatInterface.hidden = false;

        chatUserName.textContent = username;

        messagesApp.classList.add("chat-open");

        setTimeout(() => {
            messageInput?.focus();
        }, 100);

    }


    /* =====================================================
       SEND MESSAGE
       Frontend preview only.
    ====================================================== */

    function sendMessage() {

        if (!messageInput || !chatMessages) {
            return;
        }

        const text =
            messageInput.value.trim();

        if (!text) return;


        /* MESSAGE ROW */

        const row =
            document.createElement("div");

        row.className =
            "message-row sent";


        /* MESSAGE BUBBLE */

        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";

        bubble.textContent =
            text;


        row.appendChild(bubble);

        chatMessages.appendChild(row);


        /* CLEAR INPUT */

        messageInput.value = "";


        /* SCROLL */

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    /* =====================================================
       SEND BUTTON
    ====================================================== */

    sendMessageButton?.addEventListener(
        "click",
        sendMessage
    );


    /* =====================================================
       ENTER TO SEND
    ====================================================== */

    messageInput?.addEventListener(
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
       MOBILE BACK
    ====================================================== */

    mobileBackButton?.addEventListener(
        "click",
        () => {

            messagesApp?.classList.remove(
                "chat-open"
            );

            chatInterface.hidden = true;
            chatEmpty.hidden = false;

        }
    );


    /* =====================================================
       CONVERSATION SEARCH
       Real conversations will be filtered here later.
    ====================================================== */

    conversationSearch?.addEventListener(
        "input",
        () => {

            /*
                Backend integration later:

                Search users / conversations
                from PostgreSQL.
            */

        }
    );


    /* =====================================================
       KEYBOARD SHORTCUT
       Ctrl + K → new message
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openMessageModal();

            }

        }
    );


    /* =====================================================
       FUTURE BACKEND HOOK
    ====================================================== */

    window.MonestraMessages = {

        openChat,
        openMessageModal,
        closeModal,

        sendMessage

    };

});
