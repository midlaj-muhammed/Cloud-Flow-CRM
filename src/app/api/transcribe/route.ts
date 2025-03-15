import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `audio-${Date.now()}.wav`);
    
    // Write the blob to the temporary file
    const buffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync(tempFile, buffer);

    // Create a readable stream from the temporary file
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: "whisper-1",
      language: "en",
    });

    // Clean up the temporary file
    fs.unlinkSync(tempFile);

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
