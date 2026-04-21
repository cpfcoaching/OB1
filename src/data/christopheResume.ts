/**Auto-populate resume from scraped web data*/
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export const christopheResumeData = {
  personalInfo: {
    fullName: 'Christophe Foulon',
    email: 'christophefoulon@gmail.com',
    phone: '+1-202-838-6187',
    location: 'Haymarket, VA / Washington D.C. Area'
  },
  summary: `Business-aligned and results-driven CISO with over 20 years of experience treating cybersecurity as a fundamental business issue, not just a technical problem. Proven track record of partnering with Boards of Directors and C-suite executives to demystify the complex risk landscape and build resilient, business-aligned security programs. Expertise in building and maturing security capabilities from the ground up, leading complex digital transformations, and orchestrating security operations for critical government cloud infrastructure. A recognized thought leader, multi-book author, and podcast host dedicated to developing and mentoring the next generation of cyber leaders. Deep subject matter expertise in Microsoft Cloud, Data, AI, and GRC. Certifications include CISSP, GSLC, CRISC, CDPSE, AWS Security, and CompTIA Security+.`,
  experience: [
    {
      position: 'Adjunct Professor',
      company: 'Bellevue University',
      startDate: '2024-07',
      endDate: '',
      description: `Teaching cybersecurity curriculum to the next generation of security professionals. Applying real-world vCISO and enterprise security leadership experience to academic instruction, helping students bridge the gap between theory and industry practice.`
    },
    {
      position: 'Fractional CISO',
      company: 'Nexigen',
      startDate: '2024-01',
      endDate: '',
      description: `Serving as Fractional CISO providing strategic cybersecurity leadership. Developing and overseeing security programs, risk management frameworks, and compliance initiatives aligned with business objectives.`
    },
    {
      position: 'Fractional Cybersecurity Engineer',
      company: 'SideChannel',
      startDate: '2024-01',
      endDate: '',
      description: `Providing fractional cybersecurity engineering expertise to clients. Delivering hands-on technical security guidance alongside strategic advisory services to help organizations build robust security capabilities.`
    },
    {
      position: 'President',
      company: 'InfraGard National Capital Region',
      startDate: '2023-01',
      endDate: '2026-12',
      description: `Leading the InfraGard National Capital Region chapter, the FBI's public-private partnership for critical infrastructure protection. Facilitating collaboration between private sector and government to protect critical U.S. infrastructure through information sharing and education.`
    },
    {
      position: 'CISO & Board Member',
      company: 'Whole Cyber Human Initiative',
      startDate: '2021-01',
      endDate: '',
      description: `Serving as CISO and Board Member for nonprofit organization focused on holistic cybersecurity workforce development. Overseeing security program strategy and governance while contributing to the mission of expanding diversity and inclusion in the cybersecurity field.`
    },
    {
      position: 'Founder & Executive Cyber Advisor',
      company: 'CPF Coaching LLC',
      startDate: '2007-01',
      endDate: '',
      description: `Founded and led cybersecurity advisory and coaching practice serving SMBs, startups, and aspiring cyber leaders. Services include Virtual CISO, Risk Assessments, Retained Advisory, and Leadership Coaching. 20+ years of demonstrated expertise transforming information security strategies across financial services, healthcare, banking, IT consulting, higher education, and nonprofits. Host of the award-winning "Breaking into Cybersecurity" podcast. Author and co-author of multiple cybersecurity career books including "Hack the Cybersecurity Interview," "Develop Your Cybersecurity Career Path," and "Cybersecurity Career Advice from a Cyborg."`
    },
    {
      position: 'Cyber Security Advisor & Strategic Consultant',
      company: 'Quisitive',
      startDate: '2019-01',
      endDate: '',
      description: `Provided strategic cybersecurity consulting and vCISO advisory services to enterprise clients. Focused on cloud security, GRC program development, and digital transformation initiatives. Leveraged deep expertise in Microsoft Azure and enterprise security architecture to deliver business-aligned security solutions.`
    },
    {
      position: 'Senior Manager, Cybersecurity & Technology Risk Oversight',
      company: 'Capital One',
      startDate: '2012-06',
      endDate: '2018-12',
      description: `Led strategic cybersecurity initiatives and drove the strategic evolution of the organization's risk practices. Spearheaded proactive response to active exploit vulnerabilities. Managed high-stakes Top of House US Card Project. Initiated groundbreaking cyber intelligence product development. Advanced risk management and elevated overall security maturity across organization. Systematically reduced vulnerabilities and minimized attack surface for 100+ business units.`
    },
    {
      position: 'Manager Information Security Consulting / Team Lead',
      company: 'Avanade (Microsoft Services)',
      startDate: '2008-03',
      endDate: '2012-05',
      description: `Served as Team Lead for Microsoft Azure Federal Cloud Operations, orchestrating strategic direction and operational execution. Managed $10M+ program portfolio overseeing finances and resources. Spearheaded onboarding and training of Gov Cloud Ops members. Successfully facilitated 50% increase in SRE team capacity contributing to $10M in project growth. Led 24/7 incident and problem management. Assessed and enhanced security and compliance processes per FEDRAMP standards.`
    },
    {
      position: 'Lead Cyber Risk Management Consultant',
      company: 'ConQuest Federal',
      startDate: '2005-07',
      endDate: '2008-02',
      description: `Led cyber risk management initiatives and strategic security program development. Managed client engagements requiring deep expertise in federal compliance and risk governance. Established security frameworks aligned with FISMA, FEDRAMP, and government security standards.`
    }
  ],
  education: [
    {
      degree: 'Master of Science in Information Technology (Information Assurance & Cybersecurity)',
      school: 'Walden University',
      graduationDate: '2012-05'
    },
    {
      degree: 'Graduate Certificate in Information Systems',
      school: 'Walden University',
      graduationDate: '2011-12'
    },
    {
      degree: 'Bachelor of Business Administration (Information Systems)',
      school: 'Walden University',
      graduationDate: '2010-05'
    }
  ],
  skills: [
    'CISO Leadership',
    'vCISO Services',
    'Cybersecurity Strategy',
    'Risk Management',
    'GRC Program Management',
    'Board-Level Communication',
    'Security Program Development',
    'NIST Cybersecurity Framework (CSF)',
    'CMMC (Cybersecurity Maturity Model Certification)',
    'ISO 27001',
    'HIPAA Compliance',
    'HITRUST Certification',
    'FISMA & FEDRAMP',
    'SOC 2',
    'Incident Response',
    'Vendor Risk Management',
    'Vulnerability Management',
    'Zero Trust Security',
    'Cloud Security (Azure Gov)',
    'Data Governance & Protection',
    'AI/LLM Security Integration',
    'Identity & Access Management',
    'Secure SDLC',
    'Digital Transformation',
    'Executive Leadership',
    'Team Building & Mentorship',
    'Thought Leadership',
    'Technical Writing',
    'Podcast Production',
    'Community Leadership',
    'CISSP',
    'GSLC',
    'CRISC',
    'CDPSE',
    'AWS Security Specialty',
    'CompTIA Security+',
    'CompTIA Network+',
    'CompTIA A+',
    'MCSE',
    'Academic Instruction'
  ]
}

export async function populateChristopheResume(userId: string) {
  try {
    const docRef = doc(db, 'resumes', userId)
    await setDoc(docRef, christopheResumeData)
    console.log('✅ Resume auto-populated successfully')
    return christopheResumeData
  } catch (error) {
    console.error('❌ Error populating resume:', error)
    throw error
  }
}
