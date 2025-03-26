export const prosConsDiscusserStreamUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
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
      throw new Error(`Failed to fetch pros-cons discussion: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error('Failed to get reader from response body.');
      return null;
    }

    return reader;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request aborted by user.');
      return null;
    }

    console.error('prosConsDiscusserStreamUseCase failed:', error);
    return null;
  }
};
