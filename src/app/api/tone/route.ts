import { NextResponse } from "next/server";
import { mistral } from "@ai-sdk/mistral";
import { generateObject } from "ai";
import { z } from "zod";
import { toneCacheMiddleware } from "@/utills/ai";

const toneRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Text cannot be empty")
    .max(5000, "Text is too long (max 5000 characters)"),
  tone: z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    prompt: z.string(),
    position: z.object({
      x: z.union([z.literal(0), z.literal(1)]),
      y: z.union([z.literal(0), z.literal(1)]),
    }),
  }),
});

const responseSchema = z.object({
  rewritten_text: z
    .string()
    .describe(
      "The text rewritten in the requested tone, maintaining the original meaning while adjusting style, formality, and emotional expression",
    ),
  tone_applied: z
    .string()
    .describe(
      "Brief explanation of how the tone was applied to transform the text",
    ),
});

export const POST = async (req: Request) => {
  try {
    const requestBody = await req.json();
    const { text, tone } = toneRequestSchema.parse(requestBody);
    console.log({ text, tone });

    const systemPrompt = `You are an expert writing assistant specializing in tone adjustment. Your task is to rewrite text according to specific tone requirements while preserving the original meaning and intent.

IMPORTANT GUIDELINES:
- Maintain the core message and factual content
- Adjust vocabulary, sentence structure, and style to match the requested tone
- Preserve any technical terms or proper nouns unless tone requires simplification
- Keep the same approximate length unless tone naturally requires expansion/compression
- Ensure the rewritten text sounds natural and authentic

TONE TO APPLY: ${tone.label} (${tone.description})
TONE INSTRUCTIONS: ${tone.prompt}

Original text to rewrite: "${text}"

Please rewrite this text applying the ${tone.label} tone according to the instructions above.`;

    const result = await generateObject({
      model: mistral("mistral-large-latest"),
      providerOptions: {
        mistral: {
          strictJsonSchema: true,
        },
        toneCacheMiddleware: {
          text,
          tone,
        },
      },
      schema: responseSchema,
      prompt: systemPrompt,
      temperature: 0.7,
    });

    if (
      !result.object.rewritten_text ||
      result.object.rewritten_text.trim().length === 0
    ) {
      throw new Error("Generated content is empty");
    }

    console.log(result.object);
    return NextResponse.json({
      success: true,
      content: result.object.rewritten_text,
      explanation: result.object.tone_applied,
      tone_used: tone.label,
    });
  } catch (error: any) {
    console.error("Tone API Error:", error);

    if (error.message?.includes("rate limit") || error.status === 429) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        },
        { status: 429 },
      );
    }

    if (error.status === 401 || error.message?.includes("authentication")) {
      return NextResponse.json(
        {
          success: false,
          error: "API configuration error. Please check your settings.",
        },
        { status: 500 },
      );
    }

    if (
      error.message?.includes("model") ||
      error.message?.includes("generation")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Text generation failed. Please try with different text or try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
};
