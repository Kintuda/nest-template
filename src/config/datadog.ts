import trace from "dd-trace";

const { ENABLE_DATADOG, ENV } = process.env;

if (ENABLE_DATADOG) {
  trace.init({
    env: ENV,
    version: require("../package.json").version,
  });
}
