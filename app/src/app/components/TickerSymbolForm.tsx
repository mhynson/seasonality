import { ChangeEvent } from "react";

interface ITickerSymbolForm {
  symbols: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TickerSymbolForm = ({
  symbols,
  handleSubmit,
  onTextChange,
}: ITickerSymbolForm) => {
  return (
    <form onSubmit={handleSubmit}>
      <label className="block font-semibold" htmlFor="symbols">
        Ticker Symbols
      </label>
      <textarea
        id="symbols"
        className="block p-4 w-full mt-2 text-black uppercase"
        autoCapitalize="false"
        autoComplete="false"
        autoCorrect="false"
        autoFocus
        onChange={onTextChange}
        required
        rows={3}
        spellCheck="false"
        value={symbols}
      />
      <button
        className="p-4 rounded mt-4 mb-4 w-36 bg-indigo-600 text-white"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
