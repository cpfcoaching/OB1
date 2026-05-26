import { o as __toESM } from "../../../_runtime.mjs";
import { t as require_lib } from "../../../_libs/firebase-admin+[...].mjs";
//#region api/system/audit.ts
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
if (!import_lib.default.apps.length) try {
	import_lib.default.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
} catch (e) {
	console.error("Firebase Admin Init Error:", e);
}
async function handler(req, res) {
	try {
		const snap = await import_lib.default.firestore().collection("system_status").doc("audit_report").get();
		if (!snap.exists) return res.status(200).json({ content: "Audit report not yet generated in cloud." });
		const content = snap.data()?.content || "Empty audit report.";
		return res.status(200).json({ content });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
//#endregion
export { handler as default };
