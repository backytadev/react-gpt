import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabledCorrections?: boolean;
}

export const TextMessageBox = ({
  onSendMessage,
  placeholder = "Escribe un mensaje...",
  disabledCorrections = false,
}: Props) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length === 0) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center w-full px-3 md:px-6 py-2 bg-white rounded-lg shadow-sm"
    >
      <input
        type="text"
        autoFocus
        name="message"
        className="flex-grow border text-sm md:text-base border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder={placeholder}
        autoComplete={disabledCorrections ? "on" : "off"}
        autoCorrect={disabledCorrections ? "on" : "off"}
        spellCheck={disabledCorrections ? "true" : "false"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="submit"
        className="ml-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Enviar mensaje"
        aria-disabled={message.trim().length === 0}
        disabled={message.trim().length === 0}
      >
        <span className="hidden sm:inline text-sm md:text-base">Enviar</span>
        <i className="fa-regular fa-paper-plane"></i>
      </button>
    </form>
  );
};
