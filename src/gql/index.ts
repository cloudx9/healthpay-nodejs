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

const USER_TRANSFER = {
  gql: `
mutation transfer($token: String!, $amount: Float!) {
  transfer(
    userToken: $token
    amount: $amount
  ) {
    isSuccess
  }
}
`,
  opName: "transfer",
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

const USER_CHARGE = {
  gql: `
mutation userChargeWallet($token: String!, $amount: Float!) {
 userChargeWallet(
    userToken: $token
    amount: $amount
  ) {
    uid
    iframeUrl
  }
}
`,
  opName: "userChargeWallet",
};

export default {
  MERCHANT_AUTH,
  USER_AUTH,
  OTP_AUTH,
  USER_TRANSFER,
  USER_CHARGE,
  USER_WALLET,
  USER_WALLET_LOGS,
};
