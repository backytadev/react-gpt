import { useRef, useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";

import { prosConsDiscusserStreamGeneratorUseCase } from "@/core/use-cases/pros-cons/pros-cons-discusser-stream-generator.use-case";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    //? With Generating Function and readable decoder
    const stream = prosConsDiscusserStreamGeneratorUseCase(
      text,
      abortController.current.signal
    );

    setIsLoading(false);

    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;

        return newMessages;
      });
    }

    isRunning.current = false;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <span className="text-center text-2xl font-bold block sm:hidden">
        Pros y Cons Stream
      </span>
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="¿Que deseas comparar hoy?" />
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
