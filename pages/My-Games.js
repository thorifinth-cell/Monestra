document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // MONESTRA MY GAMES — FRONTEND ONLY

    const grid = document.getElementById("libraryGrid");
    const emptyState = document.getElementById("libraryEmpty");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortGames");
    const libraryTabs = document.getElementById("libraryTabs");
    const resultsLabel = document.getElementById("libraryResultsLabel");

    const totalGamesElement = document.getElementById("totalGames");
    const playingGamesElement = document.getElementById("playingGames");
    const completedGamesElement = document.getElementById("completedGames");

    const addGameButton = document.getElementById("addGameButton");
    const emptyAddGameButton = document.getElementById("emptyAddGameButton");
    const addGameModal = document.getElementById("addGameModal");
    const addModalBackdrop = document.getElementById("addModalBackdrop");
    const closeAddModalButton = document.getElementById("closeAddModal");
    const cancelAddGameButton = document.getElementById("cancelAddGame");
    const addGameForm = document.getElementById("addGameForm");

    const gameActionModal = document.getElementById("gameActionModal");
    const actionModalBackdrop = document.getElementById("actionModalBackdrop");
    const closeActionModalButton = document.getElementById("closeActionModal");
    const actionGameTitle = document.getElementById("actionGameTitle");
    const actionGameDetails = document.getElementById("actionGameDetails");
    const changeGameStatus = document.getElementById("changeGameStatus");
    const saveGameStatusButton = document.getElementById("saveGameStatus");
    const removeGameButton = document.getElementById("removeGameButton");

    const resetLibraryFiltersButton = document.getElementById("resetLibraryFilters");
    const toast = document.getElementById("libraryToast");

    let activeFilter = "All";
    let selectedGameId = null;
    let toastTimeout = null;

    // -----------------------------------------
    // USER-SPECIFIC LOCAL STORAGE
    // -----------------------------------------

    function getUsername() {
        return localStorage.getItem("loggedInUser") || "guest";
    }

    function getStorageKey() {
        return `monestraMyGames_${getUsername()}`;
    }

    function loadGames() {
        try {
            const data = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    let games = loadGames();

    function saveGames() {
        localStorage.setItem(getStorageKey(), JSON.stringify(games));
    }

    // -----------------------------------------
    // HELPERS
    // -----------------------------------------

    function createId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `game-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    function escapeText(value) {
        return String(value ?? "");
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "Recently added";
        }

        return date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function statusLabel(status) {
        const labels = {
            Playing: "Currently playing",
            Completed: "Completed",
            Backlog: "Want to play"
        };

        return labels[status] || "Want to play";
    }

    function statusClass(status) {
        const classes = {
            Playing: "status-playing",
            Completed: "status-completed",
            Backlog: "status-backlog"
        };

        return classes[status] || "status-backlog";
    }

    function artClass(game) {
        const colors = ["art-purple", "art-blue", "art-red", "art-green", "art-orange", "art-pink"];

        if (game.art && colors.includes(game.art)) {
            return game.art;
        }

        const seed = [...String(game.id || game.name)]
            .reduce((total, char) => total + char.charCodeAt(0), 0);

        return colors[seed % colors.length];
    }

    function getIconForCategory(category) {
        const icons = {
            Horror: "moon-outline",
            Indie: "cube-outline",
            Adventure: "planet-outline",
            Multiplayer: "people-outline",
            Rhythm: "musical-notes-outline",
            Action: "flash-outline",
            Other: "game-controller-outline"
        };

        return icons[category] || "game-controller-outline";
    }

    // -----------------------------------------
    // COUNTERS
    // -----------------------------------------

    function updateCounters() {
        totalGamesElement.textContent = games.length;

        playingGamesElement.textContent = games.filter(
            (game) => game.status === "Playing"
        ).length;

        completedGamesElement.textContent = games.filter(
            (game) => game.status === "Completed"
        ).length;
    }

    // -----------------------------------------
    // FILTER AND SORT
    // -----------------------------------------

    function getVisibleGames() {
        const query = (searchInput?.value || "").trim().toLowerCase();

        let filtered = games.filter((game) => {
            const matchesStatus =
                activeFilter === "All" || game.status === activeFilter;

            const text = [
                game.name,
                game.category,
                game.description,
                statusLabel(game.status)
            ].join(" ").toLowerCase();

            return matchesStatus && text.includes(query);
        });

        const sort = sortSelect?.value || "recent";

        if (sort === "az") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "za") {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            filtered.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        }

        return filtered;
    }

    // -----------------------------------------
    // CREATE CARD
    // -----------------------------------------

    function createGameCard(game, index) {
        const card = document.createElement("article");
        card.className = "library-game-card";
        card.style.animationDelay = `${Math.min(index * 40, 200)}ms`;

        const art = document.createElement("div");
        art.className = `library-game-art ${artClass(game)}`;

        if (game.image) {
            const image = document.createElement("img");

            image.src = game.image;
            image.alt = `${game.name} cover`;
            image.loading = "lazy";
            image.referrerPolicy = "no-referrer";

            image.style.position = "absolute";
            image.style.inset = "0";
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
            image.style.zIndex = "0";

            image.addEventListener("error", () => image.remove(), { once: true });

            art.appendChild(image);
        }

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", getIconForCategory(game.category));
        icon.setAttribute("aria-hidden", "true");

        if (game.image) {
            icon.style.position = "relative";
            icon.style.opacity = "0.25";
        }

        const status = document.createElement("span");
        status.className = `library-status ${statusClass(game.status)}`;
        status.textContent = statusLabel(game.status);

        const category = document.createElement("span");
        category.className = "library-game-category";
        category.textContent = game.category || "Other";

        art.append(icon, status, category);

        const info = document.createElement("div");
        info.className = "library-game-info";

        const title = document.createElement("h3");
        title.textContent = escapeText(game.name);

        const description = document.createElement("p");
        description.className = "library-game-description";
        description.textContent =
            game.description || "No description added for this game yet.";

        const bottom = document.createElement("div");
        bottom.className = "library-game-bottom";

        const date = document.createElement("span");
        date.className = "added-date";
        date.textContent = `Added ${formatDate(game.addedAt)}`;

        const manageButton = document.createElement("button");
        manageButton.className = "manage-game-button";
        manageButton.type = "button";
        manageButton.dataset.gameId = game.id;
        manageButton.innerHTML =
            'Manage <ion-icon name="settings-outline"></ion-icon>';

        bottom.append(date, manageButton);
        info.append(title, description, bottom);
        card.append(art, info);

        return card;
    }

    // -----------------------------------------
    // RENDER
    // -----------------------------------------

    function renderGames() {
        if (!grid) return;

        const visibleGames = getVisibleGames();
        grid.replaceChildren();

        visibleGames.forEach((game, index) => {
            grid.appendChild(createGameCard(game, index));
        });

        const isEmpty = visibleGames.length === 0;

        grid.hidden = isEmpty;
        emptyState.hidden = !isEmpty;

        if (resultsLabel) {
            if (games.length === 0) {
                resultsLabel.textContent = "Your collection is empty";
            } else if (isEmpty) {
                resultsLabel.textContent = "No games match your filters";
            } else {
                resultsLabel.textContent =
                    `${visibleGames.length} of ${games.length} games`;
            }
        }

        updateCounters();
    }

    // -----------------------------------------
    // MODAL OPEN/CLOSE
    // -----------------------------------------

    function openAddModal() {
        addGameModal.classList.add("open");
        addGameModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            document.getElementById("newGameName")?.focus();
        }, 50);
    }

    function closeAddModal() {
        addGameModal.classList.remove("open");
        addGameModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        addGameForm.reset();
    }

    function openActionModal(gameId) {
        const game = games.find((item) => item.id === gameId);
        if (!game) return;

        selectedGameId = gameId;
        actionGameTitle.textContent = game.name;
        changeGameStatus.value = game.status;

        actionGameDetails.textContent =
            `${game.category} · Added ${formatDate(game.addedAt)} · ` +
            (game.description || "No description added.");

        gameActionModal.classList.add("open");
        gameActionModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeActionModal() {
        gameActionModal.classList.remove("open");
        gameActionModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        selectedGameId = null;
    }

    function closeAnyModal() {
        if (addGameModal.classList.contains("open")) {
            closeAddModal();
        }

        if (gameActionModal.classList.contains("open")) {
            closeActionModal();
        }
    }

    addGameButton?.addEventListener("click", openAddModal);
    emptyAddGameButton?.addEventListener("click", openAddModal);

    closeAddModalButton?.addEventListener("click", closeAddModal);
    cancelAddGameButton?.addEventListener("click", closeAddModal);
    addModalBackdrop?.addEventListener("click", closeAddModal);

    closeActionModalButton?.addEventListener("click", closeActionModal);
    actionModalBackdrop?.addEventListener("click", closeActionModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAnyModal();
    });

    // -----------------------------------------
    // ADD A GAME
    // -----------------------------------------

    addGameForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("newGameName").value.trim();
        const category = document.getElementById("newGameCategory").value;
        const status = document.getElementById("newGameStatus").value;
        const description = document.getElementById("newGameDescription").value.trim();
        const image = document.getElementById("newGameImage").value.trim();

        if (!name) {
            showToast("Please enter a game name.");
            return;
        }

        const duplicate = games.some(
            (game) => game.name.toLowerCase() === name.toLowerCase()
        );

        if (duplicate) {
            showToast("This game is already in your library.");
            return;
        }

        if (image) {
            try {
                const parsedUrl = new URL(image);

                if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                    showToast("Please enter a valid image URL.");
                    return;
                }
            } catch {
                showToast("Please enter a valid image URL.");
                return;
            }
        }

        const newGame = {
            id: createId(),
            name,
            category,
            status,
            description,
            image,
            addedAt: Date.now()
        };

        games.unshift(newGame);
        saveGames();

        activeFilter = "All";
        libraryTabs?.querySelectorAll(".library-tab").forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.filter === "All");
        });

        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "recent";

        closeAddModal();
        renderGames();

        showToast(`${name} added to your library.`);
    });

    // -----------------------------------------
    // FILTER TABS
    // -----------------------------------------

    libraryTabs?.addEventListener("click", (event) => {
        const tab = event.target.closest(".library-tab");
        if (!tab) return;

        activeFilter = tab.dataset.filter || "All";

        libraryTabs.querySelectorAll(".library-tab").forEach((item) => {
            const isActive = item === tab;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        renderGames();
    });

    searchInput?.addEventListener("input", renderGames);
    sortSelect?.addEventListener("change", renderGames);

    // -----------------------------------------
    // MANAGE GAME
    // -----------------------------------------

    grid?.addEventListener("click", (event) => {
        const button = event.target.closest(".manage-game-button");
        if (!button) return;

        openActionModal(button.dataset.gameId);
    });

    saveGameStatusButton?.addEventListener("click", () => {
        const game = games.find((item) => item.id === selectedGameId);
        if (!game) return;

        game.status = changeGameStatus.value;

        saveGames();
        closeActionModal();
        renderGames();

        showToast(`${game.name} status updated.`);
    });

    removeGameButton?.addEventListener("click", () => {
        const game = games.find((item) => item.id === selectedGameId);
        if (!game) return;

        const shouldRemove = window.confirm(
            `Remove "${game.name}" from your library?`
        );

        if (!shouldRemove) return;

        games = games.filter((item) => item.id !== selectedGameId);

        saveGames();
        closeActionModal();
        renderGames();

        showToast(`${game.name} removed from your library.`);
    });

    // -----------------------------------------
    // RESET FILTERS
    // -----------------------------------------

    resetLibraryFiltersButton?.addEventListener("click", () => {
        activeFilter = "All";

        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "recent";

        libraryTabs?.querySelectorAll(".library-tab").forEach((tab) => {
            const isActive = tab.dataset.filter === "All";

            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-pressed", String(isActive));
        });

        renderGames();
    });

    // -----------------------------------------
    // INITIAL STATE
    // -----------------------------------------

    renderGames();
});
