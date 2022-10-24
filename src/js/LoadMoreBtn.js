export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.buttonEl = document.querySelector(selector);
    hidden && this.hide();
  }

  getRefs() {
    return this.buttonEl;
  }

  enable() {
    this.buttonEl.disabled = false;
  }

  disable() {
    this.buttonEl.disabled = true;
  }

  show() {
    this.buttonEl.classList.remove('is-hidden');
  }

  hide() {
    this.buttonEl.classList.add('is-hidden');
  }
}
