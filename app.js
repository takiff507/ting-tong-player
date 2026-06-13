document.addEventListener("DOMContentLoaded", () => {
    // Modal Selectors
    const modalDisclaimer = document.getElementById("modal-disclaimer");
    const modalPrivacy = document.getElementById("modal-privacy");
    const modalDmca = document.getElementById("modal-dmca");

    // Close Buttons
    const closeDisclaimer = document.getElementById("modal-disclaimer-close");
    const closePrivacy = document.getElementById("modal-privacy-close");
    const closeDmca = document.getElementById("modal-dmca-close");

    // Trigger Lists
    const triggersDisclaimer = [
        document.getElementById("modal-disclaimer-trigger"),
        document.getElementById("footer-disclaimer-trigger")
    ];

    const triggersPrivacy = [
        document.getElementById("modal-privacy-trigger"),
        document.getElementById("footer-privacy-trigger")
    ];

    const triggersDmca = [
        document.getElementById("modal-dmca-trigger"),
        document.getElementById("footer-dmca-trigger")
    ];

    // Helper functions to open/close
    const openModal = (modal) => {
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Disable scroll behind
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = ""; // Re-enable scroll
        }
    };

    // Attach Trigger Listeners
    triggersDisclaimer.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                openModal(modalDisclaimer);
            });
        }
    });

    triggersPrivacy.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                openModal(modalPrivacy);
            });
        }
    });

    triggersDmca.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                openModal(modalDmca);
            });
        }
    });

    // Attach Close Button Listeners
    if (closeDisclaimer) {
        closeDisclaimer.addEventListener("click", () => closeModal(modalDisclaimer));
    }
    if (closePrivacy) {
        closePrivacy.addEventListener("click", () => closeModal(modalPrivacy));
    }
    if (closeDmca) {
        closeDmca.addEventListener("click", () => closeModal(modalDmca));
    }

    // Close modals on clicking background overlay
    window.addEventListener("click", (e) => {
        if (e.target === modalDisclaimer) {
            closeModal(modalDisclaimer);
        }
        if (e.target === modalPrivacy) {
            closeModal(modalPrivacy);
        }
        if (e.target === modalDmca) {
            closeModal(modalDmca);
        }
    });

    // Close on escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal(modalDisclaimer);
            closeModal(modalPrivacy);
            closeModal(modalDmca);
        }
    });
});
