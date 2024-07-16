import { capitalize, getWeekNumber } from "../api/seasonality/utils";
import { monthOrder } from "../constants";
import { TTimeframeLabel } from "../types";

interface IJumpScrollButtonProps {
  view: TTimeframeLabel;
  symbol: string;
}

export const JumpScrollButton = ({ symbol, view }: IJumpScrollButtonProps) => {
  const now = new Date();
  const label =
    view === "weekly" ? getWeekNumber(now) : monthOrder[now.getMonth()];
  const id = `${symbol}--header-${view}-${label}`;
  const title = `Jump to Current ${capitalize(view.replace("ly", ""))}`;

  return (
    <>
      <button
        className="text-white bg-green-400 rounded-full p-2 float-right"
        onClick={() => document.querySelector(`#${id}`)?.scrollIntoView()}
        role="button"
        title={title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 9h18M7 3v2M17 3v2M10 16l2 2m0 0l2-2m-2 2v-6M6.2 21h11.6c1.12 0 1.68 0 2.11-.22.38-.19.69-.5.88-.88.22-.43.22-1 .22-2.11V8.2c0-1.12 0-1.68-.22-2.11a2 2 0 0 0-.88-.88C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.11.22-.38.19-.69.5-.88.88C3 6.52 3 7.08 3 8.2v9.6c0 1.12 0 1.68.22 2.11.19.38.5.69.88.88C4.52 21 5.08 21 6.2 21Z"
            stroke="#000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </>
  );
};
