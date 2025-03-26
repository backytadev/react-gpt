import { useEffect, useRef, useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";
import { GptOrthographyMessage } from "@/presentation/components/chat-bubbles/GptOrthographyMessage";

import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";

import { orthographyUseCase } from "@/core/use-cases/orthography/orthography.use-case";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

    setIsLoading(false);

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Spell check could not be performed.",
          isGpt: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: true,
          info: { errors, message, userScore },
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="Hola, puedes escribir tu texto en español y te ayudaré con las correcciones." />

        {messages.map((message, index) =>
          message.isGpt ? (
            <GptOrthographyMessage key={index} {...message.info!} />
          ) : (
            <MyMessage key={index} text={message.text} />
          )
        )}

        {isLoading && (
          <div className="flex justify-start">
            <TypingLoader />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        <TextMessageBox
          onSendMessage={handlePost}
          placeholder="Escribe aquí lo que deseas..."
          disabledCorrections
        />
      </div>
    </div>
  );
};
