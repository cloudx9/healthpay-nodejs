import fetch, { Response } from "node-fetch";
import healthpayConfig from "../healthpay.config";
import {
  BackendBodyResponse,
  BackendErrorResponse,
  CustomConfigs,
  GqlRequest,
  RequestBody,
  RequestHeaders,
} from "../healthpay.types";

interface HttpRequestsClass {
  request(body: RequestBody, headers?: RequestHeaders): Promise<Response>;
  gqlRequest(
    gqlRequestData: GqlRequest
  ): Promise<Response | BackendErrorResponse>;
}

export default class HttpRequests implements HttpRequestsClass {
  customConfigs: CustomConfigs = {
    apiHeader: "",
    apiKey: "",
    sandBox: false,
  };

  constructor(customConfigs: CustomConfigs) {
    this.customConfigs = customConfigs;
    return this;
  }

  request(body: RequestBody, headers?: RequestHeaders): Promise<Response> {
    return new Promise((resolve, reject) => {
      const fullHeaders = {
        ...headers,
        "content-type": "application/json",
      };
      const endPoint = !!this.customConfigs.sandBox
        ? healthpayConfig.HEALTHPAY_CONFIGS.REMOTE_END_POINT
        : healthpayConfig.HEALTHPAY_CONFIGS.SANDBOX_END_POINT;
      fetch(endPoint, {
        method: "POST",
        headers: fullHeaders,
        body: JSON.stringify(body),
        timeout: 10000,
      })
        .then((resp) => resp.json())
        .then((json) => {
          if (json.errors) {
            reject(json.errors);
          } else {
            resolve(json);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async gqlRequest(gqlRequestData: GqlRequest): Promise<BackendBodyResponse> {
    const body: RequestBody = {
      operationName: gqlRequestData.operation,
      query: gqlRequestData.gql,
      variables: gqlRequestData.variables,
    };
    try {
      const resp = await this.request(body, gqlRequestData.headers);
      return resp;
    } catch (e) {
      if (e.length > 0 && e[0].message) {
        throw new Error(e[0].message);
      } else {
        throw new Error(`Something went wrong ${e.getMessage()}`);
      }
    }
  }
}
