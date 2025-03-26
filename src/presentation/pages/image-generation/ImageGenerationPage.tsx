import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { GptMessageImage } from "@/presentation/components/chat-bubbles/GptMessageImage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";

import { imageGenerationUseCase } from "@/core/use-cases/image-generation/image-generation.use-case";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <span className="text-center text-2xl font-bold block sm:hidden">
        Generar Imagen
      </span>
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="¿Qué imagen deseas generar hoy?" />
        {messages.map((message, index) =>
          message.isGpt ? (
            <GptMessageImage
              key={index}
              text={message.text}
              imageUrl={message.info?.imageUrl || ""}
              alt={message.info?.alt || ""}
            />
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
