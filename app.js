document.addEventListener("DOMContentLoaded", () => {
    const apkDownloadUrl = "ting_tong_player_safe.apk";
    const counterApiBaseUrl = "https://api.counterapi.dev/v1/takiff507-ting-tong-player";
    const downloadCounterName = "apk-downloads";
    const visitorCounterName = "website-visitors";
    const visitorCountedKey = "tingTongPlayerVisitorCounted";
    const isPublishedSite = window.location.hostname === "takiff507.github.io";

    const getById = (id) => document.getElementById(id);

    const modalDisclaimer = getById("modal-disclaimer");
    const modalPrivacy = getById("modal-privacy");
    const modalDmca = getById("modal-dmca");
    const modalGuide = getById("modal-guide");
    const footerDownloadCount = getById("footer-download-count");
    const footerVisitorCount = getById("footer-visitor-count");

    const closeDisclaimer = getById("modal-disclaimer-close");
    const closePrivacy = getById("modal-privacy-close");
    const closeDmca = getById("modal-dmca-close");
    const closeGuide = getById("modal-guide-close");

    const triggersDisclaimer = [
        getById("modal-disclaimer-trigger"),
        getById("footer-disclaimer-trigger")
    ];

    const triggersPrivacy = [
        getById("modal-privacy-trigger"),
        getById("footer-privacy-trigger")
    ];

    const triggersDmca = [
        getById("modal-dmca-trigger"),
        getById("footer-dmca-trigger")
    ];

    const triggersGuide = [
        getById("modal-guide-trigger"),
        getById("footer-guide-trigger")
    ];

    const openModal = (modal) => {
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    const bindModalTriggers = (triggers, modal) => {
        triggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener("click", (event) => {
                    event.preventDefault();
                    openModal(modal);
                });
            }
        });
    };

    bindModalTriggers(triggersDisclaimer, modalDisclaimer);
    bindModalTriggers(triggersPrivacy, modalPrivacy);
    bindModalTriggers(triggersDmca, modalDmca);
    bindModalTriggers(triggersGuide, modalGuide);

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

    window.addEventListener("click", (event) => {
        if (event.target === modalDisclaimer) {
            closeModal(modalDisclaimer);
        }
        if (event.target === modalPrivacy) {
            closeModal(modalPrivacy);
        }
        if (event.target === modalDmca) {
            closeModal(modalDmca);
        }
        if (event.target === modalGuide) {
            closeModal(modalGuide);
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal(modalDisclaimer);
            closeModal(modalPrivacy);
            closeModal(modalDmca);
            closeModal(modalGuide);
        }
    });

    const downloadBtns = document.querySelectorAll("a[download]");

    const formatCount = (value) => {
        return new Intl.NumberFormat("en-IN").format(value);
    };

    const applyDownloadUrl = () => {
        downloadBtns.forEach(button => {
            button.setAttribute("href", apkDownloadUrl);
        });
    };

    const counterUrl = (name, action = "") => {
        return `${counterApiBaseUrl}/${name}/${action}`;
    };

    const readCounter = async (name) => {
        const response = await fetch(counterUrl(name), { cache: "no-store" });
        if (!response.ok) {
            return 0;
        }

        const data = await response.json();
        return Number(data.count || 0);
    };

    const incrementCounter = async (name) => {
        const response = await fetch(counterUrl(name, "up"), { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Counter API unavailable");
        }

        const data = await response.json();
        return Number(data.count || 0);
    };

    const hasVisitorBeenCounted = () => {
        try {
            return localStorage.getItem(visitorCountedKey) === "1";
        } catch (error) {
            return false;
        }
    };

    const markVisitorCounted = () => {
        try {
            localStorage.setItem(visitorCountedKey, "1");
        } catch (error) {
            // Some browsers can block storage; the counter still works as a public total.
        }
    };

    const loadDownloadStats = async () => {
        if (!footerDownloadCount) {
            return;
        }

        try {
            footerDownloadCount.textContent = formatCount(await readCounter(downloadCounterName));
        } catch (error) {
            footerDownloadCount.textContent = "--";
        }
    };

    const recordDownloadStats = async () => {
        if (!isPublishedSite) {
            await loadDownloadStats();
            return;
        }

        try {
            const downloadCount = await incrementCounter(downloadCounterName);
            if (footerDownloadCount) {
                footerDownloadCount.textContent = formatCount(downloadCount);
            }
        } catch (error) {
            await loadDownloadStats();
        }
    };

    const loadVisitorStats = async () => {
        if (!footerVisitorCount) {
            return;
        }

        try {
            const alreadyCounted = hasVisitorBeenCounted();
            const visitorCount = isPublishedSite && !alreadyCounted
                ? await incrementCounter(visitorCounterName)
                : await readCounter(visitorCounterName);

            if (isPublishedSite && !alreadyCounted) {
                markVisitorCounted();
            }

            footerVisitorCount.textContent = formatCount(visitorCount);
        } catch (error) {
            footerVisitorCount.textContent = "--";
        }
    };

    applyDownloadUrl();
    loadDownloadStats();
    loadVisitorStats();
    setInterval(loadDownloadStats, 30000);
    setInterval(loadVisitorStats, 30000);

    downloadBtns.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            if (button.classList.contains("downloading") || button.classList.contains("success")) {
                return;
            }

            const originalHtml = button.innerHTML;
            button.classList.add("downloading");
            button.innerHTML = `
                <div class="btn-progress-bar"></div>
                <span class="btn-text">Downloading 0%</span>
            `;

            const progressBar = button.querySelector(".btn-progress-bar");
            const buttonText = button.querySelector(".btn-text");
            let progress = 0;
            const duration = 2500;
            const intervalTime = 50;
            const step = 100 / (duration / intervalTime);

            const progressInterval = setInterval(() => {
                progress += step;

                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);

                    button.classList.remove("downloading");
                    button.classList.add("success");
                    button.innerHTML = `<span class="btn-text">Downloaded</span>`;

                    recordDownloadStats().finally(() => {
                        const link = document.createElement("a");
                        link.href = apkDownloadUrl;
                        link.setAttribute("download", "");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                    setTimeout(() => {
                        openModal(modalGuide);
                    }, 500);

                    setTimeout(() => {
                        button.classList.remove("success");
                        button.innerHTML = originalHtml;
                        applyDownloadUrl();
                    }, 3500);
                } else {
                    progressBar.style.width = `${progress}%`;
                    buttonText.textContent = `Downloading ${Math.round(progress)}%`;
                }
            }, intervalTime);
        });
    });
});
