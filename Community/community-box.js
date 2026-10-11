/* =========================================================
   MONESTRA — COMMUNITY LIQUID GLASS BOX
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const communityItems =
        document.querySelectorAll(".community-box-item");

    if (!communityItems.length) {
        return;
    }


    /* =====================================================
       ACTIVE PAGE
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    communityItems.forEach((item) => {

        const link =
            item.getAttribute("href");

        if (!link) {
            return;
        }

        const targetPage =
            link
                .split("/")
                .pop()
                .toLowerCase();


        if (targetPage === currentPage) {

            item.classList.add("active");

        } else {

            item.classList.remove("active");
        }

    });


    /* =====================================================
       CLICK ANIMATION
    ===================================================== */

    communityItems.forEach((item) => {

        item.addEventListener("click", () => {

            communityItems.forEach((otherItem) => {
                otherItem.classList.remove("active");
            });

            item.classList.add("active");

        });

    });

});
