import type { OrthographyResponse } from '@/interfaces/orthography.response';

interface OrthographyResult extends OrthographyResponse {
  ok: boolean;
  message: string;
}

export const orthographyUseCase = async (
  prompt: string
): Promise<OrthographyResult> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Orthography check failed: ${errorText}`);
    }

    const data = (await response.json()) as OrthographyResponse;

    if (
      !data ||
      typeof data.userScore !== 'number' ||
      !Array.isArray(data.errors)
    ) {
      throw new Error('Invalid API response.');
    }

    return { ok: true, ...data };
  } catch (error) {
    console.error('orthographyUseCase failed:', error);

    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'Failed to perform orthography check.',
    };
  }
};
