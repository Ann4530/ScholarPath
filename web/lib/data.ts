// ============================================================================
// DỮ LIỆU MẪU (DEMO) — ScholarFinder
// Dữ liệu mang tính minh họa cho demo giao diện/luồng nghiệp vụ.
// KHÔNG dùng để nộp hồ sơ thật — luôn kiểm tra tại nguồn chính thức.
// ============================================================================

export type FundingLevel = "Full" | "Partial" | "TuitionOnly";
export type ProviderType = "Government" | "University" | "Org" | "Corporate";
export type Level = "Bachelor" | "Master" | "PhD";
// Học hàm/bậc của người hướng dẫn (ai đủ tư cách hướng dẫn NCS đều liệt kê)
export type Rank = "professor" | "associate" | "assistant" | "dr";

export const FIELDS = [
  "Data Science/AI",
  "Computer Science",
  "Engineering",
  "Business",
  "Economics",
  "Medicine/Health",
  "Environment",
  "Physics",
  "Materials",
  "Social Sciences",
  "Law",
  "Education",
] as const;

export const REGIONS = ["Châu Âu", "Bắc Mỹ", "Châu Á", "Châu Đại Dương"] as const;

// Giá trị region trong dữ liệu là tiếng Việt (khóa dữ liệu) → key dịch cho UI.
export const REGION_KEY: Record<(typeof REGIONS)[number], string> = {
  "Châu Âu": "europe",
  "Bắc Mỹ": "northAmerica",
  "Châu Á": "asia",
  "Châu Đại Dương": "oceania",
};

// Hàm dịch (i18next t) — dùng kiểu lỏng để data.ts không phụ thuộc react-i18next.
export type Translator = (key: string, opts?: Record<string, unknown>) => string;

// Ngôn ngữ giảng dạy trong dữ liệu (tiếng Việt) → key dịch cho UI.
const TEACH_LANG_KEY: Record<string, string> = {
  "Tiếng Anh": "en",
  "Tiếng Nhật": "ja",
  "Tiếng Pháp": "fr",
  "Tiếng Trung": "zh",
  "Tiếng Hàn": "ko",
};

/** Dịch chuỗi ngôn ngữ giảng dạy của học bổng (vd "Tiếng Anh / Tiếng Nhật"). */
export function teachLanguages(raw: string, t: Translator): string {
  return raw
    .split("/")
    .map((x) => {
      const k = TEACH_LANG_KEY[x.trim()];
      return k ? t(`teachLang.${k}`) : x.trim();
    })
    .join(" / ");
}

export interface DeadlineItem {
  type: string; // Mở đơn / Hạn học bổng / Kết quả ...
  date: string; // ISO yyyy-mm-dd
}

export interface Eligibility {
  minGpa: number; // thang 4.0
  minIelts: number;
  allowVN: boolean;
  gre: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerType: ProviderType;
  university: string;
  universityId: string;
  country: string;
  countryCode: string;
  region: (typeof REGIONS)[number];
  city: string;
  levels: Level[];
  fields: string[];
  fundingLevel: FundingLevel;
  benefits: string[];
  language: string;
  requiresSupervisor: boolean;
  requiresProposal: boolean;
  eligibility: Eligibility;
  documents: string[];
  deadlines: DeadlineItem[];
  intake: string; // vd "Fall 2027"
  officialUrl: string;
  lastVerified: string;
  trustScore: number; // 0-100
  qsRank: number;
  tags: string[];
  professorIds: string[];
  summary: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  qsRank: number;
  theRank: number;
  type: "Công lập" | "Tư thục";
  website: string;
}

export interface Publication {
  title: string;
  year: number;
  venue: string;
}

export interface Professor {
  id: string;
  name: string;
  rank: Rank;
  university: string;
  universityId: string;
  department: string;
  lab: string;
  country: string;
  countryCode: string;
  fields: string[];
  keywords: string[];
  email: string;
  website: string;
  scholar: string;
  orcid: string;
  metrics: { publications: number; citations: number; hIndex: number };
  publications: Publication[];
  recruiting: "recruiting" | "unknown" | "not_recruiting";
  scholarshipIds: string[];
  summary: string;
}

// ---------------------------------------------------------------------------
// TRƯỜNG
// ---------------------------------------------------------------------------
export const universities: University[] = [
  { id: "tum", name: "Technical University of Munich", country: "Đức", countryCode: "DE", city: "Munich", qsRank: 28, theRank: 26, type: "Công lập", website: "https://www.tum.de" },
  { id: "utokyo", name: "University of Tokyo", country: "Nhật Bản", countryCode: "JP", city: "Tokyo", qsRank: 32, theRank: 28, type: "Công lập", website: "https://www.u-tokyo.ac.jp" },
  { id: "oxford", name: "University of Oxford", country: "Anh", countryCode: "GB", city: "Oxford", qsRank: 3, theRank: 1, type: "Công lập", website: "https://www.ox.ac.uk" },
  { id: "cambridge", name: "University of Cambridge", country: "Anh", countryCode: "GB", city: "Cambridge", qsRank: 5, theRank: 5, type: "Công lập", website: "https://www.cam.ac.uk" },
  { id: "melbourne", name: "University of Melbourne", country: "Úc", countryCode: "AU", city: "Melbourne", qsRank: 13, theRank: 39, type: "Công lập", website: "https://www.unimelb.edu.au" },
  { id: "harvard", name: "Harvard University", country: "Mỹ", countryCode: "US", city: "Cambridge, MA", qsRank: 4, theRank: 3, type: "Tư thục", website: "https://www.harvard.edu" },
  { id: "toronto", name: "University of Toronto", country: "Canada", countryCode: "CA", city: "Toronto", qsRank: 25, theRank: 21, type: "Công lập", website: "https://www.utoronto.ca" },
  { id: "sorbonne", name: "Sorbonne University", country: "Pháp", countryCode: "FR", city: "Paris", qsRank: 59, theRank: 75, type: "Công lập", website: "https://www.sorbonne-universite.fr" },
  { id: "delft", name: "TU Delft", country: "Hà Lan", countryCode: "NL", city: "Delft", qsRank: 49, theRank: 48, type: "Công lập", website: "https://www.tudelft.nl" },
  { id: "tsinghua", name: "Tsinghua University", country: "Trung Quốc", countryCode: "CN", city: "Beijing", qsRank: 20, theRank: 12, type: "Công lập", website: "https://www.tsinghua.edu.cn" },
  { id: "snu", name: "Seoul National University", country: "Hàn Quốc", countryCode: "KR", city: "Seoul", qsRank: 31, theRank: 62, type: "Công lập", website: "https://www.snu.ac.kr" },
  { id: "nus", name: "National University of Singapore", country: "Singapore", countryCode: "SG", city: "Singapore", qsRank: 8, theRank: 17, type: "Công lập", website: "https://www.nus.edu.sg" },
  { id: "kth", name: "KTH Royal Institute of Technology", country: "Thụy Điển", countryCode: "SE", city: "Stockholm", qsRank: 73, theRank: 89, type: "Công lập", website: "https://www.kth.se" },
  { id: "ethz", name: "ETH Zurich", country: "Thụy Sĩ", countryCode: "CH", city: "Zurich", qsRank: 7, theRank: 11, type: "Công lập", website: "https://ethz.ch" },
];

export const universityById = (id: string) => universities.find((u) => u.id === id);

// ---------------------------------------------------------------------------
// GIÁO SƯ
// ---------------------------------------------------------------------------
export const professors: Professor[] = [
  {
    id: "prof-sato",
    name: "Prof. Kenji Sato",
    rank: "professor",
    university: "University of Tokyo",
    universityId: "utokyo",
    department: "Graduate School of Information Science and Technology",
    lab: "Machine Perception Laboratory",
    country: "Nhật Bản",
    countryCode: "JP",
    fields: ["Data Science/AI", "Computer Science"],
    keywords: ["computer vision", "deep learning", "medical imaging"],
    email: "sato@is.u-tokyo.example.ac.jp",
    website: "https://mpl.is.u-tokyo.example.ac.jp",
    scholar: "https://scholar.google.com/citations?user=demoSato",
    orcid: "0000-0002-1234-5678",
    metrics: { publications: 142, citations: 11800, hIndex: 48 },
    publications: [
      { title: "Self-Supervised Representation Learning for Medical Imaging", year: 2025, venue: "CVPR" },
      { title: "Robust Vision Transformers under Distribution Shift", year: 2024, venue: "NeurIPS" },
      { title: "Weakly-Supervised Segmentation for Radiology", year: 2023, venue: "MICCAI" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["mext-univ"],
    summary: "Nghiên cứu thị giác máy tính và học sâu ứng dụng trong ảnh y khoa; đang nhận nghiên cứu sinh cho kỳ tới.",
  },
  {
    id: "prof-muller",
    name: "Prof. Anna Müller",
    rank: "professor",
    university: "Technical University of Munich",
    universityId: "tum",
    department: "Department of Informatics",
    lab: "Autonomous Systems Group",
    country: "Đức",
    countryCode: "DE",
    fields: ["Engineering", "Data Science/AI"],
    keywords: ["robotics", "reinforcement learning", "autonomous systems"],
    email: "a.mueller@tum.example.de",
    website: "https://asg.tum.example.de",
    scholar: "https://scholar.google.com/citations?user=demoMuller",
    orcid: "0000-0003-2345-6789",
    metrics: { publications: 98, citations: 7400, hIndex: 39 },
    publications: [
      { title: "Sample-Efficient RL for Legged Robots", year: 2025, venue: "ICRA" },
      { title: "Safe Exploration in Autonomous Navigation", year: 2024, venue: "CoRL" },
    ],
    recruiting: "unknown",
    scholarshipIds: ["daad-epos"],
    summary: "Robot học và học tăng cường cho hệ thống tự hành.",
  },
  {
    id: "prof-chen",
    name: "Prof. Wei Chen",
    rank: "professor",
    university: "Tsinghua University",
    universityId: "tsinghua",
    department: "School of Materials Science and Engineering",
    lab: "Energy Materials Lab",
    country: "Trung Quốc",
    countryCode: "CN",
    fields: ["Materials", "Engineering"],
    keywords: ["energy materials", "batteries", "nanomaterials"],
    email: "wchen@tsinghua.example.cn",
    website: "https://eml.tsinghua.example.cn",
    scholar: "https://scholar.google.com/citations?user=demoChen",
    orcid: "0000-0001-3456-7890",
    metrics: { publications: 175, citations: 20500, hIndex: 61 },
    publications: [
      { title: "High-Capacity Solid-State Battery Electrodes", year: 2025, venue: "Nature Energy" },
      { title: "Scalable Synthesis of Nanostructured Cathodes", year: 2024, venue: "Advanced Materials" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["csc"],
    summary: "Vật liệu năng lượng và pin thể rắn; nhóm nghiên cứu lớn, thường xuyên tuyển NCS quốc tế.",
  },
  {
    id: "prof-lim",
    name: "Prof. Sarah Lim",
    rank: "associate",
    university: "National University of Singapore",
    universityId: "nus",
    department: "School of Computing",
    lab: "NLP & Health AI Lab",
    country: "Singapore",
    countryCode: "SG",
    fields: ["Data Science/AI", "Computer Science"],
    keywords: ["natural language processing", "machine learning", "healthcare AI"],
    email: "sarahlim@nus.example.sg",
    website: "https://nlphealth.nus.example.sg",
    scholar: "https://scholar.google.com/citations?user=demoLim",
    orcid: "0000-0002-4567-8901",
    metrics: { publications: 87, citations: 6100, hIndex: 34 },
    publications: [
      { title: "Clinical Language Models with Limited Supervision", year: 2025, venue: "ACL" },
      { title: "Fairness in Predictive Healthcare Models", year: 2024, venue: "EMNLP" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["nus-rs"],
    summary: "Xử lý ngôn ngữ tự nhiên và AI trong y tế.",
  },
  {
    id: "prof-dubois",
    name: "Prof. Pierre Dubois",
    rank: "professor",
    university: "Sorbonne University",
    universityId: "sorbonne",
    department: "Institute of Earth Sciences",
    lab: "Climate & Ocean Dynamics Group",
    country: "Pháp",
    countryCode: "FR",
    fields: ["Environment", "Physics"],
    keywords: ["climate modeling", "oceanography", "geophysical fluid dynamics"],
    email: "p.dubois@sorbonne.example.fr",
    website: "https://cod.sorbonne.example.fr",
    scholar: "https://scholar.google.com/citations?user=demoDubois",
    orcid: "0000-0003-5678-9012",
    metrics: { publications: 120, citations: 9800, hIndex: 45 },
    publications: [
      { title: "Ocean Heat Uptake in CMIP6 Models", year: 2025, venue: "Journal of Climate" },
      { title: "Mesoscale Eddies and Carbon Transport", year: 2023, venue: "Nature Geoscience" },
    ],
    recruiting: "unknown",
    scholarshipIds: ["eiffel"],
    summary: "Mô hình khí hậu và hải dương học.",
  },
  {
    id: "prof-smith",
    name: "Prof. Emily Smith",
    rank: "professor",
    university: "University of Cambridge",
    universityId: "cambridge",
    department: "Department of Genetics",
    lab: "Computational Genomics Lab",
    country: "Anh",
    countryCode: "GB",
    fields: ["Medicine/Health", "Data Science/AI"],
    keywords: ["bioinformatics", "genomics", "single-cell analysis"],
    email: "e.smith@cam.example.ac.uk",
    website: "https://cgl.cam.example.ac.uk",
    scholar: "https://scholar.google.com/citations?user=demoSmith",
    orcid: "0000-0002-6789-0123",
    metrics: { publications: 156, citations: 18200, hIndex: 57 },
    publications: [
      { title: "Single-Cell Atlas of Human Immune Development", year: 2025, venue: "Cell" },
      { title: "Deep Learning for Variant Effect Prediction", year: 2024, venue: "Nature Methods" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["gates-cambridge"],
    summary: "Tin sinh học và genomics tính toán; hướng dẫn NCS qua học bổng Gates Cambridge.",
  },
  {
    id: "prof-kumar",
    name: "Assoc. Prof. Rajesh Kumar",
    rank: "associate",
    university: "National University of Singapore",
    universityId: "nus",
    department: "School of Computing",
    lab: "Data Systems & ML Group",
    country: "Singapore",
    countryCode: "SG",
    fields: ["Data Science/AI", "Computer Science"],
    keywords: ["data systems", "large-scale machine learning", "MLOps"],
    email: "rajesh@nus.example.sg",
    website: "https://dsml.nus.example.sg",
    scholar: "https://scholar.google.com/citations?user=demoKumar",
    orcid: "0000-0002-7788-1122",
    metrics: { publications: 74, citations: 5200, hIndex: 33 },
    publications: [
      { title: "Efficient Training Pipelines for Large-Scale ML", year: 2025, venue: "VLDB" },
      { title: "Cost-Aware Model Serving at Scale", year: 2024, venue: "SIGMOD" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["nus-rs"],
    summary: "Phó Giáo sư về hệ thống dữ liệu và ML quy mô lớn; nhận NCS Thạc sĩ/Tiến sĩ theo học bổng NUS.",
  },
  {
    id: "prof-tanaka",
    name: "Asst. Prof. Yuki Tanaka",
    rank: "assistant",
    university: "University of Tokyo",
    universityId: "utokyo",
    department: "Graduate School of Information Science and Technology",
    lab: "Language & Learning Lab",
    country: "Nhật Bản",
    countryCode: "JP",
    fields: ["Data Science/AI", "Computer Science"],
    keywords: ["natural language processing", "multilingual models", "low-resource learning"],
    email: "tanaka@is.u-tokyo.example.ac.jp",
    website: "https://lll.is.u-tokyo.example.ac.jp",
    scholar: "https://scholar.google.com/citations?user=demoTanaka",
    orcid: "0000-0003-9911-2233",
    metrics: { publications: 34, citations: 1650, hIndex: 19 },
    publications: [
      { title: "Multilingual Pretraining for Low-Resource Languages", year: 2025, venue: "ACL" },
      { title: "Data-Efficient Adaptation of Language Models", year: 2024, venue: "EMNLP" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["mext-univ"],
    summary: "Trợ lý Giáo sư về NLP đa ngôn ngữ; nhóm trẻ, tích cực nhận NCS cho học bổng MEXT.",
  },
  {
    id: "prof-rossi",
    name: "Dr. Elena Rossi",
    rank: "dr",
    university: "KTH Royal Institute of Technology",
    universityId: "kth",
    department: "Department of Sustainable Development",
    lab: "Clean Energy Systems Lab",
    country: "Thụy Điển",
    countryCode: "SE",
    fields: ["Environment", "Engineering"],
    keywords: ["renewable energy", "energy systems modeling", "sustainability"],
    email: "elena.rossi@kth.example.se",
    website: "https://ces.kth.example.se",
    scholar: "https://scholar.google.com/citations?user=demoRossi",
    orcid: "0000-0001-4455-6677",
    metrics: { publications: 22, citations: 980, hIndex: 15 },
    publications: [
      { title: "Optimizing Grid Integration of Renewables", year: 2025, venue: "Applied Energy" },
      { title: "Techno-Economic Models for Solar Deployment", year: 2023, venue: "Renewable Energy" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["si-sweden"],
    summary: "Nghiên cứu viên (Research Fellow) về hệ thống năng lượng sạch; đồng hướng dẫn NCS cho ứng viên học bổng SI.",
  },
  {
    id: "prof-brown",
    name: "Assoc. Prof. Michael Brown",
    rank: "associate",
    university: "University of Melbourne",
    universityId: "melbourne",
    department: "School of Population and Global Health",
    lab: "Global Health & Climate Group",
    country: "Úc",
    countryCode: "AU",
    fields: ["Medicine/Health", "Environment"],
    keywords: ["public health", "climate & health", "epidemiology"],
    email: "m.brown@unimelb.example.edu.au",
    website: "https://ghc.unimelb.example.edu.au",
    scholar: "https://scholar.google.com/citations?user=demoBrown",
    orcid: "0000-0002-3344-5566",
    metrics: { publications: 88, citations: 6100, hIndex: 36 },
    publications: [
      { title: "Climate Change and Population Health Outcomes", year: 2025, venue: "The Lancet Planetary Health" },
      { title: "Heat Exposure and Public Health Systems", year: 2024, venue: "Environmental Health" },
    ],
    recruiting: "unknown",
    scholarshipIds: ["australia-awards"],
    summary: "Phó Giáo sư về y tế công cộng và khí hậu; phù hợp ứng viên Australia Awards ngành sức khỏe/môi trường.",
  },
  {
    id: "prof-hassan",
    name: "Dr. Ahmed Hassan",
    rank: "dr",
    university: "University of Toronto",
    universityId: "toronto",
    department: "Department of Mechanical & Industrial Engineering",
    lab: "Robotics & Automation Lab",
    country: "Canada",
    countryCode: "CA",
    fields: ["Engineering", "Data Science/AI"],
    keywords: ["robotics", "control systems", "industrial automation"],
    email: "ahmed.hassan@utoronto.example.ca",
    website: "https://ral.utoronto.example.ca",
    scholar: "https://scholar.google.com/citations?user=demoHassan",
    orcid: "0000-0003-7766-8899",
    metrics: { publications: 26, citations: 1120, hIndex: 16 },
    publications: [
      { title: "Learning-Based Control for Industrial Robots", year: 2025, venue: "IEEE T-RO" },
      { title: "Robust Automation under Uncertainty", year: 2024, venue: "ICRA" },
    ],
    recruiting: "recruiting",
    scholarshipIds: ["vanier"],
    summary: "Nghiên cứu viên sau tiến sĩ, đồng hướng dẫn NCS ngành robot/kỹ thuật; hỗ trợ hồ sơ Vanier (PhD).",
  },
];

export const professorById = (id: string) => professors.find((p) => p.id === id);

// ---------------------------------------------------------------------------
// CỐ VẤN / NGƯỜI HỖ TRỢ (Support) — dữ liệu mẫu cho trang cá nhân
// ---------------------------------------------------------------------------
export interface Advisor {
  id: string;
  name: string;
  avatar: string; // emoji
  roleKey: string; // key dịch: advisorRole.*
  regions: string[]; // countryCode thế mạnh (hiển thị cờ)
  langs: string[]; // key ngôn ngữ: teachLang.* (vi/en/ko/fr…)
  rating: number; // 0-5
  sessions: number;
  email: string;
}

export const advisors: Advisor[] = [
  { id: "adv-linh", name: "Linh Nguyễn", avatar: "👩🏻‍💼", roleKey: "government", regions: ["DE", "GB", "AU"], langs: ["vi", "en"], rating: 4.9, sessions: 320, email: "linh@scholarfinder.example" },
  { id: "adv-david", name: "David Park", avatar: "👨🏻‍🏫", roleKey: "research", regions: ["JP", "KR", "SG"], langs: ["en", "ko"], rating: 4.8, sessions: 210, email: "david@scholarfinder.example" },
  { id: "adv-marie", name: "Marie Laurent", avatar: "👩🏼‍🎓", roleKey: "europe", regions: ["FR", "NL", "CH"], langs: ["en", "fr"], rating: 4.7, sessions: 175, email: "marie@scholarfinder.example" },
  { id: "adv-trang", name: "Trang Phạm", avatar: "✍️", roleKey: "essay", regions: ["US", "CA", "GB"], langs: ["vi", "en"], rating: 4.9, sessions: 400, email: "trang@scholarfinder.example" },
];

// ---------------------------------------------------------------------------
// HỌC BỔNG
// ---------------------------------------------------------------------------
export const scholarships: Scholarship[] = [
  {
    id: "daad-epos",
    title: "DAAD EPOS — Development-Related Postgraduate Courses",
    provider: "DAAD (Chính phủ Đức)",
    providerType: "Government",
    university: "Technical University of Munich",
    universityId: "tum",
    country: "Đức",
    countryCode: "DE",
    region: "Châu Âu",
    city: "Munich",
    levels: ["Master"],
    fields: ["Engineering", "Data Science/AI", "Environment"],
    fundingLevel: "Full",
    benefits: ["Trợ cấp sinh hoạt ~934 EUR/tháng", "Miễn học phí", "Bảo hiểm y tế", "Vé máy bay khứ hồi", "Trợ cấp học phần tiếng Đức"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.0, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV", "Motivation Letter", "2 Thư giới thiệu", "Bảng điểm (dịch công chứng)", "Bằng tốt nghiệp", "IELTS/TOEFL", "Kinh nghiệm làm việc ≥ 2 năm"],
    deadlines: [
      { type: "Mở đơn", date: "2026-08-01" },
      { type: "Hạn học bổng", date: "2026-10-15" },
      { type: "Kết quả (dự kiến)", date: "2027-02-28" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.daad.de",
    lastVerified: "2026-06-20",
    trustScore: 95,
    qsRank: 28,
    tags: ["#toàn-phần", "#chính-phủ", "#no-GRE"],
    professorIds: ["prof-muller"],
    summary: "Học bổng toàn phần của chính phủ Đức cho học viên đến từ các nước đang phát triển, ưu tiên ngành liên quan phát triển bền vững.",
  },
  {
    id: "mext-univ",
    title: "MEXT — Học bổng Chính phủ Nhật (Đường Đại học tiến cử)",
    provider: "MEXT (Chính phủ Nhật Bản)",
    providerType: "Government",
    university: "University of Tokyo",
    universityId: "utokyo",
    country: "Nhật Bản",
    countryCode: "JP",
    region: "Châu Á",
    city: "Tokyo",
    levels: ["Master", "PhD"],
    fields: ["Data Science/AI", "Computer Science", "Engineering"],
    fundingLevel: "Full",
    benefits: ["Trợ cấp ~144.000 JPY/tháng", "Miễn học phí", "Vé máy bay khứ hồi", "Không yêu cầu hoàn trả"],
    language: "Tiếng Anh / Tiếng Nhật",
    requiresSupervisor: true,
    requiresProposal: true,
    eligibility: { minGpa: 3.2, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV", "Research Proposal (Đề cương NC)", "Thư đồng ý hướng dẫn của giáo sư", "Bảng điểm", "Bằng tốt nghiệp", "IELTS/TOEFL", "Field of Study & Study Program"],
    deadlines: [
      { type: "Liên hệ giáo sư (nên bắt đầu)", date: "2026-07-15" },
      { type: "Mở đơn (Đại học tiến cử)", date: "2026-09-01" },
      { type: "Hạn nộp hồ sơ", date: "2026-12-05" },
      { type: "Kết quả (dự kiến)", date: "2027-05-30" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.studyinjapan.go.jp",
    lastVerified: "2026-06-18",
    trustScore: 96,
    qsRank: 32,
    tags: ["#toàn-phần", "#chính-phủ", "#cần-giáo-sư", "#research"],
    professorIds: ["prof-sato", "prof-tanaka"],
    summary: "Học bổng toàn phần của chính phủ Nhật. Đường Đại học tiến cử yêu cầu liên hệ và có thư đồng ý của giáo sư hướng dẫn trước khi nộp.",
  },
  {
    id: "chevening",
    title: "Chevening Scholarship",
    provider: "FCDO (Chính phủ Anh)",
    providerType: "Government",
    university: "University of Oxford",
    universityId: "oxford",
    country: "Anh",
    countryCode: "GB",
    region: "Châu Âu",
    city: "Oxford",
    levels: ["Master"],
    fields: ["Business", "Economics", "Social Sciences", "Law"],
    fundingLevel: "Full",
    benefits: ["Toàn bộ học phí", "Sinh hoạt phí", "Vé máy bay khứ hồi", "Phụ cấp ổn định cuộc sống"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.0, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["4 Bài luận Chevening", "2 Thư giới thiệu", "Bảng điểm & bằng", "IELTS (sau khi trúng tuyển có điều kiện)", "Kinh nghiệm làm việc ≥ 2 năm", "Thư mời nhập học (unconditional)"],
    deadlines: [
      { type: "Mở đơn", date: "2026-08-06" },
      { type: "Hạn nộp", date: "2026-11-05" },
      { type: "Phỏng vấn (dự kiến)", date: "2027-03-15" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.chevening.org",
    lastVerified: "2026-06-22",
    trustScore: 95,
    qsRank: 3,
    tags: ["#toàn-phần", "#chính-phủ", "#leadership"],
    professorIds: [],
    summary: "Học bổng danh giá của chính phủ Anh cho bậc Thạc sĩ, nhấn mạnh tố chất lãnh đạo và cam kết đóng góp cho quê hương.",
  },
  {
    id: "erasmus-mundus",
    title: "Erasmus Mundus Joint Master (EMJM)",
    provider: "Ủy ban châu Âu (EU)",
    providerType: "Government",
    university: "TU Delft",
    universityId: "delft",
    country: "Liên minh châu Âu",
    countryCode: "NL",
    region: "Châu Âu",
    city: "Delft (+ luân chuyển)",
    levels: ["Master"],
    fields: ["Data Science/AI", "Engineering", "Environment", "Computer Science"],
    fundingLevel: "Full",
    benefits: ["Học phí", "Sinh hoạt phí ~1.400 EUR/tháng", "Phụ cấp đi lại & lắp đặt", "Học tại 2+ quốc gia châu Âu"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.2, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV (Europass)", "Motivation Letter", "2 Thư giới thiệu", "Bảng điểm & bằng", "IELTS/TOEFL", "Portfolio (tùy ngành)"],
    deadlines: [
      { type: "Mở đơn", date: "2026-10-01" },
      { type: "Hạn học bổng", date: "2027-01-10" },
      { type: "Kết quả (dự kiến)", date: "2027-04-30" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.eacea.ec.europa.eu",
    lastVerified: "2026-06-15",
    trustScore: 94,
    qsRank: 49,
    tags: ["#toàn-phần", "#liên-chính-phủ", "#học-nhiều-nước"],
    professorIds: [],
    summary: "Chương trình Thạc sĩ liên kết nhiều trường châu Âu, học bổng toàn phần, học tại ít nhất 2 quốc gia.",
  },
  {
    id: "australia-awards",
    title: "Australia Awards Scholarship",
    provider: "DFAT (Chính phủ Úc)",
    providerType: "Government",
    university: "University of Melbourne",
    universityId: "melbourne",
    country: "Úc",
    countryCode: "AU",
    region: "Châu Đại Dương",
    city: "Melbourne",
    levels: ["Master"],
    fields: ["Environment", "Economics", "Medicine/Health", "Education"],
    fundingLevel: "Full",
    benefits: ["Toàn bộ học phí", "Sinh hoạt phí", "Vé máy bay", "Bảo hiểm OSHC", "Khóa học chuẩn bị"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 2.8, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV", "Bài luận nguyện vọng", "Bảng điểm & bằng", "IELTS", "Kinh nghiệm làm việc", "Cam kết về nước ≥ 2 năm"],
    deadlines: [
      { type: "Mở đơn", date: "2026-08-01" },
      { type: "Hạn nộp", date: "2026-10-30" },
      { type: "Kết quả (dự kiến)", date: "2027-06-30" },
    ],
    intake: "2028",
    officialUrl: "https://www.australiaawards.gov.au",
    lastVerified: "2026-06-10",
    trustScore: 93,
    qsRank: 13,
    tags: ["#toàn-phần", "#chính-phủ", "#ràng-buộc-về-nước"],
    professorIds: [],
    summary: "Học bổng phát triển của chính phủ Úc; yêu cầu cam kết trở về đóng góp cho quê hương sau tốt nghiệp.",
  },
  {
    id: "fulbright",
    title: "Fulbright Vietnamese Student Program",
    provider: "Bộ Ngoại giao Hoa Kỳ",
    providerType: "Government",
    university: "Harvard University",
    universityId: "harvard",
    country: "Mỹ",
    countryCode: "US",
    region: "Bắc Mỹ",
    city: "Cambridge, MA",
    levels: ["Master"],
    fields: ["Social Sciences", "Economics", "Education", "Law"],
    fundingLevel: "Full",
    benefits: ["Học phí", "Sinh hoạt phí", "Vé máy bay", "Bảo hiểm", "Hỗ trợ nộp hồ sơ trường"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.0, minIelts: 7.0, allowVN: true, gre: true },
    documents: ["Study Objective", "Personal Statement", "3 Thư giới thiệu", "Bảng điểm & bằng", "TOEFL/IELTS", "GRE (tùy ngành)"],
    deadlines: [
      { type: "Mở đơn", date: "2026-12-01" },
      { type: "Hạn nộp", date: "2027-04-15" },
      { type: "Phỏng vấn (dự kiến)", date: "2027-07-30" },
    ],
    intake: "Fall 2028",
    officialUrl: "https://vn.usembassy.gov",
    lastVerified: "2026-06-05",
    trustScore: 95,
    qsRank: 4,
    tags: ["#toàn-phần", "#chính-phủ", "#cần-GRE"],
    professorIds: [],
    summary: "Học bổng Fulbright cho công dân Việt Nam học Thạc sĩ tại Hoa Kỳ; quy trình tuyển chọn cạnh tranh cao.",
  },
  {
    id: "vanier",
    title: "Vanier Canada Graduate Scholarship",
    provider: "Chính phủ Canada",
    providerType: "Government",
    university: "University of Toronto",
    universityId: "toronto",
    country: "Canada",
    countryCode: "CA",
    region: "Bắc Mỹ",
    city: "Toronto",
    levels: ["PhD"],
    fields: ["Medicine/Health", "Engineering", "Social Sciences", "Data Science/AI"],
    fundingLevel: "Full",
    benefits: ["50.000 CAD/năm trong 3 năm", "Hỗ trợ nghiên cứu"],
    language: "Tiếng Anh",
    requiresSupervisor: true,
    requiresProposal: true,
    eligibility: { minGpa: 3.7, minIelts: 7.0, allowVN: true, gre: false },
    documents: ["Research Proposal", "CV học thuật", "Thư đề cử của trường", "2-3 Thư giới thiệu", "Bảng điểm", "Minh chứng thành tích nghiên cứu"],
    deadlines: [
      { type: "Liên hệ giáo sư (nên bắt đầu)", date: "2026-07-10" },
      { type: "Hạn nội bộ trường", date: "2026-09-20" },
      { type: "Kết quả (dự kiến)", date: "2027-04-10" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://vanier.gc.ca",
    lastVerified: "2026-06-12",
    trustScore: 94,
    qsRank: 25,
    tags: ["#toàn-phần", "#chính-phủ", "#cần-giáo-sư", "#research", "#PhD"],
    professorIds: ["prof-hassan"],
    summary: "Học bổng Tiến sĩ hàng đầu của Canada; cần được một giáo sư/khoa đề cử, yêu cầu thành tích nghiên cứu xuất sắc.",
  },
  {
    id: "eiffel",
    title: "Eiffel Excellence Scholarship",
    provider: "Bộ châu Âu & Ngoại giao Pháp",
    providerType: "Government",
    university: "Sorbonne University",
    universityId: "sorbonne",
    country: "Pháp",
    countryCode: "FR",
    region: "Châu Âu",
    city: "Paris",
    levels: ["Master", "PhD"],
    fields: ["Environment", "Physics", "Economics", "Law"],
    fundingLevel: "Partial",
    benefits: ["Sinh hoạt phí 1.181 EUR/tháng (Master)", "Vé máy bay", "Bảo hiểm", "Không bao gồm học phí"],
    language: "Tiếng Anh / Tiếng Pháp",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.3, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["Do trường Pháp đề cử (không nộp trực tiếp)", "CV", "Motivation Letter", "Bảng điểm & bằng"],
    deadlines: [
      { type: "Liên hệ trường để được đề cử", date: "2026-09-01" },
      { type: "Hạn trường nộp lên Campus France", date: "2027-01-09" },
      { type: "Kết quả (dự kiến)", date: "2027-03-31" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.campusfrance.org",
    lastVerified: "2026-05-28",
    trustScore: 90,
    qsRank: 59,
    tags: ["#bán-phần", "#chính-phủ", "#qua-trường-đề-cử"],
    professorIds: ["prof-dubois"],
    summary: "Học bổng của chính phủ Pháp; ứng viên được trường đại học Pháp đề cử chứ không nộp trực tiếp.",
  },
  {
    id: "csc",
    title: "Chinese Government Scholarship (CSC)",
    provider: "China Scholarship Council",
    providerType: "Government",
    university: "Tsinghua University",
    universityId: "tsinghua",
    country: "Trung Quốc",
    countryCode: "CN",
    region: "Châu Á",
    city: "Beijing",
    levels: ["Master", "PhD"],
    fields: ["Materials", "Engineering", "Business", "Medicine/Health"],
    fundingLevel: "Full",
    benefits: ["Miễn học phí", "Ký túc xá / trợ cấp nhà ở", "Sinh hoạt phí hàng tháng", "Bảo hiểm y tế"],
    language: "Tiếng Anh / Tiếng Trung",
    requiresSupervisor: true,
    requiresProposal: true,
    eligibility: { minGpa: 3.0, minIelts: 6.0, allowVN: true, gre: false },
    documents: ["Study Plan / Research Proposal", "Pre-admission letter (thư chấp nhận của giáo sư)", "2 Thư giới thiệu", "Bảng điểm & bằng", "Giấy khám sức khỏe (Foreigner Physical Examination)"],
    deadlines: [
      { type: "Liên hệ giáo sư", date: "2026-11-01" },
      { type: "Hạn nộp", date: "2027-03-15" },
      { type: "Kết quả (dự kiến)", date: "2027-07-01" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.campuschina.org",
    lastVerified: "2026-06-08",
    trustScore: 88,
    qsRank: 20,
    tags: ["#toàn-phần", "#chính-phủ", "#cần-giáo-sư"],
    professorIds: ["prof-chen"],
    summary: "Học bổng chính phủ Trung Quốc; có lợi thế lớn nếu xin được thư chấp nhận (pre-admission) từ giáo sư.",
  },
  {
    id: "gks",
    title: "Global Korea Scholarship (GKS)",
    provider: "NIIED (Chính phủ Hàn Quốc)",
    providerType: "Government",
    university: "Seoul National University",
    universityId: "snu",
    country: "Hàn Quốc",
    countryCode: "KR",
    region: "Châu Á",
    city: "Seoul",
    levels: ["Bachelor", "Master"],
    fields: ["Business", "Engineering", "Social Sciences", "Computer Science"],
    fundingLevel: "Full",
    benefits: ["Miễn học phí", "Sinh hoạt phí ~900.000 KRW/tháng", "Vé máy bay", "1 năm học tiếng Hàn", "Bảo hiểm"],
    language: "Tiếng Anh / Tiếng Hàn",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.0, minIelts: 5.5, allowVN: true, gre: false },
    documents: ["Personal Statement", "Study Plan", "2 Thư giới thiệu", "Bảng điểm & bằng", "Giấy khám sức khỏe", "TOPIK/IELTS (nếu có)"],
    deadlines: [
      { type: "Mở đơn (Embassy track)", date: "2026-09-15" },
      { type: "Hạn nộp", date: "2026-11-01" },
      { type: "Kết quả (dự kiến)", date: "2027-06-15" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.studyinkorea.go.kr",
    lastVerified: "2026-06-14",
    trustScore: 92,
    qsRank: 31,
    tags: ["#toàn-phần", "#chính-phủ", "#học-tiếng-miễn-phí"],
    professorIds: [],
    summary: "Học bổng chính phủ Hàn Quốc, gồm 1 năm học tiếng Hàn; có 2 đường nộp qua Đại sứ quán hoặc Đại học.",
  },
  {
    id: "nus-rs",
    title: "NUS Research Scholarship",
    provider: "National University of Singapore",
    providerType: "University",
    university: "National University of Singapore",
    universityId: "nus",
    country: "Singapore",
    countryCode: "SG",
    region: "Châu Á",
    city: "Singapore",
    levels: ["Master", "PhD"],
    fields: ["Data Science/AI", "Computer Science", "Engineering"],
    fundingLevel: "Full",
    benefits: ["Miễn học phí", "Stipend ~2.700 SGD/tháng (PhD)", "Hỗ trợ nghiên cứu"],
    language: "Tiếng Anh",
    requiresSupervisor: true,
    requiresProposal: true,
    eligibility: { minGpa: 3.5, minIelts: 6.5, allowVN: true, gre: true },
    documents: ["Research Proposal", "CV học thuật", "Liên hệ giáo sư hướng dẫn", "2 Thư giới thiệu", "Bảng điểm", "GRE (khuyến khích)"],
    deadlines: [
      { type: "Liên hệ giáo sư", date: "2026-08-01" },
      { type: "Hạn nộp (kỳ Tháng 8)", date: "2026-11-15" },
      { type: "Kết quả (dự kiến)", date: "2027-04-01" },
    ],
    intake: "August 2027",
    officialUrl: "https://www.nus.edu.sg",
    lastVerified: "2026-06-19",
    trustScore: 91,
    qsRank: 8,
    tags: ["#toàn-phần", "#trường", "#cần-giáo-sư", "#research"],
    professorIds: ["prof-lim", "prof-kumar"],
    summary: "Học bổng nghiên cứu của NUS; nên liên hệ giáo sư phù hợp trước khi nộp để tăng cơ hội.",
  },
  {
    id: "gates-cambridge",
    title: "Gates Cambridge Scholarship",
    provider: "Gates Cambridge Trust",
    providerType: "Org",
    university: "University of Cambridge",
    universityId: "cambridge",
    country: "Anh",
    countryCode: "GB",
    region: "Châu Âu",
    city: "Cambridge",
    levels: ["Master", "PhD"],
    fields: ["Medicine/Health", "Data Science/AI", "Social Sciences", "Physics"],
    fundingLevel: "Full",
    benefits: ["Toàn bộ học phí", "Sinh hoạt phí", "Vé máy bay", "Nhiều phụ cấp gia đình/hội thảo"],
    language: "Tiếng Anh",
    requiresSupervisor: true,
    requiresProposal: true,
    eligibility: { minGpa: 3.7, minIelts: 7.5, allowVN: true, gre: false },
    documents: ["Research Proposal", "Personal Statement", "CV", "Thư giới thiệu học thuật", "Bảng điểm", "IELTS 7.5+"],
    deadlines: [
      { type: "Liên hệ giáo sư", date: "2026-09-01" },
      { type: "Hạn nộp (cùng đơn vào trường)", date: "2026-12-03" },
      { type: "Phỏng vấn (dự kiến)", date: "2027-03-20" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.gatescambridge.org",
    lastVerified: "2026-06-21",
    trustScore: 95,
    qsRank: 5,
    tags: ["#toàn-phần", "#tổ-chức", "#cần-giáo-sư", "#cạnh-tranh-cao"],
    professorIds: ["prof-smith"],
    summary: "Một trong những học bổng danh giá nhất thế giới tại Cambridge; nộp cùng đơn xin học, cực kỳ cạnh tranh.",
  },
  {
    id: "si-sweden",
    title: "Swedish Institute Scholarships for Global Professionals",
    provider: "Swedish Institute",
    providerType: "Government",
    university: "KTH Royal Institute of Technology",
    universityId: "kth",
    country: "Thụy Điển",
    countryCode: "SE",
    region: "Châu Âu",
    city: "Stockholm",
    levels: ["Master"],
    fields: ["Engineering", "Environment", "Data Science/AI"],
    fundingLevel: "Full",
    benefits: ["Học phí", "Sinh hoạt phí 12.000 SEK/tháng", "Bảo hiểm", "Trợ cấp đi lại", "Mạng lưới cựu học viên SI"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.2, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV (mẫu SI)", "Motivation Letter", "2 Thư giới thiệu (work/leadership)", "Kinh nghiệm làm việc ≥ 3.000 giờ", "Đơn nhập học đã nộp trước"],
    deadlines: [
      { type: "Nộp đơn vào trường trước", date: "2026-08-15" },
      { type: "Hạn học bổng SI", date: "2027-02-10" },
      { type: "Kết quả (dự kiến)", date: "2027-04-30" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://si.se",
    lastVerified: "2026-06-11",
    trustScore: 92,
    qsRank: 73,
    tags: ["#toàn-phần", "#chính-phủ", "#leadership"],
    professorIds: [],
    summary: "Học bổng của Viện Thụy Điển, chú trọng kinh nghiệm làm việc và tố chất lãnh đạo, có mạng lưới alumni mạnh.",
  },
  {
    id: "ethz-excellence",
    title: "ETH Excellence Scholarship (ESOP)",
    provider: "ETH Zurich",
    providerType: "University",
    university: "ETH Zurich",
    universityId: "ethz",
    country: "Thụy Sĩ",
    countryCode: "CH",
    region: "Châu Âu",
    city: "Zurich",
    levels: ["Master"],
    fields: ["Computer Science", "Data Science/AI", "Physics", "Engineering"],
    fundingLevel: "Full",
    benefits: ["Học phí + sinh hoạt phí ~11.000 CHF/học kỳ", "Ưu tiên cơ hội nghiên cứu"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.7, minIelts: 7.0, allowVN: true, gre: false },
    documents: ["CV", "Motivation Letter", "Research Statement", "2 Thư giới thiệu học thuật", "Bảng điểm (top ~10%)", "Đơn nhập học chương trình Master"],
    deadlines: [
      { type: "Mở đơn", date: "2026-11-01" },
      { type: "Hạn nộp", date: "2026-12-15" },
      { type: "Kết quả (dự kiến)", date: "2027-03-31" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://ethz.ch",
    lastVerified: "2026-06-17",
    trustScore: 93,
    qsRank: 7,
    tags: ["#toàn-phần", "#trường", "#thành-tích-cao"],
    professorIds: [],
    summary: "Học bổng xuất sắc của ETH Zurich cho bậc Thạc sĩ, dành cho ứng viên có thành tích học tập top đầu.",
  },
  {
    id: "holland",
    title: "Holland Scholarship",
    provider: "Bộ Giáo dục Hà Lan + các trường",
    providerType: "Government",
    university: "TU Delft",
    universityId: "delft",
    country: "Hà Lan",
    countryCode: "NL",
    region: "Châu Âu",
    city: "Delft",
    levels: ["Bachelor", "Master"],
    fields: ["Engineering", "Computer Science", "Business"],
    fundingLevel: "Partial",
    benefits: ["5.000 EUR (nhận năm đầu)", "Không bao gồm toàn bộ học phí"],
    language: "Tiếng Anh",
    requiresSupervisor: false,
    requiresProposal: false,
    eligibility: { minGpa: 3.0, minIelts: 6.5, allowVN: true, gre: false },
    documents: ["CV", "Motivation Letter", "Bảng điểm & bằng", "IELTS/TOEFL", "Đơn nhập học chương trình"],
    deadlines: [
      { type: "Mở đơn", date: "2026-10-01" },
      { type: "Hạn nộp", date: "2027-02-01" },
      { type: "Kết quả (dự kiến)", date: "2027-04-15" },
    ],
    intake: "Fall 2027",
    officialUrl: "https://www.studyinnl.org",
    lastVerified: "2026-05-30",
    trustScore: 89,
    qsRank: 49,
    tags: ["#bán-phần", "#chính-phủ", "#dễ-tiếp-cận"],
    professorIds: [],
    summary: "Học bổng một lần 5.000 EUR cho sinh viên quốc tế ngoài EU học tại Hà Lan; phù hợp làm học bổng hỗ trợ.",
  },
];

export const scholarshipById = (id: string) => scholarships.find((s) => s.id === id);

// ---------------------------------------------------------------------------
// HỒ SƠ NGƯỜI DÙNG (mặc định demo)
// ---------------------------------------------------------------------------
export interface Profile {
  name: string; // họ tên (hiển thị ở trang cá nhân)
  level: Level;
  fields: string[];
  countries: string[]; // countryCode
  gpa: number; // thang 4.0 (đã quy đổi)
  ielts: number;
  fundingNeed: "Full" | "Partial" | "Any";
  hasGre: boolean; // đã có điểm GRE/GMAT
  nationality: string; // "VN" | "Other"
  intake: string; // kỳ nhập học dự kiến, "" = chưa xác định
  workYears: number; // số năm kinh nghiệm làm việc
}

export const defaultProfile: Profile = {
  name: "",
  level: "Master",
  fields: ["Data Science/AI", "Computer Science"],
  countries: ["DE", "JP", "SG", "CA", "GB"],
  gpa: 3.4,
  ielts: 7.0,
  fundingNeed: "Full",
  hasGre: false,
  nationality: "VN",
  intake: "",
  workYears: 0,
};

/** % hoàn thiện hồ sơ (progressive profiling) — 7 trường trọng yếu. */
export function profileCompletion(p: Profile): number {
  const filled = [
    p.name.trim() !== "",
    p.fields.length > 0,
    p.countries.length > 0,
    p.gpa > 0,
    p.ielts > 0,
    p.nationality !== "",
    p.intake !== "",
  ];
  return Math.round((filled.filter(Boolean).length / filled.length) * 100);
}

// Quy đổi GPA thang 10 → thang 4.0 (ước tính tuyến tính, hiển thị "ước tính")
export function gpa10to4(gpa10: number): number {
  return Math.round((gpa10 / 10) * 4 * 100) / 100;
}

// ---------------------------------------------------------------------------
// MATCH SCORE (cá nhân hóa) — rule-based, có giải thích, đa ngôn ngữ (nhận t)
// ---------------------------------------------------------------------------
export type MatchTier = "excellent" | "good" | "consider" | "ineligible";

export interface MatchReason {
  label: string;
  status: "ok" | "warn" | "fail";
}
export interface MatchResult {
  score: number; // 0-100
  tier: MatchTier;
  label: string; // nhãn đã dịch theo ngôn ngữ hiện tại
  reasons: MatchReason[];
}

function tierOf(score: number): MatchTier {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score < 40) return "ineligible";
  return "consider";
}

export function matchScore(profile: Profile, s: Scholarship, t: Translator): MatchResult {
  const reasons: MatchReason[] = [];
  let score = 0;

  // Quốc tịch (hard)
  if (s.eligibility.allowVN) {
    reasons.push({ label: t("match.reason.allowVN"), status: "ok" });
  } else {
    reasons.push({ label: t("match.reason.denyVN"), status: "fail" });
    return { score: 5, tier: "ineligible", label: t("match.tier.ineligible"), reasons };
  }

  // Bậc học (20)
  if (s.levels.includes(profile.level)) {
    score += 20;
    reasons.push({ label: t("match.reason.levelOk", { level: t(`level.${profile.level}`) }), status: "ok" });
  } else {
    reasons.push({
      label: t("match.reason.levelNo", {
        level: t(`level.${profile.level}`),
        levels: s.levels.map((l) => t(`level.${l}`)).join(", "),
      }),
      status: "fail",
    });
  }

  // Ngành (20)
  const overlap = profile.fields.filter((f) => s.fields.includes(f));
  if (overlap.length > 0) {
    score += 20;
    reasons.push({ label: t("match.reason.fieldOk", { fields: overlap.join(", ") }), status: "ok" });
  } else {
    reasons.push({ label: t("match.reason.fieldNo"), status: "warn" });
  }

  // Quốc gia (15)
  if (profile.countries.includes(s.countryCode)) {
    score += 15;
    reasons.push({ label: t("match.reason.countryOk", { country: t(`country.${s.countryCode}`) }), status: "ok" });
  } else {
    score += 4;
    reasons.push({ label: t("match.reason.countryWarn", { country: t(`country.${s.countryCode}`) }), status: "warn" });
  }

  // GPA (15)
  if (profile.gpa >= s.eligibility.minGpa) {
    score += 15;
    reasons.push({ label: t("match.reason.gpaOk", { gpa: profile.gpa.toFixed(1), min: s.eligibility.minGpa.toFixed(1) }), status: "ok" });
  } else if (profile.gpa >= s.eligibility.minGpa - 0.3) {
    score += 6;
    reasons.push({ label: t("match.reason.gpaClose", { min: s.eligibility.minGpa.toFixed(1) }), status: "warn" });
  } else {
    reasons.push({ label: t("match.reason.gpaNo", { min: s.eligibility.minGpa.toFixed(1) }), status: "fail" });
  }

  // IELTS (15)
  if (profile.ielts >= s.eligibility.minIelts) {
    score += 15;
    reasons.push({ label: t("match.reason.ieltsOk", { ielts: profile.ielts.toFixed(1), min: s.eligibility.minIelts.toFixed(1) }), status: "ok" });
  } else if (profile.ielts >= s.eligibility.minIelts - 0.5) {
    score += 6;
    reasons.push({ label: t("match.reason.ieltsClose", { min: s.eligibility.minIelts.toFixed(1), ielts: profile.ielts.toFixed(1) }), status: "warn" });
  } else {
    reasons.push({ label: t("match.reason.ieltsNo", { min: s.eligibility.minIelts.toFixed(1) }), status: "fail" });
  }

  // Tài chính (10)
  if (profile.fundingNeed === "Any" || profile.fundingNeed === s.fundingLevel || (profile.fundingNeed === "Partial" && s.fundingLevel === "Full")) {
    score += 10;
    reasons.push({ label: t("match.reason.fundingOk", { funding: t(`funding.${s.fundingLevel}`) }), status: "ok" });
  } else {
    score += 3;
    reasons.push({ label: t("match.reason.fundingWarn", { funding: t(`funding.${s.fundingLevel}`) }), status: "warn" });
  }

  // GRE (5) - nếu cần GRE mà đây là rào cản
  if (s.eligibility.gre) {
    if (profile.hasGre) {
      score += 5;
      reasons.push({ label: t("match.reason.greHave"), status: "ok" });
    } else {
      reasons.push({ label: t("match.reason.greNeed"), status: "warn" });
    }
  } else {
    score += 5;
    reasons.push({ label: t("match.reason.greNone"), status: "ok" });
  }

  score = Math.max(0, Math.min(100, score));
  const tier = tierOf(score);
  return { score, tier, label: t(`match.tier.${tier}`), reasons };
}

// ---------------------------------------------------------------------------
// TIỆN ÍCH DEADLINE
// ---------------------------------------------------------------------------
export function nextDeadline(s: Scholarship): DeadlineItem | null {
  const now = new Date();
  const future = s.deadlines
    .map((d) => ({ ...d, t: new Date(d.date).getTime() }))
    .filter((d) => d.t >= now.getTime())
    .sort((a, b) => a.t - b.t);
  return future[0] ?? s.deadlines[s.deadlines.length - 1] ?? null;
}

export function daysLeft(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// TRẠNG THÁI DEADLINE (E2 — lọc theo trạng thái)
// ---------------------------------------------------------------------------
export type DeadlineStatus = "upcoming" | "open" | "closing" | "closed";

export function deadlineStatus(s: Scholarship): DeadlineStatus {
  const now = Date.now();
  const future = s.deadlines
    .filter((d) => new Date(d.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (future.length === 0) return "closed";
  const next = future[0];
  if (next.type.includes("Mở đơn")) return "upcoming";
  if (daysLeft(next.date) <= 30) return "closing";
  return "open";
}

// ---------------------------------------------------------------------------
// DANH MỤC SUY RA TỪ DỮ LIỆU (dùng cho bộ lọc & wizard)
// ---------------------------------------------------------------------------
export interface CountryInfo {
  code: string;
  name: string;
  region: (typeof REGIONS)[number];
}

export const COUNTRIES: CountryInfo[] = (() => {
  const m = new Map<string, CountryInfo>();
  for (const s of scholarships) m.set(s.countryCode, { code: s.countryCode, name: s.country, region: s.region });
  return Array.from(m.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
})();

export const INTAKES: string[] = Array.from(new Set(scholarships.map((s) => s.intake))).sort();

export const LANGUAGES: string[] = Array.from(
  new Set(scholarships.flatMap((s) => s.language.split("/").map((x) => x.trim())))
).sort((a, b) => a.localeCompare(b, "vi"));

export const ALL_TAGS: string[] = Array.from(new Set(scholarships.flatMap((s) => s.tags))).sort();
