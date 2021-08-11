/* eslint-disable camelcase */
import healthpayConfig, { HealthpayConfigs } from "./healthpay.config";
import { CLIENT_EVENTS } from "./healthpay.events";
import {
  ConfirmationResult,
  CustomConfigs,
  HealthpayClass,
  OTPResults,
  UserBalanceLogs,
  ClientStatus,
  UserChargeWebview,
} from "./healthpay.types";
import HttpRequests from "./services/http";
import { getInstance, Mutations } from "./services/mutations";

const listeners = {};

/**
 * @memberOf Healthpay
 * @class Healthpay
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton),
 * so use the {@link https://docs.Healthpay.tech/healthpay-react-sdk#getInstance} method to get the class instance.
 */
export class Client implements HealthpayClass {
  static _healthpayInstance: HealthpayClass | null = null;
  configs: HealthpayConfigs = healthpayConfig.HEALTHPAY_CONFIGS;
  mutations: Mutations;
  httpRequests: HttpRequests;
  customConfigs: CustomConfigs = {
    apiKey: "",
    disableWarning: false,
    apiHeader: "",
  };
  authToken: string = "";
  _clientStatus: ClientStatus = "PENDING";
  /*
   * @ignore
   */
  static getInstance(customConfigs: CustomConfigs): HealthpayClass {
    if (this._healthpayInstance === null) {
      this._healthpayInstance = new Client(customConfigs);
    }
    return this._healthpayInstance;
  }

  /**
   * @ignore
   */
  constructor(customConfigs: CustomConfigs) {
    this.customConfigs = customConfigs;
    this.httpRequests = new HttpRequests();
    this.mutations = getInstance(customConfigs, this._emit);
  }

  clientStatus(): ClientStatus {
    return this._clientStatus;
  }

  async initClient(): Promise<void> {
    if (
      this._clientStatus === "DISCONNECTED" ||
      this._clientStatus === "PENDING"
    ) {
      const merchantLogin = await this.mutations._merchantLogin();
      if (merchantLogin) {
        this._clientStatus = "CONNECTED";
      } else {
        this._clientStatus = "DISCONNECTED";
      }
    } else {
      this._logWarning("client: client is already connected");
    }
  }

  async phoneLogin(
    phonenumber: string,
    firstName: string,
    lastName: string,
    email?: string
  ): Promise<ConfirmationResult | void> {
    return await this.mutations._userLogin(
      phonenumber,
      firstName,
      lastName,
      email
    );
  }

  async otpLogin(
    otp: string,
    phonenumber: string,
    isProvider: boolean
  ): Promise<OTPResults> {
    return await this.mutations._otpLogin(otp, phonenumber, isProvider);
  }
  async userBalance(
    token: string,
    getLogs?: boolean
  ): Promise<UserBalanceLogs | null> {
    return await this.mutations._walletBalance(token, getLogs);
  }

  async rechargeWallet(
    token: string,
    amount: number
  ): Promise<UserChargeWebview | null> {
    return await this.mutations._chargeWallet(token, amount);
  }

  /**
   * @private
   */
  _emit(event: string, ...args) {
    const handlers = listeners[event];
    if (handlers) {
      for (const handler of handlers) {
        this._logWarning(
          `Client: emit event ${event} with params ${JSON.stringify(args)}`
        );
        handler(...args);
      }
    } else {
      this._logWarning(`Client: emit: no handlers for event: ${event}`);
    }
    if (event === CLIENT_EVENTS.CLIENT_CONNECTED) {
      this._clientStatus = "CONNECTED";
    } else {
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
    if (!handler || !(handler instanceof Function)) {
      this._logWarning("Client: on: handler is not a Function");
      return;
    }
    if (Object.values(CLIENT_EVENTS).indexOf(event) === -1) {
      this._logWarning(
        `Client: on: ClientEvents does not contain ${event} event`
      );
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
    if (Object.values(CLIENT_EVENTS).indexOf(event) === -1) {
      this._logWarning(
        `Client: off: ClientEvents does not contain ${event} event`
      );
      return;
    }
    if (handler && handler instanceof Function) {
      listeners[event].delete(handler);
    } else {
      listeners[event] = new Set();
    }
  }
}
