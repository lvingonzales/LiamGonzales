let projects;
const projectSection = document.getElementById("projects");

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

  projectSection.append(createProjectTemplate(projects[0]));
}

initProjects();

// Project Template //

function createProjectTemplate(project) {
  const projectContainer = document.createElement("div");
  projectContainer.classList.add('project-container');
  projectContainer.id = project.id;  

  //Project Background video
  const bgContainer = document.createElement("div");
  bgContainer.classList.add('project-bg-container');

  const bgVideo = document.createElement("video");
  bgVideo.controls = false;
  bgVideo.loop = true;
  bgVideo.preload = "metadata";

  const videoSrcDesktop = document.createElement("source");
  videoSrcDesktop.src = window.location.href + project.videoDesktop;
  videoSrcDesktop.type = "video/mp4";
  videoSrcDesktop.media = "(min-width: 1024px;)"
  bgVideo.append(videoSrcDesktop);

  const videoSrcMobile = document.createElement("source");
  videoSrcMobile.src = window.location.href + project.videoMobile;
  videoSrcMobile.type = "video/mp4";
  bgVideo.append(videoSrcMobile);
  
  bgContainer.append(bgVideo);

  projectContainer.append(bgContainer);


    return projectContainer;
}
