let projects;
gsap.registerPlugin(SplitText);
const projectSection = document.getElementById("projects");
const carouselContainer = document.querySelector("#projects .carousel-container");

async function getProjects () {
  const request = new Request("./projects.json");

  try {
    const response = await fetch(request);
    const data = await response.json();

    projects = data.projects;
    console.log(projects);
  } catch (error) {
    console.error("FAILED TO RETRIEVE PROJECTS!");
  }
}

async function initProjects() {
  await getProjects();

  projects.forEach((p, index) => {
    carouselContainer.append(createProjectTemplate(p, index));
  })

  const carouselIconContainer = document.createElement('div');
  carouselIconContainer.classList.add('carousel-icon-container')

  for(let i = 0; i < projects.length; i++) {
    const carouselIcon = document.createElement('div');
    carouselIcon.classList.add('carousel-icon');
    carouselIcon.dataset.index = i;
    carouselIconContainer.append(carouselIcon);
  }

  projectSection.append(carouselIconContainer);

  items = Array.from(document.querySelectorAll('#projects .project-container'));

  document.fonts.ready.then(() => {
    items.forEach((item) => {
      const video = item.querySelector('.project-bg-container video');
      const title = item.querySelector('.info-container .title');
      const desc = item.querySelector('.info-container .desc');

      const data = {videoTl: null, inactiveTl: null, titleAnim: null, inTitleAnim: null, descAnim: null, inDescAnim: null, played: false};

      data.videoTl = gsap.timeline({paused: true});

      data.videoTl.to(video, {filter: 'blur(0rem) grayscale(0%) brightness(1)', duration: 3, ease: 'power3.out'})
      .to(video, {filter: 'blur(0.15rem) grayscale(0%) brightness(0.33)', duration: 1.5, delay: 1.5, ease: 'power3.out'})
      .to(item.querySelector(".info-container .link"), {opacity: 1, duration: 1.5, ease: "power3.out"}, "<");

      data.inactiveTl = gsap.timeline({paused: true});
      data.inactiveTl.to(video, {filter: 'blur(0.3rem) grayscale(100%) brightness(0.25)', duration: 1.5, ease: 'power3.out'});

      SplitText.create(title, {
        type: 'lines, words',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit(self) {
          if(data.titleAnim) data.videoTl.remove(data.titleAnim);
          if(data.inTitleAnim) data.inactiveTl.remove(data.inTitleAnim);

          data.titleAnim = gsap.to(self.lines, {
            y: 0,
            duration: 1.5,
            ease: "power3.out"
          });
          data.videoTl.add(data.titleAnim, "<");

          data.inTitleAnim = gsap.to(self.lines, {
            yPercent: 100,
            duration: 1.5,
            ease: "power3.out"
          });
          data.inactiveTl.add(data.inTitleAnim, "<")

          return data.titleAnim;
        }
      })


      SplitText.create(desc, {
        type: 'lines, words',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit(self) {
          if(data.descAnim) data.videoTl.remove(data.descAnim);
          if(data.inDescAnim) data.inactiveTl.remove(data.inDescAnim);

          data.descAnim = gsap.to(self.lines, {
            y: 0,
            duration: 1.5,
            ease: "power3.out"
          });
          data.videoTl.add(data.descAnim, "<");

          data.inDescAnim = gsap.to(self.lines, {
            yPercent: 100,
            duration: 1.5,
            ease: "power3.out"
          });
          data.inactiveTl.add(data.inDescAnim, "<")

          return data.descAnim;
        }
      });

      itemData.set(item, data);
      console.log(itemData);
    })
  })

  applyMode(mq.matches);
  mq.addEventListener('change', function (e) { applyMode(e.matches); });
}

function playItem (item) {
  const data = itemData.get(item);
  if(!data) return;
  data.inactiveTl.pause(0);
  data.played = true;
  data.videoTl.play(0);
}

function resetItem(item) {
  const data = itemData.get(item);
  if (!data) return;
  data.played = false;
  data.videoTl.pause(0);
  data.inactiveTl.play(0);
}

function createProjectTemplate(project, index) {
  const projectContainer = document.createElement("div");
  projectContainer.classList.add('project-container');
  projectContainer.id = project.id;  
  projectContainer.dataset.index = index;

  //Project Background video
  const bgContainer = document.createElement("div");
  bgContainer.classList.add('project-bg-container');

  const bgVideo = document.createElement("video");
  bgVideo.controls = false;
  bgVideo.loop = true;
  bgVideo.muted = true;
  bgVideo.preload = "metadata";

  const videoSrcDesktop = document.createElement("source");
  videoSrcDesktop.src = window.location.href + project.videoDesktop;
  videoSrcDesktop.type = "video/mp4";
  videoSrcDesktop.media = "(min-width: 1024px)"
  bgVideo.append(videoSrcDesktop);

  const videoSrcMobile = document.createElement("source");
  videoSrcMobile.src = window.location.href + project.videoMobile;
  videoSrcMobile.type = "video/mp4";
  bgVideo.append(videoSrcMobile);
  
  bgContainer.append(bgVideo);

  projectContainer.append(bgContainer);


  // Project Information

  const infoContainer = document.createElement("div")
  infoContainer.classList.add('info-container');

  const infoTitle = document.createElement('h2');
  infoTitle.innerText = project.name;
  infoTitle.classList.add('title');
  infoContainer.append(infoTitle);

  const infoDesc = document.createElement('p');
  infoDesc.innerText = project.desc;
  infoDesc.classList.add('desc');
  infoContainer.append(infoDesc);

  const infoLink = document.createElement('a');
  infoLink.classList.add('link');
  infoLink.href = project.link;
  infoLink.rel = "noopener";
  infoLink.target = "_blank";
  infoLink.type = "button";
  infoContainer.append(infoLink);

  projectContainer.append(infoContainer);

    return projectContainer;
}

let currentActive;
let observer = null;
let items = null;
let mq = window.matchMedia('(min-width: 860px)');
let itemData = new Map();

function pauseAll(active) {
  const videos = document.querySelectorAll("video");

  videos.forEach(v => {
    if (v !== active) {
      v.pause();
    }
  })
}

function setActive(item) {
  if (item === currentActive) return;

  const prev = currentActive;

  currentActive = item;

  if (prev) resetItem(prev);
  playItem(item);

  const video = item.querySelector('video');
  pauseAll(video);
  video.play().catch(function () {});

  const index = parseInt(item.dataset.index);

  const icons = Array.from(document.querySelectorAll('.carousel-icon'));

  const icontl = gsap.timeline({paused:true});

  icons.forEach(i => {
    let iconAnim = null;
    if (parseInt(i.dataset.index) === index) {
      iconAnim = gsap.to(i, {backgroundPosition: 0, duration: 0.3, ease: "power3.out"});
    } else {
      iconAnim = gsap.to(i, {backgroundPosition: 100, duration: 0.3, ease: "power3.out"});
    }

    icontl.add(iconAnim, "<");
  })

  icontl.play(0);
}



function startObserving() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.5) {
        setActive(entry.target);
      }
    }) 
  }, {threshold: [0, 0.25, 0.5, 0.75, 1]});

  items.forEach(item => {
    observer.observe(item);
  })
} 

function stopObserving() {
  if(observer) {
    observer.disconnect();
    observer = null;
  }
}

function applyMode(isDesktop) {
  if (isDesktop) {
    stopObserving();
  }else {
    startObserving();
  }
}

initProjects();

