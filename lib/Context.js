"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
    function Context(ctx, x, y) {
        _classCallCheck(this, Context);

        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }

    _createClass(Context, [{
        key: "getFillStyle",
        value: function getFillStyle() {
            return this.ctx.fillStyle;
        }
    }, {
        key: "setFillStyle",
        value: function setFillStyle(val) {
            this.ctx.fillStyle = val;
        }
    }, {
        key: "fillRect",
        value: function fillRect(x, y, width, height) {
            this.ctx.fillRect(this.x + x, this.y + y, width, height);
        }
    }]);

    return Context;
}();

exports.default = Context;
//# sourceMappingURL=Context.js.map