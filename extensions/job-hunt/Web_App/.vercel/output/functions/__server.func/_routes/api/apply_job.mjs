//#region api/apply-job.ts
async function handler(req, res) {
	const { jobs = [] } = req.body || {};
	res.status(200).json({ message: `Auto-applied to ${jobs.length} jobs.` });
}
//#endregion
export { handler as default };
