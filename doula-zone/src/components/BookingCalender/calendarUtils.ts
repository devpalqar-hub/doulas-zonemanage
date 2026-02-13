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
  currentMonth: string,
  singleMode: boolean,
) => {
  const states: string[] = [];

const isAvailable = availability[date];
const weekday = dayjs(date).format("dddd").toUpperCase();
const isVisitDay = visitDays.includes(weekday);

// Outside month
if (!date.startsWith(currentMonth)) return ["outside"];

if (isAvailable === true) states.push("available");
else if (isAvailable === false) states.push("blocked");
else states.push("disabled"); // missing data

// Visit marker independent
if (isVisitDay) states.push("visit");

/* ---------------- SINGLE MODE (Birth Doula) ---------------- */
if (singleMode) {
  if (start && date === start) {
    states.push("selected");
  }
  return states;
}

/* ---------------- RANGE MODE (Postpartum) ---------------- */
if (start && date === start) states.push("start");
if (end && date === end) states.push("end");

if (start && end && dayjs(date).isAfter(start) && dayjs(date).isBefore(end)) {
  states.push("range");
}

return states;

};
