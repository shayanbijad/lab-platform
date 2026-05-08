"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResultDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateResultDto = function () {
    var _a;
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _remarks_decorators;
    var _remarks_initializers = [];
    var _remarks_extraInitializers = [];
    var _reviewed_decorators;
    var _reviewed_initializers = [];
    var _reviewed_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateResultDto() {
                this.value = __runInitializers(this, _value_initializers, void 0);
                this.remarks = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _remarks_initializers, void 0));
                this.reviewed = (__runInitializers(this, _remarks_extraInitializers), __runInitializers(this, _reviewed_initializers, void 0));
                __runInitializers(this, _reviewed_extraInitializers);
            }
            return UpdateResultDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _value_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _remarks_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reviewed_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _remarks_decorators, { kind: "field", name: "remarks", static: false, private: false, access: { has: function (obj) { return "remarks" in obj; }, get: function (obj) { return obj.remarks; }, set: function (obj, value) { obj.remarks = value; } }, metadata: _metadata }, _remarks_initializers, _remarks_extraInitializers);
            __esDecorate(null, null, _reviewed_decorators, { kind: "field", name: "reviewed", static: false, private: false, access: { has: function (obj) { return "reviewed" in obj; }, get: function (obj) { return obj.reviewed; }, set: function (obj, value) { obj.reviewed = value; } }, metadata: _metadata }, _reviewed_initializers, _reviewed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateResultDto = UpdateResultDto;
