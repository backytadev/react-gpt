interface CreateThreadResponse {
  id: string;
}

export const createThreadUseCase = async (): Promise<string> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/create-thread`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating thread: ${errorText}`);
    }

    const data: CreateThreadResponse = await response.json();

    if (!data?.id) {
      throw new Error('Invalid response: Missing thread ID');
    }

    return data.id;
  } catch (error) {
    console.error('createThreadUseCase failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Unexpected error occurred'
    );
  }
};
