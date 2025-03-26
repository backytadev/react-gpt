import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { TextMessageBoxFile } from "@/presentation/components/chat-input-boxes/TextMessageBoxFile";

import { audioToTextUseCase } from "@/core/use-cases/text-audio/audio-to-text.use-case";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp) return;

    const gptMessage = `
## Transcripción: 
__Duración:__ ${Math.round(resp.duration)} segundos
### El texto es: 
${resp.text}
`;

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    for (const segment of resp.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}
`;

      setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <span className="text-center text-2xl font-bold block sm:hidden">
        Audio a Texto
      </span>
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text="Hola, ¿Qué audio quieres convertir a texto?" />
        {messages.map((message, index) =>
          message.isGpt ? (
            <GptMessage key={index} text={message.text} />
          ) : (
            <MyMessage
              key={index}
              text={message.text === "" ? "Transcribe el audio" : message.text}
            />
          )
        )}

        {isLoading && (
          <div className="col-start-1 col-end-12 fade-in">
            <TypingLoader className="fade-in" />
          </div>
        )}
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrections
        accept="audio/*"
      />
    </div>
  );
};
