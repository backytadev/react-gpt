import { ProsConsDiscusserResponse } from '@/interfaces/pros-const-discusser';

export const prosConsDiscusserUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Error ${resp.status}: ${errorText}`);
    }

    const data = (await resp.json()) as ProsConsDiscusserResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return { ok: false, content: 'Request was aborted by the user.' };
    }

    console.error('Error fetching pros-cons discussion:', error);

    return {
      ok: false,
      content: 'An error occurred while fetching the pros-cons discussion.',
    };
  }
};
