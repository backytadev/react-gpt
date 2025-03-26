import type { TranslateResponse } from '@/interfaces/translate.response';

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    if (!prompt.trim() || !lang.trim()) {
      throw new Error('Both prompt and language are required.');
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Error ${resp.status}: ${errorText}`);
    }

    const data = (await resp.json()) as TranslateResponse;

    return {
      ok: true,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return { ok: false, message: 'Request was aborted.' };
    }

    console.error('Translation error:', error);
    return { ok: false, message: 'Failed to translate text.' };
  }
};
