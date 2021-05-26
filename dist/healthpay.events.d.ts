export declare const CLIENT_EVENTS: {
    /**
     * @event CONNECTION_ERROR connection failure
     */
    CONNECTION_ERROR: string;
    /**
     * @event CLIENT_DISCONNECTED invalid api token, client disconnected
     * @argument {string} error
     */
    CLIENT_DISCONNECTED: string;
    /**
     * @event CLIENT_CONNECTED client logged in successfully
     */
    CLIENT_CONNECTED: string;
    /**
     * @event CLIENT_USER_AUTH_ERR cannot authenticate this user
     * @argument {string} error
     */
    CLIENT_USER_AUTH_ERR: string;
    /**
     * @event CLIENT_USER_AUTH_OK use's otp sent successfully
     */
    CLIENT_USER_AUTH_OK: string;
    /**
     * @event CLIENT_USER_TOKEN emitted upon generating user token, this token should be saved on the user's device
     * @argument {string} TOKEN
     */
    CLIENT_USER_TOKEN: string;
    /**
     * @event CLIENT_USER_BALANCE_OK emitted upon requesting user's balance and/or balance logs
     * @argument {UserBalance} BALANCE
     */
    CLIENT_USER_BALANCE_OK: string;
};
