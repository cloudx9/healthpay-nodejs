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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
/* eslint-disable camelcase */
var healthpay_config_1 = require("./healthpay.config");
var healthpay_events_1 = require("./healthpay.events");
var http_1 = require("./services/http");
var mutations_1 = require("./services/mutations");
var events_1 = require("events");
var listeners = {};
/**
 * @memberOf Healthpay
 * @class Healthpay
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton),
 * so use the {@link https://docs.Healthpay.tech/healthpay-react-sdk#getInstance} method to get the class instance.
 */
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    /**
     * @ignore
     */
    function Client(customConfigs) {
        var _this = _super.call(this) || this;
        _this.configs = healthpay_config_1.default.HEALTHPAY_CONFIGS;
        _this.customConfigs = {
            apiKey: "",
            disableWarning: false,
            apiHeader: "",
        };
        _this.authToken = "";
        _this._clientStatus = "PENDING";
        _this.customConfigs = customConfigs;
        _this.httpRequests = new http_1.default();
        _this.mutations = mutations_1.getInstance(customConfigs, _this._emit);
        return _this;
    }
    /*
     * @ignore
     */
    Client.getInstance = function (customConfigs) {
        if (this._healthpayInstance === null) {
            this._healthpayInstance = new Client(customConfigs);
        }
        return this._healthpayInstance;
    };
    Client.prototype.clientStatus = function () {
        return this._clientStatus;
    };
    Client.prototype.initClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var merchantLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutations._merchantLogin()];
                    case 1:
                        merchantLogin = _a.sent();
                        if (merchantLogin) {
                            this._clientStatus = "CONNECTED";
                        }
                        else {
                            this._clientStatus = "DISCONNECTED";
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.phoneLogin = function (phonenumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutations._userLogin(phonenumber)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.otpLogin = function (otp, phonenumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutations._otpLogin(otp, phonenumber)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.userBalance = function (token, getLogs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutations._walletBalance(token, getLogs)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.rechargeWallet = function (token, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mutations._chargeWallet(token, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @private
     */
    Client.prototype._emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log("event", event);
        var handlers = listeners[event];
        if (handlers) {
            for (var _a = 0, handlers_1 = handlers; _a < handlers_1.length; _a++) {
                var handler = handlers_1[_a];
                this._logWarning("Client: emit event " + event + " with params " + JSON.stringify(args));
                handler.apply(void 0, args)();
            }
        }
        else {
            this._logWarning("Client: emit: no handlers for event: " + event);
        }
        if (event === healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED) {
            this._clientStatus = "CONNECTED";
        }
        else {
            this._clientStatus = "DISCONNECTED";
        }
    };
    /**
     * @private
     */
    Client.prototype._logWarning = function (msg) {
        !this.customConfigs.disableWarning && console.log(msg);
    };
    Client.prototype.on = function (event, handler) {
        console.log("listento", event, listeners);
        if (!handler || !(handler instanceof Function)) {
            this._logWarning("Client: on: handler is not a Function");
            return;
        }
        if (Object.values(healthpay_events_1.CLIENT_EVENTS).indexOf(event) === -1) {
            this._logWarning("Client: on: ClientEvents does not contain " + event + " event");
            return;
        }
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(handler);
    };
    Client.prototype.off = function (event, handler) {
        if (!listeners[event]) {
            return;
        }
        if (Object.values(healthpay_events_1.CLIENT_EVENTS).indexOf(event) === -1) {
            this._logWarning("Client: off: ClientEvents does not contain " + event + " event");
            return;
        }
        if (handler && handler instanceof Function) {
            listeners[event].delete(handler);
        }
        else {
            listeners[event] = new Set();
        }
    };
    Client._healthpayInstance = null;
    return Client;
}(events_1.EventEmitter));
exports.Client = Client;
//# sourceMappingURL=healthpay.js.map