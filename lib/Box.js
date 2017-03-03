'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = function () {
    function Box(renderOrElement) {
        _classCallCheck(this, Box);

        if (typeof renderOrElement == 'function') {
            this.isElement = false;
            this.render = renderOrElement;
        } else {
            this.isElement = true;
            this.element = renderOrElement;
        }
        this.mount = false;
        this.scene = null;
        this.paths = [];
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.show_ = true;
    }

    _createClass(Box, [{
        key: '_include',
        value: function _include(x, y) {
            if (!this.show_) {
                return false;
            }
            if (this.mount) {
                for (var i in this.paths) {
                    var _paths$i = _slicedToArray(this.paths[i], 2),
                        include = _paths$i[0],
                        path = _paths$i[1];

                    if (this.scene.ctx.isPointInPath(path, x, y)) {
                        return include;
                    }
                }
            } else {
                return false;
            }
        }
    }, {
        key: '_removePosition',
        value: function _removePosition() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
    }, {
        key: 'setPosition',
        value: function setPosition(x, y) {
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.x = x;
            this.y = y;
            this.z = z;
            if (this.mount) {
                var _scene$_reverseOffset = this.scene._reverseOffset(x, y);

                var _scene$_reverseOffset2 = _slicedToArray(_scene$_reverseOffset, 2);

                this.offsetX = _scene$_reverseOffset2[0];
                this.offsetY = _scene$_reverseOffset2[1];
            }
        }
    }, {
        key: 'setAbsPosition',
        value: function setAbsPosition(realX, realY) {
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            if (this.mount) {
                var _scene$_reversePos = this.scene._reversePos(realX, realY);

                var _scene$_reversePos2 = _slicedToArray(_scene$_reversePos, 2);

                this.x = _scene$_reversePos2[0];
                this.y = _scene$_reversePos2[1];
                var _ref = [realX - this.x, realY - this.y];
                this.offsetX = _ref[0];
                this.offsetY = _ref[1];
            } else {
                this.x = x;
                this.y = y;
            }
            this.z = z;
        }
    }, {
        key: 'absX',
        value: function absX() {
            return this.x + this.offsetX;
        }
    }, {
        key: 'absY',
        value: function absY() {
            return this.y + this.offsetY;
        }
    }, {
        key: 'show',
        value: function show() {
            this.show_ = true;
            if (this.mount) {
                this.scene.render();
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.show_ = false;
            if (this.mount) {
                this.scene.render();
            }
        }

        // if isElement = true

    }, {
        key: 'elementWidth',
        value: function elementWidth() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return this.element[0].getBoundingClientRect().width / this.scene.zoom;
            } else {
                return -1;
            }
        }
    }, {
        key: 'elementHeight',
        value: function elementHeight() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return this.element[0].getBoundingClientRect().height / this.scene.zoom;
            } else {
                return -1;
            }
        }
    }, {
        key: 'elementMarginTop',
        value: function elementMarginTop() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return parseInt(this.element.css('margin-top')) / this.scene.zoom;
            } else {
                return -1;
            }
        }
    }, {
        key: 'elementMarginRight',
        value: function elementMarginRight() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return parseInt(this.element.css('margin-right')) / this.scene.zoom;
            } else {
                return -1;
            }
        }
    }, {
        key: 'elementMarginBottom',
        value: function elementMarginBottom() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return parseInt(this.element.css('margin-bottom')) / this.scene.zoom;
            } else {
                return -1;
            }
        }
    }, {
        key: 'elementMarginLeft',
        value: function elementMarginLeft() {
            if (this.isElement) {
                var zoom = 1;
                if (this.mount) {
                    zoom = this.scene.zoom;
                }
                return parseInt(this.element.css('margin-left')) / this.scene.zoom;
            } else {
                return -1;
            }
        }

        // events

    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e, x, y) {
            // override it
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e, x, y) {
            // override it
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver(e, x, y) {
            // override it
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(e, x, y) {}
        // override it


        // touch events

    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e, x, y) {
            // override it
        }
    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd(e, x, y) {
            // override it
        }
    }, {
        key: 'onTouchEnter',
        value: function onTouchEnter(e, x, y) {
            // override it
        }
    }, {
        key: 'onTouchLeave',
        value: function onTouchLeave(e, x, y) {
            // override it
        }
    }]);

    return Box;
}();

exports.default = Box;
//# sourceMappingURL=Box.js.map