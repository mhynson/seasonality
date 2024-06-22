import { TTimeframeLabel } from "../types";
interface IBestWorstWorstHeaderProps {
  timeframe: TTimeframeLabel;
}
export const BestWorstHeader = ({ timeframe }: IBestWorstWorstHeaderProps) => {
  return (
    <div className="mx-auto max-w-2xl lg:text-center">
      <h1 className="font-bold text-indigo-600">Best and Worst</h1>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        View the best and worst stocks based on {timeframe} seasonality.
      </p>
      <p className="mt-9 leading-7 text-white">
        Enter one or more tickers, either separated by a comma or entered on a
        new line.
      </p>
    </div>
  );
};
