import { getDateForDay, getStartOfWeek } from "../api/seasonality/utils";

export const SectionHeading = ({
  label,
  view,
}: {
  label: string;
  view: string;
}) => {
  if (view === "weekly") {
    return (
      <h6 className="w-full text-black text-center text-sm italic">
        {getStartOfWeek(label)}
      </h6>
    );
  }
  if (view === "daily") {
    return (
      <h6 className="w-full text-black text-center text-sm italic">
        {getDateForDay(label)}
      </h6>
    );
  }
};
