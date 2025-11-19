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
    const prompt = `사용자가 적은 일기를 읽고, 친한 친구처럼 담백하고 자연스럽게 코멘트를 남겨주세요.

톤 가이드:
- 너무 감성적이거나 과하게 위로하는 말투는 피해 주세요.
- 전문 상담 느낌, 과한 공감 표현, 오글거리는 위로는 절대 쓰지 마세요.
- 그냥 친구가 “아 그랬구나, 오늘 고생했다” 정도로 편하게 말하듯 자연스럽고 인간적으로 작성해주세요.
- 사용자의 감정을 가볍게 받아들이고, 상황을 이해해주는 정도의 뉘앙스로 써주세요.
- 부담되지 않도록 한 문단 정도로 짧고 담백하게, 마지막에는 편안한 한 줄을 덧붙여주세요.

작성 스타일:
- “오늘 너 그랬구나”, “그럴 수 있지”, “그 상황이면 나라도 좀 그랬을 듯” 같은 자연스러운 친구 말투
- 오버스러운 위로, 과한 칭찬 금지
- 감정의 옳고 그름을 판단하지 않기
- 가볍게 떠올리는 생각이나 공감 한두 줄, 그리고 건조하지 않은 자연스러운 마무리

목표:
- ‘위로하려는 말’이 아니라,  
  그냥 ‘네 얘기를 잘 읽고 자연스럽게 반응해주는 친구의 톤’으로 코멘트를 남기는 것.

사용자 감정: ${mood}
일기 내용: ${content}
`;

    const response = await openaiClient.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 120,
      temperature: 0.7,
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
