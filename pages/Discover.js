document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -----------------------------------------
    // MONESTRA DISCOVER — FRONTEND DEMO
    // No backend or real game downloads yet.
    // -----------------------------------------

    const games = [
        {
            id: "beyond-unknown",
            title: "Beyond the Unknown",
            category: "Adventure",
            icon: "planet-outline",
            art: "art-purple",
            description: "Explore mysterious locations, discover hidden paths and uncover the secrets of an unknown world.",
            platform: "PC",
            featured: true
        },
        {
            id: "midnight-echo",
            title: "Midnight Echo",
            category: "Horror",
            icon: "moon-outline",
            art: "art-red",
            description: "A mysterious night, an abandoned building and strange sounds coming from the darkness.",
            platform: "PC",
            featured: true
        },
        {
            id: "pixel-frontier",
            title: "Pixel Frontier",
            category: "Indie",
            icon: "cube-outline",
            art: "art-green",
            description: "Build your own path through a colorful pixel world full of secrets and discoveries.",
            platform: "PC",
            featured: false
        },
        {
            id: "neon-circuit",
            title: "Neon Circuit",
            category: "Multiplayer",
            icon: "flash-outline",
            art: "art-blue",
            description: "Race through glowing futuristic tracks and challenge your friends to beat your best time.",
            platform: "PC",
            featured: false
        },
        {
            id: "rhythm-rift",
            title: "Rhythm Rift",
            category: "Rhythm",
            icon: "musical-notes-outline",
            art: "art-pink",
            description: "Follow the beat, hit every note and test your rhythm across energetic musical challenges.",
            platform: "PC",
            featured: false
        },
        {
            id: "last-signal",
            title: "Last Signal",
            category: "Horror",
            icon: "radio-outline",
            art: "art-orange",
            description: "A lost signal leads to a forgotten place. Search for answers while something follows your trail.",
            platform: "PC",
            featured: false
        }
    ];

    const grid = document.getElementById("discoverGamesGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryList = document.getElementById("categoryList");
    const sortSelect = document.getElementById("sortSelect");
    const gameCount = document.getElementById("gameCount");
    const resultsLabel = document.getElementById("resultsLabel");
    const emptyState = document.getElementById("emptyState");
    const clearFiltersButton = document.getElementById("clearFiltersButton");
    const resetSearchButton = document.getElementById("resetSearchButton");

    const modal = document.getElementById("gameModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModalButton = document.getElementById("closeModalButton");
    const closeDetailsButton = document.getElementById("closeDetailsButton");
    const modalArt = document.getElementById("modalArt");
    const modalGameIcon = document.getElementById("modalGameIcon");
    const modalGameTitle = document.getElementById("modalGameTitle");
    const modalGameCategory = document.getElementById("modalGameCategory");
    const modalGameDescription = document.getElementById("modalGameDescription");
    const favoriteGameButton = document.getElementById("favoriteGameButton");
    const featuredExploreButton = document.getElementById("featuredExploreButton");
    const toast = document.getElementById("discoverToast");

    let activeCategory = "All";
    let selectedGame = null;
    let toastTimeout = null;

    // -----------------------------------------
    // LOCAL STORAGE
    // -----------------------------------------

    function getUsername() {
        return localStorage.getItem("loggedInUser") || "guest";
    }

    function getFavoritesKey() {
        return `monestraDiscoverFavorites_${getUsername()}`;
    }

    function getFavorites() {
        try {
            const stored = JSON.parse(localStorage.getItem(getFavoritesKey()) || "[]");
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
    }

    // -----------------------------------------
    // TOAST
    // -----------------------------------------

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    // -----------------------------------------
    // FILTER AND SORT
    // -----------------------------------------

    function getVisibleGames() {
        const query = (searchInput?.value || "").trim().toLowerCase();

        let filtered = games.filter((game) => {
            const matchesCategory =
                activeCategory === "All" || game.category === activeCategory;

            const searchableText =
                `${game.title} ${game.category} ${game.description} ${game.platform}`
                    .toLowerCase();

            const matchesSearch = searchableText.includes(query);

            return matchesCategory && matchesSearch;
        });

        const sortMode = sortSelect?.value || "featured";

        if (sortMode === "az") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortMode === "za") {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        } else {
            filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        }

        return filtered;
    }

    // -----------------------------------------
    // CREATE GAME CARD
    // -----------------------------------------

    function createGameCard(game, index) {
        const card = document.createElement("article");
        card.className = "game-card";
        card.style.animationDelay = `${Math.min(index * 45, 220)}ms`;

        const art = document.createElement("div");
        art.className = `game-art ${game.art}`;

        const previewBadge = document.createElement("span");
        previewBadge.className = "game-preview-badge";
        previewBadge.textContent = "DEMO";

        const artIcon = document.createElement("ion-icon");
        artIcon.setAttribute("name", game.icon);
        artIcon.setAttribute("aria-hidden", "true");

        const category = document.createElement("span");
        category.className = "game-art-category";
        category.textContent = game.category;

        art.append(previewBadge, artIcon, category);

        const info = document.createElement("div");
        info.className = "game-info";

        const titleRow = document.createElement("div");
        titleRow.className = "game-title-row";

        const title = document.createElement("h3");
        title.className = "game-title";
        title.textContent = game.title;

        titleRow.append(title);

        const description = document.createElement("p");
        description.className = "game-description";
        description.textContent = game.description;

        const bottom = document.createElement("div");
        bottom.className = "game-bottom";

        const platform = document.createElement("span");
        platform.className = "game-platform";

        const platformIcon = document.createElement("ion-icon");
        platformIcon.setAttribute("name", "desktop-outline");

        const platformText = document.createElement("span");
        platformText.textContent = game.platform;

        platform.append(platformIcon, platformText);

        const detailsButton = document.createElement("button");
        detailsButton.className = "game-details-button";
        detailsButton.type = "button";
        detailsButton.dataset.gameId = game.id;
        detailsButton.innerHTML =
            'Details <ion-icon name="arrow-forward-outline"></ion-icon>';

        bottom.append(platform, detailsButton);
        info.append(titleRow, description, bottom);
        card.append(art, info);

        return card;
    }

    // -----------------------------------------
    // RENDER GAMES
    // -----------------------------------------

    function renderGames() {
        if (!grid) return;

        const visibleGames = getVisibleGames();
        grid.replaceChildren();

        visibleGames.forEach((game, index) => {
            grid.appendChild(createGameCard(game, index));
        });

        if (gameCount) {
            gameCount.textContent = String(visibleGames.length).padStart(2, "0");
        }

        if (resultsLabel) {
            const categoryText =
                activeCategory === "All" ? "All game previews" : `${activeCategory} previews`;

            resultsLabel.textContent = `${categoryText} · ${visibleGames.length} found`;
        }

        if (emptyState) {
            emptyState.hidden = visibleGames.length !== 0;
        }

        grid.hidden = visibleGames.length === 0;
    }

    // -----------------------------------------
    // CATEGORY BUTTONS
    // -----------------------------------------

    categoryList?.addEventListener("click", (event) => {
        const button = event.target.closest(".category-button");
        if (!button) return;

        activeCategory = button.dataset.category || "All";

        categoryList.querySelectorAll(".category-button").forEach((item) => {
            const isActive = item === button;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        renderGames();
    });

    // -----------------------------------------
    // SEARCH AND SORT
    // -----------------------------------------

    searchInput?.addEventListener("input", renderGames);
    sortSelect?.addEventListener("change", renderGames);

    function resetFilters() {
        activeCategory = "All";

        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "featured";

        categoryList?.querySelectorAll(".category-button").forEach((button) => {
            const isActive = button.dataset.category === "All";

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        renderGames();
    }

    clearFiltersButton?.addEventListener("click", resetFilters);
    resetSearchButton?.addEventListener("click", resetFilters);

    // -----------------------------------------
    // GAME DETAILS MODAL
    // -----------------------------------------

    function openGameModal(game) {
        if (!game || !modal) return;

        selectedGame = game;

        modalGameTitle.textContent = game.title;
        modalGameCategory.textContent = game.category;
        modalGameDescription.textContent = game.description;
        modalGameIcon.setAttribute("name", game.icon);

        modalArt.className = `modal-art ${game.art}`;

        updateFavoriteButton();

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        closeModalButton?.focus();
    }

    function closeGameModal() {
        if (!modal) return;

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        selectedGame = null;
    }

    grid?.addEventListener("click", (event) => {
        const button = event.target.closest(".game-details-button");
        if (!button) return;

        const game = games.find((item) => item.id === button.dataset.gameId);
        openGameModal(game);
    });

    closeModalButton?.addEventListener("click", closeGameModal);
    closeDetailsButton?.addEventListener("click", closeGameModal);
    modalBackdrop?.addEventListener("click", closeGameModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal?.classList.contains("open")) {
            closeGameModal();
        }
    });

    // -----------------------------------------
    // FEATURED GAME
    // -----------------------------------------

    featuredExploreButton?.addEventListener("click", () => {
        const featuredGame = games.find((game) => game.id === "beyond-unknown");
        openGameModal(featuredGame);
    });

    // -----------------------------------------
    // FAVORITES — LOCAL DEMO ONLY
    // -----------------------------------------

    function updateFavoriteButton() {
        if (!favoriteGameButton || !selectedGame) return;

        const isFavorite = getFavorites().includes(selectedGame.id);

        favoriteGameButton.classList.toggle("is-favorite", isFavorite);

        favoriteGameButton.innerHTML = isFavorite
            ? '<ion-icon name="heart"></ion-icon> Remove from favorites'
            : '<ion-icon name="heart-outline"></ion-icon> Add to favorites';
    }

    favoriteGameButton?.addEventListener("click", () => {
        if (!selectedGame) return;

        const favorites = getFavorites();
        const alreadyFavorite = favorites.includes(selectedGame.id);

        const updatedFavorites = alreadyFavorite
            ? favorites.filter((id) => id !== selectedGame.id)
            : [...favorites, selectedGame.id];

        saveFavorites(updatedFavorites);
        updateFavoriteButton();

        showToast(
            alreadyFavorite
                ? `${selectedGame.title} removed from favorites.`
                : `${selectedGame.title} added to your demo favorites.`
        );
    });

    // -----------------------------------------
    // INITIAL RENDER
    // -----------------------------------------

    renderGames();
});
