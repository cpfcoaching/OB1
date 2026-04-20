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
  summary: `Business-aligned and results-driven CISO with over 20 years of experience treating cybersecurity as a fundamental business issue, not just a technical problem. Proven track record of partnering with Boards of Directors and C-suite executives to demystify the complex risk landscape and build resilient, business-aligned security programs. Expertise in building and maturing security capabilities from the ground up, leading complex digital transformations, and orchestrating security operations for critical government cloud infrastructure. A recognized thought leader, multi-book author, and podcast host dedicated to developing and mentoring the next generation of cyber leaders. Deep subject matter expertise in Microsoft Cloud, Data, AI, and GRC.`,
  experience: [
    {
      position: 'Founder & Executive Cyber Advisor',
      company: 'CPF Coaching LLC',
      startDate: '2015-01',
      endDate: '',
      description: `Led cybersecurity advisory and consulting services for SMBs and startups. Services include Virtual CISO Services, Risk Assessments, Retained Advisory Services, and Leadership Coaching. 15+ years of demonstrated expertise in transforming and overseeing information security strategies across financial services, healthcare, banking, IT consulting, higher education, and nonprofits. Hosted award-winning "Breaking into Cybersecurity" podcast focused on helping aspiring professionals transition into the industry. Authored and published multiple cybersecurity career and strategy books. Deep focus on helping businesses address cybersecurity risks while minimizing friction, resulting in increased resilience.`
    },
    {
      position: 'Cyber Security Advisor & Strategic Consultant',
      company: 'Quisitive',
      startDate: '2019-01',
      endDate: '',
      description: `Provided strategic cybersecurity consulting and vCISO advisory services to enterprise clients. Focused on cloud security, GRC program development, and digital transformation initiatives. Leveraged deep expertise in Microsoft Azure and enterprise security architecture to deliver business-aligned security solutions.`
    },
    {
      position: 'Cyber Risk & Security Consultant',
      company: 'Belleve',
      startDate: '2018-01',
      endDate: '',
      description: `Delivered enterprise-grade cybersecurity consulting services with focus on risk management and compliance. Specialized in helping organizations establish mature security programs aligned with industry frameworks and regulatory requirements.`
    },
    {
      position: 'Security Strategy Advisor',
      company: 'GRIMM',
      startDate: '2017-01',
      endDate: '',
      description: `Collaborated on advanced cybersecurity strategy and threat intelligence initiatives. Contributed expertise in security program development and organizational security maturity enhancement across diverse client portfolios.`
    },
    {
      position: 'Cybersecurity Leadership Consultant',
      company: 'CTCA (Cancer Treatment Centers of America)',
      startDate: '2014-06',
      endDate: '2016-12',
      description: `Led cybersecurity initiatives for healthcare organization with focus on HIPAA compliance and patient data protection. Established security governance frameworks and incident response procedures for healthcare environment. Enhanced security maturity while maintaining operational efficiency in patient care delivery.`
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
    'Community Leadership'
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
