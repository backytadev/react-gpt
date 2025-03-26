export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    if (!prompt.trim() || !voice.trim()) {
      throw new Error('Prompt and voice are required.');
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Error ${resp.status}: ${errorText}`);
    }

    const audioBlob = await resp.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return { ok: false, message: 'Request was aborted.' };
    }

    console.error('Error generating audio:', error);
    return { ok: false, message: 'Failed to generate audio.' };
  }
};
