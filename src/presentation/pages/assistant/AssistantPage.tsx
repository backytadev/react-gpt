import { useEffect, useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";

import { createThreadUseCase } from "@/core/use-cases/assistant/create-thread.use-case";
import { postQuestionUseCase } from "@/core/use-cases/assistant/post-question.use-case";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  //* Get thread if not exists crate
  useEffect(() => {
    const threadId = localStorage.getItem("threadId");

    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase().then(
        (id) => (setThreadId(id), localStorage.setItem("threadId", id))
      );
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `Numero de thread ${threadId}`, isGpt: true },
      ]);
    }
  }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGpt: false }]);

    try {
      const replies = await postQuestionUseCase(threadId, text);

      setIsLoading(false);

      if (replies.length === 0) return;

      const lastUserMessage = replies
        .filter((msg) => msg.role === "user")
        .at(-1);

      const lastGptMessage = replies
        .filter((msg) => msg.role === "assistant")
        .at(-1);

      setMessages((prev) =>
        [
          ...prev.filter((msg) => msg.text !== lastUserMessage?.content[0]),
          lastUserMessage && {
            text: lastUserMessage.content[0],
            isGpt: false,
          },
          lastGptMessage && { text: lastGptMessage.content[0], isGpt: true },
        ].filter((msg): msg is Message => msg !== undefined)
      );
    } catch (error) {
      console.error("Error al enviar la pregunta:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="Hola, soy Sam, ¿en que puedo ayudarte?" />
        {messages.map((message, index) =>
          message.isGpt ? (
            <GptMessage key={index} text={message.text} />
          ) : (
            <MyMessage key={index} text={message.text} />
          )
        )}

        {isLoading && (
          <div className="col-start-1 col-end-12 fade-in">
            <TypingLoader className="fade-in" />
          </div>
        )}
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrections
      />
    </div>
  );
};
