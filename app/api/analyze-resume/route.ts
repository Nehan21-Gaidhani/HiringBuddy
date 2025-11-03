// app/api/analyze-resume/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // We can’t do anything at top-level; but at runtime we’ll guard too.
  console.warn("GEMINI_API_KEY not configured");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// Pick a model name that is supported — see notes below for correct model names
const modelName = "gemini-2.5-flash";  
const model = genAI?.getGenerativeModel({ model: modelName });

export async function POST(request: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    if (!model) {
      return NextResponse.json(
        { error: `Model ${modelName} not available` },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const position = (formData.get("position") as string) ?? "";

    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }
    if (!position) {
      return NextResponse.json(
        { error: "No position provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    const prompt = `
Analyze this resume PDF for the position: ${position}

Please extract and provide the following information in JSON format:
{
  "score": number (0-100 overall match score for the position),
  "skills": array of strings (key technical skills found),
  "experience": string (years of experience summary),
  "education": string (highest education and institution),
  "strengths": array of strings (3-4 key strengths),
  "concerns": array of strings (2-3 areas of concern or gaps),
  "matchedPositions": array of objects with "title" and "match" percentage for related positions
}

Focus on technical skills, relevant experience, and how well the candidate matches the ${position} role.
Be specific and professional in your analysis.
`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: resumeFile.type,
          data: base64Data,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response (simple regex)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response: " + text);
    }
    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume", detail: (error as Error).message },
      { status: 500 }
    );
  }
}
