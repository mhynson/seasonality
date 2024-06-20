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
        className="block p-4 w-full mt-2 text-black"
        id="symbols"
        value={symbols}
        onChange={onTextChange}
        required
        rows={3}
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
