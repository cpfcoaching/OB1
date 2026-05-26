import { o as __toESM } from "../../_runtime.mjs";
import { t as require_lib } from "../../_libs/firebase-admin+[...].mjs";
//#region api/leads.ts
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
if (!import_lib.default.apps.length) try {
	import_lib.default.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
} catch (e) {
	console.error("Firebase Admin Init Error:", e);
}
async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") return res.status(200).end();
	try {
		const leads = (await import_lib.default.firestore().collection("leads").orderBy("received_date", "desc").limit(100).get()).docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		return res.status(200).json(leads);
	} catch (err) {
		console.error("API Error (Leads):", err);
		return res.status(500).json({ error: err.message });
	}
}
//#endregion
export { handler as default };
