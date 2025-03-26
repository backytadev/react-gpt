type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, originalImage, maskImage }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error generating image: ${errorText}`);
    }

    const data = await response.json();

    // if (!data?.url || !data?.revised_prompt) {
    //   throw new Error('Invalid response: Missing expected fields');
    // }

    return { url: data.url, alt: data.revised_prompt };
  } catch (error) {
    console.error('imageGenerationUseCase failed:', error);
    return null;
  }
};
