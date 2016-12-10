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
    function Scene(id) {
        _classCallCheck(this, Scene);

        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.layers = [];
        this.reverseLayers = [];

        this.canvas.onmouseup = this._onMouseUp.bind(this);
        this.canvas.onmousedown = this._onMouseDown.bind(this);
        this.canvas.onmousemove = this._onMouseMove.bind(this);

        this.canvas.onmouseover = this._onMouseOver.bind(this);
        this.canvas.onmouseout = this._onMouseOut.bind(this);
    }

    _createClass(Scene, [{
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
        key: '_renderOne',
        value: function _renderOne(box) {
            var ctx = new _Context2.default(this.ctx, box.x, box.y);
            box.render(ctx);
        }
    }, {
        key: '_onSelected',
        value: function _onSelected(e) {
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            var selected = null;
            for (var i in this.reverseLayers) {
                var layer = this.reverseLayers[i];
                for (var handle in layer) {
                    var box = layer[handle];
                    if (this.ctx.isPointInPath(box.path, x, y)) {
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
    }, {
        key: '_onMouseUp',
        value: function _onMouseUp(e) {
            var selected = this._onSelected(e);
            this.onMouseUp(e, selected);
        }
    }, {
        key: '_onMouseDown',
        value: function _onMouseDown(e) {
            var selected = this._onSelected(e);
            this.onMouseDown(e, selected);
        }
    }, {
        key: '_onMouseMove',
        value: function _onMouseMove(e) {
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this.onMouseMove(e, x, y);
        }
    }, {
        key: '_onMouseOver',
        value: function _onMouseOver(e) {
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this.onMouseOver(e, x, y);
        }
    }, {
        key: '_onMouseOut',
        value: function _onMouseOut(e) {
            var x = e.pageX - this.canvas.offsetLeft;
            var y = e.pageY - this.canvas.offsetTop;
            this.onMouseOut(e, x, y);
        }
    }, {
        key: 'addBox',
        value: function addBox(box, x, y, z) {
            var handle = box.handle = _nodeUuid2.default.v1();
            box.setPosition(x, y);
            box.z = z || 0;
            box.mount = true;
            this._addToLayer(box);
            this.render();
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
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // events

    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e, box) {
            // override it
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e, box) {
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
    }]);

    return Scene;
}();

exports.default = Scene;
//# sourceMappingURL=Scene.js.map