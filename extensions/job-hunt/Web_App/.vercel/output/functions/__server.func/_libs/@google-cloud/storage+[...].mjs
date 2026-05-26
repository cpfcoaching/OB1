import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
import { _ as require_ecdsa_sig_formatter, a as init_abort_controller, c as require_src$8, d as init_lib, f as lib_exports, g as require_jws, i as abort_controller_exports, l as require_src$7, o as require_duplexify, p as require_src$9, s as require_retry_request, v as require_base64_js, y as require_json_bigint } from "./firestore.mjs";
import { t as require_src$10 } from "../google-cloud__projectify.mjs";
import { t as require_src$11 } from "../google-cloud__promisify.mjs";
import { t as require_src$12 } from "../arrify+google-cloud__paginator.mjs";
//#region node_modules/@google-cloud/storage/node_modules/gcp-metadata/build/src/gcp-residency.js
var require_gcp_residency = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2022 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GCE_LINUX_BIOS_PATHS = void 0;
	exports.isGoogleCloudServerless = isGoogleCloudServerless;
	exports.isGoogleComputeEngineLinux = isGoogleComputeEngineLinux;
	exports.isGoogleComputeEngineMACAddress = isGoogleComputeEngineMACAddress;
	exports.isGoogleComputeEngine = isGoogleComputeEngine;
	exports.detectGCPResidency = detectGCPResidency;
	var fs_1$2 = __require("fs");
	var os_1 = __require("os");
	/**
	* Known paths unique to Google Compute Engine Linux instances
	*/
	exports.GCE_LINUX_BIOS_PATHS = {
		BIOS_DATE: "/sys/class/dmi/id/bios_date",
		BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
	};
	var GCE_MAC_ADDRESS_REGEX = /^42:01/;
	/**
	* Determines if the process is running on a Google Cloud Serverless environment (Cloud Run or Cloud Functions instance).
	*
	* Uses the:
	* - {@link https://cloud.google.com/run/docs/container-contract#env-vars Cloud Run environment variables}.
	* - {@link https://cloud.google.com/functions/docs/env-var Cloud Functions environment variables}.
	*
	* @returns {boolean} `true` if the process is running on GCP serverless, `false` otherwise.
	*/
	function isGoogleCloudServerless() {
		return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE);
	}
	/**
	* Determines if the process is running on a Linux Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on Linux GCE, `false` otherwise.
	*/
	function isGoogleComputeEngineLinux() {
		if ((0, os_1.platform)() !== "linux") return false;
		try {
			(0, fs_1$2.statSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
			const biosVendor = (0, fs_1$2.readFileSync)(exports.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
			return /Google/.test(biosVendor);
		} catch (_a) {
			return false;
		}
	}
	/**
	* Determines if the process is running on a Google Compute Engine instance with a known
	* MAC address.
	*
	* @returns {boolean} `true` if the process is running on GCE (as determined by MAC address), `false` otherwise.
	*/
	function isGoogleComputeEngineMACAddress() {
		const interfaces = (0, os_1.networkInterfaces)();
		for (const item of Object.values(interfaces)) {
			if (!item) continue;
			for (const { mac } of item) if (GCE_MAC_ADDRESS_REGEX.test(mac)) return true;
		}
		return false;
	}
	/**
	* Determines if the process is running on a Google Compute Engine instance.
	*
	* @returns {boolean} `true` if the process is running on GCE, `false` otherwise.
	*/
	function isGoogleComputeEngine() {
		return isGoogleComputeEngineLinux() || isGoogleComputeEngineMACAddress();
	}
	/**
	* Determines if the process is running on Google Cloud Platform.
	*
	* @returns {boolean} `true` if the process is running on GCP, `false` otherwise.
	*/
	function detectGCPResidency() {
		return isGoogleCloudServerless() || isGoogleComputeEngine();
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-logging-utils/build/src/colours.js
var require_colours = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Colours = void 0;
	/**
	* Handles figuring out if we can use ANSI colours and handing out the escape codes.
	*
	* This is for package-internal use only, and may change at any time.
	*
	* @private
	* @internal
	*/
	var Colours = class Colours {
		/**
		* @param stream The stream (e.g. process.stderr)
		* @returns true if the stream should have colourization enabled
		*/
		static isEnabled(stream) {
			return stream.isTTY && (typeof stream.getColorDepth === "function" ? stream.getColorDepth() > 2 : true);
		}
		static refresh() {
			Colours.enabled = Colours.isEnabled(process.stderr);
			if (!this.enabled) {
				Colours.reset = "";
				Colours.bright = "";
				Colours.dim = "";
				Colours.red = "";
				Colours.green = "";
				Colours.yellow = "";
				Colours.blue = "";
				Colours.magenta = "";
				Colours.cyan = "";
				Colours.white = "";
				Colours.grey = "";
			} else {
				Colours.reset = "\x1B[0m";
				Colours.bright = "\x1B[1m";
				Colours.dim = "\x1B[2m";
				Colours.red = "\x1B[31m";
				Colours.green = "\x1B[32m";
				Colours.yellow = "\x1B[33m";
				Colours.blue = "\x1B[34m";
				Colours.magenta = "\x1B[35m";
				Colours.cyan = "\x1B[36m";
				Colours.white = "\x1B[37m";
				Colours.grey = "\x1B[90m";
			}
		}
	};
	exports.Colours = Colours;
	Colours.enabled = false;
	Colours.reset = "";
	Colours.bright = "";
	Colours.dim = "";
	Colours.red = "";
	Colours.green = "";
	Colours.yellow = "";
	Colours.blue = "";
	Colours.magenta = "";
	Colours.cyan = "";
	Colours.white = "";
	Colours.grey = "";
	Colours.refresh();
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-logging-utils/build/src/logging-utils.js
var require_logging_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.env = exports.DebugLogBackendBase = exports.placeholder = exports.AdhocDebugLogger = exports.LogSeverity = void 0;
	exports.getNodeBackend = getNodeBackend;
	exports.getDebugBackend = getDebugBackend;
	exports.getStructuredBackend = getStructuredBackend;
	exports.setBackend = setBackend;
	exports.log = log;
	var node_events_1 = __require("node:events");
	var process$1 = __importStar(__require("node:process"));
	var util = __importStar(__require("node:util"));
	var colours_1 = require_colours();
	/**
	* This module defines an ad-hoc debug logger for Google Cloud Platform
	* client libraries in Node. An ad-hoc debug logger is a tool which lets
	* users use an external, unified interface (in this case, environment
	* variables) to determine what logging they want to see at runtime. This
	* isn't necessarily fed into the console, but is meant to be under the
	* control of the user. The kind of logging that will be produced by this
	* is more like "call retry happened", not "event you'd want to record
	* in Cloud Logger".
	*
	* More for Googlers implementing libraries with it:
	* go/cloud-client-logging-design
	*/
	/**
	* Possible log levels. These are a subset of Cloud Observability levels.
	* https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
	*/
	var LogSeverity;
	(function(LogSeverity) {
		LogSeverity["DEFAULT"] = "DEFAULT";
		LogSeverity["DEBUG"] = "DEBUG";
		LogSeverity["INFO"] = "INFO";
		LogSeverity["WARNING"] = "WARNING";
		LogSeverity["ERROR"] = "ERROR";
	})(LogSeverity || (exports.LogSeverity = LogSeverity = {}));
	/**
	* Our logger instance. This actually contains the meat of dealing
	* with log lines, including EventEmitter. This contains the function
	* that will be passed back to users of the package.
	*/
	var AdhocDebugLogger = class extends node_events_1.EventEmitter {
		/**
		* @param upstream The backend will pass a function that will be
		*   called whenever our logger function is invoked.
		*/
		constructor(namespace, upstream) {
			super();
			this.namespace = namespace;
			this.upstream = upstream;
			this.func = Object.assign(this.invoke.bind(this), {
				instance: this,
				on: (event, listener) => this.on(event, listener)
			});
			this.func.debug = (...args) => this.invokeSeverity(LogSeverity.DEBUG, ...args);
			this.func.info = (...args) => this.invokeSeverity(LogSeverity.INFO, ...args);
			this.func.warn = (...args) => this.invokeSeverity(LogSeverity.WARNING, ...args);
			this.func.error = (...args) => this.invokeSeverity(LogSeverity.ERROR, ...args);
			this.func.sublog = (namespace) => log(namespace, this.func);
		}
		invoke(fields, ...args) {
			if (this.upstream) this.upstream(fields, ...args);
			this.emit("log", fields, args);
		}
		invokeSeverity(severity, ...args) {
			this.invoke({ severity }, ...args);
		}
	};
	exports.AdhocDebugLogger = AdhocDebugLogger;
	/**
	* This can be used in place of a real logger while waiting for Promises or disabling logging.
	*/
	exports.placeholder = new AdhocDebugLogger("", () => {}).func;
	/**
	* The base class for debug logging backends. It's possible to use this, but the
	* same non-guarantees above still apply (unstable interface, etc).
	*
	* @private
	* @internal
	*/
	var DebugLogBackendBase = class {
		constructor() {
			var _a;
			this.cached = /* @__PURE__ */ new Map();
			this.filters = [];
			this.filtersSet = false;
			let nodeFlag = (_a = process$1.env[exports.env.nodeEnables]) !== null && _a !== void 0 ? _a : "*";
			if (nodeFlag === "all") nodeFlag = "*";
			this.filters = nodeFlag.split(",");
		}
		log(namespace, fields, ...args) {
			try {
				if (!this.filtersSet) {
					this.setFilters();
					this.filtersSet = true;
				}
				let logger = this.cached.get(namespace);
				if (!logger) {
					logger = this.makeLogger(namespace);
					this.cached.set(namespace, logger);
				}
				logger(fields, ...args);
			} catch (e) {
				console.error(e);
			}
		}
	};
	exports.DebugLogBackendBase = DebugLogBackendBase;
	var NodeBackend = class extends DebugLogBackendBase {
		constructor() {
			super(...arguments);
			this.enabledRegexp = /.*/g;
		}
		isEnabled(namespace) {
			return this.enabledRegexp.test(namespace);
		}
		makeLogger(namespace) {
			if (!this.enabledRegexp.test(namespace)) return () => {};
			return (fields, ...args) => {
				var _a;
				const nscolour = `${colours_1.Colours.green}${namespace}${colours_1.Colours.reset}`;
				const pid = `${colours_1.Colours.yellow}${process$1.pid}${colours_1.Colours.reset}`;
				let level;
				switch (fields.severity) {
					case LogSeverity.ERROR:
						level = `${colours_1.Colours.red}${fields.severity}${colours_1.Colours.reset}`;
						break;
					case LogSeverity.INFO:
						level = `${colours_1.Colours.magenta}${fields.severity}${colours_1.Colours.reset}`;
						break;
					case LogSeverity.WARNING:
						level = `${colours_1.Colours.yellow}${fields.severity}${colours_1.Colours.reset}`;
						break;
					default:
						level = (_a = fields.severity) !== null && _a !== void 0 ? _a : LogSeverity.DEFAULT;
						break;
				}
				const msg = util.formatWithOptions({ colors: colours_1.Colours.enabled }, ...args);
				const filteredFields = Object.assign({}, fields);
				delete filteredFields.severity;
				const fieldsJson = Object.getOwnPropertyNames(filteredFields).length ? JSON.stringify(filteredFields) : "";
				const fieldsColour = fieldsJson ? `${colours_1.Colours.grey}${fieldsJson}${colours_1.Colours.reset}` : "";
				console.error("%s [%s|%s] %s%s", pid, nscolour, level, msg, fieldsJson ? ` ${fieldsColour}` : "");
			};
		}
		setFilters() {
			const regexp = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
			this.enabledRegexp = new RegExp(`^${regexp}$`, "i");
		}
	};
	/**
	* @returns A backend based on Node util.debuglog; this is the default.
	*/
	function getNodeBackend() {
		return new NodeBackend();
	}
	var DebugBackend = class extends DebugLogBackendBase {
		constructor(pkg) {
			super();
			this.debugPkg = pkg;
		}
		makeLogger(namespace) {
			const debugLogger = this.debugPkg(namespace);
			return (fields, ...args) => {
				debugLogger(args[0], ...args.slice(1));
			};
		}
		setFilters() {
			var _a;
			const existingFilters = (_a = process$1.env["NODE_DEBUG"]) !== null && _a !== void 0 ? _a : "";
			process$1.env["NODE_DEBUG"] = `${existingFilters}${existingFilters ? "," : ""}${this.filters.join(",")}`;
		}
	};
	/**
	* Creates a "debug" package backend. The user must call require('debug') and pass
	* the resulting object to this function.
	*
	* ```
	*  setBackend(getDebugBackend(require('debug')))
	* ```
	*
	* https://www.npmjs.com/package/debug
	*
	* Note: Google does not explicitly endorse or recommend this package; it's just
	* being provided as an option.
	*
	* @returns A backend based on the npm "debug" package.
	*/
	function getDebugBackend(debugPkg) {
		return new DebugBackend(debugPkg);
	}
	/**
	* This pretty much works like the Node logger, but it outputs structured
	* logging JSON matching Google Cloud's ingestion specs. Rather than handling
	* its own output, it wraps another backend. The passed backend must be a subclass
	* of `DebugLogBackendBase` (any of the backends exposed by this package will work).
	*/
	var StructuredBackend = class extends DebugLogBackendBase {
		constructor(upstream) {
			var _a;
			super();
			this.upstream = (_a = upstream) !== null && _a !== void 0 ? _a : new NodeBackend();
		}
		makeLogger(namespace) {
			const debugLogger = this.upstream.makeLogger(namespace);
			return (fields, ...args) => {
				var _a;
				const severity = (_a = fields.severity) !== null && _a !== void 0 ? _a : LogSeverity.INFO;
				const json = Object.assign({
					severity,
					message: util.format(...args)
				}, fields);
				debugLogger(fields, JSON.stringify(json));
			};
		}
		setFilters() {
			this.upstream.setFilters();
		}
	};
	/**
	* Creates a "structured logging" backend. This pretty much works like the
	* Node logger, but it outputs structured logging JSON matching Google
	* Cloud's ingestion specs instead of plain text.
	*
	* ```
	*  setBackend(getStructuredBackend())
	* ```
	*
	* @param upstream If you want to use something besides the Node backend to
	*   write the actual log lines into, pass that here.
	* @returns A backend based on Google Cloud structured logging.
	*/
	function getStructuredBackend(upstream) {
		return new StructuredBackend(upstream);
	}
	/**
	* The environment variables that we standardized on, for all ad-hoc logging.
	*/
	exports.env = { 
	/**
	* Filter wildcards specific to the Node syntax, and similar to the built-in
	* utils.debuglog() environment variable. If missing, disables logging.
	*/
nodeEnables: "GOOGLE_SDK_NODE_LOGGING" };
	var loggerCache = /* @__PURE__ */ new Map();
	var cachedBackend = void 0;
	/**
	* Set the backend to use for our log output.
	* - A backend object
	* - null to disable logging
	* - undefined for "nothing yet", defaults to the Node backend
	*
	* @param backend Results from one of the get*Backend() functions.
	*/
	function setBackend(backend) {
		cachedBackend = backend;
		loggerCache.clear();
	}
	/**
	* Creates a logging function. Multiple calls to this with the same namespace
	* will produce the same logger, with the same event emitter hooks.
	*
	* Namespaces can be a simple string ("system" name), or a qualified string
	* (system:subsystem), which can be used for filtering, or for "system:*".
	*
	* @param namespace The namespace, a descriptive text string.
	* @returns A function you can call that works similar to console.log().
	*/
	function log(namespace, parent) {
		if (!process$1.env[exports.env.nodeEnables]) return exports.placeholder;
		if (!namespace) return exports.placeholder;
		if (parent) namespace = `${parent.instance.namespace}:${namespace}`;
		const existing = loggerCache.get(namespace);
		if (existing) return existing.func;
		if (cachedBackend === null) return exports.placeholder;
		else if (cachedBackend === void 0) cachedBackend = getNodeBackend();
		const logger = (() => {
			let previousBackend = void 0;
			return new AdhocDebugLogger(namespace, (fields, ...args) => {
				if (previousBackend !== cachedBackend) {
					if (cachedBackend === null) return;
					else if (cachedBackend === void 0) cachedBackend = getNodeBackend();
					previousBackend = cachedBackend;
				}
				cachedBackend === null || cachedBackend === void 0 || cachedBackend.log(namespace, fields, ...args);
			});
		})();
		loggerCache.set(namespace, logger);
		return logger.func;
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-logging-utils/build/src/index.js
var require_src$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$4) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$4, p)) __createBinding(exports$4, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_logging_utils(), exports);
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/gcp-metadata/build/src/index.js
var require_src$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2018 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.gcpResidencyCache = exports.METADATA_SERVER_DETECTION = exports.HEADERS = exports.HEADER_VALUE = exports.HEADER_NAME = exports.SECONDARY_HOST_ADDRESS = exports.HOST_ADDRESS = exports.BASE_PATH = void 0;
	exports.instance = instance;
	exports.project = project;
	exports.universe = universe;
	exports.bulk = bulk;
	exports.isAvailable = isAvailable;
	exports.resetIsAvailableCache = resetIsAvailableCache;
	exports.getGCPResidency = getGCPResidency;
	exports.setGCPResidency = setGCPResidency;
	exports.requestTimeout = requestTimeout;
	var gaxios_1 = require_src$7();
	var jsonBigint = require_json_bigint();
	var gcp_residency_1 = require_gcp_residency();
	var logger = require_src$6();
	exports.BASE_PATH = "/computeMetadata/v1";
	exports.HOST_ADDRESS = "http://169.254.169.254";
	exports.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
	exports.HEADER_NAME = "Metadata-Flavor";
	exports.HEADER_VALUE = "Google";
	exports.HEADERS = Object.freeze({ [exports.HEADER_NAME]: exports.HEADER_VALUE });
	var log = logger.log("gcp metadata");
	/**
	* Metadata server detection override options.
	*
	* Available via `process.env.METADATA_SERVER_DETECTION`.
	*/
	exports.METADATA_SERVER_DETECTION = Object.freeze({
		"assume-present": "don't try to ping the metadata server, but assume it's present",
		none: "don't try to ping the metadata server, but don't try to use it either",
		"bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
		"ping-only": "skip the BIOS probe, and go straight to pinging"
	});
	/**
	* Returns the base URL while taking into account the GCE_METADATA_HOST
	* environment variable if it exists.
	*
	* @returns The base URL, e.g., http://169.254.169.254/computeMetadata/v1.
	*/
	function getBaseUrl(baseUrl) {
		if (!baseUrl) baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports.HOST_ADDRESS;
		if (!/^https?:\/\//.test(baseUrl)) baseUrl = `http://${baseUrl}`;
		return new URL(exports.BASE_PATH, baseUrl).href;
	}
	function validate(options) {
		Object.keys(options).forEach((key) => {
			switch (key) {
				case "params":
				case "property":
				case "headers": break;
				case "qs": throw new Error("'qs' is not a valid configuration option. Please use 'params' instead.");
				default: throw new Error(`'${key}' is not a valid configuration option.`);
			}
		});
	}
	async function metadataAccessor(type, options = {}, noResponseRetries = 3, fastFail = false) {
		let metadataKey = "";
		let params = {};
		let headers = {};
		if (typeof type === "object") {
			const metadataAccessor = type;
			metadataKey = metadataAccessor.metadataKey;
			params = metadataAccessor.params || params;
			headers = metadataAccessor.headers || headers;
			noResponseRetries = metadataAccessor.noResponseRetries || noResponseRetries;
			fastFail = metadataAccessor.fastFail || fastFail;
		} else metadataKey = type;
		if (typeof options === "string") metadataKey += `/${options}`;
		else {
			validate(options);
			if (options.property) metadataKey += `/${options.property}`;
			headers = options.headers || headers;
			params = options.params || params;
		}
		const requestMethod = fastFail ? fastFailMetadataRequest : gaxios_1.request;
		const req = {
			url: `${getBaseUrl()}/${metadataKey}`,
			headers: {
				...exports.HEADERS,
				...headers
			},
			retryConfig: { noResponseRetries },
			params,
			responseType: "text",
			timeout: requestTimeout()
		};
		log.info("instance request %j", req);
		const res = await requestMethod(req);
		log.info("instance metadata is %s", res.data);
		if (res.headers[exports.HEADER_NAME.toLowerCase()] !== exports.HEADER_VALUE) throw new Error(`Invalid response from metadata service: incorrect ${exports.HEADER_NAME} header. Expected '${exports.HEADER_VALUE}', got ${res.headers[exports.HEADER_NAME.toLowerCase()] ? `'${res.headers[exports.HEADER_NAME.toLowerCase()]}'` : "no header"}`);
		if (typeof res.data === "string") try {
			return jsonBigint.parse(res.data);
		} catch (_a) {}
		return res.data;
	}
	async function fastFailMetadataRequest(options) {
		var _a;
		const secondaryOptions = {
			...options,
			url: (_a = options.url) === null || _a === void 0 ? void 0 : _a.toString().replace(getBaseUrl(), getBaseUrl(exports.SECONDARY_HOST_ADDRESS))
		};
		let responded = false;
		const r1 = (0, gaxios_1.request)(options).then((res) => {
			responded = true;
			return res;
		}).catch((err) => {
			if (responded) return r2;
			else {
				responded = true;
				throw err;
			}
		});
		const r2 = (0, gaxios_1.request)(secondaryOptions).then((res) => {
			responded = true;
			return res;
		}).catch((err) => {
			if (responded) return r1;
			else {
				responded = true;
				throw err;
			}
		});
		return Promise.race([r1, r2]);
	}
	/**
	* Obtain metadata for the current GCE instance.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const serviceAccount: {} = await instance('service-accounts/');
	* const serviceAccountEmail: string = await instance('service-accounts/default/email');
	* ```
	*/
	function instance(options) {
		return metadataAccessor("instance", options);
	}
	/**
	* Obtain metadata for the current GCP project.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const projectId: string = await project('project-id');
	* const numericProjectId: number = await project('numeric-project-id');
	* ```
	*/
	function project(options) {
		return metadataAccessor("project", options);
	}
	/**
	* Obtain metadata for the current universe.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const universeDomain: string = await universe('universe-domain');
	* ```
	*/
	function universe(options) {
		return metadataAccessor("universe", options);
	}
	/**
	* Retrieve metadata items in parallel.
	*
	* @see {@link https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys}
	*
	* @example
	* ```
	* const data = await bulk([
	*   {
	*     metadataKey: 'instance',
	*   },
	*   {
	*     metadataKey: 'project/project-id',
	*   },
	* ] as const);
	*
	* // data.instance;
	* // data['project/project-id'];
	* ```
	*
	* @param properties The metadata properties to retrieve
	* @returns The metadata in `metadatakey:value` format
	*/
	async function bulk(properties) {
		const r = {};
		await Promise.all(properties.map((item) => {
			return (async () => {
				const res = await metadataAccessor(item);
				const key = item.metadataKey;
				r[key] = res;
			})();
		}));
		return r;
	}
	function detectGCPAvailableRetries() {
		return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
	}
	var cachedIsAvailableResponse;
	/**
	* Determine if the metadata server is currently available.
	*/
	async function isAvailable() {
		if (process.env.METADATA_SERVER_DETECTION) {
			const value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
			if (!(value in exports.METADATA_SERVER_DETECTION)) throw new RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
			switch (value) {
				case "assume-present": return true;
				case "none": return false;
				case "bios-only": return getGCPResidency();
				case "ping-only":
			}
		}
		try {
			if (cachedIsAvailableResponse === void 0) cachedIsAvailableResponse = metadataAccessor("instance", void 0, detectGCPAvailableRetries(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
			await cachedIsAvailableResponse;
			return true;
		} catch (e) {
			const err = e;
			if (process.env.DEBUG_AUTH) console.info(err);
			if (err.type === "request-timeout") return false;
			if (err.response && err.response.status === 404) return false;
			else {
				if (!(err.response && err.response.status === 404) && (!err.code || ![
					"EHOSTDOWN",
					"EHOSTUNREACH",
					"ENETUNREACH",
					"ENOENT",
					"ENOTFOUND",
					"ECONNREFUSED"
				].includes(err.code))) {
					let code = "UNKNOWN";
					if (err.code) code = err.code;
					process.emitWarning(`received unexpected error = ${err.message} code = ${code}`, "MetadataLookupWarning");
				}
				return false;
			}
		}
	}
	/**
	* reset the memoized isAvailable() lookup.
	*/
	function resetIsAvailableCache() {
		cachedIsAvailableResponse = void 0;
	}
	/**
	* A cache for the detected GCP Residency.
	*/
	exports.gcpResidencyCache = null;
	/**
	* Detects GCP Residency.
	* Caches results to reduce costs for subsequent calls.
	*
	* @see setGCPResidency for setting
	*/
	function getGCPResidency() {
		if (exports.gcpResidencyCache === null) setGCPResidency();
		return exports.gcpResidencyCache;
	}
	/**
	* Sets the detected GCP Residency.
	* Useful for forcing metadata server detection behavior.
	*
	* Set `null` to autodetect the environment (default behavior).
	* @see getGCPResidency for getting
	*/
	function setGCPResidency(value = null) {
		exports.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
	}
	/**
	* Obtain the timeout for requests to the metadata server.
	*
	* In certain environments and conditions requests can take longer than
	* the default timeout to complete. This function will determine the
	* appropriate timeout based on the environment.
	*
	* @returns {number} a request timeout duration in milliseconds.
	*/
	function requestTimeout() {
		return getGCPResidency() ? 0 : 3e3;
	}
	__exportStar(require_gcp_residency(), exports);
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/crypto/browser/crypto.js
var require_crypto$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BrowserCrypto = void 0;
	var base64js = require_base64_js();
	var crypto_1 = require_crypto();
	exports.BrowserCrypto = class BrowserCrypto {
		constructor() {
			if (typeof window === "undefined" || window.crypto === void 0 || window.crypto.subtle === void 0) throw new Error("SubtleCrypto not found. Make sure it's an https:// website.");
		}
		async sha256DigestBase64(str) {
			const inputBuffer = new TextEncoder().encode(str);
			const outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
			return base64js.fromByteArray(new Uint8Array(outputBuffer));
		}
		randomBytesBase64(count) {
			const array = new Uint8Array(count);
			window.crypto.getRandomValues(array);
			return base64js.fromByteArray(array);
		}
		static padBase64(base64) {
			while (base64.length % 4 !== 0) base64 += "=";
			return base64;
		}
		async verify(pubkey, data, signature) {
			const algo = {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-256" }
			};
			const dataArray = new TextEncoder().encode(data);
			const signatureArray = base64js.toByteArray(BrowserCrypto.padBase64(signature));
			const cryptoKey = await window.crypto.subtle.importKey("jwk", pubkey, algo, true, ["verify"]);
			return await window.crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray);
		}
		async sign(privateKey, data) {
			const algo = {
				name: "RSASSA-PKCS1-v1_5",
				hash: { name: "SHA-256" }
			};
			const dataArray = new TextEncoder().encode(data);
			const cryptoKey = await window.crypto.subtle.importKey("jwk", privateKey, algo, true, ["sign"]);
			const result = await window.crypto.subtle.sign(algo, cryptoKey, dataArray);
			return base64js.fromByteArray(new Uint8Array(result));
		}
		decodeBase64StringUtf8(base64) {
			const uint8array = base64js.toByteArray(BrowserCrypto.padBase64(base64));
			return new TextDecoder().decode(uint8array);
		}
		encodeBase64StringUtf8(text) {
			const uint8array = new TextEncoder().encode(text);
			return base64js.fromByteArray(uint8array);
		}
		/**
		* Computes the SHA-256 hash of the provided string.
		* @param str The plain text string to hash.
		* @return A promise that resolves with the SHA-256 hash of the provided
		*   string in hexadecimal encoding.
		*/
		async sha256DigestHex(str) {
			const inputBuffer = new TextEncoder().encode(str);
			const outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
			return (0, crypto_1.fromArrayBufferToHex)(outputBuffer);
		}
		/**
		* Computes the HMAC hash of a message using the provided crypto key and the
		* SHA-256 algorithm.
		* @param key The secret crypto key in utf-8 or ArrayBuffer format.
		* @param msg The plain text message.
		* @return A promise that resolves with the HMAC-SHA256 hash in ArrayBuffer
		*   format.
		*/
		async signWithHmacSha256(key, msg) {
			const rawKey = typeof key === "string" ? key : String.fromCharCode(...new Uint16Array(key));
			const enc = new TextEncoder();
			const cryptoKey = await window.crypto.subtle.importKey("raw", enc.encode(rawKey), {
				name: "HMAC",
				hash: { name: "SHA-256" }
			}, false, ["sign"]);
			return window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/crypto/node/crypto.js
var require_crypto$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NodeCrypto = void 0;
	var crypto$2 = __require("crypto");
	var NodeCrypto = class {
		async sha256DigestBase64(str) {
			return crypto$2.createHash("sha256").update(str).digest("base64");
		}
		randomBytesBase64(count) {
			return crypto$2.randomBytes(count).toString("base64");
		}
		async verify(pubkey, data, signature) {
			const verifier = crypto$2.createVerify("RSA-SHA256");
			verifier.update(data);
			verifier.end();
			return verifier.verify(pubkey, signature, "base64");
		}
		async sign(privateKey, data) {
			const signer = crypto$2.createSign("RSA-SHA256");
			signer.update(data);
			signer.end();
			return signer.sign(privateKey, "base64");
		}
		decodeBase64StringUtf8(base64) {
			return Buffer.from(base64, "base64").toString("utf-8");
		}
		encodeBase64StringUtf8(text) {
			return Buffer.from(text, "utf-8").toString("base64");
		}
		/**
		* Computes the SHA-256 hash of the provided string.
		* @param str The plain text string to hash.
		* @return A promise that resolves with the SHA-256 hash of the provided
		*   string in hexadecimal encoding.
		*/
		async sha256DigestHex(str) {
			return crypto$2.createHash("sha256").update(str).digest("hex");
		}
		/**
		* Computes the HMAC hash of a message using the provided crypto key and the
		* SHA-256 algorithm.
		* @param key The secret crypto key in utf-8 or ArrayBuffer format.
		* @param msg The plain text message.
		* @return A promise that resolves with the HMAC-SHA256 hash in ArrayBuffer
		*   format.
		*/
		async signWithHmacSha256(key, msg) {
			const cryptoKey = typeof key === "string" ? key : toBuffer(key);
			return toArrayBuffer(crypto$2.createHmac("sha256", cryptoKey).update(msg).digest());
		}
	};
	exports.NodeCrypto = NodeCrypto;
	/**
	* Converts a Node.js Buffer to an ArrayBuffer.
	* https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
	* @param buffer The Buffer input to covert.
	* @return The ArrayBuffer representation of the input.
	*/
	function toArrayBuffer(buffer) {
		return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}
	/**
	* Converts an ArrayBuffer to a Node.js Buffer.
	* @param arrayBuffer The ArrayBuffer input to covert.
	* @return The Buffer representation of the input.
	*/
	function toBuffer(arrayBuffer) {
		return Buffer.from(arrayBuffer);
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/crypto/crypto.js
var require_crypto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createCrypto = createCrypto;
	exports.hasBrowserCrypto = hasBrowserCrypto;
	exports.fromArrayBufferToHex = fromArrayBufferToHex;
	var crypto_1 = require_crypto$2();
	var crypto_2 = require_crypto$1();
	function createCrypto() {
		if (hasBrowserCrypto()) return new crypto_1.BrowserCrypto();
		return new crypto_2.NodeCrypto();
	}
	function hasBrowserCrypto() {
		return typeof window !== "undefined" && typeof window.crypto !== "undefined" && typeof window.crypto.subtle !== "undefined";
	}
	/**
	* Converts an ArrayBuffer to a hexadecimal string.
	* @param arrayBuffer The ArrayBuffer to convert to hexadecimal string.
	* @return The hexadecimal encoding of the ArrayBuffer.
	*/
	function fromArrayBufferToHex(arrayBuffer) {
		return Array.from(new Uint8Array(arrayBuffer)).map((byte) => {
			return byte.toString(16).padStart(2, "0");
		}).join("");
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/options.js
var require_options = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validate = validate;
	function validate(options) {
		for (const pair of [
			{
				invalid: "uri",
				expected: "url"
			},
			{
				invalid: "json",
				expected: "data"
			},
			{
				invalid: "qs",
				expected: "params"
			}
		]) if (options[pair.invalid]) {
			const e = `'${pair.invalid}' is not a valid configuration option. Please use '${pair.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
			throw new Error(e);
		}
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/package.json
var package_exports$1 = /* @__PURE__ */ __exportAll({
	author: () => author$1,
	default: () => package_default$1,
	dependencies: () => dependencies$1,
	description: () => description$1,
	devDependencies: () => devDependencies$1,
	engines: () => engines$1,
	files: () => files$1,
	keywords: () => keywords$1,
	license: () => license$1,
	main: () => main$1,
	name: () => name$1,
	repository: () => repository$1,
	scripts: () => scripts$1,
	types: () => types$1,
	version: () => version$1
});
var name$1, version$1, author$1, description$1, engines$1, main$1, types$1, repository$1, keywords$1, dependencies$1, devDependencies$1, files$1, scripts$1, license$1, package_default$1;
var init_package$1 = __esmMin((() => {
	name$1 = "google-auth-library";
	version$1 = "9.15.1";
	author$1 = "Google Inc.";
	description$1 = "Google APIs Authentication Client Library for Node.js";
	engines$1 = { "node": ">=14" };
	main$1 = "./build/src/index.js";
	types$1 = "./build/src/index.d.ts";
	repository$1 = "googleapis/google-auth-library-nodejs.git";
	keywords$1 = [
		"google",
		"api",
		"google apis",
		"client",
		"client library"
	];
	dependencies$1 = {
		"base64-js": "^1.3.0",
		"ecdsa-sig-formatter": "^1.0.11",
		"gaxios": "^6.1.1",
		"gcp-metadata": "^6.1.0",
		"gtoken": "^7.0.0",
		"jws": "^4.0.0"
	};
	devDependencies$1 = {
		"@types/base64-js": "^1.2.5",
		"@types/chai": "^4.1.7",
		"@types/jws": "^3.1.0",
		"@types/mocha": "^9.0.0",
		"@types/mv": "^2.1.0",
		"@types/ncp": "^2.0.1",
		"@types/node": "^20.4.2",
		"@types/sinon": "^17.0.0",
		"assert-rejects": "^1.0.0",
		"c8": "^8.0.0",
		"chai": "^4.2.0",
		"cheerio": "1.0.0-rc.12",
		"codecov": "^3.0.2",
		"engine.io": "6.6.2",
		"gts": "^5.0.0",
		"is-docker": "^2.0.0",
		"jsdoc": "^4.0.0",
		"jsdoc-fresh": "^3.0.0",
		"jsdoc-region-tag": "^3.0.0",
		"karma": "^6.0.0",
		"karma-chrome-launcher": "^3.0.0",
		"karma-coverage": "^2.0.0",
		"karma-firefox-launcher": "^2.0.0",
		"karma-mocha": "^2.0.0",
		"karma-sourcemap-loader": "^0.4.0",
		"karma-webpack": "5.0.0",
		"keypair": "^1.0.4",
		"linkinator": "^4.0.0",
		"mocha": "^9.2.2",
		"mv": "^2.1.1",
		"ncp": "^2.0.0",
		"nock": "^13.0.0",
		"null-loader": "^4.0.0",
		"pdfmake": "0.2.12",
		"puppeteer": "^21.0.0",
		"sinon": "^18.0.0",
		"ts-loader": "^8.0.0",
		"typescript": "^5.1.6",
		"webpack": "^5.21.2",
		"webpack-cli": "^4.0.0"
	};
	files$1 = ["build/src", "!build/src/**/*.map"];
	scripts$1 = {
		"test": "c8 mocha build/test",
		"clean": "gts clean",
		"prepare": "npm run compile",
		"lint": "gts check",
		"compile": "tsc -p .",
		"fix": "gts fix",
		"pretest": "npm run compile -- --sourceMap",
		"docs": "jsdoc -c .jsdoc.json",
		"samples-setup": "cd samples/ && npm link ../ && npm run setup && cd ../",
		"samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
		"system-test": "mocha build/system-test --timeout 60000",
		"presystem-test": "npm run compile -- --sourceMap",
		"webpack": "webpack",
		"browser-test": "karma start",
		"docs-test": "linkinator docs",
		"predocs-test": "npm run docs",
		"prelint": "cd samples; npm link ../; npm install",
		"precompile": "gts clean"
	};
	license$1 = "Apache-2.0";
	package_default$1 = {
		name: name$1,
		version: version$1,
		author: author$1,
		description: description$1,
		engines: engines$1,
		main: main$1,
		types: types$1,
		repository: repository$1,
		keywords: keywords$1,
		dependencies: dependencies$1,
		devDependencies: devDependencies$1,
		files: files$1,
		scripts: scripts$1,
		license: license$1
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/transporters.js
var require_transporters = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DefaultTransporter = void 0;
	var gaxios_1 = require_src$7();
	var options_1 = require_options();
	var pkg = (init_package$1(), __toCommonJS(package_exports$1).default);
	var PRODUCT_NAME = "google-api-nodejs-client";
	var DefaultTransporter = class DefaultTransporter {
		constructor() {
			/**
			* A configurable, replacable `Gaxios` instance.
			*/
			this.instance = new gaxios_1.Gaxios();
		}
		/**
		* Configures request options before making a request.
		* @param opts GaxiosOptions options.
		* @return Configured options.
		*/
		configure(opts = {}) {
			opts.headers = opts.headers || {};
			if (typeof window === "undefined") {
				const uaValue = opts.headers["User-Agent"];
				if (!uaValue) opts.headers["User-Agent"] = DefaultTransporter.USER_AGENT;
				else if (!uaValue.includes(`${PRODUCT_NAME}/`)) opts.headers["User-Agent"] = `${uaValue} ${DefaultTransporter.USER_AGENT}`;
				if (!opts.headers["x-goog-api-client"]) {
					const nodeVersion = process.version.replace(/^v/, "");
					opts.headers["x-goog-api-client"] = `gl-node/${nodeVersion}`;
				}
			}
			return opts;
		}
		/**
		* Makes a request using Gaxios with given options.
		* @param opts GaxiosOptions options.
		* @param callback optional callback that contains GaxiosResponse object.
		* @return GaxiosPromise, assuming no callback is passed.
		*/
		request(opts) {
			opts = this.configure(opts);
			(0, options_1.validate)(opts);
			return this.instance.request(opts).catch((e) => {
				throw this.processError(e);
			});
		}
		get defaults() {
			return this.instance.defaults;
		}
		set defaults(opts) {
			this.instance.defaults = opts;
		}
		/**
		* Changes the error to include details from the body.
		*/
		processError(e) {
			const res = e.response;
			const err = e;
			const body = res ? res.data : null;
			if (res && body && body.error && res.status !== 200) if (typeof body.error === "string") {
				err.message = body.error;
				err.status = res.status;
			} else if (Array.isArray(body.error.errors)) {
				err.message = body.error.errors.map((err2) => err2.message).join("\n");
				err.code = body.error.code;
				err.errors = body.error.errors;
			} else {
				err.message = body.error.message;
				err.code = body.error.code;
			}
			else if (res && res.status >= 400) {
				err.message = body;
				err.status = res.status;
			}
			return err;
		}
	};
	exports.DefaultTransporter = DefaultTransporter;
	/**
	* Default user agent.
	*/
	DefaultTransporter.USER_AGENT = `${PRODUCT_NAME}/${pkg.version}`;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/util.js
var require_util$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _LRUCache_instances, _LRUCache_cache, _LRUCache_moveToEnd, _LRUCache_evict;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LRUCache = void 0;
	exports.snakeToCamel = snakeToCamel;
	exports.originalOrCamelOptions = originalOrCamelOptions;
	/**
	* Returns the camel case of a provided string.
	*
	* @remarks
	*
	* Match any `_` and not `_` pair, then return the uppercase of the not `_`
	* character.
	*
	* @internal
	*
	* @param str the string to convert
	* @returns the camelCase'd string
	*/
	function snakeToCamel(str) {
		return str.replace(/([_][^_])/g, (match) => match.slice(1).toUpperCase());
	}
	/**
	* Get the value of `obj[key]` or `obj[camelCaseKey]`, with a preference
	* for original, non-camelCase key.
	*
	* @param obj object to lookup a value in
	* @returns a `get` function for getting `obj[key || snakeKey]`, if available
	*/
	function originalOrCamelOptions(obj) {
		/**
		*
		* @param key an index of object, preferably snake_case
		* @returns the value `obj[key || snakeKey]`, if available
		*/
		function get(key) {
			var _a;
			const o = obj || {};
			return (_a = o[key]) !== null && _a !== void 0 ? _a : o[snakeToCamel(key)];
		}
		return { get };
	}
	/**
	* A simple LRU cache utility.
	* Not meant for external usage.
	*
	* @experimental
	* @internal
	*/
	var LRUCache = class {
		constructor(options) {
			_LRUCache_instances.add(this);
			/**
			* Maps are in order. Thus, the older item is the first item.
			*
			* {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
			*/
			_LRUCache_cache.set(this, /* @__PURE__ */ new Map());
			this.capacity = options.capacity;
			this.maxAge = options.maxAge;
		}
		/**
		* Add an item to the cache.
		*
		* @param key the key to upsert
		* @param value the value of the key
		*/
		set(key, value) {
			__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_moveToEnd).call(this, key, value);
			__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_evict).call(this);
		}
		/**
		* Get an item from the cache.
		*
		* @param key the key to retrieve
		*/
		get(key) {
			const item = __classPrivateFieldGet(this, _LRUCache_cache, "f").get(key);
			if (!item) return;
			__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_moveToEnd).call(this, key, item.value);
			__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_evict).call(this);
			return item.value;
		}
	};
	exports.LRUCache = LRUCache;
	_LRUCache_cache = /* @__PURE__ */ new WeakMap(), _LRUCache_instances = /* @__PURE__ */ new WeakSet(), _LRUCache_moveToEnd = function _LRUCache_moveToEnd(key, value) {
		__classPrivateFieldGet(this, _LRUCache_cache, "f").delete(key);
		__classPrivateFieldGet(this, _LRUCache_cache, "f").set(key, {
			value,
			lastAccessed: Date.now()
		});
	}, _LRUCache_evict = function _LRUCache_evict() {
		const cutoffDate = this.maxAge ? Date.now() - this.maxAge : 0;
		/**
		* Because we know Maps are in order, this item is both the
		* last item in the list (capacity) and oldest (maxAge).
		*/
		let oldestItem = __classPrivateFieldGet(this, _LRUCache_cache, "f").entries().next();
		while (!oldestItem.done && (__classPrivateFieldGet(this, _LRUCache_cache, "f").size > this.capacity || oldestItem.value[1].lastAccessed < cutoffDate)) {
			__classPrivateFieldGet(this, _LRUCache_cache, "f").delete(oldestItem.value[0]);
			oldestItem = __classPrivateFieldGet(this, _LRUCache_cache, "f").entries().next();
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/authclient.js
var require_authclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AuthClient = exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = exports.DEFAULT_UNIVERSE = void 0;
	var events_1$3 = __require("events");
	var gaxios_1 = require_src$7();
	var transporters_1 = require_transporters();
	var util_1 = require_util$2();
	/**
	* The default cloud universe
	*
	* @see {@link AuthJSONOptions.universe_domain}
	*/
	exports.DEFAULT_UNIVERSE = "googleapis.com";
	/**
	* The default {@link AuthClientOptions.eagerRefreshThresholdMillis}
	*/
	exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300 * 1e3;
	var AuthClient = class extends events_1$3.EventEmitter {
		constructor(opts = {}) {
			var _a, _b, _c, _d, _e;
			super();
			this.credentials = {};
			this.eagerRefreshThresholdMillis = exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS;
			this.forceRefreshOnFailure = false;
			this.universeDomain = exports.DEFAULT_UNIVERSE;
			const options = (0, util_1.originalOrCamelOptions)(opts);
			this.apiKey = opts.apiKey;
			this.projectId = (_a = options.get("project_id")) !== null && _a !== void 0 ? _a : null;
			this.quotaProjectId = options.get("quota_project_id");
			this.credentials = (_b = options.get("credentials")) !== null && _b !== void 0 ? _b : {};
			this.universeDomain = (_c = options.get("universe_domain")) !== null && _c !== void 0 ? _c : exports.DEFAULT_UNIVERSE;
			this.transporter = (_d = opts.transporter) !== null && _d !== void 0 ? _d : new transporters_1.DefaultTransporter();
			if (opts.transporterOptions) this.transporter.defaults = opts.transporterOptions;
			if (opts.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = opts.eagerRefreshThresholdMillis;
			this.forceRefreshOnFailure = (_e = opts.forceRefreshOnFailure) !== null && _e !== void 0 ? _e : false;
		}
		/**
		* Return the {@link Gaxios `Gaxios`} instance from the {@link AuthClient.transporter}.
		*
		* @expiremental
		*/
		get gaxios() {
			if (this.transporter instanceof gaxios_1.Gaxios) return this.transporter;
			else if (this.transporter instanceof transporters_1.DefaultTransporter) return this.transporter.instance;
			else if ("instance" in this.transporter && this.transporter.instance instanceof gaxios_1.Gaxios) return this.transporter.instance;
			return null;
		}
		/**
		* Sets the auth credentials.
		*/
		setCredentials(credentials) {
			this.credentials = credentials;
		}
		/**
		* Append additional headers, e.g., x-goog-user-project, shared across the
		* classes inheriting AuthClient. This method should be used by any method
		* that overrides getRequestMetadataAsync(), which is a shared helper for
		* setting request information in both gRPC and HTTP API calls.
		*
		* @param headers object to append additional headers to.
		*/
		addSharedMetadataHeaders(headers) {
			if (!headers["x-goog-user-project"] && this.quotaProjectId) headers["x-goog-user-project"] = this.quotaProjectId;
			return headers;
		}
		/**
		* Retry config for Auth-related requests.
		*
		* @remarks
		*
		* This is not a part of the default {@link AuthClient.transporter transporter/gaxios}
		* config as some downstream APIs would prefer if customers explicitly enable retries,
		* such as GCS.
		*/
		static get RETRY_CONFIG() {
			return {
				retry: true,
				retryConfig: { httpMethodsToRetry: [
					"GET",
					"PUT",
					"POST",
					"HEAD",
					"OPTIONS",
					"DELETE"
				] }
			};
		}
	};
	exports.AuthClient = AuthClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/loginticket.js
var require_loginticket = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LoginTicket = void 0;
	var LoginTicket = class {
		/**
		* Create a simple class to extract user ID from an ID Token
		*
		* @param {string} env Envelope of the jwt
		* @param {TokenPayload} pay Payload of the jwt
		* @constructor
		*/
		constructor(env, pay) {
			this.envelope = env;
			this.payload = pay;
		}
		getEnvelope() {
			return this.envelope;
		}
		getPayload() {
			return this.payload;
		}
		/**
		* Create a simple class to extract user ID from an ID Token
		*
		* @return The user ID
		*/
		getUserId() {
			const payload = this.getPayload();
			if (payload && payload.sub) return payload.sub;
			return null;
		}
		/**
		* Returns attributes from the login ticket.  This can contain
		* various information about the user session.
		*
		* @return The envelope and payload
		*/
		getAttributes() {
			return {
				envelope: this.getEnvelope(),
				payload: this.getPayload()
			};
		}
	};
	exports.LoginTicket = LoginTicket;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/oauth2client.js
var require_oauth2client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OAuth2Client = exports.ClientAuthentication = exports.CertificateFormat = exports.CodeChallengeMethod = void 0;
	var gaxios_1 = require_src$7();
	var querystring$3 = __require("querystring");
	var stream$3 = __require("stream");
	var formatEcdsa = require_ecdsa_sig_formatter();
	var crypto_1 = require_crypto();
	var authclient_1 = require_authclient();
	var loginticket_1 = require_loginticket();
	var CodeChallengeMethod;
	(function(CodeChallengeMethod) {
		CodeChallengeMethod["Plain"] = "plain";
		CodeChallengeMethod["S256"] = "S256";
	})(CodeChallengeMethod || (exports.CodeChallengeMethod = CodeChallengeMethod = {}));
	var CertificateFormat;
	(function(CertificateFormat) {
		CertificateFormat["PEM"] = "PEM";
		CertificateFormat["JWK"] = "JWK";
	})(CertificateFormat || (exports.CertificateFormat = CertificateFormat = {}));
	/**
	* The client authentication type. Supported values are basic, post, and none.
	* https://datatracker.ietf.org/doc/html/rfc7591#section-2
	*/
	var ClientAuthentication;
	(function(ClientAuthentication) {
		ClientAuthentication["ClientSecretPost"] = "ClientSecretPost";
		ClientAuthentication["ClientSecretBasic"] = "ClientSecretBasic";
		ClientAuthentication["None"] = "None";
	})(ClientAuthentication || (exports.ClientAuthentication = ClientAuthentication = {}));
	var OAuth2Client = class OAuth2Client extends authclient_1.AuthClient {
		constructor(optionsOrClientId, clientSecret, redirectUri) {
			const opts = optionsOrClientId && typeof optionsOrClientId === "object" ? optionsOrClientId : {
				clientId: optionsOrClientId,
				clientSecret,
				redirectUri
			};
			super(opts);
			this.certificateCache = {};
			this.certificateExpiry = null;
			this.certificateCacheFormat = CertificateFormat.PEM;
			this.refreshTokenPromises = /* @__PURE__ */ new Map();
			this._clientId = opts.clientId;
			this._clientSecret = opts.clientSecret;
			this.redirectUri = opts.redirectUri;
			this.endpoints = {
				tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
				oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
				oauth2TokenUrl: "https://oauth2.googleapis.com/token",
				oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
				oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
				oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
				oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
				...opts.endpoints
			};
			this.clientAuthentication = opts.clientAuthentication || ClientAuthentication.ClientSecretPost;
			this.issuers = opts.issuers || [
				"accounts.google.com",
				"https://accounts.google.com",
				this.universeDomain
			];
		}
		/**
		* Generates URL for consent page landing.
		* @param opts Options.
		* @return URL to consent page.
		*/
		generateAuthUrl(opts = {}) {
			if (opts.code_challenge_method && !opts.code_challenge) throw new Error("If a code_challenge_method is provided, code_challenge must be included.");
			opts.response_type = opts.response_type || "code";
			opts.client_id = opts.client_id || this._clientId;
			opts.redirect_uri = opts.redirect_uri || this.redirectUri;
			if (Array.isArray(opts.scope)) opts.scope = opts.scope.join(" ");
			return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + querystring$3.stringify(opts);
		}
		generateCodeVerifier() {
			throw new Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.");
		}
		/**
		* Convenience method to automatically generate a code_verifier, and its
		* resulting SHA256. If used, this must be paired with a S256
		* code_challenge_method.
		*
		* For a full example see:
		* https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/oauth2-codeVerifier.js
		*/
		async generateCodeVerifierAsync() {
			const crypto = (0, crypto_1.createCrypto)();
			const codeVerifier = crypto.randomBytesBase64(96).replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-");
			return {
				codeVerifier,
				codeChallenge: (await crypto.sha256DigestBase64(codeVerifier)).split("=")[0].replace(/\+/g, "-").replace(/\//g, "_")
			};
		}
		getToken(codeOrOptions, callback) {
			const options = typeof codeOrOptions === "string" ? { code: codeOrOptions } : codeOrOptions;
			if (callback) this.getTokenAsync(options).then((r) => callback(null, r.tokens, r.res), (e) => callback(e, null, e.response));
			else return this.getTokenAsync(options);
		}
		async getTokenAsync(options) {
			const url = this.endpoints.oauth2TokenUrl.toString();
			const headers = { "Content-Type": "application/x-www-form-urlencoded" };
			const values = {
				client_id: options.client_id || this._clientId,
				code_verifier: options.codeVerifier,
				code: options.code,
				grant_type: "authorization_code",
				redirect_uri: options.redirect_uri || this.redirectUri
			};
			if (this.clientAuthentication === ClientAuthentication.ClientSecretBasic) headers["Authorization"] = `Basic ${Buffer.from(`${this._clientId}:${this._clientSecret}`).toString("base64")}`;
			if (this.clientAuthentication === ClientAuthentication.ClientSecretPost) values.client_secret = this._clientSecret;
			const res = await this.transporter.request({
				...OAuth2Client.RETRY_CONFIG,
				method: "POST",
				url,
				data: querystring$3.stringify(values),
				headers
			});
			const tokens = res.data;
			if (res.data && res.data.expires_in) {
				tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1e3;
				delete tokens.expires_in;
			}
			this.emit("tokens", tokens);
			return {
				tokens,
				res
			};
		}
		/**
		* Refreshes the access token.
		* @param refresh_token Existing refresh token.
		* @private
		*/
		async refreshToken(refreshToken) {
			if (!refreshToken) return this.refreshTokenNoCache(refreshToken);
			if (this.refreshTokenPromises.has(refreshToken)) return this.refreshTokenPromises.get(refreshToken);
			const p = this.refreshTokenNoCache(refreshToken).then((r) => {
				this.refreshTokenPromises.delete(refreshToken);
				return r;
			}, (e) => {
				this.refreshTokenPromises.delete(refreshToken);
				throw e;
			});
			this.refreshTokenPromises.set(refreshToken, p);
			return p;
		}
		async refreshTokenNoCache(refreshToken) {
			var _a;
			if (!refreshToken) throw new Error("No refresh token is set.");
			const url = this.endpoints.oauth2TokenUrl.toString();
			const data = {
				refresh_token: refreshToken,
				client_id: this._clientId,
				client_secret: this._clientSecret,
				grant_type: "refresh_token"
			};
			let res;
			try {
				res = await this.transporter.request({
					...OAuth2Client.RETRY_CONFIG,
					method: "POST",
					url,
					data: querystring$3.stringify(data),
					headers: { "Content-Type": "application/x-www-form-urlencoded" }
				});
			} catch (e) {
				if (e instanceof gaxios_1.GaxiosError && e.message === "invalid_grant" && ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) && /ReAuth/i.test(e.response.data.error_description)) e.message = JSON.stringify(e.response.data);
				throw e;
			}
			const tokens = res.data;
			if (res.data && res.data.expires_in) {
				tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1e3;
				delete tokens.expires_in;
			}
			this.emit("tokens", tokens);
			return {
				tokens,
				res
			};
		}
		refreshAccessToken(callback) {
			if (callback) this.refreshAccessTokenAsync().then((r) => callback(null, r.credentials, r.res), callback);
			else return this.refreshAccessTokenAsync();
		}
		async refreshAccessTokenAsync() {
			const r = await this.refreshToken(this.credentials.refresh_token);
			const tokens = r.tokens;
			tokens.refresh_token = this.credentials.refresh_token;
			this.credentials = tokens;
			return {
				credentials: this.credentials,
				res: r.res
			};
		}
		getAccessToken(callback) {
			if (callback) this.getAccessTokenAsync().then((r) => callback(null, r.token, r.res), callback);
			else return this.getAccessTokenAsync();
		}
		async getAccessTokenAsync() {
			if (!this.credentials.access_token || this.isTokenExpiring()) {
				if (!this.credentials.refresh_token) if (this.refreshHandler) {
					const refreshedAccessToken = await this.processAndValidateRefreshHandler();
					if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token) {
						this.setCredentials(refreshedAccessToken);
						return { token: this.credentials.access_token };
					}
				} else throw new Error("No refresh token or refresh handler callback is set.");
				const r = await this.refreshAccessTokenAsync();
				if (!r.credentials || r.credentials && !r.credentials.access_token) throw new Error("Could not refresh access token.");
				return {
					token: r.credentials.access_token,
					res: r.res
				};
			} else return { token: this.credentials.access_token };
		}
		/**
		* The main authentication interface.  It takes an optional url which when
		* present is the endpoint being accessed, and returns a Promise which
		* resolves with authorization header fields.
		*
		* In OAuth2Client, the result has the form:
		* { Authorization: 'Bearer <access_token_value>' }
		* @param url The optional url being authorized
		*/
		async getRequestHeaders(url) {
			return (await this.getRequestMetadataAsync(url)).headers;
		}
		async getRequestMetadataAsync(url) {
			const thisCreds = this.credentials;
			if (!thisCreds.access_token && !thisCreds.refresh_token && !this.apiKey && !this.refreshHandler) throw new Error("No access, refresh token, API key or refresh handler callback is set.");
			if (thisCreds.access_token && !this.isTokenExpiring()) {
				thisCreds.token_type = thisCreds.token_type || "Bearer";
				const headers = { Authorization: thisCreds.token_type + " " + thisCreds.access_token };
				return { headers: this.addSharedMetadataHeaders(headers) };
			}
			if (this.refreshHandler) {
				const refreshedAccessToken = await this.processAndValidateRefreshHandler();
				if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token) {
					this.setCredentials(refreshedAccessToken);
					const headers = { Authorization: "Bearer " + this.credentials.access_token };
					return { headers: this.addSharedMetadataHeaders(headers) };
				}
			}
			if (this.apiKey) return { headers: { "X-Goog-Api-Key": this.apiKey } };
			let r = null;
			let tokens = null;
			try {
				r = await this.refreshToken(thisCreds.refresh_token);
				tokens = r.tokens;
			} catch (err) {
				const e = err;
				if (e.response && (e.response.status === 403 || e.response.status === 404)) e.message = `Could not refresh access token: ${e.message}`;
				throw e;
			}
			const credentials = this.credentials;
			credentials.token_type = credentials.token_type || "Bearer";
			tokens.refresh_token = credentials.refresh_token;
			this.credentials = tokens;
			const headers = { Authorization: credentials.token_type + " " + tokens.access_token };
			return {
				headers: this.addSharedMetadataHeaders(headers),
				res: r.res
			};
		}
		/**
		* Generates an URL to revoke the given token.
		* @param token The existing token to be revoked.
		*
		* @deprecated use instance method {@link OAuth2Client.getRevokeTokenURL}
		*/
		static getRevokeTokenUrl(token) {
			return new OAuth2Client().getRevokeTokenURL(token).toString();
		}
		/**
		* Generates a URL to revoke the given token.
		*
		* @param token The existing token to be revoked.
		*/
		getRevokeTokenURL(token) {
			const url = new URL(this.endpoints.oauth2RevokeUrl);
			url.searchParams.append("token", token);
			return url;
		}
		revokeToken(token, callback) {
			const opts = {
				...OAuth2Client.RETRY_CONFIG,
				url: this.getRevokeTokenURL(token).toString(),
				method: "POST"
			};
			if (callback) this.transporter.request(opts).then((r) => callback(null, r), callback);
			else return this.transporter.request(opts);
		}
		revokeCredentials(callback) {
			if (callback) this.revokeCredentialsAsync().then((res) => callback(null, res), callback);
			else return this.revokeCredentialsAsync();
		}
		async revokeCredentialsAsync() {
			const token = this.credentials.access_token;
			this.credentials = {};
			if (token) return this.revokeToken(token);
			else throw new Error("No access token to revoke.");
		}
		request(opts, callback) {
			if (callback) this.requestAsync(opts).then((r) => callback(null, r), (e) => {
				return callback(e, e.response);
			});
			else return this.requestAsync(opts);
		}
		async requestAsync(opts, reAuthRetried = false) {
			let r2;
			try {
				const r = await this.getRequestMetadataAsync(opts.url);
				opts.headers = opts.headers || {};
				if (r.headers && r.headers["x-goog-user-project"]) opts.headers["x-goog-user-project"] = r.headers["x-goog-user-project"];
				if (r.headers && r.headers.Authorization) opts.headers.Authorization = r.headers.Authorization;
				if (this.apiKey) opts.headers["X-Goog-Api-Key"] = this.apiKey;
				r2 = await this.transporter.request(opts);
			} catch (e) {
				const res = e.response;
				if (res) {
					const statusCode = res.status;
					const mayRequireRefresh = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure);
					const mayRequireRefreshWithNoRefreshToken = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler;
					const isReadableStream = res.config.data instanceof stream$3.Readable;
					const isAuthErr = statusCode === 401 || statusCode === 403;
					if (!reAuthRetried && isAuthErr && !isReadableStream && mayRequireRefresh) {
						await this.refreshAccessTokenAsync();
						return this.requestAsync(opts, true);
					} else if (!reAuthRetried && isAuthErr && !isReadableStream && mayRequireRefreshWithNoRefreshToken) {
						const refreshedAccessToken = await this.processAndValidateRefreshHandler();
						if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token) this.setCredentials(refreshedAccessToken);
						return this.requestAsync(opts, true);
					}
				}
				throw e;
			}
			return r2;
		}
		verifyIdToken(options, callback) {
			if (callback && typeof callback !== "function") throw new Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
			if (callback) this.verifyIdTokenAsync(options).then((r) => callback(null, r), callback);
			else return this.verifyIdTokenAsync(options);
		}
		async verifyIdTokenAsync(options) {
			if (!options.idToken) throw new Error("The verifyIdToken method requires an ID Token");
			const response = await this.getFederatedSignonCertsAsync();
			return await this.verifySignedJwtWithCertsAsync(options.idToken, response.certs, options.audience, this.issuers, options.maxExpiry);
		}
		/**
		* Obtains information about the provisioned access token.  Especially useful
		* if you want to check the scopes that were provisioned to a given token.
		*
		* @param accessToken Required.  The Access Token for which you want to get
		* user info.
		*/
		async getTokenInfo(accessToken) {
			const { data } = await this.transporter.request({
				...OAuth2Client.RETRY_CONFIG,
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${accessToken}`
				},
				url: this.endpoints.tokenInfoUrl.toString()
			});
			const info = Object.assign({
				expiry_date: (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3,
				scopes: data.scope.split(" ")
			}, data);
			delete info.expires_in;
			delete info.scope;
			return info;
		}
		getFederatedSignonCerts(callback) {
			if (callback) this.getFederatedSignonCertsAsync().then((r) => callback(null, r.certs, r.res), callback);
			else return this.getFederatedSignonCertsAsync();
		}
		async getFederatedSignonCertsAsync() {
			const nowTime = (/* @__PURE__ */ new Date()).getTime();
			const format = (0, crypto_1.hasBrowserCrypto)() ? CertificateFormat.JWK : CertificateFormat.PEM;
			if (this.certificateExpiry && nowTime < this.certificateExpiry.getTime() && this.certificateCacheFormat === format) return {
				certs: this.certificateCache,
				format
			};
			let res;
			let url;
			switch (format) {
				case CertificateFormat.PEM:
					url = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
					break;
				case CertificateFormat.JWK:
					url = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
					break;
				default: throw new Error(`Unsupported certificate format ${format}`);
			}
			try {
				res = await this.transporter.request({
					...OAuth2Client.RETRY_CONFIG,
					url
				});
			} catch (e) {
				if (e instanceof Error) e.message = `Failed to retrieve verification certificates: ${e.message}`;
				throw e;
			}
			const cacheControl = res ? res.headers["cache-control"] : void 0;
			let cacheAge = -1;
			if (cacheControl) {
				const regexResult = (/* @__PURE__ */ new RegExp("max-age=([0-9]*)")).exec(cacheControl);
				if (regexResult && regexResult.length === 2) cacheAge = Number(regexResult[1]) * 1e3;
			}
			let certificates = {};
			switch (format) {
				case CertificateFormat.PEM:
					certificates = res.data;
					break;
				case CertificateFormat.JWK:
					for (const key of res.data.keys) certificates[key.kid] = key;
					break;
				default: throw new Error(`Unsupported certificate format ${format}`);
			}
			const now = /* @__PURE__ */ new Date();
			this.certificateExpiry = cacheAge === -1 ? null : new Date(now.getTime() + cacheAge);
			this.certificateCache = certificates;
			this.certificateCacheFormat = format;
			return {
				certs: certificates,
				format,
				res
			};
		}
		getIapPublicKeys(callback) {
			if (callback) this.getIapPublicKeysAsync().then((r) => callback(null, r.pubkeys, r.res), callback);
			else return this.getIapPublicKeysAsync();
		}
		async getIapPublicKeysAsync() {
			let res;
			const url = this.endpoints.oauth2IapPublicKeyUrl.toString();
			try {
				res = await this.transporter.request({
					...OAuth2Client.RETRY_CONFIG,
					url
				});
			} catch (e) {
				if (e instanceof Error) e.message = `Failed to retrieve verification certificates: ${e.message}`;
				throw e;
			}
			return {
				pubkeys: res.data,
				res
			};
		}
		verifySignedJwtWithCerts() {
			throw new Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.");
		}
		/**
		* Verify the id token is signed with the correct certificate
		* and is from the correct audience.
		* @param jwt The jwt to verify (The ID Token in this case).
		* @param certs The array of certs to test the jwt against.
		* @param requiredAudience The audience to test the jwt against.
		* @param issuers The allowed issuers of the jwt (Optional).
		* @param maxExpiry The max expiry the certificate can be (Optional).
		* @return Returns a promise resolving to LoginTicket on verification.
		*/
		async verifySignedJwtWithCertsAsync(jwt, certs, requiredAudience, issuers, maxExpiry) {
			const crypto = (0, crypto_1.createCrypto)();
			if (!maxExpiry) maxExpiry = OAuth2Client.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
			const segments = jwt.split(".");
			if (segments.length !== 3) throw new Error("Wrong number of segments in token: " + jwt);
			const signed = segments[0] + "." + segments[1];
			let signature = segments[2];
			let envelope;
			let payload;
			try {
				envelope = JSON.parse(crypto.decodeBase64StringUtf8(segments[0]));
			} catch (err) {
				if (err instanceof Error) err.message = `Can't parse token envelope: ${segments[0]}': ${err.message}`;
				throw err;
			}
			if (!envelope) throw new Error("Can't parse token envelope: " + segments[0]);
			try {
				payload = JSON.parse(crypto.decodeBase64StringUtf8(segments[1]));
			} catch (err) {
				if (err instanceof Error) err.message = `Can't parse token payload '${segments[0]}`;
				throw err;
			}
			if (!payload) throw new Error("Can't parse token payload: " + segments[1]);
			if (!Object.prototype.hasOwnProperty.call(certs, envelope.kid)) throw new Error("No pem found for envelope: " + JSON.stringify(envelope));
			const cert = certs[envelope.kid];
			if (envelope.alg === "ES256") signature = formatEcdsa.joseToDer(signature, "ES256").toString("base64");
			if (!await crypto.verify(cert, signed, signature)) throw new Error("Invalid token signature: " + jwt);
			if (!payload.iat) throw new Error("No issue time in token: " + JSON.stringify(payload));
			if (!payload.exp) throw new Error("No expiration time in token: " + JSON.stringify(payload));
			const iat = Number(payload.iat);
			if (isNaN(iat)) throw new Error("iat field using invalid format");
			const exp = Number(payload.exp);
			if (isNaN(exp)) throw new Error("exp field using invalid format");
			const now = (/* @__PURE__ */ new Date()).getTime() / 1e3;
			if (exp >= now + maxExpiry) throw new Error("Expiration time too far in future: " + JSON.stringify(payload));
			const earliest = iat - OAuth2Client.CLOCK_SKEW_SECS_;
			const latest = exp + OAuth2Client.CLOCK_SKEW_SECS_;
			if (now < earliest) throw new Error("Token used too early, " + now + " < " + earliest + ": " + JSON.stringify(payload));
			if (now > latest) throw new Error("Token used too late, " + now + " > " + latest + ": " + JSON.stringify(payload));
			if (issuers && issuers.indexOf(payload.iss) < 0) throw new Error("Invalid issuer, expected one of [" + issuers + "], but got " + payload.iss);
			if (typeof requiredAudience !== "undefined" && requiredAudience !== null) {
				const aud = payload.aud;
				let audVerified = false;
				if (requiredAudience.constructor === Array) audVerified = requiredAudience.indexOf(aud) > -1;
				else audVerified = aud === requiredAudience;
				if (!audVerified) throw new Error("Wrong recipient, payload audience != requiredAudience");
			}
			return new loginticket_1.LoginTicket(envelope, payload);
		}
		/**
		* Returns a promise that resolves with AccessTokenResponse type if
		* refreshHandler is defined.
		* If not, nothing is returned.
		*/
		async processAndValidateRefreshHandler() {
			if (this.refreshHandler) {
				const accessTokenResponse = await this.refreshHandler();
				if (!accessTokenResponse.access_token) throw new Error("No access token is returned by the refreshHandler callback.");
				return accessTokenResponse;
			}
		}
		/**
		* Returns true if a token is expired or will expire within
		* eagerRefreshThresholdMillismilliseconds.
		* If there is no expiry time, assumes the token is not expired or expiring.
		*/
		isTokenExpiring() {
			const expiryDate = this.credentials.expiry_date;
			return expiryDate ? expiryDate <= (/* @__PURE__ */ new Date()).getTime() + this.eagerRefreshThresholdMillis : false;
		}
	};
	exports.OAuth2Client = OAuth2Client;
	/**
	* @deprecated use instance's {@link OAuth2Client.endpoints}
	*/
	OAuth2Client.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
	/**
	* Clock skew - five minutes in seconds
	*/
	OAuth2Client.CLOCK_SKEW_SECS_ = 300;
	/**
	* The default max Token Lifetime is one day in seconds
	*/
	OAuth2Client.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/computeclient.js
var require_computeclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Compute = void 0;
	var gaxios_1 = require_src$7();
	var gcpMetadata = require_src$5();
	var oauth2client_1 = require_oauth2client();
	var Compute = class extends oauth2client_1.OAuth2Client {
		/**
		* Google Compute Engine service account credentials.
		*
		* Retrieve access token from the metadata server.
		* See: https://cloud.google.com/compute/docs/access/authenticate-workloads#applications
		*/
		constructor(options = {}) {
			super(options);
			this.credentials = {
				expiry_date: 1,
				refresh_token: "compute-placeholder"
			};
			this.serviceAccountEmail = options.serviceAccountEmail || "default";
			this.scopes = Array.isArray(options.scopes) ? options.scopes : options.scopes ? [options.scopes] : [];
		}
		/**
		* Refreshes the access token.
		* @param refreshToken Unused parameter
		*/
		async refreshTokenNoCache(refreshToken) {
			const tokenPath = `service-accounts/${this.serviceAccountEmail}/token`;
			let data;
			try {
				const instanceOptions = { property: tokenPath };
				if (this.scopes.length > 0) instanceOptions.params = { scopes: this.scopes.join(",") };
				data = await gcpMetadata.instance(instanceOptions);
			} catch (e) {
				if (e instanceof gaxios_1.GaxiosError) {
					e.message = `Could not refresh access token: ${e.message}`;
					this.wrapError(e);
				}
				throw e;
			}
			const tokens = data;
			if (data && data.expires_in) {
				tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3;
				delete tokens.expires_in;
			}
			this.emit("tokens", tokens);
			return {
				tokens,
				res: null
			};
		}
		/**
		* Fetches an ID token.
		* @param targetAudience the audience for the fetched ID token.
		*/
		async fetchIdToken(targetAudience) {
			const idTokenPath = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${targetAudience}`;
			let idToken;
			try {
				const instanceOptions = { property: idTokenPath };
				idToken = await gcpMetadata.instance(instanceOptions);
			} catch (e) {
				if (e instanceof Error) e.message = `Could not fetch ID token: ${e.message}`;
				throw e;
			}
			return idToken;
		}
		wrapError(e) {
			const res = e.response;
			if (res && res.status) {
				e.status = res.status;
				if (res.status === 403) e.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + e.message;
				else if (res.status === 404) e.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + e.message;
			}
		}
	};
	exports.Compute = Compute;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/idtokenclient.js
var require_idtokenclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IdTokenClient = void 0;
	var oauth2client_1 = require_oauth2client();
	var IdTokenClient = class extends oauth2client_1.OAuth2Client {
		/**
		* Google ID Token client
		*
		* Retrieve ID token from the metadata server.
		* See: https://cloud.google.com/docs/authentication/get-id-token#metadata-server
		*/
		constructor(options) {
			super(options);
			this.targetAudience = options.targetAudience;
			this.idTokenProvider = options.idTokenProvider;
		}
		async getRequestMetadataAsync(url) {
			if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
				const idToken = await this.idTokenProvider.fetchIdToken(this.targetAudience);
				this.credentials = {
					id_token: idToken,
					expiry_date: this.getIdTokenExpiryDate(idToken)
				};
			}
			return { headers: { Authorization: "Bearer " + this.credentials.id_token } };
		}
		getIdTokenExpiryDate(idToken) {
			const payloadB64 = idToken.split(".")[1];
			if (payloadB64) return JSON.parse(Buffer.from(payloadB64, "base64").toString("ascii")).exp * 1e3;
		}
	};
	exports.IdTokenClient = IdTokenClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/envDetect.js
var require_envDetect = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GCPEnv = void 0;
	exports.clear = clear;
	exports.getEnv = getEnv;
	var gcpMetadata = require_src$5();
	var GCPEnv;
	(function(GCPEnv) {
		GCPEnv["APP_ENGINE"] = "APP_ENGINE";
		GCPEnv["KUBERNETES_ENGINE"] = "KUBERNETES_ENGINE";
		GCPEnv["CLOUD_FUNCTIONS"] = "CLOUD_FUNCTIONS";
		GCPEnv["COMPUTE_ENGINE"] = "COMPUTE_ENGINE";
		GCPEnv["CLOUD_RUN"] = "CLOUD_RUN";
		GCPEnv["NONE"] = "NONE";
	})(GCPEnv || (exports.GCPEnv = GCPEnv = {}));
	var envPromise;
	function clear() {
		envPromise = void 0;
	}
	async function getEnv() {
		if (envPromise) return envPromise;
		envPromise = getEnvMemoized();
		return envPromise;
	}
	async function getEnvMemoized() {
		let env = GCPEnv.NONE;
		if (isAppEngine()) env = GCPEnv.APP_ENGINE;
		else if (isCloudFunction()) env = GCPEnv.CLOUD_FUNCTIONS;
		else if (await isComputeEngine()) if (await isKubernetesEngine()) env = GCPEnv.KUBERNETES_ENGINE;
		else if (isCloudRun()) env = GCPEnv.CLOUD_RUN;
		else env = GCPEnv.COMPUTE_ENGINE;
		else env = GCPEnv.NONE;
		return env;
	}
	function isAppEngine() {
		return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME);
	}
	function isCloudFunction() {
		return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET);
	}
	/**
	* This check only verifies that the environment is running knative.
	* This must be run *after* checking for Kubernetes, otherwise it will
	* return a false positive.
	*/
	function isCloudRun() {
		return !!process.env.K_CONFIGURATION;
	}
	async function isKubernetesEngine() {
		try {
			await gcpMetadata.instance("attributes/cluster-name");
			return true;
		} catch (e) {
			return false;
		}
	}
	async function isComputeEngine() {
		return gcpMetadata.isAvailable();
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/jwtaccess.js
var require_jwtaccess = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JWTAccess = void 0;
	var jws = require_jws();
	var util_1 = require_util$2();
	var DEFAULT_HEADER = {
		alg: "RS256",
		typ: "JWT"
	};
	exports.JWTAccess = class JWTAccess {
		/**
		* JWTAccess service account credentials.
		*
		* Create a new access token by using the credential to create a new JWT token
		* that's recognized as the access token.
		*
		* @param email the service account email address.
		* @param key the private key that will be used to sign the token.
		* @param keyId the ID of the private key used to sign the token.
		*/
		constructor(email, key, keyId, eagerRefreshThresholdMillis) {
			this.cache = new util_1.LRUCache({
				capacity: 500,
				maxAge: 3600 * 1e3
			});
			this.email = email;
			this.key = key;
			this.keyId = keyId;
			this.eagerRefreshThresholdMillis = eagerRefreshThresholdMillis !== null && eagerRefreshThresholdMillis !== void 0 ? eagerRefreshThresholdMillis : 300 * 1e3;
		}
		/**
		* Ensures that we're caching a key appropriately, giving precedence to scopes vs. url
		*
		* @param url The URI being authorized.
		* @param scopes The scope or scopes being authorized
		* @returns A string that returns the cached key.
		*/
		getCachedKey(url, scopes) {
			let cacheKey = url;
			if (scopes && Array.isArray(scopes) && scopes.length) cacheKey = url ? `${url}_${scopes.join("_")}` : `${scopes.join("_")}`;
			else if (typeof scopes === "string") cacheKey = url ? `${url}_${scopes}` : scopes;
			if (!cacheKey) throw Error("Scopes or url must be provided");
			return cacheKey;
		}
		/**
		* Get a non-expired access token, after refreshing if necessary.
		*
		* @param url The URI being authorized.
		* @param additionalClaims An object with a set of additional claims to
		* include in the payload.
		* @returns An object that includes the authorization header.
		*/
		getRequestHeaders(url, additionalClaims, scopes) {
			const key = this.getCachedKey(url, scopes);
			const cachedToken = this.cache.get(key);
			const now = Date.now();
			if (cachedToken && cachedToken.expiration - now > this.eagerRefreshThresholdMillis) return cachedToken.headers;
			const iat = Math.floor(Date.now() / 1e3);
			const exp = JWTAccess.getExpirationTime(iat);
			let defaultClaims;
			if (Array.isArray(scopes)) scopes = scopes.join(" ");
			if (scopes) defaultClaims = {
				iss: this.email,
				sub: this.email,
				scope: scopes,
				exp,
				iat
			};
			else defaultClaims = {
				iss: this.email,
				sub: this.email,
				aud: url,
				exp,
				iat
			};
			if (additionalClaims) {
				for (const claim in defaultClaims) if (additionalClaims[claim]) throw new Error(`The '${claim}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`);
			}
			const header = this.keyId ? {
				...DEFAULT_HEADER,
				kid: this.keyId
			} : DEFAULT_HEADER;
			const payload = Object.assign(defaultClaims, additionalClaims);
			const headers = { Authorization: `Bearer ${jws.sign({
				header,
				payload,
				secret: this.key
			})}` };
			this.cache.set(key, {
				expiration: exp * 1e3,
				headers
			});
			return headers;
		}
		/**
		* Returns an expiration time for the JWT token.
		*
		* @param iat The issued at time for the JWT.
		* @returns An expiration time for the JWT.
		*/
		static getExpirationTime(iat) {
			return iat + 3600;
		}
		/**
		* Create a JWTAccess credentials instance using the given input options.
		* @param json The input object.
		*/
		fromJSON(json) {
			if (!json) throw new Error("Must pass in a JSON object containing the service account auth settings.");
			if (!json.client_email) throw new Error("The incoming JSON object does not contain a client_email field");
			if (!json.private_key) throw new Error("The incoming JSON object does not contain a private_key field");
			this.email = json.client_email;
			this.key = json.private_key;
			this.keyId = json.private_key_id;
			this.projectId = json.project_id;
		}
		fromStream(inputStream, callback) {
			if (callback) this.fromStreamAsync(inputStream).then(() => callback(), callback);
			else return this.fromStreamAsync(inputStream);
		}
		fromStreamAsync(inputStream) {
			return new Promise((resolve, reject) => {
				if (!inputStream) reject(/* @__PURE__ */ new Error("Must pass in a stream containing the service account auth settings."));
				let s = "";
				inputStream.setEncoding("utf8").on("data", (chunk) => s += chunk).on("error", reject).on("end", () => {
					try {
						const data = JSON.parse(s);
						this.fromJSON(data);
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/jwtclient.js
var require_jwtclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JWT = void 0;
	var gtoken_1 = require_src$8();
	var jwtaccess_1 = require_jwtaccess();
	var oauth2client_1 = require_oauth2client();
	var authclient_1 = require_authclient();
	exports.JWT = class JWT extends oauth2client_1.OAuth2Client {
		constructor(optionsOrEmail, keyFile, key, scopes, subject, keyId) {
			const opts = optionsOrEmail && typeof optionsOrEmail === "object" ? optionsOrEmail : {
				email: optionsOrEmail,
				keyFile,
				key,
				keyId,
				scopes,
				subject
			};
			super(opts);
			this.email = opts.email;
			this.keyFile = opts.keyFile;
			this.key = opts.key;
			this.keyId = opts.keyId;
			this.scopes = opts.scopes;
			this.subject = opts.subject;
			this.additionalClaims = opts.additionalClaims;
			this.credentials = {
				refresh_token: "jwt-placeholder",
				expiry_date: 1
			};
		}
		/**
		* Creates a copy of the credential with the specified scopes.
		* @param scopes List of requested scopes or a single scope.
		* @return The cloned instance.
		*/
		createScoped(scopes) {
			const jwt = new JWT(this);
			jwt.scopes = scopes;
			return jwt;
		}
		/**
		* Obtains the metadata to be sent with the request.
		*
		* @param url the URI being authorized.
		*/
		async getRequestMetadataAsync(url) {
			url = this.defaultServicePath ? `https://${this.defaultServicePath}/` : url;
			const useSelfSignedJWT = !this.hasUserScopes() && url || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== authclient_1.DEFAULT_UNIVERSE;
			if (this.subject && this.universeDomain !== authclient_1.DEFAULT_UNIVERSE) throw new RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${authclient_1.DEFAULT_UNIVERSE}`);
			if (!this.apiKey && useSelfSignedJWT) if (this.additionalClaims && this.additionalClaims.target_audience) {
				const { tokens } = await this.refreshToken();
				return { headers: this.addSharedMetadataHeaders({ Authorization: `Bearer ${tokens.id_token}` }) };
			} else {
				if (!this.access) this.access = new jwtaccess_1.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
				let scopes;
				if (this.hasUserScopes()) scopes = this.scopes;
				else if (!url) scopes = this.defaultScopes;
				const useScopes = this.useJWTAccessWithScope || this.universeDomain !== authclient_1.DEFAULT_UNIVERSE;
				const headers = await this.access.getRequestHeaders(url !== null && url !== void 0 ? url : void 0, this.additionalClaims, useScopes ? scopes : void 0);
				return { headers: this.addSharedMetadataHeaders(headers) };
			}
			else if (this.hasAnyScopes() || this.apiKey) return super.getRequestMetadataAsync(url);
			else return { headers: {} };
		}
		/**
		* Fetches an ID token.
		* @param targetAudience the audience for the fetched ID token.
		*/
		async fetchIdToken(targetAudience) {
			const gtoken = new gtoken_1.GoogleToken({
				iss: this.email,
				sub: this.subject,
				scope: this.scopes || this.defaultScopes,
				keyFile: this.keyFile,
				key: this.key,
				additionalClaims: { target_audience: targetAudience },
				transporter: this.transporter
			});
			await gtoken.getToken({ forceRefresh: true });
			if (!gtoken.idToken) throw new Error("Unknown error: Failed to fetch ID token");
			return gtoken.idToken;
		}
		/**
		* Determine if there are currently scopes available.
		*/
		hasUserScopes() {
			if (!this.scopes) return false;
			return this.scopes.length > 0;
		}
		/**
		* Are there any default or user scopes defined.
		*/
		hasAnyScopes() {
			if (this.scopes && this.scopes.length > 0) return true;
			if (this.defaultScopes && this.defaultScopes.length > 0) return true;
			return false;
		}
		authorize(callback) {
			if (callback) this.authorizeAsync().then((r) => callback(null, r), callback);
			else return this.authorizeAsync();
		}
		async authorizeAsync() {
			const result = await this.refreshToken();
			if (!result) throw new Error("No result returned");
			this.credentials = result.tokens;
			this.credentials.refresh_token = "jwt-placeholder";
			this.key = this.gtoken.key;
			this.email = this.gtoken.iss;
			return result.tokens;
		}
		/**
		* Refreshes the access token.
		* @param refreshToken ignored
		* @private
		*/
		async refreshTokenNoCache(refreshToken) {
			const gtoken = this.createGToken();
			const tokens = {
				access_token: (await gtoken.getToken({ forceRefresh: this.isTokenExpiring() })).access_token,
				token_type: "Bearer",
				expiry_date: gtoken.expiresAt,
				id_token: gtoken.idToken
			};
			this.emit("tokens", tokens);
			return {
				res: null,
				tokens
			};
		}
		/**
		* Create a gToken if it doesn't already exist.
		*/
		createGToken() {
			if (!this.gtoken) this.gtoken = new gtoken_1.GoogleToken({
				iss: this.email,
				sub: this.subject,
				scope: this.scopes || this.defaultScopes,
				keyFile: this.keyFile,
				key: this.key,
				additionalClaims: this.additionalClaims,
				transporter: this.transporter
			});
			return this.gtoken;
		}
		/**
		* Create a JWT credentials instance using the given input options.
		* @param json The input object.
		*
		* @remarks
		*
		* **Important**: If you accept a credential configuration (credential JSON/File/Stream) from an external source for authentication to Google Cloud, you must validate it before providing it to any Google API or library. Providing an unvalidated credential configuration to Google APIs can compromise the security of your systems and data. For more information, refer to {@link https://cloud.google.com/docs/authentication/external/externally-sourced-credentials Validate credential configurations from external sources}.
		*/
		fromJSON(json) {
			if (!json) throw new Error("Must pass in a JSON object containing the service account auth settings.");
			if (!json.client_email) throw new Error("The incoming JSON object does not contain a client_email field");
			if (!json.private_key) throw new Error("The incoming JSON object does not contain a private_key field");
			this.email = json.client_email;
			this.key = json.private_key;
			this.keyId = json.private_key_id;
			this.projectId = json.project_id;
			this.quotaProjectId = json.quota_project_id;
			this.universeDomain = json.universe_domain || this.universeDomain;
		}
		fromStream(inputStream, callback) {
			if (callback) this.fromStreamAsync(inputStream).then(() => callback(), callback);
			else return this.fromStreamAsync(inputStream);
		}
		fromStreamAsync(inputStream) {
			return new Promise((resolve, reject) => {
				if (!inputStream) throw new Error("Must pass in a stream containing the service account auth settings.");
				let s = "";
				inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s += chunk).on("end", () => {
					try {
						const data = JSON.parse(s);
						this.fromJSON(data);
						resolve();
					} catch (e) {
						reject(e);
					}
				});
			});
		}
		/**
		* Creates a JWT credentials instance using an API Key for authentication.
		* @param apiKey The API Key in string form.
		*/
		fromAPIKey(apiKey) {
			if (typeof apiKey !== "string") throw new Error("Must provide an API Key string.");
			this.apiKey = apiKey;
		}
		/**
		* Using the key or keyFile on the JWT client, obtain an object that contains
		* the key and the client email.
		*/
		async getCredentials() {
			if (this.key) return {
				private_key: this.key,
				client_email: this.email
			};
			else if (this.keyFile) {
				const creds = await this.createGToken().getCredentials(this.keyFile);
				return {
					private_key: creds.privateKey,
					client_email: creds.clientEmail
				};
			}
			throw new Error("A key or a keyFile must be provided to getCredentials.");
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/refreshclient.js
var require_refreshclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UserRefreshClient = exports.USER_REFRESH_ACCOUNT_TYPE = void 0;
	var oauth2client_1 = require_oauth2client();
	var querystring_1 = __require("querystring");
	exports.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";
	exports.UserRefreshClient = class UserRefreshClient extends oauth2client_1.OAuth2Client {
		constructor(optionsOrClientId, clientSecret, refreshToken, eagerRefreshThresholdMillis, forceRefreshOnFailure) {
			const opts = optionsOrClientId && typeof optionsOrClientId === "object" ? optionsOrClientId : {
				clientId: optionsOrClientId,
				clientSecret,
				refreshToken,
				eagerRefreshThresholdMillis,
				forceRefreshOnFailure
			};
			super(opts);
			this._refreshToken = opts.refreshToken;
			this.credentials.refresh_token = opts.refreshToken;
		}
		/**
		* Refreshes the access token.
		* @param refreshToken An ignored refreshToken..
		* @param callback Optional callback.
		*/
		async refreshTokenNoCache(refreshToken) {
			return super.refreshTokenNoCache(this._refreshToken);
		}
		async fetchIdToken(targetAudience) {
			return (await this.transporter.request({
				...UserRefreshClient.RETRY_CONFIG,
				url: this.endpoints.oauth2TokenUrl,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				method: "POST",
				data: (0, querystring_1.stringify)({
					client_id: this._clientId,
					client_secret: this._clientSecret,
					grant_type: "refresh_token",
					refresh_token: this._refreshToken,
					target_audience: targetAudience
				})
			})).data.id_token;
		}
		/**
		* Create a UserRefreshClient credentials instance using the given input
		* options.
		* @param json The input object.
		*/
		fromJSON(json) {
			if (!json) throw new Error("Must pass in a JSON object containing the user refresh token");
			if (json.type !== "authorized_user") throw new Error("The incoming JSON object does not have the \"authorized_user\" type");
			if (!json.client_id) throw new Error("The incoming JSON object does not contain a client_id field");
			if (!json.client_secret) throw new Error("The incoming JSON object does not contain a client_secret field");
			if (!json.refresh_token) throw new Error("The incoming JSON object does not contain a refresh_token field");
			this._clientId = json.client_id;
			this._clientSecret = json.client_secret;
			this._refreshToken = json.refresh_token;
			this.credentials.refresh_token = json.refresh_token;
			this.quotaProjectId = json.quota_project_id;
			this.universeDomain = json.universe_domain || this.universeDomain;
		}
		fromStream(inputStream, callback) {
			if (callback) this.fromStreamAsync(inputStream).then(() => callback(), callback);
			else return this.fromStreamAsync(inputStream);
		}
		async fromStreamAsync(inputStream) {
			return new Promise((resolve, reject) => {
				if (!inputStream) return reject(/* @__PURE__ */ new Error("Must pass in a stream containing the user refresh token."));
				let s = "";
				inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s += chunk).on("end", () => {
					try {
						const data = JSON.parse(s);
						this.fromJSON(data);
						return resolve();
					} catch (err) {
						return reject(err);
					}
				});
			});
		}
		/**
		* Create a UserRefreshClient credentials instance using the given input
		* options.
		* @param json The input object.
		*/
		static fromJSON(json) {
			const client = new UserRefreshClient();
			client.fromJSON(json);
			return client;
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/impersonated.js
var require_impersonated = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Copyright 2021 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Impersonated = exports.IMPERSONATED_ACCOUNT_TYPE = void 0;
	var oauth2client_1 = require_oauth2client();
	var gaxios_1 = require_src$7();
	var util_1 = require_util$2();
	exports.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";
	exports.Impersonated = class Impersonated extends oauth2client_1.OAuth2Client {
		/**
		* Impersonated service account credentials.
		*
		* Create a new access token by impersonating another service account.
		*
		* Impersonated Credentials allowing credentials issued to a user or
		* service account to impersonate another. The source project using
		* Impersonated Credentials must enable the "IAMCredentials" API.
		* Also, the target service account must grant the orginating principal
		* the "Service Account Token Creator" IAM role.
		*
		* @param {object} options - The configuration object.
		* @param {object} [options.sourceClient] the source credential used as to
		* acquire the impersonated credentials.
		* @param {string} [options.targetPrincipal] the service account to
		* impersonate.
		* @param {string[]} [options.delegates] the chained list of delegates
		* required to grant the final access_token. If set, the sequence of
		* identities must have "Service Account Token Creator" capability granted to
		* the preceding identity. For example, if set to [serviceAccountB,
		* serviceAccountC], the sourceCredential must have the Token Creator role on
		* serviceAccountB. serviceAccountB must have the Token Creator on
		* serviceAccountC. Finally, C must have Token Creator on target_principal.
		* If left unset, sourceCredential must have that role on targetPrincipal.
		* @param {string[]} [options.targetScopes] scopes to request during the
		* authorization grant.
		* @param {number} [options.lifetime] number of seconds the delegated
		* credential should be valid for up to 3600 seconds by default, or 43,200
		* seconds by extending the token's lifetime, see:
		* https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth
		* @param {string} [options.endpoint] api endpoint override.
		*/
		constructor(options = {}) {
			var _a, _b, _c, _d, _e, _f;
			super(options);
			this.credentials = {
				expiry_date: 1,
				refresh_token: "impersonated-placeholder"
			};
			this.sourceClient = (_a = options.sourceClient) !== null && _a !== void 0 ? _a : new oauth2client_1.OAuth2Client();
			this.targetPrincipal = (_b = options.targetPrincipal) !== null && _b !== void 0 ? _b : "";
			this.delegates = (_c = options.delegates) !== null && _c !== void 0 ? _c : [];
			this.targetScopes = (_d = options.targetScopes) !== null && _d !== void 0 ? _d : [];
			this.lifetime = (_e = options.lifetime) !== null && _e !== void 0 ? _e : 3600;
			if (!!!(0, util_1.originalOrCamelOptions)(options).get("universe_domain")) this.universeDomain = this.sourceClient.universeDomain;
			else if (this.sourceClient.universeDomain !== this.universeDomain) throw new RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
			this.endpoint = (_f = options.endpoint) !== null && _f !== void 0 ? _f : `https://iamcredentials.${this.universeDomain}`;
		}
		/**
		* Signs some bytes.
		*
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob Reference Documentation}
		* @param blobToSign String to sign.
		*
		* @returns A {@link SignBlobResponse} denoting the keyID and signedBlob in base64 string
		*/
		async sign(blobToSign) {
			await this.sourceClient.getAccessToken();
			const name = `projects/-/serviceAccounts/${this.targetPrincipal}`;
			const u = `${this.endpoint}/v1/${name}:signBlob`;
			const body = {
				delegates: this.delegates,
				payload: Buffer.from(blobToSign).toString("base64")
			};
			return (await this.sourceClient.request({
				...Impersonated.RETRY_CONFIG,
				url: u,
				data: body,
				method: "POST"
			})).data;
		}
		/** The service account email to be impersonated. */
		getTargetPrincipal() {
			return this.targetPrincipal;
		}
		/**
		* Refreshes the access token.
		*/
		async refreshToken() {
			var _a, _b, _c, _d, _e, _f;
			try {
				await this.sourceClient.getAccessToken();
				const name = "projects/-/serviceAccounts/" + this.targetPrincipal;
				const u = `${this.endpoint}/v1/${name}:generateAccessToken`;
				const body = {
					delegates: this.delegates,
					scope: this.targetScopes,
					lifetime: this.lifetime + "s"
				};
				const res = await this.sourceClient.request({
					...Impersonated.RETRY_CONFIG,
					url: u,
					data: body,
					method: "POST"
				});
				const tokenResponse = res.data;
				this.credentials.access_token = tokenResponse.accessToken;
				this.credentials.expiry_date = Date.parse(tokenResponse.expireTime);
				return {
					tokens: this.credentials,
					res
				};
			} catch (error) {
				if (!(error instanceof Error)) throw error;
				let status = 0;
				let message = "";
				if (error instanceof gaxios_1.GaxiosError) {
					status = (_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.status;
					message = (_f = (_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message;
				}
				if (status && message) {
					error.message = `${status}: unable to impersonate: ${message}`;
					throw error;
				} else {
					error.message = `unable to impersonate: ${error}`;
					throw error;
				}
			}
		}
		/**
		* Generates an OpenID Connect ID token for a service account.
		*
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateIdToken Reference Documentation}
		*
		* @param targetAudience the audience for the fetched ID token.
		* @param options the for the request
		* @return an OpenID Connect ID token
		*/
		async fetchIdToken(targetAudience, options) {
			var _a, _b;
			await this.sourceClient.getAccessToken();
			const name = `projects/-/serviceAccounts/${this.targetPrincipal}`;
			const u = `${this.endpoint}/v1/${name}:generateIdToken`;
			const body = {
				delegates: this.delegates,
				audience: targetAudience,
				includeEmail: (_a = options === null || options === void 0 ? void 0 : options.includeEmail) !== null && _a !== void 0 ? _a : true,
				useEmailAzp: (_b = options === null || options === void 0 ? void 0 : options.includeEmail) !== null && _b !== void 0 ? _b : true
			};
			return (await this.sourceClient.request({
				...Impersonated.RETRY_CONFIG,
				url: u,
				data: body,
				method: "POST"
			})).data.token;
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/oauth2common.js
var require_oauth2common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OAuthClientAuthHandler = void 0;
	exports.getErrorFromOAuthErrorResponse = getErrorFromOAuthErrorResponse;
	var querystring$2 = __require("querystring");
	var crypto_1 = require_crypto();
	/** List of HTTP methods that accept request bodies. */
	var METHODS_SUPPORTING_REQUEST_BODY = [
		"PUT",
		"POST",
		"PATCH"
	];
	/**
	* Abstract class for handling client authentication in OAuth-based
	* operations.
	* When request-body client authentication is used, only application/json and
	* application/x-www-form-urlencoded content types for HTTP methods that support
	* request bodies are supported.
	*/
	var OAuthClientAuthHandler = class {
		/**
		* Instantiates an OAuth client authentication handler.
		* @param clientAuthentication The client auth credentials.
		*/
		constructor(clientAuthentication) {
			this.clientAuthentication = clientAuthentication;
			this.crypto = (0, crypto_1.createCrypto)();
		}
		/**
		* Applies client authentication on the OAuth request's headers or POST
		* body but does not process the request.
		* @param opts The GaxiosOptions whose headers or data are to be modified
		*   depending on the client authentication mechanism to be used.
		* @param bearerToken The optional bearer token to use for authentication.
		*   When this is used, no client authentication credentials are needed.
		*/
		applyClientAuthenticationOptions(opts, bearerToken) {
			this.injectAuthenticatedHeaders(opts, bearerToken);
			if (!bearerToken) this.injectAuthenticatedRequestBody(opts);
		}
		/**
		* Applies client authentication on the request's header if either
		* basic authentication or bearer token authentication is selected.
		*
		* @param opts The GaxiosOptions whose headers or data are to be modified
		*   depending on the client authentication mechanism to be used.
		* @param bearerToken The optional bearer token to use for authentication.
		*   When this is used, no client authentication credentials are needed.
		*/
		injectAuthenticatedHeaders(opts, bearerToken) {
			var _a;
			if (bearerToken) {
				opts.headers = opts.headers || {};
				Object.assign(opts.headers, { Authorization: `Bearer ${bearerToken}}` });
			} else if (((_a = this.clientAuthentication) === null || _a === void 0 ? void 0 : _a.confidentialClientType) === "basic") {
				opts.headers = opts.headers || {};
				const clientId = this.clientAuthentication.clientId;
				const clientSecret = this.clientAuthentication.clientSecret || "";
				const base64EncodedCreds = this.crypto.encodeBase64StringUtf8(`${clientId}:${clientSecret}`);
				Object.assign(opts.headers, { Authorization: `Basic ${base64EncodedCreds}` });
			}
		}
		/**
		* Applies client authentication on the request's body if request-body
		* client authentication is selected.
		*
		* @param opts The GaxiosOptions whose headers or data are to be modified
		*   depending on the client authentication mechanism to be used.
		*/
		injectAuthenticatedRequestBody(opts) {
			var _a;
			if (((_a = this.clientAuthentication) === null || _a === void 0 ? void 0 : _a.confidentialClientType) === "request-body") {
				const method = (opts.method || "GET").toUpperCase();
				if (METHODS_SUPPORTING_REQUEST_BODY.indexOf(method) !== -1) {
					let contentType;
					const headers = opts.headers || {};
					for (const key in headers) if (key.toLowerCase() === "content-type" && headers[key]) {
						contentType = headers[key].toLowerCase();
						break;
					}
					if (contentType === "application/x-www-form-urlencoded") {
						opts.data = opts.data || "";
						const data = querystring$2.parse(opts.data);
						Object.assign(data, {
							client_id: this.clientAuthentication.clientId,
							client_secret: this.clientAuthentication.clientSecret || ""
						});
						opts.data = querystring$2.stringify(data);
					} else if (contentType === "application/json") {
						opts.data = opts.data || {};
						Object.assign(opts.data, {
							client_id: this.clientAuthentication.clientId,
							client_secret: this.clientAuthentication.clientSecret || ""
						});
					} else throw new Error(`${contentType} content-types are not supported with ${this.clientAuthentication.confidentialClientType} client authentication`);
				} else throw new Error(`${method} HTTP method does not support ${this.clientAuthentication.confidentialClientType} client authentication`);
			}
		}
		/**
		* Retry config for Auth-related requests.
		*
		* @remarks
		*
		* This is not a part of the default {@link AuthClient.transporter transporter/gaxios}
		* config as some downstream APIs would prefer if customers explicitly enable retries,
		* such as GCS.
		*/
		static get RETRY_CONFIG() {
			return {
				retry: true,
				retryConfig: { httpMethodsToRetry: [
					"GET",
					"PUT",
					"POST",
					"HEAD",
					"OPTIONS",
					"DELETE"
				] }
			};
		}
	};
	exports.OAuthClientAuthHandler = OAuthClientAuthHandler;
	/**
	* Converts an OAuth error response to a native JavaScript Error.
	* @param resp The OAuth error response to convert to a native Error object.
	* @param err The optional original error. If provided, the error properties
	*   will be copied to the new error.
	* @return The converted native Error object.
	*/
	function getErrorFromOAuthErrorResponse(resp, err) {
		const errorCode = resp.error;
		const errorDescription = resp.error_description;
		const errorUri = resp.error_uri;
		let message = `Error code ${errorCode}`;
		if (typeof errorDescription !== "undefined") message += `: ${errorDescription}`;
		if (typeof errorUri !== "undefined") message += ` - ${errorUri}`;
		const newError = new Error(message);
		if (err) {
			const keys = Object.keys(err);
			if (err.stack) keys.push("stack");
			keys.forEach((key) => {
				if (key !== "message") Object.defineProperty(newError, key, {
					value: err[key],
					writable: false,
					enumerable: true
				});
			});
		}
		return newError;
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/stscredentials.js
var require_stscredentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.StsCredentials = void 0;
	var gaxios_1 = require_src$7();
	var querystring$1 = __require("querystring");
	var transporters_1 = require_transporters();
	var oauth2common_1 = require_oauth2common();
	exports.StsCredentials = class StsCredentials extends oauth2common_1.OAuthClientAuthHandler {
		/**
		* Initializes an STS credentials instance.
		* @param tokenExchangeEndpoint The token exchange endpoint.
		* @param clientAuthentication The client authentication credentials if
		*   available.
		*/
		constructor(tokenExchangeEndpoint, clientAuthentication) {
			super(clientAuthentication);
			this.tokenExchangeEndpoint = tokenExchangeEndpoint;
			this.transporter = new transporters_1.DefaultTransporter();
		}
		/**
		* Exchanges the provided token for another type of token based on the
		* rfc8693 spec.
		* @param stsCredentialsOptions The token exchange options used to populate
		*   the token exchange request.
		* @param additionalHeaders Optional additional headers to pass along the
		*   request.
		* @param options Optional additional GCP-specific non-spec defined options
		*   to send with the request.
		*   Example: `&options=${encodeUriComponent(JSON.stringified(options))}`
		* @return A promise that resolves with the token exchange response containing
		*   the requested token and its expiration time.
		*/
		async exchangeToken(stsCredentialsOptions, additionalHeaders, options) {
			var _a, _b, _c;
			const values = {
				grant_type: stsCredentialsOptions.grantType,
				resource: stsCredentialsOptions.resource,
				audience: stsCredentialsOptions.audience,
				scope: (_a = stsCredentialsOptions.scope) === null || _a === void 0 ? void 0 : _a.join(" "),
				requested_token_type: stsCredentialsOptions.requestedTokenType,
				subject_token: stsCredentialsOptions.subjectToken,
				subject_token_type: stsCredentialsOptions.subjectTokenType,
				actor_token: (_b = stsCredentialsOptions.actingParty) === null || _b === void 0 ? void 0 : _b.actorToken,
				actor_token_type: (_c = stsCredentialsOptions.actingParty) === null || _c === void 0 ? void 0 : _c.actorTokenType,
				options: options && JSON.stringify(options)
			};
			Object.keys(values).forEach((key) => {
				if (typeof values[key] === "undefined") delete values[key];
			});
			const headers = { "Content-Type": "application/x-www-form-urlencoded" };
			Object.assign(headers, additionalHeaders || {});
			const opts = {
				...StsCredentials.RETRY_CONFIG,
				url: this.tokenExchangeEndpoint.toString(),
				method: "POST",
				headers,
				data: querystring$1.stringify(values),
				responseType: "json"
			};
			this.applyClientAuthenticationOptions(opts);
			try {
				const response = await this.transporter.request(opts);
				const stsSuccessfulResponse = response.data;
				stsSuccessfulResponse.res = response;
				return stsSuccessfulResponse;
			} catch (error) {
				if (error instanceof gaxios_1.GaxiosError && error.response) throw (0, oauth2common_1.getErrorFromOAuthErrorResponse)(error.response.data, error);
				throw error;
			}
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/baseexternalclient.js
var require_baseexternalclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var _BaseExternalAccountClient_instances, _BaseExternalAccountClient_pendingAccessToken, _BaseExternalAccountClient_internalRefreshAccessTokenAsync;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BaseExternalAccountClient = exports.DEFAULT_UNIVERSE = exports.CLOUD_RESOURCE_MANAGER = exports.EXTERNAL_ACCOUNT_TYPE = exports.EXPIRATION_TIME_OFFSET = void 0;
	var stream$2 = __require("stream");
	var authclient_1 = require_authclient();
	var sts = require_stscredentials();
	var util_1 = require_util$2();
	/**
	* The required token exchange grant_type: rfc8693#section-2.1
	*/
	var STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
	/**
	* The requested token exchange requested_token_type: rfc8693#section-2.1
	*/
	var STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
	/** The default OAuth scope to request when none is provided. */
	var DEFAULT_OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
	/** Default impersonated token lifespan in seconds.*/
	var DEFAULT_TOKEN_LIFESPAN = 3600;
	/**
	* Offset to take into account network delays and server clock skews.
	*/
	exports.EXPIRATION_TIME_OFFSET = 300 * 1e3;
	/**
	* The credentials JSON file type for external account clients.
	* There are 3 types of JSON configs:
	* 1. authorized_user => Google end user credential
	* 2. service_account => Google service account credential
	* 3. external_Account => non-GCP service (eg. AWS, Azure, K8s)
	*/
	exports.EXTERNAL_ACCOUNT_TYPE = "external_account";
	/**
	* Cloud resource manager URL used to retrieve project information.
	*
	* @deprecated use {@link BaseExternalAccountClient.cloudResourceManagerURL} instead
	**/
	exports.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
	/** The workforce audience pattern. */
	var WORKFORCE_AUDIENCE_PATTERN = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+";
	var DEFAULT_TOKEN_URL = "https://sts.{universeDomain}/v1/token";
	var pkg = (init_package$1(), __toCommonJS(package_exports$1).default);
	/**
	* For backwards compatibility.
	*/
	var authclient_2 = require_authclient();
	Object.defineProperty(exports, "DEFAULT_UNIVERSE", {
		enumerable: true,
		get: function() {
			return authclient_2.DEFAULT_UNIVERSE;
		}
	});
	exports.BaseExternalAccountClient = class BaseExternalAccountClient extends authclient_1.AuthClient {
		/**
		* Instantiate a BaseExternalAccountClient instance using the provided JSON
		* object loaded from an external account credentials file.
		* @param options The external account options object typically loaded
		*   from the external account JSON credential file. The camelCased options
		*   are aliases for the snake_cased options.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		*/
		constructor(options, additionalOptions) {
			var _a;
			super({
				...options,
				...additionalOptions
			});
			_BaseExternalAccountClient_instances.add(this);
			/**
			* A pending access token request. Used for concurrent calls.
			*/
			_BaseExternalAccountClient_pendingAccessToken.set(this, null);
			const opts = (0, util_1.originalOrCamelOptions)(options);
			const type = opts.get("type");
			if (type && type !== exports.EXTERNAL_ACCOUNT_TYPE) throw new Error(`Expected "${exports.EXTERNAL_ACCOUNT_TYPE}" type but received "${options.type}"`);
			const clientId = opts.get("client_id");
			const clientSecret = opts.get("client_secret");
			const tokenUrl = (_a = opts.get("token_url")) !== null && _a !== void 0 ? _a : DEFAULT_TOKEN_URL.replace("{universeDomain}", this.universeDomain);
			const subjectTokenType = opts.get("subject_token_type");
			const workforcePoolUserProject = opts.get("workforce_pool_user_project");
			const serviceAccountImpersonationUrl = opts.get("service_account_impersonation_url");
			const serviceAccountImpersonation = opts.get("service_account_impersonation");
			const serviceAccountImpersonationLifetime = (0, util_1.originalOrCamelOptions)(serviceAccountImpersonation).get("token_lifetime_seconds");
			this.cloudResourceManagerURL = new URL(opts.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`);
			if (clientId) this.clientAuth = {
				confidentialClientType: "basic",
				clientId,
				clientSecret
			};
			this.stsCredential = new sts.StsCredentials(tokenUrl, this.clientAuth);
			this.scopes = opts.get("scopes") || [DEFAULT_OAUTH_SCOPE];
			this.cachedAccessToken = null;
			this.audience = opts.get("audience");
			this.subjectTokenType = subjectTokenType;
			this.workforcePoolUserProject = workforcePoolUserProject;
			const workforceAudiencePattern = new RegExp(WORKFORCE_AUDIENCE_PATTERN);
			if (this.workforcePoolUserProject && !this.audience.match(workforceAudiencePattern)) throw new Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
			this.serviceAccountImpersonationUrl = serviceAccountImpersonationUrl;
			this.serviceAccountImpersonationLifetime = serviceAccountImpersonationLifetime;
			if (this.serviceAccountImpersonationLifetime) this.configLifetimeRequested = true;
			else {
				this.configLifetimeRequested = false;
				this.serviceAccountImpersonationLifetime = DEFAULT_TOKEN_LIFESPAN;
			}
			this.projectNumber = this.getProjectNumber(this.audience);
			this.supplierContext = {
				audience: this.audience,
				subjectTokenType: this.subjectTokenType,
				transporter: this.transporter
			};
		}
		/** The service account email to be impersonated, if available. */
		getServiceAccountEmail() {
			var _a;
			if (this.serviceAccountImpersonationUrl) {
				if (this.serviceAccountImpersonationUrl.length > 256)
 /**
				* Prevents DOS attacks.
				* @see {@link https://github.com/googleapis/google-auth-library-nodejs/security/code-scanning/84}
				**/
				throw new RangeError(`URL is too long: ${this.serviceAccountImpersonationUrl}`);
				const result = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/.exec(this.serviceAccountImpersonationUrl);
				return ((_a = result === null || result === void 0 ? void 0 : result.groups) === null || _a === void 0 ? void 0 : _a.email) || null;
			}
			return null;
		}
		/**
		* Provides a mechanism to inject GCP access tokens directly.
		* When the provided credential expires, a new credential, using the
		* external account options, is retrieved.
		* @param credentials The Credentials object to set on the current client.
		*/
		setCredentials(credentials) {
			super.setCredentials(credentials);
			this.cachedAccessToken = credentials;
		}
		/**
		* @return A promise that resolves with the current GCP access token
		*   response. If the current credential is expired, a new one is retrieved.
		*/
		async getAccessToken() {
			if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) await this.refreshAccessTokenAsync();
			return {
				token: this.cachedAccessToken.access_token,
				res: this.cachedAccessToken.res
			};
		}
		/**
		* The main authentication interface. It takes an optional url which when
		* present is the endpoint being accessed, and returns a Promise which
		* resolves with authorization header fields.
		*
		* The result has the form:
		* { Authorization: 'Bearer <access_token_value>' }
		*/
		async getRequestHeaders() {
			const headers = { Authorization: `Bearer ${(await this.getAccessToken()).token}` };
			return this.addSharedMetadataHeaders(headers);
		}
		request(opts, callback) {
			if (callback) this.requestAsync(opts).then((r) => callback(null, r), (e) => {
				return callback(e, e.response);
			});
			else return this.requestAsync(opts);
		}
		/**
		* @return A promise that resolves with the project ID corresponding to the
		*   current workload identity pool or current workforce pool if
		*   determinable. For workforce pool credential, it returns the project ID
		*   corresponding to the workforcePoolUserProject.
		*   This is introduced to match the current pattern of using the Auth
		*   library:
		*   const projectId = await auth.getProjectId();
		*   const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
		*   const res = await client.request({ url });
		*   The resource may not have permission
		*   (resourcemanager.projects.get) to call this API or the required
		*   scopes may not be selected:
		*   https://cloud.google.com/resource-manager/reference/rest/v1/projects/get#authorization-scopes
		*/
		async getProjectId() {
			const projectNumber = this.projectNumber || this.workforcePoolUserProject;
			if (this.projectId) return this.projectId;
			else if (projectNumber) {
				const headers = await this.getRequestHeaders();
				const response = await this.transporter.request({
					...BaseExternalAccountClient.RETRY_CONFIG,
					headers,
					url: `${this.cloudResourceManagerURL.toString()}${projectNumber}`,
					responseType: "json"
				});
				this.projectId = response.data.projectId;
				return this.projectId;
			}
			return null;
		}
		/**
		* Authenticates the provided HTTP request, processes it and resolves with the
		* returned response.
		* @param opts The HTTP request options.
		* @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure.
		* @return A promise that resolves with the successful response.
		*/
		async requestAsync(opts, reAuthRetried = false) {
			let response;
			try {
				const requestHeaders = await this.getRequestHeaders();
				opts.headers = opts.headers || {};
				if (requestHeaders && requestHeaders["x-goog-user-project"]) opts.headers["x-goog-user-project"] = requestHeaders["x-goog-user-project"];
				if (requestHeaders && requestHeaders.Authorization) opts.headers.Authorization = requestHeaders.Authorization;
				response = await this.transporter.request(opts);
			} catch (e) {
				const res = e.response;
				if (res) {
					const statusCode = res.status;
					const isReadableStream = res.config.data instanceof stream$2.Readable;
					if (!reAuthRetried && (statusCode === 401 || statusCode === 403) && !isReadableStream && this.forceRefreshOnFailure) {
						await this.refreshAccessTokenAsync();
						return await this.requestAsync(opts, true);
					}
				}
				throw e;
			}
			return response;
		}
		/**
		* Forces token refresh, even if unexpired tokens are currently cached.
		* External credentials are exchanged for GCP access tokens via the token
		* exchange endpoint and other settings provided in the client options
		* object.
		* If the service_account_impersonation_url is provided, an additional
		* step to exchange the external account GCP access token for a service
		* account impersonated token is performed.
		* @return A promise that resolves with the fresh GCP access tokens.
		*/
		async refreshAccessTokenAsync() {
			__classPrivateFieldSet(this, _BaseExternalAccountClient_pendingAccessToken, __classPrivateFieldGet(this, _BaseExternalAccountClient_pendingAccessToken, "f") || __classPrivateFieldGet(this, _BaseExternalAccountClient_instances, "m", _BaseExternalAccountClient_internalRefreshAccessTokenAsync).call(this), "f");
			try {
				return await __classPrivateFieldGet(this, _BaseExternalAccountClient_pendingAccessToken, "f");
			} finally {
				__classPrivateFieldSet(this, _BaseExternalAccountClient_pendingAccessToken, null, "f");
			}
		}
		/**
		* Returns the workload identity pool project number if it is determinable
		* from the audience resource name.
		* @param audience The STS audience used to determine the project number.
		* @return The project number associated with the workload identity pool, if
		*   this can be determined from the STS audience field. Otherwise, null is
		*   returned.
		*/
		getProjectNumber(audience) {
			const match = audience.match(/\/projects\/([^/]+)/);
			if (!match) return null;
			return match[1];
		}
		/**
		* Exchanges an external account GCP access token for a service
		* account impersonated access token using iamcredentials
		* GenerateAccessToken API.
		* @param token The access token to exchange for a service account access
		*   token.
		* @return A promise that resolves with the service account impersonated
		*   credentials response.
		*/
		async getImpersonatedAccessToken(token) {
			const opts = {
				...BaseExternalAccountClient.RETRY_CONFIG,
				url: this.serviceAccountImpersonationUrl,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				data: {
					scope: this.getScopesArray(),
					lifetime: this.serviceAccountImpersonationLifetime + "s"
				},
				responseType: "json"
			};
			const response = await this.transporter.request(opts);
			const successResponse = response.data;
			return {
				access_token: successResponse.accessToken,
				expiry_date: new Date(successResponse.expireTime).getTime(),
				res: response
			};
		}
		/**
		* Returns whether the provided credentials are expired or not.
		* If there is no expiry time, assumes the token is not expired or expiring.
		* @param accessToken The credentials to check for expiration.
		* @return Whether the credentials are expired or not.
		*/
		isExpired(accessToken) {
			const now = (/* @__PURE__ */ new Date()).getTime();
			return accessToken.expiry_date ? now >= accessToken.expiry_date - this.eagerRefreshThresholdMillis : false;
		}
		/**
		* @return The list of scopes for the requested GCP access token.
		*/
		getScopesArray() {
			if (typeof this.scopes === "string") return [this.scopes];
			return this.scopes || [DEFAULT_OAUTH_SCOPE];
		}
		getMetricsHeaderValue() {
			const nodeVersion = process.version.replace(/^v/, "");
			const saImpersonation = this.serviceAccountImpersonationUrl !== void 0;
			const credentialSourceType = this.credentialSourceType ? this.credentialSourceType : "unknown";
			return `gl-node/${nodeVersion} auth/${pkg.version} google-byoid-sdk source/${credentialSourceType} sa-impersonation/${saImpersonation} config-lifetime/${this.configLifetimeRequested}`;
		}
	};
	_BaseExternalAccountClient_pendingAccessToken = /* @__PURE__ */ new WeakMap(), _BaseExternalAccountClient_instances = /* @__PURE__ */ new WeakSet(), _BaseExternalAccountClient_internalRefreshAccessTokenAsync = async function _BaseExternalAccountClient_internalRefreshAccessTokenAsync() {
		const subjectToken = await this.retrieveSubjectToken();
		const stsCredentialsOptions = {
			grantType: STS_GRANT_TYPE,
			audience: this.audience,
			requestedTokenType: STS_REQUEST_TOKEN_TYPE,
			subjectToken,
			subjectTokenType: this.subjectTokenType,
			scope: this.serviceAccountImpersonationUrl ? [DEFAULT_OAUTH_SCOPE] : this.getScopesArray()
		};
		const additionalOptions = !this.clientAuth && this.workforcePoolUserProject ? { userProject: this.workforcePoolUserProject } : void 0;
		const additionalHeaders = { "x-goog-api-client": this.getMetricsHeaderValue() };
		const stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, additionalHeaders, additionalOptions);
		if (this.serviceAccountImpersonationUrl) this.cachedAccessToken = await this.getImpersonatedAccessToken(stsResponse.access_token);
		else if (stsResponse.expires_in) this.cachedAccessToken = {
			access_token: stsResponse.access_token,
			expiry_date: (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1e3,
			res: stsResponse.res
		};
		else this.cachedAccessToken = {
			access_token: stsResponse.access_token,
			res: stsResponse.res
		};
		this.credentials = {};
		Object.assign(this.credentials, this.cachedAccessToken);
		delete this.credentials.res;
		this.emit("tokens", {
			refresh_token: null,
			expiry_date: this.cachedAccessToken.expiry_date,
			access_token: this.cachedAccessToken.access_token,
			token_type: "Bearer",
			id_token: null
		});
		return this.cachedAccessToken;
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/filesubjecttokensupplier.js
var require_filesubjecttokensupplier = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _a, _b, _c;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FileSubjectTokenSupplier = void 0;
	var util_1$1 = __require("util");
	var fs$4 = __require("fs");
	var readFile = (0, util_1$1.promisify)((_a = fs$4.readFile) !== null && _a !== void 0 ? _a : (() => {}));
	var realpath = (0, util_1$1.promisify)((_b = fs$4.realpath) !== null && _b !== void 0 ? _b : (() => {}));
	var lstat = (0, util_1$1.promisify)((_c = fs$4.lstat) !== null && _c !== void 0 ? _c : (() => {}));
	/**
	* Internal subject token supplier implementation used when a file location
	* is configured in the credential configuration used to build an {@link IdentityPoolClient}
	*/
	var FileSubjectTokenSupplier = class {
		/**
		* Instantiates a new file based subject token supplier.
		* @param opts The file subject token supplier options to build the supplier
		*   with.
		*/
		constructor(opts) {
			this.filePath = opts.filePath;
			this.formatType = opts.formatType;
			this.subjectTokenFieldName = opts.subjectTokenFieldName;
		}
		/**
		* Returns the subject token stored at the file specified in the constructor.
		* @param context {@link ExternalAccountSupplierContext} from the calling
		*   {@link IdentityPoolClient}, contains the requested audience and subject
		*   token type for the external account identity. Not used.
		*/
		async getSubjectToken(context) {
			let parsedFilePath = this.filePath;
			try {
				parsedFilePath = await realpath(parsedFilePath);
				if (!(await lstat(parsedFilePath)).isFile()) throw new Error();
			} catch (err) {
				if (err instanceof Error) err.message = `The file at ${parsedFilePath} does not exist, or it is not a file. ${err.message}`;
				throw err;
			}
			let subjectToken;
			const rawText = await readFile(parsedFilePath, { encoding: "utf8" });
			if (this.formatType === "text") subjectToken = rawText;
			else if (this.formatType === "json" && this.subjectTokenFieldName) subjectToken = JSON.parse(rawText)[this.subjectTokenFieldName];
			if (!subjectToken) throw new Error("Unable to parse the subject_token from the credential_source file");
			return subjectToken;
		}
	};
	exports.FileSubjectTokenSupplier = FileSubjectTokenSupplier;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/urlsubjecttokensupplier.js
var require_urlsubjecttokensupplier = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UrlSubjectTokenSupplier = void 0;
	/**
	* Internal subject token supplier implementation used when a URL
	* is configured in the credential configuration used to build an {@link IdentityPoolClient}
	*/
	var UrlSubjectTokenSupplier = class {
		/**
		* Instantiates a URL subject token supplier.
		* @param opts The URL subject token supplier options to build the supplier with.
		*/
		constructor(opts) {
			this.url = opts.url;
			this.formatType = opts.formatType;
			this.subjectTokenFieldName = opts.subjectTokenFieldName;
			this.headers = opts.headers;
			this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
		}
		/**
		* Sends a GET request to the URL provided in the constructor and resolves
		* with the returned external subject token.
		* @param context {@link ExternalAccountSupplierContext} from the calling
		*   {@link IdentityPoolClient}, contains the requested audience and subject
		*   token type for the external account identity. Not used.
		*/
		async getSubjectToken(context) {
			const opts = {
				...this.additionalGaxiosOptions,
				url: this.url,
				method: "GET",
				headers: this.headers,
				responseType: this.formatType
			};
			let subjectToken;
			if (this.formatType === "text") subjectToken = (await context.transporter.request(opts)).data;
			else if (this.formatType === "json" && this.subjectTokenFieldName) subjectToken = (await context.transporter.request(opts)).data[this.subjectTokenFieldName];
			if (!subjectToken) throw new Error("Unable to parse the subject_token from the credential_source URL");
			return subjectToken;
		}
	};
	exports.UrlSubjectTokenSupplier = UrlSubjectTokenSupplier;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/identitypoolclient.js
var require_identitypoolclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IdentityPoolClient = void 0;
	var baseexternalclient_1 = require_baseexternalclient();
	var util_1 = require_util$2();
	var filesubjecttokensupplier_1 = require_filesubjecttokensupplier();
	var urlsubjecttokensupplier_1 = require_urlsubjecttokensupplier();
	exports.IdentityPoolClient = class IdentityPoolClient extends baseexternalclient_1.BaseExternalAccountClient {
		/**
		* Instantiate an IdentityPoolClient instance using the provided JSON
		* object loaded from an external account credentials file.
		* An error is thrown if the credential is not a valid file-sourced or
		* url-sourced credential or a workforce pool user project is provided
		* with a non workforce audience.
		* @param options The external account options object typically loaded
		*   from the external account JSON credential file. The camelCased options
		*   are aliases for the snake_cased options.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		*/
		constructor(options, additionalOptions) {
			super(options, additionalOptions);
			const opts = (0, util_1.originalOrCamelOptions)(options);
			const credentialSource = opts.get("credential_source");
			const subjectTokenSupplier = opts.get("subject_token_supplier");
			if (!credentialSource && !subjectTokenSupplier) throw new Error("A credential source or subject token supplier must be specified.");
			if (credentialSource && subjectTokenSupplier) throw new Error("Only one of credential source or subject token supplier can be specified.");
			if (subjectTokenSupplier) {
				this.subjectTokenSupplier = subjectTokenSupplier;
				this.credentialSourceType = "programmatic";
			} else {
				const credentialSourceOpts = (0, util_1.originalOrCamelOptions)(credentialSource);
				const formatOpts = (0, util_1.originalOrCamelOptions)(credentialSourceOpts.get("format"));
				const formatType = formatOpts.get("type") || "text";
				const formatSubjectTokenFieldName = formatOpts.get("subject_token_field_name");
				if (formatType !== "json" && formatType !== "text") throw new Error(`Invalid credential_source format "${formatType}"`);
				if (formatType === "json" && !formatSubjectTokenFieldName) throw new Error("Missing subject_token_field_name for JSON credential_source format");
				const file = credentialSourceOpts.get("file");
				const url = credentialSourceOpts.get("url");
				const headers = credentialSourceOpts.get("headers");
				if (file && url) throw new Error("No valid Identity Pool \"credential_source\" provided, must be either file or url.");
				else if (file && !url) {
					this.credentialSourceType = "file";
					this.subjectTokenSupplier = new filesubjecttokensupplier_1.FileSubjectTokenSupplier({
						filePath: file,
						formatType,
						subjectTokenFieldName: formatSubjectTokenFieldName
					});
				} else if (!file && url) {
					this.credentialSourceType = "url";
					this.subjectTokenSupplier = new urlsubjecttokensupplier_1.UrlSubjectTokenSupplier({
						url,
						formatType,
						subjectTokenFieldName: formatSubjectTokenFieldName,
						headers,
						additionalGaxiosOptions: IdentityPoolClient.RETRY_CONFIG
					});
				} else throw new Error("No valid Identity Pool \"credential_source\" provided, must be either file or url.");
			}
		}
		/**
		* Triggered when a external subject token is needed to be exchanged for a GCP
		* access token via GCP STS endpoint. Gets a subject token by calling
		* the configured {@link SubjectTokenSupplier}
		* @return A promise that resolves with the external subject token.
		*/
		async retrieveSubjectToken() {
			return this.subjectTokenSupplier.getSubjectToken(this.supplierContext);
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/awsrequestsigner.js
var require_awsrequestsigner = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AwsRequestSigner = void 0;
	var crypto_1 = require_crypto();
	/** AWS Signature Version 4 signing algorithm identifier.  */
	var AWS_ALGORITHM = "AWS4-HMAC-SHA256";
	/**
	* The termination string for the AWS credential scope value as defined in
	* https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
	*/
	var AWS_REQUEST_TYPE = "aws4_request";
	/**
	* Implements an AWS API request signer based on the AWS Signature Version 4
	* signing process.
	* https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
	*/
	var AwsRequestSigner = class {
		/**
		* Instantiates an AWS API request signer used to send authenticated signed
		* requests to AWS APIs based on the AWS Signature Version 4 signing process.
		* This also provides a mechanism to generate the signed request without
		* sending it.
		* @param getCredentials A mechanism to retrieve AWS security credentials
		*   when needed.
		* @param region The AWS region to use.
		*/
		constructor(getCredentials, region) {
			this.getCredentials = getCredentials;
			this.region = region;
			this.crypto = (0, crypto_1.createCrypto)();
		}
		/**
		* Generates the signed request for the provided HTTP request for calling
		* an AWS API. This follows the steps described at:
		* https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
		* @param amzOptions The AWS request options that need to be signed.
		* @return A promise that resolves with the GaxiosOptions containing the
		*   signed HTTP request parameters.
		*/
		async getRequestOptions(amzOptions) {
			if (!amzOptions.url) throw new Error("\"url\" is required in \"amzOptions\"");
			const requestPayloadData = typeof amzOptions.data === "object" ? JSON.stringify(amzOptions.data) : amzOptions.data;
			const url = amzOptions.url;
			const method = amzOptions.method || "GET";
			const requestPayload = amzOptions.body || requestPayloadData;
			const additionalAmzHeaders = amzOptions.headers;
			const awsSecurityCredentials = await this.getCredentials();
			const uri = new URL(url);
			const headerMap = await generateAuthenticationHeaderMap({
				crypto: this.crypto,
				host: uri.host,
				canonicalUri: uri.pathname,
				canonicalQuerystring: uri.search.substr(1),
				method,
				region: this.region,
				securityCredentials: awsSecurityCredentials,
				requestPayload,
				additionalAmzHeaders
			});
			const headers = Object.assign(headerMap.amzDate ? { "x-amz-date": headerMap.amzDate } : {}, {
				Authorization: headerMap.authorizationHeader,
				host: uri.host
			}, additionalAmzHeaders || {});
			if (awsSecurityCredentials.token) Object.assign(headers, { "x-amz-security-token": awsSecurityCredentials.token });
			const awsSignedReq = {
				url,
				method,
				headers
			};
			if (typeof requestPayload !== "undefined") awsSignedReq.body = requestPayload;
			return awsSignedReq;
		}
	};
	exports.AwsRequestSigner = AwsRequestSigner;
	/**
	* Creates the HMAC-SHA256 hash of the provided message using the
	* provided key.
	*
	* @param crypto The crypto instance used to facilitate cryptographic
	*   operations.
	* @param key The HMAC-SHA256 key to use.
	* @param msg The message to hash.
	* @return The computed hash bytes.
	*/
	async function sign(crypto, key, msg) {
		return await crypto.signWithHmacSha256(key, msg);
	}
	/**
	* Calculates the signing key used to calculate the signature for
	* AWS Signature Version 4 based on:
	* https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
	*
	* @param crypto The crypto instance used to facilitate cryptographic
	*   operations.
	* @param key The AWS secret access key.
	* @param dateStamp The '%Y%m%d' date format.
	* @param region The AWS region.
	* @param serviceName The AWS service name, eg. sts.
	* @return The signing key bytes.
	*/
	async function getSigningKey(crypto, key, dateStamp, region, serviceName) {
		return await sign(crypto, await sign(crypto, await sign(crypto, await sign(crypto, `AWS4${key}`, dateStamp), region), serviceName), "aws4_request");
	}
	/**
	* Generates the authentication header map needed for generating the AWS
	* Signature Version 4 signed request.
	*
	* @param option The options needed to compute the authentication header map.
	* @return The AWS authentication header map which constitutes of the following
	*   components: amz-date, authorization header and canonical query string.
	*/
	async function generateAuthenticationHeaderMap(options) {
		const additionalAmzHeaders = options.additionalAmzHeaders || {};
		const requestPayload = options.requestPayload || "";
		const serviceName = options.host.split(".")[0];
		const now = /* @__PURE__ */ new Date();
		const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, "");
		const dateStamp = now.toISOString().replace(/[-]/g, "").replace(/T.*/, "");
		const reformattedAdditionalAmzHeaders = {};
		Object.keys(additionalAmzHeaders).forEach((key) => {
			reformattedAdditionalAmzHeaders[key.toLowerCase()] = additionalAmzHeaders[key];
		});
		if (options.securityCredentials.token) reformattedAdditionalAmzHeaders["x-amz-security-token"] = options.securityCredentials.token;
		const amzHeaders = Object.assign({ host: options.host }, reformattedAdditionalAmzHeaders.date ? {} : { "x-amz-date": amzDate }, reformattedAdditionalAmzHeaders);
		let canonicalHeaders = "";
		const signedHeadersList = Object.keys(amzHeaders).sort();
		signedHeadersList.forEach((key) => {
			canonicalHeaders += `${key}:${amzHeaders[key]}\n`;
		});
		const signedHeaders = signedHeadersList.join(";");
		const payloadHash = await options.crypto.sha256DigestHex(requestPayload);
		const canonicalRequest = `${options.method}\n${options.canonicalUri}\n${options.canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
		const credentialScope = `${dateStamp}/${options.region}/${serviceName}/${AWS_REQUEST_TYPE}`;
		const stringToSign = `${AWS_ALGORITHM}\n${amzDate}\n${credentialScope}\n` + await options.crypto.sha256DigestHex(canonicalRequest);
		const signingKey = await getSigningKey(options.crypto, options.securityCredentials.secretAccessKey, dateStamp, options.region, serviceName);
		const signature = await sign(options.crypto, signingKey, stringToSign);
		const authorizationHeader = `${AWS_ALGORITHM} Credential=${options.securityCredentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${(0, crypto_1.fromArrayBufferToHex)(signature)}`;
		return {
			amzDate: reformattedAdditionalAmzHeaders.date ? void 0 : amzDate,
			authorizationHeader,
			canonicalQuerystring: options.canonicalQuerystring
		};
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/defaultawssecuritycredentialssupplier.js
var require_defaultawssecuritycredentialssupplier = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _DefaultAwsSecurityCredentialsSupplier_instances, _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken, _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName, _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials, _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get, _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DefaultAwsSecurityCredentialsSupplier = void 0;
	/**
	* Internal AWS security credentials supplier implementation used by {@link AwsClient}
	* when a credential source is provided instead of a user defined supplier.
	* The logic is summarized as:
	* 1. If imdsv2_session_token_url is provided in the credential source, then
	*    fetch the aws session token and include it in the headers of the
	*    metadata requests. This is a requirement for IDMSv2 but optional
	*    for IDMSv1.
	* 2. Retrieve AWS region from availability-zone.
	* 3a. Check AWS credentials in environment variables. If not found, get
	*     from security-credentials endpoint.
	* 3b. Get AWS credentials from security-credentials endpoint. In order
	*     to retrieve this, the AWS role needs to be determined by calling
	*     security-credentials endpoint without any argument. Then the
	*     credentials can be retrieved via: security-credentials/role_name
	* 4. Generate the signed request to AWS STS GetCallerIdentity action.
	* 5. Inject x-goog-cloud-target-resource into header and serialize the
	*    signed request. This will be the subject-token to pass to GCP STS.
	*/
	var DefaultAwsSecurityCredentialsSupplier = class {
		/**
		* Instantiates a new DefaultAwsSecurityCredentialsSupplier using information
		* from the credential_source stored in the ADC file.
		* @param opts The default aws security credentials supplier options object to
		*   build the supplier with.
		*/
		constructor(opts) {
			_DefaultAwsSecurityCredentialsSupplier_instances.add(this);
			this.regionUrl = opts.regionUrl;
			this.securityCredentialsUrl = opts.securityCredentialsUrl;
			this.imdsV2SessionTokenUrl = opts.imdsV2SessionTokenUrl;
			this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
		}
		/**
		* Returns the active AWS region. This first checks to see if the region
		* is available as an environment variable. If it is not, then the supplier
		* will call the region URL.
		* @param context {@link ExternalAccountSupplierContext} from the calling
		*   {@link AwsClient}, contains the requested audience and subject token type
		*   for the external account identity.
		* @return A promise that resolves with the AWS region string.
		*/
		async getAwsRegion(context) {
			if (__classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get)) return __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get);
			const metadataHeaders = {};
			if (!__classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get) && this.imdsV2SessionTokenUrl) metadataHeaders["x-aws-ec2-metadata-token"] = await __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken).call(this, context.transporter);
			if (!this.regionUrl) throw new Error("Unable to determine AWS region due to missing \"options.credential_source.region_url\"");
			const opts = {
				...this.additionalGaxiosOptions,
				url: this.regionUrl,
				method: "GET",
				responseType: "text",
				headers: metadataHeaders
			};
			const response = await context.transporter.request(opts);
			return response.data.substr(0, response.data.length - 1);
		}
		/**
		* Returns AWS security credentials. This first checks to see if the credentials
		* is available as environment variables. If it is not, then the supplier
		* will call the security credentials URL.
		* @param context {@link ExternalAccountSupplierContext} from the calling
		*   {@link AwsClient}, contains the requested audience and subject token type
		*   for the external account identity.
		* @return A promise that resolves with the AWS security credentials.
		*/
		async getAwsSecurityCredentials(context) {
			if (__classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get)) return __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get);
			const metadataHeaders = {};
			if (this.imdsV2SessionTokenUrl) metadataHeaders["x-aws-ec2-metadata-token"] = await __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken).call(this, context.transporter);
			const roleName = await __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName).call(this, metadataHeaders, context.transporter);
			const awsCreds = await __classPrivateFieldGet(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials).call(this, roleName, metadataHeaders, context.transporter);
			return {
				accessKeyId: awsCreds.AccessKeyId,
				secretAccessKey: awsCreds.SecretAccessKey,
				token: awsCreds.Token
			};
		}
	};
	exports.DefaultAwsSecurityCredentialsSupplier = DefaultAwsSecurityCredentialsSupplier;
	_DefaultAwsSecurityCredentialsSupplier_instances = /* @__PURE__ */ new WeakSet(), _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken = async function _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken(transporter) {
		const opts = {
			...this.additionalGaxiosOptions,
			url: this.imdsV2SessionTokenUrl,
			method: "PUT",
			responseType: "text",
			headers: { "x-aws-ec2-metadata-token-ttl-seconds": "300" }
		};
		return (await transporter.request(opts)).data;
	}, _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName = async function _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName(headers, transporter) {
		if (!this.securityCredentialsUrl) throw new Error("Unable to determine AWS role name due to missing \"options.credential_source.url\"");
		const opts = {
			...this.additionalGaxiosOptions,
			url: this.securityCredentialsUrl,
			method: "GET",
			responseType: "text",
			headers
		};
		return (await transporter.request(opts)).data;
	}, _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials = async function _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials(roleName, headers, transporter) {
		return (await transporter.request({
			...this.additionalGaxiosOptions,
			url: `${this.securityCredentialsUrl}/${roleName}`,
			responseType: "json",
			headers
		})).data;
	}, _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get = function _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get() {
		return process.env["AWS_REGION"] || process.env["AWS_DEFAULT_REGION"] || null;
	}, _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get = function _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get() {
		if (process.env["AWS_ACCESS_KEY_ID"] && process.env["AWS_SECRET_ACCESS_KEY"]) return {
			accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
			secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
			token: process.env["AWS_SESSION_TOKEN"]
		};
		return null;
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/awsclient.js
var require_awsclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _a, _AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AwsClient = void 0;
	var awsrequestsigner_1 = require_awsrequestsigner();
	var baseexternalclient_1 = require_baseexternalclient();
	var defaultawssecuritycredentialssupplier_1 = require_defaultawssecuritycredentialssupplier();
	var util_1 = require_util$2();
	/**
	* AWS external account client. This is used for AWS workloads, where
	* AWS STS GetCallerIdentity serialized signed requests are exchanged for
	* GCP access token.
	*/
	var AwsClient = class extends baseexternalclient_1.BaseExternalAccountClient {
		/**
		* Instantiates an AwsClient instance using the provided JSON
		* object loaded from an external account credentials file.
		* An error is thrown if the credential is not a valid AWS credential.
		* @param options The external account options object typically loaded
		*   from the external account JSON credential file.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		*/
		constructor(options, additionalOptions) {
			super(options, additionalOptions);
			const opts = (0, util_1.originalOrCamelOptions)(options);
			const credentialSource = opts.get("credential_source");
			const awsSecurityCredentialsSupplier = opts.get("aws_security_credentials_supplier");
			if (!credentialSource && !awsSecurityCredentialsSupplier) throw new Error("A credential source or AWS security credentials supplier must be specified.");
			if (credentialSource && awsSecurityCredentialsSupplier) throw new Error("Only one of credential source or AWS security credentials supplier can be specified.");
			if (awsSecurityCredentialsSupplier) {
				this.awsSecurityCredentialsSupplier = awsSecurityCredentialsSupplier;
				this.regionalCredVerificationUrl = __classPrivateFieldGet(_a, _a, "f", _AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL);
				this.credentialSourceType = "programmatic";
			} else {
				const credentialSourceOpts = (0, util_1.originalOrCamelOptions)(credentialSource);
				this.environmentId = credentialSourceOpts.get("environment_id");
				const regionUrl = credentialSourceOpts.get("region_url");
				const securityCredentialsUrl = credentialSourceOpts.get("url");
				const imdsV2SessionTokenUrl = credentialSourceOpts.get("imdsv2_session_token_url");
				this.awsSecurityCredentialsSupplier = new defaultawssecuritycredentialssupplier_1.DefaultAwsSecurityCredentialsSupplier({
					regionUrl,
					securityCredentialsUrl,
					imdsV2SessionTokenUrl
				});
				this.regionalCredVerificationUrl = credentialSourceOpts.get("regional_cred_verification_url");
				this.credentialSourceType = "aws";
				this.validateEnvironmentId();
			}
			this.awsRequestSigner = null;
			this.region = "";
		}
		validateEnvironmentId() {
			var _b;
			const match = (_b = this.environmentId) === null || _b === void 0 ? void 0 : _b.match(/^(aws)(\d+)$/);
			if (!match || !this.regionalCredVerificationUrl) throw new Error("No valid AWS \"credential_source\" provided");
			else if (parseInt(match[2], 10) !== 1) throw new Error(`aws version "${match[2]}" is not supported in the current build.`);
		}
		/**
		* Triggered when an external subject token is needed to be exchanged for a
		* GCP access token via GCP STS endpoint. This will call the
		* {@link AwsSecurityCredentialsSupplier} to retrieve an AWS region and AWS
		* Security Credentials, then use them to create a signed AWS STS request that
		* can be exchanged for a GCP access token.
		* @return A promise that resolves with the external subject token.
		*/
		async retrieveSubjectToken() {
			if (!this.awsRequestSigner) {
				this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext);
				this.awsRequestSigner = new awsrequestsigner_1.AwsRequestSigner(async () => {
					return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext);
				}, this.region);
			}
			const options = await this.awsRequestSigner.getRequestOptions({
				..._a.RETRY_CONFIG,
				url: this.regionalCredVerificationUrl.replace("{region}", this.region),
				method: "POST"
			});
			const reformattedHeader = [];
			const extendedHeaders = Object.assign({ "x-goog-cloud-target-resource": this.audience }, options.headers);
			for (const key in extendedHeaders) reformattedHeader.push({
				key,
				value: extendedHeaders[key]
			});
			return encodeURIComponent(JSON.stringify({
				url: options.url,
				method: options.method,
				headers: reformattedHeader
			}));
		}
	};
	exports.AwsClient = AwsClient;
	_a = AwsClient;
	_AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL = { value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15" };
	/**
	* @deprecated AWS client no validates the EC2 metadata address.
	**/
	AwsClient.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
	/**
	* @deprecated AWS client no validates the EC2 metadata address.
	**/
	AwsClient.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254";
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/executable-response.js
var require_executable_response = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InvalidSubjectTokenError = exports.InvalidMessageFieldError = exports.InvalidCodeFieldError = exports.InvalidTokenTypeFieldError = exports.InvalidExpirationTimeFieldError = exports.InvalidSuccessFieldError = exports.InvalidVersionFieldError = exports.ExecutableResponseError = exports.ExecutableResponse = void 0;
	var SAML_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:saml2";
	var OIDC_SUBJECT_TOKEN_TYPE1 = "urn:ietf:params:oauth:token-type:id_token";
	var OIDC_SUBJECT_TOKEN_TYPE2 = "urn:ietf:params:oauth:token-type:jwt";
	/**
	* Defines the response of a 3rd party executable run by the pluggable auth client.
	*/
	var ExecutableResponse = class {
		/**
		* Instantiates an ExecutableResponse instance using the provided JSON object
		* from the output of the executable.
		* @param responseJson Response from a 3rd party executable, loaded from a
		* run of the executable or a cached output file.
		*/
		constructor(responseJson) {
			if (!responseJson.version) throw new InvalidVersionFieldError("Executable response must contain a 'version' field.");
			if (responseJson.success === void 0) throw new InvalidSuccessFieldError("Executable response must contain a 'success' field.");
			this.version = responseJson.version;
			this.success = responseJson.success;
			if (this.success) {
				this.expirationTime = responseJson.expiration_time;
				this.tokenType = responseJson.token_type;
				if (this.tokenType !== SAML_SUBJECT_TOKEN_TYPE && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE1 && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE2) throw new InvalidTokenTypeFieldError(`Executable response must contain a 'token_type' field when successful and it must be one of ${OIDC_SUBJECT_TOKEN_TYPE1}, ${OIDC_SUBJECT_TOKEN_TYPE2}, or ${SAML_SUBJECT_TOKEN_TYPE}.`);
				if (this.tokenType === SAML_SUBJECT_TOKEN_TYPE) {
					if (!responseJson.saml_response) throw new InvalidSubjectTokenError(`Executable response must contain a 'saml_response' field when token_type=${SAML_SUBJECT_TOKEN_TYPE}.`);
					this.subjectToken = responseJson.saml_response;
				} else {
					if (!responseJson.id_token) throw new InvalidSubjectTokenError(`Executable response must contain a 'id_token' field when token_type=${OIDC_SUBJECT_TOKEN_TYPE1} or ${OIDC_SUBJECT_TOKEN_TYPE2}.`);
					this.subjectToken = responseJson.id_token;
				}
			} else {
				if (!responseJson.code) throw new InvalidCodeFieldError("Executable response must contain a 'code' field when unsuccessful.");
				if (!responseJson.message) throw new InvalidMessageFieldError("Executable response must contain a 'message' field when unsuccessful.");
				this.errorCode = responseJson.code;
				this.errorMessage = responseJson.message;
			}
		}
		/**
		* @return A boolean representing if the response has a valid token. Returns
		* true when the response was successful and the token is not expired.
		*/
		isValid() {
			return !this.isExpired() && this.success;
		}
		/**
		* @return A boolean representing if the response is expired. Returns true if the
		* provided timeout has passed.
		*/
		isExpired() {
			return this.expirationTime !== void 0 && this.expirationTime < Math.round(Date.now() / 1e3);
		}
	};
	exports.ExecutableResponse = ExecutableResponse;
	/**
	* An error thrown by the ExecutableResponse class.
	*/
	var ExecutableResponseError = class extends Error {
		constructor(message) {
			super(message);
			Object.setPrototypeOf(this, new.target.prototype);
		}
	};
	exports.ExecutableResponseError = ExecutableResponseError;
	/**
	* An error thrown when the 'version' field in an executable response is missing or invalid.
	*/
	var InvalidVersionFieldError = class extends ExecutableResponseError {};
	exports.InvalidVersionFieldError = InvalidVersionFieldError;
	/**
	* An error thrown when the 'success' field in an executable response is missing or invalid.
	*/
	var InvalidSuccessFieldError = class extends ExecutableResponseError {};
	exports.InvalidSuccessFieldError = InvalidSuccessFieldError;
	/**
	* An error thrown when the 'expiration_time' field in an executable response is missing or invalid.
	*/
	var InvalidExpirationTimeFieldError = class extends ExecutableResponseError {};
	exports.InvalidExpirationTimeFieldError = InvalidExpirationTimeFieldError;
	/**
	* An error thrown when the 'token_type' field in an executable response is missing or invalid.
	*/
	var InvalidTokenTypeFieldError = class extends ExecutableResponseError {};
	exports.InvalidTokenTypeFieldError = InvalidTokenTypeFieldError;
	/**
	* An error thrown when the 'code' field in an executable response is missing or invalid.
	*/
	var InvalidCodeFieldError = class extends ExecutableResponseError {};
	exports.InvalidCodeFieldError = InvalidCodeFieldError;
	/**
	* An error thrown when the 'message' field in an executable response is missing or invalid.
	*/
	var InvalidMessageFieldError = class extends ExecutableResponseError {};
	exports.InvalidMessageFieldError = InvalidMessageFieldError;
	/**
	* An error thrown when the subject token in an executable response is missing or invalid.
	*/
	var InvalidSubjectTokenError = class extends ExecutableResponseError {};
	exports.InvalidSubjectTokenError = InvalidSubjectTokenError;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/pluggable-auth-handler.js
var require_pluggable_auth_handler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PluggableAuthHandler = void 0;
	var pluggable_auth_client_1 = require_pluggable_auth_client();
	var executable_response_1 = require_executable_response();
	var childProcess = __require("child_process");
	var fs$3 = __require("fs");
	exports.PluggableAuthHandler = class PluggableAuthHandler {
		/**
		* Instantiates a PluggableAuthHandler instance using the provided
		* PluggableAuthHandlerOptions object.
		*/
		constructor(options) {
			if (!options.command) throw new Error("No command provided.");
			this.commandComponents = PluggableAuthHandler.parseCommand(options.command);
			this.timeoutMillis = options.timeoutMillis;
			if (!this.timeoutMillis) throw new Error("No timeoutMillis provided.");
			this.outputFile = options.outputFile;
		}
		/**
		* Calls user provided executable to get a 3rd party subject token and
		* returns the response.
		* @param envMap a Map of additional Environment Variables required for
		*   the executable.
		* @return A promise that resolves with the executable response.
		*/
		retrieveResponseFromExecutable(envMap) {
			return new Promise((resolve, reject) => {
				const child = childProcess.spawn(this.commandComponents[0], this.commandComponents.slice(1), { env: {
					...process.env,
					...Object.fromEntries(envMap)
				} });
				let output = "";
				child.stdout.on("data", (data) => {
					output += data;
				});
				child.stderr.on("data", (err) => {
					output += err;
				});
				const timeout = setTimeout(() => {
					child.removeAllListeners();
					child.kill();
					return reject(/* @__PURE__ */ new Error("The executable failed to finish within the timeout specified."));
				}, this.timeoutMillis);
				child.on("close", (code) => {
					clearTimeout(timeout);
					if (code === 0) try {
						const responseJson = JSON.parse(output);
						return resolve(new executable_response_1.ExecutableResponse(responseJson));
					} catch (error) {
						if (error instanceof executable_response_1.ExecutableResponseError) return reject(error);
						return reject(new executable_response_1.ExecutableResponseError(`The executable returned an invalid response: ${output}`));
					}
					else return reject(new pluggable_auth_client_1.ExecutableError(output, code.toString()));
				});
			});
		}
		/**
		* Checks user provided output file for response from previous run of
		* executable and return the response if it exists, is formatted correctly, and is not expired.
		*/
		async retrieveCachedResponse() {
			if (!this.outputFile || this.outputFile.length === 0) return;
			let filePath;
			try {
				filePath = await fs$3.promises.realpath(this.outputFile);
			} catch (_a) {
				return;
			}
			if (!(await fs$3.promises.lstat(filePath)).isFile()) return;
			const responseString = await fs$3.promises.readFile(filePath, { encoding: "utf8" });
			if (responseString === "") return;
			try {
				const responseJson = JSON.parse(responseString);
				if (new executable_response_1.ExecutableResponse(responseJson).isValid()) return new executable_response_1.ExecutableResponse(responseJson);
				return;
			} catch (error) {
				if (error instanceof executable_response_1.ExecutableResponseError) throw error;
				throw new executable_response_1.ExecutableResponseError(`The output file contained an invalid response: ${responseString}`);
			}
		}
		/**
		* Parses given command string into component array, splitting on spaces unless
		* spaces are between quotation marks.
		*/
		static parseCommand(command) {
			const components = command.match(/(?:[^\s"]+|"[^"]*")+/g);
			if (!components) throw new Error(`Provided command: "${command}" could not be parsed.`);
			for (let i = 0; i < components.length; i++) if (components[i][0] === "\"" && components[i].slice(-1) === "\"") components[i] = components[i].slice(1, -1);
			return components;
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/pluggable-auth-client.js
var require_pluggable_auth_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PluggableAuthClient = exports.ExecutableError = void 0;
	var baseexternalclient_1 = require_baseexternalclient();
	var executable_response_1 = require_executable_response();
	var pluggable_auth_handler_1 = require_pluggable_auth_handler();
	/**
	* Error thrown from the executable run by PluggableAuthClient.
	*/
	var ExecutableError = class extends Error {
		constructor(message, code) {
			super(`The executable failed with exit code: ${code} and error message: ${message}.`);
			this.code = code;
			Object.setPrototypeOf(this, new.target.prototype);
		}
	};
	exports.ExecutableError = ExecutableError;
	/**
	* The default executable timeout when none is provided, in milliseconds.
	*/
	var DEFAULT_EXECUTABLE_TIMEOUT_MILLIS = 30 * 1e3;
	/**
	* The minimum allowed executable timeout in milliseconds.
	*/
	var MINIMUM_EXECUTABLE_TIMEOUT_MILLIS = 5 * 1e3;
	/**
	* The maximum allowed executable timeout in milliseconds.
	*/
	var MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS = 120 * 1e3;
	/**
	* The environment variable to check to see if executable can be run.
	* Value must be set to '1' for the executable to run.
	*/
	var GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES";
	/**
	* The maximum currently supported executable version.
	*/
	var MAXIMUM_EXECUTABLE_VERSION = 1;
	/**
	* PluggableAuthClient enables the exchange of workload identity pool external credentials for
	* Google access tokens by retrieving 3rd party tokens through a user supplied executable. These
	* scripts/executables are completely independent of the Google Cloud Auth libraries. These
	* credentials plug into ADC and will call the specified executable to retrieve the 3rd party token
	* to be exchanged for a Google access token.
	*
	* <p>To use these credentials, the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment variable
	* must be set to '1'. This is for security reasons.
	*
	* <p>Both OIDC and SAML are supported. The executable must adhere to a specific response format
	* defined below.
	*
	* <p>The executable must print out the 3rd party token to STDOUT in JSON format. When an
	* output_file is specified in the credential configuration, the executable must also handle writing the
	* JSON response to this file.
	*
	* <pre>
	* OIDC response sample:
	* {
	*   "version": 1,
	*   "success": true,
	*   "token_type": "urn:ietf:params:oauth:token-type:id_token",
	*   "id_token": "HEADER.PAYLOAD.SIGNATURE",
	*   "expiration_time": 1620433341
	* }
	*
	* SAML2 response sample:
	* {
	*   "version": 1,
	*   "success": true,
	*   "token_type": "urn:ietf:params:oauth:token-type:saml2",
	*   "saml_response": "...",
	*   "expiration_time": 1620433341
	* }
	*
	* Error response sample:
	* {
	*   "version": 1,
	*   "success": false,
	*   "code": "401",
	*   "message": "Error message."
	* }
	* </pre>
	*
	* <p>The "expiration_time" field in the JSON response is only required for successful
	* responses when an output file was specified in the credential configuration
	*
	* <p>The auth libraries will populate certain environment variables that will be accessible by the
	* executable, such as: GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE, GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE,
	* GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE, GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL, and
	* GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE.
	*
	* <p>Please see this repositories README for a complete executable request/response specification.
	*/
	var PluggableAuthClient = class extends baseexternalclient_1.BaseExternalAccountClient {
		/**
		* Instantiates a PluggableAuthClient instance using the provided JSON
		* object loaded from an external account credentials file.
		* An error is thrown if the credential is not a valid pluggable auth credential.
		* @param options The external account options object typically loaded from
		*   the external account JSON credential file.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		*/
		constructor(options, additionalOptions) {
			super(options, additionalOptions);
			if (!options.credential_source.executable) throw new Error("No valid Pluggable Auth \"credential_source\" provided.");
			this.command = options.credential_source.executable.command;
			if (!this.command) throw new Error("No valid Pluggable Auth \"credential_source\" provided.");
			if (options.credential_source.executable.timeout_millis === void 0) this.timeoutMillis = DEFAULT_EXECUTABLE_TIMEOUT_MILLIS;
			else {
				this.timeoutMillis = options.credential_source.executable.timeout_millis;
				if (this.timeoutMillis < MINIMUM_EXECUTABLE_TIMEOUT_MILLIS || this.timeoutMillis > MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS) throw new Error(`Timeout must be between ${MINIMUM_EXECUTABLE_TIMEOUT_MILLIS} and ${MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS} milliseconds.`);
			}
			this.outputFile = options.credential_source.executable.output_file;
			this.handler = new pluggable_auth_handler_1.PluggableAuthHandler({
				command: this.command,
				timeoutMillis: this.timeoutMillis,
				outputFile: this.outputFile
			});
			this.credentialSourceType = "executable";
		}
		/**
		* Triggered when an external subject token is needed to be exchanged for a
		* GCP access token via GCP STS endpoint.
		* This uses the `options.credential_source` object to figure out how
		* to retrieve the token using the current environment. In this case,
		* this calls a user provided executable which returns the subject token.
		* The logic is summarized as:
		* 1. Validated that the executable is allowed to run. The
		*    GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment must be set to
		*    1 for security reasons.
		* 2. If an output file is specified by the user, check the file location
		*    for a response. If the file exists and contains a valid response,
		*    return the subject token from the file.
		* 3. Call the provided executable and return response.
		* @return A promise that resolves with the external subject token.
		*/
		async retrieveSubjectToken() {
			if (process.env[GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES] !== "1") throw new Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
			let executableResponse = void 0;
			if (this.outputFile) executableResponse = await this.handler.retrieveCachedResponse();
			if (!executableResponse) {
				const envMap = /* @__PURE__ */ new Map();
				envMap.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience);
				envMap.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType);
				envMap.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0");
				if (this.outputFile) envMap.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
				const serviceAccountEmail = this.getServiceAccountEmail();
				if (serviceAccountEmail) envMap.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", serviceAccountEmail);
				executableResponse = await this.handler.retrieveResponseFromExecutable(envMap);
			}
			if (executableResponse.version > MAXIMUM_EXECUTABLE_VERSION) throw new Error(`Version of executable is not currently supported, maximum supported version is ${MAXIMUM_EXECUTABLE_VERSION}.`);
			if (!executableResponse.success) throw new ExecutableError(executableResponse.errorMessage, executableResponse.errorCode);
			if (this.outputFile) {
				if (!executableResponse.expirationTime) throw new executable_response_1.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.");
			}
			if (executableResponse.isExpired()) throw new Error("Executable response is expired.");
			return executableResponse.subjectToken;
		}
	};
	exports.PluggableAuthClient = PluggableAuthClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/externalclient.js
var require_externalclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExternalAccountClient = void 0;
	var baseexternalclient_1 = require_baseexternalclient();
	var identitypoolclient_1 = require_identitypoolclient();
	var awsclient_1 = require_awsclient();
	var pluggable_auth_client_1 = require_pluggable_auth_client();
	/**
	* Dummy class with no constructor. Developers are expected to use fromJSON.
	*/
	var ExternalAccountClient = class {
		constructor() {
			throw new Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()");
		}
		/**
		* This static method will instantiate the
		* corresponding type of external account credential depending on the
		* underlying credential source.
		* @param options The external account options object typically loaded
		*   from the external account JSON credential file.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		* @return A BaseExternalAccountClient instance or null if the options
		*   provided do not correspond to an external account credential.
		*/
		static fromJSON(options, additionalOptions) {
			var _a, _b;
			if (options && options.type === baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE) if ((_a = options.credential_source) === null || _a === void 0 ? void 0 : _a.environment_id) return new awsclient_1.AwsClient(options, additionalOptions);
			else if ((_b = options.credential_source) === null || _b === void 0 ? void 0 : _b.executable) return new pluggable_auth_client_1.PluggableAuthClient(options, additionalOptions);
			else return new identitypoolclient_1.IdentityPoolClient(options, additionalOptions);
			else return null;
		}
	};
	exports.ExternalAccountClient = ExternalAccountClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/externalAccountAuthorizedUserClient.js
var require_externalAccountAuthorizedUserClient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExternalAccountAuthorizedUserClient = exports.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
	var authclient_1 = require_authclient();
	var oauth2common_1 = require_oauth2common();
	var gaxios_1 = require_src$7();
	var stream$1 = __require("stream");
	var baseexternalclient_1 = require_baseexternalclient();
	/**
	* The credentials JSON file type for external account authorized user clients.
	*/
	exports.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
	var DEFAULT_TOKEN_URL = "https://sts.{universeDomain}/v1/oauthtoken";
	/**
	* Handler for token refresh requests sent to the token_url endpoint for external
	* authorized user credentials.
	*/
	var ExternalAccountAuthorizedUserHandler = class ExternalAccountAuthorizedUserHandler extends oauth2common_1.OAuthClientAuthHandler {
		/**
		* Initializes an ExternalAccountAuthorizedUserHandler instance.
		* @param url The URL of the token refresh endpoint.
		* @param transporter The transporter to use for the refresh request.
		* @param clientAuthentication The client authentication credentials to use
		*   for the refresh request.
		*/
		constructor(url, transporter, clientAuthentication) {
			super(clientAuthentication);
			this.url = url;
			this.transporter = transporter;
		}
		/**
		* Requests a new access token from the token_url endpoint using the provided
		*   refresh token.
		* @param refreshToken The refresh token to use to generate a new access token.
		* @param additionalHeaders Optional additional headers to pass along the
		*   request.
		* @return A promise that resolves with the token refresh response containing
		*   the requested access token and its expiration time.
		*/
		async refreshToken(refreshToken, additionalHeaders) {
			const values = new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken
			});
			const headers = {
				"Content-Type": "application/x-www-form-urlencoded",
				...additionalHeaders
			};
			const opts = {
				...ExternalAccountAuthorizedUserHandler.RETRY_CONFIG,
				url: this.url,
				method: "POST",
				headers,
				data: values.toString(),
				responseType: "json"
			};
			this.applyClientAuthenticationOptions(opts);
			try {
				const response = await this.transporter.request(opts);
				const tokenRefreshResponse = response.data;
				tokenRefreshResponse.res = response;
				return tokenRefreshResponse;
			} catch (error) {
				if (error instanceof gaxios_1.GaxiosError && error.response) throw (0, oauth2common_1.getErrorFromOAuthErrorResponse)(error.response.data, error);
				throw error;
			}
		}
	};
	/**
	* External Account Authorized User Client. This is used for OAuth2 credentials
	* sourced using external identities through Workforce Identity Federation.
	* Obtaining the initial access and refresh token can be done through the
	* Google Cloud CLI.
	*/
	var ExternalAccountAuthorizedUserClient = class extends authclient_1.AuthClient {
		/**
		* Instantiates an ExternalAccountAuthorizedUserClient instances using the
		* provided JSON object loaded from a credentials files.
		* An error is throws if the credential is not valid.
		* @param options The external account authorized user option object typically
		*   from the external accoutn authorized user JSON credential file.
		* @param additionalOptions **DEPRECATED, all options are available in the
		*   `options` parameter.** Optional additional behavior customization options.
		*   These currently customize expiration threshold time and whether to retry
		*   on 401/403 API request errors.
		*/
		constructor(options, additionalOptions) {
			var _a;
			super({
				...options,
				...additionalOptions
			});
			if (options.universe_domain) this.universeDomain = options.universe_domain;
			this.refreshToken = options.refresh_token;
			const clientAuth = {
				confidentialClientType: "basic",
				clientId: options.client_id,
				clientSecret: options.client_secret
			};
			this.externalAccountAuthorizedUserHandler = new ExternalAccountAuthorizedUserHandler((_a = options.token_url) !== null && _a !== void 0 ? _a : DEFAULT_TOKEN_URL.replace("{universeDomain}", this.universeDomain), this.transporter, clientAuth);
			this.cachedAccessToken = null;
			this.quotaProjectId = options.quota_project_id;
			if (typeof (additionalOptions === null || additionalOptions === void 0 ? void 0 : additionalOptions.eagerRefreshThresholdMillis) !== "number") this.eagerRefreshThresholdMillis = baseexternalclient_1.EXPIRATION_TIME_OFFSET;
			else this.eagerRefreshThresholdMillis = additionalOptions.eagerRefreshThresholdMillis;
			this.forceRefreshOnFailure = !!(additionalOptions === null || additionalOptions === void 0 ? void 0 : additionalOptions.forceRefreshOnFailure);
		}
		async getAccessToken() {
			if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken)) await this.refreshAccessTokenAsync();
			return {
				token: this.cachedAccessToken.access_token,
				res: this.cachedAccessToken.res
			};
		}
		async getRequestHeaders() {
			const headers = { Authorization: `Bearer ${(await this.getAccessToken()).token}` };
			return this.addSharedMetadataHeaders(headers);
		}
		request(opts, callback) {
			if (callback) this.requestAsync(opts).then((r) => callback(null, r), (e) => {
				return callback(e, e.response);
			});
			else return this.requestAsync(opts);
		}
		/**
		* Authenticates the provided HTTP request, processes it and resolves with the
		* returned response.
		* @param opts The HTTP request options.
		* @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure.
		* @return A promise that resolves with the successful response.
		*/
		async requestAsync(opts, reAuthRetried = false) {
			let response;
			try {
				const requestHeaders = await this.getRequestHeaders();
				opts.headers = opts.headers || {};
				if (requestHeaders && requestHeaders["x-goog-user-project"]) opts.headers["x-goog-user-project"] = requestHeaders["x-goog-user-project"];
				if (requestHeaders && requestHeaders.Authorization) opts.headers.Authorization = requestHeaders.Authorization;
				response = await this.transporter.request(opts);
			} catch (e) {
				const res = e.response;
				if (res) {
					const statusCode = res.status;
					const isReadableStream = res.config.data instanceof stream$1.Readable;
					if (!reAuthRetried && (statusCode === 401 || statusCode === 403) && !isReadableStream && this.forceRefreshOnFailure) {
						await this.refreshAccessTokenAsync();
						return await this.requestAsync(opts, true);
					}
				}
				throw e;
			}
			return response;
		}
		/**
		* Forces token refresh, even if unexpired tokens are currently cached.
		* @return A promise that resolves with the refreshed credential.
		*/
		async refreshAccessTokenAsync() {
			const refreshResponse = await this.externalAccountAuthorizedUserHandler.refreshToken(this.refreshToken);
			this.cachedAccessToken = {
				access_token: refreshResponse.access_token,
				expiry_date: (/* @__PURE__ */ new Date()).getTime() + refreshResponse.expires_in * 1e3,
				res: refreshResponse.res
			};
			if (refreshResponse.refresh_token !== void 0) this.refreshToken = refreshResponse.refresh_token;
			return this.cachedAccessToken;
		}
		/**
		* Returns whether the provided credentials are expired or not.
		* If there is no expiry time, assumes the token is not expired or expiring.
		* @param credentials The credentials to check for expiration.
		* @return Whether the credentials are expired or not.
		*/
		isExpired(credentials) {
			const now = (/* @__PURE__ */ new Date()).getTime();
			return credentials.expiry_date ? now >= credentials.expiry_date - this.eagerRefreshThresholdMillis : false;
		}
	};
	exports.ExternalAccountAuthorizedUserClient = ExternalAccountAuthorizedUserClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/googleauth.js
var require_googleauth = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var _GoogleAuth_instances, _GoogleAuth_pendingAuthClient, _GoogleAuth_prepareAndCacheClient, _GoogleAuth_determineClient;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GoogleAuth = exports.GoogleAuthExceptionMessages = exports.CLOUD_SDK_CLIENT_ID = void 0;
	var child_process_1 = __require("child_process");
	var fs$2 = __require("fs");
	var gcpMetadata = require_src$5();
	var os = __require("os");
	var path$2 = __require("path");
	var crypto_1 = require_crypto();
	var transporters_1 = require_transporters();
	var computeclient_1 = require_computeclient();
	var idtokenclient_1 = require_idtokenclient();
	var envDetect_1 = require_envDetect();
	var jwtclient_1 = require_jwtclient();
	var refreshclient_1 = require_refreshclient();
	var impersonated_1 = require_impersonated();
	var externalclient_1 = require_externalclient();
	var baseexternalclient_1 = require_baseexternalclient();
	var authclient_1 = require_authclient();
	var externalAccountAuthorizedUserClient_1 = require_externalAccountAuthorizedUserClient();
	var util_1 = require_util$2();
	exports.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
	exports.GoogleAuthExceptionMessages = {
		API_KEY_WITH_CREDENTIALS: "API Keys and Credentials are mutually exclusive authentication methods and cannot be used together.",
		NO_PROJECT_ID_FOUND: "Unable to detect a Project Id in the current environment. \nTo learn more about authentication and Google APIs, visit: \nhttps://cloud.google.com/docs/authentication/getting-started",
		NO_CREDENTIALS_FOUND: "Unable to find credentials in current environment. \nTo learn more about authentication and Google APIs, visit: \nhttps://cloud.google.com/docs/authentication/getting-started",
		NO_ADC_FOUND: "Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.",
		NO_UNIVERSE_DOMAIN_FOUND: "Unable to detect a Universe Domain in the current environment.\nTo learn more about Universe Domain retrieval, visit: \nhttps://cloud.google.com/compute/docs/metadata/predefined-metadata-keys"
	};
	var GoogleAuth = class {
		get isGCE() {
			return this.checkIsGCE;
		}
		/**
		* Configuration is resolved in the following order of precedence:
		* - {@link GoogleAuthOptions.credentials `credentials`}
		* - {@link GoogleAuthOptions.keyFilename `keyFilename`}
		* - {@link GoogleAuthOptions.keyFile `keyFile`}
		*
		* {@link GoogleAuthOptions.clientOptions `clientOptions`} are passed to the
		* {@link AuthClient `AuthClient`s}.
		*
		* @param opts
		*/
		constructor(opts = {}) {
			_GoogleAuth_instances.add(this);
			/**
			* Caches a value indicating whether the auth layer is running on Google
			* Compute Engine.
			* @private
			*/
			this.checkIsGCE = void 0;
			this.jsonContent = null;
			this.cachedCredential = null;
			/**
			* A pending {@link AuthClient}. Used for concurrent {@link GoogleAuth.getClient} calls.
			*/
			_GoogleAuth_pendingAuthClient.set(this, null);
			this.clientOptions = {};
			this._cachedProjectId = opts.projectId || null;
			this.cachedCredential = opts.authClient || null;
			this.keyFilename = opts.keyFilename || opts.keyFile;
			this.scopes = opts.scopes;
			this.clientOptions = opts.clientOptions || {};
			this.jsonContent = opts.credentials || null;
			this.apiKey = opts.apiKey || this.clientOptions.apiKey || null;
			if (this.apiKey && (this.jsonContent || this.clientOptions.credentials)) throw new RangeError(exports.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
			if (opts.universeDomain) this.clientOptions.universeDomain = opts.universeDomain;
		}
		setGapicJWTValues(client) {
			client.defaultServicePath = this.defaultServicePath;
			client.useJWTAccessWithScope = this.useJWTAccessWithScope;
			client.defaultScopes = this.defaultScopes;
		}
		getProjectId(callback) {
			if (callback) this.getProjectIdAsync().then((r) => callback(null, r), callback);
			else return this.getProjectIdAsync();
		}
		/**
		* A temporary method for internal `getProjectId` usages where `null` is
		* acceptable. In a future major release, `getProjectId` should return `null`
		* (as the `Promise<string | null>` base signature describes) and this private
		* method should be removed.
		*
		* @returns Promise that resolves with project id (or `null`)
		*/
		async getProjectIdOptional() {
			try {
				return await this.getProjectId();
			} catch (e) {
				if (e instanceof Error && e.message === exports.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND) return null;
				else throw e;
			}
		}
		/**
		* A private method for finding and caching a projectId.
		*
		* Supports environments in order of precedence:
		* - GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variable
		* - GOOGLE_APPLICATION_CREDENTIALS JSON file
		* - Cloud SDK: `gcloud config config-helper --format json`
		* - GCE project ID from metadata server
		*
		* @returns projectId
		*/
		async findAndCacheProjectId() {
			let projectId = null;
			projectId || (projectId = await this.getProductionProjectId());
			projectId || (projectId = await this.getFileProjectId());
			projectId || (projectId = await this.getDefaultServiceProjectId());
			projectId || (projectId = await this.getGCEProjectId());
			projectId || (projectId = await this.getExternalAccountClientProjectId());
			if (projectId) {
				this._cachedProjectId = projectId;
				return projectId;
			} else throw new Error(exports.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND);
		}
		async getProjectIdAsync() {
			if (this._cachedProjectId) return this._cachedProjectId;
			if (!this._findProjectIdPromise) this._findProjectIdPromise = this.findAndCacheProjectId();
			return this._findProjectIdPromise;
		}
		/**
		* Retrieves a universe domain from the metadata server via
		* {@link gcpMetadata.universe}.
		*
		* @returns a universe domain
		*/
		async getUniverseDomainFromMetadataServer() {
			var _a;
			let universeDomain;
			try {
				universeDomain = await gcpMetadata.universe("universe-domain");
				universeDomain || (universeDomain = authclient_1.DEFAULT_UNIVERSE);
			} catch (e) {
				if (e && ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) === 404) universeDomain = authclient_1.DEFAULT_UNIVERSE;
				else throw e;
			}
			return universeDomain;
		}
		/**
		* Retrieves, caches, and returns the universe domain in the following order
		* of precedence:
		* - The universe domain in {@link GoogleAuth.clientOptions}
		* - An existing or ADC {@link AuthClient}'s universe domain
		* - {@link gcpMetadata.universe}, if {@link Compute} client
		*
		* @returns The universe domain
		*/
		async getUniverseDomain() {
			let universeDomain = (0, util_1.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
			try {
				universeDomain !== null && universeDomain !== void 0 || (universeDomain = (await this.getClient()).universeDomain);
			} catch (_a) {
				universeDomain !== null && universeDomain !== void 0 || (universeDomain = authclient_1.DEFAULT_UNIVERSE);
			}
			return universeDomain;
		}
		/**
		* @returns Any scopes (user-specified or default scopes specified by the
		*   client library) that need to be set on the current Auth client.
		*/
		getAnyScopes() {
			return this.scopes || this.defaultScopes;
		}
		getApplicationDefault(optionsOrCallback = {}, callback) {
			let options;
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else options = optionsOrCallback;
			if (callback) this.getApplicationDefaultAsync(options).then((r) => callback(null, r.credential, r.projectId), callback);
			else return this.getApplicationDefaultAsync(options);
		}
		async getApplicationDefaultAsync(options = {}) {
			if (this.cachedCredential) return await __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, this.cachedCredential, null);
			let credential;
			credential = await this._tryGetApplicationCredentialsFromEnvironmentVariable(options);
			if (credential) {
				if (credential instanceof jwtclient_1.JWT) credential.scopes = this.scopes;
				else if (credential instanceof baseexternalclient_1.BaseExternalAccountClient) credential.scopes = this.getAnyScopes();
				return await __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, credential);
			}
			credential = await this._tryGetApplicationCredentialsFromWellKnownFile(options);
			if (credential) {
				if (credential instanceof jwtclient_1.JWT) credential.scopes = this.scopes;
				else if (credential instanceof baseexternalclient_1.BaseExternalAccountClient) credential.scopes = this.getAnyScopes();
				return await __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, credential);
			}
			if (await this._checkIsGCE()) {
				options.scopes = this.getAnyScopes();
				return await __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, new computeclient_1.Compute(options));
			}
			throw new Error(exports.GoogleAuthExceptionMessages.NO_ADC_FOUND);
		}
		/**
		* Determines whether the auth layer is running on Google Compute Engine.
		* Checks for GCP Residency, then fallback to checking if metadata server
		* is available.
		*
		* @returns A promise that resolves with the boolean.
		* @api private
		*/
		async _checkIsGCE() {
			if (this.checkIsGCE === void 0) this.checkIsGCE = gcpMetadata.getGCPResidency() || await gcpMetadata.isAvailable();
			return this.checkIsGCE;
		}
		/**
		* Attempts to load default credentials from the environment variable path..
		* @returns Promise that resolves with the OAuth2Client or null.
		* @api private
		*/
		async _tryGetApplicationCredentialsFromEnvironmentVariable(options) {
			const credentialsPath = process.env["GOOGLE_APPLICATION_CREDENTIALS"] || process.env["google_application_credentials"];
			if (!credentialsPath || credentialsPath.length === 0) return null;
			try {
				return this._getApplicationCredentialsFromFilePath(credentialsPath, options);
			} catch (e) {
				if (e instanceof Error) e.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${e.message}`;
				throw e;
			}
		}
		/**
		* Attempts to load default credentials from a well-known file location
		* @return Promise that resolves with the OAuth2Client or null.
		* @api private
		*/
		async _tryGetApplicationCredentialsFromWellKnownFile(options) {
			let location = null;
			if (this._isWindows()) location = process.env["APPDATA"];
			else {
				const home = process.env["HOME"];
				if (home) location = path$2.join(home, ".config");
			}
			if (location) {
				location = path$2.join(location, "gcloud", "application_default_credentials.json");
				if (!fs$2.existsSync(location)) location = null;
			}
			if (!location) return null;
			return await this._getApplicationCredentialsFromFilePath(location, options);
		}
		/**
		* Attempts to load default credentials from a file at the given path..
		* @param filePath The path to the file to read.
		* @returns Promise that resolves with the OAuth2Client
		* @api private
		*/
		async _getApplicationCredentialsFromFilePath(filePath, options = {}) {
			if (!filePath || filePath.length === 0) throw new Error("The file path is invalid.");
			try {
				filePath = fs$2.realpathSync(filePath);
				if (!fs$2.lstatSync(filePath).isFile()) throw new Error();
			} catch (err) {
				if (err instanceof Error) err.message = `The file at ${filePath} does not exist, or it is not a file. ${err.message}`;
				throw err;
			}
			const readStream = fs$2.createReadStream(filePath);
			return this.fromStream(readStream, options);
		}
		/**
		* Create a credentials instance using a given impersonated input options.
		* @param json The impersonated input object.
		* @returns JWT or UserRefresh Client with data
		*/
		fromImpersonatedJSON(json) {
			var _a, _b, _c, _d;
			if (!json) throw new Error("Must pass in a JSON object containing an  impersonated refresh token");
			if (json.type !== impersonated_1.IMPERSONATED_ACCOUNT_TYPE) throw new Error(`The incoming JSON object does not have the "${impersonated_1.IMPERSONATED_ACCOUNT_TYPE}" type`);
			if (!json.source_credentials) throw new Error("The incoming JSON object does not contain a source_credentials field");
			if (!json.service_account_impersonation_url) throw new Error("The incoming JSON object does not contain a service_account_impersonation_url field");
			const sourceClient = this.fromJSON(json.source_credentials);
			if (((_a = json.service_account_impersonation_url) === null || _a === void 0 ? void 0 : _a.length) > 256)
 /**
			* Prevents DOS attacks.
			* @see {@link https://github.com/googleapis/google-auth-library-nodejs/security/code-scanning/85}
			**/
			throw new RangeError(`Target principal is too long: ${json.service_account_impersonation_url}`);
			const targetPrincipal = (_c = (_b = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(json.service_account_impersonation_url)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.target;
			if (!targetPrincipal) throw new RangeError(`Cannot extract target principal from ${json.service_account_impersonation_url}`);
			const targetScopes = (_d = this.getAnyScopes()) !== null && _d !== void 0 ? _d : [];
			return new impersonated_1.Impersonated({
				...json,
				sourceClient,
				targetPrincipal,
				targetScopes: Array.isArray(targetScopes) ? targetScopes : [targetScopes]
			});
		}
		/**
		* Create a credentials instance using the given input options.
		* This client is not cached.
		*
		* **Important**: If you accept a credential configuration (credential JSON/File/Stream) from an external source for authentication to Google Cloud, you must validate it before providing it to any Google API or library. Providing an unvalidated credential configuration to Google APIs can compromise the security of your systems and data. For more information, refer to {@link https://cloud.google.com/docs/authentication/external/externally-sourced-credentials Validate credential configurations from external sources}.
		*
		* @param json The input object.
		* @param options The JWT or UserRefresh options for the client
		* @returns JWT or UserRefresh Client with data
		*/
		fromJSON(json, options = {}) {
			let client;
			const preferredUniverseDomain = (0, util_1.originalOrCamelOptions)(options).get("universe_domain");
			if (json.type === refreshclient_1.USER_REFRESH_ACCOUNT_TYPE) {
				client = new refreshclient_1.UserRefreshClient(options);
				client.fromJSON(json);
			} else if (json.type === impersonated_1.IMPERSONATED_ACCOUNT_TYPE) client = this.fromImpersonatedJSON(json);
			else if (json.type === baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE) {
				client = externalclient_1.ExternalAccountClient.fromJSON(json, options);
				client.scopes = this.getAnyScopes();
			} else if (json.type === externalAccountAuthorizedUserClient_1.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE) client = new externalAccountAuthorizedUserClient_1.ExternalAccountAuthorizedUserClient(json, options);
			else {
				options.scopes = this.scopes;
				client = new jwtclient_1.JWT(options);
				this.setGapicJWTValues(client);
				client.fromJSON(json);
			}
			if (preferredUniverseDomain) client.universeDomain = preferredUniverseDomain;
			return client;
		}
		/**
		* Return a JWT or UserRefreshClient from JavaScript object, caching both the
		* object used to instantiate and the client.
		* @param json The input object.
		* @param options The JWT or UserRefresh options for the client
		* @returns JWT or UserRefresh Client with data
		*/
		_cacheClientFromJSON(json, options) {
			const client = this.fromJSON(json, options);
			this.jsonContent = json;
			this.cachedCredential = client;
			return client;
		}
		fromStream(inputStream, optionsOrCallback = {}, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else options = optionsOrCallback;
			if (callback) this.fromStreamAsync(inputStream, options).then((r) => callback(null, r), callback);
			else return this.fromStreamAsync(inputStream, options);
		}
		fromStreamAsync(inputStream, options) {
			return new Promise((resolve, reject) => {
				if (!inputStream) throw new Error("Must pass in a stream containing the Google auth settings.");
				const chunks = [];
				inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => chunks.push(chunk)).on("end", () => {
					try {
						try {
							const data = JSON.parse(chunks.join(""));
							return resolve(this._cacheClientFromJSON(data, options));
						} catch (err) {
							if (!this.keyFilename) throw err;
							const client = new jwtclient_1.JWT({
								...this.clientOptions,
								keyFile: this.keyFilename
							});
							this.cachedCredential = client;
							this.setGapicJWTValues(client);
							return resolve(client);
						}
					} catch (err) {
						return reject(err);
					}
				});
			});
		}
		/**
		* Create a credentials instance using the given API key string.
		* The created client is not cached. In order to create and cache it use the {@link GoogleAuth.getClient `getClient`} method after first providing an {@link GoogleAuth.apiKey `apiKey`}.
		*
		* @param apiKey The API key string
		* @param options An optional options object.
		* @returns A JWT loaded from the key
		*/
		fromAPIKey(apiKey, options = {}) {
			return new jwtclient_1.JWT({
				...options,
				apiKey
			});
		}
		/**
		* Determines whether the current operating system is Windows.
		* @api private
		*/
		_isWindows() {
			const sys = os.platform();
			if (sys && sys.length >= 3) {
				if (sys.substring(0, 3).toLowerCase() === "win") return true;
			}
			return false;
		}
		/**
		* Run the Google Cloud SDK command that prints the default project ID
		*/
		async getDefaultServiceProjectId() {
			return new Promise((resolve) => {
				(0, child_process_1.exec)("gcloud config config-helper --format json", (err, stdout) => {
					if (!err && stdout) try {
						const projectId = JSON.parse(stdout).configuration.properties.core.project;
						resolve(projectId);
						return;
					} catch (e) {}
					resolve(null);
				});
			});
		}
		/**
		* Loads the project id from environment variables.
		* @api private
		*/
		getProductionProjectId() {
			return process.env["GCLOUD_PROJECT"] || process.env["GOOGLE_CLOUD_PROJECT"] || process.env["gcloud_project"] || process.env["google_cloud_project"];
		}
		/**
		* Loads the project id from the GOOGLE_APPLICATION_CREDENTIALS json file.
		* @api private
		*/
		async getFileProjectId() {
			if (this.cachedCredential) return this.cachedCredential.projectId;
			if (this.keyFilename) {
				const creds = await this.getClient();
				if (creds && creds.projectId) return creds.projectId;
			}
			const r = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
			if (r) return r.projectId;
			else return null;
		}
		/**
		* Gets the project ID from external account client if available.
		*/
		async getExternalAccountClientProjectId() {
			if (!this.jsonContent || this.jsonContent.type !== baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE) return null;
			return await (await this.getClient()).getProjectId();
		}
		/**
		* Gets the Compute Engine project ID if it can be inferred.
		*/
		async getGCEProjectId() {
			try {
				return await gcpMetadata.project("project-id");
			} catch (e) {
				return null;
			}
		}
		getCredentials(callback) {
			if (callback) this.getCredentialsAsync().then((r) => callback(null, r), callback);
			else return this.getCredentialsAsync();
		}
		async getCredentialsAsync() {
			const client = await this.getClient();
			if (client instanceof impersonated_1.Impersonated) return { client_email: client.getTargetPrincipal() };
			if (client instanceof baseexternalclient_1.BaseExternalAccountClient) {
				const serviceAccountEmail = client.getServiceAccountEmail();
				if (serviceAccountEmail) return {
					client_email: serviceAccountEmail,
					universe_domain: client.universeDomain
				};
			}
			if (this.jsonContent) return {
				client_email: this.jsonContent.client_email,
				private_key: this.jsonContent.private_key,
				universe_domain: this.jsonContent.universe_domain
			};
			if (await this._checkIsGCE()) {
				const [client_email, universe_domain] = await Promise.all([gcpMetadata.instance("service-accounts/default/email"), this.getUniverseDomain()]);
				return {
					client_email,
					universe_domain
				};
			}
			throw new Error(exports.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND);
		}
		/**
		* Automatically obtain an {@link AuthClient `AuthClient`} based on the
		* provided configuration. If no options were passed, use Application
		* Default Credentials.
		*/
		async getClient() {
			if (this.cachedCredential) return this.cachedCredential;
			__classPrivateFieldSet(this, _GoogleAuth_pendingAuthClient, __classPrivateFieldGet(this, _GoogleAuth_pendingAuthClient, "f") || __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_determineClient).call(this), "f");
			try {
				return await __classPrivateFieldGet(this, _GoogleAuth_pendingAuthClient, "f");
			} finally {
				__classPrivateFieldSet(this, _GoogleAuth_pendingAuthClient, null, "f");
			}
		}
		/**
		* Creates a client which will fetch an ID token for authorization.
		* @param targetAudience the audience for the fetched ID token.
		* @returns IdTokenClient for making HTTP calls authenticated with ID tokens.
		*/
		async getIdTokenClient(targetAudience) {
			const client = await this.getClient();
			if (!("fetchIdToken" in client)) throw new Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
			return new idtokenclient_1.IdTokenClient({
				targetAudience,
				idTokenProvider: client
			});
		}
		/**
		* Automatically obtain application default credentials, and return
		* an access token for making requests.
		*/
		async getAccessToken() {
			return (await (await this.getClient()).getAccessToken()).token;
		}
		/**
		* Obtain the HTTP headers that will provide authorization for a given
		* request.
		*/
		async getRequestHeaders(url) {
			return (await this.getClient()).getRequestHeaders(url);
		}
		/**
		* Obtain credentials for a request, then attach the appropriate headers to
		* the request options.
		* @param opts Axios or Request options on which to attach the headers
		*/
		async authorizeRequest(opts) {
			opts = opts || {};
			const url = opts.url || opts.uri;
			const headers = await (await this.getClient()).getRequestHeaders(url);
			opts.headers = Object.assign(opts.headers || {}, headers);
			return opts;
		}
		/**
		* Automatically obtain application default credentials, and make an
		* HTTP request using the given options.
		* @param opts Axios request options for the HTTP request.
		*/
		async request(opts) {
			return (await this.getClient()).request(opts);
		}
		/**
		* Determine the compute environment in which the code is running.
		*/
		getEnv() {
			return (0, envDetect_1.getEnv)();
		}
		/**
		* Sign the given data with the current private key, or go out
		* to the IAM API to sign it.
		* @param data The data to be signed.
		* @param endpoint A custom endpoint to use.
		*
		* @example
		* ```
		* sign('data', 'https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/');
		* ```
		*/
		async sign(data, endpoint) {
			const client = await this.getClient();
			const universe = await this.getUniverseDomain();
			endpoint = endpoint || `https://iamcredentials.${universe}/v1/projects/-/serviceAccounts/`;
			if (client instanceof impersonated_1.Impersonated) return (await client.sign(data)).signedBlob;
			const crypto = (0, crypto_1.createCrypto)();
			if (client instanceof jwtclient_1.JWT && client.key) return await crypto.sign(client.key, data);
			const creds = await this.getCredentials();
			if (!creds.client_email) throw new Error("Cannot sign data without `client_email`.");
			return this.signBlob(crypto, creds.client_email, data, endpoint);
		}
		async signBlob(crypto, emailOrUniqueId, data, endpoint) {
			const url = new URL(endpoint + `${emailOrUniqueId}:signBlob`);
			return (await this.request({
				method: "POST",
				url: url.href,
				data: { payload: crypto.encodeBase64StringUtf8(data) },
				retry: true,
				retryConfig: { httpMethodsToRetry: ["POST"] }
			})).data.signedBlob;
		}
	};
	exports.GoogleAuth = GoogleAuth;
	_GoogleAuth_pendingAuthClient = /* @__PURE__ */ new WeakMap(), _GoogleAuth_instances = /* @__PURE__ */ new WeakSet(), _GoogleAuth_prepareAndCacheClient = async function _GoogleAuth_prepareAndCacheClient(credential, quotaProjectIdOverride = process.env["GOOGLE_CLOUD_QUOTA_PROJECT"] || null) {
		const projectId = await this.getProjectIdOptional();
		if (quotaProjectIdOverride) credential.quotaProjectId = quotaProjectIdOverride;
		this.cachedCredential = credential;
		return {
			credential,
			projectId
		};
	}, _GoogleAuth_determineClient = async function _GoogleAuth_determineClient() {
		if (this.jsonContent) return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
		else if (this.keyFilename) {
			const filePath = path$2.resolve(this.keyFilename);
			const stream = fs$2.createReadStream(filePath);
			return await this.fromStreamAsync(stream, this.clientOptions);
		} else if (this.apiKey) {
			const client = await this.fromAPIKey(this.apiKey, this.clientOptions);
			client.scopes = this.scopes;
			const { credential } = await __classPrivateFieldGet(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, client);
			return credential;
		} else {
			const { credential } = await this.getApplicationDefaultAsync(this.clientOptions);
			return credential;
		}
	};
	/**
	* Export DefaultTransporter as a static property of the class.
	*/
	GoogleAuth.DefaultTransporter = transporters_1.DefaultTransporter;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/iam.js
var require_iam$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IAMAuth = void 0;
	var IAMAuth = class {
		/**
		* IAM credentials.
		*
		* @param selector the iam authority selector
		* @param token the token
		* @constructor
		*/
		constructor(selector, token) {
			this.selector = selector;
			this.token = token;
			this.selector = selector;
			this.token = token;
		}
		/**
		* Acquire the HTTP headers required to make an authenticated request.
		*/
		getRequestHeaders() {
			return {
				"x-goog-iam-authority-selector": this.selector,
				"x-goog-iam-authorization-token": this.token
			};
		}
	};
	exports.IAMAuth = IAMAuth;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/downscopedclient.js
var require_downscopedclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DownscopedClient = exports.EXPIRATION_TIME_OFFSET = exports.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
	var stream = __require("stream");
	var authclient_1 = require_authclient();
	var sts = require_stscredentials();
	/**
	* The required token exchange grant_type: rfc8693#section-2.1
	*/
	var STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
	/**
	* The requested token exchange requested_token_type: rfc8693#section-2.1
	*/
	var STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
	/**
	* The requested token exchange subject_token_type: rfc8693#section-2.1
	*/
	var STS_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
	/**
	* The maximum number of access boundary rules a Credential Access Boundary
	* can contain.
	*/
	exports.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
	/**
	* Offset to take into account network delays and server clock skews.
	*/
	exports.EXPIRATION_TIME_OFFSET = 300 * 1e3;
	/**
	* Defines a set of Google credentials that are downscoped from an existing set
	* of Google OAuth2 credentials. This is useful to restrict the Identity and
	* Access Management (IAM) permissions that a short-lived credential can use.
	* The common pattern of usage is to have a token broker with elevated access
	* generate these downscoped credentials from higher access source credentials
	* and pass the downscoped short-lived access tokens to a token consumer via
	* some secure authenticated channel for limited access to Google Cloud Storage
	* resources.
	*/
	var DownscopedClient = class extends authclient_1.AuthClient {
		/**
		* Instantiates a downscoped client object using the provided source
		* AuthClient and credential access boundary rules.
		* To downscope permissions of a source AuthClient, a Credential Access
		* Boundary that specifies which resources the new credential can access, as
		* well as an upper bound on the permissions that are available on each
		* resource, has to be defined. A downscoped client can then be instantiated
		* using the source AuthClient and the Credential Access Boundary.
		* @param authClient The source AuthClient to be downscoped based on the
		*   provided Credential Access Boundary rules.
		* @param credentialAccessBoundary The Credential Access Boundary which
		*   contains a list of access boundary rules. Each rule contains information
		*   on the resource that the rule applies to, the upper bound of the
		*   permissions that are available on that resource and an optional
		*   condition to further restrict permissions.
		* @param additionalOptions **DEPRECATED, set this in the provided `authClient`.**
		*   Optional additional behavior customization options.
		* @param quotaProjectId **DEPRECATED, set this in the provided `authClient`.**
		*   Optional quota project id for setting up in the x-goog-user-project header.
		*/
		constructor(authClient, credentialAccessBoundary, additionalOptions, quotaProjectId) {
			super({
				...additionalOptions,
				quotaProjectId
			});
			this.authClient = authClient;
			this.credentialAccessBoundary = credentialAccessBoundary;
			if (credentialAccessBoundary.accessBoundary.accessBoundaryRules.length === 0) throw new Error("At least one access boundary rule needs to be defined.");
			else if (credentialAccessBoundary.accessBoundary.accessBoundaryRules.length > exports.MAX_ACCESS_BOUNDARY_RULES_COUNT) throw new Error(`The provided access boundary has more than ${exports.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
			for (const rule of credentialAccessBoundary.accessBoundary.accessBoundaryRules) if (rule.availablePermissions.length === 0) throw new Error("At least one permission should be defined in access boundary rules.");
			this.stsCredential = new sts.StsCredentials(`https://sts.${this.universeDomain}/v1/token`);
			this.cachedDownscopedAccessToken = null;
		}
		/**
		* Provides a mechanism to inject Downscoped access tokens directly.
		* The expiry_date field is required to facilitate determination of the token
		* expiration which would make it easier for the token consumer to handle.
		* @param credentials The Credentials object to set on the current client.
		*/
		setCredentials(credentials) {
			if (!credentials.expiry_date) throw new Error("The access token expiry_date field is missing in the provided credentials.");
			super.setCredentials(credentials);
			this.cachedDownscopedAccessToken = credentials;
		}
		async getAccessToken() {
			if (!this.cachedDownscopedAccessToken || this.isExpired(this.cachedDownscopedAccessToken)) await this.refreshAccessTokenAsync();
			return {
				token: this.cachedDownscopedAccessToken.access_token,
				expirationTime: this.cachedDownscopedAccessToken.expiry_date,
				res: this.cachedDownscopedAccessToken.res
			};
		}
		/**
		* The main authentication interface. It takes an optional url which when
		* present is the endpoint being accessed, and returns a Promise which
		* resolves with authorization header fields.
		*
		* The result has the form:
		* { Authorization: 'Bearer <access_token_value>' }
		*/
		async getRequestHeaders() {
			const headers = { Authorization: `Bearer ${(await this.getAccessToken()).token}` };
			return this.addSharedMetadataHeaders(headers);
		}
		request(opts, callback) {
			if (callback) this.requestAsync(opts).then((r) => callback(null, r), (e) => {
				return callback(e, e.response);
			});
			else return this.requestAsync(opts);
		}
		/**
		* Authenticates the provided HTTP request, processes it and resolves with the
		* returned response.
		* @param opts The HTTP request options.
		* @param reAuthRetried Whether the current attempt is a retry after a failed attempt due to an auth failure
		* @return A promise that resolves with the successful response.
		*/
		async requestAsync(opts, reAuthRetried = false) {
			let response;
			try {
				const requestHeaders = await this.getRequestHeaders();
				opts.headers = opts.headers || {};
				if (requestHeaders && requestHeaders["x-goog-user-project"]) opts.headers["x-goog-user-project"] = requestHeaders["x-goog-user-project"];
				if (requestHeaders && requestHeaders.Authorization) opts.headers.Authorization = requestHeaders.Authorization;
				response = await this.transporter.request(opts);
			} catch (e) {
				const res = e.response;
				if (res) {
					const statusCode = res.status;
					const isReadableStream = res.config.data instanceof stream.Readable;
					if (!reAuthRetried && (statusCode === 401 || statusCode === 403) && !isReadableStream && this.forceRefreshOnFailure) {
						await this.refreshAccessTokenAsync();
						return await this.requestAsync(opts, true);
					}
				}
				throw e;
			}
			return response;
		}
		/**
		* Forces token refresh, even if unexpired tokens are currently cached.
		* GCP access tokens are retrieved from authclient object/source credential.
		* Then GCP access tokens are exchanged for downscoped access tokens via the
		* token exchange endpoint.
		* @return A promise that resolves with the fresh downscoped access token.
		*/
		async refreshAccessTokenAsync() {
			var _a;
			const stsCredentialsOptions = {
				grantType: STS_GRANT_TYPE,
				requestedTokenType: STS_REQUEST_TOKEN_TYPE,
				subjectToken: (await this.authClient.getAccessToken()).token,
				subjectTokenType: STS_SUBJECT_TOKEN_TYPE
			};
			const stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, void 0, this.credentialAccessBoundary);
			/**
			* The STS endpoint will only return the expiration time for the downscoped
			* access token if the original access token represents a service account.
			* The downscoped token's expiration time will always match the source
			* credential expiration. When no expires_in is returned, we can copy the
			* source credential's expiration time.
			*/
			const sourceCredExpireDate = ((_a = this.authClient.credentials) === null || _a === void 0 ? void 0 : _a.expiry_date) || null;
			const expiryDate = stsResponse.expires_in ? (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1e3 : sourceCredExpireDate;
			this.cachedDownscopedAccessToken = {
				access_token: stsResponse.access_token,
				expiry_date: expiryDate,
				res: stsResponse.res
			};
			this.credentials = {};
			Object.assign(this.credentials, this.cachedDownscopedAccessToken);
			delete this.credentials.res;
			this.emit("tokens", {
				refresh_token: null,
				expiry_date: this.cachedDownscopedAccessToken.expiry_date,
				access_token: this.cachedDownscopedAccessToken.access_token,
				token_type: "Bearer",
				id_token: null
			});
			return this.cachedDownscopedAccessToken;
		}
		/**
		* Returns whether the provided credentials are expired or not.
		* If there is no expiry time, assumes the token is not expired or expiring.
		* @param downscopedAccessToken The credentials to check for expiration.
		* @return Whether the credentials are expired or not.
		*/
		isExpired(downscopedAccessToken) {
			const now = (/* @__PURE__ */ new Date()).getTime();
			return downscopedAccessToken.expiry_date ? now >= downscopedAccessToken.expiry_date - this.eagerRefreshThresholdMillis : false;
		}
	};
	exports.DownscopedClient = DownscopedClient;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/auth/passthrough.js
var require_passthrough = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PassThroughClient = void 0;
	var authclient_1 = require_authclient();
	/**
	* An AuthClient without any Authentication information. Useful for:
	* - Anonymous access
	* - Local Emulators
	* - Testing Environments
	*
	*/
	var PassThroughClient = class extends authclient_1.AuthClient {
		/**
		* Creates a request without any authentication headers or checks.
		*
		* @remarks
		*
		* In testing environments it may be useful to change the provided
		* {@link AuthClient.transporter} for any desired request overrides/handling.
		*
		* @param opts
		* @returns The response of the request.
		*/
		async request(opts) {
			return this.transporter.request(opts);
		}
		/**
		* A required method of the base class.
		* Always will return an empty object.
		*
		* @returns {}
		*/
		async getAccessToken() {
			return {};
		}
		/**
		* A required method of the base class.
		* Always will return an empty object.
		*
		* @returns {}
		*/
		async getRequestHeaders() {
			return {};
		}
	};
	exports.PassThroughClient = PassThroughClient;
	new PassThroughClient().getAccessToken();
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/google-auth-library/build/src/index.js
var require_src$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GoogleAuth = exports.auth = exports.DefaultTransporter = exports.PassThroughClient = exports.ExecutableError = exports.PluggableAuthClient = exports.DownscopedClient = exports.BaseExternalAccountClient = exports.ExternalAccountClient = exports.IdentityPoolClient = exports.AwsRequestSigner = exports.AwsClient = exports.UserRefreshClient = exports.LoginTicket = exports.ClientAuthentication = exports.OAuth2Client = exports.CodeChallengeMethod = exports.Impersonated = exports.JWT = exports.JWTAccess = exports.IdTokenClient = exports.IAMAuth = exports.GCPEnv = exports.Compute = exports.DEFAULT_UNIVERSE = exports.AuthClient = exports.gaxios = exports.gcpMetadata = void 0;
	var googleauth_1 = require_googleauth();
	Object.defineProperty(exports, "GoogleAuth", {
		enumerable: true,
		get: function() {
			return googleauth_1.GoogleAuth;
		}
	});
	exports.gcpMetadata = require_src$5();
	exports.gaxios = require_src$7();
	var authclient_1 = require_authclient();
	Object.defineProperty(exports, "AuthClient", {
		enumerable: true,
		get: function() {
			return authclient_1.AuthClient;
		}
	});
	Object.defineProperty(exports, "DEFAULT_UNIVERSE", {
		enumerable: true,
		get: function() {
			return authclient_1.DEFAULT_UNIVERSE;
		}
	});
	var computeclient_1 = require_computeclient();
	Object.defineProperty(exports, "Compute", {
		enumerable: true,
		get: function() {
			return computeclient_1.Compute;
		}
	});
	var envDetect_1 = require_envDetect();
	Object.defineProperty(exports, "GCPEnv", {
		enumerable: true,
		get: function() {
			return envDetect_1.GCPEnv;
		}
	});
	var iam_1 = require_iam$1();
	Object.defineProperty(exports, "IAMAuth", {
		enumerable: true,
		get: function() {
			return iam_1.IAMAuth;
		}
	});
	var idtokenclient_1 = require_idtokenclient();
	Object.defineProperty(exports, "IdTokenClient", {
		enumerable: true,
		get: function() {
			return idtokenclient_1.IdTokenClient;
		}
	});
	var jwtaccess_1 = require_jwtaccess();
	Object.defineProperty(exports, "JWTAccess", {
		enumerable: true,
		get: function() {
			return jwtaccess_1.JWTAccess;
		}
	});
	var jwtclient_1 = require_jwtclient();
	Object.defineProperty(exports, "JWT", {
		enumerable: true,
		get: function() {
			return jwtclient_1.JWT;
		}
	});
	var impersonated_1 = require_impersonated();
	Object.defineProperty(exports, "Impersonated", {
		enumerable: true,
		get: function() {
			return impersonated_1.Impersonated;
		}
	});
	var oauth2client_1 = require_oauth2client();
	Object.defineProperty(exports, "CodeChallengeMethod", {
		enumerable: true,
		get: function() {
			return oauth2client_1.CodeChallengeMethod;
		}
	});
	Object.defineProperty(exports, "OAuth2Client", {
		enumerable: true,
		get: function() {
			return oauth2client_1.OAuth2Client;
		}
	});
	Object.defineProperty(exports, "ClientAuthentication", {
		enumerable: true,
		get: function() {
			return oauth2client_1.ClientAuthentication;
		}
	});
	var loginticket_1 = require_loginticket();
	Object.defineProperty(exports, "LoginTicket", {
		enumerable: true,
		get: function() {
			return loginticket_1.LoginTicket;
		}
	});
	var refreshclient_1 = require_refreshclient();
	Object.defineProperty(exports, "UserRefreshClient", {
		enumerable: true,
		get: function() {
			return refreshclient_1.UserRefreshClient;
		}
	});
	var awsclient_1 = require_awsclient();
	Object.defineProperty(exports, "AwsClient", {
		enumerable: true,
		get: function() {
			return awsclient_1.AwsClient;
		}
	});
	var awsrequestsigner_1 = require_awsrequestsigner();
	Object.defineProperty(exports, "AwsRequestSigner", {
		enumerable: true,
		get: function() {
			return awsrequestsigner_1.AwsRequestSigner;
		}
	});
	var identitypoolclient_1 = require_identitypoolclient();
	Object.defineProperty(exports, "IdentityPoolClient", {
		enumerable: true,
		get: function() {
			return identitypoolclient_1.IdentityPoolClient;
		}
	});
	var externalclient_1 = require_externalclient();
	Object.defineProperty(exports, "ExternalAccountClient", {
		enumerable: true,
		get: function() {
			return externalclient_1.ExternalAccountClient;
		}
	});
	var baseexternalclient_1 = require_baseexternalclient();
	Object.defineProperty(exports, "BaseExternalAccountClient", {
		enumerable: true,
		get: function() {
			return baseexternalclient_1.BaseExternalAccountClient;
		}
	});
	var downscopedclient_1 = require_downscopedclient();
	Object.defineProperty(exports, "DownscopedClient", {
		enumerable: true,
		get: function() {
			return downscopedclient_1.DownscopedClient;
		}
	});
	var pluggable_auth_client_1 = require_pluggable_auth_client();
	Object.defineProperty(exports, "PluggableAuthClient", {
		enumerable: true,
		get: function() {
			return pluggable_auth_client_1.PluggableAuthClient;
		}
	});
	Object.defineProperty(exports, "ExecutableError", {
		enumerable: true,
		get: function() {
			return pluggable_auth_client_1.ExecutableError;
		}
	});
	var passthrough_1 = require_passthrough();
	Object.defineProperty(exports, "PassThroughClient", {
		enumerable: true,
		get: function() {
			return passthrough_1.PassThroughClient;
		}
	});
	var transporters_1 = require_transporters();
	Object.defineProperty(exports, "DefaultTransporter", {
		enumerable: true,
		get: function() {
			return transporters_1.DefaultTransporter;
		}
	});
	exports.auth = new googleauth_1.GoogleAuth();
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/rng.js
var require_rng$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = rng;
	var _crypto$6 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var rnds8Pool = new Uint8Array(256);
	var poolPtr = rnds8Pool.length;
	function rng() {
		if (poolPtr > rnds8Pool.length - 16) {
			_crypto$6.default.randomFillSync(rnds8Pool);
			poolPtr = 0;
		}
		return rnds8Pool.slice(poolPtr, poolPtr += 16);
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/regex.js
var require_regex$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/validate.js
var require_validate$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _regex = _interopRequireDefault(require_regex$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function validate(uuid) {
		return typeof uuid === "string" && _regex.default.test(uuid);
	}
	exports.default = validate;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/stringify.js
var require_stringify$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _validate = _interopRequireDefault(require_validate$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	/**
	* Convert array of 16 byte values to UUID string format of the form:
	* XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	*/
	var byteToHex = [];
	for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).substr(1));
	function stringify(arr, offset = 0) {
		const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
		if (!(0, _validate.default)(uuid)) throw TypeError("Stringified UUID is invalid");
		return uuid;
	}
	exports.default = stringify;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/v1.js
var require_v1$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _rng = _interopRequireDefault(require_rng$1());
	var _stringify = _interopRequireDefault(require_stringify$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var _nodeId;
	var _clockseq;
	var _lastMSecs = 0;
	var _lastNSecs = 0;
	function v1(options, buf, offset) {
		let i = buf && offset || 0;
		const b = buf || new Array(16);
		options = options || {};
		let node = options.node || _nodeId;
		let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
		if (node == null || clockseq == null) {
			const seedBytes = options.random || (options.rng || _rng.default)();
			if (node == null) node = _nodeId = [
				seedBytes[0] | 1,
				seedBytes[1],
				seedBytes[2],
				seedBytes[3],
				seedBytes[4],
				seedBytes[5]
			];
			if (clockseq == null) clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
		}
		let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
		let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
		const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
		if (dt < 0 && options.clockseq === void 0) clockseq = clockseq + 1 & 16383;
		if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) nsecs = 0;
		if (nsecs >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
		_lastMSecs = msecs;
		_lastNSecs = nsecs;
		_clockseq = clockseq;
		msecs += 0xb1d069b5400;
		const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
		b[i++] = tl >>> 24 & 255;
		b[i++] = tl >>> 16 & 255;
		b[i++] = tl >>> 8 & 255;
		b[i++] = tl & 255;
		const tmh = msecs / 4294967296 * 1e4 & 268435455;
		b[i++] = tmh >>> 8 & 255;
		b[i++] = tmh & 255;
		b[i++] = tmh >>> 24 & 15 | 16;
		b[i++] = tmh >>> 16 & 255;
		b[i++] = clockseq >>> 8 | 128;
		b[i++] = clockseq & 255;
		for (let n = 0; n < 6; ++n) b[i + n] = node[n];
		return buf || (0, _stringify.default)(b);
	}
	exports.default = v1;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/parse.js
var require_parse$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _validate = _interopRequireDefault(require_validate$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function parse(uuid) {
		if (!(0, _validate.default)(uuid)) throw TypeError("Invalid UUID");
		let v;
		const arr = new Uint8Array(16);
		arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
		arr[1] = v >>> 16 & 255;
		arr[2] = v >>> 8 & 255;
		arr[3] = v & 255;
		arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
		arr[5] = v & 255;
		arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
		arr[7] = v & 255;
		arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
		arr[9] = v & 255;
		arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
		arr[11] = v / 4294967296 & 255;
		arr[12] = v >>> 24 & 255;
		arr[13] = v >>> 16 & 255;
		arr[14] = v >>> 8 & 255;
		arr[15] = v & 255;
		return arr;
	}
	exports.default = parse;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/v35.js
var require_v35$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = _default;
	exports.URL = exports.DNS = void 0;
	var _stringify = _interopRequireDefault(require_stringify$1());
	var _parse = _interopRequireDefault(require_parse$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function stringToBytes(str) {
		str = unescape(encodeURIComponent(str));
		const bytes = [];
		for (let i = 0; i < str.length; ++i) bytes.push(str.charCodeAt(i));
		return bytes;
	}
	var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
	exports.DNS = DNS;
	var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
	exports.URL = URL;
	function _default(name, version, hashfunc) {
		function generateUUID(value, namespace, buf, offset) {
			if (typeof value === "string") value = stringToBytes(value);
			if (typeof namespace === "string") namespace = (0, _parse.default)(namespace);
			if (namespace.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
			let bytes = new Uint8Array(16 + value.length);
			bytes.set(namespace);
			bytes.set(value, namespace.length);
			bytes = hashfunc(bytes);
			bytes[6] = bytes[6] & 15 | version;
			bytes[8] = bytes[8] & 63 | 128;
			if (buf) {
				offset = offset || 0;
				for (let i = 0; i < 16; ++i) buf[offset + i] = bytes[i];
				return buf;
			}
			return (0, _stringify.default)(bytes);
		}
		try {
			generateUUID.name = name;
		} catch (err) {}
		generateUUID.DNS = DNS;
		generateUUID.URL = URL;
		return generateUUID;
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/md5.js
var require_md5$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _crypto$5 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function md5(bytes) {
		if (Array.isArray(bytes)) bytes = Buffer.from(bytes);
		else if (typeof bytes === "string") bytes = Buffer.from(bytes, "utf8");
		return _crypto$5.default.createHash("md5").update(bytes).digest();
	}
	exports.default = md5;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/v3.js
var require_v3$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _v = _interopRequireDefault(require_v35$1());
	var _md = _interopRequireDefault(require_md5$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = (0, _v.default)("v3", 48, _md.default);
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/v4.js
var require_v4$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _rng = _interopRequireDefault(require_rng$1());
	var _stringify = _interopRequireDefault(require_stringify$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function v4(options, buf, offset) {
		options = options || {};
		const rnds = options.random || (options.rng || _rng.default)();
		rnds[6] = rnds[6] & 15 | 64;
		rnds[8] = rnds[8] & 63 | 128;
		if (buf) {
			offset = offset || 0;
			for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
			return buf;
		}
		return (0, _stringify.default)(rnds);
	}
	exports.default = v4;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/sha1.js
var require_sha1$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _crypto$4 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function sha1(bytes) {
		if (Array.isArray(bytes)) bytes = Buffer.from(bytes);
		else if (typeof bytes === "string") bytes = Buffer.from(bytes, "utf8");
		return _crypto$4.default.createHash("sha1").update(bytes).digest();
	}
	exports.default = sha1;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/v5.js
var require_v5$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _v = _interopRequireDefault(require_v35$1());
	var _sha = _interopRequireDefault(require_sha1$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = (0, _v.default)("v5", 80, _sha.default);
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/nil.js
var require_nil$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = "00000000-0000-0000-0000-000000000000";
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/version.js
var require_version$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _validate = _interopRequireDefault(require_validate$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function version(uuid) {
		if (!(0, _validate.default)(uuid)) throw TypeError("Invalid UUID");
		return parseInt(uuid.substr(14, 1), 16);
	}
	exports.default = version;
}));
//#endregion
//#region node_modules/@google-cloud/storage/node_modules/uuid/dist/index.js
var require_dist$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "v1", {
		enumerable: true,
		get: function() {
			return _v.default;
		}
	});
	Object.defineProperty(exports, "v3", {
		enumerable: true,
		get: function() {
			return _v2.default;
		}
	});
	Object.defineProperty(exports, "v4", {
		enumerable: true,
		get: function() {
			return _v3.default;
		}
	});
	Object.defineProperty(exports, "v5", {
		enumerable: true,
		get: function() {
			return _v4.default;
		}
	});
	Object.defineProperty(exports, "NIL", {
		enumerable: true,
		get: function() {
			return _nil.default;
		}
	});
	Object.defineProperty(exports, "version", {
		enumerable: true,
		get: function() {
			return _version.default;
		}
	});
	Object.defineProperty(exports, "validate", {
		enumerable: true,
		get: function() {
			return _validate.default;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return _stringify.default;
		}
	});
	Object.defineProperty(exports, "parse", {
		enumerable: true,
		get: function() {
			return _parse.default;
		}
	});
	var _v = _interopRequireDefault(require_v1$1());
	var _v2 = _interopRequireDefault(require_v3$1());
	var _v3 = _interopRequireDefault(require_v4$1());
	var _v4 = _interopRequireDefault(require_v5$1());
	var _nil = _interopRequireDefault(require_nil$1());
	var _version = _interopRequireDefault(require_version$1());
	var _validate = _interopRequireDefault(require_validate$1());
	var _stringify = _interopRequireDefault(require_stringify$1());
	var _parse = _interopRequireDefault(require_parse$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
}));
//#endregion
//#region node_modules/html-entities/dist/commonjs/named-references.js
var require_named_references = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __assign = exports && exports.__assign || function() {
		__assign = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.namedReferences = exports.bodyRegExps = void 0;
	var pairDivider = "~";
	var blockDivider = "~~";
	function generateNamedReferences(input, prev) {
		var entities = {};
		var characters = {};
		var blocks = input.split(blockDivider);
		var isOptionalBlock = false;
		for (var i = 0; blocks.length > i; i++) {
			var entries = blocks[i].split(pairDivider);
			for (var j = 0; j < entries.length; j += 2) {
				var entity = entries[j];
				var character = entries[j + 1];
				var fullEntity = "&" + entity + ";";
				entities[fullEntity] = character;
				if (isOptionalBlock) entities["&" + entity] = character;
				characters[character] = fullEntity;
			}
			isOptionalBlock = true;
		}
		return prev ? {
			entities: __assign(__assign({}, entities), prev.entities),
			characters: __assign(__assign({}, characters), prev.characters)
		} : {
			entities,
			characters
		};
	}
	exports.bodyRegExps = {
		xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
		html4: /&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,
		html5: /&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g
	};
	exports.namedReferences = {};
	exports.namedReferences["xml"] = generateNamedReferences("lt~<~gt~>~quot~\"~apos~'~amp~&");
	exports.namedReferences["html4"] = generateNamedReferences("apos~'~OElig~Œ~oelig~œ~Scaron~Š~scaron~š~Yuml~Ÿ~circ~ˆ~tilde~˜~ensp~ ~emsp~ ~thinsp~ ~zwnj~‌~zwj~‍~lrm~‎~rlm~‏~ndash~–~mdash~—~lsquo~‘~rsquo~’~sbquo~‚~ldquo~“~rdquo~”~bdquo~„~dagger~†~Dagger~‡~permil~‰~lsaquo~‹~rsaquo~›~euro~€~fnof~ƒ~Alpha~Α~Beta~Β~Gamma~Γ~Delta~Δ~Epsilon~Ε~Zeta~Ζ~Eta~Η~Theta~Θ~Iota~Ι~Kappa~Κ~Lambda~Λ~Mu~Μ~Nu~Ν~Xi~Ξ~Omicron~Ο~Pi~Π~Rho~Ρ~Sigma~Σ~Tau~Τ~Upsilon~Υ~Phi~Φ~Chi~Χ~Psi~Ψ~Omega~Ω~alpha~α~beta~β~gamma~γ~delta~δ~epsilon~ε~zeta~ζ~eta~η~theta~θ~iota~ι~kappa~κ~lambda~λ~mu~μ~nu~ν~xi~ξ~omicron~ο~pi~π~rho~ρ~sigmaf~ς~sigma~σ~tau~τ~upsilon~υ~phi~φ~chi~χ~psi~ψ~omega~ω~thetasym~ϑ~upsih~ϒ~piv~ϖ~bull~•~hellip~…~prime~′~Prime~″~oline~‾~frasl~⁄~weierp~℘~image~ℑ~real~ℜ~trade~™~alefsym~ℵ~larr~←~uarr~↑~rarr~→~darr~↓~harr~↔~crarr~↵~lArr~⇐~uArr~⇑~rArr~⇒~dArr~⇓~hArr~⇔~forall~∀~part~∂~exist~∃~empty~∅~nabla~∇~isin~∈~notin~∉~ni~∋~prod~∏~sum~∑~minus~−~lowast~∗~radic~√~prop~∝~infin~∞~ang~∠~and~∧~or~∨~cap~∩~cup~∪~int~∫~there4~∴~sim~∼~cong~≅~asymp~≈~ne~≠~equiv~≡~le~≤~ge~≥~sub~⊂~sup~⊃~nsub~⊄~sube~⊆~supe~⊇~oplus~⊕~otimes~⊗~perp~⊥~sdot~⋅~lceil~⌈~rceil~⌉~lfloor~⌊~rfloor~⌋~lang~〈~rang~〉~loz~◊~spades~♠~clubs~♣~hearts~♥~diams~♦~~nbsp~\xA0~iexcl~¡~cent~¢~pound~£~curren~¤~yen~¥~brvbar~¦~sect~§~uml~¨~copy~©~ordf~ª~laquo~«~not~¬~shy~­~reg~®~macr~¯~deg~°~plusmn~±~sup2~²~sup3~³~acute~´~micro~µ~para~¶~middot~·~cedil~¸~sup1~¹~ordm~º~raquo~»~frac14~¼~frac12~½~frac34~¾~iquest~¿~Agrave~À~Aacute~Á~Acirc~Â~Atilde~Ã~Auml~Ä~Aring~Å~AElig~Æ~Ccedil~Ç~Egrave~È~Eacute~É~Ecirc~Ê~Euml~Ë~Igrave~Ì~Iacute~Í~Icirc~Î~Iuml~Ï~ETH~Ð~Ntilde~Ñ~Ograve~Ò~Oacute~Ó~Ocirc~Ô~Otilde~Õ~Ouml~Ö~times~×~Oslash~Ø~Ugrave~Ù~Uacute~Ú~Ucirc~Û~Uuml~Ü~Yacute~Ý~THORN~Þ~szlig~ß~agrave~à~aacute~á~acirc~â~atilde~ã~auml~ä~aring~å~aelig~æ~ccedil~ç~egrave~è~eacute~é~ecirc~ê~euml~ë~igrave~ì~iacute~í~icirc~î~iuml~ï~eth~ð~ntilde~ñ~ograve~ò~oacute~ó~ocirc~ô~otilde~õ~ouml~ö~divide~÷~oslash~ø~ugrave~ù~uacute~ú~ucirc~û~uuml~ü~yacute~ý~thorn~þ~yuml~ÿ~quot~\"~amp~&~lt~<~gt~>");
	exports.namedReferences["html5"] = generateNamedReferences("Abreve~Ă~Acy~А~Afr~𝔄~Amacr~Ā~And~⩓~Aogon~Ą~Aopf~𝔸~ApplyFunction~⁡~Ascr~𝒜~Assign~≔~Backslash~∖~Barv~⫧~Barwed~⌆~Bcy~Б~Because~∵~Bernoullis~ℬ~Bfr~𝔅~Bopf~𝔹~Breve~˘~Bscr~ℬ~Bumpeq~≎~CHcy~Ч~Cacute~Ć~Cap~⋒~CapitalDifferentialD~ⅅ~Cayleys~ℭ~Ccaron~Č~Ccirc~Ĉ~Cconint~∰~Cdot~Ċ~Cedilla~¸~CenterDot~·~Cfr~ℭ~CircleDot~⊙~CircleMinus~⊖~CirclePlus~⊕~CircleTimes~⊗~ClockwiseContourIntegral~∲~CloseCurlyDoubleQuote~”~CloseCurlyQuote~’~Colon~∷~Colone~⩴~Congruent~≡~Conint~∯~ContourIntegral~∮~Copf~ℂ~Coproduct~∐~CounterClockwiseContourIntegral~∳~Cross~⨯~Cscr~𝒞~Cup~⋓~CupCap~≍~DD~ⅅ~DDotrahd~⤑~DJcy~Ђ~DScy~Ѕ~DZcy~Џ~Darr~↡~Dashv~⫤~Dcaron~Ď~Dcy~Д~Del~∇~Dfr~𝔇~DiacriticalAcute~´~DiacriticalDot~˙~DiacriticalDoubleAcute~˝~DiacriticalGrave~`~DiacriticalTilde~˜~Diamond~⋄~DifferentialD~ⅆ~Dopf~𝔻~Dot~¨~DotDot~⃜~DotEqual~≐~DoubleContourIntegral~∯~DoubleDot~¨~DoubleDownArrow~⇓~DoubleLeftArrow~⇐~DoubleLeftRightArrow~⇔~DoubleLeftTee~⫤~DoubleLongLeftArrow~⟸~DoubleLongLeftRightArrow~⟺~DoubleLongRightArrow~⟹~DoubleRightArrow~⇒~DoubleRightTee~⊨~DoubleUpArrow~⇑~DoubleUpDownArrow~⇕~DoubleVerticalBar~∥~DownArrow~↓~DownArrowBar~⤓~DownArrowUpArrow~⇵~DownBreve~̑~DownLeftRightVector~⥐~DownLeftTeeVector~⥞~DownLeftVector~↽~DownLeftVectorBar~⥖~DownRightTeeVector~⥟~DownRightVector~⇁~DownRightVectorBar~⥗~DownTee~⊤~DownTeeArrow~↧~Downarrow~⇓~Dscr~𝒟~Dstrok~Đ~ENG~Ŋ~Ecaron~Ě~Ecy~Э~Edot~Ė~Efr~𝔈~Element~∈~Emacr~Ē~EmptySmallSquare~◻~EmptyVerySmallSquare~▫~Eogon~Ę~Eopf~𝔼~Equal~⩵~EqualTilde~≂~Equilibrium~⇌~Escr~ℰ~Esim~⩳~Exists~∃~ExponentialE~ⅇ~Fcy~Ф~Ffr~𝔉~FilledSmallSquare~◼~FilledVerySmallSquare~▪~Fopf~𝔽~ForAll~∀~Fouriertrf~ℱ~Fscr~ℱ~GJcy~Ѓ~Gammad~Ϝ~Gbreve~Ğ~Gcedil~Ģ~Gcirc~Ĝ~Gcy~Г~Gdot~Ġ~Gfr~𝔊~Gg~⋙~Gopf~𝔾~GreaterEqual~≥~GreaterEqualLess~⋛~GreaterFullEqual~≧~GreaterGreater~⪢~GreaterLess~≷~GreaterSlantEqual~⩾~GreaterTilde~≳~Gscr~𝒢~Gt~≫~HARDcy~Ъ~Hacek~ˇ~Hat~^~Hcirc~Ĥ~Hfr~ℌ~HilbertSpace~ℋ~Hopf~ℍ~HorizontalLine~─~Hscr~ℋ~Hstrok~Ħ~HumpDownHump~≎~HumpEqual~≏~IEcy~Е~IJlig~Ĳ~IOcy~Ё~Icy~И~Idot~İ~Ifr~ℑ~Im~ℑ~Imacr~Ī~ImaginaryI~ⅈ~Implies~⇒~Int~∬~Integral~∫~Intersection~⋂~InvisibleComma~⁣~InvisibleTimes~⁢~Iogon~Į~Iopf~𝕀~Iscr~ℐ~Itilde~Ĩ~Iukcy~І~Jcirc~Ĵ~Jcy~Й~Jfr~𝔍~Jopf~𝕁~Jscr~𝒥~Jsercy~Ј~Jukcy~Є~KHcy~Х~KJcy~Ќ~Kcedil~Ķ~Kcy~К~Kfr~𝔎~Kopf~𝕂~Kscr~𝒦~LJcy~Љ~Lacute~Ĺ~Lang~⟪~Laplacetrf~ℒ~Larr~↞~Lcaron~Ľ~Lcedil~Ļ~Lcy~Л~LeftAngleBracket~⟨~LeftArrow~←~LeftArrowBar~⇤~LeftArrowRightArrow~⇆~LeftCeiling~⌈~LeftDoubleBracket~⟦~LeftDownTeeVector~⥡~LeftDownVector~⇃~LeftDownVectorBar~⥙~LeftFloor~⌊~LeftRightArrow~↔~LeftRightVector~⥎~LeftTee~⊣~LeftTeeArrow~↤~LeftTeeVector~⥚~LeftTriangle~⊲~LeftTriangleBar~⧏~LeftTriangleEqual~⊴~LeftUpDownVector~⥑~LeftUpTeeVector~⥠~LeftUpVector~↿~LeftUpVectorBar~⥘~LeftVector~↼~LeftVectorBar~⥒~Leftarrow~⇐~Leftrightarrow~⇔~LessEqualGreater~⋚~LessFullEqual~≦~LessGreater~≶~LessLess~⪡~LessSlantEqual~⩽~LessTilde~≲~Lfr~𝔏~Ll~⋘~Lleftarrow~⇚~Lmidot~Ŀ~LongLeftArrow~⟵~LongLeftRightArrow~⟷~LongRightArrow~⟶~Longleftarrow~⟸~Longleftrightarrow~⟺~Longrightarrow~⟹~Lopf~𝕃~LowerLeftArrow~↙~LowerRightArrow~↘~Lscr~ℒ~Lsh~↰~Lstrok~Ł~Lt~≪~Map~⤅~Mcy~М~MediumSpace~ ~Mellintrf~ℳ~Mfr~𝔐~MinusPlus~∓~Mopf~𝕄~Mscr~ℳ~NJcy~Њ~Nacute~Ń~Ncaron~Ň~Ncedil~Ņ~Ncy~Н~NegativeMediumSpace~​~NegativeThickSpace~​~NegativeThinSpace~​~NegativeVeryThinSpace~​~NestedGreaterGreater~≫~NestedLessLess~≪~NewLine~\n~Nfr~𝔑~NoBreak~⁠~NonBreakingSpace~\xA0~Nopf~ℕ~Not~⫬~NotCongruent~≢~NotCupCap~≭~NotDoubleVerticalBar~∦~NotElement~∉~NotEqual~≠~NotEqualTilde~≂̸~NotExists~∄~NotGreater~≯~NotGreaterEqual~≱~NotGreaterFullEqual~≧̸~NotGreaterGreater~≫̸~NotGreaterLess~≹~NotGreaterSlantEqual~⩾̸~NotGreaterTilde~≵~NotHumpDownHump~≎̸~NotHumpEqual~≏̸~NotLeftTriangle~⋪~NotLeftTriangleBar~⧏̸~NotLeftTriangleEqual~⋬~NotLess~≮~NotLessEqual~≰~NotLessGreater~≸~NotLessLess~≪̸~NotLessSlantEqual~⩽̸~NotLessTilde~≴~NotNestedGreaterGreater~⪢̸~NotNestedLessLess~⪡̸~NotPrecedes~⊀~NotPrecedesEqual~⪯̸~NotPrecedesSlantEqual~⋠~NotReverseElement~∌~NotRightTriangle~⋫~NotRightTriangleBar~⧐̸~NotRightTriangleEqual~⋭~NotSquareSubset~⊏̸~NotSquareSubsetEqual~⋢~NotSquareSuperset~⊐̸~NotSquareSupersetEqual~⋣~NotSubset~⊂⃒~NotSubsetEqual~⊈~NotSucceeds~⊁~NotSucceedsEqual~⪰̸~NotSucceedsSlantEqual~⋡~NotSucceedsTilde~≿̸~NotSuperset~⊃⃒~NotSupersetEqual~⊉~NotTilde~≁~NotTildeEqual~≄~NotTildeFullEqual~≇~NotTildeTilde~≉~NotVerticalBar~∤~Nscr~𝒩~Ocy~О~Odblac~Ő~Ofr~𝔒~Omacr~Ō~Oopf~𝕆~OpenCurlyDoubleQuote~“~OpenCurlyQuote~‘~Or~⩔~Oscr~𝒪~Otimes~⨷~OverBar~‾~OverBrace~⏞~OverBracket~⎴~OverParenthesis~⏜~PartialD~∂~Pcy~П~Pfr~𝔓~PlusMinus~±~Poincareplane~ℌ~Popf~ℙ~Pr~⪻~Precedes~≺~PrecedesEqual~⪯~PrecedesSlantEqual~≼~PrecedesTilde~≾~Product~∏~Proportion~∷~Proportional~∝~Pscr~𝒫~Qfr~𝔔~Qopf~ℚ~Qscr~𝒬~RBarr~⤐~Racute~Ŕ~Rang~⟫~Rarr~↠~Rarrtl~⤖~Rcaron~Ř~Rcedil~Ŗ~Rcy~Р~Re~ℜ~ReverseElement~∋~ReverseEquilibrium~⇋~ReverseUpEquilibrium~⥯~Rfr~ℜ~RightAngleBracket~⟩~RightArrow~→~RightArrowBar~⇥~RightArrowLeftArrow~⇄~RightCeiling~⌉~RightDoubleBracket~⟧~RightDownTeeVector~⥝~RightDownVector~⇂~RightDownVectorBar~⥕~RightFloor~⌋~RightTee~⊢~RightTeeArrow~↦~RightTeeVector~⥛~RightTriangle~⊳~RightTriangleBar~⧐~RightTriangleEqual~⊵~RightUpDownVector~⥏~RightUpTeeVector~⥜~RightUpVector~↾~RightUpVectorBar~⥔~RightVector~⇀~RightVectorBar~⥓~Rightarrow~⇒~Ropf~ℝ~RoundImplies~⥰~Rrightarrow~⇛~Rscr~ℛ~Rsh~↱~RuleDelayed~⧴~SHCHcy~Щ~SHcy~Ш~SOFTcy~Ь~Sacute~Ś~Sc~⪼~Scedil~Ş~Scirc~Ŝ~Scy~С~Sfr~𝔖~ShortDownArrow~↓~ShortLeftArrow~←~ShortRightArrow~→~ShortUpArrow~↑~SmallCircle~∘~Sopf~𝕊~Sqrt~√~Square~□~SquareIntersection~⊓~SquareSubset~⊏~SquareSubsetEqual~⊑~SquareSuperset~⊐~SquareSupersetEqual~⊒~SquareUnion~⊔~Sscr~𝒮~Star~⋆~Sub~⋐~Subset~⋐~SubsetEqual~⊆~Succeeds~≻~SucceedsEqual~⪰~SucceedsSlantEqual~≽~SucceedsTilde~≿~SuchThat~∋~Sum~∑~Sup~⋑~Superset~⊃~SupersetEqual~⊇~Supset~⋑~TRADE~™~TSHcy~Ћ~TScy~Ц~Tab~	~Tcaron~Ť~Tcedil~Ţ~Tcy~Т~Tfr~𝔗~Therefore~∴~ThickSpace~  ~ThinSpace~ ~Tilde~∼~TildeEqual~≃~TildeFullEqual~≅~TildeTilde~≈~Topf~𝕋~TripleDot~⃛~Tscr~𝒯~Tstrok~Ŧ~Uarr~↟~Uarrocir~⥉~Ubrcy~Ў~Ubreve~Ŭ~Ucy~У~Udblac~Ű~Ufr~𝔘~Umacr~Ū~UnderBar~_~UnderBrace~⏟~UnderBracket~⎵~UnderParenthesis~⏝~Union~⋃~UnionPlus~⊎~Uogon~Ų~Uopf~𝕌~UpArrow~↑~UpArrowBar~⤒~UpArrowDownArrow~⇅~UpDownArrow~↕~UpEquilibrium~⥮~UpTee~⊥~UpTeeArrow~↥~Uparrow~⇑~Updownarrow~⇕~UpperLeftArrow~↖~UpperRightArrow~↗~Upsi~ϒ~Uring~Ů~Uscr~𝒰~Utilde~Ũ~VDash~⊫~Vbar~⫫~Vcy~В~Vdash~⊩~Vdashl~⫦~Vee~⋁~Verbar~‖~Vert~‖~VerticalBar~∣~VerticalLine~|~VerticalSeparator~❘~VerticalTilde~≀~VeryThinSpace~ ~Vfr~𝔙~Vopf~𝕍~Vscr~𝒱~Vvdash~⊪~Wcirc~Ŵ~Wedge~⋀~Wfr~𝔚~Wopf~𝕎~Wscr~𝒲~Xfr~𝔛~Xopf~𝕏~Xscr~𝒳~YAcy~Я~YIcy~Ї~YUcy~Ю~Ycirc~Ŷ~Ycy~Ы~Yfr~𝔜~Yopf~𝕐~Yscr~𝒴~ZHcy~Ж~Zacute~Ź~Zcaron~Ž~Zcy~З~Zdot~Ż~ZeroWidthSpace~​~Zfr~ℨ~Zopf~ℤ~Zscr~𝒵~abreve~ă~ac~∾~acE~∾̳~acd~∿~acy~а~af~⁡~afr~𝔞~aleph~ℵ~amacr~ā~amalg~⨿~andand~⩕~andd~⩜~andslope~⩘~andv~⩚~ange~⦤~angle~∠~angmsd~∡~angmsdaa~⦨~angmsdab~⦩~angmsdac~⦪~angmsdad~⦫~angmsdae~⦬~angmsdaf~⦭~angmsdag~⦮~angmsdah~⦯~angrt~∟~angrtvb~⊾~angrtvbd~⦝~angsph~∢~angst~Å~angzarr~⍼~aogon~ą~aopf~𝕒~ap~≈~apE~⩰~apacir~⩯~ape~≊~apid~≋~approx~≈~approxeq~≊~ascr~𝒶~ast~*~asympeq~≍~awconint~∳~awint~⨑~bNot~⫭~backcong~≌~backepsilon~϶~backprime~‵~backsim~∽~backsimeq~⋍~barvee~⊽~barwed~⌅~barwedge~⌅~bbrk~⎵~bbrktbrk~⎶~bcong~≌~bcy~б~becaus~∵~because~∵~bemptyv~⦰~bepsi~϶~bernou~ℬ~beth~ℶ~between~≬~bfr~𝔟~bigcap~⋂~bigcirc~◯~bigcup~⋃~bigodot~⨀~bigoplus~⨁~bigotimes~⨂~bigsqcup~⨆~bigstar~★~bigtriangledown~▽~bigtriangleup~△~biguplus~⨄~bigvee~⋁~bigwedge~⋀~bkarow~⤍~blacklozenge~⧫~blacksquare~▪~blacktriangle~▴~blacktriangledown~▾~blacktriangleleft~◂~blacktriangleright~▸~blank~␣~blk12~▒~blk14~░~blk34~▓~block~█~bne~=⃥~bnequiv~≡⃥~bnot~⌐~bopf~𝕓~bot~⊥~bottom~⊥~bowtie~⋈~boxDL~╗~boxDR~╔~boxDl~╖~boxDr~╓~boxH~═~boxHD~╦~boxHU~╩~boxHd~╤~boxHu~╧~boxUL~╝~boxUR~╚~boxUl~╜~boxUr~╙~boxV~║~boxVH~╬~boxVL~╣~boxVR~╠~boxVh~╫~boxVl~╢~boxVr~╟~boxbox~⧉~boxdL~╕~boxdR~╒~boxdl~┐~boxdr~┌~boxh~─~boxhD~╥~boxhU~╨~boxhd~┬~boxhu~┴~boxminus~⊟~boxplus~⊞~boxtimes~⊠~boxuL~╛~boxuR~╘~boxul~┘~boxur~└~boxv~│~boxvH~╪~boxvL~╡~boxvR~╞~boxvh~┼~boxvl~┤~boxvr~├~bprime~‵~breve~˘~bscr~𝒷~bsemi~⁏~bsim~∽~bsime~⋍~bsol~\\~bsolb~⧅~bsolhsub~⟈~bullet~•~bump~≎~bumpE~⪮~bumpe~≏~bumpeq~≏~cacute~ć~capand~⩄~capbrcup~⩉~capcap~⩋~capcup~⩇~capdot~⩀~caps~∩︀~caret~⁁~caron~ˇ~ccaps~⩍~ccaron~č~ccirc~ĉ~ccups~⩌~ccupssm~⩐~cdot~ċ~cemptyv~⦲~centerdot~·~cfr~𝔠~chcy~ч~check~✓~checkmark~✓~cir~○~cirE~⧃~circeq~≗~circlearrowleft~↺~circlearrowright~↻~circledR~®~circledS~Ⓢ~circledast~⊛~circledcirc~⊚~circleddash~⊝~cire~≗~cirfnint~⨐~cirmid~⫯~cirscir~⧂~clubsuit~♣~colon~:~colone~≔~coloneq~≔~comma~,~commat~@~comp~∁~compfn~∘~complement~∁~complexes~ℂ~congdot~⩭~conint~∮~copf~𝕔~coprod~∐~copysr~℗~cross~✗~cscr~𝒸~csub~⫏~csube~⫑~csup~⫐~csupe~⫒~ctdot~⋯~cudarrl~⤸~cudarrr~⤵~cuepr~⋞~cuesc~⋟~cularr~↶~cularrp~⤽~cupbrcap~⩈~cupcap~⩆~cupcup~⩊~cupdot~⊍~cupor~⩅~cups~∪︀~curarr~↷~curarrm~⤼~curlyeqprec~⋞~curlyeqsucc~⋟~curlyvee~⋎~curlywedge~⋏~curvearrowleft~↶~curvearrowright~↷~cuvee~⋎~cuwed~⋏~cwconint~∲~cwint~∱~cylcty~⌭~dHar~⥥~daleth~ℸ~dash~‐~dashv~⊣~dbkarow~⤏~dblac~˝~dcaron~ď~dcy~д~dd~ⅆ~ddagger~‡~ddarr~⇊~ddotseq~⩷~demptyv~⦱~dfisht~⥿~dfr~𝔡~dharl~⇃~dharr~⇂~diam~⋄~diamond~⋄~diamondsuit~♦~die~¨~digamma~ϝ~disin~⋲~div~÷~divideontimes~⋇~divonx~⋇~djcy~ђ~dlcorn~⌞~dlcrop~⌍~dollar~$~dopf~𝕕~dot~˙~doteq~≐~doteqdot~≑~dotminus~∸~dotplus~∔~dotsquare~⊡~doublebarwedge~⌆~downarrow~↓~downdownarrows~⇊~downharpoonleft~⇃~downharpoonright~⇂~drbkarow~⤐~drcorn~⌟~drcrop~⌌~dscr~𝒹~dscy~ѕ~dsol~⧶~dstrok~đ~dtdot~⋱~dtri~▿~dtrif~▾~duarr~⇵~duhar~⥯~dwangle~⦦~dzcy~џ~dzigrarr~⟿~eDDot~⩷~eDot~≑~easter~⩮~ecaron~ě~ecir~≖~ecolon~≕~ecy~э~edot~ė~ee~ⅇ~efDot~≒~efr~𝔢~eg~⪚~egs~⪖~egsdot~⪘~el~⪙~elinters~⏧~ell~ℓ~els~⪕~elsdot~⪗~emacr~ē~emptyset~∅~emptyv~∅~emsp13~ ~emsp14~ ~eng~ŋ~eogon~ę~eopf~𝕖~epar~⋕~eparsl~⧣~eplus~⩱~epsi~ε~epsiv~ϵ~eqcirc~≖~eqcolon~≕~eqsim~≂~eqslantgtr~⪖~eqslantless~⪕~equals~=~equest~≟~equivDD~⩸~eqvparsl~⧥~erDot~≓~erarr~⥱~escr~ℯ~esdot~≐~esim~≂~excl~!~expectation~ℰ~exponentiale~ⅇ~fallingdotseq~≒~fcy~ф~female~♀~ffilig~ﬃ~fflig~ﬀ~ffllig~ﬄ~ffr~𝔣~filig~ﬁ~fjlig~fj~flat~♭~fllig~ﬂ~fltns~▱~fopf~𝕗~fork~⋔~forkv~⫙~fpartint~⨍~frac13~⅓~frac15~⅕~frac16~⅙~frac18~⅛~frac23~⅔~frac25~⅖~frac35~⅗~frac38~⅜~frac45~⅘~frac56~⅚~frac58~⅝~frac78~⅞~frown~⌢~fscr~𝒻~gE~≧~gEl~⪌~gacute~ǵ~gammad~ϝ~gap~⪆~gbreve~ğ~gcirc~ĝ~gcy~г~gdot~ġ~gel~⋛~geq~≥~geqq~≧~geqslant~⩾~ges~⩾~gescc~⪩~gesdot~⪀~gesdoto~⪂~gesdotol~⪄~gesl~⋛︀~gesles~⪔~gfr~𝔤~gg~≫~ggg~⋙~gimel~ℷ~gjcy~ѓ~gl~≷~glE~⪒~gla~⪥~glj~⪤~gnE~≩~gnap~⪊~gnapprox~⪊~gne~⪈~gneq~⪈~gneqq~≩~gnsim~⋧~gopf~𝕘~grave~`~gscr~ℊ~gsim~≳~gsime~⪎~gsiml~⪐~gtcc~⪧~gtcir~⩺~gtdot~⋗~gtlPar~⦕~gtquest~⩼~gtrapprox~⪆~gtrarr~⥸~gtrdot~⋗~gtreqless~⋛~gtreqqless~⪌~gtrless~≷~gtrsim~≳~gvertneqq~≩︀~gvnE~≩︀~hairsp~ ~half~½~hamilt~ℋ~hardcy~ъ~harrcir~⥈~harrw~↭~hbar~ℏ~hcirc~ĥ~heartsuit~♥~hercon~⊹~hfr~𝔥~hksearow~⤥~hkswarow~⤦~hoarr~⇿~homtht~∻~hookleftarrow~↩~hookrightarrow~↪~hopf~𝕙~horbar~―~hscr~𝒽~hslash~ℏ~hstrok~ħ~hybull~⁃~hyphen~‐~ic~⁣~icy~и~iecy~е~iff~⇔~ifr~𝔦~ii~ⅈ~iiiint~⨌~iiint~∭~iinfin~⧜~iiota~℩~ijlig~ĳ~imacr~ī~imagline~ℐ~imagpart~ℑ~imath~ı~imof~⊷~imped~Ƶ~in~∈~incare~℅~infintie~⧝~inodot~ı~intcal~⊺~integers~ℤ~intercal~⊺~intlarhk~⨗~intprod~⨼~iocy~ё~iogon~į~iopf~𝕚~iprod~⨼~iscr~𝒾~isinE~⋹~isindot~⋵~isins~⋴~isinsv~⋳~isinv~∈~it~⁢~itilde~ĩ~iukcy~і~jcirc~ĵ~jcy~й~jfr~𝔧~jmath~ȷ~jopf~𝕛~jscr~𝒿~jsercy~ј~jukcy~є~kappav~ϰ~kcedil~ķ~kcy~к~kfr~𝔨~kgreen~ĸ~khcy~х~kjcy~ќ~kopf~𝕜~kscr~𝓀~lAarr~⇚~lAtail~⤛~lBarr~⤎~lE~≦~lEg~⪋~lHar~⥢~lacute~ĺ~laemptyv~⦴~lagran~ℒ~langd~⦑~langle~⟨~lap~⪅~larrb~⇤~larrbfs~⤟~larrfs~⤝~larrhk~↩~larrlp~↫~larrpl~⤹~larrsim~⥳~larrtl~↢~lat~⪫~latail~⤙~late~⪭~lates~⪭︀~lbarr~⤌~lbbrk~❲~lbrace~{~lbrack~[~lbrke~⦋~lbrksld~⦏~lbrkslu~⦍~lcaron~ľ~lcedil~ļ~lcub~{~lcy~л~ldca~⤶~ldquor~„~ldrdhar~⥧~ldrushar~⥋~ldsh~↲~leftarrow~←~leftarrowtail~↢~leftharpoondown~↽~leftharpoonup~↼~leftleftarrows~⇇~leftrightarrow~↔~leftrightarrows~⇆~leftrightharpoons~⇋~leftrightsquigarrow~↭~leftthreetimes~⋋~leg~⋚~leq~≤~leqq~≦~leqslant~⩽~les~⩽~lescc~⪨~lesdot~⩿~lesdoto~⪁~lesdotor~⪃~lesg~⋚︀~lesges~⪓~lessapprox~⪅~lessdot~⋖~lesseqgtr~⋚~lesseqqgtr~⪋~lessgtr~≶~lesssim~≲~lfisht~⥼~lfr~𝔩~lg~≶~lgE~⪑~lhard~↽~lharu~↼~lharul~⥪~lhblk~▄~ljcy~љ~ll~≪~llarr~⇇~llcorner~⌞~llhard~⥫~lltri~◺~lmidot~ŀ~lmoust~⎰~lmoustache~⎰~lnE~≨~lnap~⪉~lnapprox~⪉~lne~⪇~lneq~⪇~lneqq~≨~lnsim~⋦~loang~⟬~loarr~⇽~lobrk~⟦~longleftarrow~⟵~longleftrightarrow~⟷~longmapsto~⟼~longrightarrow~⟶~looparrowleft~↫~looparrowright~↬~lopar~⦅~lopf~𝕝~loplus~⨭~lotimes~⨴~lowbar~_~lozenge~◊~lozf~⧫~lpar~(~lparlt~⦓~lrarr~⇆~lrcorner~⌟~lrhar~⇋~lrhard~⥭~lrtri~⊿~lscr~𝓁~lsh~↰~lsim~≲~lsime~⪍~lsimg~⪏~lsqb~[~lsquor~‚~lstrok~ł~ltcc~⪦~ltcir~⩹~ltdot~⋖~lthree~⋋~ltimes~⋉~ltlarr~⥶~ltquest~⩻~ltrPar~⦖~ltri~◃~ltrie~⊴~ltrif~◂~lurdshar~⥊~luruhar~⥦~lvertneqq~≨︀~lvnE~≨︀~mDDot~∺~male~♂~malt~✠~maltese~✠~map~↦~mapsto~↦~mapstodown~↧~mapstoleft~↤~mapstoup~↥~marker~▮~mcomma~⨩~mcy~м~measuredangle~∡~mfr~𝔪~mho~℧~mid~∣~midast~*~midcir~⫰~minusb~⊟~minusd~∸~minusdu~⨪~mlcp~⫛~mldr~…~mnplus~∓~models~⊧~mopf~𝕞~mp~∓~mscr~𝓂~mstpos~∾~multimap~⊸~mumap~⊸~nGg~⋙̸~nGt~≫⃒~nGtv~≫̸~nLeftarrow~⇍~nLeftrightarrow~⇎~nLl~⋘̸~nLt~≪⃒~nLtv~≪̸~nRightarrow~⇏~nVDash~⊯~nVdash~⊮~nacute~ń~nang~∠⃒~nap~≉~napE~⩰̸~napid~≋̸~napos~ŉ~napprox~≉~natur~♮~natural~♮~naturals~ℕ~nbump~≎̸~nbumpe~≏̸~ncap~⩃~ncaron~ň~ncedil~ņ~ncong~≇~ncongdot~⩭̸~ncup~⩂~ncy~н~neArr~⇗~nearhk~⤤~nearr~↗~nearrow~↗~nedot~≐̸~nequiv~≢~nesear~⤨~nesim~≂̸~nexist~∄~nexists~∄~nfr~𝔫~ngE~≧̸~nge~≱~ngeq~≱~ngeqq~≧̸~ngeqslant~⩾̸~nges~⩾̸~ngsim~≵~ngt~≯~ngtr~≯~nhArr~⇎~nharr~↮~nhpar~⫲~nis~⋼~nisd~⋺~niv~∋~njcy~њ~nlArr~⇍~nlE~≦̸~nlarr~↚~nldr~‥~nle~≰~nleftarrow~↚~nleftrightarrow~↮~nleq~≰~nleqq~≦̸~nleqslant~⩽̸~nles~⩽̸~nless~≮~nlsim~≴~nlt~≮~nltri~⋪~nltrie~⋬~nmid~∤~nopf~𝕟~notinE~⋹̸~notindot~⋵̸~notinva~∉~notinvb~⋷~notinvc~⋶~notni~∌~notniva~∌~notnivb~⋾~notnivc~⋽~npar~∦~nparallel~∦~nparsl~⫽⃥~npart~∂̸~npolint~⨔~npr~⊀~nprcue~⋠~npre~⪯̸~nprec~⊀~npreceq~⪯̸~nrArr~⇏~nrarr~↛~nrarrc~⤳̸~nrarrw~↝̸~nrightarrow~↛~nrtri~⋫~nrtrie~⋭~nsc~⊁~nsccue~⋡~nsce~⪰̸~nscr~𝓃~nshortmid~∤~nshortparallel~∦~nsim~≁~nsime~≄~nsimeq~≄~nsmid~∤~nspar~∦~nsqsube~⋢~nsqsupe~⋣~nsubE~⫅̸~nsube~⊈~nsubset~⊂⃒~nsubseteq~⊈~nsubseteqq~⫅̸~nsucc~⊁~nsucceq~⪰̸~nsup~⊅~nsupE~⫆̸~nsupe~⊉~nsupset~⊃⃒~nsupseteq~⊉~nsupseteqq~⫆̸~ntgl~≹~ntlg~≸~ntriangleleft~⋪~ntrianglelefteq~⋬~ntriangleright~⋫~ntrianglerighteq~⋭~num~#~numero~№~numsp~ ~nvDash~⊭~nvHarr~⤄~nvap~≍⃒~nvdash~⊬~nvge~≥⃒~nvgt~>⃒~nvinfin~⧞~nvlArr~⤂~nvle~≤⃒~nvlt~<⃒~nvltrie~⊴⃒~nvrArr~⤃~nvrtrie~⊵⃒~nvsim~∼⃒~nwArr~⇖~nwarhk~⤣~nwarr~↖~nwarrow~↖~nwnear~⤧~oS~Ⓢ~oast~⊛~ocir~⊚~ocy~о~odash~⊝~odblac~ő~odiv~⨸~odot~⊙~odsold~⦼~ofcir~⦿~ofr~𝔬~ogon~˛~ogt~⧁~ohbar~⦵~ohm~Ω~oint~∮~olarr~↺~olcir~⦾~olcross~⦻~olt~⧀~omacr~ō~omid~⦶~ominus~⊖~oopf~𝕠~opar~⦷~operp~⦹~orarr~↻~ord~⩝~order~ℴ~orderof~ℴ~origof~⊶~oror~⩖~orslope~⩗~orv~⩛~oscr~ℴ~osol~⊘~otimesas~⨶~ovbar~⌽~par~∥~parallel~∥~parsim~⫳~parsl~⫽~pcy~п~percnt~%~period~.~pertenk~‱~pfr~𝔭~phiv~ϕ~phmmat~ℳ~phone~☎~pitchfork~⋔~planck~ℏ~planckh~ℎ~plankv~ℏ~plus~+~plusacir~⨣~plusb~⊞~pluscir~⨢~plusdo~∔~plusdu~⨥~pluse~⩲~plussim~⨦~plustwo~⨧~pm~±~pointint~⨕~popf~𝕡~pr~≺~prE~⪳~prap~⪷~prcue~≼~pre~⪯~prec~≺~precapprox~⪷~preccurlyeq~≼~preceq~⪯~precnapprox~⪹~precneqq~⪵~precnsim~⋨~precsim~≾~primes~ℙ~prnE~⪵~prnap~⪹~prnsim~⋨~profalar~⌮~profline~⌒~profsurf~⌓~propto~∝~prsim~≾~prurel~⊰~pscr~𝓅~puncsp~ ~qfr~𝔮~qint~⨌~qopf~𝕢~qprime~⁗~qscr~𝓆~quaternions~ℍ~quatint~⨖~quest~?~questeq~≟~rAarr~⇛~rAtail~⤜~rBarr~⤏~rHar~⥤~race~∽̱~racute~ŕ~raemptyv~⦳~rangd~⦒~range~⦥~rangle~⟩~rarrap~⥵~rarrb~⇥~rarrbfs~⤠~rarrc~⤳~rarrfs~⤞~rarrhk~↪~rarrlp~↬~rarrpl~⥅~rarrsim~⥴~rarrtl~↣~rarrw~↝~ratail~⤚~ratio~∶~rationals~ℚ~rbarr~⤍~rbbrk~❳~rbrace~}~rbrack~]~rbrke~⦌~rbrksld~⦎~rbrkslu~⦐~rcaron~ř~rcedil~ŗ~rcub~}~rcy~р~rdca~⤷~rdldhar~⥩~rdquor~”~rdsh~↳~realine~ℛ~realpart~ℜ~reals~ℝ~rect~▭~rfisht~⥽~rfr~𝔯~rhard~⇁~rharu~⇀~rharul~⥬~rhov~ϱ~rightarrow~→~rightarrowtail~↣~rightharpoondown~⇁~rightharpoonup~⇀~rightleftarrows~⇄~rightleftharpoons~⇌~rightrightarrows~⇉~rightsquigarrow~↝~rightthreetimes~⋌~ring~˚~risingdotseq~≓~rlarr~⇄~rlhar~⇌~rmoust~⎱~rmoustache~⎱~rnmid~⫮~roang~⟭~roarr~⇾~robrk~⟧~ropar~⦆~ropf~𝕣~roplus~⨮~rotimes~⨵~rpar~)~rpargt~⦔~rppolint~⨒~rrarr~⇉~rscr~𝓇~rsh~↱~rsqb~]~rsquor~’~rthree~⋌~rtimes~⋊~rtri~▹~rtrie~⊵~rtrif~▸~rtriltri~⧎~ruluhar~⥨~rx~℞~sacute~ś~sc~≻~scE~⪴~scap~⪸~sccue~≽~sce~⪰~scedil~ş~scirc~ŝ~scnE~⪶~scnap~⪺~scnsim~⋩~scpolint~⨓~scsim~≿~scy~с~sdotb~⊡~sdote~⩦~seArr~⇘~searhk~⤥~searr~↘~searrow~↘~semi~;~seswar~⤩~setminus~∖~setmn~∖~sext~✶~sfr~𝔰~sfrown~⌢~sharp~♯~shchcy~щ~shcy~ш~shortmid~∣~shortparallel~∥~sigmav~ς~simdot~⩪~sime~≃~simeq~≃~simg~⪞~simgE~⪠~siml~⪝~simlE~⪟~simne~≆~simplus~⨤~simrarr~⥲~slarr~←~smallsetminus~∖~smashp~⨳~smeparsl~⧤~smid~∣~smile~⌣~smt~⪪~smte~⪬~smtes~⪬︀~softcy~ь~sol~/~solb~⧄~solbar~⌿~sopf~𝕤~spadesuit~♠~spar~∥~sqcap~⊓~sqcaps~⊓︀~sqcup~⊔~sqcups~⊔︀~sqsub~⊏~sqsube~⊑~sqsubset~⊏~sqsubseteq~⊑~sqsup~⊐~sqsupe~⊒~sqsupset~⊐~sqsupseteq~⊒~squ~□~square~□~squarf~▪~squf~▪~srarr~→~sscr~𝓈~ssetmn~∖~ssmile~⌣~sstarf~⋆~star~☆~starf~★~straightepsilon~ϵ~straightphi~ϕ~strns~¯~subE~⫅~subdot~⪽~subedot~⫃~submult~⫁~subnE~⫋~subne~⊊~subplus~⪿~subrarr~⥹~subset~⊂~subseteq~⊆~subseteqq~⫅~subsetneq~⊊~subsetneqq~⫋~subsim~⫇~subsub~⫕~subsup~⫓~succ~≻~succapprox~⪸~succcurlyeq~≽~succeq~⪰~succnapprox~⪺~succneqq~⪶~succnsim~⋩~succsim~≿~sung~♪~supE~⫆~supdot~⪾~supdsub~⫘~supedot~⫄~suphsol~⟉~suphsub~⫗~suplarr~⥻~supmult~⫂~supnE~⫌~supne~⊋~supplus~⫀~supset~⊃~supseteq~⊇~supseteqq~⫆~supsetneq~⊋~supsetneqq~⫌~supsim~⫈~supsub~⫔~supsup~⫖~swArr~⇙~swarhk~⤦~swarr~↙~swarrow~↙~swnwar~⤪~target~⌖~tbrk~⎴~tcaron~ť~tcedil~ţ~tcy~т~tdot~⃛~telrec~⌕~tfr~𝔱~therefore~∴~thetav~ϑ~thickapprox~≈~thicksim~∼~thkap~≈~thksim~∼~timesb~⊠~timesbar~⨱~timesd~⨰~tint~∭~toea~⤨~top~⊤~topbot~⌶~topcir~⫱~topf~𝕥~topfork~⫚~tosa~⤩~tprime~‴~triangle~▵~triangledown~▿~triangleleft~◃~trianglelefteq~⊴~triangleq~≜~triangleright~▹~trianglerighteq~⊵~tridot~◬~trie~≜~triminus~⨺~triplus~⨹~trisb~⧍~tritime~⨻~trpezium~⏢~tscr~𝓉~tscy~ц~tshcy~ћ~tstrok~ŧ~twixt~≬~twoheadleftarrow~↞~twoheadrightarrow~↠~uHar~⥣~ubrcy~ў~ubreve~ŭ~ucy~у~udarr~⇅~udblac~ű~udhar~⥮~ufisht~⥾~ufr~𝔲~uharl~↿~uharr~↾~uhblk~▀~ulcorn~⌜~ulcorner~⌜~ulcrop~⌏~ultri~◸~umacr~ū~uogon~ų~uopf~𝕦~uparrow~↑~updownarrow~↕~upharpoonleft~↿~upharpoonright~↾~uplus~⊎~upsi~υ~upuparrows~⇈~urcorn~⌝~urcorner~⌝~urcrop~⌎~uring~ů~urtri~◹~uscr~𝓊~utdot~⋰~utilde~ũ~utri~▵~utrif~▴~uuarr~⇈~uwangle~⦧~vArr~⇕~vBar~⫨~vBarv~⫩~vDash~⊨~vangrt~⦜~varepsilon~ϵ~varkappa~ϰ~varnothing~∅~varphi~ϕ~varpi~ϖ~varpropto~∝~varr~↕~varrho~ϱ~varsigma~ς~varsubsetneq~⊊︀~varsubsetneqq~⫋︀~varsupsetneq~⊋︀~varsupsetneqq~⫌︀~vartheta~ϑ~vartriangleleft~⊲~vartriangleright~⊳~vcy~в~vdash~⊢~vee~∨~veebar~⊻~veeeq~≚~vellip~⋮~verbar~|~vert~|~vfr~𝔳~vltri~⊲~vnsub~⊂⃒~vnsup~⊃⃒~vopf~𝕧~vprop~∝~vrtri~⊳~vscr~𝓋~vsubnE~⫋︀~vsubne~⊊︀~vsupnE~⫌︀~vsupne~⊋︀~vzigzag~⦚~wcirc~ŵ~wedbar~⩟~wedge~∧~wedgeq~≙~wfr~𝔴~wopf~𝕨~wp~℘~wr~≀~wreath~≀~wscr~𝓌~xcap~⋂~xcirc~◯~xcup~⋃~xdtri~▽~xfr~𝔵~xhArr~⟺~xharr~⟷~xlArr~⟸~xlarr~⟵~xmap~⟼~xnis~⋻~xodot~⨀~xopf~𝕩~xoplus~⨁~xotime~⨂~xrArr~⟹~xrarr~⟶~xscr~𝓍~xsqcup~⨆~xuplus~⨄~xutri~△~xvee~⋁~xwedge~⋀~yacy~я~ycirc~ŷ~ycy~ы~yfr~𝔶~yicy~ї~yopf~𝕪~yscr~𝓎~yucy~ю~zacute~ź~zcaron~ž~zcy~з~zdot~ż~zeetrf~ℨ~zfr~𝔷~zhcy~ж~zigrarr~⇝~zopf~𝕫~zscr~𝓏~~AMP~&~COPY~©~GT~>~LT~<~QUOT~\"~REG~®", exports.namedReferences["html4"]);
}));
//#endregion
//#region node_modules/html-entities/dist/commonjs/numeric-unicode-map.js
var require_numeric_unicode_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.numericUnicodeMap = void 0;
	exports.numericUnicodeMap = {
		0: 65533,
		128: 8364,
		130: 8218,
		131: 402,
		132: 8222,
		133: 8230,
		134: 8224,
		135: 8225,
		136: 710,
		137: 8240,
		138: 352,
		139: 8249,
		140: 338,
		142: 381,
		145: 8216,
		146: 8217,
		147: 8220,
		148: 8221,
		149: 8226,
		150: 8211,
		151: 8212,
		152: 732,
		153: 8482,
		154: 353,
		155: 8250,
		156: 339,
		158: 382,
		159: 376
	};
}));
//#endregion
//#region node_modules/html-entities/dist/commonjs/surrogate-pairs.js
var require_surrogate_pairs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.highSurrogateTo = exports.highSurrogateFrom = exports.getCodePoint = exports.fromCodePoint = void 0;
	exports.fromCodePoint = String.fromCodePoint || function(astralCodePoint) {
		return String.fromCharCode(Math.floor((astralCodePoint - 65536) / 1024) + 55296, (astralCodePoint - 65536) % 1024 + 56320);
	};
	exports.getCodePoint = String.prototype.codePointAt ? function(input, position) {
		return input.codePointAt(position);
	} : function(input, position) {
		return (input.charCodeAt(position) - 55296) * 1024 + input.charCodeAt(position + 1) - 56320 + 65536;
	};
	exports.highSurrogateFrom = 55296;
	exports.highSurrogateTo = 56319;
}));
//#endregion
//#region node_modules/html-entities/dist/commonjs/index.js
var require_commonjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __assign = exports && exports.__assign || function() {
		__assign = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encode = encode;
	exports.decodeEntity = decodeEntity;
	exports.decode = decode;
	var named_references_js_1 = require_named_references();
	var numeric_unicode_map_js_1 = require_numeric_unicode_map();
	var surrogate_pairs_js_1 = require_surrogate_pairs();
	var allNamedReferences = __assign(__assign({}, named_references_js_1.namedReferences), { all: named_references_js_1.namedReferences.html5 });
	var encodeRegExps = {
		specialChars: /[<>'"&]/g,
		nonAscii: /[<>'"&\u0080-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
		nonAsciiPrintable: /[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
		nonAsciiPrintableOnly: /[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g,
		extensive: /[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF\uDC00-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g
	};
	var defaultEncodeOptions = {
		mode: "specialChars",
		level: "all",
		numeric: "decimal"
	};
	/** Encodes all the necessary (specified by `level`) characters in the text */
	function encode(text, _a) {
		var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? "specialChars" : _c, _d = _b.numeric, numeric = _d === void 0 ? "decimal" : _d, _e = _b.level, level = _e === void 0 ? "all" : _e;
		if (!text) return "";
		var encodeRegExp = encodeRegExps[mode];
		var references = allNamedReferences[level].characters;
		var isHex = numeric === "hexadecimal";
		return String.prototype.replace.call(text, encodeRegExp, function(input) {
			var result = references[input];
			if (!result) {
				var code = input.length > 1 ? (0, surrogate_pairs_js_1.getCodePoint)(input, 0) : input.charCodeAt(0);
				result = (isHex ? "&#x" + code.toString(16) : "&#" + code) + ";";
			}
			return result;
		});
	}
	var defaultDecodeOptions = {
		scope: "body",
		level: "all"
	};
	var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
	var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
	var baseDecodeRegExps = {
		xml: {
			strict,
			attribute,
			body: named_references_js_1.bodyRegExps.xml
		},
		html4: {
			strict,
			attribute,
			body: named_references_js_1.bodyRegExps.html4
		},
		html5: {
			strict,
			attribute,
			body: named_references_js_1.bodyRegExps.html5
		}
	};
	var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
	var fromCharCode = String.fromCharCode;
	var outOfBoundsChar = fromCharCode(65533);
	var defaultDecodeEntityOptions = { level: "all" };
	function getDecodedEntity(entity, references, isAttribute, isStrict) {
		var decodeResult = entity;
		var decodeEntityLastChar = entity[entity.length - 1];
		if (isAttribute && decodeEntityLastChar === "=") decodeResult = entity;
		else if (isStrict && decodeEntityLastChar !== ";") decodeResult = entity;
		else {
			var decodeResultByReference = references[entity];
			if (decodeResultByReference) decodeResult = decodeResultByReference;
			else if (entity[0] === "&" && entity[1] === "#") {
				var decodeSecondChar = entity[2];
				var decodeCode = decodeSecondChar == "x" || decodeSecondChar == "X" ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
				decodeResult = decodeCode >= 1114111 ? outOfBoundsChar : decodeCode > 65535 ? (0, surrogate_pairs_js_1.fromCodePoint)(decodeCode) : fromCharCode(numeric_unicode_map_js_1.numericUnicodeMap[decodeCode] || decodeCode);
			}
		}
		return decodeResult;
	}
	/** Decodes a single entity */
	function decodeEntity(entity, _a) {
		var _c = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _c === void 0 ? "all" : _c;
		if (!entity) return "";
		return getDecodedEntity(entity, allNamedReferences[level].entities, false, false);
	}
	/** Decodes all entities in the text */
	function decode(text, _a) {
		var _b = _a === void 0 ? defaultDecodeOptions : _a, _c = _b.level, level = _c === void 0 ? "all" : _c, _d = _b.scope, scope = _d === void 0 ? level === "xml" ? "strict" : "body" : _d;
		if (!text) return "";
		var decodeRegExp = decodeRegExps[level][scope];
		var references = allNamedReferences[level].entities;
		var isAttribute = scope === "attribute";
		var isStrict = scope === "strict";
		return text.replace(decodeRegExp, function(entity) {
			return getDecodedEntity(entity, references, isAttribute, isStrict);
		});
	}
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/rng.js
var require_rng = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = rng;
	var _crypto$3 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var rnds8Pool = new Uint8Array(256);
	var poolPtr = rnds8Pool.length;
	function rng() {
		if (poolPtr > rnds8Pool.length - 16) {
			_crypto$3.default.randomFillSync(rnds8Pool);
			poolPtr = 0;
		}
		return rnds8Pool.slice(poolPtr, poolPtr += 16);
	}
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/regex.js
var require_regex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/validate.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _regex = _interopRequireDefault(require_regex());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function validate(uuid) {
		return typeof uuid === "string" && _regex.default.test(uuid);
	}
	exports.default = validate;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.unsafeStringify = unsafeStringify;
	var _validate = _interopRequireDefault(require_validate());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	/**
	* Convert array of 16 byte values to UUID string format of the form:
	* XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	*/
	var byteToHex = [];
	for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
	function unsafeStringify(arr, offset = 0) {
		return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
	}
	function stringify(arr, offset = 0) {
		const uuid = unsafeStringify(arr, offset);
		if (!(0, _validate.default)(uuid)) throw TypeError("Stringified UUID is invalid");
		return uuid;
	}
	exports.default = stringify;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/v1.js
var require_v1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _rng = _interopRequireDefault(require_rng());
	var _stringify = require_stringify();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var _nodeId;
	var _clockseq;
	var _lastMSecs = 0;
	var _lastNSecs = 0;
	function v1(options, buf, offset) {
		let i = buf && offset || 0;
		const b = buf || new Array(16);
		options = options || {};
		let node = options.node || _nodeId;
		let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
		if (node == null || clockseq == null) {
			const seedBytes = options.random || (options.rng || _rng.default)();
			if (node == null) node = _nodeId = [
				seedBytes[0] | 1,
				seedBytes[1],
				seedBytes[2],
				seedBytes[3],
				seedBytes[4],
				seedBytes[5]
			];
			if (clockseq == null) clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
		}
		let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
		let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
		const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
		if (dt < 0 && options.clockseq === void 0) clockseq = clockseq + 1 & 16383;
		if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) nsecs = 0;
		if (nsecs >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
		_lastMSecs = msecs;
		_lastNSecs = nsecs;
		_clockseq = clockseq;
		msecs += 0xb1d069b5400;
		const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
		b[i++] = tl >>> 24 & 255;
		b[i++] = tl >>> 16 & 255;
		b[i++] = tl >>> 8 & 255;
		b[i++] = tl & 255;
		const tmh = msecs / 4294967296 * 1e4 & 268435455;
		b[i++] = tmh >>> 8 & 255;
		b[i++] = tmh & 255;
		b[i++] = tmh >>> 24 & 15 | 16;
		b[i++] = tmh >>> 16 & 255;
		b[i++] = clockseq >>> 8 | 128;
		b[i++] = clockseq & 255;
		for (let n = 0; n < 6; ++n) b[i + n] = node[n];
		return buf || (0, _stringify.unsafeStringify)(b);
	}
	exports.default = v1;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _validate = _interopRequireDefault(require_validate());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function parse(uuid) {
		if (!(0, _validate.default)(uuid)) throw TypeError("Invalid UUID");
		let v;
		const arr = new Uint8Array(16);
		arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
		arr[1] = v >>> 16 & 255;
		arr[2] = v >>> 8 & 255;
		arr[3] = v & 255;
		arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
		arr[5] = v & 255;
		arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
		arr[7] = v & 255;
		arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
		arr[9] = v & 255;
		arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
		arr[11] = v / 4294967296 & 255;
		arr[12] = v >>> 24 & 255;
		arr[13] = v >>> 16 & 255;
		arr[14] = v >>> 8 & 255;
		arr[15] = v & 255;
		return arr;
	}
	exports.default = parse;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/v35.js
var require_v35 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.URL = exports.DNS = void 0;
	exports.default = v35;
	var _stringify = require_stringify();
	var _parse = _interopRequireDefault(require_parse());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function stringToBytes(str) {
		str = unescape(encodeURIComponent(str));
		const bytes = [];
		for (let i = 0; i < str.length; ++i) bytes.push(str.charCodeAt(i));
		return bytes;
	}
	var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
	exports.DNS = DNS;
	var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
	exports.URL = URL;
	function v35(name, version, hashfunc) {
		function generateUUID(value, namespace, buf, offset) {
			var _namespace;
			if (typeof value === "string") value = stringToBytes(value);
			if (typeof namespace === "string") namespace = (0, _parse.default)(namespace);
			if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
			let bytes = new Uint8Array(16 + value.length);
			bytes.set(namespace);
			bytes.set(value, namespace.length);
			bytes = hashfunc(bytes);
			bytes[6] = bytes[6] & 15 | version;
			bytes[8] = bytes[8] & 63 | 128;
			if (buf) {
				offset = offset || 0;
				for (let i = 0; i < 16; ++i) buf[offset + i] = bytes[i];
				return buf;
			}
			return (0, _stringify.unsafeStringify)(bytes);
		}
		try {
			generateUUID.name = name;
		} catch (err) {}
		generateUUID.DNS = DNS;
		generateUUID.URL = URL;
		return generateUUID;
	}
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/md5.js
var require_md5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _crypto$2 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function md5(bytes) {
		if (Array.isArray(bytes)) bytes = Buffer.from(bytes);
		else if (typeof bytes === "string") bytes = Buffer.from(bytes, "utf8");
		return _crypto$2.default.createHash("md5").update(bytes).digest();
	}
	exports.default = md5;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/v3.js
var require_v3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _v = _interopRequireDefault(require_v35());
	var _md = _interopRequireDefault(require_md5());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = (0, _v.default)("v3", 48, _md.default);
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/native.js
var require_native = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _crypto$1 = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = { randomUUID: _crypto$1.default.randomUUID };
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/v4.js
var require_v4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _native = _interopRequireDefault(require_native());
	var _rng = _interopRequireDefault(require_rng());
	var _stringify = require_stringify();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function v4(options, buf, offset) {
		if (_native.default.randomUUID && !buf && !options) return _native.default.randomUUID();
		options = options || {};
		const rnds = options.random || (options.rng || _rng.default)();
		rnds[6] = rnds[6] & 15 | 64;
		rnds[8] = rnds[8] & 63 | 128;
		if (buf) {
			offset = offset || 0;
			for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
			return buf;
		}
		return (0, _stringify.unsafeStringify)(rnds);
	}
	exports.default = v4;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/sha1.js
var require_sha1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _crypto = _interopRequireDefault(__require("crypto"));
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function sha1(bytes) {
		if (Array.isArray(bytes)) bytes = Buffer.from(bytes);
		else if (typeof bytes === "string") bytes = Buffer.from(bytes, "utf8");
		return _crypto.default.createHash("sha1").update(bytes).digest();
	}
	exports.default = sha1;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/v5.js
var require_v5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _v = _interopRequireDefault(require_v35());
	var _sha = _interopRequireDefault(require_sha1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = (0, _v.default)("v5", 80, _sha.default);
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/nil.js
var require_nil = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = "00000000-0000-0000-0000-000000000000";
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var _validate = _interopRequireDefault(require_validate());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function version(uuid) {
		if (!(0, _validate.default)(uuid)) throw TypeError("Invalid UUID");
		return parseInt(uuid.slice(14, 15), 16);
	}
	exports.default = version;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/uuid/dist/index.js
var require_dist$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "NIL", {
		enumerable: true,
		get: function() {
			return _nil.default;
		}
	});
	Object.defineProperty(exports, "parse", {
		enumerable: true,
		get: function() {
			return _parse.default;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return _stringify.default;
		}
	});
	Object.defineProperty(exports, "v1", {
		enumerable: true,
		get: function() {
			return _v.default;
		}
	});
	Object.defineProperty(exports, "v3", {
		enumerable: true,
		get: function() {
			return _v2.default;
		}
	});
	Object.defineProperty(exports, "v4", {
		enumerable: true,
		get: function() {
			return _v3.default;
		}
	});
	Object.defineProperty(exports, "v5", {
		enumerable: true,
		get: function() {
			return _v4.default;
		}
	});
	Object.defineProperty(exports, "validate", {
		enumerable: true,
		get: function() {
			return _validate.default;
		}
	});
	Object.defineProperty(exports, "version", {
		enumerable: true,
		get: function() {
			return _version.default;
		}
	});
	var _v = _interopRequireDefault(require_v1());
	var _v2 = _interopRequireDefault(require_v3());
	var _v3 = _interopRequireDefault(require_v4());
	var _v4 = _interopRequireDefault(require_v5());
	var _nil = _interopRequireDefault(require_nil());
	var _version = _interopRequireDefault(require_version());
	var _validate = _interopRequireDefault(require_validate());
	var _stringify = _interopRequireDefault(require_stringify());
	var _parse = _interopRequireDefault(require_parse());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
}));
//#endregion
//#region node_modules/@tootallnate/once/dist/index.js
var require_dist$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function once(emitter, name, { signal } = {}) {
		return new Promise((resolve, reject) => {
			function cleanup() {
				signal === null || signal === void 0 || signal.removeEventListener("abort", onAbort);
				emitter.removeListener(name, onEvent);
				emitter.removeListener("error", onError);
			}
			function onEvent(...args) {
				cleanup();
				resolve(args);
			}
			function onError(err) {
				cleanup();
				reject(err);
			}
			function onAbort() {
				cleanup();
				const err = /* @__PURE__ */ new Error("The operation was aborted");
				err.name = "AbortError";
				reject(err);
			}
			if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
				onAbort();
				return;
			}
			signal === null || signal === void 0 || signal.addEventListener("abort", onAbort);
			emitter.on(name, onEvent);
			emitter.on("error", onError);
		});
	}
	exports.default = once;
}));
//#endregion
//#region node_modules/http-proxy-agent/node_modules/agent-base/dist/src/promisify.js
var require_promisify$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function promisify(fn) {
		return function(req, opts) {
			return new Promise((resolve, reject) => {
				fn.call(this, req, opts, (err, rtn) => {
					if (err) reject(err);
					else resolve(rtn);
				});
			});
		};
	}
	exports.default = promisify;
}));
//#endregion
//#region node_modules/http-proxy-agent/node_modules/agent-base/dist/src/index.js
var require_src$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var events_1$2 = __require("events");
	var debug_1 = __importDefault(require_src$9());
	var promisify_1 = __importDefault(require_promisify$1());
	var debug = debug_1.default("agent-base");
	function isAgent(v) {
		return Boolean(v) && typeof v.addRequest === "function";
	}
	function isSecureEndpoint() {
		const { stack } = /* @__PURE__ */ new Error();
		if (typeof stack !== "string") return false;
		return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
	}
	function createAgent(callback, opts) {
		return new createAgent.Agent(callback, opts);
	}
	(function(createAgent) {
		/**
		* Base `http.Agent` implementation.
		* No pooling/keep-alive is implemented by default.
		*
		* @param {Function} callback
		* @api public
		*/
		class Agent extends events_1$2.EventEmitter {
			constructor(callback, _opts) {
				super();
				let opts = _opts;
				if (typeof callback === "function") this.callback = callback;
				else if (callback) opts = callback;
				this.timeout = null;
				if (opts && typeof opts.timeout === "number") this.timeout = opts.timeout;
				this.maxFreeSockets = 1;
				this.maxSockets = 1;
				this.maxTotalSockets = Infinity;
				this.sockets = {};
				this.freeSockets = {};
				this.requests = {};
				this.options = {};
			}
			get defaultPort() {
				if (typeof this.explicitDefaultPort === "number") return this.explicitDefaultPort;
				return isSecureEndpoint() ? 443 : 80;
			}
			set defaultPort(v) {
				this.explicitDefaultPort = v;
			}
			get protocol() {
				if (typeof this.explicitProtocol === "string") return this.explicitProtocol;
				return isSecureEndpoint() ? "https:" : "http:";
			}
			set protocol(v) {
				this.explicitProtocol = v;
			}
			callback(req, opts, fn) {
				throw new Error("\"agent-base\" has no default implementation, you must subclass and override `callback()`");
			}
			/**
			* Called by node-core's "_http_client.js" module when creating
			* a new HTTP request with this Agent instance.
			*
			* @api public
			*/
			addRequest(req, _opts) {
				const opts = Object.assign({}, _opts);
				if (typeof opts.secureEndpoint !== "boolean") opts.secureEndpoint = isSecureEndpoint();
				if (opts.host == null) opts.host = "localhost";
				if (opts.port == null) opts.port = opts.secureEndpoint ? 443 : 80;
				if (opts.protocol == null) opts.protocol = opts.secureEndpoint ? "https:" : "http:";
				if (opts.host && opts.path) delete opts.path;
				delete opts.agent;
				delete opts.hostname;
				delete opts._defaultAgent;
				delete opts.defaultPort;
				delete opts.createConnection;
				req._last = true;
				req.shouldKeepAlive = false;
				let timedOut = false;
				let timeoutId = null;
				const timeoutMs = opts.timeout || this.timeout;
				const onerror = (err) => {
					if (req._hadError) return;
					req.emit("error", err);
					req._hadError = true;
				};
				const ontimeout = () => {
					timeoutId = null;
					timedOut = true;
					const err = /* @__PURE__ */ new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
					err.code = "ETIMEOUT";
					onerror(err);
				};
				const callbackError = (err) => {
					if (timedOut) return;
					if (timeoutId !== null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					onerror(err);
				};
				const onsocket = (socket) => {
					if (timedOut) return;
					if (timeoutId != null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					if (isAgent(socket)) {
						debug("Callback returned another Agent instance %o", socket.constructor.name);
						socket.addRequest(req, opts);
						return;
					}
					if (socket) {
						socket.once("free", () => {
							this.freeSocket(socket, opts);
						});
						req.onSocket(socket);
						return;
					}
					onerror(/* @__PURE__ */ new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``));
				};
				if (typeof this.callback !== "function") {
					onerror(/* @__PURE__ */ new Error("`callback` is not defined"));
					return;
				}
				if (!this.promisifiedCallback) if (this.callback.length >= 3) {
					debug("Converting legacy callback function to promise");
					this.promisifiedCallback = promisify_1.default(this.callback);
				} else this.promisifiedCallback = this.callback;
				if (typeof timeoutMs === "number" && timeoutMs > 0) timeoutId = setTimeout(ontimeout, timeoutMs);
				if ("port" in opts && typeof opts.port !== "number") opts.port = Number(opts.port);
				try {
					debug("Resolving socket for %o request: %o", opts.protocol, `${req.method} ${req.path}`);
					Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
				} catch (err) {
					Promise.reject(err).catch(callbackError);
				}
			}
			freeSocket(socket, opts) {
				debug("Freeing socket %o %o", socket.constructor.name, opts);
				socket.destroy();
			}
			destroy() {
				debug("Destroying agent %o", this.constructor.name);
			}
		}
		createAgent.Agent = Agent;
		createAgent.prototype = createAgent.Agent.prototype;
	})(createAgent || (createAgent = {}));
	module.exports = createAgent;
}));
//#endregion
//#region node_modules/http-proxy-agent/dist/agent.js
var require_agent$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var net_1$1 = __importDefault(__require("net"));
	var tls_1$1 = __importDefault(__require("tls"));
	var url_1$3 = __importDefault(__require("url"));
	var debug_1 = __importDefault(require_src$9());
	var once_1 = __importDefault(require_dist$2());
	var agent_base_1 = require_src$3();
	var debug = (0, debug_1.default)("http-proxy-agent");
	function isHTTPS(protocol) {
		return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
	}
	/**
	* The `HttpProxyAgent` implements an HTTP Agent subclass that connects
	* to the specified "HTTP proxy server" in order to proxy HTTP requests.
	*
	* @api public
	*/
	var HttpProxyAgent = class extends agent_base_1.Agent {
		constructor(_opts) {
			let opts;
			if (typeof _opts === "string") opts = url_1$3.default.parse(_opts);
			else opts = _opts;
			if (!opts) throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
			debug("Creating new HttpProxyAgent instance: %o", opts);
			super(opts);
			const proxy = Object.assign({}, opts);
			this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
			proxy.host = proxy.hostname || proxy.host;
			if (typeof proxy.port === "string") proxy.port = parseInt(proxy.port, 10);
			if (!proxy.port && proxy.host) proxy.port = this.secureProxy ? 443 : 80;
			if (proxy.host && proxy.path) {
				delete proxy.path;
				delete proxy.pathname;
			}
			this.proxy = proxy;
		}
		/**
		* Called when the node-core HTTP client library is creating a
		* new HTTP request.
		*
		* @api protected
		*/
		callback(req, opts) {
			return __awaiter(this, void 0, void 0, function* () {
				const { proxy, secureProxy } = this;
				const parsed = url_1$3.default.parse(req.path);
				if (!parsed.protocol) parsed.protocol = "http:";
				if (!parsed.hostname) parsed.hostname = opts.hostname || opts.host || null;
				if (parsed.port == null && typeof opts.port) parsed.port = String(opts.port);
				if (parsed.port === "80") parsed.port = "";
				req.path = url_1$3.default.format(parsed);
				if (proxy.auth) req.setHeader("Proxy-Authorization", `Basic ${Buffer.from(proxy.auth).toString("base64")}`);
				let socket;
				if (secureProxy) {
					debug("Creating `tls.Socket`: %o", proxy);
					socket = tls_1$1.default.connect(proxy);
				} else {
					debug("Creating `net.Socket`: %o", proxy);
					socket = net_1$1.default.connect(proxy);
				}
				if (req._header) {
					let first;
					let endOfHeaders;
					debug("Regenerating stored HTTP header string for request");
					req._header = null;
					req._implicitHeader();
					if (req.output && req.output.length > 0) {
						debug("Patching connection write() output buffer with updated header");
						first = req.output[0];
						endOfHeaders = first.indexOf("\r\n\r\n") + 4;
						req.output[0] = req._header + first.substring(endOfHeaders);
						debug("Output buffer: %o", req.output);
					} else if (req.outputData && req.outputData.length > 0) {
						debug("Patching connection write() output buffer with updated header");
						first = req.outputData[0].data;
						endOfHeaders = first.indexOf("\r\n\r\n") + 4;
						req.outputData[0].data = req._header + first.substring(endOfHeaders);
						debug("Output buffer: %o", req.outputData[0].data);
					}
				}
				yield (0, once_1.default)(socket, "connect");
				return socket;
			});
		}
	};
	exports.default = HttpProxyAgent;
}));
//#endregion
//#region node_modules/http-proxy-agent/dist/index.js
var require_dist$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var agent_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(require_agent$1());
	function createHttpProxyAgent(opts) {
		return new agent_1.default(opts);
	}
	(function(createHttpProxyAgent) {
		createHttpProxyAgent.HttpProxyAgent = agent_1.default;
		createHttpProxyAgent.prototype = agent_1.default.prototype;
	})(createHttpProxyAgent || (createHttpProxyAgent = {}));
	module.exports = createHttpProxyAgent;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/agent-base/dist/src/promisify.js
var require_promisify = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function promisify(fn) {
		return function(req, opts) {
			return new Promise((resolve, reject) => {
				fn.call(this, req, opts, (err, rtn) => {
					if (err) reject(err);
					else resolve(rtn);
				});
			});
		};
	}
	exports.default = promisify;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/agent-base/dist/src/index.js
var require_src$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var events_1$1 = __require("events");
	var debug_1 = __importDefault(require_src$9());
	var promisify_1 = __importDefault(require_promisify());
	var debug = debug_1.default("agent-base");
	function isAgent(v) {
		return Boolean(v) && typeof v.addRequest === "function";
	}
	function isSecureEndpoint() {
		const { stack } = /* @__PURE__ */ new Error();
		if (typeof stack !== "string") return false;
		return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
	}
	function createAgent(callback, opts) {
		return new createAgent.Agent(callback, opts);
	}
	(function(createAgent) {
		/**
		* Base `http.Agent` implementation.
		* No pooling/keep-alive is implemented by default.
		*
		* @param {Function} callback
		* @api public
		*/
		class Agent extends events_1$1.EventEmitter {
			constructor(callback, _opts) {
				super();
				let opts = _opts;
				if (typeof callback === "function") this.callback = callback;
				else if (callback) opts = callback;
				this.timeout = null;
				if (opts && typeof opts.timeout === "number") this.timeout = opts.timeout;
				this.maxFreeSockets = 1;
				this.maxSockets = 1;
				this.maxTotalSockets = Infinity;
				this.sockets = {};
				this.freeSockets = {};
				this.requests = {};
				this.options = {};
			}
			get defaultPort() {
				if (typeof this.explicitDefaultPort === "number") return this.explicitDefaultPort;
				return isSecureEndpoint() ? 443 : 80;
			}
			set defaultPort(v) {
				this.explicitDefaultPort = v;
			}
			get protocol() {
				if (typeof this.explicitProtocol === "string") return this.explicitProtocol;
				return isSecureEndpoint() ? "https:" : "http:";
			}
			set protocol(v) {
				this.explicitProtocol = v;
			}
			callback(req, opts, fn) {
				throw new Error("\"agent-base\" has no default implementation, you must subclass and override `callback()`");
			}
			/**
			* Called by node-core's "_http_client.js" module when creating
			* a new HTTP request with this Agent instance.
			*
			* @api public
			*/
			addRequest(req, _opts) {
				const opts = Object.assign({}, _opts);
				if (typeof opts.secureEndpoint !== "boolean") opts.secureEndpoint = isSecureEndpoint();
				if (opts.host == null) opts.host = "localhost";
				if (opts.port == null) opts.port = opts.secureEndpoint ? 443 : 80;
				if (opts.protocol == null) opts.protocol = opts.secureEndpoint ? "https:" : "http:";
				if (opts.host && opts.path) delete opts.path;
				delete opts.agent;
				delete opts.hostname;
				delete opts._defaultAgent;
				delete opts.defaultPort;
				delete opts.createConnection;
				req._last = true;
				req.shouldKeepAlive = false;
				let timedOut = false;
				let timeoutId = null;
				const timeoutMs = opts.timeout || this.timeout;
				const onerror = (err) => {
					if (req._hadError) return;
					req.emit("error", err);
					req._hadError = true;
				};
				const ontimeout = () => {
					timeoutId = null;
					timedOut = true;
					const err = /* @__PURE__ */ new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
					err.code = "ETIMEOUT";
					onerror(err);
				};
				const callbackError = (err) => {
					if (timedOut) return;
					if (timeoutId !== null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					onerror(err);
				};
				const onsocket = (socket) => {
					if (timedOut) return;
					if (timeoutId != null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					if (isAgent(socket)) {
						debug("Callback returned another Agent instance %o", socket.constructor.name);
						socket.addRequest(req, opts);
						return;
					}
					if (socket) {
						socket.once("free", () => {
							this.freeSocket(socket, opts);
						});
						req.onSocket(socket);
						return;
					}
					onerror(/* @__PURE__ */ new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``));
				};
				if (typeof this.callback !== "function") {
					onerror(/* @__PURE__ */ new Error("`callback` is not defined"));
					return;
				}
				if (!this.promisifiedCallback) if (this.callback.length >= 3) {
					debug("Converting legacy callback function to promise");
					this.promisifiedCallback = promisify_1.default(this.callback);
				} else this.promisifiedCallback = this.callback;
				if (typeof timeoutMs === "number" && timeoutMs > 0) timeoutId = setTimeout(ontimeout, timeoutMs);
				if ("port" in opts && typeof opts.port !== "number") opts.port = Number(opts.port);
				try {
					debug("Resolving socket for %o request: %o", opts.protocol, `${req.method} ${req.path}`);
					Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
				} catch (err) {
					Promise.reject(err).catch(callbackError);
				}
			}
			freeSocket(socket, opts) {
				debug("Freeing socket %o %o", socket.constructor.name, opts);
				socket.destroy();
			}
			destroy() {
				debug("Destroying agent %o", this.constructor.name);
			}
		}
		createAgent.Agent = Agent;
		createAgent.prototype = createAgent.Agent.prototype;
	})(createAgent || (createAgent = {}));
	module.exports = createAgent;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/https-proxy-agent/dist/parse-proxy-response.js
var require_parse_proxy_response = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var debug = __importDefault(require_src$9()).default("https-proxy-agent:parse-proxy-response");
	function parseProxyResponse(socket) {
		return new Promise((resolve, reject) => {
			let buffersLength = 0;
			const buffers = [];
			function read() {
				const b = socket.read();
				if (b) ondata(b);
				else socket.once("readable", read);
			}
			function cleanup() {
				socket.removeListener("end", onend);
				socket.removeListener("error", onerror);
				socket.removeListener("close", onclose);
				socket.removeListener("readable", read);
			}
			function onclose(err) {
				debug("onclose had error %o", err);
			}
			function onend() {
				debug("onend");
			}
			function onerror(err) {
				cleanup();
				debug("onerror %o", err);
				reject(err);
			}
			function ondata(b) {
				buffers.push(b);
				buffersLength += b.length;
				const buffered = Buffer.concat(buffers, buffersLength);
				if (buffered.indexOf("\r\n\r\n") === -1) {
					debug("have not received end of HTTP headers yet...");
					read();
					return;
				}
				const firstLine = buffered.toString("ascii", 0, buffered.indexOf("\r\n"));
				const statusCode = +firstLine.split(" ")[1];
				debug("got proxy server response: %o", firstLine);
				resolve({
					statusCode,
					buffered
				});
			}
			socket.on("error", onerror);
			socket.on("close", onclose);
			socket.on("end", onend);
			read();
		});
	}
	exports.default = parseProxyResponse;
}));
//#endregion
//#region node_modules/teeny-request/node_modules/https-proxy-agent/dist/agent.js
var require_agent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var net_1 = __importDefault(__require("net"));
	var tls_1 = __importDefault(__require("tls"));
	var url_1$2 = __importDefault(__require("url"));
	var assert_1 = __importDefault(__require("assert"));
	var debug_1 = __importDefault(require_src$9());
	var agent_base_1 = require_src$2();
	var parse_proxy_response_1 = __importDefault(require_parse_proxy_response());
	var debug = debug_1.default("https-proxy-agent:agent");
	/**
	* The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
	* the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
	*
	* Outgoing HTTP requests are first tunneled through the proxy server using the
	* `CONNECT` HTTP request method to establish a connection to the proxy server,
	* and then the proxy server connects to the destination target and issues the
	* HTTP request from the proxy server.
	*
	* `https:` requests have their socket connection upgraded to TLS once
	* the connection to the proxy server has been established.
	*
	* @api public
	*/
	var HttpsProxyAgent = class extends agent_base_1.Agent {
		constructor(_opts) {
			let opts;
			if (typeof _opts === "string") opts = url_1$2.default.parse(_opts);
			else opts = _opts;
			if (!opts) throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
			debug("creating new HttpsProxyAgent instance: %o", opts);
			super(opts);
			const proxy = Object.assign({}, opts);
			this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
			proxy.host = proxy.hostname || proxy.host;
			if (typeof proxy.port === "string") proxy.port = parseInt(proxy.port, 10);
			if (!proxy.port && proxy.host) proxy.port = this.secureProxy ? 443 : 80;
			if (this.secureProxy && !("ALPNProtocols" in proxy)) proxy.ALPNProtocols = ["http 1.1"];
			if (proxy.host && proxy.path) {
				delete proxy.path;
				delete proxy.pathname;
			}
			this.proxy = proxy;
		}
		/**
		* Called when the node-core HTTP client library is creating a
		* new HTTP request.
		*
		* @api protected
		*/
		callback(req, opts) {
			return __awaiter(this, void 0, void 0, function* () {
				const { proxy, secureProxy } = this;
				let socket;
				if (secureProxy) {
					debug("Creating `tls.Socket`: %o", proxy);
					socket = tls_1.default.connect(proxy);
				} else {
					debug("Creating `net.Socket`: %o", proxy);
					socket = net_1.default.connect(proxy);
				}
				const headers = Object.assign({}, proxy.headers);
				let payload = `CONNECT ${`${opts.host}:${opts.port}`} HTTP/1.1\r\n`;
				if (proxy.auth) headers["Proxy-Authorization"] = `Basic ${Buffer.from(proxy.auth).toString("base64")}`;
				let { host, port, secureEndpoint } = opts;
				if (!isDefaultPort(port, secureEndpoint)) host += `:${port}`;
				headers.Host = host;
				headers.Connection = "close";
				for (const name of Object.keys(headers)) payload += `${name}: ${headers[name]}\r\n`;
				const proxyResponsePromise = parse_proxy_response_1.default(socket);
				socket.write(`${payload}\r\n`);
				const { statusCode, buffered } = yield proxyResponsePromise;
				if (statusCode === 200) {
					req.once("socket", resume);
					if (opts.secureEndpoint) {
						debug("Upgrading socket connection to TLS");
						const servername = opts.servername || opts.host;
						return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, "host", "hostname", "path", "port")), {
							socket,
							servername
						}));
					}
					return socket;
				}
				socket.destroy();
				const fakeSocket = new net_1.default.Socket({ writable: false });
				fakeSocket.readable = true;
				req.once("socket", (s) => {
					debug("replaying proxy buffer for failed request");
					assert_1.default(s.listenerCount("data") > 0);
					s.push(buffered);
					s.push(null);
				});
				return fakeSocket;
			});
		}
	};
	exports.default = HttpsProxyAgent;
	function resume(socket) {
		socket.resume();
	}
	function isDefaultPort(port, secure) {
		return Boolean(!secure && port === 80 || secure && port === 443);
	}
	function isHTTPS(protocol) {
		return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
	}
	function omit(obj, ...keys) {
		const ret = {};
		let key;
		for (key in obj) if (!keys.includes(key)) ret[key] = obj[key];
		return ret;
	}
}));
//#endregion
//#region node_modules/teeny-request/node_modules/https-proxy-agent/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var agent_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(require_agent());
	function createHttpsProxyAgent(opts) {
		return new agent_1.default(opts);
	}
	(function(createHttpsProxyAgent) {
		createHttpsProxyAgent.HttpsProxyAgent = agent_1.default;
		createHttpsProxyAgent.prototype = agent_1.default.prototype;
	})(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
	module.exports = createHttpsProxyAgent;
}));
//#endregion
//#region node_modules/teeny-request/build/src/agents.js
var require_agents = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* @license
	* Copyright 2019 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAgent = exports.pool = void 0;
	var http_1 = __require("http");
	var https_1 = __require("https");
	var url_1$1 = __require("url");
	exports.pool = /* @__PURE__ */ new Map();
	/**
	* Determines if a proxy should be considered based on the environment.
	*
	* @param uri The request uri
	* @returns {boolean}
	*/
	function shouldUseProxyForURI(uri) {
		const noProxyEnv = process.env.NO_PROXY || process.env.no_proxy;
		if (!noProxyEnv) return true;
		const givenURI = new URL(uri);
		for (const noProxyRaw of noProxyEnv.split(",")) {
			const noProxy = noProxyRaw.trim();
			if (noProxy === givenURI.origin || noProxy === givenURI.hostname) return false;
			else if (noProxy.startsWith("*.") || noProxy.startsWith(".")) {
				const noProxyWildcard = noProxy.replace(/^\*\./, ".");
				if (givenURI.hostname.endsWith(noProxyWildcard)) return false;
			}
		}
		return true;
	}
	/**
	* Returns a custom request Agent if one is found, otherwise returns undefined
	* which will result in the global http(s) Agent being used.
	* @private
	* @param {string} uri The request uri
	* @param {Options} reqOpts The request options
	* @returns {HttpAnyAgent|undefined}
	*/
	function getAgent(uri, reqOpts) {
		const isHttp = uri.startsWith("http://");
		const proxy = reqOpts.proxy || process.env.HTTP_PROXY || process.env.http_proxy || process.env.HTTPS_PROXY || process.env.https_proxy;
		const poolOptions = Object.assign({}, reqOpts.pool);
		const shouldUseProxy = !!reqOpts.proxy || shouldUseProxyForURI(uri);
		if (proxy && shouldUseProxy) return new (isHttp ? require_dist$1() : require_dist())({
			...(0, url_1$1.parse)(proxy),
			...poolOptions
		});
		let key = isHttp ? "http" : "https";
		if (reqOpts.forever) {
			key += ":forever";
			if (!exports.pool.has(key)) {
				const Agent = isHttp ? http_1.Agent : https_1.Agent;
				exports.pool.set(key, new Agent({
					...poolOptions,
					keepAlive: true
				}));
			}
		}
		return exports.pool.get(key);
	}
	exports.getAgent = getAgent;
}));
//#endregion
//#region node_modules/teeny-request/build/src/TeenyStatistics.js
var require_TeenyStatistics = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* @license
	* Copyright 2020 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TeenyStatistics = exports.TeenyStatisticsWarning = void 0;
	/**
	* @class TeenyStatisticsWarning
	* @extends Error
	* @description While an error, is used for emitting warnings when
	*   meeting certain configured thresholds.
	* @see process.emitWarning
	*/
	var TeenyStatisticsWarning = class extends Error {
		/**
		* @param {string} message
		*/
		constructor(message) {
			super(message);
			this.threshold = 0;
			this.type = "";
			this.value = 0;
			this.name = this.constructor.name;
			Error.captureStackTrace(this, this.constructor);
		}
	};
	exports.TeenyStatisticsWarning = TeenyStatisticsWarning;
	TeenyStatisticsWarning.CONCURRENT_REQUESTS = "ConcurrentRequestsExceededWarning";
	/**
	* @class TeenyStatistics
	* @description Maintain various statistics internal to teeny-request. Tracking
	*   is not automatic and must be instrumented within teeny-request.
	*/
	var TeenyStatistics = class TeenyStatistics {
		/**
		* @param {TeenyStatisticsOptions} [opts]
		*/
		constructor(opts) {
			/**
			* @type {number}
			* @private
			* @default 0
			*/
			this._concurrentRequests = 0;
			/**
			* @type {boolean}
			* @private
			* @default false
			*/
			this._didConcurrentRequestWarn = false;
			this._options = TeenyStatistics._prepareOptions(opts);
		}
		/**
		* Returns a copy of the current options.
		* @return {TeenyStatisticsOptions}
		*/
		getOptions() {
			return Object.assign({}, this._options);
		}
		/**
		* Change configured statistics options. This will not preserve unspecified
		*   options that were previously specified, i.e. this is a reset of options.
		* @param {TeenyStatisticsOptions} [opts]
		* @returns {TeenyStatisticsConfig} The previous options.
		* @see _prepareOptions
		*/
		setOptions(opts) {
			const oldOpts = this._options;
			this._options = TeenyStatistics._prepareOptions(opts);
			return oldOpts;
		}
		/**
		* @readonly
		* @return {TeenyStatisticsCounters}
		*/
		get counters() {
			return { concurrentRequests: this._concurrentRequests };
		}
		/**
		* @description Should call this right before making a request.
		*/
		requestStarting() {
			this._concurrentRequests++;
			if (this._options.concurrentRequests > 0 && this._concurrentRequests >= this._options.concurrentRequests && !this._didConcurrentRequestWarn) {
				this._didConcurrentRequestWarn = true;
				const warning = new TeenyStatisticsWarning("Possible excessive concurrent requests detected. " + this._concurrentRequests + " requests in-flight, which exceeds the configured threshold of " + this._options.concurrentRequests + ". Use the TEENY_REQUEST_WARN_CONCURRENT_REQUESTS environment variable or the concurrentRequests option of teeny-request to increase or disable (0) this warning.");
				warning.type = TeenyStatisticsWarning.CONCURRENT_REQUESTS;
				warning.value = this._concurrentRequests;
				warning.threshold = this._options.concurrentRequests;
				process.emitWarning(warning);
			}
		}
		/**
		* @description When using `requestStarting`, call this after the request
		*   has finished.
		*/
		requestFinished() {
			this._concurrentRequests--;
		}
		/**
		* Configuration Precedence:
		*   1. Dependency inversion via defined option.
		*   2. Global numeric environment variable.
		*   3. Built-in default.
		* This will not preserve unspecified options previously specified.
		* @param {TeenyStatisticsOptions} [opts]
		* @returns {TeenyStatisticsOptions}
		* @private
		*/
		static _prepareOptions({ concurrentRequests: diConcurrentRequests } = {}) {
			let concurrentRequests = this.DEFAULT_WARN_CONCURRENT_REQUESTS;
			const envConcurrentRequests = Number(process.env.TEENY_REQUEST_WARN_CONCURRENT_REQUESTS);
			if (diConcurrentRequests !== void 0) concurrentRequests = diConcurrentRequests;
			else if (!Number.isNaN(envConcurrentRequests)) concurrentRequests = envConcurrentRequests;
			return { concurrentRequests };
		}
	};
	exports.TeenyStatistics = TeenyStatistics;
	/**
	* @description A default threshold representing when to warn about excessive
	*   in-flight/concurrent requests.
	* @type {number}
	* @static
	* @readonly
	* @default 5000
	*/
	TeenyStatistics.DEFAULT_WARN_CONCURRENT_REQUESTS = 5e3;
}));
//#endregion
//#region node_modules/stubs/index.js
var require_stubs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function stubs(obj, method, cfg, stub) {
		if (!obj || !method || !obj[method]) throw new Error("You must provide an object and a key for an existing method");
		if (!stub) {
			stub = cfg;
			cfg = {};
		}
		stub = stub || function() {};
		cfg.callthrough = cfg.callthrough || false;
		cfg.calls = cfg.calls || 0;
		var norevert = cfg.calls === 0;
		var cached = obj[method].bind(obj);
		obj[method] = function() {
			var args = [].slice.call(arguments);
			var returnVal;
			if (cfg.callthrough) returnVal = cached.apply(obj, args);
			returnVal = stub.apply(obj, args) || returnVal;
			if (!norevert && --cfg.calls === 0) obj[method] = cached;
			return returnVal;
		};
	};
}));
//#endregion
//#region node_modules/stream-events/index.js
var require_stream_events = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stubs = require_stubs();
	function StreamEvents(stream) {
		stream = stream || this;
		var cfg = {
			callthrough: true,
			calls: 1
		};
		stubs(stream, "_read", cfg, stream.emit.bind(stream, "reading"));
		stubs(stream, "_write", cfg, stream.emit.bind(stream, "writing"));
		return stream;
	}
	module.exports = StreamEvents;
}));
//#endregion
//#region node_modules/teeny-request/build/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* @license
	* Copyright 2018 Google LLC
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.teenyRequest = exports.RequestError = void 0;
	var node_fetch_1 = (init_lib(), __toCommonJS(lib_exports));
	var stream_1$7 = __require("stream");
	var uuid = require_dist$3();
	var agents_1 = require_agents();
	var TeenyStatistics_1 = require_TeenyStatistics();
	var streamEvents = require_stream_events();
	var RequestError = class extends Error {};
	exports.RequestError = RequestError;
	/**
	* Convert options from Request to Fetch format
	* @private
	* @param reqOpts Request options
	*/
	function requestToFetchOptions(reqOpts) {
		const options = {
			method: reqOpts.method || "GET",
			...reqOpts.timeout && { timeout: reqOpts.timeout },
			...typeof reqOpts.gzip === "boolean" && { compress: reqOpts.gzip }
		};
		if (typeof reqOpts.json === "object") {
			reqOpts.headers = reqOpts.headers || {};
			reqOpts.headers["Content-Type"] = "application/json";
			options.body = JSON.stringify(reqOpts.json);
		} else if (Buffer.isBuffer(reqOpts.body)) options.body = reqOpts.body;
		else if (typeof reqOpts.body !== "string") options.body = JSON.stringify(reqOpts.body);
		else options.body = reqOpts.body;
		options.headers = reqOpts.headers;
		let uri = reqOpts.uri || reqOpts.url;
		if (!uri) throw new Error("Missing uri or url in reqOpts.");
		if (reqOpts.useQuerystring === true || typeof reqOpts.qs === "object") {
			const params = __require("querystring").stringify(reqOpts.qs);
			uri = uri + "?" + params;
		}
		options.agent = (0, agents_1.getAgent)(uri, reqOpts);
		return {
			uri,
			options
		};
	}
	/**
	* Convert a response from `fetch` to `request` format.
	* @private
	* @param opts The `request` options used to create the request.
	* @param res The Fetch response
	* @returns A `request` response object
	*/
	function fetchToRequestResponse(opts, res) {
		const request = {};
		request.agent = opts.agent || false;
		request.headers = opts.headers || {};
		request.href = res.url;
		const resHeaders = {};
		res.headers.forEach((value, key) => resHeaders[key] = value);
		return Object.assign(res.body, {
			statusCode: res.status,
			statusMessage: res.statusText,
			request,
			body: res.body,
			headers: resHeaders,
			toJSON: () => ({ headers: resHeaders })
		});
	}
	/**
	* Create POST body from two parts as multipart/related content-type
	* @private
	* @param boundary
	* @param multipart
	*/
	function createMultipartStream(boundary, multipart) {
		const finale = `--${boundary}--`;
		const stream = new stream_1$7.PassThrough();
		for (const part of multipart) {
			const preamble = `--${boundary}\r\nContent-Type: ${part["Content-Type"]}\r\n\r\n`;
			stream.write(preamble);
			if (typeof part.body === "string") {
				stream.write(part.body);
				stream.write("\r\n");
			} else {
				part.body.pipe(stream, { end: false });
				part.body.on("end", () => {
					stream.write("\r\n");
					stream.write(finale);
					stream.end();
				});
			}
		}
		return stream;
	}
	function teenyRequest(reqOpts, callback) {
		const { uri, options } = requestToFetchOptions(reqOpts);
		const multipart = reqOpts.multipart;
		if (reqOpts.multipart && multipart.length === 2) {
			if (!callback) throw new Error("Multipart without callback is not implemented.");
			const boundary = uuid.v4();
			options.headers["Content-Type"] = `multipart/related; boundary=${boundary}`;
			options.body = createMultipartStream(boundary, multipart);
			teenyRequest.stats.requestStarting();
			(0, node_fetch_1.default)(uri, options).then((res) => {
				teenyRequest.stats.requestFinished();
				const header = res.headers.get("content-type");
				const response = fetchToRequestResponse(options, res);
				const body = response.body;
				if (header === "application/json" || header === "application/json; charset=utf-8") {
					res.json().then((json) => {
						response.body = json;
						callback(null, response, json);
					}, (err) => {
						callback(err, response, body);
					});
					return;
				}
				res.text().then((text) => {
					response.body = text;
					callback(null, response, text);
				}, (err) => {
					callback(err, response, body);
				});
			}, (err) => {
				teenyRequest.stats.requestFinished();
				callback(err, null, null);
			});
			return;
		}
		if (callback === void 0) {
			const requestStream = streamEvents(new stream_1$7.PassThrough());
			let responseStream;
			requestStream.once("reading", () => {
				if (responseStream) (0, stream_1$7.pipeline)(responseStream, requestStream, () => {});
				else requestStream.once("response", () => {
					(0, stream_1$7.pipeline)(responseStream, requestStream, () => {});
				});
			});
			options.compress = false;
			teenyRequest.stats.requestStarting();
			(0, node_fetch_1.default)(uri, options).then((res) => {
				teenyRequest.stats.requestFinished();
				responseStream = res.body;
				responseStream.on("error", (err) => {
					requestStream.emit("error", err);
				});
				const response = fetchToRequestResponse(options, res);
				requestStream.emit("response", response);
			}, (err) => {
				teenyRequest.stats.requestFinished();
				requestStream.emit("error", err);
			});
			return requestStream;
		}
		teenyRequest.stats.requestStarting();
		(0, node_fetch_1.default)(uri, options).then((res) => {
			teenyRequest.stats.requestFinished();
			const header = res.headers.get("content-type");
			const response = fetchToRequestResponse(options, res);
			const body = response.body;
			if (header === "application/json" || header === "application/json; charset=utf-8") {
				if (response.statusCode === 204) {
					callback(null, response, body);
					return;
				}
				res.json().then((json) => {
					response.body = json;
					callback(null, response, json);
				}, (err) => {
					callback(err, response, body);
				});
				return;
			}
			res.text().then((text) => {
				const response = fetchToRequestResponse(options, res);
				response.body = text;
				callback(null, response, text);
			}, (err) => {
				callback(err, response, body);
			});
		}, (err) => {
			teenyRequest.stats.requestFinished();
			callback(err, null, null);
		});
	}
	exports.teenyRequest = teenyRequest;
	teenyRequest.defaults = (defaults) => {
		return (reqOpts, callback) => {
			const opts = {
				...defaults,
				...reqOpts
			};
			if (callback === void 0) return teenyRequest(opts);
			teenyRequest(opts, callback);
		};
	};
	/**
	* Single instance of an interface for keeping track of things.
	*/
	teenyRequest.stats = new TeenyStatistics_1.TeenyStatistics();
	teenyRequest.resetStats = () => {
		teenyRequest.stats = new TeenyStatistics_1.TeenyStatistics(teenyRequest.stats.getOptions());
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	author: () => author,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	engines: () => engines,
	exports: () => exports$1,
	files: () => files,
	keywords: () => keywords,
	license: () => license,
	main: () => main,
	name: () => name,
	repository: () => repository,
	scripts: () => scripts,
	type: () => type,
	types: () => types,
	version: () => version
});
var name, description, version, license, author, engines, repository, main, types, type, exports$1, files, keywords, scripts, dependencies, devDependencies, package_default;
var init_package = __esmMin((() => {
	name = "@google-cloud/storage";
	description = "Cloud Storage Client Library for Node.js";
	version = "7.19.0";
	license = "Apache-2.0";
	author = "Google Inc.";
	engines = { "node": ">=14" };
	repository = "googleapis/nodejs-storage";
	main = "./build/cjs/src/index.js";
	types = "./build/cjs/src/index.d.ts";
	type = "module";
	exports$1 = { ".": {
		"import": {
			"types": "./build/esm/src/index.d.ts",
			"default": "./build/esm/src/index.js"
		},
		"require": {
			"types": "./build/cjs/src/index.d.ts",
			"default": "./build/cjs/src/index.js"
		}
	} };
	files = [
		"build/cjs/src",
		"build/cjs/package.json",
		"!build/cjs/src/**/*.map",
		"build/esm/src",
		"!build/esm/src/**/*.map"
	];
	keywords = [
		"google apis client",
		"google api client",
		"google apis",
		"google api",
		"google",
		"google cloud platform",
		"google cloud",
		"cloud",
		"google storage",
		"storage"
	];
	scripts = {
		"all-test": "npm test && npm run system-test && npm run samples-test",
		"benchwrapper": "node bin/benchwrapper.js",
		"check": "gts check",
		"clean": "rm -rf build/",
		"compile:cjs": "tsc -p ./tsconfig.cjs.json",
		"compile:esm": "tsc -p .",
		"compile": "npm run compile:cjs && npm run compile:esm",
		"conformance-test": "mocha --parallel build/cjs/conformance-test/ --require build/cjs/conformance-test/globalHooks.js",
		"docs-test": "linkinator docs",
		"docs": "jsdoc -c .jsdoc.json",
		"fix": "gts fix",
		"lint": "gts check",
		"postcompile": "cp ./src/package-json-helper.cjs ./build/cjs/src && cp ./src/package-json-helper.cjs ./build/esm/src",
		"postcompile:cjs": "babel --plugins gapic-tools/build/src/replaceImportMetaUrl,gapic-tools/build/src/toggleESMFlagVariable build/cjs/src/util.js -o build/cjs/src/util.js && cp internal-tooling/helpers/package.cjs.json build/cjs/package.json",
		"precompile": "rm -rf build/",
		"preconformance-test": "npm run compile:cjs -- --sourceMap",
		"predocs-test": "npm run docs",
		"predocs": "npm run compile:cjs -- --sourceMap",
		"prelint": "cd samples; npm link ../; npm install",
		"prepare": "npm run compile",
		"presystem-test:esm": "npm run compile:esm",
		"presystem-test": "npm run compile -- --sourceMap",
		"pretest": "npm run compile -- --sourceMap",
		"samples-test": "npm link && cd samples/ && npm link ../ && npm test && cd ../",
		"system-test:esm": "mocha build/esm/system-test --timeout 600000 --exit",
		"system-test": "mocha build/cjs/system-test --timeout 600000 --exit",
		"test": "c8 mocha build/cjs/test"
	};
	dependencies = {
		"@google-cloud/paginator": "^5.0.0",
		"@google-cloud/projectify": "^4.0.0",
		"@google-cloud/promisify": "<4.1.0",
		"abort-controller": "^3.0.0",
		"async-retry": "^1.3.3",
		"duplexify": "^4.1.3",
		"fast-xml-parser": "^5.3.4",
		"gaxios": "^6.0.2",
		"google-auth-library": "^9.6.3",
		"html-entities": "^2.5.2",
		"mime": "^3.0.0",
		"p-limit": "^3.0.1",
		"retry-request": "^7.0.0",
		"teeny-request": "^9.0.0",
		"uuid": "^8.0.0"
	};
	devDependencies = {
		"@babel/cli": "^7.22.10",
		"@babel/core": "^7.22.11",
		"@google-cloud/pubsub": "^4.0.0",
		"@grpc/grpc-js": "^1.0.3",
		"@grpc/proto-loader": "^0.8.0",
		"@types/async-retry": "^1.4.3",
		"@types/duplexify": "^3.6.4",
		"@types/mime": "^3.0.0",
		"@types/mocha": "^9.1.1",
		"@types/mockery": "^1.4.29",
		"@types/node": "^24.0.0",
		"@types/node-fetch": "^2.1.3",
		"@types/proxyquire": "^1.3.28",
		"@types/request": "^2.48.4",
		"@types/sinon": "^17.0.0",
		"@types/tmp": "0.2.6",
		"@types/uuid": "^8.0.0",
		"@types/yargs": "^17.0.10",
		"c8": "^9.0.0",
		"form-data": "^4.0.4",
		"gapic-tools": "^0.4.0",
		"gts": "^5.0.0",
		"jsdoc": "^4.0.4",
		"jsdoc-fresh": "^5.0.0",
		"jsdoc-region-tag": "^4.0.0",
		"linkinator": "^3.0.0",
		"mocha": "^9.2.2",
		"mockery": "^2.1.0",
		"nock": "~13.5.0",
		"node-fetch": "^2.6.7",
		"pack-n-play": "^2.0.0",
		"proxyquire": "^2.1.3",
		"sinon": "^18.0.0",
		"nise": "6.0.0",
		"path-to-regexp": "6.3.0",
		"tmp": "^0.2.0",
		"typescript": "^5.1.6",
		"yargs": "^17.3.1"
	};
	package_default = {
		name,
		description,
		version,
		license,
		author,
		engines,
		repository,
		main,
		types,
		type,
		exports: exports$1,
		files,
		keywords,
		scripts,
		dependencies,
		devDependencies
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/package-json-helper.cjs
var require_package_json_helper = /* @__PURE__ */ __commonJSMin(((exports) => {
	function getPackageJSON() {
		return init_package(), __toCommonJS(package_exports).default;
	}
	exports.getPackageJSON = getPackageJSON;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/util.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PassThroughShim = void 0;
	exports.normalize = normalize;
	exports.objectEntries = objectEntries;
	exports.fixedEncodeURIComponent = fixedEncodeURIComponent;
	exports.encodeURI = encodeURI;
	exports.qsStringify = qsStringify;
	exports.objectKeyToLowercase = objectKeyToLowercase;
	exports.unicodeJSONStringify = unicodeJSONStringify;
	exports.convertObjKeysToSnakeCase = convertObjKeysToSnakeCase;
	exports.formatAsUTCISO = formatAsUTCISO;
	exports.getRuntimeTrackingString = getRuntimeTrackingString;
	exports.getUserAgentString = getUserAgentString;
	exports.getDirName = getDirName;
	exports.getModuleFormat = getModuleFormat;
	__importStar(__require("path"));
	var querystring = __importStar(__require("querystring"));
	var stream_1$6 = __require("stream");
	var url$1 = __importStar(__require("url"));
	var package_json_helper_cjs_1 = require_package_json_helper();
	url$1.fileURLToPath;
	function normalize(optionsOrCallback, cb) {
		return {
			options: typeof optionsOrCallback === "object" ? optionsOrCallback : {},
			callback: typeof optionsOrCallback === "function" ? optionsOrCallback : cb
		};
	}
	/**
	* Flatten an object into an Array of arrays, [[key, value], ..].
	* Implements Object.entries() for Node.js <8
	* @internal
	*/
	function objectEntries(obj) {
		return Object.keys(obj).map((key) => [key, obj[key]]);
	}
	/**
	* Encode `str` with encodeURIComponent, plus these
	* reserved characters: `! * ' ( )`.
	*
	* See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent| MDN: fixedEncodeURIComponent}
	*
	* @param {string} str The URI component to encode.
	* @return {string} The encoded string.
	*/
	function fixedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
	}
	/**
	* URI encode `uri` for generating signed URLs, using fixedEncodeURIComponent.
	*
	* Encode every byte except `A-Z a-Z 0-9 ~ - . _`.
	*
	* @param {string} uri The URI to encode.
	* @param [boolean=false] encodeSlash If `true`, the "/" character is not encoded.
	* @return {string} The encoded string.
	*/
	function encodeURI(uri, encodeSlash) {
		return uri.split("/").map(fixedEncodeURIComponent).join(encodeSlash ? "%2F" : "/");
	}
	/**
	* Serialize an object to a URL query string using util.encodeURI(uri, true).
	* @param {string} url The object to serialize.
	* @return {string} Serialized string.
	*/
	function qsStringify(qs) {
		return querystring.stringify(qs, "&", "=", { encodeURIComponent: (component) => encodeURI(component, true) });
	}
	function objectKeyToLowercase(object) {
		const newObj = {};
		for (let key of Object.keys(object)) {
			const value = object[key];
			key = key.toLowerCase();
			newObj[key] = value;
		}
		return newObj;
	}
	/**
	* JSON encode str, with unicode \u+ representation.
	* @param {object} obj The object to encode.
	* @return {string} Serialized string.
	*/
	function unicodeJSONStringify(obj) {
		return JSON.stringify(obj).replace(/[\u0080-\uFFFF]/g, (char) => "\\u" + ("0000" + char.charCodeAt(0).toString(16)).slice(-4));
	}
	/**
	* Converts the given objects keys to snake_case
	* @param {object} obj object to convert keys to snake case.
	* @returns {object} object with keys converted to snake case.
	*/
	function convertObjKeysToSnakeCase(obj) {
		if (obj instanceof Date || obj instanceof RegExp) return obj;
		if (Array.isArray(obj)) return obj.map(convertObjKeysToSnakeCase);
		if (obj instanceof Object) return Object.keys(obj).reduce((acc, cur) => {
			const s = cur[0].toLocaleLowerCase() + cur.slice(1).replace(/([A-Z]+)/g, (match, p1) => {
				return `_${p1.toLowerCase()}`;
			});
			acc[s] = convertObjKeysToSnakeCase(obj[cur]);
			return acc;
		}, Object());
		return obj;
	}
	/**
	* Formats the provided date object as a UTC ISO string.
	* @param {Date} dateTimeToFormat date object to be formatted.
	* @param {boolean} includeTime flag to include hours, minutes, seconds in output.
	* @param {string} dateDelimiter delimiter between date components.
	* @param {string} timeDelimiter delimiter between time components.
	* @returns {string} UTC ISO format of provided date object.
	*/
	function formatAsUTCISO(dateTimeToFormat, includeTime = false, dateDelimiter = "", timeDelimiter = "") {
		const year = dateTimeToFormat.getUTCFullYear();
		const month = dateTimeToFormat.getUTCMonth() + 1;
		const day = dateTimeToFormat.getUTCDate();
		const hour = dateTimeToFormat.getUTCHours();
		const minute = dateTimeToFormat.getUTCMinutes();
		const second = dateTimeToFormat.getUTCSeconds();
		let resultString = `${year.toString().padStart(4, "0")}${dateDelimiter}${month.toString().padStart(2, "0")}${dateDelimiter}${day.toString().padStart(2, "0")}`;
		if (includeTime) resultString = `${resultString}T${hour.toString().padStart(2, "0")}${timeDelimiter}${minute.toString().padStart(2, "0")}${timeDelimiter}${second.toString().padStart(2, "0")}Z`;
		return resultString;
	}
	/**
	* Examines the runtime environment and returns the appropriate tracking string.
	* @returns {string} metrics tracking string based on the current runtime environment.
	*/
	function getRuntimeTrackingString() {
		if (globalThis.Deno && globalThis.Deno.version && globalThis.Deno.version.deno) return `gl-deno/${globalThis.Deno.version.deno}`;
		else return `gl-node/${process.versions.node}`;
	}
	/**
	* Looks at package.json and creates the user-agent string to be applied to request headers.
	* @returns {string} user agent string.
	*/
	function getUserAgentString() {
		const pkg = (0, package_json_helper_cjs_1.getPackageJSON)();
		return pkg.name.replace("@google-cloud", "gcloud-node").replace("/", "-") + "/" + pkg.version;
	}
	function getDirName() {
		let dirToUse = "";
		try {
			dirToUse = __dirname;
		} catch (e) {
			dirToUse = __dirname;
		}
		return dirToUse;
	}
	function getModuleFormat() {
		return "CJS";
	}
	var PassThroughShim = class extends stream_1$6.PassThrough {
		constructor() {
			super(...arguments);
			this.shouldEmitReading = true;
			this.shouldEmitWriting = true;
		}
		_read(size) {
			if (this.shouldEmitReading) {
				this.emit("reading");
				this.shouldEmitReading = false;
			}
			super._read(size);
		}
		_write(chunk, encoding, callback) {
			if (this.shouldEmitWriting) {
				this.emit("writing");
				this.shouldEmitWriting = false;
			}
			process.nextTick(() => {
				super._write(chunk, encoding, callback);
			});
		}
		_final(callback) {
			if (this.shouldEmitReading) {
				this.emit("reading");
				this.shouldEmitReading = false;
			}
			if (this.shouldEmitWriting) {
				this.emit("writing");
				this.shouldEmitWriting = false;
			}
			callback(null);
		}
	};
	exports.PassThroughShim = PassThroughShim;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/nodejs-common/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	/*!
	* Copyright 2022 Google LLC. All Rights Reserved.
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.util = exports.Util = exports.PartialFailureError = exports.ApiError = exports.GCCL_GCS_CMD_KEY = void 0;
	/*!
	* @module common/util
	*/
	var projectify_1 = require_src$10();
	var htmlEntities = __importStar(require_commonjs());
	var google_auth_library_1 = require_src$4();
	var retry_request_1 = __importDefault(require_retry_request());
	var stream_1$5 = __require("stream");
	var teeny_request_1 = require_src$1();
	var uuid = __importStar(require_dist$4());
	var service_js_1 = require_service();
	var util_js_1 = require_util$1();
	var duplexify_1 = __importDefault(require_duplexify());
	var packageJson = (0, require_package_json_helper().getPackageJSON)();
	/**
	* A unique symbol for providing a `gccl-gcs-cmd` value
	* for the `X-Goog-API-Client` header.
	*
	* E.g. the `V` in `X-Goog-API-Client: gccl-gcs-cmd/V`
	**/
	exports.GCCL_GCS_CMD_KEY = Symbol.for("GCCL_GCS_CMD");
	var requestDefaults = {
		timeout: 6e4,
		gzip: true,
		forever: true,
		pool: { maxSockets: Infinity }
	};
	/**
	* Default behavior: Automatically retry retriable server errors.
	*
	* @const {boolean}
	* @private
	*/
	var AUTO_RETRY_DEFAULT = true;
	/**
	* Default behavior: Only attempt to retry retriable errors 3 times.
	*
	* @const {number}
	* @private
	*/
	var MAX_RETRY_DEFAULT = 3;
	/**
	* Custom error type for API errors.
	*
	* @param {object} errorBody - Error object.
	*/
	var ApiError = class ApiError extends Error {
		constructor(errorBodyOrMessage) {
			super();
			if (typeof errorBodyOrMessage !== "object") {
				this.message = errorBodyOrMessage || "";
				return;
			}
			const errorBody = errorBodyOrMessage;
			this.code = errorBody.code;
			this.errors = errorBody.errors;
			this.response = errorBody.response;
			try {
				this.errors = JSON.parse(this.response.body).error.errors;
			} catch (e) {
				this.errors = errorBody.errors;
			}
			this.message = ApiError.createMultiErrorMessage(errorBody, this.errors);
			Error.captureStackTrace(this);
		}
		/**
		* Pieces together an error message by combining all unique error messages
		* returned from a single GoogleError
		*
		* @private
		*
		* @param {GoogleErrorBody} err The original error.
		* @param {GoogleInnerError[]} [errors] Inner errors, if any.
		* @returns {string}
		*/
		static createMultiErrorMessage(err, errors) {
			const messages = /* @__PURE__ */ new Set();
			if (err.message) messages.add(err.message);
			if (errors && errors.length) errors.forEach(({ message }) => messages.add(message));
			else if (err.response && err.response.body) messages.add(htmlEntities.decode(err.response.body.toString()));
			else if (!err.message) messages.add("A failure occurred during this request.");
			let messageArr = Array.from(messages);
			if (messageArr.length > 1) {
				messageArr = messageArr.map((message, i) => `    ${i + 1}. ${message}`);
				messageArr.unshift("Multiple errors occurred during the request. Please see the `errors` array for complete details.\n");
				messageArr.push("\n");
			}
			return messageArr.join("\n");
		}
	};
	exports.ApiError = ApiError;
	/**
	* Custom error type for partial errors returned from the API.
	*
	* @param {object} b - Error object.
	*/
	var PartialFailureError = class extends Error {
		constructor(b) {
			super();
			const errorObject = b;
			this.errors = errorObject.errors;
			this.name = "PartialFailureError";
			this.response = errorObject.response;
			this.message = ApiError.createMultiErrorMessage(errorObject, this.errors);
		}
	};
	exports.PartialFailureError = PartialFailureError;
	var Util = class {
		constructor() {
			this.ApiError = ApiError;
			this.PartialFailureError = PartialFailureError;
		}
		/**
		* No op.
		*
		* @example
		* function doSomething(callback) {
		*   callback = callback || noop;
		* }
		*/
		noop() {}
		/**
		* Uniformly process an API response.
		*
		* @param {*} err - Error value.
		* @param {*} resp - Response value.
		* @param {*} body - Body value.
		* @param {function} callback - The callback function.
		*/
		handleResp(err, resp, body, callback) {
			callback = callback || util.noop;
			const parsedResp = {
				err: err || null,
				...resp && util.parseHttpRespMessage(resp),
				...body && util.parseHttpRespBody(body)
			};
			if (!parsedResp.err && resp && typeof parsedResp.body === "object") parsedResp.resp.body = parsedResp.body;
			if (parsedResp.err && resp) parsedResp.err.response = resp;
			callback(parsedResp.err, parsedResp.body, parsedResp.resp);
		}
		/**
		* Sniff an incoming HTTP response message for errors.
		*
		* @param {object} httpRespMessage - An incoming HTTP response message from `request`.
		* @return {object} parsedHttpRespMessage - The parsed response.
		* @param {?error} parsedHttpRespMessage.err - An error detected.
		* @param {object} parsedHttpRespMessage.resp - The original response object.
		*/
		parseHttpRespMessage(httpRespMessage) {
			const parsedHttpRespMessage = { resp: httpRespMessage };
			if (httpRespMessage.statusCode < 200 || httpRespMessage.statusCode > 299) parsedHttpRespMessage.err = new ApiError({
				errors: new Array(),
				code: httpRespMessage.statusCode,
				message: httpRespMessage.statusMessage,
				response: httpRespMessage
			});
			return parsedHttpRespMessage;
		}
		/**
		* Parse the response body from an HTTP request.
		*
		* @param {object} body - The response body.
		* @return {object} parsedHttpRespMessage - The parsed response.
		* @param {?error} parsedHttpRespMessage.err - An error detected.
		* @param {object} parsedHttpRespMessage.body - The original body value provided
		*     will try to be JSON.parse'd. If it's successful, the parsed value will
		* be returned here, otherwise the original value and an error will be returned.
		*/
		parseHttpRespBody(body) {
			const parsedHttpRespBody = { body };
			if (typeof body === "string") try {
				parsedHttpRespBody.body = JSON.parse(body);
			} catch (err) {
				parsedHttpRespBody.body = body;
			}
			if (parsedHttpRespBody.body && parsedHttpRespBody.body.error) parsedHttpRespBody.err = new ApiError(parsedHttpRespBody.body.error);
			return parsedHttpRespBody;
		}
		/**
		* Take a Duplexify stream, fetch an authenticated connection header, and
		* create an outgoing writable stream.
		*
		* @param {Duplexify} dup - Duplexify stream.
		* @param {object} options - Configuration object.
		* @param {module:common/connection} options.connection - A connection instance used to get a token with and send the request through.
		* @param {object} options.metadata - Metadata to send at the head of the request.
		* @param {object} options.request - Request object, in the format of a standard Node.js http.request() object.
		* @param {string=} options.request.method - Default: "POST".
		* @param {string=} options.request.qs.uploadType - Default: "multipart".
		* @param {string=} options.streamContentType - Default: "application/octet-stream".
		* @param {function} onComplete - Callback, executed after the writable Request stream has completed.
		*/
		makeWritableStream(dup, options, onComplete) {
			var _a;
			onComplete = onComplete || util.noop;
			const writeStream = new ProgressStream();
			writeStream.on("progress", (evt) => dup.emit("progress", evt));
			dup.setWritable(writeStream);
			const defaultReqOpts = {
				method: "POST",
				qs: { uploadType: "multipart" },
				timeout: 0,
				maxRetries: 0
			};
			const metadata = options.metadata || {};
			const reqOpts = {
				...defaultReqOpts,
				...options.request,
				qs: {
					...defaultReqOpts.qs,
					...(_a = options.request) === null || _a === void 0 ? void 0 : _a.qs
				},
				multipart: [{
					"Content-Type": "application/json",
					body: JSON.stringify(metadata)
				}, {
					"Content-Type": metadata.contentType || "application/octet-stream",
					body: writeStream
				}]
			};
			options.makeAuthenticatedRequest(reqOpts, { onAuthenticated(err, authenticatedReqOpts) {
				if (err) {
					dup.destroy(err);
					return;
				}
				requestDefaults.headers = util._getDefaultHeaders(reqOpts[exports.GCCL_GCS_CMD_KEY]);
				teeny_request_1.teenyRequest.defaults(requestDefaults)(authenticatedReqOpts, (err, resp, body) => {
					util.handleResp(err, resp, body, (err, data) => {
						if (err) {
							dup.destroy(err);
							return;
						}
						dup.emit("response", resp);
						onComplete(data);
					});
				});
			} });
		}
		/**
		* Returns true if the API request should be retried, given the error that was
		* given the first time the request was attempted. This is used for rate limit
		* related errors as well as intermittent server errors.
		*
		* @param {error} err - The API error to check if it is appropriate to retry.
		* @return {boolean} True if the API request should be retried, false otherwise.
		*/
		shouldRetryRequest(err) {
			if (err) {
				if ([
					408,
					429,
					500,
					502,
					503,
					504
				].indexOf(err.code) !== -1) return true;
				if (err.errors) for (const e of err.errors) {
					const reason = e.reason;
					if (reason === "rateLimitExceeded") return true;
					if (reason === "userRateLimitExceeded") return true;
					if (reason && reason.includes("EAI_AGAIN")) return true;
				}
			}
			return false;
		}
		/**
		* Get a function for making authenticated requests.
		*
		* @param {object} config - Configuration object.
		* @param {boolean=} config.autoRetry - Automatically retry requests if the
		*     response is related to rate limits or certain intermittent server
		* errors. We will exponentially backoff subsequent requests by default.
		* (default: true)
		* @param {object=} config.credentials - Credentials object.
		* @param {boolean=} config.customEndpoint - If true, just return the provided request options. Default: false.
		* @param {boolean=} config.useAuthWithCustomEndpoint - If true, will authenticate when using a custom endpoint. Default: false.
		* @param {string=} config.email - Account email address, required for PEM/P12 usage.
		* @param {number=} config.maxRetries - Maximum number of automatic retries attempted before returning the error. (default: 3)
		* @param {string=} config.keyFile - Path to a .json, .pem, or .p12 keyfile.
		* @param {array} config.scopes - Array of scopes required for the API.
		*/
		makeAuthenticatedRequestFactory(config) {
			const googleAutoAuthConfig = { ...config };
			if (googleAutoAuthConfig.projectId === service_js_1.DEFAULT_PROJECT_ID_TOKEN) delete googleAutoAuthConfig.projectId;
			let authClient;
			if (googleAutoAuthConfig.authClient instanceof google_auth_library_1.GoogleAuth) authClient = googleAutoAuthConfig.authClient;
			else authClient = new google_auth_library_1.GoogleAuth({
				...googleAutoAuthConfig,
				authClient: googleAutoAuthConfig.authClient,
				clientOptions: googleAutoAuthConfig.clientOptions
			});
			function makeAuthenticatedRequest(reqOpts, optionsOrCallback) {
				let stream;
				let projectId;
				const reqConfig = { ...config };
				let activeRequest_;
				if (!optionsOrCallback) {
					stream = (0, duplexify_1.default)();
					reqConfig.stream = stream;
				}
				const options = typeof optionsOrCallback === "object" ? optionsOrCallback : void 0;
				const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : void 0;
				async function setProjectId() {
					projectId = await authClient.getProjectId();
				}
				const onAuthenticated = async (err, authenticatedReqOpts) => {
					const authLibraryError = err;
					const autoAuthFailed = err && typeof err.message === "string" && err.message.indexOf("Could not load the default credentials") > -1;
					if (autoAuthFailed) authenticatedReqOpts = reqOpts;
					if (!err || autoAuthFailed) try {
						authenticatedReqOpts = util.decorateRequest(authenticatedReqOpts, projectId);
						err = null;
					} catch (e) {
						if (e instanceof projectify_1.MissingProjectIdError) try {
							await setProjectId();
							authenticatedReqOpts = util.decorateRequest(authenticatedReqOpts, projectId);
							err = null;
						} catch (e) {
							err = err || e;
						}
						else err = err || e;
					}
					if (err) {
						if (stream) stream.destroy(err);
						else (options && options.onAuthenticated ? options.onAuthenticated : callback)(err);
						return;
					}
					if (options && options.onAuthenticated) options.onAuthenticated(null, authenticatedReqOpts);
					else activeRequest_ = util.makeRequest(authenticatedReqOpts, reqConfig, (apiResponseError, ...params) => {
						if (apiResponseError && apiResponseError.code === 401 && authLibraryError) apiResponseError = authLibraryError;
						callback(apiResponseError, ...params);
					});
				};
				const prepareRequest = async () => {
					try {
						const getProjectId = async () => {
							if (config.projectId && config.projectId !== service_js_1.DEFAULT_PROJECT_ID_TOKEN) return config.projectId;
							if (config.projectIdRequired === false) return service_js_1.DEFAULT_PROJECT_ID_TOKEN;
							return setProjectId();
						};
						const authorizeRequest = async () => {
							if (reqConfig.customEndpoint && !reqConfig.useAuthWithCustomEndpoint) return reqOpts;
							else return authClient.authorizeRequest(reqOpts);
						};
						const [_projectId, authorizedReqOpts] = await Promise.all([getProjectId(), authorizeRequest()]);
						if (_projectId) projectId = _projectId;
						return onAuthenticated(null, authorizedReqOpts);
					} catch (e) {
						return onAuthenticated(e);
					}
				};
				prepareRequest();
				if (stream) return stream;
				return { abort() {
					setImmediate(() => {
						if (activeRequest_) {
							activeRequest_.abort();
							activeRequest_ = null;
						}
					});
				} };
			}
			const mar = makeAuthenticatedRequest;
			mar.getCredentials = authClient.getCredentials.bind(authClient);
			mar.authClient = authClient;
			return mar;
		}
		/**
		* Make a request through the `retryRequest` module with built-in error
		* handling and exponential back off.
		*
		* @param {object} reqOpts - Request options in the format `request` expects.
		* @param {object=} config - Configuration object.
		* @param {boolean=} config.autoRetry - Automatically retry requests if the
		*     response is related to rate limits or certain intermittent server
		* errors. We will exponentially backoff subsequent requests by default.
		* (default: true)
		* @param {number=} config.maxRetries - Maximum number of automatic retries
		*     attempted before returning the error. (default: 3)
		* @param {object=} config.request - HTTP module for request calls.
		* @param {function} callback - The callback function.
		*/
		makeRequest(reqOpts, config, callback) {
			var _a, _b, _c, _d, _e;
			let autoRetryValue = AUTO_RETRY_DEFAULT;
			if (config.autoRetry !== void 0) autoRetryValue = config.autoRetry;
			else if (((_a = config.retryOptions) === null || _a === void 0 ? void 0 : _a.autoRetry) !== void 0) autoRetryValue = config.retryOptions.autoRetry;
			let maxRetryValue = MAX_RETRY_DEFAULT;
			if (config.maxRetries !== void 0) maxRetryValue = config.maxRetries;
			else if (((_b = config.retryOptions) === null || _b === void 0 ? void 0 : _b.maxRetries) !== void 0) maxRetryValue = config.retryOptions.maxRetries;
			requestDefaults.headers = this._getDefaultHeaders(reqOpts[exports.GCCL_GCS_CMD_KEY]);
			const options = {
				request: teeny_request_1.teenyRequest.defaults(requestDefaults),
				retries: autoRetryValue !== false ? maxRetryValue : 0,
				noResponseRetries: autoRetryValue !== false ? maxRetryValue : 0,
				shouldRetryFn(httpRespMessage) {
					var _a, _b;
					const err = util.parseHttpRespMessage(httpRespMessage).err;
					if ((_a = config.retryOptions) === null || _a === void 0 ? void 0 : _a.retryableErrorFn) return err && ((_b = config.retryOptions) === null || _b === void 0 ? void 0 : _b.retryableErrorFn(err));
					return err && util.shouldRetryRequest(err);
				},
				maxRetryDelay: (_c = config.retryOptions) === null || _c === void 0 ? void 0 : _c.maxRetryDelay,
				retryDelayMultiplier: (_d = config.retryOptions) === null || _d === void 0 ? void 0 : _d.retryDelayMultiplier,
				totalTimeout: (_e = config.retryOptions) === null || _e === void 0 ? void 0 : _e.totalTimeout
			};
			if (typeof reqOpts.maxRetries === "number") {
				options.retries = reqOpts.maxRetries;
				options.noResponseRetries = reqOpts.maxRetries;
			}
			if (!config.stream) return (0, retry_request_1.default)(reqOpts, options, (err, response, body) => {
				util.handleResp(err, response, body, callback);
			});
			const dup = config.stream;
			let requestStream;
			if ((reqOpts.method || "GET").toUpperCase() === "GET") {
				requestStream = (0, retry_request_1.default)(reqOpts, options);
				dup.setReadable(requestStream);
			} else {
				requestStream = options.request(reqOpts);
				dup.setWritable(requestStream);
			}
			requestStream.on("error", dup.destroy.bind(dup)).on("response", dup.emit.bind(dup, "response")).on("complete", dup.emit.bind(dup, "complete"));
			dup.abort = requestStream.abort;
			return dup;
		}
		/**
		* Decorate the options about to be made in a request.
		*
		* @param {object} reqOpts - The options to be passed to `request`.
		* @param {string} projectId - The project ID.
		* @return {object} reqOpts - The decorated reqOpts.
		*/
		decorateRequest(reqOpts, projectId) {
			delete reqOpts.autoPaginate;
			delete reqOpts.autoPaginateVal;
			delete reqOpts.objectMode;
			if (reqOpts.qs !== null && typeof reqOpts.qs === "object") {
				delete reqOpts.qs.autoPaginate;
				delete reqOpts.qs.autoPaginateVal;
				reqOpts.qs = (0, projectify_1.replaceProjectIdToken)(reqOpts.qs, projectId);
			}
			if (Array.isArray(reqOpts.multipart)) reqOpts.multipart = reqOpts.multipart.map((part) => {
				return (0, projectify_1.replaceProjectIdToken)(part, projectId);
			});
			if (reqOpts.json !== null && typeof reqOpts.json === "object") {
				delete reqOpts.json.autoPaginate;
				delete reqOpts.json.autoPaginateVal;
				reqOpts.json = (0, projectify_1.replaceProjectIdToken)(reqOpts.json, projectId);
			}
			reqOpts.uri = (0, projectify_1.replaceProjectIdToken)(reqOpts.uri, projectId);
			return reqOpts;
		}
		isCustomType(unknown, module$1) {
			function getConstructorName(obj) {
				return obj.constructor && obj.constructor.name.toLowerCase();
			}
			const moduleNameParts = module$1.split("/");
			const parentModuleName = moduleNameParts[0] && moduleNameParts[0].toLowerCase();
			const subModuleName = moduleNameParts[1] && moduleNameParts[1].toLowerCase();
			if (subModuleName && getConstructorName(unknown) !== subModuleName) return false;
			let walkingModule = unknown;
			while (true) {
				if (getConstructorName(walkingModule) === parentModuleName) return true;
				walkingModule = walkingModule.parent;
				if (!walkingModule) return false;
			}
		}
		/**
		* Given two parameters, figure out if this is either:
		*  - Just a callback function
		*  - An options object, and then a callback function
		* @param optionsOrCallback An options object or callback.
		* @param cb A potentially undefined callback.
		*/
		maybeOptionsOrCallback(optionsOrCallback, cb) {
			return typeof optionsOrCallback === "function" ? [{}, optionsOrCallback] : [optionsOrCallback, cb];
		}
		_getDefaultHeaders(gcclGcsCmd) {
			const headers = {
				"User-Agent": (0, util_js_1.getUserAgentString)(),
				"x-goog-api-client": `${(0, util_js_1.getRuntimeTrackingString)()} gccl/${packageJson.version}-${(0, util_js_1.getModuleFormat)()} gccl-invocation-id/${uuid.v4()}`
			};
			if (gcclGcsCmd) headers["x-goog-api-client"] += ` gccl-gcs-cmd/${gcclGcsCmd}`;
			return headers;
		}
	};
	exports.Util = Util;
	/**
	* Basic Passthrough Stream that records the number of bytes read
	* every time the cursor is moved.
	*/
	var ProgressStream = class extends stream_1$5.Transform {
		constructor() {
			super(...arguments);
			this.bytesRead = 0;
		}
		_transform(chunk, encoding, callback) {
			this.bytesRead += chunk.length;
			this.emit("progress", {
				bytesWritten: this.bytesRead,
				contentLength: "*"
			});
			this.push(chunk);
			callback();
		}
	};
	var util = new Util();
	exports.util = util;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/nodejs-common/service.js
var require_service = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Service = exports.DEFAULT_PROJECT_ID_TOKEN = void 0;
	/*!
	* Copyright 2022 Google LLC. All Rights Reserved.
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var google_auth_library_1 = require_src$4();
	var uuid = __importStar(require_dist$4());
	var util_js_1 = require_util();
	var util_js_2 = require_util$1();
	exports.DEFAULT_PROJECT_ID_TOKEN = "{{projectId}}";
	exports.Service = class Service {
		/**
		* Service is a base class, meant to be inherited from by a "service," like
		* BigQuery or Storage.
		*
		* This handles making authenticated requests by exposing a `makeReq_`
		* function.
		*
		* @constructor
		* @alias module:common/service
		*
		* @param {object} config - Configuration object.
		* @param {string} config.baseUrl - The base URL to make API requests to.
		* @param {string[]} config.scopes - The scopes required for the request.
		* @param {object=} options - [Configuration object](#/docs).
		*/
		constructor(config, options = {}) {
			this.baseUrl = config.baseUrl;
			this.apiEndpoint = config.apiEndpoint;
			this.timeout = options.timeout;
			this.globalInterceptors = Array.isArray(options.interceptors_) ? options.interceptors_ : [];
			this.interceptors = [];
			this.packageJson = config.packageJson;
			this.projectId = options.projectId || exports.DEFAULT_PROJECT_ID_TOKEN;
			this.projectIdRequired = config.projectIdRequired !== false;
			this.providedUserAgent = options.userAgent;
			this.universeDomain = options.universeDomain || google_auth_library_1.DEFAULT_UNIVERSE;
			this.customEndpoint = config.customEndpoint || false;
			this.useAuthWithCustomEndpoint = config.useAuthWithCustomEndpoint;
			this.makeAuthenticatedRequest = util_js_1.util.makeAuthenticatedRequestFactory({
				...config,
				projectIdRequired: this.projectIdRequired,
				projectId: this.projectId,
				authClient: options.authClient || config.authClient,
				credentials: options.credentials,
				keyFile: options.keyFilename,
				email: options.email,
				clientOptions: {
					universeDomain: options.universeDomain,
					...options.clientOptions
				}
			});
			this.authClient = this.makeAuthenticatedRequest.authClient;
			if (!!process.env.FUNCTION_NAME) this.interceptors.push({ request(reqOpts) {
				reqOpts.forever = false;
				return reqOpts;
			} });
		}
		/**
		* Return the user's custom request interceptors.
		*/
		getRequestInterceptors() {
			return [].slice.call(this.globalInterceptors).concat(this.interceptors).filter((interceptor) => typeof interceptor.request === "function").map((interceptor) => interceptor.request);
		}
		getProjectId(callback) {
			if (!callback) return this.getProjectIdAsync();
			this.getProjectIdAsync().then((p) => callback(null, p), callback);
		}
		async getProjectIdAsync() {
			const projectId = await this.authClient.getProjectId();
			if (this.projectId === exports.DEFAULT_PROJECT_ID_TOKEN && projectId) this.projectId = projectId;
			return this.projectId;
		}
		request_(reqOpts, callback) {
			reqOpts = {
				...reqOpts,
				timeout: this.timeout
			};
			const isAbsoluteUrl = reqOpts.uri.indexOf("http") === 0;
			const uriComponents = [this.baseUrl];
			if (this.projectIdRequired) if (reqOpts.projectId) {
				uriComponents.push("projects");
				uriComponents.push(reqOpts.projectId);
			} else {
				uriComponents.push("projects");
				uriComponents.push(this.projectId);
			}
			uriComponents.push(reqOpts.uri);
			if (isAbsoluteUrl) uriComponents.splice(0, uriComponents.indexOf(reqOpts.uri));
			reqOpts.uri = uriComponents.map((uriComponent) => {
				return uriComponent.replace(/^\/*|\/*$/g, "");
			}).join("/").replace(/\/:/g, ":");
			const requestInterceptors = this.getRequestInterceptors();
			(Array.isArray(reqOpts.interceptors_) ? reqOpts.interceptors_ : []).forEach((interceptor) => {
				if (typeof interceptor.request === "function") requestInterceptors.push(interceptor.request);
			});
			requestInterceptors.forEach((requestInterceptor) => {
				reqOpts = requestInterceptor(reqOpts);
			});
			delete reqOpts.interceptors_;
			const pkg = this.packageJson;
			let userAgent = (0, util_js_2.getUserAgentString)();
			if (this.providedUserAgent) userAgent = `${this.providedUserAgent} ${userAgent}`;
			reqOpts.headers = {
				...reqOpts.headers,
				"User-Agent": userAgent,
				"x-goog-api-client": `${(0, util_js_2.getRuntimeTrackingString)()} gccl/${pkg.version}-${(0, util_js_2.getModuleFormat)()} gccl-invocation-id/${uuid.v4()}`
			};
			if (reqOpts[util_js_1.GCCL_GCS_CMD_KEY]) reqOpts.headers["x-goog-api-client"] += ` gccl-gcs-cmd/${reqOpts[util_js_1.GCCL_GCS_CMD_KEY]}`;
			if (reqOpts.shouldReturnStream) return this.makeAuthenticatedRequest(reqOpts);
			else this.makeAuthenticatedRequest(reqOpts, callback);
		}
		/**
		* Make an authenticated API request.
		*
		* @param {object} reqOpts - Request options that are passed to `request`.
		* @param {string} reqOpts.uri - A URI relative to the baseUrl.
		* @param {function} callback - The callback function passed to `request`.
		*/
		request(reqOpts, callback) {
			Service.prototype.request_.call(this, reqOpts, callback);
		}
		/**
		* Make an authenticated API request.
		*
		* @param {object} reqOpts - Request options that are passed to `request`.
		* @param {string} reqOpts.uri - A URI relative to the baseUrl.
		*/
		requestStream(reqOpts) {
			const opts = {
				...reqOpts,
				shouldReturnStream: true
			};
			return Service.prototype.request_.call(this, opts);
		}
	};
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/nodejs-common/service-object.js
var require_service_object = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ServiceObject = void 0;
	/*!
	* Copyright 2022 Google LLC. All Rights Reserved.
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var promisify_1 = require_src$11();
	var events_1 = __require("events");
	var util_js_1 = require_util();
	/**
	* ServiceObject is a base class, meant to be inherited from by a "service
	* object," like a BigQuery dataset or Storage bucket.
	*
	* Most of the time, these objects share common functionality; they can be
	* created or deleted, and you can get or set their metadata.
	*
	* By inheriting from this class, a service object will be extended with these
	* shared behaviors. Note that any method can be overridden when the service
	* object requires specific behavior.
	*/
	var ServiceObject = class ServiceObject extends events_1.EventEmitter {
		constructor(config) {
			super();
			this.metadata = {};
			this.baseUrl = config.baseUrl;
			this.parent = config.parent;
			this.id = config.id;
			this.createMethod = config.createMethod;
			this.methods = config.methods || {};
			this.interceptors = [];
			this.projectId = config.projectId;
			if (config.methods) Object.getOwnPropertyNames(ServiceObject.prototype).filter((methodName) => {
				return !/^request/.test(methodName) && !/^getRequestInterceptors/.test(methodName) && this[methodName] === ServiceObject.prototype[methodName] && !config.methods[methodName];
			}).forEach((methodName) => {
				this[methodName] = void 0;
			});
		}
		create(optionsOrCallback, callback) {
			const self = this;
			const args = [this.id];
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			if (typeof optionsOrCallback === "object") args.push(optionsOrCallback);
			function onCreate(...args) {
				const [err, instance] = args;
				if (!err) {
					self.metadata = instance.metadata;
					if (self.id && instance.metadata) self.id = instance.metadata.id;
					args[1] = self;
				}
				callback(...args);
			}
			args.push(onCreate);
			this.createMethod.apply(null, args);
		}
		delete(optionsOrCallback, cb) {
			var _a;
			const [options, callback] = util_js_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
			const ignoreNotFound = options.ignoreNotFound;
			delete options.ignoreNotFound;
			const methodConfig = typeof this.methods.delete === "object" && this.methods.delete || {};
			const reqOpts = {
				method: "DELETE",
				uri: "",
				...methodConfig.reqOpts,
				qs: {
					...(_a = methodConfig.reqOpts) === null || _a === void 0 ? void 0 : _a.qs,
					...options
				}
			};
			ServiceObject.prototype.request.call(this, reqOpts, (err, body, res) => {
				if (err) {
					if (err.code === 404 && ignoreNotFound) err = null;
				}
				callback(err, res);
			});
		}
		exists(optionsOrCallback, cb) {
			const [options, callback] = util_js_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
			this.get(options, (err) => {
				if (err) {
					if (err.code === 404) callback(null, false);
					else callback(err);
					return;
				}
				callback(null, true);
			});
		}
		get(optionsOrCallback, cb) {
			const self = this;
			const [opts, callback] = util_js_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
			const options = Object.assign({}, opts);
			const autoCreate = options.autoCreate && typeof this.create === "function";
			delete options.autoCreate;
			function onCreate(err, instance, apiResponse) {
				if (err) {
					if (err.code === 409) {
						self.get(options, callback);
						return;
					}
					callback(err, null, apiResponse);
					return;
				}
				callback(null, instance, apiResponse);
			}
			this.getMetadata(options, (err, metadata) => {
				if (err) {
					if (err.code === 404 && autoCreate) {
						const args = [];
						if (Object.keys(options).length > 0) args.push(options);
						args.push(onCreate);
						self.create(...args);
						return;
					}
					callback(err, null, metadata);
					return;
				}
				callback(null, self, metadata);
			});
		}
		getMetadata(optionsOrCallback, cb) {
			var _a;
			const [options, callback] = util_js_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
			const methodConfig = typeof this.methods.getMetadata === "object" && this.methods.getMetadata || {};
			const reqOpts = {
				uri: "",
				...methodConfig.reqOpts,
				qs: {
					...(_a = methodConfig.reqOpts) === null || _a === void 0 ? void 0 : _a.qs,
					...options
				}
			};
			ServiceObject.prototype.request.call(this, reqOpts, (err, body, res) => {
				this.metadata = body;
				callback(err, this.metadata, res);
			});
		}
		/**
		* Return the user's custom request interceptors.
		*/
		getRequestInterceptors() {
			const localInterceptors = this.interceptors.filter((interceptor) => typeof interceptor.request === "function").map((interceptor) => interceptor.request);
			return this.parent.getRequestInterceptors().concat(localInterceptors);
		}
		setMetadata(metadata, optionsOrCallback, cb) {
			var _a, _b;
			const [options, callback] = util_js_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
			const methodConfig = typeof this.methods.setMetadata === "object" && this.methods.setMetadata || {};
			const reqOpts = {
				method: "PATCH",
				uri: "",
				...methodConfig.reqOpts,
				json: {
					...(_a = methodConfig.reqOpts) === null || _a === void 0 ? void 0 : _a.json,
					...metadata
				},
				qs: {
					...(_b = methodConfig.reqOpts) === null || _b === void 0 ? void 0 : _b.qs,
					...options
				}
			};
			ServiceObject.prototype.request.call(this, reqOpts, (err, body, res) => {
				this.metadata = body;
				callback(err, this.metadata, res);
			});
		}
		request_(reqOpts, callback) {
			reqOpts = { ...reqOpts };
			if (this.projectId) reqOpts.projectId = this.projectId;
			const isAbsoluteUrl = reqOpts.uri.indexOf("http") === 0;
			const uriComponents = [
				this.baseUrl,
				this.id || "",
				reqOpts.uri
			];
			if (isAbsoluteUrl) uriComponents.splice(0, uriComponents.indexOf(reqOpts.uri));
			reqOpts.uri = uriComponents.filter((x) => x.trim()).map((uriComponent) => {
				return uriComponent.replace(/^\/*|\/*$/g, "");
			}).join("/");
			const childInterceptors = Array.isArray(reqOpts.interceptors_) ? reqOpts.interceptors_ : [];
			const localInterceptors = [].slice.call(this.interceptors);
			reqOpts.interceptors_ = childInterceptors.concat(localInterceptors);
			if (reqOpts.shouldReturnStream) return this.parent.requestStream(reqOpts);
			this.parent.request(reqOpts, callback);
		}
		request(reqOpts, callback) {
			this.request_(reqOpts, callback);
		}
		/**
		* Make an authenticated API request.
		*
		* @param {object} reqOpts - Request options that are passed to `request`.
		* @param {string} reqOpts.uri - A URI relative to the baseUrl.
		*/
		requestStream(reqOpts) {
			const opts = {
				...reqOpts,
				shouldReturnStream: true
			};
			return this.request_(opts);
		}
	};
	exports.ServiceObject = ServiceObject;
	(0, promisify_1.promisifyAll)(ServiceObject, { exclude: ["getRequestInterceptors"] });
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/nodejs-common/index.js
var require_nodejs_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.util = exports.ApiError = exports.ServiceObject = exports.Service = void 0;
	var service_js_1 = require_service();
	Object.defineProperty(exports, "Service", {
		enumerable: true,
		get: function() {
			return service_js_1.Service;
		}
	});
	var service_object_js_1 = require_service_object();
	Object.defineProperty(exports, "ServiceObject", {
		enumerable: true,
		get: function() {
			return service_object_js_1.ServiceObject;
		}
	});
	var util_js_1 = require_util();
	Object.defineProperty(exports, "ApiError", {
		enumerable: true,
		get: function() {
			return util_js_1.ApiError;
		}
	});
	Object.defineProperty(exports, "util", {
		enumerable: true,
		get: function() {
			return util_js_1.util;
		}
	});
}));
//#endregion
//#region node_modules/mime/Mime.js
var require_Mime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param typeMap [Object] Map of MIME type -> Array[extensions]
	* @param ...
	*/
	function Mime() {
		this._types = Object.create(null);
		this._extensions = Object.create(null);
		for (let i = 0; i < arguments.length; i++) this.define(arguments[i]);
		this.define = this.define.bind(this);
		this.getType = this.getType.bind(this);
		this.getExtension = this.getExtension.bind(this);
	}
	/**
	* Define mimetype -> extension mappings.  Each key is a mime-type that maps
	* to an array of extensions associated with the type.  The first extension is
	* used as the default extension for the type.
	*
	* e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
	*
	* If a type declares an extension that has already been defined, an error will
	* be thrown.  To suppress this error and force the extension to be associated
	* with the new type, pass `force`=true.  Alternatively, you may prefix the
	* extension with "*" to map the type to extension, without mapping the
	* extension to the type.
	*
	* e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
	*
	*
	* @param map (Object) type definitions
	* @param force (Boolean) if true, force overriding of existing definitions
	*/
	Mime.prototype.define = function(typeMap, force) {
		for (let type in typeMap) {
			let extensions = typeMap[type].map(function(t) {
				return t.toLowerCase();
			});
			type = type.toLowerCase();
			for (let i = 0; i < extensions.length; i++) {
				const ext = extensions[i];
				if (ext[0] === "*") continue;
				if (!force && ext in this._types) throw new Error("Attempt to change mapping for \"" + ext + "\" extension from \"" + this._types[ext] + "\" to \"" + type + "\". Pass `force=true` to allow this, otherwise remove \"" + ext + "\" from the list of extensions for \"" + type + "\".");
				this._types[ext] = type;
			}
			if (force || !this._extensions[type]) {
				const ext = extensions[0];
				this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
			}
		}
	};
	/**
	* Lookup a mime type based on extension
	*/
	Mime.prototype.getType = function(path) {
		path = String(path);
		let last = path.replace(/^.*[/\\]/, "").toLowerCase();
		let ext = last.replace(/^.*\./, "").toLowerCase();
		let hasPath = last.length < path.length;
		return (ext.length < last.length - 1 || !hasPath) && this._types[ext] || null;
	};
	/**
	* Return file extension associated with a mime type
	*/
	Mime.prototype.getExtension = function(type) {
		type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
		return type && this._extensions[type.toLowerCase()] || null;
	};
	module.exports = Mime;
}));
//#endregion
//#region node_modules/mime/types/standard.js
var require_standard = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"application/andrew-inset": ["ez"],
		"application/applixware": ["aw"],
		"application/atom+xml": ["atom"],
		"application/atomcat+xml": ["atomcat"],
		"application/atomdeleted+xml": ["atomdeleted"],
		"application/atomsvc+xml": ["atomsvc"],
		"application/atsc-dwd+xml": ["dwd"],
		"application/atsc-held+xml": ["held"],
		"application/atsc-rsat+xml": ["rsat"],
		"application/bdoc": ["bdoc"],
		"application/calendar+xml": ["xcs"],
		"application/ccxml+xml": ["ccxml"],
		"application/cdfx+xml": ["cdfx"],
		"application/cdmi-capability": ["cdmia"],
		"application/cdmi-container": ["cdmic"],
		"application/cdmi-domain": ["cdmid"],
		"application/cdmi-object": ["cdmio"],
		"application/cdmi-queue": ["cdmiq"],
		"application/cu-seeme": ["cu"],
		"application/dash+xml": ["mpd"],
		"application/davmount+xml": ["davmount"],
		"application/docbook+xml": ["dbk"],
		"application/dssc+der": ["dssc"],
		"application/dssc+xml": ["xdssc"],
		"application/ecmascript": ["es", "ecma"],
		"application/emma+xml": ["emma"],
		"application/emotionml+xml": ["emotionml"],
		"application/epub+zip": ["epub"],
		"application/exi": ["exi"],
		"application/express": ["exp"],
		"application/fdt+xml": ["fdt"],
		"application/font-tdpfr": ["pfr"],
		"application/geo+json": ["geojson"],
		"application/gml+xml": ["gml"],
		"application/gpx+xml": ["gpx"],
		"application/gxf": ["gxf"],
		"application/gzip": ["gz"],
		"application/hjson": ["hjson"],
		"application/hyperstudio": ["stk"],
		"application/inkml+xml": ["ink", "inkml"],
		"application/ipfix": ["ipfix"],
		"application/its+xml": ["its"],
		"application/java-archive": [
			"jar",
			"war",
			"ear"
		],
		"application/java-serialized-object": ["ser"],
		"application/java-vm": ["class"],
		"application/javascript": ["js", "mjs"],
		"application/json": ["json", "map"],
		"application/json5": ["json5"],
		"application/jsonml+json": ["jsonml"],
		"application/ld+json": ["jsonld"],
		"application/lgr+xml": ["lgr"],
		"application/lost+xml": ["lostxml"],
		"application/mac-binhex40": ["hqx"],
		"application/mac-compactpro": ["cpt"],
		"application/mads+xml": ["mads"],
		"application/manifest+json": ["webmanifest"],
		"application/marc": ["mrc"],
		"application/marcxml+xml": ["mrcx"],
		"application/mathematica": [
			"ma",
			"nb",
			"mb"
		],
		"application/mathml+xml": ["mathml"],
		"application/mbox": ["mbox"],
		"application/mediaservercontrol+xml": ["mscml"],
		"application/metalink+xml": ["metalink"],
		"application/metalink4+xml": ["meta4"],
		"application/mets+xml": ["mets"],
		"application/mmt-aei+xml": ["maei"],
		"application/mmt-usd+xml": ["musd"],
		"application/mods+xml": ["mods"],
		"application/mp21": ["m21", "mp21"],
		"application/mp4": ["mp4s", "m4p"],
		"application/msword": ["doc", "dot"],
		"application/mxf": ["mxf"],
		"application/n-quads": ["nq"],
		"application/n-triples": ["nt"],
		"application/node": ["cjs"],
		"application/octet-stream": [
			"bin",
			"dms",
			"lrf",
			"mar",
			"so",
			"dist",
			"distz",
			"pkg",
			"bpk",
			"dump",
			"elc",
			"deploy",
			"exe",
			"dll",
			"deb",
			"dmg",
			"iso",
			"img",
			"msi",
			"msp",
			"msm",
			"buffer"
		],
		"application/oda": ["oda"],
		"application/oebps-package+xml": ["opf"],
		"application/ogg": ["ogx"],
		"application/omdoc+xml": ["omdoc"],
		"application/onenote": [
			"onetoc",
			"onetoc2",
			"onetmp",
			"onepkg"
		],
		"application/oxps": ["oxps"],
		"application/p2p-overlay+xml": ["relo"],
		"application/patch-ops-error+xml": ["xer"],
		"application/pdf": ["pdf"],
		"application/pgp-encrypted": ["pgp"],
		"application/pgp-signature": ["asc", "sig"],
		"application/pics-rules": ["prf"],
		"application/pkcs10": ["p10"],
		"application/pkcs7-mime": ["p7m", "p7c"],
		"application/pkcs7-signature": ["p7s"],
		"application/pkcs8": ["p8"],
		"application/pkix-attr-cert": ["ac"],
		"application/pkix-cert": ["cer"],
		"application/pkix-crl": ["crl"],
		"application/pkix-pkipath": ["pkipath"],
		"application/pkixcmp": ["pki"],
		"application/pls+xml": ["pls"],
		"application/postscript": [
			"ai",
			"eps",
			"ps"
		],
		"application/provenance+xml": ["provx"],
		"application/pskc+xml": ["pskcxml"],
		"application/raml+yaml": ["raml"],
		"application/rdf+xml": ["rdf", "owl"],
		"application/reginfo+xml": ["rif"],
		"application/relax-ng-compact-syntax": ["rnc"],
		"application/resource-lists+xml": ["rl"],
		"application/resource-lists-diff+xml": ["rld"],
		"application/rls-services+xml": ["rs"],
		"application/route-apd+xml": ["rapd"],
		"application/route-s-tsid+xml": ["sls"],
		"application/route-usd+xml": ["rusd"],
		"application/rpki-ghostbusters": ["gbr"],
		"application/rpki-manifest": ["mft"],
		"application/rpki-roa": ["roa"],
		"application/rsd+xml": ["rsd"],
		"application/rss+xml": ["rss"],
		"application/rtf": ["rtf"],
		"application/sbml+xml": ["sbml"],
		"application/scvp-cv-request": ["scq"],
		"application/scvp-cv-response": ["scs"],
		"application/scvp-vp-request": ["spq"],
		"application/scvp-vp-response": ["spp"],
		"application/sdp": ["sdp"],
		"application/senml+xml": ["senmlx"],
		"application/sensml+xml": ["sensmlx"],
		"application/set-payment-initiation": ["setpay"],
		"application/set-registration-initiation": ["setreg"],
		"application/shf+xml": ["shf"],
		"application/sieve": ["siv", "sieve"],
		"application/smil+xml": ["smi", "smil"],
		"application/sparql-query": ["rq"],
		"application/sparql-results+xml": ["srx"],
		"application/srgs": ["gram"],
		"application/srgs+xml": ["grxml"],
		"application/sru+xml": ["sru"],
		"application/ssdl+xml": ["ssdl"],
		"application/ssml+xml": ["ssml"],
		"application/swid+xml": ["swidtag"],
		"application/tei+xml": ["tei", "teicorpus"],
		"application/thraud+xml": ["tfi"],
		"application/timestamped-data": ["tsd"],
		"application/toml": ["toml"],
		"application/trig": ["trig"],
		"application/ttml+xml": ["ttml"],
		"application/ubjson": ["ubj"],
		"application/urc-ressheet+xml": ["rsheet"],
		"application/urc-targetdesc+xml": ["td"],
		"application/voicexml+xml": ["vxml"],
		"application/wasm": ["wasm"],
		"application/widget": ["wgt"],
		"application/winhlp": ["hlp"],
		"application/wsdl+xml": ["wsdl"],
		"application/wspolicy+xml": ["wspolicy"],
		"application/xaml+xml": ["xaml"],
		"application/xcap-att+xml": ["xav"],
		"application/xcap-caps+xml": ["xca"],
		"application/xcap-diff+xml": ["xdf"],
		"application/xcap-el+xml": ["xel"],
		"application/xcap-ns+xml": ["xns"],
		"application/xenc+xml": ["xenc"],
		"application/xhtml+xml": ["xhtml", "xht"],
		"application/xliff+xml": ["xlf"],
		"application/xml": [
			"xml",
			"xsl",
			"xsd",
			"rng"
		],
		"application/xml-dtd": ["dtd"],
		"application/xop+xml": ["xop"],
		"application/xproc+xml": ["xpl"],
		"application/xslt+xml": ["*xsl", "xslt"],
		"application/xspf+xml": ["xspf"],
		"application/xv+xml": [
			"mxml",
			"xhvml",
			"xvml",
			"xvm"
		],
		"application/yang": ["yang"],
		"application/yin+xml": ["yin"],
		"application/zip": ["zip"],
		"audio/3gpp": ["*3gpp"],
		"audio/adpcm": ["adp"],
		"audio/amr": ["amr"],
		"audio/basic": ["au", "snd"],
		"audio/midi": [
			"mid",
			"midi",
			"kar",
			"rmi"
		],
		"audio/mobile-xmf": ["mxmf"],
		"audio/mp3": ["*mp3"],
		"audio/mp4": ["m4a", "mp4a"],
		"audio/mpeg": [
			"mpga",
			"mp2",
			"mp2a",
			"mp3",
			"m2a",
			"m3a"
		],
		"audio/ogg": [
			"oga",
			"ogg",
			"spx",
			"opus"
		],
		"audio/s3m": ["s3m"],
		"audio/silk": ["sil"],
		"audio/wav": ["wav"],
		"audio/wave": ["*wav"],
		"audio/webm": ["weba"],
		"audio/xm": ["xm"],
		"font/collection": ["ttc"],
		"font/otf": ["otf"],
		"font/ttf": ["ttf"],
		"font/woff": ["woff"],
		"font/woff2": ["woff2"],
		"image/aces": ["exr"],
		"image/apng": ["apng"],
		"image/avif": ["avif"],
		"image/bmp": ["bmp"],
		"image/cgm": ["cgm"],
		"image/dicom-rle": ["drle"],
		"image/emf": ["emf"],
		"image/fits": ["fits"],
		"image/g3fax": ["g3"],
		"image/gif": ["gif"],
		"image/heic": ["heic"],
		"image/heic-sequence": ["heics"],
		"image/heif": ["heif"],
		"image/heif-sequence": ["heifs"],
		"image/hej2k": ["hej2"],
		"image/hsj2": ["hsj2"],
		"image/ief": ["ief"],
		"image/jls": ["jls"],
		"image/jp2": ["jp2", "jpg2"],
		"image/jpeg": [
			"jpeg",
			"jpg",
			"jpe"
		],
		"image/jph": ["jph"],
		"image/jphc": ["jhc"],
		"image/jpm": ["jpm"],
		"image/jpx": ["jpx", "jpf"],
		"image/jxr": ["jxr"],
		"image/jxra": ["jxra"],
		"image/jxrs": ["jxrs"],
		"image/jxs": ["jxs"],
		"image/jxsc": ["jxsc"],
		"image/jxsi": ["jxsi"],
		"image/jxss": ["jxss"],
		"image/ktx": ["ktx"],
		"image/ktx2": ["ktx2"],
		"image/png": ["png"],
		"image/sgi": ["sgi"],
		"image/svg+xml": ["svg", "svgz"],
		"image/t38": ["t38"],
		"image/tiff": ["tif", "tiff"],
		"image/tiff-fx": ["tfx"],
		"image/webp": ["webp"],
		"image/wmf": ["wmf"],
		"message/disposition-notification": ["disposition-notification"],
		"message/global": ["u8msg"],
		"message/global-delivery-status": ["u8dsn"],
		"message/global-disposition-notification": ["u8mdn"],
		"message/global-headers": ["u8hdr"],
		"message/rfc822": ["eml", "mime"],
		"model/3mf": ["3mf"],
		"model/gltf+json": ["gltf"],
		"model/gltf-binary": ["glb"],
		"model/iges": ["igs", "iges"],
		"model/mesh": [
			"msh",
			"mesh",
			"silo"
		],
		"model/mtl": ["mtl"],
		"model/obj": ["obj"],
		"model/step+xml": ["stpx"],
		"model/step+zip": ["stpz"],
		"model/step-xml+zip": ["stpxz"],
		"model/stl": ["stl"],
		"model/vrml": ["wrl", "vrml"],
		"model/x3d+binary": ["*x3db", "x3dbz"],
		"model/x3d+fastinfoset": ["x3db"],
		"model/x3d+vrml": ["*x3dv", "x3dvz"],
		"model/x3d+xml": ["x3d", "x3dz"],
		"model/x3d-vrml": ["x3dv"],
		"text/cache-manifest": ["appcache", "manifest"],
		"text/calendar": ["ics", "ifb"],
		"text/coffeescript": ["coffee", "litcoffee"],
		"text/css": ["css"],
		"text/csv": ["csv"],
		"text/html": [
			"html",
			"htm",
			"shtml"
		],
		"text/jade": ["jade"],
		"text/jsx": ["jsx"],
		"text/less": ["less"],
		"text/markdown": ["markdown", "md"],
		"text/mathml": ["mml"],
		"text/mdx": ["mdx"],
		"text/n3": ["n3"],
		"text/plain": [
			"txt",
			"text",
			"conf",
			"def",
			"list",
			"log",
			"in",
			"ini"
		],
		"text/richtext": ["rtx"],
		"text/rtf": ["*rtf"],
		"text/sgml": ["sgml", "sgm"],
		"text/shex": ["shex"],
		"text/slim": ["slim", "slm"],
		"text/spdx": ["spdx"],
		"text/stylus": ["stylus", "styl"],
		"text/tab-separated-values": ["tsv"],
		"text/troff": [
			"t",
			"tr",
			"roff",
			"man",
			"me",
			"ms"
		],
		"text/turtle": ["ttl"],
		"text/uri-list": [
			"uri",
			"uris",
			"urls"
		],
		"text/vcard": ["vcard"],
		"text/vtt": ["vtt"],
		"text/xml": ["*xml"],
		"text/yaml": ["yaml", "yml"],
		"video/3gpp": ["3gp", "3gpp"],
		"video/3gpp2": ["3g2"],
		"video/h261": ["h261"],
		"video/h263": ["h263"],
		"video/h264": ["h264"],
		"video/iso.segment": ["m4s"],
		"video/jpeg": ["jpgv"],
		"video/jpm": ["*jpm", "jpgm"],
		"video/mj2": ["mj2", "mjp2"],
		"video/mp2t": ["ts"],
		"video/mp4": [
			"mp4",
			"mp4v",
			"mpg4"
		],
		"video/mpeg": [
			"mpeg",
			"mpg",
			"mpe",
			"m1v",
			"m2v"
		],
		"video/ogg": ["ogv"],
		"video/quicktime": ["qt", "mov"],
		"video/webm": ["webm"]
	};
}));
//#endregion
//#region node_modules/mime/types/other.js
var require_other = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"application/prs.cww": ["cww"],
		"application/vnd.1000minds.decision-model+xml": ["1km"],
		"application/vnd.3gpp.pic-bw-large": ["plb"],
		"application/vnd.3gpp.pic-bw-small": ["psb"],
		"application/vnd.3gpp.pic-bw-var": ["pvb"],
		"application/vnd.3gpp2.tcap": ["tcap"],
		"application/vnd.3m.post-it-notes": ["pwn"],
		"application/vnd.accpac.simply.aso": ["aso"],
		"application/vnd.accpac.simply.imp": ["imp"],
		"application/vnd.acucobol": ["acu"],
		"application/vnd.acucorp": ["atc", "acutc"],
		"application/vnd.adobe.air-application-installer-package+zip": ["air"],
		"application/vnd.adobe.formscentral.fcdt": ["fcdt"],
		"application/vnd.adobe.fxp": ["fxp", "fxpl"],
		"application/vnd.adobe.xdp+xml": ["xdp"],
		"application/vnd.adobe.xfdf": ["xfdf"],
		"application/vnd.ahead.space": ["ahead"],
		"application/vnd.airzip.filesecure.azf": ["azf"],
		"application/vnd.airzip.filesecure.azs": ["azs"],
		"application/vnd.amazon.ebook": ["azw"],
		"application/vnd.americandynamics.acc": ["acc"],
		"application/vnd.amiga.ami": ["ami"],
		"application/vnd.android.package-archive": ["apk"],
		"application/vnd.anser-web-certificate-issue-initiation": ["cii"],
		"application/vnd.anser-web-funds-transfer-initiation": ["fti"],
		"application/vnd.antix.game-component": ["atx"],
		"application/vnd.apple.installer+xml": ["mpkg"],
		"application/vnd.apple.keynote": ["key"],
		"application/vnd.apple.mpegurl": ["m3u8"],
		"application/vnd.apple.numbers": ["numbers"],
		"application/vnd.apple.pages": ["pages"],
		"application/vnd.apple.pkpass": ["pkpass"],
		"application/vnd.aristanetworks.swi": ["swi"],
		"application/vnd.astraea-software.iota": ["iota"],
		"application/vnd.audiograph": ["aep"],
		"application/vnd.balsamiq.bmml+xml": ["bmml"],
		"application/vnd.blueice.multipass": ["mpm"],
		"application/vnd.bmi": ["bmi"],
		"application/vnd.businessobjects": ["rep"],
		"application/vnd.chemdraw+xml": ["cdxml"],
		"application/vnd.chipnuts.karaoke-mmd": ["mmd"],
		"application/vnd.cinderella": ["cdy"],
		"application/vnd.citationstyles.style+xml": ["csl"],
		"application/vnd.claymore": ["cla"],
		"application/vnd.cloanto.rp9": ["rp9"],
		"application/vnd.clonk.c4group": [
			"c4g",
			"c4d",
			"c4f",
			"c4p",
			"c4u"
		],
		"application/vnd.cluetrust.cartomobile-config": ["c11amc"],
		"application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"],
		"application/vnd.commonspace": ["csp"],
		"application/vnd.contact.cmsg": ["cdbcmsg"],
		"application/vnd.cosmocaller": ["cmc"],
		"application/vnd.crick.clicker": ["clkx"],
		"application/vnd.crick.clicker.keyboard": ["clkk"],
		"application/vnd.crick.clicker.palette": ["clkp"],
		"application/vnd.crick.clicker.template": ["clkt"],
		"application/vnd.crick.clicker.wordbank": ["clkw"],
		"application/vnd.criticaltools.wbs+xml": ["wbs"],
		"application/vnd.ctc-posml": ["pml"],
		"application/vnd.cups-ppd": ["ppd"],
		"application/vnd.curl.car": ["car"],
		"application/vnd.curl.pcurl": ["pcurl"],
		"application/vnd.dart": ["dart"],
		"application/vnd.data-vision.rdz": ["rdz"],
		"application/vnd.dbf": ["dbf"],
		"application/vnd.dece.data": [
			"uvf",
			"uvvf",
			"uvd",
			"uvvd"
		],
		"application/vnd.dece.ttml+xml": ["uvt", "uvvt"],
		"application/vnd.dece.unspecified": ["uvx", "uvvx"],
		"application/vnd.dece.zip": ["uvz", "uvvz"],
		"application/vnd.denovo.fcselayout-link": ["fe_launch"],
		"application/vnd.dna": ["dna"],
		"application/vnd.dolby.mlp": ["mlp"],
		"application/vnd.dpgraph": ["dpg"],
		"application/vnd.dreamfactory": ["dfac"],
		"application/vnd.ds-keypoint": ["kpxx"],
		"application/vnd.dvb.ait": ["ait"],
		"application/vnd.dvb.service": ["svc"],
		"application/vnd.dynageo": ["geo"],
		"application/vnd.ecowin.chart": ["mag"],
		"application/vnd.enliven": ["nml"],
		"application/vnd.epson.esf": ["esf"],
		"application/vnd.epson.msf": ["msf"],
		"application/vnd.epson.quickanime": ["qam"],
		"application/vnd.epson.salt": ["slt"],
		"application/vnd.epson.ssf": ["ssf"],
		"application/vnd.eszigno3+xml": ["es3", "et3"],
		"application/vnd.ezpix-album": ["ez2"],
		"application/vnd.ezpix-package": ["ez3"],
		"application/vnd.fdf": ["fdf"],
		"application/vnd.fdsn.mseed": ["mseed"],
		"application/vnd.fdsn.seed": ["seed", "dataless"],
		"application/vnd.flographit": ["gph"],
		"application/vnd.fluxtime.clip": ["ftc"],
		"application/vnd.framemaker": [
			"fm",
			"frame",
			"maker",
			"book"
		],
		"application/vnd.frogans.fnc": ["fnc"],
		"application/vnd.frogans.ltf": ["ltf"],
		"application/vnd.fsc.weblaunch": ["fsc"],
		"application/vnd.fujitsu.oasys": ["oas"],
		"application/vnd.fujitsu.oasys2": ["oa2"],
		"application/vnd.fujitsu.oasys3": ["oa3"],
		"application/vnd.fujitsu.oasysgp": ["fg5"],
		"application/vnd.fujitsu.oasysprs": ["bh2"],
		"application/vnd.fujixerox.ddd": ["ddd"],
		"application/vnd.fujixerox.docuworks": ["xdw"],
		"application/vnd.fujixerox.docuworks.binder": ["xbd"],
		"application/vnd.fuzzysheet": ["fzs"],
		"application/vnd.genomatix.tuxedo": ["txd"],
		"application/vnd.geogebra.file": ["ggb"],
		"application/vnd.geogebra.tool": ["ggt"],
		"application/vnd.geometry-explorer": ["gex", "gre"],
		"application/vnd.geonext": ["gxt"],
		"application/vnd.geoplan": ["g2w"],
		"application/vnd.geospace": ["g3w"],
		"application/vnd.gmx": ["gmx"],
		"application/vnd.google-apps.document": ["gdoc"],
		"application/vnd.google-apps.presentation": ["gslides"],
		"application/vnd.google-apps.spreadsheet": ["gsheet"],
		"application/vnd.google-earth.kml+xml": ["kml"],
		"application/vnd.google-earth.kmz": ["kmz"],
		"application/vnd.grafeq": ["gqf", "gqs"],
		"application/vnd.groove-account": ["gac"],
		"application/vnd.groove-help": ["ghf"],
		"application/vnd.groove-identity-message": ["gim"],
		"application/vnd.groove-injector": ["grv"],
		"application/vnd.groove-tool-message": ["gtm"],
		"application/vnd.groove-tool-template": ["tpl"],
		"application/vnd.groove-vcard": ["vcg"],
		"application/vnd.hal+xml": ["hal"],
		"application/vnd.handheld-entertainment+xml": ["zmm"],
		"application/vnd.hbci": ["hbci"],
		"application/vnd.hhe.lesson-player": ["les"],
		"application/vnd.hp-hpgl": ["hpgl"],
		"application/vnd.hp-hpid": ["hpid"],
		"application/vnd.hp-hps": ["hps"],
		"application/vnd.hp-jlyt": ["jlt"],
		"application/vnd.hp-pcl": ["pcl"],
		"application/vnd.hp-pclxl": ["pclxl"],
		"application/vnd.hydrostatix.sof-data": ["sfd-hdstx"],
		"application/vnd.ibm.minipay": ["mpy"],
		"application/vnd.ibm.modcap": [
			"afp",
			"listafp",
			"list3820"
		],
		"application/vnd.ibm.rights-management": ["irm"],
		"application/vnd.ibm.secure-container": ["sc"],
		"application/vnd.iccprofile": ["icc", "icm"],
		"application/vnd.igloader": ["igl"],
		"application/vnd.immervision-ivp": ["ivp"],
		"application/vnd.immervision-ivu": ["ivu"],
		"application/vnd.insors.igm": ["igm"],
		"application/vnd.intercon.formnet": ["xpw", "xpx"],
		"application/vnd.intergeo": ["i2g"],
		"application/vnd.intu.qbo": ["qbo"],
		"application/vnd.intu.qfx": ["qfx"],
		"application/vnd.ipunplugged.rcprofile": ["rcprofile"],
		"application/vnd.irepository.package+xml": ["irp"],
		"application/vnd.is-xpr": ["xpr"],
		"application/vnd.isac.fcs": ["fcs"],
		"application/vnd.jam": ["jam"],
		"application/vnd.jcp.javame.midlet-rms": ["rms"],
		"application/vnd.jisp": ["jisp"],
		"application/vnd.joost.joda-archive": ["joda"],
		"application/vnd.kahootz": ["ktz", "ktr"],
		"application/vnd.kde.karbon": ["karbon"],
		"application/vnd.kde.kchart": ["chrt"],
		"application/vnd.kde.kformula": ["kfo"],
		"application/vnd.kde.kivio": ["flw"],
		"application/vnd.kde.kontour": ["kon"],
		"application/vnd.kde.kpresenter": ["kpr", "kpt"],
		"application/vnd.kde.kspread": ["ksp"],
		"application/vnd.kde.kword": ["kwd", "kwt"],
		"application/vnd.kenameaapp": ["htke"],
		"application/vnd.kidspiration": ["kia"],
		"application/vnd.kinar": ["kne", "knp"],
		"application/vnd.koan": [
			"skp",
			"skd",
			"skt",
			"skm"
		],
		"application/vnd.kodak-descriptor": ["sse"],
		"application/vnd.las.las+xml": ["lasxml"],
		"application/vnd.llamagraphics.life-balance.desktop": ["lbd"],
		"application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"],
		"application/vnd.lotus-1-2-3": ["123"],
		"application/vnd.lotus-approach": ["apr"],
		"application/vnd.lotus-freelance": ["pre"],
		"application/vnd.lotus-notes": ["nsf"],
		"application/vnd.lotus-organizer": ["org"],
		"application/vnd.lotus-screencam": ["scm"],
		"application/vnd.lotus-wordpro": ["lwp"],
		"application/vnd.macports.portpkg": ["portpkg"],
		"application/vnd.mapbox-vector-tile": ["mvt"],
		"application/vnd.mcd": ["mcd"],
		"application/vnd.medcalcdata": ["mc1"],
		"application/vnd.mediastation.cdkey": ["cdkey"],
		"application/vnd.mfer": ["mwf"],
		"application/vnd.mfmp": ["mfm"],
		"application/vnd.micrografx.flo": ["flo"],
		"application/vnd.micrografx.igx": ["igx"],
		"application/vnd.mif": ["mif"],
		"application/vnd.mobius.daf": ["daf"],
		"application/vnd.mobius.dis": ["dis"],
		"application/vnd.mobius.mbk": ["mbk"],
		"application/vnd.mobius.mqy": ["mqy"],
		"application/vnd.mobius.msl": ["msl"],
		"application/vnd.mobius.plc": ["plc"],
		"application/vnd.mobius.txf": ["txf"],
		"application/vnd.mophun.application": ["mpn"],
		"application/vnd.mophun.certificate": ["mpc"],
		"application/vnd.mozilla.xul+xml": ["xul"],
		"application/vnd.ms-artgalry": ["cil"],
		"application/vnd.ms-cab-compressed": ["cab"],
		"application/vnd.ms-excel": [
			"xls",
			"xlm",
			"xla",
			"xlc",
			"xlt",
			"xlw"
		],
		"application/vnd.ms-excel.addin.macroenabled.12": ["xlam"],
		"application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"],
		"application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"],
		"application/vnd.ms-excel.template.macroenabled.12": ["xltm"],
		"application/vnd.ms-fontobject": ["eot"],
		"application/vnd.ms-htmlhelp": ["chm"],
		"application/vnd.ms-ims": ["ims"],
		"application/vnd.ms-lrm": ["lrm"],
		"application/vnd.ms-officetheme": ["thmx"],
		"application/vnd.ms-outlook": ["msg"],
		"application/vnd.ms-pki.seccat": ["cat"],
		"application/vnd.ms-pki.stl": ["*stl"],
		"application/vnd.ms-powerpoint": [
			"ppt",
			"pps",
			"pot"
		],
		"application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"],
		"application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"],
		"application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"],
		"application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"],
		"application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"],
		"application/vnd.ms-project": ["mpp", "mpt"],
		"application/vnd.ms-word.document.macroenabled.12": ["docm"],
		"application/vnd.ms-word.template.macroenabled.12": ["dotm"],
		"application/vnd.ms-works": [
			"wps",
			"wks",
			"wcm",
			"wdb"
		],
		"application/vnd.ms-wpl": ["wpl"],
		"application/vnd.ms-xpsdocument": ["xps"],
		"application/vnd.mseq": ["mseq"],
		"application/vnd.musician": ["mus"],
		"application/vnd.muvee.style": ["msty"],
		"application/vnd.mynfc": ["taglet"],
		"application/vnd.neurolanguage.nlu": ["nlu"],
		"application/vnd.nitf": ["ntf", "nitf"],
		"application/vnd.noblenet-directory": ["nnd"],
		"application/vnd.noblenet-sealer": ["nns"],
		"application/vnd.noblenet-web": ["nnw"],
		"application/vnd.nokia.n-gage.ac+xml": ["*ac"],
		"application/vnd.nokia.n-gage.data": ["ngdat"],
		"application/vnd.nokia.n-gage.symbian.install": ["n-gage"],
		"application/vnd.nokia.radio-preset": ["rpst"],
		"application/vnd.nokia.radio-presets": ["rpss"],
		"application/vnd.novadigm.edm": ["edm"],
		"application/vnd.novadigm.edx": ["edx"],
		"application/vnd.novadigm.ext": ["ext"],
		"application/vnd.oasis.opendocument.chart": ["odc"],
		"application/vnd.oasis.opendocument.chart-template": ["otc"],
		"application/vnd.oasis.opendocument.database": ["odb"],
		"application/vnd.oasis.opendocument.formula": ["odf"],
		"application/vnd.oasis.opendocument.formula-template": ["odft"],
		"application/vnd.oasis.opendocument.graphics": ["odg"],
		"application/vnd.oasis.opendocument.graphics-template": ["otg"],
		"application/vnd.oasis.opendocument.image": ["odi"],
		"application/vnd.oasis.opendocument.image-template": ["oti"],
		"application/vnd.oasis.opendocument.presentation": ["odp"],
		"application/vnd.oasis.opendocument.presentation-template": ["otp"],
		"application/vnd.oasis.opendocument.spreadsheet": ["ods"],
		"application/vnd.oasis.opendocument.spreadsheet-template": ["ots"],
		"application/vnd.oasis.opendocument.text": ["odt"],
		"application/vnd.oasis.opendocument.text-master": ["odm"],
		"application/vnd.oasis.opendocument.text-template": ["ott"],
		"application/vnd.oasis.opendocument.text-web": ["oth"],
		"application/vnd.olpc-sugar": ["xo"],
		"application/vnd.oma.dd2+xml": ["dd2"],
		"application/vnd.openblox.game+xml": ["obgx"],
		"application/vnd.openofficeorg.extension": ["oxt"],
		"application/vnd.openstreetmap.data+xml": ["osm"],
		"application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
		"application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"],
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"],
		"application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"],
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
		"application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"],
		"application/vnd.osgeo.mapguide.package": ["mgp"],
		"application/vnd.osgi.dp": ["dp"],
		"application/vnd.osgi.subsystem": ["esa"],
		"application/vnd.palm": [
			"pdb",
			"pqa",
			"oprc"
		],
		"application/vnd.pawaafile": ["paw"],
		"application/vnd.pg.format": ["str"],
		"application/vnd.pg.osasli": ["ei6"],
		"application/vnd.picsel": ["efif"],
		"application/vnd.pmi.widget": ["wg"],
		"application/vnd.pocketlearn": ["plf"],
		"application/vnd.powerbuilder6": ["pbd"],
		"application/vnd.previewsystems.box": ["box"],
		"application/vnd.proteus.magazine": ["mgz"],
		"application/vnd.publishare-delta-tree": ["qps"],
		"application/vnd.pvi.ptid1": ["ptid"],
		"application/vnd.quark.quarkxpress": [
			"qxd",
			"qxt",
			"qwd",
			"qwt",
			"qxl",
			"qxb"
		],
		"application/vnd.rar": ["rar"],
		"application/vnd.realvnc.bed": ["bed"],
		"application/vnd.recordare.musicxml": ["mxl"],
		"application/vnd.recordare.musicxml+xml": ["musicxml"],
		"application/vnd.rig.cryptonote": ["cryptonote"],
		"application/vnd.rim.cod": ["cod"],
		"application/vnd.rn-realmedia": ["rm"],
		"application/vnd.rn-realmedia-vbr": ["rmvb"],
		"application/vnd.route66.link66+xml": ["link66"],
		"application/vnd.sailingtracker.track": ["st"],
		"application/vnd.seemail": ["see"],
		"application/vnd.sema": ["sema"],
		"application/vnd.semd": ["semd"],
		"application/vnd.semf": ["semf"],
		"application/vnd.shana.informed.formdata": ["ifm"],
		"application/vnd.shana.informed.formtemplate": ["itp"],
		"application/vnd.shana.informed.interchange": ["iif"],
		"application/vnd.shana.informed.package": ["ipk"],
		"application/vnd.simtech-mindmapper": ["twd", "twds"],
		"application/vnd.smaf": ["mmf"],
		"application/vnd.smart.teacher": ["teacher"],
		"application/vnd.software602.filler.form+xml": ["fo"],
		"application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
		"application/vnd.spotfire.dxp": ["dxp"],
		"application/vnd.spotfire.sfs": ["sfs"],
		"application/vnd.stardivision.calc": ["sdc"],
		"application/vnd.stardivision.draw": ["sda"],
		"application/vnd.stardivision.impress": ["sdd"],
		"application/vnd.stardivision.math": ["smf"],
		"application/vnd.stardivision.writer": ["sdw", "vor"],
		"application/vnd.stardivision.writer-global": ["sgl"],
		"application/vnd.stepmania.package": ["smzip"],
		"application/vnd.stepmania.stepchart": ["sm"],
		"application/vnd.sun.wadl+xml": ["wadl"],
		"application/vnd.sun.xml.calc": ["sxc"],
		"application/vnd.sun.xml.calc.template": ["stc"],
		"application/vnd.sun.xml.draw": ["sxd"],
		"application/vnd.sun.xml.draw.template": ["std"],
		"application/vnd.sun.xml.impress": ["sxi"],
		"application/vnd.sun.xml.impress.template": ["sti"],
		"application/vnd.sun.xml.math": ["sxm"],
		"application/vnd.sun.xml.writer": ["sxw"],
		"application/vnd.sun.xml.writer.global": ["sxg"],
		"application/vnd.sun.xml.writer.template": ["stw"],
		"application/vnd.sus-calendar": ["sus", "susp"],
		"application/vnd.svd": ["svd"],
		"application/vnd.symbian.install": ["sis", "sisx"],
		"application/vnd.syncml+xml": ["xsm"],
		"application/vnd.syncml.dm+wbxml": ["bdm"],
		"application/vnd.syncml.dm+xml": ["xdm"],
		"application/vnd.syncml.dmddf+xml": ["ddf"],
		"application/vnd.tao.intent-module-archive": ["tao"],
		"application/vnd.tcpdump.pcap": [
			"pcap",
			"cap",
			"dmp"
		],
		"application/vnd.tmobile-livetv": ["tmo"],
		"application/vnd.trid.tpt": ["tpt"],
		"application/vnd.triscape.mxs": ["mxs"],
		"application/vnd.trueapp": ["tra"],
		"application/vnd.ufdl": ["ufd", "ufdl"],
		"application/vnd.uiq.theme": ["utz"],
		"application/vnd.umajin": ["umj"],
		"application/vnd.unity": ["unityweb"],
		"application/vnd.uoml+xml": ["uoml"],
		"application/vnd.vcx": ["vcx"],
		"application/vnd.visio": [
			"vsd",
			"vst",
			"vss",
			"vsw"
		],
		"application/vnd.visionary": ["vis"],
		"application/vnd.vsf": ["vsf"],
		"application/vnd.wap.wbxml": ["wbxml"],
		"application/vnd.wap.wmlc": ["wmlc"],
		"application/vnd.wap.wmlscriptc": ["wmlsc"],
		"application/vnd.webturbo": ["wtb"],
		"application/vnd.wolfram.player": ["nbp"],
		"application/vnd.wordperfect": ["wpd"],
		"application/vnd.wqd": ["wqd"],
		"application/vnd.wt.stf": ["stf"],
		"application/vnd.xara": ["xar"],
		"application/vnd.xfdl": ["xfdl"],
		"application/vnd.yamaha.hv-dic": ["hvd"],
		"application/vnd.yamaha.hv-script": ["hvs"],
		"application/vnd.yamaha.hv-voice": ["hvp"],
		"application/vnd.yamaha.openscoreformat": ["osf"],
		"application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"],
		"application/vnd.yamaha.smaf-audio": ["saf"],
		"application/vnd.yamaha.smaf-phrase": ["spf"],
		"application/vnd.yellowriver-custom-menu": ["cmp"],
		"application/vnd.zul": ["zir", "zirz"],
		"application/vnd.zzazz.deck+xml": ["zaz"],
		"application/x-7z-compressed": ["7z"],
		"application/x-abiword": ["abw"],
		"application/x-ace-compressed": ["ace"],
		"application/x-apple-diskimage": ["*dmg"],
		"application/x-arj": ["arj"],
		"application/x-authorware-bin": [
			"aab",
			"x32",
			"u32",
			"vox"
		],
		"application/x-authorware-map": ["aam"],
		"application/x-authorware-seg": ["aas"],
		"application/x-bcpio": ["bcpio"],
		"application/x-bdoc": ["*bdoc"],
		"application/x-bittorrent": ["torrent"],
		"application/x-blorb": ["blb", "blorb"],
		"application/x-bzip": ["bz"],
		"application/x-bzip2": ["bz2", "boz"],
		"application/x-cbr": [
			"cbr",
			"cba",
			"cbt",
			"cbz",
			"cb7"
		],
		"application/x-cdlink": ["vcd"],
		"application/x-cfs-compressed": ["cfs"],
		"application/x-chat": ["chat"],
		"application/x-chess-pgn": ["pgn"],
		"application/x-chrome-extension": ["crx"],
		"application/x-cocoa": ["cco"],
		"application/x-conference": ["nsc"],
		"application/x-cpio": ["cpio"],
		"application/x-csh": ["csh"],
		"application/x-debian-package": ["*deb", "udeb"],
		"application/x-dgc-compressed": ["dgc"],
		"application/x-director": [
			"dir",
			"dcr",
			"dxr",
			"cst",
			"cct",
			"cxt",
			"w3d",
			"fgd",
			"swa"
		],
		"application/x-doom": ["wad"],
		"application/x-dtbncx+xml": ["ncx"],
		"application/x-dtbook+xml": ["dtb"],
		"application/x-dtbresource+xml": ["res"],
		"application/x-dvi": ["dvi"],
		"application/x-envoy": ["evy"],
		"application/x-eva": ["eva"],
		"application/x-font-bdf": ["bdf"],
		"application/x-font-ghostscript": ["gsf"],
		"application/x-font-linux-psf": ["psf"],
		"application/x-font-pcf": ["pcf"],
		"application/x-font-snf": ["snf"],
		"application/x-font-type1": [
			"pfa",
			"pfb",
			"pfm",
			"afm"
		],
		"application/x-freearc": ["arc"],
		"application/x-futuresplash": ["spl"],
		"application/x-gca-compressed": ["gca"],
		"application/x-glulx": ["ulx"],
		"application/x-gnumeric": ["gnumeric"],
		"application/x-gramps-xml": ["gramps"],
		"application/x-gtar": ["gtar"],
		"application/x-hdf": ["hdf"],
		"application/x-httpd-php": ["php"],
		"application/x-install-instructions": ["install"],
		"application/x-iso9660-image": ["*iso"],
		"application/x-iwork-keynote-sffkey": ["*key"],
		"application/x-iwork-numbers-sffnumbers": ["*numbers"],
		"application/x-iwork-pages-sffpages": ["*pages"],
		"application/x-java-archive-diff": ["jardiff"],
		"application/x-java-jnlp-file": ["jnlp"],
		"application/x-keepass2": ["kdbx"],
		"application/x-latex": ["latex"],
		"application/x-lua-bytecode": ["luac"],
		"application/x-lzh-compressed": ["lzh", "lha"],
		"application/x-makeself": ["run"],
		"application/x-mie": ["mie"],
		"application/x-mobipocket-ebook": ["prc", "mobi"],
		"application/x-ms-application": ["application"],
		"application/x-ms-shortcut": ["lnk"],
		"application/x-ms-wmd": ["wmd"],
		"application/x-ms-wmz": ["wmz"],
		"application/x-ms-xbap": ["xbap"],
		"application/x-msaccess": ["mdb"],
		"application/x-msbinder": ["obd"],
		"application/x-mscardfile": ["crd"],
		"application/x-msclip": ["clp"],
		"application/x-msdos-program": ["*exe"],
		"application/x-msdownload": [
			"*exe",
			"*dll",
			"com",
			"bat",
			"*msi"
		],
		"application/x-msmediaview": [
			"mvb",
			"m13",
			"m14"
		],
		"application/x-msmetafile": [
			"*wmf",
			"*wmz",
			"*emf",
			"emz"
		],
		"application/x-msmoney": ["mny"],
		"application/x-mspublisher": ["pub"],
		"application/x-msschedule": ["scd"],
		"application/x-msterminal": ["trm"],
		"application/x-mswrite": ["wri"],
		"application/x-netcdf": ["nc", "cdf"],
		"application/x-ns-proxy-autoconfig": ["pac"],
		"application/x-nzb": ["nzb"],
		"application/x-perl": ["pl", "pm"],
		"application/x-pilot": ["*prc", "*pdb"],
		"application/x-pkcs12": ["p12", "pfx"],
		"application/x-pkcs7-certificates": ["p7b", "spc"],
		"application/x-pkcs7-certreqresp": ["p7r"],
		"application/x-rar-compressed": ["*rar"],
		"application/x-redhat-package-manager": ["rpm"],
		"application/x-research-info-systems": ["ris"],
		"application/x-sea": ["sea"],
		"application/x-sh": ["sh"],
		"application/x-shar": ["shar"],
		"application/x-shockwave-flash": ["swf"],
		"application/x-silverlight-app": ["xap"],
		"application/x-sql": ["sql"],
		"application/x-stuffit": ["sit"],
		"application/x-stuffitx": ["sitx"],
		"application/x-subrip": ["srt"],
		"application/x-sv4cpio": ["sv4cpio"],
		"application/x-sv4crc": ["sv4crc"],
		"application/x-t3vm-image": ["t3"],
		"application/x-tads": ["gam"],
		"application/x-tar": ["tar"],
		"application/x-tcl": ["tcl", "tk"],
		"application/x-tex": ["tex"],
		"application/x-tex-tfm": ["tfm"],
		"application/x-texinfo": ["texinfo", "texi"],
		"application/x-tgif": ["*obj"],
		"application/x-ustar": ["ustar"],
		"application/x-virtualbox-hdd": ["hdd"],
		"application/x-virtualbox-ova": ["ova"],
		"application/x-virtualbox-ovf": ["ovf"],
		"application/x-virtualbox-vbox": ["vbox"],
		"application/x-virtualbox-vbox-extpack": ["vbox-extpack"],
		"application/x-virtualbox-vdi": ["vdi"],
		"application/x-virtualbox-vhd": ["vhd"],
		"application/x-virtualbox-vmdk": ["vmdk"],
		"application/x-wais-source": ["src"],
		"application/x-web-app-manifest+json": ["webapp"],
		"application/x-x509-ca-cert": [
			"der",
			"crt",
			"pem"
		],
		"application/x-xfig": ["fig"],
		"application/x-xliff+xml": ["*xlf"],
		"application/x-xpinstall": ["xpi"],
		"application/x-xz": ["xz"],
		"application/x-zmachine": [
			"z1",
			"z2",
			"z3",
			"z4",
			"z5",
			"z6",
			"z7",
			"z8"
		],
		"audio/vnd.dece.audio": ["uva", "uvva"],
		"audio/vnd.digital-winds": ["eol"],
		"audio/vnd.dra": ["dra"],
		"audio/vnd.dts": ["dts"],
		"audio/vnd.dts.hd": ["dtshd"],
		"audio/vnd.lucent.voice": ["lvp"],
		"audio/vnd.ms-playready.media.pya": ["pya"],
		"audio/vnd.nuera.ecelp4800": ["ecelp4800"],
		"audio/vnd.nuera.ecelp7470": ["ecelp7470"],
		"audio/vnd.nuera.ecelp9600": ["ecelp9600"],
		"audio/vnd.rip": ["rip"],
		"audio/x-aac": ["aac"],
		"audio/x-aiff": [
			"aif",
			"aiff",
			"aifc"
		],
		"audio/x-caf": ["caf"],
		"audio/x-flac": ["flac"],
		"audio/x-m4a": ["*m4a"],
		"audio/x-matroska": ["mka"],
		"audio/x-mpegurl": ["m3u"],
		"audio/x-ms-wax": ["wax"],
		"audio/x-ms-wma": ["wma"],
		"audio/x-pn-realaudio": ["ram", "ra"],
		"audio/x-pn-realaudio-plugin": ["rmp"],
		"audio/x-realaudio": ["*ra"],
		"audio/x-wav": ["*wav"],
		"chemical/x-cdx": ["cdx"],
		"chemical/x-cif": ["cif"],
		"chemical/x-cmdf": ["cmdf"],
		"chemical/x-cml": ["cml"],
		"chemical/x-csml": ["csml"],
		"chemical/x-xyz": ["xyz"],
		"image/prs.btif": ["btif"],
		"image/prs.pti": ["pti"],
		"image/vnd.adobe.photoshop": ["psd"],
		"image/vnd.airzip.accelerator.azv": ["azv"],
		"image/vnd.dece.graphic": [
			"uvi",
			"uvvi",
			"uvg",
			"uvvg"
		],
		"image/vnd.djvu": ["djvu", "djv"],
		"image/vnd.dvb.subtitle": ["*sub"],
		"image/vnd.dwg": ["dwg"],
		"image/vnd.dxf": ["dxf"],
		"image/vnd.fastbidsheet": ["fbs"],
		"image/vnd.fpx": ["fpx"],
		"image/vnd.fst": ["fst"],
		"image/vnd.fujixerox.edmics-mmr": ["mmr"],
		"image/vnd.fujixerox.edmics-rlc": ["rlc"],
		"image/vnd.microsoft.icon": ["ico"],
		"image/vnd.ms-dds": ["dds"],
		"image/vnd.ms-modi": ["mdi"],
		"image/vnd.ms-photo": ["wdp"],
		"image/vnd.net-fpx": ["npx"],
		"image/vnd.pco.b16": ["b16"],
		"image/vnd.tencent.tap": ["tap"],
		"image/vnd.valve.source.texture": ["vtf"],
		"image/vnd.wap.wbmp": ["wbmp"],
		"image/vnd.xiff": ["xif"],
		"image/vnd.zbrush.pcx": ["pcx"],
		"image/x-3ds": ["3ds"],
		"image/x-cmu-raster": ["ras"],
		"image/x-cmx": ["cmx"],
		"image/x-freehand": [
			"fh",
			"fhc",
			"fh4",
			"fh5",
			"fh7"
		],
		"image/x-icon": ["*ico"],
		"image/x-jng": ["jng"],
		"image/x-mrsid-image": ["sid"],
		"image/x-ms-bmp": ["*bmp"],
		"image/x-pcx": ["*pcx"],
		"image/x-pict": ["pic", "pct"],
		"image/x-portable-anymap": ["pnm"],
		"image/x-portable-bitmap": ["pbm"],
		"image/x-portable-graymap": ["pgm"],
		"image/x-portable-pixmap": ["ppm"],
		"image/x-rgb": ["rgb"],
		"image/x-tga": ["tga"],
		"image/x-xbitmap": ["xbm"],
		"image/x-xpixmap": ["xpm"],
		"image/x-xwindowdump": ["xwd"],
		"message/vnd.wfa.wsc": ["wsc"],
		"model/vnd.collada+xml": ["dae"],
		"model/vnd.dwf": ["dwf"],
		"model/vnd.gdl": ["gdl"],
		"model/vnd.gtw": ["gtw"],
		"model/vnd.mts": ["mts"],
		"model/vnd.opengex": ["ogex"],
		"model/vnd.parasolid.transmit.binary": ["x_b"],
		"model/vnd.parasolid.transmit.text": ["x_t"],
		"model/vnd.sap.vds": ["vds"],
		"model/vnd.usdz+zip": ["usdz"],
		"model/vnd.valve.source.compiled-map": ["bsp"],
		"model/vnd.vtu": ["vtu"],
		"text/prs.lines.tag": ["dsc"],
		"text/vnd.curl": ["curl"],
		"text/vnd.curl.dcurl": ["dcurl"],
		"text/vnd.curl.mcurl": ["mcurl"],
		"text/vnd.curl.scurl": ["scurl"],
		"text/vnd.dvb.subtitle": ["sub"],
		"text/vnd.fly": ["fly"],
		"text/vnd.fmi.flexstor": ["flx"],
		"text/vnd.graphviz": ["gv"],
		"text/vnd.in3d.3dml": ["3dml"],
		"text/vnd.in3d.spot": ["spot"],
		"text/vnd.sun.j2me.app-descriptor": ["jad"],
		"text/vnd.wap.wml": ["wml"],
		"text/vnd.wap.wmlscript": ["wmls"],
		"text/x-asm": ["s", "asm"],
		"text/x-c": [
			"c",
			"cc",
			"cxx",
			"cpp",
			"h",
			"hh",
			"dic"
		],
		"text/x-component": ["htc"],
		"text/x-fortran": [
			"f",
			"for",
			"f77",
			"f90"
		],
		"text/x-handlebars-template": ["hbs"],
		"text/x-java-source": ["java"],
		"text/x-lua": ["lua"],
		"text/x-markdown": ["mkd"],
		"text/x-nfo": ["nfo"],
		"text/x-opml": ["opml"],
		"text/x-org": ["*org"],
		"text/x-pascal": ["p", "pas"],
		"text/x-processing": ["pde"],
		"text/x-sass": ["sass"],
		"text/x-scss": ["scss"],
		"text/x-setext": ["etx"],
		"text/x-sfv": ["sfv"],
		"text/x-suse-ymp": ["ymp"],
		"text/x-uuencode": ["uu"],
		"text/x-vcalendar": ["vcs"],
		"text/x-vcard": ["vcf"],
		"video/vnd.dece.hd": ["uvh", "uvvh"],
		"video/vnd.dece.mobile": ["uvm", "uvvm"],
		"video/vnd.dece.pd": ["uvp", "uvvp"],
		"video/vnd.dece.sd": ["uvs", "uvvs"],
		"video/vnd.dece.video": ["uvv", "uvvv"],
		"video/vnd.dvb.file": ["dvb"],
		"video/vnd.fvt": ["fvt"],
		"video/vnd.mpegurl": ["mxu", "m4u"],
		"video/vnd.ms-playready.media.pyv": ["pyv"],
		"video/vnd.uvvu.mp4": ["uvu", "uvvu"],
		"video/vnd.vivo": ["viv"],
		"video/x-f4v": ["f4v"],
		"video/x-fli": ["fli"],
		"video/x-flv": ["flv"],
		"video/x-m4v": ["m4v"],
		"video/x-matroska": [
			"mkv",
			"mk3d",
			"mks"
		],
		"video/x-mng": ["mng"],
		"video/x-ms-asf": ["asf", "asx"],
		"video/x-ms-vob": ["vob"],
		"video/x-ms-wm": ["wm"],
		"video/x-ms-wmv": ["wmv"],
		"video/x-ms-wmx": ["wmx"],
		"video/x-ms-wvx": ["wvx"],
		"video/x-msvideo": ["avi"],
		"video/x-sgi-movie": ["movie"],
		"video/x-smv": ["smv"],
		"x-conference/x-cooltalk": ["ice"]
	};
}));
//#endregion
//#region node_modules/mime/index.js
var require_mime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_Mime())(require_standard(), require_other());
}));
//#endregion
//#region node_modules/yocto-queue/index.js
var require_yocto_queue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Node = class {
		constructor(value) {
			this.value = value;
			this.next = void 0;
		}
	};
	var Queue = class {
		constructor() {
			this.clear();
		}
		enqueue(value) {
			const node = new Node(value);
			if (this._head) {
				this._tail.next = node;
				this._tail = node;
			} else {
				this._head = node;
				this._tail = node;
			}
			this._size++;
		}
		dequeue() {
			const current = this._head;
			if (!current) return;
			this._head = this._head.next;
			this._size--;
			return current.value;
		}
		clear() {
			this._head = void 0;
			this._tail = void 0;
			this._size = 0;
		}
		get size() {
			return this._size;
		}
		*[Symbol.iterator]() {
			let current = this._head;
			while (current) {
				yield current.value;
				current = current.next;
			}
		}
	};
	module.exports = Queue;
}));
//#endregion
//#region node_modules/p-limit/index.js
var require_p_limit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Queue = require_yocto_queue();
	var pLimit = (concurrency) => {
		if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) throw new TypeError("Expected `concurrency` to be a number from 1 and up");
		const queue = new Queue();
		let activeCount = 0;
		const next = () => {
			activeCount--;
			if (queue.size > 0) queue.dequeue()();
		};
		const run = async (fn, resolve, ...args) => {
			activeCount++;
			const result = (async () => fn(...args))();
			resolve(result);
			try {
				await result;
			} catch {}
			next();
		};
		const enqueue = (fn, resolve, ...args) => {
			queue.enqueue(run.bind(null, fn, resolve, ...args));
			(async () => {
				await Promise.resolve();
				if (activeCount < concurrency && queue.size > 0) queue.dequeue()();
			})();
		};
		const generator = (fn, ...args) => new Promise((resolve) => {
			enqueue(fn, resolve, ...args);
		});
		Object.defineProperties(generator, {
			activeCount: { get: () => activeCount },
			pendingCount: { get: () => queue.size },
			clearQueue: { value: () => {
				queue.clear();
			} }
		});
		return generator;
	};
	module.exports = pLimit;
}));
//#endregion
//#region node_modules/retry/lib/retry_operation.js
var require_retry_operation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function RetryOperation(timeouts, options) {
		if (typeof options === "boolean") options = { forever: options };
		this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
		this._timeouts = timeouts;
		this._options = options || {};
		this._maxRetryTime = options && options.maxRetryTime || Infinity;
		this._fn = null;
		this._errors = [];
		this._attempts = 1;
		this._operationTimeout = null;
		this._operationTimeoutCb = null;
		this._timeout = null;
		this._operationStart = null;
		this._timer = null;
		if (this._options.forever) this._cachedTimeouts = this._timeouts.slice(0);
	}
	module.exports = RetryOperation;
	RetryOperation.prototype.reset = function() {
		this._attempts = 1;
		this._timeouts = this._originalTimeouts.slice(0);
	};
	RetryOperation.prototype.stop = function() {
		if (this._timeout) clearTimeout(this._timeout);
		if (this._timer) clearTimeout(this._timer);
		this._timeouts = [];
		this._cachedTimeouts = null;
	};
	RetryOperation.prototype.retry = function(err) {
		if (this._timeout) clearTimeout(this._timeout);
		if (!err) return false;
		var currentTime = (/* @__PURE__ */ new Date()).getTime();
		if (err && currentTime - this._operationStart >= this._maxRetryTime) {
			this._errors.push(err);
			this._errors.unshift(/* @__PURE__ */ new Error("RetryOperation timeout occurred"));
			return false;
		}
		this._errors.push(err);
		var timeout = this._timeouts.shift();
		if (timeout === void 0) if (this._cachedTimeouts) {
			this._errors.splice(0, this._errors.length - 1);
			timeout = this._cachedTimeouts.slice(-1);
		} else return false;
		var self = this;
		this._timer = setTimeout(function() {
			self._attempts++;
			if (self._operationTimeoutCb) {
				self._timeout = setTimeout(function() {
					self._operationTimeoutCb(self._attempts);
				}, self._operationTimeout);
				if (self._options.unref) self._timeout.unref();
			}
			self._fn(self._attempts);
		}, timeout);
		if (this._options.unref) this._timer.unref();
		return true;
	};
	RetryOperation.prototype.attempt = function(fn, timeoutOps) {
		this._fn = fn;
		if (timeoutOps) {
			if (timeoutOps.timeout) this._operationTimeout = timeoutOps.timeout;
			if (timeoutOps.cb) this._operationTimeoutCb = timeoutOps.cb;
		}
		var self = this;
		if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
			self._operationTimeoutCb();
		}, self._operationTimeout);
		this._operationStart = (/* @__PURE__ */ new Date()).getTime();
		this._fn(this._attempts);
	};
	RetryOperation.prototype.try = function(fn) {
		console.log("Using RetryOperation.try() is deprecated");
		this.attempt(fn);
	};
	RetryOperation.prototype.start = function(fn) {
		console.log("Using RetryOperation.start() is deprecated");
		this.attempt(fn);
	};
	RetryOperation.prototype.start = RetryOperation.prototype.try;
	RetryOperation.prototype.errors = function() {
		return this._errors;
	};
	RetryOperation.prototype.attempts = function() {
		return this._attempts;
	};
	RetryOperation.prototype.mainError = function() {
		if (this._errors.length === 0) return null;
		var counts = {};
		var mainError = null;
		var mainErrorCount = 0;
		for (var i = 0; i < this._errors.length; i++) {
			var error = this._errors[i];
			var message = error.message;
			var count = (counts[message] || 0) + 1;
			counts[message] = count;
			if (count >= mainErrorCount) {
				mainError = error;
				mainErrorCount = count;
			}
		}
		return mainError;
	};
}));
//#endregion
//#region node_modules/retry/lib/retry.js
var require_retry$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var RetryOperation = require_retry_operation();
	exports.operation = function(options) {
		return new RetryOperation(exports.timeouts(options), {
			forever: options && (options.forever || options.retries === Infinity),
			unref: options && options.unref,
			maxRetryTime: options && options.maxRetryTime
		});
	};
	exports.timeouts = function(options) {
		if (options instanceof Array) return [].concat(options);
		var opts = {
			retries: 10,
			factor: 2,
			minTimeout: 1 * 1e3,
			maxTimeout: Infinity,
			randomize: false
		};
		for (var key in options) opts[key] = options[key];
		if (opts.minTimeout > opts.maxTimeout) throw new Error("minTimeout is greater than maxTimeout");
		var timeouts = [];
		for (var i = 0; i < opts.retries; i++) timeouts.push(this.createTimeout(i, opts));
		if (options && options.forever && !timeouts.length) timeouts.push(this.createTimeout(i, opts));
		timeouts.sort(function(a, b) {
			return a - b;
		});
		return timeouts;
	};
	exports.createTimeout = function(attempt, opts) {
		var random = opts.randomize ? Math.random() + 1 : 1;
		var timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
		timeout = Math.min(timeout, opts.maxTimeout);
		return timeout;
	};
	exports.wrap = function(obj, options, methods) {
		if (options instanceof Array) {
			methods = options;
			options = null;
		}
		if (!methods) {
			methods = [];
			for (var key in obj) if (typeof obj[key] === "function") methods.push(key);
		}
		for (var i = 0; i < methods.length; i++) {
			var method = methods[i];
			var original = obj[method];
			obj[method] = function retryWrapper(original) {
				var op = exports.operation(options);
				var args = Array.prototype.slice.call(arguments, 1);
				var callback = args.pop();
				args.push(function(err) {
					if (op.retry(err)) return;
					if (err) arguments[0] = op.mainError();
					callback.apply(this, arguments);
				});
				op.attempt(function() {
					original.apply(obj, args);
				});
			}.bind(obj, original);
			obj[method].options = options;
		}
	};
}));
//#endregion
//#region node_modules/retry/index.js
var require_retry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_retry$1();
}));
//#endregion
//#region node_modules/async-retry/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var retrier = require_retry();
	function retry(fn, opts) {
		function run(resolve, reject) {
			var options = opts || {};
			var op;
			if (!("randomize" in options)) options.randomize = true;
			op = retrier.operation(options);
			function bail(err) {
				reject(err || /* @__PURE__ */ new Error("Aborted"));
			}
			function onError(err, num) {
				if (err.bail) {
					bail(err);
					return;
				}
				if (!op.retry(err)) reject(op.mainError());
				else if (options.onRetry) options.onRetry(err, num);
			}
			function runAttempt(num) {
				var val;
				try {
					val = fn(bail, num);
				} catch (err) {
					onError(err, num);
					return;
				}
				Promise.resolve(val).then(resolve).catch(function catchIt(err) {
					onError(err, num);
				});
			}
			op.attempt(runAttempt);
		}
		return new Promise(run);
	}
	module.exports = retry;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/acl.js
var require_acl = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AclRoleAccessorMethods = exports.Acl = void 0;
	var promisify_1 = require_src$11();
	/**
	* Attach functionality to a {@link Storage.acl} instance. This will add an
	* object for each role group (owners, readers, and writers), with each object
	* containing methods to add or delete a type of entity.
	*
	* As an example, here are a few methods that are created.
	*
	*   myBucket.acl.readers.deleteGroup('groupId', function(err) {});
	*
	*   myBucket.acl.owners.addUser('email@example.com', function(err, acl) {});
	*
	*   myBucket.acl.writers.addDomain('example.com', function(err, acl) {});
	*
	* @private
	*/
	var AclRoleAccessorMethods = class AclRoleAccessorMethods {
		constructor() {
			this.owners = {};
			this.readers = {};
			this.writers = {};
			/**
			* An object of convenience methods to add or delete owner ACL permissions
			* for a given entity.
			*
			* The supported methods include:
			*
			*   - `myFile.acl.owners.addAllAuthenticatedUsers`
			*   - `myFile.acl.owners.deleteAllAuthenticatedUsers`
			*   - `myFile.acl.owners.addAllUsers`
			*   - `myFile.acl.owners.deleteAllUsers`
			*   - `myFile.acl.owners.addDomain`
			*   - `myFile.acl.owners.deleteDomain`
			*   - `myFile.acl.owners.addGroup`
			*   - `myFile.acl.owners.deleteGroup`
			*   - `myFile.acl.owners.addProject`
			*   - `myFile.acl.owners.deleteProject`
			*   - `myFile.acl.owners.addUser`
			*   - `myFile.acl.owners.deleteUser`
			*
			* @name Acl#owners
			*
			* @example
			* ```
			* const storage = require('@google-cloud/storage')();
			* const myBucket = storage.bucket('my-bucket');
			* const myFile = myBucket.file('my-file');
			*
			* //-
			* // Add a user as an owner of a file.
			* //-
			* const myBucket = gcs.bucket('my-bucket');
			* const myFile = myBucket.file('my-file');
			* myFile.acl.owners.addUser('email@example.com', function(err, aclObject)
			* {});
			*
			* //-
			* // For reference, the above command is the same as running the following.
			* //-
			* myFile.acl.add({
			*   entity: 'user-email@example.com',
			*   role: gcs.acl.OWNER_ROLE
			* }, function(err, aclObject) {});
			*
			* //-
			* // If the callback is omitted, we'll return a Promise.
			* //-
			* myFile.acl.owners.addUser('email@example.com').then(function(data) {
			*   const aclObject = data[0];
			*   const apiResponse = data[1];
			* });
			* ```
			*/
			this.owners = {};
			/**
			* An object of convenience methods to add or delete reader ACL permissions
			* for a given entity.
			*
			* The supported methods include:
			*
			*   - `myFile.acl.readers.addAllAuthenticatedUsers`
			*   - `myFile.acl.readers.deleteAllAuthenticatedUsers`
			*   - `myFile.acl.readers.addAllUsers`
			*   - `myFile.acl.readers.deleteAllUsers`
			*   - `myFile.acl.readers.addDomain`
			*   - `myFile.acl.readers.deleteDomain`
			*   - `myFile.acl.readers.addGroup`
			*   - `myFile.acl.readers.deleteGroup`
			*   - `myFile.acl.readers.addProject`
			*   - `myFile.acl.readers.deleteProject`
			*   - `myFile.acl.readers.addUser`
			*   - `myFile.acl.readers.deleteUser`
			*
			* @name Acl#readers
			*
			* @example
			* ```
			* const storage = require('@google-cloud/storage')();
			* const myBucket = storage.bucket('my-bucket');
			* const myFile = myBucket.file('my-file');
			*
			* //-
			* // Add a user as a reader of a file.
			* //-
			* myFile.acl.readers.addUser('email@example.com', function(err, aclObject)
			* {});
			*
			* //-
			* // For reference, the above command is the same as running the following.
			* //-
			* myFile.acl.add({
			*   entity: 'user-email@example.com',
			*   role: gcs.acl.READER_ROLE
			* }, function(err, aclObject) {});
			*
			* //-
			* // If the callback is omitted, we'll return a Promise.
			* //-
			* myFile.acl.readers.addUser('email@example.com').then(function(data) {
			*   const aclObject = data[0];
			*   const apiResponse = data[1];
			* });
			* ```
			*/
			this.readers = {};
			/**
			* An object of convenience methods to add or delete writer ACL permissions
			* for a given entity.
			*
			* The supported methods include:
			*
			*   - `myFile.acl.writers.addAllAuthenticatedUsers`
			*   - `myFile.acl.writers.deleteAllAuthenticatedUsers`
			*   - `myFile.acl.writers.addAllUsers`
			*   - `myFile.acl.writers.deleteAllUsers`
			*   - `myFile.acl.writers.addDomain`
			*   - `myFile.acl.writers.deleteDomain`
			*   - `myFile.acl.writers.addGroup`
			*   - `myFile.acl.writers.deleteGroup`
			*   - `myFile.acl.writers.addProject`
			*   - `myFile.acl.writers.deleteProject`
			*   - `myFile.acl.writers.addUser`
			*   - `myFile.acl.writers.deleteUser`
			*
			* @name Acl#writers
			*
			* @example
			* ```
			* const storage = require('@google-cloud/storage')();
			* const myBucket = storage.bucket('my-bucket');
			* const myFile = myBucket.file('my-file');
			*
			* //-
			* // Add a user as a writer of a file.
			* //-
			* myFile.acl.writers.addUser('email@example.com', function(err, aclObject)
			* {});
			*
			* //-
			* // For reference, the above command is the same as running the following.
			* //-
			* myFile.acl.add({
			*   entity: 'user-email@example.com',
			*   role: gcs.acl.WRITER_ROLE
			* }, function(err, aclObject) {});
			*
			* //-
			* // If the callback is omitted, we'll return a Promise.
			* //-
			* myFile.acl.writers.addUser('email@example.com').then(function(data) {
			*   const aclObject = data[0];
			*   const apiResponse = data[1];
			* });
			* ```
			*/
			this.writers = {};
			AclRoleAccessorMethods.roles.forEach(this._assignAccessMethods.bind(this));
		}
		_assignAccessMethods(role) {
			const accessMethods = AclRoleAccessorMethods.accessMethods;
			const entities = AclRoleAccessorMethods.entities;
			const roleGroup = role.toLowerCase() + "s";
			this[roleGroup] = entities.reduce((acc, entity) => {
				const isPrefix = entity.charAt(entity.length - 1) === "-";
				accessMethods.forEach((accessMethod) => {
					let method = accessMethod + entity[0].toUpperCase() + entity.substring(1);
					if (isPrefix) method = method.replace("-", "");
					acc[method] = (entityId, options, callback) => {
						let apiEntity;
						if (typeof options === "function") {
							callback = options;
							options = {};
						}
						if (isPrefix) apiEntity = entity + entityId;
						else {
							apiEntity = entity;
							callback = entityId;
						}
						options = Object.assign({
							entity: apiEntity,
							role
						}, options);
						const args = [options];
						if (typeof callback === "function") args.push(callback);
						return this[accessMethod].apply(this, args);
					};
				});
				return acc;
			}, {});
		}
	};
	exports.AclRoleAccessorMethods = AclRoleAccessorMethods;
	AclRoleAccessorMethods.accessMethods = ["add", "delete"];
	AclRoleAccessorMethods.entities = [
		"allAuthenticatedUsers",
		"allUsers",
		"domain-",
		"group-",
		"project-",
		"user-"
	];
	AclRoleAccessorMethods.roles = [
		"OWNER",
		"READER",
		"WRITER"
	];
	/**
	* Cloud Storage uses access control lists (ACLs) to manage object and
	* bucket access. ACLs are the mechanism you use to share objects with other
	* users and allow other users to access your buckets and objects.
	*
	* An ACL consists of one or more entries, where each entry grants permissions
	* to an entity. Permissions define the actions that can be performed against an
	* object or bucket (for example, `READ` or `WRITE`); the entity defines who the
	* permission applies to (for example, a specific user or group of users).
	*
	* Where an `entity` value is accepted, we follow the format the Cloud Storage
	* API expects.
	*
	* Refer to
	* https://cloud.google.com/storage/docs/json_api/v1/defaultObjectAccessControls
	* for the most up-to-date values.
	*
	*   - `user-userId`
	*   - `user-email`
	*   - `group-groupId`
	*   - `group-email`
	*   - `domain-domain`
	*   - `project-team-projectId`
	*   - `allUsers`
	*   - `allAuthenticatedUsers`
	*
	* Examples:
	*
	*   - The user "liz@example.com" would be `user-liz@example.com`.
	*   - The group "example@googlegroups.com" would be
	*     `group-example@googlegroups.com`.
	*   - To refer to all members of the Google Apps for Business domain
	*     "example.com", the entity would be `domain-example.com`.
	*
	* For more detailed information, see
	* {@link http://goo.gl/6qBBPO| About Access Control Lists}.
	*
	* @constructor Acl
	* @mixin
	* @param {object} options Configuration options.
	*/
	var Acl = class extends AclRoleAccessorMethods {
		constructor(options) {
			super();
			this.pathPrefix = options.pathPrefix;
			this.request_ = options.request;
		}
		/**
		* @typedef {array} AddAclResponse
		* @property {object} 0 The Acl Objects.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback AddAclCallback
		* @param {?Error} err Request error, if any.
		* @param {object} acl The Acl Objects.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Add access controls on a {@link Bucket} or {@link File}.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/bucketAccessControls/insert| BucketAccessControls: insert API Documentation}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objectAccessControls/insert| ObjectAccessControls: insert API Documentation}
		*
		* @param {object} options Configuration options.
		* @param {string} options.entity Whose permissions will be added.
		* @param {string} options.role Permissions allowed for the defined entity.
		*     See {@link https://cloud.google.com/storage/docs/access-control Access
		* Control}.
		* @param {number} [options.generation] **File Objects Only** Select a specific
		*     revision of this file (as opposed to the latest version, the default).
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {AddAclCallback} [callback] Callback function.
		* @returns {Promise<AddAclResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const myBucket = storage.bucket('my-bucket');
		* const myFile = myBucket.file('my-file');
		*
		* const options = {
		*   entity: 'user-useremail@example.com',
		*   role: gcs.acl.OWNER_ROLE
		* };
		*
		* myBucket.acl.add(options, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // For file ACL operations, you can also specify a `generation` property.
		* // Here is how you would grant ownership permissions to a user on a
		* specific
		* // revision of a file.
		* //-
		* myFile.acl.add({
		*   entity: 'user-useremail@example.com',
		*   role: gcs.acl.OWNER_ROLE,
		*   generation: 1
		* }, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* myBucket.acl.add(options).then(function(data) {
		*   const aclObject = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_add_file_owner
		* Example of adding an owner to a file:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_add_bucket_owner
		* Example of adding an owner to a bucket:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_add_bucket_default_owner
		* Example of adding a default owner to a bucket:
		*/
		add(options, callback) {
			const query = {};
			if (options.generation) query.generation = options.generation;
			if (options.userProject) query.userProject = options.userProject;
			this.request({
				method: "POST",
				uri: "",
				qs: query,
				maxRetries: 0,
				json: {
					entity: options.entity,
					role: options.role.toUpperCase()
				}
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				callback(null, this.makeAclObject_(resp), resp);
			});
		}
		/**
		* @typedef {array} RemoveAclResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @callback RemoveAclCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Delete access controls on a {@link Bucket} or {@link File}.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/bucketAccessControls/delete| BucketAccessControls: delete API Documentation}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objectAccessControls/delete| ObjectAccessControls: delete API Documentation}
		*
		* @param {object} options Configuration object.
		* @param {string} options.entity Whose permissions will be revoked.
		* @param {int} [options.generation] **File Objects Only** Select a specific
		*     revision of this file (as opposed to the latest version, the default).
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {RemoveAclCallback} callback The callback function.
		* @returns {Promise<RemoveAclResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const myBucket = storage.bucket('my-bucket');
		* const myFile = myBucket.file('my-file');
		*
		* myBucket.acl.delete({
		*   entity: 'user-useremail@example.com'
		* }, function(err, apiResponse) {});
		*
		* //-
		* // For file ACL operations, you can also specify a `generation` property.
		* //-
		* myFile.acl.delete({
		*   entity: 'user-useremail@example.com',
		*   generation: 1
		* }, function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* myFile.acl.delete().then(function(data) {
		*   const apiResponse = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_remove_bucket_owner
		* Example of removing an owner from a bucket:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_remove_bucket_default_owner
		* Example of removing a default owner from a bucket:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_remove_file_owner
		* Example of removing an owner from a bucket:
		*/
		delete(options, callback) {
			const query = {};
			if (options.generation) query.generation = options.generation;
			if (options.userProject) query.userProject = options.userProject;
			this.request({
				method: "DELETE",
				uri: "/" + encodeURIComponent(options.entity),
				qs: query
			}, (err, resp) => {
				callback(err, resp);
			});
		}
		/**
		* @typedef {array} GetAclResponse
		* @property {object|object[]} 0 Single or array of Acl Objects.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback GetAclCallback
		* @param {?Error} err Request error, if any.
		* @param {object|object[]} acl Single or array of Acl Objects.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Get access controls on a {@link Bucket} or {@link File}. If
		* an entity is omitted, you will receive an array of all applicable access
		* controls.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/bucketAccessControls/get| BucketAccessControls: get API Documentation}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objectAccessControls/get| ObjectAccessControls: get API Documentation}
		*
		* @param {object|function} [options] Configuration options. If you want to
		*     receive a list of all access controls, pass the callback function as
		* the only argument.
		* @param {string} options.entity Whose permissions will be fetched.
		* @param {number} [options.generation] **File Objects Only** Select a specific
		*     revision of this file (as opposed to the latest version, the default).
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {GetAclCallback} [callback] Callback function.
		* @returns {Promise<GetAclResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const myBucket = storage.bucket('my-bucket');
		* const myFile = myBucket.file('my-file');
		*
		* myBucket.acl.get({
		*   entity: 'user-useremail@example.com'
		* }, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // Get all access controls.
		* //-
		* myBucket.acl.get(function(err, aclObjects, apiResponse) {
		*   // aclObjects = [
		*   //   {
		*   //     entity: 'user-useremail@example.com',
		*   //     role: 'owner'
		*   //   }
		*   // ]
		* });
		*
		* //-
		* // For file ACL operations, you can also specify a `generation` property.
		* //-
		* myFile.acl.get({
		*   entity: 'user-useremail@example.com',
		*   generation: 1
		* }, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* myBucket.acl.get().then(function(data) {
		*   const aclObject = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_print_file_acl
		* Example of printing a file's ACL:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_print_file_acl_for_user
		* Example of printing a file's ACL for a specific user:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_print_bucket_acl
		* Example of printing a bucket's ACL:
		*
		* @example <caption>include:samples/acl.js</caption>
		* region_tag:storage_print_bucket_acl_for_user
		* Example of printing a bucket's ACL for a specific user:
		*/
		get(optionsOrCallback, cb) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : null;
			const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			let path = "";
			const query = {};
			if (options) {
				path = "/" + encodeURIComponent(options.entity);
				if (options.generation) query.generation = options.generation;
				if (options.userProject) query.userProject = options.userProject;
			}
			this.request({
				uri: path,
				qs: query
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				let results;
				if (resp.items) results = resp.items.map(this.makeAclObject_);
				else results = this.makeAclObject_(resp);
				callback(null, results, resp);
			});
		}
		/**
		* @typedef {array} UpdateAclResponse
		* @property {object} 0 The updated Acl Objects.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback UpdateAclCallback
		* @param {?Error} err Request error, if any.
		* @param {object} acl The updated Acl Objects.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Update access controls on a {@link Bucket} or {@link File}.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/bucketAccessControls/update| BucketAccessControls: update API Documentation}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objectAccessControls/update| ObjectAccessControls: update API Documentation}
		*
		* @param {object} options Configuration options.
		* @param {string} options.entity Whose permissions will be updated.
		* @param {string} options.role Permissions allowed for the defined entity.
		*     See {@link Storage.acl}.
		* @param {number} [options.generation] **File Objects Only** Select a specific
		*     revision of this file (as opposed to the latest version, the default).
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {UpdateAclCallback} [callback] Callback function.
		* @returns {Promise<UpdateAclResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const myBucket = storage.bucket('my-bucket');
		* const myFile = myBucket.file('my-file');
		*
		* const options = {
		*   entity: 'user-useremail@example.com',
		*   role: gcs.acl.WRITER_ROLE
		* };
		*
		* myBucket.acl.update(options, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // For file ACL operations, you can also specify a `generation` property.
		* //-
		* myFile.acl.update({
		*   entity: 'user-useremail@example.com',
		*   role: gcs.acl.WRITER_ROLE,
		*   generation: 1
		* }, function(err, aclObject, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* myFile.acl.update(options).then(function(data) {
		*   const aclObject = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		update(options, callback) {
			const query = {};
			if (options.generation) query.generation = options.generation;
			if (options.userProject) query.userProject = options.userProject;
			this.request({
				method: "PUT",
				uri: "/" + encodeURIComponent(options.entity),
				qs: query,
				json: { role: options.role.toUpperCase() }
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				callback(null, this.makeAclObject_(resp), resp);
			});
		}
		/**
		* Transform API responses to a consistent object format.
		*
		* @private
		*/
		makeAclObject_(accessControlObject) {
			const obj = {
				entity: accessControlObject.entity,
				role: accessControlObject.role
			};
			if (accessControlObject.projectTeam) obj.projectTeam = accessControlObject.projectTeam;
			return obj;
		}
		/**
		* Patch requests up to the bucket's request object.
		*
		* @private
		*
		* @param {string} method Action.
		* @param {string} path Request path.
		* @param {*} query Request query object.
		* @param {*} body Request body contents.
		* @param {function} callback Callback function.
		*/
		request(reqOpts, callback) {
			reqOpts.uri = this.pathPrefix + reqOpts.uri;
			this.request_(reqOpts, callback);
		}
	};
	exports.Acl = Acl;
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Acl, { exclude: ["request"] });
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/crc32c.js
var require_crc32c = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _CRC32C_crc32c;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CRC32C_EXTENSION_TABLE = exports.CRC32C_EXTENSIONS = exports.CRC32C_EXCEPTION_MESSAGES = exports.CRC32C_DEFAULT_VALIDATOR_GENERATOR = exports.CRC32C = void 0;
	var fs_1$1 = __require("fs");
	/**
	* Ported from {@link https://github.com/google/crc32c/blob/21fc8ef30415a635e7351ffa0e5d5367943d4a94/src/crc32c_portable.cc#L16-L59 github.com/google/crc32c}
	*/
	var CRC32C_EXTENSIONS = [
		0,
		4067132163,
		3778769143,
		324072436,
		3348797215,
		904991772,
		648144872,
		3570033899,
		2329499855,
		2024987596,
		1809983544,
		2575936315,
		1296289744,
		3207089363,
		2893594407,
		1578318884,
		274646895,
		3795141740,
		4049975192,
		51262619,
		3619967088,
		632279923,
		922689671,
		3298075524,
		2592579488,
		1760304291,
		2075979607,
		2312596564,
		1562183871,
		2943781820,
		3156637768,
		1313733451,
		549293790,
		3537243613,
		3246849577,
		871202090,
		3878099393,
		357341890,
		102525238,
		4101499445,
		2858735121,
		1477399826,
		1264559846,
		3107202533,
		1845379342,
		2677391885,
		2361733625,
		2125378298,
		820201905,
		3263744690,
		3520608582,
		598981189,
		4151959214,
		85089709,
		373468761,
		3827903834,
		3124367742,
		1213305469,
		1526817161,
		2842354314,
		2107672161,
		2412447074,
		2627466902,
		1861252501,
		1098587580,
		3004210879,
		2688576843,
		1378610760,
		2262928035,
		1955203488,
		1742404180,
		2511436119,
		3416409459,
		969524848,
		714683780,
		3639785095,
		205050476,
		4266873199,
		3976438427,
		526918040,
		1361435347,
		2739821008,
		2954799652,
		1114974503,
		2529119692,
		1691668175,
		2005155131,
		2247081528,
		3690758684,
		697762079,
		986182379,
		3366744552,
		476452099,
		3993867776,
		4250756596,
		255256311,
		1640403810,
		2477592673,
		2164122517,
		1922457750,
		2791048317,
		1412925310,
		1197962378,
		3037525897,
		3944729517,
		427051182,
		170179418,
		4165941337,
		746937522,
		3740196785,
		3451792453,
		1070968646,
		1905808397,
		2213795598,
		2426610938,
		1657317369,
		3053634322,
		1147748369,
		1463399397,
		2773627110,
		4215344322,
		153784257,
		444234805,
		3893493558,
		1021025245,
		3467647198,
		3722505002,
		797665321,
		2197175160,
		1889384571,
		1674398607,
		2443626636,
		1164749927,
		3070701412,
		2757221520,
		1446797203,
		137323447,
		4198817972,
		3910406976,
		461344835,
		3484808360,
		1037989803,
		781091935,
		3705997148,
		2460548119,
		1623424788,
		1939049696,
		2180517859,
		1429367560,
		2807687179,
		3020495871,
		1180866812,
		410100952,
		3927582683,
		4182430767,
		186734380,
		3756733383,
		763408580,
		1053836080,
		3434856499,
		2722870694,
		1344288421,
		1131464017,
		2971354706,
		1708204729,
		2545590714,
		2229949006,
		1988219213,
		680717673,
		3673779818,
		3383336350,
		1002577565,
		4010310262,
		493091189,
		238226049,
		4233660802,
		2987750089,
		1082061258,
		1395524158,
		2705686845,
		1972364758,
		2279892693,
		2494862625,
		1725896226,
		952904198,
		3399985413,
		3656866545,
		731699698,
		4283874585,
		222117402,
		510512622,
		3959836397,
		3280807620,
		837199303,
		582374963,
		3504198960,
		68661723,
		4135334616,
		3844915500,
		390545967,
		1230274059,
		3141532936,
		2825850620,
		1510247935,
		2395924756,
		2091215383,
		1878366691,
		2644384480,
		3553878443,
		565732008,
		854102364,
		3229815391,
		340358836,
		3861050807,
		4117890627,
		119113024,
		1493875044,
		2875275879,
		3090270611,
		1247431312,
		2660249211,
		1828433272,
		2141937292,
		2378227087,
		3811616794,
		291187481,
		34330861,
		4032846830,
		615137029,
		3603020806,
		3314634738,
		939183345,
		1776939221,
		2609017814,
		2295496738,
		2058945313,
		2926798794,
		1545135305,
		1330124605,
		3173225534,
		4084100981,
		17165430,
		307568514,
		3762199681,
		888469610,
		3332340585,
		3587147933,
		665062302,
		2042050490,
		2346497209,
		2559330125,
		1793573966,
		3190661285,
		1279665062,
		1595330642,
		2910671697
	];
	exports.CRC32C_EXTENSIONS = CRC32C_EXTENSIONS;
	var CRC32C_EXTENSION_TABLE = new Int32Array(CRC32C_EXTENSIONS);
	exports.CRC32C_EXTENSION_TABLE = CRC32C_EXTENSION_TABLE;
	var CRC32C_DEFAULT_VALIDATOR_GENERATOR = () => new CRC32C();
	exports.CRC32C_DEFAULT_VALIDATOR_GENERATOR = CRC32C_DEFAULT_VALIDATOR_GENERATOR;
	var CRC32C_EXCEPTION_MESSAGES = {
		INVALID_INIT_BASE64_RANGE: (l) => `base64-encoded data expected to equal 4 bytes, not ${l}`,
		INVALID_INIT_BUFFER_LENGTH: (l) => `Buffer expected to equal 4 bytes, not ${l}`,
		INVALID_INIT_INTEGER: (l) => `Number expected to be a safe, unsigned 32-bit integer, not ${l}`
	};
	exports.CRC32C_EXCEPTION_MESSAGES = CRC32C_EXCEPTION_MESSAGES;
	var CRC32C = class CRC32C {
		/**
		* Constructs a new `CRC32C` object.
		*
		* Reconstruction is recommended via the `CRC32C.from` static method.
		*
		* @param initialValue An initial CRC32C value - a signed 32-bit integer.
		*/
		constructor(initialValue = 0) {
			/** Current CRC32C value */
			_CRC32C_crc32c.set(this, 0);
			__classPrivateFieldSet(this, _CRC32C_crc32c, initialValue, "f");
		}
		/**
		* Calculates a CRC32C from a provided buffer.
		*
		* Implementation inspired from:
		* - {@link https://github.com/google/crc32c/blob/21fc8ef30415a635e7351ffa0e5d5367943d4a94/src/crc32c_portable.cc github.com/google/crc32c}
		* - {@link https://github.com/googleapis/python-crc32c/blob/a595e758c08df445a99c3bf132ee8e80a3ec4308/src/google_crc32c/python.py github.com/googleapis/python-crc32c}
		* - {@link https://github.com/googleapis/java-storage/pull/1376/files github.com/googleapis/java-storage}
		*
		* @param data The `Buffer` to generate the CRC32C from
		*/
		update(data) {
			let current = __classPrivateFieldGet(this, _CRC32C_crc32c, "f") ^ 4294967295;
			for (const d of data) current = CRC32C.CRC32C_EXTENSION_TABLE[(d ^ current) & 255] ^ current >>> 8;
			__classPrivateFieldSet(this, _CRC32C_crc32c, current ^ 4294967295, "f");
		}
		/**
		* Validates a provided input to the current CRC32C value.
		*
		* @param input A Buffer, `CRC32C`-compatible object, base64-encoded data (string), or signed 32-bit integer
		*/
		validate(input) {
			if (typeof input === "number") return input === __classPrivateFieldGet(this, _CRC32C_crc32c, "f");
			else if (typeof input === "string") return input === this.toString();
			else if (Buffer.isBuffer(input)) return Buffer.compare(input, this.toBuffer()) === 0;
			else return input.toString() === this.toString();
		}
		/**
		* Returns a `Buffer` representation of the CRC32C value
		*/
		toBuffer() {
			const buffer = Buffer.alloc(4);
			buffer.writeInt32BE(__classPrivateFieldGet(this, _CRC32C_crc32c, "f"));
			return buffer;
		}
		/**
		* Returns a JSON-compatible, base64-encoded representation of the CRC32C value.
		*
		* See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify `JSON#stringify`}
		*/
		toJSON() {
			return this.toString();
		}
		/**
		* Returns a base64-encoded representation of the CRC32C value.
		*
		* See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString `Object#toString`}
		*/
		toString() {
			return this.toBuffer().toString("base64");
		}
		/**
		* Returns the `number` representation of the CRC32C value as a signed 32-bit integer
		*
		* See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf `Object#valueOf`}
		*/
		valueOf() {
			return __classPrivateFieldGet(this, _CRC32C_crc32c, "f");
		}
		/**
		* Generates a `CRC32C` from a compatible buffer format.
		*
		* @param value 4-byte `ArrayBufferView`/`Buffer`/`TypedArray`
		*/
		static fromBuffer(value) {
			let buffer;
			if (Buffer.isBuffer(value)) buffer = value;
			else if ("buffer" in value) buffer = Buffer.from(value.buffer);
			else buffer = Buffer.from(value);
			if (buffer.byteLength !== 4) throw new RangeError(CRC32C_EXCEPTION_MESSAGES.INVALID_INIT_BUFFER_LENGTH(buffer.byteLength));
			return new CRC32C(buffer.readInt32BE());
		}
		static async fromFile(file) {
			const crc32c = new CRC32C();
			await new Promise((resolve, reject) => {
				(0, fs_1$1.createReadStream)(file).on("data", (d) => {
					if (typeof d === "string") crc32c.update(Buffer.from(d));
					else crc32c.update(d);
				}).on("end", () => resolve()).on("error", reject);
			});
			return crc32c;
		}
		/**
		* Generates a `CRC32C` from 4-byte base64-encoded data (string).
		*
		* @param value 4-byte base64-encoded data (string)
		*/
		static fromString(value) {
			const buffer = Buffer.from(value, "base64");
			if (buffer.byteLength !== 4) throw new RangeError(CRC32C_EXCEPTION_MESSAGES.INVALID_INIT_BASE64_RANGE(buffer.byteLength));
			return this.fromBuffer(buffer);
		}
		/**
		* Generates a `CRC32C` from a safe, unsigned 32-bit integer.
		*
		* @param value an unsigned 32-bit integer
		*/
		static fromNumber(value) {
			if (!Number.isSafeInteger(value) || value > 2 ** 32 || value < -(2 ** 32)) throw new RangeError(CRC32C_EXCEPTION_MESSAGES.INVALID_INIT_INTEGER(value));
			return new CRC32C(value);
		}
		/**
		* Generates a `CRC32C` from a variety of compatable types.
		* Note: strings are treated as input, not as file paths to read from.
		*
		* @param value A number, 4-byte `ArrayBufferView`/`Buffer`/`TypedArray`, or 4-byte base64-encoded data (string)
		*/
		static from(value) {
			if (typeof value === "number") return this.fromNumber(value);
			else if (typeof value === "string") return this.fromString(value);
			else if ("byteLength" in value) return this.fromBuffer(value);
			else return this.fromString(value.toString());
		}
	};
	exports.CRC32C = CRC32C;
	_CRC32C_crc32c = /* @__PURE__ */ new WeakMap();
	CRC32C.CRC32C_EXTENSIONS = CRC32C_EXTENSIONS;
	CRC32C.CRC32C_EXTENSION_TABLE = CRC32C_EXTENSION_TABLE;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/hash-stream-validator.js
var require_hash_stream_validator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _HashStreamValidator_crc32cHash, _HashStreamValidator_md5Hash, _HashStreamValidator_md5Digest;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HashStreamValidator = void 0;
	var crypto_1$2 = __require("crypto");
	var stream_1$4 = __require("stream");
	var crc32c_js_1 = require_crc32c();
	var file_js_1 = require_file();
	var HashStreamValidator = class extends stream_1$4.Transform {
		constructor(options = {}) {
			super();
			this.updateHashesOnly = false;
			_HashStreamValidator_crc32cHash.set(this, void 0);
			_HashStreamValidator_md5Hash.set(this, void 0);
			_HashStreamValidator_md5Digest.set(this, "");
			this.crc32cEnabled = !!options.crc32c;
			this.md5Enabled = !!options.md5;
			this.updateHashesOnly = !!options.updateHashesOnly;
			this.crc32cExpected = options.crc32cExpected;
			this.md5Expected = options.md5Expected;
			if (this.crc32cEnabled) if (options.crc32cInstance) __classPrivateFieldSet(this, _HashStreamValidator_crc32cHash, options.crc32cInstance, "f");
			else {
				const crc32cGenerator = options.crc32cGenerator || crc32c_js_1.CRC32C_DEFAULT_VALIDATOR_GENERATOR;
				__classPrivateFieldSet(this, _HashStreamValidator_crc32cHash, crc32cGenerator(), "f");
			}
			if (this.md5Enabled) __classPrivateFieldSet(this, _HashStreamValidator_md5Hash, (0, crypto_1$2.createHash)("md5"), "f");
		}
		/**
		* Return the current CRC32C value, if available.
		*/
		get crc32c() {
			var _a;
			return (_a = __classPrivateFieldGet(this, _HashStreamValidator_crc32cHash, "f")) === null || _a === void 0 ? void 0 : _a.toString();
		}
		/**
		* Return the calculated MD5 value, if available.
		*/
		get md5Digest() {
			if (__classPrivateFieldGet(this, _HashStreamValidator_md5Hash, "f") && !__classPrivateFieldGet(this, _HashStreamValidator_md5Digest, "f")) __classPrivateFieldSet(this, _HashStreamValidator_md5Digest, __classPrivateFieldGet(this, _HashStreamValidator_md5Hash, "f").digest("base64"), "f");
			return __classPrivateFieldGet(this, _HashStreamValidator_md5Digest, "f");
		}
		_flush(callback) {
			this.md5Digest;
			if (this.updateHashesOnly) {
				callback();
				return;
			}
			let failed = this.crc32cEnabled || this.md5Enabled;
			if (this.crc32cEnabled && this.crc32cExpected) failed = !this.test("crc32c", this.crc32cExpected);
			if (this.md5Enabled && this.md5Expected) failed = !this.test("md5", this.md5Expected);
			if (failed) {
				const mismatchError = new file_js_1.RequestError(file_js_1.FileExceptionMessages.DOWNLOAD_MISMATCH);
				mismatchError.code = "CONTENT_DOWNLOAD_MISMATCH";
				callback(mismatchError);
			} else callback();
		}
		_transform(chunk, encoding, callback) {
			this.push(chunk, encoding);
			try {
				if (__classPrivateFieldGet(this, _HashStreamValidator_crc32cHash, "f")) __classPrivateFieldGet(this, _HashStreamValidator_crc32cHash, "f").update(chunk);
				if (__classPrivateFieldGet(this, _HashStreamValidator_md5Hash, "f")) __classPrivateFieldGet(this, _HashStreamValidator_md5Hash, "f").update(chunk);
				callback();
			} catch (e) {
				callback(e);
			}
		}
		test(hash, sum) {
			const check = Buffer.isBuffer(sum) ? sum.toString("base64") : sum;
			if (hash === "crc32c" && __classPrivateFieldGet(this, _HashStreamValidator_crc32cHash, "f")) return __classPrivateFieldGet(this, _HashStreamValidator_crc32cHash, "f").validate(check);
			if (hash === "md5" && __classPrivateFieldGet(this, _HashStreamValidator_md5Hash, "f")) return __classPrivateFieldGet(this, _HashStreamValidator_md5Digest, "f") === check;
			return false;
		}
	};
	exports.HashStreamValidator = HashStreamValidator;
	_HashStreamValidator_crc32cHash = /* @__PURE__ */ new WeakMap(), _HashStreamValidator_md5Hash = /* @__PURE__ */ new WeakMap(), _HashStreamValidator_md5Digest = /* @__PURE__ */ new WeakMap();
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/resumable-upload.js
var require_resumable_upload = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var _Upload_instances, _Upload_hashValidator, _Upload_clientCrc32c, _Upload_clientMd5Hash, _Upload_gcclGcsCmd, _Upload_resetLocalBuffersCache, _Upload_addLocalBufferCache, _Upload_validateChecksum, _Upload_applyChecksumHeaders;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Upload = exports.PROTOCOL_REGEX = void 0;
	exports.upload = upload;
	exports.createURI = createURI;
	exports.checkUploadStatus = checkUploadStatus;
	var abort_controller_1 = __importDefault((init_abort_controller(), __toCommonJS(abort_controller_exports)));
	var crypto_1$1 = __require("crypto");
	var gaxios = __importStar(require_src$7());
	var google_auth_library_1 = require_src$4();
	var stream_1$3 = __require("stream");
	var async_retry_1 = __importDefault(require_lib());
	var uuid = __importStar(require_dist$4());
	var util_js_1 = require_util$1();
	var util_js_2 = require_util();
	var file_js_1 = require_file();
	var package_json_helper_cjs_1 = require_package_json_helper();
	var hash_stream_validator_js_1 = require_hash_stream_validator();
	var NOT_FOUND_STATUS_CODE = 404;
	var RESUMABLE_INCOMPLETE_STATUS_CODE = 308;
	var packageJson = (0, package_json_helper_cjs_1.getPackageJSON)();
	exports.PROTOCOL_REGEX = /^(\w*):\/\//;
	var Upload = class extends stream_1$3.Writable {
		constructor(cfg) {
			var _a;
			super(cfg);
			_Upload_instances.add(this);
			this.numBytesWritten = 0;
			this.numRetries = 0;
			this.currentInvocationId = {
				checkUploadStatus: uuid.v4(),
				chunk: uuid.v4(),
				uri: uuid.v4()
			};
			/**
			* A cache of buffers written to this instance, ready for consuming
			*/
			this.writeBuffers = [];
			this.numChunksReadInRequest = 0;
			_Upload_hashValidator.set(this, void 0);
			_Upload_clientCrc32c.set(this, void 0);
			_Upload_clientMd5Hash.set(this, void 0);
			/**
			* An array of buffers used for caching the most recent upload chunk.
			* We should not assume that the server received all bytes sent in the request.
			*  - https://cloud.google.com/storage/docs/performing-resumable-uploads#chunked-upload
			*/
			this.localWriteCache = [];
			this.localWriteCacheByteLength = 0;
			this.upstreamEnded = false;
			_Upload_gcclGcsCmd.set(this, void 0);
			cfg = cfg || {};
			if (!cfg.bucket || !cfg.file) throw new Error("A bucket and file name are required");
			if (cfg.offset && !cfg.uri) throw new RangeError("Cannot provide an `offset` without providing a `uri`");
			if (cfg.isPartialUpload && !cfg.chunkSize) throw new RangeError("Cannot set `isPartialUpload` without providing a `chunkSize`");
			cfg.authConfig = cfg.authConfig || {};
			cfg.authConfig.scopes = ["https://www.googleapis.com/auth/devstorage.full_control"];
			this.authClient = cfg.authClient || new google_auth_library_1.GoogleAuth(cfg.authConfig);
			const universe = cfg.universeDomain || google_auth_library_1.DEFAULT_UNIVERSE;
			this.apiEndpoint = `https://storage.${universe}`;
			if (cfg.apiEndpoint && cfg.apiEndpoint !== this.apiEndpoint) {
				this.apiEndpoint = this.sanitizeEndpoint(cfg.apiEndpoint);
				const hostname = new URL(this.apiEndpoint).hostname;
				const isDomain = hostname === universe;
				const isDefaultUniverseDomain = hostname === google_auth_library_1.DEFAULT_UNIVERSE;
				const isSubDomainOfUniverse = hostname.slice(-(universe.length + 1)) === `.${universe}`;
				const isSubDomainOfDefaultUniverse = hostname.slice(-(google_auth_library_1.DEFAULT_UNIVERSE.length + 1)) === `.${google_auth_library_1.DEFAULT_UNIVERSE}`;
				if (!isDomain && !isDefaultUniverseDomain && !isSubDomainOfUniverse && !isSubDomainOfDefaultUniverse) {
					if (cfg.useAuthWithCustomEndpoint !== true) this.authClient = gaxios;
				}
			}
			this.baseURI = `${this.apiEndpoint}/upload/storage/v1/b`;
			this.bucket = cfg.bucket;
			const cacheKeyElements = [cfg.bucket, cfg.file];
			if (typeof cfg.generation === "number") cacheKeyElements.push(`${cfg.generation}`);
			this.cacheKey = cacheKeyElements.join("/");
			this.customRequestOptions = cfg.customRequestOptions || {};
			this.file = cfg.file;
			this.generation = cfg.generation;
			this.kmsKeyName = cfg.kmsKeyName;
			this.metadata = cfg.metadata || {};
			this.offset = cfg.offset;
			this.origin = cfg.origin;
			this.params = cfg.params || {};
			this.userProject = cfg.userProject;
			this.chunkSize = cfg.chunkSize;
			this.retryOptions = cfg.retryOptions;
			this.isPartialUpload = (_a = cfg.isPartialUpload) !== null && _a !== void 0 ? _a : false;
			__classPrivateFieldSet(this, _Upload_clientCrc32c, cfg.clientCrc32c, "f");
			__classPrivateFieldSet(this, _Upload_clientMd5Hash, cfg.clientMd5Hash, "f");
			const calculateCrc32c = !cfg.clientCrc32c && cfg.crc32c;
			const calculateMd5 = !cfg.clientMd5Hash && cfg.md5;
			if (calculateCrc32c || calculateMd5) __classPrivateFieldSet(this, _Upload_hashValidator, new hash_stream_validator_js_1.HashStreamValidator({
				crc32c: calculateCrc32c,
				md5: calculateMd5,
				updateHashesOnly: true
			}), "f");
			if (cfg.key) if (typeof cfg.key === "string") {
				const base64Key = Buffer.from(cfg.key).toString("base64");
				this.encryption = {
					key: base64Key,
					hash: (0, crypto_1$1.createHash)("sha256").update(cfg.key).digest("base64")
				};
			} else {
				const base64Key = cfg.key.toString("base64");
				this.encryption = {
					key: base64Key,
					hash: (0, crypto_1$1.createHash)("sha256").update(cfg.key).digest("base64")
				};
			}
			this.predefinedAcl = cfg.predefinedAcl;
			if (cfg.private) this.predefinedAcl = "private";
			if (cfg.public) this.predefinedAcl = "publicRead";
			const autoRetry = cfg.retryOptions.autoRetry;
			this.uriProvidedManually = !!cfg.uri;
			this.uri = cfg.uri;
			if (this.offset) this.numBytesWritten = this.offset;
			this.numRetries = 0;
			if (!autoRetry) cfg.retryOptions.maxRetries = 0;
			this.timeOfFirstRequest = Date.now();
			const contentLength = cfg.metadata ? Number(cfg.metadata.contentLength) : NaN;
			this.contentLength = isNaN(contentLength) ? "*" : contentLength;
			__classPrivateFieldSet(this, _Upload_gcclGcsCmd, cfg[util_js_2.GCCL_GCS_CMD_KEY], "f");
			this.once("writing", () => {
				if (this.uri) this.continueUploading();
				else this.createURI((err) => {
					if (err) return this.destroy(err);
					this.startUploading();
				});
			});
		}
		/**
		* Prevent 'finish' event until the upload has succeeded.
		*
		* @param fireFinishEvent The finish callback
		*/
		_final(fireFinishEvent = () => {}) {
			this.upstreamEnded = true;
			this.once("uploadFinished", fireFinishEvent);
			process.nextTick(() => {
				this.emit("upstreamFinished");
				this.emit("writing");
			});
		}
		/**
		* Handles incoming data from upstream
		*
		* @param chunk The chunk to append to the buffer
		* @param encoding The encoding of the chunk
		* @param readCallback A callback for when the buffer has been read downstream
		*/
		_write(chunk, encoding, readCallback = () => {}) {
			this.emit("writing");
			const bufferChunk = typeof chunk === "string" ? Buffer.from(chunk, encoding) : chunk;
			if (__classPrivateFieldGet(this, _Upload_hashValidator, "f")) try {
				__classPrivateFieldGet(this, _Upload_hashValidator, "f").write(bufferChunk);
			} catch (e) {
				this.destroy(e);
				return;
			}
			this.writeBuffers.push(bufferChunk);
			this.once("readFromChunkBuffer", readCallback);
			process.nextTick(() => this.emit("wroteToChunkBuffer"));
		}
		/**
		* Prepends the local buffer to write buffer and resets it.
		*
		* @param keepLastBytes number of bytes to keep from the end of the local buffer.
		*/
		prependLocalBufferToUpstream(keepLastBytes) {
			let initialBuffers = [];
			if (keepLastBytes) {
				let bytesKept = 0;
				while (keepLastBytes > bytesKept) {
					let buf = this.localWriteCache.pop();
					if (!buf) break;
					bytesKept += buf.byteLength;
					if (bytesKept > keepLastBytes) {
						const diff = bytesKept - keepLastBytes;
						buf = buf.subarray(diff);
						bytesKept -= diff;
					}
					initialBuffers.unshift(buf);
				}
			} else initialBuffers = this.localWriteCache;
			const append = this.writeBuffers;
			this.writeBuffers = initialBuffers;
			for (const buf of append) this.writeBuffers.push(buf);
			__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_resetLocalBuffersCache).call(this);
		}
		/**
		* Retrieves data from upstream's buffer.
		*
		* @param limit The maximum amount to return from the buffer.
		*/
		*pullFromChunkBuffer(limit) {
			while (limit) {
				const buf = this.writeBuffers.shift();
				if (!buf) break;
				let bufToYield = buf;
				if (buf.byteLength > limit) {
					bufToYield = buf.subarray(0, limit);
					this.writeBuffers.unshift(buf.subarray(limit));
					limit = 0;
				} else limit -= buf.byteLength;
				yield bufToYield;
				this.emit("readFromChunkBuffer");
			}
		}
		/**
		* A handler for determining if data is ready to be read from upstream.
		*
		* @returns If there will be more chunks to read in the future
		*/
		async waitForNextChunk() {
			return await new Promise((resolve) => {
				if (this.writeBuffers.length) return resolve(true);
				if (this.upstreamEnded) return resolve(false);
				const wroteToChunkBufferCallback = () => {
					removeListeners();
					return resolve(true);
				};
				const upstreamFinishedCallback = () => {
					removeListeners();
					if (this.writeBuffers.length) return resolve(true);
					return resolve(false);
				};
				const removeListeners = () => {
					this.removeListener("wroteToChunkBuffer", wroteToChunkBufferCallback);
					this.removeListener("upstreamFinished", upstreamFinishedCallback);
				};
				this.once("wroteToChunkBuffer", wroteToChunkBufferCallback);
				this.once("upstreamFinished", upstreamFinishedCallback);
			});
		}
		/**
		* Reads data from upstream up to the provided `limit`.
		* Ends when the limit has reached or no data is expected to be pushed from upstream.
		*
		* @param limit The most amount of data this iterator should return. `Infinity` by default.
		*/
		async *upstreamIterator(limit = Infinity) {
			while (limit && await this.waitForNextChunk()) for (const chunk of this.pullFromChunkBuffer(limit)) {
				limit -= chunk.byteLength;
				yield chunk;
			}
		}
		createURI(callback) {
			if (!callback) return this.createURIAsync();
			this.createURIAsync().then((r) => callback(null, r), callback);
		}
		async createURIAsync() {
			const metadata = { ...this.metadata };
			const headers = {};
			if (metadata.contentLength) {
				headers["X-Upload-Content-Length"] = metadata.contentLength.toString();
				delete metadata.contentLength;
			}
			if (metadata.contentType) {
				headers["X-Upload-Content-Type"] = metadata.contentType;
				delete metadata.contentType;
			}
			let googAPIClient = `${(0, util_js_1.getRuntimeTrackingString)()} gccl/${packageJson.version}-${(0, util_js_1.getModuleFormat)()} gccl-invocation-id/${this.currentInvocationId.uri}`;
			if (__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")) googAPIClient += ` gccl-gcs-cmd/${__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")}`;
			const reqOpts = {
				method: "POST",
				url: [
					this.baseURI,
					this.bucket,
					"o"
				].join("/"),
				params: Object.assign({
					name: this.file,
					uploadType: "resumable"
				}, this.params),
				data: metadata,
				headers: {
					"User-Agent": (0, util_js_1.getUserAgentString)(),
					"x-goog-api-client": googAPIClient,
					...headers
				}
			};
			if (metadata.contentLength) reqOpts.headers["X-Upload-Content-Length"] = metadata.contentLength.toString();
			if (metadata.contentType) reqOpts.headers["X-Upload-Content-Type"] = metadata.contentType;
			if (typeof this.generation !== "undefined") reqOpts.params.ifGenerationMatch = this.generation;
			if (this.kmsKeyName) reqOpts.params.kmsKeyName = this.kmsKeyName;
			if (this.predefinedAcl) reqOpts.params.predefinedAcl = this.predefinedAcl;
			if (this.origin) reqOpts.headers.Origin = this.origin;
			const uri = await (0, async_retry_1.default)(async (bail) => {
				var _a, _b, _c;
				try {
					const res = await this.makeRequest(reqOpts);
					this.currentInvocationId.uri = uuid.v4();
					return res.headers.location;
				} catch (err) {
					const e = err;
					const apiError = {
						code: (_a = e.response) === null || _a === void 0 ? void 0 : _a.status,
						name: (_b = e.response) === null || _b === void 0 ? void 0 : _b.statusText,
						message: (_c = e.response) === null || _c === void 0 ? void 0 : _c.statusText,
						errors: [{ reason: e.code }]
					};
					if (this.retryOptions.maxRetries > 0 && this.retryOptions.retryableErrorFn(apiError)) throw e;
					else return bail(e);
				}
			}, {
				retries: this.retryOptions.maxRetries,
				factor: this.retryOptions.retryDelayMultiplier,
				maxTimeout: this.retryOptions.maxRetryDelay * 1e3,
				maxRetryTime: this.retryOptions.totalTimeout * 1e3
			});
			this.uri = uri;
			this.offset = 0;
			this.emit("uri", uri);
			return uri;
		}
		async continueUploading() {
			var _a;
			(_a = this.offset) !== null && _a !== void 0 || await this.getAndSetOffset();
			return this.startUploading();
		}
		async startUploading() {
			const multiChunkMode = !!this.chunkSize;
			let responseReceived = false;
			this.numChunksReadInRequest = 0;
			if (!this.offset) this.offset = 0;
			if (this.offset < this.numBytesWritten) {
				const delta = this.numBytesWritten - this.offset;
				const message = `The offset is lower than the number of bytes written. The server has ${this.offset} bytes and while ${this.numBytesWritten} bytes has been uploaded - thus ${delta} bytes are missing. Stopping as this could result in data loss. Initiate a new upload to continue.`;
				this.emit("error", new RangeError(message));
				return;
			}
			if (this.numBytesWritten < this.offset) {
				const fastForwardBytes = this.offset - this.numBytesWritten;
				for await (const _chunk of this.upstreamIterator(fastForwardBytes));
				this.numBytesWritten = this.offset;
			}
			let expectedUploadSize = void 0;
			if (typeof this.contentLength === "number") expectedUploadSize = this.contentLength - this.numBytesWritten;
			if (this.chunkSize) expectedUploadSize = expectedUploadSize ? Math.min(this.chunkSize, expectedUploadSize) : this.chunkSize;
			const upstreamQueue = this.upstreamIterator(expectedUploadSize);
			const requestStream = new stream_1$3.Readable({ read: async () => {
				if (responseReceived) requestStream.push(null);
				const result = await upstreamQueue.next();
				if (result.value) {
					this.numChunksReadInRequest++;
					if (multiChunkMode) __classPrivateFieldGet(this, _Upload_instances, "m", _Upload_addLocalBufferCache).call(this, result.value);
					else {
						__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_resetLocalBuffersCache).call(this);
						__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_addLocalBufferCache).call(this, result.value);
					}
					this.numBytesWritten += result.value.byteLength;
					this.emit("progress", {
						bytesWritten: this.numBytesWritten,
						contentLength: this.contentLength
					});
					requestStream.push(result.value);
				}
				if (result.done) requestStream.push(null);
			} });
			let googAPIClient = `${(0, util_js_1.getRuntimeTrackingString)()} gccl/${packageJson.version}-${(0, util_js_1.getModuleFormat)()} gccl-invocation-id/${this.currentInvocationId.chunk}`;
			if (__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")) googAPIClient += ` gccl-gcs-cmd/${__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")}`;
			const headers = {
				"User-Agent": (0, util_js_1.getUserAgentString)(),
				"x-goog-api-client": googAPIClient
			};
			if (multiChunkMode) {
				for await (const chunk of this.upstreamIterator(expectedUploadSize)) __classPrivateFieldGet(this, _Upload_instances, "m", _Upload_addLocalBufferCache).call(this, chunk);
				const bytesToUpload = this.localWriteCacheByteLength;
				const isLastChunkOfUpload = !await this.waitForNextChunk();
				if (isLastChunkOfUpload && __classPrivateFieldGet(this, _Upload_hashValidator, "f")) __classPrivateFieldGet(this, _Upload_hashValidator, "f").end();
				this.prependLocalBufferToUpstream();
				let totalObjectSize = this.contentLength;
				if (typeof this.contentLength !== "number" && isLastChunkOfUpload && !this.isPartialUpload) totalObjectSize = bytesToUpload + this.numBytesWritten;
				const endingByte = bytesToUpload + this.numBytesWritten - 1;
				headers["Content-Length"] = bytesToUpload;
				headers["Content-Range"] = `bytes ${this.offset}-${endingByte}/${totalObjectSize}`;
				if (isLastChunkOfUpload) __classPrivateFieldGet(this, _Upload_instances, "m", _Upload_applyChecksumHeaders).call(this, headers);
			} else {
				headers["Content-Range"] = `bytes ${this.offset}-*/${this.contentLength}`;
				if (__classPrivateFieldGet(this, _Upload_hashValidator, "f")) __classPrivateFieldGet(this, _Upload_hashValidator, "f").end();
				__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_applyChecksumHeaders).call(this, headers);
			}
			const reqOpts = {
				method: "PUT",
				url: this.uri,
				headers,
				body: requestStream
			};
			try {
				const resp = await this.makeRequestStream(reqOpts);
				if (resp) {
					responseReceived = true;
					await this.responseHandler(resp);
				}
			} catch (e) {
				const err = e;
				if (this.retryOptions.retryableErrorFn(err)) {
					this.attemptDelayedRetry({
						status: NaN,
						data: err
					});
					return;
				}
				this.destroy(err);
			}
		}
		async responseHandler(resp) {
			var _a, _b;
			if (resp.data.error) {
				this.destroy(resp.data.error);
				return;
			}
			this.currentInvocationId.chunk = uuid.v4();
			const moreDataToUpload = await this.waitForNextChunk();
			const shouldContinueWithNextMultiChunkRequest = this.chunkSize && resp.status === RESUMABLE_INCOMPLETE_STATUS_CODE && resp.headers.range && moreDataToUpload;
			/**
			* This is true when we're expecting to upload more data in a future request,
			* yet the upstream for the upload session has been exhausted.
			*/
			const shouldContinueUploadInAnotherRequest = this.isPartialUpload && resp.status === RESUMABLE_INCOMPLETE_STATUS_CODE && !moreDataToUpload;
			if (shouldContinueWithNextMultiChunkRequest) {
				const range = resp.headers.range;
				this.offset = Number(range.split("-")[1]) + 1;
				const missingBytes = this.numBytesWritten - this.offset;
				if (missingBytes) {
					this.prependLocalBufferToUpstream(missingBytes);
					this.numBytesWritten -= missingBytes;
				} else __classPrivateFieldGet(this, _Upload_instances, "m", _Upload_resetLocalBuffersCache).call(this);
				this.continueUploading();
			} else if (!this.isSuccessfulResponse(resp.status) && !shouldContinueUploadInAnotherRequest) {
				const err = /* @__PURE__ */ new Error("Upload failed");
				err.code = resp.status;
				err.name = "Upload failed";
				if (resp === null || resp === void 0 ? void 0 : resp.data) err.errors = [resp === null || resp === void 0 ? void 0 : resp.data];
				this.destroy(err);
			} else if (this.isSuccessfulResponse(resp.status)) {
				const serverCrc32c = resp.data.crc32c;
				const serverMd5 = resp.data.md5Hash;
				if (__classPrivateFieldGet(this, _Upload_hashValidator, "f")) __classPrivateFieldGet(this, _Upload_hashValidator, "f").end();
				const clientCrc32cToValidate = ((_a = __classPrivateFieldGet(this, _Upload_hashValidator, "f")) === null || _a === void 0 ? void 0 : _a.crc32c) || __classPrivateFieldGet(this, _Upload_clientCrc32c, "f");
				const clientMd5HashToValidate = ((_b = __classPrivateFieldGet(this, _Upload_hashValidator, "f")) === null || _b === void 0 ? void 0 : _b.md5Digest) || __classPrivateFieldGet(this, _Upload_clientMd5Hash, "f");
				if (__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_validateChecksum).call(this, clientCrc32cToValidate, serverCrc32c, "CRC32C") || __classPrivateFieldGet(this, _Upload_instances, "m", _Upload_validateChecksum).call(this, clientMd5HashToValidate, serverMd5, "MD5")) return;
				__classPrivateFieldGet(this, _Upload_instances, "m", _Upload_resetLocalBuffersCache).call(this);
				if (resp && resp.data) resp.data.size = Number(resp.data.size);
				this.emit("metadata", resp.data);
				this.emit("uploadFinished");
			} else this.emit("uploadFinished");
		}
		/**
		* Check the status of an existing resumable upload.
		*
		* @param cfg A configuration to use. `uri` is required.
		* @returns the current upload status
		*/
		async checkUploadStatus(config = {}) {
			let googAPIClient = `${(0, util_js_1.getRuntimeTrackingString)()} gccl/${packageJson.version}-${(0, util_js_1.getModuleFormat)()} gccl-invocation-id/${this.currentInvocationId.checkUploadStatus}`;
			if (__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")) googAPIClient += ` gccl-gcs-cmd/${__classPrivateFieldGet(this, _Upload_gcclGcsCmd, "f")}`;
			const opts = {
				method: "PUT",
				url: this.uri,
				headers: {
					"Content-Length": 0,
					"Content-Range": "bytes */*",
					"User-Agent": (0, util_js_1.getUserAgentString)(),
					"x-goog-api-client": googAPIClient
				}
			};
			try {
				const resp = await this.makeRequest(opts);
				this.currentInvocationId.checkUploadStatus = uuid.v4();
				return resp;
			} catch (e) {
				if (config.retry === false || !(e instanceof Error) || !this.retryOptions.retryableErrorFn(e)) throw e;
				const retryDelay = this.getRetryDelay();
				if (retryDelay <= 0) throw e;
				await new Promise((res) => setTimeout(res, retryDelay));
				return this.checkUploadStatus(config);
			}
		}
		async getAndSetOffset() {
			try {
				const resp = await this.checkUploadStatus({ retry: false });
				if (resp.status === RESUMABLE_INCOMPLETE_STATUS_CODE) {
					if (typeof resp.headers.range === "string") {
						this.offset = Number(resp.headers.range.split("-")[1]) + 1;
						return;
					}
				}
				this.offset = 0;
			} catch (e) {
				const err = e;
				if (this.retryOptions.retryableErrorFn(err)) {
					this.attemptDelayedRetry({
						status: NaN,
						data: err
					});
					return;
				}
				this.destroy(err);
			}
		}
		async makeRequest(reqOpts) {
			if (this.encryption) {
				reqOpts.headers = reqOpts.headers || {};
				reqOpts.headers["x-goog-encryption-algorithm"] = "AES256";
				reqOpts.headers["x-goog-encryption-key"] = this.encryption.key.toString();
				reqOpts.headers["x-goog-encryption-key-sha256"] = this.encryption.hash.toString();
			}
			if (this.userProject) {
				reqOpts.params = reqOpts.params || {};
				reqOpts.params.userProject = this.userProject;
			}
			reqOpts.validateStatus = (status) => {
				return this.isSuccessfulResponse(status) || status === RESUMABLE_INCOMPLETE_STATUS_CODE;
			};
			const combinedReqOpts = {
				...this.customRequestOptions,
				...reqOpts,
				headers: {
					...this.customRequestOptions.headers,
					...reqOpts.headers
				}
			};
			const res = await this.authClient.request(combinedReqOpts);
			if (res.data && res.data.error) throw res.data.error;
			return res;
		}
		async makeRequestStream(reqOpts) {
			const controller = new abort_controller_1.default();
			const errorCallback = () => controller.abort();
			this.once("error", errorCallback);
			if (this.userProject) {
				reqOpts.params = reqOpts.params || {};
				reqOpts.params.userProject = this.userProject;
			}
			reqOpts.signal = controller.signal;
			reqOpts.validateStatus = () => true;
			const combinedReqOpts = {
				...this.customRequestOptions,
				...reqOpts,
				headers: {
					...this.customRequestOptions.headers,
					...reqOpts.headers
				}
			};
			const res = await this.authClient.request(combinedReqOpts);
			const successfulRequest = this.onResponse(res);
			this.removeListener("error", errorCallback);
			return successfulRequest ? res : null;
		}
		/**
		* @return {bool} is the request good?
		*/
		onResponse(resp) {
			if (resp.status !== 200 && this.retryOptions.retryableErrorFn({
				code: resp.status,
				message: resp.statusText,
				name: resp.statusText
			})) {
				this.attemptDelayedRetry(resp);
				return false;
			}
			this.emit("response", resp);
			return true;
		}
		/**
		* @param resp GaxiosResponse object from previous attempt
		*/
		attemptDelayedRetry(resp) {
			if (this.numRetries < this.retryOptions.maxRetries) {
				if (resp.status === NOT_FOUND_STATUS_CODE && this.numChunksReadInRequest === 0) this.startUploading();
				else {
					const retryDelay = this.getRetryDelay();
					if (retryDelay <= 0) {
						this.destroy(/* @__PURE__ */ new Error(`Retry total time limit exceeded - ${JSON.stringify(resp.data)}`));
						return;
					}
					this.numBytesWritten -= this.localWriteCacheByteLength;
					this.prependLocalBufferToUpstream();
					this.offset = void 0;
					setTimeout(this.continueUploading.bind(this), retryDelay);
				}
				this.numRetries++;
			} else this.destroy(/* @__PURE__ */ new Error(`Retry limit exceeded - ${JSON.stringify(resp.data)}`));
		}
		/**
		* The amount of time to wait before retrying the request, in milliseconds.
		* If negative, do not retry.
		*
		* @returns the amount of time to wait, in milliseconds.
		*/
		getRetryDelay() {
			const randomMs = Math.round(Math.random() * 1e3);
			const waitTime = Math.pow(this.retryOptions.retryDelayMultiplier, this.numRetries) * 1e3 + randomMs;
			const maxAllowableDelayMs = this.retryOptions.totalTimeout * 1e3 - (Date.now() - this.timeOfFirstRequest);
			const maxRetryDelayMs = this.retryOptions.maxRetryDelay * 1e3;
			return Math.min(waitTime, maxRetryDelayMs, maxAllowableDelayMs);
		}
		sanitizeEndpoint(url) {
			if (!exports.PROTOCOL_REGEX.test(url)) url = `https://${url}`;
			return url.replace(/\/+$/, "");
		}
		/**
		* Check if a given status code is 2xx
		*
		* @param status The status code to check
		* @returns if the status is 2xx
		*/
		isSuccessfulResponse(status) {
			return status >= 200 && status < 300;
		}
	};
	exports.Upload = Upload;
	_Upload_hashValidator = /* @__PURE__ */ new WeakMap(), _Upload_clientCrc32c = /* @__PURE__ */ new WeakMap(), _Upload_clientMd5Hash = /* @__PURE__ */ new WeakMap(), _Upload_gcclGcsCmd = /* @__PURE__ */ new WeakMap(), _Upload_instances = /* @__PURE__ */ new WeakSet(), _Upload_resetLocalBuffersCache = function _Upload_resetLocalBuffersCache() {
		this.localWriteCache = [];
		this.localWriteCacheByteLength = 0;
	}, _Upload_addLocalBufferCache = function _Upload_addLocalBufferCache(buf) {
		this.localWriteCache.push(buf);
		this.localWriteCacheByteLength += buf.byteLength;
	}, _Upload_validateChecksum = function _Upload_validateChecksum(clientHash, serverHash, hashType) {
		if (clientHash && serverHash) {
			if (clientHash !== serverHash) {
				const detailMessage = `${hashType} checksum mismatch. Client calculated: ${clientHash}, Server returned: ${serverHash}`;
				const detailError = new Error(detailMessage);
				const error = new file_js_1.RequestError(file_js_1.FileExceptionMessages.UPLOAD_MISMATCH);
				error.code = "FILE_NO_UPLOAD";
				error.errors = [detailError];
				this.destroy(error);
				return true;
			}
		}
		return false;
	}, _Upload_applyChecksumHeaders = function _Upload_applyChecksumHeaders(headers) {
		var _a, _b;
		const checksums = [];
		if ((_a = __classPrivateFieldGet(this, _Upload_hashValidator, "f")) === null || _a === void 0 ? void 0 : _a.crc32cEnabled) checksums.push(`crc32c=${__classPrivateFieldGet(this, _Upload_hashValidator, "f").crc32c}`);
		else if (__classPrivateFieldGet(this, _Upload_clientCrc32c, "f")) checksums.push(`crc32c=${__classPrivateFieldGet(this, _Upload_clientCrc32c, "f")}`);
		if ((_b = __classPrivateFieldGet(this, _Upload_hashValidator, "f")) === null || _b === void 0 ? void 0 : _b.md5Enabled) checksums.push(`md5=${__classPrivateFieldGet(this, _Upload_hashValidator, "f").md5Digest}`);
		else if (__classPrivateFieldGet(this, _Upload_clientMd5Hash, "f")) checksums.push(`md5=${__classPrivateFieldGet(this, _Upload_clientMd5Hash, "f")}`);
		if (checksums.length > 0) headers["X-Goog-Hash"] = checksums.join(",");
	};
	function upload(cfg) {
		return new Upload(cfg);
	}
	function createURI(cfg, callback) {
		const up = new Upload(cfg);
		if (!callback) return up.createURI();
		up.createURI().then((r) => callback(null, r), callback);
	}
	/**
	* Check the status of an existing resumable upload.
	*
	* @param cfg A configuration to use. `uri` is required.
	* @returns the current upload status
	*/
	function checkUploadStatus(cfg) {
		return new Upload(cfg).checkUploadStatus();
	}
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/signer.js
var require_signer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SigningError = exports.URLSigner = exports.PATH_STYLED_HOST = exports.SignerExceptionMessages = void 0;
	var crypto$1 = __importStar(__require("crypto"));
	var url = __importStar(__require("url"));
	var storage_js_1 = require_storage();
	var util_js_1 = require_util$1();
	var SignerExceptionMessages;
	(function(SignerExceptionMessages) {
		SignerExceptionMessages["ACCESSIBLE_DATE_INVALID"] = "The accessible at date provided was invalid.";
		SignerExceptionMessages["EXPIRATION_BEFORE_ACCESSIBLE_DATE"] = "An expiration date cannot be before accessible date.";
		SignerExceptionMessages["X_GOOG_CONTENT_SHA256"] = "The header X-Goog-Content-SHA256 must be a hexadecimal string.";
	})(SignerExceptionMessages || (exports.SignerExceptionMessages = SignerExceptionMessages = {}));
	var DEFAULT_SIGNING_VERSION = "v2";
	var SEVEN_DAYS = 10080 * 60;
	/**
	* @const {string}
	* @deprecated - unused
	*/
	exports.PATH_STYLED_HOST = "https://storage.googleapis.com";
	var URLSigner = class {
		constructor(auth, bucket, file, storage = new storage_js_1.Storage()) {
			this.auth = auth;
			this.bucket = bucket;
			this.file = file;
			this.storage = storage;
		}
		getSignedUrl(cfg) {
			const expiresInSeconds = this.parseExpires(cfg.expires);
			const method = cfg.method;
			const accessibleAtInSeconds = this.parseAccessibleAt(cfg.accessibleAt);
			if (expiresInSeconds < accessibleAtInSeconds) throw new Error(SignerExceptionMessages.EXPIRATION_BEFORE_ACCESSIBLE_DATE);
			let customHost;
			const isVirtualHostedStyle = cfg.virtualHostedStyle || false;
			if (cfg.cname) customHost = cfg.cname;
			else if (isVirtualHostedStyle) customHost = `https://${this.bucket.name}.storage.${this.storage.universeDomain}`;
			const config = Object.assign({}, cfg, {
				method,
				expiration: expiresInSeconds,
				accessibleAt: /* @__PURE__ */ new Date(1e3 * accessibleAtInSeconds),
				bucket: this.bucket.name,
				file: this.file ? (0, util_js_1.encodeURI)(this.file.name, false) : void 0
			});
			if (customHost) config.cname = customHost;
			const version = cfg.version || DEFAULT_SIGNING_VERSION;
			let promise;
			if (version === "v2") promise = this.getSignedUrlV2(config);
			else if (version === "v4") promise = this.getSignedUrlV4(config);
			else throw new Error(`Invalid signed URL version: ${version}. Supported versions are 'v2' and 'v4'.`);
			return promise.then((query) => {
				var _a;
				query = Object.assign(query, cfg.queryParams);
				const signedUrl = new url.URL(((_a = cfg.host) === null || _a === void 0 ? void 0 : _a.toString()) || config.cname || this.storage.apiEndpoint);
				signedUrl.pathname = this.getResourcePath(!!config.cname, this.bucket.name, config.file);
				signedUrl.search = (0, util_js_1.qsStringify)(query);
				return signedUrl.href;
			});
		}
		getSignedUrlV2(config) {
			const canonicalHeadersString = this.getCanonicalHeaders(config.extensionHeaders || {});
			const resourcePath = this.getResourcePath(false, config.bucket, config.file);
			const blobToSign = [
				config.method,
				config.contentMd5 || "",
				config.contentType || "",
				config.expiration,
				canonicalHeadersString + resourcePath
			].join("\n");
			const sign = async () => {
				var _a;
				const auth = this.auth;
				try {
					const signature = await auth.sign(blobToSign, (_a = config.signingEndpoint) === null || _a === void 0 ? void 0 : _a.toString());
					return {
						GoogleAccessId: (await auth.getCredentials()).client_email,
						Expires: config.expiration,
						Signature: signature
					};
				} catch (err) {
					const error = err;
					const signingErr = new SigningError(error.message);
					signingErr.stack = error.stack;
					throw signingErr;
				}
			};
			return sign();
		}
		getSignedUrlV4(config) {
			var _a;
			config.accessibleAt = config.accessibleAt ? config.accessibleAt : /* @__PURE__ */ new Date();
			const expiresPeriodInSeconds = config.expiration - config.accessibleAt.valueOf() * (1 / 1e3);
			if (expiresPeriodInSeconds > SEVEN_DAYS) throw new Error(`Max allowed expiration is seven days (${SEVEN_DAYS} seconds).`);
			const extensionHeaders = Object.assign({}, config.extensionHeaders);
			extensionHeaders.host = new url.URL(((_a = config.host) === null || _a === void 0 ? void 0 : _a.toString()) || config.cname || this.storage.apiEndpoint).hostname;
			if (config.contentMd5) extensionHeaders["content-md5"] = config.contentMd5;
			if (config.contentType) extensionHeaders["content-type"] = config.contentType;
			let contentSha256;
			const sha256Header = extensionHeaders["x-goog-content-sha256"];
			if (sha256Header) {
				if (typeof sha256Header !== "string" || !/[A-Fa-f0-9]{40}/.test(sha256Header)) throw new Error(SignerExceptionMessages.X_GOOG_CONTENT_SHA256);
				contentSha256 = sha256Header;
			}
			const signedHeaders = Object.keys(extensionHeaders).map((header) => header.toLowerCase()).sort().join(";");
			const extensionHeadersString = this.getCanonicalHeaders(extensionHeaders);
			const credentialScope = `${(0, util_js_1.formatAsUTCISO)(config.accessibleAt)}/auto/storage/goog4_request`;
			const sign = async () => {
				var _a;
				const credential = `${(await this.auth.getCredentials()).client_email}/${credentialScope}`;
				const dateISO = (0, util_js_1.formatAsUTCISO)(config.accessibleAt ? config.accessibleAt : /* @__PURE__ */ new Date(), true);
				const queryParams = {
					"X-Goog-Algorithm": "GOOG4-RSA-SHA256",
					"X-Goog-Credential": credential,
					"X-Goog-Date": dateISO,
					"X-Goog-Expires": expiresPeriodInSeconds.toString(10),
					"X-Goog-SignedHeaders": signedHeaders,
					...config.queryParams || {}
				};
				const canonicalQueryParams = this.getCanonicalQueryParams(queryParams);
				const canonicalRequest = this.getCanonicalRequest(config.method, this.getResourcePath(!!config.cname, config.bucket, config.file), canonicalQueryParams, extensionHeadersString, signedHeaders, contentSha256);
				const blobToSign = [
					"GOOG4-RSA-SHA256",
					dateISO,
					credentialScope,
					crypto$1.createHash("sha256").update(canonicalRequest).digest("hex")
				].join("\n");
				try {
					const signature = await this.auth.sign(blobToSign, (_a = config.signingEndpoint) === null || _a === void 0 ? void 0 : _a.toString());
					const signatureHex = Buffer.from(signature, "base64").toString("hex");
					return Object.assign({}, queryParams, { "X-Goog-Signature": signatureHex });
				} catch (err) {
					const error = err;
					const signingErr = new SigningError(error.message);
					signingErr.stack = error.stack;
					throw signingErr;
				}
			};
			return sign();
		}
		/**
		* Create canonical headers for signing v4 url.
		*
		* The canonical headers for v4-signing a request demands header names are
		* first lowercased, followed by sorting the header names.
		* Then, construct the canonical headers part of the request:
		*  <lowercasedHeaderName> + ":" + Trim(<value>) + "\n"
		*  ..
		*  <lowercasedHeaderName> + ":" + Trim(<value>) + "\n"
		*
		* @param headers
		* @private
		*/
		getCanonicalHeaders(headers) {
			return (0, util_js_1.objectEntries)(headers).map(([headerName, value]) => [headerName.toLowerCase(), value]).sort((a, b) => a[0].localeCompare(b[0])).filter(([, value]) => value !== void 0).map(([headerName, value]) => {
				return `${headerName}:${`${value}`.trim().replace(/\s{2,}/g, " ")}\n`;
			}).join("");
		}
		getCanonicalRequest(method, path, query, headers, signedHeaders, contentSha256) {
			return [
				method,
				path,
				query,
				headers,
				signedHeaders,
				contentSha256 || "UNSIGNED-PAYLOAD"
			].join("\n");
		}
		getCanonicalQueryParams(query) {
			return (0, util_js_1.objectEntries)(query).map(([key, value]) => [(0, util_js_1.encodeURI)(key, true), (0, util_js_1.encodeURI)(value, true)]).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([key, value]) => `${key}=${value}`).join("&");
		}
		getResourcePath(cname, bucket, file) {
			if (cname) return "/" + (file || "");
			else if (file) return `/${bucket}/${file}`;
			else return `/${bucket}`;
		}
		parseExpires(expires, current = /* @__PURE__ */ new Date()) {
			const expiresInMSeconds = new Date(expires).valueOf();
			if (isNaN(expiresInMSeconds)) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_INVALID);
			if (expiresInMSeconds < current.valueOf()) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_PAST);
			return Math.floor(expiresInMSeconds / 1e3);
		}
		parseAccessibleAt(accessibleAt) {
			const accessibleAtInMSeconds = new Date(accessibleAt || /* @__PURE__ */ new Date()).valueOf();
			if (isNaN(accessibleAtInMSeconds)) throw new Error(SignerExceptionMessages.ACCESSIBLE_DATE_INVALID);
			return Math.floor(accessibleAtInMSeconds / 1e3);
		}
	};
	exports.URLSigner = URLSigner;
	/**
	* Custom error type for errors related to getting signed errors and policies.
	*
	* @private
	*/
	var SigningError = class extends Error {
		constructor() {
			super(...arguments);
			this.name = "SigningError";
		}
	};
	exports.SigningError = SigningError;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/file.js
var require_file = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var _File_instances, _File_validateIntegrity;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.File = exports.FileExceptionMessages = exports.RequestError = exports.STORAGE_POST_POLICY_BASE_URL = exports.ActionToHTTPMethod = void 0;
	var index_js_1 = require_nodejs_common();
	var promisify_1 = require_src$11();
	var crypto = __importStar(__require("crypto"));
	var fs$1 = __importStar(__require("fs"));
	var mime_1 = __importDefault(require_mime());
	var resumableUpload = __importStar(require_resumable_upload());
	var stream_1$2 = __require("stream");
	var zlib = __importStar(__require("zlib"));
	var storage_js_1 = require_storage();
	var bucket_js_1 = require_bucket();
	var acl_js_1 = require_acl();
	var signer_js_1 = require_signer();
	var util_js_1 = require_util();
	var duplexify_1 = __importDefault(require_duplexify());
	var util_js_2 = require_util$1();
	var crc32c_js_1 = require_crc32c();
	var hash_stream_validator_js_1 = require_hash_stream_validator();
	var async_retry_1 = __importDefault(require_lib());
	var ActionToHTTPMethod;
	(function(ActionToHTTPMethod) {
		ActionToHTTPMethod["read"] = "GET";
		ActionToHTTPMethod["write"] = "PUT";
		ActionToHTTPMethod["delete"] = "DELETE";
		ActionToHTTPMethod["resumable"] = "POST";
	})(ActionToHTTPMethod || (exports.ActionToHTTPMethod = ActionToHTTPMethod = {}));
	/**
	* @deprecated - no longer used
	*/
	exports.STORAGE_POST_POLICY_BASE_URL = "https://storage.googleapis.com";
	/**
	* @private
	*/
	var GS_URL_REGEXP = /^gs:\/\/([a-z0-9_.-]+)\/(.+)$/;
	/**
	* @private
	* This regex will match compressible content types. These are primarily text/*, +json, +text, +xml content types.
	* This was based off of mime-db and may periodically need to be updated if new compressible content types become
	* standards.
	*/
	var COMPRESSIBLE_MIME_REGEX = new RegExp([
		/^text\/|application\/ecmascript|application\/javascript|application\/json/,
		/|application\/postscript|application\/rtf|application\/toml|application\/vnd.dart/,
		/|application\/vnd.ms-fontobject|application\/wasm|application\/x-httpd-php|application\/x-ns-proxy-autoconfig/,
		/|application\/x-sh(?!ockwave-flash)|application\/x-tar|application\/x-virtualbox-hdd|application\/x-virtualbox-ova|application\/x-virtualbox-ovf/,
		/|^application\/x-virtualbox-vbox$|application\/x-virtualbox-vdi|application\/x-virtualbox-vhd|application\/x-virtualbox-vmdk/,
		/|application\/xml|application\/xml-dtd|font\/otf|font\/ttf|image\/bmp|image\/vnd.adobe.photoshop|image\/vnd.microsoft.icon/,
		/|image\/vnd.ms-dds|image\/x-icon|image\/x-ms-bmp|message\/rfc822|model\/gltf-binary|\+json|\+text|\+xml|\+yaml/
	].map((r) => r.source).join(""), "i");
	var RequestError = class extends Error {};
	exports.RequestError = RequestError;
	var SEVEN_DAYS = 10080 * 60;
	var GS_UTIL_URL_REGEX = /(gs):\/\/([a-z0-9_.-]+)\/(.+)/g;
	var HTTPS_PUBLIC_URL_REGEX = /(https):\/\/(storage\.googleapis\.com)\/([a-z0-9_.-]+)\/(.+)/g;
	var FileExceptionMessages;
	(function(FileExceptionMessages) {
		FileExceptionMessages["EXPIRATION_TIME_NA"] = "An expiration time is not available.";
		FileExceptionMessages["DESTINATION_NO_NAME"] = "Destination file should have a name.";
		FileExceptionMessages["INVALID_VALIDATION_FILE_RANGE"] = "Cannot use validation with file ranges (start/end).";
		FileExceptionMessages["MD5_NOT_AVAILABLE"] = "MD5 verification was specified, but is not available for the requested object. MD5 is not available for composite objects.";
		FileExceptionMessages["EQUALS_CONDITION_TWO_ELEMENTS"] = "Equals condition must be an array of 2 elements.";
		FileExceptionMessages["STARTS_WITH_TWO_ELEMENTS"] = "StartsWith condition must be an array of 2 elements.";
		FileExceptionMessages["CONTENT_LENGTH_RANGE_MIN_MAX"] = "ContentLengthRange must have numeric min & max fields.";
		FileExceptionMessages["DOWNLOAD_MISMATCH"] = "The downloaded data did not match the data from the server. To be sure the content is the same, you should download the file again.";
		FileExceptionMessages["UPLOAD_MISMATCH_DELETE_FAIL"] = "The uploaded data did not match the data from the server.\n    As a precaution, we attempted to delete the file, but it was not successful.\n    To be sure the content is the same, you should try removing the file manually,\n    then uploading the file again.\n    \n\nThe delete attempt failed with this message:\n\n  ";
		FileExceptionMessages["UPLOAD_MISMATCH"] = "The uploaded data did not match the data from the server.\n    As a precaution, the file has been deleted.\n    To be sure the content is the same, you should try uploading the file again.";
		FileExceptionMessages["MD5_RESUMED_UPLOAD"] = "MD5 cannot be used with a continued resumable upload as MD5 cannot be extended from an existing value";
		FileExceptionMessages["MISSING_RESUME_CRC32C_FINAL_UPLOAD"] = "The CRC32C is missing for the final portion of a resumed upload, which is required for validation. Please provide `resumeCRC32C` if validation is required, or disable `validation`.";
	})(FileExceptionMessages || (exports.FileExceptionMessages = FileExceptionMessages = {}));
	/**
	* A File object is created from your {@link Bucket} object using
	* {@link Bucket#file}.
	*
	* @class
	*/
	var File = class File extends index_js_1.ServiceObject {
		/**
		* Cloud Storage uses access control lists (ACLs) to manage object and
		* bucket access. ACLs are the mechanism you use to share objects with other
		* users and allow other users to access your buckets and objects.
		*
		* An ACL consists of one or more entries, where each entry grants permissions
		* to an entity. Permissions define the actions that can be performed against
		* an object or bucket (for example, `READ` or `WRITE`); the entity defines
		* who the permission applies to (for example, a specific user or group of
		* users).
		*
		* The `acl` object on a File instance provides methods to get you a list of
		* the ACLs defined on your bucket, as well as set, update, and delete them.
		*
		* See {@link http://goo.gl/6qBBPO| About Access Control lists}
		*
		* @name File#acl
		* @mixes Acl
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* //-
		* // Make a file publicly readable.
		* //-
		* const options = {
		*   entity: 'allUsers',
		*   role: storage.acl.READER_ROLE
		* };
		*
		* file.acl.add(options, function(err, aclObject) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.acl.add(options).then(function(data) {
		*   const aclObject = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		/**
		* The API-formatted resource description of the file.
		*
		* Note: This is not guaranteed to be up-to-date when accessed. To get the
		* latest record, call the `getMetadata()` method.
		*
		* @name File#metadata
		* @type {object}
		*/
		/**
		* The file's name.
		* @name File#name
		* @type {string}
		*/
		/**
		* @callback Crc32cGeneratorToStringCallback
		* A method returning the CRC32C as a base64-encoded string.
		*
		* @returns {string}
		*
		* @example
		* Hashing the string 'data' should return 'rth90Q=='
		*
		* ```js
		* const buffer = Buffer.from('data');
		* crc32c.update(buffer);
		* crc32c.toString(); // 'rth90Q=='
		* ```
		**/
		/**
		* @callback Crc32cGeneratorValidateCallback
		* A method validating a base64-encoded CRC32C string.
		*
		* @param {string} [value] base64-encoded CRC32C string to validate
		* @returns {boolean}
		*
		* @example
		* Should return `true` if the value matches, `false` otherwise
		*
		* ```js
		* const buffer = Buffer.from('data');
		* crc32c.update(buffer);
		* crc32c.validate('DkjKuA=='); // false
		* crc32c.validate('rth90Q=='); // true
		* ```
		**/
		/**
		* @callback Crc32cGeneratorUpdateCallback
		* A method for passing `Buffer`s for CRC32C generation.
		*
		* @param {Buffer} [data] data to update CRC32C value with
		* @returns {undefined}
		*
		* @example
		* Hashing buffers from 'some ' and 'text\n'
		*
		* ```js
		* const buffer1 = Buffer.from('some ');
		* crc32c.update(buffer1);
		*
		* const buffer2 = Buffer.from('text\n');
		* crc32c.update(buffer2);
		*
		* crc32c.toString(); // 'DkjKuA=='
		* ```
		**/
		/**
		* @typedef {object} CRC32CValidator
		* @property {Crc32cGeneratorToStringCallback}
		* @property {Crc32cGeneratorValidateCallback}
		* @property {Crc32cGeneratorUpdateCallback}
		*/
		/**
		* @callback Crc32cGeneratorCallback
		* @returns {CRC32CValidator}
		*/
		/**
		* @typedef {object} FileOptions Options passed to the File constructor.
		* @property {string} [encryptionKey] A custom encryption key.
		* @property {number} [generation] Generation to scope the file to.
		* @property {string} [kmsKeyName] Cloud KMS Key used to encrypt this
		*     object, if the object is encrypted by such a key. Limited availability;
		*     usable only by enabled projects.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for all requests made from File object.
		* @property {Crc32cGeneratorCallback} [callback] A function that generates a CRC32C Validator. Defaults to {@link CRC32C}
		*/
		/**
		* Constructs a file object.
		*
		* @param {Bucket} bucket The Bucket instance this file is
		*     attached to.
		* @param {string} name The name of the remote file.
		* @param {FileOptions} [options] Configuration options.
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* ```
		*/
		constructor(bucket, name, options = {}) {
			var _a, _b;
			const requestQueryObject = {};
			let generation;
			if (options.generation !== null) {
				if (typeof options.generation === "string") generation = Number(options.generation);
				else generation = options.generation;
				if (!isNaN(generation)) requestQueryObject.generation = generation;
			}
			Object.assign(requestQueryObject, options.preconditionOpts);
			const userProject = options.userProject || bucket.userProject;
			if (typeof userProject === "string") requestQueryObject.userProject = userProject;
			super({
				parent: bucket,
				baseUrl: "/o",
				id: encodeURIComponent(name),
				methods: {
					/**
					* @typedef {array} DeleteFileResponse
					* @property {object} 0 The full API response.
					*/
					/**
					* @callback DeleteFileCallback
					* @param {?Error} err Request error, if any.
					* @param {object} apiResponse The full API response.
					*/
					/**
					* Delete the file.
					*
					* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/delete| Objects: delete API Documentation}
					*
					* @method File#delete
					* @param {object} [options] Configuration options.
					* @param {boolean} [options.ignoreNotFound = false] Ignore an error if
					*     the file does not exist.
					* @param {string} [options.userProject] The ID of the project which will be
					*     billed for the request.
					* @param {DeleteFileCallback} [callback] Callback function.
					* @returns {Promise<DeleteFileResponse>}
					*
					* @example
					* ```
					* const {Storage} = require('@google-cloud/storage');
					* const storage = new Storage();
					* const myBucket = storage.bucket('my-bucket');
					*
					* const file = myBucket.file('my-file');
					* file.delete(function(err, apiResponse) {});
					*
					* //-
					* // If the callback is omitted, we'll return a Promise.
					* //-
					* file.delete().then(function(data) {
					*   const apiResponse = data[0];
					* });
					*
					* ```
					* @example <caption>include:samples/files.js</caption>
					* region_tag:storage_delete_file
					* Another example:
					*/
					delete: { reqOpts: { qs: requestQueryObject } },
					/**
					* @typedef {array} FileExistsResponse
					* @property {boolean} 0 Whether the {@link File} exists.
					*/
					/**
					* @callback FileExistsCallback
					* @param {?Error} err Request error, if any.
					* @param {boolean} exists Whether the {@link File} exists.
					*/
					/**
					* Check if the file exists.
					*
					* @method File#exists
					* @param {options} [options] Configuration options.
					* @param {string} [options.userProject] The ID of the project which will be
					*     billed for the request.
					* @param {FileExistsCallback} [callback] Callback function.
					* @returns {Promise<FileExistsResponse>}
					*
					* @example
					* ```
					* const {Storage} = require('@google-cloud/storage');
					* const storage = new Storage();
					* const myBucket = storage.bucket('my-bucket');
					*
					* const file = myBucket.file('my-file');
					*
					* file.exists(function(err, exists) {});
					*
					* //-
					* // If the callback is omitted, we'll return a Promise.
					* //-
					* file.exists().then(function(data) {
					*   const exists = data[0];
					* });
					* ```
					*/
					exists: { reqOpts: { qs: requestQueryObject } },
					/**
					* @typedef {array} GetFileResponse
					* @property {File} 0 The {@link File}.
					* @property {object} 1 The full API response.
					*/
					/**
					* @callback GetFileCallback
					* @param {?Error} err Request error, if any.
					* @param {File} file The {@link File}.
					* @param {object} apiResponse The full API response.
					*/
					/**
					* Get a file object and its metadata if it exists.
					*
					* @method File#get
					* @param {options} [options] Configuration options.
					* @param {string} [options.userProject] The ID of the project which will be
					*     billed for the request.
					* @param {number} [options.generation] The generation number to get
					* @param {string} [options.restoreToken] If this is a soft-deleted object in an HNS-enabled bucket, returns the restore token which will
					*    be necessary to restore it if there's a name conflict with another object.
					* @param {boolean} [options.softDeleted] If true, returns the soft-deleted object.
					Object `generation` is required if `softDeleted` is set to True.
					* @param {GetFileCallback} [callback] Callback function.
					* @returns {Promise<GetFileResponse>}
					*
					* @example
					* ```
					* const {Storage} = require('@google-cloud/storage');
					* const storage = new Storage();
					* const myBucket = storage.bucket('my-bucket');
					*
					* const file = myBucket.file('my-file');
					*
					* file.get(function(err, file, apiResponse) {
					*   // file.metadata` has been populated.
					* });
					*
					* //-
					* // If the callback is omitted, we'll return a Promise.
					* //-
					* file.get().then(function(data) {
					*   const file = data[0];
					*   const apiResponse = data[1];
					* });
					* ```
					*/
					get: { reqOpts: { qs: requestQueryObject } },
					/**
					* @typedef {array} GetFileMetadataResponse
					* @property {object} 0 The {@link File} metadata.
					* @property {object} 1 The full API response.
					*/
					/**
					* @callback GetFileMetadataCallback
					* @param {?Error} err Request error, if any.
					* @param {object} metadata The {@link File} metadata.
					* @param {object} apiResponse The full API response.
					*/
					/**
					* Get the file's metadata.
					*
					* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/get| Objects: get API Documentation}
					*
					* @method File#getMetadata
					* @param {object} [options] Configuration options.
					* @param {string} [options.userProject] The ID of the project which will be
					*     billed for the request.
					* @param {GetFileMetadataCallback} [callback] Callback function.
					* @returns {Promise<GetFileMetadataResponse>}
					*
					* @example
					* ```
					* const {Storage} = require('@google-cloud/storage');
					* const storage = new Storage();
					* const myBucket = storage.bucket('my-bucket');
					*
					* const file = myBucket.file('my-file');
					*
					* file.getMetadata(function(err, metadata, apiResponse) {});
					*
					* //-
					* // If the callback is omitted, we'll return a Promise.
					* //-
					* file.getMetadata().then(function(data) {
					*   const metadata = data[0];
					*   const apiResponse = data[1];
					* });
					*
					* ```
					* @example <caption>include:samples/files.js</caption>
					* region_tag:storage_get_metadata
					* Another example:
					*/
					getMetadata: { reqOpts: { qs: requestQueryObject } },
					/**
					* @typedef {object} SetFileMetadataOptions Configuration options for File#setMetadata().
					* @param {string} [userProject] The ID of the project which will be billed for the request.
					*/
					/**
					* @callback SetFileMetadataCallback
					* @param {?Error} err Request error, if any.
					* @param {object} apiResponse The full API response.
					*/
					/**
					* @typedef {array} SetFileMetadataResponse
					* @property {object} 0 The full API response.
					*/
					/**
					* Merge the given metadata with the current remote file's metadata. This
					* will set metadata if it was previously unset or update previously set
					* metadata. To unset previously set metadata, set its value to null.
					*
					* You can set custom key/value pairs in the metadata key of the given
					* object, however the other properties outside of this object must adhere
					* to the {@link https://goo.gl/BOnnCK| official API documentation}.
					*
					*
					* See the examples below for more information.
					*
					* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/patch| Objects: patch API Documentation}
					*
					* @method File#setMetadata
					* @param {object} [metadata] The metadata you wish to update.
					* @param {SetFileMetadataOptions} [options] Configuration options.
					* @param {SetFileMetadataCallback} [callback] Callback function.
					* @returns {Promise<SetFileMetadataResponse>}
					*
					* @example
					* ```
					* const {Storage} = require('@google-cloud/storage');
					* const storage = new Storage();
					* const myBucket = storage.bucket('my-bucket');
					*
					* const file = myBucket.file('my-file');
					*
					* const metadata = {
					*   contentType: 'application/x-font-ttf',
					*   metadata: {
					*     my: 'custom',
					*     properties: 'go here'
					*   }
					* };
					*
					* file.setMetadata(metadata, function(err, apiResponse) {});
					*
					* // Assuming current metadata = { hello: 'world', unsetMe: 'will do' }
					* file.setMetadata({
					*   metadata: {
					*     abc: '123', // will be set.
					*     unsetMe: null, // will be unset (deleted).
					*     hello: 'goodbye' // will be updated from 'world' to 'goodbye'.
					*   }
					* }, function(err, apiResponse) {
					*   // metadata should now be { abc: '123', hello: 'goodbye' }
					* });
					*
					* //-
					* // Set a temporary hold on this file from its bucket's retention period
					* // configuration.
					* //
					* file.setMetadata({
					*   temporaryHold: true
					* }, function(err, apiResponse) {});
					*
					* //-
					* // Alternatively, you may set a temporary hold. This will follow the
					* // same behavior as an event-based hold, with the exception that the
					* // bucket's retention policy will not renew for this file from the time
					* // the hold is released.
					* //-
					* file.setMetadata({
					*   eventBasedHold: true
					* }, function(err, apiResponse) {});
					*
					* //-
					* // If the callback is omitted, we'll return a Promise.
					* //-
					* file.setMetadata(metadata).then(function(data) {
					*   const apiResponse = data[0];
					* });
					* ```
					*/
					setMetadata: { reqOpts: { qs: requestQueryObject } }
				}
			});
			_File_instances.add(this);
			this.bucket = bucket;
			this.storage = bucket.parent;
			if (options.generation !== null) {
				let generation;
				if (typeof options.generation === "string") generation = Number(options.generation);
				else generation = options.generation;
				if (!isNaN(generation)) this.generation = generation;
			}
			this.kmsKeyName = options.kmsKeyName;
			this.userProject = userProject;
			this.name = name;
			if (options.encryptionKey) this.setEncryptionKey(options.encryptionKey);
			this.acl = new acl_js_1.Acl({
				request: this.request.bind(this),
				pathPrefix: "/acl"
			});
			this.crc32cGenerator = options.crc32cGenerator || this.bucket.crc32cGenerator;
			this.instanceRetryValue = (_b = (_a = this.storage) === null || _a === void 0 ? void 0 : _a.retryOptions) === null || _b === void 0 ? void 0 : _b.autoRetry;
			this.instancePreconditionOpts = options === null || options === void 0 ? void 0 : options.preconditionOpts;
		}
		/**
		* The object's Cloud Storage URI (`gs://`)
		*
		* @example
		* ```ts
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const file = bucket.file('image.png');
		*
		* // `gs://my-bucket/image.png`
		* const href = file.cloudStorageURI.href;
		* ```
		*/
		get cloudStorageURI() {
			const uri = this.bucket.cloudStorageURI;
			uri.pathname = this.name;
			return uri;
		}
		/**
		* A helper method for determining if a request should be retried based on preconditions.
		* This should only be used for methods where the idempotency is determined by
		* `ifGenerationMatch`
		* @private
		*
		* A request should not be retried under the following conditions:
		* - if precondition option `ifGenerationMatch` is not set OR
		* - if `idempotencyStrategy` is set to `RetryNever`
		*/
		shouldRetryBasedOnPreconditionAndIdempotencyStrat(options) {
			var _a;
			return !((options === null || options === void 0 ? void 0 : options.ifGenerationMatch) === void 0 && ((_a = this.instancePreconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) === void 0 && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever);
		}
		/**
		* @typedef {array} CopyResponse
		* @property {File} 0 The copied {@link File}.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback CopyCallback
		* @param {?Error} err Request error, if any.
		* @param {File} copiedFile The copied {@link File}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {object} CopyOptions Configuration options for File#copy(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects#resource| Object resource}.
		* @property {string} [cacheControl] The cacheControl setting for the new file.
		* @property {string} [contentEncoding] The contentEncoding setting for the new file.
		* @property {string} [contentType] The contentType setting for the new file.
		* @property {string} [destinationKmsKeyName] Resource name of the Cloud
		*     KMS key, of the form
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`,
		*     that will be used to encrypt the object. Overwrites the object
		* metadata's `kms_key_name` value, if any.
		* @property {Metadata} [metadata] Metadata to specify on the copied file.
		* @property {string} [predefinedAcl] Set the ACL for the new file.
		* @property {string} [token] A previously-returned `rewriteToken` from an
		*     unfinished rewrite request.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* Copy this file to another file. By default, this will copy the file to the
		* same bucket, but you can choose to copy it to another Bucket by providing
		* a Bucket or File object or a URL starting with "gs://".
		* The generation of the file will not be preserved.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/rewrite| Objects: rewrite API Documentation}
		*
		* @throws {Error} If the destination file is not provided.
		*
		* @param {string|Bucket|File} destination Destination file.
		* @param {CopyOptions} [options] Configuration options. See an
		* @param {CopyCallback} [callback] Callback function.
		* @returns {Promise<CopyResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		*
		* //-
		* // You can pass in a variety of types for the destination.
		* //
		* // For all of the below examples, assume we are working with the following
		* // Bucket and File objects.
		* //-
		* const bucket = storage.bucket('my-bucket');
		* const file = bucket.file('my-image.png');
		*
		* //-
		* // If you pass in a string for the destination, the file is copied to its
		* // current bucket, under the new name provided.
		* //-
		* file.copy('my-image-copy.png', function(err, copiedFile, apiResponse) {
		*   // `my-bucket` now contains:
		*   // - "my-image.png"
		*   // - "my-image-copy.png"
		*
		*   // `copiedFile` is an instance of a File object that refers to your new
		*   // file.
		* });
		*
		* //-
		* // If you pass in a string starting with "gs://" for the destination, the
		* // file is copied to the other bucket and under the new name provided.
		* //-
		* const newLocation = 'gs://another-bucket/my-image-copy.png';
		* file.copy(newLocation, function(err, copiedFile, apiResponse) {
		*   // `my-bucket` still contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-image-copy.png"
		*
		*   // `copiedFile` is an instance of a File object that refers to your new
		*   // file.
		* });
		*
		* //-
		* // If you pass in a Bucket object, the file will be copied to that bucket
		* // using the same name.
		* //-
		* const anotherBucket = storage.bucket('another-bucket');
		* file.copy(anotherBucket, function(err, copiedFile, apiResponse) {
		*   // `my-bucket` still contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-image.png"
		*
		*   // `copiedFile` is an instance of a File object that refers to your new
		*   // file.
		* });
		*
		* //-
		* // If you pass in a File object, you have complete control over the new
		* // bucket and filename.
		* //-
		* const anotherFile = anotherBucket.file('my-awesome-image.png');
		* file.copy(anotherFile, function(err, copiedFile, apiResponse) {
		*   // `my-bucket` still contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-awesome-image.png"
		*
		*   // Note:
		*   // The `copiedFile` parameter is equal to `anotherFile`.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.copy(newLocation).then(function(data) {
		*   const newFile = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_copy_file
		* Another example:
		*/
		copy(destination, optionsOrCallback, callback) {
			var _a, _b;
			const noDestinationError = new Error(FileExceptionMessages.DESTINATION_NO_NAME);
			if (!destination) throw noDestinationError;
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = { ...optionsOrCallback };
			callback = callback || index_js_1.util.noop;
			let destBucket;
			let destName;
			let newFile;
			if (typeof destination === "string") {
				const parsedDestination = GS_URL_REGEXP.exec(destination);
				if (parsedDestination !== null && parsedDestination.length === 3) {
					destBucket = this.storage.bucket(parsedDestination[1]);
					destName = parsedDestination[2];
				} else {
					destBucket = this.bucket;
					destName = destination;
				}
			} else if (destination instanceof bucket_js_1.Bucket) {
				destBucket = destination;
				destName = this.name;
			} else if (destination instanceof File) {
				destBucket = destination.bucket;
				destName = destination.name;
				newFile = destination;
			} else throw noDestinationError;
			const query = {};
			if (this.generation !== void 0) query.sourceGeneration = this.generation;
			if (options.token !== void 0) query.rewriteToken = options.token;
			if (options.userProject !== void 0) {
				query.userProject = options.userProject;
				delete options.userProject;
			}
			if (options.predefinedAcl !== void 0) {
				query.destinationPredefinedAcl = options.predefinedAcl;
				delete options.predefinedAcl;
			}
			newFile = newFile || destBucket.file(destName);
			const headers = {};
			if (this.encryptionKey !== void 0) {
				headers["x-goog-copy-source-encryption-algorithm"] = "AES256";
				headers["x-goog-copy-source-encryption-key"] = this.encryptionKeyBase64;
				headers["x-goog-copy-source-encryption-key-sha256"] = this.encryptionKeyHash;
			}
			if (newFile.encryptionKey !== void 0) this.setEncryptionKey(newFile.encryptionKey);
			else if (options.destinationKmsKeyName !== void 0) {
				query.destinationKmsKeyName = options.destinationKmsKeyName;
				delete options.destinationKmsKeyName;
			} else if (newFile.kmsKeyName !== void 0) query.destinationKmsKeyName = newFile.kmsKeyName;
			if (query.destinationKmsKeyName) {
				this.kmsKeyName = query.destinationKmsKeyName;
				const keyIndex = this.interceptors.indexOf(this.encryptionKeyInterceptor);
				if (keyIndex > -1) this.interceptors.splice(keyIndex, 1);
			}
			if (!this.shouldRetryBasedOnPreconditionAndIdempotencyStrat(options === null || options === void 0 ? void 0 : options.preconditionOpts)) this.storage.retryOptions.autoRetry = false;
			if (((_a = options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) !== void 0) {
				query.ifGenerationMatch = (_b = options.preconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationMatch;
				delete options.preconditionOpts;
			}
			this.request({
				method: "POST",
				uri: `/rewriteTo/b/${destBucket.name}/o/${encodeURIComponent(newFile.name)}`,
				qs: query,
				json: options,
				headers
			}, (err, resp) => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
				if (err) {
					callback(err, null, resp);
					return;
				}
				if (resp.rewriteToken) {
					const options = { token: resp.rewriteToken };
					if (query.userProject) options.userProject = query.userProject;
					if (query.destinationKmsKeyName) options.destinationKmsKeyName = query.destinationKmsKeyName;
					this.copy(newFile, options, callback);
					return;
				}
				callback(null, newFile, resp);
			});
		}
		/**
		* @typedef {object} CreateReadStreamOptions Configuration options for File#createReadStream.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {string|boolean} [validation] Possible values: `"md5"`,
		*     `"crc32c"`, or `false`. By default, data integrity is validated with a
		*     CRC32c checksum. You may use MD5 if preferred, but that hash is not
		*     supported for composite objects. An error will be raised if MD5 is
		*     specified but is not available. You may also choose to skip validation
		*     completely, however this is **not recommended**.
		* @property {number} [start] A byte offset to begin the file's download
		*     from. Default is 0. NOTE: Byte ranges are inclusive; that is,
		*     `options.start = 0` and `options.end = 999` represent the first 1000
		*     bytes in a file or object. NOTE: when specifying a byte range, data
		*     integrity is not available.
		* @property {number} [end] A byte offset to stop reading the file at.
		*     NOTE: Byte ranges are inclusive; that is, `options.start = 0` and
		*     `options.end = 999` represent the first 1000 bytes in a file or object.
		*     NOTE: when specifying a byte range, data integrity is not available.
		* @property {boolean} [decompress=true] Disable auto decompression of the
		*     received data. By default this option is set to `true`.
		*     Applicable in cases where the data was uploaded with
		*     `gzip: true` option. See {@link File#createWriteStream}.
		*/
		/**
		* Create a readable stream to read the contents of the remote file. It can be
		* piped to a writable stream or listened to for 'data' events to read a
		* file's contents.
		*
		* In the unlikely event there is a mismatch between what you downloaded and
		* the version in your Bucket, your error handler will receive an error with
		* code "CONTENT_DOWNLOAD_MISMATCH". If you receive this error, the best
		* recourse is to try downloading the file again.
		*
		* NOTE: Readable streams will emit the `end` event when the file is fully
		* downloaded.
		*
		* @param {CreateReadStreamOptions} [options] Configuration options.
		* @returns {ReadableStream}
		*
		* @example
		* ```
		* //-
		* // <h4>Downloading a File</h4>
		* //
		* // The example below demonstrates how we can reference a remote file, then
		* // pipe its contents to a local file. This is effectively creating a local
		* // backup of your remote data.
		* //-
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* const fs = require('fs');
		* const remoteFile = bucket.file('image.png');
		* const localFilename = '/Users/stephen/Photos/image.png';
		*
		* remoteFile.createReadStream()
		*   .on('error', function(err) {})
		*   .on('response', function(response) {
		*     // Server connected and responded with the specified status and headers.
		*    })
		*   .on('end', function() {
		*     // The file is fully downloaded.
		*   })
		*   .pipe(fs.createWriteStream(localFilename));
		*
		* //-
		* // To limit the downloaded data to only a byte range, pass an options
		* // object.
		* //-
		* const logFile = myBucket.file('access_log');
		* logFile.createReadStream({
		*     start: 10000,
		*     end: 20000
		*   })
		*   .on('error', function(err) {})
		*   .pipe(fs.createWriteStream('/Users/stephen/logfile.txt'));
		*
		* //-
		* // To read a tail byte range, specify only `options.end` as a negative
		* // number.
		* //-
		* const logFile = myBucket.file('access_log');
		* logFile.createReadStream({
		*     end: -100
		*   })
		*   .on('error', function(err) {})
		*   .pipe(fs.createWriteStream('/Users/stephen/logfile.txt'));
		* ```
		*/
		createReadStream(options = {}) {
			options = Object.assign({ decompress: true }, options);
			const rangeRequest = typeof options.start === "number" || typeof options.end === "number";
			const tailRequest = options.end < 0;
			let validateStream = void 0;
			let request = void 0;
			const throughStream = new util_js_2.PassThroughShim();
			let crc32c = true;
			let md5 = false;
			if (typeof options.validation === "string") {
				const value = options.validation.toLowerCase().trim();
				crc32c = value === "crc32c";
				md5 = value === "md5";
			} else if (options.validation === false) crc32c = false;
			const shouldRunValidation = !rangeRequest && (crc32c || md5);
			if (rangeRequest) {
				if (typeof options.validation === "string" || options.validation === true) throw new Error(FileExceptionMessages.INVALID_VALIDATION_FILE_RANGE);
				crc32c = false;
				md5 = false;
			}
			const onComplete = (err) => {
				if (err) {
					if (request === null || request === void 0 ? void 0 : request.agent) request.agent.destroy();
					throughStream.destroy(err);
				}
			};
			const onResponse = (err, _body, rawResponseStream) => {
				if (err) {
					this.getBufferFromReadable(rawResponseStream).then((body) => {
						err.message = body.toString("utf8");
						throughStream.destroy(err);
					});
					return;
				}
				request = rawResponseStream.request;
				const headers = rawResponseStream.toJSON().headers;
				const isCompressed = headers["content-encoding"] === "gzip";
				const hashes = {};
				const safeToValidate = headers["x-goog-stored-content-encoding"] === "gzip" && isCompressed || headers["x-goog-stored-content-encoding"] === "identity";
				const transformStreams = [];
				if (shouldRunValidation) {
					if (typeof headers["x-goog-hash"] === "string") headers["x-goog-hash"].split(",").forEach((hashKeyValPair) => {
						const delimiterIndex = hashKeyValPair.indexOf("=");
						const hashType = hashKeyValPair.substring(0, delimiterIndex);
						hashes[hashType] = hashKeyValPair.substring(delimiterIndex + 1);
					});
					validateStream = new hash_stream_validator_js_1.HashStreamValidator({
						crc32c,
						md5,
						crc32cGenerator: this.crc32cGenerator,
						crc32cExpected: hashes.crc32c,
						md5Expected: hashes.md5
					});
				}
				if (md5 && !hashes.md5) {
					const hashError = new RequestError(FileExceptionMessages.MD5_NOT_AVAILABLE);
					hashError.code = "MD5_NOT_AVAILABLE";
					throughStream.destroy(hashError);
					return;
				}
				if (safeToValidate && shouldRunValidation && validateStream) transformStreams.push(validateStream);
				if (isCompressed && options.decompress) transformStreams.push(zlib.createGunzip());
				(0, stream_1$2.pipeline)(rawResponseStream, ...transformStreams, throughStream, onComplete);
			};
			const makeRequest = () => {
				const query = { alt: "media" };
				if (this.generation) query.generation = this.generation;
				if (options.userProject) query.userProject = options.userProject;
				const headers = {
					"Accept-Encoding": "gzip",
					"Cache-Control": "no-store"
				};
				if (rangeRequest) {
					const start = typeof options.start === "number" ? options.start : "0";
					const end = typeof options.end === "number" ? options.end : "";
					headers.Range = `bytes=${tailRequest ? end : `${start}-${end}`}`;
				}
				const reqOpts = {
					uri: "",
					headers,
					qs: query
				};
				if (options[util_js_1.GCCL_GCS_CMD_KEY]) reqOpts[util_js_1.GCCL_GCS_CMD_KEY] = options[util_js_1.GCCL_GCS_CMD_KEY];
				this.requestStream(reqOpts).on("error", (err) => {
					throughStream.destroy(err);
				}).on("response", (res) => {
					throughStream.emit("response", res);
					index_js_1.util.handleResp(null, res, null, onResponse);
				}).resume();
			};
			throughStream.on("reading", makeRequest);
			return throughStream;
		}
		/**
		* @callback CreateResumableUploadCallback
		* @param {?Error} err Request error, if any.
		* @param {string} uri The resumable upload's unique session URI.
		*/
		/**
		* @typedef {array} CreateResumableUploadResponse
		* @property {string} 0 The resumable upload's unique session URI.
		*/
		/**
		* @typedef {object} CreateResumableUploadOptions
		* @property {object} [metadata] Metadata to set on the file.
		* @property {number} [offset] The starting byte of the upload stream for resuming an interrupted upload.
		* @property {string} [origin] Origin header to set for the upload.
		* @property {string} [predefinedAcl] Apply a predefined set of access
		* controls to this object.
		*
		* Acceptable values are:
		* - **`authenticatedRead`** - Object owner gets `OWNER` access, and
		*   `allAuthenticatedUsers` get `READER` access.
		*
		* - **`bucketOwnerFullControl`** - Object owner gets `OWNER` access, and
		*   project team owners get `OWNER` access.
		*
		* - **`bucketOwnerRead`** - Object owner gets `OWNER` access, and project
		*   team owners get `READER` access.
		*
		* - **`private`** - Object owner gets `OWNER` access.
		*
		* - **`projectPrivate`** - Object owner gets `OWNER` access, and project
		*   team members get access according to their roles.
		*
		* - **`publicRead`** - Object owner gets `OWNER` access, and `allUsers`
		*   get `READER` access.
		* @property {boolean} [private] Make the uploaded file private. (Alias for
		*     `options.predefinedAcl = 'private'`)
		* @property {boolean} [public] Make the uploaded file public. (Alias for
		*     `options.predefinedAcl = 'publicRead'`)
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {string} [chunkSize] Create a separate request per chunk. This
		*     value is in bytes and should be a multiple of 256 KiB (2^18).
		*     {@link https://cloud.google.com/storage/docs/performing-resumable-uploads#chunked-upload| We recommend using at least 8 MiB for the chunk size.}
		*/
		/**
		* Create a unique resumable upload session URI. This is the first step when
		* performing a resumable upload.
		*
		* See the {@link https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload| Resumable upload guide}
		* for more on how the entire process works.
		*
		* <h4>Note</h4>
		*
		* If you are just looking to perform a resumable upload without worrying
		* about any of the details, see {@link File#createWriteStream}. Resumable
		* uploads are performed by default.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload| Resumable upload guide}
		*
		* @param {CreateResumableUploadOptions} [options] Configuration options.
		* @param {CreateResumableUploadCallback} [callback] Callback function.
		* @returns {Promise<CreateResumableUploadResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* file.createResumableUpload(function(err, uri) {
		*   if (!err) {
		*     // `uri` can be used to PUT data to.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.createResumableUpload().then(function(data) {
		*   const uri = data[0];
		* });
		* ```
		*/
		createResumableUpload(optionsOrCallback, callback) {
			var _a, _b;
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const retryOptions = this.storage.retryOptions;
			if (((_a = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) === void 0 && ((_b = this.instancePreconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationMatch) === void 0 && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) retryOptions.autoRetry = false;
			resumableUpload.createURI({
				authClient: this.storage.authClient,
				apiEndpoint: this.storage.apiEndpoint,
				bucket: this.bucket.name,
				customRequestOptions: this.getRequestInterceptors().reduce((reqOpts, interceptorFn) => interceptorFn(reqOpts), {}),
				file: this.name,
				generation: this.generation,
				key: this.encryptionKey,
				kmsKeyName: this.kmsKeyName,
				metadata: options.metadata,
				offset: options.offset,
				origin: options.origin,
				predefinedAcl: options.predefinedAcl,
				private: options.private,
				public: options.public,
				userProject: options.userProject || this.userProject,
				retryOptions,
				params: (options === null || options === void 0 ? void 0 : options.preconditionOpts) || this.instancePreconditionOpts,
				universeDomain: this.bucket.storage.universeDomain,
				useAuthWithCustomEndpoint: this.storage.useAuthWithCustomEndpoint,
				[util_js_1.GCCL_GCS_CMD_KEY]: options[util_js_1.GCCL_GCS_CMD_KEY]
			}, callback);
			this.storage.retryOptions.autoRetry = this.instanceRetryValue;
		}
		/**
		* @typedef {object} CreateWriteStreamOptions Configuration options for File#createWriteStream().
		* @property {string} [contentType] Alias for
		*     `options.metadata.contentType`. If set to `auto`, the file name is used
		*     to determine the contentType.
		* @property {string|boolean} [gzip] If true, automatically gzip the file.
		*     If set to `auto`, the contentType is used to determine if the file
		* should be gzipped. This will set `options.metadata.contentEncoding` to
		* `gzip` if necessary.
		* @property {object} [metadata] See the examples below or
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request_properties_JSON| Objects: insert request body}
		*     for more details.
		* @property {number} [offset] The starting byte of the upload stream, for
		*     resuming an interrupted upload. Defaults to 0.
		* @property {string} [predefinedAcl] Apply a predefined set of access
		* controls to this object.
		*
		* Acceptable values are:
		* - **`authenticatedRead`** - Object owner gets `OWNER` access, and
		*   `allAuthenticatedUsers` get `READER` access.
		*
		* - **`bucketOwnerFullControl`** - Object owner gets `OWNER` access, and
		*   project team owners get `OWNER` access.
		*
		* - **`bucketOwnerRead`** - Object owner gets `OWNER` access, and project
		*   team owners get `READER` access.
		*
		* - **`private`** - Object owner gets `OWNER` access.
		*
		* - **`projectPrivate`** - Object owner gets `OWNER` access, and project
		*   team members get access according to their roles.
		*
		* - **`publicRead`** - Object owner gets `OWNER` access, and `allUsers`
		*   get `READER` access.
		* @property {boolean} [private] Make the uploaded file private. (Alias for
		*     `options.predefinedAcl = 'private'`)
		* @property {boolean} [public] Make the uploaded file public. (Alias for
		*     `options.predefinedAcl = 'publicRead'`)
		* @property {boolean} [resumable] Force a resumable upload. NOTE: When
		*     working with streams, the file format and size is unknown until it's
		*     completely consumed. Because of this, it's best for you to be explicit
		*     for what makes sense given your input.
		* @property {number} [timeout=60000] Set the HTTP request timeout in
		*     milliseconds. This option is not available for resumable uploads.
		*     Default: `60000`
		* @property {string} [uri] The URI for an already-created resumable
		*     upload. See {@link File#createResumableUpload}.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {string|boolean} [validation] Possible values: `"md5"`,
		*     `"crc32c"`, or `false`. By default, data integrity is validated with a
		*     CRC32c checksum. You may use MD5 if preferred, but that hash is not
		*     supported for composite objects. An error will be raised if MD5 is
		*     specified but is not available. You may also choose to skip validation
		*     completely, however this is **not recommended**. In addition to specifying
		*     validation type, providing `metadata.crc32c` or `metadata.md5Hash` will
		*     cause the server to perform validation in addition to client validation.
		*     NOTE: Validation is automatically skipped for objects that were
		*     uploaded using the `gzip` option and have already compressed content.
		*/
		/**
		* Create a writable stream to overwrite the contents of the file in your
		* bucket.
		*
		* A File object can also be used to create files for the first time.
		*
		* Resumable uploads are automatically enabled and must be shut off explicitly
		* by setting `options.resumable` to `false`.
		*
		*
		* <p class="notice">
		*   There is some overhead when using a resumable upload that can cause
		*   noticeable performance degradation while uploading a series of small
		*   files. When uploading files less than 10MB, it is recommended that the
		*   resumable feature is disabled.
		* </p>
		*
		* NOTE: Writable streams will emit the `finish` event when the file is fully
		* uploaded.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/how-tos/upload Upload Options (Simple or Resumable)}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/insert Objects: insert API Documentation}
		*
		* @param {CreateWriteStreamOptions} [options] Configuration options.
		* @returns {WritableStream}
		*
		* @example
		* ```
		* const fs = require('fs');
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* //-
		* // <h4>Uploading a File</h4>
		* //
		* // Now, consider a case where we want to upload a file to your bucket. You
		* // have the option of using {@link Bucket#upload}, but that is just
		* // a convenience method which will do the following.
		* //-
		* fs.createReadStream('/Users/stephen/Photos/birthday-at-the-zoo/panda.jpg')
		*   .pipe(file.createWriteStream())
		*   .on('error', function(err) {})
		*   .on('finish', function() {
		*     // The file upload is complete.
		*   });
		*
		* //-
		* // <h4>Uploading a File with gzip compression</h4>
		* //-
		* fs.createReadStream('/Users/stephen/site/index.html')
		*   .pipe(file.createWriteStream({ gzip: true }))
		*   .on('error', function(err) {})
		*   .on('finish', function() {
		*     // The file upload is complete.
		*   });
		*
		* //-
		* // Downloading the file with `createReadStream` will automatically decode
		* // the file.
		* //-
		*
		* //-
		* // <h4>Uploading a File with Metadata</h4>
		* //
		* // One last case you may run into is when you want to upload a file to your
		* // bucket and set its metadata at the same time. Like above, you can use
		* // {@link Bucket#upload} to do this, which is just a wrapper around
		* // the following.
		* //-
		* fs.createReadStream('/Users/stephen/Photos/birthday-at-the-zoo/panda.jpg')
		*   .pipe(file.createWriteStream({
		*     metadata: {
		*       contentType: 'image/jpeg',
		*       metadata: {
		*         custom: 'metadata'
		*       }
		*     }
		*   }))
		*   .on('error', function(err) {})
		*   .on('finish', function() {
		*     // The file upload is complete.
		*   });
		* ```
		*
		* //-
		* // <h4>Continuing a Resumable Upload</h4>
		* //
		* // One can capture a `uri` from a resumable upload to reuse later.
		* // Additionally, for validation, one can also capture and pass `crc32c`.
		* //-
		* let uri: string | undefined = undefined;
		* let resumeCRC32C: string | undefined = undefined;
		*
		* fs.createWriteStream()
		*   .on('uri', link => {uri = link})
		*   .on('crc32', crc32c => {resumeCRC32C = crc32c});
		*
		* // later...
		* fs.createWriteStream({uri, resumeCRC32C});
		*/
		createWriteStream(options = {}) {
			var _a;
			(_a = options.metadata) !== null && _a !== void 0 || (options.metadata = {});
			if (options.contentType) options.metadata.contentType = options.contentType;
			if (!options.metadata.contentType || options.metadata.contentType === "auto") {
				const detectedContentType = mime_1.default.getType(this.name);
				if (detectedContentType) options.metadata.contentType = detectedContentType;
			}
			let gzip = options.gzip;
			if (gzip === "auto") gzip = COMPRESSIBLE_MIME_REGEX.test(options.metadata.contentType || "");
			if (gzip) options.metadata.contentEncoding = "gzip";
			let crc32c = true;
			let md5 = false;
			if (typeof options.validation === "string") {
				options.validation = options.validation.toLowerCase();
				crc32c = options.validation === "crc32c";
				md5 = options.validation === "md5";
			} else if (options.validation === false) {
				crc32c = false;
				md5 = false;
			}
			if (options.offset) {
				if (md5) throw new RangeError(FileExceptionMessages.MD5_RESUMED_UPLOAD);
				if (crc32c && !options.isPartialUpload && !options.resumeCRC32C) throw new RangeError(FileExceptionMessages.MISSING_RESUME_CRC32C_FINAL_UPLOAD);
			}
			/**
			* A callback for determining when the underlying pipeline is complete.
			* It's possible the pipeline callback could error before the write stream
			* calls `final` so by default this will destroy the write stream unless the
			* write stream sets this callback via its `final` handler.
			* @param error An optional error
			*/
			let pipelineCallback = (error) => {
				writeStream.destroy(error || void 0);
			};
			const writeStream = new stream_1$2.Writable({
				final(cb) {
					pipelineCallback = cb;
					emitStream.end();
				},
				write(chunk, encoding, cb) {
					emitStream.write(chunk, encoding, cb);
				}
			});
			writeStream.once("error", (e) => {
				emitStream.destroy(e);
			});
			writeStream.once("close", () => {
				emitStream.destroy();
			});
			const transformStreams = [];
			if (gzip) transformStreams.push(zlib.createGzip());
			const emitStream = new util_js_2.PassThroughShim();
			const noop = () => {};
			emitStream.on("error", noop);
			let hashCalculatingStream = null;
			if (crc32c || md5) {
				const crc32cInstance = options.resumeCRC32C ? crc32c_js_1.CRC32C.from(options.resumeCRC32C) : void 0;
				hashCalculatingStream = new hash_stream_validator_js_1.HashStreamValidator({
					crc32c,
					crc32cInstance,
					md5,
					crc32cGenerator: this.crc32cGenerator,
					updateHashesOnly: true
				});
				transformStreams.push(hashCalculatingStream);
			}
			const fileWriteStream = (0, duplexify_1.default)();
			let fileWriteStreamMetadataReceived = false;
			emitStream.on("reading", () => writeStream.emit("reading"));
			emitStream.on("writing", () => writeStream.emit("writing"));
			fileWriteStream.on("uri", (evt) => writeStream.emit("uri", evt));
			fileWriteStream.on("progress", (evt) => writeStream.emit("progress", evt));
			fileWriteStream.on("response", (resp) => writeStream.emit("response", resp));
			fileWriteStream.once("metadata", () => {
				fileWriteStreamMetadataReceived = true;
			});
			writeStream.once("writing", () => {
				if (options.resumable === false) this.startSimpleUpload_(fileWriteStream, options);
				else this.startResumableUpload_(fileWriteStream, options);
				emitStream.removeListener("error", noop);
				(0, stream_1$2.pipeline)(emitStream, ...transformStreams, fileWriteStream, async (e) => {
					if (e) return pipelineCallback(e);
					if (options.isPartialUpload) {
						if (hashCalculatingStream === null || hashCalculatingStream === void 0 ? void 0 : hashCalculatingStream.crc32c) writeStream.emit("crc32c", hashCalculatingStream.crc32c);
						return pipelineCallback();
					}
					if (!fileWriteStreamMetadataReceived) try {
						await new Promise((resolve, reject) => {
							fileWriteStream.once("metadata", resolve);
							fileWriteStream.once("error", reject);
						});
					} catch (e) {
						return pipelineCallback(e);
					}
					if (hashCalculatingStream === null || hashCalculatingStream === void 0 ? void 0 : hashCalculatingStream.crc32c) writeStream.emit("crc32c", hashCalculatingStream.crc32c);
					try {
						const metadataNotReady = options.isPartialUpload && !this.metadata;
						if (hashCalculatingStream && !metadataNotReady) await __classPrivateFieldGet(this, _File_instances, "m", _File_validateIntegrity).call(this, hashCalculatingStream, {
							crc32c,
							md5
						});
						pipelineCallback();
					} catch (e) {
						pipelineCallback(e);
					}
				});
			});
			return writeStream;
		}
		delete(optionsOrCallback, cb) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			cb = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			this.disableAutoRetryConditionallyIdempotent_(this.methods.delete, bucket_js_1.AvailableServiceObjectMethods.delete, options);
			super.delete(options).then((resp) => cb(null, ...resp)).catch(cb).finally(() => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
			});
		}
		/**
		* @typedef {array} DownloadResponse
		* @property [0] The contents of a File.
		*/
		/**
		* @callback DownloadCallback
		* @param err Request error, if any.
		* @param contents The contents of a File.
		*/
		/**
		* Convenience method to download a file into memory or to a local
		* destination.
		*
		* @param {object} [options] Configuration options. The arguments match those
		*     passed to {@link File#createReadStream}.
		* @param {string} [options.destination] Local file path to write the file's
		*     contents to.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {DownloadCallback} [callback] Callback function.
		* @returns {Promise<DownloadResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* //-
		* // Download a file into memory. The contents will be available as the
		* second
		* // argument in the demonstration below, `contents`.
		* //-
		* file.download(function(err, contents) {});
		*
		* //-
		* // Download a file to a local destination.
		* //-
		* file.download({
		*   destination: '/Users/me/Desktop/file-backup.txt'
		* }, function(err) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.download().then(function(data) {
		*   const contents = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_download_file
		* Another example:
		*
		* @example <caption>include:samples/encryption.js</caption>
		* region_tag:storage_download_encrypted_file
		* Example of downloading an encrypted file:
		*
		* @example <caption>include:samples/requesterPays.js</caption>
		* region_tag:storage_download_file_requester_pays
		* Example of downloading a file where the requester pays:
		*/
		download(optionsOrCallback, cb) {
			let options;
			if (typeof optionsOrCallback === "function") {
				cb = optionsOrCallback;
				options = {};
			} else options = Object.assign({}, optionsOrCallback);
			let called = false;
			const callback = ((...args) => {
				if (!called) cb(...args);
				called = true;
			});
			const destination = options.destination;
			delete options.destination;
			if (options.encryptionKey) {
				this.setEncryptionKey(options.encryptionKey);
				delete options.encryptionKey;
			}
			const fileStream = this.createReadStream(options);
			let receivedData = false;
			if (destination) fileStream.on("error", callback).once("data", (data) => {
				receivedData = true;
				const writable = fs$1.createWriteStream(destination);
				writable.write(data);
				fileStream.pipe(writable).on("error", (err) => {
					callback(err, Buffer.from(""));
				}).on("finish", () => {
					callback(null, data);
				});
			}).on("end", () => {
				if (!receivedData) {
					const data = Buffer.alloc(0);
					try {
						fs$1.writeFileSync(destination, data);
						callback(null, data);
					} catch (e) {
						callback(e, data);
					}
				}
			});
			else this.getBufferFromReadable(fileStream).then((contents) => callback === null || callback === void 0 ? void 0 : callback(null, contents)).catch(callback);
		}
		/**
		* The Storage API allows you to use a custom key for server-side encryption.
		*
		* See {@link https://cloud.google.com/storage/docs/encryption#customer-supplied| Customer-supplied Encryption Keys}
		*
		* @param {string|buffer} encryptionKey An AES-256 encryption key.
		* @returns {File}
		*
		* @example
		* ```
		* const crypto = require('crypto');
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const encryptionKey = crypto.randomBytes(32);
		*
		* const fileWithCustomEncryption = myBucket.file('my-file');
		* fileWithCustomEncryption.setEncryptionKey(encryptionKey);
		*
		* const fileWithoutCustomEncryption = myBucket.file('my-file');
		*
		* fileWithCustomEncryption.save('data', function(err) {
		*   // Try to download with the File object that hasn't had
		*   // `setEncryptionKey()` called:
		*   fileWithoutCustomEncryption.download(function(err) {
		*     // We will receive an error:
		*     //   err.message === 'Bad Request'
		*
		*     // Try again with the File object we called `setEncryptionKey()` on:
		*     fileWithCustomEncryption.download(function(err, contents) {
		*       // contents.toString() === 'data'
		*     });
		*   });
		* });
		*
		* ```
		* @example <caption>include:samples/encryption.js</caption>
		* region_tag:storage_upload_encrypted_file
		* Example of uploading an encrypted file:
		*
		* @example <caption>include:samples/encryption.js</caption>
		* region_tag:storage_download_encrypted_file
		* Example of downloading an encrypted file:
		*/
		setEncryptionKey(encryptionKey) {
			this.encryptionKey = encryptionKey;
			this.encryptionKeyBase64 = Buffer.from(encryptionKey).toString("base64");
			this.encryptionKeyHash = crypto.createHash("sha256").update(this.encryptionKeyBase64, "base64").digest("base64");
			this.encryptionKeyInterceptor = { request: (reqOpts) => {
				reqOpts.headers = reqOpts.headers || {};
				reqOpts.headers["x-goog-encryption-algorithm"] = "AES256";
				reqOpts.headers["x-goog-encryption-key"] = this.encryptionKeyBase64;
				reqOpts.headers["x-goog-encryption-key-sha256"] = this.encryptionKeyHash;
				return reqOpts;
			} };
			this.interceptors.push(this.encryptionKeyInterceptor);
			return this;
		}
		/**
		* Gets a reference to a Cloud Storage {@link File} file from the provided URL in string format.
		* @param {string} publicUrlOrGsUrl the URL as a string. Must be of the format gs://bucket/file
		*  or https://storage.googleapis.com/bucket/file.
		* @param {Storage} storageInstance an instance of a Storage object.
		* @param {FileOptions} [options] Configuration options
		* @returns {File}
		*/
		static from(publicUrlOrGsUrl, storageInstance, options) {
			const gsMatches = [...publicUrlOrGsUrl.matchAll(GS_UTIL_URL_REGEX)];
			const httpsMatches = [...publicUrlOrGsUrl.matchAll(HTTPS_PUBLIC_URL_REGEX)];
			if (gsMatches.length > 0) return new File(new bucket_js_1.Bucket(storageInstance, gsMatches[0][2]), gsMatches[0][3], options);
			else if (httpsMatches.length > 0) return new File(new bucket_js_1.Bucket(storageInstance, httpsMatches[0][3]), httpsMatches[0][4], options);
			else throw new Error("URL string must be of format gs://bucket/file or https://storage.googleapis.com/bucket/file");
		}
		get(optionsOrCallback, cb) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			cb = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			super.get(options).then((resp) => cb(null, ...resp)).catch(cb);
		}
		/**
		* @typedef {array} GetExpirationDateResponse
		* @property {date} 0 A Date object representing the earliest time this file's
		*     retention policy will expire.
		*/
		/**
		* @callback GetExpirationDateCallback
		* @param {?Error} err Request error, if any.
		* @param {date} expirationDate A Date object representing the earliest time
		*     this file's retention policy will expire.
		*/
		/**
		* If this bucket has a retention policy defined, use this method to get a
		* Date object representing the earliest time this file will expire.
		*
		* @param {GetExpirationDateCallback} [callback] Callback function.
		* @returns {Promise<GetExpirationDateResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* file.getExpirationDate(function(err, expirationDate) {
		*   // expirationDate is a Date object.
		* });
		* ```
		*/
		getExpirationDate(callback) {
			this.getMetadata((err, metadata, apiResponse) => {
				if (err) {
					callback(err, null, apiResponse);
					return;
				}
				if (!metadata.retentionExpirationTime) {
					callback(new Error(FileExceptionMessages.EXPIRATION_TIME_NA), null, apiResponse);
					return;
				}
				callback(null, new Date(metadata.retentionExpirationTime), apiResponse);
			});
		}
		/**
		* @typedef {array} GenerateSignedPostPolicyV2Response
		* @property {object} 0 The document policy.
		*/
		/**
		* @callback GenerateSignedPostPolicyV2Callback
		* @param {?Error} err Request error, if any.
		* @param {object} policy The document policy.
		*/
		/**
		* Get a signed policy document to allow a user to upload data with a POST
		* request.
		*
		* In Google Cloud Platform environments, such as Cloud Functions and App
		* Engine, you usually don't provide a `keyFilename` or `credentials` during
		* instantiation. In those environments, we call the
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob| signBlob API}
		* to create a signed policy. That API requires either the
		* `https://www.googleapis.com/auth/iam` or
		* `https://www.googleapis.com/auth/cloud-platform` scope, so be sure they are
		* enabled.
		*
		* See {@link https://cloud.google.com/storage/docs/xml-api/post-object-v2| POST Object with the V2 signing process}
		*
		* @throws {Error} If an expiration timestamp from the past is given.
		* @throws {Error} If options.equals has an array with less or more than two
		*     members.
		* @throws {Error} If options.startsWith has an array with less or more than two
		*     members.
		*
		* @param {object} options Configuration options.
		* @param {array|array[]} [options.equals] Array of request parameters and
		*     their expected value (e.g. [['$<field>', '<value>']]). Values are
		*     translated into equality constraints in the conditions field of the
		*     policy document (e.g. ['eq', '$<field>', '<value>']). If only one
		*     equality condition is to be specified, options.equals can be a one-
		*     dimensional array (e.g. ['$<field>', '<value>']).
		* @param {*} options.expires - A timestamp when this policy will expire. Any
		*     value given is passed to `new Date()`.
		* @param {array|array[]} [options.startsWith] Array of request parameters and
		*     their expected prefixes (e.g. [['$<field>', '<value>']). Values are
		*     translated into starts-with constraints in the conditions field of the
		*     policy document (e.g. ['starts-with', '$<field>', '<value>']). If only
		*     one prefix condition is to be specified, options.startsWith can be a
		* one- dimensional array (e.g. ['$<field>', '<value>']).
		* @param {string} [options.acl] ACL for the object from possibly predefined
		*     ACLs.
		* @param {string} [options.successRedirect] The URL to which the user client
		*     is redirected if the upload is successful.
		* @param {string} [options.successStatus] - The status of the Google Storage
		*     response if the upload is successful (must be string).
		* @param {object} [options.contentLengthRange]
		* @param {number} [options.contentLengthRange.min] Minimum value for the
		*     request's content length.
		* @param {number} [options.contentLengthRange.max] Maximum value for the
		*     request's content length.
		* @param {GenerateSignedPostPolicyV2Callback} [callback] Callback function.
		* @returns {Promise<GenerateSignedPostPolicyV2Response>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* const options = {
		*   equals: ['$Content-Type', 'image/jpeg'],
		*   expires: '10-25-2022',
		*   contentLengthRange: {
		*     min: 0,
		*     max: 1024
		*   }
		* };
		*
		* file.generateSignedPostPolicyV2(options, function(err, policy) {
		*   // policy.string: the policy document in plain text.
		*   // policy.base64: the policy document in base64.
		*   // policy.signature: the policy signature in base64.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.generateSignedPostPolicyV2(options).then(function(data) {
		*   const policy = data[0];
		* });
		* ```
		*/
		generateSignedPostPolicyV2(optionsOrCallback, cb) {
			const args = (0, util_js_2.normalize)(optionsOrCallback, cb);
			let options = args.options;
			const callback = args.callback;
			const expires = new Date(options.expires);
			if (isNaN(expires.getTime())) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_INVALID);
			if (expires.valueOf() < Date.now()) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_PAST);
			options = Object.assign({}, options);
			const conditions = [[
				"eq",
				"$key",
				this.name
			], { bucket: this.bucket.name }];
			if (Array.isArray(options.equals)) {
				if (!Array.isArray(options.equals[0])) options.equals = [options.equals];
				options.equals.forEach((condition) => {
					if (!Array.isArray(condition) || condition.length !== 2) throw new Error(FileExceptionMessages.EQUALS_CONDITION_TWO_ELEMENTS);
					conditions.push([
						"eq",
						condition[0],
						condition[1]
					]);
				});
			}
			if (Array.isArray(options.startsWith)) {
				if (!Array.isArray(options.startsWith[0])) options.startsWith = [options.startsWith];
				options.startsWith.forEach((condition) => {
					if (!Array.isArray(condition) || condition.length !== 2) throw new Error(FileExceptionMessages.STARTS_WITH_TWO_ELEMENTS);
					conditions.push([
						"starts-with",
						condition[0],
						condition[1]
					]);
				});
			}
			if (options.acl) conditions.push({ acl: options.acl });
			if (options.successRedirect) conditions.push({ success_action_redirect: options.successRedirect });
			if (options.successStatus) conditions.push({ success_action_status: options.successStatus });
			if (options.contentLengthRange) {
				const min = options.contentLengthRange.min;
				const max = options.contentLengthRange.max;
				if (typeof min !== "number" || typeof max !== "number") throw new Error(FileExceptionMessages.CONTENT_LENGTH_RANGE_MIN_MAX);
				conditions.push([
					"content-length-range",
					min,
					max
				]);
			}
			const policy = {
				expiration: expires.toISOString(),
				conditions
			};
			const policyString = JSON.stringify(policy);
			const policyBase64 = Buffer.from(policyString).toString("base64");
			this.storage.authClient.sign(policyBase64, options.signingEndpoint).then((signature) => {
				callback(null, {
					string: policyString,
					base64: policyBase64,
					signature
				});
			}, (err) => {
				callback(new signer_js_1.SigningError(err.message));
			});
		}
		/**
		* @typedef {object} SignedPostPolicyV4Output
		* @property {string} url The request URL.
		* @property {object} fields The form fields to include in the POST request.
		*/
		/**
		* @typedef {array} GenerateSignedPostPolicyV4Response
		* @property {SignedPostPolicyV4Output} 0 An object containing the request URL and form fields.
		*/
		/**
		* @callback GenerateSignedPostPolicyV4Callback
		* @param {?Error} err Request error, if any.
		* @param {SignedPostPolicyV4Output} output An object containing the request URL and form fields.
		*/
		/**
		* Get a v4 signed policy document to allow a user to upload data with a POST
		* request.
		*
		* In Google Cloud Platform environments, such as Cloud Functions and App
		* Engine, you usually don't provide a `keyFilename` or `credentials` during
		* instantiation. In those environments, we call the
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob| signBlob API}
		* to create a signed policy. That API requires either the
		* `https://www.googleapis.com/auth/iam` or
		* `https://www.googleapis.com/auth/cloud-platform` scope, so be sure they are
		* enabled.
		*
		* See {@link https://cloud.google.com/storage/docs/xml-api/post-object#policydocument| Policy Document Reference}
		*
		* @param {object} options Configuration options.
		* @param {Date|number|string} options.expires - A timestamp when this policy will expire. Any
		*     value given is passed to `new Date()`.
		* @param {boolean} [config.virtualHostedStyle=false] Use virtual hosted-style
		*     URLs ('https://mybucket.storage.googleapis.com/...') instead of path-style
		*     ('https://storage.googleapis.com/mybucket/...'). Virtual hosted-style URLs
		*     should generally be preferred instead of path-style URL.
		*     Currently defaults to `false` for path-style, although this may change in a
		*     future major-version release.
		* @param {string} [config.bucketBoundHostname] The bucket-bound hostname to return in
		*     the result, e.g. "https://cdn.example.com".
		* @param {object} [config.fields] [Form fields]{@link https://cloud.google.com/storage/docs/xml-api/post-object#policydocument}
		*     to include in the signed policy. Any fields with key beginning with 'x-ignore-'
		*     will not be included in the policy to be signed.
		* @param {object[]} [config.conditions] [Conditions]{@link https://cloud.google.com/storage/docs/authentication/signatures#policy-document}
		*     to include in the signed policy. All fields given in `config.fields` are
		*     automatically included in the conditions array, adding the same entry
		*     in both `fields` and `conditions` will result in duplicate entries.
		*
		* @param {GenerateSignedPostPolicyV4Callback} [callback] Callback function.
		* @returns {Promise<GenerateSignedPostPolicyV4Response>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* const options = {
		*   expires: '10-25-2022',
		*   conditions: [
		*     ['eq', '$Content-Type', 'image/jpeg'],
		*     ['content-length-range', 0, 1024],
		*   ],
		*   fields: {
		*     acl: 'public-read',
		*     'x-goog-meta-foo': 'bar',
		*     'x-ignore-mykey': 'data'
		*   }
		* };
		*
		* file.generateSignedPostPolicyV4(options, function(err, response) {
		*   // response.url The request URL
		*   // response.fields The form fields (including the signature) to include
		*   //     to be used to upload objects by HTML forms.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.generateSignedPostPolicyV4(options).then(function(data) {
		*   const response = data[0];
		*   // response.url The request URL
		*   // response.fields The form fields (including the signature) to include
		*   //     to be used to upload objects by HTML forms.
		* });
		* ```
		*/
		generateSignedPostPolicyV4(optionsOrCallback, cb) {
			const args = (0, util_js_2.normalize)(optionsOrCallback, cb);
			let options = args.options;
			const callback = args.callback;
			const expires = new Date(options.expires);
			if (isNaN(expires.getTime())) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_INVALID);
			if (expires.valueOf() < Date.now()) throw new Error(storage_js_1.ExceptionMessages.EXPIRATION_DATE_PAST);
			if (expires.valueOf() - Date.now() > SEVEN_DAYS * 1e3) throw new Error(`Max allowed expiration is seven days (${SEVEN_DAYS} seconds).`);
			options = Object.assign({}, options);
			let fields = Object.assign({}, options.fields);
			const now = /* @__PURE__ */ new Date();
			const nowISO = (0, util_js_2.formatAsUTCISO)(now, true);
			const todayISO = (0, util_js_2.formatAsUTCISO)(now);
			const sign = async () => {
				const { client_email } = await this.storage.authClient.getCredentials();
				const credential = `${client_email}/${todayISO}/auto/storage/goog4_request`;
				fields = {
					...fields,
					bucket: this.bucket.name,
					key: this.name,
					"x-goog-date": nowISO,
					"x-goog-credential": credential,
					"x-goog-algorithm": "GOOG4-RSA-SHA256"
				};
				const conditions = options.conditions || [];
				Object.entries(fields).forEach(([key, value]) => {
					if (!key.startsWith("x-ignore-")) conditions.push({ [key]: value });
				});
				delete fields.bucket;
				const policy = {
					conditions,
					expiration: (0, util_js_2.formatAsUTCISO)(expires, true, "-", ":")
				};
				const policyString = (0, util_js_2.unicodeJSONStringify)(policy);
				const policyBase64 = Buffer.from(policyString).toString("base64");
				try {
					const signature = await this.storage.authClient.sign(policyBase64, options.signingEndpoint);
					const signatureHex = Buffer.from(signature, "base64").toString("hex");
					const universe = this.parent.storage.universeDomain;
					fields["policy"] = policyBase64;
					fields["x-goog-signature"] = signatureHex;
					let url;
					if (this.storage.customEndpoint) url = this.storage.apiEndpoint;
					else if (options.virtualHostedStyle) url = `https://${this.bucket.name}.storage.${universe}/`;
					else if (options.bucketBoundHostname) url = `${options.bucketBoundHostname}/`;
					else url = `https://storage.${universe}/${this.bucket.name}/`;
					return {
						url,
						fields
					};
				} catch (err) {
					throw new signer_js_1.SigningError(err.message);
				}
			};
			sign().then((res) => callback(null, res), callback);
		}
		/**
		* @typedef {array} GetSignedUrlResponse
		* @property {object} 0 The signed URL.
		*/
		/**
		* @callback GetSignedUrlCallback
		* @param {?Error} err Request error, if any.
		* @param {object} url The signed URL.
		*/
		/**
		* Get a signed URL to allow limited time access to the file.
		*
		* In Google Cloud Platform environments, such as Cloud Functions and App
		* Engine, you usually don't provide a `keyFilename` or `credentials` during
		* instantiation. In those environments, we call the
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob| signBlob API}
		* to create a signed URL. That API requires either the
		* `https://www.googleapis.com/auth/iam` or
		* `https://www.googleapis.com/auth/cloud-platform` scope, so be sure they are
		* enabled.
		*
		* See {@link https://cloud.google.com/storage/docs/access-control/signed-urls| Signed URLs Reference}
		*
		* @throws {Error} if an expiration timestamp from the past is given.
		*
		* @param {object} config Configuration object.
		* @param {string} config.action "read" (HTTP: GET), "write" (HTTP: PUT), or
		*     "delete" (HTTP: DELETE), "resumable" (HTTP: POST).
		*     When using "resumable", the header `X-Goog-Resumable: start` has
		*     to be sent when making a request with the signed URL.
		* @param {*} config.expires A timestamp when this link will expire. Any value
		*     given is passed to `new Date()`.
		*     Note: 'v4' supports maximum duration of 7 days (604800 seconds) from now.
		*     See [reference]{@link https://cloud.google.com/storage/docs/access-control/signed-urls#example}
		* @param {string} [config.version='v2'] The signing version to use, either
		*     'v2' or 'v4'.
		* @param {boolean} [config.virtualHostedStyle=false] Use virtual hosted-style
		*     URLs (e.g. 'https://mybucket.storage.googleapis.com/...') instead of path-style
		*     (e.g. 'https://storage.googleapis.com/mybucket/...'). Virtual hosted-style URLs
		*     should generally be preferred instead of path-style URL.
		*     Currently defaults to `false` for path-style, although this may change in a
		*     future major-version release.
		* @param {string} [config.cname] The cname for this bucket, i.e.,
		*     "https://cdn.example.com".
		* @param {string} [config.contentMd5] The MD5 digest value in base64. Just like
		*     if you provide this, the client must provide this HTTP header with this same
		*     value in its request, so to if this parameter is not provided here,
		*     the client must not provide any value for this HTTP header in its request.
		* @param {string} [config.contentType] Just like if you provide this, the client
		*     must provide this HTTP header with this same value in its request, so to if
		*     this parameter is not provided here, the client must not provide any value
		*     for this HTTP header in its request.
		* @param {object} [config.extensionHeaders] If these headers are used, the
		* server will check to make sure that the client provides matching
		* values. See {@link https://cloud.google.com/storage/docs/access-control/signed-urls#about-canonical-extension-headers| Canonical extension headers}
		* for the requirements of this feature, most notably:
		* - The header name must be prefixed with `x-goog-`
		* - The header name must be all lowercase
		*
		* Note: Multi-valued header passed as an array in the extensionHeaders
		*       object is converted into a string, delimited by `,` with
		*       no space. Requests made using the signed URL will need to
		*       delimit multi-valued headers using a single `,` as well, or
		*       else the server will report a mismatched signature.
		* @param {object} [config.queryParams] Additional query parameters to include
		*     in the signed URL.
		* @param {string} [config.promptSaveAs] The filename to prompt the user to
		*     save the file as when the signed url is accessed. This is ignored if
		*     `config.responseDisposition` is set.
		* @param {string} [config.responseDisposition] The
		*     {@link http://goo.gl/yMWxQV| response-content-disposition parameter} of the
		*     signed url.
		* @param {*} [config.accessibleAt=Date.now()] A timestamp when this link became usable. Any value
		*     given is passed to `new Date()`.
		*     Note: Use for 'v4' only.
		* @param {string} [config.responseType] The response-content-type parameter
		*     of the signed url.
		* @param {GetSignedUrlCallback} [callback] Callback function.
		* @returns {Promise<GetSignedUrlResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* //-
		* // Generate a URL that allows temporary access to download your file.
		* //-
		* const request = require('request');
		*
		* const config = {
		*   action: 'read',
		*   expires: '03-17-2025',
		* };
		*
		* file.getSignedUrl(config, function(err, url) {
		*   if (err) {
		*     console.error(err);
		*     return;
		*   }
		*
		*   // The file is now available to read from this URL.
		*   request(url, function(err, resp) {
		*     // resp.statusCode = 200
		*   });
		* });
		*
		* //-
		* // Generate a URL that allows temporary access to download your file.
		* // Access will begin at accessibleAt and end at expires.
		* //-
		* const request = require('request');
		*
		* const config = {
		*   action: 'read',
		*   expires: '03-17-2025',
		*   accessibleAt: '03-13-2025'
		* };
		*
		* file.getSignedUrl(config, function(err, url) {
		*   if (err) {
		*     console.error(err);
		*     return;
		*   }
		*
		*   // The file will be available to read from this URL from 03-13-2025 to 03-17-2025.
		*   request(url, function(err, resp) {
		*     // resp.statusCode = 200
		*   });
		* });
		*
		* //-
		* // Generate a URL to allow write permissions. This means anyone with this
		* URL
		* // can send a POST request with new data that will overwrite the file.
		* //-
		* file.getSignedUrl({
		*   action: 'write',
		*   expires: '03-17-2025'
		* }, function(err, url) {
		*   if (err) {
		*     console.error(err);
		*     return;
		*   }
		*
		*   // The file is now available to be written to.
		*   const writeStream = request.put(url);
		*   writeStream.end('New data');
		*
		*   writeStream.on('complete', function(resp) {
		*     // Confirm the new content was saved.
		*     file.download(function(err, fileContents) {
		*       console.log('Contents:', fileContents.toString());
		*       // Contents: New data
		*     });
		*   });
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.getSignedUrl(config).then(function(data) {
		*   const url = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_generate_signed_url
		* Another example:
		*/
		getSignedUrl(cfg, callback) {
			const method = ActionToHTTPMethod[cfg.action];
			const extensionHeaders = (0, util_js_2.objectKeyToLowercase)(cfg.extensionHeaders || {});
			if (cfg.action === "resumable") extensionHeaders["x-goog-resumable"] = "start";
			const queryParams = Object.assign({}, cfg.queryParams);
			if (typeof cfg.responseType === "string") queryParams["response-content-type"] = cfg.responseType;
			if (typeof cfg.promptSaveAs === "string") queryParams["response-content-disposition"] = "attachment; filename=\"" + cfg.promptSaveAs + "\"";
			if (typeof cfg.responseDisposition === "string") queryParams["response-content-disposition"] = cfg.responseDisposition;
			if (this.generation) queryParams["generation"] = this.generation.toString();
			const signConfig = {
				method,
				expires: cfg.expires,
				accessibleAt: cfg.accessibleAt,
				extensionHeaders,
				queryParams,
				contentMd5: cfg.contentMd5,
				contentType: cfg.contentType,
				host: cfg.host
			};
			if (cfg.cname) signConfig.cname = cfg.cname;
			if (cfg.version) signConfig.version = cfg.version;
			if (cfg.virtualHostedStyle) signConfig.virtualHostedStyle = cfg.virtualHostedStyle;
			if (!this.signer) this.signer = new signer_js_1.URLSigner(this.storage.authClient, this.bucket, this, this.storage);
			this.signer.getSignedUrl(signConfig).then((signedUrl) => callback(null, signedUrl), callback);
		}
		/**
		* @callback IsPublicCallback
		* @param {?Error} err Request error, if any.
		* @param {boolean} resp Whether file is public or not.
		*/
		/**
		* @typedef {array} IsPublicResponse
		* @property {boolean} 0 Whether file is public or not.
		*/
		/**
		* Check whether this file is public or not by sending
		* a HEAD request without credentials.
		* No errors from the server indicates that the current
		* file is public.
		* A 403-Forbidden error {@link https://cloud.google.com/storage/docs/json_api/v1/status-codes#403_Forbidden}
		* indicates that file is private.
		* Any other non 403 error is propagated to user.
		*
		* @param {IsPublicCallback} [callback] Callback function.
		* @returns {Promise<IsPublicResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* //-
		* // Check whether the file is publicly accessible.
		* //-
		* file.isPublic(function(err, resp) {
		*   if (err) {
		*     console.error(err);
		*     return;
		*   }
		*   console.log(`the file ${file.id} is public: ${resp}`) ;
		* })
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.isPublic().then(function(data) {
		*   const resp = data[0];
		* });
		* ```
		*/
		isPublic(callback) {
			var _a;
			const storageInterceptors = ((_a = this.storage) === null || _a === void 0 ? void 0 : _a.interceptors) || [];
			const fileInterceptors = this.interceptors || [];
			const headers = storageInterceptors.concat(fileInterceptors).reduce((acc, curInterceptor) => {
				const currentHeaders = curInterceptor.request({ uri: `${this.storage.apiEndpoint}/${this.bucket.name}/${encodeURIComponent(this.name)}` });
				Object.assign(acc, currentHeaders.headers);
				return acc;
			}, {});
			index_js_1.util.makeRequest({
				method: "GET",
				uri: `${this.storage.apiEndpoint}/${this.bucket.name}/${encodeURIComponent(this.name)}`,
				headers
			}, { retryOptions: this.storage.retryOptions }, (err) => {
				if (err) if (err.code === 403) callback(null, false);
				else callback(err);
				else callback(null, true);
			});
		}
		/**
		* @typedef {object} MakeFilePrivateOptions Configuration options for File#makePrivate().
		* @property {Metadata} [metadata] Define custom metadata properties to define
		*     along with the operation.
		* @property {boolean} [strict] If true, set the file to be private to
		*     only the owner user. Otherwise, it will be private to the project.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback MakeFilePrivateCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {array} MakeFilePrivateResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* Make a file private to the project and remove all other permissions.
		* Set `options.strict` to true to make the file private to only the owner.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/patch| Objects: patch API Documentation}
		*
		* @param {MakeFilePrivateOptions} [options] Configuration options.
		* @param {MakeFilePrivateCallback} [callback] Callback function.
		* @returns {Promise<MakeFilePrivateResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* //-
		* // Set the file private so only project maintainers can see and modify it.
		* //-
		* file.makePrivate(function(err) {});
		*
		* //-
		* // Set the file private so only the owner can see and modify it.
		* //-
		* file.makePrivate({ strict: true }, function(err) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.makePrivate().then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		makePrivate(optionsOrCallback, callback) {
			var _a, _b;
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const query = { predefinedAcl: options.strict ? "private" : "projectPrivate" };
			if (((_a = options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifMetagenerationMatch) !== void 0) {
				query.ifMetagenerationMatch = (_b = options.preconditionOpts) === null || _b === void 0 ? void 0 : _b.ifMetagenerationMatch;
				delete options.preconditionOpts;
			}
			if (options.userProject) query.userProject = options.userProject;
			const metadata = {
				...options.metadata,
				acl: null
			};
			this.setMetadata(metadata, query, callback);
		}
		/**
		* @typedef {array} MakeFilePublicResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @callback MakeFilePublicCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Set a file to be publicly readable and maintain all previous permissions.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objectAccessControls/insert| ObjectAccessControls: insert API Documentation}
		*
		* @param {MakeFilePublicCallback} [callback] Callback function.
		* @returns {Promise<MakeFilePublicResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		*
		* file.makePublic(function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.makePublic().then(function(data) {
		*   const apiResponse = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_make_public
		* Another example:
		*/
		makePublic(callback) {
			callback = callback || index_js_1.util.noop;
			this.acl.add({
				entity: "allUsers",
				role: "READER"
			}, (err, acl, resp) => {
				callback(err, resp);
			});
		}
		/**
		* The public URL of this File
		* Use {@link File#makePublic} to enable anonymous access via the returned URL.
		*
		* @returns {string}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		* const file = bucket.file('my-file');
		*
		* // publicUrl will be "https://storage.googleapis.com/albums/my-file"
		* const publicUrl = file.publicUrl();
		* ```
		*/
		publicUrl() {
			return `${this.storage.apiEndpoint}/${this.bucket.name}/${encodeURIComponent(this.name)}`;
		}
		/**
		* @typedef {array} MoveFileAtomicResponse
		* @property {File} 0 The moved {@link File}.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback MoveFileAtomicCallback
		* @param {?Error} err Request error, if any.
		* @param {File} movedFile The moved {@link File}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {object} MoveFileAtomicOptions Configuration options for File#moveFileAtomic(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects#resource| Object resource}.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {object} [preconditionOpts] Precondition options.
		* @property {number} [preconditionOpts.ifGenerationMatch] Makes the operation conditional on whether the object's current generation matches the given value.
		*/
		/**
		* Move this file within the same bucket.
		* The source object must exist and be a live object.
		* The source and destination object IDs must be different.
		* Overwriting the destination object is allowed by default, but can be prevented
		* using preconditions.
		* If the destination path includes non-existent parent folders, they will be created.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/move| Objects: move API Documentation}
		*
		* @throws {Error} If the destination file is not provided.
		*
		* @param {string|File} destination Destination file name or File object within the same bucket..
		* @param {MoveFileAtomicOptions} [options] Configuration options. See an
		* @param {MoveFileAtomicCallback} [callback] Callback function.
		* @returns {Promise<MoveFileAtomicResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		*
		* //-
		* // Assume 'my-bucket' is a bucket.
		* //-
		* const bucket = storage.bucket('my-bucket');
		* const file = bucket.file('my-image.png');
		*
		* //-
		* // If you pass in a string for the destination, the file is copied to its
		* // current bucket, under the new name provided.
		* //-
		* file.moveFileAtomic('moved-image.png', function(err, movedFile, apiResponse) {
		*   // `my-bucket` now contains:
		*   // - "moved-image.png"
		*
		*   // `movedFile` is an instance of a File object that refers to your new
		*   // file.
		* });
		*
		* //-
		* // Move the file to a subdirectory, creating parent folders if necessary.
		* //-
		* file.moveFileAtomic('new-folder/subfolder/moved-image.png', function(err, movedFile, apiResponse) {
		* // `my-bucket` now contains:
		* // - "new-folder/subfolder/moved-image.png"
		* });
		*
		* //-
		* // Prevent overwriting an existing destination object using preconditions.
		* //-
		* file.moveFileAtomic('existing-destination.png', {
		* preconditionOpts: {
		* ifGenerationMatch: 0 // Fails if the destination object exists.
		* }
		* }, function(err, movedFile, apiResponse) {
		* if (err) {
		* // Handle the error (e.g., the destination object already exists).
		* } else {
		* // Move successful.
		* }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.moveFileAtomic('moved-image.png).then(function(data) {
		*   const newFile = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_move_file
		* Another example:
		*/
		moveFileAtomic(destination, optionsOrCallback, callback) {
			var _a, _b;
			const noDestinationError = new Error(FileExceptionMessages.DESTINATION_NO_NAME);
			if (!destination) throw noDestinationError;
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = { ...optionsOrCallback };
			callback = callback || index_js_1.util.noop;
			let destName;
			let newFile;
			if (typeof destination === "string") {
				const parsedDestination = GS_URL_REGEXP.exec(destination);
				if (parsedDestination !== null && parsedDestination.length === 3) destName = parsedDestination[2];
				else destName = destination;
			} else if (destination instanceof File) {
				destName = destination.name;
				newFile = destination;
			} else throw noDestinationError;
			newFile = newFile || this.bucket.file(destName);
			if (!this.shouldRetryBasedOnPreconditionAndIdempotencyStrat(options === null || options === void 0 ? void 0 : options.preconditionOpts)) this.storage.retryOptions.autoRetry = false;
			const query = {};
			if (options.userProject !== void 0) {
				query.userProject = options.userProject;
				delete options.userProject;
			}
			if (((_a = options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) !== void 0) {
				query.ifGenerationMatch = (_b = options.preconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationMatch;
				delete options.preconditionOpts;
			}
			this.request({
				method: "POST",
				uri: `/moveTo/o/${encodeURIComponent(newFile.name)}`,
				qs: query,
				json: options
			}, (err, resp) => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
				if (err) {
					callback(err, null, resp);
					return;
				}
				callback(null, newFile, resp);
			});
		}
		/**
		* @typedef {array} MoveResponse
		* @property {File} 0 The destination File.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback MoveCallback
		* @param {?Error} err Request error, if any.
		* @param {?File} destinationFile The destination File.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {object} MoveOptions Configuration options for File#move(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects#resource| Object resource}.
		* @param {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* Move this file to another location. By default, this will rename the file
		* and keep it in the same bucket, but you can choose to move it to another
		* Bucket by providing a Bucket or File object or a URL beginning with
		* "gs://".
		*
		* **Warning**:
		* There is currently no atomic `move` method in the Cloud Storage API,
		* so this method is a composition of {@link File#copy} (to the new
		* location) and {@link File#delete} (from the old location). While
		* unlikely, it is possible that an error returned to your callback could be
		* triggered from either one of these API calls failing, which could leave a
		* duplicate file lingering. The error message will indicate what operation
		* has failed.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/copy| Objects: copy API Documentation}
		*
		* @throws {Error} If the destination file is not provided.
		*
		* @param {string|Bucket|File} destination Destination file.
		* @param {MoveCallback} [callback] Callback function.
		* @returns {Promise<MoveResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* //-
		* // You can pass in a variety of types for the destination.
		* //
		* // For all of the below examples, assume we are working with the following
		* // Bucket and File objects.
		* //-
		* const bucket = storage.bucket('my-bucket');
		* const file = bucket.file('my-image.png');
		*
		* //-
		* // If you pass in a string for the destination, the file is moved to its
		* // current bucket, under the new name provided.
		* //-
		* file.move('my-image-new.png', function(err, destinationFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*   // but contains instead:
		*   // - "my-image-new.png"
		*
		*   // `destinationFile` is an instance of a File object that refers to your
		*   // new file.
		* });
		*
		* //-
		* // If you pass in a string starting with "gs://" for the destination, the
		* // file is copied to the other bucket and under the new name provided.
		* //-
		* const newLocation = 'gs://another-bucket/my-image-new.png';
		* file.move(newLocation, function(err, destinationFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-image-new.png"
		*
		*   // `destinationFile` is an instance of a File object that refers to your
		*   // new file.
		* });
		*
		* //-
		* // If you pass in a Bucket object, the file will be moved to that bucket
		* // using the same name.
		* //-
		* const anotherBucket = gcs.bucket('another-bucket');
		*
		* file.move(anotherBucket, function(err, destinationFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-image.png"
		*
		*   // `destinationFile` is an instance of a File object that refers to your
		*   // new file.
		* });
		*
		* //-
		* // If you pass in a File object, you have complete control over the new
		* // bucket and filename.
		* //-
		* const anotherFile = anotherBucket.file('my-awesome-image.png');
		*
		* file.move(anotherFile, function(err, destinationFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*   //
		*   // `another-bucket` now contains:
		*   // - "my-awesome-image.png"
		*
		*   // Note:
		*   // The `destinationFile` parameter is equal to `anotherFile`.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.move('my-image-new.png').then(function(data) {
		*   const destinationFile = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_move_file
		* Another example:
		*/
		move(destination, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			callback = callback || index_js_1.util.noop;
			this.copy(destination, options, (err, destinationFile, copyApiResponse) => {
				if (err) {
					err.message = "file#copy failed with an error - " + err.message;
					callback(err, null, copyApiResponse);
					return;
				}
				if (this.name !== destinationFile.name || this.bucket.name !== destinationFile.bucket.name) this.delete(options, (err, apiResponse) => {
					if (err) {
						err.message = "file#delete failed with an error - " + err.message;
						callback(err, destinationFile, apiResponse);
						return;
					}
					callback(null, destinationFile, copyApiResponse);
				});
				else callback(null, destinationFile, copyApiResponse);
			});
		}
		/**
		* @typedef {array} RenameResponse
		* @property {File} 0 The destination File.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback RenameCallback
		* @param {?Error} err Request error, if any.
		* @param {?File} destinationFile The destination File.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {object} RenameOptions Configuration options for File#move(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects#resource| Object resource}.
		* @param {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* Rename this file.
		*
		* **Warning**:
		* There is currently no atomic `rename` method in the Cloud Storage API,
		* so this method is an alias of {@link File#move}, which in turn is a
		* composition of {@link File#copy} (to the new location) and
		* {@link File#delete} (from the old location). While
		* unlikely, it is possible that an error returned to your callback could be
		* triggered from either one of these API calls failing, which could leave a
		* duplicate file lingering. The error message will indicate what operation
		* has failed.
		*
		* @param {string|File} destinationFile Destination file.
		* @param {RenameCallback} [callback] Callback function.
		* @returns {Promise<RenameResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		*
		* //-
		* // You can pass in a string or a File object.
		* //
		* // For all of the below examples, assume we are working with the following
		* // Bucket and File objects.
		* //-
		*
		* const bucket = storage.bucket('my-bucket');
		* const file = bucket.file('my-image.png');
		*
		* //-
		* // You can pass in a string for the destinationFile.
		* //-
		* file.rename('renamed-image.png', function(err, renamedFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*   // but contains instead:
		*   // - "renamed-image.png"
		*
		*   // `renamedFile` is an instance of a File object that refers to your
		*   // renamed file.
		* });
		*
		* //-
		* // You can pass in a File object.
		* //-
		* const anotherFile = anotherBucket.file('my-awesome-image.png');
		*
		* file.rename(anotherFile, function(err, renamedFile, apiResponse) {
		*   // `my-bucket` no longer contains:
		*   // - "my-image.png"
		*
		*   // Note:
		*   // The `renamedFile` parameter is equal to `anotherFile`.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.rename('my-renamed-image.png').then(function(data) {
		*   const renamedFile = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		rename(destinationFile, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			callback = callback || index_js_1.util.noop;
			this.move(destinationFile, options, callback);
		}
		/**
		* @typedef {object} RestoreOptions Options for File#restore(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects#resource| Object resource}.
		* @param {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @param {number} [generation] If present, selects a specific revision of this object.
		* @param {string} [restoreToken] Returns an option that must be specified when getting a soft-deleted object from an HNS-enabled
		*  bucket that has a naming and generation conflict with another object in the same bucket.
		* @param {string} [projection] Specifies the set of properties to return. If used, must be 'full' or 'noAcl'.
		* @param {string | number} [ifGenerationMatch] Request proceeds if the generation of the target resource
		*  matches the value used in the precondition.
		*  If the values don't match, the request fails with a 412 Precondition Failed response.
		* @param {string | number} [ifGenerationNotMatch] Request proceeds if the generation of the target resource does
		*  not match the value used in the precondition. If the values match, the request fails with a 304 Not Modified response.
		* @param {string | number} [ifMetagenerationMatch] Request proceeds if the meta-generation of the target resource
		*  matches the value used in the precondition.
		*  If the values don't match, the request fails with a 412 Precondition Failed response.
		* @param {string | number} [ifMetagenerationNotMatch]  Request proceeds if the meta-generation of the target resource does
		*  not match the value used in the precondition. If the values match, the request fails with a 304 Not Modified response.
		*/
		/**
		* Restores a soft-deleted file
		* @param {RestoreOptions} options Restore options.
		* @returns {Promise<File>}
		*/
		async restore(options) {
			const [file] = await this.request({
				method: "POST",
				uri: "/restore",
				qs: options
			});
			return file;
		}
		/**
		* Makes request and applies userProject query parameter if necessary.
		*
		* @private
		*
		* @param {object} reqOpts - The request options.
		* @param {function} callback - The callback function.
		*/
		request(reqOpts, callback) {
			return this.parent.request.call(this, reqOpts, callback);
		}
		/**
		* @callback RotateEncryptionKeyCallback
		* @extends CopyCallback
		*/
		/**
		* @typedef RotateEncryptionKeyResponse
		* @extends CopyResponse
		*/
		/**
		* @param {string|buffer|object} RotateEncryptionKeyOptions Configuration options
		*     for File#rotateEncryptionKey().
		* If a string or Buffer is provided, it is interpreted as an AES-256,
		* customer-supplied encryption key. If you'd like to use a Cloud KMS key
		* name, you must specify an options object with the property name:
		* `kmsKeyName`.
		* @param {string|buffer} [options.encryptionKey] An AES-256 encryption key.
		* @param {string} [options.kmsKeyName] A Cloud KMS key name.
		*/
		/**
		* This method allows you to update the encryption key associated with this
		* file.
		*
		* See {@link https://cloud.google.com/storage/docs/encryption#customer-supplied| Customer-supplied Encryption Keys}
		*
		* @param {RotateEncryptionKeyOptions} [options] - Configuration options.
		* @param {RotateEncryptionKeyCallback} [callback]
		* @returns {Promise<File>}
		*
		* @example <caption>include:samples/encryption.js</caption>
		* region_tag:storage_rotate_encryption_key
		* Example of rotating the encryption key for this file:
		*/
		rotateEncryptionKey(optionsOrCallback, callback) {
			var _a;
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			let options = {};
			if (typeof optionsOrCallback === "string" || optionsOrCallback instanceof Buffer) options = { encryptionKey: optionsOrCallback };
			else if (typeof optionsOrCallback === "object") options = optionsOrCallback;
			const newFile = this.bucket.file(this.id, options);
			const copyOptions = ((_a = options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) !== void 0 ? { preconditionOpts: options.preconditionOpts } : {};
			this.copy(newFile, copyOptions, callback);
		}
		/**
		* @typedef {object} SaveOptions
		* @extends CreateWriteStreamOptions
		*/
		/**
		* @callback SaveCallback
		* @param {?Error} err Request error, if any.
		*/
		/**
		* Write strings or buffers to a file.
		*
		* *This is a convenience method which wraps {@link File#createWriteStream}.*
		* To upload arbitrary data to a file, please use {@link File#createWriteStream} directly.
		*
		* Resumable uploads are automatically enabled and must be shut off explicitly
		* by setting `options.resumable` to `false`.
		*
		* Multipart uploads with retryable error codes will be retried 3 times with exponential backoff.
		*
		* <p class="notice">
		*   There is some overhead when using a resumable upload that can cause
		*   noticeable performance degradation while uploading a series of small
		* files. When uploading files less than 10MB, it is recommended that the
		* resumable feature is disabled.
		* </p>
		*
		* @param {SaveData} data The data to write to a file.
		* @param {SaveOptions} [options] See {@link File#createWriteStream}'s `options`
		*     parameter.
		* @param {SaveCallback} [callback] Callback function.
		* @returns {Promise}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const file = myBucket.file('my-file');
		* const contents = 'This is the contents of the file.';
		*
		* file.save(contents, function(err) {
		*   if (!err) {
		*     // File written successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.save(contents).then(function() {});
		* ```
		*/
		save(data, optionsOrCallback, callback) {
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			let maxRetries = this.storage.retryOptions.maxRetries;
			if (!this.shouldRetryBasedOnPreconditionAndIdempotencyStrat(options === null || options === void 0 ? void 0 : options.preconditionOpts)) maxRetries = 0;
			const returnValue = (0, async_retry_1.default)(async (bail) => {
				return new Promise((resolve, reject) => {
					if (maxRetries === 0) this.storage.retryOptions.autoRetry = false;
					const writable = this.createWriteStream(options);
					if (options.onUploadProgress) writable.on("progress", options.onUploadProgress);
					const handleError = (err) => {
						if (this.storage.retryOptions.autoRetry && this.storage.retryOptions.retryableErrorFn(err)) return reject(err);
						return bail(err);
					};
					if (typeof data === "string" || Buffer.isBuffer(data) || data instanceof Uint8Array) writable.on("error", handleError).on("finish", () => resolve()).end(data);
					else (0, stream_1$2.pipeline)(data, writable, (err) => {
						if (err) {
							if (typeof data !== "function") return bail(err);
							handleError(err);
						} else resolve();
					});
				});
			}, {
				retries: maxRetries,
				factor: this.storage.retryOptions.retryDelayMultiplier,
				maxTimeout: this.storage.retryOptions.maxRetryDelay * 1e3,
				maxRetryTime: this.storage.retryOptions.totalTimeout * 1e3
			});
			if (!callback) return returnValue;
			else return returnValue.then(() => {
				if (callback) return callback();
			}).catch(callback);
		}
		setMetadata(metadata, optionsOrCallback, cb) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			cb = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			this.disableAutoRetryConditionallyIdempotent_(this.methods.setMetadata, bucket_js_1.AvailableServiceObjectMethods.setMetadata, options);
			super.setMetadata(metadata, options).then((resp) => cb(null, ...resp)).catch(cb).finally(() => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
			});
		}
		/**
		* @typedef {array} SetStorageClassResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @typedef {object} SetStorageClassOptions Configuration options for File#setStorageClass().
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback SetStorageClassCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Set the storage class for this file.
		*
		* See {@link https://cloud.google.com/storage/docs/per-object-storage-class| Per-Object Storage Class}
		* See {@link https://cloud.google.com/storage/docs/storage-classes| Storage Classes}
		*
		* @param {string} storageClass The new storage class. (`standard`,
		*     `nearline`, `coldline`, or `archive`)
		*     **Note:** The storage classes `multi_regional` and `regional`
		*     are now legacy and will be deprecated in the future.
		* @param {SetStorageClassOptions} [options] Configuration options.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {SetStorageClassCallback} [callback] Callback function.
		* @returns {Promise<SetStorageClassResponse>}
		*
		* @example
		* ```
		* file.setStorageClass('nearline', function(err, apiResponse) {
		*   if (err) {
		*     // Error handling omitted.
		*   }
		*
		*   // The storage class was updated successfully.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* file.setStorageClass('nearline').then(function() {});
		* ```
		*/
		setStorageClass(storageClass, optionsOrCallback, callback) {
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const req = {
				...typeof optionsOrCallback === "object" ? optionsOrCallback : {},
				storageClass: storageClass.replace(/-/g, "_").replace(/([a-z])([A-Z])/g, (_, low, up) => {
					return low + "_" + up;
				}).toUpperCase()
			};
			this.copy(this, req, (err, file, apiResponse) => {
				if (err) {
					callback(err, apiResponse);
					return;
				}
				this.metadata = file.metadata;
				callback(null, apiResponse);
			});
		}
		/**
		* Set a user project to be billed for all requests made from this File
		* object.
		*
		* @param {string} userProject The user project.
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		* const file = bucket.file('my-file');
		*
		* file.setUserProject('grape-spaceship-123');
		* ```
		*/
		setUserProject(userProject) {
			this.bucket.setUserProject.call(this, userProject);
		}
		/**
		* This creates a resumable-upload upload stream.
		*
		* @param {Duplexify} stream - Duplexify stream of data to pipe to the file.
		* @param {object=} options - Configuration object.
		*
		* @private
		*/
		startResumableUpload_(dup, options = {}) {
			var _a;
			(_a = options.metadata) !== null && _a !== void 0 || (options.metadata = {});
			const retryOptions = this.storage.retryOptions;
			if (!this.shouldRetryBasedOnPreconditionAndIdempotencyStrat(options.preconditionOpts)) retryOptions.autoRetry = false;
			const cfg = {
				authClient: this.storage.authClient,
				apiEndpoint: this.storage.apiEndpoint,
				bucket: this.bucket.name,
				customRequestOptions: this.getRequestInterceptors().reduce((reqOpts, interceptorFn) => interceptorFn(reqOpts), {}),
				file: this.name,
				generation: this.generation,
				isPartialUpload: options.isPartialUpload,
				key: this.encryptionKey,
				kmsKeyName: this.kmsKeyName,
				metadata: options.metadata,
				offset: options.offset,
				predefinedAcl: options.predefinedAcl,
				private: options.private,
				public: options.public,
				uri: options.uri,
				userProject: options.userProject || this.userProject,
				retryOptions: { ...retryOptions },
				params: (options === null || options === void 0 ? void 0 : options.preconditionOpts) || this.instancePreconditionOpts,
				chunkSize: options === null || options === void 0 ? void 0 : options.chunkSize,
				highWaterMark: options === null || options === void 0 ? void 0 : options.highWaterMark,
				universeDomain: this.bucket.storage.universeDomain,
				[util_js_1.GCCL_GCS_CMD_KEY]: options[util_js_1.GCCL_GCS_CMD_KEY]
			};
			let uploadStream;
			try {
				uploadStream = resumableUpload.upload(cfg);
			} catch (error) {
				dup.destroy(error);
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
				return;
			}
			uploadStream.on("response", (resp) => {
				dup.emit("response", resp);
			}).on("uri", (uri) => {
				dup.emit("uri", uri);
			}).on("metadata", (metadata) => {
				this.metadata = metadata;
				dup.emit("metadata");
			}).on("finish", () => {
				dup.emit("complete");
			}).on("progress", (evt) => dup.emit("progress", evt));
			dup.setWritable(uploadStream);
			this.storage.retryOptions.autoRetry = this.instanceRetryValue;
		}
		/**
		* Takes a readable stream and pipes it to a remote file. Unlike
		* `startResumableUpload_`, which uses the resumable upload technique, this
		* method uses a simple upload (all or nothing).
		*
		* @param {Duplexify} dup - Duplexify stream of data to pipe to the file.
		* @param {object=} options - Configuration object.
		*
		* @private
		*/
		startSimpleUpload_(dup, options = {}) {
			var _a;
			(_a = options.metadata) !== null && _a !== void 0 || (options.metadata = {});
			const uri = `${this.storage.apiEndpoint}/upload/storage/v1/b/${this.bucket.name}/o`;
			const reqOpts = {
				qs: { name: this.name },
				uri,
				[util_js_1.GCCL_GCS_CMD_KEY]: options[util_js_1.GCCL_GCS_CMD_KEY]
			};
			if (this.generation !== void 0) reqOpts.qs.ifGenerationMatch = this.generation;
			if (this.kmsKeyName !== void 0) reqOpts.qs.kmsKeyName = this.kmsKeyName;
			if (typeof options.timeout === "number") reqOpts.timeout = options.timeout;
			if (options.userProject || this.userProject) reqOpts.qs.userProject = options.userProject || this.userProject;
			if (options.predefinedAcl) reqOpts.qs.predefinedAcl = options.predefinedAcl;
			else if (options.private) reqOpts.qs.predefinedAcl = "private";
			else if (options.public) reqOpts.qs.predefinedAcl = "publicRead";
			Object.assign(reqOpts.qs, this.instancePreconditionOpts, options.preconditionOpts);
			index_js_1.util.makeWritableStream(dup, {
				makeAuthenticatedRequest: (reqOpts) => {
					this.request(reqOpts, (err, body, resp) => {
						if (err) {
							dup.destroy(err);
							return;
						}
						this.metadata = body;
						dup.emit("metadata", body);
						dup.emit("response", resp);
						dup.emit("complete");
					});
				},
				metadata: options.metadata,
				request: reqOpts
			});
		}
		disableAutoRetryConditionallyIdempotent_(coreOpts, methodType, localPreconditionOptions) {
			var _a, _b, _c, _d;
			if (typeof coreOpts === "object" && ((_b = (_a = coreOpts === null || coreOpts === void 0 ? void 0 : coreOpts.reqOpts) === null || _a === void 0 ? void 0 : _a.qs) === null || _b === void 0 ? void 0 : _b.ifGenerationMatch) === void 0 && (localPreconditionOptions === null || localPreconditionOptions === void 0 ? void 0 : localPreconditionOptions.ifGenerationMatch) === void 0 && methodType === bucket_js_1.AvailableServiceObjectMethods.delete && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) this.storage.retryOptions.autoRetry = false;
			if (typeof coreOpts === "object" && ((_d = (_c = coreOpts === null || coreOpts === void 0 ? void 0 : coreOpts.reqOpts) === null || _c === void 0 ? void 0 : _c.qs) === null || _d === void 0 ? void 0 : _d.ifMetagenerationMatch) === void 0 && (localPreconditionOptions === null || localPreconditionOptions === void 0 ? void 0 : localPreconditionOptions.ifMetagenerationMatch) === void 0 && methodType === bucket_js_1.AvailableServiceObjectMethods.setMetadata && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) this.storage.retryOptions.autoRetry = false;
		}
		async getBufferFromReadable(readable) {
			const buf = [];
			for await (const chunk of readable) buf.push(chunk);
			return Buffer.concat(buf);
		}
	};
	exports.File = File;
	_File_instances = /* @__PURE__ */ new WeakSet(), _File_validateIntegrity = async function _File_validateIntegrity(hashCalculatingStream, verify = {}) {
		const metadata = this.metadata;
		let dataMismatch = !!(verify.crc32c || verify.md5);
		if (verify.crc32c && metadata.crc32c) dataMismatch = !hashCalculatingStream.test("crc32c", metadata.crc32c);
		if (verify.md5 && metadata.md5Hash) dataMismatch = !hashCalculatingStream.test("md5", metadata.md5Hash);
		if (dataMismatch) {
			const errors = [];
			let code = "";
			let message = "";
			try {
				await this.delete();
				if (verify.md5 && !metadata.md5Hash) {
					code = "MD5_NOT_AVAILABLE";
					message = FileExceptionMessages.MD5_NOT_AVAILABLE;
				} else {
					code = "FILE_NO_UPLOAD";
					message = FileExceptionMessages.UPLOAD_MISMATCH;
				}
			} catch (e) {
				const error = e;
				code = "FILE_NO_UPLOAD_DELETE";
				message = `${FileExceptionMessages.UPLOAD_MISMATCH_DELETE_FAIL}${error.message}`;
				errors.push(error);
			}
			const error = new RequestError(message);
			error.code = code;
			error.errors = errors;
			throw error;
		}
		return true;
	};
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(File, { exclude: [
		"cloudStorageURI",
		"publicUrl",
		"request",
		"save",
		"setEncryptionKey",
		"shouldRetryBasedOnPreconditionAndIdempotencyStrat",
		"getBufferFromReadable",
		"restore"
	] });
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/iam.js
var require_iam = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Iam = exports.IAMExceptionMessages = void 0;
	var promisify_1 = require_src$11();
	var util_js_1 = require_util$1();
	var IAMExceptionMessages;
	(function(IAMExceptionMessages) {
		IAMExceptionMessages["POLICY_OBJECT_REQUIRED"] = "A policy object is required.";
		IAMExceptionMessages["PERMISSIONS_REQUIRED"] = "Permissions are required.";
	})(IAMExceptionMessages || (exports.IAMExceptionMessages = IAMExceptionMessages = {}));
	/**
	* Get and set IAM policies for your Cloud Storage bucket.
	*
	* See {@link https://cloud.google.com/storage/docs/access-control/iam#short_title_iam_management| Cloud Storage IAM Management}
	* See {@link https://cloud.google.com/iam/docs/granting-changing-revoking-access| Granting, Changing, and Revoking Access}
	* See {@link https://cloud.google.com/iam/docs/understanding-roles| IAM Roles}
	*
	* @constructor Iam
	*
	* @param {Bucket} bucket The parent instance.
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const bucket = storage.bucket('my-bucket');
	* // bucket.iam
	* ```
	*/
	var Iam = class {
		constructor(bucket) {
			this.request_ = bucket.request.bind(bucket);
			this.resourceId_ = "buckets/" + bucket.getId();
		}
		/**
		* @typedef {object} GetPolicyOptions Requested options for IAM#getPolicy().
		* @property {number} [requestedPolicyVersion] The version of IAM policies to
		*     request. If a policy with a condition is requested without setting
		*     this, the server will return an error. This must be set to a value
		*     of 3 to retrieve IAM policies containing conditions. This is to
		*     prevent client code that isn't aware of IAM conditions from
		*     interpreting and modifying policies incorrectly. The service might
		*     return a policy with version lower than the one that was requested,
		*     based on the feature syntax in the policy fetched.
		*     See {@link https://cloud.google.com/iam/docs/policies#versions| IAM Policy versions}
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @typedef {array} GetPolicyResponse
		* @property {Policy} 0 The policy.
		* @property {object} 1 The full API response.
		*/
		/**
		* @typedef {object} Policy
		* @property {PolicyBinding[]} policy.bindings Bindings associate members with roles.
		* @property {string} [policy.etag] Etags are used to perform a read-modify-write.
		* @property {number} [policy.version] The syntax schema version of the Policy.
		*      To set an IAM policy with conditional binding, this field must be set to
		*      3 or greater.
		*     See {@link https://cloud.google.com/iam/docs/policies#versions| IAM Policy versions}
		*/
		/**
		* @typedef {object} PolicyBinding
		* @property {string} role Role that is assigned to members.
		* @property {string[]} members Specifies the identities requesting access for the bucket.
		* @property {Expr} [condition] The condition that is associated with this binding.
		*/
		/**
		* @typedef {object} Expr
		* @property {string} [title] An optional title for the expression, i.e. a
		*     short string describing its purpose. This can be used e.g. in UIs
		*     which allow to enter the expression.
		* @property {string} [description] An optional description of the
		*     expression. This is a longer text which describes the expression,
		*     e.g. when hovered over it in a UI.
		* @property {string} expression Textual representation of an expression in
		*     Common Expression Language syntax. The application context of the
		*     containing message determines which well-known feature set of CEL
		*     is supported.The condition that is associated with this binding.
		*
		* @see [Condition] https://cloud.google.com/storage/docs/access-control/iam#conditions
		*/
		/**
		* Get the IAM policy.
		*
		* @param {GetPolicyOptions} [options] Request options.
		* @param {GetPolicyCallback} [callback] Callback function.
		* @returns {Promise<GetPolicyResponse>}
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/getIamPolicy| Buckets: setIamPolicy API Documentation}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* bucket.iam.getPolicy(
		*     {requestedPolicyVersion: 3},
		*     function(err, policy, apiResponse) {
		*
		*     },
		* );
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.iam.getPolicy({requestedPolicyVersion: 3})
		*   .then(function(data) {
		*     const policy = data[0];
		*     const apiResponse = data[1];
		*   });
		*
		* ```
		* @example <caption>include:samples/iam.js</caption>
		* region_tag:storage_view_bucket_iam_members
		* Example of retrieving a bucket's IAM policy:
		*/
		getPolicy(optionsOrCallback, callback) {
			const { options, callback: cb } = (0, util_js_1.normalize)(optionsOrCallback, callback);
			const qs = {};
			if (options.userProject) qs.userProject = options.userProject;
			if (options.requestedPolicyVersion !== null && options.requestedPolicyVersion !== void 0) qs.optionsRequestedPolicyVersion = options.requestedPolicyVersion;
			this.request_({
				uri: "/iam",
				qs
			}, cb);
		}
		/**
		* Set the IAM policy.
		*
		* @throws {Error} If no policy is provided.
		*
		* @param {Policy} policy The policy.
		* @param {SetPolicyOptions} [options] Configuration options.
		* @param {SetPolicyCallback} callback Callback function.
		* @returns {Promise<SetPolicyResponse>}
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/setIamPolicy| Buckets: setIamPolicy API Documentation}
		* See {@link https://cloud.google.com/iam/docs/understanding-roles| IAM Roles}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* const myPolicy = {
		*   bindings: [
		*     {
		*       role: 'roles/storage.admin',
		*       members:
		* ['serviceAccount:myotherproject@appspot.gserviceaccount.com']
		*     }
		*   ]
		* };
		*
		* bucket.iam.setPolicy(myPolicy, function(err, policy, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.iam.setPolicy(myPolicy).then(function(data) {
		*   const policy = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/iam.js</caption>
		* region_tag:storage_add_bucket_iam_member
		* Example of adding to a bucket's IAM policy:
		*
		* @example <caption>include:samples/iam.js</caption>
		* region_tag:storage_remove_bucket_iam_member
		* Example of removing from a bucket's IAM policy:
		*/
		setPolicy(policy, optionsOrCallback, callback) {
			if (policy === null || typeof policy !== "object") throw new Error(IAMExceptionMessages.POLICY_OBJECT_REQUIRED);
			const { options, callback: cb } = (0, util_js_1.normalize)(optionsOrCallback, callback);
			let maxRetries;
			if (policy.etag === void 0) maxRetries = 0;
			this.request_({
				method: "PUT",
				uri: "/iam",
				maxRetries,
				json: Object.assign({ resourceId: this.resourceId_ }, policy),
				qs: options
			}, cb);
		}
		/**
		* Test a set of permissions for a resource.
		*
		* @throws {Error} If permissions are not provided.
		*
		* @param {string|string[]} permissions The permission(s) to test for.
		* @param {TestIamPermissionsOptions} [options] Configuration object.
		* @param {TestIamPermissionsCallback} [callback] Callback function.
		* @returns {Promise<TestIamPermissionsResponse>}
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/testIamPermissions| Buckets: testIamPermissions API Documentation}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* //-
		* // Test a single permission.
		* //-
		* const test = 'storage.buckets.delete';
		*
		* bucket.iam.testPermissions(test, function(err, permissions, apiResponse) {
		*   console.log(permissions);
		*   // {
		*   //   "storage.buckets.delete": true
		*   // }
		* });
		*
		* //-
		* // Test several permissions at once.
		* //-
		* const tests = [
		*   'storage.buckets.delete',
		*   'storage.buckets.get'
		* ];
		*
		* bucket.iam.testPermissions(tests, function(err, permissions) {
		*   console.log(permissions);
		*   // {
		*   //   "storage.buckets.delete": false,
		*   //   "storage.buckets.get": true
		*   // }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.iam.testPermissions(test).then(function(data) {
		*   const permissions = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		testPermissions(permissions, optionsOrCallback, callback) {
			if (!Array.isArray(permissions) && typeof permissions !== "string") throw new Error(IAMExceptionMessages.PERMISSIONS_REQUIRED);
			const { options, callback: cb } = (0, util_js_1.normalize)(optionsOrCallback, callback);
			const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
			const req = Object.assign({ permissions: permissionsArray }, options);
			this.request_({
				uri: "/iam/testPermissions",
				qs: req,
				useQuerystring: true
			}, (err, resp) => {
				if (err) {
					cb(err, null, resp);
					return;
				}
				const availablePermissions = Array.isArray(resp.permissions) ? resp.permissions : [];
				cb(null, permissionsArray.reduce((acc, permission) => {
					acc[permission] = availablePermissions.indexOf(permission) > -1;
					return acc;
				}, {}), resp);
			});
		}
	};
	exports.Iam = Iam;
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Iam);
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/notification.js
var require_notification = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Notification = void 0;
	var index_js_1 = require_nodejs_common();
	var promisify_1 = require_src$11();
	/**
	* The API-formatted resource description of the notification.
	*
	* Note: This is not guaranteed to be up-to-date when accessed. To get the
	* latest record, call the `getMetadata()` method.
	*
	* @name Notification#metadata
	* @type {object}
	*/
	/**
	* A Notification object is created from your {@link Bucket} object using
	* {@link Bucket#notification}. Use it to interact with Cloud Pub/Sub
	* notifications.
	*
	* See {@link https://cloud.google.com/storage/docs/pubsub-notifications| Cloud Pub/Sub Notifications for Google Cloud Storage}
	*
	* @class
	* @hideconstructor
	*
	* @param {Bucket} bucket The bucket instance this notification is attached to.
	* @param {string} id The ID of the notification.
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const myBucket = storage.bucket('my-bucket');
	*
	* const notification = myBucket.notification('1');
	* ```
	*/
	var Notification = class extends index_js_1.ServiceObject {
		constructor(bucket, id) {
			const requestQueryObject = {};
			const methods = {
				/**
				* Creates a notification subscription for the bucket.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/insert| Notifications: insert}
				* @method Notification#create
				*
				* @param {Topic|string} topic The Cloud PubSub topic to which this
				* subscription publishes. If the project ID is omitted, the current
				* project ID will be used.
				*
				* Acceptable formats are:
				* - `projects/grape-spaceship-123/topics/my-topic`
				*
				* - `my-topic`
				* @param {CreateNotificationRequest} [options] Metadata to set for
				*     the notification.
				* @param {CreateNotificationCallback} [callback] Callback function.
				* @returns {Promise<CreateNotificationResponse>}
				* @throws {Error} If a valid topic is not provided.
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const myBucket = storage.bucket('my-bucket');
				* const notification = myBucket.notification('1');
				*
				* notification.create(function(err, notification, apiResponse) {
				*   if (!err) {
				*     // The notification was created successfully.
				*   }
				* });
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* notification.create().then(function(data) {
				*   const notification = data[0];
				*   const apiResponse = data[1];
				* });
				* ```
				*/
				create: true,
				/**
				* @typedef {array} DeleteNotificationResponse
				* @property {object} 0 The full API response.
				*/
				/**
				* Permanently deletes a notification subscription.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/delete| Notifications: delete API Documentation}
				*
				* @param {object} [options] Configuration options.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {DeleteNotificationCallback} [callback] Callback function.
				* @returns {Promise<DeleteNotificationResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const myBucket = storage.bucket('my-bucket');
				* const notification = myBucket.notification('1');
				*
				* notification.delete(function(err, apiResponse) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* notification.delete().then(function(data) {
				*   const apiResponse = data[0];
				* });
				*
				* ```
				* @example <caption>include:samples/deleteNotification.js</caption>
				* region_tag:storage_delete_bucket_notification
				* Another example:
				*/
				delete: { reqOpts: { qs: requestQueryObject } },
				/**
				* Get a notification and its metadata if it exists.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/get| Notifications: get API Documentation}
				*
				* @param {object} [options] Configuration options.
				*     See {@link Bucket#createNotification} for create options.
				* @param {boolean} [options.autoCreate] Automatically create the object if
				*     it does not exist. Default: `false`.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {GetNotificationCallback} [callback] Callback function.
				* @return {Promise<GetNotificationCallback>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const myBucket = storage.bucket('my-bucket');
				* const notification = myBucket.notification('1');
				*
				* notification.get(function(err, notification, apiResponse) {
				*   // `notification.metadata` has been populated.
				* });
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* notification.get().then(function(data) {
				*   const notification = data[0];
				*   const apiResponse = data[1];
				* });
				* ```
				*/
				get: { reqOpts: { qs: requestQueryObject } },
				/**
				* Get the notification's metadata.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/get| Notifications: get API Documentation}
				*
				* @param {object} [options] Configuration options.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {GetNotificationMetadataCallback} [callback] Callback function.
				* @returns {Promise<GetNotificationMetadataResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const myBucket = storage.bucket('my-bucket');
				* const notification = myBucket.notification('1');
				*
				* notification.getMetadata(function(err, metadata, apiResponse) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* notification.getMetadata().then(function(data) {
				*   const metadata = data[0];
				*   const apiResponse = data[1];
				* });
				*
				* ```
				* @example <caption>include:samples/getMetadataNotifications.js</caption>
				* region_tag:storage_print_pubsub_bucket_notification
				* Another example:
				*/
				getMetadata: { reqOpts: { qs: requestQueryObject } },
				/**
				* @typedef {array} NotificationExistsResponse
				* @property {boolean} 0 Whether the notification exists or not.
				*/
				/**
				* @callback NotificationExistsCallback
				* @param {?Error} err Request error, if any.
				* @param {boolean} exists Whether the notification exists or not.
				*/
				/**
				* Check if the notification exists.
				*
				* @method Notification#exists
				* @param {NotificationExistsCallback} [callback] Callback function.
				* @returns {Promise<NotificationExistsResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const myBucket = storage.bucket('my-bucket');
				* const notification = myBucket.notification('1');
				*
				* notification.exists(function(err, exists) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* notification.exists().then(function(data) {
				*   const exists = data[0];
				* });
				* ```
				*/
				exists: true
			};
			super({
				parent: bucket,
				baseUrl: "/notificationConfigs",
				id: id.toString(),
				createMethod: bucket.createNotification.bind(bucket),
				methods
			});
		}
	};
	exports.Notification = Notification;
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Notification);
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/bucket.js
var require_bucket = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Bucket = exports.BucketExceptionMessages = exports.AvailableServiceObjectMethods = exports.BucketActionToHTTPMethod = void 0;
	var index_js_1 = require_nodejs_common();
	var paginator_1 = require_src$12();
	var promisify_1 = require_src$11();
	var fs = __importStar(__require("fs"));
	var mime_1 = __importDefault(require_mime());
	var path$1 = __importStar(__require("path"));
	var p_limit_1 = __importDefault(require_p_limit());
	var util_1 = __require("util");
	var async_retry_1 = __importDefault(require_lib());
	var util_js_1 = require_util$1();
	var acl_js_1 = require_acl();
	var file_js_1 = require_file();
	var iam_js_1 = require_iam();
	var notification_js_1 = require_notification();
	var storage_js_1 = require_storage();
	var signer_js_1 = require_signer();
	var stream_1$1 = __require("stream");
	var url_1 = __require("url");
	var BucketActionToHTTPMethod;
	(function(BucketActionToHTTPMethod) {
		BucketActionToHTTPMethod["list"] = "GET";
	})(BucketActionToHTTPMethod || (exports.BucketActionToHTTPMethod = BucketActionToHTTPMethod = {}));
	var AvailableServiceObjectMethods;
	(function(AvailableServiceObjectMethods) {
		AvailableServiceObjectMethods[AvailableServiceObjectMethods["setMetadata"] = 0] = "setMetadata";
		AvailableServiceObjectMethods[AvailableServiceObjectMethods["delete"] = 1] = "delete";
	})(AvailableServiceObjectMethods || (exports.AvailableServiceObjectMethods = AvailableServiceObjectMethods = {}));
	var BucketExceptionMessages;
	(function(BucketExceptionMessages) {
		BucketExceptionMessages["PROVIDE_SOURCE_FILE"] = "You must provide at least one source file.";
		BucketExceptionMessages["DESTINATION_FILE_NOT_SPECIFIED"] = "A destination file must be specified.";
		BucketExceptionMessages["CHANNEL_ID_REQUIRED"] = "An ID is required to create a channel.";
		BucketExceptionMessages["TOPIC_NAME_REQUIRED"] = "A valid topic name is required.";
		BucketExceptionMessages["CONFIGURATION_OBJECT_PREFIX_REQUIRED"] = "A configuration object with a prefix is required.";
		BucketExceptionMessages["SPECIFY_FILE_NAME"] = "A file name must be specified.";
		BucketExceptionMessages["METAGENERATION_NOT_PROVIDED"] = "A metageneration must be provided.";
		BucketExceptionMessages["SUPPLY_NOTIFICATION_ID"] = "You must supply a notification ID.";
	})(BucketExceptionMessages || (exports.BucketExceptionMessages = BucketExceptionMessages = {}));
	/**
	* @callback Crc32cGeneratorToStringCallback
	* A method returning the CRC32C as a base64-encoded string.
	*
	* @returns {string}
	*
	* @example
	* Hashing the string 'data' should return 'rth90Q=='
	*
	* ```js
	* const buffer = Buffer.from('data');
	* crc32c.update(buffer);
	* crc32c.toString(); // 'rth90Q=='
	* ```
	**/
	/**
	* @callback Crc32cGeneratorValidateCallback
	* A method validating a base64-encoded CRC32C string.
	*
	* @param {string} [value] base64-encoded CRC32C string to validate
	* @returns {boolean}
	*
	* @example
	* Should return `true` if the value matches, `false` otherwise
	*
	* ```js
	* const buffer = Buffer.from('data');
	* crc32c.update(buffer);
	* crc32c.validate('DkjKuA=='); // false
	* crc32c.validate('rth90Q=='); // true
	* ```
	**/
	/**
	* @callback Crc32cGeneratorUpdateCallback
	* A method for passing `Buffer`s for CRC32C generation.
	*
	* @param {Buffer} [data] data to update CRC32C value with
	* @returns {undefined}
	*
	* @example
	* Hashing buffers from 'some ' and 'text\n'
	*
	* ```js
	* const buffer1 = Buffer.from('some ');
	* crc32c.update(buffer1);
	*
	* const buffer2 = Buffer.from('text\n');
	* crc32c.update(buffer2);
	*
	* crc32c.toString(); // 'DkjKuA=='
	* ```
	**/
	/**
	* @typedef {object} CRC32CValidator
	* @property {Crc32cGeneratorToStringCallback}
	* @property {Crc32cGeneratorValidateCallback}
	* @property {Crc32cGeneratorUpdateCallback}
	*/
	/**
	* A function that generates a CRC32C Validator. Defaults to {@link CRC32C}
	*
	* @name Bucket#crc32cGenerator
	* @type {CRC32CValidator}
	*/
	/**
	* Get and set IAM policies for your bucket.
	*
	* @name Bucket#iam
	* @mixes Iam
	*
	* See {@link https://cloud.google.com/storage/docs/access-control/iam#short_title_iam_management| Cloud Storage IAM Management}
	* See {@link https://cloud.google.com/iam/docs/granting-changing-revoking-access| Granting, Changing, and Revoking Access}
	* See {@link https://cloud.google.com/iam/docs/understanding-roles| IAM Roles}
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const bucket = storage.bucket('albums');
	*
	* //-
	* // Get the IAM policy for your bucket.
	* //-
	* bucket.iam.getPolicy(function(err, policy) {
	*   console.log(policy);
	* });
	*
	* //-
	* // If the callback is omitted, we'll return a Promise.
	* //-
	* bucket.iam.getPolicy().then(function(data) {
	*   const policy = data[0];
	*   const apiResponse = data[1];
	* });
	*
	* ```
	* @example <caption>include:samples/iam.js</caption>
	* region_tag:storage_view_bucket_iam_members
	* Example of retrieving a bucket's IAM policy:
	*
	* @example <caption>include:samples/iam.js</caption>
	* region_tag:storage_add_bucket_iam_member
	* Example of adding to a bucket's IAM policy:
	*
	* @example <caption>include:samples/iam.js</caption>
	* region_tag:storage_remove_bucket_iam_member
	* Example of removing from a bucket's IAM policy:
	*/
	/**
	* Cloud Storage uses access control lists (ACLs) to manage object and
	* bucket access. ACLs are the mechanism you use to share objects with other
	* users and allow other users to access your buckets and objects.
	*
	* An ACL consists of one or more entries, where each entry grants permissions
	* to an entity. Permissions define the actions that can be performed against
	* an object or bucket (for example, `READ` or `WRITE`); the entity defines
	* who the permission applies to (for example, a specific user or group of
	* users).
	*
	* The `acl` object on a Bucket instance provides methods to get you a list of
	* the ACLs defined on your bucket, as well as set, update, and delete them.
	*
	* Buckets also have
	* {@link https://cloud.google.com/storage/docs/access-control/lists#default| default ACLs}
	* for all created files. Default ACLs specify permissions that all new
	* objects added to the bucket will inherit by default. You can add, delete,
	* get, and update entities and permissions for these as well with
	* {@link Bucket#acl.default}.
	*
	* See {@link http://goo.gl/6qBBPO| About Access Control Lists}
	* See {@link https://cloud.google.com/storage/docs/access-control/lists#default| Default ACLs}
	*
	* @name Bucket#acl
	* @mixes Acl
	* @property {Acl} default Cloud Storage Buckets have
	* {@link https://cloud.google.com/storage/docs/access-control/lists#default| default ACLs}
	* for all created files. You can add, delete, get, and update entities and
	* permissions for these as well. The method signatures and examples are all
	* the same, after only prefixing the method call with `default`.
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	*
	* //-
	* // Make a bucket's contents publicly readable.
	* //-
	* const myBucket = storage.bucket('my-bucket');
	*
	* const options = {
	*   entity: 'allUsers',
	*   role: storage.acl.READER_ROLE
	* };
	*
	* myBucket.acl.add(options, function(err, aclObject) {});
	*
	* //-
	* // If the callback is omitted, we'll return a Promise.
	* //-
	* myBucket.acl.add(options).then(function(data) {
	*   const aclObject = data[0];
	*   const apiResponse = data[1];
	* });
	*
	* ```
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_print_bucket_acl
	* Example of printing a bucket's ACL:
	*
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_print_bucket_acl_for_user
	* Example of printing a bucket's ACL for a specific user:
	*
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_add_bucket_owner
	* Example of adding an owner to a bucket:
	*
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_remove_bucket_owner
	* Example of removing an owner from a bucket:
	*
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_add_bucket_default_owner
	* Example of adding a default owner to a bucket:
	*
	* @example <caption>include:samples/acl.js</caption>
	* region_tag:storage_remove_bucket_default_owner
	* Example of removing a default owner from a bucket:
	*/
	/**
	* The API-formatted resource description of the bucket.
	*
	* Note: This is not guaranteed to be up-to-date when accessed. To get the
	* latest record, call the `getMetadata()` method.
	*
	* @name Bucket#metadata
	* @type {object}
	*/
	/**
	* The bucket's name.
	* @name Bucket#name
	* @type {string}
	*/
	/**
	* Get {@link File} objects for the files currently in the bucket as a
	* readable object stream.
	*
	* @method Bucket#getFilesStream
	* @param {GetFilesOptions} [query] Query object for listing files.
	* @returns {ReadableStream} A readable stream that emits {@link File} instances.
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const bucket = storage.bucket('albums');
	*
	* bucket.getFilesStream()
	*   .on('error', console.error)
	*   .on('data', function(file) {
	*     // file is a File object.
	*   })
	*   .on('end', function() {
	*     // All files retrieved.
	*   });
	*
	* //-
	* // If you anticipate many results, you can end a stream early to prevent
	* // unnecessary processing and API requests.
	* //-
	* bucket.getFilesStream()
	*   .on('data', function(file) {
	*     this.end();
	*   });
	*
	* //-
	* // If you're filtering files with a delimiter, you should use
	* // {@link Bucket#getFiles} and set `autoPaginate: false` in order to
	* // preserve the `apiResponse` argument.
	* //-
	* const prefixes = [];
	*
	* function callback(err, files, nextQuery, apiResponse) {
	*   prefixes = prefixes.concat(apiResponse.prefixes);
	*
	*   if (nextQuery) {
	*     bucket.getFiles(nextQuery, callback);
	*   } else {
	*     // prefixes = The finished array of prefixes.
	*   }
	* }
	*
	* bucket.getFiles({
	*   autoPaginate: false,
	*   delimiter: '/'
	* }, callback);
	* ```
	*/
	/**
	* Create a Bucket object to interact with a Cloud Storage bucket.
	*
	* @class
	* @hideconstructor
	*
	* @param {Storage} storage A {@link Storage} instance.
	* @param {string} name The name of the bucket.
	* @param {object} [options] Configuration object.
	* @param {string} [options.userProject] User project.
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const bucket = storage.bucket('albums');
	* ```
	*/
	var Bucket = class Bucket extends index_js_1.ServiceObject {
		getFilesStream(query) {
			return new stream_1$1.Readable();
		}
		constructor(storage, name, options) {
			var _a, _b, _c, _d;
			options = options || {};
			name = name.replace(/^gs:\/\//, "").replace(/\/+$/, "");
			const requestQueryObject = {};
			if ((_a = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) requestQueryObject.ifGenerationMatch = options.preconditionOpts.ifGenerationMatch;
			if ((_b = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationNotMatch) requestQueryObject.ifGenerationNotMatch = options.preconditionOpts.ifGenerationNotMatch;
			if ((_c = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _c === void 0 ? void 0 : _c.ifMetagenerationMatch) requestQueryObject.ifMetagenerationMatch = options.preconditionOpts.ifMetagenerationMatch;
			if ((_d = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _d === void 0 ? void 0 : _d.ifMetagenerationNotMatch) requestQueryObject.ifMetagenerationNotMatch = options.preconditionOpts.ifMetagenerationNotMatch;
			const userProject = options.userProject;
			if (typeof userProject === "string") requestQueryObject.userProject = userProject;
			const methods = {
				/**
				* Create a bucket.
				*
				* @method Bucket#create
				* @param {CreateBucketRequest} [metadata] Metadata to set for the bucket.
				* @param {CreateBucketCallback} [callback] Callback function.
				* @returns {Promise<CreateBucketResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				* bucket.create(function(err, bucket, apiResponse) {
				*   if (!err) {
				*     // The bucket was created successfully.
				*   }
				* });
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.create().then(function(data) {
				*   const bucket = data[0];
				*   const apiResponse = data[1];
				* });
				* ```
				*/
				create: { reqOpts: { qs: requestQueryObject } },
				/**
				* IamDeleteBucketOptions Configuration options.
				* @property {boolean} [ignoreNotFound = false] Ignore an error if
				*     the bucket does not exist.
				* @property {string} [userProject] The ID of the project which will be
				*     billed for the request.
				*/
				/**
				* @typedef {array} DeleteBucketResponse
				* @property {object} 0 The full API response.
				*/
				/**
				* @callback DeleteBucketCallback
				* @param {?Error} err Request error, if any.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* Delete the bucket.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/delete| Buckets: delete API Documentation}
				*
				* @method Bucket#delete
				* @param {DeleteBucketOptions} [options] Configuration options.
				* @param {boolean} [options.ignoreNotFound = false] Ignore an error if
				*     the bucket does not exist.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {DeleteBucketCallback} [callback] Callback function.
				* @returns {Promise<DeleteBucketResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				* bucket.delete(function(err, apiResponse) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.delete().then(function(data) {
				*   const apiResponse = data[0];
				* });
				*
				* ```
				* @example <caption>include:samples/buckets.js</caption>
				* region_tag:storage_delete_bucket
				* Another example:
				*/
				delete: { reqOpts: { qs: requestQueryObject } },
				/**
				* @typedef {object} BucketExistsOptions Configuration options for Bucket#exists().
				* @property {string} [userProject] The ID of the project which will be
				*     billed for the request.
				*/
				/**
				* @typedef {array} BucketExistsResponse
				* @property {boolean} 0 Whether the {@link Bucket} exists.
				*/
				/**
				* @callback BucketExistsCallback
				* @param {?Error} err Request error, if any.
				* @param {boolean} exists Whether the {@link Bucket} exists.
				*/
				/**
				* Check if the bucket exists.
				*
				* @method Bucket#exists
				* @param {BucketExistsOptions} [options] Configuration options.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {BucketExistsCallback} [callback] Callback function.
				* @returns {Promise<BucketExistsResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				*
				* bucket.exists(function(err, exists) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.exists().then(function(data) {
				*   const exists = data[0];
				* });
				* ```
				*/
				exists: { reqOpts: { qs: requestQueryObject } },
				/**
				* @typedef {object} [GetBucketOptions] Configuration options for Bucket#get()
				* @property {boolean} [autoCreate] Automatically create the object if
				*     it does not exist. Default: `false`
				* @property {string} [userProject] The ID of the project which will be
				*     billed for the request.
				*/
				/**
				* @typedef {array} GetBucketResponse
				* @property {Bucket} 0 The {@link Bucket}.
				* @property {object} 1 The full API response.
				*/
				/**
				* @callback GetBucketCallback
				* @param {?Error} err Request error, if any.
				* @param {Bucket} bucket The {@link Bucket}.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* Get a bucket if it exists.
				*
				* You may optionally use this to "get or create" an object by providing
				* an object with `autoCreate` set to `true`. Any extra configuration that
				* is normally required for the `create` method must be contained within
				* this object as well.
				*
				* @method Bucket#get
				* @param {GetBucketOptions} [options] Configuration options.
				* @param {boolean} [options.autoCreate] Automatically create the object if
				*     it does not exist. Default: `false`
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {GetBucketCallback} [callback] Callback function.
				* @returns {Promise<GetBucketResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				*
				* bucket.get(function(err, bucket, apiResponse) {
				*   // `bucket.metadata` has been populated.
				* });
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.get().then(function(data) {
				*   const bucket = data[0];
				*   const apiResponse = data[1];
				* });
				* ```
				*/
				get: { reqOpts: { qs: requestQueryObject } },
				/**
				* @typedef {array} GetBucketMetadataResponse
				* @property {object} 0 The bucket metadata.
				* @property {object} 1 The full API response.
				*/
				/**
				* @callback GetBucketMetadataCallback
				* @param {?Error} err Request error, if any.
				* @param {object} metadata The bucket metadata.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* @typedef {object} GetBucketMetadataOptions Configuration options for Bucket#getMetadata().
				* @property {string} [userProject] The ID of the project which will be
				*     billed for the request.
				*/
				/**
				* Get the bucket's metadata.
				*
				* To set metadata, see {@link Bucket#setMetadata}.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/get| Buckets: get API Documentation}
				*
				* @method Bucket#getMetadata
				* @param {GetBucketMetadataOptions} [options] Configuration options.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {GetBucketMetadataCallback} [callback] Callback function.
				* @returns {Promise<GetBucketMetadataResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				*
				* bucket.getMetadata(function(err, metadata, apiResponse) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.getMetadata().then(function(data) {
				*   const metadata = data[0];
				*   const apiResponse = data[1];
				* });
				*
				* ```
				* @example <caption>include:samples/requesterPays.js</caption>
				* region_tag:storage_get_requester_pays_status
				* Example of retrieving the requester pays status of a bucket:
				*/
				getMetadata: { reqOpts: { qs: requestQueryObject } },
				/**
				* @typedef {object} SetBucketMetadataOptions Configuration options for Bucket#setMetadata().
				* @property {string} [userProject] The ID of the project which will be
				*     billed for the request.
				*/
				/**
				* @typedef {array} SetBucketMetadataResponse
				* @property {object} apiResponse The full API response.
				*/
				/**
				* @callback SetBucketMetadataCallback
				* @param {?Error} err Request error, if any.
				* @param {object} metadata The bucket metadata.
				*/
				/**
				* Set the bucket's metadata.
				*
				* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/patch| Buckets: patch API Documentation}
				*
				* @method Bucket#setMetadata
				* @param {object<string, *>} metadata The metadata you wish to set.
				* @param {SetBucketMetadataOptions} [options] Configuration options.
				* @param {string} [options.userProject] The ID of the project which will be
				*     billed for the request.
				* @param {SetBucketMetadataCallback} [callback] Callback function.
				* @returns {Promise<SetBucketMetadataResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				* const bucket = storage.bucket('albums');
				*
				* //-
				* // Set website metadata field on the bucket.
				* //-
				* const metadata = {
				*   website: {
				*     mainPageSuffix: 'http://example.com',
				*     notFoundPage: 'http://example.com/404.html'
				*   }
				* };
				*
				* bucket.setMetadata(metadata, function(err, apiResponse) {});
				*
				* //-
				* // Enable versioning for your bucket.
				* //-
				* bucket.setMetadata({
				*   versioning: {
				*     enabled: true
				*   }
				* }, function(err, apiResponse) {});
				*
				* //-
				* // Enable KMS encryption for objects within this bucket.
				* //-
				* bucket.setMetadata({
				*   encryption: {
				*     defaultKmsKeyName: 'projects/grape-spaceship-123/...'
				*   }
				* }, function(err, apiResponse) {});
				*
				* //-
				* // Set the default event-based hold value for new objects in this
				* // bucket.
				* //-
				* bucket.setMetadata({
				*   defaultEventBasedHold: true
				* }, function(err, apiResponse) {});
				*
				* //-
				* // Remove object lifecycle rules.
				* //-
				* bucket.setMetadata({
				*   lifecycle: null
				* }, function(err, apiResponse) {});
				*
				* //-
				* // If the callback is omitted, we'll return a Promise.
				* //-
				* bucket.setMetadata(metadata).then(function(data) {
				*   const apiResponse = data[0];
				* });
				* ```
				*/
				setMetadata: { reqOpts: { qs: requestQueryObject } }
			};
			super({
				parent: storage,
				baseUrl: "/b",
				id: name,
				createMethod: storage.createBucket.bind(storage),
				methods
			});
			/**
			* Indicates whether this Bucket object is a placeholder for an item
			* that the API failed to retrieve (unreachable) due to partial failure.
			* Consumers must check this flag before accessing other properties.
			*/
			this.unreachable = false;
			this.name = name;
			this.storage = storage;
			this.userProject = options.userProject;
			this.acl = new acl_js_1.Acl({
				request: this.request.bind(this),
				pathPrefix: "/acl"
			});
			this.acl.default = new acl_js_1.Acl({
				request: this.request.bind(this),
				pathPrefix: "/defaultObjectAcl"
			});
			this.crc32cGenerator = options.crc32cGenerator || this.storage.crc32cGenerator;
			this.iam = new iam_js_1.Iam(this);
			this.getFilesStream = paginator_1.paginator.streamify("getFiles");
			this.instanceRetryValue = storage.retryOptions.autoRetry;
			this.instancePreconditionOpts = options === null || options === void 0 ? void 0 : options.preconditionOpts;
		}
		/**
		* The bucket's Cloud Storage URI (`gs://`)
		*
		* @example
		* ```ts
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* // `gs://my-bucket`
		* const href = bucket.cloudStorageURI.href;
		* ```
		*/
		get cloudStorageURI() {
			const uri = new url_1.URL("gs://");
			uri.host = this.name;
			return uri;
		}
		/**
		* @typedef {object} AddLifecycleRuleOptions Configuration options for Bucket#addLifecycleRule().
		* @property {boolean} [append=true] The new rules will be appended to any
		*     pre-existing rules.
		*/
		/**
		*
		* @typedef {object} LifecycleRule The new lifecycle rule to be added to objects
		*     in this bucket.
		* @property {string|object} action The action to be taken upon matching of
		*     all the conditions 'delete', 'setStorageClass', or 'AbortIncompleteMultipartUpload'.
		*     **Note**: For configuring a raw-formatted rule object to be passed as `action`
		*               please refer to the [examples]{@link https://cloud.google.com/storage/docs/managing-lifecycles#configexamples}.
		* @property {object} condition Condition a bucket must meet before the
		*     action occurs on the bucket. Refer to following supported [conditions]{@link https://cloud.google.com/storage/docs/lifecycle#conditions}.
		* @property {string} [storageClass] When using the `setStorageClass`
		*     action, provide this option to dictate which storage class the object
		*     should update to. Please see
		*     [SetStorageClass option documentation]{@link https://cloud.google.com/storage/docs/lifecycle#setstorageclass} for supported transitions.
		*/
		/**
		* Add an object lifecycle management rule to the bucket.
		*
		* By default, an Object Lifecycle Management rule provided to this method
		* will be included to the existing policy. To replace all existing rules,
		* supply the `options` argument, setting `append` to `false`.
		*
		* To add multiple rules, pass a list to the `rule` parameter. Calling this
		* function multiple times asynchronously does not guarantee that all rules
		* are added correctly.
		*
		* See {@link https://cloud.google.com/storage/docs/lifecycle| Object Lifecycle Management}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/patch| Buckets: patch API Documentation}
		*
		* @param {LifecycleRule|LifecycleRule[]} rule The new lifecycle rule or rules to be added to objects
		*     in this bucket.
		* @param {string|object} rule.action The action to be taken upon matching of
		*     all the conditions 'delete', 'setStorageClass', or 'AbortIncompleteMultipartUpload'.
		*     **Note**: For configuring a raw-formatted rule object to be passed as `action`
		*               please refer to the [examples]{@link https://cloud.google.com/storage/docs/managing-lifecycles#configexamples}.
		* @param {object} rule.condition Condition a bucket must meet before the
		*     action occurs on the bucket. Refer to following supported [conditions]{@link https://cloud.google.com/storage/docs/lifecycle#conditions}.
		* @param {string} [rule.storageClass] When using the `setStorageClass`
		*     action, provide this option to dictate which storage class the object
		*     should update to.
		* @param {AddLifecycleRuleOptions} [options] Configuration object.
		* @param {boolean} [options.append=true] Append the new rule to the existing
		*     policy.
		* @param {SetBucketMetadataCallback} [callback] Callback function.
		* @returns {Promise<SetBucketMetadataResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Automatically have an object deleted from this bucket once it is 3 years
		* // of age.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     age: 365 * 3 // Specified in days.
		*   }
		* }, function(err, apiResponse) {
		*   if (err) {
		*     // Error handling omitted.
		*   }
		*
		*   const lifecycleRules = bucket.metadata.lifecycle.rule;
		*
		*   // Iterate over the Object Lifecycle Management rules on this bucket.
		*   lifecycleRules.forEach(lifecycleRule => {});
		* });
		*
		* //-
		* // By default, the rule you provide will be added to the existing policy.
		* // Optionally, you can disable this behavior to replace all of the
		* // pre-existing rules.
		* //-
		* const options = {
		*   append: false
		* };
		*
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     age: 365 * 3 // Specified in days.
		*   }
		* }, options, function(err, apiResponse) {
		*   if (err) {
		*     // Error handling omitted.
		*   }
		*
		*   // All rules have been replaced with the new "delete" rule.
		*
		*   // Iterate over the Object Lifecycle Management rules on this bucket.
		*   lifecycleRules.forEach(lifecycleRule => {});
		* });
		*
		* //-
		* // For objects created before 2018, "downgrade" the storage class.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'setStorageClass',
		*   storageClass: 'COLDLINE',
		*   condition: {
		*     createdBefore: new Date('2018')
		*   }
		* }, function(err, apiResponse) {});
		*
		* //-
		* // Delete objects created before 2016 which have the Coldline storage
		* // class.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     matchesStorageClass: [
		*       'COLDLINE'
		*     ],
		*     createdBefore: new Date('2016')
		*   }
		* }, function(err, apiResponse) {});
		*
		* //-
		* // Delete object that has a noncurrent timestamp that is at least 100 days.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     daysSinceNoncurrentTime: 100
		*   }
		* }, function(err, apiResponse) {});
		*
		* //-
		* // Delete object that has a noncurrent timestamp before 2020-01-01.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     noncurrentTimeBefore: new Date('2020-01-01')
		*   }
		* }, function(err, apiResponse) {});
		*
		* //-
		* // Delete object that has a customTime that is at least 100 days.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     daysSinceCustomTime: 100
		*   }
		* }, function(err, apiResponse) ());
		*
		* //-
		* // Delete object that has a customTime before 2020-01-01.
		* //-
		* bucket.addLifecycleRule({
		*   action: 'delete',
		*   condition: {
		*     customTimeBefore: new Date('2020-01-01')
		*   }
		* }, function(err, apiResponse) {});
		* ```
		*/
		addLifecycleRule(rule, optionsOrCallback, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			options = options || {};
			const rules = Array.isArray(rule) ? rule : [rule];
			for (const curRule of rules) {
				if (curRule.condition.createdBefore instanceof Date) curRule.condition.createdBefore = curRule.condition.createdBefore.toISOString().replace(/T.+$/, "");
				if (curRule.condition.customTimeBefore instanceof Date) curRule.condition.customTimeBefore = curRule.condition.customTimeBefore.toISOString().replace(/T.+$/, "");
				if (curRule.condition.noncurrentTimeBefore instanceof Date) curRule.condition.noncurrentTimeBefore = curRule.condition.noncurrentTimeBefore.toISOString().replace(/T.+$/, "");
			}
			if (options.append === false) {
				this.setMetadata({ lifecycle: { rule: rules } }, options, callback);
				return;
			}
			this.getMetadata((err, metadata) => {
				var _a, _b;
				if (err) {
					callback(err);
					return;
				}
				const currentLifecycleRules = Array.isArray((_a = metadata.lifecycle) === null || _a === void 0 ? void 0 : _a.rule) ? (_b = metadata.lifecycle) === null || _b === void 0 ? void 0 : _b.rule : [];
				this.setMetadata({ lifecycle: { rule: currentLifecycleRules.concat(rules) } }, options, callback);
			});
		}
		/**
		* @typedef {object} CombineOptions
		* @property {string} [kmsKeyName] Resource name of the Cloud KMS key, of
		*     the form
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`,
		*     that will be used to encrypt the object. Overwrites the object
		* metadata's `kms_key_name` value, if any.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback CombineCallback
		* @param {?Error} err Request error, if any.
		* @param {File} newFile The new {@link File}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {array} CombineResponse
		* @property {File} 0 The new {@link File}.
		* @property {object} 1 The full API response.
		*/
		/**
		* Combine multiple files into one new file.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/compose| Objects: compose API Documentation}
		*
		* @throws {Error} if a non-array is provided as sources argument.
		* @throws {Error} if no sources are provided.
		* @throws {Error} if no destination is provided.
		*
		* @param {string[]|File[]} sources The source files that will be
		*     combined.
		* @param {string|File} destination The file you would like the
		*     source files combined into.
		* @param {CombineOptions} [options] Configuration options.
		* @param {string} [options.kmsKeyName] Resource name of the Cloud KMS key, of
		*     the form
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`,
		*     that will be used to encrypt the object. Overwrites the object
		* metadata's `kms_key_name` value, if any.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		
		* @param {CombineCallback} [callback] Callback function.
		* @returns {Promise<CombineResponse>}
		*
		* @example
		* ```
		* const logBucket = storage.bucket('log-bucket');
		*
		* const sources = [
		*   logBucket.file('2013-logs.txt'),
		*   logBucket.file('2014-logs.txt')
		* ];
		*
		* const allLogs = logBucket.file('all-logs.txt');
		*
		* logBucket.combine(sources, allLogs, function(err, newFile, apiResponse) {
		*   // newFile === allLogs
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* logBucket.combine(sources, allLogs).then(function(data) {
		*   const newFile = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		combine(sources, destination, optionsOrCallback, callback) {
			var _a;
			if (!Array.isArray(sources) || sources.length === 0) throw new Error(BucketExceptionMessages.PROVIDE_SOURCE_FILE);
			if (!destination) throw new Error(BucketExceptionMessages.DESTINATION_FILE_NOT_SPECIFIED);
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.disableAutoRetryConditionallyIdempotent_(this.methods.setMetadata, AvailableServiceObjectMethods.setMetadata, options);
			const convertToFile = (file) => {
				if (file instanceof file_js_1.File) return file;
				return this.file(file);
			};
			sources = sources.map(convertToFile);
			const destinationFile = convertToFile(destination);
			callback = callback || index_js_1.util.noop;
			if (!destinationFile.metadata.contentType) {
				const destinationContentType = mime_1.default.getType(destinationFile.name) || void 0;
				if (destinationContentType) destinationFile.metadata.contentType = destinationContentType;
			}
			let maxRetries = this.storage.retryOptions.maxRetries;
			if (((_a = destinationFile === null || destinationFile === void 0 ? void 0 : destinationFile.instancePreconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) === void 0 && options.ifGenerationMatch === void 0 && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) maxRetries = 0;
			if (options.ifGenerationMatch === void 0) Object.assign(options, destinationFile.instancePreconditionOpts, options);
			destinationFile.request({
				method: "POST",
				uri: "/compose",
				maxRetries,
				json: {
					destination: {
						contentType: destinationFile.metadata.contentType,
						contentEncoding: destinationFile.metadata.contentEncoding
					},
					sourceObjects: sources.map((source) => {
						const sourceObject = { name: source.name };
						if (source.metadata && source.metadata.generation) sourceObject.generation = parseInt(source.metadata.generation.toString());
						return sourceObject;
					})
				},
				qs: options
			}, (err, resp) => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
				if (err) {
					callback(err, null, resp);
					return;
				}
				callback(null, destinationFile, resp);
			});
		}
		/**
		* See a {@link https://cloud.google.com/storage/docs/json_api/v1/objects/watchAll| Objects: watchAll request body}.
		*
		* @typedef {object} CreateChannelConfig
		* @property {string} address The address where notifications are
		*     delivered for this channel.
		* @property {string} [delimiter] Returns results in a directory-like mode.
		* @property {number} [maxResults] Maximum number of `items` plus `prefixes`
		*     to return in a single page of responses.
		* @property {string} [pageToken] A previously-returned page token
		*     representing part of the larger set of results to view.
		* @property {string} [prefix] Filter results to objects whose names begin
		*     with this prefix.
		* @property {string} [projection=noAcl] Set of properties to return.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {boolean} [versions=false] If `true`, lists all versions of an object
		*     as distinct results.
		*/
		/**
		* @typedef {object} CreateChannelOptions
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @typedef {array} CreateChannelResponse
		* @property {Channel} 0 The new {@link Channel}.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback CreateChannelCallback
		* @param {?Error} err Request error, if any.
		* @param {Channel} channel The new {@link Channel}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Create a channel that will be notified when objects in this bucket changes.
		*
		* @throws {Error} If an ID is not provided.
		* @throws {Error} If an address is not provided.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/watchAll| Objects: watchAll API Documentation}
		*
		* @param {string} id The ID of the channel to create.
		* @param {CreateChannelConfig} config Configuration for creating channel.
		* @param {string} config.address The address where notifications are
		*     delivered for this channel.
		* @param {string} [config.delimiter] Returns results in a directory-like mode.
		* @param {number} [config.maxResults] Maximum number of `items` plus `prefixes`
		*     to return in a single page of responses.
		* @param {string} [config.pageToken] A previously-returned page token
		*     representing part of the larger set of results to view.
		* @param {string} [config.prefix] Filter results to objects whose names begin
		*     with this prefix.
		* @param {string} [config.projection=noAcl] Set of properties to return.
		* @param {string} [config.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {boolean} [config.versions=false] If `true`, lists all versions of an object
		*     as distinct results.
		* @param {CreateChannelOptions} [options] Configuration options.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {CreateChannelCallback} [callback] Callback function.
		* @returns {Promise<CreateChannelResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		* const id = 'new-channel-id';
		*
		* const config = {
		*   address: 'https://...'
		* };
		*
		* bucket.createChannel(id, config, function(err, channel, apiResponse) {
		*   if (!err) {
		*     // Channel created successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.createChannel(id, config).then(function(data) {
		*   const channel = data[0];
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		createChannel(id, config, optionsOrCallback, callback) {
			if (typeof id !== "string") throw new Error(BucketExceptionMessages.CHANNEL_ID_REQUIRED);
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.request({
				method: "POST",
				uri: "/o/watch",
				json: Object.assign({
					id,
					type: "web_hook"
				}, config),
				qs: options
			}, (err, apiResponse) => {
				if (err) {
					callback(err, null, apiResponse);
					return;
				}
				const resourceId = apiResponse.resourceId;
				const channel = this.storage.channel(id, resourceId);
				channel.metadata = apiResponse;
				callback(null, channel, apiResponse);
			});
		}
		/**
		* Metadata to set for the Notification.
		*
		* @typedef {object} CreateNotificationOptions
		* @property {object} [customAttributes] An optional list of additional
		*     attributes to attach to each Cloud PubSub message published for this
		*     notification subscription.
		* @property {string[]} [eventTypes] If present, only send notifications about
		*     listed event types. If empty, sent notifications for all event types.
		* @property {string} [objectNamePrefix] If present, only apply this
		*     notification configuration to object names that begin with this prefix.
		* @property {string} [payloadFormat] The desired content of the Payload.
		* Defaults to `JSON_API_V1`.
		*
		* Acceptable values are:
		* - `JSON_API_V1`
		*
		* - `NONE`
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback CreateNotificationCallback
		* @param {?Error} err Request error, if any.
		* @param {Notification} notification The new {@link Notification}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {array} CreateNotificationResponse
		* @property {Notification} 0 The new {@link Notification}.
		* @property {object} 1 The full API response.
		*/
		/**
		* Creates a notification subscription for the bucket.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/insert| Notifications: insert}
		*
		* @param {Topic|string} topic The Cloud PubSub topic to which this
		* subscription publishes. If the project ID is omitted, the current
		* project ID will be used.
		*
		* Acceptable formats are:
		* - `projects/grape-spaceship-123/topics/my-topic`
		*
		* - `my-topic`
		* @param {CreateNotificationOptions} [options] Metadata to set for the
		*     notification.
		* @param {object} [options.customAttributes] An optional list of additional
		*     attributes to attach to each Cloud PubSub message published for this
		*     notification subscription.
		* @param {string[]} [options.eventTypes] If present, only send notifications about
		*     listed event types. If empty, sent notifications for all event types.
		* @param {string} [options.objectNamePrefix] If present, only apply this
		*     notification configuration to object names that begin with this prefix.
		* @param {string} [options.payloadFormat] The desired content of the Payload.
		* Defaults to `JSON_API_V1`.
		*
		* Acceptable values are:
		* - `JSON_API_V1`
		*
		* - `NONE`
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {CreateNotificationCallback} [callback] Callback function.
		* @returns {Promise<CreateNotificationResponse>}
		* @throws {Error} If a valid topic is not provided.
		* @see Notification#create
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* const callback = function(err, notification, apiResponse) {
		*   if (!err) {
		*     // The notification was created successfully.
		*   }
		* };
		*
		* myBucket.createNotification('my-topic', callback);
		*
		* //-
		* // Configure the notification by providing Notification metadata.
		* //-
		* const metadata = {
		*   objectNamePrefix: 'prefix-'
		* };
		*
		* myBucket.createNotification('my-topic', metadata, callback);
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* myBucket.createNotification('my-topic').then(function(data) {
		*   const notification = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/createNotification.js</caption>
		* region_tag:storage_create_bucket_notifications
		* Another example:
		*/
		createNotification(topic, optionsOrCallback, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			if (topic !== null && typeof topic === "object" && index_js_1.util.isCustomType(topic, "pubsub/topic")) topic = topic.name;
			if (typeof topic !== "string") throw new Error(BucketExceptionMessages.TOPIC_NAME_REQUIRED);
			const body = Object.assign({ topic }, options);
			if (body.topic.indexOf("projects") !== 0) body.topic = "projects/{{projectId}}/topics/" + body.topic;
			body.topic = `//pubsub.${this.storage.universeDomain}/` + body.topic;
			if (!body.payloadFormat) body.payloadFormat = "JSON_API_V1";
			const query = {};
			if (body.userProject) {
				query.userProject = body.userProject;
				delete body.userProject;
			}
			this.request({
				method: "POST",
				uri: "/notificationConfigs",
				json: (0, util_js_1.convertObjKeysToSnakeCase)(body),
				qs: query,
				maxRetries: 0
			}, (err, apiResponse) => {
				if (err) {
					callback(err, null, apiResponse);
					return;
				}
				const notification = this.notification(apiResponse.id);
				notification.metadata = apiResponse;
				callback(null, notification, apiResponse);
			});
		}
		/**
		* @typedef {object} DeleteFilesOptions Query object. See {@link Bucket#getFiles}
		*     for all of the supported properties.
		* @property {boolean} [force] Suppress errors until all files have been
		*     processed.
		*/
		/**
		* @callback DeleteFilesCallback
		* @param {?Error|?Error[]} err Request error, if any, or array of errors from
		*     files that were not able to be deleted.
		* @param {object} [apiResponse] The full API response.
		*/
		/**
		* Iterate over the bucket's files, calling `file.delete()` on each.
		*
		* <strong>This is not an atomic request.</strong> A delete attempt will be
		* made for each file individually. Any one can fail, in which case only a
		* portion of the files you intended to be deleted would have.
		*
		* Operations are performed in parallel, up to 10 at once. The first error
		* breaks the loop and will execute the provided callback with it. Specify
		* `{ force: true }` to suppress the errors until all files have had a chance
		* to be processed.
		*
		* File preconditions cannot be passed to this function. It will not retry unless
		* the idempotency strategy is set to retry always.
		*
		* The `query` object passed as the first argument will also be passed to
		* {@link Bucket#getFiles}.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/delete| Objects: delete API Documentation}
		*
		* @param {DeleteFilesOptions} [query] Query object. See {@link Bucket#getFiles}
		* @param {boolean} [query.force] Suppress errors until all files have been
		*     processed.
		* @param {DeleteFilesCallback} [callback] Callback function.
		* @returns {Promise}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Delete all of the files in the bucket.
		* //-
		* bucket.deleteFiles(function(err) {});
		*
		* //-
		* // By default, if a file cannot be deleted, this method will stop deleting
		* // files from your bucket. You can override this setting with `force:
		* // true`.
		* //-
		* bucket.deleteFiles({
		*   force: true
		* }, function(errors) {
		*   // `errors`:
		*   //    Array of errors if any occurred, otherwise null.
		* });
		*
		* //-
		* // The first argument to this method acts as a query to
		* // {@link Bucket#getFiles}. As an example, you can delete files
		* // which match a prefix.
		* //-
		* bucket.deleteFiles({
		*   prefix: 'images/'
		* }, function(err) {
		*   if (!err) {
		*     // All files in the `images` directory have been deleted.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.deleteFiles().then(function() {});
		* ```
		*/
		deleteFiles(queryOrCallback, callback) {
			let query = {};
			if (typeof queryOrCallback === "function") callback = queryOrCallback;
			else if (queryOrCallback) query = queryOrCallback;
			const MAX_PARALLEL_LIMIT = 10;
			const MAX_QUEUE_SIZE = 1e3;
			const errors = [];
			const deleteFile = (file) => {
				return file.delete(query).catch((err) => {
					if (!query.force) throw err;
					errors.push(err);
				});
			};
			(async () => {
				try {
					let promises = [];
					const limit = (0, p_limit_1.default)(MAX_PARALLEL_LIMIT);
					const filesStream = this.getFilesStream(query);
					for await (const curFile of filesStream) {
						if (promises.length >= MAX_QUEUE_SIZE) {
							await Promise.all(promises);
							promises = [];
						}
						promises.push(limit(() => deleteFile(curFile)).catch((e) => {
							filesStream.destroy();
							throw e;
						}));
					}
					await Promise.all(promises);
					callback(errors.length > 0 ? errors : null);
				} catch (e) {
					callback(e);
					return;
				}
			})();
		}
		/**
		* @deprecated
		* @typedef {array} DeleteLabelsResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @deprecated
		* @callback DeleteLabelsCallback
		* @param {?Error} err Request error, if any.
		* @param {object} metadata Bucket's metadata.
		*/
		/**
		* @deprecated Use setMetadata directly
		* Delete one or more labels from this bucket.
		*
		* @param {string|string[]} [labels] The labels to delete. If no labels are
		*     provided, all of the labels are removed.
		* @param {DeleteLabelsCallback} [callback] Callback function.
		* @param {DeleteLabelsOptions} [options] Options, including precondition options
		* @returns {Promise<DeleteLabelsResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Delete all of the labels from this bucket.
		* //-
		* bucket.deleteLabels(function(err, apiResponse) {});
		*
		* //-
		* // Delete a single label.
		* //-
		* bucket.deleteLabels('labelone', function(err, apiResponse) {});
		*
		* //-
		* // Delete a specific set of labels.
		* //-
		* bucket.deleteLabels([
		*   'labelone',
		*   'labeltwo'
		* ], function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.deleteLabels().then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		deleteLabels(labelsOrCallbackOrOptions, optionsOrCallback, callback) {
			let labels = new Array();
			let options = {};
			if (typeof labelsOrCallbackOrOptions === "function") callback = labelsOrCallbackOrOptions;
			else if (typeof labelsOrCallbackOrOptions === "string") labels = [labelsOrCallbackOrOptions];
			else if (Array.isArray(labelsOrCallbackOrOptions)) labels = labelsOrCallbackOrOptions;
			else if (labelsOrCallbackOrOptions) options = labelsOrCallbackOrOptions;
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			const deleteLabels = (labels) => {
				const nullLabelMap = labels.reduce((nullLabelMap, labelKey) => {
					nullLabelMap[labelKey] = null;
					return nullLabelMap;
				}, {});
				if ((options === null || options === void 0 ? void 0 : options.ifMetagenerationMatch) !== void 0) this.setLabels(nullLabelMap, options, callback);
				else this.setLabels(nullLabelMap, callback);
			};
			if (labels.length === 0) this.getLabels((err, labels) => {
				if (err) {
					callback(err);
					return;
				}
				deleteLabels(Object.keys(labels));
			});
			else deleteLabels(labels);
		}
		/**
		* @typedef {array} DisableRequesterPaysResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @callback DisableRequesterPaysCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* <div class="notice">
		*   <strong>Early Access Testers Only</strong>
		*   <p>
		*     This feature is not yet widely-available.
		*   </p>
		* </div>
		*
		* Disable `requesterPays` functionality from this bucket.
		*
		* @param {DisableRequesterPaysCallback} [callback] Callback function.
		* @param {DisableRequesterPaysOptions} [options] Options, including precondition options
		* @returns {Promise<DisableRequesterPaysCallback>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.disableRequesterPays(function(err, apiResponse) {
		*   if (!err) {
		*     // requesterPays functionality disabled successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.disableRequesterPays().then(function(data) {
		*   const apiResponse = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/requesterPays.js</caption>
		* region_tag:storage_disable_requester_pays
		* Example of disabling requester pays:
		*/
		disableRequesterPays(optionsOrCallback, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.setMetadata({ billing: { requesterPays: false } }, options, callback);
		}
		/**
		* Configuration object for enabling logging.
		*
		* @typedef {object} EnableLoggingOptions
		* @property {string|Bucket} [bucket] The bucket for the log entries. By
		*     default, the current bucket is used.
		* @property {string} prefix A unique prefix for log object names.
		*/
		/**
		* Enable logging functionality for this bucket. This will make two API
		* requests, first to grant Cloud Storage WRITE permission to the bucket, then
		* to set the appropriate configuration on the Bucket's metadata.
		*
		* @param {EnableLoggingOptions} config Configuration options.
		* @param {string|Bucket} [config.bucket] The bucket for the log entries. By
		*     default, the current bucket is used.
		* @param {string} config.prefix A unique prefix for log object names.
		* @param {SetBucketMetadataCallback} [callback] Callback function.
		* @returns {Promise<SetBucketMetadataResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* const config = {
		*   prefix: 'log'
		* };
		*
		* bucket.enableLogging(config, function(err, apiResponse) {
		*   if (!err) {
		*     // Logging functionality enabled successfully.
		*   }
		* });
		*
		* ```
		* @example
		* Optionally, provide a destination bucket.
		* ```
		* const config = {
		*   prefix: 'log',
		*   bucket: 'destination-bucket'
		* };
		*
		* bucket.enableLogging(config, function(err, apiResponse) {});
		* ```
		*
		* @example
		* If the callback is omitted, we'll return a Promise.
		* ```
		* bucket.enableLogging(config).then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		enableLogging(config, callback) {
			if (!config || typeof config === "function" || typeof config.prefix === "undefined") throw new Error(BucketExceptionMessages.CONFIGURATION_OBJECT_PREFIX_REQUIRED);
			let logBucket = this.id;
			if (config.bucket && config.bucket instanceof Bucket) logBucket = config.bucket.id;
			else if (config.bucket && typeof config.bucket === "string") logBucket = config.bucket;
			const options = {};
			if (config === null || config === void 0 ? void 0 : config.ifMetagenerationMatch) options.ifMetagenerationMatch = config.ifMetagenerationMatch;
			if (config === null || config === void 0 ? void 0 : config.ifMetagenerationNotMatch) options.ifMetagenerationNotMatch = config.ifMetagenerationNotMatch;
			(async () => {
				try {
					const [policy] = await this.iam.getPolicy();
					policy.bindings.push({
						members: ["group:cloud-storage-analytics@google.com"],
						role: "roles/storage.objectCreator"
					});
					await this.iam.setPolicy(policy);
					this.setMetadata({ logging: {
						logBucket,
						logObjectPrefix: config.prefix
					} }, options, callback);
				} catch (e) {
					callback(e);
					return;
				}
			})();
		}
		/**
		* @typedef {array} EnableRequesterPaysResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @callback EnableRequesterPaysCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* <div class="notice">
		*   <strong>Early Access Testers Only</strong>
		*   <p>
		*     This feature is not yet widely-available.
		*   </p>
		* </div>
		*
		* Enable `requesterPays` functionality for this bucket. This enables you, the
		* bucket owner, to have the requesting user assume the charges for the access
		* to your bucket and its contents.
		*
		* @param {EnableRequesterPaysCallback | EnableRequesterPaysOptions} [optionsOrCallback]
		* Callback function or precondition options.
		* @returns {Promise<EnableRequesterPaysResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.enableRequesterPays(function(err, apiResponse) {
		*   if (!err) {
		*     // requesterPays functionality enabled successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.enableRequesterPays().then(function(data) {
		*   const apiResponse = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/requesterPays.js</caption>
		* region_tag:storage_enable_requester_pays
		* Example of enabling requester pays:
		*/
		enableRequesterPays(optionsOrCallback, cb) {
			let options = {};
			if (typeof optionsOrCallback === "function") cb = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.setMetadata({ billing: { requesterPays: true } }, options, cb);
		}
		/**
		* Create a {@link File} object. See {@link File} to see how to handle
		* the different use cases you may have.
		*
		* @param {string} name The name of the file in this bucket.
		* @param {FileOptions} [options] Configuration options.
		* @param {string|number} [options.generation] Only use a specific revision of
		*     this file.
		* @param {string} [options.encryptionKey] A custom encryption key. See
		*     {@link https://cloud.google.com/storage/docs/encryption#customer-supplied| Customer-supplied Encryption Keys}.
		* @param {string} [options.kmsKeyName] The name of the Cloud KMS key that will
		*     be used to encrypt the object. Must be in the format:
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`.
		*     KMS key ring must use the same location as the bucket.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for all requests made from File object.
		* @returns {File}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		* const file = bucket.file('my-existing-file.png');
		* ```
		*/
		file(name, options) {
			if (!name) throw Error(BucketExceptionMessages.SPECIFY_FILE_NAME);
			return new file_js_1.File(this, name, options);
		}
		/**
		* @typedef {array} GetFilesResponse
		* @property {File[]} 0 Array of {@link File} instances.
		* @param {object} nextQuery 1 A query object to receive more results.
		* @param {object} apiResponse 2 The full API response.
		*/
		/**
		* @callback GetFilesCallback
		* @param {?Error} err Request error, if any.
		* @param {File[]} files Array of {@link File} instances.
		* @param {object} nextQuery A query object to receive more results.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Query object for listing files.
		*
		* @typedef {object} GetFilesOptions
		* @property {boolean} [autoPaginate=true] Have pagination handled
		*     automatically.
		* @property {string} [delimiter] Results will contain only objects whose
		*     names, aside from the prefix, do not contain delimiter. Objects whose
		*     names, aside from the prefix, contain delimiter will have their name
		*     truncated after the delimiter, returned in `apiResponse.prefixes`.
		*     Duplicate prefixes are omitted.
		* @property {string} [endOffset] Filter results to objects whose names are
		* lexicographically before endOffset. If startOffset is also set, the objects
		* listed have names between startOffset (inclusive) and endOffset (exclusive).
		* @property {boolean} [includeFoldersAsPrefixes] If true, includes folders and
		* managed folders in the set of prefixes returned by the query. Only applicable if
		* delimiter is set to / and autoPaginate is set to false.
		* See: https://cloud.google.com/storage/docs/managed-folders
		* @property {boolean} [includeTrailingDelimiter] If true, objects that end in
		* exactly one instance of delimiter have their metadata included in items[]
		* in addition to the relevant part of the object name appearing in prefixes[].
		* @property {string} [prefix] Filter results to objects whose names begin
		*     with this prefix.
		* @property {string} [matchGlob] A glob pattern used to filter results,
		*     for example foo*bar
		* @property {number} [maxApiCalls] Maximum number of API calls to make.
		* @property {number} [maxResults] Maximum number of items plus prefixes to
		*     return per call.
		*     Note: By default will handle pagination automatically
		*     if more than 1 page worth of results are requested per call.
		*     When `autoPaginate` is set to `false` the smaller of `maxResults`
		*     or 1 page of results will be returned per call.
		* @property {string} [pageToken] A previously-returned page token
		*     representing part of the larger set of results to view.
		* @property {boolean} [softDeleted] If true, only soft-deleted object versions will be
		*     listed as distinct results in order of generation number. Note `soft_deleted` and
		*     `versions` cannot be set to true simultaneously.
		* @property {string} [startOffset] Filter results to objects whose names are
		* lexicographically equal to or after startOffset. If endOffset is also set,
		* the objects listed have names between startOffset (inclusive) and endOffset (exclusive).
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {boolean} [versions] If true, returns File objects scoped to
		*     their versions.
		*/
		/**
		* Get {@link File} objects for the files currently in the bucket.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/list| Objects: list API Documentation}
		*
		* @param {GetFilesOptions} [query] Query object for listing files.
		* @param {boolean} [query.autoPaginate=true] Have pagination handled
		*     automatically.
		* @param {string} [query.delimiter] Results will contain only objects whose
		*     names, aside from the prefix, do not contain delimiter. Objects whose
		*     names, aside from the prefix, contain delimiter will have their name
		*     truncated after the delimiter, returned in `apiResponse.prefixes`.
		*     Duplicate prefixes are omitted.
		* @param {string} [query.endOffset] Filter results to objects whose names are
		* lexicographically before endOffset. If startOffset is also set, the objects
		* listed have names between startOffset (inclusive) and endOffset (exclusive).
		* @param {boolean} [query.includeFoldersAsPrefixes] If true, includes folders and
		* managed folders in the set of prefixes returned by the query. Only applicable if
		* delimiter is set to / and autoPaginate is set to false.
		* See: https://cloud.google.com/storage/docs/managed-folders
		* @param {boolean} [query.includeTrailingDelimiter] If true, objects that end in
		* exactly one instance of delimiter have their metadata included in items[]
		* in addition to the relevant part of the object name appearing in prefixes[].
		* @param {string} [query.prefix] Filter results to objects whose names begin
		*     with this prefix.
		* @param {number} [query.maxApiCalls] Maximum number of API calls to make.
		* @param {number} [query.maxResults] Maximum number of items plus prefixes to
		*     return per call.
		*     Note: By default will handle pagination automatically
		*     if more than 1 page worth of results are requested per call.
		*     When `autoPaginate` is set to `false` the smaller of `maxResults`
		*     or 1 page of results will be returned per call.
		* @param {string} [query.pageToken] A previously-returned page token
		*     representing part of the larger set of results to view.
		* @param {boolean} [query.softDeleted] If true, only soft-deleted object versions will be
		*     listed as distinct results in order of generation number. Note `soft_deleted` and
		*     `versions` cannot be set to true simultaneously.
		* @param {string} [query.startOffset] Filter results to objects whose names are
		* lexicographically equal to or after startOffset. If endOffset is also set,
		* the objects listed have names between startOffset (inclusive) and endOffset (exclusive).
		* @param {string} [query.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {boolean} [query.versions] If true, returns File objects scoped to
		*     their versions.
		* @param {GetFilesCallback} [callback] Callback function.
		* @returns {Promise<GetFilesResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.getFiles(function(err, files) {
		*   if (!err) {
		*     // files is an array of File objects.
		*   }
		* });
		*
		* //-
		* // If your bucket has versioning enabled, you can get all of your files
		* // scoped to their generation.
		* //-
		* bucket.getFiles({
		*   versions: true
		* }, function(err, files) {
		*   // Each file is scoped to its generation.
		* });
		*
		* //-
		* // To control how many API requests are made and page through the results
		* // manually, set `autoPaginate` to `false`.
		* //-
		* const callback = function(err, files, nextQuery, apiResponse) {
		*   if (nextQuery) {
		*     // More results exist.
		*     bucket.getFiles(nextQuery, callback);
		*   }
		*
		*   // The `metadata` property is populated for you with the metadata at the
		*   // time of fetching.
		*   files[0].metadata;
		*
		*   // However, in cases where you are concerned the metadata could have
		*   // changed, use the `getMetadata` method.
		*   files[0].getMetadata(function(err, metadata) {});
		* };
		*
		* bucket.getFiles({
		*   autoPaginate: false
		* }, callback);
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.getFiles().then(function(data) {
		*   const files = data[0];
		* });
		*
		* ```
		* @example
		* <h6>Simulating a File System</h6><p>With `autoPaginate: false`, it's possible to iterate over files which incorporate a common structure using a delimiter.</p><p>Consider the following remote objects:</p><ol><li>"a"</li><li>"a/b/c/d"</li><li>"b/d/e"</li></ol><p>Using a delimiter of `/` will return a single file, "a".</p><p>`apiResponse.prefixes` will return the "sub-directories" that were found:</p><ol><li>"a/"</li><li>"b/"</li></ol>
		* ```
		* bucket.getFiles({
		*   autoPaginate: false,
		*   delimiter: '/'
		* }, function(err, files, nextQuery, apiResponse) {
		*   // files = [
		*   //   {File} // File object for file "a"
		*   // ]
		*
		*   // apiResponse.prefixes = [
		*   //   'a/',
		*   //   'b/'
		*   // ]
		* });
		* ```
		*
		* @example
		* Using prefixes, it's now possible to simulate a file system with follow-up requests.
		* ```
		* bucket.getFiles({
		*   autoPaginate: false,
		*   delimiter: '/',
		*   prefix: 'a/'
		* }, function(err, files, nextQuery, apiResponse) {
		*   // No files found within "directory" a.
		*   // files = []
		*
		*   // However, a "sub-directory" was found.
		*   // This prefix can be used to continue traversing the "file system".
		*   // apiResponse.prefixes = [
		*   //   'a/b/'
		*   // ]
		* });
		* ```
		*
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_list_files
		* Another example:
		*
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_list_files_with_prefix
		* Example of listing files, filtered by a prefix:
		*/
		getFiles(queryOrCallback, callback) {
			let query = typeof queryOrCallback === "object" ? queryOrCallback : {};
			if (!callback) callback = queryOrCallback;
			query = Object.assign({}, query);
			if (query.fields && query.autoPaginate && !query.fields.includes("nextPageToken")) query.fields = `${query.fields},nextPageToken`;
			this.request({
				uri: "/o",
				qs: query
			}, (err, resp) => {
				if (err) {
					callback(err, null, null, resp);
					return;
				}
				const files = (resp.items ? resp.items : []).map((file) => {
					const options = {};
					if (query.fields) return file;
					if (query.versions) options.generation = file.generation;
					if (file.kmsKeyName) options.kmsKeyName = file.kmsKeyName;
					const fileInstance = this.file(file.name, options);
					fileInstance.metadata = file;
					return fileInstance;
				});
				let nextQuery = null;
				if (resp.nextPageToken) nextQuery = Object.assign({}, query, { pageToken: resp.nextPageToken });
				callback(null, files, nextQuery, resp);
			});
		}
		/**
		* @deprecated
		* @typedef {object} GetLabelsOptions Configuration options for Bucket#getLabels().
		* @param {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @deprecated
		* @typedef {array} GetLabelsResponse
		* @property {object} 0 Object of labels currently set on this bucket.
		*/
		/**
		* @deprecated
		* @callback GetLabelsCallback
		* @param {?Error} err Request error, if any.
		* @param {object} labels Object of labels currently set on this bucket.
		*/
		/**
		* @deprecated Use getMetadata directly.
		* Get the labels currently set on this bucket.
		*
		* @param {object} [options] Configuration options.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {GetLabelsCallback} [callback] Callback function.
		* @returns {Promise<GetLabelsCallback>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.getLabels(function(err, labels) {
		*   if (err) {
		*     // Error handling omitted.
		*   }
		*
		*   // labels = {
		*   //   label: 'labelValue',
		*   //   ...
		*   // }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.getLabels().then(function(data) {
		*   const labels = data[0];
		* });
		* ```
		*/
		getLabels(optionsOrCallback, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.getMetadata(options, (err, metadata) => {
				if (err) {
					callback(err, null);
					return;
				}
				callback(null, (metadata === null || metadata === void 0 ? void 0 : metadata.labels) || {});
			});
		}
		/**
		* @typedef {object} GetNotificationsOptions Configuration options for Bucket#getNotification().
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback GetNotificationsCallback
		* @param {?Error} err Request error, if any.
		* @param {Notification[]} notifications Array of {@link Notification}
		*     instances.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* @typedef {array} GetNotificationsResponse
		* @property {Notification[]} 0 Array of {@link Notification} instances.
		* @property {object} 1 The full API response.
		*/
		/**
		* Retrieves a list of notification subscriptions for a given bucket.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/notifications/list| Notifications: list}
		*
		* @param {GetNotificationsOptions} [options] Configuration options.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {GetNotificationsCallback} [callback] Callback function.
		* @returns {Promise<GetNotificationsResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		*
		* bucket.getNotifications(function(err, notifications, apiResponse) {
		*   if (!err) {
		*     // notifications is an array of Notification objects.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.getNotifications().then(function(data) {
		*   const notifications = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/listNotifications.js</caption>
		* region_tag:storage_list_bucket_notifications
		* Another example:
		*/
		getNotifications(optionsOrCallback, callback) {
			let options = {};
			if (typeof optionsOrCallback === "function") callback = optionsOrCallback;
			else if (optionsOrCallback) options = optionsOrCallback;
			this.request({
				uri: "/notificationConfigs",
				qs: options
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				const notifications = (resp.items ? resp.items : []).map((notification) => {
					const notificationInstance = this.notification(notification.id);
					notificationInstance.metadata = notification;
					return notificationInstance;
				});
				callback(null, notifications, resp);
			});
		}
		/**
		* @typedef {array} GetSignedUrlResponse
		* @property {object} 0 The signed URL.
		*/
		/**
		* @callback GetSignedUrlCallback
		* @param {?Error} err Request error, if any.
		* @param {object} url The signed URL.
		*/
		/**
		* @typedef {object} GetBucketSignedUrlConfig
		* @property {string} action Only listing objects within a bucket (HTTP: GET) is supported for bucket-level signed URLs.
		* @property {*} expires A timestamp when this link will expire. Any value
		*     given is passed to `new Date()`.
		*     Note: 'v4' supports maximum duration of 7 days (604800 seconds) from now.
		* @property {string} [version='v2'] The signing version to use, either
		*     'v2' or 'v4'.
		* @property {boolean} [virtualHostedStyle=false] Use virtual hosted-style
		*     URLs ('https://mybucket.storage.googleapis.com/...') instead of path-style
		*     ('https://storage.googleapis.com/mybucket/...'). Virtual hosted-style URLs
		*     should generally be preferred instead of path-style URL.
		*     Currently defaults to `false` for path-style, although this may change in a
		*     future major-version release.
		* @property {string} [cname] The cname for this bucket, i.e.,
		*     "https://cdn.example.com".
		*     See [reference]{@link https://cloud.google.com/storage/docs/access-control/signed-urls#example}
		* @property {object} [extensionHeaders] If these headers are used, the
		* server will check to make sure that the client provides matching
		* values. See {@link https://cloud.google.com/storage/docs/access-control/signed-urls#about-canonical-extension-headers| Canonical extension headers}
		* for the requirements of this feature, most notably:
		* - The header name must be prefixed with `x-goog-`
		* - The header name must be all lowercase
		*
		* Note: Multi-valued header passed as an array in the extensionHeaders
		*       object is converted into a string, delimited by `,` with
		*       no space. Requests made using the signed URL will need to
		*       delimit multi-valued headers using a single `,` as well, or
		*       else the server will report a mismatched signature.
		* @property {object} [queryParams] Additional query parameters to include
		*     in the signed URL.
		*/
		/**
		* Get a signed URL to allow limited time access to a bucket.
		*
		* In Google Cloud Platform environments, such as Cloud Functions and App
		* Engine, you usually don't provide a `keyFilename` or `credentials` during
		* instantiation. In those environments, we call the
		* {@link https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/signBlob| signBlob API}
		* to create a signed URL. That API requires either the
		* `https://www.googleapis.com/auth/iam` or
		* `https://www.googleapis.com/auth/cloud-platform` scope, so be sure they are
		* enabled.
		*
		* See {@link https://cloud.google.com/storage/docs/access-control/signed-urls| Signed URLs Reference}
		*
		* @throws {Error} if an expiration timestamp from the past is given.
		*
		* @param {GetBucketSignedUrlConfig} config Configuration object.
		* @param {string} config.action Currently only supports "list" (HTTP: GET).
		* @param {*} config.expires A timestamp when this link will expire. Any value
		*     given is passed to `new Date()`.
		*     Note: 'v4' supports maximum duration of 7 days (604800 seconds) from now.
		* @param {string} [config.version='v2'] The signing version to use, either
		*     'v2' or 'v4'.
		* @param {boolean} [config.virtualHostedStyle=false] Use virtual hosted-style
		*     URLs ('https://mybucket.storage.googleapis.com/...') instead of path-style
		*     ('https://storage.googleapis.com/mybucket/...'). Virtual hosted-style URLs
		*     should generally be preferred instead of path-style URL.
		*     Currently defaults to `false` for path-style, although this may change in a
		*     future major-version release.
		* @param {string} [config.cname] The cname for this bucket, i.e.,
		*     "https://cdn.example.com".
		*     See [reference]{@link https://cloud.google.com/storage/docs/access-control/signed-urls#example}
		* @param {object} [config.extensionHeaders] If these headers are used, the
		* server will check to make sure that the client provides matching
		* values. See {@link https://cloud.google.com/storage/docs/access-control/signed-urls#about-canonical-extension-headers| Canonical extension headers}
		* for the requirements of this feature, most notably:
		* - The header name must be prefixed with `x-goog-`
		* - The header name must be all lowercase
		*
		* Note: Multi-valued header passed as an array in the extensionHeaders
		*       object is converted into a string, delimited by `,` with
		*       no space. Requests made using the signed URL will need to
		*       delimit multi-valued headers using a single `,` as well, or
		*       else the server will report a mismatched signature.
		* @property {object} [config.queryParams] Additional query parameters to include
		*     in the signed URL.
		* @param {GetSignedUrlCallback} [callback] Callback function.
		* @returns {Promise<GetSignedUrlResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const myBucket = storage.bucket('my-bucket');
		*
		* //-
		* // Generate a URL that allows temporary access to list files in a bucket.
		* //-
		* const request = require('request');
		*
		* const config = {
		*   action: 'list',
		*   expires: '03-17-2025'
		* };
		*
		* bucket.getSignedUrl(config, function(err, url) {
		*   if (err) {
		*     console.error(err);
		*     return;
		*   }
		*
		*   // The bucket is now available to be listed from this URL.
		*   request(url, function(err, resp) {
		*     // resp.statusCode = 200
		*   });
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.getSignedUrl(config).then(function(data) {
		*   const url = data[0];
		* });
		* ```
		*/
		getSignedUrl(cfg, callback) {
			const signConfig = {
				method: BucketActionToHTTPMethod[cfg.action],
				expires: cfg.expires,
				version: cfg.version,
				cname: cfg.cname,
				extensionHeaders: cfg.extensionHeaders || {},
				queryParams: cfg.queryParams || {},
				host: cfg.host,
				signingEndpoint: cfg.signingEndpoint
			};
			if (!this.signer) this.signer = new signer_js_1.URLSigner(this.storage.authClient, this, void 0, this.storage);
			this.signer.getSignedUrl(signConfig).then((signedUrl) => callback(null, signedUrl), callback);
		}
		/**
		* @callback BucketLockCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Lock a previously-defined retention policy. This will prevent changes to
		* the policy.
		*
		* @throws {Error} if a metageneration is not provided.
		*
		* @param {number|string} metageneration The bucket's metageneration. This is
		*     accessible from calling {@link File#getMetadata}.
		* @param {BucketLockCallback} [callback] Callback function.
		* @returns {Promise<BucketLockResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const bucket = storage.bucket('albums');
		*
		* const metageneration = 2;
		*
		* bucket.lock(metageneration, function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.lock(metageneration).then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		lock(metageneration, callback) {
			const metatype = typeof metageneration;
			if (metatype !== "number" && metatype !== "string") throw new Error(BucketExceptionMessages.METAGENERATION_NOT_PROVIDED);
			this.request({
				method: "POST",
				uri: "/lockRetentionPolicy",
				qs: { ifMetagenerationMatch: metageneration }
			}, callback);
		}
		/**
		* @typedef {object} RestoreOptions Options for Bucket#restore(). See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/restore#resource| Object resource}.
		* @param {number} [generation] If present, selects a specific revision of this object.
		* @param {string} [projection] Specifies the set of properties to return. If used, must be 'full' or 'noAcl'.
		*/
		/**
		* Restores a soft-deleted bucket
		* @param {RestoreOptions} options Restore options.
		* @returns {Promise<Bucket>}
		*/
		async restore(options) {
			const [bucket] = await this.request({
				method: "POST",
				uri: "/restore",
				qs: options
			});
			return bucket;
		}
		/**
		* @typedef {array} MakeBucketPrivateResponse
		* @property {File[]} 0 List of files made private.
		*/
		/**
		* @callback MakeBucketPrivateCallback
		* @param {?Error} err Request error, if any.
		* @param {File[]} files List of files made private.
		*/
		/**
		* @typedef {object} MakeBucketPrivateOptions
		* @property {boolean} [includeFiles=false] Make each file in the bucket
		*     private.
		* @property {Metadata} [metadata] Define custom metadata properties to define
		*     along with the operation.
		* @property {boolean} [force] Queue errors occurred while making files
		*     private until all files have been processed.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* Make the bucket listing private.
		*
		* You may also choose to make the contents of the bucket private by
		* specifying `includeFiles: true`. This will automatically run
		* {@link File#makePrivate} for every file in the bucket.
		*
		* When specifying `includeFiles: true`, use `force: true` to delay execution
		* of your callback until all files have been processed. By default, the
		* callback is executed after the first error. Use `force` to queue such
		* errors until all files have been processed, after which they will be
		* returned as an array as the first argument to your callback.
		*
		* NOTE: This may cause the process to be long-running and use a high number
		* of requests. Use with caution.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/patch| Buckets: patch API Documentation}
		*
		* @param {MakeBucketPrivateOptions} [options] Configuration options.
		* @param {boolean} [options.includeFiles=false] Make each file in the bucket
		*     private.
		* @param {Metadata} [options.metadata] Define custom metadata properties to define
		*     along with the operation.
		* @param {boolean} [options.force] Queue errors occurred while making files
		*     private until all files have been processed.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {MakeBucketPrivateCallback} [callback] Callback function.
		* @returns {Promise<MakeBucketPrivateResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Make the bucket private.
		* //-
		* bucket.makePrivate(function(err) {});
		*
		* //-
		* // Make the bucket and its contents private.
		* //-
		* const opts = {
		*   includeFiles: true
		* };
		*
		* bucket.makePrivate(opts, function(err, files) {
		*   // `err`:
		*   //    The first error to occur, otherwise null.
		*   //
		*   // `files`:
		*   //    Array of files successfully made private in the bucket.
		* });
		*
		* //-
		* // Make the bucket and its contents private, using force to suppress errors
		* // until all files have been processed.
		* //-
		* const opts = {
		*   includeFiles: true,
		*   force: true
		* };
		*
		* bucket.makePrivate(opts, function(errors, files) {
		*   // `errors`:
		*   //    Array of errors if any occurred, otherwise null.
		*   //
		*   // `files`:
		*   //    Array of files successfully made private in the bucket.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.makePrivate(opts).then(function(data) {
		*   const files = data[0];
		* });
		* ```
		*/
		makePrivate(optionsOrCallback, callback) {
			var _a, _b, _c, _d;
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			options.private = true;
			const query = { predefinedAcl: "projectPrivate" };
			if (options.userProject) query.userProject = options.userProject;
			if ((_a = options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) query.ifGenerationMatch = options.preconditionOpts.ifGenerationMatch;
			if ((_b = options.preconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationNotMatch) query.ifGenerationNotMatch = options.preconditionOpts.ifGenerationNotMatch;
			if ((_c = options.preconditionOpts) === null || _c === void 0 ? void 0 : _c.ifMetagenerationMatch) query.ifMetagenerationMatch = options.preconditionOpts.ifMetagenerationMatch;
			if ((_d = options.preconditionOpts) === null || _d === void 0 ? void 0 : _d.ifMetagenerationNotMatch) query.ifMetagenerationNotMatch = options.preconditionOpts.ifMetagenerationNotMatch;
			const metadata = {
				...options.metadata,
				acl: null
			};
			this.setMetadata(metadata, query, (err) => {
				if (err) callback(err);
				const internalCall = () => {
					if (options.includeFiles) return (0, util_1.promisify)(this.makeAllFilesPublicPrivate_).call(this, options);
					return Promise.resolve([]);
				};
				internalCall().then((files) => callback(null, files)).catch(callback);
			});
		}
		/**
		* @typedef {object} MakeBucketPublicOptions
		* @property {boolean} [includeFiles=false] Make each file in the bucket
		*     private.
		* @property {boolean} [force] Queue errors occurred while making files
		*     private until all files have been processed.
		*/
		/**
		* @callback MakeBucketPublicCallback
		* @param {?Error} err Request error, if any.
		* @param {File[]} files List of files made public.
		*/
		/**
		* @typedef {array} MakeBucketPublicResponse
		* @property {File[]} 0 List of files made public.
		*/
		/**
		* Make the bucket publicly readable.
		*
		* You may also choose to make the contents of the bucket publicly readable by
		* specifying `includeFiles: true`. This will automatically run
		* {@link File#makePublic} for every file in the bucket.
		*
		* When specifying `includeFiles: true`, use `force: true` to delay execution
		* of your callback until all files have been processed. By default, the
		* callback is executed after the first error. Use `force` to queue such
		* errors until all files have been processed, after which they will be
		* returned as an array as the first argument to your callback.
		*
		* NOTE: This may cause the process to be long-running and use a high number
		* of requests. Use with caution.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/patch| Buckets: patch API Documentation}
		*
		* @param {MakeBucketPublicOptions} [options] Configuration options.
		* @param {boolean} [options.includeFiles=false] Make each file in the bucket
		*     private.
		* @param {boolean} [options.force] Queue errors occurred while making files
		*     private until all files have been processed.
		* @param {MakeBucketPublicCallback} [callback] Callback function.
		* @returns {Promise<MakeBucketPublicResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Make the bucket publicly readable.
		* //-
		* bucket.makePublic(function(err) {});
		*
		* //-
		* // Make the bucket and its contents publicly readable.
		* //-
		* const opts = {
		*   includeFiles: true
		* };
		*
		* bucket.makePublic(opts, function(err, files) {
		*   // `err`:
		*   //    The first error to occur, otherwise null.
		*   //
		*   // `files`:
		*   //    Array of files successfully made public in the bucket.
		* });
		*
		* //-
		* // Make the bucket and its contents publicly readable, using force to
		* // suppress errors until all files have been processed.
		* //-
		* const opts = {
		*   includeFiles: true,
		*   force: true
		* };
		*
		* bucket.makePublic(opts, function(errors, files) {
		*   // `errors`:
		*   //    Array of errors if any occurred, otherwise null.
		*   //
		*   // `files`:
		*   //    Array of files successfully made public in the bucket.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.makePublic(opts).then(function(data) {
		*   const files = data[0];
		* });
		* ```
		*/
		makePublic(optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const req = {
				public: true,
				...options
			};
			this.acl.add({
				entity: "allUsers",
				role: "READER"
			}).then(() => {
				return this.acl.default.add({
					entity: "allUsers",
					role: "READER"
				});
			}).then(() => {
				if (req.includeFiles) return (0, util_1.promisify)(this.makeAllFilesPublicPrivate_).call(this, req);
				return [];
			}).then((files) => callback(null, files), callback);
		}
		/**
		* Get a reference to a Cloud Pub/Sub Notification.
		*
		* @param {string} id ID of notification.
		* @returns {Notification}
		* @see Notification
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const notification = bucket.notification('1');
		* ```
		*/
		notification(id) {
			if (!id) throw new Error(BucketExceptionMessages.SUPPLY_NOTIFICATION_ID);
			return new notification_js_1.Notification(this, id);
		}
		/**
		* Remove an already-existing retention policy from this bucket, if it is not
		* locked.
		*
		* @param {SetBucketMetadataCallback} [callback] Callback function.
		* @param {SetBucketMetadataOptions} [options] Options, including precondition options
		* @returns {Promise<SetBucketMetadataResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const bucket = storage.bucket('albums');
		*
		* bucket.removeRetentionPeriod(function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.removeRetentionPeriod().then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		removeRetentionPeriod(optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			this.setMetadata({ retentionPolicy: null }, options, callback);
		}
		/**
		* Makes request and applies userProject query parameter if necessary.
		*
		* @private
		*
		* @param {object} reqOpts - The request options.
		* @param {function} callback - The callback function.
		*/
		request(reqOpts, callback) {
			if (this.userProject && (!reqOpts.qs || !reqOpts.qs.userProject)) reqOpts.qs = {
				...reqOpts.qs,
				userProject: this.userProject
			};
			return super.request(reqOpts, callback);
		}
		/**
		* @deprecated
		* @typedef {array} SetLabelsResponse
		* @property {object} 0 The bucket metadata.
		*/
		/**
		* @deprecated
		* @callback SetLabelsCallback
		* @param {?Error} err Request error, if any.
		* @param {object} metadata The bucket metadata.
		*/
		/**
		* @deprecated
		* @typedef {object} SetLabelsOptions Configuration options for Bucket#setLabels().
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @deprecated Use setMetadata directly.
		* Set labels on the bucket.
		*
		* This makes an underlying call to {@link Bucket#setMetadata}, which
		* is a PATCH request. This means an individual label can be overwritten, but
		* unmentioned labels will not be touched.
		*
		* @param {object<string, string>} labels Labels to set on the bucket.
		* @param {SetLabelsOptions} [options] Configuration options.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {SetLabelsCallback} [callback] Callback function.
		* @returns {Promise<SetLabelsResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* const labels = {
		*   labelone: 'labelonevalue',
		*   labeltwo: 'labeltwovalue'
		* };
		*
		* bucket.setLabels(labels, function(err, metadata) {
		*   if (!err) {
		*     // Labels set successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.setLabels(labels).then(function(data) {
		*   const metadata = data[0];
		* });
		* ```
		*/
		setLabels(labels, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			callback = callback || index_js_1.util.noop;
			this.setMetadata({ labels }, options, callback);
		}
		setMetadata(metadata, optionsOrCallback, cb) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			cb = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			this.disableAutoRetryConditionallyIdempotent_(this.methods.setMetadata, AvailableServiceObjectMethods.setMetadata, options);
			super.setMetadata(metadata, options).then((resp) => cb(null, ...resp)).catch(cb).finally(() => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
			});
		}
		/**
		* Lock all objects contained in the bucket, based on their creation time. Any
		* attempt to overwrite or delete objects younger than the retention period
		* will result in a `PERMISSION_DENIED` error.
		*
		* An unlocked retention policy can be modified or removed from the bucket via
		* {@link File#removeRetentionPeriod} and {@link File#setRetentionPeriod}. A
		* locked retention policy cannot be removed or shortened in duration for the
		* lifetime of the bucket. Attempting to remove or decrease period of a locked
		* retention policy will result in a `PERMISSION_DENIED` error. You can still
		* increase the policy.
		*
		* @param {*} duration In seconds, the minimum retention time for all objects
		*     contained in this bucket.
		* @param {SetBucketMetadataCallback} [callback] Callback function.
		* @param {SetBucketMetadataCallback} [options] Options, including precondition options.
		* @returns {Promise<SetBucketMetadataResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const bucket = storage.bucket('albums');
		*
		* const DURATION_SECONDS = 15780000; // 6 months.
		*
		* //-
		* // Lock the objects in this bucket for 6 months.
		* //-
		* bucket.setRetentionPeriod(DURATION_SECONDS, function(err, apiResponse) {});
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.setRetentionPeriod(DURATION_SECONDS).then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		setRetentionPeriod(duration, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			this.setMetadata({ retentionPolicy: { retentionPeriod: duration.toString() } }, options, callback);
		}
		/**
		*
		* @typedef {object} Cors
		* @property {number} [maxAgeSeconds] The number of seconds the browser is
		*     allowed to make requests before it must repeat the preflight request.
		* @property {string[]} [method] HTTP method allowed for cross origin resource
		*     sharing with this bucket.
		* @property {string[]} [origin] an origin allowed for cross origin resource
		*     sharing with this bucket.
		* @property {string[]} [responseHeader] A header allowed for cross origin
		*     resource sharing with this bucket.
		*/
		/**
		* This can be used to set the CORS configuration on the bucket.
		*
		* The configuration will be overwritten with the value passed into this.
		*
		* @param {Cors[]} corsConfiguration The new CORS configuration to set
		* @param {number} [corsConfiguration.maxAgeSeconds] The number of seconds the browser is
		*     allowed to make requests before it must repeat the preflight request.
		* @param {string[]} [corsConfiguration.method] HTTP method allowed for cross origin resource
		*     sharing with this bucket.
		* @param {string[]} [corsConfiguration.origin] an origin allowed for cross origin resource
		*     sharing with this bucket.
		* @param {string[]} [corsConfiguration.responseHeader] A header allowed for cross origin
		*     resource sharing with this bucket.
		* @param {SetBucketMetadataCallback} [callback] Callback function.
		* @param {SetBucketMetadataOptions} [options] Options, including precondition options.
		* @returns {Promise<SetBucketMetadataResponse>}
		*
		* @example
		* ```
		* const storage = require('@google-cloud/storage')();
		* const bucket = storage.bucket('albums');
		*
		* const corsConfiguration = [{maxAgeSeconds: 3600}]; // 1 hour
		* bucket.setCorsConfiguration(corsConfiguration);
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.setCorsConfiguration(corsConfiguration).then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		setCorsConfiguration(corsConfiguration, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			this.setMetadata({ cors: corsConfiguration }, options, callback);
		}
		/**
		* @typedef {object} SetBucketStorageClassOptions
		* @property {string} [userProject] - The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @callback SetBucketStorageClassCallback
		* @param {?Error} err Request error, if any.
		*/
		/**
		* Set the default storage class for new files in this bucket.
		*
		* See {@link https://cloud.google.com/storage/docs/storage-classes| Storage Classes}
		*
		* @param {string} storageClass The new storage class. (`standard`,
		*     `nearline`, `coldline`, or `archive`).
		*     **Note:** The storage classes `multi_regional`, `regional`, and
		*     `durable_reduced_availability` are now legacy and will be deprecated in
		*     the future.
		* @param {object} [options] Configuration options.
		* @param {string} [options.userProject] - The ID of the project which will be
		*     billed for the request.
		* @param {SetStorageClassCallback} [callback] Callback function.
		* @returns {Promise}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.setStorageClass('nearline', function(err, apiResponse) {
		*   if (err) {
		*     // Error handling omitted.
		*   }
		*
		*   // The storage class was updated successfully.
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.setStorageClass('nearline').then(function() {});
		* ```
		*/
		setStorageClass(storageClass, optionsOrCallback, callback) {
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			storageClass = storageClass.replace(/-/g, "_").replace(/([a-z])([A-Z])/g, (_, low, up) => {
				return low + "_" + up;
			}).toUpperCase();
			this.setMetadata({ storageClass }, options, callback);
		}
		/**
		* Set a user project to be billed for all requests made from this Bucket
		* object and any files referenced from this Bucket object.
		*
		* @param {string} userProject The user project.
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* bucket.setUserProject('grape-spaceship-123');
		* ```
		*/
		setUserProject(userProject) {
			this.userProject = userProject;
			[
				"create",
				"delete",
				"exists",
				"get",
				"getMetadata",
				"setMetadata"
			].forEach((method) => {
				const methodConfig = this.methods[method];
				if (typeof methodConfig === "object") if (typeof methodConfig.reqOpts === "object") Object.assign(methodConfig.reqOpts.qs, { userProject });
				else methodConfig.reqOpts = { qs: { userProject } };
			});
		}
		/**
		* @typedef {object} UploadOptions Configuration options for Bucket#upload().
		* @property {string|File} [destination] The place to save
		*     your file. If given a string, the file will be uploaded to the bucket
		*     using the string as a filename. When given a File object, your local
		* file will be uploaded to the File object's bucket and under the File
		* object's name. Lastly, when this argument is omitted, the file is uploaded
		* to your bucket using the name of the local file.
		* @property {string} [encryptionKey] A custom encryption key. See
		*     {@link https://cloud.google.com/storage/docs/encryption#customer-supplied| Customer-supplied Encryption Keys}.
		* @property {boolean} [gzip] Automatically gzip the file. This will set
		*     `options.metadata.contentEncoding` to `gzip`.
		* @property {string} [kmsKeyName] The name of the Cloud KMS key that will
		*     be used to encrypt the object. Must be in the format:
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`.
		* @property {object} [metadata] See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request_properties_JSON| Objects: insert request body}.
		* @property {string} [offset] The starting byte of the upload stream, for
		*     resuming an interrupted upload. Defaults to 0.
		* @property {string} [predefinedAcl] Apply a predefined set of access
		* controls to this object.
		*
		* Acceptable values are:
		* - **`authenticatedRead`** - Object owner gets `OWNER` access, and
		*       `allAuthenticatedUsers` get `READER` access.
		*
		* - **`bucketOwnerFullControl`** - Object owner gets `OWNER` access, and
		*       project team owners get `OWNER` access.
		*
		* - **`bucketOwnerRead`** - Object owner gets `OWNER` access, and project
		*       team owners get `READER` access.
		*
		* - **`private`** - Object owner gets `OWNER` access.
		*
		* - **`projectPrivate`** - Object owner gets `OWNER` access, and project
		*       team members get access according to their roles.
		*
		* - **`publicRead`** - Object owner gets `OWNER` access, and `allUsers`
		*       get `READER` access.
		* @property {boolean} [private] Make the uploaded file private. (Alias for
		*     `options.predefinedAcl = 'private'`)
		* @property {boolean} [public] Make the uploaded file public. (Alias for
		*     `options.predefinedAcl = 'publicRead'`)
		* @property {boolean} [resumable=true] Resumable uploads are automatically
		*     enabled and must be shut off explicitly by setting to false.
		* @property {number} [timeout=60000] Set the HTTP request timeout in
		*     milliseconds. This option is not available for resumable uploads.
		*     Default: `60000`
		* @property {string} [uri] The URI for an already-created resumable
		*     upload. See {@link File#createResumableUpload}.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		* @property {string|boolean} [validation] Possible values: `"md5"`,
		*     `"crc32c"`, or `false`. By default, data integrity is validated with an
		*     MD5 checksum for maximum reliability. CRC32c will provide better
		*     performance with less reliability. You may also choose to skip
		* validation completely, however this is **not recommended**.
		*/
		/**
		* @typedef {array} UploadResponse
		* @property {object} 0 The uploaded {@link File}.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback UploadCallback
		* @param {?Error} err Request error, if any.
		* @param {object} file The uploaded {@link File}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Upload a file to the bucket. This is a convenience method that wraps
		* {@link File#createWriteStream}.
		*
		* Resumable uploads are enabled by default
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/how-tos/upload#uploads| Upload Options (Simple or Resumable)}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/objects/insert| Objects: insert API Documentation}
		*
		* @param {string} pathString The fully qualified path to the file you
		*     wish to upload to your bucket.
		* @param {UploadOptions} [options] Configuration options.
		* @param {string|File} [options.destination] The place to save
		*     your file. If given a string, the file will be uploaded to the bucket
		*     using the string as a filename. When given a File object, your local
		* file will be uploaded to the File object's bucket and under the File
		* object's name. Lastly, when this argument is omitted, the file is uploaded
		* to your bucket using the name of the local file.
		* @param {string} [options.encryptionKey] A custom encryption key. See
		*     {@link https://cloud.google.com/storage/docs/encryption#customer-supplied| Customer-supplied Encryption Keys}.
		* @param {boolean} [options.gzip] Automatically gzip the file. This will set
		*     `options.metadata.contentEncoding` to `gzip`.
		* @param {string} [options.kmsKeyName] The name of the Cloud KMS key that will
		*     be used to encrypt the object. Must be in the format:
		*     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`.
		* @param {object} [options.metadata] See an
		*     {@link https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request_properties_JSON| Objects: insert request body}.
		* @param {string} [options.offset] The starting byte of the upload stream, for
		*     resuming an interrupted upload. Defaults to 0.
		* @param {string} [options.predefinedAcl] Apply a predefined set of access
		* controls to this object.
		* Acceptable values are:
		* - **`authenticatedRead`** - Object owner gets `OWNER` access, and
		*   `allAuthenticatedUsers` get `READER` access.
		*
		* - **`bucketOwnerFullControl`** - Object owner gets `OWNER` access, and
		*   project team owners get `OWNER` access.
		*
		* - **`bucketOwnerRead`** - Object owner gets `OWNER` access, and project
		*   team owners get `READER` access.
		*
		* - **`private`** - Object owner gets `OWNER` access.
		*
		* - **`projectPrivate`** - Object owner gets `OWNER` access, and project
		*   team members get access according to their roles.
		*
		* - **`publicRead`** - Object owner gets `OWNER` access, and `allUsers`
		*   get `READER` access.
		* @param {boolean} [options.private] Make the uploaded file private. (Alias for
		*     `options.predefinedAcl = 'private'`)
		* @param {boolean} [options.public] Make the uploaded file public. (Alias for
		*     `options.predefinedAcl = 'publicRead'`)
		* @param {boolean} [options.resumable=true] Resumable uploads are automatically
		*     enabled and must be shut off explicitly by setting to false.
		* @param {number} [options.timeout=60000] Set the HTTP request timeout in
		*     milliseconds. This option is not available for resumable uploads.
		*     Default: `60000`
		* @param {string} [options.uri] The URI for an already-created resumable
		*     upload. See {@link File#createResumableUpload}.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		* @param {string|boolean} [options.validation] Possible values: `"md5"`,
		*     `"crc32c"`, or `false`. By default, data integrity is validated with an
		*     MD5 checksum for maximum reliability. CRC32c will provide better
		*     performance with less reliability. You may also choose to skip
		* validation completely, however this is **not recommended**.
		* @param {UploadCallback} [callback] Callback function.
		* @returns {Promise<UploadResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('albums');
		*
		* //-
		* // Upload a file from a local path.
		* //-
		* bucket.upload('/local/path/image.png', function(err, file, apiResponse) {
		*   // Your bucket now contains:
		*   // - "image.png" (with the contents of `/local/path/image.png')
		*
		*   // `file` is an instance of a File object that refers to your new file.
		* });
		*
		*
		* //-
		* // It's not always that easy. You will likely want to specify the filename
		* // used when your new file lands in your bucket.
		* //
		* // You may also want to set metadata or customize other options.
		* //-
		* const options = {
		*   destination: 'new-image.png',
		*   validation: 'crc32c',
		*   metadata: {
		*     metadata: {
		*       event: 'Fall trip to the zoo'
		*     }
		*   }
		* };
		*
		* bucket.upload('local-image.png', options, function(err, file) {
		*   // Your bucket now contains:
		*   // - "new-image.png" (with the contents of `local-image.png')
		*
		*   // `file` is an instance of a File object that refers to your new file.
		* });
		*
		* //-
		* // You can also have a file gzip'd on the fly.
		* //-
		* bucket.upload('index.html', { gzip: true }, function(err, file) {
		*   // Your bucket now contains:
		*   // - "index.html" (automatically compressed with gzip)
		*
		*   // Downloading the file with `file.download` will automatically decode
		* the
		*   // file.
		* });
		*
		* //-
		* // You may also re-use a File object, {File}, that references
		* // the file you wish to create or overwrite.
		* //-
		* const options = {
		*   destination: bucket.file('existing-file.png'),
		*   resumable: false
		* };
		*
		* bucket.upload('local-img.png', options, function(err, newFile) {
		*   // Your bucket now contains:
		*   // - "existing-file.png" (with the contents of `local-img.png')
		*
		*   // Note:
		*   // The `newFile` parameter is equal to `file`.
		* });
		*
		* //-
		* // To use
		* // <a
		* href="https://cloud.google.com/storage/docs/encryption#customer-supplied">
		* // Customer-supplied Encryption Keys</a>, provide the `encryptionKey`
		* option.
		* //-
		* const crypto = require('crypto');
		* const encryptionKey = crypto.randomBytes(32);
		*
		* bucket.upload('img.png', {
		*   encryptionKey: encryptionKey
		* }, function(err, newFile) {
		*   // `img.png` was uploaded with your custom encryption key.
		*
		*   // `newFile` is already configured to use the encryption key when making
		*   // operations on the remote object.
		*
		*   // However, to use your encryption key later, you must create a `File`
		*   // instance with the `key` supplied:
		*   const file = bucket.file('img.png', {
		*     encryptionKey: encryptionKey
		*   });
		*
		*   // Or with `file#setEncryptionKey`:
		*   const file = bucket.file('img.png');
		*   file.setEncryptionKey(encryptionKey);
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* bucket.upload('local-image.png').then(function(data) {
		*   const file = data[0];
		* });
		*
		* To upload a file from a URL, use {@link File#createWriteStream}.
		*
		* ```
		* @example <caption>include:samples/files.js</caption>
		* region_tag:storage_upload_file
		* Another example:
		*
		* @example <caption>include:samples/encryption.js</caption>
		* region_tag:storage_upload_encrypted_file
		* Example of uploading an encrypted file:
		*/
		upload(pathString, optionsOrCallback, callback) {
			var _a, _b;
			const upload = (numberOfRetries) => {
				const returnValue = (0, async_retry_1.default)(async (bail) => {
					await new Promise((resolve, reject) => {
						var _a, _b;
						if (numberOfRetries === 0 && ((_b = (_a = newFile === null || newFile === void 0 ? void 0 : newFile.storage) === null || _a === void 0 ? void 0 : _a.retryOptions) === null || _b === void 0 ? void 0 : _b.autoRetry)) newFile.storage.retryOptions.autoRetry = false;
						const writable = newFile.createWriteStream(options);
						if (options.onUploadProgress) writable.on("progress", options.onUploadProgress);
						fs.createReadStream(pathString).on("error", bail).pipe(writable).on("error", (err) => {
							if (this.storage.retryOptions.autoRetry && this.storage.retryOptions.retryableErrorFn(err)) return reject(err);
							else return bail(err);
						}).on("finish", () => {
							return resolve();
						});
					});
				}, {
					retries: numberOfRetries,
					factor: this.storage.retryOptions.retryDelayMultiplier,
					maxTimeout: this.storage.retryOptions.maxRetryDelay * 1e3,
					maxRetryTime: this.storage.retryOptions.totalTimeout * 1e3
				});
				if (!callback) return returnValue;
				else return returnValue.then(() => {
					if (callback) return callback(null, newFile, newFile.metadata);
				}).catch(callback);
			};
			if (global["GCLOUD_SANDBOX_ENV"]) return;
			let options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			options = Object.assign({ metadata: {} }, options);
			let maxRetries = this.storage.retryOptions.maxRetries;
			if (((_a = options === null || options === void 0 ? void 0 : options.preconditionOpts) === null || _a === void 0 ? void 0 : _a.ifGenerationMatch) === void 0 && ((_b = this.instancePreconditionOpts) === null || _b === void 0 ? void 0 : _b.ifGenerationMatch) === void 0 && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional || this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) maxRetries = 0;
			let newFile;
			if (options.destination instanceof file_js_1.File) newFile = options.destination;
			else if (options.destination !== null && typeof options.destination === "string") newFile = this.file(options.destination, {
				encryptionKey: options.encryptionKey,
				kmsKeyName: options.kmsKeyName,
				preconditionOpts: this.instancePreconditionOpts
			});
			else {
				const destination = path$1.basename(pathString);
				newFile = this.file(destination, {
					encryptionKey: options.encryptionKey,
					kmsKeyName: options.kmsKeyName,
					preconditionOpts: this.instancePreconditionOpts
				});
			}
			upload(maxRetries);
		}
		/**
		* @private
		*
		* @typedef {object} MakeAllFilesPublicPrivateOptions
		* @property {boolean} [force] Suppress errors until all files have been
		*     processed.
		* @property {boolean} [private] Make files private.
		* @property {boolean} [public] Make files public.
		* @property {string} [userProject] The ID of the project which will be
		*     billed for the request.
		*/
		/**
		* @private
		*
		* @callback SetBucketMetadataCallback
		* @param {?Error} err Request error, if any.
		* @param {File[]} files Files that were updated.
		*/
		/**
		* @typedef {array} MakeAllFilesPublicPrivateResponse
		* @property {File[]} 0 List of files affected.
		*/
		/**
		* Iterate over all of a bucket's files, calling `file.makePublic()` (public)
		* or `file.makePrivate()` (private) on each.
		*
		* Operations are performed in parallel, up to 10 at once. The first error
		* breaks the loop, and will execute the provided callback with it. Specify
		* `{ force: true }` to suppress the errors.
		*
		* @private
		*
		* @param {MakeAllFilesPublicPrivateOptions} [options] Configuration options.
		* @param {boolean} [options.force] Suppress errors until all files have been
		*     processed.
		* @param {boolean} [options.private] Make files private.
		* @param {boolean} [options.public] Make files public.
		* @param {string} [options.userProject] The ID of the project which will be
		*     billed for the request.
		
		* @param {MakeAllFilesPublicPrivateCallback} callback Callback function.
		*
		* @return {Promise<MakeAllFilesPublicPrivateResponse>}
		*/
		makeAllFilesPublicPrivate_(optionsOrCallback, callback) {
			const MAX_PARALLEL_LIMIT = 10;
			const errors = [];
			const updatedFiles = [];
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			callback = typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			const processFile = async (file) => {
				try {
					await (options.public ? file.makePublic() : file.makePrivate(options));
					updatedFiles.push(file);
				} catch (e) {
					if (!options.force) throw e;
					errors.push(e);
				}
			};
			this.getFiles(options).then(([files]) => {
				const limit = (0, p_limit_1.default)(MAX_PARALLEL_LIMIT);
				const promises = files.map((file) => {
					return limit(() => processFile(file));
				});
				return Promise.all(promises);
			}).then(() => callback(errors.length > 0 ? errors : null, updatedFiles), (err) => callback(err, updatedFiles));
		}
		getId() {
			return this.id;
		}
		disableAutoRetryConditionallyIdempotent_(coreOpts, methodType, localPreconditionOptions) {
			var _a, _b;
			if (typeof coreOpts === "object" && ((_b = (_a = coreOpts === null || coreOpts === void 0 ? void 0 : coreOpts.reqOpts) === null || _a === void 0 ? void 0 : _a.qs) === null || _b === void 0 ? void 0 : _b.ifMetagenerationMatch) === void 0 && (localPreconditionOptions === null || localPreconditionOptions === void 0 ? void 0 : localPreconditionOptions.ifMetagenerationMatch) === void 0 && (methodType === AvailableServiceObjectMethods.setMetadata || methodType === AvailableServiceObjectMethods.delete) && this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryConditional) this.storage.retryOptions.autoRetry = false;
			else if (this.storage.retryOptions.idempotencyStrategy === storage_js_1.IdempotencyStrategy.RetryNever) this.storage.retryOptions.autoRetry = false;
		}
	};
	exports.Bucket = Bucket;
	/*! Developer Documentation
	*
	* These methods can be auto-paginated.
	*/
	paginator_1.paginator.extend(Bucket, "getFiles");
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Bucket, { exclude: [
		"cloudStorageURI",
		"request",
		"file",
		"notification",
		"restore"
	] });
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/channel.js
var require_channel = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Channel = void 0;
	var index_js_1 = require_nodejs_common();
	var promisify_1 = require_src$11();
	/**
	* Create a channel object to interact with a Cloud Storage channel.
	*
	* See {@link https://cloud.google.com/storage/docs/object-change-notification| Object Change Notification}
	*
	* @class
	*
	* @param {string} id The ID of the channel.
	* @param {string} resourceId The resource ID of the channel.
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const channel = storage.channel('id', 'resource-id');
	* ```
	*/
	var Channel = class extends index_js_1.ServiceObject {
		constructor(storage, id, resourceId) {
			super({
				parent: storage,
				baseUrl: "/channels",
				id: "",
				methods: {}
			});
			this.metadata.id = id;
			this.metadata.resourceId = resourceId;
		}
		/**
		* @typedef {array} StopResponse
		* @property {object} 0 The full API response.
		*/
		/**
		* @callback StopCallback
		* @param {?Error} err Request error, if any.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Stop this channel.
		*
		* @param {StopCallback} [callback] Callback function.
		* @returns {Promise<StopResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const channel = storage.channel('id', 'resource-id');
		* channel.stop(function(err, apiResponse) {
		*   if (!err) {
		*     // Channel stopped successfully.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* channel.stop().then(function(data) {
		*   const apiResponse = data[0];
		* });
		* ```
		*/
		stop(callback) {
			callback = callback || index_js_1.util.noop;
			this.request({
				method: "POST",
				uri: "/stop",
				json: this.metadata
			}, (err, apiResponse) => {
				callback(err, apiResponse);
			});
		}
	};
	exports.Channel = Channel;
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Channel);
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/hmacKey.js
var require_hmacKey = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HmacKey = void 0;
	var index_js_1 = require_nodejs_common();
	var storage_js_1 = require_storage();
	var promisify_1 = require_src$11();
	/**
	* The API-formatted resource description of the HMAC key.
	*
	* Note: This is not guaranteed to be up-to-date when accessed. To get the
	* latest record, call the `getMetadata()` method.
	*
	* @name HmacKey#metadata
	* @type {object}
	*/
	/**
	* An HmacKey object contains metadata of an HMAC key created from a
	* service account through the {@link Storage} client using
	* {@link Storage#createHmacKey}.
	*
	* See {@link https://cloud.google.com/storage/docs/authentication/hmackeys| HMAC keys documentation}
	*
	* @class
	*/
	var HmacKey = class extends index_js_1.ServiceObject {
		/**
		* @typedef {object} HmacKeyOptions
		* @property {string} [projectId] The project ID of the project that owns
		*     the service account of the requested HMAC key. If not provided,
		*     the project ID used to instantiate the Storage client will be used.
		*/
		/**
		* Constructs an HmacKey object.
		*
		* Note: this only create a local reference to an HMAC key, to create
		* an HMAC key, use {@link Storage#createHmacKey}.
		*
		* @param {Storage} storage The Storage instance this HMAC key is
		*     attached to.
		* @param {string} accessId The unique accessId for this HMAC key.
		* @param {HmacKeyOptions} options Constructor configurations.
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const hmacKey = storage.hmacKey('access-id');
		* ```
		*/
		constructor(storage, accessId, options) {
			const methods = {
				/**
				* @typedef {object} DeleteHmacKeyOptions
				* @property {string} [userProject] This parameter is currently ignored.
				*/
				/**
				* @typedef {array} DeleteHmacKeyResponse
				* @property {object} 0 The full API response.
				*/
				/**
				* @callback DeleteHmacKeyCallback
				* @param {?Error} err Request error, if any.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* Deletes an HMAC key.
				* Key state must be set to `INACTIVE` prior to deletion.
				* Caution: HMAC keys cannot be recovered once you delete them.
				*
				* The authenticated user must have `storage.hmacKeys.delete` permission for the project in which the key exists.
				*
				* @method HmacKey#delete
				* @param {DeleteHmacKeyOptions} [options] Configuration options.
				* @param {DeleteHmacKeyCallback} [callback] Callback function.
				* @returns {Promise<DeleteHmacKeyResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				*
				* //-
				* // Delete HMAC key after making the key inactive.
				* //-
				* const hmacKey = storage.hmacKey('ACCESS_ID');
				* hmacKey.setMetadata({state: 'INACTIVE'}, (err, hmacKeyMetadata) => {
				*     if (err) {
				*       // The request was an error.
				*       console.error(err);
				*       return;
				*     }
				*     hmacKey.delete((err) => {
				*       if (err) {
				*         console.error(err);
				*         return;
				*       }
				*       // The HMAC key is deleted.
				*     });
				*   });
				*
				* //-
				* // If the callback is omitted, a promise is returned.
				* //-
				* const hmacKey = storage.hmacKey('ACCESS_ID');
				* hmacKey
				*   .setMetadata({state: 'INACTIVE'})
				*   .then(() => {
				*     return hmacKey.delete();
				*   });
				* ```
				*/
				delete: true,
				/**
				* @callback GetHmacKeyCallback
				* @param {?Error} err Request error, if any.
				* @param {HmacKey} hmacKey this {@link HmacKey} instance.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* @typedef {array} GetHmacKeyResponse
				* @property {HmacKey} 0 This {@link HmacKey} instance.
				* @property {object} 1 The full API response.
				*/
				/**
				* @typedef {object} GetHmacKeyOptions
				* @property {string} [userProject] This parameter is currently ignored.
				*/
				/**
				* Retrieves and populate an HMAC key's metadata, and return
				* this {@link HmacKey} instance.
				*
				* HmacKey.get() does not give the HMAC key secret, as
				* it is only returned on creation.
				*
				* The authenticated user must have `storage.hmacKeys.get` permission
				* for the project in which the key exists.
				*
				* @method HmacKey#get
				* @param {GetHmacKeyOptions} [options] Configuration options.
				* @param {GetHmacKeyCallback} [callback] Callback function.
				* @returns {Promise<GetHmacKeyResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				*
				* //-
				* // Get the HmacKey's Metadata.
				* //-
				* storage.hmacKey('ACCESS_ID')
				*   .get((err, hmacKey) => {
				*     if (err) {
				*       // The request was an error.
				*       console.error(err);
				*       return;
				*     }
				*     // do something with the returned HmacKey object.
				*   });
				*
				* //-
				* // If the callback is omitted, a promise is returned.
				* //-
				* storage.hmacKey('ACCESS_ID')
				*   .get()
				*   .then((data) => {
				*     const hmacKey = data[0];
				*   });
				* ```
				*/
				get: true,
				/**
				* @typedef {object} GetHmacKeyMetadataOptions
				* @property {string} [userProject] This parameter is currently ignored.
				*/
				/**
				* Retrieves and populate an HMAC key's metadata, and return
				* the HMAC key's metadata as an object.
				*
				* HmacKey.getMetadata() does not give the HMAC key secret, as
				* it is only returned on creation.
				*
				* The authenticated user must have `storage.hmacKeys.get` permission
				* for the project in which the key exists.
				*
				* @method HmacKey#getMetadata
				* @param {GetHmacKeyMetadataOptions} [options] Configuration options.
				* @param {HmacKeyMetadataCallback} [callback] Callback function.
				* @returns {Promise<HmacKeyMetadataResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				*
				* //-
				* // Get the HmacKey's metadata and populate to the metadata property.
				* //-
				* storage.hmacKey('ACCESS_ID')
				*   .getMetadata((err, hmacKeyMetadata) => {
				*     if (err) {
				*       // The request was an error.
				*       console.error(err);
				*       return;
				*     }
				*     console.log(hmacKeyMetadata);
				*   });
				*
				* //-
				* // If the callback is omitted, a promise is returned.
				* //-
				* storage.hmacKey('ACCESS_ID')
				*   .getMetadata()
				*   .then((data) => {
				*     const hmacKeyMetadata = data[0];
				*     console.log(hmacKeyMetadata);
				*   });
				* ```
				*/
				getMetadata: true,
				/**
				* @typedef {object} SetHmacKeyMetadata Subset of {@link HmacKeyMetadata} to update.
				* @property {string} state New state of the HmacKey. Either 'ACTIVE' or 'INACTIVE'.
				* @property {string} [etag] Include an etag from a previous get HMAC key request
				*    to perform safe read-modify-write.
				*/
				/**
				* @typedef {object} SetHmacKeyMetadataOptions
				* @property {string} [userProject] This parameter is currently ignored.
				*/
				/**
				* @callback HmacKeyMetadataCallback
				* @param {?Error} err Request error, if any.
				* @param {HmacKeyMetadata} metadata The updated {@link HmacKeyMetadata} object.
				* @param {object} apiResponse The full API response.
				*/
				/**
				* @typedef {array} HmacKeyMetadataResponse
				* @property {HmacKeyMetadata} 0 The updated {@link HmacKeyMetadata} object.
				* @property {object} 1 The full API response.
				*/
				/**
				* Updates the state of an HMAC key. See {@link SetHmacKeyMetadata} for
				* valid states.
				*
				* @method HmacKey#setMetadata
				* @param {SetHmacKeyMetadata} metadata The new metadata.
				* @param {SetHmacKeyMetadataOptions} [options] Configuration options.
				* @param {HmacKeyMetadataCallback} [callback] Callback function.
				* @returns {Promise<HmacKeyMetadataResponse>}
				*
				* @example
				* ```
				* const {Storage} = require('@google-cloud/storage');
				* const storage = new Storage();
				*
				* const metadata = {
				*   state: 'INACTIVE',
				* };
				*
				* storage.hmacKey('ACCESS_ID')
				*   .setMetadata(metadata, (err, hmacKeyMetadata) => {
				*     if (err) {
				*       // The request was an error.
				*       console.error(err);
				*       return;
				*     }
				*     console.log(hmacKeyMetadata);
				*   });
				*
				* //-
				* // If the callback is omitted, a promise is returned.
				* //-
				* storage.hmacKey('ACCESS_ID')
				*   .setMetadata(metadata)
				*   .then((data) => {
				*     const hmacKeyMetadata = data[0];
				*     console.log(hmacKeyMetadata);
				*   });
				* ```
				*/
				setMetadata: { reqOpts: { method: "PUT" } }
			};
			const projectId = options && options.projectId || storage.projectId;
			super({
				parent: storage,
				id: accessId,
				baseUrl: `/projects/${projectId}/hmacKeys`,
				methods
			});
			this.storage = storage;
			this.instanceRetryValue = storage.retryOptions.autoRetry;
		}
		setMetadata(metadata, optionsOrCallback, cb) {
			if (this.storage.retryOptions.idempotencyStrategy !== storage_js_1.IdempotencyStrategy.RetryAlways) this.storage.retryOptions.autoRetry = false;
			const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
			cb = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
			super.setMetadata(metadata, options).then((resp) => cb(null, ...resp)).catch(cb).finally(() => {
				this.storage.retryOptions.autoRetry = this.instanceRetryValue;
			});
		}
	};
	exports.HmacKey = HmacKey;
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(HmacKey);
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/storage.js
var require_storage = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Storage = exports.RETRYABLE_ERR_FN_DEFAULT = exports.MAX_RETRY_DELAY_DEFAULT = exports.TOTAL_TIMEOUT_DEFAULT = exports.RETRY_DELAY_MULTIPLIER_DEFAULT = exports.MAX_RETRY_DEFAULT = exports.AUTO_RETRY_DEFAULT = exports.PROTOCOL_REGEX = exports.StorageExceptionMessages = exports.ExceptionMessages = exports.IdempotencyStrategy = void 0;
	var index_js_1 = require_nodejs_common();
	var paginator_1 = require_src$12();
	var promisify_1 = require_src$11();
	var stream_1 = __require("stream");
	var bucket_js_1 = require_bucket();
	var channel_js_1 = require_channel();
	var file_js_1 = require_file();
	var util_js_1 = require_util$1();
	var package_json_helper_cjs_1 = require_package_json_helper();
	var hmacKey_js_1 = require_hmacKey();
	var crc32c_js_1 = require_crc32c();
	var google_auth_library_1 = require_src$4();
	var IdempotencyStrategy;
	(function(IdempotencyStrategy) {
		IdempotencyStrategy[IdempotencyStrategy["RetryAlways"] = 0] = "RetryAlways";
		IdempotencyStrategy[IdempotencyStrategy["RetryConditional"] = 1] = "RetryConditional";
		IdempotencyStrategy[IdempotencyStrategy["RetryNever"] = 2] = "RetryNever";
	})(IdempotencyStrategy || (exports.IdempotencyStrategy = IdempotencyStrategy = {}));
	var ExceptionMessages;
	(function(ExceptionMessages) {
		ExceptionMessages["EXPIRATION_DATE_INVALID"] = "The expiration date provided was invalid.";
		ExceptionMessages["EXPIRATION_DATE_PAST"] = "An expiration date cannot be in the past.";
	})(ExceptionMessages || (exports.ExceptionMessages = ExceptionMessages = {}));
	var StorageExceptionMessages;
	(function(StorageExceptionMessages) {
		StorageExceptionMessages["BUCKET_NAME_REQUIRED"] = "A bucket name is needed to use Cloud Storage.";
		StorageExceptionMessages["BUCKET_NAME_REQUIRED_CREATE"] = "A name is required to create a bucket.";
		StorageExceptionMessages["HMAC_SERVICE_ACCOUNT"] = "The first argument must be a service account email to create an HMAC key.";
		StorageExceptionMessages["HMAC_ACCESS_ID"] = "An access ID is needed to create an HmacKey object.";
	})(StorageExceptionMessages || (exports.StorageExceptionMessages = StorageExceptionMessages = {}));
	exports.PROTOCOL_REGEX = /^(\w*):\/\//;
	/**
	* Default behavior: Automatically retry retriable server errors.
	*
	* @const {boolean}
	*/
	exports.AUTO_RETRY_DEFAULT = true;
	/**
	* Default behavior: Only attempt to retry retriable errors 3 times.
	*
	* @const {number}
	*/
	exports.MAX_RETRY_DEFAULT = 3;
	/**
	* Default behavior: Wait twice as long as previous retry before retrying.
	*
	* @const {number}
	*/
	exports.RETRY_DELAY_MULTIPLIER_DEFAULT = 2;
	/**
	* Default behavior: If the operation doesn't succeed after 600 seconds,
	*  stop retrying.
	*
	* @const {number}
	*/
	exports.TOTAL_TIMEOUT_DEFAULT = 600;
	/**
	* Default behavior: Wait no more than 64 seconds between retries.
	*
	* @const {number}
	*/
	exports.MAX_RETRY_DELAY_DEFAULT = 64;
	/**
	* Default behavior: Retry conditionally idempotent operations if correct preconditions are set.
	*
	* @const {enum}
	* @private
	*/
	var IDEMPOTENCY_STRATEGY_DEFAULT = IdempotencyStrategy.RetryConditional;
	/**
	* Returns true if the API request should be retried, given the error that was
	* given the first time the request was attempted.
	* @const
	* @param {error} err - The API error to check if it is appropriate to retry.
	* @return {boolean} True if the API request should be retried, false otherwise.
	*/
	var RETRYABLE_ERR_FN_DEFAULT = function(err) {
		var _a;
		const isConnectionProblem = (reason) => {
			return reason.includes("eai_again") || reason === "econnreset" || reason === "unexpected connection closure" || reason === "epipe" || reason === "socket connection timeout";
		};
		if (err) {
			if ([
				408,
				429,
				500,
				502,
				503,
				504
			].indexOf(err.code) !== -1) return true;
			if (typeof err.code === "string") {
				if ([
					"408",
					"429",
					"500",
					"502",
					"503",
					"504"
				].indexOf(err.code) !== -1) return true;
				if (isConnectionProblem(err.code.toLowerCase())) return true;
			}
			if (err.errors) for (const e of err.errors) {
				const reason = (_a = e === null || e === void 0 ? void 0 : e.reason) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
				if (reason && isConnectionProblem(reason)) return true;
			}
		}
		return false;
	};
	exports.RETRYABLE_ERR_FN_DEFAULT = RETRYABLE_ERR_FN_DEFAULT;
	/*! Developer Documentation
	*
	* Invoke this method to create a new Storage object bound with pre-determined
	* configuration options. For each object that can be created (e.g., a bucket),
	* there is an equivalent static and instance method. While they are classes,
	* they can be instantiated without use of the `new` keyword.
	*/
	/**
	* Cloud Storage uses access control lists (ACLs) to manage object and
	* bucket access. ACLs are the mechanism you use to share objects with other
	* users and allow other users to access your buckets and objects.
	*
	* This object provides constants to refer to the three permission levels that
	* can be granted to an entity:
	*
	*   - `gcs.acl.OWNER_ROLE` - ("OWNER")
	*   - `gcs.acl.READER_ROLE` - ("READER")
	*   - `gcs.acl.WRITER_ROLE` - ("WRITER")
	*
	* See {@link https://cloud.google.com/storage/docs/access-control/lists| About Access Control Lists}
	*
	* @name Storage#acl
	* @type {object}
	* @property {string} OWNER_ROLE
	* @property {string} READER_ROLE
	* @property {string} WRITER_ROLE
	*
	* @example
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* const storage = new Storage();
	* const albums = storage.bucket('albums');
	*
	* //-
	* // Make all of the files currently in a bucket publicly readable.
	* //-
	* const options = {
	*   entity: 'allUsers',
	*   role: storage.acl.READER_ROLE
	* };
	*
	* albums.acl.add(options, function(err, aclObject) {});
	*
	* //-
	* // Make any new objects added to a bucket publicly readable.
	* //-
	* albums.acl.default.add(options, function(err, aclObject) {});
	*
	* //-
	* // Grant a user ownership permissions to a bucket.
	* //-
	* albums.acl.add({
	*   entity: 'user-useremail@example.com',
	*   role: storage.acl.OWNER_ROLE
	* }, function(err, aclObject) {});
	*
	* //-
	* // If the callback is omitted, we'll return a Promise.
	* //-
	* albums.acl.add(options).then(function(data) {
	*   const aclObject = data[0];
	*   const apiResponse = data[1];
	* });
	* ```
	*/
	/**
	* Get {@link Bucket} objects for all of the buckets in your project as
	* a readable object stream.
	*
	* @method Storage#getBucketsStream
	* @param {GetBucketsRequest} [query] Query object for listing buckets.
	* @returns {ReadableStream} A readable stream that emits {@link Bucket}
	*     instances.
	*
	* @example
	* ```
	* storage.getBucketsStream()
	*   .on('error', console.error)
	*   .on('data', function(bucket) {
	*     // bucket is a Bucket object.
	*   })
	*   .on('end', function() {
	*     // All buckets retrieved.
	*   });
	*
	* //-
	* // If you anticipate many results, you can end a stream early to prevent
	* // unnecessary processing and API requests.
	* //-
	* storage.getBucketsStream()
	*   .on('data', function(bucket) {
	*     this.end();
	*   });
	* ```
	*/
	/**
	* Get {@link HmacKey} objects for all of the HMAC keys in the project in a
	* readable object stream.
	*
	* @method Storage#getHmacKeysStream
	* @param {GetHmacKeysOptions} [options] Configuration options.
	* @returns {ReadableStream} A readable stream that emits {@link HmacKey}
	*     instances.
	*
	* @example
	* ```
	* storage.getHmacKeysStream()
	*   .on('error', console.error)
	*   .on('data', function(hmacKey) {
	*     // hmacKey is an HmacKey object.
	*   })
	*   .on('end', function() {
	*     // All HmacKey retrieved.
	*   });
	*
	* //-
	* // If you anticipate many results, you can end a stream early to prevent
	* // unnecessary processing and API requests.
	* //-
	* storage.getHmacKeysStream()
	*   .on('data', function(bucket) {
	*     this.end();
	*   });
	* ```
	*/
	/**
	* <h4>ACLs</h4>
	* Cloud Storage uses access control lists (ACLs) to manage object and
	* bucket access. ACLs are the mechanism you use to share files with other users
	* and allow other users to access your buckets and files.
	*
	* To learn more about ACLs, read this overview on
	* {@link https://cloud.google.com/storage/docs/access-control| Access Control}.
	*
	* See {@link https://cloud.google.com/storage/docs/overview| Cloud Storage overview}
	* See {@link https://cloud.google.com/storage/docs/access-control| Access Control}
	*
	* @class
	*/
	var Storage = class Storage extends index_js_1.Service {
		getBucketsStream() {
			return new stream_1.Readable();
		}
		getHmacKeysStream() {
			return new stream_1.Readable();
		}
		/**
		* @callback Crc32cGeneratorToStringCallback
		* A method returning the CRC32C as a base64-encoded string.
		*
		* @returns {string}
		*
		* @example
		* Hashing the string 'data' should return 'rth90Q=='
		*
		* ```js
		* const buffer = Buffer.from('data');
		* crc32c.update(buffer);
		* crc32c.toString(); // 'rth90Q=='
		* ```
		**/
		/**
		* @callback Crc32cGeneratorValidateCallback
		* A method validating a base64-encoded CRC32C string.
		*
		* @param {string} [value] base64-encoded CRC32C string to validate
		* @returns {boolean}
		*
		* @example
		* Should return `true` if the value matches, `false` otherwise
		*
		* ```js
		* const buffer = Buffer.from('data');
		* crc32c.update(buffer);
		* crc32c.validate('DkjKuA=='); // false
		* crc32c.validate('rth90Q=='); // true
		* ```
		**/
		/**
		* @callback Crc32cGeneratorUpdateCallback
		* A method for passing `Buffer`s for CRC32C generation.
		*
		* @param {Buffer} [data] data to update CRC32C value with
		* @returns {undefined}
		*
		* @example
		* Hashing buffers from 'some ' and 'text\n'
		*
		* ```js
		* const buffer1 = Buffer.from('some ');
		* crc32c.update(buffer1);
		*
		* const buffer2 = Buffer.from('text\n');
		* crc32c.update(buffer2);
		*
		* crc32c.toString(); // 'DkjKuA=='
		* ```
		**/
		/**
		* @typedef {object} CRC32CValidator
		* @property {Crc32cGeneratorToStringCallback}
		* @property {Crc32cGeneratorValidateCallback}
		* @property {Crc32cGeneratorUpdateCallback}
		*/
		/**
		* @callback Crc32cGeneratorCallback
		* @returns {CRC32CValidator}
		*/
		/**
		* @typedef {object} StorageOptions
		* @property {string} [projectId] The project ID from the Google Developer's
		*     Console, e.g. 'grape-spaceship-123'. We will also check the environment
		*     variable `GCLOUD_PROJECT` for your project ID. If your app is running
		* in an environment which supports {@link
		* https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application
		* Application Default Credentials}, your project ID will be detected
		* automatically.
		* @property {string} [keyFilename] Full path to the a .json, .pem, or .p12 key
		*     downloaded from the Google Developers Console. If you provide a path to
		* a JSON file, the `projectId` option above is not necessary. NOTE: .pem and
		*     .p12 require you to specify the `email` option as well.
		* @property {string} [email] Account email address. Required when using a .pem
		*     or .p12 keyFilename.
		* @property {object} [credentials] Credentials object.
		* @property {string} [credentials.client_email]
		* @property {string} [credentials.private_key]
		* @property {object} [retryOptions] Options for customizing retries. Retriable server errors
		*     will be retried with exponential delay between them dictated by the formula
		*     max(maxRetryDelay, retryDelayMultiplier*retryNumber) until maxRetries or totalTimeout
		*     has been reached. Retries will only happen if autoRetry is set to true.
		* @property {boolean} [retryOptions.autoRetry=true] Automatically retry requests if the
		*     response is related to rate limits or certain intermittent server
		* errors. We will exponentially backoff subsequent requests by default.
		* @property {number} [retryOptions.retryDelayMultiplier = 2] the multiplier by which to
		*   increase the delay time between the completion of failed requests, and the
		*   initiation of the subsequent retrying request.
		* @property {number} [retryOptions.totalTimeout = 600] The total time, starting from
		*  when the initial request is sent, after which an error will
		*   be returned, regardless of the retrying attempts made meanwhile.
		* @property {number} [retryOptions.maxRetryDelay = 64] The maximum delay time between requests.
		*   When this value is reached, ``retryDelayMultiplier`` will no longer be used to
		*   increase delay time.
		* @property {number} [retryOptions.maxRetries=3] Maximum number of automatic retries
		*     attempted before returning the error.
		* @property {function} [retryOptions.retryableErrorFn] Function that returns true if a given
		*     error should be retried and false otherwise.
		* @property {enum} [retryOptions.idempotencyStrategy=IdempotencyStrategy.RetryConditional] Enumeration
		*     controls how conditionally idempotent operations are retried. Possible values are: RetryAlways -
		*     will respect other retry settings and attempt to retry conditionally idempotent operations. RetryConditional -
		*     will retry conditionally idempotent operations if the correct preconditions are set. RetryNever - never
		*     retry a conditionally idempotent operation.
		* @property {string} [userAgent] The value to be prepended to the User-Agent
		*     header in API requests.
		* @property {object} [authClient] `AuthClient` or `GoogleAuth` client to reuse instead of creating a new one.
		* @property {number} [timeout] The amount of time in milliseconds to wait per http request before timing out.
		* @property {object[]} [interceptors_] Array of custom request interceptors to be returned in the order they were assigned.
		* @property {string} [apiEndpoint = storage.google.com] The API endpoint of the service used to make requests.
		* @property {boolean} [useAuthWithCustomEndpoint = false] Controls whether or not to use authentication when using a custom endpoint.
		* @property {Crc32cGeneratorCallback} [callback] A function that generates a CRC32C Validator. Defaults to {@link CRC32C}
		*/
		/**
		* Constructs the Storage client.
		*
		* @example
		* Create a client that uses Application Default Credentials
		* (ADC)
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* ```
		*
		* @example
		* Create a client with explicit credentials
		* ```
		* const storage = new Storage({
		*   projectId: 'your-project-id',
		*   keyFilename: '/path/to/keyfile.json'
		* });
		* ```
		*
		* @example
		* Create a client with credentials passed
		* by value as a JavaScript object
		* ```
		* const storage = new Storage({
		*   projectId: 'your-project-id',
		*   credentials: {
		*     type: 'service_account',
		*     project_id: 'xxxxxxx',
		*     private_key_id: 'xxxx',
		*     private_key:'-----BEGIN PRIVATE KEY-----xxxxxxx\n-----END PRIVATE KEY-----\n',
		*     client_email: 'xxxx',
		*     client_id: 'xxx',
		*     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		*     token_uri: 'https://oauth2.googleapis.com/token',
		*     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		*     client_x509_cert_url: 'xxx',
		*     }
		* });
		* ```
		*
		* @example
		* Create a client with credentials passed
		* by loading a JSON file directly from disk
		* ```
		* const storage = new Storage({
		*   projectId: 'your-project-id',
		*   credentials: require('/path/to-keyfile.json')
		* });
		* ```
		*
		* @example
		* Create a client with an `AuthClient` (e.g. `DownscopedClient`)
		* ```
		* const {DownscopedClient} = require('google-auth-library');
		* const authClient = new DownscopedClient({...});
		*
		* const storage = new Storage({authClient});
		* ```
		*
		* Additional samples:
		* - https://github.com/googleapis/google-auth-library-nodejs#sample-usage-1
		* - https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/downscopedclient.js
		*
		* @param {StorageOptions} [options] Configuration options.
		*/
		constructor(options = {}) {
			var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
			let apiEndpoint = `https://storage.${options.universeDomain || google_auth_library_1.DEFAULT_UNIVERSE}`;
			let customEndpoint = false;
			const EMULATOR_HOST = process.env.STORAGE_EMULATOR_HOST;
			if (typeof EMULATOR_HOST === "string") {
				apiEndpoint = Storage.sanitizeEndpoint(EMULATOR_HOST);
				customEndpoint = true;
			}
			if (options.apiEndpoint && options.apiEndpoint !== apiEndpoint) {
				apiEndpoint = Storage.sanitizeEndpoint(options.apiEndpoint);
				customEndpoint = true;
			}
			options = Object.assign({}, options, { apiEndpoint });
			const baseUrl = EMULATOR_HOST || `${options.apiEndpoint}/storage/v1`;
			const config = {
				apiEndpoint: options.apiEndpoint,
				retryOptions: {
					autoRetry: ((_a = options.retryOptions) === null || _a === void 0 ? void 0 : _a.autoRetry) !== void 0 ? (_b = options.retryOptions) === null || _b === void 0 ? void 0 : _b.autoRetry : exports.AUTO_RETRY_DEFAULT,
					maxRetries: ((_c = options.retryOptions) === null || _c === void 0 ? void 0 : _c.maxRetries) ? (_d = options.retryOptions) === null || _d === void 0 ? void 0 : _d.maxRetries : exports.MAX_RETRY_DEFAULT,
					retryDelayMultiplier: ((_e = options.retryOptions) === null || _e === void 0 ? void 0 : _e.retryDelayMultiplier) ? (_f = options.retryOptions) === null || _f === void 0 ? void 0 : _f.retryDelayMultiplier : exports.RETRY_DELAY_MULTIPLIER_DEFAULT,
					totalTimeout: ((_g = options.retryOptions) === null || _g === void 0 ? void 0 : _g.totalTimeout) ? (_h = options.retryOptions) === null || _h === void 0 ? void 0 : _h.totalTimeout : exports.TOTAL_TIMEOUT_DEFAULT,
					maxRetryDelay: ((_j = options.retryOptions) === null || _j === void 0 ? void 0 : _j.maxRetryDelay) ? (_k = options.retryOptions) === null || _k === void 0 ? void 0 : _k.maxRetryDelay : exports.MAX_RETRY_DELAY_DEFAULT,
					retryableErrorFn: ((_l = options.retryOptions) === null || _l === void 0 ? void 0 : _l.retryableErrorFn) ? (_m = options.retryOptions) === null || _m === void 0 ? void 0 : _m.retryableErrorFn : exports.RETRYABLE_ERR_FN_DEFAULT,
					idempotencyStrategy: ((_o = options.retryOptions) === null || _o === void 0 ? void 0 : _o.idempotencyStrategy) !== void 0 ? (_p = options.retryOptions) === null || _p === void 0 ? void 0 : _p.idempotencyStrategy : IDEMPOTENCY_STRATEGY_DEFAULT
				},
				baseUrl,
				customEndpoint,
				useAuthWithCustomEndpoint: options === null || options === void 0 ? void 0 : options.useAuthWithCustomEndpoint,
				projectIdRequired: false,
				scopes: [
					"https://www.googleapis.com/auth/iam",
					"https://www.googleapis.com/auth/cloud-platform",
					"https://www.googleapis.com/auth/devstorage.full_control"
				],
				packageJson: (0, package_json_helper_cjs_1.getPackageJSON)()
			};
			super(config, options);
			/**
			* Reference to {@link Storage.acl}.
			*
			* @name Storage#acl
			* @see Storage.acl
			*/
			this.acl = Storage.acl;
			this.crc32cGenerator = options.crc32cGenerator || crc32c_js_1.CRC32C_DEFAULT_VALIDATOR_GENERATOR;
			this.retryOptions = config.retryOptions;
			this.getBucketsStream = paginator_1.paginator.streamify("getBuckets");
			this.getHmacKeysStream = paginator_1.paginator.streamify("getHmacKeys");
		}
		static sanitizeEndpoint(url) {
			if (!exports.PROTOCOL_REGEX.test(url)) url = `https://${url}`;
			return url.replace(/\/+$/, "");
		}
		/**
		* Get a reference to a Cloud Storage bucket.
		*
		* @param {string} name Name of the bucket.
		* @param {object} [options] Configuration object.
		* @param {string} [options.kmsKeyName] A Cloud KMS key that will be used to
		*     encrypt objects inserted into this bucket, if no encryption method is
		*     specified.
		* @param {string} [options.userProject] User project to be billed for all
		*     requests made from this Bucket object.
		* @returns {Bucket}
		* @see Bucket
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const albums = storage.bucket('albums');
		* const photos = storage.bucket('photos');
		* ```
		*/
		bucket(name, options) {
			if (!name) throw new Error(StorageExceptionMessages.BUCKET_NAME_REQUIRED);
			return new bucket_js_1.Bucket(this, name, options);
		}
		/**
		* Reference a channel to receive notifications about changes to your bucket.
		*
		* @param {string} id The ID of the channel.
		* @param {string} resourceId The resource ID of the channel.
		* @returns {Channel}
		* @see Channel
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const channel = storage.channel('id', 'resource-id');
		* ```
		*/
		channel(id, resourceId) {
			return new channel_js_1.Channel(this, id, resourceId);
		}
		/**
		* @typedef {array} CreateBucketResponse
		* @property {Bucket} 0 The new {@link Bucket}.
		* @property {object} 1 The full API response.
		*/
		/**
		* @callback CreateBucketCallback
		* @param {?Error} err Request error, if any.
		* @param {Bucket} bucket The new {@link Bucket}.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Metadata to set for the bucket.
		*
		* @typedef {object} CreateBucketRequest
		* @property {boolean} [archive=false] Specify the storage class as Archive.
		* @property {object} [autoclass.enabled=false] Specify whether Autoclass is
		*     enabled for the bucket.
		* @property {object} [autoclass.terminalStorageClass='NEARLINE'] The storage class that objects in an Autoclass bucket eventually transition to if
		*     they are not read for a certain length of time. Valid values are NEARLINE and ARCHIVE.
		* @property {boolean} [coldline=false] Specify the storage class as Coldline.
		* @property {Cors[]} [cors=[]] Specify the CORS configuration to use.
		* @property {CustomPlacementConfig} [customPlacementConfig={}] Specify the bucket's regions for dual-region buckets.
		*     For more information, see {@link https://cloud.google.com/storage/docs/locations| Bucket Locations}.
		* @property {boolean} [dra=false] Specify the storage class as Durable Reduced
		*     Availability.
		* @property {boolean} [enableObjectRetention=false] Specify whether or not object retention should be enabled on this bucket.
		* @property {object} [hierarchicalNamespace.enabled=false] Specify whether or not to enable hierarchical namespace on this bucket.
		* @property {string} [location] Specify the bucket's location. If specifying
		*     a dual-region, the `customPlacementConfig` property should be set in conjunction.
		*     For more information, see {@link https://cloud.google.com/storage/docs/locations| Bucket Locations}.
		* @property {boolean} [multiRegional=false] Specify the storage class as
		*     Multi-Regional.
		* @property {boolean} [nearline=false] Specify the storage class as Nearline.
		* @property {boolean} [regional=false] Specify the storage class as Regional.
		* @property {boolean} [requesterPays=false] Force the use of the User Project metadata field to assign operational
		*     costs when an operation is made on a Bucket and its objects.
		* @property {string} [rpo] For dual-region buckets, controls whether turbo
		*      replication is enabled (`ASYNC_TURBO`) or disabled (`DEFAULT`).
		* @property {boolean} [standard=true] Specify the storage class as Standard.
		* @property {string} [storageClass] The new storage class. (`standard`,
		*     `nearline`, `coldline`, or `archive`).
		*     **Note:** The storage classes `multi_regional`, `regional`, and
		*     `durable_reduced_availability` are now legacy and will be deprecated in
		*     the future.
		* @property {Versioning} [versioning=undefined] Specify the versioning status.
		* @property {string} [userProject] The ID of the project which will be billed
		*     for the request.
		*/
		/**
		* Create a bucket.
		*
		* Cloud Storage uses a flat namespace, so you can't create a bucket with
		* a name that is already in use. For more information, see
		* {@link https://cloud.google.com/storage/docs/bucketnaming.html#requirements| Bucket Naming Guidelines}.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/insert| Buckets: insert API Documentation}
		* See {@link https://cloud.google.com/storage/docs/storage-classes| Storage Classes}
		*
		* @param {string} name Name of the bucket to create.
		* @param {CreateBucketRequest} [metadata] Metadata to set for the bucket.
		* @param {CreateBucketCallback} [callback] Callback function.
		* @returns {Promise<CreateBucketResponse>}
		* @throws {Error} If a name is not provided.
		* @see Bucket#create
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const callback = function(err, bucket, apiResponse) {
		*   // `bucket` is a Bucket object.
		* };
		*
		* storage.createBucket('new-bucket', callback);
		*
		* //-
		* // Create a bucket in a specific location and region. <em>See the <a
		* // href="https://cloud.google.com/storage/docs/json_api/v1/buckets/insert">
		* // Official JSON API docs</a> for complete details on the `location`
		* option.
		* // </em>
		* //-
		* const metadata = {
		*   location: 'US-CENTRAL1',
		*   regional: true
		* };
		*
		* storage.createBucket('new-bucket', metadata, callback);
		*
		* //-
		* // Create a bucket with a retention policy of 6 months.
		* //-
		* const metadata = {
		*   retentionPolicy: {
		*     retentionPeriod: 15780000 // 6 months in seconds.
		*   }
		* };
		*
		* storage.createBucket('new-bucket', metadata, callback);
		*
		* //-
		* // Enable versioning on a new bucket.
		* //-
		* const metadata = {
		*   versioning: {
		*     enabled: true
		*   }
		* };
		*
		* storage.createBucket('new-bucket', metadata, callback);
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* storage.createBucket('new-bucket').then(function(data) {
		*   const bucket = data[0];
		*   const apiResponse = data[1];
		* });
		*
		* ```
		* @example <caption>include:samples/buckets.js</caption>
		* region_tag:storage_create_bucket
		* Another example:
		*/
		createBucket(name, metadataOrCallback, callback) {
			if (!name) throw new Error(StorageExceptionMessages.BUCKET_NAME_REQUIRED_CREATE);
			let metadata;
			if (!callback) {
				callback = metadataOrCallback;
				metadata = {};
			} else metadata = metadataOrCallback;
			const body = {
				...metadata,
				name
			};
			const storageClasses = {
				archive: "ARCHIVE",
				coldline: "COLDLINE",
				dra: "DURABLE_REDUCED_AVAILABILITY",
				multiRegional: "MULTI_REGIONAL",
				nearline: "NEARLINE",
				regional: "REGIONAL",
				standard: "STANDARD"
			};
			const storageClassKeys = Object.keys(storageClasses);
			for (const storageClass of storageClassKeys) if (body[storageClass]) {
				if (metadata.storageClass && metadata.storageClass !== storageClass) throw new Error(`Both \`${storageClass}\` and \`storageClass\` were provided.`);
				body.storageClass = storageClasses[storageClass];
				delete body[storageClass];
			}
			if (body.requesterPays) {
				body.billing = { requesterPays: body.requesterPays };
				delete body.requesterPays;
			}
			const query = { project: this.projectId };
			if (body.userProject) {
				query.userProject = body.userProject;
				delete body.userProject;
			}
			if (body.enableObjectRetention) {
				query.enableObjectRetention = body.enableObjectRetention;
				delete body.enableObjectRetention;
			}
			if (body.predefinedAcl) {
				query.predefinedAcl = body.predefinedAcl;
				delete body.predefinedAcl;
			}
			if (body.predefinedDefaultObjectAcl) {
				query.predefinedDefaultObjectAcl = body.predefinedDefaultObjectAcl;
				delete body.predefinedDefaultObjectAcl;
			}
			if (body.projection) {
				query.projection = body.projection;
				delete body.projection;
			}
			this.request({
				method: "POST",
				uri: "/b",
				qs: query,
				json: body
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				const bucket = this.bucket(name);
				bucket.metadata = resp;
				callback(null, bucket, resp);
			});
		}
		/**
		* @typedef {object} CreateHmacKeyOptions
		* @property {string} [projectId] The project ID of the project that owns
		*     the service account of the requested HMAC key. If not provided,
		*     the project ID used to instantiate the Storage client will be used.
		* @property {string} [userProject] This parameter is currently ignored.
		*/
		/**
		* @typedef {object} HmacKeyMetadata
		* @property {string} accessId The access id identifies which HMAC key was
		*     used to sign a request when authenticating with HMAC.
		* @property {string} etag Used to perform a read-modify-write of the key.
		* @property {string} id The resource name of the HMAC key.
		* @property {string} projectId The project ID.
		* @property {string} serviceAccountEmail The service account's email this
		*     HMAC key is created for.
		* @property {string} state The state of this HMAC key. One of "ACTIVE",
		*     "INACTIVE" or "DELETED".
		* @property {string} timeCreated The creation time of the HMAC key in
		*     RFC 3339 format.
		* @property {string} [updated] The time this HMAC key was last updated in
		*     RFC 3339 format.
		*/
		/**
		* @typedef {array} CreateHmacKeyResponse
		* @property {HmacKey} 0 The HmacKey instance created from API response.
		* @property {string} 1 The HMAC key's secret used to access the XML API.
		* @property {object} 3 The raw API response.
		*/
		/**
		* @callback CreateHmacKeyCallback Callback function.
		* @param {?Error} err Request error, if any.
		* @param {HmacKey} hmacKey The HmacKey instance created from API response.
		* @param {string} secret The HMAC key's secret used to access the XML API.
		* @param {object} apiResponse The raw API response.
		*/
		/**
		* Create an HMAC key associated with an service account to authenticate
		* requests to the Cloud Storage XML API.
		*
		* See {@link https://cloud.google.com/storage/docs/authentication/hmackeys| HMAC keys documentation}
		*
		* @param {string} serviceAccountEmail The service account's email address
		*     with which the HMAC key is created for.
		* @param {CreateHmacKeyCallback} [callback] Callback function.
		* @return {Promise<CreateHmacKeyResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('google-cloud/storage');
		* const storage = new Storage();
		*
		* // Replace with your service account's email address
		* const serviceAccountEmail =
		*   'my-service-account@appspot.gserviceaccount.com';
		*
		* storage.createHmacKey(serviceAccountEmail, function(err, hmacKey, secret) {
		*   if (!err) {
		*     // Securely store the secret for use with the XML API.
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* storage.createHmacKey(serviceAccountEmail)
		*   .then((response) => {
		*     const hmacKey = response[0];
		*     const secret = response[1];
		*     // Securely store the secret for use with the XML API.
		*   });
		* ```
		*/
		createHmacKey(serviceAccountEmail, optionsOrCb, cb) {
			if (typeof serviceAccountEmail !== "string") throw new Error(StorageExceptionMessages.HMAC_SERVICE_ACCOUNT);
			const { options, callback } = (0, util_js_1.normalize)(optionsOrCb, cb);
			const query = Object.assign({}, options, { serviceAccountEmail });
			const projectId = query.projectId || this.projectId;
			delete query.projectId;
			this.request({
				method: "POST",
				uri: `/projects/${projectId}/hmacKeys`,
				qs: query,
				maxRetries: 0
			}, (err, resp) => {
				if (err) {
					callback(err, null, null, resp);
					return;
				}
				const metadata = resp.metadata;
				const hmacKey = this.hmacKey(metadata.accessId, { projectId: metadata.projectId });
				hmacKey.metadata = resp.metadata;
				callback(null, hmacKey, resp.secret, resp);
			});
		}
		/**
		* Query object for listing buckets.
		*
		* @typedef {object} GetBucketsRequest
		* @property {boolean} [autoPaginate=true] Have pagination handled
		*     automatically.
		* @property {number} [maxApiCalls] Maximum number of API calls to make.
		* @property {number} [maxResults] Maximum number of items plus prefixes to
		*     return per call.
		*     Note: By default will handle pagination automatically
		*     if more than 1 page worth of results are requested per call.
		*     When `autoPaginate` is set to `false` the smaller of `maxResults`
		*     or 1 page of results will be returned per call.
		* @property {string} [pageToken] A previously-returned page token
		*     representing part of the larger set of results to view.
		* @property {string} [userProject] The ID of the project which will be billed
		*     for the request.
		*  @param {boolean} [softDeleted] If true, returns the soft-deleted object.
		*     Object `generation` is required if `softDeleted` is set to True.
		*/
		/**
		* @typedef {array} GetBucketsResponse
		* @property {Bucket[]} 0 Array of {@link Bucket} instances.
		* @property {object} 1 nextQuery A query object to receive more results.
		* @property {object} 2 The full API response.
		*/
		/**
		* @callback GetBucketsCallback
		* @param {?Error} err Request error, if any.
		* @param {Bucket[]} buckets Array of {@link Bucket} instances.
		* @param {object} nextQuery A query object to receive more results.
		* @param {object} apiResponse The full API response.
		*/
		/**
		* Get Bucket objects for all of the buckets in your project.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/buckets/list| Buckets: list API Documentation}
		*
		* @param {GetBucketsRequest} [query] Query object for listing buckets.
		* @param {GetBucketsCallback} [callback] Callback function.
		* @returns {Promise<GetBucketsResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* storage.getBuckets(function(err, buckets) {
		*   if (!err) {
		*     // buckets is an array of Bucket objects.
		*   }
		* });
		*
		* //-
		* // To control how many API requests are made and page through the results
		* // manually, set `autoPaginate` to `false`.
		* //-
		* const callback = function(err, buckets, nextQuery, apiResponse) {
		*   if (nextQuery) {
		*     // More results exist.
		*     storage.getBuckets(nextQuery, callback);
		*   }
		*
		*   // The `metadata` property is populated for you with the metadata at the
		*   // time of fetching.
		*   buckets[0].metadata;
		*
		*   // However, in cases where you are concerned the metadata could have
		*   // changed, use the `getMetadata` method.
		*   buckets[0].getMetadata(function(err, metadata, apiResponse) {});
		* };
		*
		* storage.getBuckets({
		*   autoPaginate: false
		* }, callback);
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* storage.getBuckets().then(function(data) {
		*   const buckets = data[0];
		* });
		*
		* ```
		* @example <caption>include:samples/buckets.js</caption>
		* region_tag:storage_list_buckets
		* Another example:
		*/
		getBuckets(optionsOrCallback, cb) {
			const { options, callback } = (0, util_js_1.normalize)(optionsOrCallback, cb);
			options.project = options.project || this.projectId;
			this.request({
				uri: "/b",
				qs: options
			}, (err, resp) => {
				if (err) {
					callback(err, null, null, resp);
					return;
				}
				const itemsArray = resp.items ? resp.items : [];
				const unreachableArray = resp.unreachable ? resp.unreachable : [];
				const buckets = itemsArray.map((bucket) => {
					const bucketInstance = this.bucket(bucket.id);
					bucketInstance.metadata = bucket;
					return bucketInstance;
				});
				if (unreachableArray.length > 0) unreachableArray.forEach((fullPath) => {
					const name = fullPath.split("/").pop();
					if (name) {
						const placeholder = this.bucket(name);
						placeholder.unreachable = true;
						placeholder.metadata = {};
						buckets.push(placeholder);
					}
				});
				callback(null, buckets, resp.nextPageToken ? Object.assign({}, options, { pageToken: resp.nextPageToken }) : null, resp);
			});
		}
		getHmacKeys(optionsOrCb, cb) {
			const { options, callback } = (0, util_js_1.normalize)(optionsOrCb, cb);
			const query = Object.assign({}, options);
			const projectId = query.projectId || this.projectId;
			delete query.projectId;
			this.request({
				uri: `/projects/${projectId}/hmacKeys`,
				qs: query
			}, (err, resp) => {
				if (err) {
					callback(err, null, null, resp);
					return;
				}
				callback(null, (resp.items ? resp.items : []).map((hmacKey) => {
					const hmacKeyInstance = this.hmacKey(hmacKey.accessId, { projectId: hmacKey.projectId });
					hmacKeyInstance.metadata = hmacKey;
					return hmacKeyInstance;
				}), resp.nextPageToken ? Object.assign({}, options, { pageToken: resp.nextPageToken }) : null, resp);
			});
		}
		/**
		* @typedef {array} GetServiceAccountResponse
		* @property {object} 0 The service account resource.
		* @property {object} 1 The full
		* {@link https://cloud.google.com/storage/docs/json_api/v1/projects/serviceAccount#resource| API response}.
		*/
		/**
		* @callback GetServiceAccountCallback
		* @param {?Error} err Request error, if any.
		* @param {object} serviceAccount The serviceAccount resource.
		* @param {string} serviceAccount.emailAddress The service account email
		*     address.
		* @param {object} apiResponse The full
		* {@link https://cloud.google.com/storage/docs/json_api/v1/projects/serviceAccount#resource| API response}.
		*/
		/**
		* Get the email address of this project's Google Cloud Storage service
		* account.
		*
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/projects/serviceAccount/get| Projects.serviceAccount: get API Documentation}
		* See {@link https://cloud.google.com/storage/docs/json_api/v1/projects/serviceAccount#resource| Projects.serviceAccount Resource}
		*
		* @param {object} [options] Configuration object.
		* @param {string} [options.userProject] User project to be billed for this
		*     request.
		* @param {GetServiceAccountCallback} [callback] Callback function.
		* @returns {Promise<GetServiceAccountResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		*
		* storage.getServiceAccount(function(err, serviceAccount, apiResponse) {
		*   if (!err) {
		*     const serviceAccountEmail = serviceAccount.emailAddress;
		*   }
		* });
		*
		* //-
		* // If the callback is omitted, we'll return a Promise.
		* //-
		* storage.getServiceAccount().then(function(data) {
		*   const serviceAccountEmail = data[0].emailAddress;
		*   const apiResponse = data[1];
		* });
		* ```
		*/
		getServiceAccount(optionsOrCallback, cb) {
			const { options, callback } = (0, util_js_1.normalize)(optionsOrCallback, cb);
			this.request({
				uri: `/projects/${this.projectId}/serviceAccount`,
				qs: options
			}, (err, resp) => {
				if (err) {
					callback(err, null, resp);
					return;
				}
				const camelCaseResponse = {};
				for (const prop in resp) if (resp.hasOwnProperty(prop)) {
					const camelCaseProp = prop.replace(/_(\w)/g, (_, match) => match.toUpperCase());
					camelCaseResponse[camelCaseProp] = resp[prop];
				}
				callback(null, camelCaseResponse, resp);
			});
		}
		/**
		* Get a reference to an HmacKey object.
		* Note: this does not fetch the HMAC key's metadata. Use HmacKey#get() to
		* retrieve and populate the metadata.
		*
		* To get a reference to an HMAC key that's not created for a service
		* account in the same project used to instantiate the Storage client,
		* supply the project's ID as `projectId` in the `options` argument.
		*
		* @param {string} accessId The HMAC key's access ID.
		* @param {HmacKeyOptions} options HmacKey constructor options.
		* @returns {HmacKey}
		* @see HmacKey
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const hmacKey = storage.hmacKey('ACCESS_ID');
		* ```
		*/
		hmacKey(accessId, options) {
			if (!accessId) throw new Error(StorageExceptionMessages.HMAC_ACCESS_ID);
			return new hmacKey_js_1.HmacKey(this, accessId, options);
		}
	};
	exports.Storage = Storage;
	/**
	* {@link Bucket} class.
	*
	* @name Storage.Bucket
	* @see Bucket
	* @type {Constructor}
	*/
	Storage.Bucket = bucket_js_1.Bucket;
	/**
	* {@link Channel} class.
	*
	* @name Storage.Channel
	* @see Channel
	* @type {Constructor}
	*/
	Storage.Channel = channel_js_1.Channel;
	/**
	* {@link File} class.
	*
	* @name Storage.File
	* @see File
	* @type {Constructor}
	*/
	Storage.File = file_js_1.File;
	/**
	* {@link HmacKey} class.
	*
	* @name Storage.HmacKey
	* @see HmacKey
	* @type {Constructor}
	*/
	Storage.HmacKey = hmacKey_js_1.HmacKey;
	Storage.acl = {
		OWNER_ROLE: "OWNER",
		READER_ROLE: "READER",
		WRITER_ROLE: "WRITER"
	};
	/*! Developer Documentation
	*
	* These methods can be auto-paginated.
	*/
	paginator_1.paginator.extend(Storage, ["getBuckets", "getHmacKeys"]);
	/*! Developer Documentation
	*
	* All async methods (except for streams) will return a Promise in the event
	* that a callback is omitted.
	*/
	(0, promisify_1.promisifyAll)(Storage, { exclude: [
		"bucket",
		"channel",
		"hmacKey"
	] });
}));
//#endregion
//#region node_modules/fast-xml-parser/lib/fxp.cjs
var require_fxp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(() => {
		"use strict";
		var t = {
			d: (e, n) => {
				for (var i in n) t.o(n, i) && !t.o(e, i) && Object.defineProperty(e, i, {
					enumerable: !0,
					get: n[i]
				});
			},
			o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
			r: (t) => {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
			}
		}, e = {};
		t.r(e), t.d(e, {
			XMLBuilder: () => Xt,
			XMLParser: () => Tt,
			XMLValidator: () => Yt
		});
		const i = /* @__PURE__ */ new RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
		function s(t, e) {
			const n = [];
			let i = e.exec(t);
			for (; i;) {
				const s = [];
				s.startIndex = e.lastIndex - i[0].length;
				const r = i.length;
				for (let t = 0; t < r; t++) s.push(i[t]);
				n.push(s), i = e.exec(t);
			}
			return n;
		}
		const r = function(t) {
			return !(null == i.exec(t));
		}, o = [
			"hasOwnProperty",
			"toString",
			"valueOf",
			"__defineGetter__",
			"__defineSetter__",
			"__lookupGetter__",
			"__lookupSetter__"
		], a = [
			"__proto__",
			"constructor",
			"prototype"
		], h = {
			allowBooleanAttributes: !1,
			unpairedTags: []
		};
		function l(t, e) {
			e = Object.assign({}, h, e);
			const n = [];
			let i = !1, s = !1;
			"﻿" === t[0] && (t = t.substr(1));
			for (let r = 0; r < t.length; r++) if ("<" === t[r] && "?" === t[r + 1]) {
				if (r += 2, r = p(t, r), r.err) return r;
			} else {
				if ("<" !== t[r]) {
					if (u(t[r])) continue;
					return b("InvalidChar", "char '" + t[r] + "' is not expected.", w(t, r));
				}
				{
					let o = r;
					if (r++, "!" === t[r]) {
						r = c(t, r);
						continue;
					}
					{
						let a = !1;
						"/" === t[r] && (a = !0, r++);
						let h = "";
						for (; r < t.length && ">" !== t[r] && " " !== t[r] && "	" !== t[r] && "\n" !== t[r] && "\r" !== t[r]; r++) h += t[r];
						if (h = h.trim(), "/" === h[h.length - 1] && (h = h.substring(0, h.length - 1), r--), !E(h)) {
							let e;
							return e = 0 === h.trim().length ? "Invalid space after '<'." : "Tag '" + h + "' is an invalid name.", b("InvalidTag", e, w(t, r));
						}
						const l = g(t, r);
						if (!1 === l) return b("InvalidAttr", "Attributes for '" + h + "' have open quote.", w(t, r));
						let d = l.value;
						if (r = l.index, "/" === d[d.length - 1]) {
							const n = r - d.length;
							d = d.substring(0, d.length - 1);
							const s = x(d, e);
							if (!0 !== s) return b(s.err.code, s.err.msg, w(t, n + s.err.line));
							i = !0;
						} else if (a) {
							if (!l.tagClosed) return b("InvalidTag", "Closing tag '" + h + "' doesn't have proper closing.", w(t, r));
							if (d.trim().length > 0) return b("InvalidTag", "Closing tag '" + h + "' can't have attributes or invalid starting.", w(t, o));
							if (0 === n.length) return b("InvalidTag", "Closing tag '" + h + "' has not been opened.", w(t, o));
							{
								const e = n.pop();
								if (h !== e.tagName) {
									let n = w(t, e.tagStartPos);
									return b("InvalidTag", "Expected closing tag '" + e.tagName + "' (opened in line " + n.line + ", col " + n.col + ") instead of closing tag '" + h + "'.", w(t, o));
								}
								0 == n.length && (s = !0);
							}
						} else {
							const a = x(d, e);
							if (!0 !== a) return b(a.err.code, a.err.msg, w(t, r - d.length + a.err.line));
							if (!0 === s) return b("InvalidXml", "Multiple possible root nodes found.", w(t, r));
							-1 !== e.unpairedTags.indexOf(h) || n.push({
								tagName: h,
								tagStartPos: o
							}), i = !0;
						}
						for (r++; r < t.length; r++) if ("<" === t[r]) {
							if ("!" === t[r + 1]) {
								r++, r = c(t, r);
								continue;
							}
							if ("?" !== t[r + 1]) break;
							if (r = p(t, ++r), r.err) return r;
						} else if ("&" === t[r]) {
							const e = N(t, r);
							if (-1 == e) return b("InvalidChar", "char '&' is not expected.", w(t, r));
							r = e;
						} else if (!0 === s && !u(t[r])) return b("InvalidXml", "Extra text at the end", w(t, r));
						"<" === t[r] && r--;
					}
				}
			}
			return i ? 1 == n.length ? b("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", w(t, n[0].tagStartPos)) : !(n.length > 0) || b("InvalidXml", "Invalid '" + JSON.stringify(n.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
				line: 1,
				col: 1
			}) : b("InvalidXml", "Start tag expected.", 1);
		}
		function u(t) {
			return " " === t || "	" === t || "\n" === t || "\r" === t;
		}
		function p(t, e) {
			const n = e;
			for (; e < t.length; e++) if ("?" == t[e] || " " == t[e]) {
				const i = t.substr(n, e - n);
				if (e > 5 && "xml" === i) return b("InvalidXml", "XML declaration allowed only at the start of the document.", w(t, e));
				if ("?" == t[e] && ">" == t[e + 1]) {
					e++;
					break;
				}
				continue;
			}
			return e;
		}
		function c(t, e) {
			if (t.length > e + 5 && "-" === t[e + 1] && "-" === t[e + 2]) {
				for (e += 3; e < t.length; e++) if ("-" === t[e] && "-" === t[e + 1] && ">" === t[e + 2]) {
					e += 2;
					break;
				}
			} else if (t.length > e + 8 && "D" === t[e + 1] && "O" === t[e + 2] && "C" === t[e + 3] && "T" === t[e + 4] && "Y" === t[e + 5] && "P" === t[e + 6] && "E" === t[e + 7]) {
				let n = 1;
				for (e += 8; e < t.length; e++) if ("<" === t[e]) n++;
				else if (">" === t[e] && (n--, 0 === n)) break;
			} else if (t.length > e + 9 && "[" === t[e + 1] && "C" === t[e + 2] && "D" === t[e + 3] && "A" === t[e + 4] && "T" === t[e + 5] && "A" === t[e + 6] && "[" === t[e + 7]) {
				for (e += 8; e < t.length; e++) if ("]" === t[e] && "]" === t[e + 1] && ">" === t[e + 2]) {
					e += 2;
					break;
				}
			}
			return e;
		}
		const d = "\"", f = "'";
		function g(t, e) {
			let n = "", i = "", s = !1;
			for (; e < t.length; e++) {
				if (t[e] === d || t[e] === f) "" === i ? i = t[e] : i !== t[e] || (i = "");
				else if (">" === t[e] && "" === i) {
					s = !0;
					break;
				}
				n += t[e];
			}
			return "" === i && {
				value: n,
				index: e,
				tagClosed: s
			};
		}
		const m = /* @__PURE__ */ new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
		function x(t, e) {
			const n = s(t, m), i = {};
			for (let t = 0; t < n.length; t++) {
				if (0 === n[t][1].length) return b("InvalidAttr", "Attribute '" + n[t][2] + "' has no space in starting.", v(n[t]));
				if (void 0 !== n[t][3] && void 0 === n[t][4]) return b("InvalidAttr", "Attribute '" + n[t][2] + "' is without value.", v(n[t]));
				if (void 0 === n[t][3] && !e.allowBooleanAttributes) return b("InvalidAttr", "boolean attribute '" + n[t][2] + "' is not allowed.", v(n[t]));
				const s = n[t][2];
				if (!y(s)) return b("InvalidAttr", "Attribute '" + s + "' is an invalid name.", v(n[t]));
				if (Object.prototype.hasOwnProperty.call(i, s)) return b("InvalidAttr", "Attribute '" + s + "' is repeated.", v(n[t]));
				i[s] = 1;
			}
			return !0;
		}
		function N(t, e) {
			if (";" === t[++e]) return -1;
			if ("#" === t[e]) return function(t, e) {
				let n = /\d/;
				for ("x" === t[e] && (e++, n = /[\da-fA-F]/); e < t.length; e++) {
					if (";" === t[e]) return e;
					if (!t[e].match(n)) break;
				}
				return -1;
			}(t, ++e);
			let n = 0;
			for (; e < t.length; e++, n++) if (!(t[e].match(/\w/) && n < 20)) {
				if (";" === t[e]) break;
				return -1;
			}
			return e;
		}
		function b(t, e, n) {
			return { err: {
				code: t,
				msg: e,
				line: n.line || n,
				col: n.col
			} };
		}
		function y(t) {
			return r(t);
		}
		function E(t) {
			return r(t);
		}
		function w(t, e) {
			const n = t.substring(0, e).split(/\r?\n/);
			return {
				line: n.length,
				col: n[n.length - 1].length + 1
			};
		}
		function v(t) {
			return t.startIndex + t[1].length;
		}
		const S = (t) => o.includes(t) ? "__" + t : t, _ = {
			preserveOrder: !1,
			attributeNamePrefix: "@_",
			attributesGroupName: !1,
			textNodeName: "#text",
			ignoreAttributes: !0,
			removeNSPrefix: !1,
			allowBooleanAttributes: !1,
			parseTagValue: !0,
			parseAttributeValue: !1,
			trimValues: !0,
			cdataPropName: !1,
			numberParseOptions: {
				hex: !0,
				leadingZeros: !0,
				eNotation: !0
			},
			tagValueProcessor: function(t, e) {
				return e;
			},
			attributeValueProcessor: function(t, e) {
				return e;
			},
			stopNodes: [],
			alwaysCreateTextNode: !1,
			isArray: () => !1,
			commentPropName: !1,
			unpairedTags: [],
			processEntities: !0,
			htmlEntities: !1,
			entityDecoder: null,
			ignoreDeclaration: !1,
			ignorePiTags: !1,
			transformTagName: !1,
			transformAttributeName: !1,
			updateTag: function(t, e, n) {
				return t;
			},
			captureMetaData: !1,
			maxNestedTags: 100,
			strictReservedNames: !0,
			jPath: !0,
			onDangerousProperty: S
		};
		function A(t, e) {
			if ("string" != typeof t) return;
			const n = t.toLowerCase();
			if (o.some((t) => n === t.toLowerCase())) throw new Error(`[SECURITY] Invalid ${e}: "${t}" is a reserved JavaScript keyword that could cause prototype pollution`);
			if (a.some((t) => n === t.toLowerCase())) throw new Error(`[SECURITY] Invalid ${e}: "${t}" is a reserved JavaScript keyword that could cause prototype pollution`);
		}
		function T(t, e) {
			return "boolean" == typeof t ? {
				enabled: t,
				maxEntitySize: 1e4,
				maxExpansionDepth: 1e4,
				maxTotalExpansions: Infinity,
				maxExpandedLength: 1e5,
				maxEntityCount: 1e3,
				allowedTags: null,
				tagFilter: null,
				appliesTo: "all"
			} : "object" == typeof t && null !== t ? {
				enabled: !1 !== t.enabled,
				maxEntitySize: Math.max(1, t.maxEntitySize ?? 1e4),
				maxExpansionDepth: Math.max(1, t.maxExpansionDepth ?? 1e4),
				maxTotalExpansions: Math.max(1, t.maxTotalExpansions ?? Infinity),
				maxExpandedLength: Math.max(1, t.maxExpandedLength ?? 1e5),
				maxEntityCount: Math.max(1, t.maxEntityCount ?? 1e3),
				allowedTags: t.allowedTags ?? null,
				tagFilter: t.tagFilter ?? null,
				appliesTo: t.appliesTo ?? "all"
			} : T(!0);
		}
		const C = function(t) {
			const e = Object.assign({}, _, t), n = [
				{
					value: e.attributeNamePrefix,
					name: "attributeNamePrefix"
				},
				{
					value: e.attributesGroupName,
					name: "attributesGroupName"
				},
				{
					value: e.textNodeName,
					name: "textNodeName"
				},
				{
					value: e.cdataPropName,
					name: "cdataPropName"
				},
				{
					value: e.commentPropName,
					name: "commentPropName"
				}
			];
			for (const { value: t, name: e } of n) t && A(t, e);
			return null === e.onDangerousProperty && (e.onDangerousProperty = S), e.processEntities = T(e.processEntities, e.htmlEntities), e.unpairedTagsSet = new Set(e.unpairedTags), e.stopNodes && Array.isArray(e.stopNodes) && (e.stopNodes = e.stopNodes.map((t) => "string" == typeof t && t.startsWith("*.") ? ".." + t.substring(2) : t)), e;
		};
		let P;
		P = "function" != typeof Symbol ? "@@xmlMetadata" : Symbol("XML Node Metadata");
		class O {
			constructor(t) {
				this.tagname = t, this.child = [], this[":@"] = Object.create(null);
			}
			add(t, e) {
				"__proto__" === t && (t = "#__proto__"), this.child.push({ [t]: e });
			}
			addChild(t, e) {
				"__proto__" === t.tagname && (t.tagname = "#__proto__"), t[":@"] && Object.keys(t[":@"]).length > 0 ? this.child.push({
					[t.tagname]: t.child,
					":@": t[":@"]
				}) : this.child.push({ [t.tagname]: t.child }), void 0 !== e && (this.child[this.child.length - 1][P] = { startIndex: e });
			}
			static getMetaDataSymbol() {
				return P;
			}
		}
		class $ {
			constructor(t) {
				this.suppressValidationErr = !t, this.options = t;
			}
			readDocType(t, e) {
				const n = Object.create(null);
				let i = 0;
				if ("O" !== t[e + 3] || "C" !== t[e + 4] || "T" !== t[e + 5] || "Y" !== t[e + 6] || "P" !== t[e + 7] || "E" !== t[e + 8]) throw new Error("Invalid Tag instead of DOCTYPE");
				{
					e += 9;
					let s = 1, r = !1, o = !1, a = "";
					for (; e < t.length; e++) if ("<" !== t[e] || o) if (">" === t[e]) {
						if (o ? "-" === t[e - 1] && "-" === t[e - 2] && (o = !1, s--) : s--, 0 === s) break;
					} else "[" === t[e] ? r = !0 : a += t[e];
					else {
						if (r && D(t, "!ENTITY", e)) {
							let s, r;
							if (e += 7, [s, r, e] = this.readEntityExp(t, e + 1, this.suppressValidationErr), -1 === r.indexOf("&")) {
								if (!1 !== this.options.enabled && null != this.options.maxEntityCount && i >= this.options.maxEntityCount) throw new Error(`Entity count (${i + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
								n[s] = r, i++;
							}
						} else if (r && D(t, "!ELEMENT", e)) {
							e += 8;
							const { index: n } = this.readElementExp(t, e + 1);
							e = n;
						} else if (r && D(t, "!ATTLIST", e)) e += 8;
						else if (r && D(t, "!NOTATION", e)) {
							e += 9;
							const { index: n } = this.readNotationExp(t, e + 1, this.suppressValidationErr);
							e = n;
						} else {
							if (!D(t, "!--", e)) throw new Error("Invalid DOCTYPE");
							o = !0;
						}
						s++, a = "";
					}
					if (0 !== s) throw new Error("Unclosed DOCTYPE");
				}
				return {
					entities: n,
					i: e
				};
			}
			readEntityExp(t, e) {
				const n = e = I(t, e);
				for (; e < t.length && !/\s/.test(t[e]) && "\"" !== t[e] && "'" !== t[e];) e++;
				let i = t.substring(n, e);
				if (M(i), e = I(t, e), !this.suppressValidationErr) {
					if ("SYSTEM" === t.substring(e, e + 6).toUpperCase()) throw new Error("External entities are not supported");
					if ("%" === t[e]) throw new Error("Parameter entities are not supported");
				}
				let s = "";
				if ([e, s] = this.readIdentifierVal(t, e, "entity"), !1 !== this.options.enabled && null != this.options.maxEntitySize && s.length > this.options.maxEntitySize) throw new Error(`Entity "${i}" size (${s.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
				return [
					i,
					s,
					--e
				];
			}
			readNotationExp(t, e) {
				const n = e = I(t, e);
				for (; e < t.length && !/\s/.test(t[e]);) e++;
				let i = t.substring(n, e);
				!this.suppressValidationErr && M(i), e = I(t, e);
				const s = t.substring(e, e + 6).toUpperCase();
				if (!this.suppressValidationErr && "SYSTEM" !== s && "PUBLIC" !== s) throw new Error(`Expected SYSTEM or PUBLIC, found "${s}"`);
				e += s.length, e = I(t, e);
				let r = null, o = null;
				if ("PUBLIC" === s) [e, r] = this.readIdentifierVal(t, e, "publicIdentifier"), "\"" !== t[e = I(t, e)] && "'" !== t[e] || ([e, o] = this.readIdentifierVal(t, e, "systemIdentifier"));
				else if ("SYSTEM" === s && ([e, o] = this.readIdentifierVal(t, e, "systemIdentifier"), !this.suppressValidationErr && !o)) throw new Error("Missing mandatory system identifier for SYSTEM notation");
				return {
					notationName: i,
					publicIdentifier: r,
					systemIdentifier: o,
					index: --e
				};
			}
			readIdentifierVal(t, e, n) {
				let i = "";
				const s = t[e];
				if ("\"" !== s && "'" !== s) throw new Error(`Expected quoted string, found "${s}"`);
				const r = ++e;
				for (; e < t.length && t[e] !== s;) e++;
				if (i = t.substring(r, e), t[e] !== s) throw new Error(`Unterminated ${n} value`);
				return [++e, i];
			}
			readElementExp(t, e) {
				const n = e = I(t, e);
				for (; e < t.length && !/\s/.test(t[e]);) e++;
				let i = t.substring(n, e);
				if (!this.suppressValidationErr && !r(i)) throw new Error(`Invalid element name: "${i}"`);
				let s = "";
				if ("E" === t[e = I(t, e)] && D(t, "MPTY", e)) e += 4;
				else if ("A" === t[e] && D(t, "NY", e)) e += 2;
				else if ("(" === t[e]) {
					const n = ++e;
					for (; e < t.length && ")" !== t[e];) e++;
					if (s = t.substring(n, e), ")" !== t[e]) throw new Error("Unterminated content model");
				} else if (!this.suppressValidationErr) throw new Error(`Invalid Element Expression, found "${t[e]}"`);
				return {
					elementName: i,
					contentModel: s.trim(),
					index: e
				};
			}
			readAttlistExp(t, e) {
				let n = e = I(t, e);
				for (; e < t.length && !/\s/.test(t[e]);) e++;
				let i = t.substring(n, e);
				for (M(i), n = e = I(t, e); e < t.length && !/\s/.test(t[e]);) e++;
				let s = t.substring(n, e);
				if (!M(s)) throw new Error(`Invalid attribute name: "${s}"`);
				e = I(t, e);
				let r = "";
				if ("NOTATION" === t.substring(e, e + 8).toUpperCase()) {
					if (r = "NOTATION", "(" !== t[e = I(t, e += 8)]) throw new Error(`Expected '(', found "${t[e]}"`);
					e++;
					let n = [];
					for (; e < t.length && ")" !== t[e];) {
						const i = e;
						for (; e < t.length && "|" !== t[e] && ")" !== t[e];) e++;
						let s = t.substring(i, e);
						if (s = s.trim(), !M(s)) throw new Error(`Invalid notation name: "${s}"`);
						n.push(s), "|" === t[e] && (e++, e = I(t, e));
					}
					if (")" !== t[e]) throw new Error("Unterminated list of notations");
					e++, r += " (" + n.join("|") + ")";
				} else {
					const n = e;
					for (; e < t.length && !/\s/.test(t[e]);) e++;
					r += t.substring(n, e);
					if (!this.suppressValidationErr && ![
						"CDATA",
						"ID",
						"IDREF",
						"IDREFS",
						"ENTITY",
						"ENTITIES",
						"NMTOKEN",
						"NMTOKENS"
					].includes(r.toUpperCase())) throw new Error(`Invalid attribute type: "${r}"`);
				}
				e = I(t, e);
				let o = "";
				return "#REQUIRED" === t.substring(e, e + 8).toUpperCase() ? (o = "#REQUIRED", e += 8) : "#IMPLIED" === t.substring(e, e + 7).toUpperCase() ? (o = "#IMPLIED", e += 7) : [e, o] = this.readIdentifierVal(t, e, "ATTLIST"), {
					elementName: i,
					attributeName: s,
					attributeType: r,
					defaultValue: o,
					index: e
				};
			}
		}
		const I = (t, e) => {
			for (; e < t.length && /\s/.test(t[e]);) e++;
			return e;
		};
		function D(t, e, n) {
			for (let i = 0; i < e.length; i++) if (e[i] !== t[n + i + 1]) return !1;
			return !0;
		}
		function M(t) {
			if (r(t)) return t;
			throw new Error(`Invalid entity name ${t}`);
		}
		const j = /^[-+]?0x[a-fA-F0-9]+$/, V = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, L = {
			hex: !0,
			leadingZeros: !0,
			decimalPoint: ".",
			eNotation: !0,
			infinity: "original"
		};
		const k = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
		class F {
			constructor(t) {
				this._matcher = t;
			}
			get separator() {
				return this._matcher.separator;
			}
			getCurrentTag() {
				const t = this._matcher.path;
				return t.length > 0 ? t[t.length - 1].tag : void 0;
			}
			getCurrentNamespace() {
				const t = this._matcher.path;
				return t.length > 0 ? t[t.length - 1].namespace : void 0;
			}
			getAttrValue(t) {
				const e = this._matcher.path;
				if (0 !== e.length) return e[e.length - 1].values?.[t];
			}
			hasAttr(t) {
				const e = this._matcher.path;
				if (0 === e.length) return !1;
				const n = e[e.length - 1];
				return void 0 !== n.values && t in n.values;
			}
			getPosition() {
				const t = this._matcher.path;
				return 0 === t.length ? -1 : t[t.length - 1].position ?? 0;
			}
			getCounter() {
				const t = this._matcher.path;
				return 0 === t.length ? -1 : t[t.length - 1].counter ?? 0;
			}
			getIndex() {
				return this.getPosition();
			}
			getDepth() {
				return this._matcher.path.length;
			}
			toString(t, e = !0) {
				return this._matcher.toString(t, e);
			}
			toArray() {
				return this._matcher.path.map((t) => t.tag);
			}
			matches(t) {
				return this._matcher.matches(t);
			}
			matchesAny(t) {
				return t.matchesAny(this._matcher);
			}
		}
		class R {
			constructor(t = {}) {
				this.separator = t.separator || ".", this.path = [], this.siblingStacks = [], this._pathStringCache = null, this._view = new F(this);
			}
			push(t, e = null, n = null) {
				this._pathStringCache = null, this.path.length > 0 && (this.path[this.path.length - 1].values = void 0);
				const i = this.path.length;
				this.siblingStacks[i] || (this.siblingStacks[i] = /* @__PURE__ */ new Map());
				const s = this.siblingStacks[i], r = n ? `${n}:${t}` : t, o = s.get(r) || 0;
				let a = 0;
				for (const t of s.values()) a += t;
				s.set(r, o + 1);
				const h = {
					tag: t,
					position: a,
					counter: o
				};
				null != n && (h.namespace = n), null != e && (h.values = e), this.path.push(h);
			}
			pop() {
				if (0 === this.path.length) return;
				this._pathStringCache = null;
				const t = this.path.pop();
				return this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1), t;
			}
			updateCurrent(t) {
				if (this.path.length > 0) {
					const e = this.path[this.path.length - 1];
					null != t && (e.values = t);
				}
			}
			getCurrentTag() {
				return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
			}
			getCurrentNamespace() {
				return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
			}
			getAttrValue(t) {
				if (0 !== this.path.length) return this.path[this.path.length - 1].values?.[t];
			}
			hasAttr(t) {
				if (0 === this.path.length) return !1;
				const e = this.path[this.path.length - 1];
				return void 0 !== e.values && t in e.values;
			}
			getPosition() {
				return 0 === this.path.length ? -1 : this.path[this.path.length - 1].position ?? 0;
			}
			getCounter() {
				return 0 === this.path.length ? -1 : this.path[this.path.length - 1].counter ?? 0;
			}
			getIndex() {
				return this.getPosition();
			}
			getDepth() {
				return this.path.length;
			}
			toString(t, e = !0) {
				const n = t || this.separator;
				if (n === this.separator && !0 === e) {
					if (null !== this._pathStringCache) return this._pathStringCache;
					const t = this.path.map((t) => t.namespace ? `${t.namespace}:${t.tag}` : t.tag).join(n);
					return this._pathStringCache = t, t;
				}
				return this.path.map((t) => e && t.namespace ? `${t.namespace}:${t.tag}` : t.tag).join(n);
			}
			toArray() {
				return this.path.map((t) => t.tag);
			}
			reset() {
				this._pathStringCache = null, this.path = [], this.siblingStacks = [];
			}
			matches(t) {
				const e = t.segments;
				return 0 !== e.length && (t.hasDeepWildcard() ? this._matchWithDeepWildcard(e) : this._matchSimple(e));
			}
			_matchSimple(t) {
				if (this.path.length !== t.length) return !1;
				for (let e = 0; e < t.length; e++) if (!this._matchSegment(t[e], this.path[e], e === this.path.length - 1)) return !1;
				return !0;
			}
			_matchWithDeepWildcard(t) {
				let e = this.path.length - 1, n = t.length - 1;
				for (; n >= 0 && e >= 0;) {
					const i = t[n];
					if ("deep-wildcard" === i.type) {
						if (n--, n < 0) return !0;
						const i = t[n];
						let s = !1;
						for (let t = e; t >= 0; t--) if (this._matchSegment(i, this.path[t], t === this.path.length - 1)) {
							e = t - 1, n--, s = !0;
							break;
						}
						if (!s) return !1;
					} else {
						if (!this._matchSegment(i, this.path[e], e === this.path.length - 1)) return !1;
						e--, n--;
					}
				}
				return n < 0;
			}
			_matchSegment(t, e, n) {
				if ("*" !== t.tag && t.tag !== e.tag) return !1;
				if (void 0 !== t.namespace && "*" !== t.namespace && t.namespace !== e.namespace) return !1;
				if (void 0 !== t.attrName) {
					if (!n) return !1;
					if (!e.values || !(t.attrName in e.values)) return !1;
					if (void 0 !== t.attrValue && String(e.values[t.attrName]) !== String(t.attrValue)) return !1;
				}
				if (void 0 !== t.position) {
					if (!n) return !1;
					const i = e.counter ?? 0;
					if ("first" === t.position && 0 !== i) return !1;
					if ("odd" === t.position && i % 2 != 1) return !1;
					if ("even" === t.position && i % 2 != 0) return !1;
					if ("nth" === t.position && i !== t.positionValue) return !1;
				}
				return !0;
			}
			matchesAny(t) {
				return t.matchesAny(this);
			}
			snapshot() {
				return {
					path: this.path.map((t) => ({ ...t })),
					siblingStacks: this.siblingStacks.map((t) => new Map(t))
				};
			}
			restore(t) {
				this._pathStringCache = null, this.path = t.path.map((t) => ({ ...t })), this.siblingStacks = t.siblingStacks.map((t) => new Map(t));
			}
			readOnly() {
				return this._view;
			}
		}
		class G {
			constructor(t, e = {}, n) {
				this.pattern = t, this.separator = e.separator || ".", this.segments = this._parse(t), this.data = n, this._hasDeepWildcard = this.segments.some((t) => "deep-wildcard" === t.type), this._hasAttributeCondition = this.segments.some((t) => void 0 !== t.attrName), this._hasPositionSelector = this.segments.some((t) => void 0 !== t.position);
			}
			_parse(t) {
				const e = [];
				let n = 0, i = "";
				for (; n < t.length;) t[n] === this.separator ? n + 1 < t.length && t[n + 1] === this.separator ? (i.trim() && (e.push(this._parseSegment(i.trim())), i = ""), e.push({ type: "deep-wildcard" }), n += 2) : (i.trim() && e.push(this._parseSegment(i.trim())), i = "", n++) : (i += t[n], n++);
				return i.trim() && e.push(this._parseSegment(i.trim())), e;
			}
			_parseSegment(t) {
				const e = { type: "tag" };
				let n = null, i = t;
				const s = t.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
				if (s && (i = s[1] + s[3], s[2])) {
					const t = s[2].slice(1, -1);
					t && (n = t);
				}
				let r, o, a = i;
				if (i.includes("::")) {
					const e = i.indexOf("::");
					if (r = i.substring(0, e).trim(), a = i.substring(e + 2).trim(), !r) throw new Error(`Invalid namespace in pattern: ${t}`);
				}
				let h = null;
				if (a.includes(":")) {
					const t = a.lastIndexOf(":"), e = a.substring(0, t).trim(), n = a.substring(t + 1).trim();
					[
						"first",
						"last",
						"odd",
						"even"
					].includes(n) || /^nth\(\d+\)$/.test(n) ? (o = e, h = n) : o = a;
				} else o = a;
				if (!o) throw new Error(`Invalid segment pattern: ${t}`);
				if (e.tag = o, r && (e.namespace = r), n) if (n.includes("=")) {
					const t = n.indexOf("=");
					e.attrName = n.substring(0, t).trim(), e.attrValue = n.substring(t + 1).trim();
				} else e.attrName = n.trim();
				if (h) {
					const t = h.match(/^nth\((\d+)\)$/);
					t ? (e.position = "nth", e.positionValue = parseInt(t[1], 10)) : e.position = h;
				}
				return e;
			}
			get length() {
				return this.segments.length;
			}
			hasDeepWildcard() {
				return this._hasDeepWildcard;
			}
			hasAttributeCondition() {
				return this._hasAttributeCondition;
			}
			hasPositionSelector() {
				return this._hasPositionSelector;
			}
			toString() {
				return this.pattern;
			}
		}
		class B {
			constructor() {
				this._byDepthAndTag = /* @__PURE__ */ new Map(), this._wildcardByDepth = /* @__PURE__ */ new Map(), this._deepWildcards = [], this._patterns = /* @__PURE__ */ new Set(), this._sealed = !1;
			}
			add(t) {
				if (this._sealed) throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
				if (this._patterns.has(t.pattern)) return this;
				if (this._patterns.add(t.pattern), t.hasDeepWildcard()) return this._deepWildcards.push(t), this;
				const e = t.length, i = t.segments[t.segments.length - 1]?.tag;
				if (i && "*" !== i) {
					const n = `${e}:${i}`;
					this._byDepthAndTag.has(n) || this._byDepthAndTag.set(n, []), this._byDepthAndTag.get(n).push(t);
				} else this._wildcardByDepth.has(e) || this._wildcardByDepth.set(e, []), this._wildcardByDepth.get(e).push(t);
				return this;
			}
			addAll(t) {
				for (const e of t) this.add(e);
				return this;
			}
			has(t) {
				return this._patterns.has(t.pattern);
			}
			get size() {
				return this._patterns.size;
			}
			seal() {
				return this._sealed = !0, this;
			}
			get isSealed() {
				return this._sealed;
			}
			matchesAny(t) {
				return null !== this.findMatch(t);
			}
			findMatch(t) {
				const e = t.getDepth(), n = `${e}:${t.getCurrentTag()}`, i = this._byDepthAndTag.get(n);
				if (i) {
					for (let e = 0; e < i.length; e++) if (t.matches(i[e])) return i[e];
				}
				const s = this._wildcardByDepth.get(e);
				if (s) {
					for (let e = 0; e < s.length; e++) if (t.matches(s[e])) return s[e];
				}
				for (let e = 0; e < this._deepWildcards.length; e++) if (t.matches(this._deepWildcards[e])) return this._deepWildcards[e];
				return null;
			}
		}
		const U = {
			cent: "¢",
			pound: "£",
			curren: "¤",
			yen: "¥",
			euro: "€",
			dollar: "$",
			euro: "€",
			fnof: "ƒ",
			inr: "₹",
			af: "؋",
			birr: "ብር",
			peso: "₱",
			rub: "₽",
			won: "₩",
			yuan: "¥",
			cedil: "¸"
		}, W = {
			amp: "&",
			apos: "'",
			gt: ">",
			lt: "<",
			quot: "\""
		}, X = {
			nbsp: "\xA0",
			copy: "©",
			reg: "®",
			trade: "™",
			mdash: "—",
			ndash: "–",
			hellip: "…",
			laquo: "«",
			raquo: "»",
			lsquo: "‘",
			rsquo: "’",
			ldquo: "“",
			rdquo: "”",
			bull: "•",
			para: "¶",
			sect: "§",
			deg: "°",
			frac12: "½",
			frac14: "¼",
			frac34: "¾"
		}, Y = /* @__PURE__ */ new Set("!?\\\\/[]$%{}^&*()<>|+");
		function z(t) {
			if ("#" === t[0]) throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${t}"`);
			for (const e of t) if (Y.has(e)) throw new Error(`[EntityReplacer] Invalid character '${e}' in entity name: "${t}"`);
			return t;
		}
		function q(...t) {
			const e = Object.create(null);
			for (const n of t) if (n) for (const t of Object.keys(n)) {
				const i = n[t];
				if ("string" == typeof i) e[t] = i;
				else if (i && "object" == typeof i && void 0 !== i.val) {
					const n = i.val;
					"string" == typeof n && (e[t] = n);
				}
			}
			return e;
		}
		const Z = "external", J = "base", K = "all", Q = Object.freeze({
			allow: 0,
			leave: 1,
			remove: 2,
			throw: 3
		}), H = new Set([
			9,
			10,
			13
		]);
		class tt {
			constructor(t = {}) {
				var e;
				this._limit = t.limit || {}, this._maxTotalExpansions = this._limit.maxTotalExpansions || 0, this._maxExpandedLength = this._limit.maxExpandedLength || 0, this._postCheck = "function" == typeof t.postCheck ? t.postCheck : (t) => t, this._limitTiers = (e = this._limit.applyLimitsTo ?? Z) && e !== Z ? e === K ? new Set([K]) : e === J ? new Set([J]) : Array.isArray(e) ? new Set(e) : new Set([Z]) : new Set([Z]), this._numericAllowed = t.numericAllowed ?? !0, this._baseMap = q(W, t.namedEntities || null), this._externalMap = Object.create(null), this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this._removeSet = new Set(t.remove && Array.isArray(t.remove) ? t.remove : []), this._leaveSet = new Set(t.leave && Array.isArray(t.leave) ? t.leave : []);
				const n = function(t) {
					if (!t) return {
						xmlVersion: 1,
						onLevel: Q.allow,
						nullLevel: Q.remove
					};
					const e = 1.1 === t.xmlVersion ? 1.1 : 1, n = Q[t.onNCR] ?? Q.allow, i = Q[t.nullNCR] ?? Q.remove;
					return {
						xmlVersion: e,
						onLevel: n,
						nullLevel: Math.max(i, Q.remove)
					};
				}(t.ncr);
				this._ncrXmlVersion = n.xmlVersion, this._ncrOnLevel = n.onLevel, this._ncrNullLevel = n.nullLevel;
			}
			setExternalEntities(t) {
				if (t) for (const e of Object.keys(t)) z(e);
				this._externalMap = q(t);
			}
			addExternalEntity(t, e) {
				z(t), "string" == typeof e && -1 === e.indexOf("&") && (this._externalMap[t] = e);
			}
			addInputEntities(t) {
				this._totalExpansions = 0, this._expandedLength = 0, this._inputMap = q(t);
			}
			reset() {
				return this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this;
			}
			setXmlVersion(t) {
				this._ncrXmlVersion = 1.1 === t ? 1.1 : 1;
			}
			decode(t) {
				if ("string" != typeof t || 0 === t.length) return t;
				const e = t, n = [], i = t.length;
				let s = 0, r = 0;
				const o = this._maxTotalExpansions > 0, a = this._maxExpandedLength > 0, h = o || a;
				for (; r < i;) {
					if (38 !== t.charCodeAt(r)) {
						r++;
						continue;
					}
					let e = r + 1;
					for (; e < i && 59 !== t.charCodeAt(e) && e - r <= 32;) e++;
					if (e >= i || 59 !== t.charCodeAt(e)) {
						r++;
						continue;
					}
					const l = t.slice(r + 1, e);
					if (0 === l.length) {
						r++;
						continue;
					}
					let u, p;
					if (this._removeSet.has(l)) u = "", void 0 === p && (p = Z);
					else {
						if (this._leaveSet.has(l)) {
							r++;
							continue;
						}
						if (35 === l.charCodeAt(0)) {
							const t = this._resolveNCR(l);
							if (void 0 === t) {
								r++;
								continue;
							}
							u = t, p = J;
						} else {
							const t = this._resolveName(l);
							u = t?.value, p = t?.tier;
						}
					}
					if (void 0 !== u) {
						if (r > s && n.push(t.slice(s, r)), n.push(u), s = e + 1, r = s, h && this._tierCounts(p)) {
							if (o && (this._totalExpansions++, this._totalExpansions > this._maxTotalExpansions)) throw new Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);
							if (a) {
								const t = u.length - (l.length + 2);
								if (t > 0 && (this._expandedLength += t, this._expandedLength > this._maxExpandedLength)) throw new Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`);
							}
						}
					} else r++;
				}
				s < i && n.push(t.slice(s));
				const l = 0 === n.length ? t : n.join("");
				return this._postCheck(l, e);
			}
			_tierCounts(t) {
				return !!this._limitTiers.has(K) || this._limitTiers.has(t);
			}
			_resolveName(t) {
				return t in this._inputMap ? {
					value: this._inputMap[t],
					tier: Z
				} : t in this._externalMap ? {
					value: this._externalMap[t],
					tier: Z
				} : t in this._baseMap ? {
					value: this._baseMap[t],
					tier: J
				} : void 0;
			}
			_classifyNCR(t) {
				return 0 === t ? this._ncrNullLevel : t >= 55296 && t <= 57343 || 1 === this._ncrXmlVersion && t >= 1 && t <= 31 && !H.has(t) ? Q.remove : -1;
			}
			_applyNCRAction(t, e, n) {
				switch (t) {
					case Q.allow: return String.fromCodePoint(n);
					case Q.remove: return "";
					case Q.leave: return;
					case Q.throw: throw new Error(`[EntityDecoder] Prohibited numeric character reference &${e}; (U+${n.toString(16).toUpperCase().padStart(4, "0")})`);
					default: return String.fromCodePoint(n);
				}
			}
			_resolveNCR(t) {
				const e = t.charCodeAt(1);
				let n;
				if (n = 120 === e || 88 === e ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10), Number.isNaN(n) || n < 0 || n > 1114111) return;
				const i = this._classifyNCR(n);
				if (!this._numericAllowed && i < Q.remove) return;
				const s = -1 === i ? this._ncrOnLevel : Math.max(this._ncrOnLevel, i);
				return this._applyNCRAction(s, t, n);
			}
		}
		function et(t, e) {
			if (!t) return {};
			const n = e.attributesGroupName ? t[e.attributesGroupName] : t;
			if (!n) return {};
			const i = {};
			for (const t in n) t.startsWith(e.attributeNamePrefix) ? i[t.substring(e.attributeNamePrefix.length)] = n[t] : i[t] = n[t];
			return i;
		}
		function nt(t) {
			if (!t || "string" != typeof t) return;
			const e = t.indexOf(":");
			if (-1 !== e && e > 0) {
				const n = t.substring(0, e);
				if ("xmlns" !== n) return n;
			}
		}
		class it {
			constructor(t, e) {
				var n;
				this.options = t, this.currentNode = null, this.tagsNodeStack = [], this.parseXml = ht, this.parseTextData = st, this.resolveNameSpace = rt, this.buildAttributesMap = at, this.isItStopNode = ct, this.replaceEntitiesValue = ut, this.readStopNodeData = mt, this.saveTextToParentTag = pt, this.addChild = lt, this.ignoreAttributesFn = "function" == typeof (n = this.options.ignoreAttributes) ? n : Array.isArray(n) ? (t) => {
					for (const e of n) {
						if ("string" == typeof e && t === e) return !0;
						if (e instanceof RegExp && e.test(t)) return !0;
					}
				} : () => !1, this.entityExpansionCount = 0, this.currentExpandedLength = 0;
				let i = { ...W };
				this.options.entityDecoder ? this.entityDecoder = this.options.entityDecoder : ("object" == typeof this.options.htmlEntities ? i = this.options.htmlEntities : !0 === this.options.htmlEntities && (i = {
					...X,
					...U
				}), this.entityDecoder = new tt({
					namedEntities: {
						...i,
						...e
					},
					numericAllowed: this.options.htmlEntities,
					limit: {
						maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
						maxExpandedLength: this.options.processEntities.maxExpandedLength,
						applyLimitsTo: this.options.processEntities.appliesTo
					}
				})), this.matcher = new R(), this.readonlyMatcher = this.matcher.readOnly(), this.isCurrentNodeStopNode = !1, this.stopNodeExpressionsSet = new B();
				const s = this.options.stopNodes;
				if (s && s.length > 0) {
					for (let t = 0; t < s.length; t++) {
						const e = s[t];
						"string" == typeof e ? this.stopNodeExpressionsSet.add(new G(e)) : e instanceof G && this.stopNodeExpressionsSet.add(e);
					}
					this.stopNodeExpressionsSet.seal();
				}
			}
		}
		function st(t, e, n, i, s, r, o) {
			const a = this.options;
			if (void 0 !== t && (a.trimValues && !i && (t = t.trim()), t.length > 0)) {
				o || (t = this.replaceEntitiesValue(t, e, n));
				const i = a.jPath ? n.toString() : n, h = a.tagValueProcessor(e, t, i, s, r);
				return null == h ? t : typeof h != typeof t || h !== t ? h : a.trimValues || t.trim() === t ? xt(t, a.parseTagValue, a.numberParseOptions) : t;
			}
		}
		function rt(t) {
			if (this.options.removeNSPrefix) {
				const e = t.split(":"), n = "/" === t.charAt(0) ? "/" : "";
				if ("xmlns" === e[0]) return "";
				2 === e.length && (t = n + e[1]);
			}
			return t;
		}
		const ot = /* @__PURE__ */ new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
		function at(t, e, n, i = !1) {
			const r = this.options;
			if (!0 === i || !0 !== r.ignoreAttributes && "string" == typeof t) {
				const i = s(t, ot), o = i.length, a = {}, h = new Array(o);
				let l = !1;
				const u = {};
				for (let t = 0; t < o; t++) {
					const e = this.resolveNameSpace(i[t][1]), s = i[t][4];
					if (e.length && void 0 !== s) {
						let i = s;
						r.trimValues && (i = i.trim()), i = this.replaceEntitiesValue(i, n, this.readonlyMatcher), h[t] = i, u[e] = i, l = !0;
					}
				}
				l && "object" == typeof e && e.updateCurrent && e.updateCurrent(u);
				const p = r.jPath ? e.toString() : this.readonlyMatcher;
				let c = !1;
				for (let t = 0; t < o; t++) {
					const e = this.resolveNameSpace(i[t][1]);
					if (this.ignoreAttributesFn(e, p)) continue;
					let n = r.attributeNamePrefix + e;
					if (e.length) if (r.transformAttributeName && (n = r.transformAttributeName(n)), n = bt(n, r), void 0 !== i[t][4]) {
						const i = h[t], s = r.attributeValueProcessor(e, i, p);
						a[n] = null == s ? i : typeof s != typeof i || s !== i ? s : xt(i, r.parseAttributeValue, r.numberParseOptions), c = !0;
					} else r.allowBooleanAttributes && (a[n] = !0, c = !0);
				}
				if (!c) return;
				if (r.attributesGroupName && !r.preserveOrder) {
					const t = {};
					return t[r.attributesGroupName] = a, t;
				}
				return a;
			}
		}
		const ht = function(t) {
			t = t.replace(/\r\n?/g, "\n");
			const e = new O("!xml");
			let n = e, i = "";
			this.matcher.reset(), this.entityDecoder.reset(), this.entityExpansionCount = 0, this.currentExpandedLength = 0;
			const s = this.options, r = new $(s.processEntities), o = t.length;
			for (let a = 0; a < o; a++) if ("<" === t[a]) {
				const h = t.charCodeAt(a + 1);
				if (47 === h) {
					const e = dt(t, ">", a, "Closing Tag is not closed.");
					let r = t.substring(a + 2, e).trim();
					if (s.removeNSPrefix) {
						const t = r.indexOf(":");
						-1 !== t && (r = r.substr(t + 1));
					}
					r = Nt(s.transformTagName, r, "", s).tagName, n && (i = this.saveTextToParentTag(i, n, this.readonlyMatcher));
					const o = this.matcher.getCurrentTag();
					if (r && s.unpairedTagsSet.has(r)) throw new Error(`Unpaired tag can not be used as closing tag: </${r}>`);
					o && s.unpairedTagsSet.has(o) && (this.matcher.pop(), this.tagsNodeStack.pop()), this.matcher.pop(), this.isCurrentNodeStopNode = !1, n = this.tagsNodeStack.pop(), i = "", a = e;
				} else if (63 === h) {
					let e = gt(t, a, !1, "?>");
					if (!e) throw new Error("Pi Tag is not closed.");
					i = this.saveTextToParentTag(i, n, this.readonlyMatcher);
					const r = this.buildAttributesMap(e.tagExp, this.matcher, e.tagName, !0);
					if (r) {
						const t = r[this.options.attributeNamePrefix + "version"];
						this.entityDecoder.setXmlVersion(Number(t) || 1);
					}
					if (s.ignoreDeclaration && "?xml" === e.tagName || s.ignorePiTags);
					else {
						const t = new O(e.tagName);
						t.add(s.textNodeName, ""), e.tagName !== e.tagExp && e.attrExpPresent && !0 !== s.ignoreAttributes && (t[":@"] = r), this.addChild(n, t, this.readonlyMatcher, a);
					}
					a = e.closeIndex + 1;
				} else if (33 === h && 45 === t.charCodeAt(a + 2) && 45 === t.charCodeAt(a + 3)) {
					const e = dt(t, "-->", a + 4, "Comment is not closed.");
					if (s.commentPropName) {
						const r = t.substring(a + 4, e - 2);
						i = this.saveTextToParentTag(i, n, this.readonlyMatcher), n.add(s.commentPropName, [{ [s.textNodeName]: r }]);
					}
					a = e;
				} else if (33 === h && 68 === t.charCodeAt(a + 2)) {
					const e = r.readDocType(t, a);
					this.entityDecoder.addInputEntities(e.entities), a = e.i;
				} else if (33 === h && 91 === t.charCodeAt(a + 2)) {
					const e = dt(t, "]]>", a, "CDATA is not closed.") - 2, r = t.substring(a + 9, e);
					i = this.saveTextToParentTag(i, n, this.readonlyMatcher);
					let o = this.parseTextData(r, n.tagname, this.readonlyMatcher, !0, !1, !0, !0);
					o ??= "", s.cdataPropName ? n.add(s.cdataPropName, [{ [s.textNodeName]: r }]) : n.add(s.textNodeName, o), a = e + 2;
				} else {
					let r = gt(t, a, s.removeNSPrefix);
					if (!r) {
						const e = t.substring(Math.max(0, a - 50), Math.min(o, a + 50));
						throw new Error(`readTagExp returned undefined at position ${a}. Context: "${e}"`);
					}
					let h = r.tagName;
					const l = r.rawTagName;
					let u = r.tagExp, p = r.attrExpPresent, c = r.closeIndex;
					if ({tagName: h, tagExp: u} = Nt(s.transformTagName, h, u, s), s.strictReservedNames && (h === s.commentPropName || h === s.cdataPropName || h === s.textNodeName || h === s.attributesGroupName)) throw new Error(`Invalid tag name: ${h}`);
					n && i && "!xml" !== n.tagname && (i = this.saveTextToParentTag(i, n, this.readonlyMatcher, !1));
					const d = n;
					d && s.unpairedTagsSet.has(d.tagname) && (n = this.tagsNodeStack.pop(), this.matcher.pop());
					let f = !1;
					u.length > 0 && u.lastIndexOf("/") === u.length - 1 && (f = !0, "/" === h[h.length - 1] ? (h = h.substr(0, h.length - 1), u = h) : u = u.substr(0, u.length - 1), p = h !== u);
					let g, m = null;
					g = nt(l), h !== e.tagname && this.matcher.push(h, {}, g), h !== u && p && (m = this.buildAttributesMap(u, this.matcher, h), m && et(m, s)), h !== e.tagname && (this.isCurrentNodeStopNode = this.isItStopNode());
					const N = a;
					if (this.isCurrentNodeStopNode) {
						let e = "";
						if (f) a = r.closeIndex;
						else if (s.unpairedTagsSet.has(h)) a = r.closeIndex;
						else {
							const n = this.readStopNodeData(t, l, c + 1);
							if (!n) throw new Error(`Unexpected end of ${l}`);
							a = n.i, e = n.tagContent;
						}
						const i = new O(h);
						m && (i[":@"] = m), i.add(s.textNodeName, e), this.matcher.pop(), this.isCurrentNodeStopNode = !1, this.addChild(n, i, this.readonlyMatcher, N);
					} else {
						if (f) {
							({tagName: h, tagExp: u} = Nt(s.transformTagName, h, u, s));
							const t = new O(h);
							m && (t[":@"] = m), this.addChild(n, t, this.readonlyMatcher, N), this.matcher.pop(), this.isCurrentNodeStopNode = !1;
						} else {
							if (s.unpairedTagsSet.has(h)) {
								const t = new O(h);
								m && (t[":@"] = m), this.addChild(n, t, this.readonlyMatcher, N), this.matcher.pop(), this.isCurrentNodeStopNode = !1, a = r.closeIndex;
								continue;
							}
							{
								const t = new O(h);
								if (this.tagsNodeStack.length > s.maxNestedTags) throw new Error("Maximum nested tags exceeded");
								this.tagsNodeStack.push(n), m && (t[":@"] = m), this.addChild(n, t, this.readonlyMatcher, N), n = t;
							}
						}
						i = "", a = c;
					}
				}
			} else i += t[a];
			return e.child;
		};
		function lt(t, e, n, i) {
			this.options.captureMetaData || (i = void 0);
			const s = this.options.jPath ? n.toString() : n, r = this.options.updateTag(e.tagname, s, e[":@"]);
			!1 === r || ("string" == typeof r ? (e.tagname = r, t.addChild(e, i)) : t.addChild(e, i));
		}
		function ut(t, e, n) {
			const i = this.options.processEntities;
			if (!i || !i.enabled) return t;
			if (i.allowedTags) {
				const s = this.options.jPath ? n.toString() : n;
				if (!(Array.isArray(i.allowedTags) ? i.allowedTags.includes(e) : i.allowedTags(e, s))) return t;
			}
			if (i.tagFilter) {
				const s = this.options.jPath ? n.toString() : n;
				if (!i.tagFilter(e, s)) return t;
			}
			return this.entityDecoder.decode(t);
		}
		function pt(t, e, n, i) {
			return t && (void 0 === i && (i = 0 === e.child.length), void 0 !== (t = this.parseTextData(t, e.tagname, n, !1, !!e[":@"] && 0 !== Object.keys(e[":@"]).length, i)) && "" !== t && e.add(this.options.textNodeName, t), t = ""), t;
		}
		function ct() {
			return 0 !== this.stopNodeExpressionsSet.size && this.matcher.matchesAny(this.stopNodeExpressionsSet);
		}
		function dt(t, e, n, i) {
			const s = t.indexOf(e, n);
			if (-1 === s) throw new Error(i);
			return s + e.length - 1;
		}
		function ft(t, e, n, i) {
			const s = t.indexOf(e, n);
			if (-1 === s) throw new Error(i);
			return s;
		}
		function gt(t, e, n, i = ">") {
			const s = function(t, e, n = ">") {
				let i = 0;
				const s = t.length, r = n.charCodeAt(0), o = n.length > 1 ? n.charCodeAt(1) : -1;
				let a = "", h = e;
				for (let n = e; n < s; n++) {
					const e = t.charCodeAt(n);
					if (i) e === i && (i = 0);
					else if (34 === e || 39 === e) i = e;
					else if (e === r) {
						if (-1 === o) return a += t.substring(h, n), {
							data: a,
							index: n
						};
						if (t.charCodeAt(n + 1) === o) return a += t.substring(h, n), {
							data: a,
							index: n
						};
					} else 9 !== e || i || (a += t.substring(h, n) + " ", h = n + 1);
				}
			}(t, e + 1, i);
			if (!s) return;
			let r = s.data;
			const o = s.index, a = r.search(/\s/);
			let h = r, l = !0;
			-1 !== a && (h = r.substring(0, a), r = r.substring(a + 1).trimStart());
			const u = h;
			if (n) {
				const t = h.indexOf(":");
				-1 !== t && (h = h.substr(t + 1), l = h !== s.data.substr(t + 1));
			}
			return {
				tagName: h,
				tagExp: r,
				closeIndex: o,
				attrExpPresent: l,
				rawTagName: u
			};
		}
		function mt(t, e, n) {
			const i = n;
			let s = 1;
			const r = t.length;
			for (; n < r; n++) if ("<" === t[n]) {
				const r = t.charCodeAt(n + 1);
				if (47 === r) {
					const r = ft(t, ">", n, `${e} is not closed`);
					if (t.substring(n + 2, r).trim() === e && (s--, 0 === s)) return {
						tagContent: t.substring(i, n),
						i: r
					};
					n = r;
				} else if (63 === r) n = dt(t, "?>", n + 1, "StopNode is not closed.");
				else if (33 === r && 45 === t.charCodeAt(n + 2) && 45 === t.charCodeAt(n + 3)) n = dt(t, "-->", n + 3, "StopNode is not closed.");
				else if (33 === r && 91 === t.charCodeAt(n + 2)) n = dt(t, "]]>", n, "StopNode is not closed.") - 2;
				else {
					const i = gt(t, n, !1);
					i && ((i && i.tagName) === e && "/" !== i.tagExp[i.tagExp.length - 1] && s++, n = i.closeIndex);
				}
			}
		}
		function xt(t, e, n) {
			if (e && "string" == typeof t) {
				const e = t.trim();
				return "true" === e || "false" !== e && function(t, e = {}) {
					if (e = Object.assign({}, L, e), !t || "string" != typeof t) return t;
					let n = t.trim();
					if (0 === n.length) return t;
					if (void 0 !== e.skipLike && e.skipLike.test(n)) return t;
					if ("0" === n) return 0;
					if (e.hex && j.test(n)) return function(t) {
						if (parseInt) return parseInt(t, 16);
						if (Number.parseInt) return Number.parseInt(t, 16);
						if (window && window.parseInt) return window.parseInt(t, 16);
						throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
					}(n);
					if (isFinite(n)) {
						if (n.includes("e") || n.includes("E")) return function(t, e, n) {
							if (!n.eNotation) return t;
							const i = e.match(k);
							if (i) {
								let s = i[1] || "";
								const r = -1 === i[3].indexOf("e") ? "E" : "e", o = i[2], a = s ? t[o.length + 1] === r : t[o.length] === r;
								return o.length > 1 && a ? t : (1 !== o.length || !i[3].startsWith(`.${r}`) && i[3][0] !== r) && o.length > 0 ? n.leadingZeros && !a ? (e = (i[1] || "") + i[3], Number(e)) : t : Number(e);
							}
							return t;
						}(t, n, e);
						{
							const s = V.exec(n);
							if (s) {
								const r = s[1] || "", o = s[2];
								let a = (i = s[3]) && -1 !== i.indexOf(".") ? ("." === (i = i.replace(/0+$/, "")) ? i = "0" : "." === i[0] ? i = "0" + i : "." === i[i.length - 1] && (i = i.substring(0, i.length - 1)), i) : i;
								const h = r ? "." === t[o.length + 1] : "." === t[o.length];
								if (!e.leadingZeros && (o.length > 1 || 1 === o.length && !h)) return t;
								{
									const i = Number(n), s = String(i);
									if (0 === i) return i;
									if (-1 !== s.search(/[eE]/)) return e.eNotation ? i : t;
									if (-1 !== n.indexOf(".")) return "0" === s || s === a || s === `${r}${a}` ? i : t;
									let h = o ? a : n;
									return o ? h === s || r + h === s ? i : t : h === s || h === r + s ? i : t;
								}
							}
							return t;
						}
					}
					var i;
					return function(t, e, n) {
						const i = e === Infinity;
						switch (n.infinity.toLowerCase()) {
							case "null": return null;
							case "infinity": return e;
							case "string": return i ? "Infinity" : "-Infinity";
							default: return t;
						}
					}(t, Number(n), e);
				}(t, n);
			}
			return void 0 !== t ? t : "";
		}
		function Nt(t, e, n, i) {
			if (t) {
				const i = t(e);
				n === e && (n = i), e = i;
			}
			return {
				tagName: e = bt(e, i),
				tagExp: n
			};
		}
		function bt(t, e) {
			if (a.includes(t)) throw new Error(`[SECURITY] Invalid name: "${t}" is a reserved JavaScript keyword that could cause prototype pollution`);
			return o.includes(t) ? e.onDangerousProperty(t) : t;
		}
		const yt = O.getMetaDataSymbol();
		function Et(t, e) {
			if (!t || "object" != typeof t) return {};
			if (!e) return t;
			const n = {};
			for (const i in t) i.startsWith(e) ? n[i.substring(e.length)] = t[i] : n[i] = t[i];
			return n;
		}
		function wt(t, e, n, i) {
			return vt(t, e, n, i);
		}
		function vt(t, e, n, i) {
			let s;
			const r = {};
			for (let o = 0; o < t.length; o++) {
				const a = t[o], h = St(a);
				if (void 0 !== h && h !== e.textNodeName) {
					const t = Et(a[":@"] || {}, e.attributeNamePrefix);
					n.push(h, t);
				}
				if (h === e.textNodeName) void 0 === s ? s = a[h] : s += "" + a[h];
				else {
					if (void 0 === h) continue;
					if (a[h]) {
						let t = vt(a[h], e, n, i);
						const s = At(t, e);
						if (0 === Object.keys(t).length && e.alwaysCreateTextNode && (t[e.textNodeName] = ""), a[":@"] ? _t(t, a[":@"], i, e) : 1 !== Object.keys(t).length || void 0 === t[e.textNodeName] || e.alwaysCreateTextNode ? 0 === Object.keys(t).length && (e.alwaysCreateTextNode ? t[e.textNodeName] = "" : t = "") : t = t[e.textNodeName], void 0 !== a[yt] && "object" == typeof t && null !== t && (t[yt] = a[yt]), void 0 !== r[h] && Object.prototype.hasOwnProperty.call(r, h)) Array.isArray(r[h]) || (r[h] = [r[h]]), r[h].push(t);
						else {
							const n = e.jPath ? i.toString() : i;
							e.isArray(h, n, s) ? r[h] = [t] : r[h] = t;
						}
						void 0 !== h && h !== e.textNodeName && n.pop();
					}
				}
			}
			return "string" == typeof s ? s.length > 0 && (r[e.textNodeName] = s) : void 0 !== s && (r[e.textNodeName] = s), r;
		}
		function St(t) {
			const e = Object.keys(t);
			for (let t = 0; t < e.length; t++) {
				const n = e[t];
				if (":@" !== n) return n;
			}
		}
		function _t(t, e, n, i) {
			if (e) {
				const s = Object.keys(e), r = s.length;
				for (let o = 0; o < r; o++) {
					const r = s[o], a = r.startsWith(i.attributeNamePrefix) ? r.substring(i.attributeNamePrefix.length) : r, h = i.jPath ? n.toString() + "." + a : n;
					i.isArray(r, h, !0, !0) ? t[r] = [e[r]] : t[r] = e[r];
				}
			}
		}
		function At(t, e) {
			const { textNodeName: n } = e, i = Object.keys(t).length;
			return 0 === i || !(1 !== i || !t[n] && "boolean" != typeof t[n] && 0 !== t[n]);
		}
		class Tt {
			constructor(t) {
				this.externalEntities = {}, this.options = C(t);
			}
			parse(t, e) {
				if ("string" != typeof t && t.toString) t = t.toString();
				else if ("string" != typeof t) throw new Error("XML data is accepted in String or Bytes[] form.");
				if (e) {
					!0 === e && (e = {});
					const n = l(t, e);
					if (!0 !== n) throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`);
				}
				const n = new it(this.options, this.externalEntities), i = n.parseXml(t);
				return this.options.preserveOrder || void 0 === i ? i : wt(i, this.options, n.matcher, n.readonlyMatcher);
			}
			addEntity(t, e) {
				if (-1 !== e.indexOf("&")) throw new Error("Entity value can't have '&'");
				if (-1 !== t.indexOf("&") || -1 !== t.indexOf(";")) throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
				if ("&" === e) throw new Error("An entity with value '&' is not permitted");
				this.externalEntities[t] = e;
			}
			static getMetaDataSymbol() {
				return O.getMetaDataSymbol();
			}
		}
		function Ct(t) {
			return String(t).replace(/--/g, "- -").replace(/--/g, "- -").replace(/-$/, "- ");
		}
		function Pt(t) {
			return String(t).replace(/\]\]>/g, "]]]]><![CDATA[>");
		}
		function Ot(t) {
			return String(t).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
		}
		function $t(t, e) {
			let n = "";
			e.format && e.indentBy.length > 0 && (n = "\n");
			const i = [];
			if (e.stopNodes && Array.isArray(e.stopNodes)) for (let t = 0; t < e.stopNodes.length; t++) {
				const n = e.stopNodes[t];
				"string" == typeof n ? i.push(new G(n)) : n instanceof G && i.push(n);
			}
			return It(t, e, n, new R(), i);
		}
		function It(t, e, n, i, s) {
			let r = "", o = !1;
			if (e.maxNestedTags && i.getDepth() > e.maxNestedTags) throw new Error("Maximum nested tags exceeded");
			if (!Array.isArray(t)) {
				if (null != t) {
					let n = t.toString();
					return n = Ft(n, e), n;
				}
				return "";
			}
			for (let a = 0; a < t.length; a++) {
				const h = t[a], l = Vt(h);
				if (void 0 === l) continue;
				const u = Dt(h[":@"], e);
				i.push(l, u);
				const p = kt(i, s);
				if (l === e.textNodeName) {
					let t = h[l];
					p || (t = e.tagValueProcessor(l, t), t = Ft(t, e)), o && (r += n), r += t, o = !1, i.pop();
					continue;
				}
				if (l === e.cdataPropName) {
					o && (r += n), r += `<![CDATA[${Pt(h[l][0][e.textNodeName])}]]>`, o = !1, i.pop();
					continue;
				}
				if (l === e.commentPropName) {
					r += n + `\x3c!--${Ct(h[l][0][e.textNodeName])}--\x3e`, o = !0, i.pop();
					continue;
				}
				if ("?" === l[0]) {
					const t = Lt(h[":@"], e, p), s = "?xml" === l ? "" : n;
					let a = h[l][0][e.textNodeName];
					a = 0 !== a.length ? " " + a : "", r += s + `<${l}${a}${t}?>`, o = !0, i.pop();
					continue;
				}
				let c = n;
				"" !== c && (c += e.indentBy);
				const d = n + `<${l}${Lt(h[":@"], e, p)}`;
				let f;
				f = p ? Mt(h[l], e) : It(h[l], e, c, i, s), -1 !== e.unpairedTags.indexOf(l) ? e.suppressUnpairedNode ? r += d + ">" : r += d + "/>" : f && 0 !== f.length || !e.suppressEmptyNode ? f && f.endsWith(">") ? r += d + `>${f}${n}</${l}>` : (r += d + ">", f && "" !== n && (f.includes("/>") || f.includes("</")) ? r += n + e.indentBy + f + n : r += f, r += `</${l}>`) : r += d + "/>", o = !0, i.pop();
			}
			return r;
		}
		function Dt(t, e) {
			if (!t || e.ignoreAttributes) return null;
			const n = {};
			let i = !1;
			for (let s in t) Object.prototype.hasOwnProperty.call(t, s) && (n[s.startsWith(e.attributeNamePrefix) ? s.substr(e.attributeNamePrefix.length) : s] = Ot(t[s]), i = !0);
			return i ? n : null;
		}
		function Mt(t, e) {
			if (!Array.isArray(t)) return null != t ? t.toString() : "";
			let n = "";
			for (let i = 0; i < t.length; i++) {
				const s = t[i], r = Vt(s);
				if (r === e.textNodeName) n += s[r];
				else if (r === e.cdataPropName) n += s[r][0][e.textNodeName];
				else if (r === e.commentPropName) n += s[r][0][e.textNodeName];
				else {
					if (r && "?" === r[0]) continue;
					if (r) {
						const t = jt(s[":@"], e), i = Mt(s[r], e);
						i && 0 !== i.length ? n += `<${r}${t}>${i}</${r}>` : n += `<${r}${t}/>`;
					}
				}
			}
			return n;
		}
		function jt(t, e) {
			let n = "";
			if (t && !e.ignoreAttributes) for (let i in t) {
				if (!Object.prototype.hasOwnProperty.call(t, i)) continue;
				let s = t[i];
				!0 === s && e.suppressBooleanAttributes ? n += ` ${i.substr(e.attributeNamePrefix.length)}` : n += ` ${i.substr(e.attributeNamePrefix.length)}="${Ot(s)}"`;
			}
			return n;
		}
		function Vt(t) {
			const e = Object.keys(t);
			for (let n = 0; n < e.length; n++) {
				const i = e[n];
				if (Object.prototype.hasOwnProperty.call(t, i) && ":@" !== i) return i;
			}
		}
		function Lt(t, e, n) {
			let i = "";
			if (t && !e.ignoreAttributes) for (let s in t) {
				if (!Object.prototype.hasOwnProperty.call(t, s)) continue;
				let r;
				n ? r = t[s] : (r = e.attributeValueProcessor(s, t[s]), r = Ft(r, e)), !0 === r && e.suppressBooleanAttributes ? i += ` ${s.substr(e.attributeNamePrefix.length)}` : i += ` ${s.substr(e.attributeNamePrefix.length)}="${Ot(r)}"`;
			}
			return i;
		}
		function kt(t, e) {
			if (!e || 0 === e.length) return !1;
			for (let n = 0; n < e.length; n++) if (t.matches(e[n])) return !0;
			return !1;
		}
		function Ft(t, e) {
			if (t && t.length > 0 && e.processEntities) for (let n = 0; n < e.entities.length; n++) {
				const i = e.entities[n];
				t = t.replace(i.regex, i.val);
			}
			return t;
		}
		const Rt = {
			attributeNamePrefix: "@_",
			attributesGroupName: !1,
			textNodeName: "#text",
			ignoreAttributes: !0,
			cdataPropName: !1,
			format: !1,
			indentBy: "  ",
			suppressEmptyNode: !1,
			suppressUnpairedNode: !0,
			suppressBooleanAttributes: !0,
			tagValueProcessor: function(t, e) {
				return e;
			},
			attributeValueProcessor: function(t, e) {
				return e;
			},
			preserveOrder: !1,
			commentPropName: !1,
			unpairedTags: [],
			entities: [
				{
					regex: /* @__PURE__ */ new RegExp("&", "g"),
					val: "&amp;"
				},
				{
					regex: /* @__PURE__ */ new RegExp(">", "g"),
					val: "&gt;"
				},
				{
					regex: /* @__PURE__ */ new RegExp("<", "g"),
					val: "&lt;"
				},
				{
					regex: /* @__PURE__ */ new RegExp("'", "g"),
					val: "&apos;"
				},
				{
					regex: /* @__PURE__ */ new RegExp("\"", "g"),
					val: "&quot;"
				}
			],
			processEntities: !0,
			stopNodes: [],
			oneListGroup: !1,
			maxNestedTags: 100,
			jPath: !0
		};
		function Gt(t) {
			if (this.options = Object.assign({}, Rt, t), this.options.stopNodes && Array.isArray(this.options.stopNodes) && (this.options.stopNodes = this.options.stopNodes.map((t) => "string" == typeof t && t.startsWith("*.") ? ".." + t.substring(2) : t)), this.stopNodeExpressions = [], this.options.stopNodes && Array.isArray(this.options.stopNodes)) for (let t = 0; t < this.options.stopNodes.length; t++) {
				const e = this.options.stopNodes[t];
				"string" == typeof e ? this.stopNodeExpressions.push(new G(e)) : e instanceof G && this.stopNodeExpressions.push(e);
			}
			var e;
			!0 === this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function() {
				return !1;
			} : (this.ignoreAttributesFn = "function" == typeof (e = this.options.ignoreAttributes) ? e : Array.isArray(e) ? (t) => {
				for (const n of e) {
					if ("string" == typeof n && t === n) return !0;
					if (n instanceof RegExp && n.test(t)) return !0;
				}
			} : () => !1, this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = Wt), this.processTextOrObjNode = Bt, this.options.format ? (this.indentate = Ut, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function() {
				return "";
			}, this.tagEndChar = ">", this.newLine = "");
		}
		function Bt(t, e, n, i) {
			const s = this.extractAttributes(t);
			if (i.push(e, s), this.checkStopNode(i)) {
				const s = this.buildRawContent(t), r = this.buildAttributesForStopNode(t);
				return i.pop(), this.buildObjectNode(s, e, r, n);
			}
			const r = this.j2x(t, n + 1, i);
			return i.pop(), void 0 !== t[this.options.textNodeName] && 1 === Object.keys(t).length ? this.buildTextValNode(t[this.options.textNodeName], e, r.attrStr, n, i) : this.buildObjectNode(r.val, e, r.attrStr, n);
		}
		function Ut(t) {
			return this.options.indentBy.repeat(t);
		}
		function Wt(t) {
			return !(!t.startsWith(this.options.attributeNamePrefix) || t === this.options.textNodeName) && t.substr(this.attrPrefixLen);
		}
		Gt.prototype.build = function(t) {
			if (this.options.preserveOrder) return $t(t, this.options);
			{
				Array.isArray(t) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (t = { [this.options.arrayNodeName]: t });
				const e = new R();
				return this.j2x(t, 0, e).val;
			}
		}, Gt.prototype.j2x = function(t, e, n) {
			let i = "", s = "";
			if (this.options.maxNestedTags && n.getDepth() >= this.options.maxNestedTags) throw new Error("Maximum nested tags exceeded");
			const r = this.options.jPath ? n.toString() : n, o = this.checkStopNode(n);
			for (let a in t) if (Object.prototype.hasOwnProperty.call(t, a)) if (void 0 === t[a]) this.isAttribute(a) && (s += "");
			else if (null === t[a]) this.isAttribute(a) || a === this.options.cdataPropName || a === this.options.commentPropName ? s += "" : "?" === a[0] ? s += this.indentate(e) + "<" + a + "?" + this.tagEndChar : s += this.indentate(e) + "<" + a + "/" + this.tagEndChar;
			else if (t[a] instanceof Date) s += this.buildTextValNode(t[a], a, "", e, n);
			else if ("object" != typeof t[a]) {
				const h = this.isAttribute(a);
				if (h && !this.ignoreAttributesFn(h, r)) i += this.buildAttrPairStr(h, "" + t[a], o);
				else if (!h) if (a === this.options.textNodeName) {
					let e = this.options.tagValueProcessor(a, "" + t[a]);
					s += this.replaceEntitiesValue(e);
				} else {
					n.push(a);
					const i = this.checkStopNode(n);
					if (n.pop(), i) {
						const n = "" + t[a];
						s += "" === n ? this.indentate(e) + "<" + a + this.closeTag(a) + this.tagEndChar : this.indentate(e) + "<" + a + ">" + n + "</" + a + this.tagEndChar;
					} else s += this.buildTextValNode(t[a], a, "", e, n);
				}
			} else if (Array.isArray(t[a])) {
				const i = t[a].length;
				let r = "", o = "";
				for (let h = 0; h < i; h++) {
					const i = t[a][h];
					if (void 0 === i);
					else if (null === i) "?" === a[0] ? s += this.indentate(e) + "<" + a + "?" + this.tagEndChar : s += this.indentate(e) + "<" + a + "/" + this.tagEndChar;
					else if ("object" == typeof i) if (this.options.oneListGroup) {
						n.push(a);
						const t = this.j2x(i, e + 1, n);
						n.pop(), r += t.val, this.options.attributesGroupName && i.hasOwnProperty(this.options.attributesGroupName) && (o += t.attrStr);
					} else r += this.processTextOrObjNode(i, a, e, n);
					else if (this.options.oneListGroup) {
						let t = this.options.tagValueProcessor(a, i);
						t = this.replaceEntitiesValue(t), r += t;
					} else {
						n.push(a);
						const t = this.checkStopNode(n);
						if (n.pop(), t) {
							const t = "" + i;
							r += "" === t ? this.indentate(e) + "<" + a + this.closeTag(a) + this.tagEndChar : this.indentate(e) + "<" + a + ">" + t + "</" + a + this.tagEndChar;
						} else r += this.buildTextValNode(i, a, "", e, n);
					}
				}
				this.options.oneListGroup && (r = this.buildObjectNode(r, a, o, e)), s += r;
			} else if (this.options.attributesGroupName && a === this.options.attributesGroupName) {
				const e = Object.keys(t[a]), n = e.length;
				for (let s = 0; s < n; s++) i += this.buildAttrPairStr(e[s], "" + t[a][e[s]], o);
			} else s += this.processTextOrObjNode(t[a], a, e, n);
			return {
				attrStr: i,
				val: s
			};
		}, Gt.prototype.buildAttrPairStr = function(t, e, n) {
			return n || (e = this.options.attributeValueProcessor(t, "" + e), e = this.replaceEntitiesValue(e)), this.options.suppressBooleanAttributes && "true" === e ? " " + t : " " + t + "=\"" + Ot(e) + "\"";
		}, Gt.prototype.extractAttributes = function(t) {
			if (!t || "object" != typeof t) return null;
			const e = {};
			let n = !1;
			if (this.options.attributesGroupName && t[this.options.attributesGroupName]) {
				const i = t[this.options.attributesGroupName];
				for (let t in i) Object.prototype.hasOwnProperty.call(i, t) && (e[t.startsWith(this.options.attributeNamePrefix) ? t.substring(this.options.attributeNamePrefix.length) : t] = Ot(i[t]), n = !0);
			} else for (let i in t) {
				if (!Object.prototype.hasOwnProperty.call(t, i)) continue;
				const s = this.isAttribute(i);
				s && (e[s] = Ot(t[i]), n = !0);
			}
			return n ? e : null;
		}, Gt.prototype.buildRawContent = function(t) {
			if ("string" == typeof t) return t;
			if ("object" != typeof t || null === t) return String(t);
			if (void 0 !== t[this.options.textNodeName]) return t[this.options.textNodeName];
			let e = "";
			for (let n in t) {
				if (!Object.prototype.hasOwnProperty.call(t, n)) continue;
				if (this.isAttribute(n)) continue;
				if (this.options.attributesGroupName && n === this.options.attributesGroupName) continue;
				const i = t[n];
				if (n === this.options.textNodeName) e += i;
				else if (Array.isArray(i)) {
					for (let t of i) if ("string" == typeof t || "number" == typeof t) e += `<${n}>${t}</${n}>`;
					else if ("object" == typeof t && null !== t) {
						const i = this.buildRawContent(t), s = this.buildAttributesForStopNode(t);
						e += "" === i ? `<${n}${s}/>` : `<${n}${s}>${i}</${n}>`;
					}
				} else if ("object" == typeof i && null !== i) {
					const t = this.buildRawContent(i), s = this.buildAttributesForStopNode(i);
					e += "" === t ? `<${n}${s}/>` : `<${n}${s}>${t}</${n}>`;
				} else e += `<${n}>${i}</${n}>`;
			}
			return e;
		}, Gt.prototype.buildAttributesForStopNode = function(t) {
			if (!t || "object" != typeof t) return "";
			let e = "";
			if (this.options.attributesGroupName && t[this.options.attributesGroupName]) {
				const n = t[this.options.attributesGroupName];
				for (let t in n) {
					if (!Object.prototype.hasOwnProperty.call(n, t)) continue;
					const i = t.startsWith(this.options.attributeNamePrefix) ? t.substring(this.options.attributeNamePrefix.length) : t, s = n[t];
					!0 === s && this.options.suppressBooleanAttributes ? e += " " + i : e += " " + i + "=\"" + s + "\"";
				}
			} else for (let n in t) {
				if (!Object.prototype.hasOwnProperty.call(t, n)) continue;
				const i = this.isAttribute(n);
				if (i) {
					const s = t[n];
					!0 === s && this.options.suppressBooleanAttributes ? e += " " + i : e += " " + i + "=\"" + s + "\"";
				}
			}
			return e;
		}, Gt.prototype.buildObjectNode = function(t, e, n, i) {
			if ("" === t) return "?" === e[0] ? this.indentate(i) + "<" + e + n + "?" + this.tagEndChar : this.indentate(i) + "<" + e + n + this.closeTag(e) + this.tagEndChar;
			{
				let s = "</" + e + this.tagEndChar, r = "";
				return "?" === e[0] && (r = "?", s = ""), !n && "" !== n || -1 !== t.indexOf("<") ? !1 !== this.options.commentPropName && e === this.options.commentPropName && 0 === r.length ? this.indentate(i) + `\x3c!--${t}--\x3e` + this.newLine : this.indentate(i) + "<" + e + n + r + this.tagEndChar + t + this.indentate(i) + s : this.indentate(i) + "<" + e + n + r + ">" + t + s;
			}
		}, Gt.prototype.closeTag = function(t) {
			let e = "";
			return -1 !== this.options.unpairedTags.indexOf(t) ? this.options.suppressUnpairedNode || (e = "/") : e = this.options.suppressEmptyNode ? "/" : `></${t}`, e;
		}, Gt.prototype.checkStopNode = function(t) {
			if (!this.stopNodeExpressions || 0 === this.stopNodeExpressions.length) return !1;
			for (let e = 0; e < this.stopNodeExpressions.length; e++) if (t.matches(this.stopNodeExpressions[e])) return !0;
			return !1;
		}, Gt.prototype.buildTextValNode = function(t, e, n, i, s) {
			if (!1 !== this.options.cdataPropName && e === this.options.cdataPropName) {
				const e = Pt(t);
				return this.indentate(i) + `<![CDATA[${e}]]>` + this.newLine;
			}
			if (!1 !== this.options.commentPropName && e === this.options.commentPropName) {
				const e = Ct(t);
				return this.indentate(i) + `\x3c!--${e}--\x3e` + this.newLine;
			}
			if ("?" === e[0]) return this.indentate(i) + "<" + e + n + "?" + this.tagEndChar;
			{
				let s = this.options.tagValueProcessor(e, t);
				return s = this.replaceEntitiesValue(s), "" === s ? this.indentate(i) + "<" + e + n + this.closeTag(e) + this.tagEndChar : this.indentate(i) + "<" + e + n + ">" + s + "</" + e + this.tagEndChar;
			}
		}, Gt.prototype.replaceEntitiesValue = function(t) {
			if (t && t.length > 0 && this.options.processEntities) for (let e = 0; e < this.options.entities.length; e++) {
				const n = this.options.entities[e];
				t = t.replace(n.regex, n.val);
			}
			return t;
		};
		const Xt = Gt, Yt = { validate: l };
		module.exports = e;
	})();
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/transfer-manager.js
var require_transfer_manager = /* @__PURE__ */ __commonJSMin(((exports) => {
	/*!
	* Copyright 2022 Google LLC. All Rights Reserved.
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	*      http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var _XMLMultiPartUploadHelper_instances, _XMLMultiPartUploadHelper_setGoogApiClientHeaders, _XMLMultiPartUploadHelper_handleErrorResponse;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TransferManager = exports.MultiPartUploadError = void 0;
	var file_js_1 = require_file();
	var p_limit_1 = __importDefault(require_p_limit());
	var path = __importStar(__require("path"));
	var fs_1 = __require("fs");
	var crc32c_js_1 = require_crc32c();
	var google_auth_library_1 = require_src$4();
	var fast_xml_parser_1 = require_fxp();
	var async_retry_1 = __importDefault(require_lib());
	var crypto_1 = __require("crypto");
	var util_js_1 = require_util();
	var util_js_2 = require_util$1();
	var packageJson = (0, require_package_json_helper().getPackageJSON)();
	/**
	* Default number of concurrently executing promises to use when calling uploadManyFiles.
	*
	*/
	var DEFAULT_PARALLEL_UPLOAD_LIMIT = 5;
	/**
	* Default number of concurrently executing promises to use when calling downloadManyFiles.
	*
	*/
	var DEFAULT_PARALLEL_DOWNLOAD_LIMIT = 5;
	/**
	* Default number of concurrently executing promises to use when calling downloadFileInChunks.
	*
	*/
	var DEFAULT_PARALLEL_CHUNKED_DOWNLOAD_LIMIT = 5;
	/**
	* The minimum size threshold in bytes at which to apply a chunked download strategy when calling downloadFileInChunks.
	*
	*/
	var DOWNLOAD_IN_CHUNKS_FILE_SIZE_THRESHOLD = 32 * 1024 * 1024;
	/**
	* The chunk size in bytes to use when calling downloadFileInChunks.
	*
	*/
	var DOWNLOAD_IN_CHUNKS_DEFAULT_CHUNK_SIZE = 32 * 1024 * 1024;
	/**
	* The chunk size in bytes to use when calling uploadFileInChunks.
	*
	*/
	var UPLOAD_IN_CHUNKS_DEFAULT_CHUNK_SIZE = 32 * 1024 * 1024;
	/**
	* Default number of concurrently executing promises to use when calling uploadFileInChunks.
	*
	*/
	var DEFAULT_PARALLEL_CHUNKED_UPLOAD_LIMIT = 5;
	var EMPTY_REGEX = "(?:)";
	/**
	* The `gccl-gcs-cmd` value for the `X-Goog-API-Client` header.
	* Example: `gccl-gcs-cmd/tm.upload_many`
	*
	* @see {@link GCCL_GCS_CMD}.
	* @see {@link GCCL_GCS_CMD_KEY}.
	*/
	var GCCL_GCS_CMD_FEATURE = {
		UPLOAD_MANY: "tm.upload_many",
		DOWNLOAD_MANY: "tm.download_many",
		UPLOAD_SHARDED: "tm.upload_sharded",
		DOWNLOAD_SHARDED: "tm.download_sharded"
	};
	var defaultMultiPartGenerator = (bucket, fileName, uploadId, partsMap) => {
		return new XMLMultiPartUploadHelper(bucket, fileName, uploadId, partsMap);
	};
	var MultiPartUploadError = class extends Error {
		constructor(message, uploadId, partsMap) {
			super(message);
			this.uploadId = uploadId;
			this.partsMap = partsMap;
		}
	};
	exports.MultiPartUploadError = MultiPartUploadError;
	/**
	* Class representing an implementation of MPU in the XML API. This class is not meant for public usage.
	*
	* @private
	*
	*/
	var XMLMultiPartUploadHelper = class {
		constructor(bucket, fileName, uploadId, partsMap) {
			_XMLMultiPartUploadHelper_instances.add(this);
			this.authClient = bucket.storage.authClient || new google_auth_library_1.GoogleAuth();
			this.uploadId = uploadId || "";
			this.bucket = bucket;
			this.fileName = fileName;
			this.baseUrl = `https://${bucket.name}.${new URL(this.bucket.storage.apiEndpoint).hostname}/${fileName}`;
			this.xmlBuilder = new fast_xml_parser_1.XMLBuilder({ arrayNodeName: "Part" });
			this.xmlParser = new fast_xml_parser_1.XMLParser();
			this.partsMap = partsMap || /* @__PURE__ */ new Map();
			this.retryOptions = {
				retries: this.bucket.storage.retryOptions.maxRetries,
				factor: this.bucket.storage.retryOptions.retryDelayMultiplier,
				maxTimeout: this.bucket.storage.retryOptions.maxRetryDelay * 1e3,
				maxRetryTime: this.bucket.storage.retryOptions.totalTimeout * 1e3
			};
		}
		/**
		* Initiates a multipart upload (MPU) to the XML API and stores the resultant upload id.
		*
		* @returns {Promise<void>}
		*/
		async initiateUpload(headers = {}) {
			const url = `${this.baseUrl}?uploads`;
			return (0, async_retry_1.default)(async (bail) => {
				try {
					const res = await this.authClient.request({
						headers: __classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_setGoogApiClientHeaders).call(this, headers),
						method: "POST",
						url
					});
					if (res.data && res.data.error) throw res.data.error;
					const parsedXML = this.xmlParser.parse(res.data);
					this.uploadId = parsedXML.InitiateMultipartUploadResult.UploadId;
				} catch (e) {
					__classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_handleErrorResponse).call(this, e, bail);
				}
			}, this.retryOptions);
		}
		/**
		* Uploads the provided chunk of data to the XML API using the previously created upload id.
		*
		* @param {number} partNumber the sequence number of this chunk.
		* @param {Buffer} chunk the chunk of data to be uploaded.
		* @param {string | false} validation whether or not to include the md5 hash in the headers to cause the server
		* to validate the chunk was not corrupted.
		* @returns {Promise<void>}
		*/
		async uploadPart(partNumber, chunk, validation) {
			const url = `${this.baseUrl}?partNumber=${partNumber}&uploadId=${this.uploadId}`;
			let headers = __classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_setGoogApiClientHeaders).call(this);
			if (validation === "md5") headers = { "Content-MD5": (0, crypto_1.createHash)("md5").update(chunk).digest("base64") };
			return (0, async_retry_1.default)(async (bail) => {
				try {
					const res = await this.authClient.request({
						url,
						method: "PUT",
						body: chunk,
						headers
					});
					if (res.data && res.data.error) throw res.data.error;
					this.partsMap.set(partNumber, res.headers["etag"]);
				} catch (e) {
					__classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_handleErrorResponse).call(this, e, bail);
				}
			}, this.retryOptions);
		}
		/**
		* Sends the final request of the MPU to tell GCS the upload is now complete.
		*
		* @returns {Promise<void>}
		*/
		async completeUpload() {
			const url = `${this.baseUrl}?uploadId=${this.uploadId}`;
			const sortedMap = new Map([...this.partsMap.entries()].sort((a, b) => a[0] - b[0]));
			const parts = [];
			for (const entry of sortedMap.entries()) parts.push({
				PartNumber: entry[0],
				ETag: entry[1]
			});
			const body = `<CompleteMultipartUpload>${this.xmlBuilder.build(parts)}</CompleteMultipartUpload>`;
			return (0, async_retry_1.default)(async (bail) => {
				try {
					const res = await this.authClient.request({
						headers: __classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_setGoogApiClientHeaders).call(this),
						url,
						method: "POST",
						body
					});
					if (res.data && res.data.error) throw res.data.error;
					return res;
				} catch (e) {
					__classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_handleErrorResponse).call(this, e, bail);
					return;
				}
			}, this.retryOptions);
		}
		/**
		* Aborts an multipart upload that is in progress. Once aborted, any parts in the process of being uploaded fail,
		* and future requests using the upload ID fail.
		*
		* @returns {Promise<void>}
		*/
		async abortUpload() {
			const url = `${this.baseUrl}?uploadId=${this.uploadId}`;
			return (0, async_retry_1.default)(async (bail) => {
				try {
					const res = await this.authClient.request({
						url,
						method: "DELETE"
					});
					if (res.data && res.data.error) throw res.data.error;
				} catch (e) {
					__classPrivateFieldGet(this, _XMLMultiPartUploadHelper_instances, "m", _XMLMultiPartUploadHelper_handleErrorResponse).call(this, e, bail);
					return;
				}
			}, this.retryOptions);
		}
	};
	_XMLMultiPartUploadHelper_instances = /* @__PURE__ */ new WeakSet(), _XMLMultiPartUploadHelper_setGoogApiClientHeaders = function _XMLMultiPartUploadHelper_setGoogApiClientHeaders(headers = {}) {
		let headerFound = false;
		let userAgentFound = false;
		for (const [key, value] of Object.entries(headers)) if (key.toLocaleLowerCase().trim() === "x-goog-api-client") {
			headerFound = true;
			if (!value.includes(GCCL_GCS_CMD_FEATURE.UPLOAD_SHARDED)) headers[key] = `${value} gccl-gcs-cmd/${GCCL_GCS_CMD_FEATURE.UPLOAD_SHARDED}`;
		} else if (key.toLocaleLowerCase().trim() === "user-agent") userAgentFound = true;
		if (!headerFound) headers["x-goog-api-client"] = `${(0, util_js_2.getRuntimeTrackingString)()} gccl/${packageJson.version} gccl-gcs-cmd/${GCCL_GCS_CMD_FEATURE.UPLOAD_SHARDED}`;
		if (!userAgentFound) headers["User-Agent"] = (0, util_js_2.getUserAgentString)();
		return headers;
	}, _XMLMultiPartUploadHelper_handleErrorResponse = function _XMLMultiPartUploadHelper_handleErrorResponse(err, bail) {
		if (this.bucket.storage.retryOptions.autoRetry && this.bucket.storage.retryOptions.retryableErrorFn(err)) throw err;
		else bail(err);
	};
	/**
	* Create a TransferManager object to perform parallel transfer operations on a Cloud Storage bucket.
	*
	* @class
	* @hideconstructor
	*
	* @param {Bucket} bucket A {@link Bucket} instance
	*
	*/
	var TransferManager = class {
		constructor(bucket) {
			this.bucket = bucket;
		}
		/**
		* @typedef {object} UploadManyFilesOptions
		* @property {number} [concurrencyLimit] The number of concurrently executing promises
		* to use when uploading the files.
		* @property {Function} [customDestinationBuilder] A function that will take the current path of a local file
		* and return a string representing a custom path to be used to upload the file to GCS.
		* @property {boolean} [skipIfExists] Do not upload the file if it already exists in
		* the bucket. This will set the precondition ifGenerationMatch = 0.
		* @property {string} [prefix] A prefix to append to all of the uploaded files.
		* @property {object} [passthroughOptions] {@link UploadOptions} Options to be passed through
		* to each individual upload operation.
		*
		*/
		/**
		* Upload multiple files in parallel to the bucket. This is a convenience method
		* that utilizes {@link Bucket#upload} to perform the upload.
		*
		* @param {array | string} [filePathsOrDirectory] An array of fully qualified paths to the files or a directory name.
		* If a directory name is provided, the directory will be recursively walked and all files will be added to the upload list.
		* to be uploaded to the bucket
		* @param {UploadManyFilesOptions} [options] Configuration options.
		* @returns {Promise<UploadResponse[]>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const transferManager = new TransferManager(bucket);
		*
		* //-
		* // Upload multiple files in parallel.
		* //-
		* const response = await transferManager.uploadManyFiles(['/local/path/file1.txt, 'local/path/file2.txt']);
		* // Your bucket now contains:
		* // - "local/path/file1.txt" (with the contents of '/local/path/file1.txt')
		* // - "local/path/file2.txt" (with the contents of '/local/path/file2.txt')
		* const response = await transferManager.uploadManyFiles('/local/directory');
		* // Your bucket will now contain all files contained in '/local/directory' maintaining the subdirectory structure.
		* ```
		*
		*/
		async uploadManyFiles(filePathsOrDirectory, options = {}) {
			var _a;
			if (options.skipIfExists && ((_a = options.passthroughOptions) === null || _a === void 0 ? void 0 : _a.preconditionOpts)) options.passthroughOptions.preconditionOpts.ifGenerationMatch = 0;
			else if (options.skipIfExists && options.passthroughOptions === void 0) options.passthroughOptions = { preconditionOpts: { ifGenerationMatch: 0 } };
			const limit = (0, p_limit_1.default)(options.concurrencyLimit || DEFAULT_PARALLEL_UPLOAD_LIMIT);
			const promises = [];
			let allPaths = [];
			if (!Array.isArray(filePathsOrDirectory)) for await (const curPath of this.getPathsFromDirectory(filePathsOrDirectory)) allPaths.push(curPath);
			else allPaths = filePathsOrDirectory;
			for (const filePath of allPaths) {
				if ((await fs_1.promises.lstat(filePath)).isDirectory()) continue;
				const passThroughOptionsCopy = {
					...options.passthroughOptions,
					[util_js_1.GCCL_GCS_CMD_KEY]: GCCL_GCS_CMD_FEATURE.UPLOAD_MANY
				};
				passThroughOptionsCopy.destination = options.customDestinationBuilder ? options.customDestinationBuilder(filePath, options) : filePath.split(path.sep).join(path.posix.sep);
				if (options.prefix) passThroughOptionsCopy.destination = path.posix.join(...options.prefix.split(path.sep), passThroughOptionsCopy.destination);
				promises.push(limit(() => this.bucket.upload(filePath, passThroughOptionsCopy)));
			}
			return Promise.all(promises);
		}
		/**
		* @typedef {object} DownloadManyFilesOptions
		* @property {number} [concurrencyLimit] The number of concurrently executing promises
		* to use when downloading the files.
		* @property {string} [prefix] A prefix to append to all of the downloaded files.
		* @property {string} [stripPrefix] A prefix to remove from all of the downloaded files.
		* @property {object} [passthroughOptions] {@link DownloadOptions} Options to be passed through
		* to each individual download operation.
		* @property {boolean} [skipIfExists] Do not download the file if it already exists in
		* the destination.
		*
		*/
		/**
		* Download multiple files in parallel to the local filesystem. This is a convenience method
		* that utilizes {@link File#download} to perform the download.
		*
		* @param {array | string} [filesOrFolder] An array of file name strings or file objects to be downloaded. If
		* a string is provided this will be treated as a GCS prefix and all files with that prefix will be downloaded.
		* @param {DownloadManyFilesOptions} [options] Configuration options. Setting options.prefix or options.stripPrefix
		* or options.passthroughOptions.destination will cause the downloaded files to be written to the file system
		* instead of being returned as a buffer.
		* @returns {Promise<DownloadResponse[]>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const transferManager = new TransferManager(bucket);
		*
		* //-
		* // Download multiple files in parallel.
		* //-
		* const response = await transferManager.downloadManyFiles(['file1.txt', 'file2.txt']);
		* // The following files have been downloaded:
		* // - "file1.txt" (with the contents from my-bucket.file1.txt)
		* // - "file2.txt" (with the contents from my-bucket.file2.txt)
		* const response = await transferManager.downloadManyFiles([bucket.File('file1.txt'), bucket.File('file2.txt')]);
		* // The following files have been downloaded:
		* // - "file1.txt" (with the contents from my-bucket.file1.txt)
		* // - "file2.txt" (with the contents from my-bucket.file2.txt)
		* const response = await transferManager.downloadManyFiles('test-folder');
		* // All files with GCS prefix of 'test-folder' have been downloaded.
		* ```
		*
		*/
		async downloadManyFiles(filesOrFolder, options = {}) {
			const limit = (0, p_limit_1.default)(options.concurrencyLimit || DEFAULT_PARALLEL_DOWNLOAD_LIMIT);
			const promises = [];
			let files = [];
			if (!Array.isArray(filesOrFolder)) files = (await this.bucket.getFiles({ prefix: filesOrFolder }))[0];
			else files = filesOrFolder.map((curFile) => {
				if (typeof curFile === "string") return this.bucket.file(curFile);
				return curFile;
			});
			const stripRegexString = options.stripPrefix ? `^${options.stripPrefix}` : EMPTY_REGEX;
			const regex = new RegExp(stripRegexString, "g");
			for (const file of files) {
				const passThroughOptionsCopy = {
					...options.passthroughOptions,
					[util_js_1.GCCL_GCS_CMD_KEY]: GCCL_GCS_CMD_FEATURE.DOWNLOAD_MANY
				};
				if (options.prefix || passThroughOptionsCopy.destination) passThroughOptionsCopy.destination = path.join(options.prefix || "", passThroughOptionsCopy.destination || "", file.name);
				if (options.stripPrefix) passThroughOptionsCopy.destination = file.name.replace(regex, "");
				if (options.skipIfExists && (0, fs_1.existsSync)(passThroughOptionsCopy.destination || "")) continue;
				promises.push(limit(async () => {
					const destination = passThroughOptionsCopy.destination;
					if (destination && destination.endsWith(path.sep)) {
						await fs_1.promises.mkdir(destination, { recursive: true });
						return Promise.resolve([Buffer.alloc(0)]);
					}
					return file.download(passThroughOptionsCopy);
				}));
			}
			return Promise.all(promises);
		}
		/**
		* @typedef {object} DownloadFileInChunksOptions
		* @property {number} [concurrencyLimit] The number of concurrently executing promises
		* to use when downloading the file.
		* @property {number} [chunkSizeBytes] The size in bytes of each chunk to be downloaded.
		* @property {string | boolean} [validation] Whether or not to perform a CRC32C validation check when download is complete.
		* @property {boolean} [noReturnData] Whether or not to return the downloaded data. A `true` value here would be useful for files with a size that will not fit into memory.
		*
		*/
		/**
		* Download a large file in chunks utilizing parallel download operations. This is a convenience method
		* that utilizes {@link File#download} to perform the download.
		*
		* @param {File | string} fileOrName {@link File} to download.
		* @param {DownloadFileInChunksOptions} [options] Configuration options.
		* @returns {Promise<void | DownloadResponse>}
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const transferManager = new TransferManager(bucket);
		*
		* //-
		* // Download a large file in chunks utilizing parallel operations.
		* //-
		* const response = await transferManager.downloadFileInChunks(bucket.file('large-file.txt');
		* // Your local directory now contains:
		* // - "large-file.txt" (with the contents from my-bucket.large-file.txt)
		* ```
		*
		*/
		async downloadFileInChunks(fileOrName, options = {}) {
			let chunkSize = options.chunkSizeBytes || DOWNLOAD_IN_CHUNKS_DEFAULT_CHUNK_SIZE;
			let limit = (0, p_limit_1.default)(options.concurrencyLimit || DEFAULT_PARALLEL_CHUNKED_DOWNLOAD_LIMIT);
			const noReturnData = Boolean(options.noReturnData);
			const promises = [];
			const file = typeof fileOrName === "string" ? this.bucket.file(fileOrName) : fileOrName;
			const fileInfo = await file.get();
			const size = parseInt(fileInfo[0].metadata.size.toString());
			if (size < DOWNLOAD_IN_CHUNKS_FILE_SIZE_THRESHOLD) {
				limit = (0, p_limit_1.default)(1);
				chunkSize = size;
			}
			let start = 0;
			const filePath = options.destination || path.basename(file.name);
			const fileToWrite = await fs_1.promises.open(filePath, "w");
			while (start < size) {
				const chunkStart = start;
				let chunkEnd = start + chunkSize - 1;
				chunkEnd = chunkEnd > size ? size : chunkEnd;
				promises.push(limit(async () => {
					const resp = await file.download({
						start: chunkStart,
						end: chunkEnd,
						[util_js_1.GCCL_GCS_CMD_KEY]: GCCL_GCS_CMD_FEATURE.DOWNLOAD_SHARDED
					});
					const result = await fileToWrite.write(resp[0], 0, resp[0].length, chunkStart);
					if (noReturnData) return;
					return result.buffer;
				}));
				start += chunkSize;
			}
			let chunks;
			try {
				chunks = await Promise.all(promises);
			} finally {
				await fileToWrite.close();
			}
			if (options.validation === "crc32c" && fileInfo[0].metadata.crc32c) {
				if (!(await crc32c_js_1.CRC32C.fromFile(filePath)).validate(fileInfo[0].metadata.crc32c)) {
					const mismatchError = new file_js_1.RequestError(file_js_1.FileExceptionMessages.DOWNLOAD_MISMATCH);
					mismatchError.code = "CONTENT_DOWNLOAD_MISMATCH";
					throw mismatchError;
				}
			}
			if (noReturnData) return;
			return [Buffer.concat(chunks, size)];
		}
		/**
		* @typedef {object} UploadFileInChunksOptions
		* @property {number} [concurrencyLimit] The number of concurrently executing promises
		* to use when uploading the file.
		* @property {number} [chunkSizeBytes] The size in bytes of each chunk to be uploaded.
		* @property {string} [uploadName] Name of the file when saving to GCS. If omitted the name is taken from the file path.
		* @property {number} [maxQueueSize] The number of chunks to be uploaded to hold in memory concurrently. If not specified
		* defaults to the specified concurrency limit.
		* @property {string} [uploadId] If specified attempts to resume a previous upload.
		* @property {Map} [partsMap] If specified alongside uploadId, attempts to resume a previous upload from the last chunk
		* specified in partsMap
		* @property {object} [headers] headers to be sent when initiating the multipart upload.
		* See {@link https://cloud.google.com/storage/docs/xml-api/post-object-multipart#request_headers| Request Headers: Initiate a Multipart Upload}
		* @property {boolean} [autoAbortFailure] boolean to indicate if an in progress upload session will be automatically aborted upon failure. If not set,
		* failures will be automatically aborted.
		*
		*/
		/**
		* Upload a large file in chunks utilizing parallel upload operations. If the upload fails, an uploadId and
		* map containing all the successfully uploaded parts will be returned to the caller. These arguments can be used to
		* resume the upload.
		*
		* @param {string} [filePath] The path of the file to be uploaded
		* @param {UploadFileInChunksOptions} [options] Configuration options.
		* @param {MultiPartHelperGenerator} [generator] A function that will return a type that implements the MPU interface. Most users will not need to use this.
		* @returns {Promise<void>} If successful a promise resolving to void, otherwise a error containing the message, uploadId, and parts map.
		*
		* @example
		* ```
		* const {Storage} = require('@google-cloud/storage');
		* const storage = new Storage();
		* const bucket = storage.bucket('my-bucket');
		* const transferManager = new TransferManager(bucket);
		*
		* //-
		* // Upload a large file in chunks utilizing parallel operations.
		* //-
		* const response = await transferManager.uploadFileInChunks('large-file.txt');
		* // Your bucket now contains:
		* // - "large-file.txt"
		* ```
		*
		*
		*/
		async uploadFileInChunks(filePath, options = {}, generator = defaultMultiPartGenerator) {
			const chunkSize = options.chunkSizeBytes || UPLOAD_IN_CHUNKS_DEFAULT_CHUNK_SIZE;
			const limit = (0, p_limit_1.default)(options.concurrencyLimit || DEFAULT_PARALLEL_CHUNKED_UPLOAD_LIMIT);
			const maxQueueSize = options.maxQueueSize || options.concurrencyLimit || DEFAULT_PARALLEL_CHUNKED_UPLOAD_LIMIT;
			const fileName = options.uploadName || path.basename(filePath);
			const mpuHelper = generator(this.bucket, fileName, options.uploadId, options.partsMap);
			let partNumber = 1;
			let promises = [];
			try {
				if (options.uploadId === void 0) await mpuHelper.initiateUpload(options.headers);
				const startOrResumptionByte = mpuHelper.partsMap.size * chunkSize;
				const readStream = (0, fs_1.createReadStream)(filePath, {
					highWaterMark: chunkSize,
					start: startOrResumptionByte
				});
				for await (const curChunk of readStream) {
					if (promises.length >= maxQueueSize) {
						await Promise.all(promises);
						promises = [];
					}
					promises.push(limit(() => mpuHelper.uploadPart(partNumber++, curChunk, options.validation)));
				}
				await Promise.all(promises);
				return await mpuHelper.completeUpload();
			} catch (e) {
				if ((options.autoAbortFailure === void 0 || options.autoAbortFailure) && mpuHelper.uploadId) try {
					await mpuHelper.abortUpload();
					return;
				} catch (e) {
					throw new MultiPartUploadError(e.message, mpuHelper.uploadId, mpuHelper.partsMap);
				}
				throw new MultiPartUploadError(e.message, mpuHelper.uploadId, mpuHelper.partsMap);
			}
		}
		async *getPathsFromDirectory(directory) {
			const filesAndSubdirectories = await fs_1.promises.readdir(directory, { withFileTypes: true });
			for (const curFileOrDirectory of filesAndSubdirectories) {
				const fullPath = path.join(directory, curFileOrDirectory.name);
				curFileOrDirectory.isDirectory() ? yield* this.getPathsFromDirectory(fullPath) : yield fullPath;
			}
		}
	};
	exports.TransferManager = TransferManager;
}));
//#endregion
//#region node_modules/@google-cloud/storage/build/cjs/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Notification = exports.Iam = exports.HmacKey = exports.File = exports.Channel = exports.Bucket = exports.Storage = exports.RETRYABLE_ERR_FN_DEFAULT = exports.IdempotencyStrategy = exports.ApiError = void 0;
	/**
	* The `@google-cloud/storage` package has a single named export which is the
	* {@link Storage} (ES6) class, which should be instantiated with `new`.
	*
	* See {@link Storage} and {@link ClientConfig} for client methods and
	* configuration options.
	*
	* @module {Storage} @google-cloud/storage
	* @alias nodejs-storage
	*
	* @example
	* Install the client library with <a href="https://www.npmjs.com/">npm</a>:
	* ```
	* npm install --save @google-cloud/storage
	* ```
	*
	* @example
	* Import the client library
	* ```
	* const {Storage} = require('@google-cloud/storage');
	* ```
	*
	* @example
	* Create a client that uses <a
	* href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
	* Default Credentials (ADC)</a>:
	* ```
	* const storage = new Storage();
	* ```
	*
	* @example
	* Create a client with <a
	* href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
	* credentials</a>:
	* ```
	* const storage = new Storage({ projectId:
	* 'your-project-id', keyFilename: '/path/to/keyfile.json'
	* });
	* ```
	*
	* @example <caption>include:samples/quickstart.js</caption>
	* region_tag:storage_quickstart
	* Full quickstart example:
	*/
	var index_js_1 = require_nodejs_common();
	Object.defineProperty(exports, "ApiError", {
		enumerable: true,
		get: function() {
			return index_js_1.ApiError;
		}
	});
	var storage_js_1 = require_storage();
	Object.defineProperty(exports, "IdempotencyStrategy", {
		enumerable: true,
		get: function() {
			return storage_js_1.IdempotencyStrategy;
		}
	});
	Object.defineProperty(exports, "RETRYABLE_ERR_FN_DEFAULT", {
		enumerable: true,
		get: function() {
			return storage_js_1.RETRYABLE_ERR_FN_DEFAULT;
		}
	});
	Object.defineProperty(exports, "Storage", {
		enumerable: true,
		get: function() {
			return storage_js_1.Storage;
		}
	});
	var bucket_js_1 = require_bucket();
	Object.defineProperty(exports, "Bucket", {
		enumerable: true,
		get: function() {
			return bucket_js_1.Bucket;
		}
	});
	__exportStar(require_crc32c(), exports);
	var channel_js_1 = require_channel();
	Object.defineProperty(exports, "Channel", {
		enumerable: true,
		get: function() {
			return channel_js_1.Channel;
		}
	});
	var file_js_1 = require_file();
	Object.defineProperty(exports, "File", {
		enumerable: true,
		get: function() {
			return file_js_1.File;
		}
	});
	__exportStar(require_hash_stream_validator(), exports);
	var hmacKey_js_1 = require_hmacKey();
	Object.defineProperty(exports, "HmacKey", {
		enumerable: true,
		get: function() {
			return hmacKey_js_1.HmacKey;
		}
	});
	var iam_js_1 = require_iam();
	Object.defineProperty(exports, "Iam", {
		enumerable: true,
		get: function() {
			return iam_js_1.Iam;
		}
	});
	var notification_js_1 = require_notification();
	Object.defineProperty(exports, "Notification", {
		enumerable: true,
		get: function() {
			return notification_js_1.Notification;
		}
	});
	__exportStar(require_transfer_manager(), exports);
}));
//#endregion
export { require_src as t };
