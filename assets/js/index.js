// window load listener for backdrop sweep effect and value initialization

const numOfSection = 3;

window.addEventListener("load", () => {
    let currentSection = 1;
    const body = document.querySelector("body");
    body.addEventListener("transitionend", () => {
        const header = document.querySelector(".header");
        header.classList.add("active");

        header.addEventListener("transitionend", () => {
            checkSection(currentSection, true);
        });
    });
    body.classList.add("is-loaded");
});


function checkSection(currentSection, init) {
    const prevSectionBtn = document.querySelector(".btn.prev");
    const nextSectionBtn = document.querySelector(".btn.next");

    const prevSectionLink = document.querySelector("a:has(button.prev)");
    const nextSectionLink = document.querySelector("a:has(button.next)");

    const sections = document.querySelectorAll("section");

    if (init) {
        prevSectionBtn.addEventListener("click", () => {
            if (currentSection > 1) {
                currentSection--;
                checkSection(currentSection, false);
            }
        });

        nextSectionBtn.addEventListener("click", () => {
            if (currentSection < numOfSection) {
                currentSection++;
                checkSection(currentSection, false);
            }
        });
    }


    switch (currentSection) {
        case 1:
            prevSectionBtn.classList.remove("active");
            nextSectionBtn.classList.add("active");
            break;
        case 2:
            prevSectionBtn.classList.add("active");
            nextSectionBtn.classList.add("active");
            break;
        case 3:
            prevSectionBtn.classList.add("active");
            nextSectionBtn.classList.remove("active");
            break;
    }

    

    sections.forEach((section) => {
        if (parseInt(section.dataset.sectionindex) === currentSection) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });
}
