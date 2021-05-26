import { CustomConfigs, HealthpayClass } from "./healthpay.types";
declare const _default: {
    ClientEvents: {
        CONNECTION_ERROR: string;
        CLIENT_DISCONNECTED: string;
        CLIENT_CONNECTED: string;
        CLIENT_USER_AUTH_ERR: string;
        CLIENT_USER_AUTH_OK: string;
        CLIENT_USER_TOKEN: string;
        CLIENT_USER_BALANCE_OK: string;
    };
    getInstance: (clientConfig: CustomConfigs) => HealthpayClass;
};
export default _default;
