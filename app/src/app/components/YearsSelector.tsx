import { ChangeEvent, useContext } from "react";
import {
  useYears,
  YearsContext,
  YearsContextType,
} from "../context/YearsContext";

interface IYearsSelector {
  years: number;
}

export const YearsSelector = ({ years }: IYearsSelector) => {
  const { setYears } = useContext(YearsContext) as YearsContextType; // This will give you the setter function for `years`
  return (
    <>
      <label className="block font-semibold" htmlFor="symbols">
        Years
      </label>
      <input
        id="symbols"
        className="block p-4 w-full mt-2 text-black uppercase"
        autoCapitalize="false"
        autoComplete="false"
        autoCorrect="false"
        autoFocus
        onChange={(e) => {
          setYears(parseInt(e.target.value, 10));
        }}
        required
        spellCheck="false"
        tabIndex={0}
        min={1}
        max={50}
        type="number"
        value={years}
      />
    </>
  );
};
