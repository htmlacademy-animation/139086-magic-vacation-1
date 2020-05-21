const animation = () => {
  window.addEventListener(`load`, () => {
    document.querySelector(`body`).classList.add(`animate`);
  });
};

class AnimateOverlay {
  constructor() {
    this.overlayElement = null;
  }

  init() {
    this.overlayElement = document.createElement(`div`);

    this.overlayElement.classList.add(`overlay`);
    document.querySelector(`body`).prepend(this.overlayElement);
  }

  destroy() {
    this.overlayElement.remove();
  }
}

export {animation, AnimateOverlay};
