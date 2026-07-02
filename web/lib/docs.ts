// ============================================================================
// TRỢ LÝ VIẾT HỒ SƠ (E18) — sinh bản nháp tài liệu nộp học bổng.
// Bản nháp bằng TIẾNG ANH (ngôn ngữ nộp hồ sơ phổ biến), cá nhân hóa theo hồ sơ
// người dùng + học bổng + giáo sư. Phần cần user tự điền để trong [ngoặc vuông].
// KHÔNG phải AI — đây là template có luật, đủ để "đọc là điền rồi nộp".
// ============================================================================

import type { Profile, Scholarship, Professor, Translator } from "./data";

export interface DocDraft {
  id: string;
  title: string;
  hint: string;
  body: string;
}

const DEGREE_WORD: Record<string, string> = {
  Bachelor: "Bachelor's",
  Master: "Master's",
  PhD: "PhD",
};

/**
 * Sinh danh sách bản nháp phù hợp với học bổng.
 * @param tEn translator cố định tiếng Anh (i18n.getFixedT("en")) để lấy tên quốc gia/bậc học.
 */
export function generateDrafts(
  profile: Profile,
  s: Scholarship,
  professors: Professor[],
  tEn: Translator
): DocDraft[] {
  const name = profile.name.trim() || "[Your full name]";
  const degree = DEGREE_WORD[profile.level] ?? "graduate";
  const field = profile.fields[0] || "[your field]";
  const fieldsList = profile.fields.join(", ") || "[your fields]";
  const country = tEn(`country.${s.countryCode}`);
  const uni = s.university;
  const title = s.title;
  const gpa = profile.gpa > 0 ? profile.gpa.toFixed(1) : "[GPA]";
  const ielts = profile.ielts > 0 ? profile.ielts.toFixed(1) : "[IELTS]";
  const prof = professors[0] ?? null;

  const docsText = s.documents.join(" ").toLowerCase();
  const hasRec = /giới thiệu|recommend|reference|\blor\b|đề cử/.test(docsText);
  const hasProposal = s.requiresProposal || /proposal|đề cương/.test(docsText);
  const hasStudyPlan = /study plan|kế hoạch học/.test(docsText);
  const isChevening = /chevening/.test(s.title.toLowerCase()) || /bài luận chevening/.test(docsText);

  // Tên tài liệu "statement" tùy học bổng
  let sopName = "Statement of Purpose (SOP)";
  if (/study objective/.test(docsText)) sopName = "Study Objective";
  else if (/personal statement/.test(docsText)) sopName = "Personal Statement";
  else if (/motivation/.test(docsText)) sopName = "Motivation Letter";

  const drafts: DocDraft[] = [];

  // 1) CV học thuật
  drafts.push({
    id: "cv",
    title: "CV / Résumé (academic)",
    hint: "Keep to 1–2 pages. Lead with education & research relevant to the program.",
    body: `${name}
[Email] · [Phone] · [City, Country] · [LinkedIn / portfolio]

OBJECTIVE
Applicant for the ${degree} program in ${field} at ${uni} (${country}) — ${title}.

EDUCATION
[Degree, major], [University] — GPA ${gpa}/4.0, [graduation year]
  • Relevant coursework: [3–5 courses in ${fieldsList}]
  • Honors / awards: [scholarship, dean's list, competition…]

RESEARCH / PROJECTS
  • [Thesis or project title] — [what you did] → [result / metric]
  • [Project 2] — [tools/methods] → [impact]

EXPERIENCE
  • [Role], [Organization] ([start]–[end])
      – [Achievement with a number, e.g. "improved X by 20%"]

SKILLS & TESTS
  • Technical: [tools/methods for ${field}]
  • English: IELTS ${ielts}${s.eligibility.gre ? " · GRE/GMAT: [score]" : ""}
  • Languages: [others]

PUBLICATIONS / CERTIFICATES (optional)
  • [Citation or certificate name, year]`,
  });

  // 2) SOP / Motivation / Personal Statement
  drafts.push({
    id: "sop",
    title: sopName,
    hint: "≈ 800–1000 words. Be specific: name a lab/course/faculty and a concrete achievement.",
    body: `${sopName} — ${title}
${uni} (${country}) · Applicant: ${name}

Dear Selection Committee,

I am applying for the ${degree} program in ${field} at ${uni} under the ${title}. [Open with a specific moment or problem that first drew you to ${field} — one or two sentences, no clichés.]

Academically, I hold [your degree] with a GPA of ${gpa}/4.0. [Describe 1–2 courses or projects in ${fieldsList} and one concrete result — a number, an award, a working product.] These experiences gave me the foundation and the motivation for graduate study.

I am applying to ${uni} specifically because [name a lab, course, research group, or faculty member — be concrete]. ${prof ? `In particular, ${prof.name}'s work on ${prof.keywords.slice(0, 2).join(" and ")} aligns closely with the direction I want to pursue.` : "The program's strengths in [area] match the direction I want to pursue."} My goal for this program is to [1–2 year academic goal].

The ${title} would allow me to [what the funding makes possible]. After graduation, I plan to [career / contribution goal].${s.tags.some((t) => t.includes("về-nước")) || /về nước|cam kết/.test(docsText) ? " In line with the scholarship's mission, I intend to return and contribute to [your country/community] by [specific plan]." : ""}

Thank you for considering my application.

Sincerely,
${name}`,
  });

  // 3) Chevening: 4 bài luận
  if (isChevening) {
    drafts.push({
      id: "che-leadership",
      title: "Chevening Essay 1 — Leadership & Influence",
      hint: "~500 words. One clear example. Situation → your action → result → what you learned.",
      body: `Leadership & Influence — ${name}

[Describe a real example where you led or influenced others.]
Situation: [What was the challenge and context?]
Action: [What did YOU specifically do? Focus on your decisions and how you brought people along.]
Result: [What changed? Use a number or concrete outcome.]
Reflection: [What did this teach you about leadership, and how will you apply it after studying in the UK?]`,
    });
    drafts.push({
      id: "che-networking",
      title: "Chevening Essay 2 — Networking",
      hint: "~500 words. Show you build and use professional relationships purposefully.",
      body: `Networking — ${name}

[Give an example of building a relationship/network that created value.]
Context: [Who did you connect with and why?]
Action: [How did you build and maintain the relationship?]
Outcome: [What did it achieve — for you and for them?]
Future: [How will you use Chevening's network in ${field} to reach your goals?]`,
    });
    drafts.push({
      id: "che-study",
      title: "Chevening Essay 3 — Studying in the UK",
      hint: "~500 words. Why this course, why the UK, why now — link to your career plan.",
      body: `Studying in the UK — ${name}

I intend to study [course name] at ${uni}. [Why this specific course and university — modules, faculty, reputation in ${field}.]
[Why the UK specifically for ${field}?]
[Why now, given your background (GPA ${gpa}/4.0, [experience])?]
[How the course connects directly to your career plan below.]`,
    });
    drafts.push({
      id: "che-career",
      title: "Chevening Essay 4 — Career Plan",
      hint: "~500 words. Short-term (post-study) and long-term goals; be concrete and realistic.",
      body: `Career Plan — ${name}

Short term (0–2 years after the course): [Specific role/sector in ${field} and the impact you aim for.]
Long term (5–10 years): [Leadership goal and the change you want to drive in your country/community.]
How this scholarship helps: [Skills, network and knowledge from ${uni} that make the plan achievable.]`,
    });
  }

  // 4) Research Proposal (nếu cần)
  if (hasProposal && !isChevening) {
    drafts.push({
      id: "proposal",
      title: "Research Proposal (outline)",
      hint: "2–5 pages. Make the title specific and researchable; cite the supervisor's work.",
      body: `Research Proposal — ${title}
Applicant: ${name} · Target: ${degree} in ${field}, ${uni} (${country})
${prof ? `Proposed supervisor: ${prof.name} (${prof.university})` : "Proposed supervisor: [name a suitable professor at " + uni + "]"}

1. WORKING TITLE
   [A specific, researchable title in ${field}]

2. BACKGROUND & MOTIVATION
   [2–4 sentences: the problem, why it matters, and the gap in current work.]
   ${prof ? `Building on ${prof.name}'s work on ${prof.keywords.slice(0, 2).join(", ")}, ` : ""}[state the gap you will address.]

3. RESEARCH QUESTIONS / OBJECTIVES
   RQ1: [question]
   RQ2: [question]

4. METHODOLOGY
   [Data/materials, methods, tools. Be concrete about how you will answer each RQ.]

5. TIMELINE
   Year 1: [literature review, setup]
   Year 2: [experiments / fieldwork]
   Year 3: [analysis, writing] (adjust for ${degree})

6. EXPECTED CONTRIBUTIONS
   [What new knowledge or application results, and who benefits.]

7. REFERENCES
   [3–6 references]${prof && prof.publications[0] ? `\n   • ${prof.name} et al., "${prof.publications[0].title}", ${prof.publications[0].venue} ${prof.publications[0].year}.` : ""}`,
    });
  }

  // 5) Study Plan (GKS/CSC…)
  if (hasStudyPlan && !hasProposal) {
    drafts.push({
      id: "studyplan",
      title: "Study Plan",
      hint: "Clear goals for before, during and after the program.",
      body: `Study Plan — ${name}
${degree} in ${field}, ${uni} (${country}) — ${title}

1. Motivation: [Why ${field}, why ${country}?]
2. Before arrival: [language prep, background reading, skills to build]
3. During the program: [courses/modules to focus on, research or projects, milestones by semester]
4. After graduation: [how you will apply the degree; contribution to your community]`,
    });
  }

  // 6) Thư giới thiệu (bản nháp cho người giới thiệu) + email nhờ viết
  if (hasRec) {
    drafts.push({
      id: "lor",
      title: "Recommendation Letter (draft for your referee)",
      hint: "Give this draft to your professor/manager to adapt — never submit it as-is yourself.",
      body: `RECOMMENDATION LETTER (draft — your referee should personalize)
Re: ${name} — application for ${title}, ${uni}

To the Selection Committee,

I am [Referee name, title] at [Institution]. I have known ${name} for [duration] as their [professor/manager] in [course/project].

[Paragraph 1 — ability: one specific example of ${name}'s strength in ${field}: a project, a result, a problem they solved.]

[Paragraph 2 — character: initiative, teamwork or resilience, with a brief concrete example.]

Among [group, e.g. "the students I have taught in five years"], ${name} ranks in the [top X%]. I recommend ${name} without reservation for the ${title}.

Sincerely,
[Referee name] · [Title] · [Email] · [Institution]

──────────────────────────────
SHORT EMAIL TO SEND YOUR REFEREE
Subject: Reference letter request — ${title} (deadline [date])

Dear [Professor/Manager],

I am applying for the ${title} at ${uni}. Given [the course/project we worked on], would you be willing to write a letter of recommendation by [date]? I've attached my CV and a draft you are welcome to adapt or rewrite. Thank you so much for your support.

Best regards,
${name}`,
    });
  }

  return drafts;
}
