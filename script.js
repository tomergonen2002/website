document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const modalContent = document.querySelector(".modal-section-content");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const sectionLinks = document.querySelectorAll(".section-link");
    const sections = document.querySelectorAll(".section-content");
    const overlayText = document.getElementById("overlayText");
    const homeButton = document.getElementById("homeButton");

    let currentSectionIndex = 0;

    sectionLinks.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            currentSectionIndex = index;
            showModal();
        });
    });

    prevButton.addEventListener("click", () => {
        currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
        updateModalContent();
    });

    nextButton.addEventListener("click", () => {
        currentSectionIndex = (currentSectionIndex + 1) % sections.length;
        updateModalContent();
    });

    homeButton.addEventListener("click", () => {
        modal.style.display = "none";
        showWelcomeScreen();
    });

    function showModal() {
        modal.style.display = "block";
        updateModalContent();
        hideAllSections();
    }

    function updateModalContent() {
        const section = sections[currentSectionIndex];
        modalContent.innerHTML = section.innerHTML;
    }

    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = "none";
        });
        overlayText.style.display = "none";
    }

    function showWelcomeScreen() {
        sections.forEach(section => {
            section.style.display = "none";
        });
        overlayText.style.display = "block";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            showWelcomeScreen();
        }
    };
});