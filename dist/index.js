"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var healthpay_1 = require("./healthpay");
var healthpay_events_1 = require("./healthpay.events");
/**
 * init Class as singleton
 * @param {clientConfig} apiKey - API Key taken from healthpay dashboard {@link https://dashboard.healthpay.tech}
 */
var getInstance = function (clientConfig) {
    return healthpay_1.Client.getInstance(clientConfig);
};
var ClientEvents = healthpay_events_1.CLIENT_EVENTS;
exports.default = {
    ClientEvents: ClientEvents,
    getInstance: getInstance,
};
//# sourceMappingURL=index.js.map