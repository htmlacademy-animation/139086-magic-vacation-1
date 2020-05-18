const animation = () => {
  window.addEventListener(`load`, () => {
    document.querySelector(`body`).classList.add(`animate`);
  });
};

export {animation};
