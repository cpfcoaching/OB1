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
        // Fetch GA data from system_status
        const gaSnap = await db.collection('system_status').doc('ga_correlations').get();
        const gaData = gaSnap.exists ? gaSnap.data() : {};
        // Fetch leads summary (we could optimize this with a summary doc, but for POC we count)
        const leadsSnap = await db.collection('leads').where('status', '==', 'pending_review').get();
        const leads = leadsSnap.docs.map(d => d.data());
        const todayStr = new Date().toDateString();
        const briefing = {
            leads: {
                hot: leads.filter((l) => l.lead_quality === 'hot').length,
                warm: leads.filter((l) => l.lead_quality === 'warm').length,
                pending: leads.length,
                new_today: leads.filter((l) => {
                    const date = new Date(l.received_date || new Date());
                    return date.toDateString() === todayStr;
                }).length
            },
            ga: {
                sessions: gaData?.linkedin_traffic_sessions || 0,
                conversions: gaData?.leads_upgraded || 0
            }
        };
        return res.status(200).json(briefing);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=briefing.js.map