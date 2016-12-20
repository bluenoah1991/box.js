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

var Path = function () {
    function Path(ctx) {
        _classCallCheck(this, Path);

        this.ctx = ctx;
        this.x = ctx.x;
        this.y = ctx.y;
        this.zoom = ctx.zoom;
        this.nativePath = new Path2D();
    }

    _createClass(Path, [{
        key: '_zoom',
        value: function _zoom() {
            return _lodash2.default.map(arguments, function (val) {
                return val * this.zoom;
            }.bind(this));
        }
    }, {
        key: 'addPath',
        value: function addPath(path, transform) {
            this.nativePath.addPath(path.nativePath, transform);
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            this.nativePath.closePath();
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var _zoom2 = this._zoom(x, y);

            var _zoom3 = _slicedToArray(_zoom2, 2);

            x = _zoom3[0];
            y = _zoom3[1];

            this.nativePath.moveTo(this.x + x, this.y + y);
        }
    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            var _zoom4 = this._zoom(x, y);

            var _zoom5 = _slicedToArray(_zoom4, 2);

            x = _zoom5[0];
            y = _zoom5[1];

            this.nativePath.lineTo(this.x + x, this.y + y);
        }
    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            var _zoom6 = this._zoom(cp1x, cp1y, cp2x, cp2y, x, y);

            var _zoom7 = _slicedToArray(_zoom6, 6);

            cp1x = _zoom7[0];
            cp1y = _zoom7[1];
            cp2x = _zoom7[2];
            cp2y = _zoom7[3];
            x = _zoom7[4];
            y = _zoom7[5];

            this.nativePath.bezierCurveTo(this.x + cp1x, this.y + cp1y, this.x + cp2x, this.y + cp2y, this.x + x, this.y + y);
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo(cpx, cpy, x, y) {
            var _zoom8 = this._zoom(cpx, cpy, x, y);

            var _zoom9 = _slicedToArray(_zoom8, 4);

            cpx = _zoom9[0];
            cpy = _zoom9[1];
            x = _zoom9[2];
            y = _zoom9[3];

            this.nativePath.quadraticCurveTo(this.x + cpx, this.y + cpy, this.x + x, this.y + y);
        }
    }, {
        key: 'arc',
        value: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
            var _zoom10 = this._zoom(x, y, radius);

            var _zoom11 = _slicedToArray(_zoom10, 3);

            x = _zoom11[0];
            y = _zoom11[1];
            radius = _zoom11[2];

            this.nativePath.arc(this.x + x, this.y + y, radius, startAngle, endAngle, anticlockwise);
        }
    }, {
        key: 'arcTo',
        value: function arcTo(x1, y1, x2, y2, radius) {
            var _zoom12 = this._zoom(x1, y1, x2, y2, radius);

            var _zoom13 = _slicedToArray(_zoom12, 5);

            x1 = _zoom13[0];
            y1 = _zoom13[1];
            x2 = _zoom13[2];
            y2 = _zoom13[3];
            radius = _zoom13[4];

            this.nativePath.arcTo(this.x + x1, this.y + y1, this.x + x2, this.y + y2, radius);
        }
    }, {
        key: 'ellipse',
        value: function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
            var _zoom14 = this._zoom(x, y, radiusX, radiusY);

            var _zoom15 = _slicedToArray(_zoom14, 4);

            x = _zoom15[0];
            y = _zoom15[1];
            radiusX = _zoom15[2];
            radiusY = _zoom15[3];

            this.nativePath.ellipse(this.x + x, this.y + y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        }
    }, {
        key: 'rect',
        value: function rect(x, y, width, height) {
            var _zoom16 = this._zoom(x, y, width, height);

            var _zoom17 = _slicedToArray(_zoom16, 4);

            x = _zoom17[0];
            y = _zoom17[1];
            width = _zoom17[2];
            height = _zoom17[3];

            this.nativePath.rect(this.x + x, this.y + y, width, height);
        }
    }]);

    return Path;
}();

exports.default = Path;
//# sourceMappingURL=Path.js.map