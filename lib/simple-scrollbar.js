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
        return _this2.context.element.scrollTop += delta / _this2.context.scrollRatio;
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

    this.handleMoveBar = function (event) {
      var totalHeight = _this3.element.scrollHeight;
      var ownHeight = _this3.element.clientHeight;
      var _this = _this3;
      _this3.scrollRatio = ownHeight / totalHeight;
      raf(function () {
        if (_this.scrollRatio == 1) {
          _this.bar.classList.add('ss-hidden');
        } else {
          _this.bar.classList.remove('ss-hidden');

          _this.bar.style.cssText = 'height:' + _this.scrollRatio * 100 + '%; top:' + _this.element.scrollTop / totalHeight * 100 + '%; right:-' + (_this.target.clientWidth - _this.bar.clientWidth) + 'px;';
        }
      });
    };

    this.target = element;
    this.bar = '<div class="ss-scroll">';
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'ss-content');
    this.wrapper.appendChild(this.element);

    while (this.target.firstChild) {
      this.element.appendChild(this.target.firstChild);
    }

    this.target.appendChild(this.wrapper);
    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;
    new DragDealer(this.bar, this);
    this.handleMoveBar();
    this.element.addEventListener('scroll', this.handleMoveBar);
    this.element.addEventListener('mouseenter', this.handleMoveBar);
    this.target.classList.add('ss-container');
  };

  var SimpleScrollbar = function () {
    function SimpleScrollbar() {
      _classCallCheck(this, SimpleScrollbar);

      this.initAll();
    }

    _createClass(SimpleScrollbar, [{
      key: 'initElement',
      value: function initElement(element) {
        if (element.hasOwnProperty('data-simple-scrollbar')) {
          return false;
        }

        Object.defineProperty(element, 'data-simple-scrollbar', new Scrollbar(element));
      }
    }, {
      key: 'initAll',
      value: function initAll() {
        var nodes = document.querySelectorAll('*[ss-container]');

        for (var i = 0; i < nodes.length; i++) {
          console.debug('init node', i);
          this.initElement(nodes[i]);
        }
      }
    }]);

    return SimpleScrollbar;
  }();

  exports.default = SimpleScrollbar;
});
//# sourceMappingURL=simple-scrollbar.js.map