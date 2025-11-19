import OpenAI from "openai";

const DEFAULT_COMMENT =
  "AI 코멘트: 오늘의 기록을 소중히 남겨 주셔서 감사해요. 내일도 응원할게요!";

const openaiClient =
  process.env.OPENAI_API_KEY &&
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function generateAiComment(content: string, mood: string) {
  if (!openaiClient) {
    return DEFAULT_COMMENT;
  }

  try {
    const prompt = `당신은 공감 능력이 뛰어난 감정 코치입니다. 사용자의 감정과 한 줄 일기를 보고,
한 문장으로 따뜻하게 공감하며 응원하는 코멘트를 작성하세요.

- 한국어로 작성
- 사용자의 감정을 존중
- 60자 이내

사용자 감정: ${mood}
일기 내용: ${content}
`;

    const response = await openaiClient.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 120,
      temperature: 0.7,
    });

    const aiComment =
      response.output?.[0]?.content?.[0]?.text?.trim() || DEFAULT_COMMENT;

    return aiComment;
  } catch (error) {
    console.error("Failed to generate AI comment:", error);
    return DEFAULT_COMMENT;
  }
}

