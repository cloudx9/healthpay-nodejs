import { Response } from "node-fetch";
import { BackendBodyResponse, BackendErrorResponse, CustomConfigs, GqlRequest, RequestBody, RequestHeaders } from "../healthpay.types";
interface HttpRequestsClass {
    request(body: RequestBody, headers?: RequestHeaders): Promise<Response>;
    gqlRequest(gqlRequestData: GqlRequest): Promise<Response | BackendErrorResponse>;
}
export default class HttpRequests implements HttpRequestsClass {
    customConfigs: CustomConfigs;
    constructor(customConfigs: CustomConfigs);
    request(body: RequestBody, headers?: RequestHeaders): Promise<Response>;
    gqlRequest(gqlRequestData: GqlRequest): Promise<BackendBodyResponse>;
}
export {};
