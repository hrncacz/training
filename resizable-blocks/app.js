let handles;

let targetContainer;

function mouseMove(e) {
  requestAnimationFrame(() => {
    let startWidth = targetContainer.offsetWidth;
    let width = e.clientX - targetContainer.offsetLeft;
    targetContainer.style.width = `${width}px`;
    let siblingWidth =
      targetContainer.nextElementSibling.offsetWidth + (startWidth - width);
    targetContainer.nextElementSibling.style.width = `${siblingWidth}px`;
  });
}

function mouseDown(e) {
  requestAnimationFrame(() => {
    targetContainer = e.target.parentElement;
    console.log(targetContainer);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
  });
}

function mouseUp() {
  window.removeEventListener('mouseup', mouseUp);
  window.removeEventListener('mousemove', mouseMove);
  targetContainer = null;
}

function init() {
  handles = document.querySelectorAll('.handle');
  handles.forEach((item) => {
    item.addEventListener('mousedown', mouseDown);
  });
}

document.addEventListener('DOMContentLoaded', init());
