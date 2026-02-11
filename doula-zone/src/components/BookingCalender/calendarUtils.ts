import dayjs from "dayjs";

export const format = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

/* generate days for a month grid */
export const generateMonthMatrix = (month: dayjs.Dayjs) => {
  const start = month.startOf("month").startOf("week");
  const end = month.endOf("month").endOf("week");

  const days: string[] = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    days.push(format(current));
    current = current.add(1, "day");
  }

  return days;
};

/* cannot cross blocked date ONLY IF it's a visit day */
// export const isRangeValid = (
//   start: string,
//   end: string,
//   availability: Record<string, boolean>,
//   visitDays: string[]
// ) => {
//   let cur = dayjs(start);

//   while (cur.isBefore(end) || cur.isSame(end)) {
//     const key = cur.format("YYYY-MM-DD");
//     const weekday = cur.format("dddd").toUpperCase();

//     // ONLY BLOCK IF:
//     // 1. The date is unavailable (availability[key] === false)
//     // 2. AND it's one of the selected visit days
//     if (availability[key] === false && visitDays.includes(weekday)) {
//       return false;
//     }

//     cur = cur.add(1, "day");
//   }

//   return true;
// };


export const getDayState = (
  date: string,
  availability: Record<string, boolean>,
  start: string | null,
  end: string | null,
  visitDays: string[],
  currentMonth: string
) => {
  const isAvailable = availability[date];
  const weekday = dayjs(date).format("dddd").toUpperCase();
  const isVisitDay = visitDays.includes(weekday);
  
  // OUTSIDE MONTH (Airbnb behavior)
  if (!date.startsWith(currentMonth)) return "outside";

  // RANGE SELECTION
  if (start && !end && date === start) return "start";

    if (start && end) {
    if (date === start) return "start";
    if (date === end) return "end";

    if (dayjs(date).isAfter(start) && dayjs(date).isBefore(end)) {
      if (isAvailable === false) return "blocked-range"; // red inside range

      if (isVisitDay) return "visit";

      return "range";
    }
  }
  if (isAvailable === false) return "blocked";

  // NORMAL AVAILABLE DAY
  return "available";
};