"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.Mutations = void 0;
var healthpay_events_1 = require("../healthpay.events");
var gql_1 = require("../gql");
var http_1 = require("./http");
var Mutations = /** @class */ (function () {
    function Mutations(customConfigs, _emit) {
        this.customConfigs = {
            apiKey: "",
            disableWarning: false,
            apiHeader: "",
        };
        this.authToken = "";
        this.customConfigs = customConfigs;
        this.httpRequests = new http_1.default();
        this._emit = _emit;
    }
    /*
     * @ignore
     */
    Mutations.getInstance = function (customConfigs, _emit) {
        if (this._mutationInstance === null) {
            this._mutationInstance = new Mutations(customConfigs, _emit);
        }
        return this._mutationInstance;
    };
    /**
     * @private
     */
    Mutations.prototype._dispatch = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._emit) {
            this._emit.apply(this, __spreadArray([event], args));
        }
    };
    /**
     * @private
     */
    Mutations.prototype._logWarning = function (msg) {
        !this.customConfigs.disableWarning && console.warn(msg);
    };
    /**
     * @private
     */
    Mutations.prototype._handleBackendErrorResponse = function (e) {
        if (e === null || e === void 0 ? void 0 : e.message) {
            if (e.message.includes("Context creation failed")) {
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED, e.message);
            }
        }
        else {
            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CONNECTION_ERROR, e);
        }
        return;
    };
    Mutations.prototype._validatePhonenumber = function (phonenumber) {
        if (!phonenumber ||
            phonenumber.length < 11 ||
            !phonenumber.startsWith("+")) {
            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, "Invalid phone number");
            throw new Error("Invalid phone number");
        }
    };
    Mutations.prototype._merchantLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpRequests.gqlRequest({
                                gql: gql_1.default.MERCHANT_AUTH.gql,
                                operation: gql_1.default.MERCHANT_AUTH.opName,
                                variables: {
                                    apiKey: this.customConfigs.apiKey,
                                },
                                headers: {
                                    "api-header": this.customConfigs.apiHeader,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        this.authToken = response.data.authMerchant.token;
                        this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED, this.authToken);
                        return [2 /*return*/, this.authToken];
                    case 2:
                        e_1 = _a.sent();
                        this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_DISCONNECTED, this.authToken);
                        this._handleBackendErrorResponse(e_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Mutations.prototype._userLogin = function (phonenumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // validate phone number
                        this._validatePhonenumber(phonenumber);
                        return [4 /*yield*/, this.httpRequests.gqlRequest({
                                gql: gql_1.default.USER_AUTH.gql,
                                operation: gql_1.default.USER_AUTH.opName,
                                variables: {
                                    mobilenumber: phonenumber,
                                },
                                headers: {
                                    "api-header": this.customConfigs.apiHeader,
                                    authorization: this.authToken,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response && response.data) {
                            return [2 /*return*/, { phonenumber: phonenumber, status: true }];
                        }
                        else {
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                            this._logWarning("Phone login failed");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this._handleBackendErrorResponse(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Mutations.prototype._otpLogin = function (otp, phonenumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // validate phone number
                        this._validatePhonenumber(phonenumber);
                        return [4 /*yield*/, this.httpRequests.gqlRequest({
                                gql: gql_1.default.OTP_AUTH.gql,
                                operation: gql_1.default.OTP_AUTH.opName,
                                variables: {
                                    mobilenumber: phonenumber,
                                    otp: otp,
                                },
                                headers: {
                                    "api-header": this.customConfigs.apiHeader,
                                    authorization: this.authToken,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response && response.data) {
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_OK, response.data);
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_TOKEN, response.data.authUser.userToken);
                            return [2 /*return*/, {
                                    success: true,
                                    token: response.data.authUser.userToken,
                                    reason: undefined,
                                }];
                        }
                        else {
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                            this._logWarning("Phone otp failed");
                            return [2 /*return*/, { success: false, reason: "Phone otp failed", token: undefined }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e_3.message);
                        this._handleBackendErrorResponse(e_3);
                        return [2 /*return*/, { success: false, reason: "Phone otp failed", token: undefined }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Mutations.prototype._walletBalance = function (token, getLogs) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var gqlQuery, response, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        gqlQuery = getLogs
                            ? gql_1.default.USER_WALLET_LOGS
                            : gql_1.default.USER_WALLET;
                        return [4 /*yield*/, this.httpRequests.gqlRequest({
                                gql: gqlQuery.gql,
                                operation: gqlQuery.opName,
                                variables: {
                                    token: token,
                                },
                                headers: {
                                    "api-header": this.customConfigs.apiHeader,
                                    authorization: this.authToken,
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        if (response && response.data) {
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_BALANCE_OK, response.data.userWallet);
                            return [2 /*return*/, {
                                    total: response.data.userWallet.total,
                                    balance: response.data.userWallet.balance
                                        ? (_a = response.data.userWallet) === null || _a === void 0 ? void 0 : _a.balance
                                        : [],
                                }];
                        }
                        else {
                            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                            this._logWarning("Balance log failed");
                            throw new Error("Balance log failed");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _b.sent();
                        this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e_4.message);
                        this._handleBackendErrorResponse(e_4);
                        throw new Error("Balance log failed");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Mutations.prototype._chargeWallet = function (token, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (parseFloat("" + amount) < 4) {
                            throw new Error("Sorry this amount is not available");
                        }
                        return [4 /*yield*/, this.httpRequests.gqlRequest({
                                gql: gql_1.default.USER_CHARGE.gql,
                                operation: gql_1.default.USER_CHARGE.opName,
                                variables: {
                                    token: token,
                                    amount: amount,
                                },
                                headers: {
                                    "api-header": this.customConfigs.apiHeader,
                                    authorization: this.authToken,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response && response.data) {
                            return [2 /*return*/, {
                                    webviewurl: response.data.userChargeWallet.iframeUrl,
                                }];
                        }
                        else {
                            this._logWarning("Webview context generation error!");
                            throw new Error("Webview context generation error!");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        this._handleBackendErrorResponse(e_5);
                        throw new Error("Webview context generation error!" + e_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Mutations._mutationInstance = null;
    return Mutations;
}());
exports.Mutations = Mutations;
var getInstance = function (clientConfig, _emit) {
    return Mutations.getInstance(clientConfig, _emit);
};
exports.getInstance = getInstance;
//# sourceMappingURL=mutations.js.map