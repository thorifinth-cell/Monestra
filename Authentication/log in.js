/* ==========================================
   MONESTRA — LOG IN LOGIC
   Frontend demo only.
   Real password authentication requires a backend.
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    const identifierInput = document.getElementById("loginIdentifier");
    const passwordInput = document.getElementById("loginPassword");
    const rememberInput = document.getElementById("rememberMe");

    const identifierError = document.getElementById("identifierError");
    const passwordError = document.getElementById("passwordError");

    const formMessage = document.getElementById("formMessage");
    const togglePassword = document.getElementById("togglePassword");
    const loginButton = document.getElementById("loginButton");

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    /*
      Restore the identifier only if the user chose Remember me.
      Never remember or store the password.
    */
    try {
        const savedIdentifier = localStorage.getItem(
            "monestraRememberedIdentifier"
        );

        if (savedIdentifier) {
            identifierInput.value = savedIdentifier;
            rememberInput.checked = true;
        }
    } catch {
        // The page can still be used if browser storage is unavailable.
    }

    /*
      Show / hide password
    */
    togglePassword.addEventListener("click", () => {
        const icon = togglePassword.querySelector("ion-icon");
        const showPassword = passwordInput.type === "password";

        passwordInput.type = showPassword ? "text" : "password";

        icon.setAttribute(
            "name",
            showPassword ? "eye-off-outline" : "eye-outline"
        );

        togglePassword.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );
    });

    /*
      Form message helpers
    */
    function showMessage(message, type = "error") {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;
    }

    function clearMessage() {
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }

    function setFieldError(input, errorElement, message) {
        errorElement.textContent = message;

        const wrapper = input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.toggle("invalid", Boolean(message));
        }

        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateIdentifier() {
        const value = identifierInput.value.trim();

        if (!value) {
            setFieldError(
                identifierInput,
                identifierError,
                "Enter your username or email."
            );

            return false;
        }

        setFieldError(identifierInput, identifierError, "");
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;

        if (!value) {
            setFieldError(
                passwordInput,
                passwordError,
                "Enter your password."
            );

            return false;
        }

        setFieldError(passwordInput, passwordError, "");
        return true;
    }

    /*
      Live validation
    */
    identifierInput.addEventListener("blur", validateIdentifier);

    identifierInput.addEventListener("input", () => {
        if (identifierError.textContent) {
            validateIdentifier();
        }

        clearMessage();
    });

    passwordInput.addEventListener("input", () => {
        if (passwordError.textContent) {
            validatePassword();
        }

        clearMessage();
    });

    /*
      Remember-me preference:
      remembers only the username/email, never the password.
    */
    rememberInput.addEventListener("change", () => {
        try {
            if (!rememberInput.checked) {
                localStorage.removeItem("monestraRememberedIdentifier");
            } else if (identifierInput.value.trim()) {
                localStorage.setItem(
                    "monestraRememberedIdentifier",
                    identifierInput.value.trim()
                );
            }
        } catch {
            // Remember-me is optional.
        }
    });

    identifierInput.addEventListener("change", () => {
        if (!rememberInput.checked) return;

        try {
            localStorage.setItem(
                "monestraRememberedIdentifier",
                identifierInput.value.trim()
            );
        } catch {
            // Ignore unavailable browser storage.
        }
    });

    /*
      Submit the login form.

      The current Sign Up demo stores only usernames and emails.
      It deliberately does not save passwords in localStorage.
      Therefore, this page cannot verify passwords securely yet.
    */
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage();

        const identifierIsValid = validateIdentifier();
        const passwordIsValid = validatePassword();

        if (!identifierIsValid || !passwordIsValid) {
            showMessage(
                "Please complete the required fields.",
                "error"
            );

            if (!identifierIsValid) {
                identifierInput.focus();
            } else {
                passwordInput.focus();
            }

            return;
        }

        const identifier = identifierInput.value.trim();

        let accounts = [];

        try {
            accounts = JSON.parse(
                localStorage.getItem("monestraDemoAccounts") || "[]"
            );

            if (!Array.isArray(accounts)) {
                accounts = [];
            }
        } catch {
            accounts = [];
        }

        const accountExists = accounts.some((account) => {
            if (!account || !account.username || !account.email) {
                return false;
            }

            return (
                account.username.toLowerCase() === identifier.toLowerCase() ||
                account.email.toLowerCase() === identifier.toLowerCase()
            );
        });

        if (!accountExists) {
            showMessage(
                "No demo account was found with that username or email. Create an account first, or connect the backend for real authentication.",
                "error"
            );

            return;
        }

        /*
          Do not set loggedInUser or redirect to the profile here:
          finding an account is not proof that the password is correct.
        */
        showMessage(
            "This demo account exists, but password verification is not connected yet. Connect the Monestra backend to finish login securely.",
            "error"
        );
    });

    /*
      Forgot-password placeholder
    */
    document.getElementById("forgotPassword").addEventListener("click", (event) => {
        event.preventDefault();

        showMessage(
            "Password recovery is not available yet. It needs a backend and an email verification flow.",
            "error"
        );
    });
});
