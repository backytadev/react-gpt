import { QuestionResponse } from '@/interfaces/assistant.response';

export const postQuestionUseCase = async (
  threadId: string,
  question: string
): Promise<QuestionResponse[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/user-question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, question }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error posting question: ${errorText}`);
    }

    const data: QuestionResponse[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response: Expected an array of replies');
    }

    return data;
  } catch (error) {
    console.error('postQuestionUseCase failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Unexpected error occurred'
    );
  }
};
