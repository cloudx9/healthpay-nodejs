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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.Mutations = void 0;
const healthpay_events_1 = require("../healthpay.events");
const gql_1 = require("../gql");
const http_1 = require("./http");
class Mutations {
    constructor(customConfigs, _emit) {
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
    static getInstance(customConfigs, _emit) {
        if (this._mutationInstance === null) {
            this._mutationInstance = new Mutations(customConfigs, _emit);
        }
        return this._mutationInstance;
    }
    /**
     * @private
     */
    _dispatch(event, ...args) {
        if (this._emit) {
            this._emit(event, ...args);
        }
    }
    /**
     * @private
     */
    _logWarning(msg) {
        !this.customConfigs.disableWarning && console.warn(msg);
    }
    /**
     * @private
     */
    _handleBackendErrorResponse(e) {
        if (e === null || e === void 0 ? void 0 : e.message) {
            if (e.message.includes("Context creation failed")) {
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED, e.message);
            }
        }
        else {
            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CONNECTION_ERROR, e);
        }
        return;
    }
    _validatePhonenumber(phonenumber) {
        if (!phonenumber ||
            phonenumber.length < 11 ||
            !phonenumber.startsWith("+")) {
            this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, "Invalid phone number");
            throw new Error("Invalid phone number");
        }
    }
    _merchantLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpRequests.gqlRequest({
                    gql: gql_1.default.MERCHANT_AUTH.gql,
                    operation: gql_1.default.MERCHANT_AUTH.opName,
                    variables: {
                        apiKey: this.customConfigs.apiKey,
                    },
                    headers: {
                        "api-header": this.customConfigs.apiHeader,
                    },
                });
                this.authToken = response.data.authMerchant.token;
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED, this.authToken);
                return this.authToken;
            }
            catch (e) {
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_DISCONNECTED, this.authToken);
                this._handleBackendErrorResponse(e);
                return null;
            }
        });
    }
    _userLogin(phonenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validate phone number
                this._validatePhonenumber(phonenumber);
                const response = yield this.httpRequests.gqlRequest({
                    gql: gql_1.default.USER_AUTH.gql,
                    operation: gql_1.default.USER_AUTH.opName,
                    variables: {
                        mobilenumber: phonenumber,
                    },
                    headers: {
                        "api-header": this.customConfigs.apiHeader,
                        authorization: this.authToken,
                    },
                });
                if (response && response.data) {
                    return { phonenumber, status: true };
                }
                else {
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                    this._logWarning("Phone login failed");
                }
            }
            catch (e) {
                this._handleBackendErrorResponse(e);
            }
        });
    }
    _otpLogin(otp, phonenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validate phone number
                this._validatePhonenumber(phonenumber);
                const response = yield this.httpRequests.gqlRequest({
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
                });
                if (response && response.data) {
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_OK, response.data);
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_TOKEN, response.data.authUser.userToken);
                    return {
                        success: true,
                        token: response.data.authUser.userToken,
                        reason: undefined,
                    };
                }
                else {
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                    this._logWarning("Phone otp failed");
                    return { success: false, reason: "Phone otp failed", token: undefined };
                }
            }
            catch (e) {
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e.message);
                this._handleBackendErrorResponse(e);
                return { success: false, reason: "Phone otp failed", token: undefined };
            }
        });
    }
    _walletBalance(token, getLogs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gqlQuery = getLogs
                    ? gql_1.default.USER_WALLET_LOGS
                    : gql_1.default.USER_WALLET;
                const response = yield this.httpRequests.gqlRequest({
                    gql: gqlQuery.gql,
                    operation: gqlQuery.opName,
                    variables: {
                        token,
                    },
                    headers: {
                        "api-header": this.customConfigs.apiHeader,
                        authorization: this.authToken,
                    },
                });
                if (response && response.data) {
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_BALANCE_OK, response.data.userWallet);
                    return {
                        total: response.data.userWallet.total,
                        balance: response.data.userWallet.balance
                            ? (_a = response.data.userWallet) === null || _a === void 0 ? void 0 : _a.balance
                            : [],
                    };
                }
                else {
                    this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
                    this._logWarning("Balance log failed");
                    throw new Error("Balance log failed");
                }
            }
            catch (e) {
                this._dispatch(healthpay_events_1.CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e.message);
                this._handleBackendErrorResponse(e);
                throw new Error("Balance log failed");
            }
        });
    }
    _chargeWallet(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (parseFloat(`${amount}`) < 4) {
                    throw new Error("Sorry this amount is not available");
                }
                const response = yield this.httpRequests.gqlRequest({
                    gql: gql_1.default.USER_CHARGE.gql,
                    operation: gql_1.default.USER_CHARGE.opName,
                    variables: {
                        token,
                        amount,
                    },
                    headers: {
                        "api-header": this.customConfigs.apiHeader,
                        authorization: this.authToken,
                    },
                });
                if (response && response.data) {
                    return {
                        webviewurl: response.data.userChargeWallet.iframeUrl,
                    };
                }
                else {
                    this._logWarning("Webview context generation error!");
                    throw new Error("Webview context generation error!");
                }
            }
            catch (e) {
                this._handleBackendErrorResponse(e);
                throw new Error("Webview context generation error!" + e);
            }
        });
    }
}
exports.Mutations = Mutations;
Mutations._mutationInstance = null;
const getInstance = (clientConfig, _emit) => {
    return Mutations.getInstance(clientConfig, _emit);
};
exports.getInstance = getInstance;
//# sourceMappingURL=mutations.js.map