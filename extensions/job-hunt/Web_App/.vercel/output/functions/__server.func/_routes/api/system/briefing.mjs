import { o as __toESM } from "../../../_runtime.mjs";
import { t as require_lib } from "../../../_libs/firebase-admin+[...].mjs";
//#region api/system/briefing.ts
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
if (!import_lib.default.apps.length) try {
	import_lib.default.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
} catch (e) {
	console.error("Firebase Admin Init Error:", e);
}
async function handler(req, res) {
	try {
		const db = import_lib.default.firestore();
		const gaSnap = await db.collection("system_status").doc("ga_correlations").get();
		const gaData = gaSnap.exists ? gaSnap.data() : {};
		const leads = (await db.collection("leads").where("status", "==", "pending_review").get()).docs.map((d) => d.data());
		const todayStr = (/* @__PURE__ */ new Date()).toDateString();
		const briefing = {
			leads: {
				hot: leads.filter((l) => l.lead_quality === "hot").length,
				warm: leads.filter((l) => l.lead_quality === "warm").length,
				pending: leads.length,
				new_today: leads.filter((l) => {
					return new Date(l.received_date || /* @__PURE__ */ new Date()).toDateString() === todayStr;
				}).length
			},
			ga: {
				sessions: gaData?.linkedin_traffic_sessions || 0,
				conversions: gaData?.leads_upgraded || 0
			}
		};
		return res.status(200).json(briefing);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
//#endregion
export { handler as default };
