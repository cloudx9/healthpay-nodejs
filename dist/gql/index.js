"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * get merchant token using api key
 * @param {$apiKey} string - api given by healthpay
 */
const MERCHANT_AUTH = {
    gql: `
mutation AuthMerchant($apiKey: String!) {
  authMerchant(apiKey: $apiKey) {
    token
    merchant {
      owner {
        uid
      }
    }
  }
}
`,
    opName: "AuthMerchant",
};
const USER_AUTH = {
    gql: `
mutation loginUser($mobilenumber: String!, $firstName: String!, $lastName: String!, $email: String) {
  loginUser(mobile: $mobilenumber, firstName:$firstName, lastName:$lastName, email: $email) {
    mobile
  }
}
`,
    opName: "loginUser",
};
const OTP_AUTH = {
    gql: `
mutation authUser($otp: String!, $mobilenumber: String!, $isProvider: Boolean!) {
  authUser(otp: $otp , mobile: $mobilenumber, isProvider: $isProvider) {
    userToken
  }
}
`,
    opName: "authUser",
};
// transfare
const USER_TRANSFER = {
    gql: `
mutation deductFromUser($token: String!, $amount: Float!) {
  deductFromUser(
    userToken: $token
    amount: $amount
  ) {
    isSuccess
  }
}
`,
    opName: "deductFromUser",
};
const USER_WALLET = {
    gql: `
query userWallet($token: String!) {
 userWallet(userToken: $token) {
    total 
  }
}
`,
    opName: "userWallet",
};
const USER_WALLET_LOGS = {
    gql: `
query userWallet($token: String!) {
 userWallet(userToken: $token) {
    total 
    balance {
      amount
      createdAt
      type
    }
  }
}
`,
    opName: "userWallet",
};
// userChargeWallet
const USER_CHARGE = {
    gql: `
mutation topupWalletUser($token: String!, $amount: Float!) {
 topupWalletUser(
    userToken: $token
    amount: $amount
  ) {
    uid
    iframeUrl
  }
}
`,
    opName: "topupWalletUser",
};
exports.default = {
    MERCHANT_AUTH,
    USER_AUTH,
    OTP_AUTH,
    USER_TRANSFER,
    USER_CHARGE,
    USER_WALLET,
    USER_WALLET_LOGS,
};
//# sourceMappingURL=index.js.map