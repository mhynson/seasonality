import { useYears, YearsContextType } from "../context/YearsContext";

interface IYearsSelector {
  years: number;
}

export const YearsSelector = ({ years }: IYearsSelector) => {
  const { setYears } = useYears() as YearsContextType;
  return (
    <>
      <div className="flex flex-col justify-start items-start mb-8">
        <label className="font-semibold" htmlFor="years-number">
          Years of Data to Include
        </label>

        <input
          id="years-number"
          className="ml-2 mt-2 text-black uppercase rounded-full max-w-20 p-2 pl-8 text-md bg-slate-600 text-white font-bold"
          autoCapitalize="false"
          autoComplete="off"
          autoCorrect="false"
          autoFocus
          inputMode="numeric"
          max={50}
          min={5}
          onDrag={(e) => {
            console.log("onDrag:: value on slider", e.target);
          }}
          onChange={(e) => {
            console.log("value on slider", e.target.value);
            setYears(parseInt(e.target.value, 10));
          }}
          required
          spellCheck={false}
          step={1}
          tabIndex={0}
          type="text"
          value={years}
        />
      </div>
    </>
  );
};
