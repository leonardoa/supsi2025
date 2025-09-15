//container
let container = document.querySelector("#container");


//tools
let tools = document.querySelector("#tools");

//tools-data
let toolsData = document.querySelector("#tools-data");

//video
let video = document.querySelector("#video");

//other variables
let windowWidth = window.innerWidth;
let videoLoaded = false;
let timeout = null;

//events
container.addEventListener("click", mouseClickFn, true);
window.addEventListener("resize", resizeFn, true);

//mouseClick
function mouseClickFn(event) {
  if (videoLoaded) {
    video.muted = false;
  }
}

//resize
function resizeFn(event) {
  clearTimeout(timeout);
  toolsData.innerHTML = "Resizing...";

  //quanto facciamo il resize, aspettiamo 10ms per vedere se l'utente ha finito di fare il resize
  timeout = setTimeout(() => {
    toolsData.innerHTML = `width: ${window.innerWidth}, height: ${window.innerHeight}`;
    windowWidth = window.innerWidth;
    if (video.readyState === 4) {
      //map range per creare una relazione tra la dimensione dello schermo al range da 0 a 1
      let volume = mapRange(Number(window.innerWidth / 100).toFixed(1),5,18,0,1);
      video.volume = volume;
    }
  }, 10);
}

video.addEventListener("loadeddata", (e) => {
  if (video.readyState === 4) {
    videoLoaded = true;
  }
});

//map range
//linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
