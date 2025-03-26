import { FormEvent, useRef, useState } from "react";

interface Props {
  onSendMessage: (message: string, file: File) => void;
  placeholder?: string;
  disabledCorrections?: boolean;
  accept?: string; // image/*
}

export const TextMessageBoxFile = ({
  onSendMessage,
  placeholder,
  disabledCorrections = false,
  accept,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) return;

    onSendMessage(message, selectedFile);

    setMessage("");

    setSelectedFile(null);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-col md:flex-row items-center rounded-xl bg-white w-full px-4 py-2 gap-2 md:gap-4"
    >
      <div className="flex items-center w-full border rounded-xl px-4 h-10">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 mr-2"
          onClick={() => inputFileRef.current?.click()}
        >
          <i className="fa-solid fa-paperclip text-lg"></i>
        </button>

        <input
          type="file"
          ref={inputFileRef}
          accept={accept}
          onChange={(e) => setSelectedFile(e.target.files?.item(0))}
          hidden
        />

        <input
          type="text"
          autoFocus
          name="message"
          className="flex-grow text-sm md:text-base text-gray-800 focus:outline-none"
          placeholder={placeholder}
          autoComplete={disabledCorrections ? "on" : "off"}
          autoCorrect={disabledCorrections ? "on" : "off"}
          spellCheck={disabledCorrections ? "true" : "false"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        className="btn-primary flex items-center justify-center px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        disabled={!selectedFile && message.trim().length === 0}
      >
        {selectedFile ? (
          <span className="truncate max-w-[100px] md:max-w-[150px]">
            {selectedFile.name}
          </span>
        ) : (
          <span className="hidden md:inline">Enviar</span>
        )}
        <i className="fa-regular fa-paper-plane ml-2"></i>
      </button>
    </form>
  );
};
