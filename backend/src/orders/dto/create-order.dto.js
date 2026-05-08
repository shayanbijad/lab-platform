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
exports.CreateOrderDto = void 0;
var class_validator_1 = require("class-validator");
var CreateOrderDto = function () {
    var _a;
    var _patientId_decorators;
    var _patientId_initializers = [];
    var _patientId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _addressId_decorators;
    var _addressId_initializers = [];
    var _addressId_extraInitializers = [];
    var _testIds_decorators;
    var _testIds_initializers = [];
    var _testIds_extraInitializers = [];
    var _tests_decorators;
    var _tests_initializers = [];
    var _tests_extraInitializers = [];
    var _wizardData_decorators;
    var _wizardData_initializers = [];
    var _wizardData_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateOrderDto() {
                this.patientId = __runInitializers(this, _patientId_initializers, void 0);
                this.userId = (__runInitializers(this, _patientId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.addressId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _addressId_initializers, void 0));
                this.testIds = (__runInitializers(this, _addressId_extraInitializers), __runInitializers(this, _testIds_initializers, void 0));
                this.tests = (__runInitializers(this, _testIds_extraInitializers), __runInitializers(this, _tests_initializers, void 0)); // For backward compatibility
                this.wizardData = (__runInitializers(this, _tests_extraInitializers), __runInitializers(this, _wizardData_initializers, void 0));
                __runInitializers(this, _wizardData_extraInitializers);
            }
            return CreateOrderDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patientId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _addressId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _testIds_decorators = [(0, class_validator_1.IsArray)()];
            _tests_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _wizardData_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _patientId_decorators, { kind: "field", name: "patientId", static: false, private: false, access: { has: function (obj) { return "patientId" in obj; }, get: function (obj) { return obj.patientId; }, set: function (obj, value) { obj.patientId = value; } }, metadata: _metadata }, _patientId_initializers, _patientId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _addressId_decorators, { kind: "field", name: "addressId", static: false, private: false, access: { has: function (obj) { return "addressId" in obj; }, get: function (obj) { return obj.addressId; }, set: function (obj, value) { obj.addressId = value; } }, metadata: _metadata }, _addressId_initializers, _addressId_extraInitializers);
            __esDecorate(null, null, _testIds_decorators, { kind: "field", name: "testIds", static: false, private: false, access: { has: function (obj) { return "testIds" in obj; }, get: function (obj) { return obj.testIds; }, set: function (obj, value) { obj.testIds = value; } }, metadata: _metadata }, _testIds_initializers, _testIds_extraInitializers);
            __esDecorate(null, null, _tests_decorators, { kind: "field", name: "tests", static: false, private: false, access: { has: function (obj) { return "tests" in obj; }, get: function (obj) { return obj.tests; }, set: function (obj, value) { obj.tests = value; } }, metadata: _metadata }, _tests_initializers, _tests_extraInitializers);
            __esDecorate(null, null, _wizardData_decorators, { kind: "field", name: "wizardData", static: false, private: false, access: { has: function (obj) { return "wizardData" in obj; }, get: function (obj) { return obj.wizardData; }, set: function (obj, value) { obj.wizardData = value; } }, metadata: _metadata }, _wizardData_initializers, _wizardData_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateOrderDto = CreateOrderDto;
