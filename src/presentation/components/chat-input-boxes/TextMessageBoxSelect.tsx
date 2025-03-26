import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string, selectedOption: string) => void;
  placeholder?: string;
  disabledCorrections?: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
}

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  disabledCorrections = false,
  options,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;
    if (selectedOption === "") return;

    onSendMessage(message, selectedOption);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-col sm:flex-row items-center bg-white w-full p-4 rounded-xl shadow-md gap-3"
    >
      <div className="flex flex-col sm:flex-row w-full gap-3">
        <input
          type="text"
          autoFocus
          name="message"
          className="border flex-1 text-sm md:text-base  rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 px-2 py-2 h-10 w-full"
          placeholder={placeholder}
          autoComplete={disabledCorrections ? "on" : "off"}
          autoCorrect={disabledCorrections ? "on" : "off"}
          spellCheck={disabledCorrections ? "true" : "false"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <select
          name="select"
          className="border text-sm md:text-base rounded-xl text-gray-900 focus:outline-none focus:border-indigo-300 px-3 py-2 h-10 w-full sm:w-1/3"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Seleccione</option>
          {options.map(({ id, text }) => (
            <option key={id} value={text}>
              {text}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn-primary flex items-center justify-center px-4 py-2 rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 w-full sm:w-auto"
        disabled={message.trim().length === 0 || !selectedOption}
      >
        <span className="hidden sm:inline text-sm md:text-base">Enviar</span>
        <i className="fa-regular fa-paper-plane ml-2"></i>
      </button>
    </form>
  );
};
