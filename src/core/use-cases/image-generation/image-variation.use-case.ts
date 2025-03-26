type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (
  originalImage: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/generate-image-variation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseImage: originalImage }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error generating image variation: ${errorText}`);
    }

    const data = await response.json();

    if (!data?.url) {
      throw new Error('Invalid response: Missing expected fields');
    }

    return { url: data.url, alt: data.revised_prompt };
  } catch (error) {
    console.error('imageVariationUseCase failed:', error);
    return null;
  }
};
