import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBoxSelect } from "@/presentation/components/chat-input-boxes/TextMessageBoxSelect";

import { translateUseCase } from "@/core/use-cases/translate/translate.use-case";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);

    const { ok, message } = await translateUseCase(text, selectedOption);

    setIsLoading(false);

    if (!ok) alert(message);

    setMessages((prev) => [...prev, { text: message, isGpt: true }]);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <span className="text-center text-2xl font-bold block sm:hidden">
        Traducir
      </span>
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="¿Que quieres que traduzca hoy?" />
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        options={languages}
      />
    </div>
  );
};
