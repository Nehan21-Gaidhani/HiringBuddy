import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// 🔹 Import same mock data logic directly (copied or modularized)
const mockVideos: Record<string, any[]> = {
  "1": [
    {
      filename: "introduction.mp4",
      transcript:
        "Myself Nijan, basically born and bought up in Mundia, I'm working as a senior software testing engineer. I could have worked with Quebec's computer software private limiter from past three years. I have a three years of experience into manual testing, mobile and web application testing, and also I have performed API testing in my organization. So in these three years of span, I have worked on two projects that is both, I have worked on e-commerce domain itself. So firstly, Nandu's and B&N, Nandu's is an e-commerce application where I have used certain tools like GERA to lock the defect, and also Charles Proxy for network blocking and throttling the network, and also debuting the backend APIs. Even though I have used a postman tool to perform the API testing where I can check only the request and response. And also after that, I have got to opportunity to work on another project called as B&N. So it's an e-commerce application where I'll be in part of understanding the requirement and writing a test plan and then writing a test plan.",
    },
  ],
  "2": [
    {
      filename: "introduction2.mp4",
      transcript:
        "Hello everyone, my name is Nehanshu Gaidhani and I am passionate software developer. I have completed my engineering with 9.6 CGPA. I have proficiency in C++ language and I do regular competitive programming in C++. I am passionate about web development in backend as well as frontend. I am proficient in JavaScript and I can build eye-catching websites with beautiful designs with backend made in Node.js and with the help of Express.js.",
    },
  ],
  "3": [
    {
      filename: "introduction3.mp4",
      transcript:
        "Good afternoon, I am Ayush Dhamecacha and I am a versatile frontend developer as well as a React developer. I have completed my six-month internship in Rich Academy, which is a foundation that caters NGOs to help them access the services which are paid to them, and as well as I can communicate in English effectively.",
    },
  ],
  "4": [
    {
      filename: "introduction4.mp4",
      transcript:
        "Hi, my name is Rahul Aujah, a software engineer with a strong foundation in full stack development and AI powered applications. I have worked with projects ranging from web platforms to intelligent assistants using technologies like React, Node.js and Python. I am passionate about solving real world problems through scalable software and always eager to learn and grow. I am excited to be here and discuss how I can contribute to a team.",
    },
  ],
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not configured.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const modelName = "gemini-2.5-flash";

const feedbackSchema = {
  type: SchemaType.OBJECT,
  properties: {
    transcript: { type: SchemaType.STRING },
    tone: { type: SchemaType.STRING },
    confidence: { type: SchemaType.STRING },
    clarity: { type: SchemaType.STRING },
    keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    insights: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    scores: {
      type: SchemaType.OBJECT,
      properties: {
        enthusiasm: { type: SchemaType.NUMBER },
        confidence: { type: SchemaType.NUMBER },
        clarity: { type: SchemaType.NUMBER },
        professionalism: { type: SchemaType.NUMBER },
      },
    },
    communicationStrengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    areasForImprovement: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    overallAssessment: { type: SchemaType.STRING },
  },
} as const;

function buildPrompt(transcript: string) {
  return `
You are an expert AI interviewer and communication coach.
Analyze the following transcript and return structured JSON feedback.

Transcript:
---
${transcript}
---

Focus on tone, confidence, clarity, and communication quality.
Return valid JSON only.
`;
}

export async function POST(req: NextRequest) {
  console.log(" API hit → /api/analyze-video");

  if (!genAI) {
    return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
  }

  try {
    const { candidateId, videoFilename } = await req.json();
    console.log(` Candidate ${candidateId}, video ${videoFilename}`);

    const candidateVideos = mockVideos[candidateId];
    const video = candidateVideos?.find((v) => v.filename === videoFilename);

    if (!video) {
      return NextResponse.json(
        { error: "Transcript not found for this video." },
        { status: 404 }
      );
    }

    const transcript = video.transcript;
    const prompt = buildPrompt(transcript);

    console.log(" Sending prompt to Gemini...");
    console.log(prompt.substring(0, 200) + "...");

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: feedbackSchema,
      },
    });

    const text = result.response.text();
    console.log("Gemini responded successfully!");
    console.log("Response preview:", text.substring(0, 200) + "...");

    const jsonResponse = JSON.parse(text);
    return NextResponse.json(jsonResponse);
  } catch (err: any) {
    console.error(" Error analyzing video:", err);
    return NextResponse.json(
      { error: "Error analyzing video", detail: err.message },
      { status: 500 }
    );
  }
}
