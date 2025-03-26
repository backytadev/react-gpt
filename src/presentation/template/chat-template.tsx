import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBox } from "@/presentation/components/chat-input-boxes/TextMessageBox";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    //UseCase

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-12">
          {/* Welcome */}
          <GptMessage text="Hola puedes escribir tu texto en español, y te ayudo con las correcciones." />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text="Esto es de OpenAI" />
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
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrections
      />
    </div>
  );
};
