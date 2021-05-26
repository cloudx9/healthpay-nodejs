"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const healthpay_config_1 = require("../healthpay.config");
class HttpRequests {
    constructor() {
        return this;
    }
    request(body, headers) {
        return new Promise((resolve, reject) => {
            const fullHeaders = Object.assign(Object.assign({}, headers), { "content-type": "application/json" });
            node_fetch_1.default(healthpay_config_1.default.HEALTHPAY_CONFIGS.REMOTE_END_POINT, {
                method: "POST",
                headers: fullHeaders,
                body: JSON.stringify(body),
                timeout: 10000,
            })
                .then((resp) => resp.json())
                .then((json) => {
                if (json.errors) {
                    reject(json.errors);
                }
                else {
                    resolve(json);
                }
            })
                .catch((err) => reject(err));
        });
    }
    gqlRequest(gqlRequestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                operationName: gqlRequestData.operation,
                query: gqlRequestData.gql,
                variables: gqlRequestData.variables,
            };
            try {
                const resp = yield this.request(body, gqlRequestData.headers);
                // console.log("_GQLREQSUCC", JSON.stringify(resp));
                return resp;
            }
            catch (e) {
                // console.log("_GQLREQERR", JSON.stringify(e));
                if (e.length > 0 && e[0].message) {
                    throw new Error(e[0].message);
                }
                else {
                    throw new Error(`Something went wrong ${e.getMessage()}`);
                }
            }
        });
    }
}
exports.default = HttpRequests;
//# sourceMappingURL=http.js.map