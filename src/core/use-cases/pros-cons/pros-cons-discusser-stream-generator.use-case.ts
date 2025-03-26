export async function* prosConsDiscusserStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch pros-cons discussion: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error('Failed to get reader from response body.');
      return null;
    }

    const decoder = new TextDecoder();
    let accumulatedText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
      yield accumulatedText;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return null;
    }

    console.error('prosConsDiscusserStreamGeneratorUseCase failed:', error);
    return null;
  }
}
