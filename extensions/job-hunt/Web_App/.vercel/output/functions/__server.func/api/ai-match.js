import Anthropic from '@anthropic-ai/sdk';
function scoreJobLocally(job, candidateSkills) {
    if (!candidateSkills.length)
        return 75;
    const titleLower = (job.position ?? '').toLowerCase();
    const matched = candidateSkills.filter(s => titleLower.includes(s.toLowerCase()));
    return Math.min(95, 60 + matched.length * 10);
}
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { jobs = [], candidateSkills = [], title = '', location = '' } = req.body || {};
    // 1. Try OpenRouter (Primary)
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey && jobs.length > 0) {
        try {
            const prompt = `You are an expert technical recruiter. Analyze the following jobs against a candidate's profile.
Candidate Skills: ${candidateSkills.join(', ')}
Target Role: ${title} in ${location}

Jobs to analyze:
${JSON.stringify(jobs.slice(0, 10), null, 2)}

Respond with a JSON object containing a "matchedJobs" array where each job has a "matchScore" (0-100) and a "matchReason" (short explanation).
Only return the JSON.`;
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://app.cpfcoaching.us",
                    "X-Title": "CPF Job Hunt"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });
            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    if (parsed.matchedJobs) {
                        return res.status(200).json(parsed);
                    }
                }
            }
        }
        catch (err) {
            console.error('OpenRouter matching failed:', err);
        }
    }
    // 2. Try Claude (Secondary Fallback)
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey && jobs.length > 0) {
        try {
            const anthropic = new Anthropic({ apiKey: anthropicKey });
            const prompt = `You are an expert technical recruiter. Analyze the following jobs against a candidate's profile.
Candidate Skills: ${candidateSkills.join(', ')}
Target Role: ${title} in ${location}

Jobs to analyze:
${JSON.stringify(jobs.slice(0, 5), null, 2)}

Respond with a JSON object containing a "matchedJobs" array where each job has a "matchScore" (0-100) and a "matchReason" (short explanation).
Only return the JSON.`;
            const msg = await anthropic.messages.create({
                model: "claude-3-5-haiku-20241022",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            });
            const content = msg.content[0];
            if (content.type === 'text') {
                const data = JSON.parse(content.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
                if (data.matchedJobs) {
                    return res.status(200).json(data);
                }
            }
        }
        catch (err) {
            console.error('Claude matching failed:', err);
        }
    }
    // 2. Try ACE agent fallback
    const aceUrl = process.env.ACE_AGENT_URL;
    if (aceUrl) {
        try {
            const aceRes = await fetch(`${aceUrl}/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobs, candidateSkills, title, location })
            });
            if (aceRes.ok) {
                return res.status(200).json(await aceRes.json());
            }
        }
        catch (err) {
            console.error('ACE agent fallback failed:', err);
        }
    }
    // 3. Final local fallback
    const skills = Array.isArray(candidateSkills) ? candidateSkills : [];
    const safeJobs = Array.isArray(jobs) ? jobs : [];
    const matchedJobs = safeJobs
        .map(job => ({
        ...job,
        matchScore: scoreJobLocally(job, skills),
        matchReason: skills.length
            ? `Matched on: ${skills.filter(s => (job.position ?? '').toLowerCase().includes(s.toLowerCase())).join(', ') || 'general fit'}`
            : 'Scored based on role relevance'
    }))
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    return res.status(200).json({
        message: `AI matched ${matchedJobs.length} jobs (local fallback).`,
        matchedJobs
    });
}
//# sourceMappingURL=ai-match.js.map