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

class AccentTypographyBuild {
  constructor(element, duration, property) {
    this._element = document.querySelector(element);
    this._duration = duration;
    this._property = property;

    this._divideWords();
  }

  _splitAtChar(word, wordIndex) {
    return word.split(``).reduce((fragment, letter, letterIndex) => {
      const container = document.createElement(`span`);
      container.classList.add(`letter`);
      container.textContent = letter;
      container.style.transition = `${this._property} ${this._duration}ms ease ${this._getDelayForTransition(letterIndex, wordIndex)}ms`;
      fragment.appendChild(container);

      return fragment;
    }, document.createDocumentFragment());
  }

  _divideWords() {
    if (!this._element) {
      return;
    }

    const text = this._element.textContent.trim().split(` `).reduce((fragment, word, i) => {
      const container = document.createElement(`span`);

      container.classList.add(`word`);
      container.appendChild(this._splitAtChar(word, i));
      fragment.appendChild(container);

      return fragment;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(text);
  }

  _getDelayForTransition(letterIndex, wordIndex) {
    return letterIndex % 2 === 0 ? (wordIndex * 400) + 200 : (wordIndex * 400) + 400;
  }

  init() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(`active`);
  }

  destroy() {
    this._element.classList.remove(`active`);
  }
}

export {animation, AnimateOverlay, AccentTypographyBuild};
