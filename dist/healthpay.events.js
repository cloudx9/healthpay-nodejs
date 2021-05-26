"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_EVENTS = void 0;
exports.CLIENT_EVENTS = {
    /**
     * @event CONNECTION_ERROR connection failure
     */
    CONNECTION_ERROR: "CONNECTION_ERROR",
    /**
     * @event CLIENT_DISCONNECTED invalid api token, client disconnected
     * @argument {string} error
     */
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    /**
     * @event CLIENT_CONNECTED client logged in successfully
     */
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    /**
     * @event CLIENT_USER_AUTH_ERR cannot authenticate this user
     * @argument {string} error
     */
    CLIENT_USER_AUTH_ERR: "CLIENT_USER_AUTH_ERR",
    /**
     * @event CLIENT_USER_AUTH_OK use's otp sent successfully
     */
    CLIENT_USER_AUTH_OK: "CLIENT_USER_AUTH_OK",
    /**
     * @event CLIENT_USER_TOKEN emitted upon generating user token, this token should be saved on the user's device
     * @argument {string} TOKEN
     */
    CLIENT_USER_TOKEN: "CLIENT_USER_TOKEN",
    /**
     * @event CLIENT_USER_BALANCE_OK emitted upon requesting user's balance and/or balance logs
     * @argument {UserBalance} BALANCE
     */
    CLIENT_USER_BALANCE_OK: "CLIENT_USER_BALANCE_OK",
};
//# sourceMappingURL=healthpay.events.js.map