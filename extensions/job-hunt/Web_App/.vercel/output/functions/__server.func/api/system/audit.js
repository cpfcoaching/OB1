import admin from 'firebase-admin';
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
        });
    }
    catch (e) {
        console.error('Firebase Admin Init Error:', e);
    }
}
export default async function handler(req, res) {
    try {
        const db = admin.firestore();
        const snap = await db.collection('system_status').doc('audit_report').get();
        if (!snap.exists) {
            return res.status(200).json({ content: "Audit report not yet generated in cloud." });
        }
        const content = snap.data()?.content || "Empty audit report.";
        return res.status(200).json({ content });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=audit.js.map