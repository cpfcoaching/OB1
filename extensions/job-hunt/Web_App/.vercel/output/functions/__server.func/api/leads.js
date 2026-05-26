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
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS')
        return res.status(200).end();
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('leads')
            .orderBy('received_date', 'desc')
            .limit(100)
            .get();
        const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.status(200).json(leads);
    }
    catch (err) {
        console.error('API Error (Leads):', err);
        return res.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=leads.js.map