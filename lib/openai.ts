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
    const prompt = `
      사용자가 작성한 일기를 읽고,
      친한 친구처럼 자연스럽게 한 문단 코멘트를 작성해주세요.

      이 코멘트는
      ‘의미 있는 말’을 하려고 하지 말고,
      그냥 이 일기를 읽고 가장 먼저 떠오른 반응 하나만 말하면 됩니다.

      ⸻
      [절대 지켜야 할 규칙]

      - 심리 상담사처럼 말하지 마세요.
      - 상황을 정리하거나 감정을 분류하지 마세요.
      - 교훈, 결론, 인생 조언 같은 말은 하지 마세요.
      - 의문문(질문)은 사용하지 마세요.
      - “중요한 것 같아”, “의미 있는 경험”, “배울 점” 같은 표현은 사용 금지입니다.

      ⸻
      [톤 가이드]

      - 기본 톤은 친한 친구 말투입니다.
      - 가볍게 웃어도 되고, 담담해도 됩니다.
      - 억지 공감, 과한 위로는 하지 마세요.
      - 너무 밝게 띄우지도, 너무 진지해지지도 마세요.

      ⸻
      [감정 반응 방식]

      - 일기에서 가장 강하게 느껴지는 포인트 하나만 골라 반응하세요.
      - 감정과 내용이 살짝 안 맞아 보여도
        굳이 분석하지 말고, 자연스럽게 느껴진 쪽에 반응하세요.
      - 조언은 꼭 필요해 보일 때만 한 문장 정도로 짧게 덧붙이세요.

      ⸻
      [작성 방식]

      - 5문장 내외
      - 자연스럽게
      - 매번 다른 말투
      - 친구가 톡 보내듯이 작성

      ⸻
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
