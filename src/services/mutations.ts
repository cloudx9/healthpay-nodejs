import { CLIENT_EVENTS } from "../healthpay.events";
import {
  BackendErrorResponse,
  ConfirmationResult,
  CustomConfigs,
  OTPResults,
  UserBalanceLogs,
  UserChargeWebview,
} from "../healthpay.types";
import mutations from "../gql";
import HttpRequests from "./http";

export class Mutations {
  httpRequests: HttpRequests;
  customConfigs: CustomConfigs = {
    apiKey: "",
    disableWarning: false,
    apiHeader: "",
  };
  _emit;
  authToken: string = "";
  static _mutationInstance: Mutations | null = null;

  /*
   * @ignore
   */
  static getInstance(customConfigs: CustomConfigs, _emit): Mutations {
    if (this._mutationInstance === null) {
      this._mutationInstance = new Mutations(customConfigs, _emit);
    }
    return this._mutationInstance;
  }

  constructor(customConfigs: CustomConfigs, _emit) {
    this.customConfigs = customConfigs;
    this.httpRequests = new HttpRequests();
    this._emit = _emit;
  }

  /**
   * @private
   */
  _dispatch(event: string, ...args) {
    if (this._emit) {
      this._emit(event, ...args);
    }
  }

  /**
   * @private
   */
  _logWarning(msg) {
    !this.customConfigs.disableWarning && console.warn(msg);
  }

  /**
   * @private
   */
  _handleBackendErrorResponse(e?: BackendErrorResponse): void {
    if (e?.message) {
      if (e.message.includes("Context creation failed")) {
        this._dispatch(CLIENT_EVENTS.CLIENT_CONNECTED, e.message);
      }
    } else {
      this._dispatch(CLIENT_EVENTS.CONNECTION_ERROR, e);
    }
    return;
  }

  _validatePhonenumber(phonenumber: string): void {
    if (
      !phonenumber ||
      phonenumber.length < 11 ||
      !phonenumber.startsWith("+")
    ) {
      this._dispatch(
        CLIENT_EVENTS.CLIENT_USER_AUTH_ERR,
        "Invalid phone number",
      );
      throw new Error("Invalid phone number");
    }
  }

  async _merchantLogin(): Promise<string | null> {
    try {
      const response = await this.httpRequests.gqlRequest({
        gql: mutations.MERCHANT_AUTH.gql,
        operation: mutations.MERCHANT_AUTH.opName,
        variables: {
          apiKey: this.customConfigs.apiKey,
        },
        headers: {
          "api-header": this.customConfigs.apiHeader,
        },
      });
      this.authToken = response.data.authMerchant.token;
      this._dispatch(CLIENT_EVENTS.CLIENT_CONNECTED, this.authToken);
      return this.authToken;
    } catch (e) {
      this._dispatch(CLIENT_EVENTS.CLIENT_DISCONNECTED, this.authToken);
      this._handleBackendErrorResponse(e);
      return null;
    }
  }

  async _userLogin(phonenumber: string): Promise<ConfirmationResult | void> {
    try {
      // validate phone number
      this._validatePhonenumber(phonenumber);

      const response = await this.httpRequests.gqlRequest({
        gql: mutations.USER_AUTH.gql,
        operation: mutations.USER_AUTH.opName,
        variables: {
          mobilenumber: phonenumber,
        },
        headers: {
          "api-header": this.customConfigs.apiHeader,
          authorization: this.authToken,
        },
      });
      if (response && response.data) {
        return { phonenumber, status: true };
      } else {
        this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
        this._logWarning("Phone login failed");
      }
    } catch (e) {
      this._handleBackendErrorResponse(e);
    }
  }

  async _otpLogin(otp: string, phonenumber: string): Promise<OTPResults> {
    try {
      // validate phone number
      this._validatePhonenumber(phonenumber);

      const response = await this.httpRequests.gqlRequest({
        gql: mutations.OTP_AUTH.gql,
        operation: mutations.OTP_AUTH.opName,
        variables: {
          mobilenumber: phonenumber,
          otp: otp,
        },
        headers: {
          "api-header": this.customConfigs.apiHeader,
          authorization: this.authToken,
        },
      });
      if (response && response.data) {
        this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_OK, response.data);
        this._dispatch(
          CLIENT_EVENTS.CLIENT_USER_TOKEN,
          response.data.authUser.userToken,
        );
        return {
          success: true,
          token: response.data.authUser.userToken,
          reason: undefined,
        };
      } else {
        this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
        this._logWarning("Phone otp failed");
        return { success: false, reason: "Phone otp failed", token: undefined };
      }
    } catch (e) {
      this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e.message);
      this._handleBackendErrorResponse(e);
      return { success: false, reason: "Phone otp failed", token: undefined };
    }
  }

  async _walletBalance(
    token: string,
    getLogs?: boolean,
  ): Promise<UserBalanceLogs | null> {
    try {
      const gqlQuery = getLogs
        ? mutations.USER_WALLET_LOGS
        : mutations.USER_WALLET;
      const response = await this.httpRequests.gqlRequest({
        gql: gqlQuery.gql,
        operation: gqlQuery.opName,
        variables: {
          token,
        },
        headers: {
          "api-header": this.customConfigs.apiHeader,
          authorization: this.authToken,
        },
      });
      if (response && response.data) {
        this._dispatch(
          CLIENT_EVENTS.CLIENT_USER_BALANCE_OK,
          response.data.userWallet,
        );
        return {
          total: response.data.userWallet.total,
          balance: response.data.userWallet.balance
            ? response.data.userWallet?.balance
            : [],
        };
      } else {
        this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, response.data);
        this._logWarning("Balance log failed");
        throw new Error("Balance log failed");
      }
    } catch (e) {
      this._dispatch(CLIENT_EVENTS.CLIENT_USER_AUTH_ERR, e.message);
      this._handleBackendErrorResponse(e);
      throw new Error("Balance log failed");
    }
  }

  async _chargeWallet(
    token: string,
    amount: number,
  ): Promise<UserChargeWebview | null> {
    try {
      if (parseFloat(`${amount}`) < 4) {
        throw new Error("Sorry this amount is not available");
      }
      const response = await this.httpRequests.gqlRequest({
        gql: mutations.USER_CHARGE.gql,
        operation: mutations.USER_CHARGE.opName,
        variables: {
          token,
          amount,
        },
        headers: {
          "api-header": this.customConfigs.apiHeader,
          authorization: this.authToken,
        },
      });
      if (response && response.data) {
        return {
          webviewurl: response.data.userChargeWallet.iframeUrl,
        };
      } else {
        this._logWarning("Webview context generation error!");
        throw new Error("Webview context generation error!");
      }
    } catch (e) {
      this._handleBackendErrorResponse(e);
      throw new Error("Webview context generation error!" + e);
    }
  }
}

export const getInstance = (clientConfig: CustomConfigs, _emit): Mutations => {
  return Mutations.getInstance(clientConfig, _emit);
};
