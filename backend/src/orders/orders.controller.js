"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
var common_1 = require("@nestjs/common");
var OrdersController = function () {
    var _classDecorators = [(0, common_1.Controller)('orders')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findOne_decorators;
    var _findAll_decorators;
    var _updateStatus_decorators;
    var _getOrdersByPatient_decorators;
    var OrdersController = _classThis = /** @class */ (function () {
        function OrdersController_1(ordersService) {
            this.ordersService = (__runInitializers(this, _instanceExtraInitializers), ordersService);
        }
        // POST /orders
        OrdersController_1.prototype.create = function (dto) {
            // Support both testIds and tests for backward compatibility
            var testIds = dto.testIds || dto.tests || [];
            // If userId provided (wizard flow), service will create patient and address as needed
            if (dto.userId) {
                return this.ordersService.createOrderFromWizard(dto.userId, testIds, dto.wizardData);
            }
            // Otherwise, expect patientId and addressId (traditional flow)
            if (!dto.patientId || !dto.addressId) {
                throw new Error('Either userId or both patientId and addressId must be provided');
            }
            return this.ordersService.createOrder(dto.patientId, dto.addressId, testIds);
        };
        // GET /orders/:id
        OrdersController_1.prototype.findOne = function (orderId) {
            return this.ordersService.findOne(orderId);
        };
        // GET /orders
        OrdersController_1.prototype.findAll = function () {
            return this.ordersService.findAll();
        };
        // PATCH /orders/:id/status
        OrdersController_1.prototype.updateStatus = function (orderId, status) {
            return this.ordersService.updateStatus(orderId, status);
        };
        // NEW: GET /orders/by-patient/:patientId
        OrdersController_1.prototype.getOrdersByPatient = function (patientId) {
            return this.ordersService.findOrdersByPatientId(patientId);
        };
        return OrdersController_1;
    }());
    __setFunctionName(_classThis, "OrdersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _findAll_decorators = [(0, common_1.Get)()];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status')];
        _getOrdersByPatient_decorators = [(0, common_1.Get)('by-patient/:patientId')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrdersByPatient_decorators, { kind: "method", name: "getOrdersByPatient", static: false, private: false, access: { has: function (obj) { return "getOrdersByPatient" in obj; }, get: function (obj) { return obj.getOrdersByPatient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersController = _classThis;
}();
exports.OrdersController = OrdersController;
