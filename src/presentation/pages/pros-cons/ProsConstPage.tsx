import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";

import { prosConsDiscusserUseCase } from "@/core/use-cases/pros-cons/pros-cons-discusser.use-case";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    content: string;
  };
}

export const ProsConstPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, content } = await prosConsDiscusserUseCase(text);

    if (!ok) return;

    setMessages((prev) => [...prev, { text: content, isGpt: true }]);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <span className="text-center text-2xl font-bold block sm:hidden">
        Pros y Cons
      </span>
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="Puedes escribir lo que se a que quieres que compare y te de mis puntos de vista." />
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
