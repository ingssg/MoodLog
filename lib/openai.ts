import OpenAI from "openai";

const DEFAULT_COMMENT =
  "AI 코멘트: 오늘의 기록을 소중히 남겨 주셔서 감사해요. 내일도 응원할게요!";

const openAiApiKey = process.env.OPENAI_API_KEY;

const openaiClient =
  openAiApiKey &&
  new OpenAI({
    apiKey: openAiApiKey,
  });

export async function generateAiComment(content: string, mood: string) {
  if (!openaiClient) {
    return DEFAULT_COMMENT;
  }

  try {
    const prompt = `일기를 읽고 친한 친구처럼 자연스럽게 반응해주세요. 

매번 완전히 다른 방식으로 응답해야 합니다. 규칙이나 패턴을 따르지 말고, 그냥 일기를 읽고 떠오르는 생각을 자연스럽게 써주세요.

일기 내용과 선택한 감정을 함께 봐주세요. 내용은 좋은데 감정이 안 좋게 설정되어 있거나 그 반대라면, 그런 점을 자연스럽게 짚어줘도 좋아요. 하지만 억지로 언급할 필요는 없어요.

과한 위로나 오글거리는 표현은 피하고, 그냥 편하게 대화하듯이 써주세요. 한 문단 정도로 짧게, 담백하게.

가장 중요한 건: 규칙을 따르려고 하지 말고, 그냥 이 일기를 읽고 친구가 자연스럽게 반응하는 것처럼 써주세요. 매번 다른 사람이 쓴 것처럼 완전히 다른 느낌이어야 해요.

사용자 감정: ${mood}
일기 내용: ${content}
`;

    const response = await openaiClient.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 120,
      temperature: 0.9,
    });

    let aiComment = DEFAULT_COMMENT;

    const firstOutput = response.output?.[0];
    if (firstOutput && "content" in firstOutput) {
      const firstContent = firstOutput.content?.[0];
      if (firstContent && "text" in firstContent) {
        aiComment = firstContent.text?.trim() || DEFAULT_COMMENT;
      }
    }

    return aiComment;
  } catch (error) {
    // console.error("Failed to generate AI comment:", error);
    return DEFAULT_COMMENT;
  }
}
