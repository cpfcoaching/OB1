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
        const snap = await db.collection('system_status').doc('ga_correlations').get();
        // If the GA correlator ran recently, we consider the system healthy
        const lastRun = snap.exists ? snap.data()?.updatedAt?.toDate() : null;
        const isHealthy = lastRun && (new Date().getTime() - lastRun.getTime() < 3600000 * 24); // 24 hours
        return res.status(200).json({
            ollama: 'OK', // Defaulting since we can't probe local ports from Vercel
            dashboard: 'OK',
            lastAgentSync: lastRun,
            status: isHealthy ? 'OK' : 'STALE',
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=health.js.map