(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.simpleScrollbar = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var rafFallback = function rafFallback(callback) {
    return setTimeout(callback, 0);
  };
  var raf = window.requestAnimationFrame || window.setImmediate || rafFallback;

  var DragDealer = function DragDealer(element, context) {
    var _this2 = this;

    _classCallCheck(this, DragDealer);

    this.handleMouseDown = function (event) {
      _this2.lastPageY = event.pageY;
      _this2.element.classList.add('ss-grabbed');
      document.body.classList.add('ss-grabbed');

      document.addEventListener('mousemove', _this2.handleDrag);
      document.addEventListener('mouseup', _this2.handleStop);

      return false;
    };

    this.handleDrag = function (event) {
      var delta = event.pageY - _this2.lastPageY;
      _this2.lastPageY = event.pageY;

      raf(function () {
        return _this2.context.area.scrollTop += delta / _this2.context.scrollRatio;
      });
    };

    this.handleStop = function () {
      _this2.element.classList.remove('ss-grabbed');
      document.body.classList.remove('ss-grabbed');

      document.removeEventListener('mousemove', _this2.handleDrag);
      document.removeEventListener('mouseup', _this2.handleStop);
    };

    this.element = element;
    this.context = context;
    this.lastPageY = 0;

    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
  };

  var Scrollbar = function Scrollbar(element) {
    var _this3 = this;

    _classCallCheck(this, Scrollbar);

    this.scrollTo = function (top) {
      return _this3.area.scrollTop = top;
    };

    this.handleMoveBar = function (event) {
      var totalHeight = _this3.area.scrollHeight;
      var ownHeight = _this3.area.clientHeight;
      var _this = _this3;

      _this3.scrollRatio = ownHeight / totalHeight;

      raf(function () {
        // Hide scrollbar if no scrolling is possible
        if (_this.scrollRatio === 1) {
          _this.bar.classList.add('ss-hidden');
        } else {
          _this.bar.classList.remove('ss-hidden');
          _this.bar.style.cssText = 'height:' + _this.scrollRatio * 100 + '%; top:' + _this.area.scrollTop / totalHeight * 100 + '%;';
        }
      });
    };

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
    this.element.style.cssText = 'width:' + this.wrapper.offsetWidth + 'px';
  };

  var SimpleScrollbar = function () {
    function SimpleScrollbar() {
      var _this4 = this;

      _classCallCheck(this, SimpleScrollbar);

      this.scrollTo = function (target, to) {
        return _this4.scrolls[target].scrollTo(to);
      };

      this.scrolls = [];
      this.initAll();
    }

    _createClass(SimpleScrollbar, [{
      key: 'initElement',
      value: function initElement(element) {
        if (element.hasOwnProperty('data-simple-scrollbar')) {
          return false;
        }

        this.scrolls[element] = new Scrollbar(element);
        Object.defineProperty(element, 'data-simple-scrollbar', this.scrolls[element]);
      }
    }, {
      key: 'initAll',
      value: function initAll() {
        var nodes = document.querySelectorAll('*[ss-container]');

        for (var i = 0; i < nodes.length; i++) {
          this.initElement(nodes[i]);
        }
      }
    }]);

    return SimpleScrollbar;
  }();

  exports.default = SimpleScrollbar;
});
//# sourceMappingURL=simple-scrollbar.js.map