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

중요: 매번 완전히 다른 방식으로 응답해야 합니다. 이전 응답과 비슷한 패턴이나 표현을 반복하지 마세요.

톤 가이드:
- 너무 감성적이거나 과하게 위로하는 말투는 피해 주세요.
- 전문 상담 느낌, 과한 공감 표현, 오글거리는 위로는 절대 쓰지 마세요.
- 친구가 편하게 말하듯 자연스럽고 인간적으로 작성해주세요.
- 사용자의 감정을 가볍게 받아들이고, 상황을 이해해주는 정도의 뉘앙스로 써주세요.
- 부담되지 않도록 한 문단 정도로 짧고 담백하게 작성해주세요.

작성 스타일 (매번 다르게):
- 일기 내용의 구체적인 상황이나 감정에 맞춰서 접근 방식을 바꿔주세요.
- 때로는 간단한 공감, 때로는 가벼운 관찰, 때로는 건조한 유머, 때로는 짧은 생각을 나눠주세요.
- 문장 구조와 길이도 매번 달라야 합니다.
- 오버스러운 위로, 과한 칭찬 금지
- 감정의 옳고 그름을 판단하지 않기

감정과 일기 내용의 관계 관찰 (중요):
- 일기 내용과 선택한 감정(mood)이 일치하는지, 불일치하는지 관찰해주세요.
- 예: 일기 내용은 긍정적인데 감정이 안 좋게 설정된 경우, 또는 그 반대의 경우
- 불일치가 있다면 친구처럼 자연스럽게 짚어주세요. 예: "일기는 좋은 얘기인데 기분이 좀 안 좋네?" 정도로 가볍게.
- 일치한다면 그대로 자연스럽게 반응하면 됩니다.
- 이렇게 하면 실제로 상호작용하고 있다는 느낌을 줄 수 있습니다.

목표:
- '위로하려는 말'이 아니라, 일기 내용과 감정을 모두 읽고 그에 맞춰 자연스럽게 반응하는 친구의 톤
- 매번 새로운 관점이나 표현으로 응답하기
- 일기 내용의 핵심을 파악하고, 감정과의 관계도 함께 고려하여 적절한 반응 보여주기
- 실제로 상호작용하고 있다는 느낌을 주기

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
