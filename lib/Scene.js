'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = function () {
    function Scene(id, opts) {
        _classCallCheck(this, Scene);

        this.canvas = document.getElementById(id);
        this.$canvas = $(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.boxs = {};
        this.layers = [];
        this.reverseLayers = [];
        this.selected = null;
        this.elementContainer = this._initElementContainer();
        this.elements = {};

        // Options
        this.opts = opts || {};
        this.infinity = this.opts.infinity || false;
        this.scaleX = this.opts.scaleX || 1;
        this.scaleY = this.opts.scaleY || 1;
        this.ctx.scale(this.scaleX, this.scaleY);
        this.zoom = this.opts.zoom || 1;

        // Parameters associated with Infinite Canvas
        this.offsetX = 0;
        this.offsetY = 0;

        // Parameters associated with Mousedown
        this.mousedown = false;
        this.originX = -1;
        this.originY = -1;

        // Parameters associated with zoom
        this.doubleTap = false;
        this.tapDistance = -1;

        // Register Event
        if (this._isMobile()) {
            this.$canvas.on('touchstart', this._onTouchStart.bind(this));
            this.$canvas.on('touchmove', this._onTouchMove.bind(this));
            this.$canvas.on('touchend', this._onTouchEnd.bind(this));
            this.$canvas.on('touchcancel', this._onTouchCancel.bind(this));

            this.elementContainer.on('touchstart', '*', this._onContainerTouchStart.bind(this));
            this.elementContainer.on('touchmove', '*', this._onTouchMove.bind(this));
            this.elementContainer.on('touchend', '*', this._onContainerTouchEnd.bind(this));
            this.elementContainer.on('touchcancel', '*', this._onContainerTouchCancel.bind(this));
        } else {
            this.$canvas.on('mouseup', this._onMouseUp.bind(this));
            this.$canvas.on('mousedown', this._onMouseDown.bind(this));
            this.$canvas.on('mousemove', this._onMouseMove.bind(this));
            this.$canvas.on('mouseover', this._onMouseOver.bind(this));
            this.$canvas.on('mouseout', this._onMouseOut.bind(this));
            this.$canvas.on('mousewheel', this._onMouseWheel.bind(this));

            this.elementContainer.on('mouseup', '*', this._onContainerMouseUp.bind(this));
            this.elementContainer.on('mousedown', '*', this._onContainerMouseDown.bind(this));
            this.elementContainer.on('mousemove', '*', this._onMouseMove.bind(this));
            this.elementContainer.on('mouseover', '*', this._onContainerMouseOver.bind(this));
            this.elementContainer.on('mouseout', '*', this._onContainerMouseOut.bind(this));
            this.elementContainer.on('mousewheel', '*', this._onMouseWheel.bind(this));
        }
    }

    _createClass(Scene, [{
        key: '_isMobile',
        value: function _isMobile() {
            // return true;
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            );
        }
    }, {
        key: '_calcDistance',
        value: function _calcDistance(x0, y0, x1, y1) {
            var xdiff = x1 - x0;
            var ydiff = y1 - y0;
            return Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
        }
    }, {
        key: '_initElementContainer',
        value: function _initElementContainer() {
            var border_top_width = parseInt(this.$canvas.css('border-top-width'));
            var border_right_width = parseInt(this.$canvas.css('border-right-width'));
            var border_bottom_width = parseInt(this.$canvas.css('border-bottom-width'));
            var border_left_width = parseInt(this.$canvas.css('border-left-width'));
            var container = $('<div />');
            container.css({
                display: 'inline-block',
                overflow: 'hidden',
                width: this.$canvas.width() - border_left_width - border_right_width,
                height: this.$canvas.height() - border_top_width - border_bottom_width,
                position: 'absolute',
                left: this.canvas.offsetLeft + border_left_width,
                top: this.canvas.offsetTop + border_top_width,
                pointerEvents: 'none'
            });
            $('body').append(container);
            return container;
        }
    }, {
        key: '_addToLayer',
        value: function _addToLayer(box) {
            var layer = this.layers[box.z];
            if (layer == undefined) {
                layer = {};
                this.layers[box.z] = layer;
            }
            layer[box.handle] = box;
            this.reverseLayers = [];
            for (var i in this.layers) {
                this.reverseLayers.unshift(this.layers[i]);
            }
        }
    }, {
        key: '_addToDom',
        value: function _addToDom(box) {
            this.elements[box.handle] = box;
            box.element.attr('handle', box.handle);
            box.element.css('pointer-events', 'auto');
            box.element.css('display', 'inline-block');
            box.element.css('position', 'absolute');
            box.element.css('left', box.x);
            box.element.css('top', box.y);
            this.elementContainer.append(box.element);
        }
    }, {
        key: '_removeFromLayer',
        value: function _removeFromLayer(box) {
            var layer = this.layers[box.z];
            if (layer != undefined) {
                delete layer[box.handle];
            }
        }
    }, {
        key: '_removeFromDom',
        value: function _removeFromDom(box) {
            box.element.remove();
            delete this.elements[box.handle];
        }
    }, {
        key: '_zoomOffset',
        value: function _zoomOffset(originX, originY, x, y, zoomDelta) {
            var projX = x - originX;
            var projY = y - originY;
            projX *= zoomDelta;
            projY *= zoomDelta;
            var zoomX = projX + originX;
            var zoomY = projY + originY;
            return [zoomX - x, zoomY - y];
        }
    }, {
        key: '_adjustZoomOffset',
        value: function _adjustZoomOffset(originX, originY, zoomDelta) {
            _lodash2.default.forEach(this.boxs, function (box, handle) {
                var _zoomOffset2 = this._zoomOffset(originX, originY, box.x, box.y, zoomDelta),
                    _zoomOffset3 = _slicedToArray(_zoomOffset2, 2),
                    offsetX = _zoomOffset3[0],
                    offsetY = _zoomOffset3[1];

                box.x += offsetX;
                box.y += offsetY;
            }.bind(this));
        }
    }, {
        key: '_adjustTranslateOffset',
        value: function _adjustTranslateOffset(translateDeltaX, translateDeltaY) {
            _lodash2.default.forEach(this.boxs, function (box, handle) {
                box.x += translateDeltaX;
                box.y += translateDeltaY;
            }.bind(this));
        }
    }, {
        key: '_renderOne',
        value: function _renderOne(box) {
            var _ref = [box.x, box.y],
                x = _ref[0],
                y = _ref[1];

            if (box.isElement) {
                if (box.show_) {
                    box.element.css('display', 'inline-block');
                    box.element.css('left', x);
                    box.element.css('top', y);
                    box.element.css('z-index', box.z);
                    box.element.css('transform', 'scale(' + this.zoom + ', ' + this.zoom + ')');
                    box.element.css('transform-origin', 'left top');
                } else {
                    box.element.css('display', 'none');
                }
            } else if (box.show_) {
                var ctx = new _Context2.default(this.ctx, x, y, this.zoom);
                box.render(ctx);
                box.paths = ctx._getPaths();
            }
        }
    }, {
        key: '_onSelected',
        value: function _onSelected(x, y) {
            x = x * this.scaleX;
            y = y * this.scaleY;
            var selected = null;
            for (var i in this.reverseLayers) {
                var layer = this.reverseLayers[i];
                for (var handle in layer) {
                    var box = layer[handle];
                    if (box._include(x, y)) {
                        selected = box;
                        break;
                    }
                }
                if (selected != undefined) {
                    break;
                }
            }
            return selected;
        }

        // Methods associated with Mousedown

    }, {
        key: '_MouseDown',
        value: function _MouseDown(x, y) {
            this.mousedown = true;
            this.originX = x;
            this.originY = y;
        }
    }, {
        key: '_MouseUp',
        value: function _MouseUp() {
            this.mousedown = false;
            this.originX = -1;
            this.originY = -1;
        }

        // Canvas Events

    }, {
        key: '_onMouseUp',
        value: function _onMouseUp(e) {
            e.preventDefault();
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this._MouseUp();
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                selected.onMouseUp(e, x, y);
            }
            this.onMouseUp(e, x, y, selected);
        }
    }, {
        key: '_onMouseDown',
        value: function _onMouseDown(e) {
            e.preventDefault();
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this._MouseDown(x, y);
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                selected.onMouseDown(e, x, y);
            }
            this.onMouseDown(e, x, y, selected);
        }
    }, {
        key: '_onMouseMove',
        value: function _onMouseMove(e) {
            e.preventDefault();
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this.onMouseMove(e, x, y);
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                if (this.selected == undefined || this.selected.handle != selected.handle) {
                    this.selected = selected;
                    this.onTouch(e, x, y, selected);
                    selected.onMouseOver(e, x, y);
                }
            } else {
                if (this.selected != undefined) {
                    var originalSelected = this.selected;
                    this.selected = selected;
                    this.onTouch(e, x, y, selected);
                    originalSelected.onMouseOut(e, x, y);
                }
                if (this.infinity && this.mousedown) {
                    var translateDeltaX = x - this.originX;
                    var translateDeltaY = y - this.originY;
                    this.offsetX += translateDeltaX;
                    this.offsetY += translateDeltaY;
                    this.originX = x;
                    this.originY = y;
                    this._adjustTranslateOffset(translateDeltaX, translateDeltaY);
                    this.render();
                }
            }
        }
    }, {
        key: '_onMouseOver',
        value: function _onMouseOver(e) {
            e.preventDefault();
            var from = $(e.fromElement);
            if (from.attr('handle') in this.elements) {
                return;
            }
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this.onMouseOver(e, x, y);
        }
    }, {
        key: '_onMouseOut',
        value: function _onMouseOut(e) {
            e.preventDefault();
            var to = $(e.toElement);
            if (to.attr('handle') in this.elements) {
                return;
            }
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this._MouseUp();
            this.onMouseOut(e, x, y);
        }
    }, {
        key: '_onMouseWheel',
        value: function _onMouseWheel(e) {
            e.preventDefault();
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            var zoomDelta = 1 + e.wheelDelta / 120 / 20;
            this.zoom *= zoomDelta;
            this._adjustZoomOffset(x, y, zoomDelta);
            this.render();
        }

        // Canvas Touch Events

    }, {
        key: '_onTouchStart',
        value: function _onTouchStart(e) {
            e.preventDefault();
            if (e.touches.length === 2) {
                this.doubleTap = true;
                this.tapDistance = this._calcDistance(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
            }
            var x = e.touches[0].pageX - this.canvas.offsetLeft;
            var y = e.touches[0].pageY - this.canvas.offsetTop;
            this._MouseDown(x, y);
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                selected.onTouchStart(e, x, y);
            }
            this.onTouchStart(e, x, y, selected);
        }
    }, {
        key: '_onTouchMove',
        value: function _onTouchMove(e) {
            e.preventDefault();
            if (e.touches.length === 2 && this.doubleTap) {
                var tapDistance = this._calcDistance(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
                var tapCenterX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
                var tapCenterY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
                var diff = this.tapDistance - tapDistance;
                var zoomDelta = 1 - diff / this.canvas.width * 2;
                this.zoom *= zoomDelta;
                this._adjustZoomOffset(tapCenterX, tapCenterY, zoomDelta);
                this.render();
                this.tapDistance = tapDistance;
            }
            var x = e.touches[0].pageX - this.canvas.offsetLeft;
            var y = e.touches[0].pageY - this.canvas.offsetTop;
            this.onTouchMove(e, x, y);
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                if (this.selected == undefined || this.selected.handle != selected.handle) {
                    this.selected = selected;
                    this.onTouch(e, x, y, selected);
                    selected.onTouchEnter(e, x, y);
                }
            } else {
                if (this.selected != undefined) {
                    var originalSelected = this.selected;
                    this.selected = selected;
                    this.onTouch(e, x, y, selected);
                    originalSelected.onTouchLeave(e, x, y);
                }
                if (this.infinity && this.mousedown && e.touches.length === 1) {
                    var translateDeltaX = x - this.originX;
                    var translateDeltaY = y - this.originY;
                    this.offsetX += translateDeltaX;
                    this.offsetY += translateDeltaY;
                    this.originX = x;
                    this.originY = y;
                    this._adjustTranslateOffset(translateDeltaX, translateDeltaY);
                    this.render();
                }
            }
        }
    }, {
        key: '_onTouchEnd',
        value: function _onTouchEnd(e) {
            e.preventDefault();
            if (e.touches.length !== 2) {
                this.doubleTap = false;
                this.tapDistance = -1;
            }
            var x = e.changedTouches[0].pageX - this.canvas.offsetLeft;
            var y = e.changedTouches[0].pageY - this.canvas.offsetTop;
            this._MouseUp();
            var selected = this._onSelected(x, y);
            if (selected != undefined) {
                selected.onTouchEnd(e, x, y);
            }
            this.onTouchEnd(e, x, y, selected);
        }
    }, {
        key: '_onTouchCancel',
        value: function _onTouchCancel(e) {
            this._onTouchEnd(e);
        }

        // Elements Container Touch Events

    }, {
        key: '_onContainerTouchStart',
        value: function _onContainerTouchStart(e) {
            e.preventDefault();
            if (e.touches.length === 2) {
                this.doubleTap = true;
                this.tapDistance = this._calcDistance(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
            }
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.touches[0].pageX - this.canvas.offsetLeft;
                    var y = e.touches[0].pageY - this.canvas.offsetTop;
                    this.onTouchStart(e, x, y, box);
                    box.onTouchStart(e, x, y);
                }
            }
        }
    }, {
        key: '_onContainerTouchEnd',
        value: function _onContainerTouchEnd(e) {
            e.preventDefault();
            if (e.touches.length !== 2) {
                this.doubleTap = false;
                this.tapDistance = -1;
            }
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.changedTouches[0].pageX - this.canvas.offsetLeft;
                    var y = e.changedTouches[0].pageY - this.canvas.offsetTop;
                    this.onTouchEnd(e, x, y, box);
                    box.onTouchEnd(e, x, y);
                }
            }
        }
    }, {
        key: '_onContainerTouchCancel',
        value: function _onContainerTouchCancel(e) {
            this._onContainerTouchEnd(e);
        }

        // Elements Container Events

    }, {
        key: '_onContainerMouseUp',
        value: function _onContainerMouseUp(e) {
            // http://stackoverflow.com/questions/13236484/mouseup-not-working-after-mousemove-on-img
            e.preventDefault();
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.pageX - this.canvas.offsetLeft;
                    var y = e.pageY - this.canvas.offsetTop;
                    this.onMouseUp(e, x, y, box);
                    box.onMouseUp(e, x, y);
                }
            }
        }
    }, {
        key: '_onContainerMouseDown',
        value: function _onContainerMouseDown(e) {
            e.preventDefault();
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.pageX - this.canvas.offsetLeft;
                    var y = e.pageY - this.canvas.offsetTop;
                    this.onMouseDown(e, x, y, box);
                    box.onMouseDown(e, x, y);
                }
            }
        }
    }, {
        key: '_onContainerMouseOver',
        value: function _onContainerMouseOver(e) {
            e.preventDefault();
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.pageX - this.canvas.offsetLeft;
                    var y = e.pageY - this.canvas.offsetTop;
                    this.onTouch(e, x, y, box);
                    box.onMouseOver(e, x, y);
                    if (x > 0 && x < this.canvas.width && y > 0 && y < this.canvas.height) {
                        this.onMouseOver(e, x, y);
                    }
                }
            }
        }
    }, {
        key: '_onContainerMouseOut',
        value: function _onContainerMouseOut(e) {
            e.preventDefault();
            var element = $(e.target);
            if (element.attr('handle') != undefined) {
                var box = this.elements[element.attr('handle')];
                if (box != undefined) {
                    var x = e.pageX - this.canvas.offsetLeft;
                    var y = e.pageY - this.canvas.offsetTop;
                    this.onTouch(e, x, y, null);
                    box.onMouseOut(e, x, y);
                    if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
                        this._MouseUp();
                        this.onMouseOut(e, x, y);
                    }
                }
            }
        }

        // Public Methods

    }, {
        key: 'addBox',
        value: function addBox(box, x, y, z) {
            var handle = box.handle = _nodeUuid2.default.v1();
            this.boxs[handle] = box;
            box.setPosition(x, y, z);
            if (box.isElement) {
                this._addToDom(box);
            } else {
                this._addToLayer(box);
            }
            this.render();
            box.scene = this;
            box.mount = true;
            return handle;
        }
    }, {
        key: 'removeBox',
        value: function removeBox(handle) {
            var box = this.boxs[handle];
            if (box != undefined) {
                if (box.isElement) {
                    this._removeFromDom(box);
                } else {
                    this._removeFromLayer(box);
                    this.render();
                }
                delete this.boxs[handle];
                box._removePosition();
                box.scene = null;
                box.mount = false;
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            this.clear();
            for (var i in this.layers) {
                var layer = this.layers[i];
                _lodash2.default.forEach(layer, function (box, handle) {
                    this._renderOne(box);
                }.bind(this));
            }
            _lodash2.default.forEach(this.elements, function (element) {
                this._renderOne(element);
            }.bind(this));
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }, {
        key: 'close',
        value: function close() {
            _lodash2.default.forEach(this.boxs, function (box, handle) {
                this.removeBox(handle);
            }.bind(this));
            this.clear();
        }

        // events

    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e, x, y, box) {
            // override it
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e, x, y, box) {
            // override it
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e, x, y) {
            // override it
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver(e, x, y) {
            // override it
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(e, x, y) {
            // override it
        }
    }, {
        key: 'onTouch',
        value: function onTouch(e, x, y, box) {}
        // override it


        // touch events

    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e, x, y, box) {
            // override it
        }
    }, {
        key: 'onTouchMove',
        value: function onTouchMove(e, x, y) {
            // override it
        }
    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd(e, x, y, box) {
            // override it
        }
    }]);

    return Scene;
}();

exports.default = Scene;
//# sourceMappingURL=Scene.js.map