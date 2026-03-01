import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AnalysisResult, Experience } from "../types";
import {auth} from "../firebase";

const sanitizeResumeData = (data: Partial<ResumeData>): Partial<ResumeData> => {
  if (!data) return {};
  return {
    ...data,
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
  };
};

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    firstName: { type: Type.STRING },
    lastName: { type: Type.STRING },
    jobTitle: { type: Type.STRING },
    summary: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    city: { type: Type.STRING },
    country: { type: Type.STRING },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          employer: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          location: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
        }
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    customSections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['list', 'paragraph'] }
        }
      }
    }
  }
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    }
  }
};

const PARSE_AND_ANALYZE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    resumeData: RESUME_SCHEMA,
    analysis: ANALYSIS_SCHEMA
  }
};

// export const generateResumeSummary = async (jobTitle: string, skills: string[], experiences: Experience[]): Promise<string> => {
//   try {
//     // Initializing Gemini client strictly following guidelines
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//     const expSummary = experiences.slice(0, 3).map(e => `${e.jobTitle} at ${e.employer}: ${e.description}`).join('\n');
    
//     const prompt = `Act as a world-class executive recruiter. Write a compelling, high-impact 3-4 sentence professional summary for a "${jobTitle}".
    
//     SKILLS: ${skills.join(', ')}
//     HIGHLIGHTS: ${expSummary || "Career growth and professional development focus."}
    
//     GUIDELINES:
//     - Use active, punchy verbs (Spearheaded, Architected, Optimized).
//     - Focus on results and value add.
//     - Avoid cliches. Output ONLY the summary text.
//     - DO NOT include bullet points or lists. Return a paragraph.`;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: [{ parts: [{ text: prompt }] }],
//     });
    
//     return response.text?.trim() || "";
//   } catch (error) {
//     console.error("Summary generation error:", error);
//     throw error;
//   }
// };
export const generateResumeSummary = async (
  jobTitle: string,
  skills: string[],
  experiences: Experience[]
): Promise<string> => {

  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not authenticated");
  }

  const token = await user.getIdToken();

  const res = await fetch(
    "https://atsfreeresume.in/api/ai/generate-summary.php",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobTitle,
        skills: Array.isArray(skills) ? skills : [],
        experiences: Array.isArray(experiences) ? experiences : []
      })
    }
  );

  if (res.status === 403) {
    throw new Error("Upgrade required");
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "AI service failed");
  }

  const data = await res.json();
  return data.summary;
};

// export const enhanceResumeSummary = async (currentSummary: string, jobTitle: string, skills: string[]): Promise<string> => {
//   try {
//     // Initializing Gemini client strictly following guidelines
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//     const prompt = `Refine and enhance the following professional summary for a "${jobTitle}". 
//     Make it more professional, high-impact, and ATS-friendly by using industry-standard terminology and powerful action verbs.
//     Maintain the core message but significantly improve the vocabulary and professional tone.
    
//     CURRENT SUMMARY: "${currentSummary}"
//     SKILLS TO HIGHLIGHT: ${skills.join(', ')}
    
//     Output ONLY the enhanced summary text. DO NOT use bullet points.`;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: [{ parts: [{ text: prompt }] }],
//     });
    
//     return response.text?.trim() || "";
//   } catch (error) {
//     console.error("Summary enhancement error:", error);
//     throw error;
//   }
// };
export const enhanceResumeSummary = async (
 currentSummary: string, jobTitle: string, skills: string[]
): Promise<string> => {

  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const res = await fetch(
    "https://atsfreeresume.in/api/ai/enhance-summary.php",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ currentSummary,jobTitle, skills })
    }
  );

  if (res.status === 403) {
    throw new Error("Upgrade required");
  }

  const data = await res.json();
  return data.summary;
};

// export const generateExperienceDescription = async (jobTitle: string, employer: string): Promise<string> => {
//   try {
//     // Initializing Gemini client strictly following guidelines
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//     const prompt = `Act as a professional resume writer. Write 4-5 high-impact professional achievement lines for a "${jobTitle}" at "${employer}". 
    
//     GUIDELINES:
//     - Focus on quantifiable achievements.
//     - IMPORTANT: Include realistic industry numbers (e.g., "increased efficiency by 25%", "managed budget of $50k").
//     - Use strong action verbs.
//     - IMPORTANT: Do NOT include any bullet characters (•, -, *) at the start of lines. Just return the text.
//     - Output ONLY the lines, each on a new line.`;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: [{ parts: [{ text: prompt }] }],
//     });
    
//     return response.text?.trim() || "";
//   } catch (error) {
//     console.error("Experience generation error:", error);
//     throw error;
//   }
// };

export const generateExperienceDescription = async (
  jobTitle: string,
  employer: string
): Promise<string> => {

  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const res = await fetch(
    "https://atsfreeresume.in/api/ai/generate-experience.php",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobTitle,
        employer
      })
    }
  );

  if (res.status === 403) {
    throw new Error("Upgrade required");
  }

  if (!res.ok) {
    throw new Error("AI service failed");
  }

  const data = await res.json();
  return data.description;
};


// export const enhanceExperienceDescription = async (currentDescription: string, jobTitle: string): Promise<string> => {
//   try {
//     // Initializing Gemini client strictly following guidelines
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//     const prompt = `Refine and professionally enhance the following resume bullet points for a "${jobTitle}".
//     Improve the tone, use stronger action verbs, and make the statements more ATS-friendly.
//     Ensure each point highlights impact or results while maintaining the original facts.
    
//     CURRENT DESCRIPTION:
//     ${currentDescription}
    
//     Output ONLY the refined lines. Do NOT include any bullet characters (•, -, *) at the start of lines.`;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: [{ parts: [{ text: prompt }] }],
//     });
    
//     return response.text?.trim() || "";
//   } catch (error) {
//     console.error("Experience enhancement error:", error);
//     throw error;
//   }
// };


export const enhanceExperienceDescription = async (
  currentDescription: string,
  jobTitle: string
): Promise<string> => {

  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const res = await fetch(
    "https://atsfreeresume.in/api/ai/enhance-experience.php",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentDescription,
        jobTitle
      })
    }
  );

  if (res.status === 403) {
    throw new Error("Upgrade required");
  }

  if (!res.ok) {
    throw new Error("AI service failed");
  }

  const data = await res.json();
  return data.description;
};

// export const optimizeResumeForJD = async (resume: ResumeData, jd: string): Promise<Partial<ResumeData> | null> => {
//   try {
//     // Initializing Gemini client strictly following guidelines
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//     const prompt = `
//       Act as an expert ATS (Applicant Tracking System) Specialist and Executive Resume Writer.
      
//       TASK: Optimize the provided resume to perfectly match the target Job Description (JD).
      
//       STRATEGY:
//       1. ANALYZE: Identify key skills, software, and terminology in the JD.
//       2. KEYWORD INTEGRATION: Naturally weave these keywords into the Skills, Summary, and Experience sections.
//       3. IMPACT REPHRASING: Rewrite experience bullet points to mirror the responsibilities listed in the JD while keeping original facts.
//       4. SUMMARY ALIGNMENT: Rewrite the professional summary to position the candidate as the ideal solution for the JD's specific challenges.
      
//       STRICT RULES:
//       - NEVER invent experience or change dates.
//       - Maintain all 'id' properties for experience and projects.
//       - Strip all bullet characters (•, -, *) from descriptions.
      
//       RESUME:
//       ${JSON.stringify(resume)}
      
//       TARGET JOB DESCRIPTION:
//       ${jd}
//     `;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-pro-preview',
//       contents: [{ parts: [{ text: prompt }] }],
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: RESUME_SCHEMA,
//       }
//     });

//     return JSON.parse(response.text || "{}");
//   } catch (error) {
//     console.error("Optimization error:", error);
//     return null;
//   }
// };


export const optimizeResumeForJD = async (
  resume: ResumeData,
  jd: string
): Promise<Partial<ResumeData>> => {

  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const res = await fetch(
    "https://atsfreeresume.in/api/ai/optimize-ats.php",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ resume, jd })
    }
  );

  if (res.status === 403) {
    throw new Error("Upgrade required");
  }

  if (!res.ok) {
    throw new Error("ATS optimization failed");
  }
  if (!res.ok) {
  const text = await res.text();
  console.error("ATS backend raw response:", text);
  throw new Error("ATS optimization failed");
}

  const data = await res.json();
  console.log("Optimization result:", data);
  return data.resume;
};


export const parseResumeFromText = async (text: string): Promise<{ resumeData: Partial<ResumeData>, analysis: AnalysisResult } | null> => {
  try {
    // Initializing Gemini client strictly following guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      EXTRACT EVERY SINGLE PIECE OF INFORMATION from the following resume text. 
      
      MANDATORY RULE: DO NOT OMIT ANY DATA. 
      Standard sections: Header (Name, Contact), Summary, Experience, Education, Skills, Projects.
      
      NON-STANDARD DATA RULE: 
      If you find ANY information that doesn't fit the standard fields (such as Certifications, Awards, Hobbies, Volunteering, Languages, References, Personal Projects, or any other misc text), 
      you MUST extract it into the 'customSections' array. 
      - Each item in 'customSections' should have an appropriate 'title' and all related 'content'.
      - Set 'type' to 'list' if the content is a list of items, otherwise use 'paragraph'.
      
      MAPPING INSTRUCTIONS:
      - 'experience.description': Capture all bullet points verbatim but REMOVE any leading bullet symbols (•, -, *).
      - 'skills': List all technical and soft skills mentioned.
      
      RESUME TEXT TO PARSE:
      ${text}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: PARSE_AND_ANALYZE_SCHEMA,
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (parsed.resumeData) parsed.resumeData = sanitizeResumeData(parsed.resumeData);
    return parsed;
  } catch (error) {
    console.error("Parse error:", error);
    return null;
  }
};

export const parseResumeFromImage = async (base64Image: string, mimeType: string): Promise<{ resumeData: Partial<ResumeData>, analysis: AnalysisResult } | null> => {
  try {
    // Initializing Gemini client strictly following guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      PERFORM FULL OCR AND DATA MAPPING for this resume image.
      
      MANDATORY: Extract 100% of the visible text. 
      If any text (including sidebars, footer notes, extra certifications, volunteering, or unique headings) does not map to standard fields like Summary, Experience, or Education, 
      you MUST place it into the 'customSections' array with a descriptive 'title'.
      
      STRICT RULES:
      - DO NOT PARAPHRASE.
      - STRIP any leading bullet characters from description lines.
      - ENSURE 'customSections' captures everything else.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: [{
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: PARSE_AND_ANALYZE_SCHEMA,
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (parsed.resumeData) parsed.resumeData = sanitizeResumeData(parsed.resumeData);
    return parsed;
  } catch (error) {
    console.error("Vision parse error:", error);
    return null;
  }
};