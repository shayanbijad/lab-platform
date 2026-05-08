"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamplersService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var SamplersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SamplersService = _classThis = /** @class */ (function () {
        function SamplersService_1(prisma) {
            this.prisma = prisma;
        }
        SamplersService_1.prototype.createSampler = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedPassword, user, sampler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(dto.password, 10)];
                        case 1:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email,
                                        phone: dto.phone,
                                        password: hashedPassword,
                                        role: 'SAMPLER',
                                    },
                                })];
                        case 2:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.sampler.create({
                                    data: {
                                        userId: user.id,
                                        city: dto.city,
                                        street: dto.street,
                                        building: dto.building,
                                        latitude: dto.latitude,
                                        longitude: dto.longitude,
                                    },
                                })];
                        case 3:
                            sampler = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sampler created successfully',
                                    sampler: {
                                        id: sampler.id,
                                        userId: user.id,
                                        email: user.email,
                                        phone: user.phone,
                                        city: sampler.city,
                                        latitude: sampler.latitude,
                                        longitude: sampler.longitude,
                                    },
                                }];
                    }
                });
            });
        };
        SamplersService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.sampler.findMany({
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        phone: true,
                                        createdAt: true,
                                    },
                                },
                            },
                        })];
                });
            });
        };
        SamplersService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var sampler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.sampler.findUnique({
                                where: { id: id },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            phone: true,
                                            createdAt: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            sampler = _a.sent();
                            if (!sampler) {
                                throw new common_1.NotFoundException('Sampler not found');
                            }
                            return [2 /*return*/, sampler];
                    }
                });
            });
        };
        // Find closest sampler to given coordinates
        SamplersService_1.prototype.findClosestSampler = function (latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var samplers, samplerDist;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.sampler.findMany({
                                where: {
                                    latitude: { not: null },
                                    longitude: { not: null },
                                },
                                select: {
                                    id: true,
                                    latitude: true,
                                    longitude: true,
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            phone: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            samplers = _a.sent();
                            if (samplers.length === 0) {
                                return [2 /*return*/, null];
                            }
                            samplerDist = samplers
                                .filter(function (sampler) { return sampler.latitude !== null && sampler.longitude !== null; })
                                .map(function (sampler) { return (__assign(__assign({}, sampler), { distance: _this.calculateDistance(latitude, longitude, sampler.latitude, sampler.longitude) })); });
                            // Sort by distance and return closest
                            samplerDist.sort(function (a, b) { return a.distance - b.distance; });
                            return [2 /*return*/, samplerDist[0]];
                    }
                });
            });
        };
        SamplersService_1.prototype.calculateDistance = function (lat1, lon1, lat2, lon2) {
            var R = 6371; // Earth's radius in km
            var dLat = (lat2 - lat1) * (Math.PI / 180);
            var dLon = (lon2 - lon1) * (Math.PI / 180);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        SamplersService_1.prototype.updateAddress = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var sampler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.sampler.findUnique({ where: { id: id } })];
                        case 1:
                            sampler = _a.sent();
                            if (!sampler) {
                                throw new common_1.NotFoundException('Sampler not found');
                            }
                            return [2 /*return*/, this.prisma.sampler.update({
                                    where: { id: id },
                                    data: data,
                                })];
                    }
                });
            });
        };
        SamplersService_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var sampler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.sampler.findUnique({ where: { id: id } })];
                        case 1:
                            sampler = _a.sent();
                            if (!sampler) {
                                throw new common_1.NotFoundException('Sampler not found');
                            }
                            // Delete sampler and user
                            return [4 /*yield*/, this.prisma.sampler.delete({ where: { id: id } })];
                        case 2:
                            // Delete sampler and user
                            _a.sent();
                            return [4 /*yield*/, this.prisma.user.delete({ where: { id: sampler.userId } })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'Sampler deleted successfully' }];
                    }
                });
            });
        };
        return SamplersService_1;
    }());
    __setFunctionName(_classThis, "SamplersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SamplersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SamplersService = _classThis;
}();
exports.SamplersService = SamplersService;
