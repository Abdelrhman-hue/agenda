export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const fromMinutes = (total: number) => {
  const h = Math.floor(total / 60).toString().padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export function isValidTimezone(tz: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// تاريخ النهاردة بصيغة YYYY-MM-DD بتوقيت النشاط
export function todayIn(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Convert a local wall-clock date/time in an IANA zone into an absolute instant. */
export function zonedDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let instant = targetAsUtc;

  // Re-evaluate the zone offset because DST transitions can change it near the target.
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instant));
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const representedAsUtc = Date.UTC(
      Number(values.year), Number(values.month) - 1, Number(values.day),
      Number(values.hour), Number(values.minute),
    );
    const offset = representedAsUtc - instant;
    const adjusted = targetAsUtc - offset;
    if (adjusted === instant) break;
    instant = adjusted;
  }

  const actual = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const values = Object.fromEntries(actual.map(({ type, value }) => [type, value]));
  if (
    Number(values.year) !== year || Number(values.month) !== month || Number(values.day) !== day ||
    Number(values.hour) !== hour || Number(values.minute) !== minute
  ) {
    throw new RangeError("Local time does not exist in the selected timezone");
  }
  return new Date(instant);
}

/** First valid instant belonging to a local calendar date (handles midnight DST gaps). */
export function startOfDateInTimezone(date: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  for (let minute = 0; minute < 180; minute++) {
    const localTime = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
    try {
      return zonedDateTimeToUtc(date, localTime, timeZone);
    } catch {
      // Some zones advance their clocks at midnight; try the next local minute.
    }
  }
  throw new RangeError(`Could not find the start of ${date} in ${timeZone}`);
}

export function dateInTimezone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function weekdayInTimezone(date: Date, timeZone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

export function timeInTimezone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(date);
}
