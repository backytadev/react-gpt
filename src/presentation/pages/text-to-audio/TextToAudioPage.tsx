import { useState } from "react";

import { MyMessage } from "@/presentation/components/chat-bubbles/MyMessage";
import { TypingLoader } from "@/presentation/components/loaders/TypingLoader";
import { GptMessage } from "@/presentation/components/chat-bubbles/GptMessage";
import { GptMessageAudio } from "@/presentation/components/chat-bubbles/GptMessageAudio";
import { TextMessageBoxSelect } from "@/presentation/components/chat-input-boxes/TextMessageBoxSelect";

import { textToAudioUseCase } from "@/core/use-cases/text-audio/text-to-audio.use-case";

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: "text";
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: "audio";
}

type Message = TextMessage | AudioMessage;

const displaimer = `¿Que audio quieres generar hoy? 
* Todo el audio generado es por AI.`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: text, isGpt: false, type: "text" },
    ]);

    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );

    setIsLoading(false);

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        isGpt: true,
        type: "audio",
        audio: audioUrl!,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto h-auto p-3 space-y-6">
        <GptMessage text={displaimer} />
        {messages.map((message, index) =>
          message.isGpt ? (
            message.type === "audio" ? (
              <GptMessageAudio
                key={index}
                text={message.text}
                audio={message.audio}
              />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
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
        options={voices}
      />
    </div>
  );
};
