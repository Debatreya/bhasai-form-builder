"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseMoveDriver = void 0;
var shared_1 = require("@samagrax/shared");
var events_1 = require("../events");
var MouseMoveDriver = /** @class */ (function (_super) {
    __extends(MouseMoveDriver, _super);
    function MouseMoveDriver() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this.request = null;
        _this.onMouseMove = function (e) {
            _this.request = requestAnimationFrame(function () {
                cancelAnimationFrame(_this.request);
                _this.dispatch(new events_1.MouseMoveEvent({
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    target: e.target,
                    view: e.view,
                }));
            });
        };
        return _this;
    }
    MouseMoveDriver.prototype.attach = function () {
        this.addEventListener('mousemove', this.onMouseMove, {
            mode: 'onlyOne',
        });
    };
    MouseMoveDriver.prototype.detach = function () {
        this.removeEventListener('mouseover', this.onMouseMove, {
            mode: 'onlyOne',
        });
    };
    return MouseMoveDriver;
}(shared_1.EventDriver));
exports.MouseMoveDriver = MouseMoveDriver;
