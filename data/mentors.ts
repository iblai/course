const mentorImages = [
  "/images/mentor1.webp",
  "/images/mentor2.webp",
  "/images/mentor3.webp",
  "/images/mentor4.webp",
  "/images/mentor5.webp",
  "/images/mentor6.webp",
  "/images/mentor7.webp",
  "/images/mentor8.webp",
  "/images/mentor10.webp",
  "/images/mentor11.webp",
  "/images/mentor12.webp",
  "/images/mentor13.webp",
  "/images/mentor14.webp",
  "/images/mentor15.webp",
  "/images/mentor16.webp",
  "/images/mentor17.webp",
  "/images/mentor18.png",
]

const getAgentImage = (id: number) => mentorImages[id % mentorImages.length]

export interface Mentor {
  id: number
  title: string
  description: string
  avatar: string
  updatedDate: string
}

export const featuredMentors: Mentor[] = [
  {
    id: 1,
    title: "Curriculum Management",
    description:
      "Oversight of the full curriculum portfolio, ensuring programs remain current, coherent, and aligned with institutional strategy and regulations.",
    avatar: getAgentImage(1),
    updatedDate: "January 2, 2026",
  },
  {
    id: 2,
    title: "Student Recruitment",
    description:
      "Overall strategy and execution to attract prospective students with lead scoring and personalized outreach.",
    avatar: getAgentImage(2),
    updatedDate: "January 2, 2026",
  },
  {
    id: 3,
    title: "Research Management",
    description:
      "Portfolio-level management of active research projects and centers with risk highlighting and collaboration opportunities.",
    avatar: getAgentImage(3),
    updatedDate: "January 2, 2026",
  },
  {
    id: 4,
    title: "IT Operations",
    description: "Operation and support of IT infrastructure and services with incident diagnosis and capacity alerts.",
    avatar: getAgentImage(4),
    updatedDate: "January 2, 2026",
  },
  {
    id: 5,
    title: "Data Analytics",
    description:
      "Enterprise analytics and decision-support services with dashboards and narratives for different units.",
    avatar: getAgentImage(5),
    updatedDate: "January 2, 2026",
  },
  {
    id: 6,
    title: "Student Support",
    description:
      "General academic and pastoral support services for students with help request triage and self-help content.",
    avatar: getAgentImage(6),
    updatedDate: "January 2, 2026",
  },
]

export const mentorsByCategory: Record<string, Mentor[]> = {
  "Curriculum & Academic": [
    {
      id: 101,
      title: "Curriculum Management",
      description:
        "Oversight of the full curriculum portfolio, ensuring programs remain current, coherent, and aligned with institutional strategy and regulations.",
      avatar: getAgentImage(101),
      updatedDate: "January 2, 2026",
    },
    {
      id: 102,
      title: "Curriculum Planning",
      description:
        "Long-range planning of new and existing programs, majors, and pathways with enrollment and revenue impact simulation.",
      avatar: getAgentImage(102),
      updatedDate: "January 2, 2026",
    },
    {
      id: 103,
      title: "Curriculum Design",
      description:
        "Pedagogical structuring and sequencing of learning outcomes, content, and assessments with alignment verification.",
      avatar: getAgentImage(103),
      updatedDate: "January 2, 2026",
    },
    {
      id: 104,
      title: "Curriculum Approval",
      description:
        "Governance process for approving new or revised curriculum items with workflow automation and compliance checks.",
      avatar: getAgentImage(104),
      updatedDate: "January 2, 2026",
    },
    {
      id: 105,
      title: "Curriculum Production",
      description:
        "Creation and packaging of instructional materials, media, and digital assets with template generation and repurposing.",
      avatar: getAgentImage(105),
      updatedDate: "January 2, 2026",
    },
    {
      id: 106,
      title: "Curriculum Quality",
      description:
        "Continuous review of curriculum effectiveness and compliance with quality criteria through sentiment analysis and surveys.",
      avatar: getAgentImage(106),
      updatedDate: "January 2, 2026",
    },
    {
      id: 107,
      title: "Course Scheduling",
      description:
        "Timetabling and resource allocation for course sections and faculty with constraint-based schedule generation.",
      avatar: getAgentImage(107),
      updatedDate: "January 2, 2026",
    },
    {
      id: 108,
      title: "Course Delivery",
      description: "Execution and facilitation of courses including LMS management with real-time engagement tracking.",
      avatar: getAgentImage(108),
      updatedDate: "January 2, 2026",
    },
    {
      id: 109,
      title: "Academic Advising",
      description:
        "Guidance for students on course selection, major requirements, and academic planning with degree audit and recommendations.",
      avatar: getAgentImage(109),
      updatedDate: "January 2, 2026",
    },
    {
      id: 110,
      title: "Academic Standards",
      description:
        "Enforcement of academic regulations, integrity policies, and grading standards with plagiarism detection.",
      avatar: getAgentImage(110),
      updatedDate: "January 2, 2026",
    },
    {
      id: 111,
      title: "Faculty Development",
      description:
        "Professional growth programs and pedagogical training for academic staff with personalized learning paths.",
      avatar: getAgentImage(111),
      updatedDate: "January 2, 2026",
    },
    {
      id: 112,
      title: "Faculty Administration",
      description:
        "Administrative processes for academic personnel—contracts, workloads, sabbaticals with document automation.",
      avatar: getAgentImage(112),
      updatedDate: "January 2, 2026",
    },
  ],
  "Student Services": [
    {
      id: 201,
      title: "Student Recruitment",
      description:
        "Overall strategy and execution to attract prospective students with lead scoring and personalized outreach.",
      avatar: getAgentImage(201),
      updatedDate: "January 2, 2026",
    },
    {
      id: 202,
      title: "Admission Processing",
      description:
        "Handling of applications, evaluations, and admission decisions with eligibility scoring and workflow automation.",
      avatar: getAgentImage(202),
      updatedDate: "January 2, 2026",
    },
    {
      id: 203,
      title: "Enrollment Management",
      description:
        "Conversion of admitted students and optimization of cohort composition with yield forecasting and interventions.",
      avatar: getAgentImage(203),
      updatedDate: "January 2, 2026",
    },
    {
      id: 204,
      title: "Student Onboarding",
      description:
        "Orientation and integration of new students into university life with personalized welcome journeys.",
      avatar: getAgentImage(204),
      updatedDate: "January 2, 2026",
    },
    {
      id: 205,
      title: "Student Support",
      description:
        "General academic and pastoral support services for students with help request triage and self-help content.",
      avatar: getAgentImage(205),
      updatedDate: "January 2, 2026",
    },
    {
      id: 206,
      title: "Student Wellbeing",
      description:
        "Mental health and wellness services for students with sentiment detection and early intervention triggers.",
      avatar: getAgentImage(206),
      updatedDate: "January 2, 2026",
    },
    {
      id: 207,
      title: "Disability Services",
      description:
        "Accommodations and support for students with disabilities with accommodation matching and content adaptation.",
      avatar: getAgentImage(207),
      updatedDate: "January 2, 2026",
    },
    {
      id: 208,
      title: "Career Services",
      description:
        "Career counseling, job placement support, and employer connections with skill-gap analysis and opportunity matching.",
      avatar: getAgentImage(208),
      updatedDate: "January 2, 2026",
    },
    {
      id: 209,
      title: "Financial Aid",
      description:
        "Administration of scholarships, grants, loans, and student funding with eligibility assessment and award optimization.",
      avatar: getAgentImage(209),
      updatedDate: "January 2, 2026",
    },
    {
      id: 210,
      title: "Student Billing",
      description: "Invoicing, payment processing, and account management for tuition and fees with anomaly detection.",
      avatar: getAgentImage(210),
      updatedDate: "January 2, 2026",
    },
    {
      id: 211,
      title: "International Students",
      description:
        "Services tailored for international students—visas, cultural support, compliance with regulatory checks.",
      avatar: getAgentImage(211),
      updatedDate: "January 2, 2026",
    },
    {
      id: 212,
      title: "Student Retention",
      description:
        "Strategies and interventions to improve student persistence and reduce attrition with risk modeling and nudges.",
      avatar: getAgentImage(212),
      updatedDate: "January 2, 2026",
    },
    {
      id: 213,
      title: "Student Engagement",
      description:
        "Programs to increase student involvement in campus life and co-curricular activities with event recommendations.",
      avatar: getAgentImage(213),
      updatedDate: "January 2, 2026",
    },
    {
      id: 214,
      title: "Student Communication",
      description:
        "Outbound messaging, notifications, and campaigns targeting students with audience segmentation and channel optimization.",
      avatar: getAgentImage(214),
      updatedDate: "January 2, 2026",
    },
  ],
  Research: [
    {
      id: 301,
      title: "Research Opportunities",
      description:
        "Identification and dissemination of funding calls and collaborative research opportunities with semantic matching.",
      avatar: getAgentImage(301),
      updatedDate: "January 2, 2026",
    },
    {
      id: 302,
      title: "Research Funding",
      description:
        "Grant proposal development, budgeting, and submission processes with compliance checks and narrative drafting.",
      avatar: getAgentImage(302),
      updatedDate: "January 2, 2026",
    },
    {
      id: 303,
      title: "Research Management",
      description:
        "Portfolio-level management of active research projects and centers with risk highlighting and collaboration opportunities.",
      avatar: getAgentImage(303),
      updatedDate: "January 2, 2026",
    },
    {
      id: 304,
      title: "Research Compliance",
      description: "Adherence to ethical, legal, and sponsor requirements in research with audit trail generation.",
      avatar: getAgentImage(304),
      updatedDate: "January 2, 2026",
    },
    {
      id: 305,
      title: "Research Data Management",
      description:
        "Handling, storage, and sharing of research data according to FAIR principles with metadata tagging.",
      avatar: getAgentImage(305),
      updatedDate: "January 2, 2026",
    },
    {
      id: 306,
      title: "Research Output",
      description:
        "Tracking and maximizing impact of publications, citations, and scholarly works with altmetrics dashboards.",
      avatar: getAgentImage(306),
      updatedDate: "January 2, 2026",
    },
    {
      id: 307,
      title: "Research Commercialization",
      description:
        "Translating research into patents, licenses, and spin-offs with IP landscape analysis and market potential scoring.",
      avatar: getAgentImage(307),
      updatedDate: "January 2, 2026",
    },
    {
      id: 308,
      title: "Research Support",
      description:
        "Administrative and technical services assisting researchers in their work with resource booking and helpdesk chatbot.",
      avatar: getAgentImage(308),
      updatedDate: "January 2, 2026",
    },
  ],
  "IT & Technology": [
    {
      id: 401,
      title: "IT Strategy",
      description:
        "Long-term planning and governance of institutional technology with roadmap visualization and initiative prioritization.",
      avatar: getAgentImage(401),
      updatedDate: "January 2, 2026",
    },
    {
      id: 402,
      title: "IT Development",
      description:
        "Custom software development and system integration projects with code generation and test automation.",
      avatar: getAgentImage(402),
      updatedDate: "January 2, 2026",
    },
    {
      id: 403,
      title: "IT Operations",
      description:
        "Operation and support of IT infrastructure and services with incident diagnosis and capacity alerts.",
      avatar: getAgentImage(403),
      updatedDate: "January 2, 2026",
    },
    {
      id: 404,
      title: "Cybersecurity",
      description:
        "Protection of digital assets, networks, and data from cyber threats with threat detection and response playbooks.",
      avatar: getAgentImage(404),
      updatedDate: "January 2, 2026",
    },
    {
      id: 405,
      title: "Enterprise Architecture",
      description:
        "Design and governance of the enterprise technology landscape with impact analysis and standards enforcement.",
      avatar: getAgentImage(405),
      updatedDate: "January 2, 2026",
    },
    {
      id: 406,
      title: "Data Analytics",
      description:
        "Enterprise analytics and decision-support services with dashboards and narratives for different units.",
      avatar: getAgentImage(406),
      updatedDate: "January 2, 2026",
    },
    {
      id: 407,
      title: "Data Governance",
      description: "Policies and practices ensuring data quality, security, and appropriate use with lineage tracking.",
      avatar: getAgentImage(407),
      updatedDate: "January 2, 2026",
    },
    {
      id: 408,
      title: "IT Service Desk",
      description: "First-line support for IT issues and requests from staff and students with chatbot triage.",
      avatar: getAgentImage(408),
      updatedDate: "January 2, 2026",
    },
    {
      id: 409,
      title: "Learning Technology",
      description:
        "Management and enhancement of LMS, virtual classrooms, and ed-tech tools with usage analytics and feature recommendations.",
      avatar: getAgentImage(409),
      updatedDate: "January 2, 2026",
    },
    {
      id: 410,
      title: "Digital Innovation",
      description:
        "Exploration and piloting of emerging technologies for education and operations with trend scanning.",
      avatar: getAgentImage(410),
      updatedDate: "January 2, 2026",
    },
  ],
  "Finance & Administration": [
    {
      id: 501,
      title: "Budgeting",
      description:
        "Preparation and monitoring of institutional and unit budgets with scenario modeling and variance alerts.",
      avatar: getAgentImage(501),
      updatedDate: "January 2, 2026",
    },
    {
      id: 502,
      title: "Accounting",
      description:
        "General ledger, accounts payable/receivable, and financial reporting with anomaly detection and auto-reconciliation.",
      avatar: getAgentImage(502),
      updatedDate: "January 2, 2026",
    },
    {
      id: 503,
      title: "Treasury",
      description: "Cash management, investments, and debt administration with cash-flow forecasting.",
      avatar: getAgentImage(503),
      updatedDate: "January 2, 2026",
    },
    {
      id: 504,
      title: "Procurement",
      description:
        "Sourcing, purchasing, and vendor management for goods and services with spend analysis and contract optimization.",
      avatar: getAgentImage(504),
      updatedDate: "January 2, 2026",
    },
    {
      id: 505,
      title: "Expense Management",
      description:
        "Processing and control of employee expense claims and reimbursements with receipt OCR and policy checks.",
      avatar: getAgentImage(505),
      updatedDate: "January 2, 2026",
    },
    {
      id: 506,
      title: "Asset Management",
      description: "Tracking and lifecycle management of physical and financial assets with depreciation forecasting.",
      avatar: getAgentImage(506),
      updatedDate: "January 2, 2026",
    },
    {
      id: 507,
      title: "Financial Planning",
      description: "Multi-year financial forecasting and strategic resource allocation with model simulation.",
      avatar: getAgentImage(507),
      updatedDate: "January 2, 2026",
    },
    {
      id: 508,
      title: "Payroll",
      description:
        "Processing of salaries, benefits, taxes, and deductions for employees with error checking and compliance validation.",
      avatar: getAgentImage(508),
      updatedDate: "January 2, 2026",
    },
  ],
  "HR & Workforce": [
    {
      id: 601,
      title: "Workforce Planning",
      description: "Strategic analysis of staffing needs and future talent requirements with scenario modeling.",
      avatar: getAgentImage(601),
      updatedDate: "January 2, 2026",
    },
    {
      id: 602,
      title: "Talent Acquisition",
      description: "Recruitment, selection, and onboarding of academic and professional staff with resume screening.",
      avatar: getAgentImage(602),
      updatedDate: "January 2, 2026",
    },
    {
      id: 603,
      title: "Performance Management",
      description: "Goal-setting, appraisal, and feedback processes for employees with review summarization.",
      avatar: getAgentImage(603),
      updatedDate: "January 2, 2026",
    },
    {
      id: 604,
      title: "Learning & Development",
      description:
        "Training programs and professional development for staff with skill-gap analysis and content curation.",
      avatar: getAgentImage(604),
      updatedDate: "January 2, 2026",
    },
    {
      id: 605,
      title: "Compensation & Benefits",
      description: "Design and administration of pay structures and employee benefits with benchmarking.",
      avatar: getAgentImage(605),
      updatedDate: "January 2, 2026",
    },
    {
      id: 606,
      title: "Employee Relations",
      description:
        "Handling workplace issues, grievances, and labor relations with sentiment analysis and case routing.",
      avatar: getAgentImage(606),
      updatedDate: "January 2, 2026",
    },
    {
      id: 607,
      title: "HR Operations",
      description:
        "Day-to-day HR processes—records, leave, attendance with chatbot self-service and document generation.",
      avatar: getAgentImage(607),
      updatedDate: "January 2, 2026",
    },
    {
      id: 608,
      title: "Diversity & Inclusion",
      description:
        "Initiatives promoting a diverse and inclusive workplace culture with bias detection in job postings.",
      avatar: getAgentImage(608),
      updatedDate: "January 2, 2026",
    },
  ],
  "Marketing & Advancement": [
    {
      id: 701,
      title: "Marketing Strategy",
      description: "Overall brand positioning and marketing planning for the institution with competitor analysis.",
      avatar: getAgentImage(701),
      updatedDate: "January 2, 2026",
    },
    {
      id: 702,
      title: "Campaign Management",
      description: "Execution and optimization of marketing campaigns across channels with A/B testing.",
      avatar: getAgentImage(702),
      updatedDate: "January 2, 2026",
    },
    {
      id: 703,
      title: "Content Marketing",
      description: "Creation and distribution of engaging content—stories, videos, social—with content generation.",
      avatar: getAgentImage(703),
      updatedDate: "January 2, 2026",
    },
    {
      id: 704,
      title: "Digital Marketing",
      description: "SEO, SEM, social media, and web analytics for online presence with keyword optimization.",
      avatar: getAgentImage(704),
      updatedDate: "January 2, 2026",
    },
    {
      id: 705,
      title: "Public Relations",
      description: "Media relations, reputation management, and crisis communication with sentiment monitoring.",
      avatar: getAgentImage(705),
      updatedDate: "January 2, 2026",
    },
    {
      id: 706,
      title: "Events Management",
      description: "Planning and execution of institutional events—open days, conferences, ceremonies with scheduling.",
      avatar: getAgentImage(706),
      updatedDate: "January 2, 2026",
    },
    {
      id: 707,
      title: "Alumni Relations",
      description: "Engagement and services for graduates to maintain lifelong connections with personalized outreach.",
      avatar: getAgentImage(707),
      updatedDate: "January 2, 2026",
    },
    {
      id: 708,
      title: "Fundraising",
      description: "Solicitation and stewardship of philanthropic gifts and donations with propensity modeling.",
      avatar: getAgentImage(708),
      updatedDate: "January 2, 2026",
    },
    {
      id: 709,
      title: "Donor Management",
      description: "Relationship management and recognition of donors and benefactors with engagement scoring.",
      avatar: getAgentImage(709),
      updatedDate: "January 2, 2026",
    },
    {
      id: 710,
      title: "Partnerships",
      description: "Development and management of corporate and community partnerships with opportunity matching.",
      avatar: getAgentImage(710),
      updatedDate: "January 2, 2026",
    },
  ],
  "Strategy & Governance": [
    {
      id: 801,
      title: "Strategic Planning",
      description: "Formulation and monitoring of institutional strategy and goals with KPI dashboards.",
      avatar: getAgentImage(801),
      updatedDate: "January 2, 2026",
    },
    {
      id: 802,
      title: "Institutional Research",
      description: "Data collection and analysis to support decision-making and reporting with automated reporting.",
      avatar: getAgentImage(802),
      updatedDate: "January 2, 2026",
    },
    {
      id: 803,
      title: "Board Governance",
      description: "Support for governing board meetings, compliance, and fiduciary duties with document preparation.",
      avatar: getAgentImage(803),
      updatedDate: "January 2, 2026",
    },
    {
      id: 804,
      title: "Policy Management",
      description: "Development, approval, and communication of institutional policies with version control.",
      avatar: getAgentImage(804),
      updatedDate: "January 2, 2026",
    },
    {
      id: 805,
      title: "Legal Services",
      description: "Legal advice, contract review, and dispute resolution with contract analysis.",
      avatar: getAgentImage(805),
      updatedDate: "January 2, 2026",
    },
    {
      id: 806,
      title: "Government Relations",
      description: "Advocacy and engagement with government bodies and policymakers with regulatory tracking.",
      avatar: getAgentImage(806),
      updatedDate: "January 2, 2026",
    },
    {
      id: 807,
      title: "Sustainability",
      description: "Environmental and social responsibility initiatives with carbon footprint tracking.",
      avatar: getAgentImage(807),
      updatedDate: "January 2, 2026",
    },
  ],
  "Compliance & Risk": [
    {
      id: 901,
      title: "Accreditation",
      description:
        "Preparation and maintenance of accreditation status with regional and specialized bodies with evidence compilation.",
      avatar: getAgentImage(901),
      updatedDate: "January 2, 2026",
    },
    {
      id: 902,
      title: "Risk Management",
      description: "Identification, assessment, and mitigation of institutional risks with risk heat maps.",
      avatar: getAgentImage(902),
      updatedDate: "January 2, 2026",
    },
    {
      id: 903,
      title: "Compliance Management",
      description: "Ensuring adherence to laws, regulations, and internal policies with compliance monitoring.",
      avatar: getAgentImage(903),
      updatedDate: "January 2, 2026",
    },
    {
      id: 904,
      title: "Internal Audit",
      description: "Independent assurance and consulting on governance, risk, and controls with audit scoping.",
      avatar: getAgentImage(904),
      updatedDate: "January 2, 2026",
    },
    {
      id: 905,
      title: "Privacy",
      description: "Data protection and privacy compliance (GDPR, FERPA) with consent management.",
      avatar: getAgentImage(905),
      updatedDate: "January 2, 2026",
    },
    {
      id: 906,
      title: "Business Continuity",
      description: "Planning for resilience and recovery from disruptions with scenario planning.",
      avatar: getAgentImage(906),
      updatedDate: "January 2, 2026",
    },
  ],
  "Assessment & Completion": [
    {
      id: 1001,
      title: "Assessment Design",
      description: "Creation of valid, reliable assessments aligned to learning outcomes with item generation.",
      avatar: getAgentImage(1001),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1002,
      title: "Assessment Administration",
      description: "Scheduling, proctoring, and logistics of examinations with scheduling optimization.",
      avatar: getAgentImage(1002),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1003,
      title: "Grading & Feedback",
      description: "Marking of assessments and provision of formative feedback with auto-grading.",
      avatar: getAgentImage(1003),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1004,
      title: "Credential Management",
      description: "Issuance and verification of degrees, certificates, and badges with blockchain credentials.",
      avatar: getAgentImage(1004),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1005,
      title: "Graduation Processing",
      description: "Degree audits, clearance, and commencement logistics with automated degree checks.",
      avatar: getAgentImage(1005),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1006,
      title: "Transcript Services",
      description: "Generation and distribution of official academic records with instant verification.",
      avatar: getAgentImage(1006),
      updatedDate: "January 2, 2026",
    },
  ],
  "Library & Resources": [
    {
      id: 1101,
      title: "Library Services",
      description: "Access to collections, research assistance, and study spaces with chatbot reference.",
      avatar: getAgentImage(1101),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1102,
      title: "Collection Development",
      description: "Acquisition and curation of library materials and databases with usage-based recommendations.",
      avatar: getAgentImage(1102),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1103,
      title: "Digital Resources",
      description: "Management of e-journals, e-books, and digital archives with access optimization.",
      avatar: getAgentImage(1103),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1104,
      title: "Archives & Special Collections",
      description: "Preservation and access to historical records and rare materials with digitization.",
      avatar: getAgentImage(1104),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1105,
      title: "Media Production",
      description: "Video, audio, and multimedia content creation services with captioning and translation.",
      avatar: getAgentImage(1105),
      updatedDate: "January 2, 2026",
    },
  ],
  "Operations & Facilities": [
    {
      id: 1201,
      title: "Records Management",
      description:
        "Lifecycle management of institutional records and archives with classification and retention policies.",
      avatar: getAgentImage(1201),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1202,
      title: "Facilities Management",
      description: "Operation and maintenance of campus buildings and grounds with predictive maintenance.",
      avatar: getAgentImage(1202),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1203,
      title: "Space Management",
      description: "Allocation and utilization of campus space and rooms with occupancy optimization.",
      avatar: getAgentImage(1203),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1204,
      title: "Capital Projects",
      description: "Planning and delivery of construction and renovation projects with project tracking.",
      avatar: getAgentImage(1204),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1205,
      title: "Safety & Security",
      description: "Campus safety, emergency management, and security services with incident detection.",
      avatar: getAgentImage(1205),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1206,
      title: "Environmental Health",
      description: "Occupational health, lab safety, and environmental compliance with hazard identification.",
      avatar: getAgentImage(1206),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1207,
      title: "Transportation",
      description: "Campus parking, shuttle services, and fleet management with route optimization.",
      avatar: getAgentImage(1207),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1208,
      title: "Dining Services",
      description: "Food service operations for students, staff, and events with menu personalization.",
      avatar: getAgentImage(1208),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1209,
      title: "Housing Services",
      description: "Student residential accommodation and related services with room matching.",
      avatar: getAgentImage(1209),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1210,
      title: "Campus Security",
      description: "Physical security personnel and access control systems with anomaly detection.",
      avatar: getAgentImage(1210),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1211,
      title: "Mail & Logistics",
      description: "Mail distribution and package handling for campus community with delivery tracking.",
      avatar: getAgentImage(1211),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1212,
      title: "Printing Services",
      description: "Campus printing, copying, and document production services with job scheduling.",
      avatar: getAgentImage(1212),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1213,
      title: "Insurance Management",
      description: "Institutional insurance coverage and claims handling with risk assessment.",
      avatar: getAgentImage(1213),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1214,
      title: "Supplier Management",
      description: "Vendor qualification, performance, and relationship management with supplier scoring.",
      avatar: getAgentImage(1214),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1215,
      title: "Contract Management",
      description: "Lifecycle management of contracts and agreements with clause extraction and renewal alerts.",
      avatar: getAgentImage(1215),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1216,
      title: "Research Partnerships",
      description: "Collaboration agreements with industry and other institutions with partner matching.",
      avatar: getAgentImage(1216),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1217,
      title: "Industry Engagement",
      description:
        "Connections with employers for internships, co-ops, and applied projects with opportunity matching.",
      avatar: getAgentImage(1217),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1218,
      title: "Community Outreach",
      description: "Programs engaging with local communities and civic organizations with impact measurement.",
      avatar: getAgentImage(1218),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1219,
      title: "Continuing Education",
      description:
        "Non-degree programs, professional development, and lifelong learning with learner journey personalization.",
      avatar: getAgentImage(1219),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1220,
      title: "Study Abroad",
      description: "International exchange and study abroad programs with program matching.",
      avatar: getAgentImage(1220),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1221,
      title: "Athletics Administration",
      description: "Management of intercollegiate sports programs and compliance with performance analytics.",
      avatar: getAgentImage(1221),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1222,
      title: "Recreation Services",
      description: "Campus recreation facilities and intramural sports programs with facility booking.",
      avatar: getAgentImage(1222),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1223,
      title: "Student Organizations",
      description: "Support and oversight of student clubs and organizations with event coordination.",
      avatar: getAgentImage(1223),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1224,
      title: "Student Conduct",
      description: "Administration of student behavioral standards and disciplinary processes with case management.",
      avatar: getAgentImage(1224),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1225,
      title: "Academic Integrity",
      description: "Prevention and adjudication of academic dishonesty with plagiarism detection.",
      avatar: getAgentImage(1225),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1226,
      title: "Title IX Compliance",
      description: "Programs addressing sexual misconduct and gender equity with case tracking.",
      avatar: getAgentImage(1226),
      updatedDate: "January 2, 2026",
    },
    {
      id: 1227,
      title: "Equal Opportunity",
      description: "Compliance with anti-discrimination laws and affirmative action with bias detection.",
      avatar: getAgentImage(1227),
      updatedDate: "January 2, 2026",
    },
  ],
}

export const categories = [
  "All",
  "Curriculum & Academic",
  "Student Services",
  "Research",
  "IT & Technology",
  "Finance & Administration",
  "HR & Workforce",
  "Marketing & Advancement",
  "Strategy & Governance",
  "Compliance & Risk",
  "Assessment & Completion",
  "Library & Resources",
  "Operations & Facilities",
]
