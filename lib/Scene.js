'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
        this.ctx = this.canvas.getContext('2d');
        this.layers = [];
        this.reverseLayers = [];
        this.selected = null;
        this.elementContainer = this._initElementContainer();
        this.elements = {};

        // Options
        this.opts = opts || {};
        this.infinity = this.opts.infinity || false;

        // Parameters associated with Infinite Canvas
        this.offsetX = 0;
        this.offsetY = 0;

        // Parameters associated with Mousedown
        this.mousedown = false;
        this.originX = -1;
        this.originY = -1;

        // Register Event
        this.canvas.onmouseup = this._onMouseUp.bind(this);
        this.canvas.onmousedown = this._onMouseDown.bind(this);
        this.canvas.onmousemove = this._onMouseMove.bind(this);
        this.canvas.onmouseover = this._onMouseOver.bind(this);
        this.canvas.onmouseout = this._onMouseOut.bind(this);

        this.elementContainer.on('mouseup', '*', this._onContainerMouseUp.bind(this));
        this.elementContainer.on('mousedown', '*', this._onContainerMouseDown.bind(this));
        this.elementContainer.on('mousemove', '*', this._onMouseMove.bind(this));
        this.elementContainer.on('mouseover', '*', this._onContainerMouseOver.bind(this));
        this.elementContainer.on('mouseout', '*', this._onContainerMouseOut.bind(this));
    }

    _createClass(Scene, [{
        key: '_initElementContainer',
        value: function _initElementContainer() {
            var canvas = $(this.canvas);
            var border_top_width = parseInt(canvas.css('border-top-width'));
            var border_right_width = parseInt(canvas.css('border-right-width'));
            var border_bottom_width = parseInt(canvas.css('border-bottom-width'));
            var border_left_width = parseInt(canvas.css('border-left-width'));
            var container = $('<div />');
            container.css({
                display: 'inline-block',
                overflow: 'hidden',
                width: canvas.width() - border_left_width - border_right_width,
                height: canvas.height() - border_top_width - border_bottom_width,
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
            box.element.css('position', 'relative');
            box.element.css('left', box.x);
            box.element.css('top', box.y);
            this.elementContainer.append(box.element);
        }
    }, {
        key: '_renderOne',
        value: function _renderOne(box) {
            if (box.isElement) {
                box.element.css('left', box.x + this.offsetX);
                box.element.css('top', box.y + this.offsetY);
            } else {
                var ctx = new _Context2.default(this.ctx, box.x + this.offsetX, box.y + this.offsetY);
                box.render(ctx);
                box.paths = ctx._getPaths();
            }
        }
    }, {
        key: '_onSelected',
        value: function _onSelected(x, y) {
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
                    this.offsetX += x - this.originX;
                    this.offsetY += y - this.originY;
                    this.originX = x;
                    this.originY = y;
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
            box.setPosition(x, y);
            box.z = z || 0;
            if (box.isElement) {
                this._addToDom(box);
            } else {
                this._addToLayer(box);
                this.render();
            }
            box.scene = this;
            box.mount = true;
            return handle;
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
        value: function onTouch(e, x, y, box) {
            // override it
        }
    }]);

    return Scene;
}();

exports.default = Scene;
//# sourceMappingURL=Scene.js.map