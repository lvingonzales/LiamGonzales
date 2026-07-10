gsap.registerPlugin(SplitText, ScrollTrigger);

let introTl = gsap.timeline({
  onComplete: initSectionAnimations
});

introTl.to("body .background", {duration: 1, delay: 0.5, backgroundPosition: "0% 0%", ease: "power3.out"})
.to("#header .text-container *", {duration: 0.8, x: 0, opacity: 1, stagger: 0.1, ease: "power3.out"})
.to("#header #status span", {duration: 0.8, x: 0, opacity: 1, ease: "power3.out"}, "<")
.to("#header #status .indicator", {duration: 0.5, delay: 0.3, scale: 1, ease: "power3.out"}, "<");

function initSectionAnimations() {
  document.fonts.ready.then(() => {

    gsap.set(".split-text", {autoAlpha: 1});

    let sections = gsap.utils.toArray("section");

    sections.forEach((section) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 30%",
          end: "bottom 90%",
          toggleActions: "play reverse play reverse",
        }
      });

      if (section.id === "intro") {
        const introTitle = section.querySelector(".intro.split-text.title");
        const introDescription = section.querySelector(".intro.split-text.description");

        SplitText.create(introTitle,
          {
            type: "words",
            mask: "words",
            autoSplit: true,
            onSplit(self) {
              let anim = gsap.from(self.words, {
                duration: 0.6,
                yPercent: -100,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "power3.out",
              });
              tl.add(anim, 0);
              return anim;
            }
          }
        );

        SplitText.create(introDescription,
          {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              let anim = gsap.from(self.lines, {
                duration: 0.6,
                yPercent: -100,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "power3.out",
              });
              tl.add(anim, "<");
              ScrollTrigger.refresh();
              return anim;
            }
          }
        );

        gsap.set(section.querySelectorAll("#intro #stack-list .stack-item"), {autoAlpha: 1});

        tl.add(gsap.from(section.querySelectorAll("#intro #stack-list .stack-item"), {
          duration: 0.6,
          yPercent: -100,
          autoAlpha: 0,
          stagger: 0.125,
          ease: "power3.out",
        }), "<");
      } else if (section.id === "about") {
        const aboutTitle = section.querySelector(".about.split-text.title");
        const aboutDescriptions = section.querySelectorAll(".about.split-text.description");

        SplitText.create(aboutTitle,
          {
            type: "lines, chars",
            autoSplit: true,
            onSplit(self) {
              let anim = gsap.from(self.chars, {
                duration: 0.6,
                autoAlpha: .25,
                stagger: 0.1,
                ease: "power3.out",
              });
              tl.add(anim, 0);
              return anim;
            }
          }
        );

        aboutDescriptions.forEach((description) => {
          SplitText.create(description,
            {
              type: "lines, chars",
              autoSplit: true,
              onSplit(self) {
                let anim = gsap.from(self.chars, {
                  duration: 0.8,
                  autoAlpha: 0.25,
                  stagger: 0.01,
                  ease: "power3.out",
                });
                tl.add(anim, "<");
                return anim;
              }
            }
          )
        })
      }
    })
  })
}

window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    introTl.play();
  });
});




