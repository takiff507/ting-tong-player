document.addEventListener("DOMContentLoaded", () => {
    // Modal Selectors
    const modalDisclaimer = document.getElementById("modal-disclaimer");
    const modalPrivacy = document.getElementById("modal-privacy");
    const modalDmca = document.getElementById("modal-dmca");
    const modalGuide = document.getElementById("modal-guide");

    // Close Buttons
    const closeDisclaimer = document.getElementById("modal-disclaimer-close");
    const closePrivacy = document.getElementById("modal-privacy-close");
    const closeDmca = document.getElementById("modal-dmca-close");
    const closeGuide = document.getElementById("modal-guide-close");

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

    const triggersGuide = [
        document.getElementById("modal-guide-trigger"),
        document.getElementById("footer-guide-trigger")
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

    triggersGuide.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                openModal(modalGuide);
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
    if (closeGuide) {
        closeGuide.addEventListener("click", () => closeModal(modalGuide));
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
        if (e.target === modalGuide) {
            closeModal(modalGuide);
        }
    });

    // Close on escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal(modalDisclaimer);
            closeModal(modalPrivacy);
            closeModal(modalDmca);
            closeModal(modalGuide);
        }
    });

    // Download Buttons Animation, Auto-Trigger & Modal Popup
    const downloadBtns = document.querySelectorAll('a[download]');

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent actual instant download link navigation
            e.preventDefault();

            // If already in progress, ignore multiple clicks
            if (btn.classList.contains('downloading') || btn.classList.contains('success')) {
                return;
            }

            const downloadUrl = btn.getAttribute('href');
            const originalHtml = btn.innerHTML;

            // Add downloading class and progress HTML
            btn.classList.add('downloading');
            btn.innerHTML = `
                <div class="btn-progress-bar"></div>
                <span class="btn-text">Downloading 0%</span>
            `;

            const progressBar = btn.querySelector('.btn-progress-bar');
            const btnText = btn.querySelector('.btn-text');

            let progress = 0;
            const duration = 2500; // Simulated duration of 2.5 seconds
            const intervalTime = 50; // Update progress bar every 50ms
            const step = 100 / (duration / intervalTime);

            const progressInterval = setInterval(() => {
                progress += step;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);

                    // Update button style to Green Success State
                    btn.classList.remove('downloading');
                    btn.classList.add('success');
                    btn.innerHTML = `<span class="btn-text">Downloaded ✓</span>`;

                    // Trigger actual file download in browser
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', '');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Open the installation/setup guide modal automatically after a short delay
                    setTimeout(() => {
                        openModal(modalGuide);
                    }, 500);

                    // Reset button back to its default look after 3.5 seconds
                    setTimeout(() => {
                        btn.classList.remove('success');
                        btn.innerHTML = originalHtml;
                    }, 3500);
                } else {
                    progressBar.style.width = `${progress}%`;
                    btnText.textContent = `Downloading ${Math.round(progress)}%`;
                }
            }, intervalTime);
        });
    });
});
