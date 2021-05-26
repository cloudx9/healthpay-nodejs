"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * get merchant token using api key
 * @param {$apiKey} string - api given by healthpay
 */
var MERCHANT_AUTH = {
    gql: "\nmutation AuthMerchant($apiKey: String!) {\n  authMerchant(apiKey: $apiKey) {\n    token\n    merchant {\n      owner {\n        uid\n      }\n    }\n  }\n}\n",
    opName: "AuthMerchant",
};
var USER_AUTH = {
    gql: "\nmutation loginUser($mobilenumber: String!) {\n  loginUser(mobile: $mobilenumber) {\n    mobile\n  }\n}\n",
    opName: "loginUser",
};
var OTP_AUTH = {
    gql: "\nmutation authUser($otp: String!, $mobilenumber: String!) {\n  authUser(otp: $otp , mobile: $mobilenumber) {\n    userToken\n  }\n}\n",
    opName: "authUser",
};
var USER_TRANSFER = {
    gql: "\nmutation transfer($token: String!, $amount: Float!) {\n  transfer(\n    userToken: $token\n    amount: $amount\n  ) {\n    isSuccess\n  }\n}\n",
    opName: "transfer",
};
var USER_WALLET = {
    gql: "\nquery userWallet($token: String!) {\n userWallet(userToken: $token) {\n    total \n  }\n}\n",
    opName: "userWallet",
};
var USER_WALLET_LOGS = {
    gql: "\nquery userWallet($token: String!) {\n userWallet(userToken: $token) {\n    total \n    balance {\n      amount\n      createdAt\n      type\n    }\n  }\n}\n",
    opName: "userWallet",
};
var USER_CHARGE = {
    gql: "\nmutation userChargeWallet($token: String!, $amount: Float!) {\n userChargeWallet(\n    userToken: $token\n    amount: $amount\n  ) {\n    uid\n    iframeUrl\n  }\n}\n",
    opName: "userChargeWallet",
};
exports.default = {
    MERCHANT_AUTH: MERCHANT_AUTH,
    USER_AUTH: USER_AUTH,
    OTP_AUTH: OTP_AUTH,
    USER_TRANSFER: USER_TRANSFER,
    USER_CHARGE: USER_CHARGE,
    USER_WALLET: USER_WALLET,
    USER_WALLET_LOGS: USER_WALLET_LOGS,
};
//# sourceMappingURL=index.js.map