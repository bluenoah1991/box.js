"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = function () {
    function Box(render) {
        _classCallCheck(this, Box);

        this.render = render;
        this.mount = false;
        this.scene = null;
        this.paths = [];
    }

    _createClass(Box, [{
        key: "_include",
        value: function _include(x, y) {
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
        key: "setPosition",
        value: function setPosition(x, y) {
            this.x = x;
            this.y = y;
        }
    }]);

    return Box;
}();

exports.default = Box;
//# sourceMappingURL=Box.js.map