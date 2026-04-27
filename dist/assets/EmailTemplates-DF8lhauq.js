import{C as e,E as t,I as n,L as r,M as i,N as a,O as o,P as s,R as c,S as l,U as u,V as d,W as f,ct as p,k as m,lt as h,t as g}from"./useAuth-BH5pCoYZ.js";import{r as _}from"./runtime-dom.esm-bundler-CtZDkSGd.js";import{t as v}from"./useAnalytics-56mjwtot.js";import{t as y}from"./TopBanner-Dd47VS1A.js";var b={class:`max-w-6xl mx-auto`},x={class:`max-w-6xl mx-auto p-6`},S={class:`grid grid-cols-1 lg:grid-cols-3 gap-6`},C={class:`lg:col-span-1`},w={class:`divide-y divide-gray-700`},T=[`onClick`],E={class:`lg:col-span-2`},D={class:`mb-6`},O={class:`mb-6`},k={class:`mb-6`},A={class:`flex gap-3 flex-wrap`},j={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},M=s({__name:`EmailTemplates`,setup(s){let M=l(),{user:N,initializeAuth:P,isDark:F}=g(),{trackEmailTemplateCopied:I,trackFeatureView:L}=v(),R=u(0),z=u(``),B=u([{name:`Job Inquiry`,emoji:`💼`,description:`Reach out to a hiring manager about a specific position`,variables:[`[Hiring Manager Name]`,`[Company]`,`[Position]`,`[Your Name]`,`[Your LinkedIn]`],subject:`Inquiry about [Position] at [Company]`,body:`Dear [Hiring Manager Name],

I am interested in the [Position] role at [Company] and believe my background aligns well with your team's needs.

With my experience in [Your Skills/Background], I am confident I can contribute meaningfully to your organization. I would appreciate the opportunity to discuss how my expertise could benefit [Company].

Could we schedule a brief call at your convenience?

Best regards,
[Your Name]
[Your Phone]
[Your LinkedIn]`},{name:`Follow-up After Application`,emoji:`📨`,description:`Follow up after submitting an application`,variables:[`[Hiring Manager Name]`,`[Company]`,`[Position]`,`[Application Date]`,`[Your Name]`],subject:`Following up on [Position] Application at [Company]`,body:`Hello [Hiring Manager Name],

I submitted my application for the [Position] position at [Company] on [Application Date]. I remain very interested in this opportunity and would love to provide any additional information you might need.

I am excited about the possibility of joining your team and contributing to [Company]'s mission.

Thank you for your consideration.

Best regards,
[Your Name]`},{name:`Thank You After Interview`,emoji:`🙏`,description:`Send after an interview to reiterate interest`,variables:[`[Interviewer Name]`,`[Company]`,`[Position]`,`[Specific Topic]`,`[Your Name]`],subject:`Thank You for the [Position] Interview - [Your Name]`,body:`Dear [Interviewer Name],

Thank you for taking the time to speak with me today about the [Position] role at [Company]. I truly enjoyed our conversation about [Specific Topic] and learning more about your team.

I am impressed by [Company]'s commitment to [Something you learned] and am very interested in contributing to your organization.

I look forward to the next steps in the process.

Best regards,
[Your Name]`},{name:`Networking Message`,emoji:`🤝`,description:`Connect with industry professionals on LinkedIn or via email`,variables:[`[Name]`,`[Their Company/Title]`,`[Common Connection/Interest]`,`[Your Name]`],subject:`Let's Connect - [Your Name] in [Your Field]`,body:`Hi [Name],

I came across your profile and was impressed by your work at [Their Company/Title]. We share a common interest in [Common Connection/Interest], and I'd love to connect and learn from your experiences.

Would you be open to a brief coffee chat or call in the coming weeks?

Looking forward to connecting.

Best regards,
[Your Name]
[Your LinkedIn URL]`},{name:`Offer Negotiation`,emoji:`💰`,description:`Professional response to a job offer for negotiation`,variables:[`[Hiring Manager Name]`,`[Company]`,`[Position]`,`[Concern/Request]`,`[Your Name]`],subject:`[Position] Offer - [Your Name]`,body:`Dear [Hiring Manager Name],

Thank you for the offer for the [Position] role at [Company]. I am excited about the opportunity and appreciate your confidence in me.

Before I formally accept, I wanted to discuss [Concern/Request] to ensure we are aligned. I believe this would be beneficial for both parties.

Could we schedule a brief call to discuss this?

Best regards,
[Your Name]`},{name:`Rejection Follow-up`,emoji:`💪`,description:`Professional response to a rejection to stay on their radar`,variables:[`[Hiring Manager Name]`,`[Company]`,`[Position]`,`[Your Name]`],subject:`Thank You for the Opportunity - [Position] at [Company]`,body:`Dear [Hiring Manager Name],

Thank you for considering my application for the [Position] position at [Company]. While I was disappointed to hear the news, I truly appreciate the opportunity to interview with your team.

I remain interested in future opportunities at [Company] and would welcome the chance to stay connected. Please feel free to reach out if a suitable role aligns with my background in the future.

Best regards,
[Your Name]`}]),V=u({subject:B.value[0].subject,body:B.value[0].body});n(async()=>{await P(),N.value||M.push(`/login`),L(`email_templates`)});let H=async e=>{let t=``,n=B.value[R.value]?.name||`Unknown`;e===`subject`?(t=V.value.subject,z.value=`Subject copied to clipboard! 📋`):e===`body`?(t=V.value.body,z.value=`Email body copied to clipboard! ✉️`):(t=`Subject: ${V.value.subject}\n\n${V.value.body}`,z.value=`Full email copied to clipboard! 📧`),await navigator.clipboard.writeText(t),I(n),setTimeout(()=>{z.value=``},3e3)},U=()=>{V.value={subject:B.value[R.value].subject,body:B.value[R.value].body},z.value=`Template reset to original ✨`,setTimeout(()=>{z.value=``},2e3)};return(n,s)=>(r(),m(`div`,{class:p([f(F)?`bg-gray-900`:`bg-gradient-to-br from-blue-50 to-indigo-50`,`min-h-screen`])},[a(y),t(`div`,{class:p([f(F)?`bg-gray-800 border-gray-700`:`bg-white border-gray-200`,`border-b p-6`])},[t(`div`,b,[t(`h1`,{class:p([f(F)?`text-white`:`text-gray-900`,`text-2xl font-bold mb-1`])},`📧 Email Templates`,2),t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm`])},`Professional email templates for job search communications`,2)])],2),t(`div`,x,[t(`div`,S,[t(`div`,C,[t(`div`,{class:p([f(F)?`bg-gray-800 border-gray-700`:`bg-white border-gray-200`,`border rounded-lg shadow-sm overflow-hidden`])},[t(`div`,{class:p([f(F)?`bg-gray-700`:`bg-indigo-50`,`p-4 border-b border-gray-700`])},[t(`h2`,{class:p([f(F)?`text-white`:`text-gray-900`,`font-bold`])},`Templates`,2)],2),t(`div`,w,[(r(!0),m(e,null,c(B.value,(e,t)=>(r(),m(`button`,{key:t,onClick:e=>R.value=t,class:p([R.value===t?f(F)?`bg-indigo-600 text-white`:`bg-indigo-100 text-indigo-900`:f(F)?`text-gray-300 hover:bg-gray-700`:`text-gray-700 hover:bg-gray-50`,`w-full text-left px-4 py-3 transition font-medium`])},h(e.emoji)+` `+h(e.name),11,T))),128))])],2)]),t(`div`,E,[B.value[R.value]?(r(),m(`div`,{key:0,class:p([f(F)?`bg-gray-800 border-gray-700`:`bg-white border-gray-200`,`border rounded-lg shadow-sm p-6`])},[t(`div`,D,[t(`h2`,{class:p([f(F)?`text-white`:`text-gray-900`,`text-2xl font-bold mb-2`])},h(B.value[R.value].emoji)+` `+h(B.value[R.value].name),3),t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm mb-4`])},h(B.value[R.value].description),3),B.value[R.value].variables.length>0?(r(),m(`div`,{key:0,class:p([f(F)?`bg-gray-700 text-gray-300`:`bg-blue-50 text-blue-900`,`text-xs rounded p-3 mb-4`])},[s[5]||=t(`strong`,null,`Variables:`,-1),i(` `+h(B.value[R.value].variables.join(`, `))+` `,1),s[6]||=t(`br`,null,null,-1),s[7]||=t(`span`,{class:`text-xs opacity-75`},`Customize by replacing [Variable] with your actual values`,-1)],2)):o(``,!0)]),t(`div`,O,[t(`label`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`block text-sm font-medium mb-2`])},`Subject Line`,2),d(t(`input`,{"onUpdate:modelValue":s[0]||=e=>V.value.subject=e,type:`text`,class:p([f(F)?`bg-gray-700 text-white border-gray-600`:`bg-white text-gray-900 border-gray-300`,`w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500`])},null,2),[[_,V.value.subject]])]),t(`div`,k,[t(`label`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`block text-sm font-medium mb-2`])},`Email Body`,2),d(t(`textarea`,{"onUpdate:modelValue":s[1]||=e=>V.value.body=e,class:p([f(F)?`bg-gray-700 text-white border-gray-600`:`bg-white text-gray-900 border-gray-300`,`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm`]),rows:`16`},null,2),[[_,V.value.body]])]),t(`div`,A,[t(`button`,{onClick:s[2]||=e=>H(`both`),class:`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition font-medium`},` 📋 Copy All `),t(`button`,{onClick:s[3]||=e=>H(`subject`),class:p([f(F)?`bg-gray-700 text-gray-300 hover:bg-gray-600`:`bg-gray-200 text-gray-700 hover:bg-gray-300`,`flex-1 px-4 py-2 rounded-lg transition font-medium`])},` 📄 Copy Subject `,2),t(`button`,{onClick:s[4]||=e=>H(`body`),class:p([f(F)?`bg-gray-700 text-gray-300 hover:bg-gray-600`:`bg-gray-200 text-gray-700 hover:bg-gray-300`,`flex-1 px-4 py-2 rounded-lg transition font-medium`])},` ✉️ Copy Body `,2),t(`button`,{onClick:U,class:p([f(F)?`bg-gray-700 text-gray-300 hover:bg-gray-600`:`bg-gray-200 text-gray-700 hover:bg-gray-300`,`flex-1 px-4 py-2 rounded-lg transition font-medium`])},` 🔄 Reset `,2)]),z.value?(r(),m(`div`,{key:0,class:p([f(F)?`bg-green-900 text-green-200`:`bg-green-100 text-green-900`,`mt-4 p-3 rounded-lg text-sm`])},` ✅ `+h(z.value),3)):o(``,!0)],2)):o(``,!0)])]),t(`div`,{class:p([f(F)?`bg-gray-800 border-gray-700`:`bg-white border-gray-200`,`border rounded-lg shadow-sm p-6 mt-6`])},[t(`h3`,{class:p([f(F)?`text-white`:`text-gray-900`,`text-lg font-bold mb-4`])},`💡 Tips for Success`,2),t(`div`,j,[t(`div`,null,[t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm`])},[...s[8]||=[t(`strong`,null,`Personalize:`,-1),i(` Always replace [Name], [Company], and [Position] with actual values `,-1)]],2)]),t(`div`,null,[t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm`])},[...s[9]||=[t(`strong`,null,`Keep it Short:`,-1),i(` 3-4 paragraphs max for cold emails `,-1)]],2)]),t(`div`,null,[t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm`])},[...s[10]||=[t(`strong`,null,`Be Professional:`,-1),i(` No typos or grammatical errors `,-1)]],2)]),t(`div`,null,[t(`p`,{class:p([f(F)?`text-gray-400`:`text-gray-600`,`text-sm`])},[...s[11]||=[t(`strong`,null,`Add a Call-to-Action:`,-1),i(` Always end with what you want them to do `,-1)]],2)])])],2)])],2))}});export{M as default};