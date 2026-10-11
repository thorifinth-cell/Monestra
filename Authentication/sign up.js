/* ==========================================
   MONESTRA — SIGN UP LOGIC
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const termsInput = document.getElementById("terms");

    const formMessage = document.getElementById("formMessage");
    const submitButton = document.getElementById("signupButton");

    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");

    const strengthText = document.getElementById("strengthText");
    const strengthBars = [
        ...document.querySelectorAll(".strength-track span")
    ];

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    /*
      Password visibility buttons
    */
    document.querySelectorAll(".toggle-password").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.target);
            const icon = button.querySelector("ion-icon");

            const shouldShow = target.type === "password";

            target.type = shouldShow ? "text" : "password";
            icon.setAttribute(
                "name",
                shouldShow ? "eye-off-outline" : "eye-outline"
            );

            button.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );
        });
    });

    /*
      Error helpers
    */
    function setError(input, errorElement, message) {
        errorElement.textContent = message;

        const wrapper = input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.toggle("invalid", Boolean(message));

            if (message) {
                wrapper.classList.remove("valid");
            }
        }

        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function setValid(input) {
        const wrapper = input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.remove("invalid");
            wrapper.classList.add("valid");
        }

        input.setAttribute("aria-invalid", "false");
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;
    }

    function clearMessage() {
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }

    /*
      Username validation
    */
    function validateUsername() {
        const username = usernameInput.value.trim();

        if (!username) {
            setError(usernameInput, usernameError, "Please enter a username.");
            return false;
        }

        if (username.length < 3 || username.length > 24) {
            setError(
                usernameInput,
                usernameError,
                "Username must be between 3 and 24 characters."
            );
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError(
                usernameInput,
                usernameError,
                "Use only letters, numbers and underscores."
            );
            return false;
        }

        setError(usernameInput, usernameError, "");
        setValid(usernameInput);
        return true;
    }

    /*
      Email validation
    */
    function validateEmail() {
        const email = emailInput.value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!email) {
            setError(emailInput, emailError, "Please enter your email address.");
            return false;
        }

        if (!emailPattern.test(email)) {
            setError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );
            return false;
        }

        setError(emailInput, emailError, "");
        setValid(emailInput);
        return true;
    }

    /*
      Password strength and validation
    */
    function getPasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        return score;
    }

    function updatePasswordStrength() {
        const password = passwordInput.value;
        const score = password ? getPasswordStrength(password) : 0;

        const labels = [
            "At least 8 characters",
            "Weak password",
            "Fair password",
            "Good password",
            "Strong password"
        ];

        const colors = [
            "#29303a",
            "#ff626b",
            "#e8b45d",
            "#9acb8b",
            "#70d6a1"
        ];

        strengthBars.forEach((bar, index) => {
            bar.style.background =
                index < score ? colors[score] : colors[0];
        });

        strengthText.textContent = labels[score];

        if (!password) {
            strengthText.textContent = "At least 8 characters";
        }
    }

    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            setError(
                passwordInput,
                passwordError,
                "Please create a password."
            );
            return false;
        }

        if (password.length < 8) {
            setError(
                passwordInput,
                passwordError,
                "Your password must contain at least 8 characters."
            );
            return false;
        }

        if (password.length > 128) {
            setError(
                passwordInput,
                passwordError,
                "Your password is too long."
            );
            return false;
        }

        setError(passwordInput, passwordError, "");
        setValid(passwordInput);
        return true;
    }

    /*
      Confirm password validation
    */
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmation = confirmPasswordInput.value;

        if (!confirmation) {
            setError(
                confirmPasswordInput,
                confirmPasswordError,
                "Please confirm your password."
            );
            return false;
        }

        if (password !== confirmation) {
            setError(
                confirmPasswordInput,
                confirmPasswordError,
                "Passwords do not match."
            );
            return false;
        }

        setError(confirmPasswordInput, confirmPasswordError, "");
        setValid(confirmPasswordInput);
        return true;
    }

    /*
      Terms validation
    */
    function validateTerms() {
        if (!termsInput.checked) {
            termsError.textContent =
                "Please accept the Terms of Service and Privacy Policy.";
            return false;
        }

        termsError.textContent = "";
        return true;
    }

    /*
      Live validation
    */
    usernameInput.addEventListener("blur", validateUsername);
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("input", () => {
        updatePasswordStrength();

        if (passwordError.textContent || passwordInput.value.length >= 8) {
            validatePassword();
        }

        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }

        clearMessage();
    });

    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }

        clearMessage();
    });

    usernameInput.addEventListener("input", clearMessage);
    emailInput.addEventListener("input", clearMessage);
    termsInput.addEventListener("change", () => {
        validateTerms();
        clearMessage();
    });

    /*
      Demo-only local registration.

      This does not create a secure production account.
      Passwords are intentionally NOT stored in localStorage.
      Connect this form to the backend before real registration.
    */
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage();

        const usernameIsValid = validateUsername();
        const emailIsValid = validateEmail();
        const passwordIsValid = validatePassword();
        const confirmationIsValid = validateConfirmPassword();
        const termsAreValid = validateTerms();

        if (
            !usernameIsValid ||
            !emailIsValid ||
            !passwordIsValid ||
            !confirmationIsValid ||
            !termsAreValid
        ) {
            showMessage(
                "Please check the highlighted fields and try again.",
                "error"
            );

            const firstInvalid = form.querySelector(
                '.input-wrapper.invalid input'
            );

            if (firstInvalid) {
                firstInvalid.focus();
            } else if (!termsAreValid) {
                termsInput.focus();
            }

            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();

        /*
          Frontend preview only: prevent duplicate usernames/emails
          on this browser. This is not a substitute for server checks.
        */
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

        const alreadyExists = accounts.some((account) =>
            account.username.toLowerCase() === username.toLowerCase() ||
            account.email.toLowerCase() === email
        );

        if (alreadyExists) {
            showMessage(
                "This username or email is already registered in this browser demo.",
                "error"
            );
            return;
        }

        /*
          Store only demo profile data.
          Never save the password or confirmation password here.
        */
        accounts.push({
            username,
            email,
            createdAt: new Date().toISOString()
        });

        try {
            localStorage.setItem(
                "monestraDemoAccounts",
                JSON.stringify(accounts)
            );

            localStorage.setItem("loggedInUser", username);
            localStorage.setItem("monestraProfileEmail", email);
        } catch {
            showMessage(
                "Your browser could not save the demo account. Please check browser storage settings.",
                "error"
            );
            return;
        }

        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "Account created";

        showMessage(
            "Demo account created! Opening your profile...",
            "success"
        );

        /*
          Profile page is in the Authentication folder.
        */
        window.setTimeout(() => {
            window.location.href = "profile.html";
        }, 900);
    });

    /*
      Terms links are placeholders until real legal pages exist.
    */
    document.getElementById("termsLink").addEventListener("click", (event) => {
        event.preventDefault();
        showMessage(
            "The Terms of Service page has not been created yet.",
            "error"
        );
    });

    document.getElementById("privacyLink").addEventListener("click", (event) => {
        event.preventDefault();
        showMessage(
            "The Privacy Policy page has not been created yet.",
            "error"
        );
    });
});
