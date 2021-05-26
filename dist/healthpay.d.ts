import { HealthpayConfigs } from "./healthpay.config";
import { ConfirmationResult, CustomConfigs, HealthpayClass, OTPResults, UserBalanceLogs, ClientStatus, UserChargeWebview } from "./healthpay.types";
import HttpRequests from "./services/http";
import { Mutations } from "./services/mutations";
/**
 * @memberOf Healthpay
 * @class Healthpay
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton),
 * so use the {@link https://docs.Healthpay.tech/healthpay-react-sdk#getInstance} method to get the class instance.
 */
export declare class Client implements HealthpayClass {
    static _healthpayInstance: HealthpayClass | null;
    configs: HealthpayConfigs;
    mutations: Mutations;
    httpRequests: HttpRequests;
    customConfigs: CustomConfigs;
    authToken: string;
    _clientStatus: ClientStatus;
    static getInstance(customConfigs: CustomConfigs): HealthpayClass;
    /**
     * @ignore
     */
    constructor(customConfigs: CustomConfigs);
    clientStatus(): ClientStatus;
    initClient(): Promise<void>;
    phoneLogin(phonenumber: string): Promise<ConfirmationResult | void>;
    otpLogin(otp: string, phonenumber: string): Promise<OTPResults>;
    userBalance(token: string, getLogs?: boolean): Promise<UserBalanceLogs | null>;
    rechargeWallet(token: string, amount: number): Promise<UserChargeWebview | null>;
    /**
     * @private
     */
    _emit(event: string, ...args: any[]): void;
    /**
     * @private
     */
    _logWarning(msg: any): void;
    on(event: any, handler: any): void;
    off(event: any, handler: any): void;
}
