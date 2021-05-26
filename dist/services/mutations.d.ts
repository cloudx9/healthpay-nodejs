import { BackendErrorResponse, ConfirmationResult, CustomConfigs, OTPResults, UserBalanceLogs, UserChargeWebview } from "../healthpay.types";
import HttpRequests from "./http";
export declare class Mutations {
    httpRequests: HttpRequests;
    customConfigs: CustomConfigs;
    _emit: any;
    authToken: string;
    static _mutationInstance: Mutations | null;
    static getInstance(customConfigs: CustomConfigs, _emit: any): Mutations;
    constructor(customConfigs: CustomConfigs, _emit: any);
    /**
     * @private
     */
    _dispatch(event: string, ...args: any[]): void;
    /**
     * @private
     */
    _logWarning(msg: any): void;
    /**
     * @private
     */
    _handleBackendErrorResponse(e?: BackendErrorResponse): void;
    _validatePhonenumber(phonenumber: string): void;
    _merchantLogin(): Promise<string | null>;
    _userLogin(phonenumber: string): Promise<ConfirmationResult | void>;
    _otpLogin(otp: string, phonenumber: string): Promise<OTPResults>;
    _walletBalance(token: string, getLogs?: boolean): Promise<UserBalanceLogs | null>;
    _chargeWallet(token: string, amount: number): Promise<UserChargeWebview | null>;
}
export declare const getInstance: (clientConfig: CustomConfigs, _emit: any) => Mutations;
