import fetch, { Response } from "node-fetch";
import healthpayConfig from "../healthpay.config";
import {
  BackendBodyResponse,
  BackendErrorResponse,
  GqlRequest,
  RequestBody,
  RequestHeaders,
} from "../healthpay.types";

interface HttpRequestsClass {
  request(body: RequestBody, headers?: RequestHeaders): Promise<Response>;
  gqlRequest(
    gqlRequestData: GqlRequest,
  ): Promise<Response | BackendErrorResponse>;
}

export default class HttpRequests implements HttpRequestsClass {
  constructor() {
    return this;
  }

  request(body: RequestBody, headers?: RequestHeaders): Promise<Response> {
    return new Promise((resolve, reject) => {
      const fullHeaders = {
        ...headers,
        "content-type": "application/json",
      };
      fetch(healthpayConfig.HEALTHPAY_CONFIGS.REMOTE_END_POINT, {
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
      // console.log("_GQLREQSUCC", JSON.stringify(resp));
      return resp;
    } catch (e) {
      // console.log("_GQLREQERR", JSON.stringify(e));

      if (e.length > 0 && e[0].message) {
        throw new Error(e[0].message);
      } else {
        throw new Error(`Something went wrong ${e.getMessage()}`);
      }
    }
  }
}
