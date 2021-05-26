"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const healthpay_1 = require("./healthpay");
const healthpay_events_1 = require("./healthpay.events");
const Types = require("./healthpay.types");
/**
 * init Class as singleton
 * @param {clientConfig} apiKey - API Key taken from healthpay dashboard {@link https://dashboard.healthpay.tech}
 */
const getInstance = (clientConfig) => {
    console.log("singleton");
    return healthpay_1.Client.getInstance(clientConfig);
};
const ClientEvents = healthpay_events_1.CLIENT_EVENTS;
exports.default = {
    ClientEvents,
    getInstance,
    Types,
};
//# sourceMappingURL=index.js.map