"use strict";
import config from "../config";

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 * 
 * https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent/
 */
exports.config = {
  /**
   * Application name.
   * ${process.env.envrionment} is passed via container env vars in ~/infra/ecs.tf 
   */
  app_name: [`myriaverse-node-api-${process.env.ENVIRONMENT}`],
  /**
   * Your New Relic license key.
   */
  license_key: config.newrelicLicenseKey,
  logging: {
    /**
     * Level at which to log. "trace" is most useful to New Relic when diagnosing
     * issues with the agent, "info" and higher will impose the least overhead on
     * production applications.
     */
    level: "info"
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination"s
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  application_logging: {
    forwarding: {
      /**
       * Toggles whether the agent gathers log records for sending to New Relic.
       */
      enabled: true
    }
  },
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*"
    ]
  }
};
