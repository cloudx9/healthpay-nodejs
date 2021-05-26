import { CLIENT_EVENTS } from "./healthpay.events";
interface BalanceLog {
  amount: string;
  createdAt: string;
  type: string;
}
export type RequestHeaders = { [key: string]: string };
export type RequestBody = { [key: string]: unknown };
export type GqlRequest = {
  gql: string;
  operation: string;
  variables: { [key: string]: unknown };
  headers?: RequestHeaders;
};

export interface Response extends Object {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly body: any;
  readonly redirected: boolean;
}

export interface BackendErrorResponse {
  message: string;
  extensions: string;
}
export type BackendBodyResponse = any;

export interface CustomConfigs {
  apiKey: string;
  apiHeader: string;
  disableWarning?: boolean;
}
export interface ConfirmationResult {
  phonenumber: string;
  status: boolean;
}

export interface OTPResults {
  success: boolean;
  token?: string;
  reason?: string;
}

export interface UserBalance {
  total: number;
}
export interface UserBalanceLogs {
  total: number;
  balance: BalanceLog[];
}

export interface UserChargeWebview {
  webviewurl: string;
}

export type ClientStatus = "CONNECTED" | "PENDING" | "DISCONNECTED";

export interface HealthpayClass {
  /**
   * Connect to Healthpay cloud client initiation is mandatory for later methods
   * @param {string} apiKey - API Key taken from healthpay dashboard {@link https://dashboard.healthpay.tech}
   * @returns {Promise<void>}
   * @emits CLIENT_MERCHANT_AUTH_OK
   * @emits CLIENT_MERCHANT_AUTH_ERR
   * @memberOf Healthpay.Client
   */
  initClient(): Promise<void>;

  /**
   * Get the current client status
   * @returns {ClientStatus}
   * @memberOf Healthpay.Client
   */
  clientStatus(): ClientStatus;

  /**
   * Signs in the user using their phone number. (otp) will be sent to the user's phone number,
   * this (otp) should be used in a later step to complete the authentication
   * @param {string} phonenumber user's phone number in international format {@link https://en.wikipedia.org/wiki/E.164}
   * @returns {Promise<ConfirmationResult>} ConfirmationResult
   * @emits CLIENT_USER_AUTH_OK
   * @emits CLIENT_USER_AUTH_ERR
   * @memberOf Healthpay.Client
   */
  phoneLogin(phonenumber: string): Promise<ConfirmationResult | void>;

  /**
   * Finishes the sign in flow. Validates a code that was sent to the users mobile number
   * @param {string} phonenumber user's phone number in international format {@link https://en.wikipedia.org/wiki/E.164}
   * @param {string} otp 4 digit. one time password sent to the user's phone
   * @returns {Promise<OTPResults>} OTPResults
   * @emits CLIENT_USER_AUTH_OK
   * @emits CLIENT_USER_AUTH_ERR
   * @memberOf Healthpay.Client
   */
  otpLogin(otp: string, phonenumber: string): Promise<OTPResults>;

  /**
   * Get user's wallet total balance and/or user balance logs
   * @param {string} token user's generated token from previous steps
   * @returns {Promise<UserBalance>} OTPResults
   * @emits CLIENT_USER_BALANCE_OK
   * @emits CLIENT_USER_AUTH_ERR
   * @memberOf Healthpay.Client
   */
  userBalance(token: string): Promise<UserBalance | null>;
  userBalance(token: string, getLogs: boolean): Promise<UserBalanceLogs | null>;

  /**
   * Topup user's wallet using any of the provider payment methods
   * @param {string} token user's generated token from previous steps
   * @param {number} amount float of the amount needed should be >= 50
   * @returns {Promise<UserChargeWebview | null>} OTPResults
   * @memberOf Healthpay.Client
   */
  rechargeWallet(
    token: string,
    amount: number,
  ): Promise<UserChargeWebview | null>;

  /**
   * Register handler for specified client event.
   * Use {@link https://docs.Healthpay.tech/healthpay-react-sdk/Client#off} method to delete a handler.
   * @param {Healthpay.ClientEvents} event
   * @param {function} handler - Handler function
   * @memberOf Healthpay.Client
   */
  on(event: EventType | string, handler: (params: any) => void): void;

  /**
   * Remove handler for specified event
   * @param {Healthpay.ClientEvents} event
   * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
   * @memberOf Healthpay.Client
   */
  off(event: EventType, handler: (params: any) => void): void;
}

export type EventType = keyof typeof CLIENT_EVENTS;
