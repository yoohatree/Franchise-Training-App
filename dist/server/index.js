// node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs
var automatedEnvironmentVariables = [
  "CI",
  "CONTINUOUS_INTEGRATION",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
  "CIRCLECI",
  "TRAVIS",
  "BUILDKITE",
  "BITBUCKET_BUILD_NUMBER",
  "APPVEYOR",
  "CODEBUILD_BUILD_ID",
  "TF_BUILD",
  "TEAMCITY_VERSION",
  "JENKINS_URL",
  "HUDSON_URL",
  "BAMBOO_BUILDKEY",
  "CF_PAGES"
];
var isTestEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};
var isProductionEnvironment = () => {
  try {
    return false;
  } catch {
  }
  return false;
};

// node_modules/@clerk/shared/dist/deprecated.mjs
var displayedWarnings = /* @__PURE__ */ new Set();
var deprecated = (fnName, warning, key) => {
  const hideWarning = isTestEnvironment() || isProductionEnvironment();
  const messageId = key ?? fnName;
  if (displayedWarnings.has(messageId) || hideWarning) return;
  displayedWarnings.add(messageId);
  console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.
${warning}`);
};

// node_modules/@clerk/shared/dist/constants.mjs
var LEGACY_DEV_INSTANCE_SUFFIXES = [
  ".lcl.dev",
  ".lclstage.dev",
  ".lclclerk.com"
];
var CURRENT_DEV_INSTANCE_SUFFIXES = [
  ".accounts.dev",
  ".accountsstage.dev",
  ".accounts.lclclerk.com"
];
var DEV_OR_STAGING_SUFFIXES = [
  ".lcl.dev",
  ".stg.dev",
  ".lclstage.dev",
  ".stgstage.dev",
  ".dev.lclclerk.com",
  ".stg.lclclerk.com",
  ".accounts.lclclerk.com",
  "accountsstage.dev",
  "accounts.dev"
];

// node_modules/@clerk/shared/dist/_chunks/keySetupGuidance-NjzfRCzi.mjs
var existingAppSteps = `To use an existing Clerk app, run:
npx clerk@latest link
npx clerk@latest env pull

For production keys, run:
npx clerk@latest env pull --instance prod`;
var dashboardFallback = `Or copy keys from https://dashboard.clerk.com/~/api-keys into your .env file.`;
var keySetupGuidance = `To create a new Clerk app, run:
npx clerk@latest init

'npx clerk@latest init' does not need a Clerk account and writes temporary dev keys.

${existingAppSteps}

${dashboardFallback}`;
var existingAppKeyGuidance = `${existingAppSteps}

${dashboardFallback}`;

// node_modules/@clerk/shared/dist/isomorphicAtob.mjs
var isomorphicAtob = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
  else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data, "base64").toString();
  return data;
};

// node_modules/@clerk/shared/dist/isomorphicBtoa.mjs
var isomorphicBtoa = (data) => {
  if (typeof btoa !== "undefined" && typeof btoa === "function") return btoa(data);
  else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
  return data;
};

// node_modules/@clerk/shared/dist/keys.mjs
var PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
var PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
function isValidDecodedPublishableKey(decoded) {
  if (!decoded.endsWith("$")) return false;
  const withoutTrailing = decoded.slice(0, -1);
  if (withoutTrailing.includes("$")) return false;
  return withoutTrailing.includes(".");
}
function parsePublishableKey(key, options = {}) {
  key = key || "";
  if (!key || !isPublishableKey(key)) {
    if (options.fatal && !key) throw new Error(`Publishable key is missing.

${keySetupGuidance}`);
    if (options.fatal && !isPublishableKey(key)) throw new Error(`Publishable key not valid (expected format: pk_test_... or pk_live_...).

${keySetupGuidance}`);
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
  let decodedFrontendApi;
  try {
    decodedFrontendApi = isomorphicAtob(key.split("_")[2]);
  } catch {
    if (options.fatal) throw new Error(`Publishable key not valid: Failed to decode key.

${keySetupGuidance}`);
    return null;
  }
  if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
    if (options.fatal) throw new Error(`Publishable key not valid: Decoded key has invalid format.

${keySetupGuidance}`);
    return null;
  }
  let frontendApi = decodedFrontendApi.slice(0, -1);
  if (options.proxyUrl) frontendApi = options.proxyUrl;
  else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey(key = "") {
  try {
    if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
    const parts = key.split("_");
    if (parts.length !== 3) return false;
    const encodedPart = parts[2];
    if (!encodedPart) return false;
    return isValidDecodedPublishableKey(isomorphicAtob(encodedPart));
  } catch {
    return false;
  }
}
function createDevOrStagingUrlCache() {
  const devOrStagingUrlCache = /* @__PURE__ */ new Map();
  return {
    /**
    * Checks if a URL is a development or staging environment.
    *
    * @param url - The URL to check (string or URL object).
    * @returns `true` if the URL is a development or staging environment, `false` otherwise.
    */
    isDevOrStagingUrl: (url) => {
      if (!url) return false;
      const hostname = typeof url === "string" ? url : url.hostname;
      let res = devOrStagingUrlCache.get(hostname);
      if (res === void 0) {
        res = DEV_OR_STAGING_SUFFIXES.some((s2) => hostname.endsWith(s2));
        devOrStagingUrlCache.set(hostname, res);
      }
      return res;
    }
  };
}
function isProductionFromPublishableKey(apiKey) {
  return apiKey.startsWith("live_") || apiKey.startsWith("pk_live_");
}
function isDevelopmentFromSecretKey(apiKey) {
  return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
async function getCookieSuffix(publishableKey, subtle = globalThis.crypto.subtle) {
  const data = new TextEncoder().encode(publishableKey);
  const digest = await subtle.digest("sha-1", data);
  return isomorphicBtoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
var getSuffixedCookieName = (cookieName, cookieSuffix) => {
  return `${cookieName}_${cookieSuffix}`;
};

// node_modules/@clerk/shared/dist/retry.mjs
var defaultOptions = {
  initialDelay: 125,
  maxDelayBetweenRetries: 0,
  factor: 2,
  shouldRetry: (_2, iteration) => iteration < 5,
  retryImmediately: false,
  jitter: true
};
var RETRY_IMMEDIATELY_DELAY = 100;
var sleep = async (ms) => new Promise((s2) => setTimeout(s2, ms));
var applyJitter = (delay, jitter) => {
  return jitter ? delay * (1 + Math.random()) : delay;
};
var createExponentialDelayAsyncFn = (opts) => {
  let timesCalled = 0;
  const calculateDelayInMs = () => {
    const constant = opts.initialDelay;
    const base = opts.factor;
    let delay = constant * Math.pow(base, timesCalled);
    delay = applyJitter(delay, opts.jitter);
    return Math.min(opts.maxDelayBetweenRetries || delay, delay);
  };
  return async () => {
    await sleep(calculateDelayInMs());
    timesCalled++;
  };
};
var retry = async (callback, options = {}) => {
  let iterations = 0;
  const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
    ...defaultOptions,
    ...options
  };
  const delay = createExponentialDelayAsyncFn({
    initialDelay,
    maxDelayBetweenRetries,
    factor,
    jitter
  });
  while (true) try {
    return await callback();
  } catch (e) {
    iterations++;
    if (!shouldRetry(e, iterations)) throw e;
    if (onBeforeRetry) await onBeforeRetry(iterations);
    if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
    else await delay();
  }
};

// node_modules/@clerk/shared/dist/url.mjs
function isLegacyDevAccountPortalOrigin(host) {
  return LEGACY_DEV_INSTANCE_SUFFIXES.some((legacyDevSuffix) => {
    return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
  });
}
function isCurrentDevAccountPortalOrigin(host) {
  return CURRENT_DEV_INSTANCE_SUFFIXES.some((currentDevSuffix) => {
    return host.endsWith(currentDevSuffix) && !host.endsWith(".clerk" + currentDevSuffix);
  });
}
var createDynamicParamParser = ({ regex }) => ({ urlWithParam, entity }) => {
  const match2 = regex.exec(urlWithParam);
  if (match2) {
    const key = match2[1];
    if (key in entity) {
      const value = entity[key];
      return urlWithParam.replace(match2[0], value);
    }
  }
  return urlWithParam;
};
var populateParamFromObject = createDynamicParamParser({ regex: /:(\w+)/ });

// node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs
function createErrorTypeGuard(ErrorClass) {
  function typeGuard(error) {
    const target = error ?? this;
    if (!target) throw new TypeError(`${ErrorClass.kind || ErrorClass.name} type guard requires an error object`);
    if (ErrorClass.kind && typeof target === "object" && target !== null && "constructor" in target) {
      if (target.constructor?.kind === ErrorClass.kind) return true;
    }
    return target instanceof ErrorClass;
  }
  return typeGuard;
}
var ClerkError = class ClerkError2 extends Error {
  static kind = "ClerkError";
  clerkError = true;
  code;
  longMessage;
  docsUrl;
  cause;
  get name() {
    return this.constructor.name;
  }
  constructor(opts) {
    super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), { cause: opts.cause });
    Object.setPrototypeOf(this, ClerkError2.prototype);
    this.code = opts.code;
    this.docsUrl = opts.docsUrl;
    this.longMessage = opts.longMessage;
    this.cause = opts.cause;
  }
  toString() {
    return `[${this.name}]
Message:${this.message}`;
  }
  static formatMessage(name, msg, code, docsUrl) {
    const prefix = "Clerk:";
    const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
    msg = msg.replace(regex, "");
    msg = `${prefix} ${msg.trim()}

(code="${code}")

`;
    if (docsUrl) msg += `

Docs: ${docsUrl}`;
    return msg;
  }
};
var ClerkRuntimeError = class ClerkRuntimeError2 extends ClerkError {
  static kind = "ClerkRuntimeError";
  /**
  * @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
  */
  clerkRuntimeError = true;
  constructor(message, options) {
    super({
      ...options,
      message
    });
    Object.setPrototypeOf(this, ClerkRuntimeError2.prototype);
  }
};
var isClerkRuntimeError = createErrorTypeGuard(ClerkRuntimeError);

// node_modules/@clerk/shared/dist/_chunks/error-DXioMHds.mjs
var ClerkAPIError = class {
  static kind = "ClerkAPIError";
  code;
  message;
  longMessage;
  meta;
  constructor(json) {
    const parsedError = {
      code: json.code,
      message: json.message,
      longMessage: json.long_message,
      meta: {
        paramName: json.meta?.param_name,
        sessionId: json.meta?.session_id,
        emailAddresses: json.meta?.email_addresses,
        identifiers: json.meta?.identifiers,
        zxcvbn: json.meta?.zxcvbn,
        plan: json.meta?.plan,
        isPlanUpgradePossible: json.meta?.is_plan_upgrade_possible,
        seatsQuantityToAdd: json.meta?.seats_quantity_to_add,
        seatsQuantity: json.meta?.seats_quantity,
        traceId: json.meta?.trace_id,
        kind: json.meta?.kind,
        title: json.meta?.title,
        description: json.meta?.description,
        linkUrl: json.meta?.link_url,
        linkText: json.meta?.link_text,
        data: json.meta?.data
      }
    };
    this.code = parsedError.code;
    this.message = parsedError.message;
    this.longMessage = parsedError.longMessage;
    this.meta = parsedError.meta;
  }
};
var isClerkAPIError = createErrorTypeGuard(ClerkAPIError);
function parseError(error) {
  return new ClerkAPIError(error);
}
var ClerkAPIResponseError = class ClerkAPIResponseError2 extends ClerkError {
  static kind = "ClerkAPIResponseError";
  status;
  clerkTraceId;
  retryAfter;
  errors;
  constructor(message, options) {
    const { data: errorsJson, status, clerkTraceId, retryAfter } = options;
    super({
      ...options,
      message,
      code: "api_response_error"
    });
    Object.setPrototypeOf(this, ClerkAPIResponseError2.prototype);
    this.status = status;
    this.clerkTraceId = clerkTraceId;
    this.retryAfter = retryAfter;
    this.errors = (errorsJson || []).map((e) => new ClerkAPIError(e));
  }
  toString() {
    let message = `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map((e) => JSON.stringify(e))}`;
    if (this.clerkTraceId) message += `
Clerk Trace ID: ${this.clerkTraceId}`;
    return message;
  }
  static formatMessage(name, msg, _2, __) {
    return msg;
  }
};
var isClerkAPIResponseError = createErrorTypeGuard(ClerkAPIResponseError);
var DefaultMessages = Object.freeze({
  InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
  InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid (key={{key}}, expected format: pk_test_... or pk_live_...).

${keySetupGuidance}`,
  MissingPublishableKeyErrorMessage: `Clerk keys are missing from your environment.

${keySetupGuidance}`,
  MissingSecretKeyErrorMessage: `Missing secretKey.

${existingAppKeyGuidance}`,
  MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
function buildErrorThrower({ packageName, customMessages }) {
  let pkg = packageName;
  function buildMessage(rawMessage, replacements) {
    if (!replacements) return `${pkg}: ${rawMessage}`;
    let msg = rawMessage;
    const matches2 = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const match2 of matches2) {
      const replacement = (replacements[match2[1]] || "").toString();
      msg = msg.replace(`{{${match2[1]}}}`, replacement);
    }
    return `${pkg}: ${msg}`;
  }
  const messages = {
    ...DefaultMessages,
    ...customMessages
  };
  return {
    setPackageName({ packageName: packageName2 }) {
      if (typeof packageName2 === "string") pkg = packageName2;
      return this;
    },
    setMessages({ customMessages: customMessages2 }) {
      Object.assign(messages, customMessages2 || {});
      return this;
    },
    throwInvalidPublishableKeyError(params) {
      throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
    },
    throwInvalidProxyUrl(params) {
      throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
    },
    throwMissingPublishableKeyError() {
      throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
    },
    throwMissingSecretKeyError() {
      throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
    },
    throwMissingClerkProviderError(params) {
      throw new Error(buildMessage(messages.MissingClerkProvider, params));
    },
    throw(message) {
      throw new Error(buildMessage(message));
    }
  };
}

// node_modules/@clerk/backend/dist/chunk-YBVFDYDR.mjs
var errorThrower = buildErrorThrower({ packageName: "@clerk/backend" });
var { isDevOrStagingUrl } = createDevOrStagingUrlCache();

// node_modules/@clerk/backend/dist/chunk-U3UVQERL.mjs
var TokenVerificationErrorCode = {
  InvalidSecretKey: "clerk_key_invalid"
};
var TokenVerificationErrorReason = {
  TokenExpired: "token-expired",
  TokenInvalid: "token-invalid",
  TokenInvalidAlgorithm: "token-invalid-algorithm",
  TokenInvalidAuthorizedParties: "token-invalid-authorized-parties",
  TokenInvalidIssuer: "token-invalid-issuer",
  TokenInvalidSignature: "token-invalid-signature",
  TokenNotActiveYet: "token-not-active-yet",
  TokenIatInTheFuture: "token-iat-in-the-future",
  TokenVerificationFailed: "token-verification-failed",
  InvalidSecretKey: "secret-key-invalid",
  LocalJWKMissing: "jwk-local-missing",
  RemoteJWKFailedToLoad: "jwk-remote-failed-to-load",
  RemoteJWKInvalid: "jwk-remote-invalid",
  RemoteJWKMissing: "jwk-remote-missing",
  JWKFailedToResolve: "jwk-failed-to-resolve",
  JWKKidMismatch: "jwk-kid-mismatch"
};
var TokenVerificationErrorAction = {
  ContactSupport: "Contact support@clerk.com",
  EnsureClerkJWT: "Make sure that this is a valid Clerk-generated JWT.",
  SetClerkJWTKey: "Set the CLERK_JWT_KEY environment variable.",
  SetClerkSecretKey: "Set the CLERK_SECRET_KEY environment variable.",
  EnsureClockSync: "Make sure your system clock is in sync (e.g. turn off and on automatic time synchronization)."
};
var TokenVerificationError = class _TokenVerificationError extends Error {
  constructor({
    action,
    message,
    reason
  }) {
    super(message);
    Object.setPrototypeOf(this, _TokenVerificationError.prototype);
    this.reason = reason;
    this.message = message;
    this.action = action;
  }
  getFullMessage() {
    return `${[this.message, this.action].filter((m) => m).join(" ")} (reason=${this.reason}, token-carrier=${this.tokenCarrier})`;
  }
};
var MachineTokenVerificationErrorCode = {
  TokenInvalid: "token-invalid",
  InvalidSecretKey: "secret-key-invalid",
  UnexpectedError: "unexpected-error",
  TokenVerificationFailed: "token-verification-failed"
};
var _MachineTokenVerificationError = class _MachineTokenVerificationError2 extends ClerkError {
  constructor({
    message,
    code,
    status,
    action
  }) {
    super({ message, code });
    Object.setPrototypeOf(this, _MachineTokenVerificationError2.prototype);
    this.status = status;
    this.action = action;
  }
  // Keep message unformatted, matching ClerkAPIResponseError's approach
  static formatMessage(_name, msg, _code, _docsUrl) {
    return msg;
  }
  getFullMessage() {
    return `${this.message} (code=${this.code}, status=${this.status || "n/a"})`;
  }
};
_MachineTokenVerificationError.kind = "MachineTokenVerificationError";
var MachineTokenVerificationError = _MachineTokenVerificationError;

// node_modules/@clerk/backend/dist/runtime/browser/crypto.mjs
var webcrypto = crypto;

// node_modules/@clerk/backend/dist/chunk-XQX6JGUU.mjs
var globalFetch = fetch.bind(globalThis);
var runtime = {
  crypto: webcrypto,
  get fetch() {
    return false ? fetch : globalFetch;
  },
  AbortController: globalThis.AbortController,
  Blob: globalThis.Blob,
  FormData: globalThis.FormData,
  Headers: globalThis.Headers,
  Request: globalThis.Request,
  Response: globalThis.Response
};
var base64url = {
  parse(string, opts) {
    return parse(string, base64UrlEncoding, opts);
  },
  stringify(data, opts) {
    return stringify(data, base64UrlEncoding, opts);
  }
};
var base64UrlEncoding = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bits: 6
};
function parse(string, encoding, opts = {}) {
  if (!encoding.codes) {
    encoding.codes = {};
    for (let i = 0; i < encoding.chars.length; ++i) {
      encoding.codes[encoding.chars[i]] = i;
    }
  }
  if (!opts.loose && string.length * encoding.bits & 7) {
    throw new SyntaxError("Invalid padding");
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
    if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
      throw new SyntaxError("Invalid padding");
    }
  }
  const out = new (opts.out ?? Uint8Array)(end * encoding.bits / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = encoding.codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError("Invalid character " + string[i]);
    }
    buffer = buffer << encoding.bits | value;
    bits += encoding.bits;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= encoding.bits || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function stringify(data, encoding, opts = {}) {
  const { pad = true } = opts;
  const mask = (1 << encoding.bits) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | 255 & data[i];
    bits += 8;
    while (bits > encoding.bits) {
      bits -= encoding.bits;
      out += encoding.chars[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += encoding.chars[mask & buffer << encoding.bits - bits];
  }
  if (pad) {
    while (out.length * encoding.bits & 7) {
      out += "=";
    }
  }
  return out;
}
var algToHash = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512"
};
var RSA_ALGORITHM_NAME = "RSASSA-PKCS1-v1_5";
var jwksAlgToCryptoAlg = {
  RS256: RSA_ALGORITHM_NAME,
  RS384: RSA_ALGORITHM_NAME,
  RS512: RSA_ALGORITHM_NAME
};
var algs = Object.keys(algToHash);
function getCryptoAlgorithm(algorithmName) {
  const hash = algToHash[algorithmName];
  const name = jwksAlgToCryptoAlg[algorithmName];
  if (!hash || !name) {
    throw new Error(`Unsupported algorithm ${algorithmName}, expected one of ${algs.join(",")}.`);
  }
  return {
    hash: { name: algToHash[algorithmName] },
    name: jwksAlgToCryptoAlg[algorithmName]
  };
}
var isArrayString = (s2) => {
  return Array.isArray(s2) && s2.length > 0 && s2.every((a) => typeof a === "string");
};
var assertAudienceClaim = (aud, audience) => {
  const audienceList = [audience].flat().filter((a) => !!a);
  const audList = [aud].flat().filter((a) => !!a);
  const shouldVerifyAudience = audienceList.length > 0 && audList.length > 0;
  if (!shouldVerifyAudience) {
    return;
  }
  if (typeof aud === "string") {
    if (!audienceList.includes(aud)) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.EnsureClerkJWT,
        reason: TokenVerificationErrorReason.TokenVerificationFailed,
        message: `Invalid JWT audience claim (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  } else if (isArrayString(aud)) {
    if (!aud.some((a) => audienceList.includes(a))) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.EnsureClerkJWT,
        reason: TokenVerificationErrorReason.TokenVerificationFailed,
        message: `Invalid JWT audience claim array (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  }
};
var assertOAuthAudienceClaim = (aud, audience) => {
  const audienceList = [audience].flat().filter((a) => !!a);
  if (audienceList.length === 0) {
    return;
  }
  const audFromToken = aud ? [aud].flat() : void 0;
  if (!isArrayString(audFromToken) || audFromToken.some((a) => a.length === 0)) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid OAuth audience claim (aud) ${JSON.stringify(aud)}. Expected a non-empty string or a non-empty array of non-empty strings.`
    });
  }
  if (!audFromToken.some((a) => audienceList.includes(a))) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `OAuth audience mismatch. Verification expected audience ${JSON.stringify(
        audienceList
      )}, but incoming token has aud ${JSON.stringify(aud)}.`
    });
  }
};
var assertHeaderType = (typ, allowedTypes) => {
  if (typeof typ === "undefined" && typeof allowedTypes === "undefined") {
    return;
  }
  const expectedTypes = allowedTypes ?? "JWT";
  const allowed = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];
  if (!allowed.includes(typ)) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalid,
      message: `Invalid JWT type ${JSON.stringify(typ)}. Expected "${allowed.join(", ")}".`
    });
  }
};
var assertHeaderAlgorithm = (alg) => {
  if (!algs.includes(alg)) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalidAlgorithm,
      message: `Invalid JWT algorithm ${JSON.stringify(alg)}. Supported: ${algs}.`
    });
  }
};
var assertSubClaim = (sub) => {
  if (typeof sub !== "string") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Subject claim (sub) is required and must be a string. Received ${JSON.stringify(sub)}.`
    });
  }
};
var assertAuthorizedPartiesClaim = (azp, authorizedParties) => {
  if (!authorizedParties || authorizedParties.length === 0) {
    return;
  }
  if (!azp || !authorizedParties.includes(azp)) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenInvalidAuthorizedParties,
      message: `Invalid JWT Authorized party claim (azp) ${JSON.stringify(azp)}. Expected "${authorizedParties}".`
    });
  }
};
var assertIssuerClaim = (iss, issuer) => {
  const issuerList = [issuer].flat().filter((i) => !!i);
  if (issuerList.length === 0) {
    return;
  }
  if (typeof iss !== "string" || !issuerList.includes(iss)) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalidIssuer,
      message: `Invalid JWT issuer claim (iss) ${JSON.stringify(iss)}. Expected "${issuerList}".`
    });
  }
};
var assertExpirationClaim = (exp, clockSkewInMs) => {
  if (typeof exp !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT expiry date claim (exp) ${JSON.stringify(exp)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const expiryDate = /* @__PURE__ */ new Date(0);
  expiryDate.setUTCSeconds(exp);
  const expired = expiryDate.getTime() <= currentDate.getTime() - clockSkewInMs;
  if (expired) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenExpired,
      message: `JWT is expired. Expiry date: ${expiryDate.toUTCString()}, Current date: ${currentDate.toUTCString()}.`
    });
  }
};
var assertActivationClaim = (nbf, clockSkewInMs) => {
  if (typeof nbf === "undefined") {
    return;
  }
  if (typeof nbf !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT not before date claim (nbf) ${JSON.stringify(nbf)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const notBeforeDate = /* @__PURE__ */ new Date(0);
  notBeforeDate.setUTCSeconds(nbf);
  const early = notBeforeDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (early) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenNotActiveYet,
      message: `JWT cannot be used prior to not before date claim (nbf). Not before date: ${notBeforeDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
var assertIssuedAtClaim = (iat, clockSkewInMs) => {
  if (typeof iat === "undefined") {
    return;
  }
  if (typeof iat !== "number") {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Invalid JWT issued at date claim (iat) ${JSON.stringify(iat)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const issuedAtDate = /* @__PURE__ */ new Date(0);
  issuedAtDate.setUTCSeconds(iat);
  const postIssued = issuedAtDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (postIssued) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenIatInTheFuture,
      message: `JWT issued at date claim (iat) is in the future. Issued at date: ${issuedAtDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
function pemToBuffer(secret) {
  const trimmed = secret.replace(/-----BEGIN.*?-----/g, "").replace(/-----END.*?-----/g, "").replace(/\s/g, "");
  const decoded = isomorphicAtob(trimmed);
  const buffer = new ArrayBuffer(decoded.length);
  const bufView = new Uint8Array(buffer);
  for (let i = 0, strLen = decoded.length; i < strLen; i++) {
    bufView[i] = decoded.charCodeAt(i);
  }
  return bufView;
}
function importKey(key, algorithm, keyUsage) {
  if (typeof key === "object") {
    return runtime.crypto.subtle.importKey("jwk", key, algorithm, false, [keyUsage]);
  }
  const keyData = pemToBuffer(key);
  const format = keyUsage === "sign" ? "pkcs8" : "spki";
  return runtime.crypto.subtle.importKey(format, keyData, algorithm, false, [keyUsage]);
}
var DEFAULT_CLOCK_SKEW_IN_MS = 5 * 1e3;
async function hasValidSignature(jwt, key) {
  const { header, signature, raw } = jwt;
  const encoder = new TextEncoder();
  const data = encoder.encode([raw.header, raw.payload].join("."));
  const algorithm = getCryptoAlgorithm(header.alg);
  try {
    const cryptoKey = await importKey(key, algorithm, "verify");
    const verified = await runtime.crypto.subtle.verify(
      algorithm.name,
      cryptoKey,
      signature,
      data
    );
    return { data: verified };
  } catch (error) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalidSignature,
          message: error?.message
        })
      ]
    };
  }
}
function decodeJwt(token) {
  const tokenParts = (token || "").toString().split(".");
  if (tokenParts.length !== 3) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalid,
          message: `Invalid JWT form. A JWT consists of three parts separated by dots.`
        })
      ]
    };
  }
  const [rawHeader, rawPayload, rawSignature] = tokenParts;
  const decoder = new TextDecoder();
  let header, payload, signature;
  try {
    header = JSON.parse(decoder.decode(base64url.parse(rawHeader, { loose: true })));
    payload = JSON.parse(decoder.decode(base64url.parse(rawPayload, { loose: true })));
    signature = base64url.parse(rawSignature, { loose: true });
  } catch {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalid,
          message: `Invalid JWT form. The header, payload, or signature could not be decoded.`
        })
      ]
    };
  }
  const data = {
    header,
    payload,
    signature,
    raw: {
      header: rawHeader,
      payload: rawPayload,
      signature: rawSignature,
      text: token
    }
  };
  return { data };
}
async function verifyJwt(token, options) {
  const { audience, authorizedParties, clockSkewInMs, issuer, key, headerType } = options;
  const clockSkew = typeof clockSkewInMs === "number" && Number.isFinite(clockSkewInMs) ? clockSkewInMs : DEFAULT_CLOCK_SKEW_IN_MS;
  const { data: decoded, errors } = decodeJwt(token);
  if (errors) {
    return { errors };
  }
  const { header, payload } = decoded;
  try {
    const { typ, alg } = header;
    assertHeaderType(typ, headerType);
    assertHeaderAlgorithm(alg);
  } catch (err) {
    return { errors: [err] };
  }
  const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
  if (signatureErrors) {
    return {
      errors: [
        new TokenVerificationError({
          action: TokenVerificationErrorAction.EnsureClerkJWT,
          reason: TokenVerificationErrorReason.TokenVerificationFailed,
          message: `Error verifying JWT signature. ${signatureErrors[0]}`
        })
      ]
    };
  }
  if (!signatureValid) {
    return {
      errors: [
        new TokenVerificationError({
          reason: TokenVerificationErrorReason.TokenInvalidSignature,
          message: "JWT signature is invalid."
        })
      ]
    };
  }
  try {
    const { azp, sub, aud, iss, iat, exp, nbf } = payload;
    assertSubClaim(sub);
    assertAudienceClaim(aud, audience);
    assertAuthorizedPartiesClaim(azp, authorizedParties);
    assertIssuerClaim(iss, issuer);
    assertExpirationClaim(exp, clockSkew);
    assertActivationClaim(nbf, clockSkew);
    assertIssuedAtClaim(iat, clockSkew);
  } catch (err) {
    return { errors: [err] };
  }
  return { data: payload };
}

// node_modules/@clerk/backend/dist/chunk-TOROEX6P.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// node_modules/@clerk/shared/dist/buildAccountsBaseUrl.mjs
function buildAccountsBaseUrl(frontendApi) {
  if (!frontendApi) return "";
  return `https://${frontendApi.replace(/clerk\.accountsstage\./, "accountsstage.").replace(/clerk\.accounts\.|clerk\./, "accounts.")}`;
}

// node_modules/@clerk/shared/dist/logger.mjs
var loggedMessages = /* @__PURE__ */ new Set();
var logger = {
  /**
  * A custom logger that ensures messages are logged only once.
  * Reduces noise and duplicated messages when logs are in a hot codepath.
  */
  warnOnce: (msg) => {
    if (loggedMessages.has(msg)) return;
    loggedMessages.add(msg);
    console.warn(msg);
  },
  logOnce: (msg) => {
    if (loggedMessages.has(msg)) return;
    console.log(msg);
    loggedMessages.add(msg);
  }
};

// node_modules/@clerk/shared/dist/underscore.mjs
function snakeToCamel(str) {
  return str ? str.replace(/([-_][a-z])/g, (match2) => match2.toUpperCase().replace(/-|_/, "")) : "";
}
function camelToSnake(str) {
  return str ? str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) : "";
}
var createDeepObjectTransformer = (transform) => {
  const deepTransform = (obj) => {
    if (!obj) return obj;
    if (Array.isArray(obj)) return obj.map((el) => {
      if (typeof el === "object" || Array.isArray(el)) return deepTransform(el);
      return el;
    });
    const copy = { ...obj };
    const keys = Object.keys(copy);
    for (const oldName of keys) {
      const newName = transform(oldName.toString());
      if (newName !== oldName) {
        copy[newName] = copy[oldName];
        delete copy[oldName];
      }
      if (typeof copy[newName] === "object") copy[newName] = deepTransform(copy[newName]);
    }
    return copy;
  };
  return deepTransform;
};
var deepCamelToSnake = createDeepObjectTransformer(camelToSnake);
var deepSnakeToCamel = createDeepObjectTransformer(snakeToCamel);
function isTruthy(value) {
  if (typeof value === `boolean`) return value;
  if (value === void 0 || value === null) return false;
  if (typeof value === `string`) {
    if (value.toLowerCase() === `true`) return true;
    if (value.toLowerCase() === `false`) return false;
  }
  const number = parseInt(value, 10);
  if (isNaN(number)) return false;
  if (number > 0) return true;
  return false;
}

// node_modules/@clerk/shared/dist/proxy.mjs
var AUTO_PROXY_HOST_SUFFIXES = [".vercel.app"];
var AUTO_PROXY_PATH = "/__clerk";
function shouldAutoProxy(hostname) {
  return AUTO_PROXY_HOST_SUFFIXES.some((hostSuffix) => hostname?.endsWith(hostSuffix)) ?? false;
}
function getDefaultEnvironment() {
  return typeof process !== "undefined" && process.env ? process.env : {};
}
function isAutoProxyDisabledFromEnvironment(environment = getDefaultEnvironment()) {
  return isTruthy(environment.CLERK_DISABLE_AUTO_PROXY);
}
function normalizeHostname(hostnameOrUrl) {
  if (hostnameOrUrl.startsWith("http://") || hostnameOrUrl.startsWith("https://")) try {
    return new URL(hostnameOrUrl).hostname;
  } catch {
    return "";
  }
  return hostnameOrUrl.split("/")[0] || "";
}
function getAutoProxyUrlFromEnvironment({ publishableKey, hasDomain = false, hasProxyUrl = false, environment = getDefaultEnvironment() }) {
  if (hasProxyUrl || hasDomain || !isProductionFromPublishableKey(publishableKey)) return "";
  if (isAutoProxyDisabledFromEnvironment(environment)) return "";
  if (environment.VERCEL_TARGET_ENV !== "production") return "";
  const vercelProductionHostname = environment.VERCEL_PROJECT_PRODUCTION_URL;
  if (!vercelProductionHostname || !shouldAutoProxy(normalizeHostname(vercelProductionHostname))) return "";
  return AUTO_PROXY_PATH;
}

// node_modules/@clerk/shared/dist/authorization.mjs
var TYPES_TO_OBJECTS = {
  strict_mfa: {
    afterMinutes: 10,
    level: "multi_factor"
  },
  strict: {
    afterMinutes: 10,
    level: "second_factor"
  },
  moderate: {
    afterMinutes: 60,
    level: "second_factor"
  },
  lax: {
    afterMinutes: 1440,
    level: "second_factor"
  }
};
var ALLOWED_LEVELS = /* @__PURE__ */ new Set([
  "first_factor",
  "second_factor",
  "multi_factor"
]);
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
  "strict_mfa",
  "strict",
  "moderate",
  "lax"
]);
var ORG_SCOPES = /* @__PURE__ */ new Set([
  "o",
  "org",
  "organization"
]);
var USER_SCOPES = /* @__PURE__ */ new Set(["u", "user"]);
var isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
var isValidLevel = (level) => ALLOWED_LEVELS.has(level);
var isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
var isValidFactorAge = (x) => typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
var prefixWithOrg = (value) => value.replace(/^(org:)*/, "org:");
var checkOrgAuthorization = (params, options) => {
  const { orgId, orgRole, orgPermissions } = options;
  const roleAsked = params.role !== void 0;
  const permissionAsked = params.permission !== void 0;
  if (!roleAsked && !permissionAsked) return "skip";
  if (roleAsked && typeof params.role !== "string") return "fail";
  if (permissionAsked && typeof params.permission !== "string") return "fail";
  if (!orgId) return "fail";
  if (roleAsked) {
    if (typeof orgRole !== "string" || !orgRole) return "fail";
    if (prefixWithOrg(orgRole) !== prefixWithOrg(params.role)) return "fail";
  }
  if (permissionAsked) {
    if (!Array.isArray(orgPermissions)) return "fail";
    if (!orgPermissions.includes(prefixWithOrg(params.permission))) return "fail";
  }
  return "pass";
};
var checkForFeatureOrPlan = (claim, featureOrPlan) => {
  const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
  const [rawScope, rawId] = featureOrPlan.split(":");
  const hasExplicitScope = rawId !== void 0;
  const scope = rawScope;
  const id = rawId || rawScope;
  if (hasExplicitScope && !ORG_SCOPES.has(scope) && !USER_SCOPES.has(scope)) throw new Error(`Invalid scope: ${scope}`);
  if (hasExplicitScope) {
    if (ORG_SCOPES.has(scope)) return orgFeatures.includes(id);
    if (USER_SCOPES.has(scope)) return userFeatures.includes(id);
  }
  return [...orgFeatures, ...userFeatures].includes(id);
};
var checkBillingAuthorization = (params, options) => {
  const { features, plans } = options;
  const featureAsked = params.feature !== void 0;
  const planAsked = params.plan !== void 0;
  if (!featureAsked && !planAsked) return "skip";
  if (featureAsked && typeof params.feature !== "string") return "fail";
  if (planAsked && typeof params.plan !== "string") return "fail";
  if (featureAsked) {
    if (typeof features !== "string" || !features) return "fail";
    try {
      if (!checkForFeatureOrPlan(features, params.feature)) return "fail";
    } catch {
      return "fail";
    }
  }
  if (planAsked) {
    if (typeof plans !== "string" || !plans) return "fail";
    try {
      if (!checkForFeatureOrPlan(plans, params.plan)) return "fail";
    } catch {
      return "fail";
    }
  }
  return "pass";
};
var splitByScope = (fea) => {
  const org = [];
  const user = [];
  if (!fea) return {
    org,
    user
  };
  const parts = fea.split(",");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const colonIndex = part.indexOf(":");
    if (colonIndex === -1) throw new Error(`Invalid claim element (missing colon): ${part}`);
    const scope = part.slice(0, colonIndex);
    const value = part.slice(colonIndex + 1);
    if (scope === "o") org.push(value);
    else if (scope === "u") user.push(value);
    else if (scope === "ou" || scope === "uo") {
      org.push(value);
      user.push(value);
    }
  }
  return {
    org,
    user
  };
};
var validateReverificationConfig = (config) => {
  if (!config) return false;
  const convertConfigToObject = (config2) => {
    if (typeof config2 === "string") return TYPES_TO_OBJECTS[config2];
    return config2;
  };
  const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
  const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
  if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
  return false;
};
var checkReverificationAuthorization = (params, { factorVerificationAge }) => {
  if (params.reverification === void 0) return "skip";
  if (!factorVerificationAge) return "fail";
  if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge(factorVerificationAge[0]) || !isValidFactorAge(factorVerificationAge[1])) return "fail";
  const getConfig = validateReverificationConfig(params.reverification);
  if (!getConfig) return "fail";
  const { level, afterMinutes } = getConfig();
  const [factor1Age, factor2Age] = factorVerificationAge;
  if (factor1Age === -1 && factor2Age === -1) return "fail";
  const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
  const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
  switch (level) {
    case "first_factor":
      return factor1FreshEnough ? "pass" : "fail";
    case "second_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
      return factor2FreshEnough ? "pass" : "fail";
    case "multi_factor":
      if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
      if (factor1Age === -1) return "fail";
      return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
  }
};
var combine = (results) => results.some((r) => r === "pass") && results.every((r) => r === "pass" || r === "skip");
var createCheckAuthorization = (options) => {
  return (params) => {
    if (!options.userId) return false;
    return combine([
      checkOrgAuthorization(params, options),
      checkBillingAuthorization(params, options),
      checkReverificationAuthorization(params, options)
    ]);
  };
};

// node_modules/@clerk/shared/dist/jwtPayloadParser.mjs
var decimalToBinaryBits = (decimal, minimumLength) => {
  if (!/^\d+$/.test(decimal)) return;
  let remaining = decimal.replace(/^0+/, "") || "0";
  const bits = [];
  while (remaining !== "0") {
    let quotient = "";
    let remainder = 0;
    for (let i = 0; i < remaining.length; i++) {
      const value = remainder * 10 + remaining.charCodeAt(i) - 48;
      const quotientDigit = Math.floor(value / 2);
      if (quotient || quotientDigit !== 0) quotient += quotientDigit;
      remainder = value % 2;
    }
    bits.push(remainder);
    remaining = quotient || "0";
  }
  if (bits.length === 0) bits.push(0);
  while (bits.length < minimumLength) bits.push(0);
  return bits;
};
var parsePermissions = ({ per, fpm }) => {
  if (!per || !fpm) return {
    permissions: [],
    featurePermissionMap: []
  };
  const permissions = per.split(",").map((p) => p.trim());
  return {
    permissions,
    featurePermissionMap: fpm.split(",").map((permission) => decimalToBinaryBits(permission.trim(), permissions.length) ?? [])
  };
};
function buildOrgPermissions({ features, permissions, featurePermissionMap }) {
  if (!features || !permissions || !featurePermissionMap) return [];
  const orgPermissions = [];
  for (let featureIndex = 0; featureIndex < features.length; featureIndex++) {
    const feature = features[featureIndex];
    if (featureIndex >= featurePermissionMap.length) continue;
    const permissionBits = featurePermissionMap[featureIndex];
    if (!permissionBits) continue;
    for (let permIndex = 0; permIndex < permissionBits.length && permIndex < permissions.length; permIndex++) if (permissionBits[permIndex] === 1) orgPermissions.push(`org:${feature}:${permissions[permIndex]}`);
  }
  return orgPermissions;
}
var __experimental_JWTPayloadToAuthObjectProperties = (claims) => {
  let orgId;
  let orgRole;
  let orgSlug;
  let orgPermissions;
  const factorVerificationAge = claims.fva ?? null;
  const sessionStatus = claims.sts ?? null;
  switch (claims.v) {
    case 2:
      if (claims.o) {
        orgId = claims.o?.id;
        orgSlug = claims.o?.slg;
        if (claims.o?.rol) orgRole = `org:${claims.o?.rol}`;
        const { org } = splitByScope(claims.fea);
        const { permissions, featurePermissionMap } = parsePermissions({
          per: claims.o?.per,
          fpm: claims.o?.fpm
        });
        orgPermissions = buildOrgPermissions({
          features: org,
          featurePermissionMap,
          permissions
        });
      }
      break;
    default:
      orgId = claims.org_id;
      orgRole = claims.org_role;
      orgSlug = claims.org_slug;
      orgPermissions = claims.org_permissions;
      break;
  }
  return {
    sessionClaims: claims,
    sessionId: claims.sid,
    sessionStatus,
    actor: claims.act,
    userId: claims.sub,
    orgId,
    orgRole,
    orgSlug,
    orgPermissions,
    factorVerificationAge
  };
};

// node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs
function _(r) {
  for (var n = [], e = 0; e < r.length; ) {
    var a = r[e];
    if (a === "*" || a === "+" || a === "?") {
      n.push({
        type: "MODIFIER",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "\\") {
      n.push({
        type: "ESCAPED_CHAR",
        index: e++,
        value: r[e++]
      });
      continue;
    }
    if (a === "{") {
      n.push({
        type: "OPEN",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === "}") {
      n.push({
        type: "CLOSE",
        index: e,
        value: r[e++]
      });
      continue;
    }
    if (a === ":") {
      for (var u = "", t = e + 1; t < r.length; ) {
        var c = r.charCodeAt(t);
        if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95) {
          u += r[t++];
          continue;
        }
        break;
      }
      if (!u) throw new TypeError("Missing parameter name at ".concat(e));
      n.push({
        type: "NAME",
        index: e,
        value: u
      }), e = t;
      continue;
    }
    if (a === "(") {
      var o = 1, m = "", t = e + 1;
      if (r[t] === "?") throw new TypeError('Pattern cannot start with "?" at '.concat(t));
      for (; t < r.length; ) {
        if (r[t] === "\\") {
          m += r[t++] + r[t++];
          continue;
        }
        if (r[t] === ")") {
          if (o--, o === 0) {
            t++;
            break;
          }
        } else if (r[t] === "(" && (o++, r[t + 1] !== "?")) throw new TypeError("Capturing groups are not allowed at ".concat(t));
        m += r[t++];
      }
      if (o) throw new TypeError("Unbalanced pattern at ".concat(e));
      if (!m) throw new TypeError("Missing pattern at ".concat(e));
      n.push({
        type: "PATTERN",
        index: e,
        value: m
      }), e = t;
      continue;
    }
    n.push({
      type: "CHAR",
      index: e,
      value: r[e++]
    });
  }
  return n.push({
    type: "END",
    index: e,
    value: ""
  }), n;
}
function F(r, n) {
  n === void 0 && (n = {});
  for (var e = _(r), a = n.prefixes, u = a === void 0 ? "./" : a, t = n.delimiter, c = t === void 0 ? "/#?" : t, o = [], m = 0, h = 0, p = "", f = function(l) {
    if (h < e.length && e[h].type === l) return e[h++].value;
  }, w = function(l) {
    var v = f(l);
    if (v !== void 0) return v;
    var E = e[h], N = E.type, S = E.index;
    throw new TypeError("Unexpected ".concat(N, " at ").concat(S, ", expected ").concat(l));
  }, d = function() {
    for (var l = "", v; v = f("CHAR") || f("ESCAPED_CHAR"); ) l += v;
    return l;
  }, M = function(l) {
    for (var v = 0, E = c; v < E.length; v++) {
      var N = E[v];
      if (l.indexOf(N) > -1) return true;
    }
    return false;
  }, A = function(l) {
    var v = o[o.length - 1], E = l || (v && typeof v == "string" ? v : "");
    if (v && !E) throw new TypeError('Must have text between two parameters, missing text after "'.concat(v.name, '"'));
    return !E || M(E) ? "[^".concat(s(c), "]+?") : "(?:(?!".concat(s(E), ")[^").concat(s(c), "])+?");
  }; h < e.length; ) {
    var T = f("CHAR"), x = f("NAME"), C = f("PATTERN");
    if (x || C) {
      var g = T || "";
      u.indexOf(g) === -1 && (p += g, g = ""), p && (o.push(p), p = ""), o.push({
        name: x || m++,
        prefix: g,
        suffix: "",
        pattern: C || A(g),
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    var i = T || f("ESCAPED_CHAR");
    if (i) {
      p += i;
      continue;
    }
    p && (o.push(p), p = "");
    if (f("OPEN")) {
      var g = d(), y = f("NAME") || "", O = f("PATTERN") || "", b = d();
      w("CLOSE"), o.push({
        name: y || (O ? m++ : ""),
        pattern: y && !O ? A(g) : O,
        prefix: g,
        suffix: b,
        modifier: f("MODIFIER") || ""
      });
      continue;
    }
    w("END");
  }
  return o;
}
function H(r, n) {
  var e = [];
  return I(P(r, e, n), e, n);
}
function I(r, n, e) {
  e === void 0 && (e = {});
  var a = e.decode, u = a === void 0 ? function(t) {
    return t;
  } : a;
  return function(t) {
    var c = r.exec(t);
    if (!c) return false;
    for (var o = c[0], m = c.index, h = /* @__PURE__ */ Object.create(null), p = function(w) {
      if (c[w] === void 0) return "continue";
      var d = n[w - 1];
      d.modifier === "*" || d.modifier === "+" ? h[d.name] = c[w].split(d.prefix + d.suffix).map(function(M) {
        return u(M, d);
      }) : h[d.name] = u(c[w], d);
    }, f = 1; f < c.length; f++) p(f);
    return {
      path: o,
      index: m,
      params: h
    };
  };
}
function s(r) {
  return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function D(r) {
  return r && r.sensitive ? "" : "i";
}
function $(r, n) {
  if (!n) return r;
  for (var e = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, u = e.exec(r.source); u; ) n.push({
    name: u[1] || a++,
    prefix: "",
    suffix: "",
    modifier: "",
    pattern: ""
  }), u = e.exec(r.source);
  return r;
}
function W(r, n, e) {
  var a = r.map(function(u) {
    return P(u, n, e).source;
  });
  return new RegExp("(?:".concat(a.join("|"), ")"), D(e));
}
function L(r, n, e) {
  return U(F(r, e), n, e);
}
function U(r, n, e) {
  e === void 0 && (e = {});
  for (var a = e.strict, u = a === void 0 ? false : a, t = e.start, c = t === void 0 ? true : t, o = e.end, m = o === void 0 ? true : o, h = e.encode, p = h === void 0 ? function(v) {
    return v;
  } : h, f = e.delimiter, w = f === void 0 ? "/#?" : f, d = e.endsWith, M = d === void 0 ? "" : d, A = "[".concat(s(M), "]|$"), T = "[".concat(s(w), "]"), x = c ? "^" : "", C = 0, g = r; C < g.length; C++) {
    var i = g[C];
    if (typeof i == "string") x += s(p(i));
    else {
      var R = s(p(i.prefix)), y = s(p(i.suffix));
      if (i.pattern) if (n && n.push(i), R || y) if (i.modifier === "+" || i.modifier === "*") {
        var O = i.modifier === "*" ? "?" : "";
        x += "(?:".concat(R, "((?:").concat(i.pattern, ")(?:").concat(y).concat(R, "(?:").concat(i.pattern, "))*)").concat(y, ")").concat(O);
      } else x += "(?:".concat(R, "(").concat(i.pattern, ")").concat(y, ")").concat(i.modifier);
      else {
        if (i.modifier === "+" || i.modifier === "*") throw new TypeError('Can not repeat "'.concat(i.name, '" without a prefix and suffix'));
        x += "(".concat(i.pattern, ")").concat(i.modifier);
      }
      else x += "(?:".concat(R).concat(y, ")").concat(i.modifier);
    }
  }
  if (m) u || (x += "".concat(T, "?")), x += e.endsWith ? "(?=".concat(A, ")") : "$";
  else {
    var b = r[r.length - 1], l = typeof b == "string" ? T.indexOf(b[b.length - 1]) > -1 : b === void 0;
    u || (x += "(?:".concat(T, "(?=").concat(A, "))?")), l || (x += "(?=".concat(T, "|").concat(A, ")"));
  }
  return new RegExp(x, D(e));
}
function P(r, n, e) {
  return r instanceof RegExp ? $(r, n) : Array.isArray(r) ? W(r, n, e) : L(r, n, e);
}
function match(str, options) {
  try {
    return H(str, options);
  } catch (e) {
    throw new Error(`Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x
${e.message}`);
  }
}

// node_modules/@clerk/backend/dist/chunk-BEWRUSPG.mjs
var require_dist = __commonJS({
  "../../node_modules/.pnpm/cookie@1.1.1/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});
var API_URL = "https://api.clerk.com";
var API_VERSION = "v1";
var USER_AGENT = `${"@clerk/backend"}@${"3.26.1"}`;
var MAX_CACHE_LAST_UPDATED_AT_SECONDS = 5 * 60;
var SUPPORTED_BAPI_VERSION = "2026-05-12";
var Attributes = {
  AuthToken: "__clerkAuthToken",
  AuthSignature: "__clerkAuthSignature",
  AuthStatus: "__clerkAuthStatus",
  AuthReason: "__clerkAuthReason",
  AuthMessage: "__clerkAuthMessage",
  ClerkUrl: "__clerkUrl"
};
var Cookies = {
  Session: "__session",
  Refresh: "__refresh",
  ClientUat: "__client_uat",
  Handshake: "__clerk_handshake",
  DevBrowser: "__clerk_db_jwt",
  RedirectCount: "__clerk_redirect_count",
  HandshakeNonce: "__clerk_handshake_nonce"
};
var QueryParameters = {
  ClerkSynced: "__clerk_synced",
  SuffixedCookies: "suffixed_cookies",
  ClerkRedirectUrl: "__clerk_redirect_url",
  // use the reference to Cookies to indicate that it's the same value
  DevBrowser: Cookies.DevBrowser,
  Handshake: Cookies.Handshake,
  HandshakeHelp: "__clerk_help",
  LegacyDevBrowser: "__dev_session",
  HandshakeReason: "__clerk_hs_reason",
  HandshakeNonce: Cookies.HandshakeNonce,
  HandshakeFormat: "format",
  Session: "__session"
};
var Headers2 = {
  Accept: "accept",
  AuthMessage: "x-clerk-auth-message",
  Authorization: "authorization",
  AuthReason: "x-clerk-auth-reason",
  AuthSignature: "x-clerk-auth-signature",
  AuthStatus: "x-clerk-auth-status",
  AuthToken: "x-clerk-auth-token",
  CacheControl: "cache-control",
  ClerkRedirectTo: "x-clerk-redirect-to",
  ClerkRequestData: "x-clerk-request-data",
  ClerkUrl: "x-clerk-clerk-url",
  CloudFrontForwardedProto: "cloudfront-forwarded-proto",
  ContentType: "content-type",
  ContentSecurityPolicy: "content-security-policy",
  ContentSecurityPolicyReportOnly: "content-security-policy-report-only",
  EnableDebug: "x-clerk-debug",
  ForwardedHost: "x-forwarded-host",
  ForwardedPort: "x-forwarded-port",
  ForwardedProto: "x-forwarded-proto",
  Host: "host",
  Location: "location",
  Nonce: "x-nonce",
  Origin: "origin",
  Referrer: "referer",
  SecFetchDest: "sec-fetch-dest",
  SecFetchSite: "sec-fetch-site",
  UserAgent: "user-agent",
  ReportingEndpoints: "reporting-endpoints"
};
var ContentTypes = {
  Json: "application/json"
};
var ClerkSyncStatus = {
  /** Not synced - satellite needs handshake after returning from primary sign-in */
  NeedsSync: "false",
  /** Sync completed - prevents re-sync loop after handshake completes */
  Completed: "true"
};
var constants = {
  Attributes,
  Cookies,
  Headers: Headers2,
  ContentTypes,
  QueryParameters,
  ClerkSyncStatus
};
function mergePreDefinedOptions(preDefinedOptions, options) {
  return Object.keys(preDefinedOptions).reduce(
    (obj, key) => {
      return { ...obj, [key]: options[key] || obj[key] };
    },
    { ...preDefinedOptions }
  );
}
function assertValidSecretKey(val) {
  if (!val || typeof val !== "string") {
    throw Error("Missing Clerk Secret Key. Go to https://dashboard.clerk.com and get your key for your instance.");
  }
}
function assertValidPublishableKey(val) {
  parsePublishableKey(val, { fatal: true });
}
var TokenType = {
  SessionToken: "session_token",
  ApiKey: "api_key",
  M2MToken: "m2m_token",
  OAuthToken: "oauth_token"
};
var AuthenticateContext = class {
  constructor(cookieSuffix, clerkRequest, options) {
    this.cookieSuffix = cookieSuffix;
    this.clerkRequest = clerkRequest;
    this.originalFrontendApi = "";
    const autoProxyPath = getAutoProxyUrlFromEnvironment({
      publishableKey: options.publishableKey ?? "",
      hasProxyUrl: !!options.proxyUrl,
      hasDomain: !!options.domain
    });
    if (autoProxyPath) {
      options = { ...options, proxyUrl: `${clerkRequest.clerkUrl.origin}${autoProxyPath}` };
    }
    if (options.acceptsToken === TokenType.M2MToken || options.acceptsToken === TokenType.ApiKey) {
      this.initHeaderValues();
    } else {
      this.initPublishableKeyValues(options);
      this.initHeaderValues();
      this.initCookieValues();
      this.initHandshakeValues();
    }
    Object.assign(this, options);
    this.clerkUrl = this.clerkRequest.clerkUrl;
    if (this.proxyUrl?.startsWith("/")) {
      this.proxyUrl = `${this.clerkUrl.origin}${this.proxyUrl}`;
    }
  }
  /**
   * Gets the session token from either the cookie or the header.
   *
   * @returns {string | undefined} The session token if available, otherwise undefined.
   */
  get sessionToken() {
    return this.sessionTokenInCookie || this.tokenInHeader;
  }
  usesSuffixedCookies() {
    const suffixedClientUat = this.getSuffixedCookie(constants.Cookies.ClientUat);
    const clientUat = this.getCookie(constants.Cookies.ClientUat);
    const suffixedSession = this.getSuffixedCookie(constants.Cookies.Session) || "";
    const session = this.getCookie(constants.Cookies.Session) || "";
    if (session && !this.tokenHasIssuer(session)) {
      return false;
    }
    if (session && !this.tokenBelongsToInstance(session)) {
      return true;
    }
    if (!suffixedClientUat && !suffixedSession) {
      return false;
    }
    const { data: sessionData } = decodeJwt(session);
    const sessionIat = sessionData?.payload.iat || 0;
    const { data: suffixedSessionData } = decodeJwt(suffixedSession);
    const suffixedSessionIat = suffixedSessionData?.payload.iat || 0;
    if (suffixedClientUat !== "0" && clientUat !== "0" && sessionIat > suffixedSessionIat) {
      return false;
    }
    if (suffixedClientUat === "0" && clientUat !== "0") {
      return false;
    }
    if (this.instanceType !== "production") {
      const isSuffixedSessionExpired = this.sessionExpired(suffixedSessionData);
      if (suffixedClientUat !== "0" && clientUat === "0" && isSuffixedSessionExpired) {
        return false;
      }
    }
    if (!suffixedClientUat && suffixedSession) {
      return false;
    }
    return true;
  }
  /**
   * Determines if the request came from a different origin based on the referrer header.
   * Used for cross-origin detection in multi-domain authentication flows.
   *
   * @returns {boolean} True if referrer exists and is from a different origin, false otherwise.
   */
  isCrossOriginReferrer() {
    if (!this.referrer || !this.clerkUrl.origin) {
      return false;
    }
    try {
      const referrerOrigin = new URL(this.referrer).origin;
      return referrerOrigin !== this.clerkUrl.origin;
    } catch {
      return false;
    }
  }
  /**
   * Determines if the referrer URL is from a Clerk domain: the instance's FAPI domain, the accounts
   * portal derived from its frontend API, or — on non-production instances only — a development
   * account-portal domain.
   *
   * @returns {boolean} True if the referrer is a trusted Clerk domain, false otherwise
   */
  isKnownClerkReferrer() {
    if (!this.referrer) {
      return false;
    }
    try {
      const referrerOrigin = new URL(this.referrer);
      const referrerHost = referrerOrigin.hostname;
      if (this.frontendApi) {
        const fapiHost = this.frontendApi.startsWith("http") ? new URL(this.frontendApi).hostname : this.frontendApi;
        if (referrerHost === fapiHost) {
          return true;
        }
      }
      if (this.instanceType !== "production" && (isLegacyDevAccountPortalOrigin(referrerHost) || isCurrentDevAccountPortalOrigin(referrerHost))) {
        return true;
      }
      const expectedAccountsUrl = buildAccountsBaseUrl(this.frontendApi);
      if (expectedAccountsUrl) {
        const expectedAccountsOrigin = new URL(expectedAccountsUrl).origin;
        if (referrerOrigin.origin === expectedAccountsOrigin) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  initPublishableKeyValues(options) {
    assertValidPublishableKey(options.publishableKey);
    this.publishableKey = options.publishableKey;
    let resolvedProxyUrl = options.proxyUrl;
    if (resolvedProxyUrl?.startsWith("/")) {
      resolvedProxyUrl = `${this.clerkRequest.clerkUrl.origin}${resolvedProxyUrl}`;
    }
    const originalPk = parsePublishableKey(this.publishableKey, {
      fatal: true,
      domain: options.domain,
      isSatellite: options.isSatellite
    });
    this.originalFrontendApi = originalPk.frontendApi;
    const pk = parsePublishableKey(this.publishableKey, {
      fatal: true,
      proxyUrl: resolvedProxyUrl,
      domain: options.domain,
      isSatellite: options.isSatellite
    });
    this.instanceType = pk.instanceType;
    this.frontendApi = pk.frontendApi;
  }
  initHeaderValues() {
    this.method = this.clerkRequest.method;
    this.tokenInHeader = this.parseAuthorizationHeader(this.getHeader(constants.Headers.Authorization));
    this.origin = this.getHeader(constants.Headers.Origin);
    this.host = this.getHeader(constants.Headers.Host);
    this.forwardedHost = this.getHeader(constants.Headers.ForwardedHost);
    this.forwardedProto = this.getHeader(constants.Headers.CloudFrontForwardedProto) || this.getHeader(constants.Headers.ForwardedProto);
    this.referrer = this.getHeader(constants.Headers.Referrer);
    this.userAgent = this.getHeader(constants.Headers.UserAgent);
    this.secFetchDest = this.getHeader(constants.Headers.SecFetchDest);
    this.accept = this.getHeader(constants.Headers.Accept);
  }
  initCookieValues() {
    this.sessionTokenInCookie = this.getSuffixedOrUnSuffixedCookie(constants.Cookies.Session);
    this.refreshTokenInCookie = this.getSuffixedCookie(constants.Cookies.Refresh);
    this.clientUat = Number.parseInt(this.getSuffixedOrUnSuffixedCookie(constants.Cookies.ClientUat) || "") || 0;
  }
  initHandshakeValues() {
    this.devBrowserToken = this.getQueryParam(constants.QueryParameters.DevBrowser) || this.getSuffixedOrUnSuffixedCookie(constants.Cookies.DevBrowser);
    this.handshakeToken = this.getQueryParam(constants.QueryParameters.Handshake) || this.getCookie(constants.Cookies.Handshake);
    this.handshakeRedirectLoopCounter = Number(this.getCookie(constants.Cookies.RedirectCount)) || 0;
    this.handshakeNonce = this.getQueryParam(constants.QueryParameters.HandshakeNonce) || this.getCookie(constants.Cookies.HandshakeNonce);
  }
  getQueryParam(name) {
    return this.clerkRequest.clerkUrl.searchParams.get(name);
  }
  getHeader(name) {
    return this.clerkRequest.headers.get(name) || void 0;
  }
  getCookie(name) {
    return this.clerkRequest.cookies.get(name) || void 0;
  }
  getSuffixedCookie(name) {
    return this.getCookie(getSuffixedCookieName(name, this.cookieSuffix)) || void 0;
  }
  getSuffixedOrUnSuffixedCookie(cookieName) {
    if (this.usesSuffixedCookies()) {
      return this.getSuffixedCookie(cookieName);
    }
    return this.getCookie(cookieName);
  }
  parseAuthorizationHeader(authorizationHeader) {
    if (!authorizationHeader) {
      return void 0;
    }
    const [scheme, token] = authorizationHeader.split(" ", 2);
    if (!token) {
      return scheme;
    }
    if (scheme === "Bearer") {
      return token;
    }
    return void 0;
  }
  tokenHasIssuer(token) {
    const { data, errors } = decodeJwt(token);
    if (errors) {
      return false;
    }
    return !!data.payload.iss;
  }
  tokenBelongsToInstance(token) {
    if (!token) {
      return false;
    }
    const { data, errors } = decodeJwt(token);
    if (errors) {
      return false;
    }
    if (typeof data.payload.iss !== "string") {
      return false;
    }
    const tokenIssuer = data.payload.iss.replace(/https?:\/\//gi, "");
    return this.originalFrontendApi === tokenIssuer;
  }
  sessionExpired(jwt) {
    return !!jwt && jwt?.payload.exp <= Date.now() / 1e3 >> 0;
  }
};
var createAuthenticateContext = async (clerkRequest, options) => {
  const cookieSuffix = options.publishableKey ? await getCookieSuffix(options.publishableKey, runtime.crypto.subtle) : "";
  return new AuthenticateContext(cookieSuffix, clerkRequest, options);
};
var SEPARATOR = "/";
var MULTIPLE_SEPARATOR_REGEX = new RegExp("(?<!:)" + SEPARATOR + "{1,}", "g");
var MAX_DECODES = 10;
function isDotSegment(segment) {
  let candidate = segment;
  for (let i = 0; i <= MAX_DECODES; i++) {
    if (candidate.split(/[/\\]/).some((p) => p === "." || p === "..")) {
      return true;
    }
    if (i === MAX_DECODES) {
      throw new Error(`joinPaths: too many layers of encoding in ${segment}`);
    }
    try {
      const next = decodeURIComponent(candidate);
      if (next === candidate) {
        break;
      }
      candidate = next;
    } catch {
      break;
    }
  }
  return false;
}
function joinPaths(...args) {
  const result = args.filter((p) => p).join(SEPARATOR).replace(MULTIPLE_SEPARATOR_REGEX, SEPARATOR);
  for (const segment of result.split(SEPARATOR)) {
    if (isDotSegment(segment)) {
      throw new Error(`joinPaths: "." and ".." path segments are not allowed (received "${result}")`);
    }
  }
  return result;
}
var AbstractAPI = class {
  constructor(request) {
    this.request = request;
  }
  requireId(id) {
    if (!id) {
      throw new Error("A valid resource ID is required.");
    }
  }
};
var basePath = "/actor_tokens";
var ActorTokenAPI = class extends AbstractAPI {
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath,
      bodyParams: params
    });
  }
  async revoke(actorTokenId) {
    this.requireId(actorTokenId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath, actorTokenId, "revoke")
    });
  }
};
var basePath2 = "/agents/tasks";
var AgentTaskAPI = class extends AbstractAPI {
  /**
   * Creates an Agent Task that generates a URL which, when visited, creates a session for the specified user. This is useful for automated testing or agent-driven flows where full authentication isn't practical.
   * @returns The created [`AgentTask`](https://clerk.com/docs/reference/backend/types/backend-agent-task) object.
   */
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath2,
      bodyParams: params,
      options: {
        deepSnakecaseBodyParamKeys: true
      }
    });
  }
  /**
   * Revokes the given Agent Task.
   * @param agentTaskId - The ID of the Agent Task to revoke.
   * @returns The revoked [`AgentTask`](https://clerk.com/docs/reference/backend/types/backend-agent-task) object.
   */
  async revoke(agentTaskId) {
    this.requireId(agentTaskId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath2, agentTaskId, "revoke")
    });
  }
};
var basePath3 = "/accountless_applications";
var AccountlessApplicationAPI = class extends AbstractAPI {
  async createAccountlessApplication(params) {
    const headerParams = params?.requestHeaders ? Object.fromEntries(params.requestHeaders.entries()) : void 0;
    return this.request({
      method: "POST",
      path: basePath3,
      headerParams,
      queryParams: {
        source: params?.source
      }
    });
  }
  async completeAccountlessApplicationOnboarding(params) {
    const headerParams = params?.requestHeaders ? Object.fromEntries(params.requestHeaders.entries()) : void 0;
    return this.request({
      method: "POST",
      path: joinPaths(basePath3, "complete"),
      headerParams,
      queryParams: {
        source: params?.source
      }
    });
  }
};
var basePath4 = "/allowlist_identifiers";
var AllowlistIdentifierAPI = class extends AbstractAPI {
  /**
   * Gets the list of allowlist identifiers for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`AllowlistIdentifier`](https://clerk.com/docs/reference/backend/types/backend-allowlist-identifier) objects and a `totalCount` property containing the total number of allowlist identifiers for the instance.
   */
  async getAllowlistIdentifierList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath4,
      queryParams: { ...params, paginated: true }
    });
  }
  /**
   * Creates a new allowlist identifier.
   * @returns The created [`AllowlistIdentifier`](https://clerk.com/docs/reference/backend/types/backend-allowlist-identifier) object.
   */
  async createAllowlistIdentifier(params) {
    return this.request({
      method: "POST",
      path: basePath4,
      bodyParams: params
    });
  }
  /**
   * Deletes an allowlist identifier.
   * @param allowlistIdentifierId - The ID of the allowlist identifier to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteAllowlistIdentifier(allowlistIdentifierId) {
    this.requireId(allowlistIdentifierId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath4, allowlistIdentifierId)
    });
  }
};
var basePath5 = "/api_keys";
var APIKeysAPI = class extends AbstractAPI {
  /**
   * Gets a list of API keys for the given user or Organization. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) objects and a `totalCount` property containing the total number of API keys for the user or Organization.
   */
  async list(queryParams) {
    return this.request({
      method: "GET",
      path: basePath5,
      queryParams
    });
  }
  /**
   * Creates a new API key for the given user or Organization.
   * @returns The created [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) object.
   */
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath5,
      bodyParams: params
    });
  }
  /**
   * Gets the given [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) object.
   * @param apiKeyId - The ID of the API key to get.
   */
  async get(apiKeyId) {
    this.requireId(apiKeyId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath5, apiKeyId)
    });
  }
  /**
   * Updates the given API key.
   * @returns The updated [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) object.
   */
  async update(params) {
    const { apiKeyId, ...bodyParams } = params;
    this.requireId(apiKeyId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath5, apiKeyId),
      bodyParams
    });
  }
  /**
   * Deletes the given API key.
   * @param apiKeyId - The ID of the API key to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async delete(apiKeyId) {
    this.requireId(apiKeyId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath5, apiKeyId)
    });
  }
  /**
   * Revokes the given API key. This will immediately invalidate the API key and prevent it from being used to authenticate any future requests.
   * @returns The revoked [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) object.
   */
  async revoke(params) {
    const { apiKeyId, revocationReason = null } = params;
    this.requireId(apiKeyId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath5, apiKeyId, "revoke"),
      bodyParams: { revocationReason }
    });
  }
  /**
   * Gets the secret of the given API key.
   * @param apiKeyId - The ID of the API key to get the secret of.
   */
  async getSecret(apiKeyId) {
    this.requireId(apiKeyId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath5, apiKeyId, "secret")
    });
  }
  /**
   * Verifies the given API key.
   * - If the API key is valid, the method returns the API key object with its properties.
   * - If the API key is invalid, revoked, or expired, the method will throw an error.
   * @param secret - The secret of the API key to verify.
   * @returns The verified [`APIKey`](https://clerk.com/docs/reference/backend/types/backend-api-key) object.
   */
  async verify(secret) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath5, "verify"),
      bodyParams: { secret }
    });
  }
};
var basePath6 = "/beta_features";
var BetaFeaturesAPI = class extends AbstractAPI {
  /**
   * Change the domain of a production instance.
   *
   * Changing the domain requires updating the DNS records accordingly, deploying new SSL certificates,
   * updating your Social Connection's redirect URLs and setting the new keys in your code.
   *
   * @remarks
   * WARNING: Changing your domain will invalidate all current user sessions (i.e. users will be logged out).
   *          Also, while your application is being deployed, a small downtime is expected to occur.
   */
  async changeDomain(params) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath6, "change_domain"),
      bodyParams: params
    });
  }
};
var basePath7 = "/blocklist_identifiers";
var BlocklistIdentifierAPI = class extends AbstractAPI {
  async getBlocklistIdentifierList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath7,
      queryParams: params
    });
  }
  async createBlocklistIdentifier(params) {
    return this.request({
      method: "POST",
      path: basePath7,
      bodyParams: params
    });
  }
  async deleteBlocklistIdentifier(blocklistIdentifierId) {
    this.requireId(blocklistIdentifierId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath7, blocklistIdentifierId)
    });
  }
};
var basePath8 = "/clients";
var ClientAPI = class extends AbstractAPI {
  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   */
  async getClientList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath8,
      queryParams: { ...params, paginated: true }
    });
  }
  /**
   * Gets the given [`Client`](https://clerk.com/docs/reference/backend/types/backend-client).
   * @param clientId - The ID of the client to get.
   */
  async getClient(clientId) {
    this.requireId(clientId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath8, clientId)
    });
  }
  /**
   * Verifies the client in the given token.
   * @param token - The token to verify.
   * @returns The verified [`Client`](https://clerk.com/docs/reference/backend/types/backend-client).
   */
  verifyClient(token) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath8, "verify"),
      bodyParams: { token }
    });
  }
  /**
   * Retrieves the handshake payload for a given nonce. Used internally by Clerk's SDKs to resolve
   * session cookies during the handshake flow.
   *
   * @internal
   */
  async getHandshakePayload(queryParams) {
    return this.request({
      method: "GET",
      path: joinPaths(basePath8, "handshake_payload"),
      queryParams
    });
  }
};
var basePath9 = "/domains";
var DomainAPI = class extends AbstractAPI {
  /**
   * Gets the list of domains for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`Domain`](https://clerk.com/docs/reference/backend/types/domain) objects and a `totalCount` property containing the total number of domains for the instance.
   */
  async list() {
    return this.request({
      method: "GET",
      path: basePath9
    });
  }
  /**
   * Adds a new domain to the instance. Useful in the case of multi-domain instances, allows adding [satellite domains](https://clerk.com/docs/guides/dashboard/dns-domains/satellite-domains) to an instance.
   * @returns The created [`Domain`](https://clerk.com/docs/reference/backend/types/domain) object.
   */
  async add(params) {
    return this.request({
      method: "POST",
      path: basePath9,
      bodyParams: params
    });
  }
  /**
   * Updates a domain for the instance. Both primary and satellite domains can be updated. If you choose to use Clerk via proxy, use this endpoint to specify the `proxy_url`. Whenever you decide you'd rather switch to DNS setup for Clerk, simply set `proxy_url` to `null` for the domain.
   *
   * When you update a production instance's primary domain name, you have to make sure that you've completed all the necessary setup steps for DNS and emails to work. Expect downtime otherwise. Updating a primary domain's name will also update the instance's home origin, affecting the default application paths.
   * @returns The updated [`Domain`](https://clerk.com/docs/reference/backend/types/domain) object.
   */
  async update(params) {
    const { domainId, ...bodyParams } = params;
    this.requireId(domainId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath9, domainId),
      bodyParams
    });
  }
  /**
   * Deletes a domain for the instance. The active domain cannot be deleted.
   * @param domainId - The ID of the domain to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object).
   */
  async delete(domainId) {
    return this.deleteDomain(domainId);
  }
  /**
   * Deletes a domain for the instance. The active domain cannot be deleted.
   * @param domainId - The ID of the domain to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object).
   * @deprecated Use `delete()` instead.
   */
  async deleteDomain(domainId) {
    this.requireId(domainId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath9, domainId)
    });
  }
};
var basePath10 = "/email_addresses";
var EmailAddressAPI = class extends AbstractAPI {
  /**
   * Gets the given [`EmailAddress`](https://clerk.com/docs/reference/backend/types/backend-email-address).
   * @param emailAddressId - The ID of the email address to get.
   */
  async getEmailAddress(emailAddressId) {
    this.requireId(emailAddressId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath10, emailAddressId)
    });
  }
  /**
   * Creates a new email address for the given user.
   * @returns The created [`EmailAddress`](https://clerk.com/docs/reference/backend/types/backend-email-address) object.
   */
  async createEmailAddress(params) {
    return this.request({
      method: "POST",
      path: basePath10,
      bodyParams: params
    });
  }
  /**
   * Updates the given email address.
   * @param emailAddressId - The ID of the email address to update.
   * @param params - The parameters to update the email address.
   * @returns The updated [`EmailAddress`](https://clerk.com/docs/reference/backend/types/backend-email-address) object.
   */
  async updateEmailAddress(emailAddressId, params = {}) {
    this.requireId(emailAddressId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath10, emailAddressId),
      bodyParams: params
    });
  }
  /**
   * Deletes the given email address.
   * @param emailAddressId - The ID of the email address to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteEmailAddress(emailAddressId) {
    this.requireId(emailAddressId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath10, emailAddressId)
    });
  }
};
var Email = class _Email {
  constructor(id, fromEmailName, emailAddressId, toEmailAddress, subject, body, bodyPlain, status, slug, data, deliveredByClerk, userId, suppressionReason) {
    this.id = id;
    this.fromEmailName = fromEmailName;
    this.emailAddressId = emailAddressId;
    this.toEmailAddress = toEmailAddress;
    this.subject = subject;
    this.body = body;
    this.bodyPlain = bodyPlain;
    this.status = status;
    this.slug = slug;
    this.data = data;
    this.deliveredByClerk = deliveredByClerk;
    this.userId = userId;
    this.suppressionReason = suppressionReason;
  }
  static fromJSON(data) {
    return new _Email(
      data.id,
      data.from_email_name,
      data.email_address_id,
      data.to_email_address,
      data.subject,
      data.body,
      data.body_plain,
      data.status,
      data.slug,
      data.data,
      data.delivered_by_clerk,
      data.user_id,
      data.suppression_reason
    );
  }
};
var basePath11 = "/email";
var idempotencyKeyPattern = /^[a-zA-Z0-9_-]{1,255}$/;
function validateIdempotencyKey(idempotencyKey) {
  if (idempotencyKey !== void 0 && (typeof idempotencyKey !== "string" || !idempotencyKeyPattern.test(idempotencyKey))) {
    throw new Error(
      "Idempotency key must contain only ASCII letters, digits, underscores, and hyphens and cannot exceed 255 characters."
    );
  }
}
function emailBody(params) {
  const { to, replyTo, ...rest } = params;
  const { userId, ...recipient } = to;
  return {
    ...rest,
    to: { ...recipient, ...userId !== void 0 ? { user_id: userId } : {} },
    ...replyTo !== void 0 ? { reply_to: replyTo } : {}
  };
}
var EmailApi = class extends AbstractAPI {
  /**
   * @experimental This method calls an internal, not-yet-public endpoint and is
   * subject to change. It is advised to [pin](https://clerk.com/docs/pinning)
   * the SDK version to avoid breaking changes.
   *
   * Sends a transactional email.
   *
   * @param params - The recipient, sender, subject, and content of the email.
   * @param options - Optional request settings, including an idempotency key.
   * @returns The stored email and its current send status.
   * @throws If the idempotency key does not match the supported format.
   * @example
   * ```ts
   * const email = await clerkClient.emails.create(
   *   {
   *     to: { address: 'customer@example.com' },
   *     from: { address: 'support@example.com' },
   *     subject: 'Your receipt',
   *     html: '<p>Thanks for your order.</p>',
   *   },
   *   { idempotencyKey: 'order_123_receipt' },
   * );
   * ```
   */
  async create(params, options = {}) {
    const { idempotencyKey } = options;
    validateIdempotencyKey(idempotencyKey);
    return this.request({
      method: "POST",
      path: basePath11,
      bodyParams: emailBody(params),
      ...idempotencyKey !== void 0 ? { headerParams: { "Idempotency-Key": idempotencyKey } } : {}
    });
  }
  /**
   * @experimental Submit 1–100 emails, returning one result per input in order.
   * Each message commits independently. Use a stable `idempotencyKey` on each
   * item to safely retry an interrupted batch or retry through `emails.create`.
   * Reuse a key only with identical message parameters. The SDK does not retry
   * the batch automatically.
   * Item errors are returned alongside successes; request-level errors throw.
   *
   * @param messages - The emails to send, each with an optional idempotency key.
   * @returns One success or error result per input, in input order.
   * @throws If the batch size or an idempotency key is invalid, or the request fails.
   * @example
   * ```ts
   * const results = await clerkClient.emails.createBatch([
   *   {
   *     to: { address: 'customer@example.com' },
   *     from: { address: 'support@example.com' },
   *     subject: 'Your receipt',
   *     text: 'Thanks for your order.',
   *     idempotencyKey: 'order_123_receipt',
   *   },
   * ]);
   * for (const result of results) {
   *   if (result.email) {
   *     console.log(result.index, result.email.id);
   *   } else {
   *     console.error(result.index, result.statusCode, result.errors);
   *   }
   * }
   * ```
   */
  async createBatch(messages) {
    if (messages.length < 1 || messages.length > 100) {
      throw new Error("A batch must contain between 1 and 100 messages.");
    }
    for (const message of messages) {
      validateIdempotencyKey(message.idempotencyKey);
    }
    const results = await this.request({
      method: "POST",
      path: `${basePath11}/batch`,
      bodyParams: {
        messages: messages.map(({ idempotencyKey, ...params }) => ({
          ...emailBody(params),
          ...idempotencyKey !== void 0 ? { idempotency_key: idempotencyKey } : {}
        }))
      }
    });
    return results.map(
      (result) => result.email ? { index: result.index, email: Email.fromJSON(result.email), statusCode: result.status_code } : {
        index: result.index,
        errors: (result.errors || []).map(parseError),
        statusCode: result.status_code,
        retryAfterSeconds: result.retry_after_seconds
      }
    );
  }
  /**
   * Returns Clerk's stored send state for a transactional email. `accepted`
   * means the provider accepted the request; it does not prove delivery.
   *
   * @param emailId - The ID returned when the email was created.
   * @returns The stored email and its current send status.
   * @throws If `emailId` is empty.
   * @example
   * ```ts
   * const email = await clerkClient.emails.get('ema_123');
   * ```
   */
  async get(emailId) {
    this.requireId(emailId);
    return this.request({
      method: "GET",
      path: `${basePath11}/${emailId}`
    });
  }
};
var basePath12 = "/enterprise_connections";
var EnterpriseConnectionAPI = class extends AbstractAPI {
  /**
   * Creates a new enterprise connection.
   * @returns The created [`EnterpriseConnection`](https://clerk.com/docs/reference/backend/types/backend-enterprise-connection) object.
   */
  async createEnterpriseConnection(params) {
    return this.request({
      method: "POST",
      path: basePath12,
      bodyParams: params,
      options: {
        deepSnakecaseBodyParamKeys: true
      }
    });
  }
  /**
   * Updates the given enterprise connection.
   * @param enterpriseConnectionId - The ID of the enterprise connection to update.
   * @param params - The parameters to update the enterprise connection.
   * @returns The updated [`EnterpriseConnection`](https://clerk.com/docs/reference/backend/types/backend-enterprise-connection) object.
   */
  async updateEnterpriseConnection(enterpriseConnectionId, params) {
    this.requireId(enterpriseConnectionId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath12, enterpriseConnectionId),
      bodyParams: params,
      options: {
        deepSnakecaseBodyParamKeys: true
      }
    });
  }
  /**
   * Gets the list of enterprise connections for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`EnterpriseConnection`](https://clerk.com/docs/reference/backend/types/backend-enterprise-connection) objects and a `totalCount` property containing the total number of enterprise connections for the instance.
   */
  async getEnterpriseConnectionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath12,
      queryParams: params
    });
  }
  /**
   * Gets the given enterprise connection.
   * @param enterpriseConnectionId - The ID of the enterprise connection to get.
   * @returns The [`EnterpriseConnection`](https://clerk.com/docs/reference/backend/types/backend-enterprise-connection) object.
   */
  async getEnterpriseConnection(enterpriseConnectionId) {
    this.requireId(enterpriseConnectionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath12, enterpriseConnectionId)
    });
  }
  /**
   * Deletes the given enterprise connection.
   * @param enterpriseConnectionId - The ID of the enterprise connection to delete.
   * @returns The deleted [`EnterpriseConnection`](https://clerk.com/docs/reference/backend/types/backend-enterprise-connection) object.
   */
  async deleteEnterpriseConnection(enterpriseConnectionId) {
    this.requireId(enterpriseConnectionId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath12, enterpriseConnectionId)
    });
  }
};
var basePath13 = "/oauth_applications/access_tokens";
var IdPOAuthAccessTokenApi = class extends AbstractAPI {
  /**
   * Verifies an OAuth access token with the Clerk Backend API. If an audience is provided, at least one expected audience must match the token's `aud` claim. Without an audience, the SDK does not check the `aud` claim.
   *
   * @param accessToken - The OAuth access token to verify.
   * @param options - Optional verification options. `audience` can be one expected audience or an array of acceptable audiences.
   * @returns The verified `IdPOAuthAccessToken` resource, including its audience when present.
   * @throws `ClerkAPIResponseError` if the Backend API rejects the token or request.
   * @throws `TokenVerificationError` if an expected audience is provided but the token has no `aud` claim or none of its audiences match.
   *
   * @example
   * ### Verify a token for an API
   *
   * ```ts
   * const token = await clerkClient.idPOAuthAccessToken.verify(accessToken, {
   *   audience: 'https://api.example.com',
   * });
   * ```
   */
  async verify(accessToken, options = {}) {
    const verifiedToken = await this.request({
      method: "POST",
      path: joinPaths(basePath13, "verify"),
      bodyParams: { access_token: accessToken }
    });
    assertOAuthAudienceClaim(verifiedToken.aud, options.audience);
    return verifiedToken;
  }
};
var basePath14 = "/instance";
var InstanceAPI = class extends AbstractAPI {
  /**
   * Gets the current [`Instance`](https://clerk.com/docs/reference/backend/types/backend-instance).
   */
  async get() {
    return this.request({
      method: "GET",
      path: basePath14
    });
  }
  /**
   * Updates the current instance.
   */
  async update(params) {
    return this.request({
      method: "PATCH",
      path: basePath14,
      bodyParams: params
    });
  }
  /**
   * Updates the [restriction](https://clerk.com/docs/guides/secure/restricting-access) settings for the current instance.
   * @returns The updated [`InstanceRestrictions`](https://clerk.com/docs/reference/backend/types/backend-instance-restrictions) object.
   */
  async updateRestrictions(params) {
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath14, "restrictions"),
      bodyParams: params
    });
  }
  /**
   * Gets the [Organization-related settings](https://clerk.com/docs/guides/organizations/configure) for the current instance.
   * @returns The [`OrganizationSettings`](https://clerk.com/docs/reference/backend/types/backend-organization-settings) object.
   */
  async getOrganizationSettings() {
    return this.request({
      method: "GET",
      path: joinPaths(basePath14, "organization_settings")
    });
  }
  /**
   * Updates the [Organization-related settings](https://clerk.com/docs/guides/organizations/configure) for the current instance.
   * @returns The updated [`OrganizationSettings`](https://clerk.com/docs/reference/backend/types/backend-organization-settings) object.
   */
  async updateOrganizationSettings(params) {
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath14, "organization_settings"),
      bodyParams: params
    });
  }
};
var basePath15 = "/invitations";
var InvitationAPI = class extends AbstractAPI {
  /**
   * Gets a list of non-revoked invitations for the instance, sorted by descending creation date. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`Invitation`](https://clerk.com/docs/reference/backend/types/backend-invitation) objects and a `totalCount` property containing the total number of invitations.
   */
  async getInvitationList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath15,
      queryParams: { ...params, paginated: true }
    });
  }
  /**
   * Creates a new invitation for the given email address, and sends the invitation email.
   *
   * If an email address has already been invited or already exists in your application, trying to create a new invitation will return an error. To bypass this error and create a new invitation anyways, set `ignoreExisting` to `true`.
   * @returns The newly created [`Invitation`](https://clerk.com/docs/reference/backend/types/backend-invitation).
   */
  async createInvitation(params) {
    return this.request({
      method: "POST",
      path: basePath15,
      bodyParams: params
    });
  }
  /**
   * Creates multiple invitations for the given email addresses, and sends the invitation emails.
   *
   * If an email address has already been invited or already exists in your application, trying to create a new invitation will return an error. To bypass this error and create a new invitation anyways, set `ignoreExisting` to `true`.
   * @returns An array of each created [`Invitation`](https://clerk.com/docs/reference/backend/types/backend-invitation) object.
   */
  async createInvitationBulk(params) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath15, "bulk"),
      bodyParams: params
    });
  }
  /**
   * Revokes the given invitation.
   *
   * Revoking an invitation makes the invitation email link unusable. However, it doesn't prevent the user from signing up if they follow the sign up flow.
   *
   * Only active (i.e., non-revoked) invitations can be revoked.
   * @param invitationId - The ID of the invitation to revoke.
   * @returns The revoked [`Invitation`](https://clerk.com/docs/reference/backend/types/backend-invitation).
   */
  async revokeInvitation(invitationId) {
    this.requireId(invitationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath15, invitationId, "revoke")
    });
  }
  /**
   * Permanently deletes the given invitation and the copies of the invitation email Clerk stored for its recipient.
   *
   * Unlike revoking, deleting removes the invitation record itself, which helps honor a data erasure request from someone who was invited but never signed up. Other records that contain the same email address, such as users or organization invitations, are not affected.
   *
   * Invitations of any status can be deleted.
   * @param invitationId - The ID of the invitation to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteInvitation(invitationId) {
    this.requireId(invitationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath15, invitationId)
    });
  }
};
var basePath16 = "/machines";
var MachineApi = class extends AbstractAPI {
  /**
   * Gets the given machine.
   * @param machineId - The ID of the machine to get.
   * @returns The [`Machine`](https://clerk.com/docs/reference/backend/types/backend-machine) object.
   */
  async get(machineId) {
    this.requireId(machineId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath16, machineId)
    });
  }
  /**
   * Gets a list of machines for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`Machine`](https://clerk.com/docs/reference/backend/types/backend-machine) objects and a `totalCount` property containing the total number of machines for the instance.
   */
  async list(queryParams = {}) {
    return this.request({
      method: "GET",
      path: basePath16,
      queryParams
    });
  }
  /**
   * Creates a new machine.
   * @returns The created [`Machine`](https://clerk.com/docs/reference/backend/types/backend-machine) object.
   */
  async create(bodyParams) {
    return this.request({
      method: "POST",
      path: basePath16,
      bodyParams
    });
  }
  /**
   * Updates the given machine.
   * @returns The updated [`Machine`](https://clerk.com/docs/reference/backend/types/backend-machine) object.
   */
  async update(params) {
    const { machineId, ...bodyParams } = params;
    this.requireId(machineId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath16, machineId),
      bodyParams
    });
  }
  /**
   * Deletes the given machine.
   * @param machineId - The ID of the machine to delete.
   * @returns The [`Machine`](https://clerk.com/docs/reference/backend/types/backend-machine) object.
   */
  async delete(machineId) {
    this.requireId(machineId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath16, machineId)
    });
  }
  /**
   * Gets the secret key for the given machine.
   * @param machineId - The ID of the machine to get the secret key for.
   * @returns The machine's secret key.
   */
  async getSecretKey(machineId) {
    this.requireId(machineId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath16, machineId, "secret_key")
    });
  }
  /**
   * Rotates the secret key for the given machine.
   * @returns The new secret key.
   */
  async rotateSecretKey(params) {
    const { machineId, previousTokenTtl } = params;
    this.requireId(machineId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath16, machineId, "secret_key", "rotate"),
      bodyParams: {
        previousTokenTtl
      }
    });
  }
  /**
   * Creates a new machine scope, allowing the specified machine to access another machine. Maximum of 150 scopes per machine.
   *
   * @param machineId - The ID of the machine that will have access to the target machine.
   * @param toMachineId - The ID of the machine that will be accessible by the source machine.
   * @returns The created [`MachineScope`](https://clerk.com/docs/reference/backend/types/backend-machine-scope) object.
   */
  async createScope(machineId, toMachineId) {
    this.requireId(machineId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath16, machineId, "scopes"),
      bodyParams: {
        toMachineId
      }
    });
  }
  /**
   * Deletes the given machine scope, removing access from one machine to another.
   *
   * @param machineId - The ID of the machine that has access to the target machine.
   * @param otherMachineId - The ID of the machine that will no longer be accessible by the source machine.
   * @returns The deleted [`MachineScope`](https://clerk.com/docs/reference/backend/types/backend-machine-scope) object.
   */
  async deleteScope(machineId, otherMachineId) {
    this.requireId(machineId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath16, machineId, "scopes", otherMachineId)
    });
  }
};
function toActor(value, nestedLevels) {
  if (typeof value !== "object" || value === null) {
    return void 0;
  }
  const { iss, sub, act } = value;
  if (typeof sub !== "string") {
    return void 0;
  }
  const nested = nestedLevels > 0 ? toActor(act, nestedLevels - 1) : void 0;
  return {
    ...typeof iss === "string" ? { iss } : {},
    sub,
    ...nested ? { act: nested } : {}
  };
}
var IdPOAuthAccessToken = class _IdPOAuthAccessToken {
  constructor(id, clientId, type, subject, scopes, revoked, revocationReason, expired, expiration, createdAt, updatedAt, aud, act) {
    this.id = id;
    this.clientId = clientId;
    this.type = type;
    this.subject = subject;
    this.scopes = scopes;
    this.revoked = revoked;
    this.revocationReason = revocationReason;
    this.expired = expired;
    this.expiration = expiration;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.aud = aud;
    this.act = act;
  }
  static fromJSON(data) {
    return new _IdPOAuthAccessToken(
      data.id,
      data.client_id,
      data.type,
      data.subject,
      data.scopes,
      data.revoked,
      data.revocation_reason,
      data.expired,
      data.expiration,
      data.created_at,
      data.updated_at,
      data.aud,
      toActor(data.act, 1)
    );
  }
  /**
   * Creates an IdPOAuthAccessToken from a JWT payload.
   * Maps standard JWT claims and OAuth-specific fields to token properties.
   * The raw JWT `aud` claim can be a string, string[], or undefined. It is normalized to string[].
   */
  static fromJwtPayload(payload, clockSkewInMs = 5e3) {
    const oauthPayload = payload;
    return new _IdPOAuthAccessToken(
      oauthPayload.jti ?? "",
      oauthPayload.client_id ?? "",
      "oauth_token",
      payload.sub,
      oauthPayload.scp ?? oauthPayload.scope?.split(" ") ?? [],
      false,
      null,
      payload.exp * 1e3 <= Date.now() - clockSkewInMs,
      payload.exp * 1e3,
      // milliseconds: expiration, converted from JWT exp claim
      payload.iat * 1e3,
      // milliseconds: createdAt, converted from JWT iat claim
      payload.iat * 1e3,
      // milliseconds: updatedAt, no JWT equivalent, defaults to iat
      oauthPayload.aud === void 0 ? void 0 : [oauthPayload.aud].flat(),
      toActor(oauthPayload.act, 1)
    );
  }
};
var M2M_RESERVED_JWT_CLAIMS = /* @__PURE__ */ new Set(["iss", "sub", "exp", "nbf", "iat", "jti"]);
function extractCustomClaims(payload) {
  const claims = {};
  for (const key of Object.keys(payload)) {
    if (!M2M_RESERVED_JWT_CLAIMS.has(key)) {
      claims[key] = payload[key];
    }
  }
  return Object.keys(claims).length > 0 ? claims : null;
}
var M2MToken = class _M2MToken {
  constructor(id, subject, scopes, claims, revoked, revocationReason, expired, expiration, createdAt, updatedAt, token) {
    this.id = id;
    this.subject = subject;
    this.scopes = scopes;
    this.claims = claims;
    this.revoked = revoked;
    this.revocationReason = revocationReason;
    this.expired = expired;
    this.expiration = expiration;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.token = token;
  }
  static fromJSON(data) {
    return new _M2MToken(
      data.id,
      data.subject,
      data.scopes,
      data.claims,
      data.revoked,
      data.revocation_reason,
      data.expired,
      data.expiration,
      data.created_at,
      data.updated_at,
      data.token
    );
  }
  static fromJwtPayload(payload, clockSkewInMs = 5e3) {
    return new _M2MToken(
      payload.jti ?? "",
      // jti should always be present in Clerk-issued M2M JWTs
      payload.sub,
      payload.scopes?.split(" ") ?? payload.aud ?? [],
      extractCustomClaims(payload),
      false,
      null,
      payload.exp * 1e3 <= Date.now() - clockSkewInMs,
      payload.exp * 1e3,
      // milliseconds — expiration, converted from JWT exp claim
      payload.iat * 1e3,
      // milliseconds — createdAt, converted from JWT iat claim
      payload.iat * 1e3
      // milliseconds — updatedAt, no JWT equivalent; defaults to iat
    );
  }
};
var JWT_CATEGORY_SESSION_TOKEN = "cl_B7d4PD111AAA";
var JWT_CATEGORY_M2M_TOKEN = "cl_B7d4PD333AAA";
function isNonSessionJwtCategory(cat) {
  return cat !== void 0 && cat !== JWT_CATEGORY_SESSION_TOKEN;
}
function hasNonSessionJwtCategory(token) {
  const { data, errors } = decodeJwt(token);
  return !errors && isNonSessionJwtCategory(data?.header?.cat);
}
var remoteCaches = /* @__PURE__ */ new Map();
function getRemoteCache(scope) {
  let cache = remoteCaches.get(scope);
  if (!cache) {
    for (const [key, entry] of remoteCaches) {
      if (cacheHasExpired(entry)) {
        remoteCaches.delete(key);
      }
    }
    cache = { keys: {}, lastUpdatedAt: 0 };
    remoteCaches.set(scope, cache);
  }
  return cache;
}
var PEM_HEADER = "-----BEGIN PUBLIC KEY-----";
var PEM_TRAILER = "-----END PUBLIC KEY-----";
var RSA_PREFIX = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
var RSA_SUFFIX = "IDAQAB";
function loadClerkJwkFromPem(params) {
  const { kid, pem } = params;
  if (!pem) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.SetClerkJWTKey,
      message: "Missing local JWK.",
      reason: TokenVerificationErrorReason.LocalJWKMissing
    });
  }
  const modulus = pem.replace(/\r\n|\n|\r/g, "").replace(PEM_HEADER, "").replace(PEM_TRAILER, "").replace(RSA_PREFIX, "").replace(RSA_SUFFIX, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwk = { kid: `local-${kid}`, kty: "RSA", alg: "RS256", n: modulus, e: "AQAB" };
  return jwk;
}
async function loadClerkJWKFromRemote(params) {
  const { secretKey, apiUrl = API_URL, apiVersion = API_VERSION, kid, skipJwksCache } = params;
  const cache = getRemoteCache(`${apiUrl}|${apiVersion}|${secretKey ?? ""}`);
  if (skipJwksCache || cacheHasExpired(cache) || !cache.keys[kid]) {
    if (!secretKey) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: "Failed to load JWKS from Clerk Backend or Frontend API.",
        reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
      });
    }
    const fetcher = () => fetchJWKSFromBAPI(apiUrl, secretKey, apiVersion);
    const { keys } = await retry(fetcher);
    if (!keys || !keys.length) {
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: "The JWKS endpoint did not contain any signing keys. Contact support@clerk.com.",
        reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
      });
    }
    keys.forEach((key) => {
      cache.keys[key.kid] = key;
    });
    cache.lastUpdatedAt = Date.now();
  }
  const jwk = cache.keys[kid];
  if (!jwk) {
    throw new TokenVerificationError({
      action: `Go to your Dashboard and validate your secret and public keys are correct. ${TokenVerificationErrorAction.ContactSupport} if the issue persists.`,
      message: `Unable to find a signing key in JWKS that matches the kid='${kid}' of the provided session token. Please make sure that the __session cookie or the HTTP authorization header contain a Clerk-generated session JWT.`,
      reason: TokenVerificationErrorReason.JWKKidMismatch
    });
  }
  return jwk;
}
async function fetchJWKSFromBAPI(apiUrl, key, apiVersion) {
  if (!key) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.SetClerkSecretKey,
      message: "Missing Clerk Secret Key or API Key. Go to https://dashboard.clerk.com and get your key for your instance.",
      reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
    });
  }
  const url = new URL(apiUrl);
  url.pathname = joinPaths(url.pathname, apiVersion, "/jwks");
  const response2 = await runtime.fetch(url.href, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT
    }
  });
  if (!response2.ok) {
    const json = await response2.json();
    const invalidSecretKeyError = getErrorObjectByCode(json?.errors, TokenVerificationErrorCode.InvalidSecretKey);
    if (invalidSecretKeyError) {
      const reason = TokenVerificationErrorReason.InvalidSecretKey;
      throw new TokenVerificationError({
        action: TokenVerificationErrorAction.ContactSupport,
        message: invalidSecretKeyError.message,
        reason
      });
    }
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.ContactSupport,
      message: `Error loading Clerk JWKS from ${url.href} with code=${response2.status}`,
      reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
    });
  }
  return response2.json();
}
function cacheHasExpired(cache) {
  const isExpired = Date.now() - cache.lastUpdatedAt >= MAX_CACHE_LAST_UPDATED_AT_SECONDS * 1e3;
  if (isExpired) {
    cache.keys = {};
  }
  return isExpired;
}
var getErrorObjectByCode = (errors, code) => {
  if (!errors) {
    return null;
  }
  return errors.find((err) => err.code === code);
};
var M2M_TOKEN_PREFIX = "mt_";
var M2M_SUBJECT_PREFIX = "mch_";
var OAUTH_TOKEN_PREFIX = "oat_";
var API_KEY_PREFIX = "ak_";
var MACHINE_TOKEN_PREFIXES = [M2M_TOKEN_PREFIX, OAUTH_TOKEN_PREFIX, API_KEY_PREFIX];
var JwtFormatRegExp = /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;
function isJwtFormat(token) {
  return JwtFormatRegExp.test(token);
}
var OAUTH_ACCESS_TOKEN_TYPES = ["at+jwt", "application/at+jwt"];
function isOAuthJwt(token) {
  if (!isJwtFormat(token)) {
    return false;
  }
  try {
    const { data, errors } = decodeJwt(token);
    return !errors && !!data && OAUTH_ACCESS_TOKEN_TYPES.includes(data.header.typ);
  } catch {
    return false;
  }
}
function isM2MJwt(token) {
  if (!isJwtFormat(token)) {
    return false;
  }
  try {
    const { data, errors } = decodeJwt(token);
    return !errors && !!data && typeof data.payload.sub === "string" && data.payload.sub.startsWith(M2M_SUBJECT_PREFIX);
  } catch {
    return false;
  }
}
function isMachineJwt(token) {
  return isOAuthJwt(token) || isM2MJwt(token);
}
function isMachineTokenByPrefix(token) {
  return MACHINE_TOKEN_PREFIXES.some((prefix) => token.startsWith(prefix));
}
function isMachineToken(token) {
  return isMachineTokenByPrefix(token) || isOAuthJwt(token) || isM2MJwt(token);
}
function getMachineTokenType(token) {
  if (token.startsWith(M2M_TOKEN_PREFIX) || isM2MJwt(token)) {
    return TokenType.M2MToken;
  }
  if (token.startsWith(OAUTH_TOKEN_PREFIX) || isOAuthJwt(token)) {
    return TokenType.OAuthToken;
  }
  if (token.startsWith(API_KEY_PREFIX)) {
    return TokenType.ApiKey;
  }
  throw new Error("Unknown machine token type");
}
var isTokenTypeAccepted = (tokenType, acceptsToken) => {
  if (!tokenType) {
    return false;
  }
  if (acceptsToken === "any") {
    return true;
  }
  const tokenTypes = Array.isArray(acceptsToken) ? acceptsToken : [acceptsToken];
  return tokenTypes.includes(tokenType);
};
var MACHINE_TOKEN_TYPES = /* @__PURE__ */ new Set([TokenType.ApiKey, TokenType.M2MToken, TokenType.OAuthToken]);
function getOAuthAudienceVerificationError(aud, audience) {
  try {
    assertOAuthAudienceClaim(aud, audience);
  } catch (error) {
    return new MachineTokenVerificationError({
      code: MachineTokenVerificationErrorCode.TokenVerificationFailed,
      message: error.message
    });
  }
  return void 0;
}
async function resolveKeyAndVerifyJwt(token, kid, options, headerType) {
  try {
    let key;
    if (options.jwtKey) {
      key = loadClerkJwkFromPem({ kid, pem: options.jwtKey });
    } else if (options.secretKey) {
      key = await loadClerkJWKFromRemote({ ...options, kid });
    } else {
      return {
        error: new MachineTokenVerificationError({
          action: TokenVerificationErrorAction.SetClerkJWTKey,
          message: "Failed to resolve JWK during verification.",
          code: MachineTokenVerificationErrorCode.TokenVerificationFailed
        })
      };
    }
    const { data: payload, errors: verifyErrors } = await verifyJwt(token, {
      key,
      audience: options.audience,
      clockSkewInMs: options.clockSkewInMs,
      ...headerType ? { headerType } : {}
    });
    if (verifyErrors) {
      return {
        error: new MachineTokenVerificationError({
          code: MachineTokenVerificationErrorCode.TokenVerificationFailed,
          message: verifyErrors[0].message
        })
      };
    }
    return { payload };
  } catch (error) {
    return {
      error: new MachineTokenVerificationError({
        code: MachineTokenVerificationErrorCode.TokenVerificationFailed,
        message: error.message
      })
    };
  }
}
async function verifyM2MJwt(token, decoded, options) {
  const cat = decoded.header.cat;
  if (cat !== void 0 && cat !== JWT_CATEGORY_M2M_TOKEN) {
    return {
      data: void 0,
      tokenType: TokenType.M2MToken,
      errors: [
        new MachineTokenVerificationError({
          code: MachineTokenVerificationErrorCode.TokenInvalid,
          message: "Invalid M2M JWT category."
        })
      ]
    };
  }
  const result = await resolveKeyAndVerifyJwt(token, decoded.header.kid, options);
  if ("error" in result) {
    return { data: void 0, tokenType: TokenType.M2MToken, errors: [result.error] };
  }
  return {
    data: M2MToken.fromJwtPayload(result.payload, options.clockSkewInMs),
    tokenType: TokenType.M2MToken,
    errors: void 0
  };
}
async function verifyOAuthJwt(token, decoded, options) {
  const { audience, ...jwtOptions } = options;
  const result = await resolveKeyAndVerifyJwt(token, decoded.header.kid, jwtOptions, OAUTH_ACCESS_TOKEN_TYPES);
  if ("error" in result) {
    return { data: void 0, tokenType: TokenType.OAuthToken, errors: [result.error] };
  }
  const audienceError = getOAuthAudienceVerificationError(result.payload.aud, audience);
  if (audienceError) {
    return {
      data: void 0,
      tokenType: TokenType.OAuthToken,
      errors: [audienceError]
    };
  }
  return {
    data: IdPOAuthAccessToken.fromJwtPayload(result.payload, options.clockSkewInMs),
    tokenType: TokenType.OAuthToken,
    errors: void 0
  };
}
var basePath17 = "/m2m_tokens";
var _verifyOptions;
var _M2MTokenApi_instances;
var createRequestOptions_fn;
var verifyJwtFormat_fn;
var M2MTokenApi = class extends AbstractAPI {
  /**
   * @param verifyOptions - JWT verification options (secretKey, apiUrl, etc.).
   * Passed explicitly because BuildRequestOptions are captured inside the buildRequest closure
   * and are not accessible from the RequestFunction itself.
   */
  constructor(request, verifyOptions = {}) {
    super(request);
    __privateAdd(this, _M2MTokenApi_instances);
    __privateAdd(this, _verifyOptions);
    __privateSet(this, _verifyOptions, verifyOptions);
  }
  /**
   * Gets a list of M2M tokens for the given machine. By default, the list is returned in descending order by creation date (newest first). This endpoint can be authenticated by either a Machine Secret Key or by a Clerk [Secret Key](!secret-key).
   * - When fetching M2M tokens with a Machine Secret Key, only tokens associated with the authenticated machine can be retrieved.
   * - When fetching M2M tokens with a Clerk Secret Key, tokens for any machine in the instance can be retrieved.
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`M2MToken`](https://clerk.com/docs/reference/backend/types/backend-m2m-token) objects and a `totalCount` property containing the total number of M2M tokens for the machine.
   */
  async list(queryParams) {
    const { machineSecretKey, ...params } = queryParams;
    const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
      method: "GET",
      path: basePath17,
      queryParams: params
    }, machineSecretKey);
    return this.request(requestOptions);
  }
  /**
   * Creates a new [M2M token](https://clerk.com/docs/guides/development/machine-auth/m2m-tokens) for the given machine. Must be authenticated by a Machine Secret Key.
   * @returns The created [`M2MToken`](https://clerk.com/docs/reference/backend/types/backend-m2m-token) object.
   */
  async createToken(params) {
    const {
      claims = null,
      machineSecretKey,
      minRemainingTtlSeconds,
      secondsUntilExpiration = null,
      tokenFormat = "opaque"
    } = params || {};
    const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
      method: "POST",
      path: basePath17,
      bodyParams: {
        secondsUntilExpiration,
        claims,
        minRemainingTtlSeconds,
        tokenFormat
      }
    }, machineSecretKey);
    return this.request(requestOptions);
  }
  /**
   * Revokes an [M2M token](https://clerk.com/docs/guides/development/machine-auth/m2m-tokens). This endpoint can be authenticated by either a Machine Secret Key or by a Clerk [Secret Key](!secret-key).
   * - When revoking M2M tokens with a Machine Secret Key, the token will be revoked using the machine secret key.
   * - When revoking M2M tokens with a Clerk Secret Key, the token will be revoked using the instance secret key.
   * @returns The revoked [`M2MToken`](https://clerk.com/docs/reference/backend/types/backend-m2m-token) object.
   */
  async revokeToken(params) {
    const { m2mTokenId, revocationReason = null, machineSecretKey } = params;
    this.requireId(m2mTokenId);
    const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
      method: "POST",
      path: joinPaths(basePath17, m2mTokenId, "revoke"),
      bodyParams: {
        revocationReason
      }
    }, machineSecretKey);
    return this.request(requestOptions);
  }
  /**
   * Verifies a [M2M token](https://clerk.com/docs/guides/development/machine-auth/m2m-tokens). Must be authenticated by a Machine Secret Key.
   * @returns The verified [`M2MToken`](https://clerk.com/docs/reference/backend/types/backend-m2m-token) object.
   */
  async verify(params) {
    const { token, machineSecretKey } = params;
    if (isM2MJwt(token)) {
      return __privateMethod(this, _M2MTokenApi_instances, verifyJwtFormat_fn).call(this, token);
    }
    const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
      method: "POST",
      path: joinPaths(basePath17, "verify"),
      bodyParams: { token }
    }, machineSecretKey);
    return this.request(requestOptions);
  }
};
_verifyOptions = /* @__PURE__ */ new WeakMap();
_M2MTokenApi_instances = /* @__PURE__ */ new WeakSet();
createRequestOptions_fn = function(options, machineSecretKey) {
  if (machineSecretKey) {
    return {
      ...options,
      headerParams: {
        ...options.headerParams,
        Authorization: `Bearer ${machineSecretKey}`
      }
    };
  }
  return options;
};
verifyJwtFormat_fn = async function(token) {
  let decoded;
  try {
    const { data, errors } = decodeJwt(token);
    if (errors) {
      throw errors[0];
    }
    decoded = data;
  } catch (e) {
    throw new MachineTokenVerificationError({
      code: MachineTokenVerificationErrorCode.TokenInvalid,
      message: e.message
    });
  }
  const result = await verifyM2MJwt(token, decoded, __privateGet(this, _verifyOptions));
  if (result.errors) {
    throw result.errors[0];
  }
  return result.data;
};
var basePath18 = "/jwks";
var JwksAPI = class extends AbstractAPI {
  async getJwks() {
    return this.request({
      method: "GET",
      path: basePath18
    });
  }
};
var basePath19 = "/jwt_templates";
var JwtTemplatesApi = class extends AbstractAPI {
  async list(params = {}) {
    return this.request({
      method: "GET",
      path: basePath19,
      queryParams: { ...params, paginated: true }
    });
  }
  async get(templateId) {
    this.requireId(templateId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath19, templateId)
    });
  }
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath19,
      bodyParams: params
    });
  }
  async update(params) {
    const { templateId, ...bodyParams } = params;
    this.requireId(templateId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath19, templateId),
      bodyParams
    });
  }
  async delete(templateId) {
    this.requireId(templateId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath19, templateId)
    });
  }
};
var basePath20 = "/organizations";
var OrganizationAPI = class extends AbstractAPI {
  /**
   * Gets the list of Organizations for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization) objects and a `totalCount` property containing the total number of Organizations for the instance.
   */
  async getOrganizationList(params) {
    return this.request({
      method: "GET",
      path: basePath20,
      queryParams: params
    });
  }
  /** Creates an [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization). */
  async createOrganization(params) {
    return this.request({
      method: "POST",
      path: basePath20,
      bodyParams: params
    });
  }
  /** Gets an [Organization](https://clerk.com/docs/reference/backend/types/backend-organization). */
  async getOrganization(params) {
    const { includeMembersCount } = params;
    const organizationIdOrSlug = "organizationId" in params ? params.organizationId : params.slug;
    this.requireId(organizationIdOrSlug);
    return this.request({
      method: "GET",
      path: joinPaths(basePath20, organizationIdOrSlug),
      queryParams: {
        includeMembersCount
      }
    });
  }
  /**
   * Updates an [Organization](https://clerk.com/docs/reference/backend/types/backend-organization).
   * @param organizationId - The ID of the Organization to update.
   * @param params - The parameters to update the Organization with.
   * @returns The updated [Organization](https://clerk.com/docs/reference/backend/types/backend-organization).
   */
  async updateOrganization(organizationId, params) {
    this.requireId(organizationId);
    const { publicMetadata, privateMetadata, ...rest } = params;
    const hasMetadata = publicMetadata !== void 0 || privateMetadata !== void 0;
    const hasRest = Object.keys(rest).length > 0;
    if (hasMetadata) {
      deprecated(
        "updateOrganization(organizationId, { publicMetadata | privateMetadata })",
        "Use updateOrganizationMetadata for partial updates (merge) or replaceOrganizationMetadata for full replacement."
      );
    }
    if (!hasMetadata) {
      return this.request({
        method: "PATCH",
        path: joinPaths(basePath20, organizationId),
        bodyParams: rest
      });
    }
    if (hasRest) {
      await this.request({
        method: "PATCH",
        path: joinPaths(basePath20, organizationId),
        bodyParams: rest
      });
    }
    return this.request({
      method: "PUT",
      path: joinPaths(basePath20, organizationId, "metadata"),
      bodyParams: { publicMetadata, privateMetadata }
    });
  }
  /**
   * Updates the logo of the given Organization.
   * @param organizationId - The ID of the Organization to update the logo for.
   * @param params - The parameters to update the logo with.
   * @returns The updated [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization).
   */
  async updateOrganizationLogo(organizationId, params) {
    this.requireId(organizationId);
    const formData = new runtime.FormData();
    formData.append("file", params?.file);
    if (params?.uploaderUserId) {
      formData.append("uploader_user_id", params?.uploaderUserId);
    }
    return this.request({
      method: "PUT",
      path: joinPaths(basePath20, organizationId, "logo"),
      formData
    });
  }
  /**
   * Deletes the logo of the given Organization.
   * @param organizationId - The ID of the Organization to delete the logo for.
   * @returns The deleted [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization).
   */
  async deleteOrganizationLogo(organizationId) {
    this.requireId(organizationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath20, organizationId, "logo")
    });
  }
  /**
   * Updates the metadata for the given Organization, by merging existing values with the provided parameters.
   *
   * A "deep" merge will be performed - "deep" means that any nested JSON objects will be merged as well. You can remove metadata keys at any level by setting their value to `null`.
   *
   * @param organizationId - The ID of the Organization to update the metadata for.
   * @param params - The parameters to update the metadata with.
   * @returns The updated [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization).
   *
   * > [!TIP]
   * > If you want to fully replace the existing metadata instead of merging, use [`replaceOrganizationMetadata()`](https://clerk.com/docs/reference/backend/organization/replace-organization-metadata).
   */
  async updateOrganizationMetadata(organizationId, params) {
    this.requireId(organizationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath20, organizationId, "metadata"),
      bodyParams: params
    });
  }
  /**
   * Replaces the metadata associated with the specified Organization. Unlike [`updateOrganizationMetadata()`](/docs/reference/backend/organization/update-organization-metadata), which deep-merges into the existing metadata, this method uses replace semantics: when a metadata field is provided, its previous value is overwritten in full with no merging at any level.
   *
   * The distinction is at two layers:
   * - **Top-level field omission preserves the existing value.** Each top-level field (`publicMetadata`, `privateMetadata`) is handled independently. If you don't include a field in the request, the stored value for that field is left untouched.
   * - **The value inside a provided field is replaced in full.** When you do include a field, its previous content is discarded — any nested keys present before but absent in the new value are dropped. There is no merge.
   *
   * For the provided field, you can also send:
   * - `{}` (empty object) to clear the field.
   * - `null` to overwrite the field with a JSON `null` value. Prefer `{}` unless you specifically need a stored `null`.
   * @param organizationId - The ID of the Organization to replace the metadata for.
   * @param params - The metadata to replace.
   * @returns The updated [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization).
   */
  async replaceOrganizationMetadata(organizationId, params) {
    this.requireId(organizationId);
    return this.request({
      method: "PUT",
      path: joinPaths(basePath20, organizationId, "metadata"),
      bodyParams: params
    });
  }
  /**
   * Deletes the given Organization.
   * @param organizationId - The ID of the Organization to delete.
   * @returns The deleted [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization).
   */
  async deleteOrganization(organizationId) {
    this.requireId(organizationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath20, organizationId)
    });
  }
  /**
   * Gets the list of Organization memberships for the specified Organization. By default, the list is returned in descending order by creation date (newest first).
   *
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership) objects and a `totalCount` property containing the total number of Organization memberships for the Organization.
   *
   * > [!TIP]
   * > To get the list of Organization memberships **for your instance**, use [`getInstanceOrganizationMembershipList()`](/docs/reference/backend/organization/get-instance-organization-membership-list).
   */
  async getOrganizationMembershipList(params) {
    const { organizationId, ...queryParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath20, organizationId, "memberships"),
      queryParams
    });
  }
  /**
   * Gets the list of Organization memberships for the instance. By default, the list is returned in descending order by creation date (newest first).
   *
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership) objects and a `totalCount` property containing the total number of Organization memberships for the instance.
   *
   * > [!TIP]
   * > To get the list of Organization memberships **for a specific Organization**, use [`getOrganizationMembershipList()`](/docs/reference/backend/organization/get-organization-membership-list).
   */
  async getInstanceOrganizationMembershipList(params) {
    return this.request({
      method: "GET",
      path: "/organization_memberships",
      queryParams: params
    });
  }
  /**
   * Creates a membership to an Organization for a user directly (circumventing the need for an invitation).
   * @returns The newly created [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership) object.
   */
  async createOrganizationMembership(params) {
    const { organizationId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath20, organizationId, "memberships"),
      bodyParams
    });
  }
  /**
   * Updates a user's [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership).
   * @returns The updated [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership) object.
   */
  async updateOrganizationMembership(params) {
    const { organizationId, userId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath20, organizationId, "memberships", userId),
      bodyParams
    });
  }
  /**
   * Updates the metadata for the given Organization membership, by merging existing values with the provided parameters.
   *
   * A "deep" merge will be performed - "deep" means that any nested JSON objects will be merged as well. You can remove metadata keys at any level by setting their value to `null`.
   *
   * @returns The updated [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership).
   */
  async updateOrganizationMembershipMetadata(params) {
    const { organizationId, userId, ...bodyParams } = params;
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath20, organizationId, "memberships", userId, "metadata"),
      bodyParams
    });
  }
  /**
   * Removes a user from the given Organization.
   * @param organizationId - The ID of the Organization to remove the user from.
   * @param userId - The ID of the user to remove from the Organization.
   * @returns The deleted [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership).
   */
  async deleteOrganizationMembership(params) {
    const { organizationId, userId } = params;
    this.requireId(organizationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath20, organizationId, "memberships", userId)
    });
  }
  /**
   * Gets the list of Organization invitations for the specified Organization.
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation) objects and a `totalCount` property containing the total number of Organization invitations for the Organization.
   */
  async getOrganizationInvitationList(params) {
    const { organizationId, ...queryParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath20, organizationId, "invitations"),
      queryParams
    });
  }
  /**
   * Creates an invitation for a user to join an Organization.
   * @returns The newly created [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation) object.
   */
  async createOrganizationInvitation(params) {
    const { organizationId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath20, organizationId, "invitations"),
      bodyParams
    });
  }
  /** Creates multiple invitations for users to join an Organization.
   * @param organizationId - The ID of the Organization to create the invitations for.
   * @param params - The parameters to create the invitations with.
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation) objects and a `totalCount` property containing the total number of Organization invitations.
   */
  async createOrganizationInvitationBulk(organizationId, params) {
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath20, organizationId, "invitations", "bulk"),
      bodyParams: params
    });
  }
  /** Gets an [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation). */
  async getOrganizationInvitation(params) {
    const { organizationId, invitationId } = params;
    this.requireId(organizationId);
    this.requireId(invitationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath20, organizationId, "invitations", invitationId)
    });
  }
  /**
   * Revokes an invitation from a user for the given Organization.
   * @returns The revoked [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation).
   */
  async revokeOrganizationInvitation(params) {
    const { organizationId, invitationId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath20, organizationId, "invitations", invitationId, "revoke"),
      bodyParams
    });
  }
  /**
   * Gets the list of [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains) for the given Organization. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OrganizationDomain`](https://clerk.com/docs/reference/backend/types/backend-organization-domain) objects and a `totalCount` property containing the total number of Verified Domains for the Organization.
   */
  async getOrganizationDomainList(params) {
    const { organizationId, ...queryParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath20, organizationId, "domains"),
      queryParams
    });
  }
  /**
   * Creates a new [Verified Domain](https://clerk.com/docs/guides/organizations/add-members/verified-domains) for the given Organization. By default, the domain is verified, but can be optionally set to unverified.
   * @returns The newly created [`OrganizationDomain`](https://clerk.com/docs/reference/backend/types/backend-organization-domain) object.
   */
  async createOrganizationDomain(params) {
    const { organizationId, ...bodyParams } = params;
    this.requireId(organizationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath20, organizationId, "domains"),
      bodyParams: {
        ...bodyParams,
        verified: bodyParams.verified ?? true
      }
    });
  }
  /**
   * Updates a [Verified Domain](https://clerk.com/docs/guides/organizations/add-members/verified-domains) for the given Organization.
   * @returns The updated [`OrganizationDomain`](https://clerk.com/docs/reference/backend/types/backend-organization-domain) object.
   */
  async updateOrganizationDomain(params) {
    const { organizationId, domainId, ...bodyParams } = params;
    this.requireId(organizationId);
    this.requireId(domainId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath20, organizationId, "domains", domainId),
      bodyParams
    });
  }
  /**
   * Deletes a [Verified Domain](https://clerk.com/docs/guides/organizations/add-members/verified-domains) for the given Organization.
   * @returns The deleted [`OrganizationDomain`](https://clerk.com/docs/reference/backend/types/backend-organization-domain) object.
   */
  async deleteOrganizationDomain(params) {
    const { organizationId, domainId } = params;
    this.requireId(organizationId);
    this.requireId(domainId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath20, organizationId, "domains", domainId)
    });
  }
};
var basePath21 = "/organization_permissions";
var OrganizationPermissionAPI = class extends AbstractAPI {
  async getOrganizationPermissionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath21,
      queryParams: params
    });
  }
  async getOrganizationPermission(permissionId) {
    this.requireId(permissionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath21, permissionId)
    });
  }
  async createOrganizationPermission(params) {
    return this.request({
      method: "POST",
      path: basePath21,
      bodyParams: params
    });
  }
  async updateOrganizationPermission(params) {
    const { permissionId, ...bodyParams } = params;
    this.requireId(permissionId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath21, permissionId),
      bodyParams
    });
  }
  async deleteOrganizationPermission(permissionId) {
    this.requireId(permissionId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath21, permissionId)
    });
  }
};
var basePath22 = "/organization_roles";
var OrganizationRoleAPI = class extends AbstractAPI {
  async getOrganizationRoleList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath22,
      queryParams: params
    });
  }
  async getOrganizationRole(organizationRoleId) {
    this.requireId(organizationRoleId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath22, organizationRoleId)
    });
  }
  async createOrganizationRole(params) {
    return this.request({
      method: "POST",
      path: basePath22,
      bodyParams: params
    });
  }
  async updateOrganizationRole(params) {
    const { organizationRoleId, ...bodyParams } = params;
    this.requireId(organizationRoleId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath22, organizationRoleId),
      bodyParams
    });
  }
  async deleteOrganizationRole(organizationRoleId) {
    this.requireId(organizationRoleId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath22, organizationRoleId)
    });
  }
  async assignPermissionToOrganizationRole(params) {
    const { organizationRoleId, permissionId } = params;
    this.requireId(organizationRoleId);
    this.requireId(permissionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath22, organizationRoleId, "permissions", permissionId)
    });
  }
  async removePermissionFromOrganizationRole(params) {
    const { organizationRoleId, permissionId } = params;
    this.requireId(organizationRoleId);
    this.requireId(permissionId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath22, organizationRoleId, "permissions", permissionId)
    });
  }
};
var basePath23 = "/oauth_applications";
var OAuthApplicationsApi = class extends AbstractAPI {
  /**
   * Gets a list of OAuth applications for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @param params - The parameters to get the OAuth applications with.
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`OAuthApplication`](https://clerk.com/docs/reference/backend/types/backend-oauth-application) objects and a `totalCount` property containing the total number of OAuth applications.
   */
  async list(params = {}) {
    return this.request({
      method: "GET",
      path: basePath23,
      queryParams: params
    });
  }
  /**
   * Gets the given OAuth application.
   * @param oauthApplicationId - The ID of the OAuth application to get.
   * @returns The [`OAuthApplication`](https://clerk.com/docs/reference/backend/types/backend-oauth-application) object.
   */
  async get(oauthApplicationId) {
    this.requireId(oauthApplicationId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath23, oauthApplicationId)
    });
  }
  /**
   * Creates a new OAuth application.
   * @param params - The parameters to create the OAuth application with.
   * @returns The created [`OAuthApplication`](https://clerk.com/docs/reference/backend/types/backend-oauth-application) object.
   */
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath23,
      bodyParams: params
    });
  }
  /**
   * Updates the given OAuth application.
   * @returns The updated [`OAuthApplication`](https://clerk.com/docs/reference/backend/types/backend-oauth-application) object.
   */
  async update(params) {
    const { oauthApplicationId, ...bodyParams } = params;
    this.requireId(oauthApplicationId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath23, oauthApplicationId),
      bodyParams
    });
  }
  /**
   * Deletes the given OAuth application.
   * @param oauthApplicationId - The ID of the OAuth application to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async delete(oauthApplicationId) {
    this.requireId(oauthApplicationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath23, oauthApplicationId)
    });
  }
  /**
   * Rotates the secret of the given OAuth application. When the client secret is rotated, ensure that you update it in your authorized OAuth clients.
   * @param oauthApplicationId - The ID of the OAuth application to rotate the secret of.
   * @returns The [`OAuthApplication`](https://clerk.com/docs/reference/backend/types/backend-oauth-application) object.
   */
  async rotateSecret(oauthApplicationId) {
    this.requireId(oauthApplicationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath23, oauthApplicationId, "rotate_secret")
    });
  }
  /**
   * Revokes both the [OAuth access token](!oauth-access-token) and refresh token for the associated grant for the given [`OAuthApplication`](/docs/reference/backend/types/backend-oauth-application). The request may specify either token.
   */
  async revokeToken(params) {
    const { oauthApplicationId, ...bodyParams } = params;
    this.requireId(oauthApplicationId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath23, oauthApplicationId, "revoke_token"),
      bodyParams
    });
  }
};
var basePath24 = "/phone_numbers";
var PhoneNumberAPI = class extends AbstractAPI {
  /**
   * Gets the given [`PhoneNumber`](https://clerk.com/docs/reference/backend/types/backend-phone-number).
   * @param phoneNumberId - The ID of the phone number to get.
   */
  async getPhoneNumber(phoneNumberId) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath24, phoneNumberId)
    });
  }
  /**
   * Creates a new phone number for the given user.
   * @returns The created [`PhoneNumber`](https://clerk.com/docs/reference/backend/types/backend-phone-number) object.
   */
  async createPhoneNumber(params) {
    return this.request({
      method: "POST",
      path: basePath24,
      bodyParams: params
    });
  }
  /**
   * Updates the given phone number.
   * @param phoneNumberId - The ID of the phone number to update.
   * @param params - The parameters to update the phone number.
   * @returns The updated [`PhoneNumber`](https://clerk.com/docs/reference/backend/types/backend-phone-number) object.
   */
  async updatePhoneNumber(phoneNumberId, params = {}) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath24, phoneNumberId),
      bodyParams: params
    });
  }
  /**
   * Deletes the given phone number.
   * @param phoneNumberId - The ID of the phone number to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deletePhoneNumber(phoneNumberId) {
    this.requireId(phoneNumberId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath24, phoneNumberId)
    });
  }
};
var basePath25 = "/proxy_checks";
var ProxyCheckAPI = class extends AbstractAPI {
  async verify(params) {
    return this.request({
      method: "POST",
      path: basePath25,
      bodyParams: params
    });
  }
};
var basePath26 = "/redirect_urls";
var RedirectUrlAPI = class extends AbstractAPI {
  /**
   * Gets a list of whitelisted redirect URLs for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`RedirectUrl`](https://clerk.com/docs/reference/backend/types/backend-redirect-url) objects and a `totalCount` property containing the total number of redirect URLs.
   */
  async getRedirectUrlList() {
    return this.request({
      method: "GET",
      path: basePath26,
      queryParams: { paginated: true }
    });
  }
  /**
   * Gets the given [`RedirectUrl`](https://clerk.com/docs/reference/backend/types/backend-redirect-url).
   * @param redirectUrlId - The ID of the redirect URL to get.
   */
  async getRedirectUrl(redirectUrlId) {
    this.requireId(redirectUrlId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath26, redirectUrlId)
    });
  }
  /**
   * Creates a new redirect URL for the instance.
   * @returns The created [`RedirectUrl`](https://clerk.com/docs/reference/backend/types/backend-redirect-url) object.
   */
  async createRedirectUrl(params) {
    return this.request({
      method: "POST",
      path: basePath26,
      bodyParams: params
    });
  }
  /**
   * Deletes the given redirect URL.
   * @param redirectUrlId - The ID of the redirect URL to delete.
   * @returns The deleted [`RedirectUrl`](https://clerk.com/docs/reference/backend/types/backend-redirect-url) object.
   */
  async deleteRedirectUrl(redirectUrlId) {
    this.requireId(redirectUrlId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath26, redirectUrlId)
    });
  }
};
var basePath27 = "/role_sets";
var RoleSetAPI = class extends AbstractAPI {
  async getRoleSetList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath27,
      queryParams: params
    });
  }
  async getRoleSet(roleSetKeyOrId) {
    this.requireId(roleSetKeyOrId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath27, roleSetKeyOrId)
    });
  }
  async createRoleSet(params) {
    return this.request({
      method: "POST",
      path: basePath27,
      bodyParams: params
    });
  }
  async updateRoleSet(params) {
    const { roleSetKeyOrId, ...bodyParams } = params;
    this.requireId(roleSetKeyOrId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath27, roleSetKeyOrId),
      bodyParams
    });
  }
  async addRolesToRoleSet(params) {
    const { roleSetKeyOrId, ...bodyParams } = params;
    this.requireId(roleSetKeyOrId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath27, roleSetKeyOrId, "roles"),
      bodyParams
    });
  }
  async replaceRoleInRoleSet(params) {
    const { roleSetKeyOrId, ...bodyParams } = params;
    this.requireId(roleSetKeyOrId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath27, roleSetKeyOrId, "roles", "replace"),
      bodyParams
    });
  }
  async replaceRoleSet(params) {
    const { roleSetKeyOrId, ...bodyParams } = params;
    this.requireId(roleSetKeyOrId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath27, roleSetKeyOrId, "replace"),
      bodyParams
    });
  }
};
var basePath28 = "/saml_connections";
var SamlConnectionAPI = class extends AbstractAPI {
  async getSamlConnectionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath28,
      queryParams: params
    });
  }
  async createSamlConnection(params) {
    return this.request({
      method: "POST",
      path: basePath28,
      bodyParams: params,
      options: {
        deepSnakecaseBodyParamKeys: true
      }
    });
  }
  async getSamlConnection(samlConnectionId) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath28, samlConnectionId)
    });
  }
  async updateSamlConnection(samlConnectionId, params = {}) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath28, samlConnectionId),
      bodyParams: params,
      options: {
        deepSnakecaseBodyParamKeys: true
      }
    });
  }
  async deleteSamlConnection(samlConnectionId) {
    this.requireId(samlConnectionId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath28, samlConnectionId)
    });
  }
};
var basePath29 = "/sessions";
var SessionAPI = class extends AbstractAPI {
  /**
   * Gets a list of sessions for either the specified client or user. Requires either `clientId` or `userId` to be provided. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`Session`](https://clerk.com/docs/reference/backend/types/backend-session) objects and a `totalCount` property containing the total number of sessions.
   */
  async getSessionList(params = {}) {
    return this.request({
      method: "GET",
      path: basePath29,
      queryParams: { ...params, paginated: true }
    });
  }
  /**
   * Gets the given [`Session`](https://clerk.com/docs/reference/backend/types/backend-session).
   * @param sessionId - The ID of the session to get.
   */
  async getSession(sessionId) {
    this.requireId(sessionId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath29, sessionId)
    });
  }
  /**
   * Creates a new session for the given user.
   * @returns The created [`Session`](https://clerk.com/docs/reference/backend/types/backend-session).
   */
  async createSession(params) {
    return this.request({
      method: "POST",
      path: basePath29,
      bodyParams: params
    });
  }
  /**
   * Revokes the given session. The user will be signed out from the client the session is associated with.
   * @param sessionId - The ID of the session to revoke.
   * @returns The revoked [`Session`](https://clerk.com/docs/reference/backend/types/backend-session).
   */
  async revokeSession(sessionId) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath29, sessionId, "revoke")
    });
  }
  async verifySession(sessionId, token) {
    this.requireId(sessionId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath29, sessionId, "verify"),
      bodyParams: { token }
    });
  }
  /**
   * Gets a session token or generates a JWT using a specified template that is defined in the [**JWT templates**](https://dashboard.clerk.com/~/jwt-templates) page in the Clerk Dashboard.
   *
   * @param sessionId - The ID of the session to get the token for.
   * @param template - The name of the JWT template configured in the Clerk Dashboard to generate a new token from.
   * @param expiresInSeconds - The expiration time for the token in seconds. If not provided, uses the default expiration.
   *
   * @returns The generated token.
   */
  async getToken(sessionId, template, expiresInSeconds) {
    this.requireId(sessionId);
    const path = template ? joinPaths(basePath29, sessionId, "tokens", template) : joinPaths(basePath29, sessionId, "tokens");
    const requestOptions = {
      method: "POST",
      path
    };
    if (expiresInSeconds !== void 0) {
      requestOptions.bodyParams = { expires_in_seconds: expiresInSeconds };
    }
    return this.request(requestOptions);
  }
  async refreshSession(sessionId, params) {
    this.requireId(sessionId);
    const { suffixed_cookies, ...restParams } = params;
    return this.request({
      method: "POST",
      path: joinPaths(basePath29, sessionId, "refresh"),
      bodyParams: restParams,
      queryParams: { suffixed_cookies }
    });
  }
};
var basePath30 = "/sign_in_tokens";
var SignInTokenAPI = class extends AbstractAPI {
  /**
   * Creates a new sign-in token for the given user. By default, sign-in tokens expire in 30 days. You can optionally specify a custom expiration time in seconds using the `expiresInSeconds` parameter.
   * @returns The created [`SignInToken`](https://clerk.com/docs/reference/backend/types/backend-sign-in-token) object.
   */
  async createSignInToken(params) {
    return this.request({
      method: "POST",
      path: basePath30,
      bodyParams: params
    });
  }
  /**
   * Revokes the given sign-in token.
   * @param signInTokenId - The ID of the sign-in token to revoke.
   * @returns The revoked [`SignInToken`](https://clerk.com/docs/reference/backend/types/backend-sign-in-token) object.
   */
  async revokeSignInToken(signInTokenId) {
    this.requireId(signInTokenId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath30, signInTokenId, "revoke")
    });
  }
};
var basePath31 = "/sign_ups";
var SignUpAPI = class extends AbstractAPI {
  async get(signUpAttemptId) {
    this.requireId(signUpAttemptId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath31, signUpAttemptId)
    });
  }
  async update(params) {
    const { signUpAttemptId, ...bodyParams } = params;
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath31, signUpAttemptId),
      bodyParams
    });
  }
};
var basePath32 = "/testing_tokens";
var TestingTokenAPI = class extends AbstractAPI {
  /**
   * Creates a [Testing Token](https://clerk.com/docs/guides/development/testing/overview#testing-tokens) for the instance.
   * @returns The created [`TestingToken`](https://clerk.com/docs/reference/backend/types/backend-testing-token) object.
   */
  async createTestingToken() {
    return this.request({
      method: "POST",
      path: basePath32
    });
  }
};
var basePath33 = "/users";
var UserAPI = class extends AbstractAPI {
  /**
   * Retrieves the list of users in your instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property that contains an array of [`User`](https://clerk.com/docs/reference/backend/types/backend-user) objects, and a `totalCount` property that indicates the total number of users in your instance.
   */
  async getUserList(params = {}) {
    const { limit, offset, orderBy, ...userCountParams } = params;
    const [data, totalCount] = await Promise.all([
      this.request({
        method: "GET",
        path: basePath33,
        queryParams: params
      }),
      this.getCount(userCountParams)
    ]);
    return { data, totalCount };
  }
  /**
   * Gets a [`User`](https://clerk.com/docs/reference/backend/types/backend-user) for the specified user ID.
   * @param userId - The ID of the user to retrieve.
   */
  async getUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath33, userId)
    });
  }
  /**
   * Creates a [`User`](https://clerk.com/docs/reference/backend/types/backend-user) in your instance.
   *
   * Your settings in the [Clerk Dashboard](https://dashboard.clerk.com) determine how you should setup your user model. Anything **Required** will need to be provided when creating a user. Trying to add a field that isn't enabled will result in an error.
   *
   * By default, email addresses and phone numbers created using this method are verified automatically. Use `emailAddressIdentificationStatus` and `phoneNumberIdentificationStatus` to create any of them as reserved. Reserved identifiers are unverified, but they can still be used for sign-in and cannot be claimed by another user.
   *
   * > [!CAUTION]
   * >
   * > This endpoint is [rate limited](/docs/guides/how-clerk-works/system-limits). For development instances, a rate limit rule of **100 requests per 10 seconds** is applied.
   * > For production instances, that limit goes up to **1000 requests per 10 seconds**.
   */
  async createUser(params) {
    return this.request({
      method: "POST",
      path: basePath33,
      bodyParams: params
    });
  }
  /** Updates the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   * @param userId - The ID of the user to update.
   * @param params - The user attributes to update.
   */
  async updateUser(userId, params = {}) {
    this.requireId(userId);
    const { publicMetadata, privateMetadata, unsafeMetadata, ...rest } = params;
    const hasMetadata = publicMetadata !== void 0 || privateMetadata !== void 0 || unsafeMetadata !== void 0;
    const hasRest = Object.keys(rest).length > 0;
    if (hasMetadata) {
      deprecated(
        "updateUser(userId, { publicMetadata | privateMetadata | unsafeMetadata })",
        "Use updateUserMetadata for partial updates (merge) or replaceUserMetadata for full replacement."
      );
    }
    if (!hasMetadata) {
      return this.request({
        method: "PATCH",
        path: joinPaths(basePath33, userId),
        bodyParams: rest
      });
    }
    if (hasRest) {
      await this.request({
        method: "PATCH",
        path: joinPaths(basePath33, userId),
        bodyParams: rest
      });
    }
    return this.request({
      method: "PUT",
      path: joinPaths(basePath33, userId, "metadata"),
      bodyParams: { publicMetadata, privateMetadata, unsafeMetadata }
    });
  }
  async replaceUserEmailAddress(userId, params) {
    this.requireId(userId);
    return this.request({
      method: "PUT",
      path: joinPaths(basePath33, userId, "email_address"),
      bodyParams: params
    });
  }
  async replaceUserPhoneNumber(userId, params) {
    this.requireId(userId);
    return this.request({
      method: "PUT",
      path: joinPaths(basePath33, userId, "phone_number"),
      bodyParams: params
    });
  }
  /**
   * Updates the profile image for the given user. To remove the profile image, see [`deleteUserProfileImage()`](https://clerk.com/docs/reference/backend/user/delete-user-profile-image).
   * @param userId - The ID of the user to update the profile image for.
   * @param params - The file to set as the user's profile image.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async updateUserProfileImage(userId, params) {
    this.requireId(userId);
    const formData = new runtime.FormData();
    formData.append("file", params?.file);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "profile_image"),
      formData
    });
  }
  /**
   * Updates the metadata for the given user, by merging existing values with the provided parameters.
   *
   * A "deep" merge will be performed - "deep" means that any nested JSON objects will be merged as well. You can remove metadata keys at any level by setting their value to `null`.
   *
   * > [!TIP]
   * > If you want to fully replace the existing metadata instead of merging, use [`replaceUserMetadata()`](/docs/reference/backend/user/replace-user-metadata).
   * @param userId - The ID of the user to update.
   * @param params - The metadata to update.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async updateUserMetadata(userId, params) {
    this.requireId(userId);
    return this.request({
      method: "PATCH",
      path: joinPaths(basePath33, userId, "metadata"),
      bodyParams: params
    });
  }
  /**
   * Replaces the metadata associated with the specified user. Unlike [`updateUserMetadata()`](/docs/reference/backend/user/update-user-metadata), which deep-merges into the existing metadata, this method uses replace semantics: when a metadata field is provided, its previous value is overwritten in full with no merging at any level.
   *
   * The distinction is at two layers:
   * - **Top-level field omission preserves the existing value.** Each top-level field (`publicMetadata`, `privateMetadata`, `unsafeMetadata`) is handled independently. If you don't include a field in the request, the stored value for that field is left untouched.
   * - **The value inside a provided field is replaced in full.** When you do include a field, its previous content is discarded — any nested keys present before but absent in the new value are dropped. There is no merge.
   *
   * For the provided field, you can also send:
   * - `{}` (empty object) to clear the field.
   * - `null` to overwrite the field with a JSON `null` value. Prefer `{}` unless you specifically need a stored `null`.
   * @param userId - The ID of the user to replace the metadata for.
   * @param params - The metadata to replace.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async replaceUserMetadata(userId, params) {
    this.requireId(userId);
    return this.request({
      method: "PUT",
      path: joinPaths(basePath33, userId, "metadata"),
      bodyParams: params
    });
  }
  /**
   * Deletes the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   * @param userId - The ID of the user to delete.
   */
  async deleteUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, userId)
    });
  }
  /**
   * Gets the total number of users in your instance.
   */
  async getCount(params = {}) {
    return this.request({
      method: "GET",
      path: joinPaths(basePath33, "count"),
      queryParams: params
    });
  }
  async getUserOauthAccessToken(userId, provider) {
    this.requireId(userId);
    const hasPrefix = provider.startsWith("oauth_");
    const _provider = hasPrefix ? provider : `oauth_${provider}`;
    if (hasPrefix) {
      deprecated(
        "getUserOauthAccessToken(userId, provider)",
        "Remove the `oauth_` prefix from the `provider` argument."
      );
    }
    return this.request({
      method: "GET",
      path: joinPaths(basePath33, userId, "oauth_access_tokens", _provider),
      queryParams: { paginated: true }
    });
  }
  /**
   * Disable all of a user's MFA methods (e.g., [OTP](!otp) sent via SMS, TOTP on their authenticator app) at once.
   * @param userId - The ID of the user to disable MFA for.
   */
  async disableUserMFA(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, userId, "mfa")
    });
  }
  /**
   * Gets a list of the given user's Organization memberships. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property that contains an array of [`OrganizationMembership`](https://clerk.com/docs/reference/backend/types/backend-organization-membership) objects, and a `totalCount` property that indicates the total number of Organization memberships for the user.
   */
  async getOrganizationMembershipList(params) {
    const { userId, limit, offset } = params;
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath33, userId, "organization_memberships"),
      queryParams: { limit, offset }
    });
  }
  /**
   * Gets a list of the given user's Organization invitations. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property that contains an array of [`OrganizationInvitation`](https://clerk.com/docs/reference/backend/types/backend-organization-invitation) objects, and a `totalCount` property that indicates the total number of Organization invitations for the user.
   */
  async getOrganizationInvitationList(params) {
    const { userId, ...queryParams } = params;
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(basePath33, userId, "organization_invitations"),
      queryParams
    });
  }
  /**
   * Removes the password credential from the given user. This is a privileged operation and does not require the user's current password. Password removal is allowed even when the user has no other sign-in method configured.
   *
   * By default, existing sessions remain active. Set `signOutOfOtherSessions` to `true` to revoke sessions active when the request is processed.
   * @param userId - The ID of the user whose password to remove.
   * @param params - Options for the request.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   * @example
   * ### Keep existing sessions active
   *
   * ```ts
   * const user = await clerkClient.users.removePassword('user_123');
   * ```
   *
   * @example
   * ### Revoke existing sessions
   *
   * ```ts
   * const user = await clerkClient.users.removePassword('user_123', {
   *   signOutOfOtherSessions: true,
   * });
   * ```
   */
  async removePassword(userId, params = {}) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "remove_password"),
      bodyParams: params
    });
  }
  /** Check that the user's password matches the supplied input. Useful for custom auth flows and re-verification. */
  async verifyPassword(params) {
    const { userId, password } = params;
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "verify_password"),
      bodyParams: { password }
    });
  }
  /** Verify that the provided TOTP or backup code is valid for the user. Verifying a backup code will result it in being consumed (i.e., it will become invalid). Useful for custom auth flows and re-verification. */
  async verifyTOTP(params) {
    const { userId, code } = params;
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "verify_totp"),
      bodyParams: { code }
    });
  }
  /**
   * Marks the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user) as banned, which means that all their sessions are revoked and they are not allowed to sign in again.
   * @param userId - The ID of the user to ban.
   */
  async banUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "ban")
    });
  }
  /**
   * Removes the ban mark from the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user), allowing them to sign in again.
   * @param userId - The ID of the user to unban.
   */
  async unbanUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "unban")
    });
  }
  /**
   * Locks the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user), which means that they are not allowed to sign in again until the lock expires or is manually unlocked. By default, lockout duration is 1 hour, but it can be configured in the application's [**System**](https://dashboard.clerk.com/~/protect/rules) settings under **Protect** > **Rules**. See the [guide on user locks](https://clerk.com/docs/guides/secure/user-lockout).
   * @param userId - The ID of the user to lock.
   */
  async lockUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "lock")
    });
  }
  /** Removes a sign-in lock from the given [`User`](https://clerk.com/docs/reference/backend/types/backend-user), allowing them to sign in again. See the [guide on user locks](https://clerk.com/docs/guides/secure/user-lockout).
   * @param userId - The ID of the user to unlock.
   */
  async unlockUser(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "unlock")
    });
  }
  /**
   * Deletes a user's profile image.
   * @param userId - The ID of the user to delete the profile image for.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async deleteUserProfileImage(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, userId, "profile_image")
    });
  }
  /**
   * Deletes the passkey identification for a given user and notifies them through email.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteUserPasskey(params) {
    this.requireId(params.userId);
    this.requireId(params.passkeyIdentificationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, params.userId, "passkeys", params.passkeyIdentificationId)
    });
  }
  /**
   * Deletes a Web3 wallet identification for the given user.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteUserWeb3Wallet(params) {
    this.requireId(params.userId);
    this.requireId(params.web3WalletIdentificationId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, params.userId, "web3_wallets", params.web3WalletIdentificationId)
    });
  }
  /**
   * Deletes an external account for the given user.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async deleteUserExternalAccount(params) {
    this.requireId(params.userId);
    this.requireId(params.externalAccountId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, params.userId, "external_accounts", params.externalAccountId)
    });
  }
  /**
   * Deletes all backup codes for the given user.
   * @param userId - The ID of the user to delete backup codes for.
   */
  async deleteUserBackupCodes(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, userId, "backup_code")
    });
  }
  /**
   * Deletes all of the TOTP secrets for the given user.
   * @param userId - The ID of the user to delete the TOTP secrets for.
   */
  async deleteUserTOTP(userId) {
    this.requireId(userId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath33, userId, "totp")
    });
  }
  /**
   * Sets the given user's password as compromised. The user will be prompted to reset their password on their next sign-in. See the [guide on password protection and rules](/docs/guides/secure/password-protection-and-rules#reject-compromised-passwords) for more information.
   * @param userId - The ID of the user to set the password as compromised for.
   * @param params - Other parameters for the request.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async setPasswordCompromised(userId, params = {
    revokeAllSessions: false
  }) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "password", "set_compromised"),
      bodyParams: params
    });
  }
  /**
   * Unsets the given user's password as compromised. The user will no longer be prompted to reset their password on their next sign-in. See the [guide on password protection and rules](/docs/guides/secure/password-protection-and-rules#reject-compromised-passwords) for more information.
   * @param userId - The ID of the user to unset the password as compromised for.
   * @returns The updated [`User`](https://clerk.com/docs/reference/backend/types/backend-user).
   */
  async unsetPasswordCompromised(userId) {
    this.requireId(userId);
    return this.request({
      method: "POST",
      path: joinPaths(basePath33, userId, "password", "unset_compromised")
    });
  }
};
var basePath34 = "/waitlist_entries";
var WaitlistEntryAPI = class extends AbstractAPI {
  /**
   * Gets a list of waitlist entries for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`WaitlistEntry`](https://clerk.com/docs/reference/backend/types/backend-waitlist-entry) objects and a `totalCount` property containing the total number of waitlist entries for the instance.
   */
  async list(params = {}) {
    return this.request({
      method: "GET",
      path: basePath34,
      queryParams: params
    });
  }
  /**
   * Create a waitlist entry for the given email address. If the email address is already on the waitlist, no new entry will be created and the existing waitlist entry will be returned.
   * @returns The created or existing [`WaitlistEntry`](https://clerk.com/docs/reference/backend/types/backend-waitlist-entry) object.
   */
  async create(params) {
    return this.request({
      method: "POST",
      path: basePath34,
      bodyParams: params
    });
  }
  /**
   * Creates multiple waitlist entries for the given email addresses. If an email address is already on the waitlist, no new entry will be created and the existing waitlist entry will be returned.
   * @returns An array of created or existing [`WaitlistEntry`](https://clerk.com/docs/reference/backend/types/backend-waitlist-entry) objects.
   */
  async createBulk(params) {
    return this.request({
      method: "POST",
      path: joinPaths(basePath34, "bulk"),
      bodyParams: params
    });
  }
  /**
   * Invites the given waitlist entry.
   * @param id - The waitlist entry ID.
   * @param params - Optional parameters for inviting the waitlist entry.
   * @returns The invited [`WaitlistEntry`](https://clerk.com/docs/reference/backend/types/backend-waitlist-entry) object.
   */
  async invite(id, params = {}) {
    this.requireId(id);
    return this.request({
      method: "POST",
      path: joinPaths(basePath34, id, "invite"),
      bodyParams: params
    });
  }
  /**
   * Rejects the given waitlist entry.
   * @param id - The ID of the waitlist entry to reject.
   * @returns The rejected [`WaitlistEntry`](https://clerk.com/docs/reference/backend/types/backend-waitlist-entry) object.
   */
  async reject(id) {
    this.requireId(id);
    return this.request({
      method: "POST",
      path: joinPaths(basePath34, id, "reject")
    });
  }
  /**
   * Deletes the given pending waitlist entry.
   * @param id - The ID of the waitlist entry to delete.
   * @returns The [`DeletedObject`](https://clerk.com/docs/reference/backend/types/deleted-object) object.
   */
  async delete(id) {
    this.requireId(id);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath34, id)
    });
  }
};
var basePath35 = "/webhooks";
var WebhookAPI = class extends AbstractAPI {
  async createSvixApp() {
    return this.request({
      method: "POST",
      path: joinPaths(basePath35, "svix")
    });
  }
  async generateSvixAuthURL() {
    return this.request({
      method: "POST",
      path: joinPaths(basePath35, "svix_url")
    });
  }
  async deleteSvixApp() {
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath35, "svix")
    });
  }
};
var basePath36 = "/billing";
var organizationBasePath = "/organizations";
var userBasePath = "/users";
var BillingAPI = class extends AbstractAPI {
  /**
   * Gets the list of Billing Plans for the instance. By default, the list is returned in descending order by creation date (newest first).
   * @returns A [`PaginatedResourceResponse`](https://clerk.com/docs/reference/backend/types/paginated-resource-response) object with a `data` property containing an array of [`BillingPlan`](https://clerk.com/docs/reference/backend/types/billing-plan) objects and a `totalCount` property containing the total number of Billing Plans for the instance.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  async getPlanList(params) {
    return this.request({
      method: "GET",
      path: joinPaths(basePath36, "plans"),
      queryParams: params
    });
  }
  /**
   * Cancels the given Subscription Item.
   * @param subscriptionItemId - The ID of the Subscription Item to cancel.
   * @param params - The parameters for the request.
   * @returns The cancelled [`BillingSubscriptionItem`](https://clerk.com/docs/reference/backend/types/billing-subscription-item) object.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  async cancelSubscriptionItem(subscriptionItemId, params) {
    this.requireId(subscriptionItemId);
    return this.request({
      method: "DELETE",
      path: joinPaths(basePath36, "subscription_items", subscriptionItemId),
      queryParams: params
    });
  }
  /**
   * Extends the free trial for the given Subscription Item.
   * @param subscriptionItemId - The ID of the Subscription Item to extend the free trial for.
   * @param params - The parameters for the request.
   * @returns The updated [`BillingSubscriptionItem`](https://clerk.com/docs/reference/backend/types/billing-subscription-item) object.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  async extendSubscriptionItemFreeTrial(subscriptionItemId, params) {
    this.requireId(subscriptionItemId);
    return this.request({
      method: "POST",
      path: joinPaths("/billing", "subscription_items", subscriptionItemId, "extend_free_trial"),
      bodyParams: params
    });
  }
  /**
   * Gets the [`BillingSubscription`](https://clerk.com/docs/reference/backend/types/billing-subscription) for the given Organization.
   * @param organizationId - The ID of the Organization to get the Billing Subscription for.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  async getOrganizationBillingSubscription(organizationId) {
    this.requireId(organizationId);
    return this.request({
      method: "GET",
      path: joinPaths(organizationBasePath, organizationId, "billing", "subscription")
    });
  }
  /**
   * Gets the [`BillingSubscription`](https://clerk.com/docs/reference/backend/types/billing-subscription) for the given User.
   * @param userId - The ID of the User to get the Billing Subscription for.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  async getUserBillingSubscription(userId) {
    this.requireId(userId);
    return this.request({
      method: "GET",
      path: joinPaths(userBasePath, userId, "billing", "subscription")
    });
  }
};
var isObject = (value) => typeof value === "object" && value !== null;
var isObjectCustom = (value) => isObject(value) && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date) && !(globalThis.Blob && value instanceof globalThis.Blob);
var mapObjectSkip = /* @__PURE__ */ Symbol("mapObjectSkip");
var _mapObject = (object, mapper, options, isSeen = /* @__PURE__ */ new WeakMap()) => {
  options = {
    deep: false,
    target: {},
    ...options
  };
  if (isSeen.has(object)) {
    return isSeen.get(object);
  }
  isSeen.set(object, options.target);
  const { target } = options;
  delete options.target;
  const mapArray = (array) => array.map((element) => isObjectCustom(element) ? _mapObject(element, mapper, options, isSeen) : element);
  if (Array.isArray(object)) {
    return mapArray(object);
  }
  for (const [key, value] of Object.entries(object)) {
    const mapResult = mapper(key, value, object);
    if (mapResult === mapObjectSkip) {
      continue;
    }
    let [newKey, newValue, { shouldRecurse = true } = {}] = mapResult;
    if (newKey === "__proto__") {
      continue;
    }
    if (options.deep && shouldRecurse && isObjectCustom(newValue)) {
      newValue = Array.isArray(newValue) ? mapArray(newValue) : _mapObject(newValue, mapper, options, isSeen);
    }
    target[newKey] = newValue;
  }
  return target;
};
function mapObject(object, mapper, options) {
  if (!isObject(object)) {
    throw new TypeError(`Expected an object, got \`${object}\` (${typeof object})`);
  }
  if (Array.isArray(object)) {
    throw new TypeError("Expected an object, got an array");
  }
  return _mapObject(object, mapper, options);
}
var SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
var SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
var SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;
var DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
var SPLIT_REPLACE_VALUE = "$1\0$2";
var DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
function split(value) {
  let result = value.trim();
  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
  result = result.replace(DEFAULT_STRIP_REGEXP, "\0");
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === "\0")
    start++;
  if (start === end)
    return [];
  while (result.charAt(end - 1) === "\0")
    end--;
  return result.slice(start, end).split(/\0/g);
}
function splitSeparateNumbers(value) {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match2 = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match2) {
      const offset = match2.index + (match2[1] ?? match2[2]).length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}
function noCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? " ") + suffix;
}
function snakeCase(input, options) {
  return noCase(input, { delimiter: "_", ...options });
}
function lowerFactory(locale) {
  return locale === false ? (input) => input.toLowerCase() : (input) => input.toLocaleLowerCase(locale);
}
function splitPrefixSuffix(input, options = {}) {
  const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;
  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char))
      break;
    prefixIndex++;
  }
  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char))
      break;
    suffixIndex = index;
  }
  return [
    input.slice(0, prefixIndex),
    splitFn(input.slice(prefixIndex, suffixIndex)),
    input.slice(suffixIndex)
  ];
}
var PlainObjectConstructor = {}.constructor;
function snakecaseKeys(obj, options) {
  if (Array.isArray(obj)) {
    if (obj.some((item) => item.constructor !== PlainObjectConstructor)) {
      throw new Error("obj must be array of plain objects");
    }
    options = { deep: true, exclude: [], parsingOptions: {}, ...options };
    const convertCase2 = options.snakeCase || ((key) => snakeCase(key, options.parsingOptions));
    return obj.map((item) => {
      return mapObject(item, (key, val) => {
        return [
          matches(options.exclude, key) ? key : convertCase2(key),
          val,
          mapperOptions(key, val, options)
        ];
      }, options);
    });
  } else {
    if (obj.constructor !== PlainObjectConstructor) {
      throw new Error("obj must be an plain object");
    }
  }
  options = { deep: true, exclude: [], parsingOptions: {}, ...options };
  const convertCase = options.snakeCase || ((key) => snakeCase(key, options.parsingOptions));
  return mapObject(obj, (key, val) => {
    return [
      matches(options.exclude, key) ? key : convertCase(key),
      val,
      mapperOptions(key, val, options)
    ];
  }, options);
}
function matches(patterns, value) {
  return patterns.some((pattern) => {
    return typeof pattern === "string" ? pattern === value : pattern.test(value);
  });
}
function mapperOptions(key, val, options) {
  return options.shouldRecurse ? { shouldRecurse: options.shouldRecurse(key, val) } : void 0;
}
var snakecase_keys_default = snakecaseKeys;
var AccountlessApplication = class _AccountlessApplication {
  constructor(publishableKey, secretKey, claimUrl, apiKeysUrl) {
    this.publishableKey = publishableKey;
    this.secretKey = secretKey;
    this.claimUrl = claimUrl;
    this.apiKeysUrl = apiKeysUrl;
  }
  static fromJSON(data) {
    return new _AccountlessApplication(data.publishable_key, data.secret_key, data.claim_url, data.api_keys_url);
  }
};
var AgentTask = class _AgentTask {
  constructor(agentId, taskId, agentTaskId, url) {
    this.agentId = agentId;
    this.taskId = taskId;
    this.agentTaskId = agentTaskId;
    this.url = url;
  }
  /**
   * Creates an AgentTask instance from a JSON object.
   *
   * @param data - The JSON object containing Agent Task data
   * @returns A new AgentTask instance
   */
  static fromJSON(data) {
    const agentTaskId = data.agent_task_id ?? data.task_id ?? "";
    return new _AgentTask(data.agent_id, agentTaskId, agentTaskId, data.url);
  }
};
var ActorToken = class _ActorToken {
  constructor(id, status, userId, actor, token, url, createdAt, updatedAt) {
    this.id = id;
    this.status = status;
    this.userId = userId;
    this.actor = actor;
    this.token = token;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _ActorToken(
      data.id,
      data.status,
      data.user_id,
      data.actor,
      data.token,
      data.url,
      data.created_at,
      data.updated_at
    );
  }
};
var AllowlistIdentifier = class _AllowlistIdentifier {
  constructor(id, identifier, identifierType, createdAt, updatedAt, instanceId, invitationId) {
    this.id = id;
    this.identifier = identifier;
    this.identifierType = identifierType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.instanceId = instanceId;
    this.invitationId = invitationId;
  }
  static fromJSON(data) {
    return new _AllowlistIdentifier(
      data.id,
      data.identifier,
      data.identifier_type,
      data.created_at,
      data.updated_at,
      data.instance_id,
      data.invitation_id
    );
  }
};
var APIKey = class _APIKey {
  constructor(id, type, name, subject, scopes, claims, revoked, revocationReason, expired, expiration, createdBy, description, lastUsedAt, createdAt, updatedAt, secret) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.subject = subject;
    this.scopes = scopes;
    this.claims = claims;
    this.revoked = revoked;
    this.revocationReason = revocationReason;
    this.expired = expired;
    this.expiration = expiration;
    this.createdBy = createdBy;
    this.description = description;
    this.lastUsedAt = lastUsedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.secret = secret;
  }
  static fromJSON(data) {
    return new _APIKey(
      data.id,
      data.type,
      data.name,
      data.subject,
      data.scopes,
      data.claims,
      data.revoked,
      data.revocation_reason,
      data.expired,
      data.expiration,
      data.created_by,
      data.description,
      data.last_used_at,
      data.created_at,
      data.updated_at,
      data.secret
    );
  }
};
var BlocklistIdentifier = class _BlocklistIdentifier {
  constructor(id, identifier, identifierType, createdAt, updatedAt, instanceId) {
    this.id = id;
    this.identifier = identifier;
    this.identifierType = identifierType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.instanceId = instanceId;
  }
  static fromJSON(data) {
    return new _BlocklistIdentifier(
      data.id,
      data.identifier,
      data.identifier_type,
      data.created_at,
      data.updated_at,
      data.instance_id
    );
  }
};
var SessionActivity = class _SessionActivity {
  constructor(id, isMobile, ipAddress, city, country, browserVersion, browserName, deviceType) {
    this.id = id;
    this.isMobile = isMobile;
    this.ipAddress = ipAddress;
    this.city = city;
    this.country = country;
    this.browserVersion = browserVersion;
    this.browserName = browserName;
    this.deviceType = deviceType;
  }
  static fromJSON(data) {
    return new _SessionActivity(
      data.id,
      data.is_mobile,
      data.ip_address,
      data.city,
      data.country,
      data.browser_version,
      data.browser_name,
      data.device_type
    );
  }
};
var Session = class _Session {
  constructor(id, clientId, userId, status, lastActiveAt, expireAt, abandonAt, createdAt, updatedAt, lastActiveOrganizationId, latestActivity, actor = null) {
    this.id = id;
    this.clientId = clientId;
    this.userId = userId;
    this.status = status;
    this.lastActiveAt = lastActiveAt;
    this.expireAt = expireAt;
    this.abandonAt = abandonAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastActiveOrganizationId = lastActiveOrganizationId;
    this.latestActivity = latestActivity;
    this.actor = actor;
  }
  static fromJSON(data) {
    return new _Session(
      data.id,
      data.client_id,
      data.user_id,
      data.status,
      data.last_active_at,
      data.expire_at,
      data.abandon_at,
      data.created_at,
      data.updated_at,
      data.last_active_organization_id,
      data.latest_activity && SessionActivity.fromJSON(data.latest_activity),
      data.actor
    );
  }
};
var Client = class _Client {
  constructor(id, sessionIds, sessions, signInId, signUpId, lastActiveSessionId, lastAuthenticationStrategy, createdAt, updatedAt) {
    this.id = id;
    this.sessionIds = sessionIds;
    this.sessions = sessions;
    this.signInId = signInId;
    this.signUpId = signUpId;
    this.lastActiveSessionId = lastActiveSessionId;
    this.lastAuthenticationStrategy = lastAuthenticationStrategy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _Client(
      data.id,
      data.session_ids,
      data.sessions.map((x) => Session.fromJSON(x)),
      data.sign_in_id,
      data.sign_up_id,
      data.last_active_session_id,
      data.last_authentication_strategy,
      data.created_at,
      data.updated_at
    );
  }
};
var CnameTarget = class _CnameTarget {
  constructor(host, value, required) {
    this.host = host;
    this.value = value;
    this.required = required;
  }
  static fromJSON(data) {
    return new _CnameTarget(data.host, data.value, data.required);
  }
};
var Cookies2 = class _Cookies {
  constructor(cookies) {
    this.cookies = cookies;
  }
  static fromJSON(data) {
    return new _Cookies(data.cookies);
  }
};
var DeletedObject = class _DeletedObject {
  constructor(object, id, slug, deleted) {
    this.object = object;
    this.id = id;
    this.slug = slug;
    this.deleted = deleted;
  }
  static fromJSON(data) {
    return new _DeletedObject(data.object, data.id || null, data.slug || null, data.deleted);
  }
};
var Domain = class _Domain {
  constructor(id, name, isSatellite, frontendApiUrl, developmentOrigin, cnameTargets, accountsPortalUrl, proxyUrl) {
    this.id = id;
    this.name = name;
    this.isSatellite = isSatellite;
    this.frontendApiUrl = frontendApiUrl;
    this.developmentOrigin = developmentOrigin;
    this.cnameTargets = cnameTargets;
    this.accountsPortalUrl = accountsPortalUrl;
    this.proxyUrl = proxyUrl;
  }
  static fromJSON(data) {
    return new _Domain(
      data.id,
      data.name,
      data.is_satellite,
      data.frontend_api_url,
      data.development_origin,
      data.cname_targets && data.cname_targets.map((x) => CnameTarget.fromJSON(x)),
      data.accounts_portal_url,
      data.proxy_url
    );
  }
};
var IdentificationLink = class _IdentificationLink {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
  static fromJSON(data) {
    return new _IdentificationLink(data.id, data.type);
  }
};
var Verification = class _Verification {
  constructor(status, strategy, externalVerificationRedirectURL = null, attempts = null, expireAt = null, nonce = null, message = null) {
    this.status = status;
    this.strategy = strategy;
    this.externalVerificationRedirectURL = externalVerificationRedirectURL;
    this.attempts = attempts;
    this.expireAt = expireAt;
    this.nonce = nonce;
    this.message = message;
  }
  static fromJSON(data) {
    return new _Verification(
      data.status,
      data.strategy,
      data.external_verification_redirect_url ? new URL(data.external_verification_redirect_url) : null,
      data.attempts,
      data.expire_at,
      data.nonce
    );
  }
};
var EmailAddress = class _EmailAddress {
  constructor(id, emailAddress, verification, linkedTo) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _EmailAddress(
      data.id,
      data.email_address,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};
var Feature = class _Feature {
  constructor(id, name, description, slug, avatarUrl) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.slug = slug;
    this.avatarUrl = avatarUrl;
  }
  static fromJSON(data) {
    return new _Feature(data.id, data.name, data.description ?? null, data.slug, data.avatar_url ?? null);
  }
};
var BillingPlan = class _BillingPlan {
  constructor(id, name, slug, description, isDefault, isRecurring, hasBaseFee, publiclyVisible, fee, annualFee, annualMonthlyFee, forPayerType, features, avatarUrl, freeTrialDays, freeTrialEnabled) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.isDefault = isDefault;
    this.isRecurring = isRecurring;
    this.hasBaseFee = hasBaseFee;
    this.publiclyVisible = publiclyVisible;
    this.fee = fee;
    this.annualFee = annualFee;
    this.annualMonthlyFee = annualMonthlyFee;
    this.forPayerType = forPayerType;
    this.features = features;
    this.avatarUrl = avatarUrl;
    this.freeTrialDays = freeTrialDays;
    this.freeTrialEnabled = freeTrialEnabled;
  }
  static fromJSON(data) {
    const formatAmountJSON = (fee) => {
      return fee ? {
        amount: fee.amount,
        amountFormatted: fee.amount_formatted,
        currency: fee.currency,
        currencySymbol: fee.currency_symbol
      } : null;
    };
    return new _BillingPlan(
      data.id,
      data.name,
      data.slug,
      data.description ?? null,
      data.is_default,
      data.is_recurring,
      data.has_base_fee,
      data.publicly_visible,
      formatAmountJSON(data.fee),
      formatAmountJSON(data.annual_fee),
      formatAmountJSON(data.annual_monthly_fee),
      data.for_payer_type,
      (data.features ?? []).map((feature) => Feature.fromJSON(feature)),
      data.avatar_url,
      data.free_trial_days,
      data.free_trial_enabled
    );
  }
};
var billingMoneyAmountFromJSON = (amount) => ({
  amount: amount.amount,
  amountFormatted: amount.amount_formatted,
  currency: amount.currency,
  currencySymbol: amount.currency_symbol
});
var billingPerUnitTotalsFromJSON = (perUnitTotals) => perUnitTotals.map((perUnitTotal) => ({
  name: perUnitTotal.name,
  blockSize: perUnitTotal.block_size,
  tiers: perUnitTotal.tiers.map((tier) => ({
    quantity: tier.quantity,
    feePerBlock: billingMoneyAmountFromJSON(tier.fee_per_block),
    total: billingMoneyAmountFromJSON(tier.total)
  }))
}));
var billingCreditsFromJSON = (credits) => ({
  proration: credits.proration ? {
    amount: billingMoneyAmountFromJSON(credits.proration.amount),
    cycleDaysRemaining: credits.proration.cycle_days_remaining,
    cycleDaysTotal: credits.proration.cycle_days_total,
    cycleRemainingPercent: credits.proration.cycle_remaining_percent
  } : null,
  payer: credits.payer ? {
    remainingBalance: billingMoneyAmountFromJSON(credits.payer.remaining_balance),
    appliedAmount: billingMoneyAmountFromJSON(credits.payer.applied_amount)
  } : null,
  total: billingMoneyAmountFromJSON(credits.total)
});
var billingAppliedDiscountFromJSON = (discount) => ({
  amount: billingMoneyAmountFromJSON(discount.amount),
  discountId: discount.discount_id,
  name: discount.name,
  effect: discount.effect,
  percentOff: discount.percent_off,
  amountOff: discount.amount_off ? billingMoneyAmountFromJSON(discount.amount_off) : void 0,
  promoCode: discount.promo_code,
  cyclesRemaining: discount.cycles_remaining,
  durationInCycles: discount.duration_in_cycles
});
var billingDiscountsFromJSON = (discounts) => ({
  proration: discounts.proration ? {
    amount: billingMoneyAmountFromJSON(discounts.proration.amount),
    cycleDaysPassed: discounts.proration.cycle_days_passed,
    cycleDaysTotal: discounts.proration.cycle_days_total,
    cyclePassedPercent: discounts.proration.cycle_passed_percent
  } : null,
  discount: discounts.discount ? billingAppliedDiscountFromJSON(discounts.discount) : void 0,
  total: billingMoneyAmountFromJSON(discounts.total)
});
var billingPeriodTotalsFromJSON = (totals) => ({
  subtotal: billingMoneyAmountFromJSON(totals.subtotal),
  baseFee: billingMoneyAmountFromJSON(totals.base_fee),
  taxTotal: billingMoneyAmountFromJSON(totals.tax_total),
  grandTotal: billingMoneyAmountFromJSON(totals.grand_total),
  perUnitTotals: totals.per_unit_totals ? billingPerUnitTotalsFromJSON(totals.per_unit_totals) : void 0
});
var billingTotalsFromJSON = (totals) => ({
  subtotal: billingMoneyAmountFromJSON(totals.subtotal),
  baseFee: totals.base_fee ? billingMoneyAmountFromJSON(totals.base_fee) : null,
  taxTotal: billingMoneyAmountFromJSON(totals.tax_total),
  grandTotal: billingMoneyAmountFromJSON(totals.grand_total),
  totalDueAfterFreeTrial: totals.total_due_after_free_trial ? billingMoneyAmountFromJSON(totals.total_due_after_free_trial) : totals.total_due_after_free_trial,
  credit: totals.credit ? billingMoneyAmountFromJSON(totals.credit) : totals.credit,
  credits: totals.credits ? billingCreditsFromJSON(totals.credits) : null,
  discounts: totals.discounts ? billingDiscountsFromJSON(totals.discounts) : null,
  pastDue: totals.past_due ? billingMoneyAmountFromJSON(totals.past_due) : totals.past_due,
  totalDueNow: totals.total_due_now ? billingMoneyAmountFromJSON(totals.total_due_now) : void 0,
  perUnitTotals: totals.per_unit_totals ? billingPerUnitTotalsFromJSON(totals.per_unit_totals) : void 0,
  totalsDuePerPeriod: totals.totals_due_per_period ? billingPeriodTotalsFromJSON(totals.totals_due_per_period) : void 0,
  totalDuePerPeriod: totals.total_due_per_period ? billingMoneyAmountFromJSON(totals.total_due_per_period) : void 0
});
var billingSubscriptionItemSeatsFromJSON = (seats) => ({
  quantity: seats.quantity,
  tiers: seats.tiers ? seats.tiers.map((tier) => ({
    quantity: tier.quantity,
    feePerBlock: billingMoneyAmountFromJSON(tier.fee_per_block),
    total: billingMoneyAmountFromJSON(tier.total)
  })) : void 0
});
var BillingSubscriptionItem = class _BillingSubscriptionItem {
  constructor(id, instanceId, status, planPeriod, periodStart, nextPayment, amount, plan, planId, priceId, createdAt, updatedAt, periodEnd, canceledAt, pastDueAt, endedAt, payerId, isFreeTrial, lifetimePaid, seats) {
    this.id = id;
    this.instanceId = instanceId;
    this.status = status;
    this.planPeriod = planPeriod;
    this.periodStart = periodStart;
    this.nextPayment = nextPayment;
    this.amount = amount;
    this.plan = plan;
    this.planId = planId;
    this.priceId = priceId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.periodEnd = periodEnd;
    this.canceledAt = canceledAt;
    this.pastDueAt = pastDueAt;
    this.endedAt = endedAt;
    this.payerId = payerId;
    this.isFreeTrial = isFreeTrial;
    this.lifetimePaid = lifetimePaid;
    this.seats = seats;
  }
  static fromJSON(data) {
    const nextPayment = data.next_payment ? {
      amount: billingMoneyAmountFromJSON(data.next_payment.amount),
      date: data.next_payment.date,
      perUnitTotals: data.next_payment.per_unit_totals ? billingPerUnitTotalsFromJSON(data.next_payment.per_unit_totals) : void 0,
      totals: data.next_payment.totals ? billingTotalsFromJSON(data.next_payment.totals) : void 0
    } : data.next_payment;
    return new _BillingSubscriptionItem(
      data.id,
      data.instance_id,
      data.status,
      data.plan_period,
      data.period_start,
      nextPayment,
      data.amount ? billingMoneyAmountFromJSON(data.amount) : void 0,
      data.plan ? BillingPlan.fromJSON(data.plan) : null,
      data.plan_id ?? null,
      data.price_id ?? null,
      data.created_at,
      data.updated_at,
      data.period_end,
      data.canceled_at,
      data.past_due_at,
      data.ended_at,
      data.payer_id,
      data.is_free_trial,
      data.lifetime_paid ? billingMoneyAmountFromJSON(data.lifetime_paid) : void 0,
      data.seats ? billingSubscriptionItemSeatsFromJSON(data.seats) : void 0
    );
  }
};
var BillingSubscription = class _BillingSubscription {
  constructor(id, instanceId, status, payerId, createdAt, updatedAt, activeAt, pastDueAt, subscriptionItems, nextPayment, eligibleForFreeTrial) {
    this.id = id;
    this.instanceId = instanceId;
    this.status = status;
    this.payerId = payerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.activeAt = activeAt;
    this.pastDueAt = pastDueAt;
    this.subscriptionItems = subscriptionItems;
    this.nextPayment = nextPayment;
    this.eligibleForFreeTrial = eligibleForFreeTrial;
  }
  static fromJSON(data) {
    const nextPayment = data.next_payment ? {
      date: data.next_payment.date,
      amount: billingMoneyAmountFromJSON(data.next_payment.amount),
      perUnitTotals: data.next_payment.per_unit_totals ? billingPerUnitTotalsFromJSON(data.next_payment.per_unit_totals) : void 0,
      totals: data.next_payment.totals ? billingTotalsFromJSON(data.next_payment.totals) : void 0
    } : null;
    return new _BillingSubscription(
      data.id,
      data.instance_id,
      data.status,
      data.payer_id,
      data.created_at,
      data.updated_at,
      data.active_at ?? null,
      data.past_due_at ?? null,
      (data.subscription_items ?? []).map((item) => BillingSubscriptionItem.fromJSON(item)),
      nextPayment,
      data.eligible_for_free_trial ?? false
    );
  }
};
var EnterpriseAccountConnection = class _EnterpriseAccountConnection {
  constructor(id, active, allowIdpInitiated, allowSubdomains, disableAdditionalIdentifications, domain, logoPublicUrl, name, protocol, provider, syncUserAttributes, createdAt, updatedAt) {
    this.id = id;
    this.active = active;
    this.allowIdpInitiated = allowIdpInitiated;
    this.allowSubdomains = allowSubdomains;
    this.disableAdditionalIdentifications = disableAdditionalIdentifications;
    this.domain = domain;
    this.logoPublicUrl = logoPublicUrl;
    this.name = name;
    this.protocol = protocol;
    this.provider = provider;
    this.syncUserAttributes = syncUserAttributes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _EnterpriseAccountConnection(
      data.id,
      data.active,
      data.allow_idp_initiated,
      data.allow_subdomains,
      data.disable_additional_identifications,
      data.domain,
      data.logo_public_url,
      data.name,
      data.protocol,
      data.provider,
      data.sync_user_attributes,
      data.created_at,
      data.updated_at
    );
  }
};
var EnterpriseAccount = class _EnterpriseAccount {
  constructor(id, active, emailAddress, enterpriseConnection, firstName, lastName, protocol, provider, providerUserId, publicMetadata, verification, lastAuthenticatedAt, enterpriseConnectionId) {
    this.id = id;
    this.active = active;
    this.emailAddress = emailAddress;
    this.enterpriseConnection = enterpriseConnection;
    this.firstName = firstName;
    this.lastName = lastName;
    this.protocol = protocol;
    this.provider = provider;
    this.providerUserId = providerUserId;
    this.publicMetadata = publicMetadata;
    this.verification = verification;
    this.lastAuthenticatedAt = lastAuthenticatedAt;
    this.enterpriseConnectionId = enterpriseConnectionId;
  }
  static fromJSON(data) {
    return new _EnterpriseAccount(
      data.id,
      data.active,
      data.email_address,
      data.enterprise_connection && EnterpriseAccountConnection.fromJSON(data.enterprise_connection),
      data.first_name,
      data.last_name,
      data.protocol,
      data.provider,
      data.provider_user_id,
      data.public_metadata,
      data.verification && Verification.fromJSON(data.verification),
      data.last_authenticated_at,
      data.enterprise_connection_id
    );
  }
};
var SamlConnectionIdpCertificate = class _SamlConnectionIdpCertificate {
  constructor(certificate, issuedAt, expiresAt) {
    this.certificate = certificate;
    this.issuedAt = issuedAt;
    this.expiresAt = expiresAt;
  }
  static fromJSON(data) {
    return new _SamlConnectionIdpCertificate(data.certificate, data.issued_at, data.expires_at);
  }
};
var EnterpriseConnectionSamlConnectionLoginHint = class _EnterpriseConnectionSamlConnectionLoginHint {
  constructor(mode, source) {
    this.mode = mode;
    this.source = source;
  }
  static fromJSON(data) {
    return new _EnterpriseConnectionSamlConnectionLoginHint(data.mode, data.source);
  }
};
var EnterpriseConnectionCustomAttribute = class _EnterpriseConnectionCustomAttribute {
  constructor(name, key, ssoPath, scimPath, multiValued) {
    this.name = name;
    this.key = key;
    this.ssoPath = ssoPath;
    this.scimPath = scimPath;
    this.multiValued = multiValued;
  }
  static fromJSON(data) {
    return new _EnterpriseConnectionCustomAttribute(
      data.name,
      data.key,
      data.sso_path,
      data.scim_path,
      data.multi_valued
    );
  }
};
var EnterpriseConnectionSamlConnection = class _EnterpriseConnectionSamlConnection {
  constructor(id, name, idpEntityId, idpSsoUrl, idpCertificate, idpCertificateIssuedAt, idpCertificateExpiresAt, idpMetadataUrl, idpMetadata, acsUrl, spEntityId, spMetadataUrl, syncUserAttributes, allowSubdomains, allowIdpInitiated, active, forceAuthn, loginHint, idpCertificates) {
    this.id = id;
    this.name = name;
    this.idpEntityId = idpEntityId;
    this.idpSsoUrl = idpSsoUrl;
    this.idpCertificate = idpCertificate;
    this.idpCertificateIssuedAt = idpCertificateIssuedAt;
    this.idpCertificateExpiresAt = idpCertificateExpiresAt;
    this.idpMetadataUrl = idpMetadataUrl;
    this.idpMetadata = idpMetadata;
    this.acsUrl = acsUrl;
    this.spEntityId = spEntityId;
    this.spMetadataUrl = spMetadataUrl;
    this.syncUserAttributes = syncUserAttributes;
    this.allowSubdomains = allowSubdomains;
    this.allowIdpInitiated = allowIdpInitiated;
    this.active = active;
    this.forceAuthn = forceAuthn;
    this.loginHint = loginHint;
    this.idpCertificates = idpCertificates;
  }
  static fromJSON(data) {
    return new _EnterpriseConnectionSamlConnection(
      data.id,
      data.name,
      data.idp_entity_id,
      data.idp_sso_url,
      data.idp_certificate,
      data.idp_certificate_issued_at,
      data.idp_certificate_expires_at,
      data.idp_metadata_url,
      data.idp_metadata,
      data.acs_url,
      data.sp_entity_id,
      data.sp_metadata_url,
      data.sync_user_attributes,
      data.allow_subdomains,
      data.allow_idp_initiated,
      data.active,
      data.force_authn,
      EnterpriseConnectionSamlConnectionLoginHint.fromJSON(data.login_hint),
      (data.idp_certificates ?? []).map((certificate) => SamlConnectionIdpCertificate.fromJSON(certificate))
    );
  }
};
var EnterpriseConnectionOauthConfig = class _EnterpriseConnectionOauthConfig {
  constructor(id, name, clientId, discoveryUrl, logoPublicUrl, createdAt, updatedAt, providerKey, authUrl, tokenUrl, userInfoUrl, requiresPkce) {
    this.id = id;
    this.name = name;
    this.clientId = clientId;
    this.discoveryUrl = discoveryUrl;
    this.logoPublicUrl = logoPublicUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.providerKey = providerKey;
    this.authUrl = authUrl;
    this.tokenUrl = tokenUrl;
    this.userInfoUrl = userInfoUrl;
    this.requiresPkce = requiresPkce;
  }
  static fromJSON(data) {
    return new _EnterpriseConnectionOauthConfig(
      data.id,
      data.name,
      data.client_id,
      data.discovery_url,
      data.logo_public_url,
      data.created_at,
      data.updated_at,
      data.provider_key,
      data.auth_url,
      data.token_url,
      data.user_info_url,
      data.requires_pkce
    );
  }
};
var EnterpriseConnection = class _EnterpriseConnection {
  constructor(id, name, domains, organizationId, active, syncUserAttributes, allowSubdomains, disableAdditionalIdentifications, createdAt, updatedAt, samlConnection, oauthConfig, provider, logoPublicUrl, allowOrganizationAccountLinking, authenticatable, disableJitProvisioning, customAttributes) {
    this.id = id;
    this.name = name;
    this.domains = domains;
    this.organizationId = organizationId;
    this.active = active;
    this.syncUserAttributes = syncUserAttributes;
    this.allowSubdomains = allowSubdomains;
    this.disableAdditionalIdentifications = disableAdditionalIdentifications;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.samlConnection = samlConnection;
    this.oauthConfig = oauthConfig;
    this.provider = provider;
    this.logoPublicUrl = logoPublicUrl;
    this.allowOrganizationAccountLinking = allowOrganizationAccountLinking;
    this.authenticatable = authenticatable;
    this.disableJitProvisioning = disableJitProvisioning;
    this.customAttributes = customAttributes;
  }
  static fromJSON(data) {
    return new _EnterpriseConnection(
      data.id,
      data.name,
      data.domains,
      data.organization_id ?? null,
      data.active,
      data.sync_user_attributes,
      data.allow_subdomains,
      data.disable_additional_identifications,
      data.created_at,
      data.updated_at,
      data.saml_connection != null ? EnterpriseConnectionSamlConnection.fromJSON(data.saml_connection) : null,
      data.oauth_config != null ? EnterpriseConnectionOauthConfig.fromJSON(data.oauth_config) : null,
      data.provider,
      data.logo_public_url,
      data.allow_organization_account_linking,
      data.authenticatable,
      data.disable_jit_provisioning,
      data.custom_attributes?.map((attr) => EnterpriseConnectionCustomAttribute.fromJSON(attr))
    );
  }
};
var ExternalAccount = class _ExternalAccount {
  constructor(id, provider, providerUserId, identificationId, externalId, approvedScopes, emailAddress, firstName, lastName, imageUrl, username, phoneNumber, publicMetadata = {}, label, verification, externalAccountId) {
    this.id = id;
    this.provider = provider;
    this.providerUserId = providerUserId;
    this.identificationId = identificationId;
    this.externalId = externalId;
    this.approvedScopes = approvedScopes;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageUrl = imageUrl;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.publicMetadata = publicMetadata;
    this.label = label;
    this.verification = verification;
    this.externalAccountId = externalAccountId;
  }
  static fromJSON(data) {
    return new _ExternalAccount(
      data.id,
      data.provider,
      data.provider_user_id,
      data.identification_id,
      data.provider_user_id,
      data.approved_scopes,
      data.email_address,
      data.first_name,
      data.last_name,
      data.image_url || "",
      data.username,
      data.phone_number,
      data.public_metadata,
      data.label,
      data.verification && Verification.fromJSON(data.verification),
      data.external_account_id
    );
  }
};
var Instance = class _Instance {
  constructor(id, environmentType, allowedOrigins) {
    this.id = id;
    this.environmentType = environmentType;
    this.allowedOrigins = allowedOrigins;
  }
  static fromJSON(data) {
    return new _Instance(data.id, data.environment_type, data.allowed_origins);
  }
};
var InstanceRestrictions = class _InstanceRestrictions {
  constructor(allowlist, blocklist, blockEmailSubaddresses, blockDisposableEmailDomains, ignoreDotsForGmailAddresses) {
    this.allowlist = allowlist;
    this.blocklist = blocklist;
    this.blockEmailSubaddresses = blockEmailSubaddresses;
    this.blockDisposableEmailDomains = blockDisposableEmailDomains;
    this.ignoreDotsForGmailAddresses = ignoreDotsForGmailAddresses;
  }
  static fromJSON(data) {
    return new _InstanceRestrictions(
      data.allowlist,
      data.blocklist,
      data.block_email_subaddresses,
      data.block_disposable_email_domains,
      data.ignore_dots_for_gmail_addresses
    );
  }
};
var InstanceSettings = class _InstanceSettings {
  constructor(id, restrictedToAllowlist, fromEmailAddress, progressiveSignUp, enhancedEmailDeliverability) {
    this.id = id;
    this.restrictedToAllowlist = restrictedToAllowlist;
    this.fromEmailAddress = fromEmailAddress;
    this.progressiveSignUp = progressiveSignUp;
    this.enhancedEmailDeliverability = enhancedEmailDeliverability;
  }
  static fromJSON(data) {
    return new _InstanceSettings(
      data.id,
      data.restricted_to_allowlist,
      data.from_email_address,
      data.progressive_sign_up,
      data.enhanced_email_deliverability
    );
  }
};
var Invitation = class _Invitation {
  constructor(id, emailAddress, publicMetadata, createdAt, updatedAt, status, url, revoked) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.publicMetadata = publicMetadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.url = url;
    this.revoked = revoked;
    this._raw = null;
  }
  get raw() {
    return this._raw;
  }
  static fromJSON(data) {
    const res = new _Invitation(
      data.id,
      data.email_address,
      data.public_metadata,
      data.created_at,
      data.updated_at,
      data.status,
      data.url,
      data.revoked
    );
    res._raw = data;
    return res;
  }
};
var ObjectType = {
  AccountlessApplication: "accountless_application",
  ActorToken: "actor_token",
  AgentTask: "agent_task",
  AllowlistIdentifier: "allowlist_identifier",
  ApiKey: "api_key",
  BlocklistIdentifier: "blocklist_identifier",
  Client: "client",
  Cookies: "cookies",
  Domain: "domain",
  Email: "email",
  EnterpriseAccount: "enterprise_account",
  EnterpriseConnection: "enterprise_connection",
  EmailAddress: "email_address",
  ExternalAccount: "external_account",
  FacebookAccount: "facebook_account",
  GoogleAccount: "google_account",
  Instance: "instance",
  InstanceRestrictions: "instance_restrictions",
  InstanceSettings: "instance_settings",
  Invitation: "invitation",
  Machine: "machine",
  MachineScope: "machine_scope",
  MachineSecretKey: "machine_secret_key",
  M2MToken: "machine_to_machine_token",
  JwtTemplate: "jwt_template",
  OauthAccessToken: "oauth_access_token",
  IdpOAuthAccessToken: "clerk_idp_oauth_access_token",
  OAuthApplication: "oauth_application",
  Organization: "organization",
  OrganizationDomain: "organization_domain",
  OrganizationInvitation: "organization_invitation",
  OrganizationMembership: "organization_membership",
  OrganizationSettings: "organization_settings",
  PhoneNumber: "phone_number",
  ProxyCheck: "proxy_check",
  RedirectUrl: "redirect_url",
  SamlConnection: "saml_connection",
  Session: "session",
  SignInAttempt: "sign_in_attempt",
  SignInToken: "sign_in_token",
  SignUpAttempt: "sign_up_attempt",
  SmsMessage: "sms_message",
  User: "user",
  WaitlistEntry: "waitlist_entry",
  Web3Wallet: "web3_wallet",
  Token: "token",
  TotalCount: "total_count",
  TestingToken: "testing_token",
  Role: "role",
  RoleSet: "role_set",
  RoleSetItem: "role_set_item",
  RoleSetMigration: "role_set_migration",
  Permission: "permission",
  BillingPayer: "commerce_payer",
  BillingPaymentAttempt: "commerce_payment_attempt",
  BillingSubscription: "commerce_subscription",
  BillingSubscriptionItem: "commerce_subscription_item",
  BillingPlan: "commerce_plan",
  Feature: "feature"
};
var JwtTemplate = class _JwtTemplate {
  constructor(id, name, claims, lifetime, allowedClockSkew, customSigningKey, signingAlgorithm, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.claims = claims;
    this.lifetime = lifetime;
    this.allowedClockSkew = allowedClockSkew;
    this.customSigningKey = customSigningKey;
    this.signingAlgorithm = signingAlgorithm;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _JwtTemplate(
      data.id,
      data.name,
      data.claims,
      data.lifetime,
      data.allowed_clock_skew,
      data.custom_signing_key,
      data.signing_algorithm,
      data.created_at,
      data.updated_at
    );
  }
};
var Machine = class _Machine {
  constructor(id, name, instanceId, createdAt, updatedAt, scopedMachines, defaultTokenTtl, secretKey) {
    this.id = id;
    this.name = name;
    this.instanceId = instanceId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.scopedMachines = scopedMachines;
    this.defaultTokenTtl = defaultTokenTtl;
    this.secretKey = secretKey;
  }
  static fromJSON(data) {
    return new _Machine(
      data.id,
      data.name,
      data.instance_id,
      data.created_at,
      data.updated_at,
      data.scoped_machines.map(
        (m) => new _Machine(
          m.id,
          m.name,
          m.instance_id,
          m.created_at,
          m.updated_at,
          [],
          // Nested machines don't have scoped_machines
          m.default_token_ttl
        )
      ),
      data.default_token_ttl,
      data.secret_key
    );
  }
};
var MachineScope = class _MachineScope {
  constructor(fromMachineId, toMachineId, createdAt, deleted) {
    this.fromMachineId = fromMachineId;
    this.toMachineId = toMachineId;
    this.createdAt = createdAt;
    this.deleted = deleted;
  }
  static fromJSON(data) {
    return new _MachineScope(data.from_machine_id, data.to_machine_id, data.created_at, data.deleted);
  }
};
var MachineSecretKey = class _MachineSecretKey {
  constructor(secret) {
    this.secret = secret;
  }
  static fromJSON(data) {
    return new _MachineSecretKey(data.secret);
  }
};
var OauthAccessToken = class _OauthAccessToken {
  constructor(externalAccountId, provider, token, publicMetadata = {}, label, scopes, tokenSecret, expiresAt, idToken) {
    this.externalAccountId = externalAccountId;
    this.provider = provider;
    this.token = token;
    this.publicMetadata = publicMetadata;
    this.label = label;
    this.scopes = scopes;
    this.tokenSecret = tokenSecret;
    this.expiresAt = expiresAt;
    this.idToken = idToken;
  }
  static fromJSON(data) {
    return new _OauthAccessToken(
      data.external_account_id,
      data.provider,
      data.token,
      data.public_metadata,
      data.label || "",
      data.scopes,
      data.token_secret,
      data.expires_at,
      data.id_token
    );
  }
};
var OAuthApplication = class _OAuthApplication {
  constructor(id, instanceId, name, clientId, clientUri, clientImageUrl, dynamicallyRegistered, consentScreenEnabled, pkceRequired, isPublic, scopes, redirectUris, authorizeUrl, tokenFetchUrl, userInfoUrl, discoveryUrl, tokenIntrospectionUrl, createdAt, updatedAt, clientSecret) {
    this.id = id;
    this.instanceId = instanceId;
    this.name = name;
    this.clientId = clientId;
    this.clientUri = clientUri;
    this.clientImageUrl = clientImageUrl;
    this.dynamicallyRegistered = dynamicallyRegistered;
    this.consentScreenEnabled = consentScreenEnabled;
    this.pkceRequired = pkceRequired;
    this.isPublic = isPublic;
    this.scopes = scopes;
    this.redirectUris = redirectUris;
    this.authorizeUrl = authorizeUrl;
    this.tokenFetchUrl = tokenFetchUrl;
    this.userInfoUrl = userInfoUrl;
    this.discoveryUrl = discoveryUrl;
    this.tokenIntrospectionUrl = tokenIntrospectionUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.clientSecret = clientSecret;
  }
  static fromJSON(data) {
    return new _OAuthApplication(
      data.id,
      data.instance_id,
      data.name,
      data.client_id,
      data.client_uri,
      data.client_image_url,
      data.dynamically_registered,
      data.consent_screen_enabled,
      data.pkce_required,
      data.public,
      data.scopes,
      data.redirect_uris,
      data.authorize_url,
      data.token_fetch_url,
      data.user_info_url,
      data.discovery_url,
      data.token_introspection_url,
      data.created_at,
      data.updated_at,
      data.client_secret
    );
  }
};
var Organization = class _Organization {
  constructor(id, name, slug, imageUrl, hasImage, createdAt, updatedAt, publicMetadata = {}, privateMetadata = {}, maxAllowedMemberships, adminDeleteEnabled, membersCount, createdBy) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.maxAllowedMemberships = maxAllowedMemberships;
    this.adminDeleteEnabled = adminDeleteEnabled;
    this.membersCount = membersCount;
    this.createdBy = createdBy;
    this._raw = null;
  }
  get raw() {
    return this._raw;
  }
  static fromJSON(data) {
    const res = new _Organization(
      data.id,
      data.name,
      data.slug,
      data.image_url || "",
      data.has_image,
      data.created_at,
      data.updated_at,
      data.public_metadata,
      data.private_metadata,
      data.max_allowed_memberships,
      data.admin_delete_enabled,
      data.members_count,
      data.created_by
    );
    res._raw = data;
    return res;
  }
};
var OrganizationInvitation = class _OrganizationInvitation {
  constructor(id, emailAddress, role, roleName, organizationId, createdAt, updatedAt, expiresAt, url, status, publicMetadata = {}, privateMetadata = {}, publicOrganizationData) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.role = role;
    this.roleName = roleName;
    this.organizationId = organizationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.expiresAt = expiresAt;
    this.url = url;
    this.status = status;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.publicOrganizationData = publicOrganizationData;
    this._raw = null;
  }
  get raw() {
    return this._raw;
  }
  static fromJSON(data) {
    const res = new _OrganizationInvitation(
      data.id,
      data.email_address,
      data.role,
      data.role_name,
      data.organization_id,
      data.created_at,
      data.updated_at,
      data.expires_at,
      data.url,
      data.status,
      data.public_metadata,
      data.private_metadata,
      data.public_organization_data
    );
    res._raw = data;
    return res;
  }
};
var OrganizationMembership = class _OrganizationMembership {
  constructor(id, role, permissions, publicMetadata = {}, privateMetadata = {}, createdAt, updatedAt, organization, publicUserData) {
    this.id = id;
    this.role = role;
    this.permissions = permissions;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.organization = organization;
    this.publicUserData = publicUserData;
    this._raw = null;
  }
  get raw() {
    return this._raw;
  }
  static fromJSON(data) {
    const res = new _OrganizationMembership(
      data.id,
      data.role,
      data.permissions,
      data.public_metadata,
      data.private_metadata,
      data.created_at,
      data.updated_at,
      Organization.fromJSON(data.organization),
      OrganizationMembershipPublicUserData.fromJSON(data.public_user_data)
    );
    res._raw = data;
    return res;
  }
};
var OrganizationMembershipPublicUserData = class _OrganizationMembershipPublicUserData {
  constructor(identifier, firstName, lastName, imageUrl, hasImage, userId) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.userId = userId;
  }
  static fromJSON(data) {
    return new _OrganizationMembershipPublicUserData(
      data.identifier,
      data.first_name,
      data.last_name,
      data.image_url,
      data.has_image,
      data.user_id
    );
  }
};
var OrganizationSettings = class _OrganizationSettings {
  constructor(enabled, maxAllowedMemberships, maxAllowedRoles, maxAllowedPermissions, creatorRole, adminDeleteEnabled, domainsEnabled, slugDisabled, domainsEnrollmentModes, domainsDefaultRole) {
    this.enabled = enabled;
    this.maxAllowedMemberships = maxAllowedMemberships;
    this.maxAllowedRoles = maxAllowedRoles;
    this.maxAllowedPermissions = maxAllowedPermissions;
    this.creatorRole = creatorRole;
    this.adminDeleteEnabled = adminDeleteEnabled;
    this.domainsEnabled = domainsEnabled;
    this.slugDisabled = slugDisabled;
    this.domainsEnrollmentModes = domainsEnrollmentModes;
    this.domainsDefaultRole = domainsDefaultRole;
  }
  static fromJSON(data) {
    return new _OrganizationSettings(
      data.enabled,
      data.max_allowed_memberships,
      data.max_allowed_roles,
      data.max_allowed_permissions,
      data.creator_role,
      data.admin_delete_enabled,
      data.domains_enabled,
      data.slug_disabled,
      data.domains_enrollment_modes,
      data.domains_default_role
    );
  }
};
var Permission = class _Permission {
  constructor(id, name, key, description, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _Permission(data.id, data.name, data.key, data.description, data.created_at, data.updated_at);
  }
};
var PhoneNumber = class _PhoneNumber {
  constructor(id, phoneNumber, reservedForSecondFactor, defaultSecondFactor, verification, linkedTo) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.reservedForSecondFactor = reservedForSecondFactor;
    this.defaultSecondFactor = defaultSecondFactor;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _PhoneNumber(
      data.id,
      data.phone_number,
      data.reserved_for_second_factor,
      data.default_second_factor,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};
var ProxyCheck = class _ProxyCheck {
  constructor(id, domainId, lastRunAt, proxyUrl, successful, createdAt, updatedAt) {
    this.id = id;
    this.domainId = domainId;
    this.lastRunAt = lastRunAt;
    this.proxyUrl = proxyUrl;
    this.successful = successful;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _ProxyCheck(
      data.id,
      data.domain_id,
      data.last_run_at,
      data.proxy_url,
      data.successful,
      data.created_at,
      data.updated_at
    );
  }
};
var RedirectUrl = class _RedirectUrl {
  constructor(id, url, createdAt, updatedAt) {
    this.id = id;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _RedirectUrl(data.id, data.url, data.created_at, data.updated_at);
  }
};
var Role = class _Role {
  constructor(id, name, key, description, permissions, isCreatorEligible, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.description = description;
    this.permissions = permissions;
    this.isCreatorEligible = isCreatorEligible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _Role(
      data.id,
      data.name,
      data.key,
      data.description,
      (data.permissions ?? []).map((permission) => Permission.fromJSON(permission)),
      data.is_creator_eligible,
      data.created_at,
      data.updated_at
    );
  }
};
var RoleSetItem = class _RoleSetItem {
  constructor(id, name, key, description, createdAt, updatedAt, membersCount, hasMembers) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.membersCount = membersCount;
    this.hasMembers = hasMembers;
  }
  static fromJSON(data) {
    return new _RoleSetItem(
      data.id,
      data.name,
      data.key,
      data.description,
      data.created_at,
      data.updated_at,
      data.members_count,
      data.has_members
    );
  }
};
var RoleSetMigration = class _RoleSetMigration {
  constructor(id, organizationId, instanceId, sourceRoleSetId, destRoleSetId, triggerType, status, migratedMembers, mappings, createdAt, updatedAt, startedAt, completedAt) {
    this.id = id;
    this.organizationId = organizationId;
    this.instanceId = instanceId;
    this.sourceRoleSetId = sourceRoleSetId;
    this.destRoleSetId = destRoleSetId;
    this.triggerType = triggerType;
    this.status = status;
    this.migratedMembers = migratedMembers;
    this.mappings = mappings;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
  }
  static fromJSON(data) {
    return new _RoleSetMigration(
      data.id,
      data.organization_id,
      data.instance_id,
      data.source_role_set_id,
      data.dest_role_set_id,
      data.trigger_type,
      data.status,
      data.migrated_members,
      data.mappings,
      data.created_at,
      data.updated_at,
      data.started_at,
      data.completed_at
    );
  }
};
var RoleSet = class _RoleSet {
  constructor(id, name, key, description, roles, defaultRole, creatorRole, type, roleSetMigration, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.key = key;
    this.description = description;
    this.roles = roles;
    this.defaultRole = defaultRole;
    this.creatorRole = creatorRole;
    this.type = type;
    this.roleSetMigration = roleSetMigration;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _RoleSet(
      data.id,
      data.name,
      data.key,
      data.description,
      (data.roles ?? []).map((role) => RoleSetItem.fromJSON(role)),
      data.default_role ? RoleSetItem.fromJSON(data.default_role) : null,
      data.creator_role ? RoleSetItem.fromJSON(data.creator_role) : null,
      data.type,
      data.role_set_migration ? RoleSetMigration.fromJSON(data.role_set_migration) : null,
      data.created_at,
      data.updated_at
    );
  }
};
var SamlConnection = class _SamlConnection {
  constructor(id, name, domain, organizationId, idpEntityId, idpSsoUrl, idpCertificate, idpCertificateIssuedAt, idpCertificateExpiresAt, idpMetadataUrl, idpMetadata, acsUrl, spEntityId, spMetadataUrl, active, provider, userCount, syncUserAttributes, allowSubdomains, allowIdpInitiated, createdAt, updatedAt, attributeMapping, idpCertificates) {
    this.id = id;
    this.name = name;
    this.domain = domain;
    this.organizationId = organizationId;
    this.idpEntityId = idpEntityId;
    this.idpSsoUrl = idpSsoUrl;
    this.idpCertificate = idpCertificate;
    this.idpCertificateIssuedAt = idpCertificateIssuedAt;
    this.idpCertificateExpiresAt = idpCertificateExpiresAt;
    this.idpMetadataUrl = idpMetadataUrl;
    this.idpMetadata = idpMetadata;
    this.acsUrl = acsUrl;
    this.spEntityId = spEntityId;
    this.spMetadataUrl = spMetadataUrl;
    this.active = active;
    this.provider = provider;
    this.userCount = userCount;
    this.syncUserAttributes = syncUserAttributes;
    this.allowSubdomains = allowSubdomains;
    this.allowIdpInitiated = allowIdpInitiated;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.attributeMapping = attributeMapping;
    this.idpCertificates = idpCertificates;
  }
  static fromJSON(data) {
    return new _SamlConnection(
      data.id,
      data.name,
      data.domain,
      data.organization_id,
      data.idp_entity_id,
      data.idp_sso_url,
      data.idp_certificate,
      data.idp_certificate_issued_at,
      data.idp_certificate_expires_at,
      data.idp_metadata_url,
      data.idp_metadata,
      data.acs_url,
      data.sp_entity_id,
      data.sp_metadata_url,
      data.active,
      data.provider,
      data.user_count,
      data.sync_user_attributes,
      data.allow_subdomains,
      data.allow_idp_initiated,
      data.created_at,
      data.updated_at,
      data.attribute_mapping && AttributeMapping.fromJSON(data.attribute_mapping),
      (data.idp_certificates ?? []).map((certificate) => SamlConnectionIdpCertificate.fromJSON(certificate))
    );
  }
};
var AttributeMapping = class _AttributeMapping {
  constructor(userId, emailAddress, firstName, lastName) {
    this.userId = userId;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
  }
  static fromJSON(data) {
    return new _AttributeMapping(data.user_id, data.email_address, data.first_name, data.last_name);
  }
};
var SignInToken = class _SignInToken {
  constructor(id, userId, token, status, url, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.status = status;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromJSON(data) {
    return new _SignInToken(data.id, data.user_id, data.token, data.status, data.url, data.created_at, data.updated_at);
  }
};
var SignUpAttemptVerification = class _SignUpAttemptVerification {
  constructor(nextAction, supportedStrategies) {
    this.nextAction = nextAction;
    this.supportedStrategies = supportedStrategies;
  }
  static fromJSON(data) {
    return new _SignUpAttemptVerification(data.next_action, data.supported_strategies);
  }
};
var SignUpAttemptVerifications = class _SignUpAttemptVerifications {
  constructor(emailAddress, phoneNumber, web3Wallet, externalAccount) {
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.web3Wallet = web3Wallet;
    this.externalAccount = externalAccount;
  }
  static fromJSON(data) {
    return new _SignUpAttemptVerifications(
      data.email_address && SignUpAttemptVerification.fromJSON(data.email_address),
      data.phone_number && SignUpAttemptVerification.fromJSON(data.phone_number),
      data.web3_wallet && SignUpAttemptVerification.fromJSON(data.web3_wallet),
      data.external_account
    );
  }
};
var SignUpAttempt = class _SignUpAttempt {
  constructor(id, status, requiredFields, optionalFields, missingFields, unverifiedFields, verifications, username, emailAddress, phoneNumber, web3Wallet, passwordEnabled, firstName, lastName, customAction, externalId, createdSessionId, createdUserId, abandonAt, legalAcceptedAt, publicMetadata, unsafeMetadata) {
    this.id = id;
    this.status = status;
    this.requiredFields = requiredFields;
    this.optionalFields = optionalFields;
    this.missingFields = missingFields;
    this.unverifiedFields = unverifiedFields;
    this.verifications = verifications;
    this.username = username;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.web3Wallet = web3Wallet;
    this.passwordEnabled = passwordEnabled;
    this.firstName = firstName;
    this.lastName = lastName;
    this.customAction = customAction;
    this.externalId = externalId;
    this.createdSessionId = createdSessionId;
    this.createdUserId = createdUserId;
    this.abandonAt = abandonAt;
    this.legalAcceptedAt = legalAcceptedAt;
    this.publicMetadata = publicMetadata;
    this.unsafeMetadata = unsafeMetadata;
  }
  static fromJSON(data) {
    return new _SignUpAttempt(
      data.id,
      data.status,
      data.required_fields,
      data.optional_fields,
      data.missing_fields,
      data.unverified_fields,
      data.verifications ? SignUpAttemptVerifications.fromJSON(data.verifications) : null,
      data.username,
      data.email_address,
      data.phone_number,
      data.web3_wallet,
      data.password_enabled,
      data.first_name,
      data.last_name,
      data.custom_action,
      data.external_id,
      data.created_session_id,
      data.created_user_id,
      data.abandon_at,
      data.legal_accepted_at,
      data.public_metadata,
      data.unsafe_metadata
    );
  }
};
var SMSMessage = class _SMSMessage {
  constructor(id, fromPhoneNumber, toPhoneNumber, message, status, phoneNumberId, data) {
    this.id = id;
    this.fromPhoneNumber = fromPhoneNumber;
    this.toPhoneNumber = toPhoneNumber;
    this.message = message;
    this.status = status;
    this.phoneNumberId = phoneNumberId;
    this.data = data;
  }
  static fromJSON(data) {
    return new _SMSMessage(
      data.id,
      data.from_phone_number,
      data.to_phone_number,
      data.message,
      data.status,
      data.phone_number_id,
      data.data
    );
  }
};
var Token = class _Token {
  constructor(jwt) {
    this.jwt = jwt;
  }
  static fromJSON(data) {
    return new _Token(data.jwt);
  }
};
var Web3Wallet = class _Web3Wallet {
  constructor(id, web3Wallet, verification) {
    this.id = id;
    this.web3Wallet = web3Wallet;
    this.verification = verification;
  }
  static fromJSON(data) {
    return new _Web3Wallet(data.id, data.web3_wallet, data.verification && Verification.fromJSON(data.verification));
  }
};
var User = class _User {
  constructor(id, passwordEnabled, totpEnabled, backupCodeEnabled, twoFactorEnabled, banned, locked, createdAt, updatedAt, imageUrl, hasImage, primaryEmailAddressId, primaryPhoneNumberId, primaryWeb3WalletId, lastSignInAt, externalId, username, firstName, lastName, publicMetadata = {}, privateMetadata = {}, unsafeMetadata = {}, emailAddresses = [], phoneNumbers = [], web3Wallets = [], externalAccounts = [], enterpriseAccounts = [], lastActiveAt, createOrganizationEnabled, createOrganizationsLimit = null, deleteSelfEnabled, legalAcceptedAt, locale, timezone = null, deprovisioned = false) {
    this.id = id;
    this.passwordEnabled = passwordEnabled;
    this.totpEnabled = totpEnabled;
    this.backupCodeEnabled = backupCodeEnabled;
    this.twoFactorEnabled = twoFactorEnabled;
    this.banned = banned;
    this.locked = locked;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.primaryEmailAddressId = primaryEmailAddressId;
    this.primaryPhoneNumberId = primaryPhoneNumberId;
    this.primaryWeb3WalletId = primaryWeb3WalletId;
    this.lastSignInAt = lastSignInAt;
    this.externalId = externalId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.unsafeMetadata = unsafeMetadata;
    this.emailAddresses = emailAddresses;
    this.phoneNumbers = phoneNumbers;
    this.web3Wallets = web3Wallets;
    this.externalAccounts = externalAccounts;
    this.enterpriseAccounts = enterpriseAccounts;
    this.lastActiveAt = lastActiveAt;
    this.createOrganizationEnabled = createOrganizationEnabled;
    this.createOrganizationsLimit = createOrganizationsLimit;
    this.deleteSelfEnabled = deleteSelfEnabled;
    this.legalAcceptedAt = legalAcceptedAt;
    this.locale = locale;
    this.timezone = timezone;
    this.deprovisioned = deprovisioned;
    this._raw = null;
  }
  get raw() {
    return this._raw;
  }
  static fromJSON(data) {
    const res = new _User(
      data.id,
      data.password_enabled,
      data.totp_enabled,
      data.backup_code_enabled,
      data.two_factor_enabled,
      data.banned,
      data.locked,
      data.created_at,
      data.updated_at,
      data.image_url,
      data.has_image,
      data.primary_email_address_id,
      data.primary_phone_number_id,
      data.primary_web3_wallet_id,
      data.last_sign_in_at,
      data.external_id,
      data.username,
      data.first_name,
      data.last_name,
      data.public_metadata,
      data.private_metadata,
      data.unsafe_metadata,
      (data.email_addresses || []).map((x) => EmailAddress.fromJSON(x)),
      (data.phone_numbers || []).map((x) => PhoneNumber.fromJSON(x)),
      (data.web3_wallets || []).map((x) => Web3Wallet.fromJSON(x)),
      (data.external_accounts || []).map((x) => ExternalAccount.fromJSON(x)),
      (data.enterprise_accounts || []).map((x) => EnterpriseAccount.fromJSON(x)),
      data.last_active_at,
      data.create_organization_enabled,
      data.create_organizations_limit,
      data.delete_self_enabled,
      data.legal_accepted_at,
      data.locale,
      data.timezone,
      data.deprovisioned
    );
    res._raw = data;
    return res;
  }
  /**
   * The primary email address of the user.
   */
  get primaryEmailAddress() {
    return this.emailAddresses.find(({ id }) => id === this.primaryEmailAddressId) ?? null;
  }
  /**
   * The primary phone number of the user.
   */
  get primaryPhoneNumber() {
    return this.phoneNumbers.find(({ id }) => id === this.primaryPhoneNumberId) ?? null;
  }
  /**
   * The primary web3 wallet of the user.
   */
  get primaryWeb3Wallet() {
    return this.web3Wallets.find(({ id }) => id === this.primaryWeb3WalletId) ?? null;
  }
  /**
   * The full name of the user.
   */
  get fullName() {
    return [this.firstName, this.lastName].join(" ").trim() || null;
  }
};
var WaitlistEntry = class _WaitlistEntry {
  constructor(id, emailAddress, status, invitation, createdAt, updatedAt, isLocked) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.status = status;
    this.invitation = invitation;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isLocked = isLocked;
  }
  static fromJSON(data) {
    return new _WaitlistEntry(
      data.id,
      data.email_address,
      data.status,
      data.invitation && Invitation.fromJSON(data.invitation),
      data.created_at,
      data.updated_at,
      data.is_locked
    );
  }
};
function deserialize(payload) {
  let data, totalCount;
  if (Array.isArray(payload)) {
    const data2 = payload.map((item) => jsonToObject(item));
    return { data: data2 };
  } else if (isM2MTokenResponse(payload)) {
    data = payload.m2m_tokens.map((item) => jsonToObject(item));
    totalCount = payload.total_count;
    return { data, totalCount };
  } else if (isPaginated(payload)) {
    data = payload.data.map((item) => jsonToObject(item));
    totalCount = payload.total_count;
    return { data, totalCount };
  } else {
    return { data: jsonToObject(payload) };
  }
}
function isPaginated(payload) {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    return false;
  }
  return Array.isArray(payload.data) && payload.data !== void 0;
}
function isM2MTokenResponse(payload) {
  if (!payload || typeof payload !== "object" || !("m2m_tokens" in payload)) {
    return false;
  }
  return Array.isArray(payload.m2m_tokens);
}
function getCount(item) {
  return item.total_count;
}
function jsonToObject(item) {
  if (typeof item !== "string" && "object" in item && "deleted" in item) {
    return DeletedObject.fromJSON(item);
  }
  switch (item.object) {
    case ObjectType.AccountlessApplication:
      return AccountlessApplication.fromJSON(item);
    case ObjectType.ActorToken:
      return ActorToken.fromJSON(item);
    case ObjectType.AllowlistIdentifier:
      return AllowlistIdentifier.fromJSON(item);
    case ObjectType.ApiKey:
      return APIKey.fromJSON(item);
    case ObjectType.BlocklistIdentifier:
      return BlocklistIdentifier.fromJSON(item);
    case ObjectType.Client:
      return Client.fromJSON(item);
    case ObjectType.Cookies:
      return Cookies2.fromJSON(item);
    case ObjectType.Domain:
      return Domain.fromJSON(item);
    case ObjectType.EmailAddress:
      return EmailAddress.fromJSON(item);
    case ObjectType.EnterpriseAccount:
      return EnterpriseAccount.fromJSON(item);
    case ObjectType.Email:
      return Email.fromJSON(item);
    case ObjectType.IdpOAuthAccessToken:
      return IdPOAuthAccessToken.fromJSON(item);
    case ObjectType.Instance:
      return Instance.fromJSON(item);
    case ObjectType.InstanceRestrictions:
      return InstanceRestrictions.fromJSON(item);
    case ObjectType.InstanceSettings:
      return InstanceSettings.fromJSON(item);
    case ObjectType.Invitation:
      return Invitation.fromJSON(item);
    case ObjectType.JwtTemplate:
      return JwtTemplate.fromJSON(item);
    case ObjectType.Machine:
      return Machine.fromJSON(item);
    case ObjectType.MachineScope:
      return MachineScope.fromJSON(item);
    case ObjectType.MachineSecretKey:
      return MachineSecretKey.fromJSON(item);
    case ObjectType.M2MToken:
      return M2MToken.fromJSON(item);
    case ObjectType.OauthAccessToken:
      return OauthAccessToken.fromJSON(item);
    case ObjectType.OAuthApplication:
      return OAuthApplication.fromJSON(item);
    case ObjectType.Organization:
      return Organization.fromJSON(item);
    case ObjectType.OrganizationInvitation:
      return OrganizationInvitation.fromJSON(item);
    case ObjectType.OrganizationMembership:
      return OrganizationMembership.fromJSON(item);
    case ObjectType.OrganizationSettings:
      return OrganizationSettings.fromJSON(item);
    case ObjectType.Permission:
      return Permission.fromJSON(item);
    case ObjectType.PhoneNumber:
      return PhoneNumber.fromJSON(item);
    case ObjectType.ProxyCheck:
      return ProxyCheck.fromJSON(item);
    case ObjectType.RedirectUrl:
      return RedirectUrl.fromJSON(item);
    case ObjectType.Role:
      return Role.fromJSON(item);
    case ObjectType.RoleSet:
      return RoleSet.fromJSON(item);
    case ObjectType.EnterpriseConnection:
      return EnterpriseConnection.fromJSON(item);
    case ObjectType.SamlConnection:
      return SamlConnection.fromJSON(item);
    case ObjectType.SignInToken:
      return SignInToken.fromJSON(item);
    case ObjectType.AgentTask:
      return AgentTask.fromJSON(item);
    case ObjectType.SignUpAttempt:
      return SignUpAttempt.fromJSON(item);
    case ObjectType.Session:
      return Session.fromJSON(item);
    case ObjectType.SmsMessage:
      return SMSMessage.fromJSON(item);
    case ObjectType.Token:
      return Token.fromJSON(item);
    case ObjectType.TotalCount:
      return getCount(item);
    case ObjectType.User:
      return User.fromJSON(item);
    case ObjectType.WaitlistEntry:
      return WaitlistEntry.fromJSON(item);
    case ObjectType.BillingPlan:
      return BillingPlan.fromJSON(item);
    case ObjectType.BillingSubscription:
      return BillingSubscription.fromJSON(item);
    case ObjectType.BillingSubscriptionItem:
      return BillingSubscriptionItem.fromJSON(item);
    case ObjectType.Feature:
      return Feature.fromJSON(item);
    default:
      return item;
  }
}
function buildRequest(options) {
  const requestFn = async (requestOptions) => {
    const {
      secretKey,
      machineSecretKey,
      useMachineSecretKey = false,
      requireSecretKey = true,
      apiUrl = API_URL,
      apiVersion = API_VERSION,
      userAgent = USER_AGENT,
      skipApiVersionInUrl = false
    } = options;
    const { path, method, queryParams, headerParams, bodyParams, formData, options: opts } = requestOptions;
    const { deepSnakecaseBodyParamKeys = false } = opts || {};
    if (requireSecretKey) {
      assertValidSecretKey(secretKey);
    }
    const url = skipApiVersionInUrl ? joinPaths(apiUrl, path) : joinPaths(apiUrl, apiVersion, path);
    const finalUrl = new URL(url);
    if (queryParams) {
      const snakecasedQueryParams = snakecase_keys_default({ ...queryParams });
      for (const [key, val] of Object.entries(snakecasedQueryParams)) {
        if (val) {
          [val].flat().forEach((v) => finalUrl.searchParams.append(key, v));
        }
      }
    }
    const headers = new Headers({
      "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
      [constants.Headers.UserAgent]: userAgent,
      ...headerParams
    });
    const authorizationHeader = constants.Headers.Authorization;
    if (!headers.has(authorizationHeader)) {
      if (useMachineSecretKey && machineSecretKey) {
        headers.set(authorizationHeader, `Bearer ${machineSecretKey}`);
      } else if (secretKey) {
        headers.set(authorizationHeader, `Bearer ${secretKey}`);
      }
    }
    let res;
    try {
      if (formData) {
        res = await runtime.fetch(finalUrl.href, {
          method,
          headers,
          body: formData
        });
      } else {
        headers.set("Content-Type", "application/json");
        const buildBody = () => {
          const hasBody = method !== "GET" && bodyParams && Object.keys(bodyParams).length > 0;
          if (!hasBody) {
            return null;
          }
          const formatKeys = (object) => snakecase_keys_default(object, { deep: deepSnakecaseBodyParamKeys });
          return {
            body: JSON.stringify(Array.isArray(bodyParams) ? bodyParams.map(formatKeys) : formatKeys(bodyParams))
          };
        };
        res = await runtime.fetch(finalUrl.href, {
          method,
          headers,
          ...buildBody()
        });
      }
      if (res.status === 204) {
        return {
          data: void 0,
          errors: null
        };
      }
      const isJSONResponse = res?.headers && res.headers?.get(constants.Headers.ContentType) === constants.ContentTypes.Json;
      const responseBody = await (isJSONResponse ? res.json() : res.text());
      if (!res.ok) {
        return {
          data: null,
          errors: parseErrors2(responseBody),
          status: res?.status,
          statusText: res?.statusText,
          clerkTraceId: getTraceId(responseBody, res?.headers),
          retryAfter: getRetryAfter(res?.headers)
        };
      }
      return {
        ...deserialize(responseBody),
        errors: null
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          data: null,
          errors: [
            {
              code: "unexpected_error",
              message: err.message || "Unexpected error"
            }
          ],
          clerkTraceId: getTraceId(err, res?.headers)
        };
      }
      return {
        data: null,
        errors: parseErrors2(err),
        status: res?.status,
        statusText: res?.statusText,
        clerkTraceId: getTraceId(err, res?.headers),
        retryAfter: getRetryAfter(res?.headers)
      };
    }
  };
  return withLegacyRequestReturn(requestFn);
}
function getTraceId(data, headers) {
  if (data && typeof data === "object" && "clerk_trace_id" in data && typeof data.clerk_trace_id === "string") {
    return data.clerk_trace_id;
  }
  const cfRay = headers?.get("cf-ray");
  return cfRay || "";
}
function getRetryAfter(headers) {
  const retryAfter = headers?.get("Retry-After");
  if (!retryAfter) {
    return;
  }
  const value = parseInt(retryAfter, 10);
  if (isNaN(value)) {
    return;
  }
  return value;
}
function parseErrors2(data) {
  if (!!data && typeof data === "object" && "errors" in data) {
    const errors = data.errors;
    return errors.length > 0 ? errors.map(parseError) : [];
  }
  return [];
}
function withLegacyRequestReturn(cb) {
  return async (...args) => {
    const { data, errors, totalCount, status, statusText, clerkTraceId, retryAfter } = await cb(...args);
    if (errors) {
      const error = new ClerkAPIResponseError(statusText || "", {
        data: [],
        status,
        clerkTraceId,
        retryAfter
      });
      error.errors = errors;
      throw error;
    }
    if (typeof totalCount !== "undefined") {
      return { data, totalCount };
    }
    return data;
  };
}
function createBackendApiClient(options) {
  const request = buildRequest(options);
  return {
    __experimental_accountlessApplications: new AccountlessApplicationAPI(
      buildRequest({ ...options, requireSecretKey: false })
    ),
    actorTokens: new ActorTokenAPI(request),
    /**
     * @experimental This is an experimental API for the Agent Tasks feature that is available under a private beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    agentTasks: new AgentTaskAPI(request),
    allowlistIdentifiers: new AllowlistIdentifierAPI(request),
    apiKeys: new APIKeysAPI(
      buildRequest({
        ...options,
        skipApiVersionInUrl: true
      })
    ),
    betaFeatures: new BetaFeaturesAPI(request),
    blocklistIdentifiers: new BlocklistIdentifierAPI(request),
    /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */
    billing: new BillingAPI(request),
    clients: new ClientAPI(request),
    domains: new DomainAPI(request),
    emailAddresses: new EmailAddressAPI(request),
    /**
     * @experimental This calls an internal, not-yet-public endpoint for sending
     * transactional emails and is subject to change. It is advised to
     * [pin](https://clerk.com/docs/pinning) the SDK version to avoid breaking changes.
     */
    emails: new EmailApi(request),
    enterpriseConnections: new EnterpriseConnectionAPI(request),
    idPOAuthAccessToken: new IdPOAuthAccessTokenApi(
      buildRequest({
        ...options,
        skipApiVersionInUrl: true
      })
    ),
    instance: new InstanceAPI(request),
    invitations: new InvitationAPI(request),
    jwks: new JwksAPI(request),
    jwtTemplates: new JwtTemplatesApi(request),
    machines: new MachineApi(request),
    m2m: new M2MTokenApi(
      buildRequest({
        ...options,
        skipApiVersionInUrl: true,
        requireSecretKey: false,
        useMachineSecretKey: true
      }),
      {
        secretKey: options.secretKey,
        apiUrl: options.apiUrl,
        jwtKey: options.jwtKey
      }
    ),
    oauthApplications: new OAuthApplicationsApi(request),
    organizations: new OrganizationAPI(request),
    organizationPermissions: new OrganizationPermissionAPI(request),
    organizationRoles: new OrganizationRoleAPI(request),
    phoneNumbers: new PhoneNumberAPI(request),
    proxyChecks: new ProxyCheckAPI(request),
    redirectUrls: new RedirectUrlAPI(request),
    roleSets: new RoleSetAPI(request),
    sessions: new SessionAPI(request),
    signInTokens: new SignInTokenAPI(request),
    signUps: new SignUpAPI(request),
    testingTokens: new TestingTokenAPI(request),
    users: new UserAPI(request),
    waitlistEntries: new WaitlistEntryAPI(request),
    webhooks: new WebhookAPI(request),
    /**
     * @deprecated Use `enterpriseConnections` instead.
     */
    samlConnections: new SamlConnectionAPI(request)
  };
}
var createDebug = (data) => {
  return () => {
    const res = { ...data };
    res.secretKey = (res.secretKey || "").substring(0, 7);
    res.jwtKey = (res.jwtKey || "").substring(0, 7);
    res.sessionToken = (res.sessionToken || "").substring(0, 7);
    res.tokenInHeader = (res.tokenInHeader || "").substring(0, 7);
    res.sessionTokenInCookie = (res.sessionTokenInCookie || "").substring(0, 7);
    res.refreshTokenInCookie = (res.refreshTokenInCookie || "").substring(0, 7);
    res.devBrowserToken = (res.devBrowserToken || "").substring(0, 7);
    res.handshakeToken = (res.handshakeToken || "").substring(0, 7);
    return { ...res };
  };
};
function signedInAuthObject(authenticateContext, sessionToken, sessionClaims) {
  const { actor, sessionId, sessionStatus, userId, orgId, orgRole, orgSlug, orgPermissions, factorVerificationAge } = __experimental_JWTPayloadToAuthObjectProperties(sessionClaims);
  const apiClient = createBackendApiClient(authenticateContext);
  const getToken = createGetToken({
    sessionId,
    sessionToken,
    fetcher: async (sessionId2, template, expiresInSeconds) => (await apiClient.sessions.getToken(sessionId2, template || "", expiresInSeconds)).jwt
  });
  return {
    tokenType: TokenType.SessionToken,
    actor,
    sessionClaims,
    sessionId,
    sessionStatus,
    userId,
    orgId,
    orgRole,
    orgSlug,
    orgPermissions,
    factorVerificationAge,
    getToken,
    has: createCheckAuthorization({
      orgId,
      orgRole,
      orgPermissions,
      userId,
      factorVerificationAge,
      features: sessionClaims.fea || "",
      plans: sessionClaims.pla || ""
    }),
    debug: createDebug({ ...authenticateContext, sessionToken }),
    isAuthenticated: true
  };
}
function signedOutAuthObject(debugData, initialSessionStatus) {
  return {
    tokenType: TokenType.SessionToken,
    sessionClaims: null,
    sessionId: null,
    sessionStatus: initialSessionStatus ?? null,
    userId: null,
    actor: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    orgPermissions: null,
    factorVerificationAge: null,
    getToken: () => Promise.resolve(null),
    has: () => false,
    debug: createDebug(debugData),
    isAuthenticated: false
  };
}
function authenticatedMachineObject(tokenType, token, verificationResult, debugData) {
  const baseObject = {
    id: verificationResult.id,
    subject: verificationResult.subject,
    getToken: () => Promise.resolve(token),
    has: () => false,
    debug: createDebug(debugData),
    isAuthenticated: true
  };
  switch (tokenType) {
    case TokenType.ApiKey: {
      const result = verificationResult;
      return {
        ...baseObject,
        tokenType,
        name: result.name,
        claims: result.claims,
        scopes: result.scopes,
        userId: result.subject.startsWith("user_") ? result.subject : null,
        orgId: result.subject.startsWith("org_") ? result.subject : null
      };
    }
    case TokenType.M2MToken: {
      const result = verificationResult;
      return {
        ...baseObject,
        tokenType,
        claims: result.claims,
        scopes: result.scopes,
        machineId: result.subject
      };
    }
    case TokenType.OAuthToken: {
      const result = verificationResult;
      return {
        ...baseObject,
        tokenType,
        scopes: result.scopes,
        userId: result.subject,
        clientId: result.clientId
      };
    }
    default:
      throw new Error(`Invalid token type: ${tokenType}`);
  }
}
function unauthenticatedMachineObject(tokenType, debugData) {
  const baseObject = {
    id: null,
    subject: null,
    scopes: null,
    has: () => false,
    getToken: () => Promise.resolve(null),
    debug: createDebug(debugData),
    isAuthenticated: false
  };
  switch (tokenType) {
    case TokenType.ApiKey: {
      return {
        ...baseObject,
        tokenType,
        name: null,
        claims: null,
        scopes: null,
        userId: null,
        orgId: null
      };
    }
    case TokenType.M2MToken: {
      return {
        ...baseObject,
        tokenType,
        claims: null,
        scopes: null,
        machineId: null
      };
    }
    case TokenType.OAuthToken: {
      return {
        ...baseObject,
        tokenType,
        scopes: null,
        userId: null,
        clientId: null
      };
    }
    default:
      throw new Error(`Invalid token type: ${tokenType}`);
  }
}
function invalidTokenAuthObject() {
  return {
    isAuthenticated: false,
    tokenType: null,
    getToken: () => Promise.resolve(null),
    has: () => false,
    debug: () => ({})
  };
}
var createGetToken = (params) => {
  const { fetcher, sessionToken, sessionId } = params || {};
  return async (options = {}) => {
    if (!sessionId) {
      return null;
    }
    if (options.template || options.expiresInSeconds !== void 0) {
      return fetcher(sessionId, options.template, options.expiresInSeconds);
    }
    return sessionToken;
  };
};
var AuthStatus = {
  SignedIn: "signed-in",
  SignedOut: "signed-out",
  Handshake: "handshake"
};
var AuthErrorReason = {
  ClientUATWithoutSessionToken: "client-uat-but-no-session-token",
  DevBrowserMissing: "dev-browser-missing",
  DevBrowserSync: "dev-browser-sync",
  PrimaryRespondsToSyncing: "primary-responds-to-syncing",
  PrimaryDomainCrossOriginSync: "primary-domain-cross-origin-sync",
  SatelliteCookieNeedsSyncing: "satellite-needs-syncing",
  SessionTokenAndUATMissing: "session-token-and-uat-missing",
  SessionTokenMissing: "session-token-missing",
  SessionTokenExpired: "session-token-expired",
  SessionTokenIATBeforeClientUAT: "session-token-iat-before-client-uat",
  SessionTokenNBF: "session-token-nbf",
  SessionTokenIatInTheFuture: "session-token-iat-in-the-future",
  SessionTokenWithoutClientUAT: "session-token-but-no-client-uat",
  ActiveOrganizationMismatch: "active-organization-mismatch",
  TokenTypeMismatch: "token-type-mismatch",
  UnexpectedError: "unexpected-error"
};
function signedIn(params) {
  const { authenticateContext, headers = new Headers(), token } = params;
  const toAuth = (({ treatPendingAsSignedOut = true } = {}) => {
    if (params.tokenType === TokenType.SessionToken) {
      const { sessionClaims } = params;
      const authObject = signedInAuthObject(authenticateContext, token, sessionClaims);
      if (treatPendingAsSignedOut && authObject.sessionStatus === "pending") {
        return signedOutAuthObject(void 0, authObject.sessionStatus);
      }
      return authObject;
    }
    const { machineData } = params;
    return authenticatedMachineObject(params.tokenType, token, machineData, authenticateContext);
  });
  return {
    status: AuthStatus.SignedIn,
    reason: null,
    message: null,
    proxyUrl: authenticateContext.proxyUrl || "",
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: true,
    isAuthenticated: true,
    tokenType: params.tokenType,
    toAuth,
    headers,
    token
  };
}
function signedOut(params) {
  const { authenticateContext, headers = new Headers(), reason, message = "", tokenType } = params;
  const toAuth = (() => {
    if (tokenType === TokenType.SessionToken) {
      return signedOutAuthObject({ ...authenticateContext, status: AuthStatus.SignedOut, reason, message });
    }
    return unauthenticatedMachineObject(tokenType, { reason, message, headers });
  });
  return withDebugHeaders({
    status: AuthStatus.SignedOut,
    reason,
    message,
    proxyUrl: authenticateContext.proxyUrl || "",
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: false,
    isAuthenticated: false,
    tokenType,
    toAuth,
    headers,
    token: null
  });
}
function handshake(authenticateContext, reason, message = "", headers) {
  return withDebugHeaders({
    status: AuthStatus.Handshake,
    reason,
    message,
    publishableKey: authenticateContext.publishableKey || "",
    isSatellite: authenticateContext.isSatellite || false,
    domain: authenticateContext.domain || "",
    proxyUrl: authenticateContext.proxyUrl || "",
    signInUrl: authenticateContext.signInUrl || "",
    signUpUrl: authenticateContext.signUpUrl || "",
    afterSignInUrl: authenticateContext.afterSignInUrl || "",
    afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
    isSignedIn: false,
    isAuthenticated: false,
    tokenType: TokenType.SessionToken,
    toAuth: () => null,
    headers,
    token: null
  });
}
function signedOutInvalidToken() {
  const authObject = invalidTokenAuthObject();
  return withDebugHeaders({
    status: AuthStatus.SignedOut,
    reason: AuthErrorReason.TokenTypeMismatch,
    message: "",
    proxyUrl: "",
    publishableKey: "",
    isSatellite: false,
    domain: "",
    signInUrl: "",
    signUpUrl: "",
    afterSignInUrl: "",
    afterSignUpUrl: "",
    isSignedIn: false,
    isAuthenticated: false,
    tokenType: null,
    toAuth: () => authObject,
    headers: new Headers(),
    token: null
  });
}
var withDebugHeaders = (requestState) => {
  const headers = new Headers(requestState.headers || {});
  if (requestState.message) {
    try {
      headers.set(constants.Headers.AuthMessage, requestState.message);
    } catch {
    }
  }
  if (requestState.reason) {
    try {
      headers.set(constants.Headers.AuthReason, requestState.reason);
    } catch {
    }
  }
  if (requestState.status) {
    try {
      headers.set(constants.Headers.AuthStatus, requestState.status);
    } catch {
    }
  }
  requestState.headers = headers;
  return requestState;
};
var import_cookie = __toESM(require_dist());
var ClerkUrl = class extends URL {
  isCrossOrigin(other) {
    return this.origin !== new URL(other.toString()).origin;
  }
};
var createClerkUrl = (...args) => {
  return new ClerkUrl(...args);
};
var ClerkRequest = class extends Request {
  constructor(input, init) {
    const url = typeof input !== "string" && "url" in input ? input.url : String(input);
    let cloneInit;
    if (init) {
      cloneInit = init;
    } else if (typeof input !== "string") {
      cloneInit = new Proxy(input, {
        get(target, prop) {
          if (prop === "signal" || prop === "body") {
            return void 0;
          }
          return Reflect.get(target, prop, target);
        }
      });
    }
    super(url, cloneInit);
    this.clerkUrl = this.deriveUrlFromHeaders(this);
    this.cookies = this.parseCookies(this);
  }
  toJSON() {
    return {
      url: this.clerkUrl.href,
      method: this.method,
      headers: JSON.stringify(Object.fromEntries(this.headers)),
      clerkUrl: this.clerkUrl.toString(),
      cookies: JSON.stringify(Object.fromEntries(this.cookies))
    };
  }
  /**
   * Used to fix request.url using the x-forwarded-* headers
   * TODO add detailed description of the issues this solves
   */
  deriveUrlFromHeaders(req) {
    const initialUrl = new URL(req.url);
    const forwardedProto = req.headers.get(constants.Headers.ForwardedProto);
    const forwardedHost = req.headers.get(constants.Headers.ForwardedHost);
    const host = req.headers.get(constants.Headers.Host);
    const protocol = initialUrl.protocol;
    const resolvedHost = this.getFirstValueFromHeader(forwardedHost) ?? host;
    const resolvedProtocol = this.getFirstValueFromHeader(forwardedProto) ?? protocol?.replace(/[:/]/, "");
    const origin = resolvedHost && resolvedProtocol ? `${resolvedProtocol}://${resolvedHost}` : initialUrl.origin;
    if (origin === initialUrl.origin) {
      return createClerkUrl(initialUrl);
    }
    try {
      return createClerkUrl(initialUrl.pathname + initialUrl.search, origin);
    } catch {
      return createClerkUrl(initialUrl);
    }
  }
  getFirstValueFromHeader(value) {
    return value?.split(",")[0];
  }
  parseCookies(req) {
    const cookiesRecord = (0, import_cookie.parse)(req.headers.get("cookie") || "");
    return new Map(Object.entries(cookiesRecord));
  }
};
var createClerkRequest = (...args) => {
  const isClerkRequest = args[0] && typeof args[0] === "object" && "clerkUrl" in args[0] && "cookies" in args[0];
  return isClerkRequest ? args[0] : new ClerkRequest(...args);
};
var getCookieName = (cookieDirective) => {
  return cookieDirective.split(";")[0]?.split("=")[0];
};
var getCookieValue = (cookieDirective) => {
  return cookieDirective.split(";")[0]?.split("=")[1];
};
async function verifyToken(token, options) {
  const { data: decodedResult, errors } = decodeJwt(token);
  if (errors) {
    return { errors };
  }
  const { header } = decodedResult;
  const { kid } = header;
  if (header.cat === JWT_CATEGORY_M2M_TOKEN) {
    return {
      errors: [
        new TokenVerificationError({
          action: TokenVerificationErrorAction.EnsureClerkJWT,
          reason: TokenVerificationErrorReason.TokenInvalid,
          message: "Invalid session token category."
        })
      ]
    };
  }
  try {
    let key;
    if (options.jwtKey) {
      key = loadClerkJwkFromPem({ kid, pem: options.jwtKey });
    } else if (options.secretKey) {
      key = await loadClerkJWKFromRemote({ ...options, kid });
    } else {
      return {
        errors: [
          new TokenVerificationError({
            action: TokenVerificationErrorAction.SetClerkJWTKey,
            message: "Failed to resolve JWK during verification.",
            reason: TokenVerificationErrorReason.JWKFailedToResolve
          })
        ]
      };
    }
    return await verifyJwt(token, { ...options, key });
  } catch (error) {
    return { errors: [error] };
  }
}
function handleClerkAPIError(tokenType, err, notFoundMessage) {
  if (isClerkAPIResponseError(err)) {
    let code;
    let message;
    switch (err.status) {
      case 401:
        code = MachineTokenVerificationErrorCode.InvalidSecretKey;
        message = err.errors[0]?.message || "Invalid secret key";
        break;
      case 404:
        code = MachineTokenVerificationErrorCode.TokenInvalid;
        message = notFoundMessage;
        break;
      default:
        code = MachineTokenVerificationErrorCode.UnexpectedError;
        message = "Unexpected error";
    }
    return {
      data: void 0,
      tokenType,
      errors: [
        new MachineTokenVerificationError({
          message,
          code,
          status: err.status
        })
      ]
    };
  }
  return {
    data: void 0,
    tokenType,
    errors: [
      new MachineTokenVerificationError({
        message: "Unexpected error",
        code: MachineTokenVerificationErrorCode.UnexpectedError,
        status: err.status
      })
    ]
  };
}
async function verifyM2MToken(token, options) {
  try {
    const client = createBackendApiClient(options);
    const verifiedToken = await client.m2m.verify({ token });
    return { data: verifiedToken, tokenType: TokenType.M2MToken, errors: void 0 };
  } catch (err) {
    return handleClerkAPIError(TokenType.M2MToken, err, "Machine token not found");
  }
}
async function verifyOAuthToken(accessToken, options) {
  try {
    const client = createBackendApiClient(options);
    const verifiedToken = await client.idPOAuthAccessToken.verify(accessToken, { audience: options.audience });
    return { data: verifiedToken, tokenType: TokenType.OAuthToken, errors: void 0 };
  } catch (err) {
    if (err instanceof TokenVerificationError) {
      return {
        data: void 0,
        tokenType: TokenType.OAuthToken,
        errors: [
          new MachineTokenVerificationError({
            code: MachineTokenVerificationErrorCode.TokenVerificationFailed,
            message: err.message
          })
        ]
      };
    }
    return handleClerkAPIError(TokenType.OAuthToken, err, "OAuth token not found");
  }
}
async function verifyAPIKey(secret, options) {
  try {
    const client = createBackendApiClient(options);
    const verifiedToken = await client.apiKeys.verify(secret);
    return { data: verifiedToken, tokenType: TokenType.ApiKey, errors: void 0 };
  } catch (err) {
    return handleClerkAPIError(TokenType.ApiKey, err, "API key not found");
  }
}
async function verifyMachineAuthToken(token, options) {
  if (isJwtFormat(token)) {
    let decodedResult;
    try {
      const { data, errors: decodeErrors } = decodeJwt(token);
      if (decodeErrors) {
        throw decodeErrors[0];
      }
      decodedResult = data;
    } catch (e) {
      return {
        data: void 0,
        tokenType: TokenType.M2MToken,
        errors: [
          new MachineTokenVerificationError({
            code: MachineTokenVerificationErrorCode.TokenInvalid,
            message: e.message
          })
        ]
      };
    }
    if (typeof decodedResult.payload.sub === "string" && decodedResult.payload.sub.startsWith(M2M_SUBJECT_PREFIX)) {
      return verifyM2MJwt(token, decodedResult, options);
    }
    if (OAUTH_ACCESS_TOKEN_TYPES.includes(decodedResult.header.typ)) {
      return verifyOAuthJwt(token, decodedResult, options);
    }
    return {
      data: void 0,
      tokenType: TokenType.OAuthToken,
      errors: [
        new MachineTokenVerificationError({
          code: MachineTokenVerificationErrorCode.TokenVerificationFailed,
          message: `Invalid JWT type: ${decodedResult.header.typ ?? "missing"}. Expected one of: ${OAUTH_ACCESS_TOKEN_TYPES.join(", ")} for OAuth, or sub starting with 'mch_' for M2M`
        })
      ]
    };
  }
  if (token.startsWith(M2M_TOKEN_PREFIX)) {
    return verifyM2MToken(token, options);
  }
  if (token.startsWith(OAUTH_TOKEN_PREFIX)) {
    return verifyOAuthToken(token, options);
  }
  if (token.startsWith(API_KEY_PREFIX)) {
    return verifyAPIKey(token, options);
  }
  throw new Error("Unknown machine token type");
}
async function verifyHandshakeJwt(token, { key }) {
  const { data: decoded, errors } = decodeJwt(token);
  if (errors) {
    throw errors[0];
  }
  const { header, payload } = decoded;
  const { typ, alg } = header;
  assertHeaderType(typ);
  assertHeaderAlgorithm(alg);
  if (isNonSessionJwtCategory(header.cat)) {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.EnsureClerkJWT,
      reason: TokenVerificationErrorReason.TokenInvalid,
      message: "Invalid handshake token category."
    });
  }
  const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
  if (signatureErrors) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenVerificationFailed,
      message: `Error verifying handshake token. ${signatureErrors[0]}`
    });
  }
  if (!signatureValid) {
    throw new TokenVerificationError({
      reason: TokenVerificationErrorReason.TokenInvalidSignature,
      message: "Handshake signature is invalid."
    });
  }
  return payload;
}
async function verifyHandshakeToken(token, options) {
  const { secretKey, apiUrl, apiVersion, jwksCacheTtlInMs, jwtKey, skipJwksCache } = options;
  const { data, errors } = decodeJwt(token);
  if (errors) {
    throw errors[0];
  }
  const { kid } = data.header;
  let key;
  if (jwtKey) {
    key = loadClerkJwkFromPem({ kid, pem: jwtKey });
  } else if (secretKey) {
    key = await loadClerkJWKFromRemote({ secretKey, apiUrl, apiVersion, kid, jwksCacheTtlInMs, skipJwksCache });
  } else {
    throw new TokenVerificationError({
      action: TokenVerificationErrorAction.SetClerkJWTKey,
      message: "Failed to resolve JWK during handshake verification.",
      reason: TokenVerificationErrorReason.JWKFailedToResolve
    });
  }
  return verifyHandshakeJwt(token, { key });
}
var HandshakeService = class {
  constructor(authenticateContext, options, organizationMatcher) {
    this.authenticateContext = authenticateContext;
    this.options = options;
    this.organizationMatcher = organizationMatcher;
  }
  /**
   * Determines if a request is eligible for handshake based on its headers
   *
   * Currently, a request is only eligible for a handshake if we can say it's *probably* a request for a document, not a fetch or some other exotic request.
   * This heuristic should give us a reliable enough signal for browsers that support `Sec-Fetch-Dest` and for those that don't.
   *
   * @returns boolean indicating if the request is eligible for handshake
   */
  isRequestEligibleForHandshake() {
    const { accept, method, secFetchDest } = this.authenticateContext;
    if (method !== "GET") {
      return false;
    }
    if (secFetchDest === "document" || secFetchDest === "iframe") {
      return true;
    }
    if (!secFetchDest && accept?.startsWith("text/html")) {
      return true;
    }
    return false;
  }
  /**
   * Builds the redirect headers for a handshake request
   * @param reason - The reason for the handshake (e.g. 'session-token-expired')
   * @returns Headers object containing the Location header for redirect
   * @throws Error if clerkUrl is missing in authenticateContext
   */
  buildRedirectToHandshake(reason) {
    if (!this.authenticateContext?.clerkUrl) {
      throw new Error("Missing clerkUrl in authenticateContext");
    }
    const redirectUrl = this.removeDevBrowserFromURL(this.authenticateContext.clerkUrl);
    let baseUrl = this.authenticateContext.frontendApi.startsWith("http") ? this.authenticateContext.frontendApi : `https://${this.authenticateContext.frontendApi}`;
    baseUrl = baseUrl.replace(/\/+$/, "") + "/";
    const url = new URL("v1/client/handshake", baseUrl);
    url.searchParams.append("redirect_url", redirectUrl?.href || "");
    url.searchParams.append("__clerk_api_version", SUPPORTED_BAPI_VERSION);
    url.searchParams.append(
      constants.QueryParameters.SuffixedCookies,
      this.authenticateContext.usesSuffixedCookies().toString()
    );
    url.searchParams.append(constants.QueryParameters.HandshakeReason, reason);
    url.searchParams.append(constants.QueryParameters.HandshakeFormat, "nonce");
    if (this.authenticateContext.sessionToken) {
      url.searchParams.append(constants.QueryParameters.Session, this.authenticateContext.sessionToken);
    }
    if (this.authenticateContext.instanceType === "development" && this.authenticateContext.devBrowserToken) {
      url.searchParams.append(constants.QueryParameters.DevBrowser, this.authenticateContext.devBrowserToken);
    }
    const toActivate = this.getOrganizationSyncTarget(this.authenticateContext.clerkUrl, this.organizationMatcher);
    if (toActivate) {
      const params = this.getOrganizationSyncQueryParams(toActivate);
      params.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }
    return new Headers({ [constants.Headers.Location]: url.href });
  }
  /**
   * Gets cookies from either a handshake nonce or a handshake token
   * @returns Promise resolving to string array of cookie directives
   */
  async getCookiesFromHandshake() {
    const cookiesToSet = [];
    if (this.authenticateContext.handshakeNonce) {
      try {
        const handshakePayload = await this.authenticateContext.apiClient?.clients.getHandshakePayload({
          nonce: this.authenticateContext.handshakeNonce
        });
        if (handshakePayload) {
          cookiesToSet.push(...handshakePayload.directives);
        }
      } catch (error) {
        console.error("Clerk: HandshakeService: error getting handshake payload:", error);
      }
    } else if (this.authenticateContext.handshakeToken) {
      const handshakePayload = await verifyHandshakeToken(
        this.authenticateContext.handshakeToken,
        this.authenticateContext
      );
      if (handshakePayload && Array.isArray(handshakePayload.handshake)) {
        cookiesToSet.push(...handshakePayload.handshake);
      }
    }
    return cookiesToSet;
  }
  /**
   * Resolves a handshake request by verifying the handshake token and setting appropriate cookies
   * @returns Promise resolving to either a SignedInState or SignedOutState
   * @throws Error if handshake verification fails or if there are issues with the session token
   */
  async resolveHandshake() {
    const headers = new Headers({
      "Access-Control-Allow-Origin": "null",
      "Access-Control-Allow-Credentials": "true"
    });
    const cookiesToSet = await this.getCookiesFromHandshake();
    let sessionToken = "";
    cookiesToSet.forEach((x) => {
      headers.append("Set-Cookie", x);
      if (getCookieName(x).startsWith(constants.Cookies.Session)) {
        sessionToken = getCookieValue(x);
      }
    });
    if (this.authenticateContext.instanceType === "development") {
      const newUrl = new URL(this.authenticateContext.clerkUrl);
      newUrl.searchParams.delete(constants.QueryParameters.Handshake);
      newUrl.searchParams.delete(constants.QueryParameters.HandshakeHelp);
      newUrl.searchParams.delete(constants.QueryParameters.DevBrowser);
      newUrl.searchParams.delete(constants.QueryParameters.HandshakeNonce);
      headers.append(constants.Headers.Location, newUrl.toString());
      headers.set(constants.Headers.CacheControl, "no-store");
    }
    if (sessionToken === "") {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext: this.authenticateContext,
        reason: AuthErrorReason.SessionTokenMissing,
        message: "",
        headers
      });
    }
    const { data, errors: [error] = [] } = await verifyToken(sessionToken, this.authenticateContext);
    if (data) {
      return signedIn({
        tokenType: TokenType.SessionToken,
        authenticateContext: this.authenticateContext,
        sessionClaims: data,
        headers,
        token: sessionToken
      });
    }
    if (this.authenticateContext.instanceType === "development" && (error?.reason === TokenVerificationErrorReason.TokenExpired || error?.reason === TokenVerificationErrorReason.TokenNotActiveYet || error?.reason === TokenVerificationErrorReason.TokenIatInTheFuture)) {
      const developmentError = new TokenVerificationError({
        action: error.action,
        message: error.message,
        reason: error.reason
      });
      developmentError.tokenCarrier = "cookie";
      console.error(
        `Clerk: Clock skew detected. This usually means that your system clock is inaccurate. Clerk will attempt to account for the clock skew in development.

To resolve this issue, make sure your system's clock is set to the correct time (e.g. turn off and on automatic time synchronization).

---

${developmentError.getFullMessage()}`
      );
      const { data: retryResult, errors: [retryError] = [] } = await verifyToken(sessionToken, {
        ...this.authenticateContext,
        clockSkewInMs: 864e5
      });
      if (retryResult) {
        return signedIn({
          tokenType: TokenType.SessionToken,
          authenticateContext: this.authenticateContext,
          sessionClaims: retryResult,
          headers,
          token: sessionToken
        });
      }
      throw new Error(retryError?.message || "Clerk: Handshake retry failed.");
    }
    throw new Error(error?.message || "Clerk: Handshake failed.");
  }
  /**
   * Handles handshake token verification errors in development mode
   * @param error - The TokenVerificationError that occurred
   * @throws Error with a descriptive message about the verification failure
   */
  handleTokenVerificationErrorInDevelopment(error) {
    if (error.reason === TokenVerificationErrorReason.TokenInvalidSignature) {
      const msg = `Clerk: Handshake token verification failed due to an invalid signature. If you have switched Clerk keys locally, clear your cookies and try again.`;
      throw new Error(msg);
    }
    throw new Error(`Clerk: Handshake token verification failed: ${error.getFullMessage()}.`);
  }
  /**
   * Checks if a redirect loop is detected and sets headers to track redirect count
   * @param headers - The Headers object to modify
   * @returns boolean indicating if a redirect loop was detected (true) or if the request can proceed (false)
   */
  checkAndTrackRedirectLoop(headers) {
    if (this.authenticateContext.handshakeRedirectLoopCounter === 3) {
      return true;
    }
    const newCounterValue = this.authenticateContext.handshakeRedirectLoopCounter + 1;
    const cookieName = constants.Cookies.RedirectCount;
    headers.append("Set-Cookie", `${cookieName}=${newCounterValue}; SameSite=Lax; HttpOnly; Max-Age=2`);
    return false;
  }
  removeDevBrowserFromURL(url) {
    const updatedURL = new URL(url);
    updatedURL.searchParams.delete(constants.QueryParameters.DevBrowser);
    updatedURL.searchParams.delete(constants.QueryParameters.LegacyDevBrowser);
    return updatedURL;
  }
  getOrganizationSyncTarget(url, matchers) {
    return matchers.findTarget(url);
  }
  getOrganizationSyncQueryParams(toActivate) {
    const ret = /* @__PURE__ */ new Map();
    if (toActivate.type === "personalAccount") {
      ret.set("organization_id", "");
    }
    if (toActivate.type === "organization") {
      if (toActivate.organizationId) {
        ret.set("organization_id", toActivate.organizationId);
      }
      if (toActivate.organizationSlug) {
        ret.set("organization_id", toActivate.organizationSlug);
      }
    }
    return ret;
  }
};
var OrganizationMatcher = class {
  constructor(options) {
    this.organizationPattern = this.createMatcher(options?.organizationPatterns);
    this.personalAccountPattern = this.createMatcher(options?.personalAccountPatterns);
  }
  createMatcher(pattern) {
    if (!pattern) {
      return null;
    }
    try {
      return match(pattern);
    } catch (e) {
      throw new Error(`Invalid pattern "${pattern}": ${e}`);
    }
  }
  findTarget(url) {
    const orgTarget = this.findOrganizationTarget(url);
    if (orgTarget) {
      return orgTarget;
    }
    return this.findPersonalAccountTarget(url);
  }
  findOrganizationTarget(url) {
    if (!this.organizationPattern) {
      return null;
    }
    try {
      const result = this.organizationPattern(url.pathname);
      if (!result || !("params" in result)) {
        return null;
      }
      const params = result.params;
      if (params.id) {
        return { type: "organization", organizationId: params.id };
      }
      if (params.slug) {
        return { type: "organization", organizationSlug: params.slug };
      }
      return null;
    } catch (e) {
      console.error("Failed to match organization pattern:", e);
      return null;
    }
  }
  findPersonalAccountTarget(url) {
    if (!this.personalAccountPattern) {
      return null;
    }
    try {
      const result = this.personalAccountPattern(url.pathname);
      return result ? { type: "personalAccount" } : null;
    } catch (e) {
      console.error("Failed to match personal account pattern:", e);
      return null;
    }
  }
};
var RefreshTokenErrorReason = {
  NonEligibleNoCookie: "non-eligible-no-refresh-cookie",
  NonEligibleNonGet: "non-eligible-non-get",
  InvalidSessionToken: "invalid-session-token",
  MissingApiClient: "missing-api-client",
  MissingSessionToken: "missing-session-token",
  MissingRefreshToken: "missing-refresh-token",
  ExpiredSessionTokenDecodeFailed: "expired-session-token-decode-failed",
  ExpiredSessionTokenMissingSidClaim: "expired-session-token-missing-sid-claim",
  FetchError: "fetch-error",
  UnexpectedSDKError: "unexpected-sdk-error",
  UnexpectedBAPIError: "unexpected-bapi-error"
};
function assertSignInUrlExists(signInUrl, key) {
  if (!signInUrl && isDevelopmentFromSecretKey(key)) {
    throw new Error(`Missing signInUrl. Pass a signInUrl for dev instances if an app is satellite`);
  }
}
function assertProxyUrlOrDomain(proxyUrlOrDomain) {
  if (!proxyUrlOrDomain) {
    throw new Error(`Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl`);
  }
}
function assertSignInUrlFormatAndOrigin(_signInUrl, origin) {
  let signInUrl;
  try {
    signInUrl = new URL(_signInUrl);
  } catch {
    throw new Error(`The signInUrl needs to have a absolute url format.`);
  }
  if (signInUrl.origin === origin) {
    throw new Error(`The signInUrl needs to be on a different origin than your satellite application.`);
  }
}
function assertMachineSecretOrSecretKey(authenticateContext) {
  if (!authenticateContext.machineSecretKey && !authenticateContext.secretKey) {
    throw new Error(
      "Machine token authentication requires either a Machine secret key or a Clerk secret key. Ensure a Clerk secret key or Machine secret key is set."
    );
  }
}
function isRequestEligibleForRefresh(err, authenticateContext, request) {
  return err.reason === TokenVerificationErrorReason.TokenExpired && !!authenticateContext.refreshTokenInCookie && request.method === "GET";
}
function checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext) {
  const mismatch = !isTokenTypeAccepted(parsedTokenType, acceptsToken);
  if (mismatch) {
    const tokenTypeToReturn = typeof acceptsToken === "string" ? acceptsToken : parsedTokenType;
    return signedOut({
      tokenType: tokenTypeToReturn,
      authenticateContext,
      reason: AuthErrorReason.TokenTypeMismatch
    });
  }
  return null;
}
function isTokenTypeInAcceptedArray(acceptsToken, authenticateContext) {
  let parsedTokenType = null;
  const { tokenInHeader } = authenticateContext;
  if (tokenInHeader) {
    if (isMachineToken(tokenInHeader)) {
      parsedTokenType = getMachineTokenType(tokenInHeader);
    } else {
      parsedTokenType = TokenType.SessionToken;
    }
  }
  const typeToCheck = parsedTokenType ?? TokenType.SessionToken;
  return isTokenTypeAccepted(typeToCheck, acceptsToken);
}
var authenticateRequest = (async (request, options) => {
  const authenticateContext = await createAuthenticateContext(createClerkRequest(request), options);
  const acceptsToken = options.acceptsToken ?? TokenType.SessionToken;
  if (acceptsToken !== TokenType.M2MToken) {
    assertValidSecretKey(authenticateContext.secretKey);
    if (authenticateContext.isSatellite) {
      assertSignInUrlExists(authenticateContext.signInUrl, authenticateContext.secretKey);
      if (authenticateContext.signInUrl && authenticateContext.origin) {
        assertSignInUrlFormatAndOrigin(authenticateContext.signInUrl, authenticateContext.origin);
      }
      assertProxyUrlOrDomain(authenticateContext.proxyUrl || authenticateContext.domain);
    }
  }
  if (acceptsToken === TokenType.M2MToken) {
    assertMachineSecretOrSecretKey(authenticateContext);
  }
  const organizationMatcher = new OrganizationMatcher(options.organizationSyncOptions);
  const handshakeService = new HandshakeService(
    authenticateContext,
    { organizationSyncOptions: options.organizationSyncOptions },
    organizationMatcher
  );
  async function refreshToken(authenticateContext2) {
    if (!options.apiClient) {
      return {
        data: null,
        error: {
          message: "An apiClient is needed to perform token refresh.",
          cause: { reason: RefreshTokenErrorReason.MissingApiClient }
        }
      };
    }
    const { sessionToken: expiredSessionToken, refreshTokenInCookie: refreshToken2 } = authenticateContext2;
    if (!expiredSessionToken) {
      return {
        data: null,
        error: {
          message: "Session token must be provided.",
          cause: { reason: RefreshTokenErrorReason.MissingSessionToken }
        }
      };
    }
    if (!refreshToken2) {
      return {
        data: null,
        error: {
          message: "Refresh token must be provided.",
          cause: { reason: RefreshTokenErrorReason.MissingRefreshToken }
        }
      };
    }
    const { data: decodeResult, errors: decodedErrors } = decodeJwt(expiredSessionToken);
    if (!decodeResult || decodedErrors) {
      return {
        data: null,
        error: {
          message: "Unable to decode the expired session token.",
          cause: { reason: RefreshTokenErrorReason.ExpiredSessionTokenDecodeFailed, errors: decodedErrors }
        }
      };
    }
    if (!decodeResult?.payload?.sid) {
      return {
        data: null,
        error: {
          message: "Expired session token is missing the `sid` claim.",
          cause: { reason: RefreshTokenErrorReason.ExpiredSessionTokenMissingSidClaim }
        }
      };
    }
    try {
      const response2 = await options.apiClient.sessions.refreshSession(decodeResult.payload.sid, {
        format: "cookie",
        suffixed_cookies: authenticateContext2.usesSuffixedCookies(),
        expired_token: expiredSessionToken || "",
        refresh_token: refreshToken2 || "",
        request_origin: authenticateContext2.clerkUrl.origin,
        // The refresh endpoint expects headers as Record<string, string[]>, so we need to transform it.
        request_headers: Object.fromEntries(Array.from(request.headers.entries()).map(([k, v]) => [k, [v]]))
      });
      return { data: response2.cookies, error: null };
    } catch (err) {
      if (err?.errors?.length) {
        if (err.errors[0].code === "unexpected_error") {
          return {
            data: null,
            error: {
              message: `Fetch unexpected error`,
              cause: { reason: RefreshTokenErrorReason.FetchError, errors: err.errors }
            }
          };
        }
        return {
          data: null,
          error: {
            message: err.errors[0].code,
            cause: { reason: err.errors[0].code, errors: err.errors }
          }
        };
      } else {
        return {
          data: null,
          error: {
            message: `Unexpected Server/BAPI error`,
            cause: { reason: RefreshTokenErrorReason.UnexpectedBAPIError, errors: [err] }
          }
        };
      }
    }
  }
  async function attemptRefresh(authenticateContext2) {
    const { data: cookiesToSet, error } = await refreshToken(authenticateContext2);
    if (!cookiesToSet || cookiesToSet.length === 0) {
      return { data: null, error };
    }
    const headers = new Headers();
    let sessionToken = "";
    cookiesToSet.forEach((x) => {
      headers.append("Set-Cookie", x);
      if (getCookieName(x).startsWith(constants.Cookies.Session)) {
        sessionToken = getCookieValue(x);
      }
    });
    const { data: jwtPayload, errors } = await verifyToken(sessionToken, authenticateContext2);
    if (errors) {
      return {
        data: null,
        error: {
          message: `Clerk: unable to verify refreshed session token.`,
          cause: { reason: RefreshTokenErrorReason.InvalidSessionToken, errors }
        }
      };
    }
    return { data: { jwtPayload, sessionToken, headers }, error: null };
  }
  function handleMaybeHandshakeStatus(authenticateContext2, reason, message, headers) {
    if (!handshakeService.isRequestEligibleForHandshake()) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext: authenticateContext2,
        reason,
        message
      });
    }
    const handshakeHeaders = headers ?? handshakeService.buildRedirectToHandshake(reason);
    if (handshakeHeaders.get(constants.Headers.Location)) {
      handshakeHeaders.set(constants.Headers.CacheControl, "no-store");
    }
    const isRedirectLoop = handshakeService.checkAndTrackRedirectLoop(handshakeHeaders);
    if (isRedirectLoop) {
      const msg = getHandshakeRedirectLoopMessage(reason);
      console.log(msg);
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext: authenticateContext2,
        reason,
        message
      });
    }
    return handshake(authenticateContext2, reason, message, handshakeHeaders);
  }
  function getHandshakeRedirectLoopMessage(reason) {
    if (reason === AuthErrorReason.SatelliteCookieNeedsSyncing) {
      return `Clerk: Satellite-domain authentication resulted in an infinite redirect loop. Check that this request is using a configured primary or satellite domain for the production instance. For preview deployments, use a development/staging Clerk instance or a supported configured preview-domain setup.`;
    }
    return `Clerk: Refreshing the session token resulted in an infinite redirect loop. This usually means that your Clerk instance keys do not match - make sure to copy the correct publishable and secret keys from the Clerk dashboard.`;
  }
  function handleMaybeOrganizationSyncHandshake(authenticateContext2, auth) {
    const organizationSyncTarget = organizationMatcher.findTarget(authenticateContext2.clerkUrl);
    if (!organizationSyncTarget) {
      return null;
    }
    let mustActivate = false;
    if (organizationSyncTarget.type === "organization") {
      if (organizationSyncTarget.organizationSlug && organizationSyncTarget.organizationSlug !== auth.orgSlug) {
        mustActivate = true;
      }
      if (organizationSyncTarget.organizationId && organizationSyncTarget.organizationId !== auth.orgId) {
        mustActivate = true;
      }
    }
    if (organizationSyncTarget.type === "personalAccount" && auth.orgId) {
      mustActivate = true;
    }
    if (!mustActivate) {
      return null;
    }
    if (authenticateContext2.handshakeRedirectLoopCounter >= 3) {
      console.warn(
        "Clerk: Organization activation handshake loop detected. This is likely due to an invalid organization ID or slug. Skipping organization activation."
      );
      return null;
    }
    const handshakeState = handleMaybeHandshakeStatus(
      authenticateContext2,
      AuthErrorReason.ActiveOrganizationMismatch,
      ""
    );
    if (handshakeState.status !== "handshake") {
      return null;
    }
    return handshakeState;
  }
  async function authenticateRequestWithTokenInHeader() {
    const { tokenInHeader } = authenticateContext;
    if (isMachineJwt(tokenInHeader) || hasNonSessionJwtCategory(tokenInHeader)) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        reason: AuthErrorReason.TokenTypeMismatch,
        message: ""
      });
    }
    try {
      const { data, errors } = await verifyToken(tokenInHeader, authenticateContext);
      if (errors) {
        throw errors[0];
      }
      return signedIn({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        sessionClaims: data,
        headers: new Headers(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: tokenInHeader
      });
    } catch (err) {
      return handleSessionTokenError(err, "header");
    }
  }
  async function authenticateRequestWithTokenInCookie() {
    const hasActiveClient = authenticateContext.clientUat;
    const hasSessionToken = !!authenticateContext.sessionTokenInCookie;
    const hasDevBrowserToken = !!authenticateContext.devBrowserToken;
    if (authenticateContext.handshakeNonce || authenticateContext.handshakeToken) {
      try {
        return await handshakeService.resolveHandshake();
      } catch (error) {
        if (error instanceof TokenVerificationError && authenticateContext.instanceType === "development") {
          handshakeService.handleTokenVerificationErrorInDevelopment(error);
        } else {
          console.error("Clerk: unable to resolve handshake:", error);
        }
      }
    }
    const isRequestEligibleForMultiDomainSync = authenticateContext.isSatellite && authenticateContext.secFetchDest === "document" && authenticateContext.method === "GET";
    const syncedParam = authenticateContext.clerkUrl.searchParams.get(constants.QueryParameters.ClerkSynced);
    const needsSync = syncedParam === constants.ClerkSyncStatus.NeedsSync;
    const syncCompleted = syncedParam === constants.ClerkSyncStatus.Completed;
    const hasCookies = hasSessionToken || hasActiveClient;
    const shouldSkipSatelliteHandshake = authenticateContext.satelliteAutoSync !== true && !hasCookies && !needsSync;
    if (authenticateContext.instanceType === "production" && isRequestEligibleForMultiDomainSync && !syncCompleted) {
      if (shouldSkipSatelliteHandshake) {
        return signedOut({
          tokenType: TokenType.SessionToken,
          authenticateContext,
          reason: AuthErrorReason.SessionTokenAndUATMissing
        });
      }
      if (!hasCookies || needsSync) {
        return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SatelliteCookieNeedsSyncing, "");
      }
    }
    if (authenticateContext.instanceType === "development" && isRequestEligibleForMultiDomainSync && !syncCompleted) {
      if (shouldSkipSatelliteHandshake) {
        return signedOut({
          tokenType: TokenType.SessionToken,
          authenticateContext,
          reason: AuthErrorReason.SessionTokenAndUATMissing
        });
      }
      if (!hasCookies || needsSync) {
        const redirectURL = new URL(authenticateContext.signInUrl);
        redirectURL.searchParams.append(
          constants.QueryParameters.ClerkRedirectUrl,
          authenticateContext.clerkUrl.toString()
        );
        const headers = new Headers({ [constants.Headers.Location]: redirectURL.toString() });
        return handleMaybeHandshakeStatus(
          authenticateContext,
          AuthErrorReason.SatelliteCookieNeedsSyncing,
          "",
          headers
        );
      }
    }
    const redirectUrl = new URL(authenticateContext.clerkUrl).searchParams.get(
      constants.QueryParameters.ClerkRedirectUrl
    );
    if (authenticateContext.instanceType === "development" && !authenticateContext.isSatellite && redirectUrl) {
      const redirectBackToSatelliteUrl = new URL(redirectUrl);
      if (authenticateContext.devBrowserToken) {
        redirectBackToSatelliteUrl.searchParams.append(
          constants.QueryParameters.DevBrowser,
          authenticateContext.devBrowserToken
        );
      }
      redirectBackToSatelliteUrl.searchParams.set(
        constants.QueryParameters.ClerkSynced,
        constants.ClerkSyncStatus.Completed
      );
      const headers = new Headers({ [constants.Headers.Location]: redirectBackToSatelliteUrl.toString() });
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.PrimaryRespondsToSyncing, "", headers);
    }
    if (authenticateContext.instanceType === "development" && authenticateContext.clerkUrl.searchParams.has(constants.QueryParameters.DevBrowser)) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserSync, "");
    }
    if (authenticateContext.instanceType === "development" && !hasDevBrowserToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserMissing, "");
    }
    if (!hasActiveClient && !hasSessionToken) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        reason: AuthErrorReason.SessionTokenAndUATMissing
      });
    }
    if (!hasActiveClient && hasSessionToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenWithoutClientUAT, "");
    }
    if (hasActiveClient && !hasSessionToken) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.ClientUATWithoutSessionToken, "");
    }
    const { data: decodeResult, errors: decodedErrors } = decodeJwt(authenticateContext.sessionTokenInCookie);
    if (decodedErrors) {
      return handleSessionTokenError(decodedErrors[0], "cookie");
    }
    if (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      isMachineJwt(authenticateContext.sessionTokenInCookie) || // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      hasNonSessionJwtCategory(authenticateContext.sessionTokenInCookie)
    ) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        reason: AuthErrorReason.TokenTypeMismatch,
        message: ""
      });
    }
    if (decodeResult.payload.iat < authenticateContext.clientUat) {
      return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenIATBeforeClientUAT, "");
    }
    try {
      const { data, errors } = await verifyToken(authenticateContext.sessionTokenInCookie, authenticateContext);
      if (errors) {
        throw errors[0];
      }
      if (!data.azp) {
        logger.warnOnce(
          "Clerk: Session token from cookie is missing the azp claim. In a future version of Clerk, this token will be considered invalid. Please contact Clerk support if you see this warning."
        );
      }
      const signedInRequestState = signedIn({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        sessionClaims: data,
        headers: new Headers(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: authenticateContext.sessionTokenInCookie
      });
      const shouldForceHandshakeForCrossDomain = !authenticateContext.isSatellite && // We're on primary
      authenticateContext.method === "GET" && // Only GET navigations (POST form submissions set sec-fetch-dest: document too)
      authenticateContext.secFetchDest === "document" && // Document navigation
      authenticateContext.isCrossOriginReferrer() && // Came from different domain
      !authenticateContext.isKnownClerkReferrer() && // Not from Clerk accounts portal or FAPI
      authenticateContext.handshakeRedirectLoopCounter === 0;
      if (shouldForceHandshakeForCrossDomain) {
        return handleMaybeHandshakeStatus(
          authenticateContext,
          AuthErrorReason.PrimaryDomainCrossOriginSync,
          "Cross-origin request from satellite domain requires handshake"
        );
      }
      const authObject = signedInRequestState.toAuth();
      if (authObject.userId) {
        const handshakeRequestState = handleMaybeOrganizationSyncHandshake(authenticateContext, authObject);
        if (handshakeRequestState) {
          return handshakeRequestState;
        }
      }
      return signedInRequestState;
    } catch (err) {
      return handleSessionTokenError(err, "cookie");
    }
    return signedOut({
      tokenType: TokenType.SessionToken,
      authenticateContext,
      reason: AuthErrorReason.UnexpectedError
    });
  }
  async function handleSessionTokenError(err, tokenCarrier) {
    if (!(err instanceof TokenVerificationError)) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        reason: AuthErrorReason.UnexpectedError
      });
    }
    let refreshError;
    if (isRequestEligibleForRefresh(err, authenticateContext, request)) {
      const { data, error } = await attemptRefresh(authenticateContext);
      if (data) {
        return signedIn({
          tokenType: TokenType.SessionToken,
          authenticateContext,
          sessionClaims: data.jwtPayload,
          headers: data.headers,
          token: data.sessionToken
        });
      }
      if (error?.cause?.reason) {
        refreshError = error.cause.reason;
      } else {
        refreshError = RefreshTokenErrorReason.UnexpectedSDKError;
      }
    } else {
      if (request.method !== "GET") {
        refreshError = RefreshTokenErrorReason.NonEligibleNonGet;
      } else if (!authenticateContext.refreshTokenInCookie) {
        refreshError = RefreshTokenErrorReason.NonEligibleNoCookie;
      } else {
        refreshError = null;
      }
    }
    err.tokenCarrier = tokenCarrier;
    const reasonToHandshake = [
      TokenVerificationErrorReason.TokenExpired,
      TokenVerificationErrorReason.TokenNotActiveYet,
      TokenVerificationErrorReason.TokenIatInTheFuture
    ].includes(err.reason);
    if (reasonToHandshake) {
      return handleMaybeHandshakeStatus(
        authenticateContext,
        convertTokenVerificationErrorReasonToAuthErrorReason({ tokenError: err.reason, refreshError }),
        err.getFullMessage()
      );
    }
    return signedOut({
      tokenType: TokenType.SessionToken,
      authenticateContext,
      reason: err.reason,
      message: err.getFullMessage()
    });
  }
  function handleMachineError(tokenType, err) {
    if (!(err instanceof MachineTokenVerificationError)) {
      return signedOut({
        tokenType,
        authenticateContext,
        reason: AuthErrorReason.UnexpectedError
      });
    }
    return signedOut({
      tokenType,
      authenticateContext,
      reason: err.code,
      message: err.getFullMessage()
    });
  }
  async function authenticateMachineRequestWithTokenInHeader() {
    const { tokenInHeader } = authenticateContext;
    if (!tokenInHeader) {
      return handleSessionTokenError(new Error("Missing token in header"), "header");
    }
    if (!isMachineToken(tokenInHeader)) {
      return signedOut({
        tokenType: acceptsToken,
        authenticateContext,
        reason: AuthErrorReason.TokenTypeMismatch,
        message: ""
      });
    }
    const parsedTokenType = getMachineTokenType(tokenInHeader);
    const mismatchState = checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext);
    if (mismatchState) {
      return mismatchState;
    }
    const { data, tokenType, errors } = await verifyMachineAuthToken(tokenInHeader, authenticateContext);
    if (errors) {
      return handleMachineError(tokenType, errors[0]);
    }
    return signedIn({
      tokenType,
      authenticateContext,
      machineData: data,
      token: tokenInHeader
    });
  }
  async function authenticateAnyRequestWithTokenInHeader() {
    const { tokenInHeader } = authenticateContext;
    if (!tokenInHeader) {
      return handleSessionTokenError(new Error("Missing token in header"), "header");
    }
    if (isMachineToken(tokenInHeader)) {
      const parsedTokenType = getMachineTokenType(tokenInHeader);
      const mismatchState = checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext);
      if (mismatchState) {
        return mismatchState;
      }
      const { data: data2, tokenType, errors: errors2 } = await verifyMachineAuthToken(tokenInHeader, authenticateContext);
      if (errors2) {
        return handleMachineError(tokenType, errors2[0]);
      }
      return signedIn({
        tokenType,
        authenticateContext,
        machineData: data2,
        token: tokenInHeader
      });
    }
    if (hasNonSessionJwtCategory(tokenInHeader)) {
      return signedOut({
        tokenType: TokenType.SessionToken,
        authenticateContext,
        reason: AuthErrorReason.TokenTypeMismatch,
        message: ""
      });
    }
    const { data, errors } = await verifyToken(tokenInHeader, authenticateContext);
    if (errors) {
      return handleSessionTokenError(errors[0], "header");
    }
    return signedIn({
      tokenType: TokenType.SessionToken,
      authenticateContext,
      sessionClaims: data,
      token: tokenInHeader
    });
  }
  if (Array.isArray(acceptsToken)) {
    if (!isTokenTypeInAcceptedArray(acceptsToken, authenticateContext)) {
      return signedOutInvalidToken();
    }
  }
  if (authenticateContext.tokenInHeader) {
    if (acceptsToken === "any" || Array.isArray(acceptsToken)) {
      return authenticateAnyRequestWithTokenInHeader();
    }
    if (acceptsToken === TokenType.SessionToken) {
      return authenticateRequestWithTokenInHeader();
    }
    return authenticateMachineRequestWithTokenInHeader();
  }
  if (acceptsToken === TokenType.OAuthToken || acceptsToken === TokenType.ApiKey || acceptsToken === TokenType.M2MToken) {
    return signedOut({
      tokenType: acceptsToken,
      authenticateContext,
      reason: "No token in header"
    });
  }
  return authenticateRequestWithTokenInCookie();
});
var debugRequestState = (params) => {
  const { isSignedIn, isAuthenticated, proxyUrl, reason, message, publishableKey, isSatellite, domain } = params;
  return { isSignedIn, isAuthenticated, proxyUrl, reason, message, publishableKey, isSatellite, domain };
};
var convertTokenVerificationErrorReasonToAuthErrorReason = ({
  tokenError,
  refreshError
}) => {
  switch (tokenError) {
    case TokenVerificationErrorReason.TokenExpired:
      return `${AuthErrorReason.SessionTokenExpired}-refresh-${refreshError}`;
    case TokenVerificationErrorReason.TokenNotActiveYet:
      return AuthErrorReason.SessionTokenNBF;
    case TokenVerificationErrorReason.TokenIatInTheFuture:
      return AuthErrorReason.SessionTokenIatInTheFuture;
    default:
      return AuthErrorReason.UnexpectedError;
  }
};
var defaultOptions2 = {
  secretKey: "",
  machineSecretKey: "",
  jwtKey: "",
  apiUrl: void 0,
  apiVersion: void 0,
  proxyUrl: "",
  publishableKey: "",
  isSatellite: false,
  domain: "",
  audience: ""
};
function createAuthenticateRequest(params) {
  const buildTimeOptions = mergePreDefinedOptions(defaultOptions2, params.options);
  const apiClient = params.apiClient;
  const authenticateRequest2 = (request, options = {}) => {
    const { apiUrl, apiVersion } = buildTimeOptions;
    const runTimeOptions = mergePreDefinedOptions(buildTimeOptions, options);
    return authenticateRequest(request, {
      ...options,
      ...runTimeOptions,
      // We should add all the omitted props from options here (eg apiUrl / apiVersion)
      // to avoid runtime options override them.
      apiUrl,
      apiVersion,
      apiClient
    });
  };
  return {
    authenticateRequest: authenticateRequest2,
    debugRequestState
  };
}

// node_modules/@clerk/backend/dist/chunk-P263NW7Z.mjs
function withLegacyReturn(cb) {
  return async (...args) => {
    const { data, errors } = await cb(...args);
    if (errors) {
      throw errors[0];
    }
    return data;
  };
}

// node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs
var PROCESS_FLAG = /* @__PURE__ */ Symbol.for("@clerk/shared.telemetryNoticeShown");
var NOTICE_LINES = [
  "Attention: Clerk collects telemetry data from its SDKs when connected to development instances.",
  "The data collected is used to inform Clerk's product roadmap.",
  "To learn more, including how to opt-out from the telemetry program, visit: https://clerk.com/docs/telemetry."
];
function isServerRuntime() {
  if (typeof window !== "undefined") return false;
  if (typeof globalThis.EdgeRuntime !== "undefined") return false;
  return true;
}
function isCI() {
  if (typeof process === "undefined" || !process.env) return false;
  return automatedEnvironmentVariables.some((name) => isTruthy(process.env[name]));
}
function hasSeen() {
  return Boolean(globalThis[PROCESS_FLAG]);
}
function markSeen() {
  globalThis[PROCESS_FLAG] = true;
}
function printNotice() {
  if (typeof console === "undefined" || typeof console.log !== "function") return;
  for (const line of NOTICE_LINES) console.log(line);
  console.log("");
}
function maybeShowTelemetryNotice(options = {}) {
  if (options.skip) return;
  try {
    if (!isServerRuntime()) return;
    if (isCI()) return;
    if (hasSeen()) return;
    printNotice();
    markSeen();
  } catch {
  }
}
var DEFAULT_CACHE_TTL_MS = 864e5;
var TelemetryEventThrottler = class {
  #cache;
  #cacheTtl = DEFAULT_CACHE_TTL_MS;
  constructor(cache) {
    this.#cache = cache;
  }
  isEventThrottled(payload) {
    const now = Date.now();
    const key = this.#generateKey(payload);
    const entry = this.#cache.getItem(key);
    if (!entry) {
      this.#cache.setItem(key, now);
      return false;
    }
    if (now - entry > this.#cacheTtl) {
      this.#cache.setItem(key, now);
      return false;
    }
    return true;
  }
  /**
  * Generates a consistent unique key for telemetry events by sorting payload properties.
  * This ensures that payloads with identical content in different orders produce the same key.
  */
  #generateKey(event) {
    const { sk: _sk, pk: _pk, payload, ...rest } = event;
    const sanitizedEvent = {
      ...payload,
      ...rest
    };
    return JSON.stringify(Object.keys({
      ...payload,
      ...rest
    }).sort().map((key) => sanitizedEvent[key]));
  }
};
var LocalStorageThrottlerCache = class {
  #storageKey = "clerk_telemetry_throttler";
  getItem(key) {
    return this.#getCache()[key];
  }
  setItem(key, value) {
    try {
      const cache = this.#getCache();
      cache[key] = value;
      localStorage.setItem(this.#storageKey, JSON.stringify(cache));
    } catch (err) {
      if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED") && localStorage.length > 0) localStorage.removeItem(this.#storageKey);
    }
  }
  removeItem(key) {
    try {
      const cache = this.#getCache();
      delete cache[key];
      localStorage.setItem(this.#storageKey, JSON.stringify(cache));
    } catch {
    }
  }
  #getCache() {
    try {
      const cacheString = localStorage.getItem(this.#storageKey);
      if (!cacheString) return {};
      return JSON.parse(cacheString);
    } catch {
      return {};
    }
  }
  static isSupported() {
    return typeof window !== "undefined" && !!window.localStorage;
  }
};
var InMemoryThrottlerCache = class {
  #cache = /* @__PURE__ */ new Map();
  #maxSize = 1e4;
  getItem(key) {
    if (this.#cache.size > this.#maxSize) {
      this.#cache.clear();
      return;
    }
    return this.#cache.get(key);
  }
  setItem(key, value) {
    this.#cache.set(key, value);
  }
  removeItem(key) {
    this.#cache.delete(key);
  }
};
function isWindowClerkWithMetadata(clerk) {
  return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
var VALID_LOG_LEVELS = /* @__PURE__ */ new Set([
  "error",
  "warn",
  "info",
  "debug",
  "trace"
]);
var DEFAULT_CONFIG = {
  samplingRate: 1,
  maxBufferSize: 5,
  endpoint: "https://clerk-telemetry.com"
};
var TelemetryCollector = class {
  #config;
  #eventThrottler;
  #metadata = {};
  #buffer = [];
  #pendingFlush = null;
  constructor(options) {
    this.#config = {
      maxBufferSize: options.maxBufferSize ?? DEFAULT_CONFIG.maxBufferSize,
      samplingRate: options.samplingRate ?? DEFAULT_CONFIG.samplingRate,
      perEventSampling: options.perEventSampling ?? true,
      disabled: options.disabled ?? false,
      debug: options.debug ?? false,
      endpoint: DEFAULT_CONFIG.endpoint
    };
    if (!options.clerkVersion && typeof window === "undefined") this.#metadata.clerkVersion = "";
    else this.#metadata.clerkVersion = options.clerkVersion ?? "";
    this.#metadata.sdk = options.sdk;
    this.#metadata.sdkVersion = options.sdkVersion;
    this.#metadata.publishableKey = options.publishableKey ?? "";
    const parsedKey = parsePublishableKey(options.publishableKey);
    if (parsedKey) this.#metadata.instanceType = parsedKey.instanceType;
    if (options.secretKey) this.#metadata.secretKey = options.secretKey.substring(0, 16);
    const cache = LocalStorageThrottlerCache.isSupported() ? new LocalStorageThrottlerCache() : new InMemoryThrottlerCache();
    this.#eventThrottler = new TelemetryEventThrottler(cache);
    maybeShowTelemetryNotice({ skip: !this.isEnabled });
  }
  get isEnabled() {
    if (this.#metadata.instanceType !== "development") return false;
    if (this.#config.disabled || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DISABLED)) return false;
    if (typeof window !== "undefined" && !!window?.navigator?.webdriver) return false;
    return true;
  }
  get isDebug() {
    return this.#config.debug || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DEBUG);
  }
  record(event) {
    try {
      const preparedPayload = this.#preparePayload(event.event, event.payload);
      this.#logEvent(preparedPayload.event, preparedPayload);
      if (!this.#shouldRecord(preparedPayload, event.eventSamplingRate)) return;
      this.#buffer.push({
        kind: "event",
        value: preparedPayload
      });
      this.#scheduleFlush();
    } catch (error) {
      console.error("[clerk/telemetry] Error recording telemetry event", error);
    }
  }
  /**
  * Records a telemetry log entry if logging is enabled and not in debug mode.
  *
  * @param entry - The telemetry log entry to record.
  */
  recordLog(entry) {
    try {
      if (!this.#shouldRecordLog(entry)) return;
      const levelIsValid = typeof entry?.level === "string" && VALID_LOG_LEVELS.has(entry.level);
      const messageIsValid = typeof entry?.message === "string" && entry.message.trim().length > 0;
      let normalizedTimestamp = null;
      const timestampInput = entry?.timestamp;
      if (typeof timestampInput === "number" || typeof timestampInput === "string") {
        const candidate = new Date(timestampInput);
        if (!Number.isNaN(candidate.getTime())) normalizedTimestamp = candidate;
      }
      if (!levelIsValid || !messageIsValid || normalizedTimestamp === null) {
        if (this.isDebug && typeof console !== "undefined") console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", {
          levelIsValid,
          messageIsValid,
          timestampIsValid: normalizedTimestamp !== null
        });
        return;
      }
      const sdkMetadata = this.#getSDKMetadata();
      const logData = {
        sdk: sdkMetadata.name,
        sdkv: sdkMetadata.version,
        cv: this.#metadata.clerkVersion ?? "",
        lvl: entry.level,
        msg: entry.message,
        ts: normalizedTimestamp.toISOString(),
        pk: this.#metadata.publishableKey || null,
        payload: this.#sanitizeContext(entry.context)
      };
      this.#buffer.push({
        kind: "log",
        value: logData
      });
      this.#scheduleFlush();
    } catch (error) {
      console.error("[clerk/telemetry] Error recording telemetry log entry", error);
    }
  }
  #shouldRecord(preparedPayload, eventSamplingRate) {
    return this.isEnabled && !this.isDebug && this.#shouldBeSampled(preparedPayload, eventSamplingRate);
  }
  #shouldRecordLog(_entry) {
    return true;
  }
  #shouldBeSampled(preparedPayload, eventSamplingRate) {
    const randomSeed = Math.random();
    if (!(randomSeed <= this.#config.samplingRate && (this.#config.perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate))) return false;
    return !this.#eventThrottler.isEventThrottled(preparedPayload);
  }
  #scheduleFlush() {
    if (typeof window === "undefined") {
      this.#flush();
      return;
    }
    if (this.#buffer.length >= this.#config.maxBufferSize) {
      if (this.#pendingFlush) if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(Number(this.#pendingFlush));
      else clearTimeout(Number(this.#pendingFlush));
      this.#flush();
      return;
    }
    if (this.#pendingFlush) return;
    if ("requestIdleCallback" in window) this.#pendingFlush = requestIdleCallback(() => {
      this.#flush();
      this.#pendingFlush = null;
    });
    else this.#pendingFlush = setTimeout(() => {
      this.#flush();
      this.#pendingFlush = null;
    }, 0);
  }
  #flush() {
    const itemsToSend = [...this.#buffer];
    this.#buffer = [];
    this.#pendingFlush = null;
    if (itemsToSend.length === 0) return;
    const eventsToSend = itemsToSend.filter((item) => item.kind === "event").map((item) => item.value);
    const logsToSend = itemsToSend.filter((item) => item.kind === "log").map((item) => item.value);
    if (eventsToSend.length > 0) {
      const eventsUrl = new URL("/v1/event", this.#config.endpoint);
      fetch(eventsUrl, {
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
        body: JSON.stringify({ events: eventsToSend })
      }).catch(() => void 0);
    }
    if (logsToSend.length > 0) {
      const logsUrl = new URL("/v1/logs", this.#config.endpoint);
      fetch(logsUrl, {
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
        body: JSON.stringify({ logs: logsToSend })
      }).catch(() => void 0);
    }
  }
  /**
  * If running in debug mode, log the event and its payload to the console.
  */
  #logEvent(event, payload) {
    if (!this.isDebug) return;
    if (typeof console.groupCollapsed !== "undefined") {
      console.groupCollapsed("[clerk/telemetry]", event);
      console.log(payload);
      console.groupEnd();
    } else console.log("[clerk/telemetry]", event, payload);
  }
  /**
  * If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
  *
  * This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
  */
  #getSDKMetadata() {
    const sdkMetadata = {
      name: this.#metadata.sdk,
      version: this.#metadata.sdkVersion
    };
    if (typeof window !== "undefined") {
      const windowWithClerk = window;
      if (windowWithClerk.Clerk) {
        const windowClerk = windowWithClerk.Clerk;
        if (isWindowClerkWithMetadata(windowClerk) && windowClerk.constructor.sdkMetadata) {
          const { name, version } = windowClerk.constructor.sdkMetadata;
          if (name !== void 0) sdkMetadata.name = name;
          if (version !== void 0) sdkMetadata.version = version;
        }
      }
    }
    return sdkMetadata;
  }
  /**
  * Append relevant metadata from the Clerk singleton to the event payload.
  */
  #preparePayload(event, payload) {
    const sdkMetadata = this.#getSDKMetadata();
    return {
      event,
      cv: this.#metadata.clerkVersion ?? "",
      it: this.#metadata.instanceType ?? "",
      sdk: sdkMetadata.name,
      sdkv: sdkMetadata.version,
      ...this.#metadata.publishableKey ? { pk: this.#metadata.publishableKey } : {},
      ...this.#metadata.secretKey ? { sk: this.#metadata.secretKey } : {},
      payload
    };
  }
  /**
  * Best-effort sanitization of the context payload. Returns a plain object with JSON-serializable
  * values or null when the input is missing or not serializable. Arrays are not accepted.
  */
  #sanitizeContext(context) {
    if (context === null || typeof context === "undefined") return null;
    if (typeof context !== "object") return null;
    try {
      const cleaned = JSON.parse(JSON.stringify(context));
      if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) return cleaned;
      return null;
    } catch {
      return null;
    }
  }
};

// node_modules/@clerk/backend/dist/index.mjs
var verifyToken2 = withLegacyReturn(verifyToken);
function createClerkClient(options) {
  const opts = { ...options };
  const apiClient = createBackendApiClient(opts);
  const requestState = createAuthenticateRequest({ options: opts, apiClient });
  const telemetry = new TelemetryCollector({
    publishableKey: opts.publishableKey,
    secretKey: opts.secretKey,
    samplingRate: 0.1,
    ...opts.sdkMetadata ? { sdk: opts.sdkMetadata.name, sdkVersion: opts.sdkMetadata.version } : {},
    ...opts.telemetry || {}
  });
  return {
    ...apiClient,
    ...requestState,
    telemetry
  };
}

// worker/index.js
var embeddedAssets = { "index.html": '<!doctype html>\n<html lang="ko">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="theme-color" content="#102a2a">\n  <meta name="description" content="Yoohastree Franchise Training \u2014 \uD504\uB79C\uCC28\uC774\uC988 \uC2E4\uBB34\uC790\uB97C \uC704\uD55C \uD604\uC7A5 \uC911\uC2EC \uAD50\uC721">\n  <title>Yoohastree Franchise Training</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="./styles.css">\n  <link rel="stylesheet" href="./curriculum.css">\n</head>\n<body>\n  <div class="app-shell">\n    <aside class="sidebar" aria-label="\uC8FC \uBA54\uB274">\n      <a class="brand" href="#home" aria-label="Yoohastree Franchise Training \uD648">\n        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>\n        <span class="brand-copy"><strong>YOOHASTREE</strong><small>FRANCHISE TRAINING</small></span>\n      </a>\n      <div class="side-label">LEARNING SPACE</div>\n      <nav class="side-nav">\n        <button class="nav-link active" data-view="home"><span class="nav-icon">\u25A6</span> \uB300\uC2DC\uBCF4\uB4DC</button>\n        <button class="nav-link" data-view="supervisor"><span class="nav-icon">\u25C8</span> \uC288\uD37C\uBC14\uC774\uC9D5 \uC9C1\uBB34 \uAD50\uC721</button>\n        <button class="nav-link" data-view="development"><span class="nav-icon">\u2316</span> \uC810\uD3EC\uAC1C\uBC1C \uC9C1\uBB34 \uAD50\uC721</button>\n        <a class="nav-link" href="https://qsc-field-simulator-20261022.earthyeagle4.chatgpt.site/" target="_blank" rel="noopener noreferrer" aria-label="QSC \uBAA8\uC758 \uC810\uAC80 \uC2DC\uBBAC\uB808\uC774\uC158 \uC0C8 \uD0ED\uC5D0\uC11C \uC5F4\uAE30"><span class="nav-icon">\u2611</span> QSC \uBAA8\uC758 \uC810\uAC80 <span class="external-mark" aria-hidden="true">\u2197</span></a>\n        <button class="nav-link" data-view="market"><span class="nav-icon">\u25C9</span> \uBAA8\uC758 \uC0C1\uAD8C\uBD84\uC11D</button>\n      </nav>\n      <div class="side-bottom">\n        <div class="access-badge"><span class="access-dot"></span><div><strong>\uC2B9\uC778\uB41C \uD559\uC2B5\uC790 \uC804\uC6A9</strong><small>\uC774\uBA54\uC77C \uACC4\uC815\uC73C\uB85C \uC811\uADFC</small></div></div>\n        <p>\uD604\uC7A5\uC744 \uC774\uD574\uD558\uACE0,<br>\uC131\uC7A5\uC744 \uC124\uACC4\uD569\uB2C8\uB2E4.</p>\n        <small>\xA9 2026 Yoohastree</small>\n      </div>\n    </aside>\n\n    <div class="main-wrap">\n      <header class="topbar">\n        <button class="mobile-menu" id="menuButton" aria-label="\uBA54\uB274 \uC5F4\uAE30" aria-expanded="false">\u2630</button>\n        <div class="breadcrumb">YOOHASTREE <span>/</span> <span id="breadcrumbCurrent">\uB300\uC2DC\uBCF4\uB4DC</span></div>\n        <div class="top-actions"><span class="today" id="today"></span><span class="avatar" aria-label="\uD559\uC2B5\uC790">Y</span></div>\n      </header>\n\n      <main id="app" tabindex="-1"></main>\n    </div>\n  </div>\n\n  <dialog id="lessonDialog" class="lesson-dialog" aria-labelledby="lessonTitle">\n    <div class="dialog-layout">\n      <div class="dialog-top"><span class="dialog-kicker" id="lessonModule"></span><button id="closeDialog" class="icon-button" aria-label="\uB2EB\uAE30">\xD7</button></div>\n      <div class="dialog-scroll" id="lessonBody"></div>\n      <div class="dialog-footer"><button id="completeLesson" class="primary-button">\uD559\uC2B5 \uC644\uB8CC\uB85C \uD45C\uC2DC <span>\u2197</span></button></div>\n    </div>\n  </dialog>\n  <div class="toast" id="toast" role="status" aria-live="polite"></div>\n  <script src="./curriculum.js"><\/script>\n  <script src="./lesson-content.js"><\/script>\n  <script src="./lesson-prompts.js"><\/script>\n  <script src="./data.js"><\/script>\n  <script src="./app.js"><\/script>\n</body>\n</html>\n', "styles.css": ":root{--ink:#16332f;--muted:#768681;--line:#e7ece8;--paper:#f7f9f6;--green:#183b32;--lime:#d9f0a2;--font:'DM Sans','Noto Sans KR',sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--font);font-size:14px}button,input{font:inherit}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #9ed561;outline-offset:3px}a{text-decoration:none;color:inherit}.app-shell{display:flex;min-height:100vh}.sidebar{width:254px;flex:none;background:#102b29;color:#fff;padding:32px 18px 25px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;z-index:5}.brand{display:flex;align-items:center;gap:11px;padding:0 11px 43px}.brand-mark{width:34px;height:35px;position:relative;display:block}.brand-mark i{position:absolute;display:block;width:11px;height:11px;border-radius:50%;background:#cce890}.brand-mark i:nth-child(1){left:4px;top:4px}.brand-mark i:nth-child(2){left:19px;top:4px}.brand-mark i:nth-child(3){left:11.5px;top:19px}.brand-copy strong,.brand-copy small{display:block;letter-spacing:.09em}.brand-copy strong{font-size:14px;font-weight:800;line-height:1.1}.brand-copy small{font-size:8px;letter-spacing:.19em;color:#b8ccc4;margin-top:5px}.side-label{font-size:10px;letter-spacing:.22em;color:#78958c;padding:0 17px;margin-bottom:15px;font-weight:700}.side-nav{display:grid;gap:6px}.nav-link{border:0;background:transparent;text-align:left;color:#b7c8c1;padding:13px 14px;border-radius:10px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:13px;white-space:nowrap}.nav-link:hover,.nav-link.active{background:#285045;color:white}.nav-link.active{box-shadow:inset 3px 0 #d7eda0}.nav-icon{width:18px;text-align:center;font-size:18px;font-weight:400;color:#a7c3ad}.side-bottom{margin-top:auto;padding:0 10px}.access-badge{display:flex;gap:10px;align-items:flex-start;padding:15px 12px;background:#1a3833;border:1px solid #305249;border-radius:10px}.access-dot{width:8px;height:8px;background:#bce586;border-radius:50%;margin-top:5px;box-shadow:0 0 0 4px #315346}.access-badge strong,.access-badge small{display:block}.access-badge strong{font-size:11px}.access-badge small{font-size:10px;color:#95aca2;margin-top:4px}.side-bottom p{font-size:16px;line-height:1.65;font-weight:600;margin:25px 4px 17px;color:#dce9da}.side-bottom>small{font-size:10px;color:#728f84;margin-left:4px}.main-wrap{flex:1;min-width:0}.topbar{height:76px;padding:0 48px;border-bottom:1px solid var(--line);background:#fff;display:flex;align-items:center;justify-content:space-between}.breadcrumb{color:#7a8983;font-size:11px;font-weight:700;letter-spacing:.1em}.breadcrumb span{margin-left:10px;color:#c5cfca}.breadcrumb span:last-child{letter-spacing:0;color:#425c50;font-size:12px}.top-actions{display:flex;align-items:center;gap:23px}.today{font-size:12px;color:#87958f}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#e8efd8;color:#3b6242;font-weight:800}.mobile-menu{display:none;border:0;background:transparent;color:var(--green);font-size:23px}.page{max-width:1500px;margin:auto;padding:42px 48px 65px}.eyebrow{font-size:10px;font-weight:800;letter-spacing:.2em;color:#668b62;display:flex;align-items:center;gap:8px}.eyebrow.light{color:#cae69b}.eyebrow.light span{width:6px;height:6px;background:#d5efa8;border-radius:50%}h1,h2,h3,p{margin-top:0}.welcome{min-height:324px;background:#174238;border-radius:17px;overflow:hidden;display:flex;position:relative;color:#fff}.welcome-copy{padding:39px 46px;position:relative;z-index:2;width:60%}.welcome h1{font-size:35px;line-height:1.35;letter-spacing:-.05em;margin:20px 0 14px;font-weight:800}.welcome h1 em{font-style:normal;color:#d8eda1}.welcome p{font-size:13px;line-height:1.8;color:#c7d8ce;max-width:440px;margin-bottom:22px}.hero-button,.primary-button{border:0;border-radius:7px;background:#d9efa5;color:#183c32;padding:13px 17px;font-size:12px;font-weight:800;display:inline-flex;gap:24px;align-items:center}.hero-button span,.primary-button span{font-size:17px;font-weight:400}.hero-button:hover,.primary-button:hover{background:#e7f7bd}.hero-art{position:absolute;right:4%;top:0;width:39%;height:100%;display:grid;place-items:center}.orbit{border:1px solid rgba(219,239,175,.23);border-radius:50%;position:absolute;aspect-ratio:1}.orbit-one{width:260px}.orbit-two{width:380px}.hero-monogram{font-size:170px;line-height:1;font-weight:700;letter-spacing:-.12em;color:#d7efa6;font-family:Georgia,serif;transform:rotate(-7deg)}.hero-monogram span{color:#f3e5b8}.hero-pill{position:absolute;border:1px solid #95bca1;border-radius:30px;padding:6px 13px;font-size:11px;color:#cce0cb;background:#205146}.pill-one{top:42px;right:17%}.pill-two{bottom:58px;left:9%}.pill-three{right:5%;bottom:51px}.hero-index{position:absolute;bottom:23px;right:28px;color:#a3bdac;font-size:10px;letter-spacing:.1em}.section-intro{padding:45px 0 49px;display:flex;justify-content:space-between;gap:28px;align-items:end}.section-intro h2,.section-heading h2{font-size:23px;letter-spacing:-.04em;margin:10px 0 8px}.section-intro p{color:#889690;font-size:12px;margin:0}.stat-grid{display:flex;gap:10px}.stat-card{background:#fff;border:1px solid #e8ede9;border-radius:10px;min-width:128px;height:95px;padding:15px 17px}.stat-card>span{font-size:11px;color:#8a9890}.stat-card strong{display:block;font-size:28px;line-height:1.2;margin-top:6px;letter-spacing:-.04em}.stat-card strong small{font-size:12px;margin-left:3px}.stat-card.accent{background:#edf4df;border-color:#edf4df}.mini-progress{height:3px;background:#ceddbb;border-radius:5px;margin-top:3px}.mini-progress i{display:block;height:100%;background:#638d4d;border-radius:5px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:15px}.section-heading>span{font-size:12px;color:#899790}.track-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:21px}.track-card{text-align:left;min-height:224px;border-radius:13px;padding:19px;display:flex;flex-direction:column;border:1px solid #e8ece6;background:#fff;transition:transform .2s,box-shadow .2s}.track-card:hover{transform:translateY(-4px);box-shadow:0 12px 26px #183b3214}.track-card.green{background:#e7f0e5}.track-card.sand{background:#f5efe6}.track-card.blue{background:#e9f1f2}.track-card.purple{background:#f0edf3}.track-icon{width:36px;height:36px;border-radius:9px;background:#fff9;display:grid;place-items:center;font-size:19px;margin-bottom:20px}.track-number{font-size:9px;letter-spacing:.14em;font-weight:800;color:#779083;margin-bottom:8px}.track-card strong{font-size:16px;line-height:1.4;letter-spacing:-.035em}.track-description{color:#7b8981;font-size:11px;line-height:1.6;margin-top:8px;min-height:37px}.track-footer{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:14px}.track-footer b{font-size:10px;font-weight:700;color:#88958a}.track-footer b.available{color:#44754e}.track-footer i{font-style:normal;font-size:18px}.bottom-note{margin-top:36px;border-top:1px solid var(--line);padding:30px 4px;display:flex;justify-content:space-between;align-items:center}.bottom-note h3{font-size:17px;margin:10px 0 6px}.bottom-note p{color:#87958e;font-size:11px;line-height:1.7;margin:0}.note-symbol{font-size:60px;color:#c6dbad;margin-right:25px}.page-head{background:#e7f0e5;border-radius:14px;padding:40px 43px 36px}.page-head h1{font-size:31px;letter-spacing:-.05em;margin:13px 0 10px}.page-head p{font-size:13px;color:#6b8174;line-height:1.7;margin-bottom:21px}.head-meta{display:flex;gap:21px;font-size:11px;color:#52785c;font-weight:700}.curriculum-toolbar{margin-top:38px}.toolbar-row{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:20px}.filter-scroll{display:flex;gap:7px;overflow:auto;scrollbar-width:none}.filter-chip{flex:none;border:1px solid #e0e8e0;border-radius:20px;padding:9px 13px;background:#fff;color:#74837a;font-size:10px;font-weight:700}.filter-chip.selected{background:#214a3c;color:#fff;border-color:#214a3c}.search-box{width:175px;flex:none;display:flex;gap:7px;align-items:center;background:#fff;border:1px solid #e2e8e3;border-radius:7px;padding:0 10px;color:#7f9084}.search-box span{font-size:21px}.search-box input{border:0;outline:0!important;width:100%;min-width:0;height:35px;font-size:11px;background:transparent}.module-list{display:grid;gap:17px;margin-top:20px}.module-card{background:#fff;border:1px solid #e5ebe5;border-radius:12px;overflow:hidden}.module-heading{display:flex;align-items:center;gap:18px;padding:23px 25px}.module-icon{width:49px;height:49px;border-radius:11px;display:grid;place-items:center;font-size:24px;flex:none}.module-icon.sage{background:#eaf0de}.module-icon.blue{background:#e5eff1}.module-icon.peach{background:#fbede5}.module-icon.lavender{background:#f0ecf5}.module-icon.yellow{background:#f8f2dc}.module-icon.mint{background:#e6f1e7}.module-title{flex:1}.module-title span{color:#84a27c;letter-spacing:.14em;font-size:9px;font-weight:800}.module-title h3{font-size:17px;letter-spacing:-.03em;margin:4px 0}.module-title p{color:#89968e;font-size:11px;margin:0}.module-progress{text-align:right}.module-progress strong{font-size:20px}.module-progress strong span{font-size:12px;color:#a2ada6}.module-progress small{display:block;font-size:10px;color:#9aaa9e}.lesson-list{border-top:1px solid #eff2ee}.lesson-row{width:100%;border:0;border-bottom:1px solid #eff2ee;background:#fff;display:flex;align-items:center;text-align:left;gap:15px;padding:14px 25px}.lesson-row:last-child{border-bottom:0}.lesson-row:hover{background:#f8fbf5}.lesson-check{font-size:18px;color:#b7c3b8;flex:none}.lesson-check.done{color:#5b9154}.lesson-row-copy{flex:1;min-width:0}.lesson-row-copy strong{display:block;font-size:12px}.lesson-row-copy small{display:block;font-size:10px;color:#9aa69e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:5px}.lesson-time{font-size:10px;color:#96a39a;white-space:nowrap}.row-arrow{font-size:16px;color:#6a8e71}.empty-state{padding:50px;text-align:center;color:#819087;background:white;border-radius:10px}.upcoming-content{display:grid;grid-template-columns:42% 1fr;gap:48px;margin-top:28px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:25px;min-height:400px}.upcoming-visual{border-radius:10px;background:#e6eee6;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:30px}.upcoming-visual:after{content:'';position:absolute;width:310px;height:310px;border:1px solid #bed2bc;border-radius:50%;right:-80px;top:65px;box-shadow:0 0 0 70px #d3e0d238,0 0 0 140px #d3e0d225}.upcoming-visual span{font-size:38px;color:#648c67;z-index:1}.upcoming-visual div{font-size:55px;line-height:1;letter-spacing:-.07em;font-weight:800;color:#4d765a;z-index:1}.upcoming-copy{padding:26px 20px 18px 0}.upcoming-copy h2{font-size:26px;line-height:1.45;letter-spacing:-.05em;margin:13px 0}.upcoming-copy p{color:#7a8c80;font-size:12px;line-height:1.8;max-width:490px}.upcoming-copy h3{font-size:12px;margin:23px 0 11px}.upcoming-copy ol{padding:0;list-style:none;counter-reset:steps;display:grid;gap:8px;margin:0 0 24px}.upcoming-copy li{font-size:11px;color:#577060;counter-increment:steps}.upcoming-copy li:before{content:counter(steps,decimal-leading-zero);font-size:10px;font-weight:800;color:#8cae7d;margin-right:12px}.outline-button{background:#fff;border:1px solid #d9e5d8;border-radius:7px;padding:11px 14px;color:#335c42;font-size:11px;font-weight:800}.outline-button span{margin-left:18px}.lesson-dialog{border:0;border-radius:16px;padding:0;max-width:650px;width:calc(100vw - 30px);max-height:min(88vh,900px);box-shadow:0 30px 90px #0c272b55}.lesson-dialog::backdrop{background:#0a211f99}.dialog-layout{display:flex;flex-direction:column;max-height:min(88vh,900px)}.dialog-top{padding:19px 29px;border-bottom:1px solid #e9eee9;display:flex;justify-content:space-between;align-items:center}.dialog-kicker{font-size:10px;letter-spacing:.11em;font-weight:800;color:#679070}.icon-button{border:0;background:none;font-size:27px;line-height:1;color:#719078}.dialog-scroll{padding:30px 39px;overflow:auto}.lesson-duration{font-size:11px;color:#8aa185}.dialog-scroll h2{font-size:27px;letter-spacing:-.05em;margin:10px 0 13px}.lesson-lead{font-size:14px;line-height:1.8;color:#607269}.lesson-divider{height:1px;background:#e7eee7;margin:24px 0}.dialog-scroll h3{font-size:15px;margin-bottom:17px}.dialog-scroll h3 span{color:#83a37c;font-size:11px;margin-right:10px}.learning-points{display:grid;gap:9px}.learning-point{display:flex;gap:14px;background:#f6f9f5;border-radius:8px;padding:13px 15px}.learning-point span{font-size:10px;color:#83a680;font-weight:800;margin-top:2px}.learning-point p{font-size:12px;line-height:1.65;margin:0;color:#435c4a}.practice-box{background:#eaf3dd;border-radius:10px;padding:18px 20px;margin-top:25px}.practice-heading{display:flex;gap:9px;align-items:center;color:#416b47;font-size:12px}.practice-heading span{font-size:18px}.practice-box p{margin:8px 0 0;font-size:12px;line-height:1.7;color:#4a6650}.lesson-disclaimer{color:#a1ada1;font-size:10px;line-height:1.6;margin:20px 0 0}.dialog-footer{border-top:1px solid #e9eee9;padding:15px 29px;display:flex;justify-content:flex-end}.toast{position:fixed;bottom:25px;right:25px;background:#193b32;color:white;border-radius:8px;padding:13px 18px;font-size:12px;box-shadow:0 10px 28px #102b2933;opacity:0;transform:translateY(15px);transition:.2s;pointer-events:none;z-index:20}.toast.show{opacity:1;transform:translateY(0)}\n@media(max-width:1190px){.sidebar{width:220px}.page{padding:32px}.topbar{padding:0 32px}.track-grid{grid-template-columns:repeat(2,1fr)}.section-intro{align-items:start;flex-direction:column}.hero-art{right:-3%}.welcome-copy{width:67%}}\n@media(max-width:760px){.sidebar{position:fixed;transform:translateX(-100%);transition:transform .25s;width:254px;box-shadow:15px 0 35px #0b292933}.sidebar.open{transform:translateX(0)}.topbar{height:62px;padding:0 20px}.mobile-menu{display:block;margin-right:13px}.breadcrumb{flex:1;font-size:9px}.breadcrumb span:last-child{font-size:10px}.today{display:none}.page{padding:20px 16px 45px}.welcome{min-height:345px}.welcome-copy{padding:28px;width:100%}.welcome h1{font-size:30px}.welcome p{max-width:260px;font-size:11px}.hero-art{opacity:.3;right:-20%;width:65%}.hero-monogram{font-size:125px}.hero-pill{display:none}.stat-grid{width:100%}.stat-card{min-width:0;flex:1;padding:13px 11px}.stat-card strong{font-size:22px}.track-grid{gap:10px}.track-card{padding:14px;min-height:227px}.track-card strong{font-size:14px}.track-description{font-size:10px}.bottom-note{margin-top:22px}.note-symbol{display:none}.page-head{padding:28px 22px}.page-head h1{font-size:25px}.head-meta{gap:12px;flex-wrap:wrap}.toolbar-row{display:block}.filter-scroll{margin-bottom:12px}.search-box{width:100%}.module-heading{gap:11px;padding:17px}.module-icon{width:40px;height:40px}.module-title h3{font-size:14px}.module-title p{font-size:10px}.lesson-row{padding:13px 17px;gap:10px}.lesson-row-copy strong{font-size:11px}.lesson-row-copy small{display:none}.upcoming-content{display:block;padding:15px}.upcoming-visual{height:220px}.upcoming-visual div{font-size:45px}.upcoming-copy{padding:27px 9px 12px}.dialog-scroll{padding:24px}.dialog-scroll h2{font-size:23px}.dialog-top{padding:15px 23px}.dialog-footer{padding:13px 23px}}\n@media(max-width:390px){.track-grid{grid-template-columns:1fr}.track-card{min-height:170px}.track-icon{margin-bottom:8px}.track-description{min-height:0}.module-progress{display:none}}\n.external-mark{margin-left:auto;font-size:13px;color:#a7c3ad}.qsc-link-panel{display:flex;align-items:center;gap:20px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:28px;margin-top:25px}.qsc-link-panel>div:nth-child(2){flex:1}.qsc-link-panel h2{font-size:21px;letter-spacing:-.04em;margin:8px 0}.qsc-link-panel p{color:#809189;font-size:12px;margin:0}.qsc-link-panel .hero-button{white-space:nowrap}@media(max-width:760px){.qsc-link-panel{align-items:flex-start;flex-direction:column}.qsc-link-panel .hero-button{width:100%;justify-content:space-between}}\n", "curriculum.css": ".course-number{flex:none;font-size:10px;font-weight:800;letter-spacing:.08em;color:#82a078;min-width:21px}\n.objective-box{background:#eff5eb;border:1px solid #e2eddf;border-radius:10px;padding:17px 19px;margin-top:20px}\n.objective-box span{display:block;color:#5d8b61;font-size:10px;font-weight:800;letter-spacing:.08em;margin-bottom:7px}\n.objective-box p{font-size:13px;line-height:1.75;color:#3f5e49;margin:0}\n.learning-point{align-items:flex-start}\n.learning-point>span{flex:none;min-width:18px}\n.learning-point>div{min-width:0}\n.learning-point strong{display:block;font-size:12px;color:#2f5241;margin-bottom:5px}\n.learning-point p{font-size:11px;line-height:1.75}\n.forms-section{margin-top:28px}\n.forms-section h3{margin-bottom:12px}\n.form-list{display:flex;flex-wrap:wrap;gap:7px}\n.form-list span{padding:8px 11px;border:1px solid #dce8dd;border-radius:7px;background:#f8faf7;color:#506b56;font-size:11px;font-weight:600}\n.simulation-inline{display:inline-block;margin-top:12px;color:#326b53;font-size:11px;font-weight:800;text-decoration:underline;text-underline-offset:3px}\n.course-note{font-size:11px;line-height:1.7;color:#7b8065;background:#faf8e8;border-radius:8px;padding:11px 13px;margin:22px 0 0}\n.lesson-dialog{max-width:820px}\n.dialog-scroll{padding:30px 38px 36px}\n.lesson-agenda{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0 25px}\n.lesson-agenda div{border:1px solid #e3ebe3;background:#fbfcfa;border-radius:8px;padding:11px 12px}\n.lesson-agenda strong,.lesson-agenda span{display:block}\n.lesson-agenda strong{font-size:15px;color:#315b40}\n.lesson-agenda span{font-size:10px;color:#778b7a;margin-top:3px}\n.case-box{background:#f4f7f1;border-left:3px solid #85ac79;border-radius:7px;padding:18px 20px}\n.case-box h3{margin-bottom:9px}\n.case-box p{font-size:13px;line-height:1.8;color:#3d5947;margin:0 0 9px}\n.case-box small{font-size:11px;line-height:1.6;color:#789078}\n.dialog-scroll h3 small{font-size:10px;font-weight:600;color:#8ca088;margin-left:8px}\n.learning-point{padding:17px 18px;background:#f8faf7}\n.learning-point strong{font-size:13px}\n.learning-point .topic-outline{color:#78917c;font-size:11px;margin:0 0 8px}\n.learning-point .teaching-copy{font-size:12px;line-height:1.85;color:#334f3f}\n.discussion-prompt{margin-top:11px;padding:9px 11px;border-left:2px solid #a4c894;background:#eff5eb;border-radius:4px;color:#42644b;font-size:11px;line-height:1.7}\n.discussion-prompt b{margin-right:6px;color:#2e6642}\n.practice-steps{counter-reset:step;list-style:none;display:grid;gap:7px;margin:13px 0 0;padding:0}\n.practice-steps li{counter-increment:step;font-size:12px;line-height:1.65;color:#3b6047;padding-left:26px;position:relative}\n.practice-steps li::before{content:counter(step);position:absolute;left:0;top:1px;width:17px;height:17px;border-radius:50%;display:grid;place-items:center;background:#cfdfbc;color:#335742;font-size:10px;font-weight:800}\n.knowledge-check{margin-top:27px}\n.knowledge-check details{border:1px solid #e2ebe1;border-radius:8px;margin:8px 0;background:#fff}\n.knowledge-check summary{cursor:pointer;padding:12px 14px;color:#375845;font-size:12px;font-weight:700;line-height:1.5}\n.knowledge-check details p{margin:0;padding:0 14px 14px;color:#516b57;font-size:12px;line-height:1.8}\n@media(max-width:760px){.course-number{font-size:9px;min-width:15px}.lesson-row{gap:8px}.lesson-time{display:none}.objective-box{padding:14px 15px}.learning-point strong{font-size:11px}}\n@media(max-width:760px){.dialog-scroll{padding:21px}.lesson-agenda{grid-template-columns:repeat(2,1fr)}.learning-point{padding:14px}.case-box{padding:15px}}\n", "curriculum.js": 'const courses = [\n  {\n    "id": "sv-01",\n    "number": 1,\n    "title": "QSC \uAD00\uB9AC",\n    "moduleId": "operations",\n    "objective": "\uBE0C\uB79C\uB4DC\uC758 \uD488\uC9C8\xB7\uC11C\uBE44\uC2A4\xB7\uCCAD\uACB0 \uAE30\uC900\uC744 \uC77C\uAD00\uB418\uAC8C \uD3C9\uAC00\uD558\uACE0, \uBBF8\uB2EC \uC6D0\uC778\uC744 \uCC3E\uC544 \uAC1C\uC120\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "QSC\uC758 \uBAA9\uC801\uACFC \uAE30\uC900 \uC774\uD574",\n        "detail": "QSC\uAC00 \uACE0\uAC1D \uB9CC\uC871\xB7\uC7AC\uBC29\uBB38\xB7\uBE0C\uB79C\uB4DC \uC2E0\uB8B0\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5, \uBE0C\uB79C\uB4DC \uC6B4\uC601\uAE30\uC900\uACFC \uAC1C\uC778\uC801 \uD310\uB2E8\uC758 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uD488\uC9C8 \uAD00\uB9AC \u2014 Quality",\n        "detail": "\uC6D0\uC7AC\uB8CC \uC0C1\uD0DC, \uB808\uC2DC\uD53C\xB7\uC911\uB7C9\xB7\uC81C\uC870 \uC21C\uC11C, \uB9DB\xB7\uC628\uB3C4\xB7\uC678\uAD00\xB7\uC81C\uACF5\uB7C9, \uC81C\uC870\uC2DC\uAC04, \uD3EC\uC7A5\xB7\uBC30\uB2EC \uD488\uC9C8"\n      },\n      {\n        "title": "\uC11C\uBE44\uC2A4 \uAD00\uB9AC \u2014 Service",\n        "detail": "\uC785\uC810\uBD80\uD130 \uD1F4\uC810\uAE4C\uC9C0 \uACE0\uAC1D \uC811\uC810, \uC778\uC0AC\xB7\uC8FC\uBB38\xB7\uACB0\uC81C\xB7\uC81C\uACF5\xB7\uBD88\uB9CC \uC751\uB300, \uB300\uAE30\uC2DC\uAC04, \uC8FC\uBB38 \uC815\uD655\uB3C4, \uC9C1\uC6D0 \uD0DC\uB3C4"\n      },\n      {\n        "title": "\uCCAD\uACB0 \uAD00\uB9AC \u2014 Cleanliness",\n        "detail": "\uAC1D\uC11D\xB7\uC8FC\uBC29\xB7\uCC3D\uACE0\xB7\uD654\uC7A5\uC2E4 \uAD00\uB9AC, \uC7A5\uBE44\xB7\uB3C4\uAD6C \uC138\uCC99, \uAC1C\uC778\uC704\uC0DD, \uCCAD\uC18C \uC8FC\uAE30\uC640 \uB2F4\uB2F9\uC790 \uC124\uC815"\n      },\n      {\n        "title": "\uD3C9\uAC00\uC640 \uC6D0\uC778 \uBD84\uC11D",\n        "detail": "\uD56D\uBAA9\uBCC4 \uD310\uC815 \uAE30\uC900, \uAD00\uCC30\xB7\uCE21\uC815\xB7\uC0AC\uC9C4 \uD65C\uC6A9, \uD3C9\uAC00\uC790 \uAC04 \uD3B8\uCC28 \uC870\uC815, \uC9C0\uC2DD\xB7\uC219\uB828\xB7\uC778\uB825\xB7\uC7A5\uBE44 \uBB38\uC81C \uAD6C\uBD84"\n      },\n      {\n        "title": "\uAC1C\uC120 \uC9C0\uB3C4\uC640 \uC7AC\uC810\uAC80",\n        "detail": "\uC989\uC2DC \uC870\uCE58\uC640 \uACC4\uD68D \uAC1C\uC120 \uAD6C\uBD84, \uC2DC\uBC94\uACFC \uC2E4\uC2B5, \uB2F4\uB2F9\uC790\xB7\uAE30\uD55C\xB7\uC644\uB8CC \uAE30\uC900 \uC124\uC815, \uBC18\uBCF5 \uBBF8\uB2EC \uAD00\uB9AC"\n      }\n    ],\n    "practice": "\uAC19\uC740 \uB9E4\uC7A5 \uC0AC\uC9C4\xB7\uC601\uC0C1\uC744 \uD3C9\uAC00\uD558\uACE0 \uC810\uC218 \uCC28\uC774\uB97C \uC870\uC815\uD55C \uB4A4, \uC8FC\uC694 \uBBF8\uB2EC \uD56D\uBAA9\uC758 \uAC1C\uC120\uC548\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "QSC \uD3C9\uAC00\uD45C",\n      "\uD56D\uBAA9\uBCC4 \uD310\uC815 \uAE30\uC900\uC11C",\n      "\uAC1C\uC120\uC870\uCE58 \uAD00\uB9AC\uD45C"\n    ]\n  },\n  {\n    "id": "sv-02",\n    "number": 2,\n    "title": "\uAC00\uB9F9\uC810 \uC810\uAC80",\n    "moduleId": "operations",\n    "objective": "\uBC29\uBB38 \uC804 \uC900\uBE44\uBD80\uD130 \uD604\uC7A5 \uD655\uC778\xB7\uC810\uC8FC \uBA74\uB2F4\xB7\uD6C4\uC18D \uAD00\uB9AC\uAE4C\uC9C0 \uC810\uAC80 \uC5C5\uBB34\uB97C \uC218\uD589\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC810\uAC80 \uBAA9\uC801\uACFC \uC720\uD615",\n        "detail": "\uC815\uAE30\xB7\uD14C\uB9C8\xB7\uC774\uC288\xB7\uD6C4\uC18D \uC810\uAC80\uC758 \uCC28\uC774, \uBC29\uBB38 \uBAA9\uC801\uACFC \uD575\uC2EC \uD655\uC778\uC0AC\uD56D \uC124\uC815"\n      },\n      {\n        "title": "\uBC29\uBB38 \uC804 \uC900\uBE44",\n        "detail": "\uB9E4\uCD9C \uCD94\uC774, \uC774\uC804 \uC810\uAC80 \uACB0\uACFC, \uBBF8\uC644\uB8CC \uACFC\uC81C, \uACE0\uAC1D \uBD88\uB9CC, \uC810\uC8FC \uC694\uCCAD, \uBCF8\uC0AC \uACF5\uC9C0 \uD655\uC778"\n      },\n      {\n        "title": "\uC810\uAC80 \uC77C\uC815\uACFC \uB3D9\uC120",\n        "detail": "\uBC29\uBB38\uC2DC\uAC04\uBCC4 \uAD00\uCC30 \uCC28\uC774, \uD53C\uD06C\uD0C0\uC784 \uAD00\uCC30\uACFC \uBA74\uB2F4\uC2DC\uAC04 \uAD6C\uBD84, \uC810\uAC80 \uC21C\uC11C\uC640 \uC900\uBE44\uBB3C"\n      },\n      {\n        "title": "\uD604\uC7A5 \uD655\uC778\uACFC \uAE30\uB85D",\n        "detail": "\uC678\uBD80\xB7\uAC1D\uC11D\xB7\uCE74\uC6B4\uD130\xB7\uC8FC\uBC29\xB7\uCC3D\uACE0 \uC810\uAC80, \uC81C\uC870\xB7\uC751\uB300 \uAD00\uCC30, \uC2DC\uC2A4\uD15C\xB7\uAE30\uB85D\xB7\uC2E4\uBB3C \uB300\uC870, \uC0AC\uC2E4\uACFC \uCD94\uC815 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uC810\uC8FC \uBA74\uB2F4\uACFC \uACFC\uC81C \uD569\uC758",\n        "detail": "\uACB0\uACFC \uC124\uBA85, \uC810\uC8FC \uC758\uACAC \uD655\uC778, \uC6B0\uC120\uC21C\uC704 \uC120\uC815, \uC2E4\uD589 \uAC00\uB2A5\uD55C \uACFC\uC81C\xB7\uB2F4\uB2F9\uC790\xB7\uAE30\uD55C \uD569\uC758"\n      },\n      {\n        "title": "\uBCF4\uACE0\uC640 \uC644\uB8CC \uD655\uC778",\n        "detail": "\uBC29\uBB38\uBCF4\uACE0, \uD0C0 \uBD80\uC11C \uD611\uC5C5 \uC694\uCCAD, \uAC1C\uC120 \uC99D\uBE59 \uD655\uC778, \uBBF8\uC644\uB8CC \uC0AC\uC720 \uD30C\uC545, \uB2E4\uC74C \uC810\uAC80 \uBC18\uC601"\n      }\n    ],\n    "practice": "\uAC00\uC0C1 \uC810\uD3EC \uC790\uB8CC\uB97C \uBCF4\uACE0 \uBC29\uBB38\uACC4\uD68D\xB7\uC810\uAC80\uBCF4\uACE0\uC11C\xB7\uD6C4\uC18D \uAD00\uB9AC\uACC4\uD68D\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uBC29\uBB38 \uC900\uBE44\uD45C",\n      "\uD604\uC7A5 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8",\n      "\uBC29\uBB38\uBCF4\uACE0\uC11C",\n      "\uAC1C\uC120\uACFC\uC81C \uCD94\uC801\uD45C"\n    ]\n  },\n  {\n    "id": "sv-03",\n    "number": 3,\n    "title": "\uC810\uC8FC \uC18C\uD1B5",\n    "moduleId": "people",\n    "objective": "\uC810\uC8FC\uC758 \uC0C1\uD669\uACFC \uC694\uAD6C\uB97C \uC774\uD574\uD558\uACE0, \uBCF8\uC0AC\uC758 \uAE30\uC900\uACFC \uAC1C\uC120 \uC81C\uC548\uC744 \uC2E4\uD589\uC73C\uB85C \uC5F0\uACB0\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC810\uC8FC\uC758 \uC785\uC7A5 \uC774\uD574",\n        "detail": "\uD22C\uC790\uC790\uC774\uC790 \uC6B4\uC601\uC790\uC778 \uC810\uC8FC\uC758 \uAD00\uC810, \uB9E4\uCD9C\xB7\uC218\uC775\xB7\uC778\uB825 \uBD80\uB2F4, SV\uC5D0\uAC8C \uAE30\uB300\uD558\uB294 \uC5ED\uD560"\n      },\n      {\n        "title": "\uC0C1\uD669\uBCC4 \uC18C\uD1B5 \uBC29\uBC95",\n        "detail": "\uC2E0\uADDC\xB7\uC7A5\uAE30 \uC6B4\uC601, \uC9C1\uC811 \uC6B4\uC601\xB7\uAD00\uB9AC\uC790 \uC704\uC784 \uB4F1 \uC6B4\uC601 \uC0C1\uD669\uC5D0 \uB9DE\uCD98 \uC124\uBA85 \uBC29\uC2DD"\n      },\n      {\n        "title": "\uACBD\uCCAD\uACFC \uC9C8\uBB38",\n        "detail": "\uC0AC\uC2E4\xB7\uAC10\uC815\xB7\uC694\uAD6C \uAD6C\uBD84, \uC5F4\uB9B0 \uC9C8\uBB38\uACFC \uD655\uC778 \uC9C8\uBB38, \uC694\uC57D\uC744 \uD1B5\uD55C \uC774\uD574 \uD655\uC778, \uC2E4\uC81C \uBB38\uC81C \uD30C\uC545"\n      },\n      {\n        "title": "\uC124\uBA85\uACFC \uC124\uB4DD",\n        "detail": "\uD604\uD669\xB7\uADFC\uAC70\xB7\uC81C\uC548\xB7\uAE30\uB300\uD6A8\uACFC \uC21C\uC11C, \uBE44\uC6A9\uACFC \uC791\uC5C5 \uBD80\uB2F4 \uACE0\uB824, \uC120\uD0DD \uAC00\uB2A5\uD55C \uB300\uC548 \uC81C\uC2DC"\n      },\n      {\n        "title": "\uD53C\uB4DC\uBC31\uACFC \uC5B4\uB824\uC6B4 \uB300\uD654",\n        "detail": "\uD589\uB3D9 \uC911\uC2EC \uD53C\uB4DC\uBC31, \uC815\uCC45 \uBCC0\uACBD\xB7\uC9C0\uC6D0 \uBD88\uAC00 \uC804\uB2EC, \uAC10\uC815\uC774 \uACA9\uD574\uC9C4 \uC0C1\uD669\uC758 \uB300\uD654 \uC815\uB9AC"\n      },\n      {\n        "title": "\uC5F0\uB77D\uACFC \uC57D\uC18D \uAD00\uB9AC",\n        "detail": "\uBC29\uBB38\xB7\uC804\uD654\xB7\uBA54\uC2E0\uC800 \uD65C\uC6A9, \uB2F5\uBCC0 \uC608\uC815\uC2DC\uAC04 \uC548\uB0B4, \uD611\uC758\uB0B4\uC6A9 \uAE30\uB85D, \uC57D\uC18D \uC774\uD589\uACFC \uC9C4\uD589 \uC0C1\uD669 \uACF5\uC720"\n      }\n    ],\n    "practice": "\u201C\uB9E4\uCD9C\uB3C4 \uC548 \uB098\uC624\uB294\uB370 \uD589\uC0AC\uB9CC \uC2DC\uD0A8\uB2E4\u201D \uB4F1 \uC2E4\uC81C \uBD88\uB9CC \uC0C1\uD669\uC744 \uC5ED\uD560\uADF9\uC73C\uB85C \uC5F0\uC2B5\uD55C\uB2E4.",\n    "forms": [\n      "\uBA74\uB2F4 \uC900\uBE44\uD45C",\n      "\uC0C1\uD669\uBCC4 \uB300\uD654 \uC608\uC2DC",\n      "\uBA74\uB2F4 \uAE30\uB85D\uC9C0",\n      "\uC694\uCCAD\xB7\uC57D\uC18D \uAD00\uB9AC\uB300\uC7A5"\n    ]\n  },\n  {\n    "id": "sv-04",\n    "number": 4,\n    "title": "\uC288\uD37C\uBC14\uC774\uC800\uC758 \uC5ED\uD560\uACFC \uC5C5\uBB34 \uC774\uD574",\n    "moduleId": "foundation",\n    "objective": "SV\uC758 \uCC45\uC784\uACFC \uAD8C\uD55C\uC744 \uC774\uD574\uD558\uACE0, \uC810\uD3EC \uAD00\uB9AC\uC640 \uBCF8\uC0AC \uD611\uC5C5\uC744 \uCCB4\uACC4\uC801\uC73C\uB85C \uC218\uD589\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "SV\uC758 \uC5ED\uD560",\n        "detail": "\uBE0C\uB79C\uB4DC \uAE30\uC900 \uC720\uC9C0, \uC6B4\uC601 \uC9C0\uC6D0, \uB9E4\uCD9C\xB7\uC218\uC775 \uAC1C\uC120 \uC9C0\uC6D0, \uD604\uC7A5 \uAD50\uC721, \uC815\uBCF4 \uC218\uC9D1, \uBB38\uC81C\uC758 \uC870\uAE30 \uBC1C\uACAC"\n      },\n      {\n        "title": "\uCC45\uC784\uACFC \uAD8C\uD55C",\n        "detail": "\uC9C1\uC811 \uD310\uB2E8\xB7\uC2B9\uC778 \uC694\uCCAD\xB7\uC804\uBB38 \uBD80\uC11C \uD611\uC758 \uC0AC\uD56D \uAD6C\uBD84, \uBE44\uC6A9\xB7\uC9C0\uC6D0\xB7\uC77C\uC815\uC5D0 \uB300\uD55C \uC784\uC758 \uC57D\uC18D \uBC29\uC9C0"\n      },\n      {\n        "title": "\uBCF8\uC0AC\uC640 \uC810\uD3EC\uC758 \uC5F0\uACB0",\n        "detail": "\uC815\uCC45 \uCDE8\uC9C0 \uC124\uBA85, \uC810\uC8FC \uC694\uCCAD\uC758 \uC0AC\uC2E4\xB7\uC601\uD5A5\xB7\uC694\uAD6C \uC815\uB9AC, \uAC1C\uBCC4 \uC758\uACAC\uACFC \uACF5\uD1B5 \uBB38\uC81C \uAD6C\uBD84"\n      },\n      {\n        "title": "\uB2F4\uB2F9 \uC810\uD3EC \uC774\uD574",\n        "detail": "\uAE30\uBCF8\uC815\uBCF4, \uC6B4\uC601 \uD615\uD0DC, \uB9E4\uCD9C\xB7\uC190\uC775, QSC, \uC810\uC8FC\xB7\uAD00\uB9AC\uC790 \uD604\uD669, \uC8FC\uC694 \uC774\uC288 \uD30C\uC545"\n      },\n      {\n        "title": "\uC5C5\uBB34 \uC8FC\uAE30\uC640 \uC131\uACFC",\n        "detail": "\uC77C\xB7\uC8FC\xB7\uC6D4 \uC5C5\uBB34, \uBC29\uBB38\uACFC \uD6C4\uC18D \uAD00\uB9AC, \uD65C\uB3D9\uC9C0\uD45C\uC640 \uACB0\uACFC\uC9C0\uD45C, \uB2F4\uB2F9\uC790 \uBCC0\uACBD \uC2DC \uC778\uC218\uC778\uACC4"\n      },\n      {\n        "title": "\uBD80\uC11C \uD611\uC5C5",\n        "detail": "\uC0C1\uD488\xB7\uBB3C\uB958\xB7\uAD50\uC721\xB7\uB9C8\uCF00\uD305\xB7\uC2DC\uC124\xB7\uC7AC\uBB34 \uBD80\uC11C\uC758 \uC5ED\uD560, \uD611\uC5C5 \uC694\uCCAD\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uC640 \uACB0\uACFC \uD655\uC778"\n      }\n    ],\n    "practice": "\uC5C5\uBB34 \uC0AC\uB840\uB97C \uC9C1\uC811 \uCC98\uB9AC\xB7\uC2B9\uC778 \uC694\uCCAD\xB7\uD0C0 \uBD80\uC11C \uD611\uC5C5\uC73C\uB85C \uAD6C\uBD84\uD55C\uB2E4.",\n    "forms": [\n      "\uC5C5\uBB34\uBD84\uC7A5\uD45C",\n      "\uAD8C\uD55C\xB7\uBCF4\uACE0 \uAE30\uC900\uD45C",\n      "\uC810\uD3EC \uD604\uD669\uD45C",\n      "\uD611\uC5C5 \uC694\uCCAD\uC11C"\n    ]\n  },\n  {\n    "id": "sv-05",\n    "number": 5,\n    "title": "\uAC00\uB9F9\uC0AC\uC5C5 \uAD6C\uC870\uC640 \uBCF8\uC0AC \uC815\uCC45 \uC774\uD574",\n    "moduleId": "foundation",\n    "objective": "\uAC00\uB9F9\uC0AC\uC5C5\uC758 \uAC70\uB798\xB7\uC218\uC775\uAD6C\uC870\uB97C \uC774\uD574\uD558\uACE0, \uACC4\uC57D\uACFC \uC815\uCC45\uC5D0 \uADFC\uAC70\uD574 \uD604\uC7A5 \uC5C5\uBB34\uB97C \uC218\uD589\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uAC00\uB9F9\uC0AC\uC5C5\uC758 \uAD6C\uC870",\n        "detail": "\uBCF8\uC0AC\xB7\uAC00\uB9F9\uC810\xB7\uACF5\uAE09\uC5C5\uCCB4\uC758 \uC5ED\uD560, \uC9C1\uC601\uC810\uACFC \uAC00\uB9F9\uC810\uC758 \uCC28\uC774, \uBE0C\uB79C\uB4DC\xB7\uC0C1\uD488\xB7\uC9C0\uC6D0 \uCCB4\uACC4"\n      },\n      {\n        "title": "\uBCF8\uC0AC\uC640 \uAC00\uB9F9\uC810 \uC218\uC775\uAD6C\uC870",\n        "detail": "\uAC00\uB9F9\uBE44\xB7\uAD50\uC721\uBE44\xB7\uB85C\uC5F4\uD2F0\xB7\uC0C1\uD488 \uACF5\uAE09 \uB4F1 \uBCF8\uC0AC \uC218\uC775, \uAC00\uB9F9\uC810\uC758 \uB9E4\uCD9C\uACFC \uC8FC\uC694 \uBE44\uC6A9, \uC774\uD574\uAD00\uACC4"\n      },\n      {\n        "title": "\uC8FC\uC694 \uBB38\uC11C \uC774\uD574",\n        "detail": "\uC815\uBCF4\uACF5\uAC1C\uC11C\xB7\uAC00\uB9F9\uACC4\uC57D\uC11C\xB7\uC6B4\uC601 \uB9E4\uB274\uC5BC\xB7\uC815\uCC45 \uACF5\uC9C0\uC758 \uBAA9\uC801, \uC801\uC6A9 \uBC94\uC704\xB7\uC2DC\uD589\uC77C\xB7\uCD5C\uC2E0\uBCF8 \uD655\uC778"\n      },\n      {\n        "title": "\uACC4\uC57D\uACFC \uC6B4\uC601\uC758 \uC5F0\uACB0",\n        "detail": "\uACC4\uC57D\uAE30\uAC04, \uC601\uC5C5\uC9C0\uC5ED, \uC0C1\uD488 \uACF5\uAE09, \uBE0C\uB79C\uB4DC \uC0AC\uC6A9, \uC6B4\uC601\uAE30\uC900, \uBE44\uC6A9 \uBD80\uB2F4 \uB4F1 \uC2E4\uBB34 \uD655\uC778 \uD56D\uBAA9"\n      },\n      {\n        "title": "\uC815\uCC45 \uC548\uB0B4\uC640 \uC608\uC678 \uCC98\uB9AC",\n        "detail": "\uC815\uCC45 \uCDE8\uC9C0\xB7\uB300\uC0C1\xB7\uC77C\uC815\xB7\uC900\uBE44\uC0AC\uD56D \uC124\uBA85, \uC608\uC678 \uC694\uCCAD\uC758 \uC2B9\uC778 \uC808\uCC28, \uAD6C\uB450 \uC57D\uC18D\uACFC \uC120\uB840 \uAD00\uB9AC"\n      },\n      {\n        "title": "\uBBFC\uAC10 \uC0AC\uC548 \uBCF4\uACE0",\n        "detail": "\uACC4\uC57D \uD574\uC11D\xB7\uBE44\uC6A9 \uBD84\uC7C1\xB7\uAC70\uB798\uC870\uAC74 \uBCC0\uACBD\xB7\uACC4\uC57D \uC885\uB8CC \uB4F1\uC758 \uC0AC\uC2E4\uAD00\uACC4 \uD655\uBCF4\uC640 \uB2F4\uB2F9 \uBD80\uC11C \uC5F0\uACB0"\n      }\n    ],\n    "practice": "\uAC00\uC0C1 \uACC4\uC57D\uC11C\xB7\uC815\uCC45 \uACF5\uC9C0\uC5D0\uC11C \uC810\uC8FC \uC9C8\uBB38\uC758 \uB2F5\uBCC0 \uADFC\uAC70\uB97C \uCC3E\uACE0 \uC548\uB0B4\uBB38\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uAC00\uB9F9\uC0AC\uC5C5 \uAD6C\uC870\uB3C4",\n      "\uC8FC\uC694 \uBB38\uC11C \uD655\uC778\uD45C",\n      "\uC815\uCC45 \uC548\uB0B4 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8",\n      "\uC608\uC678 \uC2B9\uC778 \uC694\uCCAD\uC11C"\n    ],\n    "note": "\uACC4\uC57D\xB7\uBC95\uB960 \uAD00\uB828 \uAD50\uC548\uC740 \uD574\uB2F9 \uBE0C\uB79C\uB4DC\uC758 \uC2E4\uC81C \uBB38\uC11C\uC640 \uAD50\uC721 \uC2DC\uC810\uC758 \uBC95\uB839\uC744 \uD655\uC778\uD574 \uAD6C\uCCB4\uD654\uD55C\uB2E4."\n  },\n  {\n    "id": "sv-06",\n    "number": 6,\n    "title": "\uB9E4\uCD9C \uB370\uC774\uD130 \uBD84\uC11D",\n    "moduleId": "growth",\n    "objective": "POS \uB370\uC774\uD130\uB97C \uC77D\uACE0, \uB9E4\uCD9C\uC774 \uBCC0\uD55C \uC6D0\uC778\uACFC \uD604\uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uACFC\uC81C\uB97C \uCC3E\uC544\uB0B8\uB2E4.",\n    "topics": [\n      {\n        "title": "\uB9E4\uCD9C \uC9C0\uD45C\uC758 \uAE30\uBCF8",\n        "detail": "\uB9E4\uCD9C\xB7\uAC70\uB798\uAC74\uC218\xB7\uAC1D\uB2E8\uAC00\xB7\uD310\uB9E4\uC218\uB7C9\uC758 \uAD00\uACC4, \uAC70\uB798\uAC74\uC218\uC640 \uC2E4\uC81C \uBC29\uBB38\uAC1D \uC218\uC758 \uCC28\uC774, \uCDE8\uC18C\xB7\uD560\uC778\xB7\uD658\uBD88 \uCC98\uB9AC"\n      },\n      {\n        "title": "\uBE44\uAD50 \uAE30\uC900 \uC124\uC815",\n        "detail": "\uC804\uC8FC\xB7\uC804\uC6D4\xB7\uC804\uB144 \uB3D9\uAE30 \uBE44\uAD50, \uC601\uC5C5\uC77C\uC218\xB7\uC694\uC77C\xB7\uACF5\uD734\uC77C\xB7\uC601\uC5C5\uC2DC\uAC04 \uCC28\uC774 \uC870\uC815"\n      },\n      {\n        "title": "\uC2DC\uAC04\uB300\uC640 \uC694\uC77C \uBD84\uC11D",\n        "detail": "\uD53C\uD06C\xB7\uBE44\uD53C\uD06C \uC2DC\uAC04, \uD3C9\uC77C\xB7\uC8FC\uB9D0 \uCC28\uC774, \uC2DC\uAC04\uB300\uBCC4 \uC99D\uAC10, \uC778\uB825 \uBC0F \uC601\uC5C5\uC2DC\uAC04\uACFC\uC758 \uAD00\uACC4"\n      },\n      {\n        "title": "\uBA54\uB274\uC640 \uAD6C\uB9E4 \uAD6C\uC131 \uBD84\uC11D",\n        "detail": "\uBA54\uB274\uBCC4 \uD310\uB9E4\uB7C9\xB7\uB9E4\uCD9C \uBE44\uC911, \uC138\uD2B8\xB7\uCD94\uAC00 \uAD6C\uB9E4, \uC2E0\uBA54\uB274 \uD310\uB9E4, \uD2B9\uC815 \uC0C1\uD488 \uC758\uC874\uB3C4"\n      },\n      {\n        "title": "\uCC44\uB110\uBCC4 \uBD84\uC11D",\n        "detail": "\uB9E4\uC7A5\xB7\uD3EC\uC7A5\xB7\uBC30\uB2EC \uB9E4\uCD9C \uAD6C\uC131, \uCC44\uB110\uBCC4 \uC8FC\uBB38 \uD2B9\uC131, \uCC44\uB110 \uAC04 \uB9E4\uCD9C \uC774\uB3D9 \uAC00\uB2A5\uC131"\n      },\n      {\n        "title": "\uC6D0\uC778 \uAC00\uC124\uACFC \uD604\uC7A5 \uAC80\uC99D",\n        "detail": "\uC218\uCE58 \uBCC0\uD654\uC5D0\uC11C \uAC00\uC124 \uB3C4\uCD9C, \uB0A0\uC528\xB7\uACBD\uC7C1\uC810\xB7\uD488\uC808\xB7\uC6B4\uC601 \uBB38\uC81C \uD655\uC778, \uCD94\uAC00 \uB370\uC774\uD130\uC640 \uC2E4\uD589\uACFC\uC81C \uC120\uC815"\n      }\n    ],\n    "practice": "\uB9E4\uCD9C\uC774 \uD558\uB77D\uD55C \uC810\uD3EC\uC758 \uB370\uC774\uD130\uB97C \uBD84\uC11D\uD574 \uC6D0\uC778 \uAC00\uC124 3\uAC1C\uC640 \uD655\uC778 \uBC29\uBC95\uC744 \uC81C\uC2DC\uD55C\uB2E4.",\n    "forms": [\n      "\uB9E4\uCD9C \uBD84\uC11D\uD45C",\n      "\uC2DC\uAC04\uB300\xB7\uBA54\uB274\xB7\uCC44\uB110 \uBD84\uC11D\uD45C",\n      "\uC6D0\uC778 \uAC00\uC124 \uC815\uB9AC\uD45C"\n    ]\n  },\n  {\n    "id": "sv-07",\n    "number": 7,\n    "title": "\uAC00\uB9F9\uC810 \uC190\uC775 \uAD00\uB9AC",\n    "moduleId": "growth",\n    "objective": "\uC810\uD3EC\uC758 \uBE44\uC6A9\uAD6C\uC870\uB97C \uC774\uD574\uD558\uACE0, \uB9E4\uCD9C\uC774 \uC2E4\uC81C \uC774\uC775\uC73C\uB85C \uC774\uC5B4\uC9C0\uB294\uC9C0 \uD310\uB2E8\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC190\uC775\uC758 \uAE30\uBCF8 \uAD6C\uC870",\n        "detail": "\uB9E4\uCD9C\xB7\uB9E4\uCD9C\uC6D0\uAC00\xB7\uB9E4\uCD9C\uCD1D\uC774\uC775\xB7\uC601\uC5C5\uBE44\uC6A9\xB7\uC601\uC5C5\uC774\uC775, \uC190\uC775\uACFC \uD604\uAE08\uD750\uB984\uC758 \uCC28\uC774"\n      },\n      {\n        "title": "\uC6D0\uAC00 \uBD84\uC11D",\n        "detail": "\uB9E4\uC785\uACFC \uC7AC\uACE0 \uC0AC\uC6A9\uC758 \uCC28\uC774, \uC2E4\uC81C \uC6D0\uAC00\uC640 \uC774\uB860 \uC6D0\uAC00, \uC6D0\uAC00\uC728, \uBA54\uB274 \uAD6C\uC131\xB7\uD3D0\uAE30\xB7\uC81C\uC870 \uD3B8\uCC28\uC758 \uC601\uD5A5"\n      },\n      {\n        "title": "\uC778\uAC74\uBE44 \uBD84\uC11D",\n        "detail": "\uC2DC\uAC04\uB300\uBCC4 \uD22C\uC785\uC2DC\uAC04, \uC778\uAC74\uBE44\uC728, \uB9E4\uCD9C \uB300\uBE44 \uB178\uB3D9\uC2DC\uAC04, \uC810\uC8FC \uBCF8\uC778 \uB178\uB3D9\uC758 \uBCC4\uB3C4 \uACE0\uB824"\n      },\n      {\n        "title": "\uACE0\uC815\uBE44\uC640 \uCC44\uB110 \uBE44\uC6A9",\n        "detail": "\uC784\uCC28\uB8CC\xB7\uAD00\uB9AC\uBE44\xB7\uACF5\uACFC\uAE08\xB7\uAC01\uC885 \uC218\uC218\uB8CC, \uBC30\uB2EC\xB7\uACB0\uC81C\xB7\uD560\uC778 \uBE44\uC6A9, \uBE44\uC6A9 \uB204\uB77D \uD655\uC778"\n      },\n      {\n        "title": "\uC190\uC775\uBD84\uAE30\uC810\uACFC \uBAA9\uD45C",\n        "detail": "\uACE0\uC815\uBE44\xB7\uBCC0\uB3D9\uBE44 \uAD6C\uBD84, \uACF5\uD5CC\uC774\uC775, \uC190\uC775\uBD84\uAE30 \uB9E4\uCD9C, \uBAA9\uD45C\uC774\uC775 \uB2EC\uC131\uC5D0 \uD544\uC694\uD55C \uB9E4\uCD9C"\n      },\n      {\n        "title": "\uC218\uC775 \uAC1C\uC120\uC548",\n        "detail": "\uB9E4\uCD9C \uD655\uB300\xB7\uC0C1\uD488 \uAD6C\uC131\xB7\uB85C\uC2A4\xB7\uC778\uB825\xB7\uC6B4\uC601\uC2DC\uAC04 \uC870\uC815, \uAC1C\uC120 \uD6A8\uACFC\uC640 \uC11C\uBE44\uC2A4 \uC601\uD5A5 \uBE44\uAD50"\n      }\n    ],\n    "practice": "\uAC00\uC0C1 \uC810\uD3EC \uC190\uC775\uD45C\uB97C \uC644\uC131\uD558\uACE0 \uB9E4\uCD9C \uC99D\uAC00\uC548\uACFC \uBE44\uC6A9 \uAC1C\uC120\uC548\uC758 \uD6A8\uACFC\uB97C \uBE44\uAD50\uD55C\uB2E4.",\n    "forms": [\n      "\uC810\uD3EC \uC190\uC775\uD45C",\n      "\uC6D0\uAC00\xB7\uC778\uAC74\uBE44 \uBD84\uC11D\uD45C",\n      "\uC190\uC775\uBD84\uAE30\uC810 \uACC4\uC0B0\uD45C"\n    ]\n  },\n  {\n    "id": "sv-08",\n    "number": 8,\n    "title": "\uC0C1\uAD8C \uBC0F \uACBD\uC7C1\uC810 \uBD84\uC11D",\n    "moduleId": "growth",\n    "objective": "\uC810\uD3EC \uC8FC\uBCC0 \uC218\uC694\uC640 \uACBD\uC7C1 \uC0C1\uD669\uC744 \uD30C\uC545\uD558\uACE0, \uAE30\uC874 \uC810\uD3EC\uC758 \uC6B4\uC601\xB7\uD310\uB9E4 \uAE30\uD68C\uB97C \uCC3E\uB294\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC0C1\uAD8C\uC758 \uAE30\uBCF8 \uAD6C\uC870",\n        "detail": "\uC8FC\uAC70\xB7\uC624\uD53C\uC2A4\xB7\uD559\uAD50\xB7\uC0C1\uC5C5\xB7\uBCF5\uD569 \uC0C1\uAD8C\uC758 \uD2B9\uC131, \uC2DC\uAC04\uB300\uBCC4 \uC218\uC694\uC640 \uC8FC\uC694 \uBC29\uBB38 \uBAA9\uC801"\n      },\n      {\n        "title": "\uACE0\uAC1D\uACFC \uB3D9\uC120 \uAD00\uCC30",\n        "detail": "\uC8FC\uC694 \uACE0\uAC1D\uCE35, \uC774\uB3D9 \uBC29\uD5A5, \uC811\uADFC\uC131\xB7\uAC00\uC2DC\uC131, \uC720\uB3D9\uC778\uAD6C\uC640 \uC2E4\uC81C \uAD6C\uB9E4 \uAC00\uB2A5 \uC218\uC694\uC758 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uACBD\uC7C1\uC810 \uC120\uC815",\n        "detail": "\uAC19\uC740 \uC0C1\uD488\uC744 \uD30C\uB294 \uC9C1\uC811 \uACBD\uC7C1\uC810\uACFC \uAC19\uC740 \uC18C\uBE44 \uBAA9\uC801\uC744 \uCDA9\uC871\uD558\uB294 \uB300\uCCB4 \uACBD\uC7C1\uC810 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uACBD\uC7C1\uC810 \uC870\uC0AC",\n        "detail": "\uAC00\uACA9\xB7\uBA54\uB274\xB7\uC6B4\uC601\uC2DC\uAC04\xB7\uC88C\uC11D\xB7\uC11C\uBE44\uC2A4\xB7\uD310\uCD09\xB7\uBC30\uB2EC\xB7\uB9AC\uBDF0, \uAD00\uCC30 \uC0AC\uC2E4\uACFC \uCD94\uC815 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uC6B0\uB9AC \uC810\uD3EC\uC758 \uC704\uCE58 \uD310\uB2E8",\n        "detail": "\uACE0\uAC1D\uC774 \uC120\uD0DD\uD558\uB294 \uC774\uC720\uC640 \uC774\uD0C8 \uC774\uC720, \uAC15\uC810\xB7\uC57D\uC810, \uC0C1\uAD8C \uC218\uC694\uC640 \uD604\uC7AC \uC6B4\uC601\uC758 \uBD88\uC77C\uCE58"\n      },\n      {\n        "title": "\uC2E4\uD589 \uAE30\uD68C \uB3C4\uCD9C",\n        "detail": "\uC2DC\uAC04\uB300\uBCC4 \uBA54\uB274 \uC81C\uC548, \uC601\uC5C5\uC2DC\uAC04\xB7\uB178\uCD9C\xB7\uD310\uCD09 \uAC1C\uC120, \uC9C0\uC5ED \uC0AC\uC5C5\uCCB4 \uD611\uC5C5, \uC218\uC694 \uBCC0\uD654 \uCD94\uC801"\n      }\n    ],\n    "practice": "\uB3D9\uC77C \uC0C1\uAD8C\uC758 \uACBD\uC7C1\uC810 3\uACF3\uC744 \uBE44\uAD50\uD558\uACE0 \uC6B0\uB9AC \uC810\uD3EC\uC758 \uC2E4\uD589\uACFC\uC81C 3\uAC1C\uB97C \uC81C\uC548\uD55C\uB2E4.",\n    "forms": [\n      "\uC0C1\uAD8C \uC870\uC0AC\uD45C",\n      "\uACBD\uC7C1\uC810 \uBE44\uAD50\uD45C",\n      "\uACE0\uAC1D\xB7\uC2DC\uAC04\uB300\uBCC4 \uAE30\uD68C \uBD84\uC11D\uD45C"\n    ]\n  },\n  {\n    "id": "sv-09",\n    "number": 9,\n    "title": "\uB9E4\uCD9C \uBD80\uC9C4\uC810 \uC9C4\uB2E8 \uBC0F \uAC1C\uC120",\n    "moduleId": "growth",\n    "objective": "\uC5EC\uB7EC \uB370\uC774\uD130\uB97C \uC885\uD569\uD574 \uBD80\uC9C4 \uC6D0\uC778\uC744 \uC9C4\uB2E8\uD558\uACE0, \uC6B0\uC120\uC21C\uC704\uC5D0 \uB530\uB77C \uAC1C\uC120 \uD504\uB85C\uC81D\uD2B8\uB97C \uC6B4\uC601\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uBD80\uC9C4\uC810 \uD310\uB2E8",\n        "detail": "\uB2E8\uAE30 \uBCC0\uB3D9\uACFC \uC9C0\uC18D \uBD80\uC9C4 \uAD6C\uBD84, \uBE0C\uB79C\uB4DC \uD3C9\uADE0\uACFC \uC810\uD3EC \uC790\uCCB4 \uCD94\uC774, \uB9E4\uCD9C \uBD80\uC9C4\uACFC \uC218\uC775 \uBD80\uC9C4 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uC885\uD569 \uC9C4\uB2E8",\n        "detail": "\uC0C1\uAD8C\xB7\uACBD\uC7C1\xB7QSC\xB7\uC0C1\uD488\xB7\uAC00\uACA9\xB7\uCC44\uB110\xB7\uC778\uB825\xB7\uC810\uC8FC \uC2E4\uD589\uB825 \uB4F1 \uC6D0\uC778 \uD6C4\uBCF4 \uC810\uAC80"\n      },\n      {\n        "title": "\uD575\uC2EC \uC6D0\uC778 \uC120\uC815",\n        "detail": "\uC99D\uC0C1\uACFC \uC6D0\uC778 \uAD6C\uBD84, \uAC1D\uC218\xB7\uAC1D\uB2E8\uAC00\xB7\uC7AC\uBC29\uBB38 \uAD00\uC810 \uBD84\uC11D, \uC810\uD3EC\uAC00 \uBC14\uAFC0 \uC218 \uC788\uB294 \uC694\uC778 \uD310\uB2E8"\n      },\n      {\n        "title": "\uACFC\uC81C \uC6B0\uC120\uC21C\uC704",\n        "detail": "\uC608\uC0C1 \uD6A8\uACFC\xB7\uBE44\uC6A9\xB7\uC2DC\uAC04\xB7\uC2E4\uD589 \uAC00\uB2A5\uC131 \uBE44\uAD50, \uB2E8\uAE30 \uC870\uCE58\uC640 \uAD6C\uC870 \uAC1C\uC120 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uAC1C\uC120\uACC4\uD68D \uC218\uB9BD",\n        "detail": "\uAE30\uC900 \uC2E4\uC801, \uBAA9\uD45C, \uC2E4\uD589 \uD56D\uBAA9, \uB2F4\uB2F9\uC790, \uC608\uC0B0, \uC77C\uC815, \uBCF8\uC0AC \uC9C0\uC6D0\uC0AC\uD56D \uC124\uC815"\n      },\n      {\n        "title": "\uC131\uACFC \uD655\uC778\uACFC \uC870\uC815",\n        "detail": "\uC2E4\uD589 \uC5EC\uBD80\uC640 \uACB0\uACFC \uAD6C\uBD84, \uC678\uBD80 \uBCC0\uC218 \uD655\uC778, \uC911\uAC04 \uC810\uAC80, \uD6A8\uACFC \uC5C6\uB294 \uD65C\uB3D9 \uC218\uC815\xB7\uC911\uB2E8"\n      }\n    ],\n    "practice": "\uBD80\uC9C4\uC810 \uC0AC\uB840\uB97C \uBC14\uD0D5\uC73C\uB85C 4\uC8FC \uAC1C\uC120\uACC4\uD68D\uACFC \uC8FC\uAC04 \uC810\uAC80 \uAE30\uC900\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uBD80\uC9C4\uC810 \uC9C4\uB2E8\uD45C",\n      "\uAC1C\uC120 \uC6B0\uC120\uC21C\uC704\uD45C",\n      "\uC2E4\uD589\uACC4\uD68D\uC11C",\n      "\uC8FC\uAC04 \uC131\uACFC\uD45C"\n    ]\n  },\n  {\n    "id": "sv-10",\n    "number": 10,\n    "title": "\uC810\uD3EC \uB9C8\uCF00\uD305 \uBC0F \uD310\uCD09 \uC6B4\uC601",\n    "moduleId": "growth",\n    "objective": "\uC810\uD3EC\uC758 \uACE0\uAC1D\uACFC \uC0C1\uD669\uC5D0 \uB9DE\uB294 \uD310\uCD09\uC744 \uC124\uACC4\uD558\uACE0, \uBE44\uC6A9 \uB300\uBE44 \uD6A8\uACFC\uB97C \uAC80\uD1A0\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uB9C8\uCF00\uD305 \uBAA9\uC801 \uC124\uC815",\n        "detail": "\uC2E0\uADDC \uACE0\uAC1D \uC720\uC785\xB7\uC7AC\uBC29\uBB38\xB7\uAC1D\uB2E8\uAC00\xB7\uD2B9\uC815 \uC2DC\uAC04\uB300 \uB9E4\uCD9C \uB4F1 \uBAA9\uD45C \uAD6C\uBD84"\n      },\n      {\n        "title": "\uACE0\uAC1D\uACFC \uC81C\uC548 \uC124\uACC4",\n        "detail": "\uB300\uC0C1 \uACE0\uAC1D, \uAD6C\uB9E4 \uC0C1\uD669, \uC81C\uC548 \uC0C1\uD488, \uD61C\uD0DD, \uBA54\uC2DC\uC9C0, \uCC38\uC5EC \uC870\uAC74 \uC124\uC815"\n      },\n      {\n        "title": "\uC9C0\uC5ED \uD310\uCD09 \uD65C\uB3D9",\n        "detail": "\uC778\uADFC \uAE30\uC5C5\xB7\uD559\uAD50\xB7\uC8FC\uAC70\uC9C0 \uC81C\uD734, \uB2E8\uCCB4\uC8FC\uBB38, \uC9C0\uC5ED \uD589\uC0AC, \uB9E4\uC7A5 \uB0B4 \uD64D\uBCF4\uC640 \uD310\uB9E4 \uC81C\uC548"\n      },\n      {\n        "title": "\uBCF8\uC0AC \uD504\uB85C\uBAA8\uC158 \uC2E4\uD589",\n        "detail": "\uD589\uC0AC \uCDE8\uC9C0 \uC774\uD574, \uC900\uBE44\uBB3C\xB7\uC7AC\uACE0\xB7\uC778\uB825 \uC810\uAC80, \uC9C1\uC6D0 \uAD50\uC721, \uD64D\uBCF4\uBB3C \uC124\uCE58, \uD604\uC7A5 \uC2E4\uD589 \uD655\uC778"\n      },\n      {\n        "title": "\uC608\uC0B0\uACFC \uC218\uC775 \uAC80\uD1A0",\n        "detail": "\uD560\uC778\xB7\uC99D\uC815\xB7\uAD11\uACE0\xB7\uC778\uC1C4 \uB4F1 \uBE44\uC6A9, \uD589\uC0AC \uC0C1\uD488\uC758 \uC774\uC775, \uAE30\uC874 \uB9E4\uCD9C\uC758 \uD560\uC778 \uC804\uD658 \uAC00\uB2A5\uC131"\n      },\n      {\n        "title": "\uD6A8\uACFC \uCE21\uC815",\n        "detail": "\uCFE0\uD3F0 \uC0AC\uC6A9\xB7\uC8FC\uBB38\xB7\uB9E4\uCD9C\xB7\uC7AC\uAD6C\uB9E4 \uCE21\uC815, \uBE44\uAD50\uAE30\uAC04 \uC124\uC815, \uD310\uCD09 \uC885\uB8CC \uD6C4 \uC720\uC9C0 \uD6A8\uACFC \uD655\uC778"\n      }\n    ],\n    "practice": "\uC608\uC0B0\uACFC \uB300\uC0C1 \uACE0\uAC1D\uC774 \uC815\uD574\uC9C4 \uC810\uD3EC\uC758 \uD310\uCD09\uC548\uC744 \uB9CC\uB4E4\uACE0 \uC608\uC0C1 \uC190\uC775\uC744 \uACC4\uC0B0\uD55C\uB2E4.",\n    "forms": [\n      "\uD310\uCD09 \uAE30\uD68D\uC11C",\n      "\uC2E4\uD589 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8",\n      "\uC608\uC0B0\xB7\uD6A8\uACFC \uBD84\uC11D\uD45C"\n    ]\n  },\n  {\n    "id": "sv-11",\n    "number": 11,\n    "title": "\uBC30\uB2EC\xB7\uD3EC\uC7A5 \uBC0F \uC628\uB77C\uC778 \uCC44\uB110 \uAD00\uB9AC",\n    "moduleId": "growth",\n    "objective": "\uC628\uB77C\uC778\uC5D0\uC11C\uC758 \uBC1C\uACAC\xB7\uC8FC\uBB38\xB7\uC218\uB839 \uACBD\uD5D8\uC744 \uAD00\uB9AC\uD558\uACE0, \uCC44\uB110\uBCC4 \uC218\uC775\uC744 \uAC1C\uC120\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uCC44\uB110 \uC6B4\uC601 \uD604\uD669 \uC810\uAC80",\n        "detail": "\uBC30\uB2EC\xB7\uD3EC\uC7A5\xB7\uC9C0\uB3C4\xB7\uD50C\uB808\uC774\uC2A4 \uB4F1 \uCC44\uB110\uBCC4 \uC5ED\uD560, \uC6B4\uC601\uC2DC\uAC04\xB7\uC5F0\uB77D\uCC98\xB7\uBA54\uB274 \uC815\uBCF4\uC758 \uC815\uD655\uC131"\n      },\n      {\n        "title": "\uBA54\uB274\uC640 \uD654\uBA74 \uAD6C\uC131",\n        "detail": "\uB300\uD45C \uBA54\uB274, \uC0AC\uC9C4\xB7\uC124\uBA85\xB7\uC635\uC158, \uC138\uD2B8 \uAD6C\uC131, \uD488\uC808 \uD45C\uC2DC, \uC8FC\uBB38 \uC2E4\uC218 \uC720\uBC1C \uC694\uC18C \uC810\uAC80"\n      },\n      {\n        "title": "\uC8FC\uBB38\uACFC \uC81C\uC870 \uC6B4\uC601",\n        "detail": "\uC811\uC218\xB7\uC81C\uC870\xB7\uD3EC\uC7A5\xB7\uC804\uB2EC \uACFC\uC815, \uC8FC\uBB38 \uB204\uB77D\xB7\uC9C0\uC5F0, \uD53C\uD06C\uD0C0\uC784 \uCC98\uB9AC\uB2A5\uB825, \uCC44\uB110\uBCC4 \uC791\uC5C5 \uB3D9\uC120"\n      },\n      {\n        "title": "\uD3EC\uC7A5\uACFC \uC218\uB839 \uD488\uC9C8",\n        "detail": "\uB204\uC218\xB7\uC628\uB3C4\xB7\uD615\uD0DC \uC720\uC9C0, \uAD6C\uC131\uD488 \uD655\uC778, \uBC00\uBD09, \uC804\uB2EC \uACFC\uC815\uACFC \uACE0\uAC1D \uC548\uB0B4"\n      },\n      {\n        "title": "\uB9AC\uBDF0\uC640 \uACE0\uAC1D \uB300\uC751",\n        "detail": "\uB9AC\uBDF0 \uC720\uD615 \uBD84\uC11D, \uC0AC\uC2E4 \uD655\uC778, \uACF5\uAC1C \uB2F5\uBCC0\uACFC \uAC1C\uBCC4 \uD574\uACB0 \uAD6C\uBD84, \uBC18\uBCF5 \uBD88\uB9CC\uC758 \uC6B4\uC601 \uAC1C\uC120"\n      },\n      {\n        "title": "\uCC44\uB110\uBCC4 \uC218\uC775\uACFC \uB178\uCD9C",\n        "detail": "\uC218\uC218\uB8CC\xB7\uAD11\uACE0\xB7\uD560\uC778\xB7\uD3EC\uC7A5\uBE44 \uBC18\uC601, \uAD11\uACE0 \uC131\uACFC, \uB9E4\uCD9C\uACFC \uC774\uC775\uC758 \uB3D9\uC2DC \uD655\uC778"\n      }\n    ],\n    "practice": "\uAC00\uC0C1 \uBC30\uB2EC \uB9E4\uC7A5\uC758 \uD654\uBA74\xB7\uB9AC\uBDF0\xB7\uC190\uC775\uC744 \uBCF4\uACE0 \uAC1C\uC120 \uC6B0\uC120\uC21C\uC704\uB97C \uC815\uD55C\uB2E4.",\n    "forms": [\n      "\uC628\uB77C\uC778 \uCC44\uB110 \uC810\uAC80\uD45C",\n      "\uB9AC\uBDF0 \uBD84\uC11D\uD45C",\n      "\uCC44\uB110\uBCC4 \uC190\uC775\uD45C"\n    ]\n  },\n  {\n    "id": "sv-12",\n    "number": 12,\n    "title": "\uBC1C\uC8FC\xB7\uC7AC\uACE0\xB7\uB85C\uC2A4 \uAD00\uB9AC",\n    "moduleId": "operations",\n    "objective": "\uD310\uB9E4\uC640 \uC7AC\uACE0 \uD750\uB984\uC5D0 \uB9DE\uCDB0 \uBC1C\uC8FC\uD558\uACE0, \uACB0\uD488\xB7\uACFC\uC789\uC7AC\uACE0\xB7\uD3D0\uAE30\uB97C \uC904\uC778\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC7AC\uACE0 \uD750\uB984 \uC774\uD574",\n        "detail": "\uBC1C\uC8FC\xB7\uC785\uACE0\xB7\uBCF4\uAD00\xB7\uC0AC\uC6A9\xB7\uC774\uB3D9\xB7\uD3D0\uAE30 \uACFC\uC815, \uD488\uBAA9\xB7\uB2E8\uC704\xB7\uC218\uB7C9 \uAD00\uB9AC"\n      },\n      {\n        "title": "\uC801\uC815 \uBC1C\uC8FC",\n        "detail": "\uD310\uB9E4\uC608\uCE21, \uD604\uC7AC\uACE0, \uC785\uACE0 \uC608\uC815\uB7C9, \uBC1C\uC8FC \uC8FC\uAE30\xB7\uB0A9\uAE30, \uC548\uC804\uC7AC\uACE0, \uD589\uC0AC\xB7\uD734\uC77C \uBC18\uC601"\n      },\n      {\n        "title": "\uC785\uACE0\uC640 \uBCF4\uAD00",\n        "detail": "\uC218\uB7C9\xB7\uD488\uC9C8\xB7\uAE30\uD55C \uD655\uC778, \uC774\uC0C1 \uC0C1\uD488 \uCC98\uB9AC, \uBCF4\uAD00 \uC704\uCE58, \uC120\uC785\uC120\uCD9C\uACFC \uAE30\uD55C \uC6B0\uC120 \uC0AC\uC6A9"\n      },\n      {\n        "title": "\uC7AC\uACE0 \uC2E4\uC0AC",\n        "detail": "\uC2E4\uC0AC \uC2DC\uC810\uACFC \uBC29\uBC95, \uAC1C\uBD09\uD488 \uD658\uC0B0, \uC7A5\uBD80\uC640 \uC2E4\uBB3C \uCC28\uC774, \uB2E8\uC704 \uC624\uB958\uC640 \uB204\uB77D \uD655\uC778"\n      },\n      {\n        "title": "\uB85C\uC2A4 \uC6D0\uC778 \uBD84\uC11D",\n        "detail": "\uACFC\uB2E4 \uC81C\uC870\xB7\uACC4\uB7C9 \uD3B8\uCC28\xB7\uC624\uC8FC\uBB38\xB7\uBCF4\uAD00 \uBD88\uB7C9\xB7\uAE30\uD55C \uACBD\uACFC\xB7\uAE30\uB85D \uB204\uB77D \uAD6C\uBD84"\n      },\n      {\n        "title": "\uC7AC\uACE0 \uAC1C\uC120",\n        "detail": "\uACB0\uD488\uACFC \uD3D0\uAE30\uC758 \uADE0\uD615, \uC800\uD68C\uC804 \uD488\uBAA9 \uAD00\uB9AC, \uBC1C\uC8FC \uAE30\uC900 \uC218\uC815, \uB2F4\uB2F9\uC790 \uAD50\uC721\uACFC \uCD94\uC801"\n      }\n    ],\n    "practice": "\uD310\uB9E4\uB7C9\uACFC \uC7AC\uACE0 \uC790\uB8CC\uB97C \uBCF4\uACE0 \uBC1C\uC8FC\uB7C9\uC744 \uC0B0\uCD9C\uD558\uACE0 \uC7AC\uACE0 \uCC28\uC774\uC758 \uC6D0\uC778\uC744 \uCC3E\uB294\uB2E4.",\n    "forms": [\n      "\uBC1C\uC8FC \uACC4\uC0B0\uD45C",\n      "\uC7AC\uACE0 \uC2E4\uC0AC\uD45C",\n      "\uD3D0\uAE30\xB7\uB85C\uC2A4 \uAE30\uB85D\uD45C",\n      "\uACB0\uD488 \uAD00\uB9AC\uD45C"\n    ]\n  },\n  {\n    "id": "sv-13",\n    "number": 13,\n    "title": "\uC81C\uD488 \uC81C\uC870 \uBC0F \uC2E0\uBA54\uB274 \uB3C4\uC785 \uAD00\uB9AC",\n    "moduleId": "operations",\n    "objective": "\uC81C\uC870 \uAE30\uC900\uC744 \uD604\uC7A5\uC5D0 \uC815\uCC29\uC2DC\uD0A4\uACE0, \uC2E0\uBA54\uB274 \uCD9C\uC2DC \uC900\uBE44\uC640 \uCD08\uAE30 \uC6B4\uC601\uC744 \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC81C\uC870 \uD45C\uC900 \uC774\uD574",\n        "detail": "\uB808\uC2DC\uD53C, \uACC4\uB7C9, \uC21C\uC11C, \uC2DC\uAC04\xB7\uC628\uB3C4, \uC804\uC6A9 \uB3C4\uAD6C, \uC644\uC131\uD488 \uAE30\uC900\uACFC \uD575\uC2EC \uAD00\uB9AC\uC810"\n      },\n      {\n        "title": "\uC81C\uC870 \uD3B8\uCC28 \uC9C4\uB2E8",\n        "detail": "\uC791\uC5C5\uC790\uBCC4 \uACB0\uACFC \uBE44\uAD50, \uACC4\uB7C9\xB7\uC7A5\uBE44\xB7\uC7AC\uB8CC\xB7\uC219\uB828 \uCC28\uC774, \uC81C\uC870 \uB3D9\uC120\uACFC \uD53C\uD06C\uD0C0\uC784 \uC601\uD5A5"\n      },\n      {\n        "title": "\uC81C\uC870 \uAD50\uC721",\n        "detail": "\uC124\uBA85\xB7\uC2DC\uBC94\xB7\uC2E4\uC2B5\xB7\uD655\uC778 \uC21C\uC11C, \uC219\uB828\uB3C4 \uD3C9\uAC00, \uC798\uBABB\uB41C \uC2B5\uAD00 \uAD50\uC815"\n      },\n      {\n        "title": "\uC2E0\uBA54\uB274 \uCD9C\uC2DC \uC900\uBE44",\n        "detail": "\uC6D0\uC7AC\uB8CC\xB7\uB3C4\uAD6C\xB7\uC7A5\uBE44\xB7POS\xB7\uBA54\uB274\uD310\xB7\uD64D\uBCF4\uBB3C\xB7\uAD50\uC721 \uC900\uBE44, \uCD08\uB3C4 \uBC1C\uC8FC\uC640 \uBCF4\uAD00 \uACF5\uAC04"\n      },\n      {\n        "title": "\uCD9C\uC2DC \uCD08\uAE30 \uAD00\uB9AC",\n        "detail": "\uD310\uB9E4 \uAC00\uB2A5 \uC0C1\uD0DC \uD655\uC778, \uC81C\uC870\uC2DC\uAC04\xB7\uACB0\uD488\xB7\uC624\uC81C\uC870\xB7\uACE0\uAC1D \uBB38\uC758 \uB300\uC751, \uCD94\uAC00 \uAD50\uC721"\n      },\n      {\n        "title": "\uD604\uC7A5 \uBC18\uC751 \uC218\uC9D1",\n        "detail": "\uD310\uB9E4\uB7C9\xB7\uC7AC\uC8FC\uBB38\xB7\uD3D0\uAE30\xB7\uACE0\uAC1D \uBC18\uC751, \uC791\uC5C5 \uB09C\uC774\uB3C4, \uAC1C\uC120 \uC758\uACAC\uC758 \uAD6C\uCCB4\uC801 \uBCF4\uACE0"\n      }\n    ],\n    "practice": "\uC2E0\uBA54\uB274 \uCD9C\uC2DC \uCCB4\uD06C\uB9AC\uC2A4\uD2B8\uB97C \uB9CC\uB4E4\uACE0 \uC81C\uC870 \uC624\uB958 \uC0C1\uD669\uC744 \uC9C4\uB2E8\uD55C\uB2E4.",\n    "forms": [\n      "\uC81C\uC870 \uAD00\uCC30\uD45C",\n      "\uC219\uB828\uB3C4 \uD655\uC778\uD45C",\n      "\uCD9C\uC2DC \uC900\uBE44\uD45C",\n      "\uC2E0\uBA54\uB274 \uD604\uC7A5 \uD53C\uB4DC\uBC31\uC11C"\n    ]\n  },\n  {\n    "id": "sv-14",\n    "number": 14,\n    "title": "\uC810\uD3EC \uC778\uB825 \uBC0F \uADFC\uBB34 \uC6B4\uC601",\n    "moduleId": "people",\n    "objective": "\uC810\uD3EC\uC758 \uC5C5\uBB34\uB7C9\uACFC \uC9C1\uC6D0 \uC219\uB828\uB3C4\uC5D0 \uB9DE\uB294 \uC778\uB825 \uC6B4\uC601 \uAC1C\uC120\uC744 \uC9C0\uC6D0\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC5C5\uBB34\uB7C9\uACFC \uC778\uB825 \uC218\uC694",\n        "detail": "\uC2DC\uAC04\uB300\uBCC4 \uC8FC\uBB38\xB7\uACE0\uAC1D\xB7\uC791\uC5C5\uB7C9, \uC624\uD508\xB7\uB9C8\uAC10\xB7\uC900\uBE44 \uC5C5\uBB34, \uCC44\uB110\uBCC4 \uC5C5\uBB34 \uCC28\uC774"\n      },\n      {\n        "title": "\uADFC\uBB34 \uC2A4\uCF00\uC904",\n        "detail": "\uD544\uC694 \uC778\uC6D0\uACFC \uAC00\uB2A5 \uC778\uC6D0, \uC219\uB828\uC790 \uBC30\uCE58, \uD734\uAC8C\xB7\uAD50\uB300, \uACB0\uC6D0 \uBC1C\uC0DD \uC2DC \uB300\uC751"\n      },\n      {\n        "title": "\uC5ED\uD560\uACFC \uC791\uC5C5 \uBC30\uCE58",\n        "detail": "\uC8FC\uBB38\xB7\uC81C\uC870\xB7\uD3EC\uC7A5\xB7\uC815\uB9AC \uC5ED\uD560, \uD53C\uD06C\uD0C0\uC784 \uD3EC\uC9C0\uC158, \uBCD1\uBAA9 \uC791\uC5C5\uACFC \uC5C5\uBB34 \uC3E0\uB9BC \uAC1C\uC120"\n      },\n      {\n        "title": "\uCC44\uC6A9\uACFC \uC815\uCC29 \uC9C0\uC6D0",\n        "detail": "\uD544\uC694\uD55C \uC5ED\uB7C9, \uCC44\uC6A9 \uC2DC \uC804\uB2EC\uD560 \uC5C5\uBB34, \uC785\uBB38\uAD50\uC721, \uCD08\uAE30 \uC801\uC751\uACFC \uC774\uC9C1 \uC6D0\uC778 \uD30C\uC545"\n      },\n      {\n        "title": "\uC0DD\uC0B0\uC131\uACFC \uBE44\uC6A9",\n        "detail": "\uC778\uAC74\uBE44\uC728\xB7\uD22C\uC785\uC2DC\uAC04\xB7\uCC98\uB9AC\uB7C9\uC744 \uD568\uAED8 \uD655\uC778, \uBB34\uB9AC\uD55C \uAC10\uCD95\uC774 \uD488\uC9C8\uACFC \uB9E4\uCD9C\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5"\n      },\n      {\n        "title": "SV\uC758 \uC9C0\uC6D0 \uBC94\uC704",\n        "detail": "\uC810\uC8FC\uC758 \uC778\uB825 \uC6B4\uC601 \uD310\uB2E8 \uC9C0\uC6D0, \uADFC\uBB34 \uAD00\uB828 \uC774\uC288\uC758 \uB2F4\uB2F9 \uBD80\uC11C \uC5F0\uACB0, \uC810\uC8FC\xB7\uAD00\uB9AC\uC790 \uC5ED\uD560 \uAD6C\uBD84"\n      }\n    ],\n    "practice": "\uC2DC\uAC04\uB300\uBCC4 \uC8FC\uBB38\uB7C9\uACFC \uC9C1\uC6D0 \uC219\uB828\uB3C4\uB97C \uBCF4\uACE0 \uADFC\uBB34\uD45C\uC640 \uD53C\uD06C\uD0C0\uC784 \uBC30\uCE58\uB3C4\uB97C \uB9CC\uB4E0\uB2E4.",\n    "forms": [\n      "\uC778\uB825 \uC218\uC694\uD45C",\n      "\uADFC\uBB34 \uC2A4\uCF00\uC904\uD45C",\n      "\uD3EC\uC9C0\uC158 \uBC30\uCE58\uD45C",\n      "\uC2E0\uADDC \uC9C1\uC6D0 \uC801\uC751 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8"\n    ]\n  },\n  {\n    "id": "sv-15",\n    "number": 15,\n    "title": "\uC810\uC8FC\xB7\uC9C1\uC6D0 \uAD50\uC721 \uBC0F \uD604\uC7A5 \uCF54\uCE6D",\n    "moduleId": "people",\n    "objective": "\uAD50\uC721 \uB300\uC0C1\uC758 \uBD80\uC871\uD55C \uC5ED\uB7C9\uC744 \uD30C\uC545\uD558\uACE0, \uC2E4\uC81C \uD589\uB3D9\uC774 \uB2EC\uB77C\uC9C0\uB294 \uD604\uC7A5\uAD50\uC721\uC744 \uC9C4\uD589\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uAD50\uC721 \uD544\uC694\uC0AC\uD56D \uC9C4\uB2E8",\n        "detail": "\uAE30\uC900 \uBBF8\uC778\uC9C0\xB7\uC219\uB828 \uBD80\uC871\xB7\uC2E4\uD589 \uC5EC\uAC74 \uBB38\uC81C \uAD6C\uBD84, \uAD00\uCC30\uACFC \uC9C8\uBB38\uC744 \uD1B5\uD55C \uC218\uC900 \uD655\uC778"\n      },\n      {\n        "title": "\uBAA9\uD45C\uC640 \uAD50\uC721\uACC4\uD68D",\n        "detail": "\uAD50\uC721 \uD6C4 \uC218\uD589\uD560 \uD589\uB3D9 \uC815\uC758, \uD575\uC2EC \uB0B4\uC6A9 \uC120\uC815, \uB300\uC0C1\xB7\uC2DC\uAC04\xB7\uC7A5\uC18C\xB7\uC900\uBE44\uBB3C \uACB0\uC815"\n      },\n      {\n        "title": "\uC124\uBA85\uACFC \uC2DC\uBC94",\n        "detail": "\uC791\uC5C5 \uBAA9\uC801\uACFC \uAE30\uC900 \uC124\uBA85, \uB2E8\uACC4\uBCC4 \uC2DC\uC5F0, \uC2E4\uC218\uD558\uAE30 \uC26C\uC6B4 \uBD80\uBD84\uACFC \uD310\uB2E8 \uAE30\uC900 \uC81C\uC2DC"\n      },\n      {\n        "title": "\uC2E4\uC2B5\uACFC \uD53C\uB4DC\uBC31",\n        "detail": "\uD559\uC2B5\uC790\uC758 \uC9C1\uC811 \uC218\uD589, \uD589\uB3D9 \uAD00\uCC30, \uAD6C\uCCB4\uC801 \uD53C\uB4DC\uBC31, \uC7AC\uC2E4\uC2B5"\n      },\n      {\n        "title": "\uC774\uD574\uB3C4\uC640 \uC219\uB828 \uD655\uC778",\n        "detail": "\uB9D0\uB85C \uC124\uBA85\uD558\uAE30\xB7\uC9C1\uC811 \uC218\uD589\uD558\uAE30\xB7\uC0C1\uD669\uC5D0 \uC801\uC6A9\uD558\uAE30, \uD569\uACA9 \uAE30\uC900\uACFC \uBCF4\uC644\uAD50\uC721"\n      },\n      {\n        "title": "\uCF54\uCE6D\uACFC \uC720\uC9C0",\n        "detail": "\uC9C8\uBB38\uC744 \uD1B5\uD55C \uD574\uACB0 \uC720\uB3C4, \uC810\uC8FC\xB7\uAD00\uB9AC\uC790\uC758 \uC790\uCCB4 \uAD50\uC721 \uC9C0\uC6D0, \uD6C4\uC18D \uD655\uC778\uACFC \uAD50\uC721 \uC774\uB825 \uAD00\uB9AC"\n      }\n    ],\n    "practice": "\uD55C \uAC00\uC9C0 \uC810\uD3EC \uC5C5\uBB34\uB97C \uC8FC\uC81C\uB85C 10\uBD84 \uAD50\uC721\uC744 \uC9C4\uD589\uD558\uACE0 \uC218\uD589 \uACB0\uACFC\uB97C \uD3C9\uAC00\uD55C\uB2E4.",\n    "forms": [\n      "\uAD50\uC721 \uD544\uC694 \uC9C4\uB2E8\uD45C",\n      "\uD604\uC7A5\uAD50\uC721 \uACC4\uD68D\uC11C",\n      "\uC218\uD589 \uD3C9\uAC00\uD45C",\n      "\uAD50\uC721 \uC774\uB825\uD45C"\n    ]\n  },\n  {\n    "id": "sv-16",\n    "number": 16,\n    "title": "\uACE0\uAC1D \uBD88\uB9CC \uBC0F \uC11C\uBE44\uC2A4 \uD68C\uBCF5",\n    "moduleId": "response",\n    "objective": "\uACE0\uAC1D \uBD88\uB9CC\uC758 \uC0AC\uC2E4\uACFC \uC694\uAD6C\uB97C \uD30C\uC545\uD558\uACE0, \uAD8C\uD55C\uC5D0 \uB9DE\uAC8C \uD574\uACB0\xB7\uBCF4\uACE0\xB7\uC7AC\uBC1C \uBC29\uC9C0\uB97C \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uBD88\uB9CC \uC720\uD615\uACFC \uC2EC\uAC01\uB3C4",\n        "detail": "\uC81C\uD488\xB7\uC751\uB300\xB7\uB300\uAE30\xB7\uC8FC\uBB38\xB7\uACB0\uC81C\xB7\uBC30\uB2EC \uBB38\uC81C, \uC77C\uBC18 \uBD88\uD3B8\uACFC \uC548\uC804 \uAD00\uB828 \uC0AC\uC548 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uCD08\uAE30 \uC751\uB300",\n        "detail": "\uACBD\uCCAD, \uBD88\uD3B8 \uB0B4\uC6A9 \uD655\uC778, \uD544\uC694\uD55C \uCD08\uAE30 \uC870\uCE58, \uB2E4\uC74C \uC808\uCC28\uC640 \uC5F0\uB77D \uC77C\uC815 \uC548\uB0B4"\n      },\n      {\n        "title": "\uC0AC\uC2E4 \uD655\uC778",\n        "detail": "\uC8FC\uBB38\uB0B4\uC5ED\xB7\uC0C1\uD488\xB7\uC2DC\uAC04\xB7\uC751\uB300 \uB0B4\uC6A9\xB7\uAD00\uB828 \uAE30\uB85D \uD655\uC778, \uACE0\uAC1D \uC8FC\uC7A5\uACFC \uD655\uC778 \uC0AC\uC2E4 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uD574\uACB0\uC548\uACFC \uAD8C\uD55C",\n        "detail": "\uC7AC\uC81C\uACF5\xB7\uD658\uBD88 \uB4F1 \uBE0C\uB79C\uB4DC \uAE30\uC900 \uD655\uC778, \uC810\uD3EC\xB7SV\xB7\uBCF8\uC0AC \uAD8C\uD55C \uAD6C\uBD84, \uC608\uC678 \uC2B9\uC778"\n      },\n      {\n        "title": "\uBCF8\uC0AC \uBCF4\uACE0\uC640 \uACBD\uACFC \uAD00\uB9AC",\n        "detail": "\uC601\uD5A5 \uBC94\uC704, \uAE34\uAE09\uC131, \uB2F4\uB2F9 \uBD80\uC11C \uC5F0\uACB0, \uACE0\uAC1D\uACFC \uC810\uD3EC\uC5D0 \uC9C4\uD589 \uC0C1\uD669 \uC804\uB2EC"\n      },\n      {\n        "title": "\uC7AC\uBC1C \uBC29\uC9C0\uC640 \uD68C\uBCF5 \uD655\uC778",\n        "detail": "\uC6D0\uC778 \uAC1C\uC120, \uC9C1\uC6D0 \uAD50\uC721, \uB3D9\uC77C \uC720\uD615 \uCD94\uC801, \uD574\uACB0 \uD6C4 \uACE0\uAC1D \uBC18\uC751 \uD655\uC778"\n      }\n    ],\n    "practice": "\uC8FC\uBB38 \uC624\uB958\xB7\uBD88\uCE5C\uC808\xB7\uBC30\uB2EC \uC9C0\uC5F0 \uC0AC\uB840\uC758 \uCD08\uAE30 \uC751\uB300\uC640 \uCC98\uB9AC\uBCF4\uACE0\uC11C\uB97C \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uACE0\uAC1D \uBD88\uB9CC \uC811\uC218\uD45C",\n      "\uCC98\uB9AC \uAE30\uC900\uD45C",\n      "\uACBD\uACFC \uAE30\uB85D\uC9C0",\n      "\uC7AC\uBC1C \uBC29\uC9C0 \uBCF4\uACE0\uC11C"\n    ]\n  },\n  {\n    "id": "sv-17",\n    "number": 17,\n    "title": "\uC704\uC0DD\xB7\uC2DD\uD488\uC548\uC804 \uBC0F \uC0AC\uACE0 \uB300\uC751",\n    "moduleId": "operations",\n    "objective": "\uC2DD\uD488\uC548\uC804 \uC704\uD5D8\uC744 \uC870\uAE30\uC5D0 \uBC1C\uACAC\uD558\uACE0, \uC0AC\uACE0 \uC758\uC2EC \uC0C1\uD669\uC5D0\uC11C \uCD08\uAE30 \uB300\uC751\uACFC \uBCF4\uACE0\uB97C \uC218\uD589\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC2DD\uD488\uC548\uC804 \uC704\uD5D8 \uC774\uD574",\n        "detail": "\uC0DD\uBB3C\uD559\uC801\xB7\uD654\uD559\uC801\xB7\uBB3C\uB9AC\uC801 \uC704\uD574\uC694\uC18C, \uC624\uC5FC\uC774 \uBC1C\uC0DD\uD558\uB294 \uC8FC\uC694 \uC791\uC5C5\uACFC \uACBD\uB85C"\n      },\n      {\n        "title": "\uC2DD\uC7AC\uB8CC\uC640 \uC628\uB3C4 \uAD00\uB9AC",\n        "detail": "\uC785\uACE0\xB7\uBCF4\uAD00\xB7\uD574\uB3D9\xB7\uC870\uB9AC\xB7\uC81C\uACF5 \uB2E8\uACC4 \uAD00\uB9AC, \uAE30\uD55C\xB7\uD45C\uC2DC\xB7\uC628\uB3C4 \uAE30\uB85D, \uAE30\uC900 \uC774\uD0C8 \uC2DC \uC870\uCE58"\n      },\n      {\n        "title": "\uAD50\uCC28\uC624\uC5FC\uACFC \uAC1C\uC778\uC704\uC0DD",\n        "detail": "\uC6D0\uC7AC\uB8CC\xB7\uC644\uC81C\uD488 \uAD6C\uBD84, \uC190\xB7\uB3C4\uAD6C\xB7\uC791\uC5C5\uB300 \uAD00\uB9AC, \uC9C1\uC6D0 \uAC74\uAC15 \uC0C1\uD0DC\uC640 \uAC1C\uC778\uC704\uC0DD \uD655\uC778"\n      },\n      {\n        "title": "\uC138\uCC99\xB7\uC18C\uB3C5\uACFC \uD658\uACBD",\n        "detail": "\uC138\uCC99\xB7\uC18C\uB3C5 \uC808\uCC28, \uC57D\uD488 \uBCF4\uAD00\uACFC \uC0AC\uC6A9\uAE30\uC900, \uD574\uCDA9\xB7\uD3D0\uAE30\uBB3C\xB7\uC6A9\uC218 \uAD00\uB9AC"\n      },\n      {\n        "title": "\uC0AC\uACE0 \uC758\uC2EC \uC2DC \uCD08\uAE30 \uB300\uC751",\n        "detail": "\uACE0\uAC1D \uC0C1\uD0DC\uC640 \uC0C1\uD669 \uD655\uC778, \uD574\uB2F9 \uC0C1\uD488\xB7\uACF5\uC815\uC758 \uC911\uB2E8 \uC5EC\uBD80 \uD310\uB2E8 \uBC0F \uBCF4\uACE0, \uAD00\uB828 \uC2DD\uC7AC\uB8CC\xB7\uAE30\uB85D \uBCF4\uC874"\n      },\n      {\n        "title": "\uC870\uC0AC \uD611\uC870\uC640 \uC7AC\uBC1C \uBC29\uC9C0",\n        "detail": "\uC0AC\uC2E4\uAD00\uACC4 \uC815\uB9AC, \uC9C0\uC815 \uBD80\uC11C\xB7\uAE30\uAD00 \uB300\uC751 \uC808\uCC28, \uCD94\uC815\uC73C\uB85C \uC6D0\uC778 \uB2E8\uC815 \uBC29\uC9C0, \uAC1C\uC120 \uD6C4 \uC6B4\uC601 \uD655\uC778"\n      }\n    ],\n    "practice": "\uC774\uBB3C \uB610\uB294 \uC2DD\uC911\uB3C5 \uC758\uC2EC \uC2E0\uACE0\uB97C \uBC1B\uC558\uC744 \uB54C \uCD08\uAE30 \uD589\uB3D9 \uC21C\uC11C\uC640 \uBCF4\uACE0 \uB0B4\uC6A9\uC744 \uC815\uB9AC\uD55C\uB2E4.",\n    "forms": [\n      "\uC2DD\uD488\uC548\uC804 \uC810\uAC80\uD45C",\n      "\uC628\uB3C4\xB7\uC704\uC0DD \uAE30\uB85D\uC9C0",\n      "\uC0AC\uACE0 \uCD08\uAE30 \uB300\uC751\uD45C",\n      "\uC0AC\uACE0\uBCF4\uACE0\uC11C"\n    ]\n  },\n  {\n    "id": "sv-18",\n    "number": 18,\n    "title": "\uC2DC\uC124\xB7\uC7A5\uBE44 \uBC0F \uC810\uD3EC \uD658\uACBD \uAD00\uB9AC",\n    "moduleId": "operations",\n    "objective": "\uC2DC\uC124\uACFC \uC7A5\uBE44\uC758 \uC774\uC0C1\uC744 \uC870\uAE30\uC5D0 \uBC1C\uACAC\uD558\uACE0, \uC6B4\uC601 \uC601\uD5A5\uC744 \uC904\uC774\uBA70 \uC720\uC9C0\uBCF4\uC218\uB97C \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC2DC\uC124\xB7\uC7A5\uBE44 \uAE30\uBCF8 \uC774\uD574",\n        "detail": "\uC8FC\uC694 \uC7A5\uBE44\uC758 \uC6A9\uB3C4, \uC815\uC0C1 \uC791\uB3D9 \uC0C1\uD0DC, \uC810\uD3EC \uC6B4\uC601\uACFC \uC81C\uD488 \uD488\uC9C8\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5"\n      },\n      {\n        "title": "\uC774\uC0C1 \uC9D5\uD6C4 \uD655\uC778",\n        "detail": "\uC18C\uC74C\xB7\uB204\uC218\xB7\uC628\uB3C4 \uD3B8\uCC28\xB7\uC131\uB2A5 \uC800\uD558\xB7\uD30C\uC190, \uC0AC\uC6A9 \uC911\uB2E8\uACFC \uC804\uBB38 \uC810\uAC80\uC774 \uD544\uC694\uD55C \uC9D5\uD6C4"\n      },\n      {\n        "title": "\uC608\uBC29 \uAD00\uB9AC",\n        "detail": "\uC77C\uC0C1 \uCCAD\uC18C\xB7\uC810\uAC80, \uC18C\uBAA8\uD488 \uAD50\uCCB4, \uC815\uAE30 \uC720\uC9C0\uBCF4\uC218 \uC77C\uC815\uACFC \uC774\uB825"\n      },\n      {\n        "title": "\uC218\uB9AC \uC694\uCCAD\uACFC \uACBD\uACFC \uAD00\uB9AC",\n        "detail": "\uC7A5\uBE44\uBA85\xB7\uBAA8\uB378\xB7\uC99D\uC0C1\xB7\uBC1C\uC0DD \uC2DC\uC810\xB7\uC0AC\uC9C4 \uD655\uBCF4, \uC5C5\uCCB4 \uC811\uC218, \uC77C\uC815\xB7\uBE44\uC6A9 \uC2B9\uC778\xB7\uC644\uB8CC \uD655\uC778"\n      },\n      {\n        "title": "\uACE0\uC7A5 \uC2DC \uC6B4\uC601 \uB300\uC751",\n        "detail": "\uD310\uB9E4 \uAC00\uB2A5 \uBA54\uB274, \uB300\uCCB4 \uC7A5\uBE44\xB7\uC791\uC5C5 \uBC29\uC2DD, \uACE0\uAC1D \uC548\uB0B4, \uD488\uC9C8\xB7\uC548\uC804 \uD655\uBCF4 \uC5EC\uBD80"\n      },\n      {\n        "title": "\uC810\uD3EC \uD658\uACBD",\n        "detail": "\uAC04\uD310\xB7\uC870\uBA85\xB7\uAC00\uAD6C\xB7\uB0C9\uB09C\uBC29\xB7\uD658\uAE30\xB7\uD654\uC7A5\uC2E4\xB7\uC678\uAD00, \uB178\uD6C4\uB3C4\uC640 \uBCF4\uC218 \uC6B0\uC120\uC21C\uC704"\n      }\n    ],\n    "practice": "\uC7A5\uBE44 \uACE0\uC7A5 \uC0AC\uB840\uC758 \uC811\uC218\uC11C\uC640 \uC784\uC2DC \uC6B4\uC601\uACC4\uD68D\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uC2DC\uC124\xB7\uC7A5\uBE44 \uC810\uAC80\uD45C",\n      "\uC218\uB9AC \uC694\uCCAD\uC11C",\n      "\uC720\uC9C0\uBCF4\uC218 \uC774\uB825\uD45C"\n    ]\n  },\n  {\n    "id": "sv-19",\n    "number": 19,\n    "title": "\uC2E0\uADDC\uC810 \uC624\uD508 \uBC0F \uCD08\uAE30 \uC548\uC815\uD654",\n    "moduleId": "response",\n    "objective": "\uC624\uD508 \uC900\uBE44\uB97C \uC77C\uC815\uC5D0 \uB9DE\uCDB0 \uC870\uC728\uD558\uACE0, \uCD08\uAE30 \uC6B4\uC601 \uBB38\uC81C\uB97C \uD574\uACB0\uD574 \uC548\uC815\uC801\uC778 \uC6B4\uC601\uC744 \uC9C0\uC6D0\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC624\uD508 \uC77C\uC815\uACFC \uC5ED\uD560",\n        "detail": "\uC624\uD508 \uAE30\uC900\uC77C, \uB2E8\uACC4\uBCC4 \uB9C8\uAC10\uC77C, \uC810\uD3EC\uAC1C\uBC1C\xB7\uACF5\uC0AC\xB7\uBB3C\uB958\xB7\uAD50\uC721\xB7\uC6B4\uC601 \uBD80\uC11C \uC5ED\uD560"\n      },\n      {\n        "title": "\uC2DC\uC124\uACFC \uC2DC\uC2A4\uD15C \uC900\uBE44",\n        "detail": "\uACF5\uC0AC \uC644\uB8CC \uC0C1\uD0DC, \uC7A5\uBE44\xB7\uC9D1\uAE30, POS\xB7\uACB0\uC81C\xB7\uD1B5\uC2E0, \uBA54\uB274\xB7\uAC00\uACA9 \uB4F1\uB85D, \uD544\uC694\uD55C \uC900\uBE44\uC0AC\uD56D \uD655\uC778"\n      },\n      {\n        "title": "\uC0C1\uD488\uACFC \uC778\uB825 \uC900\uBE44",\n        "detail": "\uCD08\uB3C4 \uBC1C\uC8FC, \uC785\uACE0\xB7\uBCF4\uAD00, \uC810\uC8FC\xB7\uC9C1\uC6D0 \uCC44\uC6A9 \uBC0F \uAD50\uC721, \uADFC\uBB34\uD45C\uC640 \uD3EC\uC9C0\uC158"\n      },\n      {\n        "title": "\uAC00\uC624\uD508\uACFC \uBAA8\uC758 \uC6B4\uC601",\n        "detail": "\uC8FC\uBB38\xB7\uC81C\uC870\xB7\uC81C\uACF5\xB7\uC815\uB9AC \uD750\uB984, \uD53C\uD06C\uD0C0\uC784 \uC2DC\uBBAC\uB808\uC774\uC158, \uC624\uB958\xB7\uBCD1\uBAA9\xB7\uB204\uB77D \uBCF4\uC644"\n      },\n      {\n        "title": "\uC624\uD508 \uD604\uC7A5 \uC9C0\uC6D0",\n        "detail": "\uC5ED\uD560 \uBC30\uCE58, \uB300\uAE30\xB7\uC8FC\uBB38\xB7\uD488\uC9C8\xB7\uC7AC\uACE0 \uAD00\uB9AC, \uACE0\uAC1D \uBD88\uB9CC\uACFC \uB3CC\uBC1C \uBB38\uC81C \uB300\uC751"\n      },\n      {\n        "title": "\uCD08\uAE30 \uC548\uC815\uD654",\n        "detail": "\uC77C\uBCC4 \uC2E4\uC801\xB7\uD488\uC808\xB7\uB85C\uC2A4\xB7\uC778\uB825\xB7\uACE0\uAC1D \uBC18\uC751 \uD655\uC778, \uBCF4\uC644\uAD50\uC721, \uC77C\uBC18 \uAD00\uB9AC\uB85C \uC804\uD658\uD558\uB294 \uAE30\uC900"\n      }\n    ],\n    "practice": "\uC624\uD508 \uC608\uC815 \uC810\uD3EC\uC758 \uC5ED\uC0B0 \uC77C\uC815\uD45C\uC640 \uAC00\uC624\uD508 \uC810\uAC80\uD45C\uB97C \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uC624\uD508 \uC77C\uC815\uD45C",\n      "\uBD80\uC11C\uBCC4 \uC900\uBE44\uD45C",\n      "\uAC00\uC624\uD508 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8",\n      "\uCD08\uAE30 \uC548\uC815\uD654 \uBCF4\uACE0\uC11C"\n    ]\n  },\n  {\n    "id": "sv-20",\n    "number": 20,\n    "title": "\uBCF8\uC0AC \uC815\uCC45 \uBC0F \uD504\uB85C\uC81D\uD2B8 \uC2E4\uD589",\n    "moduleId": "response",\n    "objective": "\uBCF8\uC0AC\uC5D0\uC11C \uD655\uC815\uD55C \uC815\uCC45\uACFC \uD504\uB85C\uC81D\uD2B8\uAC00 \uC810\uD3EC\uC5D0\uC11C \uC77C\uC815\uACFC \uAE30\uC900\uC5D0 \uB9DE\uAC8C \uC2E4\uD589\uB418\uB3C4\uB85D \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC2E4\uD589 \uB0B4\uC6A9 \uD574\uC11D",\n        "detail": "\uBAA9\uC801, \uB300\uC0C1 \uC810\uD3EC, \uC801\uC6A9\uC77C, \uBCC0\uACBD\uC0AC\uD56D, \uC810\uD3EC\uC5D0\uC11C \uD574\uC57C \uD560 \uD589\uB3D9 \uC815\uB9AC"\n      },\n      {\n        "title": "\uC2E4\uD589\uACC4\uD68D \uC218\uB9BD",\n        "detail": "\uB2E8\uACC4\uBCC4 \uC77C\uC815, \uB2F4\uB2F9\uC790, \uBB3C\uD488\xB7\uC2DC\uC2A4\uD15C\xB7\uAD50\uC721\xB7\uC608\uC0B0, \uC120\uD589 \uC900\uBE44\uC0AC\uD56D \uD655\uC778"\n      },\n      {\n        "title": "\uC810\uD3EC \uC548\uB0B4\uC640 \uAD50\uC721",\n        "detail": "\uC810\uC8FC \uC124\uBA85, \uC9C1\uC6D0 \uC804\uB2EC, \uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38, \uC774\uD574 \uC5EC\uBD80 \uD655\uC778"\n      },\n      {\n        "title": "\uC900\uBE44\uB3C4 \uD655\uC778",\n        "detail": "\uC7AC\uACE0\xB7\uD64D\uBCF4\uBB3C\xB7\uAC00\uACA9\xB7POS\xB7\uC778\uB825\xB7\uAD50\uC721 \uC0C1\uD0DC, \uC2E4\uD589\uC744 \uB9C9\uB294 \uC694\uC778 \uC0AC\uC804 \uD30C\uC545"\n      },\n      {\n        "title": "\uC2DC\uD589\uACFC \uC608\uC678 \uAD00\uB9AC",\n        "detail": "\uC810\uD3EC\uBCC4 \uC2E4\uD589 \uC99D\uBE59, \uB204\uB77D\xB7\uC624\uB958 \uC218\uC815, \uC608\uC678 \uC2B9\uC778 \uC694\uCCAD, \uAD00\uB828 \uBD80\uC11C \uC774\uC288 \uC5F0\uACB0"\n      },\n      {\n        "title": "\uACB0\uACFC \uD3C9\uAC00",\n        "detail": "\uC548\uB0B4\xB7\uC900\uBE44\xB7\uC2E4\uD589\xB7\uC815\uCC29 \uB2E8\uACC4 \uAD6C\uBD84, \uD604\uC7A5 \uBC18\uC751\uACFC \uC2E4\uC801, \uB2E4\uC74C \uD504\uB85C\uC81D\uD2B8 \uAC1C\uC120\uC0AC\uD56D"\n      }\n    ],\n    "practice": "\uAC00\uACA9 \uBCC0\uACBD \uB610\uB294 \uC2E0\uADDC \uC2DC\uC2A4\uD15C \uB3C4\uC785\uC744 \uC8FC\uC81C\uB85C \uC810\uD3EC\uBCC4 \uC2E4\uD589\uACC4\uD68D\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uD504\uB85C\uC81D\uD2B8 \uC2E4\uD589\uACC4\uD68D\uC11C",\n      "\uC810\uD3EC\uBCC4 \uC900\uBE44\uB3C4\uD45C",\n      "\uC2E4\uD589 \uD604\uD669\uD45C",\n      "\uC885\uB8CC \uBCF4\uACE0\uC11C"\n    ]\n  },\n  {\n    "id": "sv-21",\n    "number": 21,\n    "title": "\uAC08\uB4F1 \uBC0F \uC6B4\uC601\uAE30\uC900 \uBBF8\uC900\uC218 \uB300\uC751",\n    "moduleId": "people",\n    "objective": "\uBCF8\uC0AC\uC640 \uC810\uC8FC\uC758 \uC774\uACAC\uC744 \uC0AC\uC2E4\uACFC \uAE30\uC900\uC5D0 \uB530\uB77C \uC870\uC728\uD558\uACE0, \uBC18\uBCF5 \uBBF8\uC900\uC218 \uC0AC\uD56D\uC744 \uB2E8\uACC4\uC801\uC73C\uB85C \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uAC08\uB4F1\uC758 \uC6D0\uC778",\n        "detail": "\uC774\uD574\uAD00\uACC4\xB7\uC815\uBCF4 \uBD80\uC871\xB7\uC815\uCC45 \uD574\uC11D\xB7\uACFC\uAC70 \uC57D\uC18D\xB7\uC18C\uD1B5 \uBC29\uC2DD \uB4F1 \uC6D0\uC778 \uAD6C\uBD84"\n      },\n      {\n        "title": "\uC0AC\uC2E4\uACFC \uC7C1\uC810 \uC815\uB9AC",\n        "detail": "\uBC1C\uC0DD \uACBD\uC704, \uAD00\uB828 \uBB38\uC11C, \uB2F9\uC0AC\uC790 \uC8FC\uC7A5, \uD655\uC778 \uC0AC\uC2E4, \uD569\uC758\uB418\uC9C0 \uC54A\uC740 \uC0AC\uD56D \uAD6C\uBD84"\n      },\n      {\n        "title": "\uBBF8\uC900\uC218 \uC6D0\uC778 \uD655\uC778",\n        "detail": "\uAE30\uC900 \uBBF8\uC778\uC9C0\xB7\uC2E4\uD589 \uC5EC\uAC74 \uBD80\uC871\xB7\uD310\uB2E8 \uCC28\uC774\xB7\uC758\uB3C4\uC801 \uAC70\uBD80 \uB4F1 \uC6D0\uC778\uC5D0 \uB530\uB978 \uC811\uADFC"\n      },\n      {\n        "title": "\uC2DC\uC815 \uD611\uC758",\n        "detail": "\uAE30\uC900\uACFC \uC601\uD5A5 \uC124\uBA85, \uC810\uC8FC \uC758\uACAC \uD655\uC778, \uC9C0\uC6D0 \uAC00\uB2A5\uC0AC\uD56D, \uAC1C\uC120 \uD589\uB3D9\xB7\uAE30\uD55C \uD569\uC758"\n      },\n      {\n        "title": "\uBC18\uBCF5 \uBBF8\uC900\uC218 \uAD00\uB9AC",\n        "detail": "\uC774\uC804 \uC548\uB0B4\uC640 \uAC1C\uC120 \uC774\uB825 \uD655\uC778, \uC7AC\uBC1C \uB0B4\uC6A9 \uAE30\uB85D, \uC0AC\uB0B4 \uC808\uCC28\uC5D0 \uB530\uB978 \uC0C1\uAE09\uC790\xB7\uB2F4\uB2F9 \uBD80\uC11C \uBCF4\uACE0"\n      },\n      {\n        "title": "\uAC08\uB4F1 \uC774\uD6C4 \uAD00\uACC4 \uAD00\uB9AC",\n        "detail": "\uD569\uC758\uB0B4\uC6A9 \uD655\uC778, \uC774\uD589 \uCD94\uC801, \uD45C\uD604\uACFC \uAC10\uC815\uC758 \uD655\uB300 \uBC29\uC9C0, \uC7AC\uBC1C \uC2DC \uCC98\uB9AC \uAE30\uC900 \uACF5\uC720"\n      }\n    ],\n    "practice": "\uC9C0\uC815 \uC6D0\uC7AC\uB8CC\xB7\uC601\uC5C5\uC2DC\uAC04\xB7\uD589\uC0AC \uCC38\uC5EC \uAD00\uB828 \uAC00\uC0C1 \uAC08\uB4F1\uC744 \uC815\uB9AC\uD558\uACE0 \uB300\uC751\uC548\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uAC08\uB4F1 \uC7C1\uC810 \uC815\uB9AC\uD45C",\n      "\uBBF8\uC900\uC218 \uAE30\uB85D\uD45C",\n      "\uC2DC\uC815 \uD611\uC758\uC11C",\n      "\uC0C1\uAE09\uC790 \uBCF4\uACE0\uC11C"\n    ]\n  },\n  {\n    "id": "sv-22",\n    "number": 22,\n    "title": "\uBD80\uC9C4\xB7\uC704\uAE30 \uC810\uD3EC \uBC0F \uD3D0\uC810 \uC9D5\uD6C4 \uAD00\uB9AC",\n    "moduleId": "response",\n    "objective": "\uC6B4\uC601 \uC9C0\uC18D\uC774 \uC5B4\uB824\uC6CC\uC9C0\uB294 \uC9D5\uD6C4\uB97C \uC870\uAE30\uC5D0 \uBC1C\uACAC\uD558\uACE0, \uC9C0\uC6D0\xB7\uD68C\uBCF5\xB7\uC885\uB8CC \uAC80\uD1A0\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC5F0\uACB0\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uC704\uAE30 \uC9D5\uD6C4 \uD30C\uC545",\n        "detail": "\uC9C0\uC18D \uC801\uC790, \uBC1C\uC8FC \uAC10\uC18C, \uBBF8\uC218\uAE08, \uC601\uC5C5\uC2DC\uAC04 \uCD95\uC18C, \uC778\uB825 \uC774\uD0C8, \uC810\uC8FC \uC5F0\uB77D \uB450\uC808\xB7\uC758\uC695 \uC800\uD558"\n      },\n      {\n        "title": "\uC704\uD5D8 \uC218\uC900 \uD310\uB2E8",\n        "detail": "\uC77C\uC2DC\uC801 \uC790\uAE08 \uBD80\uC871\uACFC \uAD6C\uC870\uC801 \uC801\uC790, \uC810\uC8FC \uC6B4\uC601 \uC758\uC9C0, \uC11C\uBE44\uC2A4\xB7\uC548\uC804\xB7\uBE0C\uB79C\uB4DC \uC601\uD5A5"\n      },\n      {\n        "title": "\uC6B4\uC601 \uC9C0\uC18D \uAC00\uB2A5\uC131 \uD655\uC778",\n        "detail": "\uC190\uC775\uACFC \uD604\uAE08 \uBD80\uC871, \uC8FC\uC694 \uC9C0\uAE09 \uC77C\uC815, \uC810\uC8FC\uAC00 \uC81C\uACF5\uD55C \uC790\uB8CC\uC758 \uBC94\uC704, \uD68C\uBCF5\uC5D0 \uD544\uC694\uD55C \uC870\uAC74"\n      },\n      {\n        "title": "\uC9C0\uC6D0\uBC29\uC548 \uAC80\uD1A0",\n        "detail": "\uC6B4\uC601 \uAC1C\uC120\xB7\uAD50\uC721\xB7\uD310\uCD09\xB7\uC2DC\uC124 \uB4F1 \uAC00\uB2A5\uD55C \uC9C0\uC6D0, \uBE44\uC6A9\uACFC \uD6A8\uACFC, \uC2B9\uC778 \uBC94\uC704"\n      },\n      {\n        "title": "\uBD80\uC11C \uACF5\uB3D9 \uB300\uC751",\n        "detail": "\uC6B4\uC601\xB7\uC7AC\uBB34\xB7\uBB3C\uB958\xB7\uAC1C\uBC1C\xB7\uACC4\uC57D \uB2F4\uB2F9\uC758 \uC5ED\uD560, \uACF5\uD1B5 \uD604\uD669\uACFC \uB300\uC751 \uC77C\uC815 \uAD00\uB9AC"\n      },\n      {\n        "title": "\uD68C\uBCF5 \uB610\uB294 \uC885\uB8CC \uAC80\uD1A0 \uC9C0\uC6D0",\n        "detail": "\uD68C\uBCF5 \uBAA9\uD45C\uC640 \uC810\uAC80 \uC2DC\uC810, \uAC1C\uC120 \uBBF8\uB2EC \uC2DC \uC7AC\uAC80\uD1A0, \uD3D0\uC810 \uC758\uC0AC \uD30C\uC545, \uAD8C\uD55C \uC788\uB294 \uBD80\uC11C\uB85C \uC778\uACC4"\n      }\n    ],\n    "practice": "\uC704\uAE30 \uC9D5\uD6C4\uAC00 \uC788\uB294 \uC810\uD3EC\uC758 \uC704\uD5D8 \uC218\uC900\uC744 \uBD84\uB958\uD558\uACE0 \uACF5\uB3D9 \uB300\uC751\uACC4\uD68D\uC744 \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uC704\uAE30 \uC9D5\uD6C4 \uC810\uAC80\uD45C",\n      "\uC704\uD5D8 \uC810\uD3EC \uAD00\uB9AC\uB300\uC7A5",\n      "\uD68C\uBCF5\uACC4\uD68D\uC11C",\n      "\uBD80\uC11C \uC778\uACC4\uC11C"\n    ]\n  },\n  {\n    "id": "sv-23",\n    "number": 23,\n    "title": "\uBCF4\uACE0\uC11C \uC791\uC131 \uBC0F \uB370\uC774\uD130 \uAD00\uB9AC",\n    "moduleId": "management",\n    "objective": "\uC758\uC0AC\uACB0\uC815\uACFC \uD6C4\uC18D \uC2E4\uD589\uC5D0 \uD544\uC694\uD55C \uBCF4\uACE0\uC11C\uB97C \uC791\uC131\uD558\uACE0, \uC810\uD3EC \uC774\uB825\uC744 \uC815\uD655\uD558\uAC8C \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uBCF4\uACE0 \uBAA9\uC801\uACFC \uB300\uC0C1",\n        "detail": "\uC815\uAE30\xB7\uBC29\uBB38\xB7\uC774\uC288\xB7\uAE34\uAE09 \uBCF4\uACE0\uC758 \uCC28\uC774, \uBCF4\uACE0\uBC1B\uB294 \uC0AC\uB78C\uC774 \uACB0\uC815\uD574\uC57C \uD560 \uC0AC\uD56D"\n      },\n      {\n        "title": "\uBCF4\uACE0\uC11C\uC758 \uAD6C\uC870",\n        "detail": "\uD575\uC2EC \uACB0\uB860, \uD604\uD669, \uADFC\uAC70, \uC6D0\uC778, \uC870\uCE58, \uC694\uCCAD\uC0AC\uD56D, \uB2F4\uB2F9\uC790\uC640 \uAE30\uD55C"\n      },\n      {\n        "title": "\uAC1D\uAD00\uC801\uC778 \uAE30\uB85D",\n        "detail": "\uC0AC\uC2E4\xB7\uC758\uACAC\xB7\uCD94\uC815 \uAD6C\uBD84, \uC218\uCE58\uC758 \uB2E8\uC704\xB7\uAE30\uAC04\xB7\uCD9C\uCC98, \uC0AC\uC9C4\uC758 \uC2DC\uC810\uACFC \uC124\uBA85"\n      },\n      {\n        "title": "\uBCF4\uACE0\uC11C \uC720\uD615\uBCC4 \uC791\uC131",\n        "detail": "\uBC29\uBB38\uBCF4\uACE0\uC11C\xB7\uC774\uC288\uBCF4\uACE0\uC11C\xB7\uAC1C\uC120\uACC4\uD68D\uC11C\xB7\uC131\uACFC\uBCF4\uACE0\uC11C\uBCC4 \uD544\uC218 \uD56D\uBAA9"\n      },\n      {\n        "title": "\uC810\uD3EC \uB370\uC774\uD130\uC640 \uC774\uB825",\n        "detail": "\uC810\uD3EC\uBCC4 \uAE30\uBCF8\uC815\uBCF4, \uC810\uAC80\xB7\uB9E4\uCD9C\xB7\uAD50\uC721\xB7\uBD88\uB9CC\xB7\uC57D\uC18D \uC774\uB825, \uB3D9\uC77C \uD56D\uBAA9\uC758 \uC785\uB825 \uAE30\uC900"\n      },\n      {\n        "title": "\uC790\uB8CC \uD488\uC9C8\uACFC \uC811\uADFC \uAD00\uB9AC",\n        "detail": "\uB204\uB77D\xB7\uC911\uBCF5\xB7\uC624\uC785\uB825, \uD30C\uC77C\uBA85\xB7\uBC84\uC804\xB7\uC800\uC7A5 \uC704\uCE58, \uC218\uC815 \uC774\uB825, \uC5C5\uBB34\uC5D0 \uD544\uC694\uD55C \uC811\uADFC \uBC94\uC704"\n      }\n    ],\n    "practice": "\uBAA8\uD638\uD55C \uBC29\uBB38\uBCF4\uACE0\uC11C\uB97C \uACE0\uCCD0 \uC4F0\uACE0, \uC5EC\uB7EC \uAE30\uB85D\uC5D0\uC11C \uC810\uD3EC \uC774\uB825\uC744 \uC815\uB9AC\uD55C\uB2E4.",\n    "forms": [\n      "\uBCF4\uACE0\uC11C \uD45C\uC900 \uC11C\uC2DD",\n      "\uC810\uD3EC \uC774\uB825\uCE74\uB4DC",\n      "\uB370\uC774\uD130 \uC785\uB825 \uAE30\uC900\uC11C"\n    ]\n  },\n  {\n    "id": "sv-24",\n    "number": 24,\n    "title": "\uB2F4\uB2F9 \uC810\uD3EC \uBC0F \uAC1C\uC778 \uC5C5\uBB34 \uAD00\uB9AC",\n    "moduleId": "management",\n    "objective": "\uB2F4\uB2F9 \uC810\uD3EC\uC758 \uC704\uD5D8\uB3C4\uC640 \uC5C5\uBB34 \uC911\uC694\uB3C4\uC5D0 \uB530\uB77C \uC2DC\uAC04\uC744 \uBC30\uBD84\uD558\uACE0, \uBBF8\uACB0\uC0AC\uD56D\uC744 \uB05D\uAE4C\uC9C0 \uAD00\uB9AC\uD55C\uB2E4.",\n    "topics": [\n      {\n        "title": "\uB2F4\uB2F9 \uC810\uD3EC \uBD84\uB958",\n        "detail": "\uC2E0\uADDC\xB7\uC548\uC815\xB7\uC131\uC7A5\xB7\uBD80\uC9C4\xB7\uC704\uAE30 \uB4F1 \uC810\uD3EC \uC0C1\uD0DC, \uD575\uC2EC \uACFC\uC81C\uC640 \uAD00\uB9AC \uAC15\uB3C4 \uC124\uC815"\n      },\n      {\n        "title": "\uBC29\uBB38 \uC8FC\uAE30\uC640 \uC811\uCD09 \uBC29\uC2DD",\n        "detail": "\uC810\uD3EC \uC0C1\uD0DC\uBCC4 \uBC29\uBB38\xB7\uC804\uD654\xB7\uC628\uB77C\uC778 \uD655\uC778 \uC870\uD569, \uC815\uAE30 \uAD00\uB9AC\uC640 \uC774\uC288 \uB300\uC751\uC758 \uADE0\uD615"\n      },\n      {\n        "title": "\uC77C\uC815\uACFC \uC774\uB3D9 \uB3D9\uC120",\n        "detail": "\uC9C0\uC5ED\xB7\uC774\uB3D9\uC2DC\uAC04\xB7\uC810\uC8FC \uBA74\uB2F4 \uAC00\uB2A5\uC2DC\uAC04\xB7\uD53C\uD06C\uD0C0\uC784\uC744 \uACE0\uB824\uD55C \uC8FC\uAC04 \uACC4\uD68D"\n      },\n      {\n        "title": "\uC5C5\uBB34 \uC6B0\uC120\uC21C\uC704",\n        "detail": "\uAE34\uAE09\uC131\uACFC \uC601\uD5A5\uB3C4, \uB9C8\uAC10\uC77C, \uC120\uD589 \uC5C5\uBB34, \uC9C1\uC811 \uCC98\uB9AC\xB7\uD611\uC5C5\xB7\uC0C1\uAE09\uC790 \uC694\uCCAD \uAD6C\uBD84"\n      },\n      {\n        "title": "\uAE34\uAE09\uC5C5\uBB34\uC640 \uACC4\uD68D \uC870\uC815",\n        "detail": "\uC0AC\uACE0\xB7\uACE0\uC7A5\xB7\uACB0\uC6D0 \uBC1C\uC0DD \uC2DC \uAE30\uC874 \uC77C\uC815 \uC870\uC815, \uAD00\uACC4\uC790 \uC548\uB0B4, \uB204\uB77D \uC5C5\uBB34 \uC7AC\uBC30\uCE58"\n      },\n      {\n        "title": "\uBBF8\uACB0\uC0AC\uD56D\uACFC \uC790\uAE30 \uC810\uAC80",\n        "detail": "\uB2F4\uB2F9\uC790\xB7\uAE30\uD55C\xB7\uB2E4\uC74C \uD589\uB3D9\xB7\uC644\uB8CC \uC99D\uBE59 \uAD00\uB9AC, \uC7A5\uAE30 \uBBF8\uACB0 \uC6D0\uC778, \uC8FC\uAC04 \uD68C\uACE0\uC640 \uC5C5\uBB34 \uC778\uC218\uC778\uACC4"\n      }\n    ],\n    "practice": "\uB2F4\uB2F9 \uC810\uD3EC 15\uAC1C\uC758 \uD604\uD669\uACFC \uB3CC\uBC1C \uC774\uC288\uB97C \uBCF4\uACE0 \uC8FC\uAC04 \uC77C\uC815\xB7\uBC29\uBB38 \uB3D9\uC120\xB7\uBBF8\uACB0 \uAD00\uB9AC\uD45C\uB97C \uC791\uC131\uD55C\uB2E4.",\n    "forms": [\n      "\uC810\uD3EC\uBCC4 \uAD00\uB9AC\uACC4\uD68D\uD45C",\n      "\uC8FC\uAC04 \uC77C\uC815\uD45C",\n      "\uC5C5\uBB34 \uC6B0\uC120\uC21C\uC704\uD45C",\n      "\uBBF8\uACB0\uC0AC\uD56D \uAD00\uB9AC\uB300\uC7A5"\n    ]\n  }\n];\n', "lesson-content.js": "// \uACFC\uC815\uBCC4 60\uBD84 \uAD50\uC218\uC548. \uBE0C\uB79C\uB4DC \uACE0\uC720 \uC218\uCE58\xB7\uC2B9\uC778 \uAE30\uC900\uC740 \uC2E4\uC81C \uC6B4\uC601 \uBB38\uC11C\uB85C \uB300\uCCB4\uD55C\uB2E4.\nconst lessonContent = {\n  1: {\n    scenario: '\uC810\uC2EC \uD53C\uD06C \uB4A4 \uAC1D\uC11D\uC740 \uC815\uB3C8\uB418\uC5B4 \uC788\uC9C0\uB9CC, \uC81C\uC870\uB300\uC758 \uC18C\uC2A4 \uC6A9\uAE30\uC5D0\uB294 \uAC1C\uBD09\uC77C \uD45C\uC2DC\uAC00 \uC5C6\uACE0 \uBC30\uB2EC \uC8FC\uBB38 \uD55C \uAC74\uC758 \uAD6C\uC131\uD488\uC774 \uBE60\uC84C\uB2E4.',\n    teaching: [\n      'QSC\uB294 \uC810\uC218\uB97C \uB9E4\uAE30\uB294 \uD589\uC704\uBCF4\uB2E4 \uACE0\uAC1D\uC774 \uC5B4\uB290 \uC810\uD3EC\uC5D0 \uAC00\uB3C4 \uAC19\uC740 \uACBD\uD5D8\uC744 \uC5BB\uB3C4\uB85D \uB9CC\uB4DC\uB294 \uAD00\uB9AC \uCCB4\uACC4\uB2E4. \uBE0C\uB79C\uB4DC \uB9E4\uB274\uC5BC\uC758 \uBB38\uC7A5\uACFC \uC0AC\uC9C4\uC744 \uD310\uC815 \uADFC\uAC70\uB85C \uC0BC\uACE0, \uAC1C\uC778 \uCDE8\uD5A5\uC774\uB098 \uB2E4\uB978 \uBE0C\uB79C\uB4DC\uC758 \uAE30\uC900\uC744 \uC11E\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uD488\uC9C8\uC740 \uC644\uC131\uD488\uB9CC \uBCF4\uC9C0 \uC54A\uB294\uB2E4. \uC785\uACE0 \uC0C1\uD0DC\uC640 \uBCF4\uAD00, \uACC4\uB7C9, \uC81C\uC870 \uC21C\uC11C, \uC81C\uACF5 \uC9C1\uC804 \uD655\uC778\uAE4C\uC9C0 \uB530\uB77C\uAC00\uBA70 \uD3B8\uCC28\uAC00 \uC0DD\uAE34 \uC9C0\uC810\uC744 \uCC3E\uB294\uB2E4. \uC608\uB97C \uB4E4\uC5B4 \uC81C\uACF5\uB7C9\uC774 \uC801\uB2E4\uBA74 \uC870\uB9AC\uC790\uC758 \uC190\uAC10\uAC01\uBCF4\uB2E4 \uACC4\uB7C9 \uB3C4\uAD6C \uC0AC\uC6A9 \uC5EC\uBD80\uB97C \uBA3C\uC800 \uD655\uC778\uD55C\uB2E4.',\n      '\uC11C\uBE44\uC2A4\uB294 \uC778\uC0AC \uD55C \uC7A5\uBA74\uC774 \uC544\uB2C8\uB77C \uC8FC\uBB38\uBD80\uD130 \uC81C\uD488 \uC804\uB2EC\uACFC \uBB38\uC81C \uC751\uB300\uAE4C\uC9C0\uC758 \uD750\uB984\uC774\uB2E4. \uD53C\uD06C\uD0C0\uC784\uC5D0 \uC2E4\uC81C \uC8FC\uBB38\uC744 \uAD00\uCC30\uD558\uBA70 \uB300\uAE30 \uBC1C\uC0DD \uC9C0\uC810, \uC8FC\uBB38 \uC7AC\uD655\uC778, \uB204\uB77D \uD655\uC778 \uC808\uCC28\uB97C \uB530\uB85C \uAE30\uB85D\uD55C\uB2E4.',\n      '\uCCAD\uACB0\uC740 \uB208\uC5D0 \uC798 \uB744\uB294 \uAC1D\uC11D\uACFC \uD568\uAED8 \uC8FC\uBC29\uC758 \uC811\uCD09\uBA74, \uB3C4\uAD6C, \uCC3D\uACE0, \uD654\uC7A5\uC2E4\uC744 \uBCF8\uB2E4. \uC624\uC5FC\uC744 \uBC1C\uACAC\uD558\uBA74 \uC0AC\uC9C4\uB9CC \uB0A8\uAE30\uC9C0 \uB9D0\uACE0 \uB9C8\uC9C0\uB9C9 \uCCAD\uC18C \uC2DC\uAC01, \uB2F4\uB2F9\uC790, \uC7AC\uC624\uC5FC \uC6D0\uC778\uC744 \uBB3C\uC5B4 \uBC18\uBCF5 \uC5EC\uBD80\uB97C \uD310\uB2E8\uD55C\uB2E4.',\n      '\uD3C9\uAC00\uD45C\uC5D0\uB294 \uAD00\uCC30\uD55C \uC0AC\uC2E4\uACFC \uC801\uC6A9 \uAE30\uC900\uC744 \uD55C \uC30D\uC73C\uB85C \uC801\uB294\uB2E4. \u201C\uC9C0\uC800\uBD84\uD568\u201D \uB300\uC2E0 \u201C\uC81C\uC870\uB300 \uC190\uC7A1\uC774\uC5D0 \uC794\uC5EC\uBB3C, \uB9C8\uAC10 \uCCAD\uC18C\uD45C \uBBF8\uAE30\uB85D\u201D\uCC98\uB7FC \uC7AC\uD604 \uAC00\uB2A5\uD55C \uD45C\uD604\uC744 \uC4F0\uACE0, \uBBF8\uB2EC \uC6D0\uC778\uC744 \uC9C0\uC2DD\xB7\uC219\uB828\xB7\uC2DC\uAC04\xB7\uC7A5\uBE44\uB85C \uB098\uB208\uB2E4.',\n      '\uC548\uC804 \uB610\uB294 \uC989\uC2DC \uAC1C\uC120\uC774 \uD544\uC694\uD55C \uD56D\uBAA9\uC740 \uD604\uC7A5\uC5D0\uC11C \uC870\uCE58\uD558\uACE0, \uAD6C\uC870\uC801 \uBB38\uC81C\uB294 \uB2F4\uB2F9\uC790\uC640 \uAE30\uD55C\uC744 \uC815\uD55C\uB2E4. \uC7AC\uC810\uAC80\uC5D0\uC11C\uB294 \uC0AC\uC9C4 \uD55C \uC7A5\uBCF4\uB2E4 \uAC19\uC740 \uC870\uAC74\uC5D0\uC11C \uAE30\uC900\uC774 \uBC18\uBCF5\uD574\uC11C \uC9C0\uCF1C\uC9C0\uB294\uC9C0 \uD655\uC778\uD55C\uB2E4.'\n    ],\n    task: ['\uC7A5\uBA74\uC5D0\uC11C Q\xB7S\xB7C\uBCC4 \uC0AC\uC2E4\uC744 \uAC01\uAC01 1\uAC1C \uC774\uC0C1 \uC801\uACE0 \uAE30\uC900 \uBB38\uAD6C\uB97C \uC5F0\uACB0\uD55C\uB2E4.', '\uACE0\uAC1D \uC601\uD5A5\uACFC \uC7AC\uBC1C \uAC00\uB2A5\uC131\uC73C\uB85C \uC6B0\uC120\uC21C\uC704\uB97C \uC815\uD558\uACE0 \uC989\uC2DC \uC870\uCE58\uC640 \uACC4\uD68D \uAC1C\uC120\uC744 \uB098\uB208\uB2E4.', '\uB2F4\uB2F9\uC790\xB7\uC644\uB8CC \uAE30\uD55C\xB7\uD655\uC778 \uBC29\uBC95\uC744 \uB123\uC740 \uAC1C\uC120\uC870\uCE58\uD45C\uB97C \uC791\uC131\uD55C\uB2E4.'],\n    check: [['\uAD00\uCC30\uACFC \uCD94\uC815\uC744 \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uB098\uC694?', '\uAD00\uCC30\uC740 \uD655\uC778\uD55C \uD589\uB3D9\xB7\uC0C1\uD0DC\xB7\uC2DC\uAC01\uC73C\uB85C \uC801\uACE0, \uC6D0\uC778\uC740 \uBA74\uB2F4\uACFC \uAE30\uB85D\uC73C\uB85C \uAC80\uC99D\uD560 \uAC00\uC124\uB85C \uB0A8\uAE34\uB2E4.'], ['\uC7AC\uC810\uAC80\uC5D0\uC11C \uBB34\uC5C7\uC744 \uD655\uC778\uD558\uB098\uC694?', '\uC870\uCE58 \uC0AC\uC2E4\uBFD0 \uC544\uB2C8\uB77C \uB3D9\uC77C \uC870\uAC74\uC5D0\uC11C \uAE30\uC900\uC774 \uC9C0\uC18D\uB418\uB294\uC9C0 \uD655\uC778\uD55C\uB2E4.']]\n  },\n  2: {\n    scenario: '\uC9C0\uB09C \uBC29\uBB38 \uB54C \uC57D\uC18D\uD55C \uC7AC\uACE0 \uC2E4\uC0AC\uAC00 \uBBF8\uC644\uB8CC\uC774\uACE0 \uCD5C\uADFC \uC8FC\uBB38 \uB204\uB77D \uBD88\uB9CC\uC774 \uB298\uC5B4\uB09C \uC810\uD3EC\uC5D0 \uBC29\uBB38\uD55C\uB2E4.',\n    teaching: [\n      '\uC815\uAE30 \uC810\uAC80\uC740 \uC6B4\uC601 \uC804\uBC18\uC758 \uAE30\uC900 \uC720\uC9C0, \uD14C\uB9C8 \uC810\uAC80\uC740 \uD2B9\uC815 \uC8FC\uC81C, \uC774\uC288 \uC810\uAC80\uC740 \uC0C8\uB85C \uBC1C\uC0DD\uD55C \uBB38\uC81C, \uD6C4\uC18D \uC810\uAC80\uC740 \uC774\uC804 \uACFC\uC81C\uC758 \uC644\uB8CC \uC5EC\uBD80\uAC00 \uBAA9\uC801\uC774\uB2E4. \uD55C \uBC88\uC758 \uBC29\uBB38\uC5D0 \uBAA8\uB4E0 \uBB38\uC81C\uB97C \uD574\uACB0\uD558\uB824 \uD558\uC9C0 \uB9D0\uACE0 \uD575\uC2EC \uC9C8\uBB38\uC744 \uBA3C\uC800 \uC815\uD55C\uB2E4.',\n      '\uBC29\uBB38 \uC804 \uCD5C\uADFC \uB9E4\uCD9C, \uC774\uC804 \uBCF4\uACE0\uC11C, \uBBF8\uC644\uB8CC \uC57D\uC18D, \uACE0\uAC1D \uC758\uACAC, \uBCF8\uC0AC \uBCC0\uACBD \uACF5\uC9C0\uB97C \uD55C \uC7A5\uC73C\uB85C \uC694\uC57D\uD55C\uB2E4. \uC810\uC8FC\uAC00 \uC694\uCCAD\uD55C \uC9C0\uC6D0\uB3C4 \uD568\uAED8 \uC801\uC5B4 \uC810\uAC80\uC774 \uC77C\uBC29\uC801\uC778 \uAC80\uC0AC\uB85C \uB05D\uB098\uC9C0 \uC54A\uAC8C \uD55C\uB2E4.',\n      '\uD53C\uD06C \uC2DC\uAC04\uC5D0\uB294 \uACE0\uAC1D \uC751\uB300\uC640 \uC81C\uC870\uB97C \uAD00\uCC30\uD558\uACE0, \uD55C\uAC00\uD55C \uC2DC\uAC04\uC5D0\uB294 \uAE30\uB85D \uB300\uC870\uC640 \uBA74\uB2F4\uC744 \uBC30\uCE58\uD55C\uB2E4. \uAD00\uCC30 \uC21C\uC11C\uC640 \uD544\uC694\uD55C \uC790\uB8CC\uB97C \uBBF8\uB9AC \uC815\uD574 \uC810\uD3EC \uC6B4\uC601\uC744 \uBD88\uD544\uC694\uD558\uAC8C \uBC29\uD574\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC678\uBD80\uC5D0\uC11C \uC8FC\uBC29\uACFC \uCC3D\uACE0\uB85C \uC774\uC5B4\uC9C0\uB294 \uB3D9\uC120\uC5D0\uC11C \uB208\uC5D0 \uBCF4\uC774\uB294 \uC0C1\uD0DC, \uC9C1\uC6D0 \uD589\uB3D9, \uC2DC\uC2A4\uD15C \uAE30\uB85D\uC744 \uAD50\uCC28 \uD655\uC778\uD55C\uB2E4. \u201C\uC9C1\uC6D0\uC774 \uB290\uB9AC\uB2E4\u201D \uAC19\uC740 \uD574\uC11D\uC740 \uAE30\uB85D\uD558\uC9C0 \uC54A\uACE0 \uC8FC\uBB38 \uC2DC\uAC01\uACFC \uC81C\uACF5 \uC2DC\uAC01 \uB4F1 \uD655\uC778\uD55C \uC0AC\uC2E4\uC744 \uB0A8\uAE34\uB2E4.',\n      '\uBA74\uB2F4\uC740 \uC798\uB41C \uC810\uC744 \uBA3C\uC800 \uD655\uC778\uD55C \uB4A4 \uBBF8\uB2EC \uC0AC\uC2E4\uACFC \uACE0\uAC1D \uC601\uD5A5\uC744 \uC124\uBA85\uD55C\uB2E4. \uC810\uC8FC\uC758 \uC0AC\uC815\uC744 \uB4E3\uACE0 \uC2E4\uD589 \uAC00\uB2A5\uD55C \uACFC\uC81C \uB450\uC138 \uAC1C\uB85C \uC881\uD600 \uB2F4\uB2F9\uC790\uC640 \uAE30\uD55C\uC744 \uD569\uC758\uD55C\uB2E4.',\n      '\uBC29\uBB38 \uC9C1\uD6C4 \uC0AC\uC2E4\xB7\uD569\uC758\xB7\uC9C0\uC6D0 \uC694\uCCAD\uC744 \uBD84\uB9AC\uD574 \uBCF4\uACE0\uD55C\uB2E4. \uAE30\uD55C\uC774 \uC9C0\uB09C \uACFC\uC81C\uB294 \uBBF8\uC644\uB8CC \uC0AC\uC720\uB97C \uD655\uC778\uD558\uACE0, \uC99D\uBE59\uC774 \uCDA9\uBD84\uD558\uC9C0 \uC54A\uC73C\uBA74 \uC644\uB8CC\uB85C \uB2EB\uC9C0 \uC54A\uB294\uB2E4.'\n    ],\n    task: ['\uBC29\uBB38 \uBAA9\uC801\uACFC \uD53C\uD06C \uAD00\uCC30\xB7\uBA74\uB2F4 \uC2DC\uAC04\uC744 \uD3EC\uD568\uD55C 40\uBD84 \uBC29\uBB38 \uACC4\uD68D\uC744 \uC138\uC6B4\uB2E4.', '\uC810\uAC80 \uACB0\uACFC 3\uAC1C\uB97C \uC0AC\uC2E4 \uBB38\uC7A5\uC73C\uB85C \uAE30\uB85D\uD558\uACE0 \uC810\uC8FC\uC5D0\uAC8C \uD655\uC778\uD560 \uC9C8\uBB38\uC744 \uC4F4\uB2E4.', '\uBBF8\uC644\uB8CC \uC7AC\uACE0 \uC2E4\uC0AC\uC640 \uC8FC\uBB38 \uB204\uB77D\uC758 \uD6C4\uC18D \uC870\uCE58\uB97C \uB2F4\uB2F9\uC790\xB7\uAE30\uD55C\xB7\uC99D\uBE59\uC73C\uB85C \uC815\uB9AC\uD55C\uB2E4.'],\n    check: [['\uC815\uAE30 \uC810\uAC80\uACFC \uD6C4\uC18D \uC810\uAC80\uC758 \uCC28\uC774\uB294?', '\uC804\uC790\uB294 \uC6B4\uC601 \uC804\uBC18\uC758 \uAE30\uC900 \uD655\uC778, \uD6C4\uC790\uB294 \uC774\uC804 \uACFC\uC81C\uC758 \uC2E4\uD589\uACFC \uD6A8\uACFC \uD655\uC778\uC5D0 \uCD08\uC810\uC744 \uB454\uB2E4.'], ['\uBCF4\uACE0\uC11C\uC5D0\uC11C \uC0AC\uC2E4\uACFC \uC758\uACAC\uC744 \uC5B4\uB5BB\uAC8C \uC801\uB098\uC694?', '\uAD00\uCC30\xB7\uC790\uB8CC\uB294 \uC0AC\uC2E4\uB85C, \uC6D0\uC778 \uD574\uC11D\uACFC \uC81C\uC548\uC740 \uBCC4\uB3C4 \uD56D\uBAA9\uC73C\uB85C \uC801\uB294\uB2E4.']]\n  },\n  3: {\n    scenario: '\uC810\uC8FC\uAC00 \u201C\uB9E4\uCD9C\uB3C4 \uB0AE\uC740\uB370 \uBCF8\uC0AC\uB294 \uD589\uC0AC\uB9CC \uD558\uB77C\uACE0 \uD55C\uB2E4\u201D\uACE0 \uB9D0\uD558\uBA70 \uBA74\uB2F4\uC744 \uC911\uB2E8\uD558\uB824 \uD55C\uB2E4.',\n    teaching: [\n      '\uC810\uC8FC\uB294 \uB9E4\uCD9C\uB9CC\uC774 \uC544\uB2C8\uB77C \uC778\uAC74\uBE44, \uD22C\uC790 \uD68C\uC218, \uC77C\uC0C1 \uC6B4\uC601\uC758 \uBD80\uB2F4\uC744 \uB3D9\uC2DC\uC5D0 \uAC10\uB2F9\uD55C\uB2E4. \uBA3C\uC800 \uC5B4\uB5A4 \uBE44\uC6A9\uACFC \uC791\uC5C5\uC774 \uBD80\uB2F4\uC778\uC9C0 \uD655\uC778\uD574\uC57C \uBCF8\uC0AC \uC815\uCC45\uC744 \uC2E4\uC81C \uC6B4\uC601 \uC5B8\uC5B4\uB85C \uC124\uBA85\uD560 \uC218 \uC788\uB2E4.',\n      '\uC2E0\uADDC \uC810\uC8FC\uB294 \uAE30\uBCF8 \uC808\uCC28\uC758 \uBD88\uD655\uC2E4\uC131, \uC7A5\uAE30 \uC6B4\uC601 \uC810\uC8FC\uB294 \uACFC\uAC70 \uACBD\uD5D8\uACFC \uC815\uCC45 \uBCC0\uD654\uC5D0 \uBBFC\uAC10\uD560 \uC218 \uC788\uB2E4. \uC9C1\uC811 \uC6B4\uC601\uC778\uC9C0 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uC704\uC784\uD588\uB294\uC9C0\uB3C4 \uD655\uC778\uD574 \uC758\uC0AC\uACB0\uC815\uC790\uC640 \uC2E4\uD589\uC790\uB97C \uAD6C\uBD84\uD55C\uB2E4.',\n      '\uBC18\uBC15 \uC804\uC5D0 \u201C\uC5B4\uB5A4 \uC2DC\uAC04\uB300\uC640 \uC0C1\uD488\uC5D0\uC11C \uBD80\uB2F4\uC774 \uCEF8\uB098\uC694?\u201D\uCC98\uB7FC \uC5F4\uB9B0 \uC9C8\uBB38\uC744 \uC4F4\uB2E4. \uC810\uC8FC\uC758 \uAC10\uC815, \uD655\uC778 \uAC00\uB2A5\uD55C \uC0AC\uC2E4, \uC694\uCCAD\uD55C \uC9C0\uC6D0\uC744 \uAC01\uAC01 \uBA54\uBAA8\uD558\uACE0 \uC790\uC2E0\uC758 \uB9D0\uB85C \uC694\uC57D\uD574 \uB9DE\uB294\uC9C0 \uD655\uC778\uD55C\uB2E4.',\n      '\uC124\uBA85\uC740 \uD604\uC7AC \uC218\uCE58\uC640 \uD604\uC7A5 \uAD00\uCC30, \uC81C\uC548, \uC608\uC0C1 \uD6A8\uACFC, \uD544\uC694\uD55C \uC791\uC5C5 \uC21C\uC73C\uB85C \uD55C\uB2E4. \uD655\uC2E4\uD558\uC9C0 \uC54A\uC740 \uD6A8\uACFC\uB97C \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uACE0 \uBE44\uC6A9\uACFC \uC778\uB825 \uBD80\uB2F4\uC774 \uB2E4\uB978 \uB300\uC548\uC744 \uB450 \uAC1C \uC774\uC0C1 \uC81C\uC2DC\uD55C\uB2E4.',\n      '\uC5B4\uB824\uC6B4 \uD53C\uB4DC\uBC31\uC5D0\uC11C\uB294 \uC0AC\uB78C\uC758 \uC131\uACA9 \uB300\uC2E0 \uAD00\uCC30\uB41C \uD589\uB3D9\uACFC \uADF8 \uC601\uD5A5\uC744 \uB9D0\uD55C\uB2E4. \uAC10\uC815\uC774 \uACA9\uD574\uC9C0\uBA74 \uB17C\uC7C1\uC744 \uBA48\uCD94\uACE0 \uD569\uC758\uB41C \uC0AC\uC2E4\uACFC \uCD94\uAC00 \uD655\uC778 \uD56D\uBAA9\uC744 \uC815\uB9AC\uD574 \uB2E4\uC74C \uB300\uD654 \uC2DC\uC810\uC744 \uC7A1\uB294\uB2E4.',\n      '\uC804\uD654\uB098 \uBA54\uC2E0\uC800\uC5D0\uC11C \uC989\uB2F5\uC774 \uC5B4\uB824\uC6B4 \uC694\uCCAD\uC740 \uD655\uC778 \uB2F4\uB2F9\uACFC \uB2F5\uBCC0 \uC608\uC815 \uC2DC\uAC01\uC744 \uC54C\uB824\uC900\uB2E4. \uBA74\uB2F4 \uD6C4 \uC57D\uC18D\uC744 \uAE30\uB85D\uD558\uACE0 \uC9C0\uC5F0\uB418\uBA74 \uBA3C\uC800 \uC9C4\uD589 \uC0C1\uD669\uC744 \uACF5\uC720\uD55C\uB2E4.'\n    ],\n    task: ['\uC810\uC8FC\uC758 \uBC1C\uC5B8\uC5D0\uC11C \uAC10\uC815\xB7\uC0AC\uC2E4\xB7\uC694\uAD6C\uB97C \uBD84\uB9AC\uD574 \uAE30\uB85D\uD55C\uB2E4.', '\uCD94\uAC00\uB85C \uD655\uC778\uD560 \uC5F4\uB9B0 \uC9C8\uBB38 3\uAC1C\uC640 \uBD80\uB2F4 \uC218\uC900\uC774 \uB2E4\uB978 \uC81C\uC548 2\uAC1C\uB97C \uB9CC\uB4E0\uB2E4.', '3\uBD84 \uC5ED\uD560\uADF9\uC744 \uD558\uACE0 \uBA74\uB2F4 \uAE30\uB85D\uC5D0 \uD569\uC758 \uC0AC\uD56D\uACFC \uD68C\uC2E0 \uC2DC\uC810\uC744 \uC801\uB294\uB2E4.'],\n    check: [['\uC810\uC8FC\uC758 \uBD88\uB9CC\uC5D0 \uC989\uC2DC \uC815\uCC45 \uC124\uBA85\uC744 \uC2DC\uC791\uD558\uBA74 \uC0DD\uAE30\uB294 \uBB38\uC81C\uB294?', '\uC2E4\uC81C \uBD80\uB2F4\uACFC \uC694\uAD6C\uB97C \uB193\uCCD0 \uC124\uBA85\uC774 \uC124\uB4DD\uB825\uC744 \uC783\uACE0 \uB300\uD654\uAC00 \uB354 \uACBD\uC9C1\uB420 \uC218 \uC788\uB2E4.'], ['\uC9C0\uD0AC \uC218 \uC5C6\uB294 \uC9C0\uC6D0 \uC57D\uC18D\uC744 \uD53C\uD558\uB294 \uBC29\uBC95\uC740?', '\uC2B9\uC778 \uC5EC\uBD80\uB97C \uD655\uC778\uD55C \uB4A4 \uB2F4\uB2F9\uC790\uC640 \uB2F5\uBCC0 \uC2DC\uC810\uC744 \uBA85\uD655\uD788 \uC548\uB0B4\uD55C\uB2E4.']]\n  },\n  4: {\n    scenario: '\uC810\uC8FC\uAC00 \uB0C9\uC7A5 \uC7A5\uBE44 \uAD50\uCCB4 \uBE44\uC6A9 \uC9C0\uC6D0\uACFC \uD589\uC0AC \uC608\uC678\uB97C \uD55C \uC790\uB9AC\uC5D0\uC11C \uC989\uC2DC \uC2B9\uC778\uD574 \uB2EC\uB77C\uACE0 \uC694\uCCAD\uD55C\uB2E4.',\n    teaching: [\n      'SV\uC758 \uD575\uC2EC\uC740 \uAE30\uC900 \uC720\uC9C0, \uC6B4\uC601 \uC9C0\uC6D0, \uD604\uC7A5 \uAD50\uC721, \uC131\uACFC \uAC1C\uC120, \uBB38\uC81C \uC870\uAE30 \uBC1C\uACAC\uC744 \uC5F0\uACB0\uD558\uB294 \uAC83\uC774\uB2E4. \u201C\uC9C1\uC811 \uD574\uACB0\u201D\uB9CC \uC131\uACFC\uB85C \uBCF4\uC9C0 \uC54A\uACE0 \uC801\uC808\uD55C \uBD80\uC11C\uC5D0 \uC0AC\uC2E4\uC744 \uC804\uB2EC\uD574 \uD6C4\uC18D \uACB0\uACFC\uAE4C\uC9C0 \uD655\uC778\uD55C\uB2E4.',\n      '\uAD8C\uD55C\uD45C\uB85C \uD604\uC7A5 \uC548\uB0B4\uAC00 \uAC00\uB2A5\uD55C \uC77C, \uC0C1\uAE09\uC790 \uC2B9\uC778, \uC804\uBB38 \uBD80\uC11C \uD310\uB2E8\uC774 \uD544\uC694\uD55C \uC77C\uC744 \uAD6C\uBD84\uD55C\uB2E4. \uBE44\uC6A9 \uBD80\uB2F4\uC774\uB098 \uACC4\uC57D \uC608\uC678\uCC98\uB7FC \uAD8C\uD55C \uBC16\uC758 \uC0AC\uD56D\uC740 \uC9C0\uC6D0 \uAC00\uB2A5\uC131\uC744 \uC784\uC758\uB85C \uC57D\uC18D\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uBCF8\uC0AC \uC815\uCC45\uC740 \uC65C \uD544\uC694\uD55C\uC9C0\uC640 \uC810\uD3EC\uC5D0\uC11C \uBB34\uC5C7\uC774 \uB2EC\uB77C\uC9C0\uB294\uC9C0 \uD568\uAED8 \uC124\uBA85\uD55C\uB2E4. \uBC18\uB300\uB85C \uC810\uC8FC \uC694\uCCAD\uC744 \uBCF8\uC0AC\uC5D0 \uC804\uB2EC\uD560 \uB54C\uB294 \uC0AC\uC2E4, \uC810\uD3EC \uC601\uD5A5, \uC694\uCCAD \uC0AC\uD56D\uC744 \uBD84\uB9AC\uD574\uC57C \uD310\uB2E8\uC774 \uBE68\uB77C\uC9C4\uB2E4.',\n      '\uB2F4\uB2F9 \uC810\uD3EC\uBCC4 \uC6B4\uC601 \uD615\uD0DC, \uD575\uC2EC \uC9C0\uD45C, \uC810\uC8FC\xB7\uAD00\uB9AC\uC790 \uC5F0\uB77D \uCCB4\uACC4, \uC9C4\uD589 \uC911 \uC774\uC288\uB97C \uC694\uC57D\uD55C\uB2E4. \uB3D9\uC77C\uD55C \uB9E4\uCD9C \uAC10\uC18C\uB77C\uB3C4 \uC0C1\uAD8C \uBCC0\uD654\uC640 \uC778\uB825 \uBB38\uC81C\uB294 \uC9C0\uC6D0 \uBC29\uC2DD\uC774 \uB2E4\uB97C \uC218 \uC788\uB2E4.',\n      '\uC77C \uB2E8\uC704 \uAE34\uAE09 \uC774\uC288, \uC8FC \uB2E8\uC704 \uBC29\uBB38\uACFC \uD6C4\uC18D, \uC6D4 \uB2E8\uC704 \uC131\uACFC \uB9AC\uBDF0\uB97C \uAD6C\uBD84\uD55C\uB2E4. \uBC29\uBB38 \uD69F\uC218 \uAC19\uC740 \uD65C\uB3D9 \uC9C0\uD45C\uC640 \uAC1C\uC120 \uC644\uB8CC\uC728\xB7\uB9E4\uCD9C \uBCC0\uD654 \uAC19\uC740 \uACB0\uACFC \uC9C0\uD45C\uB97C \uD568\uAED8 \uBCF8\uB2E4.',\n      '\uC2DC\uC124 \uBB38\uC81C\uC5D0\uB294 \uC99D\uC0C1\xB7\uBC1C\uC0DD \uC2DC\uC810\xB7\uC0AC\uC9C4\xB7\uC6B4\uC601 \uC601\uD5A5, \uD589\uC0AC \uC608\uC678\uC5D0\uB294 \uC801\uC6A9 \uC810\uD3EC\xB7\uC0AC\uC720\xB7\uC608\uC0C1 \uC601\uD5A5\uC744 \uC815\uB9AC\uD55C\uB2E4. \uC694\uCCAD\uC744 \uBCF4\uB0B8 \uB4A4 \uCC45\uC784 \uBD80\uC11C\uC758 \uACB0\uB860\uACFC \uC810\uD3EC \uC804\uB2EC \uC5EC\uBD80\uAE4C\uC9C0 \uCD94\uC801\uD55C\uB2E4.'\n    ],\n    task: ['\uC0AC\uB840\uC758 \uC694\uCCAD\uC744 \uC9C1\uC811 \uC548\uB0B4\xB7\uC2B9\uC778 \uC694\uCCAD\xB7\uC804\uBB38 \uBD80\uC11C \uD611\uC758\uB85C \uBD84\uB958\uD55C\uB2E4.', '\uAC01 \uC694\uCCAD\uC5D0 \uD544\uC694\uD55C \uC0AC\uC2E4\uACFC \uC99D\uBE59\uC744 \uC815\uB9AC\uD55C \uD611\uC5C5 \uC694\uCCAD\uC11C\uB97C \uC791\uC131\uD55C\uB2E4.', '\uC810\uC8FC\uC5D0\uAC8C \uAD8C\uD55C \uBC94\uC704\uC640 \uB2E4\uC74C \uD68C\uC2E0 \uC2DC\uC810\uC744 \uC124\uBA85\uD558\uB294 \uBB38\uC7A5\uC744 \uC5F0\uC2B5\uD55C\uB2E4.'],\n    check: [['SV\uAC00 \uAD8C\uD55C \uBC16 \uC0AC\uC548\uC744 \uBC1B\uC558\uC744 \uB54C \uC6B0\uC120\uD560 \uC77C\uC740?', '\uAC00\uB2A5 \uC5EC\uBD80\uB97C \uC57D\uC18D\uD558\uAE30 \uC804\uC5D0 \uC0AC\uC2E4\uACFC \uC601\uD5A5\uC744 \uD655\uC778\uD558\uACE0 \uAD8C\uD55C\uD45C\uC5D0 \uB530\uB77C \uB2F4\uB2F9 \uBD80\uC11C\uC5D0 \uC5F0\uACB0\uD55C\uB2E4.'], ['\uD611\uC5C5 \uC694\uCCAD\uC744 \uC644\uB8CC\uB85C \uBCF4\uB294 \uC2DC\uC810\uC740?', '\uC694\uCCAD \uC804\uC1A1\uC774 \uC544\uB2C8\uB77C \uACB0\uB860 \uD655\uC778\uACFC \uC810\uD3EC \uC548\uB0B4\uAE4C\uC9C0 \uB05D\uB0AC\uC744 \uB54C\uB2E4.']]\n  },\n  5: {\n    scenario: '\uC810\uC8FC\uAC00 \uC0C8 \uC815\uCC45\uC758 \uC801\uC6A9 \uB300\uC0C1\uACFC \uACC4\uC57D\uC11C\uC0C1 \uBE44\uC6A9 \uBD80\uB2F4 \uADFC\uAC70\uB97C \uBB3B\uACE0 \uC608\uC678\uB97C \uAD6C\uB450\uB85C \uC57D\uC18D\uD574 \uB2EC\uB77C\uACE0 \uD55C\uB2E4.',\n    teaching: [\n      '\uBCF8\uC0AC\uB294 \uBE0C\uB79C\uB4DC\uC640 \uC6B4\uC601 \uCCB4\uACC4\uB97C \uC81C\uACF5\uD558\uACE0, \uAC00\uB9F9\uC810\uC740 \uACC4\uC57D\uC5D0 \uB530\uB978 \uB3C5\uB9BD \uC0AC\uC5C5\uC790\uB85C \uC810\uD3EC\uB97C \uC6B4\uC601\uD55C\uB2E4. \uACF5\uAE09\uC5C5\uCCB4\uC640 \uC9C1\uC601\uC810\uC758 \uC5ED\uD560\uB3C4 \uAD6C\uBD84\uD574\uC57C \uBE44\uC6A9\uACFC \uCC45\uC784\uC758 \uD750\uB984\uC744 \uC624\uD574\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uBCF8\uC0AC \uC218\uC775 \uD56D\uBAA9\uACFC \uC810\uD3EC\uC758 \uB9E4\uCD9C\xB7\uC2DD\uC7AC\uB8CC\uBE44\xB7\uC778\uAC74\uBE44\xB7\uC784\uCC28\uB8CC\uB97C \uBCC4\uB3C4 \uAD00\uC810\uC5D0\uC11C \uBCF8\uB2E4. \uAC19\uC740 \uC815\uCC45\uB3C4 \uBCF8\uC0AC\uC640 \uC810\uC8FC\uC5D0\uAC8C \uBE44\uC6A9\xB7\uC791\uC5C5 \uBD80\uB2F4\uC774 \uB2E4\uB974\uBBC0\uB85C \uC548\uB0B4\uD560 \uB54C \uADF8 \uC601\uD5A5\uC744 \uD568\uAED8 \uD655\uC778\uD55C\uB2E4.',\n      '\uC815\uBCF4\uACF5\uAC1C\uC11C, \uACC4\uC57D\uC11C, \uB9E4\uB274\uC5BC, \uC815\uCC45 \uACF5\uC9C0\uB294 \uBAA9\uC801\uC774 \uB2E4\uB974\uB2E4. \uB2F5\uBCC0 \uC804 \uCD5C\uC2E0\uBCF8\xB7\uC2DC\uD589\uC77C\xB7\uC810\uD3EC \uC801\uC6A9 \uBC94\uC704\uB97C \uD655\uC778\uD558\uACE0 \uBB38\uC11C\uAC00 \uC11C\uB85C \uCDA9\uB3CC\uD558\uB294 \uB4EF\uD558\uBA74 \uD574\uC11D \uAD8C\uD55C\uC774 \uC788\uB294 \uBD80\uC11C\uC5D0 \uC804\uB2EC\uD55C\uB2E4.',\n      '\uC601\uC5C5\uC9C0\uC5ED, \uC9C0\uC815 \uC0C1\uD488, \uBE0C\uB79C\uB4DC \uC0AC\uC6A9, \uBE44\uC6A9 \uBD80\uB2F4 \uB4F1\uC740 \uC2E4\uC81C \uBB38\uC11C\uC758 \uC870\uD56D\uACFC \uBD80\uC18D \uD569\uC758\uB97C \uD568\uAED8 \uD655\uC778\uD55C\uB2E4. \uAE30\uC5B5\uC5D0 \uC758\uC874\uD574 \uC77C\uBC18\uC801\uC778 \uC5C5\uACC4 \uAD00\uD589\uC744 \uD574\uB2F9 \uC810\uD3EC\uC758 \uACC4\uC57D \uB0B4\uC6A9\uC73C\uB85C \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC815\uCC45 \uBCC0\uACBD\uC744 \uC548\uB0B4\uD560 \uB54C \uB300\uC0C1\xB7\uC2DC\uD589\uC77C\xB7\uC810\uD3EC \uC900\uBE44\uC0AC\uD56D\xB7\uC9C0\uC6D0 \uCC3D\uAD6C\uB97C \uD55C\uB208\uC5D0 \uC815\uB9AC\uD55C\uB2E4. \uC608\uC678\uB294 \uC0AC\uC720\uC640 \uC601\uD5A5, \uC2B9\uC778\uAD8C\uC790\uB97C \uB0A8\uAE30\uACE0 \uC815\uD574\uC9C4 \uC2B9\uC778 \uC808\uCC28\uAC00 \uB05D\uB098\uAE30 \uC804\uC5D0\uB294 \uD655\uC815 \uD45C\uD604\uC744 \uD53C\uD55C\uB2E4.',\n      '\uACC4\uC57D \uD574\uC11D, \uBE44\uC6A9 \uBD84\uC7C1, \uAC70\uB798 \uC870\uAC74 \uBCC0\uACBD, \uC885\uB8CC \uAC00\uB2A5\uC131\uC740 \uBBFC\uAC10 \uC0AC\uC548\uC774\uB2E4. SV\uB294 \uC790\uB8CC\uC640 \uACBD\uC704\uB97C \uAC1D\uAD00\uC801\uC73C\uB85C \uBAA8\uC544 \uB2F4\uB2F9 \uBD80\uC11C\uC5D0 \uC5F0\uACB0\uD558\uACE0, \uBC95\uB960 \uD310\uB2E8\uC774\uB098 \uAD6C\uB450 \uD569\uC758\uB97C \uB300\uC2E0\uD558\uC9C0 \uC54A\uB294\uB2E4.'\n    ],\n    task: ['\uAC00\uC0C1 \uC815\uCC45 \uACF5\uC9C0\uC5D0\uC11C \uB300\uC0C1\xB7\uC2DC\uD589\uC77C\xB7\uC900\uBE44\uC0AC\uD56D\uC744 \uCC3E\uC544 \uC548\uB0B4\uBB38\uC744 \uC4F4\uB2E4.', '\uBE44\uC6A9 \uBD80\uB2F4 \uC9C8\uBB38\uC5D0 \uD544\uC694\uD55C \uBB38\uC11C\uC640 \uD655\uC778\uD560 \uB2F4\uB2F9 \uBD80\uC11C\uB97C \uC801\uB294\uB2E4.', '\uC2B9\uC778 \uC804 \uC608\uC678\uB97C \uD655\uC815\uD558\uC9C0 \uC54A\uB294 \uD68C\uC2E0 \uBB38\uC7A5\uC744 \uC791\uC131\uD55C\uB2E4.'],\n    check: [['\uC815\uCC45 \uC801\uC6A9 \uC5EC\uBD80\uB97C \uBA3C\uC800 \uD655\uC778\uD560 \uC694\uC18C\uB294?', '\uCD5C\uC2E0 \uBB38\uC11C, \uC2DC\uD589\uC77C, \uC801\uC6A9 \uB300\uC0C1\uACFC \uC608\uC678 \uC2B9\uC778 \uC0C1\uD0DC\uB2E4.'], ['\uACC4\uC57D \uBB38\uAD6C\uAC00 \uBD88\uBA85\uD655\uD558\uBA74 \uC5B4\uB5BB\uAC8C \uD558\uB098\uC694?', '\uC784\uC758 \uD574\uC11D\uC744 \uD53C\uD558\uACE0 \uC0AC\uC2E4\uACFC \uBB38\uC11C\uB97C \uC815\uB9AC\uD574 \uB2F4\uB2F9 \uBD80\uC11C\uC5D0 \uAC80\uD1A0\uB97C \uC694\uCCAD\uD55C\uB2E4.']]\n  },\n  6: {\n    scenario: '\uC810\uD3EC \uC6D4\uB9E4\uCD9C\uC774 \uC804\uC6D4\uBCF4\uB2E4 8% \uAC10\uC18C\uD588\uC9C0\uB9CC \uC8FC\uB9D0 \uB9E4\uCD9C\uC740 \uBE44\uC2B7\uD558\uACE0 \uD3C9\uC77C \uC624\uD6C4 \uC8FC\uBB38\uC774 \uD06C\uAC8C \uC904\uC5C8\uB2E4.',\n    teaching: [\n      '\uB9E4\uCD9C\uC740 \uAC70\uB798 \uAC74\uC218\uC640 \uAC1D\uB2E8\uAC00\uB85C \uB098\uB220 \uBD10\uC57C \uAC1C\uC120 \uBC29\uD5A5\uC774 \uBCF4\uC778\uB2E4. \uAC74\uC218\uAC00 \uC904\uC5C8\uB294\uC9C0, \uD55C \uC8FC\uBB38\uC5D0 \uB2F4\uAE30\uB294 \uD488\uBAA9\uC774 \uC904\uC5C8\uB294\uC9C0 \uBA3C\uC800 \uD655\uC778\uD558\uACE0 \uD658\uBD88\xB7\uCDE8\uC18C\uAC00 \uD3EC\uD568\uB41C \uB370\uC774\uD130 \uC815\uC758\uB97C \uD1B5\uC77C\uD55C\uB2E4.',\n      '\uC804\uC6D4 \uD55C \uB2EC\uB9CC \uBE44\uAD50\uD558\uBA74 \uC601\uC5C5\uC77C \uC218, \uD734\uC77C, \uACC4\uC808, \uD589\uC0AC \uD6A8\uACFC\uB97C \uB193\uCE60 \uC218 \uC788\uB2E4. \uB3D9\uC77C \uC694\uC77C\uACFC \uB3D9\uC77C \uC601\uC5C5\uC77C \uAE30\uC900\uC73C\uB85C \uB2E4\uC2DC \uBE44\uAD50\uD558\uACE0 \uD2B9\uC774 \uC774\uBCA4\uD2B8\uB97C \uC8FC\uC11D\uC73C\uB85C \uB0A8\uAE34\uB2E4.',\n      '\uC694\uC77C\xB7\uC2DC\uAC04\uB300 \uD45C\uC5D0\uC11C \uAC10\uC18C\uAC00 \uC9D1\uC911\uB41C \uAD6C\uAC04\uC744 \uCC3E\uB294\uB2E4. \uD3C9\uC77C \uC624\uD6C4\uAC00 \uC6D0\uC778\uC774\uB77C\uBA74 \uADF8 \uC2DC\uAC04\uC758 \uACE0\uAC1D \uB3D9\uC120, \uC778\uB825 \uBC30\uCE58, \uD488\uC808 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC804\uCCB4 \uB9E4\uCD9C \uBB38\uC81C\uB85C \uACFC\uC7A5\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC0C1\uC704 \uBA54\uB274\uC758 \uD310\uB9E4 \uC218\uB7C9\uACFC \uAD6C\uC131 \uBE44\uC911\uC744 \uD568\uAED8 \uBCF8\uB2E4. \uB300\uD45C \uBA54\uB274\uAC00 \uC904\uC5C8\uB294\uC9C0, \uC800\uAC00 \uD488\uBAA9 \uBE44\uC911\uC774 \uB298\uC5B4 \uAC1D\uB2E8\uAC00\uAC00 \uB0AE\uC544\uC84C\uB294\uC9C0 \uAD6C\uBD84\uD558\uACE0 \uC138\uD2B8 \uC81C\uC548\uC758 \uC2E4\uC81C \uC8FC\uBB38 \uD750\uB984\uC744 \uD655\uC778\uD55C\uB2E4.',\n      '\uD640\xB7\uD3EC\uC7A5\xB7\uBC30\uB2EC\uC744 \uBD84\uB9AC\uD574 \uC8FC\uBB38 \uAC74\uC218\uC640 \uC2E4\uC218\uB839\uC561\uC744 \uBCF8\uB2E4. \uBC30\uB2EC \uB9E4\uCD9C \uC99D\uAC00\uAC00 \uC804\uCCB4 \uC218\uC775 \uAC1C\uC120\uC744 \uB73B\uD558\uC9C0 \uC54A\uC744 \uC218 \uC788\uC73C\uBBC0\uB85C \uC218\uC218\uB8CC\uC640 \uD310\uCD09\uBE44\uB3C4 \uD568\uAED8 \uD655\uC778\uD55C\uB2E4.',\n      '\uC22B\uC790\uB294 \uC6D0\uC778\uC744 \uD655\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \u201C\uD3C9\uC77C \uC624\uD6C4 \uD488\uC808 \uB54C\uBB38\uC5D0 \uC8FC\uBB38\uC774 \uC904\uC5C8\uB2E4\u201D\uB294 \uAC00\uC124\uC744 \uC138\uC6B4 \uB4A4 POS \uD488\uC808 \uAE30\uB85D, \uC9C1\uC6D0 \uC778\uD130\uBDF0, \uD604\uC7A5 \uAD00\uCC30\uB85C \uAC80\uC99D\uD558\uACE0 \uB300\uC548\uC744 \uC2E4\uD5D8\uD55C\uB2E4.'\n    ],\n    task: ['\uAC70\uB798 \uAC74\uC218\uC640 \uAC1D\uB2E8\uAC00 \uBCC0\uD654 \uC911 \uB9E4\uCD9C \uAC10\uC18C\uC5D0 \uB354 \uD06C\uAC8C \uAE30\uC5EC\uD55C \uCABD\uC744 \uACC4\uC0B0\uD55C\uB2E4.', '\uC694\uC77C\xB7\uC2DC\uAC04\uB300\xB7\uCC44\uB110\uC5D0\uC11C \uAC10\uC18C\uAC00 \uC9D1\uC911\uB41C \uAD6C\uAC04\uC744 \uD45C\uC2DC\uD55C\uB2E4.', '\uC6D0\uC778 \uAC00\uC124 2\uAC1C\uC640 \uAC01\uAC01 \uD655\uC778\uD560 \uD604\uC7A5 \uC790\uB8CC\uB97C \uC801\uB294\uB2E4.'],\n    check: [['\uB9E4\uCD9C \uAC10\uC18C\uB9CC\uC73C\uB85C \uACE0\uAC1D \uC218 \uAC10\uC18C\uB97C \uB2E8\uC815\uD560 \uC218 \uC788\uB098\uC694?', '\uC5C6\uB2E4. \uAC70\uB798 \uAC74\uC218\uC640 \uAC1D\uB2E8\uAC00\uB97C \uBD84\uB9AC\uD574\uC57C \uD55C\uB2E4.'], ['\uAC00\uC124\uC774 \uC0AC\uC2E4\uC774 \uB418\uB294 \uC2DC\uC810\uC740?', '\uCD94\uAC00 \uB370\uC774\uD130\uC640 \uD604\uC7A5 \uAD00\uCC30\uB85C \uBC18\uBCF5 \uD655\uC778\uD55C \uB4A4\uB2E4.']]\n  },\n  7: {\n    scenario: '\uBC30\uB2EC \uB9E4\uCD9C\uC740 \uB298\uC5C8\uB294\uB370 \uC810\uC8FC\uAC00 \uC2E4\uC81C \uB0A8\uB294 \uB3C8\uC740 \uC904\uC5C8\uB2E4\uACE0 \uB9D0\uD55C\uB2E4.',\n    teaching: [\n      '\uC190\uC775\uC740 \uB9E4\uCD9C\uC5D0\uC11C \uC7AC\uB8CC\uBE44, \uC778\uAC74\uBE44, \uC784\uCC28\uB8CC, \uCC44\uB110 \uBE44\uC6A9 \uB4F1 \uC6B4\uC601\uBE44\uB97C \uCC28\uAC10\uD574 \uBCF8\uB2E4. \uD604\uAE08 \uC720\uC785\uACFC \uC7A5\uBD80\uC0C1 \uC774\uC775\uC744 \uD63C\uB3D9\uD558\uC9C0 \uC54A\uB3C4\uB85D \uAE30\uAC04\uACFC \uD3EC\uD568 \uD56D\uBAA9\uC744 \uBA3C\uC800 \uD1B5\uC77C\uD55C\uB2E4.',\n      '\uC6D0\uAC00\uC728\uC774 \uB192\uC544\uC84C\uB2E4\uBA74 \uB9E4\uC785\uB2E8\uAC00, \uC0AC\uC6A9\uB7C9, \uD3D0\uAE30, \uD310\uB9E4 \uAD6C\uC131\uC744 \uB530\uB85C \uC810\uAC80\uD55C\uB2E4. \uB808\uC2DC\uD53C \uACC4\uB7C9 \uC624\uB958\uC640 \uC2E4\uC81C \uD310\uB9E4\uB7C9 \uCC28\uC774\uB97C \uD655\uC778\uD558\uC9C0 \uC54A\uACE0 \uB2E8\uC21C\uD788 \uC7AC\uB8CC\uB97C \uC904\uC774\uBA74 \uD488\uC9C8 \uBB38\uC81C\uAC00 \uC0DD\uAE38 \uC218 \uC788\uB2E4.',\n      '\uC778\uAC74\uBE44\uB294 \uCD1D\uC561\uB9CC\uC774 \uC544\uB2C8\uB77C \uC2DC\uAC04\uB300\uBCC4 \uB9E4\uCD9C \uB300\uBE44 \uD22C\uC785 \uC2DC\uAC04\uC744 \uBCF8\uB2E4. \uD53C\uD06C \uC778\uB825\uC774 \uBD80\uC871\uD574 \uC8FC\uBB38\uC744 \uC783\uB294 \uC0C1\uD669\uACFC \uD55C\uC0B0\uD55C \uC2DC\uAC04\uC5D0 \uC778\uB825\uC774 \uACFC\uD55C \uC0C1\uD669\uC740 \uC11C\uB85C \uB2E4\uB978 \uC870\uC815\uC774 \uD544\uC694\uD558\uB2E4.',\n      '\uC784\uCC28\uB8CC \uAC19\uC740 \uACE0\uC815\uBE44\uC640 \uBC30\uB2EC \uC218\uC218\uB8CC\xB7\uD3EC\uC7A5\uC7AC\xB7\uAD11\uACE0\uBE44 \uAC19\uC740 \uCC44\uB110\uBCC4 \uBE44\uC6A9\uC744 \uBD84\uB9AC\uD55C\uB2E4. \uC8FC\uBB38 \uAE08\uC561\uC774 \uAC19\uC544\uB3C4 \uCC44\uB110\uB9C8\uB2E4 \uC810\uD3EC\uC5D0 \uB0A8\uB294 \uAE08\uC561\uC774 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uB2E4.',\n      '\uC190\uC775\uBD84\uAE30\uC810\uC740 \uACE0\uC815\uBE44\uB97C \uAC74\uB2F9 \uACF5\uD5CC\uC774\uC775\uC73C\uB85C \uAC10\uB2F9\uD560 \uC218 \uC788\uB294 \uC8FC\uBB38 \uC218\uC900\uC73C\uB85C \uC774\uD574\uD55C\uB2E4. \uD310\uB9E4\uAC00\uC5D0\uC11C \uBCC0\uB3D9\uBE44\uB97C \uBE80 \uAE08\uC561\uC73C\uB85C \uAC04\uB2E8\uD55C \uC2DC\uB098\uB9AC\uC624\uB97C \uACC4\uC0B0\uD558\uB418 \uBE0C\uB79C\uB4DC\uC758 \uC2E4\uC81C \uD68C\uACC4 \uAE30\uC900\uC744 \uB530\uB978\uB2E4.',\n      '\uAC1C\uC120\uC548\uC740 \uAC00\uACA9, \uAD6C\uC131, \uD3D0\uAE30, \uADFC\uBB34\uD45C, \uCC44\uB110 \uC6B4\uC601 \uC911 \uD1B5\uC81C \uAC00\uB2A5\uD55C \uAC83\uBD80\uD130 \uC120\uC815\uD55C\uB2E4. \uC608\uC0C1 \uC808\uAC10\uC561\uACFC \uACE0\uAC1D \uC601\uD5A5, \uC2E4\uD589 \uBE44\uC6A9\uC744 \uD568\uAED8 \uC801\uACE0 \uC2E4\uD589 \uD6C4 \uC2E4\uC81C \uC190\uC775\uC744 \uC7AC\uD655\uC778\uD55C\uB2E4.'\n    ],\n    task: ['\uD640 \uC8FC\uBB38\uACFC \uBC30\uB2EC \uC8FC\uBB38\uC758 \uB9E4\uCD9C\xB7\uBCC0\uB3D9\uBE44\xB7\uACF5\uD5CC\uC774\uC775\uC744 \uBE44\uAD50\uD55C\uB2E4.', '\uC190\uC775 \uC545\uD654 \uC694\uC778\uC744 \uC6D0\uAC00\xB7\uC778\uAC74\uBE44\xB7\uCC44\uB110\uBE44\uB85C \uBD84\uD574\uD55C\uB2E4.', '\uD488\uC9C8\uC744 \uD6FC\uC190\uD558\uC9C0 \uC54A\uB294 \uAC1C\uC120\uC548 2\uAC1C\uC640 \uD655\uC778 \uC9C0\uD45C\uB97C \uC81C\uC548\uD55C\uB2E4.'],\n    check: [['\uB9E4\uCD9C \uC99D\uAC00\uAC00 \uC774\uC775 \uC99D\uAC00\uB97C \uBCF4\uC7A5\uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uCC44\uB110 \uC218\uC218\uB8CC\uC640 \uD310\uCD09\xB7\uD3EC\uC7A5 \uBE44\uC6A9\uC774 \uB354 \uBE60\uB974\uAC8C \uB298 \uC218 \uC788\uB2E4.'], ['\uC7AC\uB8CC\uBE44 \uC808\uAC10\uC548\uC744 \uAC80\uD1A0\uD560 \uB54C \uC9C0\uCF1C\uC57C \uD560 \uAC83\uC740?', '\uBE0C\uB79C\uB4DC \uB808\uC2DC\uD53C\uC640 \uD488\uC9C8 \uAE30\uC900\uC774\uB2E4.']]\n  },\n  8: {\n    scenario: '\uC810\uD3EC \uC55E \uC720\uB3D9\uC740 \uB9CE\uC740\uB370 \uB9E4\uCD9C\uC740 \uC815\uCCB4\uB418\uACE0, \uAC74\uB108\uD3B8\uC5D0 \uBE44\uC2B7\uD55C \uAC00\uACA9\uB300\uC758 \uACBD\uC7C1\uC810\uC774 \uBB38\uC744 \uC5F4\uC5C8\uB2E4.',\n    teaching: [\n      '\uC0C1\uAD8C\uC740 \uC9C0\uB3C4\uC0C1\uC758 \uC6D0\uB9CC \uADF8\uB9AC\uB294 \uAC83\uC774 \uC544\uB2C8\uB77C \uC2E4\uC81C \uACE0\uAC1D\uC774 \uC5B4\uB290 \uAE38\uACFC \uC2DC\uAC04\uB300\uC5D0 \uC6C0\uC9C1\uC774\uB294\uC9C0\uB97C \uD30C\uC545\uD558\uB294 \uC77C\uC774\uB2E4. \uB3C4\uBCF4\xB7\uCC28\uB7C9 \uC811\uADFC, \uB300\uC911\uAD50\uD1B5, \uBAA9\uC801 \uC2DC\uC124\uACFC \uC810\uD3EC \uAC00\uC2DC\uC131\uC744 \uD568\uAED8 \uAE30\uB85D\uD55C\uB2E4.',\n      '\uC720\uB3D9 \uC778\uAD6C\uAC00 \uBAA8\uB450 \uC7A0\uC7AC \uACE0\uAC1D\uC740 \uC544\uB2C8\uB2E4. \uCD9C\uADFC\uAE38\xB7\uC810\uC2EC\xB7\uD1F4\uADFC\uAE38\uC5D0 \uB204\uAC00 \uC9C0\uB098\uAC00\uACE0 \uC5B4\uB514\uB85C \uB4E4\uC5B4\uAC00\uB294\uC9C0 \uAD00\uCC30\uD574 \uC6B0\uB9AC \uC0C1\uD488\uC744 \uAD6C\uB9E4\uD560 \uAC00\uB2A5\uC131\uC774 \uC788\uB294 \uACE0\uAC1D\uC744 \uAD6C\uBD84\uD55C\uB2E4.',\n      '\uACBD\uC7C1\uC810\uC740 \uAC19\uC740 \uBA54\uB274\uBFD0 \uC544\uB2C8\uB77C \uAC19\uC740 \uC2DD\uC0AC \uC0C1\uD669\uC774\uB098 \uC9C0\uCD9C\uC744 \uB193\uACE0 \uC120\uD0DD\uB418\uB294 \uB300\uCCB4\uC7AC\uAE4C\uC9C0 \uD3EC\uD568\uD55C\uB2E4. \uBC18\uACBD\uB9CC\uC73C\uB85C \uACE0\uB974\uC9C0 \uB9D0\uACE0 \uACE0\uAC1D\uC774 \uC2E4\uC81C \uBE44\uAD50\uD560 \uD6C4\uBCF4\uB97C \uC120\uC815\uD55C\uB2E4.',\n      '\uACBD\uC7C1\uC810\uC758 \uAC00\uACA9\uD45C\uB9CC \uBCF4\uC9C0 \uB9D0\uACE0 \uC0C1\uD488 \uAD6C\uC131, \uB300\uAE30\uC2DC\uAC04, \uC88C\uC11D, \uBC30\uB2EC \uB178\uCD9C, \uB9AC\uBDF0\uC758 \uBC18\uBCF5 \uC758\uACAC\uC744 \uAC19\uC740 \uAE30\uC900\uC73C\uB85C \uC870\uC0AC\uD55C\uB2E4. \uD55C \uBC88\uC758 \uBC29\uBB38 \uACB0\uACFC\uB97C \uC9C0\uC18D\uC801\uC778 \uC6B4\uC601 \uC218\uC900\uC73C\uB85C \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC6B0\uB9AC \uC810\uD3EC\uC758 \uAC15\uC810\uACFC \uC57D\uC810\uC744 \uACE0\uAC1D \uAD00\uC810\uC5D0\uC11C \uBE44\uAD50\uD55C\uB2E4. \uACE0\uAC1D\uC774 \uAE38\uC744 \uAC74\uB108\uB294 \uC774\uC720\uAC00 \uAC00\uACA9\uC778\uC9C0, \uC811\uADFC \uB3D9\uC120\uC778\uC9C0, \uAD6C\uB9E4 \uACBD\uD5D8\uC778\uC9C0 \uAC00\uC124\uC744 \uB9CC\uB4E4\uACE0 \uAD00\uCC30\uB85C \uD655\uC778\uD55C\uB2E4.',\n      '\uC2E4\uD589 \uAE30\uD68C\uB294 \uC810\uD3EC\uAC00 \uC870\uC815 \uAC00\uB2A5\uD55C \uBC94\uC704\uC5D0\uC11C \uCC3E\uB294\uB2E4. \uAC04\uD310 \uB178\uCD9C, \uC548\uB0B4 \uBB38\uAD6C, \uD53C\uD06C \uC6B4\uC601, \uC9C0\uC5ED \uC81C\uD734 \uAC19\uC740 \uD6C4\uBCF4\uC5D0 \uC608\uC0C1 \uACE0\uAC1D \uC601\uD5A5\uACFC \uD544\uC694\uD55C \uC790\uC6D0\uC744 \uBD99\uC778\uB2E4.'\n    ],\n    task: ['\uACE0\uAC1D \uB3D9\uC120\uACFC \uC811\uADFC \uC7A5\uBCBD\uC744 \uAC04\uB2E8\uD55C \uC9C0\uB3C4\uC5D0 \uD45C\uC2DC\uD55C\uB2E4.', '\uACBD\uC7C1\uC810 2\uACF3\uC744 \uB3D9\uC77C\uD55C \uD56D\uBAA9\uC73C\uB85C \uBE44\uAD50\uD55C\uB2E4.', '\uD655\uC778\uB41C \uC0AC\uC2E4\uACFC \uAC00\uC124\uC744 \uB098\uB204\uACE0 \uC2E4\uD589 \uAC00\uB2A5\uD55C \uAE30\uD68C 2\uAC1C\uB97C \uC81C\uC548\uD55C\uB2E4.'],\n    check: [['\uC720\uB3D9 \uC778\uAD6C\uAC00 \uB9CE\uC73C\uBA74 \uB9E4\uCD9C\uB3C4 \uB192\uC544\uC57C \uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uACE0\uAC1D \uC801\uD569\uC131, \uC811\uADFC\uC131, \uAC00\uC2DC\uC131, \uC120\uD0DD \uC774\uC720\uAC00 \uD568\uAED8 \uC791\uB3D9\uD55C\uB2E4.'], ['\uACBD\uC7C1\uC810\uC740 \uC5B4\uB5A4 \uAE30\uC900\uC73C\uB85C \uC120\uC815\uD558\uB098\uC694?', '\uACE0\uAC1D\uC774 \uAC19\uC740 \uC0C1\uD669\uC5D0\uC11C \uC2E4\uC81C\uB85C \uB300\uCCB4 \uC120\uD0DD\uD560 \uC218 \uC788\uB294 \uC810\uD3EC\uC778\uC9C0 \uBCF8\uB2E4.']]\n  },\n  9: {\n    scenario: '\uB3D9\uC77C \uC0C1\uAD8C\uC758 \uB2E4\uB978 \uC810\uD3EC\uB294 \uC548\uC815\uC801\uC778\uB370 \uB2F4\uB2F9 \uC810\uD3EC\uB9CC 3\uAC1C\uC6D4 \uC5F0\uC18D \uB9E4\uCD9C\uACFC \uC7AC\uBC29\uBB38\uC774 \uD558\uB77D\uD588\uB2E4.',\n    teaching: [\n      '\uBD80\uC9C4\uC740 \uBAA9\uD45C \uBBF8\uB2EC \uD55C \uB2EC\uB85C \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB3D9\uC77C \uC810\uD3EC\uC758 \uCD94\uC138\uC640 \uBE44\uAD50 \uC810\uD3EC, \uC601\uC5C5\uC77C\xB7\uD589\uC0AC\xB7\uACC4\uC808 \uCC28\uC774\uB97C \uD568\uAED8 \uBCF4\uACE0 \uD68C\uBCF5\uC774 \uD544\uC694\uD55C \uC218\uC900\uACFC \uAE30\uAC04\uC744 \uC815\uD55C\uB2E4.',\n      '\uB9E4\uCD9C \uC790\uB8CC\uC5D0 QSC, \uD488\uC808, \uC778\uB825, \uACE0\uAC1D \uBD88\uB9CC, \uC0C1\uAD8C \uBCC0\uD654\uB97C \uACB9\uCCD0 \uBCF8\uB2E4. \uD604\uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uC9C8\uBB38 \uBAA9\uB85D\uC744 \uB9CC\uB4E4\uC5B4 \uC22B\uC790\uB9CC\uC73C\uB85C \uC6B4\uC601 \uBB38\uC81C\uB97C \uCD94\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC6D0\uC778 \uD6C4\uBCF4\uAC00 \uB9CE\uC73C\uBA74 \uACE0\uAC1D \uC120\uD0DD\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uACFC \uC99D\uAC70\uC758 \uAC15\uB3C4\uB97C \uB530\uC838 \uD575\uC2EC \uC6D0\uC778 \uD55C\uB450 \uAC1C\uB85C \uC881\uD78C\uB2E4. \uACB0\uACFC\uC778 \uB9E4\uCD9C \uAC10\uC18C\uC640 \uC6D0\uC778\uC778 \uC8FC\uBB38 \uB204\uB77D\xB7\uC811\uADFC\uC131 \uC800\uD558\uB97C \uD63C\uB3D9\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uAC1C\uC120 \uACFC\uC81C\uB294 \uD6A8\uACFC, \uC2E4\uD589 \uB09C\uB3C4, \uC18C\uC694 \uBE44\uC6A9, \uC810\uC8FC\uC758 \uC218\uC6A9 \uAC00\uB2A5\uC131\uC744 \uD568\uAED8 \uD3C9\uAC00\uD55C\uB2E4. \uBE60\uB978 \uAC1C\uC120\uC774 \uAC00\uB2A5\uD55C \uC6B4\uC601 \uACFC\uC81C\uC640 \uBCF8\uC0AC \uD611\uC5C5\uC774 \uD544\uC694\uD55C \uAD6C\uC870 \uACFC\uC81C\uB97C \uB098\uB220 \uC21C\uC11C\uB97C \uC815\uD55C\uB2E4.',\n      '\uACC4\uD68D\uC5D0\uB294 \uAE30\uC900\uAC12, \uBAA9\uD45C, \uC2E4\uD589 \uD589\uB3D9, \uB2F4\uB2F9\uC790, \uC2DC\uC791\uC77C, \uC810\uAC80\uC77C\uC744 \uB123\uB294\uB2E4. \u201C\uC11C\uBE44\uC2A4 \uAC1C\uC120\u201D \uB300\uC2E0 \u201C\uD53C\uD06C \uC8FC\uBB38 \uD655\uC778 \uC808\uCC28\uB97C \uC804 \uC9C1\uC6D0\uC5D0\uAC8C \uC2DC\uC5F0\uD558\uACE0 \uB204\uB77D \uAC74\uC218\uB97C \uC8FC\uAC04 \uD655\uC778\u201D\uCC98\uB7FC \uAD00\uCC30 \uAC00\uB2A5\uD55C \uD589\uB3D9\uC73C\uB85C \uC4F4\uB2E4.',\n      '\uC131\uACFC\uB97C \uBCFC \uB54C \uB9E4\uCD9C\uB9CC \uAE30\uB2E4\uB9AC\uC9C0 \uC54A\uB294\uB2E4. \uBA3C\uC800 \uC2E4\uD589 \uC5EC\uBD80\uC640 \uC120\uD589 \uC9C0\uD45C\uB97C \uD655\uC778\uD558\uACE0, \uD6A8\uACFC\uAC00 \uC5C6\uC73C\uBA74 \uAC00\uC124\xB7\uC2E4\uD589\xB7\uC678\uBD80 \uD658\uACBD \uC911 \uBB34\uC5C7\uC774 \uB2EC\uB790\uB294\uC9C0 \uAC80\uD1A0\uD574 \uACC4\uD68D\uC744 \uC870\uC815\uD55C\uB2E4.'\n    ],\n    task: ['\uC8FC\uC5B4\uC9C4 \uC790\uB8CC\uC5D0\uC11C \uBD80\uC9C4\uC744 \uC785\uC99D\uD558\uB294 \uC9C0\uD45C\uC640 \uCD94\uAC00\uB85C \uD544\uC694\uD55C \uC790\uB8CC\uB97C \uAD6C\uBD84\uD55C\uB2E4.', '\uC6D0\uC778 \uAC00\uC124 3\uAC1C \uC911 \uC6B0\uC120 \uAC80\uC99D\uD560 1\uAC1C\uB97C \uC120\uC815\uD558\uACE0 \uADFC\uAC70\uB97C \uC4F4\uB2E4.', '2\uC8FC \uAC1C\uC120\uACC4\uD68D\uC5D0 \uD589\uB3D9\xB7\uB2F4\uB2F9\uC790\xB7\uC120\uD589 \uC9C0\uD45C\xB7\uACB0\uACFC \uC9C0\uD45C\uB97C \uB123\uB294\uB2E4.'],\n    check: [['\uB9E4\uCD9C \uD558\uB77D\uACFC \uC6D0\uC778\uC758 \uCC28\uC774\uB294?', '\uB9E4\uCD9C \uD558\uB77D\uC740 \uACB0\uACFC\uC774\uACE0, \uC6D0\uC778\uC740 \uCD94\uAC00 \uC790\uB8CC\uC640 \uD604\uC7A5 \uD655\uC778\uC73C\uB85C \uAC80\uC99D\uD574\uC57C \uD55C\uB2E4.'], ['\uC2E4\uD589\uD588\uC9C0\uB9CC \uC131\uACFC\uAC00 \uC5C6\uC744 \uB54C\uB294?', '\uC2E4\uD589 \uD488\uC9C8\uACFC \uAC00\uC124, \uC678\uBD80 \uBCC0\uC218\uB97C \uCC28\uB840\uB85C \uC7AC\uAC80\uD1A0\uD55C\uB2E4.']]\n  },\n  10: {\n    scenario: '\uC810\uC8FC\uAC00 \uD560\uC778 \uD589\uC0AC\uB97C \uC6D0\uD558\uC9C0\uB9CC \uC810\uD3EC\uC758 \uBB38\uC81C\uB294 \uC2E0\uADDC \uACE0\uAC1D \uBD80\uC871\uC778\uC9C0 \uAE30\uC874 \uACE0\uAC1D \uC7AC\uBC29\uBB38 \uAC10\uC18C\uC778\uC9C0 \uD655\uC778\uB418\uC9C0 \uC54A\uC558\uB2E4.',\n    teaching: [\n      '\uB9C8\uCF00\uD305 \uBAA9\uC801\uC744 \uC778\uC9C0\uB3C4, \uCCAB \uBC29\uBB38, \uC7AC\uBC29\uBB38, \uAC1D\uB2E8\uAC00 \uC911 \uD558\uB098\uB85C \uBA85\uD655\uD788 \uC815\uD55C\uB2E4. \uBAA9\uC801\uC774 \uB2E4\uB974\uBA74 \uB300\uC0C1 \uACE0\uAC1D\uACFC \uCE21\uC815 \uC9C0\uD45C\uB3C4 \uB2EC\uB77C\uC9C0\uBBC0\uB85C \u201C\uB9E4\uCD9C \uC99D\uAC00\u201D\uB9CC\uC744 \uBAA9\uD45C\uB85C \uC801\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uACE0\uAC1D\uC758 \uAD6C\uB9E4 \uC0C1\uD669\uACFC \uC81C\uC548\uC744 \uC5F0\uACB0\uD55C\uB2E4. \uC608\uB97C \uB4E4\uC5B4 \uC778\uADFC \uC9C1\uC7A5\uC778\uC758 \uC9E7\uC740 \uC810\uC2EC\uC2DC\uAC04\uC774 \uBB38\uC81C\uB77C\uBA74 \uD560\uC778\uC728\uBCF4\uB2E4 \uBE60\uB978 \uC8FC\uBB38\xB7\uC218\uB839 \uC548\uB0B4\uAC00 \uB354 \uC801\uD569\uD560 \uC218 \uC788\uB2E4.',\n      '\uC9C0\uC5ED \uD65C\uB3D9\uC740 \uC0C1\uAD8C\uC758 \uB3D9\uC120\uACFC \uC811\uC810\uC5D0 \uB9DE\uCD98\uB2E4. \uC548\uB0B4\uBB3C, \uC8FC\uBCC0 \uC0AC\uC5C5\uC7A5 \uC81C\uD734, \uC9C0\uC5ED \uD589\uC0AC \uCC38\uC5EC\uB97C \uAC80\uD1A0\uD560 \uB54C \uBE0C\uB79C\uB4DC \uD45C\uD604 \uAE30\uC900\uACFC \uC810\uD3EC\uC758 \uC2E4\uD589 \uC5EC\uB825\uC744 \uD655\uC778\uD55C\uB2E4.',\n      '\uBCF8\uC0AC \uD504\uB85C\uBAA8\uC158\uC740 \uAE30\uAC04, \uC801\uC6A9 \uC0C1\uD488, POS \uC124\uC815, \uC7AC\uACE0, \uC9C1\uC6D0 \uC548\uB0B4, \uACE0\uAC1D \uACE0\uC9C0\uAE4C\uC9C0 \uC900\uBE44\uD574\uC57C \uD55C\uB2E4. \uD55C \uD56D\uBAA9\uC774\uB77C\uB3C4 \uBE60\uC9C0\uBA74 \uC8FC\uBB38 \uC624\uB958\uC640 \uBD88\uB9CC\uC774 \uBC1C\uC0DD\uD560 \uC218 \uC788\uB2E4.',\n      '\uD589\uC0AC \uBE44\uC6A9\uC5D0\uB294 \uD560\uC778\uC561 \uC678\uC5D0 \uAD11\uACE0\uBE44, \uC7AC\uB8CC\uBE44, \uCD94\uAC00 \uC778\uB825, \uD3EC\uC7A5\uBE44\uAC00 \uC788\uB2E4. \uC608\uC0C1 \uCD94\uAC00 \uC8FC\uBB38\uC758 \uACF5\uD5CC\uC774\uC775\uC774 \uBE44\uC6A9\uC744 \uAC10\uB2F9\uD558\uB294\uC9C0 \uAC04\uB2E8\uD55C \uC2DC\uB098\uB9AC\uC624\uB85C \uBE44\uAD50\uD55C\uB2E4.',\n      '\uD589\uC0AC \uC804\uD6C4 \uB3D9\uC77C \uC694\uC77C\xB7\uC2DC\uAC04\uB300\uC640 \uBE44\uAD50\uD558\uACE0 \uC2E0\uADDC\xB7\uC7AC\uBC29\uBB38, \uAC74\uC218\xB7\uAC1D\uB2E8\uAC00\uB97C \uD568\uAED8 \uBCF8\uB2E4. \uD560\uC778 \uAE30\uAC04\uC5D0\uB9CC \uB298\uC5B4\uB09C \uB9E4\uCD9C\uC744 \uC7A5\uAE30 \uD6A8\uACFC\uB85C \uC624\uC778\uD558\uC9C0 \uC54A\uB294\uB2E4.'\n    ],\n    task: ['\uC810\uD3EC \uBB38\uC81C\uB97C \uD655\uC778\uD560 \uC9C0\uD45C\uB97C \uACE0\uB974\uACE0 \uBAA9\uD45C \uACE0\uAC1D\uACFC \uCEA0\uD398\uC778 \uBAA9\uC801\uC744 \uC815\uD55C\uB2E4.', '\uD589\uC0AC \uC2E4\uD589 \uC804 \uC900\uBE44\uD45C\uC640 \uC608\uC0C1 \uBE44\uC6A9\xB7\uCD94\uAC00 \uC8FC\uBB38 \uC2DC\uB098\uB9AC\uC624\uB97C \uC791\uC131\uD55C\uB2E4.', '\uC131\uACFC \uD310\uC815 \uAE30\uC900\uACFC \uD589\uC0AC \uC885\uB8CC \uD6C4 \uD655\uC778 \uC2DC\uC810\uC744 \uC815\uD55C\uB2E4.'],\n    check: [['\uD560\uC778 \uD589\uC0AC\uC758 \uB9E4\uCD9C\uC774 \uB298\uBA74 \uC131\uACF5\uC778\uAC00\uC694?', '\uBE44\uC6A9\uC744 \uBE80 \uC218\uC775\uACFC \uBAA9\uD45C \uACE0\uAC1D\uC758 \uD589\uB3D9 \uBCC0\uD654\uAE4C\uC9C0 \uD655\uC778\uD574\uC57C \uD55C\uB2E4.'], ['\uD504\uB85C\uBAA8\uC158 \uC2DC\uD589 \uC804 \uC810\uD3EC\uC5D0\uC11C \uD655\uC778\uD560 \uAC83\uC740?', '\uC0C1\uD488\xB7\uAE30\uAC04\xB7POS\xB7\uC7AC\uACE0\xB7\uC9C1\uC6D0 \uC548\uB0B4\xB7\uACE0\uAC1D \uACE0\uC9C0\uB2E4.']]\n  },\n  11: {\n    scenario: '\uBC30\uB2EC \uC8FC\uBB38\uC740 \uC99D\uAC00\uD588\uC9C0\uB9CC \uB9AC\uBDF0\uC5D0\uB294 \uB204\uB77D\uACFC \uC74C\uC2DD \uC2DD\uC74C \uBB38\uC81C\uAC00 \uBC18\uBCF5\uB418\uACE0 \uAD11\uACE0\uBE44\uB3C4 \uC0C1\uC2B9\uD55C\uB2E4.',\n    teaching: [\n      '\uCC44\uB110\uBCC4 \uC8FC\uBB38 \uC218, \uCDE8\uC18C\uC728, \uC81C\uC870\xB7\uBC30\uB2EC \uC18C\uC694\uC2DC\uAC04, \uB9AC\uBDF0, \uC2E4\uC218\uB839\uC561\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uBCF8\uB2E4. \uD50C\uB7AB\uD3FC\uC5D0 \uD45C\uC2DC\uB418\uB294 \uB9E4\uCD9C\uACFC \uC810\uD3EC\uAC00 \uC2E4\uC81C \uBC1B\uB294 \uAE08\uC561\uC740 \uAD6C\uBD84\uD55C\uB2E4.',\n      '\uD654\uBA74\uC758 \uBA54\uB274\uBA85\uACFC \uC0AC\uC9C4\uC740 \uC2E4\uC81C \uC81C\uACF5 \uC81C\uD488\uC744 \uC815\uD655\uD788 \uC124\uBA85\uD574\uC57C \uD55C\uB2E4. \uC8FC\uBB38 \uC635\uC158\uACFC \uD488\uC808 \uD45C\uC2DC\uB97C \uC810\uAC80\uD574 \uACE0\uAC1D\uC758 \uAE30\uB300\uC640 \uC810\uD3EC\uC758 \uC81C\uC870 \uAC00\uB2A5 \uC0C1\uD0DC\uAC00 \uC5B4\uAE0B\uB098\uC9C0 \uC54A\uAC8C \uD55C\uB2E4.',\n      '\uC8FC\uBB38 \uC811\uC218\uBD80\uD130 \uC81C\uC870\xB7\uAC80\uC218\xB7\uC778\uACC4\uAE4C\uC9C0 \uB2F4\uB2F9\uC790\uB97C \uC815\uD55C\uB2E4. \uC8FC\uBB38\uC774 \uBAB0\uB9B4 \uB54C\uB294 \uC811\uC218 \uB204\uB77D, \uC870\uB9AC \uC2DC\uC791 \uC9C0\uC5F0, \uD53D\uC5C5 \uB300\uAE30 \uC911 \uC5B4\uB290 \uB2E8\uACC4\uAC00 \uBCD1\uBAA9\uC778\uC9C0 \uC2DC\uAC04 \uAE30\uB85D\uC73C\uB85C \uD655\uC778\uD55C\uB2E4.',\n      '\uD3EC\uC7A5\uC740 \uC628\uB3C4 \uC720\uC9C0, \uB204\uC218 \uBC29\uC9C0, \uAD6C\uC131\uD488 \uD655\uC778, \uC81C\uD488 \uBD84\uB9AC\uB97C \uD568\uAED8 \uACE0\uB824\uD55C\uB2E4. \uBC30\uB2EC \uD6C4 \uD488\uC9C8\uC740 \uD640\uC5D0\uC11C \uB9C9 \uB9CC\uB4E0 \uC81C\uD488\uACFC \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC73C\uBBC0\uB85C \uC2E4\uC81C \uC774\uB3D9 \uC2DC\uAC04\uC744 \uAC00\uC815\uD55C \uC2DC\uD5D8\uC774 \uD544\uC694\uD558\uB2E4.',\n      '\uB9AC\uBDF0\uC5D0\uB294 \uAC10\uC815\uC801\uC73C\uB85C \uB300\uC751\uD558\uC9C0 \uC54A\uACE0 \uC8FC\uBB38 \uC815\uBCF4, \uC0AC\uC2E4 \uD655\uC778, \uD574\uACB0 \uC548\uB0B4 \uC21C\uC73C\uB85C \uB2F5\uD55C\uB2E4. \uAC19\uC740 \uBD88\uB9CC\uC774 \uBC18\uBCF5\uB418\uBA74 \uB2F5\uAE00\uBCF4\uB2E4 \uC81C\uC870\xB7\uD3EC\uC7A5 \uC808\uCC28 \uC218\uC815\uC774 \uC6B0\uC120\uC774\uB2E4.',\n      '\uAD11\uACE0\uC640 \uCFE0\uD3F0\uC73C\uB85C \uB178\uCD9C\uC774 \uC62C\uB77C\uAC00\uB3C4 \uC8FC\uBB38\uB2F9 \uB0A8\uB294 \uAE08\uC561\uC774 \uC904 \uC218 \uC788\uB2E4. \uCC44\uB110\uBCC4 \uC218\uC775\uACFC \uC2E0\uADDC \uACE0\uAC1D \uC720\uC785\uC744 \uBE44\uAD50\uD574 \uC9C0\uC18D\uD560 \uD65C\uB3D9\uACFC \uC911\uB2E8\uD560 \uD65C\uB3D9\uC744 \uC815\uD55C\uB2E4.'\n    ],\n    task: ['\uC8FC\uBB38 \uD55C \uAC74\uC758 \uC811\uC218\xB7\uC81C\uC870\xB7\uAC80\uC218\xB7\uC778\uACC4 \uB3D9\uC120\uC744 \uADF8\uB824 \uB204\uB77D \uC9C0\uC810\uC744 \uCC3E\uB294\uB2E4.', '\uD3EC\uC7A5 \uAC80\uC218\uD45C\uC5D0 \uAD6C\uC131\uD488\uACFC \uC628\uB3C4 \uAD00\uB828 \uD655\uC778 \uD56D\uBAA9\uC744 \uB123\uB294\uB2E4.', '\uD50C\uB7AB\uD3FC \uC218\uC218\uB8CC\xB7\uAD11\uACE0\uBE44\uB97C \uBC18\uC601\uD574 \uCC44\uB110\uBCC4 \uC2E4\uC218\uB839\uC561\uC744 \uBE44\uAD50\uD55C\uB2E4.'],\n    check: [['\uB9AC\uBDF0 \uB2F5\uAE00\uB9CC\uC73C\uB85C \uBC18\uBCF5 \uBD88\uB9CC\uC774 \uD574\uACB0\uB418\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC8FC\uBB38\xB7\uC81C\uC870\xB7\uD3EC\uC7A5 \uACFC\uC815\uC758 \uC6D0\uC778\uC744 \uC218\uC815\uD574\uC57C \uD55C\uB2E4.'], ['\uBC30\uB2EC \uB9E4\uCD9C \uD3C9\uAC00\uC5D0 \uD544\uC694\uD55C \uBE44\uC6A9\uC740?', '\uC218\uC218\uB8CC, \uD3EC\uC7A5\uBE44, \uD560\uC778\xB7\uAD11\uACE0\uBE44\uC640 \uCD94\uAC00 \uC778\uB825 \uBE44\uC6A9 \uB4F1\uC774\uB2E4.']]\n  },\n  12: {\n    scenario: '\uC778\uAE30 \uBA54\uB274 \uC7AC\uB8CC\uB294 \uC8FC\uB9D0\uB9C8\uB2E4 \uD488\uC808\uB418\uACE0 \uB2E4\uB978 \uC7AC\uB8CC\uB294 \uC0AC\uC6A9 \uAE30\uD55C\uC774 \uC9C0\uB098 \uD3D0\uAE30\uB41C\uB2E4.',\n    teaching: [\n      '\uC7AC\uACE0\uB294 \uBC1C\uC8FC, \uC785\uACE0, \uBCF4\uAD00, \uC0AC\uC6A9, \uC2E4\uC0AC, \uD3D0\uAE30\uC758 \uD750\uB984\uC73C\uB85C \uAD00\uB9AC\uD55C\uB2E4. \uD310\uB9E4\uB7C9\uACFC \uC7AC\uACE0 \uC218\uB7C9\uB9CC \uBCF4\uBA74 \uC5B4\uB514\uC11C \uC190\uC2E4\uC774 \uC0DD\uACBC\uB294\uC9C0 \uBAA8\uB974\uBBC0\uB85C \uB2E8\uACC4\uBCC4 \uAE30\uB85D\uC744 \uC5F0\uACB0\uD55C\uB2E4.',\n      '\uC801\uC815 \uBC1C\uC8FC\uB7C9\uC740 \uC608\uC0C1 \uD310\uB9E4\uB7C9, \uD604\uC7AC \uC0AC\uC6A9 \uAC00\uB2A5 \uC7AC\uACE0, \uC785\uACE0\uAE4C\uC9C0 \uAC78\uB9AC\uB294 \uC2DC\uAC04, \uC548\uC804 \uC7AC\uACE0\uB97C \uD568\uAED8 \uACE0\uB824\uD55C\uB2E4. \uD589\uC0AC\xB7\uB0A0\uC528\xB7\uD734\uC77C\uC758 \uC601\uD5A5\uC740 \uACFC\uAC70 \uD328\uD134\uACFC \uAD6C\uBD84\uD574 \uC870\uC815\uD55C\uB2E4.',\n      '\uC785\uACE0 \uB54C \uC218\uB7C9\xB7\uC0C1\uD0DC\xB7\uD45C\uC2DC \uC815\uBCF4\uB97C \uD655\uC778\uD558\uACE0 \uBCF4\uAD00 \uC704\uCE58\uC640 \uC120\uC785\uC120\uCD9C \uD750\uB984\uC744 \uC810\uAC80\uD55C\uB2E4. \uBCF4\uAD00 \uAE30\uC900\uC740 \uC2E4\uC81C \uBE0C\uB79C\uB4DC \uB9E4\uB274\uC5BC\uACFC \uC81C\uD488 \uD45C\uC2DC \uC0AC\uD56D\uC744 \uC6B0\uC120\uD55C\uB2E4.',\n      '\uC2E4\uC0AC \uC218\uB7C9\uACFC \uC2DC\uC2A4\uD15C \uC218\uB7C9\uC774 \uB2E4\uB974\uBA74 \uBA3C\uC800 \uB2E8\uC704, \uC785\uB825 \uB204\uB77D, \uBC18\uD488\xB7\uD3D0\uAE30 \uAE30\uB85D\uC744 \uD655\uC778\uD55C\uB2E4. \uCC28\uC774\uB97C \uC784\uC758\uB85C \uB9DE\uCD94\uC9C0 \uB9D0\uACE0 \uBC1C\uC0DD \uC2DC\uC810\uACFC \uAC00\uB2A5 \uC6D0\uC778\uC744 \uCD94\uC801\uD55C\uB2E4.',\n      '\uB85C\uC2A4\uB294 \uD3D0\uAE30\uBFD0 \uC544\uB2C8\uB77C \uACFC\uB2E4 \uACC4\uB7C9, \uC81C\uC870 \uC2E4\uC218, \uBCF4\uAD00 \uBD88\uB7C9, \uC8FC\uBB38 \uB204\uB77D, \uBB34\uAE30\uB85D \uC0AC\uC6A9\uC73C\uB85C \uBC1C\uC0DD\uD55C\uB2E4. \uC6D0\uC778\uBCC4 \uBE48\uB3C4\uC640 \uBE44\uC6A9\uC744 \uB098\uB220 \uAC00\uC7A5 \uD070 \uC190\uC2E4\uBD80\uD130 \uAC1C\uC120\uD55C\uB2E4.',\n      '\uD488\uC808\uACFC \uD3D0\uAE30\uB97C \uB3D9\uC2DC\uC5D0 \uC904\uC774\uB824\uBA74 \uBC1C\uC8FC \uAE30\uC900\uACFC \uC2E4\uC0AC \uC8FC\uAE30\uB97C \uC870\uC815\uD558\uACE0 \uACB0\uACFC\uB97C \uD655\uC778\uD55C\uB2E4. \uC808\uAC10 \uBAA9\uD45C \uB54C\uBB38\uC5D0 \uD544\uC694\uD55C \uC548\uC804 \uC7AC\uACE0\uAE4C\uC9C0 \uC5C6\uC560 \uACE0\uAC1D \uC8FC\uBB38\uC744 \uB193\uCE58\uC9C0 \uC54A\uB3C4\uB85D \uD55C\uB2E4.'\n    ],\n    task: ['\uD310\uB9E4 \uC608\uC0C1\uACFC \uD604\uC7AC \uC7AC\uACE0\xB7\uC785\uACE0 \uC77C\uC815\uC744 \uC774\uC6A9\uD574 \uBC1C\uC8FC \uC218\uB7C9\uC744 \uACC4\uC0B0\uD55C\uB2E4.', '\uC2E4\uC0AC \uCC28\uC774\uC640 \uD3D0\uAE30 \uAE30\uB85D\uC5D0\uC11C \uAC00\uB2A5\uD55C \uC6D0\uC778\uC744 \uBD84\uB958\uD55C\uB2E4.', '\uD488\uC808\uB960\uACFC \uD3D0\uAE30\uC561\uC744 \uD568\uAED8 \uBCF4\uB294 2\uC8FC \uAC1C\uC120\uC548\uC744 \uC791\uC131\uD55C\uB2E4.'],\n    check: [['\uC7AC\uACE0 \uCC28\uC774\uAC00 \uB098\uBA74 \uBC14\uB85C \uC218\uB7C9\uC744 \uC218\uC815\uD558\uB098\uC694?', '\uBA3C\uC800 \uB2E8\uC704, \uB204\uB77D \uC785\uB825, \uBC18\uD488\xB7\uD3D0\uAE30 \uAE30\uB85D\uACFC \uC2E4\uBB3C\uC744 \uB300\uC870\uD55C\uB2E4.'], ['\uBC1C\uC8FC\uB7C9\uC744 \uC815\uD560 \uB54C \uD310\uB9E4\uB7C9 \uC678 \uD544\uC694\uD55C \uAC83\uC740?', '\uC0AC\uC6A9 \uAC00\uB2A5 \uC7AC\uACE0, \uB9AC\uB4DC\uD0C0\uC784, \uC548\uC804 \uC7AC\uACE0\uC640 \uC608\uC815 \uD589\uC0AC\uB2E4.']]\n  },\n  13: {\n    scenario: '\uC2E0\uBA54\uB274 \uCD9C\uC2DC \uCCAB\uB0A0 \uC9C1\uC6D0\uB9C8\uB2E4 \uC81C\uACF5\uB7C9\uACFC \uC870\uB9AC \uC2DC\uAC04\uC774 \uB2EC\uB77C \uACE0\uAC1D \uBC18\uC751\uC774 \uAC08\uB9B0\uB2E4.',\n    teaching: [\n      '\uC81C\uC870 \uD45C\uC900\uC740 \uB808\uC2DC\uD53C\uC758 \uC7AC\uB8CC\uBFD0 \uC544\uB2C8\uB77C \uACC4\uB7C9, \uC21C\uC11C, \uC7A5\uBE44 \uC124\uC815, \uC644\uC131 \uC0C1\uD0DC, \uC81C\uACF5 \uC2DC\uAC04\uC744 \uD3EC\uD568\uD55C\uB2E4. \uAE30\uC900\uC758 \uBAA9\uC801\uC744 \uC124\uBA85\uD574\uC57C \uC9C1\uC6D0\uC774 \uB2E8\uACC4\uB97C \uC0DD\uB7B5\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uD3B8\uCC28\uB294 \uC0AC\uB78C\uC758 \uBB38\uC81C\uB85C \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB808\uC2DC\uD53C \uC774\uD574, \uB3C4\uAD6C, \uC791\uC5C5 \uACF5\uAC04, \uD53C\uD06C \uC5C5\uBB34\uB7C9, \uC6D0\uC7AC\uB8CC \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC5B4\uB290 \uB2E8\uACC4\uC5D0\uC11C \uACB0\uACFC\uAC00 \uB2EC\uB77C\uC9C0\uB294\uC9C0 \uCC3E\uB294\uB2E4.',\n      '\uAD50\uC721\uC740 \uC124\uBA85\uB9CC\uC73C\uB85C \uB05D\uB098\uC9C0 \uC54A\uB294\uB2E4. SV\uAC00 \uD45C\uC900\uC744 \uC2DC\uC5F0\uD558\uACE0 \uC9C1\uC6D0\uC774 \uC9C1\uC811 \uB9CC\uB4E4\uC5B4 \uBCF4\uAC8C \uD55C \uB4A4 \uAD00\uCC30\uB41C \uD589\uB3D9\uC744 \uAE30\uC900\uACFC \uBE44\uAD50\uD574 \uC989\uC2DC \uD53C\uB4DC\uBC31\uD55C\uB2E4.',\n      '\uCD9C\uC2DC \uC804 \uC6D0\uC7AC\uB8CC \uC785\uACE0, \uD310\uB9E4 \uD654\uBA74\uACFC POS, \uC81C\uC870 \uB3C4\uAD6C, \uC548\uB0B4\uBB3C, \uAD50\uC721 \uC774\uC218 \uC0C1\uD0DC\uB97C \uD655\uC778\uD55C\uB2E4. \uC900\uBE44\uAC00 \uB2A6\uC740 \uD56D\uBAA9\uC740 \uC784\uC758 \uB300\uCCB4\uBCF4\uB2E4 \uB2F4\uB2F9 \uBD80\uC11C\uC640 \uCD9C\uC2DC \uAC00\uB2A5 \uC5EC\uBD80\uB97C \uB17C\uC758\uD55C\uB2E4.',\n      '\uCD08\uAE30\uC5D0\uB294 \uD310\uB9E4\uB7C9\uBFD0 \uC544\uB2C8\uB77C \uC81C\uC870 \uC2DC\uAC04, \uC7AC\uC81C\uC870, \uD488\uC808, \uACE0\uAC1D \uC9C8\uBB38\uC744 \uAE30\uB85D\uD55C\uB2E4. \uD53C\uD06C \uC2DC\uAC04\uC5D0 \uD45C\uC900\uC774 \uC720\uC9C0\uB418\uB294\uC9C0\uB97C \uBD10\uC57C \uCD9C\uC2DC \uC900\uBE44\uC758 \uC2E4\uC81C \uC218\uC900\uC744 \uD310\uB2E8\uD560 \uC218 \uC788\uB2E4.',\n      '\uD604\uC7A5 \uC758\uACAC\uC740 \u201C\uC5B4\uB835\uB2E4\u201D\uAC00 \uC544\uB2C8\uB77C \uC5B4\uB290 \uB2E8\uACC4\uC5D0\uC11C \uBA87 \uBD84\uC774 \uC9C0\uC5F0\uB418\uACE0 \uC5B4\uB5A4 \uBB38\uC81C\uAC00 \uBC18\uBCF5\uB418\uB294\uC9C0 \uC0AC\uC2E4\uB85C \uBAA8\uC740\uB2E4. \uAC1C\uC120 \uC81C\uC548\uC740 \uBE0C\uB79C\uB4DC \uC0C1\uD488 \uB2F4\uB2F9\uC790\uC758 \uC2B9\uC778 \uC808\uCC28\uB85C \uC5F0\uACB0\uD55C\uB2E4.'\n    ],\n    task: ['\uC81C\uC870 \uD45C\uC900\uC5D0\uC11C \uAD00\uCC30 \uAC00\uB2A5\uD55C \uD575\uC2EC \uB3D9\uC791 5\uAC1C\uB97C \uC815\uD55C\uB2E4.', '\uC2DC\uC5F0\xB7\uC9C1\uC6D0 \uC7AC\uD604\xB7\uD53C\uB4DC\uBC31 \uC21C\uC11C\uB85C 5\uBD84 \uD604\uC7A5 \uAD50\uC721\uC744 \uC124\uACC4\uD55C\uB2E4.', '\uCD9C\uC2DC \uCCAB \uC8FC\uC5D0 \uAE30\uB85D\uD560 \uD310\uB9E4\xB7\uD488\uC9C8\xB7\uC791\uC5C5 \uC9C0\uD45C\uB97C \uC815\uD55C\uB2E4.'],\n    check: [['\uC81C\uC870 \uACB0\uACFC\uAC00 \uB2E4\uB974\uBA74 \uC9C1\uC6D0 \uD0D3\uC73C\uB85C \uBCFC \uC218 \uC788\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uB3C4\uAD6C, \uB808\uC2DC\uD53C \uC774\uD574, \uACF5\uAC04, \uC5C5\uBB34\uB7C9, \uC7AC\uB8CC \uC0C1\uD0DC\uB97C \uD568\uAED8 \uD655\uC778\uD55C\uB2E4.'], ['\uC2E0\uBA54\uB274 \uCD9C\uC2DC \uC900\uBE44\uC758 \uC644\uB8CC \uAE30\uC900\uC740?', '\uC7AC\uB8CC\xB7\uC2DC\uC2A4\uD15C\xB7\uB3C4\uAD6C\xB7\uC548\uB0B4\xB7\uC9C1\uC6D0 \uC219\uB828\uC774 \uBAA8\uB450 \uD655\uC778\uB418\uB294 \uAC83\uC774\uB2E4.']]\n  },\n  14: {\n    scenario: '\uD3C9\uC77C \uC624\uD6C4\uC5D0\uB294 \uC778\uB825\uC774 \uB0A8\uC9C0\uB9CC \uC8FC\uB9D0 \uC810\uC2EC\uC5D0\uB294 \uC8FC\uBB38\uC774 \uBC00\uB9AC\uACE0 \uC9C1\uC6D0 \uC774\uD0C8\uB3C4 \uC7A6\uB2E4.',\n    teaching: [\n      '\uC778\uB825 \uC218\uC694\uB294 \uD558\uB8E8 \uCD1D\uB9E4\uCD9C\uBCF4\uB2E4 \uC2DC\uAC04\uB300\uBCC4 \uC8FC\uBB38 \uAC74\uC218, \uC81C\uC870 \uB09C\uB3C4, \uD640\xB7\uBC30\uB2EC \uB3D9\uC2DC \uCC98\uB9AC\uB7C9\uC73C\uB85C \uCD94\uC815\uD55C\uB2E4. \uACE0\uAC1D \uB300\uAE30\uC640 \uC9C1\uC6D0 \uACFC\uBD80\uD558\uAC00 \uBC1C\uC0DD\uD55C \uC2DC\uAC04\uC744 \uBA3C\uC800 \uCC3E\uB294\uB2E4.',\n      '\uADFC\uBB34\uD45C\uC5D0\uB294 \uD53C\uD06C \uC900\uBE44\uC640 \uB9C8\uAC10 \uC791\uC5C5\uAE4C\uC9C0 \uD3EC\uD568\uD55C\uB2E4. \uD734\uAC8C\xB7\uADFC\uB85C \uC870\uAC74\uC740 \uC2E4\uC81C \uC801\uC6A9 \uBC95\uB839\uACFC \uD68C\uC0AC \uC9C0\uCE68\uC744 \uD655\uC778\uD558\uACE0, \uBB34\uB9AC\uD55C \uC2DC\uAC04 \uB2E8\uCD95\uC73C\uB85C \uD488\uC9C8\uACFC \uC548\uC804\uC774 \uB5A8\uC5B4\uC9C0\uC9C0 \uC54A\uAC8C \uD55C\uB2E4.',\n      '\uC5ED\uD560 \uBC30\uCE58\uB294 \uC8FC\uBB38\xB7\uC81C\uC870\xB7\uAC80\uC218\xB7\uACE0\uAC1D \uB300\uC751\uC758 \uCC45\uC784\uC790\uB97C \uBD84\uBA85\uD788 \uD55C\uB2E4. \uBC14\uC05C \uC2DC\uAC04\uC5D0\uB294 \uC219\uB828\uB3C4\uC5D0 \uB530\uB77C \uBC30\uCE58\uD558\uACE0 \uAD50\uB300 \uC2DC \uBBF8\uC644\uB8CC \uC791\uC5C5\uC744 \uC778\uACC4\uD55C\uB2E4.',\n      '\uC2E0\uADDC \uC9C1\uC6D0\uC740 \uCCAB\uB0A0\uBD80\uD130 \uBAA8\uB4E0 \uC5C5\uBB34\uB97C \uB9E1\uAE30\uAE30\uBCF4\uB2E4 \uB2E8\uACC4\uBCC4 \uC219\uB828 \uBAA9\uD45C\uB97C \uC900\uB2E4. \uAD50\uC721 \uB2F4\uB2F9\uC790, \uD655\uC778 \uB0A0\uC9DC, \uC7AC\uAD50\uC721 \uAE30\uC900\uC744 \uC815\uD574 \uCD08\uAE30 \uD63C\uB780\uACFC \uC774\uD0C8\uC744 \uC904\uC778\uB2E4.',\n      '\uC0DD\uC0B0\uC131\uC740 \uC778\uAC74\uBE44\uC728\uB9CC\uC73C\uB85C \uD310\uB2E8\uD558\uC9C0 \uC54A\uB294\uB2E4. \uD22C\uC785 \uC2DC\uAC04 \uB300\uBE44 \uC8FC\uBB38 \uCC98\uB9AC\uC640 \uC11C\uBE44\uC2A4 \uD488\uC9C8\uC744 \uD568\uAED8 \uBCF4\uBA70 \uD53C\uD06C \uC778\uB825 \uBD80\uC871\uC774 \uB9E4\uCD9C \uC190\uC2E4\uC744 \uB9CC\uB4E4 \uC218 \uC788\uC74C\uC744 \uAC80\uD1A0\uD55C\uB2E4.',\n      'SV\uB294 \uC778\uB825 \uD604\uD669\uACFC \uAD50\uC721 \uD544\uC694\uB97C \uC9C4\uB2E8\uD558\uACE0 \uC6B4\uC601 \uB300\uC548\uC744 \uC81C\uC548\uD55C\uB2E4. \uCC44\uC6A9 \uC870\uAC74\xB7\uB178\uBB34 \uD310\uB2E8\xB7\uBE44\uC6A9 \uC2B9\uC778\uC740 \uC810\uC8FC\uC758 \uAD8C\uD55C\uACFC \uD68C\uC0AC\uC758 \uC9C0\uC6D0 \uBC94\uC704\uB97C \uD655\uC778\uD574 \uCC98\uB9AC\uD55C\uB2E4.'\n    ],\n    task: ['\uC2DC\uAC04\uB300\uBCC4 \uC8FC\uBB38\uB7C9\uC744 \uADFC\uAC70\uB85C \uD544\uC694\uD55C \uC5ED\uD560\uACFC \uC778\uC6D0 \uBC30\uCE58\uB97C \uB2E4\uC2DC \uADF8\uB9B0\uB2E4.', '\uC2E0\uADDC \uC9C1\uC6D0\uC758 1\uC8FC \uAD50\uC721\xB7\uD655\uC778 \uACC4\uD68D\uC744 \uC791\uC131\uD55C\uB2E4.', '\uBCC0\uACBD \uC804\uD6C4 \uB300\uAE30\uC2DC\uAC04\xB7\uC8FC\uBB38 \uC624\uB958\xB7\uC778\uAC74\uBE44 \uC9C0\uD45C\uB97C \uC815\uD55C\uB2E4.'],\n    check: [['\uC778\uAC74\uBE44\uC728\uC774 \uB0AE\uC73C\uBA74 \uC778\uB825 \uC6B4\uC601\uC774 \uD6A8\uC728\uC801\uC778\uAC00\uC694?', '\uB300\uAE30, \uC8FC\uBB38 \uC190\uC2E4, \uD488\uC9C8, \uC9C1\uC6D0 \uBD80\uB2F4\uC744 \uD568\uAED8 \uBD10\uC57C \uD55C\uB2E4.'], ['SV\uAC00 \uCC44\uC6A9 \uC870\uAC74\uC744 \uC9C1\uC811 \uD655\uC815\uD574\uB3C4 \uB418\uB098\uC694?', '\uC810\uC8FC\uC640 \uD68C\uC0AC\uC758 \uAD8C\uD55C \uBC94\uC704\uB97C \uD655\uC778\uD558\uACE0 \uD544\uC694\uD55C \uBD80\uC11C\uC640 \uD611\uC758\uD574\uC57C \uD55C\uB2E4.']]\n  },\n  15: {\n    scenario: '\uC9C1\uC6D0\uC740 \uAD50\uC721\uC744 \uBC1B\uC558\uB2E4\uACE0 \uD558\uC9C0\uB9CC \uD53C\uD06C \uC2DC\uAC04\uC5D0\uB294 \uC8FC\uBB38 \uD655\uC778 \uC808\uCC28\uB97C \uBC18\uBCF5\uD574\uC11C \uBE60\uB728\uB9B0\uB2E4.',\n    teaching: [\n      '\uAD50\uC721 \uD544\uC694\uB294 \uC810\uAC80\uD45C \uC810\uC218\uBCF4\uB2E4 \uC2E4\uC81C \uD589\uB3D9\uC758 \uCC28\uC774\uC5D0\uC11C \uCC3E\uB294\uB2E4. \uAE30\uC900\uC744 \uBAA8\uB974\uB294\uC9C0, \uC54C\uACE0\uB3C4 \uBC14\uC060 \uB54C \uC2E4\uD589\uD558\uC9C0 \uBABB\uD558\uB294\uC9C0, \uB3C4\uAD6C\uC640 \uC778\uB825\uC774 \uBD80\uC871\uD55C\uC9C0 \uBA3C\uC800 \uAD6C\uBD84\uD55C\uB2E4.',\n      '\uBAA9\uD45C\uB294 \u201C\uC11C\uBE44\uC2A4 \uC774\uD574\u201D\uBCF4\uB2E4 \u201C\uC8FC\uBB38 \uC804\uB2EC \uC804 \uD488\uBAA9\uACFC \uC635\uC158\uC744 \uC18C\uB9AC \uB0B4\uC5B4 \uD655\uC778\u201D\uCC98\uB7FC \uAD00\uCC30 \uAC00\uB2A5\uD55C \uD589\uB3D9\uC73C\uB85C \uC801\uB294\uB2E4. \uD55C \uBC88\uC758 \uAD50\uC721\uC5D0\uC11C \uD575\uC2EC \uD589\uB3D9\uC744 1~2\uAC1C\uB85C \uC81C\uD55C\uD55C\uB2E4.',\n      '\uC124\uBA85\uC5D0\uC11C\uB294 \uC65C \uD544\uC694\uD55C\uC9C0\uC640 \uC2E4\uD589 \uC21C\uC11C\uB97C \uC9E7\uAC8C \uB9D0\uD558\uACE0, \uC815\uC0C1 \uC0AC\uB840\uC640 \uC624\uB958 \uC0AC\uB840\uB97C \uBE44\uAD50\uD574 \uC2DC\uBC94\uC744 \uBCF4\uC778\uB2E4. \uC9C8\uBB38\uC744 \uBC1B\uC544 \uC9C1\uC6D0\uC774 \uC774\uD574\uD55C \uB2E8\uACC4\uB97C \uB2E4\uC2DC \uB9D0\uD558\uAC8C \uD55C\uB2E4.',\n      '\uC9C1\uC6D0\uC774 \uC9C1\uC811 \uD574\uBCF4\uB294 \uB3D9\uC548 \uD55C \uBC88\uC5D0 \uD55C \uD589\uB3D9\uC529 \uD53C\uB4DC\uBC31\uD55C\uB2E4. \u201C\uC798\uD558\uC138\uC694\u201D \uB300\uC2E0 \u201C\uC635\uC158 \uD655\uC778\uC744 \uC8FC\uBB38 \uD654\uBA74\uACFC \uB300\uC870\uD55C \uC810\uC774 \uC815\uD655\uD588\uB2E4\u201D\uCC98\uB7FC \uAD6C\uCCB4\uC801\uC73C\uB85C \uB9D0\uD55C\uB2E4.',\n      '\uAD50\uC721 \uCC38\uC11D\uACFC \uC219\uB828\uC740 \uB2E4\uB974\uB2E4. \uC815\uC0C1 \uC0C1\uD669\uACFC \uD53C\uD06C \uC0C1\uD669\uC5D0\uC11C \uBC18\uBCF5 \uC218\uD589\uD558\uB294\uC9C0 \uD655\uC778\uD558\uACE0, \uBBF8\uB2EC\uC790\uB294 \uC5B4\uB290 \uB2E8\uACC4\uAC00 \uC5B4\uB824\uC6B4\uC9C0 \uC7AC\uAD50\uC721\uD55C\uB2E4.',\n      '\uC810\uC8FC\uB098 \uAD00\uB9AC\uC790\uAC00 \uC774\uD6C4\uC5D0\uB3C4 \uAC19\uC740 \uAE30\uC900\uC73C\uB85C \uAD00\uCC30\uD558\uACE0 \uD53C\uB4DC\uBC31\uD560 \uC218 \uC788\uAC8C \uCF54\uCE6D \uBC29\uBC95\uC744 \uC804\uB2EC\uD55C\uB2E4. \uC77C\uC815 \uAE30\uAC04 \uD6C4 \uC624\uB958\uC728\uACFC \uD604\uC7A5 \uD589\uB3D9\uC744 \uB2E4\uC2DC \uD655\uC778\uD574\uC57C \uAD50\uC721 \uD6A8\uACFC\uAC00 \uC720\uC9C0\uB41C\uB2E4.'\n    ],\n    task: ['\uB204\uB77D\uB418\uB294 \uD589\uB3D9\uC744 \uD558\uB098\uB85C \uC815\uC758\uD558\uACE0 \uAD50\uC721 \uBAA9\uD45C\uB97C \uC4F4\uB2E4.', '\uC124\uBA85 1\uBD84\xB7\uC2DC\uBC94 2\uBD84\xB7\uC9C1\uC6D0 \uC2E4\uC2B5 3\uBD84\xB7\uD53C\uB4DC\uBC31 2\uBD84\uC758 \uCF54\uCE6D\uC744 \uC124\uACC4\uD55C\uB2E4.', '\uD53C\uD06C \uC2DC\uAC04 \uC7AC\uD655\uC778\uC6A9 \uAD00\uCC30\uD45C\uC640 \uC7AC\uAD50\uC721 \uAE30\uC900\uC744 \uB9CC\uB4E0\uB2E4.'],\n    check: [['\uAD50\uC721 \uCC38\uC11D\uB9CC\uC73C\uB85C \uC219\uB828\uC744 \uC778\uC815\uD560 \uC218 \uC788\uB098\uC694?', '\uC5C6\uB2E4. \uC2E4\uC81C \uC5C5\uBB34\uC5D0\uC11C \uAE30\uC900 \uD589\uB3D9\uC744 \uBC18\uBCF5 \uC218\uD589\uD558\uB294\uC9C0 \uD655\uC778\uD574\uC57C \uD55C\uB2E4.'], ['\uC88B\uC740 \uD53C\uB4DC\uBC31\uC758 \uD2B9\uC9D5\uC740?', '\uAD00\uCC30\uD55C \uD589\uB3D9\uACFC \uAE30\uC900\uC758 \uCC28\uC774\uB97C \uAD6C\uCCB4\uC801\uC73C\uB85C \uB9D0\uD558\uACE0 \uB2E4\uC74C \uC2DC\uB3C4\uB97C \uC81C\uC548\uD55C\uB2E4.']]\n  },\n  16: {\n    scenario: '\uACE0\uAC1D\uC774 \uC774\uBB3C \uC758\uC2EC \uC0AC\uC9C4\uC744 \uAC8C\uC2DC\uD558\uACE0 \uB9E4\uC7A5\uC5D0\uC11C \uCDA9\uBD84\uD55C \uC124\uBA85\uC744 \uB4E3\uC9C0 \uBABB\uD588\uB2E4\uACE0 \uD56D\uC758\uD55C\uB2E4.',\n    teaching: [\n      '\uBD88\uB9CC\uC740 \uC9C0\uC5F0\xB7\uB204\uB77D\xB7\uD0DC\uB3C4\xB7\uD488\uC9C8\xB7\uC548\uC804 \uC758\uC2EC\uC73C\uB85C \uB098\uB204\uACE0 \uACE0\uAC1D \uC601\uD5A5\uACFC \uAE34\uAE09\uB3C4\uB97C \uD310\uB2E8\uD55C\uB2E4. \uAC74\uAC15\xB7\uC548\uC804 \uAD00\uB828 \uC758\uC2EC\uC740 \uC77C\uBC18 \uBCF4\uC0C1 \uBB38\uC758\uBCF4\uB2E4 \uC6B0\uC120 \uBCF4\uACE0\uD558\uACE0 \uC0AC\uC2E4 \uD655\uC778\uC744 \uBCF4\uC874\uD55C\uB2E4.',\n      '\uCD08\uAE30 \uC751\uB300\uC5D0\uC11C\uB294 \uACE0\uAC1D \uACBD\uD5D8\uC744 \uB4E3\uACE0 \uBD88\uD3B8\uC744 \uC778\uC815\uD558\uBA70 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC548\uB0B4\uD55C\uB2E4. \uC0AC\uC2E4\uC774 \uD655\uC778\uB418\uAE30 \uC804 \uC6D0\uC778\uC744 \uB2E8\uC815\uD558\uAC70\uB098 \uD655\uC778\uD560 \uC218 \uC5C6\uB294 \uBCF4\uC0C1\uC744 \uC57D\uC18D\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC8FC\uBB38 \uC815\uBCF4, \uC81C\uD488\xB7\uD3EC\uC7A5, \uC81C\uC870\xB7\uBCF4\uAD00 \uAE30\uB85D, \uB2F9\uC2DC \uC9C1\uC6D0 \uC124\uBA85\uC744 \uC2DC\uAC04 \uC21C\uC11C\uB85C \uBAA8\uC740\uB2E4. \uC0AC\uC9C4\uACFC \uAD00\uB828 \uBB3C\uD488\uC740 \uC784\uC758\uB85C \uD3D0\uAE30\uD558\uC9C0 \uC54A\uB3C4\uB85D \uD574\uB2F9 \uBE0C\uB79C\uB4DC\uC758 \uC0AC\uACE0 \uB300\uC751 \uC808\uCC28\uB97C \uB530\uB978\uB2E4.',\n      '\uD574\uACB0\uC548\uC740 \uC810\uD3EC\uC640 SV\uC758 \uAD8C\uD55C \uBC94\uC704\uC5D0\uC11C \uC81C\uC2DC\uD55C\uB2E4. \uD658\uBD88\xB7\uC7AC\uC81C\uACF5\xB7\uCD94\uAC00 \uC870\uCE58\uC758 \uAC00\uB2A5 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0 \uACE0\uAC1D\uC5D0\uAC8C \uB2E4\uC74C \uC5F0\uB77D \uC2DC\uC810\uACFC \uB2F4\uB2F9\uC790\uB97C \uC54C\uB824\uC900\uB2E4.',\n      '\uBCF8\uC0AC \uBCF4\uACE0\uC5D0\uB294 \uD655\uC778 \uC0AC\uC2E4, \uC544\uC9C1 \uBAA8\uB974\uB294 \uC810, \uACE0\uAC1D \uC0C1\uD0DC, \uC2DC\uD589\uD55C \uC870\uCE58, \uD544\uC694\uD55C \uACB0\uC815\uC744 \uBD84\uB9AC\uD574 \uC801\uB294\uB2E4. \uACF5\uAC1C \uCC44\uB110\uC5D0\uC11C\uB294 \uAC1C\uC778\uC815\uBCF4\uB098 \uD655\uC778\uB418\uC9C0 \uC54A\uC740 \uC6D0\uC778\uC744 \uB178\uCD9C\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC0AC\uAC74\uC774 \uB2EB\uD78C \uB4A4\uC5D0\uB3C4 \uACE0\uAC1D\uC774 \uACB0\uACFC\uB97C \uBC1B\uC558\uB294\uC9C0 \uD655\uC778\uD55C\uB2E4. \uBC18\uBCF5 \uC6D0\uC778\uC774 \uC81C\uC870\xB7\uAC80\uC218\xB7\uC751\uB300 \uC911 \uC5B4\uB514\uC5D0 \uC788\uB294\uC9C0 \uCC3E\uC544 \uC808\uCC28\uB97C \uBC14\uAFB8\uACE0 \uC7AC\uBC1C \uC5EC\uBD80\uB97C \uCD94\uC801\uD55C\uB2E4.'\n    ],\n    task: ['\uACE0\uAC1D\uC5D0\uAC8C \uD560 \uCCAB \uB2F5\uBCC0\uC744 \uACF5\uAC10\xB7\uC0AC\uC2E4 \uD655\uC778\xB7\uB2E4\uC74C \uC548\uB0B4\uC758 \uC21C\uC11C\uB85C \uC791\uC131\uD55C\uB2E4.', '\uC0AC\uC2E4 \uD655\uC778 \uBAA9\uB85D\uACFC \uC989\uC2DC \uBCF4\uACE0 \uB300\uC0C1\xB7\uB2F4\uB2F9\uC790\uB97C \uC815\uD55C\uB2E4.', '\uC7AC\uBC1C \uBC29\uC9C0\uB97C \uC704\uD55C \uC791\uC5C5 \uC808\uCC28 \uD55C \uAC00\uC9C0\uC640 \uD655\uC778 \uC9C0\uD45C\uB97C \uC81C\uC2DC\uD55C\uB2E4.'],\n    check: [['\uC6D0\uC778 \uD655\uC778 \uC804 \u201C\uB9E4\uC7A5 \uC2E4\uC218\u201D\uB77C\uACE0 \uB9D0\uD574\uB3C4 \uB418\uB098\uC694?', '\uD655\uC778\uB41C \uBD88\uD3B8\uC740 \uC778\uC815\uD558\uB418 \uC6D0\uC778\uACFC \uCC45\uC784\uC740 \uC0AC\uC2E4 \uD655\uC778 \uC804 \uB2E8\uC815\uD558\uC9C0 \uC54A\uB294\uB2E4.'], ['\uACE0\uAC1D \uBD88\uB9CC\uC744 \uC644\uB8CC\uB85C \uBCF4\uB294 \uB54C\uB294?', '\uD574\uACB0 \uACB0\uACFC \uC804\uB2EC\uACFC \uD6C4\uC18D \uD655\uC778, \uC7AC\uBC1C \uBC29\uC9C0 \uC870\uCE58\uAE4C\uC9C0 \uAE30\uB85D\uD588\uC744 \uB54C\uB2E4.']]\n  },\n  17: {\n    scenario: '\uB0C9\uC7A5 \uC7A5\uBE44 \uACBD\uACE0\uAC00 \uC788\uC5C8\uC9C0\uB9CC \uC601\uC5C5\uC744 \uACC4\uC18D\uD588\uACE0, \uAC19\uC740 \uC2DC\uAC04\uB300 \uD310\uB9E4 \uC81C\uD488\uC5D0 \uB300\uD574 \uACE0\uAC1D\uC774 \uC774\uC0C1 \uC99D\uC0C1\uC744 \uBB38\uC758\uD55C\uB2E4.',\n    teaching: [\n      '\uC2DD\uD488\uC548\uC804\uC740 \uC0AC\uACE0\uAC00 \uBC1C\uC0DD\uD55C \uB4A4\uBCF4\uB2E4 \uC704\uD5D8\uC744 \uBBF8\uB9AC \uBC1C\uACAC\uD558\uACE0 \uD1B5\uC81C\uD558\uB294 \uCCB4\uACC4\uB2E4. \uC6D0\uC7AC\uB8CC, \uBCF4\uAD00, \uC81C\uC870, \uC81C\uACF5 \uC911 \uC5B4\uB290 \uB2E8\uACC4\uC5D0\uC11C \uC704\uD574\uAC00 \uC0DD\uAE38 \uC218 \uC788\uB294\uC9C0 \uD750\uB984\uC5D0 \uB530\uB77C \uC0B4\uD540\uB2E4.',\n      '\uC785\uACE0 \uC0C1\uD0DC\uC640 \uBCF4\uAD00 \uAE30\uB85D, \uC81C\uD488 \uD45C\uC2DC, \uC7A5\uBE44 \uC0C1\uD0DC\uB97C \uB300\uC870\uD55C\uB2E4. \uC218\uCE58 \uAE30\uC900\uACFC \uD3D0\uAE30\xB7\uD310\uB9E4 \uC911\uC9C0 \uD310\uB2E8\uC740 \uBE0C\uB79C\uB4DC\uC758 \uCD5C\uC2E0 \uC2DD\uD488\uC548\uC804 \uC808\uCC28\uC640 \uAD00\uD560 \uADDC\uC815\uC744 \uD655\uC778\uD574 \uC801\uC6A9\uD55C\uB2E4.',\n      '\uAD50\uCC28\uC624\uC5FC\uC740 \uC6D0\uC7AC\uB8CC\uC640 \uC644\uC131\uD488, \uB3C4\uAD6C, \uC190, \uC791\uC5C5\uB300 \uC0AC\uC774\uC5D0\uC11C \uBC1C\uC0DD\uD55C\uB2E4. \uC791\uC5C5 \uB3D9\uC120\uC744 \uAD00\uCC30\uD558\uACE0 \uC190\uC53B\uAE30\xB7\uB3C4\uAD6C \uAD6C\uBD84\xB7\uAC1C\uC778\uC704\uC0DD \uD589\uB3D9\uC774 \uC2E4\uC81C \uD53C\uD06C \uC0C1\uD669\uC5D0\uB3C4 \uC9C0\uCF1C\uC9C0\uB294\uC9C0 \uBCF8\uB2E4.',\n      '\uCCAD\uC18C\uC640 \uC18C\uB3C5\uC740 \uB300\uC0C1, \uBC29\uBC95, \uC57D\uD488, \uB2F4\uB2F9\uC790, \uC8FC\uAE30\uAC00 \uB2EC\uB77C\uC57C \uD55C\uB2E4. \uCCAD\uC18C\uD45C\uC5D0 \uC11C\uBA85\uC774 \uC788\uB2E4\uB294 \uC0AC\uC2E4\uB9CC\uC73C\uB85C \uCDA9\uBD84\uD558\uC9C0 \uC54A\uC73C\uBBC0\uB85C \uC811\uCD09\uBA74 \uC0C1\uD0DC\uC640 \uC0AC\uC6A9 \uBC29\uBC95\uC744 \uD655\uC778\uD55C\uB2E4.',\n      '\uC0AC\uACE0\uAC00 \uC758\uC2EC\uB418\uBA74 \uAD00\uB828 \uC81C\uD488\uACFC \uC790\uB8CC\uB97C \uBCF4\uC874\uD558\uACE0 \uD310\uB9E4\xB7\uC81C\uACF5 \uC9C0\uC18D \uC5EC\uBD80\uB97C \uC989\uC2DC \uCC45\uC784\uC790\uC5D0\uAC8C \uBCF4\uACE0\uD55C\uB2E4. \uACE0\uAC1D\uC758 \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uBA70 \uBE0C\uB79C\uB4DC \uC0AC\uACE0 \uB300\uC751 \uC808\uCC28\uC640 \uAD00\uACC4 \uAE30\uAD00 \uC548\uB0B4\uB97C \uB530\uB978\uB2E4.',\n      '\uC870\uC0AC \uB2E8\uACC4\uC5D0\uB294 \uC2DC\uAC04\uD45C, \uC81C\uD488\xB7\uC785\uACE0 \uAE30\uB85D, \uC7A5\uBE44 \uAE30\uB85D, \uC9C1\uC6D0 \uC9C4\uC220\uC744 \uAC1D\uAD00\uC801\uC73C\uB85C \uC81C\uACF5\uD55C\uB2E4. \uC6D0\uC778 \uD655\uC815 \uC804 \uCD94\uCE21\uC744 \uACF5\uC720\uD558\uC9C0 \uC54A\uACE0 \uC870\uCE58 \uD6C4 \uAC19\uC740 \uC704\uD5D8\uC774 \uC7AC\uBC1C\uD558\uC9C0 \uC54A\uB294\uC9C0 \uD655\uC778\uD55C\uB2E4.'\n    ],\n    task: ['\uC0AC\uB840\uC5D0\uC11C \uC989\uC2DC \uBCF4\uD638\uD574\uC57C \uD560 \uACE0\uAC1D\xB7\uC81C\uD488\xB7\uAE30\uB85D\uC744 \uAD6C\uBD84\uD55C\uB2E4.', '\uCD08\uAE30 \uBCF4\uACE0\uC11C\uC5D0 \uC0AC\uC2E4, \uBBF8\uD655\uC778 \uC0AC\uD56D, \uC2DC\uD589\uD55C \uC870\uCE58\uB97C \uB098\uB204\uC5B4 \uC4F4\uB2E4.', '\uC7A5\uBE44\uC640 \uBCF4\uAD00 \uC808\uCC28\uC758 \uC7AC\uBC1C \uBC29\uC9C0 \uC810\uAC80 \uD56D\uBAA9\uC744 \uB9CC\uB4E0\uB2E4.'],\n    check: [['\uC7A5\uBE44 \uC774\uC0C1\uACFC \uAC74\uAC15 \uBB38\uC758\uAC00 \uACB9\uCE58\uBA74 \uBB34\uC5C7\uC744 \uC6B0\uC120\uD558\uB098\uC694?', '\uAD00\uB828 \uC81C\uD488\uC758 \uC704\uD5D8 \uD655\uC0B0\uC744 \uB9C9\uACE0 \uACE0\uAC1D \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uBA70 \uC989\uC2DC \uC815\uD574\uC9C4 \uBCF4\uACE0 \uCCB4\uACC4\uB97C \uAC00\uB3D9\uD55C\uB2E4.'], ['\uCCAD\uC18C\uD45C \uC11C\uBA85\uB9CC\uC73C\uB85C \uC704\uC0DD \uC801\uD569\uC744 \uD310\uB2E8\uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC2E4\uC81C \uC0C1\uD0DC\uC640 \uBC29\uBC95, \uBC18\uBCF5 \uC900\uC218 \uC5EC\uBD80\uB97C \uD655\uC778\uD55C\uB2E4.']]\n  },\n  18: {\n    scenario: '\uB0C9\uC7A5 \uC1FC\uCF00\uC774\uC2A4\uAC00 \uC790\uC8FC \uBA48\uCD94\uACE0 \uCD9C\uC785\uBB38 \uB2EB\uD798\uB3C4 \uBD88\uB7C9\uD558\uC9C0\uB9CC \uC810\uD3EC\uB294 \uC784\uC2DC \uC870\uCE58\uB85C \uC601\uC5C5 \uC911\uC774\uB2E4.',\n    teaching: [\n      '\uC2DC\uC124\uACFC \uC7A5\uBE44\uB97C \uACE0\uAC1D \uACBD\uD5D8, \uC81C\uD488 \uD488\uC9C8, \uC9C1\uC6D0 \uC548\uC804\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uC73C\uB85C \uBD84\uB958\uD55C\uB2E4. \uC7A5\uBE44 \uBAA9\uB85D\uACFC \uAD00\uB9AC \uC8FC\uCCB4, \uBCF4\uC99D\xB7\uC218\uB9AC \uC5F0\uB77D \uCC3D\uAD6C\uB97C \uC54C\uC544\uB450\uBA74 \uBB38\uC81C\uAC00 \uC0DD\uACBC\uC744 \uB54C \uB300\uC751\uC774 \uBE68\uB77C\uC9C4\uB2E4.',\n      '\uC774\uC0C1 \uC9D5\uD6C4\uB294 \uC18C\uC74C, \uC628\uB3C4\xB7\uC131\uB2A5 \uBCC0\uD654, \uB204\uC218, \uD30C\uC190, \uBC18\uBCF5 \uACBD\uACE0\uCC98\uB7FC \uC791\uAC8C \uC2DC\uC791\uB41C\uB2E4. \uBC1C\uC0DD \uC2DC\uAC01\uACFC \uC0AC\uC6A9 \uC870\uAC74\uC744 \uAE30\uB85D\uD574 \uC77C\uC2DC\uC801 \uC99D\uC0C1\uC778\uC9C0 \uBC18\uBCF5 \uBB38\uC81C\uC778\uC9C0 \uD310\uB2E8\uD55C\uB2E4.',\n      '\uC608\uBC29 \uAD00\uB9AC\uB294 \uC0AC\uC6A9\uBC95 \uAD50\uC721, \uC77C\uC0C1 \uCCAD\uC18C, \uC810\uAC80 \uC8FC\uAE30, \uC18C\uBAA8\uD488 \uAD50\uCCB4, \uC815\uAE30 \uC218\uB9AC\uB97C \uD3EC\uD568\uD55C\uB2E4. \u201C\uACE0\uC7A5 \uB098\uBA74 \uC218\uB9AC\u201D \uBC29\uC2DD\uBCF4\uB2E4 \uC5C5\uBB34 \uC911\uB2E8\uACFC \uC81C\uD488 \uC190\uC2E4\uC744 \uC904\uC774\uB294 \uAC83\uC774 \uBAA9\uD45C\uB2E4.',\n      '\uC218\uB9AC \uC694\uCCAD\uC5D0\uB294 \uC7A5\uBE44 \uC2DD\uBCC4 \uC815\uBCF4, \uC99D\uC0C1, \uCD5C\uCD08 \uBC1C\uC0DD, \uC0AC\uC9C4, \uC6B4\uC601 \uC601\uD5A5\uC744 \uC801\uB294\uB2E4. \uC811\uC218 \uC774\uD6C4 \uC77C\uC815\uACFC \uC784\uC2DC \uC870\uCE58, \uC644\uB8CC \uD6C4 \uC815\uC0C1 \uC791\uB3D9 \uD655\uC778\uAE4C\uC9C0 \uD55C \uAC74\uC73C\uB85C \uAD00\uB9AC\uD55C\uB2E4.',\n      '\uACE0\uC7A5 \uC911\uC5D0\uB294 \uACE0\uAC1D\uACFC \uC9C1\uC6D0 \uC548\uC804\uC744 \uBA3C\uC800 \uACE0\uB824\uD55C\uB2E4. \uD574\uB2F9 \uC7A5\uBE44\uC5D0 \uC758\uC874\uD558\uB294 \uC81C\uD488\uC758 \uD310\uB9E4\xB7\uBCF4\uAD00 \uC9C0\uC18D \uAC00\uB2A5 \uC5EC\uBD80\uB294 \uBE0C\uB79C\uB4DC \uAE30\uC900\uACFC \uB2F4\uB2F9 \uBD80\uC11C \uD310\uB2E8\uC5D0 \uB530\uB978\uB2E4.',\n      '\uC810\uD3EC \uD658\uACBD\uC740 \uC870\uBA85, \uB0C4\uC0C8, \uB3D9\uC120, \uC548\uB0B4\uBB3C, \uC678\uBD80 \uD30C\uC190\uAE4C\uC9C0 \uD3EC\uD568\uD55C\uB2E4. \uACE0\uAC1D\uC774 \uC785\uC7A5\uBD80\uD130 \uD1F4\uC810\uAE4C\uC9C0 \uC5B4\uB514\uC5D0\uC11C \uBD88\uD3B8\uC744 \uB290\uB07C\uB294\uC9C0 \uC9C1\uC811 \uAC78\uC5B4 \uBCF4\uACE0 \uAC1C\uC120 \uC6B0\uC120\uC21C\uC704\uB97C \uC815\uD55C\uB2E4.'\n    ],\n    task: ['\uC7A5\uBE44 \uB450 \uAC74\uC744 \uACE0\uAC1D\xB7\uC548\uC804\xB7\uC6B4\uC601 \uC601\uD5A5\uC73C\uB85C \uC6B0\uC120\uC21C\uC704\uD654\uD55C\uB2E4.', '\uC218\uB9AC \uC694\uCCAD\uC11C\uC5D0 \uC99D\uC0C1\xB7\uC2DC\uAC04\xB7\uC0AC\uC9C4\xB7\uC784\uC2DC \uC870\uCE58\xB7\uC644\uB8CC \uD655\uC778 \uAE30\uC900\uC744 \uC4F4\uB2E4.', '\uACE0\uAC1D \uB3D9\uC120\uC744 \uB530\uB77C \uC2DC\uC124\xB7\uD658\uACBD \uAC1C\uC120 \uD56D\uBAA9 3\uAC1C\uB97C \uCC3E\uB294\uB2E4.'],\n    check: [['\uC218\uB9AC \uC811\uC218\uB9CC \uD558\uBA74 \uACFC\uC81C\uAC00 \uB05D\uB098\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC77C\uC815, \uC784\uC2DC \uB300\uC751, \uC218\uB9AC \uACB0\uACFC\uC640 \uC815\uC0C1 \uC791\uB3D9\uC744 \uD655\uC778\uD574\uC57C \uD55C\uB2E4.'], ['\uC784\uC2DC \uC601\uC5C5\uC744 \uACB0\uC815\uD560 \uB54C \uBA3C\uC800 \uBCFC \uAC83\uC740?', '\uACE0\uAC1D\uACFC \uC9C1\uC6D0 \uC548\uC804, \uC81C\uD488 \uD488\uC9C8, \uBE0C\uB79C\uB4DC\uC758 \uC6B4\uC601\xB7\uD310\uB9E4 \uAE30\uC900\uC774\uB2E4.']]\n  },\n  19: {\n    scenario: '\uC624\uD508 \uC77C\uC8FC\uC77C \uC804\uC778\uB370 \uC77C\uBD80 \uC7A5\uBE44\uC758 \uC124\uCE58\uC77C\uC774 \uBBF8\uC815\uC774\uACE0 POS \uBA54\uB274 \uB4F1\uB85D\uACFC \uC9C1\uC6D0 \uAD50\uC721\uB3C4 \uB05D\uB098\uC9C0 \uC54A\uC558\uB2E4.',\n    teaching: [\n      '\uC624\uD508 \uC900\uBE44\uB294 \uACF5\uC0AC, \uC124\uBE44, \uC2DC\uC2A4\uD15C, \uC0C1\uD488, \uC778\uB825, \uB9C8\uCF00\uD305\uC774 \uC11C\uB85C \uC5F0\uACB0\uB41C \uC77C\uC815\uC774\uB2E4. \uAC01 \uD56D\uBAA9\uC758 \uCC45\uC784\uC790\uC640 \uC644\uB8CC \uAE30\uC900, \uC120\uD589 \uC870\uAC74\uC744 \uD45C\uC2DC\uD574 \uD55C \uC791\uC5C5\uC758 \uC9C0\uC5F0\uC774 \uC804\uCCB4 \uC77C\uC815\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uC744 \uBCF8\uB2E4.',\n      '\uC2DC\uC124 \uC900\uACF5\uACFC \uC7A5\uBE44 \uC791\uB3D9, \uC778\uD130\uB137\xB7POS\xB7\uACB0\uC81C, \uC548\uB0B4\uBB3C, \uACE0\uAC1D \uB3D9\uC120\uC744 \uC2E4\uC81C \uC6B4\uC601 \uC21C\uC11C\uB85C \uC2DC\uD5D8\uD55C\uB2E4. \u201C\uC124\uCE58\uB428\u201D\uACFC \u201C\uC601\uC5C5 \uC911 \uC0AC\uC6A9 \uAC00\uB2A5\uD568\u201D\uC740 \uBCC4\uB3C4\uC758 \uD655\uC778\uC774\uB2E4.',\n      '\uCD08\uB3C4 \uBC1C\uC8FC\uB7C9\uC740 \uC608\uC0C1 \uD310\uB9E4\uB7C9\uACFC \uBCF4\uAD00 \uB2A5\uB825\uC744 \uD568\uAED8 \uACE0\uB824\uD55C\uB2E4. \uC9C1\uC6D0\uC740 \uBA54\uB274 \uC81C\uC870\uBFD0 \uC544\uB2C8\uB77C \uC8FC\uBB38 \uC624\uB958, \uACE0\uAC1D \uC548\uB0B4, \uB9C8\uAC10\xB7\uC778\uACC4 \uC0C1\uD669\uAE4C\uC9C0 \uC5F0\uC2B5\uD574\uC57C \uD55C\uB2E4.',\n      '\uAC00\uC624\uD508\uC5D0\uC11C\uB294 \uC2E4\uC81C \uC8FC\uBB38\uC744 \uBC1B\uC544 \uC811\uC218\xB7\uC81C\uC870\xB7\uC81C\uACF5\xB7\uACB0\uC81C\uB97C \uB05D\uAE4C\uC9C0 \uC2DC\uBBAC\uB808\uC774\uC158\uD55C\uB2E4. \uBC1C\uACAC\uB41C \uBB38\uC81C\uB294 \uC2EC\uAC01\uB3C4\uC5D0 \uB530\uB77C \uC624\uD508 \uC804 \uD544\uC218 \uC218\uC815\uACFC \uCD08\uAE30 \uC6B4\uC601 \uC911 \uAC1C\uC120\uC73C\uB85C \uB098\uB208\uB2E4.',\n      '\uC624\uD508 \uB2F9\uC77C SV\uB294 \uBAA8\uB4E0 \uC5C5\uBB34\uB97C \uB300\uC2E0 \uC218\uD589\uD558\uAE30\uBCF4\uB2E4 \uD604\uC7A5 \uCC45\uC784\uACFC \uBCF4\uACE0\uC120\uC744 \uBD84\uBA85\uD788 \uD55C\uB2E4. \uD53C\uD06C \uBCD1\uBAA9, \uACE0\uAC1D \uBD88\uB9CC, \uD488\uC808, \uC2DC\uC2A4\uD15C \uC7A5\uC560\uB97C \uAE30\uB85D\uD558\uACE0 \uC989\uC2DC \uC870\uCE58\uAC00 \uD544\uC694\uD55C \uC77C\uC744 \uBA3C\uC800 \uCC98\uB9AC\uD55C\uB2E4.',\n      '\uCD08\uAE30 \uC548\uC815\uD654\uB294 \uC624\uD508 \uCCAB\uB0A0 \uB9E4\uCD9C\uBCF4\uB2E4 \uBC18\uBCF5 \uAC00\uB2A5\uD55C \uC6B4\uC601 \uC0C1\uD0DC\uB97C \uB9CC\uB4DC\uB294 \uACFC\uC815\uC774\uB2E4. \uC77C\uC815 \uAE30\uAC04 QSC, \uC8FC\uBB38 \uC624\uB958, \uC7AC\uACE0, \uC778\uB825 \uC219\uB828, \uACE0\uAC1D \uBC18\uC751\uC744 \uC9E7\uC740 \uC8FC\uAE30\uB85C \uD655\uC778\uD55C\uB2E4.'\n    ],\n    task: ['\uC624\uD508 \uC804 \uB0A8\uC740 \uD56D\uBAA9\uC744 \uD544\uC218\xB7\uC870\uAC74\uBD80\xB7\uD6C4\uC18D\uC73C\uB85C \uBD84\uB958\uD55C\uB2E4.', '\uAC00\uC624\uD508 \uC2DC\uB098\uB9AC\uC624 3\uAC1C\uC640 \uD569\uACA9 \uAE30\uC900\uC744 \uB9CC\uB4E0\uB2E4.', '\uC624\uD508 \uCCAB \uC8FC\uC758 \uC77C\uC77C \uC810\uAC80 \uC9C0\uD45C\uC640 \uBCF4\uACE0 \uB2F4\uB2F9\uC790\uB97C \uC815\uD55C\uB2E4.'],\n    check: [['\uC7A5\uBE44\uAC00 \uC124\uCE58\uB418\uC5C8\uC73C\uBA74 \uC900\uBE44 \uC644\uB8CC\uC778\uAC00\uC694?', '\uC2E4\uC81C \uC601\uC5C5 \uD750\uB984\uC5D0\uC11C \uC815\uC0C1 \uC791\uB3D9\uC744 \uD655\uC778\uD574\uC57C \uD55C\uB2E4.'], ['\uAC00\uC624\uD508\uC5D0\uC11C \uBC1C\uACAC\uD55C \uBB38\uC81C\uB97C \uBAA8\uB450 \uAC19\uC740 \uBC29\uC2DD\uC73C\uB85C \uCC98\uB9AC\uD558\uB098\uC694?', '\uACE0\uAC1D\xB7\uC548\uC804\xB7\uC601\uC5C5 \uC601\uD5A5\uC5D0 \uB530\uB77C \uC624\uD508 \uC804 \uD544\uC218 \uC218\uC815\uACFC \uD6C4\uC18D \uAC1C\uC120\uC73C\uB85C \uB098\uB208\uB2E4.']]\n  },\n  20: {\n    scenario: '\uBCF8\uC0AC\uC5D0\uC11C \uC0C8 \uD3EC\uC7A5 \uAE30\uC900\uC744 \uB2E4\uC74C \uB2EC \uC801\uC6A9\uD558\uB77C\uACE0 \uACF5\uC9C0\uD588\uC9C0\uB9CC \uC810\uD3EC\uB9C8\uB2E4 \uC7AC\uACE0\uC640 \uAD50\uC721 \uC900\uBE44\uAC00 \uB2E4\uB974\uB2E4.',\n    teaching: [\n      '\uC815\uCC45 \uBB38\uC11C\uB97C \uC77D\uC744 \uB54C \uBAA9\uC801, \uC801\uC6A9 \uB300\uC0C1, \uC2DC\uD589\uC77C, \uBCC0\uACBD \uC804\uD6C4 \uD589\uB3D9, \uC608\uC678 \uAE30\uC900\uC744 \uBA3C\uC800 \uD45C\uC2DC\uD55C\uB2E4. \uD604\uC7A5 \uC124\uBA85\uC5D0\uC11C\uB294 \uC810\uD3EC\uAC00 \uC2E4\uC81C\uB85C \uBB34\uC5C7\uC744 \uD574\uC57C \uD558\uB294\uC9C0 \uBB38\uC7A5\uC73C\uB85C \uBC14\uAFBC\uB2E4.',\n      '\uC2E4\uD589\uACC4\uD68D\uC5D0\uB294 \uC790\uC7AC \uD655\uBCF4, \uC2DC\uC2A4\uD15C \uBCC0\uACBD, \uC9C1\uC6D0 \uAD50\uC721, \uACE0\uAC1D \uC548\uB0B4, \uD655\uC778 \uC77C\uC815\uACFC \uB2F4\uB2F9\uC790\uB97C \uB123\uB294\uB2E4. \uC911\uC559 \uC77C\uC815\uB9CC \uC804\uB2EC\uD558\uC9C0 \uB9D0\uACE0 \uC810\uD3EC\uBCC4 \uC900\uBE44\uC5D0 \uD544\uC694\uD55C \uC2DC\uAC04\uC744 \uC5ED\uC0B0\uD55C\uB2E4.',\n      '\uC810\uC8FC\uC5D0\uAC8C\uB294 \uC815\uCC45 \uCDE8\uC9C0\uC640 \uC608\uC0C1 \uBE44\uC6A9\xB7\uC791\uC5C5 \uBCC0\uD654\uB97C \uC194\uC9C1\uD558\uAC8C \uC124\uBA85\uD55C\uB2E4. \uC9C1\uC6D0\uC5D0\uAC8C\uB294 \uBCC0\uACBD\uB41C \uB3D9\uC791\uC744 \uC2DC\uBC94\uC73C\uB85C \uBCF4\uC5EC \uC8FC\uACE0 \uBC18\uBCF5 \uC9C8\uBB38\uC744 FAQ\uC5D0 \uBAA8\uC740\uB2E4.',\n      '\uC2DC\uD589 \uC804 \uC900\uBE44\uB3C4\uB97C \uC810\uD3EC\uBCC4\uB85C \uD45C\uC2DC\uD55C\uB2E4. \uC790\uC7AC \uBBF8\uC785\uACE0, POS \uBBF8\uBCC0\uACBD, \uAD50\uC721 \uBBF8\uC644\uB8CC\uCC98\uB7FC \uC6D0\uC778\uC774 \uB2E4\uB978 \uBBF8\uC900\uBE44\uB97C \uD558\uB098\uC758 \u201C\uC9C4\uD589 \uC911\u201D\uC73C\uB85C \uBB36\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC2DC\uD589\uC77C\uC5D0\uB294 \uC801\uC6A9 \uC5EC\uBD80\uC640 \uACE0\uAC1D \uBC18\uC751, \uC6B4\uC601 \uC7A5\uC560\uB97C \uD655\uC778\uD55C\uB2E4. \uC608\uC678 \uC694\uCCAD\uC740 \uADFC\uAC70\uC640 \uC601\uD5A5, \uC2B9\uC778 \uACB0\uACFC\uB97C \uAE30\uB85D\uD558\uACE0 \uC2B9\uC778 \uC804 \uAD00\uD589\uC73C\uB85C \uD655\uB300\uB418\uC9C0 \uC54A\uAC8C \uAD00\uB9AC\uD55C\uB2E4.',\n      '\uACB0\uACFC \uD3C9\uAC00\uB294 \uBC30\uD3EC\uC728\uB9CC\uC774 \uC544\uB2C8\uB77C \uAE30\uC900 \uC900\uC218, \uC624\uB958, \uBE44\uC6A9, \uACE0\uAC1D \uC601\uD5A5\uAE4C\uC9C0 \uBCF8\uB2E4. \uB2E4\uC74C \uD504\uB85C\uC81D\uD2B8\uC5D0 \uC4F8 \uC218 \uC788\uB3C4\uB85D \uC9C0\uC5F0 \uC6D0\uC778\uACFC \uD6A8\uACFC\uC801\uC778 \uC9C0\uC6D0 \uBC29\uBC95\uC744 \uC815\uB9AC\uD55C\uB2E4.'\n    ],\n    task: ['\uACF5\uC9C0\uC5D0\uC11C \uB300\uC0C1\xB7\uC2DC\uD589\uC77C\xB7\uBCC0\uACBD \uD589\uB3D9\xB7\uC608\uC678 \uAE30\uC900\uC744 \uCD94\uCD9C\uD55C\uB2E4.', '\uC810\uD3EC\uBCC4 \uC900\uBE44\uB3C4 \uD45C\uC640 \uBBF8\uC644\uB8CC \uD56D\uBAA9\uBCC4 \uC9C0\uC6D0 \uACC4\uD68D\uC744 \uB9CC\uB4E0\uB2E4.', '\uC2DC\uD589 \uD6C4 1\uC8FC\uC5D0 \uD655\uC778\uD560 \uC9C0\uD45C\uC640 \uBCF4\uACE0 \uD615\uC2DD\uC744 \uC815\uD55C\uB2E4.'],\n    check: [['\uACF5\uC9C0 \uC804\uB2EC\uB9CC\uC73C\uB85C \uC815\uCC45 \uC2E4\uD589\uC774 \uC644\uB8CC\uB418\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC790\uC7AC\xB7\uC2DC\uC2A4\uD15C\xB7\uAD50\uC721 \uC900\uBE44\uC640 \uC2DC\uD589 \uD6C4 \uC2E4\uC81C \uC900\uC218\uAE4C\uC9C0 \uD655\uC778\uD574\uC57C \uD55C\uB2E4.'], ['\uC608\uC678 \uC694\uCCAD\uC740 \uC5B4\uB5BB\uAC8C \uCC98\uB9AC\uD558\uB098\uC694?', '\uC0AC\uC720\uC640 \uC601\uD5A5\uC744 \uAE30\uB85D\uD574 \uC815\uD574\uC9C4 \uC2B9\uC778\uAD8C\uC790\uC5D0\uAC8C \uC694\uCCAD\uD558\uACE0 \uACB0\uACFC\uB97C \uB0A8\uAE34\uB2E4.']]\n  },\n  21: {\n    scenario: '\uC810\uC8FC\uAC00 \uBE0C\uB79C\uB4DC \uC9C0\uC815 \uC6D0\uC7AC\uB8CC \uC0AC\uC6A9 \uAE30\uC900\uC5D0 \uBC18\uBC1C\uD558\uBA70 \uACFC\uAC70 SV\uC758 \uAD6C\uB450 \uD5C8\uC6A9\uC744 \uADFC\uAC70\uB85C \uC81C\uC2DC\uD55C\uB2E4.',\n    teaching: [\n      '\uAC08\uB4F1\uC740 \uAE30\uC900 \uC790\uCCB4, \uBE44\uC6A9 \uBD80\uB2F4, \uACFC\uAC70 \uC57D\uC18D, \uC804\uB2EC \uBC29\uC2DD\uC774 \uACB9\uCCD0 \uBC1C\uC0DD\uD55C\uB2E4. \uC0C1\uB300\uB97C \u201C\uBE44\uD611\uC870\uC801\u201D\uC774\uB77C\uACE0 \uADDC\uC815\uD558\uAE30 \uC804\uC5D0 \uC7C1\uC810\uC744 \uB098\uB220 \uAC01\uAC01 \uD655\uC778\uD55C\uB2E4.',\n      '\uD604\uC7AC \uC0AC\uC6A9 \uC0C1\uD0DC, \uC801\uC6A9 \uC815\uCC45, \uACF5\uC9C0 \uAE30\uB85D, \uACFC\uAC70 \uCEE4\uBBA4\uB2C8\uCF00\uC774\uC158\uC744 \uC2DC\uAC04 \uC21C\uC11C\uB85C \uC815\uB9AC\uD55C\uB2E4. \uAE30\uC5B5\uACFC \uD574\uC11D\uC774 \uB2E4\uB978 \uBD80\uBD84\uC740 \uC0AC\uC2E4\uB85C \uB2E8\uC815\uD558\uC9C0 \uC54A\uACE0 \uCD94\uAC00 \uD655\uC778 \uB300\uC0C1\uC73C\uB85C \uB0A8\uAE34\uB2E4.',\n      '\uBBF8\uC900\uC218\uC758 \uC6D0\uC778\uC774 \uAE30\uC900 \uBBF8\uC778\uC9C0\uC778\uC9C0, \uACF5\uAE09 \uBB38\uC81C\uC778\uC9C0, \uBE44\uC6A9 \uBD80\uB2F4\uC778\uC9C0, \uC758\uB3C4\uC801\uC778 \uAC70\uBD80\uC778\uC9C0\uC5D0 \uB530\uB77C \uC9C0\uC6D0\uACFC \uB300\uC751\uC774 \uB2EC\uB77C\uC9C4\uB2E4. \uC810\uC8FC\uC758 \uC124\uBA85\uC744 \uB4E3\uB418 \uAE30\uC900\uC758 \uC801\uC6A9 \uC5EC\uBD80\uB294 \uBB38\uC11C\uB85C \uD655\uC778\uD55C\uB2E4.',\n      '\uC2DC\uC815 \uD611\uC758\uC5D0\uB294 \uD544\uC694\uD55C \uD589\uB3D9, \uC9C0\uC6D0 \uAC00\uB2A5 \uBC94\uC704, \uC644\uB8CC \uAE30\uD55C, \uD655\uC778 \uBC29\uBC95\uC744 \uB123\uB294\uB2E4. \uACBD\uACE0\uB9CC \uBC18\uBCF5\uD558\uC9C0 \uB9D0\uACE0 \uC2E4\uC81C \uC900\uC218\uB97C \uB9C9\uB294 \uC7A5\uC560\uB97C \uD568\uAED8 \uD574\uACB0\uD55C\uB2E4.',\n      '\uBC18\uBCF5 \uBBF8\uC900\uC218\uB294 \uC774\uC804 \uC548\uB0B4\xB7\uC9C0\uC6D0\xB7\uC57D\uC18D\xB7\uD655\uC778 \uACB0\uACFC\uB97C \uB204\uC801\uD574 \uB2F4\uB2F9 \uBD80\uC11C\uC5D0 \uBCF4\uACE0\uD55C\uB2E4. \uACC4\uC57D\uC0C1 \uC870\uCE58\uAC00 \uD544\uC694\uD55C\uC9C0 SV\uAC00 \uD63C\uC790 \uD310\uB2E8\uD558\uC9C0 \uC54A\uACE0 \uC815\uD574\uC9C4 \uC808\uCC28\uB97C \uB530\uB978\uB2E4.',\n      '\uC7C1\uC810\uC774 \uC815\uB9AC\uB41C \uB4A4\uC5D0\uB3C4 \uB2E4\uC74C \uBA74\uB2F4\uC758 \uBAA9\uC801\uACFC \uC18C\uD1B5 \uBC29\uC2DD\uC744 \uD569\uC758\uD55C\uB2E4. \uAD00\uACC4 \uD68C\uBCF5\uC740 \uAE30\uC900\uC744 \uC5C6\uC560\uB294 \uAC83\uC774 \uC544\uB2C8\uB77C \uAC19\uC740 \uC0AC\uC2E4\uACFC \uC808\uCC28\uB97C \uACF5\uC720\uD558\uB294 \uB370\uC11C \uC2DC\uC791\uD55C\uB2E4.'\n    ],\n    task: ['\uC0AC\uB840\uC758 \uC0AC\uC2E4\xB7\uC8FC\uC7A5\xB7\uBBF8\uD655\uC778 \uC0AC\uD56D\uC744 \uC138 \uCE78\uC73C\uB85C \uBD84\uB9AC\uD55C\uB2E4.', '\uBBF8\uC900\uC218 \uC6D0\uC778\uC744 \uD655\uC778\uD560 \uC9C8\uBB38\uACFC \uC9C0\uC6D0 \uAC00\uB2A5\uD55C \uB300\uC548\uC744 \uC791\uC131\uD55C\uB2E4.', '\uC2DC\uC815 \uACC4\uD68D\uACFC \uB2E4\uC74C \uBA74\uB2F4 \uC2DC\uC810\uC744 \uAE30\uB85D\uD55C\uB2E4.'],\n    check: [['\uACFC\uAC70 \uAD6C\uB450 \uD5C8\uC6A9 \uC8FC\uC7A5\uB9CC\uC73C\uB85C \uC608\uC678\uB97C \uC778\uC815\uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uB2F9\uC2DC \uAE30\uB85D, \uAD8C\uD55C, \uD604\uC7AC \uC815\uCC45\uC744 \uD655\uC778\uD574 \uC815\uD574\uC9C4 \uC808\uCC28\uB85C \uD310\uB2E8\uD55C\uB2E4.'], ['\uBC18\uBCF5 \uBBF8\uC900\uC218\uC758 \uAE30\uB85D\uC5D0 \uD544\uC694\uD55C \uAC83\uC740?', '\uC548\uB0B4, \uC9C0\uC6D0, \uD569\uC758, \uAE30\uD55C, \uD655\uC778 \uACB0\uACFC\uC758 \uB204\uC801 \uC774\uB825\uC774\uB2E4.']]\n  },\n  22: {\n    scenario: '\uC810\uD3EC\uC758 \uB9E4\uCD9C\uACFC \uD604\uAE08 \uC0AC\uC815\uC774 \uC545\uD654\uB418\uACE0 \uD575\uC2EC \uC9C1\uC6D0\uC774 \uD1F4\uC0AC\uD588\uC73C\uBA70 \uC810\uC8FC\uAC00 \uD3D0\uC810\uC744 \uC5B8\uAE09\uD558\uAE30 \uC2DC\uC791\uD588\uB2E4.',\n    teaching: [\n      '\uC704\uAE30 \uC9D5\uD6C4\uB294 \uD55C \uC9C0\uD45C\uBCF4\uB2E4 \uB9E4\uCD9C \uD558\uB77D, \uBE44\uC6A9 \uC555\uBC15, \uC6B4\uC601\uAE30\uC900 \uC800\uD558, \uC778\uB825 \uC774\uD0C8, \uB300\uAE08 \uC9C0\uC5F0, \uC810\uC8FC \uC5F0\uB77D \uBCC0\uD654\uAC00 \uACB9\uCE60 \uB54C \uB69C\uB837\uD574\uC9C4\uB2E4. \uAD00\uCC30 \uC0AC\uC2E4\uC744 \uC870\uAE30\uC5D0 \uAE30\uB85D\uD558\uACE0 \uACFC\uC7A5\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uAE34\uAE09\uB3C4\uB294 \uACE0\uAC1D \uC548\uC804, \uC601\uC5C5 \uC9C0\uC18D, \uD604\uAE08 \uD750\uB984, \uD68C\uBCF5 \uAC00\uB2A5\uC131\uC758 \uAD00\uC810\uC5D0\uC11C \uB098\uB208\uB2E4. \uC989\uC2DC \uB300\uC751\uD560 \uC704\uD5D8\uACFC \uC911\uAE30 \uAC1C\uC120\uC73C\uB85C \uB2E4\uB8F0 \uBB38\uC81C\uB97C \uBD84\uB9AC\uD55C\uB2E4.',\n      '\uC6B4\uC601 \uC9C0\uC18D \uAC00\uB2A5\uC131\uC740 \uB9E4\uCD9C \uC804\uB9DD\uB9CC\uC73C\uB85C \uD310\uB2E8\uD558\uC9C0 \uC54A\uB294\uB2E4. \uC810\uC8FC\uC758 \uC6B4\uC601 \uC758\uC9C0, \uC778\uB825\xB7\uC124\uBE44 \uC0C1\uD0DC, \uD544\uC694\uD55C \uD22C\uC790, \uBE44\uC6A9 \uAD6C\uC870\uC640 \uC9C0\uC6D0\uC758 \uC2E4\uC81C \uAC00\uB2A5\uC131\uC744 \uD568\uAED8 \uAC80\uD1A0\uD55C\uB2E4.',\n      '\uC9C0\uC6D0\uC740 \uD560\uC778\xB7\uAD11\uACE0 \uAC19\uC740 \uB2E8\uBC1C \uCC98\uBC29\uBCF4\uB2E4 \uC6D0\uC778\uC5D0 \uB9DE\uCDB0 \uC124\uACC4\uD55C\uB2E4. \uC6B4\uC601 \uAC1C\uC120, \uC778\uB825 \uAD50\uC721, \uBE44\uC6A9 \uC810\uAC80, \uC0C1\uAD8C \uB300\uC751\uC758 \uD6A8\uACFC\uC640 \uC18C\uC694 \uC790\uC6D0\uC744 \uBE44\uAD50\uD55C\uB2E4.',\n      '\uACC4\uC57D\xB7\uC7AC\uBB34\xB7\uC2DC\uC124\xB7\uC6B4\uC601 \uBB38\uC81C\uAC00 \uC11E\uC774\uBA74 \uBD80\uC11C \uACF5\uB3D9 \uB300\uC751\uC774 \uD544\uC694\uD558\uB2E4. SV\uB294 \uC810\uD3EC \uD604\uD669\uACFC \uC810\uC8FC \uC694\uCCAD\uC744 \uC815\uD655\uD788 \uC804\uB2EC\uD558\uACE0 \uC11C\uB85C \uB2E4\uB978 \uBD80\uC11C\uC758 \uB2F5\uBCC0\uC774 \uCDA9\uB3CC\uD558\uC9C0 \uC54A\uB3C4\uB85D \uC870\uC815\uD55C\uB2E4.',\n      '\uD68C\uBCF5\uC774 \uC5B4\uB835\uAC70\uB098 \uC885\uB8CC\uB97C \uAC80\uD1A0\uD558\uB294 \uB2E8\uACC4\uC5D0\uC11C\uB294 \uC810\uC8FC\uC758 \uC758\uC0AC\uB97C \uB4E3\uACE0 \uD544\uC694\uD55C \uACF5\uC2DD \uC808\uCC28\uC640 \uB2F4\uB2F9 \uBD80\uC11C\uB97C \uC548\uB0B4\uD55C\uB2E4. SV\uAC00 \uACC4\uC57D \uC885\uB8CC\uB098 \uC7AC\uBB34 \uACB0\uACFC\uB97C \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uB294\uB2E4.'\n    ],\n    task: ['\uC790\uB8CC\uC5D0\uC11C \uC870\uAE30 \uC9D5\uD6C4\uC640 \uC989\uC2DC \uB300\uC751 \uC704\uD5D8\uC744 \uB098\uB208\uB2E4.', '\uD68C\uBCF5 \uAC00\uB2A5\uC131\uC744 \uD310\uB2E8\uD558\uAE30 \uC704\uD55C \uCD94\uAC00 \uC790\uB8CC\uC640 \uB2F4\uB2F9 \uBD80\uC11C\uB97C \uC815\uD55C\uB2E4.', '2\uC8FC \uC548\uC815\uD654 \uD589\uB3D9\uACFC \uC810\uC8FC\uC5D0\uAC8C \uC548\uB0B4\uD560 \uB2E4\uC74C \uC808\uCC28\uB97C \uC791\uC131\uD55C\uB2E4.'],\n    check: [['\uB9E4\uCD9C\uC774 \uB0AE\uC73C\uBA74 \uBC14\uB85C \uD3D0\uC810 \uC9D5\uD6C4\uC778\uAC00\uC694?', '\uC544\uB2C8\uB2E4. \uD604\uAE08, \uC778\uB825, \uC6B4\uC601, \uC810\uC8FC\uC758 \uC0C1\uD669\uACFC \uCD94\uC138\uB97C \uD568\uAED8 \uBD10\uC57C \uD55C\uB2E4.'], ['SV\uAC00 \uD3D0\uC810 \uC5EC\uBD80\uB97C \uACB0\uC815\uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC0AC\uC2E4\uC744 \uC815\uB9AC\uD558\uACE0 \uC810\uC8FC\uC640 \uAD00\uB828 \uBD80\uC11C\uC758 \uACF5\uC2DD \uC808\uCC28\uB97C \uC5F0\uACB0\uD55C\uB2E4.']]\n  },\n  23: {\n    scenario: '\uBC29\uBB38\uBCF4\uACE0\uC11C\uC5D0 \u201C\uC810\uD3EC \uC0C1\uD0DC\uAC00 \uB098\uC068, \uC810\uC8FC \uD611\uC870 \uD544\uC694\u201D\uB77C\uACE0\uB9CC \uC801\uD600 \uD6C4\uC18D \uBD80\uC11C\uAC00 \uBB34\uC5C7\uC744 \uD574\uC57C \uD560\uC9C0 \uBAA8\uB978\uB2E4.',\n    teaching: [\n      '\uBCF4\uACE0\uC11C\uB294 \uC77D\uB294 \uC0AC\uB78C\uC774 \uACB0\uC815\uC744 \uB0B4\uB9AC\uAC70\uB098 \uC9C0\uC6D0\uC744 \uC2E4\uD589\uD558\uB3C4\uB85D \uB3D5\uB294 \uBB38\uC11C\uB2E4. \uC218\uC2E0\uC790\uAC00 \uC6D0\uD558\uB294 \uACB0\uB860, \uD604\uD669, \uADFC\uAC70, \uC694\uCCAD\uC744 \uBA3C\uC800 \uC815\uD558\uBA74 \uBD88\uD544\uC694\uD55C \uC11C\uC220\uC744 \uC904\uC77C \uC218 \uC788\uB2E4.',\n      '\uD575\uC2EC \uC694\uC57D \uB2E4\uC74C\uC5D0 \uC0AC\uC2E4, \uC601\uD5A5, \uC6D0\uC778 \uAC00\uC124, \uC870\uCE58, \uD544\uC694\uD55C \uACB0\uC815\uC744 \uBC30\uCE58\uD55C\uB2E4. \uC5EC\uB7EC \uBB38\uC81C\uAC00 \uC788\uB2E4\uBA74 \uC704\uD5D8\uB3C4\uC640 \uAE30\uD55C \uC21C\uC73C\uB85C \uC815\uB9AC\uD558\uACE0 \uD55C \uBB38\uB2E8\uC5D0 \uC11E\uC9C0 \uC54A\uB294\uB2E4.',\n      '\u201C\uC2EC\uAC01\uD568\u201D \uB300\uC2E0 \uB0A0\uC9DC\xB7\uC7A5\uC18C\xB7\uC218\uB7C9\xB7\uAD00\uCC30 \uD589\uB3D9\xB7\uADFC\uAC70 \uC790\uB8CC\uB97C \uC4F4\uB2E4. \uC810\uC8FC \uBC1C\uC5B8\uC740 \uC0AC\uC2E4\uACFC \uAD6C\uBD84\uD574 \uCD9C\uCC98\uB97C \uD45C\uC2DC\uD558\uACE0 \uAC1C\uC778\uC815\uBCF4\uB294 \uC5C5\uBB34\uC0C1 \uD544\uC694\uD55C \uBC94\uC704\uB9CC \uAE30\uB85D\uD55C\uB2E4.',\n      '\uBC29\uBB38\uBCF4\uACE0\uB294 \uD604\uC7A5\uACFC \uC57D\uC18D, \uC774\uC288\uBCF4\uACE0\uB294 \uAE34\uAE09 \uC601\uD5A5\uACFC \uC989\uC2DC \uC870\uCE58, \uC131\uACFC\uBCF4\uACE0\uB294 \uC9C0\uD45C \uBCC0\uD654\uC640 \uD574\uC11D\uC5D0 \uCD08\uC810\uC744 \uB454\uB2E4. \uBAA9\uC801\uC5D0 \uB9DE\uB294 \uD615\uC2DD\uC744 \uC368\uC57C \uC77D\uB294 \uC0AC\uB78C\uC774 \uB2E4\uC74C \uD589\uB3D9\uC744 \uC54C \uC218 \uC788\uB2E4.',\n      '\uC810\uD3EC \uB370\uC774\uD130\uB294 \uAE30\uC900 \uAE30\uAC04\uACFC \uCD9C\uCC98\uB97C \uD568\uAED8 \uC800\uC7A5\uD55C\uB2E4. \uACFC\uAC70 \uC810\uAC80\uACFC \uACFC\uC81C \uC774\uB825\uC744 \uC5F0\uACB0\uD558\uBA74 \uB2F4\uB2F9\uC790 \uAD50\uCCB4 \uD6C4\uC5D0\uB3C4 \uAC19\uC740 \uBB38\uC81C\uB97C \uCC98\uC74C\uBD80\uD130 \uB2E4\uC2DC \uC870\uC0AC\uD558\uC9C0 \uC54A\uC544\uB3C4 \uB41C\uB2E4.',\n      '\uC81C\uCD9C \uC804 \uC218\uCE58, \uB0A0\uC9DC, \uB9C1\uD06C, \uC0AC\uC9C4 \uC124\uBA85, \uB2F4\uB2F9\uC790, \uAE30\uD55C\uC744 \uC810\uAC80\uD55C\uB2E4. \uACF5\uC720 \uBC94\uC704\uC640 \uC811\uADFC \uAD8C\uD55C\uC744 \uD655\uC778\uD574 \uBBFC\uAC10\uD55C \uC810\uD3EC\xB7\uACE0\uAC1D \uC815\uBCF4\uB97C \uBD88\uD544\uC694\uD558\uAC8C \uD37C\uB728\uB9AC\uC9C0 \uC54A\uB294\uB2E4.'\n    ],\n    task: ['\uBAA8\uD638\uD55C \uBB38\uC7A5 3\uAC1C\uB97C \uAD00\uCC30 \uC0AC\uC2E4\uACFC \uADFC\uAC70\uAC00 \uC788\uB294 \uBB38\uC7A5\uC73C\uB85C \uACE0\uCE5C\uB2E4.', '\uD55C \uD398\uC774\uC9C0 \uBCF4\uACE0\uC11C\uC5D0 \uC694\uC57D\xB7\uC601\uD5A5\xB7\uC870\uCE58\xB7\uC694\uCCAD\xB7\uAE30\uD55C\uC744 \uB123\uB294\uB2E4.', '\uC0AC\uC9C4\xB7\uC218\uCE58\uC758 \uCD9C\uCC98\uC640 \uACF5\uC720 \uB300\uC0C1\uC774 \uC801\uC808\uD55C\uC9C0 \uAC80\uD1A0\uD55C\uB2E4.'],\n    check: [['\uC88B\uC740 \uBCF4\uACE0\uC11C\uC758 \uCCAB \uC9C8\uBB38\uC740?', '\uB204\uAC00 \uC774 \uBCF4\uACE0\uC11C\uB97C \uC77D\uACE0 \uC5B4\uB5A4 \uACB0\uC815\uC744 \uB0B4\uB824\uC57C \uD558\uB294\uAC00\uB2E4.'], ['\uC810\uC8FC \uC758\uACAC\uC744 \uC0AC\uC2E4\uCC98\uB7FC \uC368\uB3C4 \uB418\uB098\uC694?', '\uC548 \uB41C\uB2E4. \uCD9C\uCC98\uB97C \uD45C\uC2DC\uD558\uACE0 \uD655\uC778\uB41C \uC0AC\uC2E4\uACFC \uBD84\uB9AC\uD55C\uB2E4.']]\n  },\n  24: {\n    scenario: '\uC774\uBC88 \uC8FC\uC5D0 \uC810\uD3EC 12\uACF3\uC744 \uAD00\uB9AC\uD574\uC57C \uD558\uB294\uB370 \uAE34\uAE09 \uC7A5\uBE44 \uACE0\uC7A5, \uC815\uAE30 \uBC29\uBB38, \uC9C0\uB09C\uC8FC \uBBF8\uACB0 \uACFC\uC81C\uAC00 \uACB9\uCCE4\uB2E4.',\n    teaching: [\n      '\uB2F4\uB2F9 \uC810\uD3EC\uB97C \uC77C\uB960\uC801\uC73C\uB85C \uBC29\uBB38\uD558\uC9C0 \uC54A\uB294\uB2E4. \uB9E4\uCD9C\xB7QSC\xB7\uC774\uC288\xB7\uC2E0\uADDC \uC624\uD508\xB7\uC810\uC8FC \uC9C0\uC6D0 \uD544\uC694\uB97C \uAE30\uC900\uC73C\uB85C \uC704\uD5D8\uB3C4\uC640 \uC9C0\uC6D0 \uAC15\uB3C4\uB97C \uBD84\uB958\uD55C\uB2E4.',\n      '\uC811\uCD09 \uBC29\uC2DD\uC740 \uBAA9\uC801\uC5D0 \uB530\uB77C \uB2E4\uB974\uB2E4. \uD604\uC7A5 \uAD00\uCC30\uC774 \uD544\uC694\uD558\uBA74 \uBC29\uBB38\uD558\uACE0, \uC790\uB8CC \uD655\uC778\uC774\uB098 \uC57D\uC18D \uC9C4\uD589 \uC0C1\uD669\uC740 \uC804\uD654\xB7\uBA54\uC2DC\uC9C0\uB85C \uCC98\uB9AC\uD558\uB418 \uC911\uC694 \uD569\uC758\uB294 \uAE30\uB85D\uD55C\uB2E4.',\n      '\uC77C\uC815\uC740 \uC810\uD3EC\uC758 \uD53C\uD06C \uC2DC\uAC04\uACFC \uC774\uB3D9 \uB3D9\uC120\uC744 \uACE0\uB824\uD574 \uC9E0\uB2E4. \uAC19\uC740 \uC9C0\uC5ED \uBC29\uBB38\uC744 \uBB36\uB418 \uAE34\uAE09\uB3C4\uC640 \uAD00\uCC30\uD574\uC57C \uD560 \uC2DC\uAC04\uB300\uB97C \uD76C\uC0DD\uD558\uC9C0 \uC54A\uB294\uB2E4.',\n      '\uC6B0\uC120\uC21C\uC704\uB294 \uC548\uC804\xB7\uC601\uC5C5 \uC911\uB2E8 \uC704\uD5D8, \uAE30\uD55C, \uACE0\uAC1D \uC601\uD5A5, \uC57D\uC18D \uC774\uD589\uC744 \uAE30\uC900\uC73C\uB85C \uC815\uD55C\uB2E4. \uB2E8\uC21C\uD788 \uBA3C\uC800 \uB4E4\uC5B4\uC628 \uC694\uCCAD\uBD80\uD130 \uCC98\uB9AC\uD558\uBA74 \uC911\uC694\uD55C \uACFC\uC81C\uAC00 \uBC00\uB9B4 \uC218 \uC788\uB2E4.',\n      '\uAE34\uAE09\uC5C5\uBB34\uAC00 \uC0DD\uAE30\uBA74 \uACC4\uD68D\uC744 \uC7AC\uC870\uC815\uD558\uACE0 \uC601\uD5A5\uBC1B\uB294 \uC810\uD3EC\uC5D0 \uBCC0\uACBD \uC774\uC720\uC640 \uC0C8 \uC77C\uC815\uC744 \uC548\uB0B4\uD55C\uB2E4. \uAE30\uC874 \uBBF8\uACB0 \uACFC\uC81C\uAC00 \uC0AC\uB77C\uC9C0\uC9C0 \uC54A\uB3C4\uB85D \uB2F4\uB2F9\uACFC \uD6C4\uC18D \uC2DC\uC810\uC744 \uB2E4\uC2DC \uBC30\uCE58\uD55C\uB2E4.',\n      '\uC8FC\uAC04 \uB9C8\uAC10\uC5D0\uB294 \uC644\uB8CC\xB7\uC9C4\uD589\xB7\uC9C0\uC5F0 \uACFC\uC81C\uB97C \uB098\uB204\uACE0 \uC9C0\uC5F0 \uC6D0\uC778\uC744 \uD655\uC778\uD55C\uB2E4. \uBC18\uBCF5\uB418\uB294 \uBCD1\uBAA9\uC744 \uBC29\uBB38 \uC8FC\uAE30, \uD611\uC5C5 \uBC29\uC2DD, \uAC1C\uC778 \uC5C5\uBB34\uB7C9 \uC870\uC815\uC5D0 \uBC18\uC601\uD55C\uB2E4.'\n    ],\n    task: ['12\uAC1C \uC810\uD3EC\uB97C \uC704\uD5D8\uB3C4\xB7\uC9C0\uC6D0 \uD544\uC694\uC5D0 \uB530\uB77C \uC138 \uADF8\uB8F9\uC73C\uB85C \uBD84\uB958\uD55C\uB2E4.', '\uAE34\uAE09 \uC7A5\uBE44 \uC774\uC288\uB97C \uBC18\uC601\uD574 \uC8FC\uAC04 \uBC29\uBB38\uACFC \uBE44\uB300\uBA74 \uC811\uCD09 \uC77C\uC815\uC744 \uB2E4\uC2DC \uB9CC\uB4E0\uB2E4.', '\uBBF8\uACB0 \uACFC\uC81C\uB9C8\uB2E4 \uB2F4\uB2F9\uC790\xB7\uB2E4\uC74C \uD655\uC778\uC77C\xB7\uC9C0\uC5F0 \uC2DC \uB300\uC548\uC744 \uC801\uB294\uB2E4.'],\n    check: [['\uB2F4\uB2F9 \uC810\uD3EC\uB97C \uBAA8\uB450 \uAC19\uC740 \uBE48\uB3C4\uB85C \uBC29\uBB38\uD574\uC57C \uD558\uB098\uC694?', '\uC544\uB2C8\uB2E4. \uC704\uD5D8\uB3C4\uC640 \uC9C0\uC6D0 \uD544\uC694, \uBC29\uBB38 \uBAA9\uC801\uC5D0 \uB530\uB77C \uC8FC\uAE30\uB97C \uC870\uC815\uD55C\uB2E4.'], ['\uAE34\uAE09 \uC77C\uC815\uC774 \uC0DD\uACBC\uC744 \uB54C \uAE30\uC874 \uACFC\uC81C\uB294?', '\uB2F4\uB2F9\uACFC \uAE30\uD55C\uC744 \uC7AC\uBC30\uCE58\uD558\uACE0 \uAD00\uB828 \uC810\uD3EC\uC5D0 \uBCC0\uACBD \uB0B4\uC6A9\uC744 \uC54C\uB9B0\uB2E4.']]\n  }\n};\n", "lesson-prompts.js": "// \uAC01 \uD575\uC2EC \uD56D\uBAA9\uC5D0\uC11C \uC124\uBA85 \uB4A4 2\uBD84 \uD1A0\uC758\uC5D0 \uC0AC\uC6A9\uD558\uB294 \uACFC\uC815\uBCC4 \uC9C8\uBB38.\nconst lessonPrompts = {\n  1: ['\uAC1C\uC778 \uCDE8\uD5A5\uACFC \uBE0C\uB79C\uB4DC \uAE30\uC900\uC774 \uB2E4\uB978 \uD3C9\uAC00 \uBB38\uC7A5\uC744 \uD558\uB098\uC529 \uB9CC\uB4E4\uC5B4 \uBCF4\uC138\uC694.', '\uC81C\uACF5\uB7C9 \uD3B8\uCC28\uAC00 \uBCF4\uC774\uBA74 \uC81C\uC870 \uD750\uB984\uC758 \uC5B4\uB290 \uAE30\uB85D\uACFC \uB3C4\uAD6C\uBD80\uD130 \uD655\uC778\uD560\uAE4C\uC694?', '\uC8FC\uBB38 \uB204\uB77D\uC740 \uC811\uC218\xB7\uC81C\uC870\xB7\uC804\uB2EC \uC911 \uC5B4\uB514\uC5D0\uC11C \uBC1C\uACAC\uD560 \uC218 \uC788\uC744\uAE4C\uC694?', '\uCCAD\uC18C\uD45C\uC5D0 \uC11C\uBA85\uC774 \uC788\uC9C0\uB9CC \uC624\uC5FC\uC774 \uBCF4\uC774\uBA74 \uBB34\uC5C7\uC744 \uCD94\uAC00\uB85C \uD655\uC778\uD560\uAE4C\uC694?', '\u201C\uC11C\uBE44\uC2A4\uAC00 \uBCC4\uB85C\uB2E4\u201D\uB97C \uAD00\uCC30 \uAC00\uB2A5\uD55C \uC0AC\uC2E4 \uBB38\uC7A5\uC73C\uB85C \uBC14\uAFD4 \uBCF4\uC138\uC694.', '\uC624\uB298 \uACE0\uCE5C \uD56D\uBAA9\uC774 \uB2E4\uC74C \uC8FC\uC5D0\uB3C4 \uC720\uC9C0\uB418\uB294\uC9C0 \uC5B4\uB5BB\uAC8C \uD655\uC778\uD560\uAE4C\uC694?'],\n  2: ['\uC774\uBC88 \uBC29\uBB38\uC740 \uC815\uAE30\xB7\uC774\uC288\xB7\uD6C4\uC18D \uC810\uAC80 \uC911 \uBB34\uC5C7\uC774\uBA70 \uD575\uC2EC \uC9C8\uBB38\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uC774\uC804 \uBCF4\uACE0\uC11C\uC5D0\uC11C \uBC29\uBB38 \uC804\uC5D0 \uAF2D \uC77D\uC5B4\uC57C \uD560 \uAE30\uB85D \uC138 \uAC00\uC9C0\uB97C \uACE8\uB77C \uBCF4\uC138\uC694.', '\uD53C\uD06C \uAD00\uCC30\uACFC \uC810\uC8FC \uBA74\uB2F4\uC744 \uAC01\uAC01 \uC5B8\uC81C \uBC30\uCE58\uD560\uAE4C\uC694?', '\uC8FC\uBB38 \uB204\uB77D\uC744 \uC9C1\uC811 \uD655\uC778\uD560 \uC218 \uC788\uB294 \uAD00\uCC30\uACFC \uAE30\uB85D\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uC810\uC8FC\uAC00 \u201C\uC778\uB825\uC774 \uC5C6\uC5B4 \uBABB \uD55C\uB2E4\u201D\uACE0 \uD558\uBA74 \uACFC\uC81C\uB97C \uC5B4\uB5BB\uAC8C \uC870\uC815\uD560\uAE4C\uC694?', '\uC644\uB8CC \uC99D\uBE59\uC73C\uB85C \uC0AC\uC9C4\uB9CC \uCDA9\uBD84\uD55C\uC9C0, \uD604\uC7A5 \uC7AC\uD655\uC778\uC774 \uD544\uC694\uD55C\uC9C0 \uD310\uB2E8\uD574 \uBCF4\uC138\uC694.'],\n  3: ['\uC810\uC8FC\uC758 \uB9D0\uC5D0\uC11C \uBE44\uC6A9\xB7\uC2DC\uAC04\xB7\uAC10\uC815 \uC911 \uC5B4\uB5A4 \uBD80\uB2F4\uC774 \uAC00\uC7A5 \uD070\uC9C0 \uBB3C\uC5B4\uBCF4\uC138\uC694.', '\uC2E0\uADDC \uC810\uC8FC\uC640 \uC7A5\uAE30 \uC810\uC8FC\uC5D0\uAC8C \uAC19\uC740 \uC815\uCC45\uC744 \uC5B4\uB5BB\uAC8C \uB2E4\uB974\uAC8C \uC124\uBA85\uD560\uAE4C\uC694?', '\uBD88\uB9CC\uC744 \uB4E3\uACE0 \uC694\uC57D\uD574 \uB418\uB3CC\uB824\uC8FC\uB294 \uBB38\uC7A5\uC744 \uB9CC\uB4E4\uC5B4 \uBCF4\uC138\uC694.', '\uD589\uC0AC\uC758 \uD6A8\uACFC\uB97C \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC73C\uBA74\uC11C \uC81C\uC548\uD558\uB294 \uBB38\uC7A5\uC744 \uB9D0\uD574 \uBCF4\uC138\uC694.', '\uB300\uD654\uAC00 \uACA9\uD574\uC84C\uC744 \uB54C \uC0AC\uC2E4 \uD655\uC778\uACFC \uB2E4\uC74C \uBA74\uB2F4\uC73C\uB85C \uC5F0\uACB0\uD558\uB294 \uBB38\uC7A5\uC740?', '\uC989\uC2DC \uB2F5\uD560 \uC218 \uC5C6\uB294 \uC9C0\uC6D0 \uC694\uCCAD\uC758 \uD68C\uC2E0 \uAE30\uD55C\uC744 \uC5B4\uB5BB\uAC8C \uC548\uB0B4\uD560\uAE4C\uC694?'],\n  4: ['\uC774 \uC694\uCCAD\uC774 \uBE0C\uB79C\uB4DC \uAE30\uC900 \uC720\uC9C0\xB7\uC6B4\uC601 \uC9C0\uC6D0\xB7\uBD80\uC11C \uC5F0\uACB0 \uC911 \uC5B4\uB514\uC5D0 \uD574\uB2F9\uD558\uB098\uC694?', '\uBE44\uC6A9 \uC9C0\uC6D0\uC744 \uBB3B\uB294 \uC810\uC8FC\uC5D0\uAC8C \uAD8C\uD55C\uC744 \uB118\uC9C0 \uC54A\uB294 \uB2F5\uC744 \uD574\uBCF4\uC138\uC694.', '\uBCF8\uC0AC\uC758 \uC815\uCC45 \uCDE8\uC9C0\uC640 \uC810\uD3EC\uC758 \uBD80\uB2F4\uC744 \uD55C \uBB38\uB2E8\uC73C\uB85C \uD568\uAED8 \uC804\uB2EC\uD574 \uBCF4\uC138\uC694.', '\uB2F4\uB2F9 \uC810\uD3EC\uB97C \uCC98\uC74C \uC778\uC218\uBC1B\uC73C\uBA74 \uC5B4\uB5A4 \uC815\uBCF4\uBD80\uD130 \uD655\uC778\uD560\uAE4C\uC694?', '\uBC29\uBB38 \uD69F\uC218\uC640 \uAC1C\uC120 \uC644\uB8CC\uC728\uC774 \uB2E4\uB974\uAC8C \uC6C0\uC9C1\uC774\uBA74 \uC5B4\uB5BB\uAC8C \uD574\uC11D\uD560\uAE4C\uC694?', '\uC2DC\uC124\uD300 \uC694\uCCAD\uC11C\uC5D0 \uBE60\uC9C0\uBA74 \uD310\uB2E8\uC774 \uC5B4\uB824\uC6B4 \uC815\uBCF4\uB294 \uBB34\uC5C7\uC778\uAC00\uC694?'],\n  5: ['\uBCF8\uC0AC\xB7\uAC00\uB9F9\uC810\xB7\uACF5\uAE09\uC5C5\uCCB4 \uC911 \uC774 \uBB38\uC81C\uC758 \uACB0\uC815 \uC8FC\uCCB4\uB294 \uB204\uAD6C\uC778\uAC00\uC694?', '\uAC19\uC740 \uC815\uCC45\uC774 \uBCF8\uC0AC\uC640 \uC810\uC8FC\uC758 \uBE44\uC6A9\uC5D0 \uAC01\uAC01 \uC5B4\uB5A4 \uC601\uD5A5\uC744 \uC904\uAE4C\uC694?', '\uC810\uC8FC \uC9C8\uBB38\uC5D0 \uB2F5\uD560 \uBB38\uC11C\uC758 \uCD5C\uC2E0\uBCF8\uACFC \uC2DC\uD589\uC77C\uC744 \uC5B4\uB5BB\uAC8C \uD655\uC778\uD558\uB098\uC694?', '\uACC4\uC57D \uC870\uD56D\uC744 \uAE30\uC5B5\uB9CC\uC73C\uB85C \uB2F5\uD588\uC744 \uB54C \uC0DD\uAE38 \uC218 \uC788\uB294 \uBB38\uC81C\uB294?', '\uC608\uC678\uB97C \uAD6C\uB450\uB85C \uC57D\uC18D\uD574 \uB2EC\uB77C\uB294 \uC694\uCCAD\uC5D0 \uC5B4\uB5A4 \uC808\uCC28\uB97C \uC124\uBA85\uD560\uAE4C\uC694?', '\uACC4\uC57D \uBD84\uC7C1\uC744 \uBCF4\uACE0\uD560 \uB54C \uC0AC\uC2E4\uACFC \uD574\uC11D\uC744 \uC5B4\uB5BB\uAC8C \uB098\uB20C\uAE4C\uC694?'],\n  6: ['\uB9E4\uCD9C \uAC10\uC18C\uB97C \uAC70\uB798 \uAC74\uC218\uC640 \uAC1D\uB2E8\uAC00\uB85C \uB098\uB220 \uC9C8\uBB38\uD574 \uBCF4\uC138\uC694.', '\uC804\uC6D4 \uBE44\uAD50\uB97C \uC65C \uAC19\uC740 \uC694\uC77C \uAE30\uC900\uC73C\uB85C \uB2E4\uC2DC \uBD10\uC57C \uD560\uAE4C\uC694?', '\uD3C9\uC77C \uC624\uD6C4 \uAC10\uC18C\uB97C \uD655\uC778\uD560 \uD604\uC7A5 \uAD00\uCC30 \uB450 \uAC00\uC9C0\uB294?', '\uB300\uD45C \uBA54\uB274 \uD310\uB9E4 \uBE44\uC911\uC774 \uC904\uC5C8\uB2E4\uBA74 \uBB34\uC5C7\uC744 \uD655\uC778\uD560\uAE4C\uC694?', '\uBC30\uB2EC \uB9E4\uCD9C \uC99D\uAC00\uC5D0\uB3C4 \uC2E4\uC218\uB839\uC561\uC774 \uC904 \uC218 \uC788\uB294 \uC774\uC720\uB97C \uB9D0\uD574 \uBCF4\uC138\uC694.', '\u201C\uD488\uC808 \uB54C\uBB38\uC5D0 \uAC10\uC18C\uD588\uB2E4\u201D\uB294 \uAC00\uC124\uC744 \uAC80\uC99D\uD560 \uC790\uB8CC\uB294?'],\n  7: ['\uB9E4\uCD9C\uC5D0\uC11C \uC5B4\uB5A4 \uBE44\uC6A9\uC744 \uBE7C\uC57C \uC810\uD3EC\uC758 \uC2E4\uC81C \uC218\uC775\uC5D0 \uAC00\uAE4C\uC6CC\uC9C8\uAE4C\uC694?', '\uC6D0\uAC00\uC728 \uC0C1\uC2B9\uC774 \uB9E4\uC785\uAC00\xB7\uD3D0\uAE30\xB7\uACC4\uB7C9 \uC911 \uBB34\uC5C7 \uB54C\uBB38\uC778\uC9C0 \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uB098\uC694?', '\uD53C\uD06C \uC778\uB825 \uAC10\uC18C\uAC00 \uBE44\uC6A9\uACFC \uB9E4\uCD9C\uC5D0 \uB3D9\uC2DC\uC5D0 \uBBF8\uCE58\uB294 \uC601\uD5A5\uC740?', '\uD640 \uC8FC\uBB38\uACFC \uBC30\uB2EC \uC8FC\uBB38\uC758 \uCC44\uB110 \uBE44\uC6A9\uC744 \uB098\uB220 \uC801\uC5B4\uBCF4\uC138\uC694.', '\uAC74\uB2F9 \uACF5\uD5CC\uC774\uC775\uC774 \uB0AE\uC544\uC9C0\uBA74 \uD544\uC694\uD55C \uC8FC\uBB38 \uC218\uB294 \uC5B4\uB5BB\uAC8C \uBCC0\uD560\uAE4C\uC694?', '\uC7AC\uB8CC \uC808\uAC10\uC774 \uD488\uC9C8 \uC800\uD558\uB85C \uC774\uC5B4\uC9C0\uC9C0 \uC54A\uAC8C \uC5B4\uB5A4 \uC870\uAC74\uC744 \uC9C0\uD0AC\uAE4C\uC694?'],\n  8: ['\uC9C0\uB3C4\uC0C1 \uAC00\uAE4C\uC6B4\uB370 \uC2E4\uC81C\uB85C\uB294 \uC811\uADFC\uC774 \uC5B4\uB824\uC6B4 \uACBD\uB85C\uAC00 \uC788\uB098\uC694?', '\uC9C0\uB098\uAC00\uB294 \uC0AC\uB78C \uC911 \uC6B0\uB9AC \uC0C1\uD488\uC744 \uC0B4 \uAC00\uB2A5\uC131\uC774 \uB192\uC740 \uACE0\uAC1D\uC740 \uB204\uAD6C\uC778\uAC00\uC694?', '\uAC19\uC740 \uBA54\uB274\uAC00 \uC544\uB2C8\uC5B4\uB3C4 \uACE0\uAC1D\uC774 \uBE44\uAD50\uD558\uB294 \uB300\uCCB4\uC810\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uACBD\uC7C1\uC810\uC758 \uAC00\uACA9 \uB9D0\uACE0 \uACBD\uD5D8\uC744 \uBE44\uAD50\uD560 \uD56D\uBAA9 \uC138 \uAC00\uC9C0\uB294?', '\uAC74\uB108\uD3B8 \uC810\uD3EC\uB97C \uC120\uD0DD\uD558\uB294 \uACE0\uAC1D\uC758 \uC774\uC720\uB97C \uC5B4\uB5BB\uAC8C \uAC80\uC99D\uD560\uAE4C\uC694?', '\uC810\uD3EC\uAC00 \uC9C1\uC811 \uBC14\uAFC0 \uC218 \uC788\uB294 \uB3D9\uC120\xB7\uC548\uB0B4 \uC694\uC18C\uB294 \uBB34\uC5C7\uC778\uAC00\uC694?'],\n  9: ['\uD55C \uB2EC \uD558\uB77D\uACFC \uAD6C\uC870\uC801 \uBD80\uC9C4\uC744 \uAD6C\uBD84\uD560 \uBE44\uAD50 \uAE30\uC900\uC740?', '\uB9E4\uCD9C \uC790\uB8CC\uC640 \uD568\uAED8 \uBCFC QSC\xB7\uD488\uC808\xB7\uBD88\uB9CC \uC790\uB8CC\uB294 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uB098\uC5F4\uB41C \uBB38\uC81C \uC911 \uC6D0\uC778\uACFC \uACB0\uACFC\uB97C \uAD6C\uBD84\uD574 \uBCF4\uC138\uC694.', '\uAC00\uC7A5 \uD6A8\uACFC\uAC00 \uD06C\uACE0 \uC2E4\uD589\uC774 \uC26C\uC6B4 \uACFC\uC81C \uD558\uB098\uB97C \uACE0\uB974\uC138\uC694.', '\u201C\uC11C\uBE44\uC2A4 \uAC1C\uC120\u201D\uC744 \uCE21\uC815 \uAC00\uB2A5\uD55C \uD589\uB3D9 \uBAA9\uD45C\uB85C \uBC14\uAFD4 \uBCF4\uC138\uC694.', '\uB9E4\uCD9C\uC774 \uC544\uC9C1 \uD68C\uBCF5\uB418\uC9C0 \uC54A\uC558\uC744 \uB54C \uBA3C\uC800 \uBCFC \uC120\uD589 \uC9C0\uD45C\uB294?'],\n  10: ['\uC774\uBC88 \uD65C\uB3D9\uC758 \uBAA9\uC801\uC774 \uCCAB \uBC29\uBB38\uC778\uC9C0 \uC7AC\uBC29\uBB38\uC778\uC9C0 \uC815\uD574 \uBCF4\uC138\uC694.', '\uC810\uC2EC\uC2DC\uAC04\uC774 \uC9E7\uC740 \uC9C1\uC7A5\uC778\uC5D0\uAC8C \uD560\uC778 \uC678 \uC5B4\uB5A4 \uC81C\uC548\uC774 \uAC00\uB2A5\uD560\uAE4C\uC694?', '\uC9C0\uC5ED \uC81C\uD734 \uD6C4\uBCF4\uB97C \uACE0\uB97C \uB54C \uACE0\uAC1D \uB3D9\uC120\uC744 \uC5B4\uB5BB\uAC8C \uD655\uC778\uD560\uAE4C\uC694?', '\uD589\uC0AC \uC804 POS\xB7\uC7AC\uACE0\xB7\uC9C1\uC6D0 \uC548\uB0B4 \uC911 \uBBF8\uC644\uB8CC\uAC00 \uC788\uC73C\uBA74 \uC5B4\uB5A4 \uC624\uB958\uAC00 \uC0DD\uAE30\uB098\uC694?', '\uCD94\uAC00 \uC8FC\uBB38\uC774 \uBA87 \uAC74\uC774\uC5B4\uC57C \uD589\uC0AC \uBE44\uC6A9\uC744 \uAC10\uB2F9\uD560\uAE4C\uC694?', '\uD589\uC0AC \uC885\uB8CC \uB4A4 \uC77C\uC2DC\uC801 \uD560\uC778 \uD6A8\uACFC\uC640 \uC7AC\uBC29\uBB38\uC744 \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uB098\uC694?'],\n  11: ['\uD45C\uC2DC \uB9E4\uCD9C\uACFC \uC2E4\uC218\uB839\uC561\uC744 \uAC01\uAC01 \uC5B4\uB514\uC11C \uD655\uC778\uD558\uB098\uC694?', '\uD654\uBA74\uC758 \uBA54\uB274 \uC0AC\uC9C4\uACFC \uC2E4\uC81C \uC81C\uD488\uC774 \uB2E4\uB974\uBA74 \uC5B4\uB5A4 \uBD88\uB9CC\uC774 \uC0DD\uAE38\uAE4C\uC694?', '\uC8FC\uBB38 \uB204\uB77D\uC774 \uC811\uC218\xB7\uC81C\uC870\xB7\uAC80\uC218 \uC911 \uC5B4\uB514\uC11C \uBC1C\uC0DD\uD558\uB294\uC9C0 \uCD94\uC801\uD574 \uBCF4\uC138\uC694.', '\uC774\uB3D9 20\uBD84 \uB4A4\uC5D0\uB3C4 \uC81C\uD488 \uD488\uC9C8\uC744 \uC720\uC9C0\uD560 \uD3EC\uC7A5 \uC810\uAC80\uC740?', '\uBC18\uBCF5 \uB9AC\uBDF0\uB97C \uB2F5\uAE00\uC774 \uC544\uB2C8\uB77C \uC808\uCC28 \uAC1C\uC120\uC73C\uB85C \uC5F0\uACB0\uD574 \uBCF4\uC138\uC694.', '\uAD11\uACE0\uBE44\uB97C \uB298\uB9B0 \uCC44\uB110\uC744 \uACC4\uC18D \uC6B4\uC601\uD560 \uD310\uB2E8 \uAE30\uC900\uC740?'],\n  12: ['\uBC1C\uC8FC\uBD80\uD130 \uD3D0\uAE30\uAE4C\uC9C0 \uC5B4\uB290 \uB2E8\uACC4 \uAE30\uB85D\uC774 \uBE60\uC838 \uC788\uB098\uC694?', '\uC8FC\uB9D0 \uD310\uB9E4 \uC99D\uAC00\uB97C \uBC18\uC601\uD55C \uBC1C\uC8FC\uB7C9\uC5D0 \uC5B4\uB5A4 \uC7AC\uACE0\uB97C \uBE7C\uC57C \uD558\uB098\uC694?', '\uC785\uACE0\uD488\uC758 \uC218\uB7C9 \uC678 \uC5B4\uB5A4 \uC0C1\uD0DC\uC640 \uD45C\uC2DC\uB97C \uD655\uC778\uD558\uB098\uC694?', '\uC2E4\uBB3C\xB7\uC2DC\uC2A4\uD15C \uC218\uB7C9\uC774 \uB2E4\uB974\uBA74 \uC5B4\uB5A4 \uAC70\uB798 \uAE30\uB85D\uC744 \uCC3E\uC744\uAE4C\uC694?', '\uACFC\uB2E4 \uACC4\uB7C9\uACFC \uD310\uB9E4 \uBD80\uC9C4\uC5D0 \uB530\uB978 \uD3D0\uAE30\uB97C \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uB098\uC694?', '\uD488\uC808\uB960\uC744 \uB0AE\uCD94\uBA74\uC11C \uD3D0\uAE30\uC561\uB3C4 \uC904\uC77C \uC2E4\uD5D8\uC740?'],\n  13: ['\uB808\uC2DC\uD53C\uC5D0\uC11C \uC9C1\uC6D0\uC774 \uB208\uC73C\uB85C \uD655\uC778\uD560 \uC218 \uC788\uB294 \uB3D9\uC791\uC740?', '\uC81C\uACF5\uB7C9 \uCC28\uC774\uAC00 \uC0AC\uB78C\xB7\uB3C4\uAD6C\xB7\uC7AC\uB8CC \uC911 \uC5B4\uB514\uC11C \uC0DD\uACBC\uB294\uC9C0 \uC5B4\uB5BB\uAC8C \uC54C\uC544\uBCF4\uB098\uC694?', '\uC9C1\uC6D0\uC774 \uC2DC\uBC94\uC744 \uBCF8 \uB4A4 \uC9C1\uC811 \uC81C\uC870\uD558\uB3C4\uB85D \uD558\uB294 \uC774\uC720\uB294?', '\uCD9C\uC2DC \uC804 POS \uB4F1\uB85D\uC774 \uB204\uB77D\uB418\uBA74 \uD604\uC7A5\uC5D0 \uC5B4\uB5A4 \uBB38\uC81C\uAC00 \uC0DD\uAE30\uB098\uC694?', '\uCCAB \uC8FC\uC5D0 \uD310\uB9E4\uB7C9 \uC678 \uC5B4\uB5A4 \uC791\uC5C5 \uC9C0\uD45C\uB97C \uAE30\uB85D\uD560\uAE4C\uC694?', '\u201C\uC81C\uC870\uAC00 \uC5B4\uB835\uB2E4\u201D\uB97C \uC0C1\uD488\uD300\uC774 \uAC80\uD1A0\uD560 \uC218 \uC788\uB294 \uC0AC\uC2E4\uB85C \uBC14\uAFD4 \uBCF4\uC138\uC694.'],\n  14: ['\uC8FC\uB9D0 \uC810\uC2EC\uC758 \uC8FC\uBB38\uB7C9\uACFC \uC791\uC5C5\uB7C9\uC744 \uC5B4\uB5BB\uAC8C \uC778\uC6D0\uC73C\uB85C \uBC14\uAFB8\uB098\uC694?', '\uADFC\uBB34\uD45C\uC5D0\uC11C \uD53C\uD06C \uC804 \uC900\uBE44\uC640 \uB9C8\uAC10\uC744 \uBE60\uB728\uB9AC\uBA74 \uC5B4\uB5BB\uAC8C \uB418\uB098\uC694?', '\uC2E0\uC785\uACFC \uC219\uB828\uC790\uC758 \uC5ED\uD560\uC744 \uD53C\uD06C \uC2DC\uAC04\uC5D0 \uC5B4\uB5BB\uAC8C \uB098\uB20C\uAE4C\uC694?', '\uC2E0\uADDC \uC9C1\uC6D0 \uCCAB \uC8FC\uC5D0 \uAF2D \uD655\uC778\uD560 \uB3D9\uC791 \uB450 \uAC00\uC9C0\uB294?', '\uC778\uAC74\uBE44\uC728\uC774 \uB0AE\uC544\uB3C4 \uC6B4\uC601\uC774 \uB098\uC060 \uC218 \uC788\uB294 \uC774\uC720\uB294?', 'SV\uAC00 \uC81C\uC548\uD560 \uC218 \uC788\uB294 \uAC83\uACFC \uC810\uC8FC\uAC00 \uACB0\uC815\uD560 \uAC83\uC744 \uAD6C\uBD84\uD574 \uBCF4\uC138\uC694.'],\n  15: ['\uC9C1\uC6D0\uC774 \uBAA8\uB974\uB294 \uAC83\uACFC \uBC14\uBE60\uC11C \uBABB \uD558\uB294 \uAC83\uC744 \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uB098\uC694?', '\u201C\uC11C\uBE44\uC2A4\uB97C \uC798\uD55C\uB2E4\u201D\uB97C \uAD00\uCC30 \uAC00\uB2A5\uD55C \uAD50\uC721 \uBAA9\uD45C\uB85C \uBC14\uAFD4 \uBCF4\uC138\uC694.', '\uC8FC\uBB38 \uD655\uC778 \uC808\uCC28\uB97C 2\uBD84 \uC548\uC5D0 \uC2DC\uBC94\uC73C\uB85C \uBCF4\uC5EC\uC900\uB2E4\uBA74?', '\uC9C1\uC6D0\uC5D0\uAC8C \uC5B4\uB5A4 \uD589\uB3D9\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C \uCE6D\uCC2C\uD558\uACE0 \uBB34\uC5C7\uC744 \uB2E4\uC2DC \uD574\uBCF4\uAC8C \uD560\uAE4C\uC694?', '\uAD50\uC721 \uCC38\uC11D\uACFC \uD604\uC7A5 \uC219\uB828\uC744 \uB2E4\uB978 \uAE30\uC900\uC73C\uB85C \uAE30\uB85D\uD574 \uBCF4\uC138\uC694.', '\uC77C\uC8FC\uC77C \uB4A4 \uAD00\uB9AC\uC790\uAC00 \uD655\uC778\uD560 \uD589\uB3D9\uACFC \uC624\uB958 \uC9C0\uD45C\uB294?'],\n  16: ['\uC774 \uBD88\uB9CC\uC774 \uC77C\uBC18 \uC11C\uBE44\uC2A4 \uBB38\uC81C\uC778\uC9C0 \uC548\uC804 \uC758\uC2EC\uC778\uC9C0 \uBD84\uB958\uD574 \uBCF4\uC138\uC694.', '\uC6D0\uC778\uC744 \uB2E8\uC815\uD558\uC9C0 \uC54A\uC73C\uBA74\uC11C \uBD88\uD3B8\uC744 \uC778\uC815\uD558\uB294 \uCCAB \uBB38\uC7A5\uC740?', '\uD655\uC778\uD560 \uC8FC\uBB38\xB7\uC81C\uD488\xB7\uC81C\uC870 \uAE30\uB85D\uC744 \uC2DC\uAC04 \uC21C\uC11C\uB85C \uC801\uC5B4\uBCF4\uC138\uC694.', '\uC810\uD3EC \uAD8C\uD55C \uBC16\uC758 \uBCF4\uC0C1 \uC694\uAD6C\uC5D0\uB294 \uBB34\uC5C7\uC744 \uC548\uB0B4\uD560\uAE4C\uC694?', '\uBCF8\uC0AC \uBCF4\uACE0\uC5D0\uC11C \uD655\uC778 \uC0AC\uC2E4\uACFC \uBBF8\uD655\uC778 \uC0AC\uD56D\uC744 \uB098\uB220 \uBCF4\uC138\uC694.', '\uACE0\uAC1D \uD68C\uC2E0 \uD6C4 \uC5B4\uB5A4 \uC808\uCC28\uB97C \uBC14\uAFD4\uC57C \uC7AC\uBC1C\uC744 \uC904\uC77C \uC218 \uC788\uC744\uAE4C\uC694?'],\n  17: ['\uC6D0\uC7AC\uB8CC\uBD80\uD130 \uC81C\uACF5\uAE4C\uC9C0 \uC5B4\uB290 \uB2E8\uACC4\uC5D0\uC11C \uC704\uD5D8\uC774 \uC0DD\uAE38 \uC218 \uC788\uB098\uC694?', '\uC7A5\uBE44 \uACBD\uACE0\uC640 \uBCF4\uAD00 \uAE30\uB85D\uC774 \uB2E4\uB97C \uB54C \uBB34\uC5C7\uC744 \uC6B0\uC120 \uD655\uC778\uD560\uAE4C\uC694?', '\uD53C\uD06C \uC2DC\uAC04\uC5D0 \uAD50\uCC28\uC624\uC5FC\uC744 \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC791\uC5C5 \uB3D9\uC120\uC740?', '\uCCAD\uC18C\uD45C \uC678\uC5D0 \uC2E4\uC81C \uC138\uCC99\xB7\uC18C\uB3C5\uC744 \uD655\uC778\uD560 \uBC29\uBC95\uC740?', '\uAC74\uAC15 \uBB38\uC758\uAC00 \uB4E4\uC5B4\uC654\uC744 \uB54C \uAD00\uB828 \uC81C\uD488\uACFC \uAE30\uB85D\uC744 \uC5B4\uB5BB\uAC8C \uBCF4\uC874\uD560\uAE4C\uC694?', '\uC870\uC0AC \uC804 \uCD94\uC815 \uC6D0\uC778\uC744 \uC678\uBD80\uC5D0 \uB9D0\uD558\uBA74 \uC5B4\uB5A4 \uBB38\uC81C\uAC00 \uC0DD\uAE30\uB098\uC694?'],\n  18: ['\uB450 \uC7A5\uBE44 \uBB38\uC81C \uC911 \uACE0\uAC1D\xB7\uC548\uC804\uC5D0 \uB354 \uD070 \uC601\uD5A5\uC744 \uC8FC\uB294 \uAC83\uC740?', '\uBC18\uBCF5 \uACE0\uC7A5\uC744 \uC785\uC99D\uD560 \uC2DC\uAC01\xB7\uC870\uAC74\xB7\uC0AC\uC9C4\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uACE0\uC7A5 \uC804 \uC608\uBC29 \uC810\uAC80\uC73C\uB85C \uBC1C\uACAC\uD560 \uC218 \uC788\uC5C8\uB358 \uC9D5\uD6C4\uB294?', '\uC218\uB9AC \uC694\uCCAD \uB4A4 \uC5B8\uC81C \uC5B4\uB5BB\uAC8C \uC815\uC0C1 \uC791\uB3D9\uC744 \uD655\uC778\uD560\uAE4C\uC694?', '\uC7A5\uBE44 \uACE0\uC7A5 \uC911 \uC5B4\uB5A4 \uC81C\uD488\uC758 \uD310\uB9E4 \uC5EC\uBD80\uB97C \uD655\uC778\uD574\uC57C \uD560\uAE4C\uC694?', '\uACE0\uAC1D\uC774 \uC785\uC7A5\uBD80\uD130 \uD1F4\uC810\uAE4C\uC9C0 \uACAA\uB294 \uBD88\uD3B8\uC744 \uAC78\uC73C\uBA70 \uCC3E\uC544\uBCF4\uC138\uC694.'],\n  19: ['\uC7A5\uBE44 \uC124\uCE58 \uC9C0\uC5F0\uC774 POS \uC2DC\uD5D8\uACFC \uC9C1\uC6D0 \uAD50\uC721\uC5D0 \uC5B4\uB5A4 \uC601\uD5A5\uC744 \uC904\uAE4C\uC694?', '\uC124\uCE58 \uC644\uB8CC\uC640 \uC2E4\uC81C \uC601\uC5C5 \uAC00\uB2A5\uC744 \uAD6C\uBD84\uD558\uB294 \uC2DC\uD5D8\uC740?', '\uCD08\uB3C4 \uC7AC\uACE0\uC640 \uBCF4\uAD00 \uACF5\uAC04\uC774 \uB9DE\uC9C0 \uC54A\uC73C\uBA74 \uBB34\uC5C7\uC744 \uC870\uC815\uD560\uAE4C\uC694?', '\uAC00\uC624\uD508 \uC8FC\uBB38\uC5D0\uC11C \uB05D\uAE4C\uC9C0 \uD655\uC778\uD560 \uB2E8\uACC4\uB294?', '\uC624\uD508 \uB2F9\uC77C SV\uAC00 \uC9C1\uC811 \uD560 \uC77C\uACFC \uC810\uD3EC\uC5D0 \uB9E1\uAE38 \uC77C\uC744 \uB098\uB220 \uBCF4\uC138\uC694.', '\uC624\uD508 \uCCAB \uC8FC\uC5D0 \uB9E4\uC77C \uD655\uC778\uD560 \uC624\uB958\xB7QSC \uC9C0\uD45C\uB294?'],\n  20: ['\uACF5\uC9C0\uC758 \uBAA9\uC801\xB7\uB300\uC0C1\xB7\uC2DC\uD589\uC77C\xB7\uBCC0\uACBD \uD589\uB3D9\uC744 \uD45C\uC2DC\uD574 \uBCF4\uC138\uC694.', '\uC0C8 \uD3EC\uC7A5\uC7AC\uB97C \uC2DC\uD589\uC77C\uC5D0 \uB9DE\uCD94\uB824\uBA74 \uC5B8\uC81C \uBC1C\uC8FC\uD574\uC57C \uD560\uAE4C\uC694?', '\uC810\uC8FC\uC640 \uC9C1\uC6D0\uC5D0\uAC8C \uAC19\uC740 \uC815\uCC45\uC744 \uC5B4\uB5BB\uAC8C \uB2E4\uB974\uAC8C \uC124\uBA85\uD558\uB098\uC694?', '\uC7AC\uACE0 \uBD80\uC871\uACFC \uAD50\uC721 \uBBF8\uC644\uB8CC \uC810\uD3EC\uB97C \uAC19\uC740 \u201C\uBBF8\uC900\uBE44\u201D\uB85C \uCC98\uB9AC\uD574\uB3C4 \uB420\uAE4C\uC694?', '\uC608\uC678\uB97C \uC694\uCCAD\uD55C \uC810\uD3EC\uC758 \uC0C1\uD0DC\uB97C \uC2DC\uD589\uC77C\uC5D0 \uC5B4\uB5BB\uAC8C \uAE30\uB85D\uD558\uB098\uC694?', '\uC815\uCC45 \uBC30\uD3EC\uC728 \uB9D0\uACE0 \uC2E4\uC81C \uC815\uCC29\uC744 \uBCF4\uC5EC\uC904 \uC9C0\uD45C\uB294?'],\n  21: ['\uC810\uC8FC\uC758 \uBC18\uBC1C\uC5D0\uC11C \uBE44\uC6A9\xB7\uAE30\uC900\xB7\uACFC\uAC70 \uC57D\uC18D \uC911 \uD575\uC2EC \uC7C1\uC810\uC740?', '\uACFC\uAC70 \uAD6C\uB450 \uD5C8\uC6A9 \uC8FC\uC7A5\uACFC \uD604\uC7AC \uD655\uC778 \uC0AC\uC2E4\uC744 \uB098\uB220 \uC801\uC5B4\uBCF4\uC138\uC694.', '\uACF5\uAE09 \uBB38\uC81C\uC640 \uC758\uB3C4\uC801 \uAC70\uBD80\uB97C \uAD6C\uBD84\uD560 \uC9C8\uBB38\uC740?', '\uC2DC\uC815 \uAE30\uD55C\uACFC \uC9C0\uC6D0 \uBC29\uBC95\uC744 \uD568\uAED8 \uC81C\uC2DC\uD558\uB294 \uBB38\uC7A5\uC740?', '\uBC18\uBCF5 \uBBF8\uC900\uC218\uB97C \uBCF4\uACE0\uD560 \uB54C \uD544\uC694\uD55C \uC774\uB825\uC740?', '\uAC08\uB4F1 \uD6C4 \uB2E4\uC74C \uBA74\uB2F4\uC5D0\uC11C \uACF5\uD1B5\uC73C\uB85C \uD655\uC778\uD560 \uAE30\uC900\uC740?'],\n  22: ['\uB9E4\uCD9C \uC678 \uC5B4\uB5A4 \uC9D5\uD6C4\uAC00 \uACB9\uCE58\uBA74 \uC704\uAE30 \uC218\uC900\uC774 \uB192\uC544\uC9C0\uB098\uC694?', '\uC989\uC2DC \uC870\uCE58 \uC704\uD5D8\uACFC 2\uC8FC \uAC1C\uC120 \uACFC\uC81C\uB97C \uB098\uB220 \uBCF4\uC138\uC694.', '\uC9C0\uC6D0 \uD6A8\uACFC\uB97C \uD310\uB2E8\uD558\uB824\uBA74 \uC810\uC8FC\uC758 \uC6B4\uC601 \uC758\uC9C0 \uC678 \uBB34\uC5C7\uC774 \uD544\uC694\uD560\uAE4C\uC694?', '\uD560\uC778 \uD589\uC0AC\uBCF4\uB2E4 \uBA3C\uC800 \uD574\uACB0\uD574\uC57C \uD560 \uC6B4\uC601 \uC6D0\uC778\uC740?', '\uC7AC\uBB34\xB7\uC2DC\uC124\xB7\uC6B4\uC601 \uBD80\uC11C\uC5D0 \uAC01\uAC01 \uC5B4\uB5A4 \uC0AC\uC2E4\uC744 \uC804\uB2EC\uD560\uAE4C\uC694?', '\uD3D0\uC810\uC744 \uC5B8\uAE09\uD55C \uC810\uC8FC\uC5D0\uAC8C SV\uAC00 \uD655\uC815\uD574\uC11C\uB294 \uC548 \uB418\uB294 \uB9D0\uC740?'],\n  23: ['\uC774 \uBCF4\uACE0\uC11C\uC758 \uC218\uC2E0\uC790\uAC00 \uB0B4\uB824\uC57C \uD560 \uACB0\uC815\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?', '\uCCAB \uBB38\uB2E8\uC5D0 \uACB0\uB860\xB7\uC601\uD5A5\xB7\uC694\uCCAD\uC744 \uC5B4\uB5BB\uAC8C \uBC30\uCE58\uD560\uAE4C\uC694?', '\u201C\uC0C1\uD0DC\uAC00 \uB098\uC058\uB2E4\u201D\uB97C \uB0A0\uC9DC\uC640 \uAD00\uCC30 \uD589\uB3D9\uC73C\uB85C \uBC14\uAFD4 \uBCF4\uC138\uC694.', '\uAE34\uAE09 \uC774\uC288 \uBCF4\uACE0\uC640 \uC815\uAE30 \uBC29\uBB38 \uBCF4\uACE0\uC758 \uCCAB \uBB38\uC7A5\uC774 \uC5B4\uB5BB\uAC8C \uB2E4\uB978\uAC00\uC694?', '\uC9C0\uB09C \uC810\uAC80\uACFC \uC774\uBC88 \uBB38\uC81C\uB97C \uC5F0\uACB0\uD560 \uC774\uB825 \uC815\uBCF4\uB294?', '\uC0AC\uC9C4\xB7\uACE0\uAC1D \uC815\uBCF4\uC758 \uACF5\uC720 \uBC94\uC704\uB97C \uC5B4\uB5BB\uAC8C \uC815\uD560\uAE4C\uC694?'],\n  24: ['12\uAC1C \uC810\uD3EC\uC758 \uC704\uD5D8\uB3C4\uC640 \uC9C0\uC6D0 \uD544\uC694\uB97C \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD560\uAE4C\uC694?', '\uBC29\uBB38 \uB300\uC2E0 \uC804\uD654\uB85C \uCDA9\uBD84\uD55C \uACFC\uC81C\uC640 \uADF8\uB807\uC9C0 \uC54A\uC740 \uACFC\uC81C\uB294?', '\uC774\uB3D9 \uACBD\uB85C\uB97C \uBB36\uC73C\uBA74\uC11C \uD53C\uD06C \uAD00\uCC30 \uC2DC\uAC01\uC744 \uC9C0\uD0AC \uBC29\uBC95\uC740?', '\uC548\uC804\xB7\uAE30\uD55C\xB7\uACE0\uAC1D \uC601\uD5A5 \uC911 \uC774\uBC88 \uC8FC \uCD5C\uC6B0\uC120 \uACFC\uC81C\uB294?', '\uAE34\uAE09 \uACE0\uC7A5\uC774 \uC0DD\uACBC\uC744 \uB54C \uC5F0\uAE30\uB41C \uC810\uD3EC\uC5D0 \uC5B4\uB5BB\uAC8C \uC548\uB0B4\uD560\uAE4C\uC694?', '\uC8FC\uAC04 \uB9C8\uAC10\uC5D0\uC11C \uBC18\uBCF5 \uC9C0\uC5F0\uC758 \uC6D0\uC778\uC744 \uC5B4\uB5BB\uAC8C \uCC3E\uC744\uAE4C\uC694?']\n};\n", "data.js": "const moduleDefinitions = [\n  {id:'foundation',number:'01',name:'\uC288\uD37C\uBC14\uC774\uC800 \uAE30\uBCF8 \uC5ED\uB7C9',subtitle:'\uC5ED\uD560\xB7\uAD8C\uD55C\uACFC \uAC00\uB9F9\uC0AC\uC5C5\uC758 \uAD6C\uC870\uB97C \uC774\uD574\uD569\uB2C8\uB2E4.',tone:'sage',icon:'\u25C7'},\n  {id:'operations',number:'02',name:'\uC810\uD3EC \uC6B4\uC601 \uBC0F \uD488\uC9C8 \uAD00\uB9AC',subtitle:'QSC\uC640 \uC6B4\uC601 \uAE30\uC900\uC744 \uD604\uC7A5\uC5D0\uC11C \uD655\uC778\uD558\uACE0 \uAC1C\uC120\uD569\uB2C8\uB2E4.',tone:'blue',icon:'\u25A4'},\n  {id:'growth',number:'03',name:'\uB9E4\uCD9C \uBC0F \uC218\uC775 \uAC1C\uC120',subtitle:'\uB370\uC774\uD130\uB97C \uC77D\uACE0 \uC810\uD3EC \uC131\uACFC\uB85C \uC5F0\uACB0\uD569\uB2C8\uB2E4.',tone:'peach',icon:'\u2197'},\n  {id:'people',number:'04',name:'\uC18C\uD1B5 \uBC0F \uC778\uB825 \uC721\uC131',subtitle:'\uC810\uC8FC\xB7\uC9C1\uC6D0\uACFC \uD568\uAED8 \uC2E4\uD589\uD558\uB294 \uBC29\uBC95\uC744 \uBC30\uC6C1\uB2C8\uB2E4.',tone:'lavender',icon:'\u2667'},\n  {id:'response',number:'05',name:'\uC624\uD508 \uBC0F \uBB38\uC81C \uD574\uACB0',subtitle:'\uC2E0\uADDC \uC624\uD508\uBD80\uD130 \uACE0\uAC1D \uBD88\uB9CC\uACFC \uC704\uAE30 \uB300\uC751\uAE4C\uC9C0 \uB2E4\uB8F9\uB2C8\uB2E4.',tone:'yellow',icon:'\u2733'},\n  {id:'management',number:'06',name:'\uBCF4\uACE0 \uBC0F \uC5C5\uBB34 \uAD00\uB9AC',subtitle:'\uC815\uBCF4\uB97C \uAE30\uB85D\uD558\uACE0 \uD6C4\uC18D \uC870\uCE58\uB97C \uB05D\uAE4C\uC9C0 \uAD00\uB9AC\uD569\uB2C8\uB2E4.',tone:'mint',icon:'\u25A6'}\n];\nconst modules = moduleDefinitions.map(module => ({\n  ...module,\n  lessons:courses.filter(course => course.moduleId === module.id)\n}));\n\nconst tracks = [\n  {id:'supervisor',eyebrow:'TRACK 01',title:'\uC288\uD37C\uBC14\uC774\uC9D5 \uC9C1\uBB34 \uAD50\uC721',description:'24\uAC1C \uC2E4\uBB34 \uACFC\uC815\uC73C\uB85C \uC810\uD3EC \uC9C4\uB2E8\uBD80\uD130 \uAC1C\uC120 \uC2E4\uD589\uAE4C\uC9C0 \uCCB4\uACC4\uC801\uC73C\uB85C \uD559\uC2B5\uD569\uB2C8\uB2E4.',icon:'\u25C8',color:'green',status:'\uD559\uC2B5 \uAC00\uB2A5'},\n  {id:'development',eyebrow:'TRACK 02',title:'\uC810\uD3EC\uAC1C\uBC1C \uC9C1\uBB34 \uAD50\uC721',description:'\uC785\uC9C0 \uBC1C\uAD74\uBD80\uD130 \uACC4\uC57D, \uC624\uD508 \uC900\uBE44\uAE4C\uC9C0\uC758 \uD750\uB984\uC744 \uBC30\uC6B8 \uC608\uC815\uC785\uB2C8\uB2E4.',icon:'\u2316',color:'sand',status:'\uC900\uBE44 \uC911'},\n  {id:'qsc',eyebrow:'SIMULATION 01',title:'QSC \uBAA8\uC758 \uC810\uAC80 \uC2DC\uBBAC\uB808\uC774\uC158',description:'\uAC00\uC0C1 \uC810\uD3EC\uB97C \uC9C1\uC811 \uC810\uAC80\uD558\uB294 \uC2E4\uC2B5 \uC571\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.',icon:'\u2611',color:'blue',status:'\uC2E4\uC2B5 \uAC00\uB2A5',url:'https://qsc-field-simulator-20261022.earthyeagle4.chatgpt.site/'},\n  {id:'market',eyebrow:'SIMULATION 02',title:'\uBAA8\uC758 \uC0C1\uAD8C\uBD84\uC11D \uC2DC\uBBAC\uB808\uC774\uC158',description:'\uACE0\uAC1D \uB3D9\uC120\uACFC \uACBD\uC7C1 \uD658\uACBD\uC744 \uC77D\uACE0 \uC785\uC9C0\uB97C \uD3C9\uAC00\uD558\uB294 \uC2E4\uC2B5\uC785\uB2C8\uB2E4.',icon:'\u25CE',color:'purple',status:'\uC900\uBE44 \uC911'}\n];\n", "app.js": `const app = document.getElementById('app');
const dialog = document.getElementById('lessonDialog');
const allLessons = modules.flatMap(module => module.lessons.map(course => ({...course,module})));
const progressKey = 'yoohastree-sv-completed-v2';
let savedProgress = [];
try { savedProgress = JSON.parse(localStorage.getItem(progressKey) || '[]'); } catch {}
const validIds = new Set(allLessons.map(course => course.id));
const completed = new Set(Array.isArray(savedProgress) ? savedProgress.filter(id => validIds.has(id)) : []);
let view = 'home';
let currentLesson = null;
let filter = 'all';
let query = '';

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const progress = () => Math.round(completed.size / allLessons.length * 100);
const formatCount = number => String(number).padStart(2,'0');
const saveProgress = () => { try { localStorage.setItem(progressKey, JSON.stringify([...completed])); } catch {} };
const courseMatches = course => \`\${course.title} \${course.objective} \${course.topics.map(topic => \`\${topic.title} \${topic.detail}\`).join(' ')} \${course.forms.join(' ')} \${lessonContent[course.number]?.teaching.join(' ') || ''}\`.toLowerCase().includes(query.toLowerCase());

function lessonCard(course){
  return \`<button class="lesson-row" data-lesson="\${course.id}"><span class="lesson-check \${completed.has(course.id)?'done':''}">\${completed.has(course.id)?'\u2713':'\u25CB'}</span><span class="course-number">\${formatCount(course.number)}</span><span class="lesson-row-copy"><strong>\${escapeHTML(course.title)}</strong><small>\${escapeHTML(course.objective)}</small></span><span class="lesson-time">60\uBD84 \uAD50\uC721\uC548</span><span class="row-arrow">\u2197</span></button>\`;
}

function renderHome(){
  app.innerHTML = \`<div class="page home-page">
    <section class="welcome"><div class="welcome-copy"><div class="eyebrow light"><span></span> LEARNING PLATFORM</div><h1>\uD604\uC7A5\uC758 \uC804\uBB38\uC131\uC744<br><em>\uD55C \uB2E8\uACC4 \uB354.</em></h1><p>\uD504\uB79C\uCC28\uC774\uC988 \uC6B4\uC601\uC758 \uAE30\uC900\uC744 \uBC30\uC6B0\uACE0, \uC2E4\uC81C \uC810\uD3EC\uC5D0\uC11C \uC2E4\uD589\uD560 \uC218 \uC788\uB294 \uC5ED\uB7C9\uC73C\uB85C \uC5F0\uACB0\uD558\uC138\uC694.</p><button class="hero-button" data-go="supervisor">\uC288\uD37C\uBC14\uC774\uC9D5 \uAD50\uC721 \uC2DC\uC791\uD558\uAE30 <span>\u2197</span></button></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-monogram">Y<span>.</span></div><div class="hero-pill pill-one">Learn</div><div class="hero-pill pill-two">Apply</div><div class="hero-pill pill-three">Grow</div></div><span class="hero-index">01 / 04</span></section>
    <section class="section-intro"><div><div class="eyebrow">YOUR LEARNING JOURNEY</div><h2>\uB098\uC758 \uD559\uC2B5 \uD604\uD669</h2><p>24\uAC1C SV 60\uBD84 \uAD50\uC721\uC548\uC744 \uCC28\uADFC\uCC28\uADFC \uD559\uC2B5\uD574 \uBCF4\uC138\uC694.</p></div><div class="stat-grid"><div class="stat-card"><span>\uC804\uCCB4 \uACFC\uC815</span><strong>\${formatCount(allLessons.length)}<small>\uAC1C</small></strong></div><div class="stat-card"><span>\uD559\uC2B5 \uC644\uB8CC</span><strong>\${formatCount(completed.size)}<small>\uAC1C</small></strong></div><div class="stat-card accent"><span>\uD604\uC7AC \uC9C4\uB3C4\uC728</span><strong>\${progress()}<small>%</small></strong><div class="mini-progress"><i style="width:\${progress()}%"></i></div></div></div></section>
    <section class="track-section"><div class="section-heading"><div><div class="eyebrow">EXPLORE THE CURRICULUM</div><h2>\uAD50\uC721 \uACFC\uC815 \uC0B4\uD3B4\uBCF4\uAE30</h2></div><span>4\uAC1C\uC758 \uD559\uC2B5 \uC601\uC5ED</span></div><div class="track-grid">\${tracks.map(track => track.url ? \`<a class="track-card \${track.color}" href="\${track.url}" target="_blank" rel="noopener noreferrer" aria-label="\${track.title} \uC0C8 \uD0ED\uC5D0\uC11C \uC5F4\uAE30"><span class="track-icon">\${track.icon}</span><span class="track-number">\${track.eyebrow}</span><strong>\${track.title}</strong><span class="track-description">\${track.description}</span><span class="track-footer"><b class="available">\${track.status}</b><i>\u2197</i></span></a>\` : \`<button class="track-card \${track.color}" data-go="\${track.id}"><span class="track-icon">\${track.icon}</span><span class="track-number">\${track.eyebrow}</span><strong>\${track.title}</strong><span class="track-description">\${track.description}</span><span class="track-footer"><b class="\${track.status==='\uD559\uC2B5 \uAC00\uB2A5'?'available':''}">\${track.status}</b><i>\u2197</i></span></button>\`).join('')}</div></section>
    <section class="bottom-note"><div><span class="eyebrow">FIELD NOTES</span><h3>\uBC30\uC6C0\uC774 \uD604\uC7A5\uC5D0\uC11C \uB05D\uB098\uC9C0 \uC54A\uB3C4\uB85D</h3><p>\uAC01 \uACFC\uC815\uC758 \uC2E4\uC2B5\uACFC \uD65C\uC6A9 \uC591\uC2DD\uC744 \uB2F4\uB2F9 \uC810\uD3EC\uC5D0 \uC801\uC6A9\uD574 \uBCF4\uC138\uC694. \uC644\uB8CC \uD45C\uC2DC\uB294 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uC800\uC7A5\uB429\uB2C8\uB2E4.</p></div><div class="note-symbol">\u2733</div></section>
  </div>\`;
}

function renderModuleList(){
  const visible = modules.map(module => ({
    module,
    lessons: module.lessons.filter(course => !query || module.name.toLowerCase().includes(query.toLowerCase()) || courseMatches(course))
  })).filter(entry => (filter === 'all' || entry.module.id === filter) && entry.lessons.length);
  document.getElementById('moduleList').innerHTML = visible.length ? visible.map(({module,lessons}) => {
    const done = module.lessons.filter(course => completed.has(course.id)).length;
    return \`<section class="module-card"><div class="module-heading"><div class="module-icon \${module.tone}">\${module.icon}</div><div class="module-title"><span>MODULE \${module.number}</span><h3>\${module.name}</h3><p>\${module.subtitle}</p></div><div class="module-progress"><strong>\${done}<span> / \${module.lessons.length}</span></strong><small>\uD559\uC2B5 \uC644\uB8CC</small></div></div><div class="lesson-list">\${lessons.map(lessonCard).join('')}</div></section>\`;
  }).join('') : '<div class="empty-state">\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uB2E8\uC5B4\uB85C \uAC80\uC0C9\uD574 \uBCF4\uC138\uC694.</div>';
}

function renderSupervisor(){
  app.innerHTML = \`<div class="page curriculum-page"><div class="page-head"><div class="eyebrow">TRACK 01 \xB7 SUPERVISING</div><h1>\uC288\uD37C\uBC14\uC774\uC9D5 \uC9C1\uBB34 \uAD50\uC721</h1><p>\uC810\uD3EC \uD604\uC7A5\uC744 \uC9C4\uB2E8\uD558\uACE0 \uAC1C\uC120\uC744 \uC2E4\uD589\uD558\uB294 24\uAC1C \uC2E4\uBB34 \uACFC\uC815\uC785\uB2C8\uB2E4. \uAC01 \uACFC\uC815\uC740 60\uBD84 \uAD50\uC721\uC548, \uD604\uC7A5 \uC0AC\uB840, \uC2E4\uC2B5\uACFC \uC774\uD574\uB3C4 \uD655\uC778\uC73C\uB85C \uAD6C\uC131\uB429\uB2C8\uB2E4.</p><div class="head-meta"><span>\u25A6 \${modules.length}\uAC1C \uB300\uBD84\uB958</span><span>\u25C8 \${allLessons.length}\uAC1C \uACFC\uC815</span><span>\u25F7 \uACFC\uC815\uBCC4 60\uBD84</span></div></div>
    <div class="curriculum-toolbar"><div class="section-heading"><div><div class="eyebrow">COURSE OVERVIEW</div><h2>SV \uCEE4\uB9AC\uD058\uB7FC</h2></div><span>\${completed.size} / \${allLessons.length} \uACFC\uC815 \uC644\uB8CC</span></div><div class="toolbar-row"><div class="filter-scroll"><button class="filter-chip \${filter==='all'?'selected':''}" data-filter="all">\uC804\uCCB4</button>\${modules.map(module => \`<button class="filter-chip \${filter===module.id?'selected':''}" data-filter="\${module.id}">\${module.number} \${module.name}</button>\`).join('')}</div><label class="search-box"><span>\u2315</span><input id="searchLessons" type="search" placeholder="\uACFC\uC815\xB7\uAD50\uC721 \uD56D\uBAA9 \uAC80\uC0C9" value="\${escapeHTML(query)}" aria-label="\uACFC\uC815 \uAC80\uC0C9"></label></div></div>
    <div class="module-list" id="moduleList"></div></div>\`;
  renderModuleList();
  document.getElementById('searchLessons').addEventListener('input', event => { query = event.target.value; renderModuleList(); });
}

function renderUpcoming(id){
  const track = tracks.find(item => item.id === id);
  if(id === 'qsc'){
    app.innerHTML = \`<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">\${track.eyebrow}</div><h1>\${track.title}</h1><p>\uAC00\uC0C1 \uC810\uD3EC\uB97C \uC9C1\uC811 \uC810\uAC80\uD558\uB294 \uC2E4\uC2B5 \uC571\uC5D0\uC11C QSC \uD310\uB2E8\uACFC \uAC1C\uC120 \uC6B0\uC120\uC21C\uC704 \uC124\uC815\uC744 \uC5F0\uC2B5\uD574 \uBCF4\uC138\uC694.</p></div><div class="qsc-link-panel"><div class="module-icon blue">\u2611</div><div><span class="eyebrow">PRACTICE NOW</span><h2>QSC \uD604\uC7A5 \uC810\uAC80 \uC2E4\uC2B5</h2><p>\uC544\uB798 \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 \uC2DC\uBBAC\uB808\uC774\uC158 \uC571\uC774 \uC0C8 \uD0ED\uC5D0\uC11C \uC5F4\uB9BD\uB2C8\uB2E4.</p></div><a class="hero-button" href="\${track.url}" target="_blank" rel="noopener noreferrer">\uC2DC\uBBAC\uB808\uC774\uC158 \uC2DC\uC791 <span>\u2197</span></a></div></div>\`;
    return;
  }
  const plans = {development:{label:'\uC810\uD3EC\uAC1C\uBC1C \uC9C1\uBB34',items:['\uC785\uC9C0 \uD6C4\uBCF4 \uBC1C\uAD74\uACFC \uC0C1\uAD8C \uAE30\uCD08\uC870\uC0AC','\uB9E4\uCD9C \uCD94\uC815\uACFC \uCD9C\uC810 \uD0C0\uB2F9\uC131 \uAC80\uD1A0','\uACC4\uC57D\xB7\uC778\uD5C8\uAC00\xB7\uACF5\uC0AC \uC77C\uC815 \uAD00\uB9AC','\uC624\uD508 \uC804 \uC810\uAC80\uACFC \uCD08\uAE30 \uC6B4\uC601 \uC9C0\uC6D0']},market:{label:'\uBAA8\uC758 \uC0C1\uAD8C\uBD84\uC11D',items:['\uC0C1\uAD8C \uBC94\uC704\uC640 \uD575\uC2EC \uACE0\uAC1D \uC124\uC815','\uC720\uB3D9\xB7\uBC30\uD6C4 \uC218\uC694\uC640 \uC811\uADFC \uB3D9\uC120 \uAC80\uD1A0','\uACBD\uC7C1\uC810\xB7\uC9D1\uAC1D \uC2DC\uC124 \uBE44\uAD50','\uC785\uC9C0 \uC810\uC218\uC640 \uCD9C\uC810 \uC758\uACAC \uC791\uC131']}};
  const plan = plans[id];
  app.innerHTML = \`<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">\${track.eyebrow}</div><h1>\${track.title}</h1><p>\${track.description}</p></div><div class="upcoming-content"><div class="upcoming-visual"><span>\${track.icon}</span><div>COMING<br>SOON.</div></div><div class="upcoming-copy"><span class="eyebrow">NEXT IN THE JOURNEY</span><h2>\${plan.label} \uCF58\uD150\uCE20\uB97C<br>\uC900\uBE44\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</h2><p>\uD604\uC7AC\uB294 \uC288\uD37C\uBC14\uC774\uC9D5 \uC9C1\uBB34 \uAD50\uC721\uC758 24\uAC1C \uACFC\uC815\uC744 \uD559\uC2B5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC774 \uC601\uC5ED\uC740 \uB2E4\uC74C \uC81C\uC791 \uB2E8\uACC4\uC5D0\uC11C \uC2E4\uC2B5 \uC790\uB8CC\uC640 \uD568\uAED8 \uCC44\uC6CC\uC9C8 \uC608\uC815\uC785\uB2C8\uB2E4.</p><h3>\uC608\uC815\uB41C \uD559\uC2B5 \uD750\uB984</h3><ol>\${plan.items.map(item => \`<li>\${item}</li>\`).join('')}</ol><button class="outline-button" data-go="supervisor">\uC288\uD37C\uBC14\uC774\uC9D5 \uAD50\uC721 \uBCF4\uAE30 <span>\u2197</span></button></div></div></div>\`;
}

function openLesson(id){
  const course = allLessons.find(item => item.id === id);
  if(!course) return;
  const content = lessonContent[course.number];
  if(!content) return;
  currentLesson = course;
  document.getElementById('lessonModule').textContent = \`SV \uACFC\uC815 \${formatCount(course.number)} \xB7 \${course.module.name}\`;
  document.getElementById('lessonBody').innerHTML = \`
    <span class="lesson-duration">SV COURSE \${formatCount(course.number)} \xB7 60\uBD84 \uAD50\uC721\uC548</span>
    <h2 id="lessonTitle">\${escapeHTML(course.title)}</h2>
    <div class="objective-box"><span>\uAD50\uC721 \uBAA9\uD45C</span><p>\${escapeHTML(course.objective)}</p></div>
    <div class="lesson-agenda" aria-label="60\uBD84 \uC9C4\uD589 \uC21C\uC11C"><div><strong>05\uBD84</strong><span>\uC0AC\uB840\xB7\uBAA9\uD45C</span></div><div><strong>36\uBD84</strong><span>\uD575\uC2EC \uD559\uC2B5 6\uD56D\uBAA9</span></div><div><strong>14\uBD84</strong><span>\uD604\uC7A5 \uC2E4\uC2B5</span></div><div><strong>05\uBD84</strong><span>\uC774\uD574\uB3C4 \uD655\uC778</span></div></div>
    <section class="case-box"><h3><span>01</span> \uC2DC\uC791 \uC0AC\uB840</h3><p>\${escapeHTML(content.scenario)}</p><small>\uC774 \uC0AC\uB840\uC5D0\uC11C \uBB34\uC5C7\uC744 \uBA3C\uC800 \uD655\uC778\uD560\uC9C0 \uC0DD\uAC01\uD55C \uB4A4 \uAD50\uC721 \uB0B4\uC6A9\uC744 \uC77D\uC5B4\uBCF4\uC138\uC694.</small></section>
    <div class="lesson-divider"></div><h3><span>02</span> \uD575\uC2EC \uAD50\uC721 \uB0B4\uC6A9 <small>\uAC01 \uD56D\uBAA9 6\uBD84 \xB7 \uC124\uBA85 4\uBD84 + \uD1A0\uC758 2\uBD84</small></h3>
    <div class="learning-points">\${course.topics.map((topic,index) => \`<div class="learning-point"><span>\${formatCount(index+1)}</span><div><strong>\${escapeHTML(topic.title)}</strong><p class="topic-outline">\${escapeHTML(topic.detail)}</p><p class="teaching-copy">\${escapeHTML(content.teaching[index])}</p><div class="discussion-prompt"><b>\uD604\uC7A5 \uD1A0\uC758</b> \${escapeHTML(lessonPrompts[course.number][index])}</div></div></div>\`).join('')}</div>
    <div class="practice-box"><div class="practice-heading"><span>\u2733</span><strong>\uD604\uC7A5 \uC2E4\uC2B5 \xB7 14\uBD84</strong></div><p>\${escapeHTML(course.practice)}</p><ol class="practice-steps">\${content.task.map(step => \`<li>\${escapeHTML(step)}</li>\`).join('')}</ol>\${course.number === 1 ? '<a class="simulation-inline" href="https://qsc-field-simulator-20261022.earthyeagle4.chatgpt.site/" target="_blank" rel="noopener noreferrer">QSC \uBAA8\uC758 \uC810\uAC80 \uC2DC\uBBAC\uB808\uC774\uC158 \uC5F4\uAE30 \u2197</a>' : ''}</div>
    <section class="knowledge-check"><h3><span>03</span> \uC774\uD574\uB3C4 \uD655\uC778 \xB7 5\uBD84</h3>\${content.check.map(([question,answer]) => \`<details><summary>\${escapeHTML(question)}</summary><p>\${escapeHTML(answer)}</p></details>\`).join('')}</section>
    <div class="forms-section"><h3><span>04</span> \uC2E4\uBB34 \uD65C\uC6A9 \uC591\uC2DD</h3><div class="form-list">\${course.forms.map(form => \`<span>\${escapeHTML(form)}</span>\`).join('')}</div></div>
    \${course.note ? \`<p class="course-note">\u203B \${escapeHTML(course.note)}</p>\` : ''}<p class="lesson-disclaimer">\uC774 \uAD50\uC721\uC548\uC740 \uACF5\uD1B5 \uC2E4\uBB34 \uC608\uC2DC\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uC801\uC6A9 \uAE30\uC900\xB7\uC2B9\uC778 \uAD8C\uD55C\xB7\uC218\uCE58\uB294 \uD574\uB2F9 \uBE0C\uB79C\uB4DC\uC758 \uCD5C\uC2E0 \uC6B4\uC601 \uB9E4\uB274\uC5BC\uACFC \uC815\uCC45\uC744 \uD655\uC778\uD558\uC138\uC694.</p>\`;
  document.getElementById('completeLesson').innerHTML = completed.has(id) ? '\uD559\uC2B5 \uC644\uB8CC \uCDE8\uC18C <span>\u2197</span>' : '\uD559\uC2B5 \uC644\uB8CC\uB85C \uD45C\uC2DC <span>\u2197</span>';
  dialog.showModal();
}

function navigate(next){
  view = next;
  filter = 'all';
  query = '';
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === next));
  document.getElementById('breadcrumbCurrent').textContent = next === 'home' ? '\uB300\uC2DC\uBCF4\uB4DC' : tracks.find(track => track.id === next)?.title || '';
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('menuButton').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
  if(next === 'home') renderHome(); else if(next === 'supervisor') renderSupervisor(); else renderUpcoming(next);
  history.replaceState(null,'',\`#\${next}\`);
}

document.addEventListener('click', event => {
  const navigation = event.target.closest('[data-go],[data-view]');
  if(navigation){ navigate(navigation.dataset.go || navigation.dataset.view); return; }
  const lesson = event.target.closest('[data-lesson]');
  if(lesson){ openLesson(lesson.dataset.lesson); return; }
  const chip = event.target.closest('[data-filter]');
  if(chip){ filter = chip.dataset.filter; document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('selected',button.dataset.filter === filter)); renderModuleList(); }
});
document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
document.getElementById('completeLesson').addEventListener('click', () => {
  if(!currentLesson) return;
  const id = currentLesson.id;
  if(completed.has(id)) completed.delete(id); else completed.add(id);
  saveProgress();
  dialog.close();
  view === 'home' ? renderHome() : renderSupervisor();
  const toast = document.getElementById('toast');
  toast.textContent = completed.has(id) ? '\uD559\uC2B5 \uC644\uB8CC\uB85C \uD45C\uC2DC\uD588\uC2B5\uB2C8\uB2E4.' : '\uD559\uC2B5 \uC644\uB8CC \uD45C\uC2DC\uB97C \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});
document.getElementById('menuButton').addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
  document.getElementById('menuButton').setAttribute('aria-expanded',sidebar.classList.contains('open'));
});
document.getElementById('today').textContent = new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());
window.addEventListener('hashchange', () => {
  const next = location.hash.slice(1);
  if(['home','supervisor','development','qsc','market'].includes(next) && next !== view) navigate(next);
});
navigate(['home','supervisor','development','qsc','market'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home');
` };
var OWNER_EMAIL = "yoohatree@gmail.com";
var ASSET_NAMES = new Set(Object.keys(embeddedAssets));
var NO_STORE = { "cache-control": "private, no-store, max-age=0", "x-content-type-options": "nosniff" };
var legacyRecordIdsByEmail = /* @__PURE__ */ new Map();
function html(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function response(body, status = 200, contentType = "text/html; charset=utf-8") {
  return new Response(body, { status, headers: { ...NO_STORE, "content-type": contentType } });
}
function redirect(path) {
  return new Response(null, { status: 303, headers: { ...NO_STORE, location: path } });
}
function legacyIdentity(request) {
  const id = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email");
  if (!id || !email) return null;
  return { id, email, isOwner: email.toLowerCase() === OWNER_EMAIL };
}
function clerkEnabled(env) {
  return env.AUTH_PROVIDER === "clerk";
}
function clerkPublishableKey(env) {
  return env.CLERK_PUBLISHABLE_KEY || env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}
function clerkFrontendDomain(publishableKey) {
  const encoded = String(publishableKey).replace(/^pk_(test|live)_/, "");
  try {
    const domain = atob(encoded).replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(domain) ? domain : null;
  } catch {
    return null;
  }
}
async function authenticate(request, env) {
  if (!clerkEnabled(env)) return { user: legacyIdentity(request) };
  if (!clerkPublishableKey(env) || !env.CLERK_SECRET_KEY) {
    return { response: response("Clerk \uC124\uC815\uC774 \uC644\uB8CC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.", 503, "text/plain; charset=utf-8") };
  }
  try {
    const client = env.__clerkClient || createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
      publishableKey: clerkPublishableKey(env)
    });
    const state = await client.authenticateRequest(request, {
      authorizedParties: [new URL(request.url).origin],
      acceptsToken: "session_token"
    });
    const location = state.headers?.get("location");
    if (location) return { response: new Response(null, { status: 307, headers: state.headers }) };
    if (!state.isAuthenticated) return { user: null };
    const clerkId = state.toAuth().userId;
    if (!clerkId) return { user: null };
    const account = await client.users.getUser(clerkId);
    const primary = account.emailAddresses?.find((item) => item.id === account.primaryEmailAddressId);
    if (!primary || primary.verification?.status !== "verified") return { user: null };
    const email = primary.emailAddress.toLowerCase();
    return { user: { id: `clerk:${clerkId}`, email, isOwner: email === OWNER_EMAIL } };
  } catch (error) {
    console.error("Clerk authentication failed", error);
    return { response: response("\uB85C\uADF8\uC778 \uC11C\uBE44\uC2A4\uB97C \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.", 503, "text/plain; charset=utf-8") };
  }
}
function keyFor(id) {
  return `requests/${encodeURIComponent(id)}.json`;
}
async function recordFor(bucket, id) {
  const object = await bucket.get(keyFor(id));
  if (!object) return null;
  try {
    return await object.json();
  } catch {
    return null;
  }
}
async function recordForUser(bucket, user) {
  const direct = await recordFor(bucket, user.id);
  if (direct || !user.id.startsWith("clerk:")) return direct;
  const email = user.email.toLowerCase();
  let legacyId = legacyRecordIdsByEmail.get(email);
  if (legacyId === void 0) {
    const match2 = (await allRecords(bucket)).find((row) => row.email.toLowerCase() === email && !row.id.startsWith("clerk:"));
    legacyId = match2?.id;
    if (legacyId) legacyRecordIdsByEmail.set(email, legacyId);
  }
  return legacyId ? recordFor(bucket, legacyId) : null;
}
async function saveRecord(bucket, record) {
  await bucket.put(keyFor(record.id), JSON.stringify(record), { httpMetadata: { contentType: "application/json" } });
}
function validPost(request) {
  const origin = request.headers.get("origin");
  return origin === new URL(request.url).origin;
}
function shell(title, body, { refresh = false } = {}) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${refresh ? '<meta http-equiv="refresh" content="30">' : ""}<title>${html(title)} \xB7 Yoohastree Franchise Training</title><style>
    :root{font-family:'Noto Sans KR',system-ui,sans-serif;color:#193b32;background:#f5f8f3}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 80% 10%,#e8f2da,transparent 35%),#f5f8f3}header{padding:25px clamp(20px,5vw,64px);display:flex;justify-content:space-between;gap:16px;align-items:center;border-bottom:1px solid #dfe8dc;background:#fff}header strong{font-size:16px;letter-spacing:.1em}header span{font-size:12px;color:#6c8777}main{max-width:860px;margin:70px auto;padding:0 20px 70px}.card{background:#fff;border:1px solid #dfebde;border-radius:18px;padding:clamp(26px,5vw,52px);box-shadow:0 20px 60px #1b4a3220}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.17em;color:#6c9b60}h1{font-size:clamp(26px,4vw,38px);letter-spacing:-.05em;margin:14px 0}h2{font-size:18px;margin:0 0 12px}p{line-height:1.8;color:#546d5c}small{color:#6b8172}a{color:#285c42}.button,button{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:9px;background:#193f34;color:#fff;padding:13px 20px;font-weight:800;font-size:14px;text-decoration:none;cursor:pointer}.button:hover,button:hover{background:#2b624c}.button.secondary,button.secondary{background:#e6f1dc;color:#225339}.button.danger,button.danger{background:#fff0e9;color:#914e39}form{margin:20px 0 0}.notice{margin-top:26px;padding:15px 18px;background:#edf5e8;border-radius:9px;color:#43634b;font-size:13px;line-height:1.7}.row{display:flex;justify-content:space-between;gap:18px;align-items:center;border-top:1px solid #e5ebe5;padding:18px 0}.row:first-child{border-top:0}.row strong,.row small{display:block}.row small{margin-top:5px}.actions{display:flex;gap:8px;flex-wrap:wrap}.actions form{margin:0}.grid{display:grid;gap:20px}.muted{color:#78907d;font-size:13px}.count{display:inline-block;background:#d8edc7;border-radius:20px;padding:3px 9px;color:#315d39;font-size:12px;margin-left:6px}
  </style></head><body><header><strong>YOOHASTREE</strong><span>FRANCHISE TRAINING</span></header><main>${body}</main></body></html>`;
}
function clerkScripts(env) {
  const key = clerkPublishableKey(env);
  const domain = clerkFrontendDomain(key);
  if (!domain) return "";
  return `<script defer crossorigin="anonymous" src="https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js"><\/script><script defer crossorigin="anonymous" data-clerk-publishable-key="${html(key)}" src="https://${domain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js"><\/script>`;
}
function signInPage(returnTo, env) {
  if (clerkEnabled(env)) {
    const script = `<script>window.addEventListener('load',async()=>{try{await Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});if(Clerk.isSignedIn){location.replace(${JSON.stringify(returnTo)});return}Clerk.mountSignIn(document.getElementById('clerk-sign-in'),{routing:'hash',forceRedirectUrl:${JSON.stringify(returnTo)},signUpForceRedirectUrl:${JSON.stringify(returnTo)}})}catch(error){document.getElementById('clerk-sign-in').textContent='\uB85C\uADF8\uC778 \uD654\uBA74\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C\uACE0\uCE68\uD574 \uC8FC\uC138\uC694.'}})<\/script>`;
    return shell("\uC9C1\uC6D0 \uB85C\uADF8\uC778", `<section class="card"><div class="eyebrow">STAFF ACCESS</div><h1>\uD504\uB79C\uCC28\uC774\uC988 \uAD50\uC721 \uB85C\uADF8\uC778</h1><p>\uBCF8\uC778 \uC774\uBA54\uC77C\uB85C \uB85C\uADF8\uC778\uD558\uBA74 \uC811\uC18D \uC2B9\uC778\uC744 \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC2B9\uC778\uB41C \uACC4\uC815\uC5D0\uB9CC \uAD50\uC721 \uC790\uB8CC\uAC00 \uC81C\uACF5\uB429\uB2C8\uB2E4.</p><div id="clerk-sign-in" aria-live="polite">\uB85C\uADF8\uC778 \uD654\uBA74\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4\u2026</div><div class="notice">\uC2B9\uC778 \uC694\uCCAD\uC5D0 \uC0AC\uC6A9\uD55C \uC774\uBA54\uC77C\uACFC \uC774\uD6C4 \uB85C\uADF8\uC778\uD560 \uC774\uBA54\uC77C\uC740 \uAC19\uC544\uC57C \uD569\uB2C8\uB2E4.</div></section>${clerkScripts(env)}${script}`);
  }
  const path = `/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`;
  return shell("\uC9C1\uC6D0 \uB85C\uADF8\uC778", `<section class="card"><div class="eyebrow">STAFF ACCESS</div><h1>\uD504\uB79C\uCC28\uC774\uC988 \uAD50\uC721\uC5D0 \uCC38\uC5EC\uD558\uC138\uC694</h1><p>\uC9C1\uC6D0 \uBCF8\uC778\uC758 \uC774\uBA54\uC77C\uB85C \uB85C\uADF8\uC778\uD55C \uB4A4 \uC811\uC18D \uC2B9\uC778\uC744 \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uAD50\uC721 \uC790\uB8CC\uB294 \uB300\uD45C\uB2D8\uC758 \uC2B9\uC778\uC744 \uBC1B\uC740 \uACC4\uC815\uC5D0\uB9CC \uC81C\uACF5\uB429\uB2C8\uB2E4.</p><a class="button" href="${path}" target="_top">\uB85C\uADF8\uC778\uD558\uACE0 \uC2B9\uC778 \uC694\uCCAD\uD558\uAE30 \u2197</a><div class="notice">\uC2B9\uC778 \uC694\uCCAD\uC5D0 \uC0AC\uC6A9\uD55C \uC774\uBA54\uC77C\uACFC \uC774\uD6C4 \uB85C\uADF8\uC778\uD560 \uC774\uBA54\uC77C\uC740 \uAC19\uC544\uC57C \uD569\uB2C8\uB2E4.</div></section>`);
}
function signOutPage(env) {
  if (!clerkEnabled(env)) return redirect("/signout-with-chatgpt?return_to=%2F");
  const script = `<script>window.addEventListener('load',async()=>{try{await Clerk.load();await Clerk.signOut()}finally{location.replace('/')}})<\/script>`;
  return shell("\uB85C\uADF8\uC544\uC6C3", `<section class="card"><h1>\uB85C\uADF8\uC544\uC6C3 \uC911\uC785\uB2C8\uB2E4</h1><p>\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694.</p></section>${clerkScripts(env)}${script}`);
}
function requestPage(user, record) {
  const state = record?.status;
  const title = state === "pending" ? "\uC2B9\uC778 \uB300\uAE30 \uC911" : state === "rejected" ? "\uC811\uC18D \uC2B9\uC778 \uC694\uCCAD" : "\uC811\uC18D \uC2B9\uC778 \uC694\uCCAD";
  const lead = state === "pending" ? "\uB300\uD45C\uB2D8\uAED8 \uC2B9\uC778 \uC694\uCCAD\uC774 \uC804\uB2EC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC2B9\uC778\uB418\uBA74 \uC774 \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C\uACE0\uCE68\uD558\uC5EC \uAD50\uC721\uC5D0 \uC811\uC18D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." : state === "rejected" ? "\uC774\uC804 \uC694\uCCAD\uC774 \uC2B9\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC694\uCCAD\uD558\uB824\uBA74 \uC544\uB798 \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694." : "\uC544\uB798 \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 \uB300\uD45C\uB2D8\uC5D0\uAC8C \uC811\uC18D \uC2B9\uC778 \uC694\uCCAD\uC774 \uB4F1\uB85D\uB429\uB2C8\uB2E4.";
  const action = state === "pending" ? '<a class="button secondary" href="/">\uC2B9\uC778 \uC0C1\uD0DC \uC0C8\uB85C\uACE0\uCE68 \u21BB</a>' : '<form method="post" action="/api/request"><button type="submit">\uC811\uC18D \uC2B9\uC778 \uC694\uCCAD\uD558\uAE30 \u2197</button></form>';
  return shell(title, `<section class="card"><div class="eyebrow">ACCESS REQUEST</div><h1>${title}</h1><p>${lead}</p><div class="notice">\uC694\uCCAD \uACC4\uC815: <strong>${html(user.email)}</strong><br>\uC2B9\uC778 \uC804\uC5D0\uB294 \uAD50\uC721 \uB0B4\uC6A9\uC5D0 \uC811\uADFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</div>${action}<p><a href="/logout">\uB2E4\uB978 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778</a></p></section>`, { refresh: state === "pending" });
}
function trainingPage(isOwner) {
  const adminLink = isOwner ? '<a class="nav-link" href="/admin"><span class="nav-icon">\u2699</span> \uC9C1\uC6D0 \uC811\uC18D \uC2B9\uC778 \uAD00\uB9AC</a>' : "";
  return embeddedAssets["index.html"].replace("</nav>", `${adminLink}<a class="nav-link" href="/logout"><span class="nav-icon">\u21AA</span> \uB85C\uADF8\uC544\uC6C3</a></nav>`);
}
async function allRecords(bucket) {
  const records = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: "requests/", limit: 1e3, ...cursor ? { cursor } : {} });
    for (const item of page.objects) {
      const record = await recordFor(bucket, decodeURIComponent(item.key.slice("requests/".length, -".json".length)));
      if (record?.id && record?.email) records.push(record);
    }
    cursor = page.truncated ? page.cursor : void 0;
  } while (cursor);
  return records.sort((a, b) => String(b.requestedAt).localeCompare(String(a.requestedAt)));
}
async function adminPage(bucket) {
  const records = await allRecords(bucket);
  const pending = records.filter((row) => row.status === "pending");
  const approved = records.filter((row) => row.status === "approved");
  const rejected = records.filter((row) => row.status === "rejected");
  const item = (row) => `<div class="row"><div><strong>${html(row.email)}</strong><small>\uC694\uCCAD: ${html(row.requestedAt ? new Date(row.requestedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }) : "")}</small></div><div class="actions">${row.status === "pending" || row.status === "rejected" ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="approved"><button type="submit">\uC2B9\uC778</button></form>` : ""}${row.status === "pending" ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="rejected"><button type="submit" class="secondary">\uAC70\uC808</button></form>` : ""}${row.status === "approved" ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="rejected"><button type="submit" class="danger">\uC811\uC18D \uCDE8\uC18C</button></form>` : ""}</div></div>`;
  return shell("\uC9C1\uC6D0 \uC811\uC18D \uC2B9\uC778 \uAD00\uB9AC", `<div class="grid"><section class="card"><div class="eyebrow">OWNER CONTROL</div><h1>\uC9C1\uC6D0 \uC811\uC18D \uC2B9\uC778 \uAD00\uB9AC</h1><p>\uC9C1\uC6D0\uC740 \uACF5\uC720 \uB9C1\uD06C\uC5D0\uC11C \uBCF8\uC778 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD558\uACE0 \uC2B9\uC778 \uC694\uCCAD\uC744 \uBCF4\uB0C5\uB2C8\uB2E4. \uC5EC\uAE30\uC5D0\uC11C \uC2B9\uC778\uD558\uBA74 \uAC19\uC740 \uACC4\uC815\uC73C\uB85C \uAD50\uC721 \uC0AC\uC774\uD2B8\uC5D0 \uC811\uC18D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><div class="actions"><a class="button secondary" href="/">\uAD50\uC721 \uC0AC\uC774\uD2B8 \uC5F4\uAE30 \u2197</a><a class="button secondary" href="/logout">\uB85C\uADF8\uC544\uC6C3</a></div><div class="notice">\uACF5\uC720 \uB9C1\uD06C: <a href="/">${html("https://yoohastree-franchise-training.earthyeagle4.chatgpt.site/")}</a><br>\uC2B9\uC778 \uACC4\uC815: ${OWNER_EMAIL}</div></section><section class="card"><h2>\uC2B9\uC778 \uB300\uAE30 <span class="count">${pending.length}</span></h2>${pending.length ? pending.map(item).join("") : '<p class="muted">\uD604\uC7AC \uB300\uAE30 \uC911\uC778 \uC694\uCCAD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>'}</section><section class="card"><h2>\uC2B9\uC778\uB41C \uC9C1\uC6D0 <span class="count">${approved.length}</span></h2>${approved.length ? approved.map(item).join("") : '<p class="muted">\uC544\uC9C1 \uC2B9\uC778\uB41C \uC9C1\uC6D0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</p>'}</section>${rejected.length ? `<section class="card"><h2>\uAC70\uC808\xB7\uCDE8\uC18C\uB41C \uC694\uCCAD <span class="count">${rejected.length}</span></h2>${rejected.map(item).join("")}</section>` : ""}</div>`);
}
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/logout") return signOutPage(env);
    const auth = await authenticate(request, env);
    if (auth.response) return auth.response;
    const user = auth.user;
    const bucket = env.BUCKET;
    if (!bucket) return response("Approval storage is unavailable", 503, "text/plain; charset=utf-8");
    if (request.method === "POST") {
      if (!validPost(request)) return response("Forbidden", 403, "text/plain; charset=utf-8");
      if (path === "/api/request") {
        if (!user) return response("Sign in required", 401, "text/plain; charset=utf-8");
        if (user.isOwner) return redirect("/admin");
        const existing = await recordForUser(bucket, user);
        if (existing?.status !== "approved" && existing?.status !== "pending") {
          await saveRecord(bucket, { id: user.id, email: user.email, status: "pending", requestedAt: (/* @__PURE__ */ new Date()).toISOString(), approvedAt: null });
        }
        return redirect("/");
      }
      if (path === "/api/admin/status") {
        if (!user?.isOwner) return response("Forbidden", 403, "text/plain; charset=utf-8");
        const form = await request.formData();
        const id = String(form.get("id") || "");
        const status = String(form.get("status") || "");
        if (!id || !["approved", "rejected"].includes(status)) return response("Invalid request", 400, "text/plain; charset=utf-8");
        const record2 = await recordFor(bucket, id);
        if (!record2) return response("Request not found", 404, "text/plain; charset=utf-8");
        await saveRecord(bucket, { ...record2, status, approvedAt: status === "approved" ? (/* @__PURE__ */ new Date()).toISOString() : null });
        return redirect("/admin");
      }
      return response("Not found", 404, "text/plain; charset=utf-8");
    }
    if (request.method !== "GET" && request.method !== "HEAD") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    if (path === "/admin") {
      if (!user) return response(signInPage("/admin", env));
      if (!user.isOwner) return response("Forbidden", 403, "text/plain; charset=utf-8");
      return response(await adminPage(bucket));
    }
    const record = user && !user.isOwner ? await recordForUser(bucket, user) : null;
    const approved = user?.isOwner || record?.status === "approved";
    if (path === "/" || path === "/index.html") {
      if (!user) return response(signInPage("/", env));
      if (!approved) return response(requestPage(user, record));
      return response(trainingPage(user.isOwner));
    }
    const assetName = path.slice(1);
    if (ASSET_NAMES.has(assetName)) {
      if (!approved) return response("Forbidden", 403, "text/plain; charset=utf-8");
      const type = assetName.endsWith(".css") ? "text/css; charset=utf-8" : assetName.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8";
      return response(embeddedAssets[assetName], 200, type);
    }
    return response("Not found", 404, "text/plain; charset=utf-8");
  }
};
export {
  worker_default as default
};
