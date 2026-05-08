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
exports.CreateResultDto = void 0;
var class_validator_1 = require("class-validator");
var CreateResultDto = function () {
    var _a;
    var _orderTestId_decorators;
    var _orderTestId_initializers = [];
    var _orderTestId_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _remarks_decorators;
    var _remarks_initializers = [];
    var _remarks_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateResultDto() {
                this.orderTestId = __runInitializers(this, _orderTestId_initializers, void 0);
                this.value = (__runInitializers(this, _orderTestId_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.reference = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                this.remarks = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _remarks_initializers, void 0));
                __runInitializers(this, _remarks_extraInitializers);
            }
            return CreateResultDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderTestId_decorators = [(0, class_validator_1.IsString)()];
            _value_decorators = [(0, class_validator_1.IsString)()];
            _unit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reference_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _remarks_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderTestId_decorators, { kind: "field", name: "orderTestId", static: false, private: false, access: { has: function (obj) { return "orderTestId" in obj; }, get: function (obj) { return obj.orderTestId; }, set: function (obj, value) { obj.orderTestId = value; } }, metadata: _metadata }, _orderTestId_initializers, _orderTestId_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            __esDecorate(null, null, _remarks_decorators, { kind: "field", name: "remarks", static: false, private: false, access: { has: function (obj) { return "remarks" in obj; }, get: function (obj) { return obj.remarks; }, set: function (obj, value) { obj.remarks = value; } }, metadata: _metadata }, _remarks_initializers, _remarks_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateResultDto = CreateResultDto;
