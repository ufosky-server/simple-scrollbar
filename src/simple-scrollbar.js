const rafFallback = (callback) => setTimeout(callback, 0);
const raf = window.requestAnimationFrame || window.setImmediate || rafFallback;

class DragDealer {
  constructor(element, context) {
    this.element = element;
    this.context = context;
    this.lastPageY = 0;

    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
  }

  handleMouseDown = (event) => {
    this.lastPageY = event.pageY;
    this.element.classList.add('ss-grabbed');
    document.body.classList.add('ss-grabbed');

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleStop);

    return false;
  };

  handleDrag = (event) => {
    const delta = event.pageY - this.lastPageY;
    this.lastPageY = event.pageY;

    raf(() => this.context.area.scrollTop += delta / this.context.scrollRatio);
  };

  handleStop = () =>{
    this.element.classList.remove('ss-grabbed');
    document.body.classList.remove('ss-grabbed');

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleStop);
  };
}

class Scrollbar {
  constructor(element) {
    this.target = element;
    this.bar = '<div class="ss-scroll">';

    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');

    this.area = document.createElement('div');
    this.area.setAttribute('class', 'ss-scrollarea');

    this.element = document.createElement('div');
    this.element.setAttribute('class', 'ss-content');

    this.area.appendChild(this.element);
    this.wrapper.appendChild(this.area);

    while (this.target.firstChild) {
      this.element.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    new DragDealer(this.bar, this);
    this.handleMoveBar();

    this.area.addEventListener('scroll', this.handleMoveBar);
    this.area.addEventListener('mouseenter', this.handleMoveBar);

    this.target.classList.add('ss-container');
    this.element.style.cssText=`width:${this.wrapper.offsetWidth}px`;
  }

  scrollTo = (top) => this.area.scrollTop = top;

  handleMoveBar = (event) => {
    let totalHeight = this.area.scrollHeight;
    let ownHeight = this.area.clientHeight;
    let _this = this;

    this.scrollRatio = ownHeight / totalHeight;

    raf(() => {
      // Hide scrollbar if no scrolling is possible
      if (_this.scrollRatio === 1) {
        _this.bar.classList.add('ss-hidden');
      } else {
        _this.bar.classList.remove('ss-hidden');
        _this.bar.style.cssText = `height:${_this.scrollRatio * 100}%; top:${(_this.area.scrollTop / totalHeight) * 100}%;`;
      }
    });
  };
}

class SimpleScrollbar {
  constructor() {
    this.scrolls = [];
    this.initAll();
  }

  initElement(element) {
    if (element.hasOwnProperty('data-simple-scrollbar')) {
      return false;
    }

    this.scrolls[element] = new Scrollbar(element);
    Object.defineProperty(element, 'data-simple-scrollbar', this.scrolls[element]);
  }

  scrollTo = (target, to) => this.scrolls[target].scrollTo(to);

  initAll() {
    const nodes = document.querySelectorAll('*[ss-container]');

    for (var i = 0; i < nodes.length; i++) {
      this.initElement(nodes[i]);
    }
  }
}

export default SimpleScrollbar;
