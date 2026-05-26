export default async function handler(req, res) {
    // Simulate auto-apply for demo; replace with real JobSpy/ACE integration
    const { jobs = [] } = req.body || {};
    res.status(200).json({ message: `Auto-applied to ${jobs.length} jobs.` });
}
//# sourceMappingURL=apply-job.js.map