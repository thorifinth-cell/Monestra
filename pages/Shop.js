/* =========================================================
   MONESTRA SHOP
   Frontend demo — backend will be connected later.
   Default avatar: Monestra logo
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const DEFAULT_LOGO = "../Pictures/Monestra-logo.png";
    const USER = localStorage.getItem("loggedInUser") || "Your profile";

    // Separate local demo collection for each browser profile name.
    const storageSuffix = USER.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const INVENTORY_KEY = `monestraShopInventory_${storageSuffix}`;
    const EQUIPPED_KEY = `monestraShopEquipped_${storageSuffix}`;

    const products = [
        {
            id: "blue-halo",
            name: "Blue Halo",
            category: "decorations",
            categoryLabel: "Avatar decoration",
            description: "A calm blue halo for a clean, futuristic profile.",
            price: 250,
            icon: "ellipse-outline",
            tag: "POPULAR",
            color: "#9db8e8",
            glow: "rgba(112,132,166,.36)",
            artClass: "round-icon",
            styleClass: "decoration-halo"
        },
        {
            id: "silver-frame",
            name: "Silver Frame",
            category: "decorations",
            categoryLabel: "Avatar decoration",
            description: "A sleek silver frame with a premium metallic feel.",
            price: 350,
            icon: "aperture-outline",
            tag: "PREMIUM",
            color: "#d4dbe5",
            glow: "rgba(190,205,225,.25)",
            artClass: "round-icon",
            styleClass: "decoration-silver"
        },
        {
            id: "neon-pulse",
            name: "Neon Pulse",
            category: "decorations",
            categoryLabel: "Avatar decoration",
            description: "A bright neon outline inspired by gaming setups.",
            price: 400,
            icon: "radio-outline",
            tag: "GAMING",
            color: "#8b9eff",
            glow: "rgba(105,111,255,.3)",
            artClass: "round-icon",
            styleClass: "decoration-neon"
        },
        {
            id: "dark-matter",
            name: "Dark Matter",
            category: "effects",
            categoryLabel: "Profile effect",
            description: "A subtle dark aura for a mysterious profile look.",
            price: 500,
            icon: "planet-outline",
            tag: "FEATURED",
            color: "#a5a4d8",
            glow: "rgba(99,88,170,.3)",
            styleClass: "effect-matter"
        },
        {
            id: "stardust",
            name: "Stardust",
            category: "effects",
            categoryLabel: "Profile effect",
            description: "A soft celestial glow surrounding your identity.",
            price: 450,
            icon: "sparkles-outline",
            tag: "NEW",
            color: "#e3d4ff",
            glow: "rgba(184,154,255,.3)",
            styleClass: "effect-stardust"
        },
        {
            id: "monestra-blue",
            name: "Monestra Blue",
            category: "themes",
            categoryLabel: "Profile theme",
            description: "A cool blue look inspired by Monestra's identity.",
            price: 300,
            icon: "color-palette-outline",
            tag: "MONESTRA",
            color: "#91a9d0",
            glow: "rgba(112,132,166,.3)",
            styleClass: "theme-blue"
        },
        {
            id: "midnight",
            name: "Midnight",
            category: "themes",
            categoryLabel: "Profile theme",
            description: "A minimal midnight look for your profile card.",
            price: 300,
            icon: "moon-outline",
            tag: "MINIMAL",
            color: "#b7bed0",
            glow: "rgba(76,89,121,.3)",
            styleClass: "theme-midnight"
        },
        {
            id: "pioneer",
            name: "Pioneer",
            category: "badges",
            categoryLabel: "Profile badge",
            description: "A collectible-style badge for your profile display.",
            price: 200,
            icon: "ribbon-outline",
            tag: "COLLECTIBLE",
            color: "#d9c28b",
            glow: "rgba(190,156,84,.25)",
            styleClass: "badge-pioneer"
        },
        {
            id: "elite",
            name: "Elite",
            category: "badges",
            categoryLabel: "Profile badge",
            description: "A polished badge design with a premium appearance.",
            price: 600,
            icon: "shield-checkmark-outline",
            tag: "ELITE",
            color: "#d4dce9",
            glow: "rgba(151,173,207,.25)",
            styleClass: "badge-elite"
        },
        {
            id: "pixel-spark",
            name: "Pixel Spark",
            category: "effects",
            categoryLabel: "Profile effect",
            description: "A playful pixel-inspired effect for gaming profiles.",
            price: 350,
            icon: "grid-outline",
            tag: "GAMING",
            color: "#a6d9c1",
            glow: "rgba(89,185,148,.25)",
            styleClass: "effect-pixel"
        },
        {
            id: "frost-ring",
            name: "Frost Ring",
            category: "decorations",
            categoryLabel: "Avatar decoration",
            description: "An icy ring that gives your avatar a crisp finish.",
            price: 375,
            icon: "snow-outline",
            tag: "COOL",
            color: "#b6e6f7",
            glow: "rgba(110,204,235,.28)",
            artClass: "round-icon",
            styleClass: "decoration-frost"
        },
        {
            id: "creator",
            name: "Creator",
            category: "badges",
            categoryLabel: "Profile badge",
            description: "A creator-inspired badge for your collection.",
            price: 275,
            icon: "create-outline",
            tag: "CREATOR",
            color: "#e9a8b5",
            glow: "rgba(220,127,151,.23)",
            styleClass: "badge-creator"
        }
    ];

    let selectedCategory = "all";
    let searchTerm = "";
    let currentProduct = null;
    let toastTimeout;

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    }

    function readEquipped() {
        try {
            const value = JSON.parse(localStorage.getItem(EQUIPPED_KEY) || "{}");
            return value && typeof value === "object" ? value : {};
        } catch {
            return {};
        }
    }

    function getInventory() {
        return readArray(INVENTORY_KEY);
    }

    function getEquipped() {
        return readEquipped();
    }

    function saveInventory(items) {
        try {
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
            return true;
        } catch {
            showToast("Couldn't save your demo inventory in this browser.");
            return false;
        }
    }

    function saveEquipped(items) {
        try {
            localStorage.setItem(EQUIPPED_KEY, JSON.stringify(items));
            return true;
        } catch {
            showToast("Couldn't save your demo equipment in this browser.");
            return false;
        }
    }

    function getProduct(id) {
        return products.find((product) => product.id === id);
    }

    function ownsItem(id) {
        return getInventory().includes(id);
    }

    function isEquipped(id) {
        return Object.values(getEquipped()).includes(id);
    }

    function showToast(message) {
        const toast = $("#shopToast");
        const messageElement = $("#shopToastMessage");

        if (!toast || !messageElement) return;

        messageElement.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    function getCategoryName(category) {
        const names = {
            decorations: "AVATAR DECORATION",
            effects: "PROFILE EFFECT",
            themes: "PROFILE THEME",
            badges: "PROFILE BADGE"
        };

        return names[category] || "SHOP ITEM";
    }

    function productArt(product, extraClass = "") {
        return `
            <div class="product-art ${extraClass}"
                 style="--art-color:${product.color};
                        --art-glow:${product.glow}">
                <span class="product-tag">${product.tag}</span>
                <div class="product-art-icon ${product.artClass || ""}">
                    <ion-icon name="${product.icon}"></ion-icon>
                </div>
                <span class="product-art-category">${product.categoryLabel}</span>
            </div>
        `;
    }

    function renderProductCard(product) {
        const owned = ownsItem(product.id);
        const equipped = isEquipped(product.id);

        return `
            <article class="shop-product-card">
                ${productArt(product)}

                <div class="product-card-body">
                    <h3 title="${product.name}">${product.name}</h3>
                    <p>${product.description}</p>

                    <div class="product-card-bottom">
                        <div class="product-price">
                            <strong>${product.price.toLocaleString()} <span style="display:inline;color:var(--shop-blue)">M</span></strong>
                            <span>${owned ? "In your collection" : "Demo currency"}</span>
                        </div>

                        <button class="product-preview-button ${owned ? "owned" : ""}"
                                data-preview="${product.id}">
                            <ion-icon name="${equipped ? "checkmark-circle-outline" : "eye-outline"}"></ion-icon>
                            ${equipped ? "Equipped" : owned ? "View item" : "Preview"}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function getVisibleProducts() {
        let result = products.filter((product) => {
            const categoryMatch =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            const searchableText =
                `${product.name} ${product.description} ${product.categoryLabel}`.toLowerCase();

            const searchMatch = searchableText.includes(searchTerm.toLowerCase());

            return categoryMatch && searchMatch;
        });

        const sortValue = $("#sortProducts")?.value || "featured";

        if (sortValue === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortValue === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortValue === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }

    function renderProducts() {
        const grid = $("#shopProductGrid");
        const empty = $("#shopNoResults");
        const resultsLabel = $("#resultsLabel");
        const resultsCount = $("#resultsCount");

        if (!grid) return;

        const visibleProducts = getVisibleProducts();

        grid.innerHTML = visibleProducts.map(renderProductCard).join("");
        empty.hidden = visibleProducts.length !== 0;
        resultsCount.textContent =
            `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}`;

        const categoryLabels = {
            all: "Featured items",
            decorations: "Avatar decorations",
            effects: "Profile effects",
            themes: "Profile themes",
            badges: "Badges"
        };

        resultsLabel.textContent = searchTerm
            ? `Search results for "${searchTerm}"`
            : categoryLabels[selectedCategory];

        updateOwnedCount();
    }

    function updateOwnedCount() {
        const count = $("#ownedCount");
        if (count) {
            const total = getInventory().length;
            count.innerHTML = `${total} <small>${total === 1 ? "item" : "items"}</small>`;
        }
    }

    // Avatar image:
    // Uses a saved browser image URL/data URL if one exists.
    // Otherwise, uses the Monestra logo.
    function getAvatarSource() {
        const possibleKeys = [
            "profilePicture",
            "profilePic",
            "profileImage",
            "userAvatar",
            "avatar",
            "avatarUrl"
        ];

        for (const key of possibleKeys) {
            try {
                const value = localStorage.getItem(key);

                if (
                    value &&
                    (value.startsWith("data:image/") ||
                     value.startsWith("https://") ||
                     value.startsWith("http://") ||
                     value.startsWith("../") ||
                     value.startsWith("./") ||
                     value.startsWith("/"))
                ) {
                    return value;
                }
            } catch {
                // Use the default logo if storage is unavailable.
            }
        }

        return DEFAULT_LOGO;
    }

    function setAvatarImage(element) {
        if (!element) return;

        element.src = getAvatarSource();
        element.onerror = () => {
            element.onerror = null;
            element.src = DEFAULT_LOGO;
        };
    }

    function setupUserProfile() {
        const username = USER || "Your profile";
        const avatarSource = getAvatarSource();

        $("#shopUsername").textContent = username;
        $("#heroUsername").textContent = username;

        $("#shopProfileHint").textContent =
            avatarSource === DEFAULT_LOGO
                ? "Your Monestra logo is your default avatar."
                : "Your saved profile picture is being used.";

        setAvatarImage($("#shopUserAvatar"));
        setAvatarImage($("#heroAvatar"));
        setAvatarImage($("#modalAvatar"));
    }

    // Decorations can be previewed on the avatar.
    // Effects and themes apply to the profile preview card.
    function applyProfilePreview(container, equipped = getEquipped()) {
        const heroDecoration = $("#heroDecoration");
        const heroCard = $(".hero-preview-card");

        const decorationProduct = getProduct(equipped.decorations);
        const effectProduct = getProduct(equipped.effects);
        const themeProduct = getProduct(equipped.themes);
        const badgeProduct = getProduct(equipped.badges);

        if (heroDecoration) {
            heroDecoration.className = "avatar-decoration decoration-none";

            if (decorationProduct) {
                heroDecoration.classList.add(decorationProduct.styleClass);
            }
        }

        if (heroCard) {
            heroCard.classList.remove(
                "effect-matter", "effect-stardust", "effect-pixel",
                "theme-blue", "theme-midnight"
            );

            if (effectProduct) {
                heroCard.classList.add(effectProduct.styleClass);
            }

            if (themeProduct) {
                heroCard.classList.add(themeProduct.styleClass);
            }

            let badge = heroCard.querySelector(".equipped-profile-badge");

            if (!badge && badgeProduct) {
                badge = document.createElement("span");
                badge.className = "equipped-profile-badge";
                badge.style.cssText =
                    "display:inline-flex;align-items:center;gap:5px;margin-top:12px;padding:6px 9px;border:1px solid rgba(112,132,166,.3);border-radius:8px;color:#E8E6D9;font-size:9px;";
                heroCard.appendChild(badge);
            }

            if (badge) {
                if (badgeProduct) {
                    badge.innerHTML = "";
                    const icon = document.createElement("ion-icon");
                    icon.setAttribute("name", badgeProduct.icon);
                    badge.append(icon, document.createTextNode(badgeProduct.name));
                    badge.hidden = false;
                } else {
                    badge.remove();
                }
            }
        }

        // Keep the avatar decoration preview in the open modal current.
        const modalFrame = $("#modalAvatarFrame");

        if (modalFrame && currentProduct && currentProduct.category === "decorations") {
            modalFrame.className = "modal-avatar-frame";

            const modalProduct = getProduct(currentProduct.id);
            if (modalProduct) {
                modalFrame.classList.add(modalProduct.styleClass);
            }
        }
    }

    function openPreview(id) {
        const product = getProduct(id);
        if (!product) return;

        currentProduct = product;

        $("#modalProductCategory").textContent = getCategoryName(product.category);
        $("#modalProductName").textContent = product.name;
        $("#modalProductDescription").textContent = product.description;
        $("#modalProductPrice").innerHTML =
            `${product.price.toLocaleString()} <small>MONES</small>`;

        $("#modalPreviewArea").style.setProperty("--art-color", product.color);
        $("#modalPreviewArea").style.setProperty("--art-glow", product.glow);

        const frame = $("#modalAvatarFrame");
        frame.className = "modal-avatar-frame";

        if (product.category === "decorations") {
            frame.classList.add(product.styleClass);
        } else {
            frame.classList.add("preview-" + product.category);
        }

        setAvatarImage($("#modalAvatar"));

        const owned = ownsItem(product.id);
        const equipped = isEquipped(product.id);

        $("#modalBuyButton").hidden = owned;
        $("#modalEquipButton").hidden = !owned;
        $("#modalEquipButton").innerHTML = `
            <ion-icon name="${equipped ? "checkmark-circle-outline" : "sparkles-outline"}"></ion-icon>
            ${equipped ? "Equipped" : "Equip item"}
        `;

        $("#modalNotice").textContent = owned
            ? "You already own this item in your local demo inventory."
            : "Demo only: adding this item does not charge money or make a real purchase.";

        $("#productModal").hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closePreview() {
        $("#productModal").hidden = true;
        document.body.style.overflow = "";
        currentProduct = null;
    }

    function buyDemoItem() {
        if (!currentProduct) return;

        const inventory = getInventory();

        if (inventory.includes(currentProduct.id)) {
            showToast("This item is already in your collection.");
            return;
        }

        inventory.push(currentProduct.id);

        if (!saveInventory(inventory)) return;

        showToast(`${currentProduct.name} added to your demo inventory.`);
        renderProducts();
        renderInventory();

        const boughtId = currentProduct.id;
        openPreview(boughtId);
    }

    function equipItem(id) {
        const product = getProduct(id);
        if (!product || !ownsItem(id)) {
            showToast("Add the item to your demo inventory first.");
            return;
        }

        const equipped = getEquipped();
        const current = equipped[product.category];

        if (current === id) {
            delete equipped[product.category];

            if (!saveEquipped(equipped)) return;

            showToast(`${product.name} unequipped.`);
        } else {
            equipped[product.category] = id;

            if (!saveEquipped(equipped)) return;

            showToast(`${product.name} equipped in your preview.`);
        }

        renderProducts();
        renderInventory();
        applyProfilePreview();

        if (currentProduct && currentProduct.id === id) {
            openPreview(id);
        }
    }

    function removeInventoryItem(id) {
        const product = getProduct(id);
        const inventory = getInventory().filter((itemId) => itemId !== id);

        if (!saveInventory(inventory)) return;

        const equipped = getEquipped();

        for (const category of Object.keys(equipped)) {
            if (equipped[category] === id) {
                delete equipped[category];
            }
        }

        if (!saveEquipped(equipped)) return;

        showToast(`${product ? product.name : "Item"} removed from your demo collection.`);
        renderProducts();
        renderInventory();
        applyProfilePreview();
    }

    function renderInventoryCard(product) {
        const equipped = isEquipped(product.id);

        return `
            <article class="shop-product-card inventory-product">
                ${productArt(product)}

                <div class="product-card-body">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>

                    <div class="product-card-bottom">
                        <div class="product-price">
                            <strong>${equipped ? "Equipped" : "Owned"}</strong>
                            <span>${product.categoryLabel}</span>
                        </div>

                        <button class="product-preview-button"
                                data-preview="${product.id}">
                            <ion-icon name="eye-outline"></ion-icon>
                            Preview
                        </button>

                        <div class="inventory-actions">
                            <button class="${equipped ? "equipped" : ""}"
                                    data-equip="${product.id}">
                                ${equipped ? "Unequip" : "Equip"}
                            </button>
                            <button class="remove-item"
                                    data-remove="${product.id}"
                                    aria-label="Remove ${product.name}"
                                    title="Remove from demo inventory">
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    function renderInventory() {
        const grid = $("#inventoryGrid");
        const empty = $("#inventoryEmpty");

        const ownedProducts = getInventory()
            .map(getProduct)
            .filter(Boolean);

        grid.innerHTML = ownedProducts.map(renderInventoryCard).join("");
        empty.hidden = ownedProducts.length > 0;
        grid.hidden = ownedProducts.length === 0;

        updateOwnedCount();
    }

    function showInventory() {
        $("#inventorySection").classList.add("visible");
        $("#inventorySection").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        renderInventory();
    }

    function showShop() {
        $("#inventorySection").classList.remove("visible");

        $("#shopCollection").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Category filtering.
    $$("#shopCategories .shop-category").forEach((button) => {
        button.addEventListener("click", () => {
            $$("#shopCategories .shop-category").forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            selectedCategory = button.dataset.category;
            renderProducts();
        });
    });

    // Search.
    $("#searchInput")?.addEventListener("input", (event) => {
        searchTerm = event.target.value.trim();
        renderProducts();
    });

    $("#searchInput")?.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.target.value = "";
            searchTerm = "";
            renderProducts();
            event.target.blur();
        }
    });

    $("#sortProducts")?.addEventListener("change", renderProducts);

    // Product preview buttons.
    document.addEventListener("click", (event) => {
        const previewButton = event.target.closest("[data-preview]");
        if (previewButton) {
            openPreview(previewButton.dataset.preview);
            return;
        }

        const equipButton = event.target.closest("[data-equip]");
        if (equipButton) {
            equipItem(equipButton.dataset.equip);
            return;
        }

        const removeButton = event.target.closest("[data-remove]");
        if (removeButton) {
            removeInventoryItem(removeButton.dataset.remove);
        }
    });

    // Modal controls.
    $("#modalBuyButton").addEventListener("click", buyDemoItem);

    $("#modalEquipButton").addEventListener("click", () => {
        if (currentProduct) equipItem(currentProduct.id);
    });

    $$("[data-close-modal]").forEach((element) => {
        element.addEventListener("click", closePreview);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !$("#productModal").hidden) {
            closePreview();
        }
    });

    // Navigation buttons.
    $("#exploreShop").addEventListener("click", () => {
        $("#shopCollection").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    $("#openInventory").addEventListener("click", showInventory);
    $("#backToShop").addEventListener("click", showShop);
    $("#inventoryExplore").addEventListener("click", showShop);

    $("#clearShopFilters").addEventListener("click", () => {
        selectedCategory = "all";
        searchTerm = "";

        $("#searchInput").value = "";
        $("#shopCategories .shop-category").forEach((button) => {
            button.classList.toggle("active", button.dataset.category === "all");
        });

        renderProducts();
    });

    // Logout hook matches the existing Monestra navbar where available.
    $("#shopLogout")?.addEventListener("click", () => {
        if (window.MonestraNavbar?.logout) {
            window.MonestraNavbar.logout();
        } else {
            localStorage.removeItem("loggedInUser");
            window.location.href = "../Monestra.html";
        }
    });

    // Initial setup.
    setupUserProfile();
    renderProducts();
    renderInventory();
    applyProfilePreview();

    // Useful for testing from the browser console.
    window.MonestraShop = {
        products,
        openPreview,
        showInventory,
        showShop,
        refresh: () => {
            setupUserProfile();
            renderProducts();
            renderInventory();
            applyProfilePreview();
        }
    };
});
