const photoUrls = [
  './public/image/1.jpeg',
  './public/image/2.jpeg',
  './public/image/3.jpeg',
  './public/image/4.jpeg',
  './public/image/5.jpeg',
  './public/image/6.webp',
  './public/image/7.webp',
  './public/image/8.webp',
];

let activePhoto = 0;
let prevPhoto = photoUrls.length - 1;
let nextPhoto = activePhoto + 1;
let photoDiv;
let photoPrevDiv;
let photoNextDiv;
let fullFrameDiv;
let photoFullFrameDiv;

const toggleFullFrame = () => {
  return fullFrameDiv.classList.contains('hide')
    ? fullFrameDiv.classList.remove('hide')
    : fullFrameDiv.classList.add('hide');
};

const nextImage = () => {
  prevPhoto = activePhoto;
  if (activePhoto < photoUrls.length - 1) {
    activePhoto++;
    activePhoto === photoUrls.length - 1
      ? (nextPhoto = 0)
      : (nextPhoto = activePhoto + 1);
  } else {
    activePhoto = 0;
    nextPhoto = activePhoto + 1;
  }
  render();
};

const prevImage = () => {
  nextPhoto = activePhoto;
  if (activePhoto > 0) {
    activePhoto--;
    activePhoto === 0
      ? (prevPhoto = photoUrls.length - 1)
      : (prevPhoto = activePhoto - 1);
  } else {
    activePhoto = photoUrls.length - 1;
    prevPhoto = activePhoto - 1;
  }
  render();
};

// const addAnimationLeft = () => {};

// const addAnimationRight = () => {};

const render = () => {
  photoPrevDiv.style.backgroundImage = `url(${photoUrls[prevPhoto]})`;
  photoPrevDiv.style.backgroundSize = `100%`;
  photoDiv.style.backgroundImage = `url(${photoUrls[activePhoto]})`;
  photoDiv.style.backgroundSize = `100%`;
  photoNextDiv.style.backgroundImage = `url(${photoUrls[nextPhoto]})`;
  photoNextDiv.style.backgroundSize = `100%`;
  photoFullFrameDiv.innerHTML = null;
  let imageEl = document.createElement('img');
  imageEl.src = photoUrls[activePhoto];
  photoFullFrameDiv.appendChild(imageEl);
  // photoFullFrameDiv.style.backgroundImage = `url(${photoUrls[activePhoto]})`;
  // photoFullFrameDiv.style.backgroundSize = `100%`;
};

const init = () => {
  photoDiv = document.getElementById('photo');
  photoNextDiv = photoDiv.nextElementSibling;
  photoPrevDiv = photoDiv.previousElementSibling;
  fullFrameDiv = document.getElementById('full-frame');
  photoFullFrameDiv = document.getElementById('photo-full-frame');
  //   toggleFullFrame();
  render();

  photoDiv.addEventListener('click', toggleFullFrame);
  photoNextDiv.addEventListener('click', nextImage);
  photoPrevDiv.addEventListener('click', prevImage);
  document.querySelector('.prev').addEventListener('click', prevImage);
  document.querySelector('.next').addEventListener('click', nextImage);
  document
    .querySelector('.prev-full-frame')
    .addEventListener('click', prevImage);
  document
    .querySelector('.next-full-frame')
    .addEventListener('click', nextImage);
  document
    .getElementById('close-full-frame')
    .addEventListener('click', toggleFullFrame);
};

document.addEventListener('DOMContentLoaded', init);
