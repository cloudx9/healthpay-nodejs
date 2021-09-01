const HEALTHPAY_CONFIGS = {
  REMOTE_END_POINT: "https://sword.back.healthpay.tech/graphql",
  SANDBOX_END_POINT: "https://prisma.beta.healthpay.tech/api",
};

export type HealthpayConfigs = typeof HEALTHPAY_CONFIGS;
// return configs

export default {
  HEALTHPAY_CONFIGS,
};
