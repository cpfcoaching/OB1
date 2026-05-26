//#region api/scrape-jobs.ts
async function searchViaRapidAPI(params) {
	const apiKey = process.env.RAPIDAPI_KEY;
	if (!apiKey) return [];
	const queryParts = [params.title, params.skills].filter(Boolean);
	if (params.minSalary) queryParts.push(`$${params.minSalary.toLocaleString()}+`);
	const query = queryParts.join(" ") || "software engineer";
	const location = params.location || "United States";
	const url = new URL("https://jsearch.p.rapidapi.com/search");
	url.searchParams.set("query", `${query} in ${location}`);
	url.searchParams.set("page", "1");
	url.searchParams.set("num_pages", "1");
	let response;
	try {
		response = await fetch(url.toString(), { headers: {
			"x-rapidapi-key": apiKey,
			"x-rapidapi-host": "jsearch.p.rapidapi.com"
		} });
	} catch (err) {
		throw new Error(`RapidAPI network error: ${err.message}`);
	}
	if (!response.ok) throw new Error(`RapidAPI responded with status ${response.status}`);
	return ((await response.json())?.data ?? []).filter((item) => params.minSalary == null || item.job_min_salary != null && item.job_min_salary >= params.minSalary).map((item) => ({
		position: item.job_title ?? "Unknown Role",
		company: item.employer_name ?? "Unknown Company",
		url: item.job_apply_link ?? "",
		location: [item.job_city, item.job_state].filter(Boolean).join(", "),
		salary: item.job_min_salary ? `$${item.job_min_salary.toLocaleString()}–$${(item.job_max_salary ?? item.job_min_salary).toLocaleString()}` : void 0
	}));
}
var DEMO_JOBS = {
	"job-ops": [{
		position: "Backend Engineer",
		company: "Acme Corp",
		url: "https://acme.com/jobs/1",
		location: "Remote"
	}, {
		position: "Frontend Developer",
		company: "Beta Inc",
		url: "https://beta.com/jobs/2",
		location: "New York, NY"
	}],
	jobspy: [{
		position: "DevOps Engineer",
		company: "Gamma LLC",
		url: "https://gamma.com/jobs/3",
		location: "San Francisco, CA"
	}, {
		position: "QA Tester",
		company: "Delta Ltd",
		url: "https://delta.com/jobs/4",
		location: "Austin, TX"
	}],
	"career-ops": [{
		position: "Product Manager",
		company: "Epsilon AG",
		url: "https://epsilon.com/jobs/5",
		location: "Chicago, IL"
	}, {
		position: "Data Scientist",
		company: "Zeta GmbH",
		url: "https://zeta.com/jobs/6",
		location: "Seattle, WA"
	}]
};
async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
	const { source, title = "", location = "", salary = "", skills = "" } = req.body || {};
	const parsedSalary = parseInt(String(salary), 10);
	const minSalary = salary && !isNaN(parsedSalary) ? parsedSalary : void 0;
	let jobs = [];
	const hasApiKey = Boolean(process.env.RAPIDAPI_KEY);
	if (hasApiKey) try {
		jobs = await searchViaRapidAPI({
			title,
			location,
			minSalary,
			skills
		});
	} catch (err) {
		console.error("RapidAPI call failed, falling back to demo data:", err);
		jobs = DEMO_JOBS[source] ?? [];
	}
	else jobs = DEMO_JOBS[source] ?? [];
	const message = hasApiKey ? `Scraped ${jobs.length} jobs from ${source ?? "unknown"}.` : `Using DEMO DATA for ${source ?? "unknown"}. Set RAPIDAPI_KEY in Vercel to enable live scraping.`;
	return res.status(200).json({
		message,
		source: hasApiKey ? "rapidapi" : "demo",
		jobs
	});
}
//#endregion
export { handler as default };
