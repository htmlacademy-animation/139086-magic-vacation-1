import throttle from 'lodash/throttle';
import {AnimateOverlay, AccentTypographyBuild, AnimatePrizes} from './animation.js';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.OVERLAY_TIMEOUT = 700;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.introScreenIndex = Array.from(this.screenElements).findIndex((screen) => screen.id === `top`);
    this.historyScreenIndex = Array.from(this.screenElements).findIndex((screen) => screen.id === `story`);
    this.prizesScreenIndex = Array.from(this.screenElements).findIndex((screen) => screen.id === `prizes`);

    this.activeScreen = 0;
    this.prevScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);

    this.animateOverlay = new AnimateOverlay();
    this.animationScreenIntroTitle = new AccentTypographyBuild(`.intro__title`, 1000, `transform`);
    this.animationScreenIntroDate = new AccentTypographyBuild(`.intro__date`, 500, `transform`);
    this.animationScreenPrizesTitle = new AccentTypographyBuild(`.prizes__title`, 1000, `transform`);
    this.animatePrizes = new AnimatePrizes(`.prizes__item--primary`, `.prizes__item--secondary`, `.prizes__item--additional`);
    // this.animateSecondaryPrize = new AnimateSvg(`.prizes__item--secondary`);
    // this.animateAdditionalPrize = new AnimateSvg(`.prizes__item--additional`);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.prevScreen = this.activeScreen;

    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.prevScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const promise = new Promise((resolve) => {
      if (this.prevScreen === this.historyScreenIndex && this.activeScreen === this.prizesScreenIndex) {
        this.animateOverlay.init();
        setTimeout(() => {
          this.animateOverlay.destroy();
          resolve();
        }, this.OVERLAY_TIMEOUT);
      } else {
        resolve();
      }
    });

    promise.then(() => {
      if (this.prevScreen === this.introScreenIndex) {
        this.animationScreenIntroTitle.destroy();
        this.animationScreenIntroDate.destroy();
      } else if (this.prevScreen === this.prizesScreenIndex) {
        this.animationScreenPrizesTitle.destroy();
      }

      this.screenElements.forEach((screen) => {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      });
      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
      this.screenElements[this.activeScreen].classList.add(`active`);

      if (this.activeScreen === this.prizesScreenIndex) {
        setTimeout(() => {
          this.animationScreenPrizesTitle.init();
        }, 10);
        this.animatePrizes.init();
      } else if (this.activeScreen === this.introScreenIndex) {
        setTimeout(() => {
          this.animationScreenIntroTitle.init();
        }, 0);
        setTimeout(() => {
          this.animationScreenIntroDate.init();
        }, 500);
      }
    });
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
