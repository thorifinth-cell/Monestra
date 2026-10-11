/* =========================================================
   MONESTRA — MAIN NAVBAR
   Navigation + Authentication + Menus + Search
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PROJECT PATHS
    ===================================================== */

    // This file assumes Monestra.html is in the project root.
    const HOME_URL = "/Monestra.html";
    const LOGIN_URL = "/Authentication/log%20in.html";
    const SIGNUP_URL = "/Authentication/sign%20up.html";
    const PROFILE_URL = "/Authentication/profile.html";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const topNavbar = document.querySelector(".top-navbar");

    const accountButton = document.getElementById("accountButton");
    const notificationButton = document.getElementById("notificationButton");
    const dotsButton = document.getElementById("dotsButton");

    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    const accountArea = document.querySelector(".account-area");
    const authArea = document.querySelector(".auth-buttons");

    const dotsMenu = document.getElementById("dotsMenu");
    const searchInput = document.getElementById("searchInput");


    /* =====================================================
       NAVIGATION HELPER
    ===================================================== */

    function navigateTo(url) {
        window.location.href = url;
    }


    /* =====================================================
       SIDE NAVBAR ACTIVE STATE
    ===================================================== */

    const sideItems = document.querySelectorAll(".side-nav-item");

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    sideItems.forEach((item) => {
        const href = item.getAttribute("href");

        if (!href) return;

        const targetPage = href
            .split("/")
            .pop()
            .toLowerCase();

        if (
            targetPage === currentPage ||
            (
                currentPage === "" &&
                targetPage === "monestra.html"
            )
        ) {
            item.classList.add("active");
        }

        item.addEventListener("click", () => {
            sideItems.forEach((navItem) => {
                navItem.classList.remove("active");
            });

            item.classList.add("active");
        });
    });


    /* =====================================================
       LOGIN STATE
    ===================================================== */

    function checkLoginState() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const isLoggedIn = Boolean(loggedInUser);

        if (authArea) {
            authArea.classList.toggle("hidden", isLoggedIn);
        }

        if (accountArea) {
            accountArea.classList.toggle("visible", isLoggedIn);
        }

        document.body.classList.toggle("user-logged-in", isLoggedIn);
    }

    checkLoginState();


    /* =====================================================
       LOG IN BUTTON
    ===================================================== */

    loginButton?.addEventListener("click", () => {
        navigateTo(LOGIN_URL);
    });


    /* =====================================================
       SIGN UP BUTTON
    ===================================================== */

    signupButton?.addEventListener("click", () => {
        navigateTo(SIGNUP_URL);
    });


    /* =====================================================
       PROFILE BUTTON
    ===================================================== */

    accountButton?.addEventListener("click", () => {
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (!loggedInUser) {
            navigateTo(LOGIN_URL);
            return;
        }

        navigateTo(PROFILE_URL);
    });


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    notificationButton?.addEventListener("click", (event) => {
        event.stopPropagation();

        notificationButton.classList.toggle("open");
    });


    /* =====================================================
       THREE-DOTS MENU
    ===================================================== */

    dotsButton?.addEventListener("click", (event) => {
        event.stopPropagation();

        dotsMenu?.classList.toggle("open");
    });


    /* =====================================================
       CLOSE MENUS WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", () => {
        dotsMenu?.classList.remove("open");
        notificationButton?.classList.remove("open");
    });


    /* =====================================================
       KEEP MENU OPEN WHEN CLICKING INSIDE
    ===================================================== */

    dotsMenu?.addEventListener("click", (event) => {
        event.stopPropagation();
    });


    /* =====================================================
       LOGOUT BUTTON
    ===================================================== */

    document.getElementById("logoutBtn")?.addEventListener("click", (event) => {
        event.preventDefault();

        window.MonestraNavbar.logout();
    });


    /* =====================================================
       SEARCH
    ===================================================== */

    searchInput?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;

        const query = searchInput.value.trim();

        if (!query) return;

        // Search is not connected to a results page yet.
        console.log("Monestra Search:", query);
    });


    /* =====================================================
       SEARCH FOCUS
    ===================================================== */

    searchInput?.addEventListener("focus", () => {
        searchInput
            .closest(".search-box")
            ?.classList.add("focused");
    });

    searchInput?.addEventListener("blur", () => {
        searchInput
            .closest(".search-box")
            ?.classList.remove("focused");
    });


    /* =====================================================
       SCROLL EFFECT
    ===================================================== */

    window.addEventListener("scroll", () => {
        if (!topNavbar) return;

        topNavbar.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.MonestraNavbar = {
        refreshAuth() {
            checkLoginState();
        },

        loggedIn() {
            return Boolean(localStorage.getItem("loggedInUser"));
        },

        logout() {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("monestraProfileEmail");

            checkLoginState();

            navigateTo(HOME_URL);
        }
    };

});
