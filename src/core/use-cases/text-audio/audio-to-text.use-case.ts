import { AudioToTextResponse } from '@/interfaces/audio-to-text.responde';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    if (!(audioFile instanceof File)) {
      throw new Error('Invalid audio file provided.');
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    if (prompt) {
      formData.append('prompt', prompt);
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Error ${resp.status}: ${errorText}`);
    }

    const data = (await resp.json()) as AudioToTextResponse;

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return null;
    }

    console.error('Error converting audio to text:', error);
    return null;
  }
};
