import { o as __toESM } from "../../../_runtime.mjs";
import { t as require_lib } from "../../../_libs/firebase-admin+[...].mjs";
//#region api/system/health.ts
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
if (!import_lib.default.apps.length) try {
	import_lib.default.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
} catch (e) {
	console.error("Firebase Admin Init Error:", e);
}
async function handler(req, res) {
	try {
		const snap = await import_lib.default.firestore().collection("system_status").doc("ga_correlations").get();
		const lastRun = snap.exists ? snap.data()?.updatedAt?.toDate() : null;
		const isHealthy = lastRun && (/* @__PURE__ */ new Date()).getTime() - lastRun.getTime() < 36e5 * 24;
		return res.status(200).json({
			ollama: "OK",
			dashboard: "OK",
			lastAgentSync: lastRun,
			status: isHealthy ? "OK" : "STALE",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
//#endregion
export { handler as default };
