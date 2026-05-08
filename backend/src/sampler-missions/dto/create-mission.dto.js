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
exports.CreateMissionDto = void 0;
var class_validator_1 = require("class-validator");
var CreateMissionDto = function () {
    var _a;
    var _orderId_decorators;
    var _orderId_initializers = [];
    var _orderId_extraInitializers = [];
    var _scheduledAt_decorators;
    var _scheduledAt_initializers = [];
    var _scheduledAt_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMissionDto() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.scheduledAt = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
                this.address = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                __runInitializers(this, _address_extraInitializers);
            }
            return CreateMissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, class_validator_1.IsString)()];
            _scheduledAt_decorators = [(0, class_validator_1.IsDateString)()];
            _address_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: function (obj) { return "orderId" in obj; }, get: function (obj) { return obj.orderId; }, set: function (obj, value) { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: function (obj) { return "scheduledAt" in obj; }, get: function (obj) { return obj.scheduledAt; }, set: function (obj, value) { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMissionDto = CreateMissionDto;
