
import { ResumeData, CustomSection } from "../types";

export const parseResumeFromTextLocal = (text: string): Partial<ResumeData> => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const data: Partial<ResumeData> = {
    experience: [],
    education: [],
    skills: [],
    projects: [],
    customSections: []
  };

  // Track which lines have been "consumed" by sections
  const consumedLines = new Set<number>();

  // 1. Basic Contact Info Extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) data.email = emailMatch[0];

  const phoneRegex = /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) data.phone = phoneMatch[0];

  // 2. Name Heuristic
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length < 50 && !line.includes('@') && !line.match(/\d/) && !line.toLowerCase().includes('resume')) {
      const nameParts = line.split(' ');
      if (nameParts.length >= 2 && nameParts.length <= 4) {
        data.firstName = nameParts[0];
        data.lastName = nameParts.slice(1).join(' ');
        consumedLines.add(i);
        break; 
      }
    }
  }

  // 3. Section Splitting
  const sectionContent: Record<string, number[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: []
  };

  let currentSection = '';
  const keywords = {
    experience: ['experience', 'employment', 'work history', 'career history', 'professional background'],
    education: ['education', 'academic', 'qualifications', 'university', 'college'],
    skills: ['skills', 'technologies', 'competencies', 'expertise', 'technical skills', 'core competencies'],
    projects: ['projects', 'personal projects', 'key projects'],
    summary: ['summary', 'profile', 'objective', 'about me', 'professional summary']
  };

  lines.forEach((line, index) => {
    if (consumedLines.has(index)) return;
    
    const lower = line.toLowerCase();
    let foundHeader = false;

    if (line.length < 40) {
      for (const [section, keys] of Object.entries(keywords)) {
        if (keys.some(k => lower.includes(k) || lower === k)) {
          currentSection = section;
          foundHeader = true;
          consumedLines.add(index);
          break;
        }
      }
    }

    if (!foundHeader && currentSection) {
      sectionContent[currentSection].push(index);
      consumedLines.add(index);
    }
  });

  // 4. Process Parsed Sections Verbatim
  if (sectionContent.summary.length > 0) {
    data.summary = sectionContent.summary.map(i => lines[i]).join('\n');
  }

  if (sectionContent.skills.length > 0) {
    const rawSkills = sectionContent.skills.map(i => lines[i]).join(' ');
    data.skills = rawSkills.split(/[,•|•\n•]/).map(s => s.trim()).filter(s => s.length > 1);
  }

  if (sectionContent.experience.length > 0) {
    data.experience = [{
      id: 'local-exp-1',
      jobTitle: 'Extracted Experience',
      employer: 'See details below',
      startDate: '',
      endDate: '',
      location: '',
      description: sectionContent.experience.map(i => lines[i]).join('\n')
    }];
  }

  if (sectionContent.education.length > 0) {
    data.education = [{
      id: 'local-edu-1',
      school: lines[sectionContent.education[0]] || 'School',
      degree: 'Extracted Degree',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: sectionContent.education.slice(1).map(i => lines[i]).join(', ')
    }];
  }

  // 5. CRITICAL: Capture ALL Remaining Lines (Truncation Prevention)
  const remainingLines = lines.filter((_, idx) => !consumedLines.has(idx));
  if (remainingLines.length > 0) {
    data.customSections?.push({
      id: 'unmapped-data',
      title: 'Additional Information',
      content: remainingLines.join('\n'),
      type: 'paragraph'
    });
  }

  return data;
};


// import { ResumeData } from "../types";

// /* ===================== HELPERS ===================== */

// const normalize = (t: string) =>
//   t
//     .replace(/\r/g, "\n")
//     .replace(/[ \t]+/g, " ")
//     .replace(/\n{2,}/g, "\n")
//     .trim();

// const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// const PHONE = /(?:\+?\d{1,3}[\s-]?)?\d{10}/;

// const DATE_RANGE =
//   /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{2})[\/\-\s]?\d{4}\s*(–|-|to)\s*(present|\d{4})/i;

// const ROLE_WORDS =
//   /(analyst|engineer|consultant|developer|specialist|associate)/i;

// const DEGREE_WORDS =
//   /(b\.?e|b\.?tech|bachelor|m\.?tech|mba|master|diploma|12\s*th|10\s*th)/i;

// const ACTION_VERBS =
//   /(handled|worked|developed|configured|managed|deployed|monitored|created|implemented)/i;

// /* ===================== PARSER ===================== */


// export function parseResumeFromTextLocal(raw: string): Partial<ResumeData> {
//   const text = normalize(raw);
//   const lines = text.split("\n");

//   const data: Partial<ResumeData> = {
//     experience: [],
//     education: [],
//     projects: [],
//     skills: [],
//     certifications: [],
//     achievements: [],
//     languages: [],
//     customSections: []
//   };

//   /* ================= IDENTITY ================= */

//   const email = text.match(EMAIL);
//   if (email) data.email = email[0];

//   const phone = text.match(PHONE);
//   if (phone) data.phone = phone[0];

//   // Name: first clean title-like line
//   for (const l of lines.slice(0, 5)) {
//     if (
//       /^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}$/.test(l) &&
//       !EMAIL.test(l)
//     ) {
//       const p = l.split(" ");
//       data.firstName = p[0];
//       data.lastName = p.slice(1).join(" ");
//       break;
//     }
//   }

//   /* ================= EXPERIENCE ================= */

//   let currentExp: any = null;

//   lines.forEach(l => {
//     if (DATE_RANGE.test(l)) {
//       if (currentExp) data.experience!.push(currentExp);

//       currentExp = {
//         id: `exp-${data.experience!.length}`,
//         jobTitle: "",
//         employer: "",
//         startDate: "",
//         endDate: "",
//         location: "",
//         description: ""
//       };
//       return;
//     }

//     if (currentExp) {
//       if (!currentExp.jobTitle && ROLE_WORDS.test(l)) {
//         currentExp.jobTitle = l;
//       } else if (
//         !currentExp.employer &&
//         /limited|ltd|technologies|services|solutions|pvt/i.test(l)
//       ) {
//         currentExp.employer = l;
//       } else if (ACTION_VERBS.test(l)) {
//         currentExp.description += "• " + l + "\n";
//       }
//     }
//   });

//   if (currentExp) data.experience!.push(currentExp);

//   /* ================= SKILLS ================= */

//   const skillLines = lines.filter(
//     l =>
//       l.split(/[,•]/).length >= 5 &&
//       !DATE_RANGE.test(l) &&
//       !ACTION_VERBS.test(l)
//   );

//   const skillSet = new Set<string>();
//   skillLines.forEach(l => {
//     l.split(/[,•]/).forEach(s => {
//       const v = s.trim();
//       if (v.length > 2 && v.length < 40) skillSet.add(v);
//     });
//   });

//   data.skills = Array.from(skillSet);

//   /* ================= EDUCATION ================= */

//   const eduLines = lines.filter(l => DEGREE_WORDS.test(l));
//   if (eduLines.length) {
//     data.education = [{
//       id: "edu-0",
//       school: eduLines.join(" "),
//       degree: "",
//       fieldOfStudy: "",
//       startDate: "",
//       endDate: "",
//       location: ""
//     }];
//   }

//   /* ================= PROJECTS ================= */

//   lines.forEach(l => {
//     if (
//       /developed|created|built/i.test(l) &&
//       l.length > 50 &&
//       !ROLE_WORDS.test(l)
//     ) {
//       data.projects!.push({
//         id: `proj-${data.projects!.length}`,
//         title: l.slice(0, 60),
//         link: "",
//         description: l,
//         technologies: [],
//         descriptionType: "paragraph"
//       });
//     }
//   });

//   /* ================= FALLBACK ================= */

//   if (
//     !data.experience?.length &&
//     !data.education?.length &&
//     !data.skills?.length
//   ) {
//     data.customSections!.push({
//       id: "raw",
//       title: "Imported Content",
//       content: text,
//       type: "paragraph"
//     });
//   }
//   console.log("Parsed Resume Data:", data);
//   return data;
// }

// src/services/parseResumeText.ts

// import { ResumeData } from "../types";

// /* ===================== HELPERS ===================== */

// const normalize = (text: string) =>
//   text
//     .replace(/\r/g, "\n")
//     .replace(/[ \t]+/g, " ")
//     .replace(/\n{2,}/g, "\n")
//     .trim();

// const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// const PHONE = /(?:\+?\d{1,3}[\s-]?)?\d{10}\b/;
// const DATE_RANGE = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{2})[^\n]{0,15}(\d{4})\s*(–|-|to)\s*(present|\d{4})/i;

// const ROLE_KEYWORDS = /(developer|engineer|consultant|manager|analyst|specialist)/i;
// const COMPANY_KEYWORDS = /(technologies|solutions|labs|ltd|private|pvt|corp|inc\.?)/i;
// const DEGREE_KEYWORDS = /(bachelor|master|diploma|ph\.?d|b\.?e|m\.?tech|b\.?tech)/i;
// const SKILL_SPLITTER = /[,•;/|•]/;

// /* ===================== MAIN PARSER ===================== */

// export function parseResumeFromTextLocal(raw: string): Partial<ResumeData> {
//   const text = normalize(raw);
//   const lines = text.split("\n").filter(Boolean);

//   const data: Partial<ResumeData> = {
//     experience: [],
//     education: [],
//     projects: [],
//     skills: [],
//     certifications: [],
//     achievements: [],
//     languages: [],
//     customSections: []
//   };

//   /** Extract Identity **/
//   data.email = text.match(EMAIL)?.[0];
//   data.phone = text.match(PHONE)?.[0];

//   for (const line of lines.slice(0, 5)) {
//     if (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3}$/.test(line)) {
//       const [first, ...rest] = line.split(" ");
//       data.firstName = first;
//       data.lastName = rest.join(" ");
//       break;
//     }
//   }

//   /** Experience Extraction **/
//   let currentExp: any = null;
//   for (const line of lines) {
//     if (DATE_RANGE.test(line)) {
//       if (currentExp) data.experience!.push(currentExp);
//       currentExp = { id: `exp-${data.experience!.length}`, description: "" };
//       continue;
//     }

//     if (currentExp) {
//       if (!currentExp.jobTitle && ROLE_KEYWORDS.test(line))
//         currentExp.jobTitle = line;
//       else if (!currentExp.employer && COMPANY_KEYWORDS.test(line))
//         currentExp.employer = line;
//       else if (line.length > 30)
//         currentExp.description += (currentExp.description ? "\n" : "") + line;
//     }
//   }
//   if (currentExp) data.experience!.push(currentExp);

//   /** Extract Skills **/
//   const skillCandidates = lines.filter(l => l.split(SKILL_SPLITTER).length >= 5);
//   const skillSet = new Set<string>();
//   skillCandidates.forEach(l =>
//     l.split(SKILL_SPLITTER)
//       .map(s => s.trim())
//       .filter(Boolean)
//       .forEach(s => {
//         if (s.length > 2 && s.length < 40) skillSet.add(s);
//       })
//   );
//   data.skills = Array.from(skillSet);

//   /** Education **/
//   const eduLines = lines.filter(l => DEGREE_KEYWORDS.test(l));
//   if (eduLines.length) {
//     data.education!.push({
//       id: "edu-0",
//       school: eduLines.join(" "),
//       degree: "",
//       fieldOfStudy: "",
//       startDate: "",
//       endDate: "",
//       location: ""
//     });
//   }

//   /** Projects **/
//   lines
//     .filter(l => /developed|implemented|built|created/i.test(l))
//     .forEach(l =>
//       data.projects!.push({
//         id: `proj-${data.projects!.length}`,
//         title: l.slice(0, 60),
//         link: "",
//         description: l,
//         technologies: [],
//         descriptionType: "paragraph"
//       })
//     );

//   /** Fallbacks **/
//   if (!data.experience?.length && !data.education?.length && !data.skills?.length) {
//     data.customSections!.push({
//       id: "raw",
//       title: "Imported Content",
//       content: text,
//       type: "paragraph"
//     });
//   }

//   console.debug("✅ Parsed Resume Data:", data);
//   return data;
// }
