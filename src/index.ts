import { Client } from "./healthpay";
import { CLIENT_EVENTS } from "./healthpay.events";
import { CustomConfigs, HealthpayClass } from "./healthpay.types";

/**
 * init Class as singleton
 * @param {clientConfig} apiKey - API Key taken from healthpay dashboard {@link https://dashboard.healthpay.tech}
 */
const getInstance = (clientConfig: CustomConfigs): HealthpayClass => {
  return Client.getInstance(clientConfig);
};

const ClientEvents = CLIENT_EVENTS;
export default {
  ClientEvents,
  getInstance,
};
