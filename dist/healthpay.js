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
exports.Client = void 0;
/* eslint-disable camelcase */
const healthpay_config_1 = require("./healthpay.config");
const healthpay_events_1 = require("./healthpay.events");
const http_1 = require("./services/http");
const mutations_1 = require("./services/mutations");
const listeners = {};
/**
 * @memberOf Healthpay
 * @class Healthpay
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton),
 * so use the {@link https://docs.Healthpay.tech/healthpay-react-sdk#getInstance} method to get the class instance.
 */
class Client {
    /**
     * @ignore
     */
    constructor(customConfigs) {
        this.configs = healthpay_config_1.default.HEALTHPAY_CONFIGS;
        this.customConfigs = {
            apiKey: "",
            disableWarning: false,
            apiHeader: "",
        };
        this.authToken = "";
        this._clientStatus = "PENDING";
        this.customConfigs = customConfigs;
        this.httpRequests = new http_1.default();
        this.mutations = mutations_1.getInstance(customConfigs, this._emit);
    }
    /*
     * @ignore
     */
    static getInstance(customConfigs) {
        if (this._healthpayInstance === null) {
            this._healthpayInstance = new Client(customConfigs);
        }
        return this._healthpayInstance;
    }
    clientStatus() {
        return this._clientStatus;
    }
    initClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const merchantLogin = yield this.mutations._merchantLogin();
            if (merchantLogin) {
                this._clientStatus = "CONNECTED";
            }
            else {
                this._clientStatus = "DISCONNECTED";
            }
        });
    }
    phoneLogin(phonenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mutations._userLogin(phonenumber);
        });
    }
    otpLogin(otp, phonenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mutations._otpLogin(otp, phonenumber);
        });
    }
    userBalance(token, getLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mutations._walletBalance(token, getLogs);
        });
    }
    rechargeWallet(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mutations._chargeWallet(token, amount);
        });
    }
    /**
     * @private
     */
    _emit(event, ...args) {
        console.log("event", event);
        const handlers = listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                this._logWarning(`Client: emit event ${event} with params ${JSON.stringify(args)}`);
                handler(...args);
            }
        }
        else {
            this._logWarning(`Client: emit: no handlers for event: ${event}`);
        }
        if (event === healthpay_events_1.CLIENT_EVENTS.CLIENT_CONNECTED) {
            this._clientStatus = "CONNECTED";
        }
        else {
            this._clientStatus = "DISCONNECTED";
        }
    }
    /**
     * @private
     */
    _logWarning(msg) {
        !this.customConfigs.disableWarning && console.log(msg);
    }
    on(event, handler) {
        console.log("listento", event, listeners);
        if (!handler || !(handler instanceof Function)) {
            this._logWarning("Client: on: handler is not a Function");
            return;
        }
        if (Object.values(healthpay_events_1.CLIENT_EVENTS).indexOf(event) === -1) {
            this._logWarning(`Client: on: ClientEvents does not contain ${event} event`);
            return;
        }
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(handler);
    }
    off(event, handler) {
        if (!listeners[event]) {
            return;
        }
        if (Object.values(healthpay_events_1.CLIENT_EVENTS).indexOf(event) === -1) {
            this._logWarning(`Client: off: ClientEvents does not contain ${event} event`);
            return;
        }
        if (handler && handler instanceof Function) {
            listeners[event].delete(handler);
        }
        else {
            listeners[event] = new Set();
        }
    }
}
exports.Client = Client;
Client._healthpayInstance = null;
//# sourceMappingURL=healthpay.js.map