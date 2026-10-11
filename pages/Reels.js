/* =========================================================
   MONESTRA — REELS
   Frontend only
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById("reelsContainer");


    if (!container) {
        return;
    }


    /*
        Backend will later inject real reels here.

        Each reel will have:

        .reel
        .reel-video
        .reel-info
        .reel-actions
        .reel-sound
    */


    /* =====================================================
       MOUSE WHEEL / TOUCH SUPPORT
    ===================================================== */

    let scrolling = false;


    container.addEventListener(
        "wheel",
        (event) => {

            if (scrolling) {
                return;
            }


            const direction =
                event.deltaY > 0 ? 1 : -1;


            const current =
                Math.round(
                    container.scrollTop /
                    container.clientHeight
                );


            const next =
                Math.max(
                    0,
                    current + direction
                );


            scrolling = true;


            container.scrollTo({
                top:
                    next *
                    container.clientHeight,

                behavior: "smooth"
            });


            setTimeout(() => {
                scrolling = false;
            }, 650);

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    let touchStartY = 0;
    let touchEndY = 0;


    container.addEventListener(
        "touchstart",
        (event) => {

            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    container.addEventListener(
        "touchend",
        (event) => {

            touchEndY =
                event.changedTouches[0].clientY;


            const difference =
                touchStartY - touchEndY;


            if (Math.abs(difference) < 50) {
                return;
            }


            const current =
                Math.round(
                    container.scrollTop /
                    container.clientHeight
                );


            const direction =
                difference > 0 ? 1 : -1;


            const next =
                Math.max(
                    0,
                    current + direction
                );


            container.scrollTo({
                top:
                    next *
                    container.clientHeight,

                behavior: "smooth"
            });

        },
        {
            passive: true
        }
    );


    /* =====================================================
       REEL CONTROLS
       Works automatically when real reels exist.
    ===================================================== */

    function setupReelControls() {

        const reels =
            container.querySelectorAll(".reel");


        reels.forEach((reel) => {

            const video =
                reel.querySelector(".reel-video");

            const like =
                reel.querySelector("[data-action='like']");

            const save =
                reel.querySelector("[data-action='save']");

            const sound =
                reel.querySelector(".reel-sound");


            /* LIKE */

            like?.addEventListener(
                "click",
                () => {

                    const liked =
                        like.classList.toggle("liked");

                    const icon =
                        like.querySelector("ion-icon");

                    if (icon) {

                        icon.setAttribute(
                            "name",
                            liked
                                ? "heart"
                                : "heart-outline"
                        );

                    }

                }
            );


            /* SAVE */

            save?.addEventListener(
                "click",
                () => {

                    const saved =
                        save.classList.toggle("saved");

                    const icon =
                        save.querySelector("ion-icon");

                    if (icon) {

                        icon.setAttribute(
                            "name",
                            saved
                                ? "bookmark"
                                : "bookmark-outline"
                        );

                    }

                }
            );


            /* SOUND */

            sound?.addEventListener(
                "click",
                () => {

                    if (!video) {
                        return;
                    }


                    video.muted =
                        !video.muted;


                    const icon =
                        sound.querySelector("ion-icon");


                    if (icon) {

                        icon.setAttribute(
                            "name",
                            video.muted
                                ? "volume-mute-outline"
                                : "volume-high-outline"
                        );

                    }

                }
            );

        });

    }


    setupReelControls();

});
