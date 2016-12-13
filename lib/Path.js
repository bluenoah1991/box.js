"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = function () {
    function Path(ctx) {
        _classCallCheck(this, Path);

        this.ctx = ctx;
        this.x = ctx.x;
        this.y = ctx.y;
        this.nativePath = new Path2D();
    }

    _createClass(Path, [{
        key: "addPath",
        value: function addPath(path, transform) {
            this.nativePath.addPath(path.nativePath, transform);
        }
    }, {
        key: "closePath",
        value: function closePath() {
            this.nativePath.closePath();
        }
    }, {
        key: "moveTo",
        value: function moveTo(x, y) {
            this.nativePath.moveTo(this.x + x, this.y + y);
        }
    }, {
        key: "lineTo",
        value: function lineTo(x, y) {
            this.nativePath.lineTo(this.x + x, this.y + y);
        }
    }, {
        key: "bezierCurveTo",
        value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            this.nativePath.bezierCurveTo(this.x + cp1x, this.y + cp1y, this.x + cp2x, this.y + cp2y, this.x + x, this.y + y);
        }
    }, {
        key: "quadraticCurveTo",
        value: function quadraticCurveTo(cpx, cpy, x, y) {
            this.nativePath.quadraticCurveTo(this.x + cpx, this.y + cpy, this.x + x, this.y + y);
        }
    }, {
        key: "arc",
        value: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
            this.nativePath.arc(this.x + x, this.y + y, radius, startAngle, endAngle, anticlockwise);
        }
    }, {
        key: "arcTo",
        value: function arcTo(x1, y1, x2, y2, radius) {
            this.nativePath.arcTo(this.x + x1, this.y + y1, this.x + x2, this.y + y2, radius);
        }
    }, {
        key: "ellipse",
        value: function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
            this.nativePath.ellipse(this.x + x, this.y + y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        }
    }, {
        key: "rect",
        value: function rect(x, y, width, height) {
            this.nativePath.rect(this.x + x, this.y + y, width, height);
        }
    }]);

    return Path;
}();

exports.default = Path;
//# sourceMappingURL=Path.js.map