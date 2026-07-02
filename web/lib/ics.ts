// Xuất lịch deadline: file .ics (Apple/Outlook/Google import) + link Google Calendar.
// Sự kiện cả-ngày (all-day) theo ngày deadline; nhắc user kiểm tra giờ chính xác tại nguồn.

export interface CalEvent {
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  url?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD -> YYYYMMDD */
const dateKey = (d: string) => d.replaceAll("-", "");

/** Ngày kế tiếp (DTEND của sự kiện all-day là exclusive) */
function nextDay(d: string): string {
  const dt = new Date(d + "T00:00:00");
  dt.setDate(dt.getDate() + 1);
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
}

/** Escape theo RFC5545: dấu phẩy, chấm phẩy, xuống dòng */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildIcs(events: CalEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ScholarFinder//Deadline Calendar//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  events.forEach((e, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:scholarfinder-${dateKey(e.date)}-${i}@scholarfinder.example`,
      `DTSTAMP:${dateKey(e.date)}T000000Z`,
      `DTSTART;VALUE=DATE:${dateKey(e.date)}`,
      `DTEND;VALUE=DATE:${nextDay(e.date)}`,
      `SUMMARY:${esc(e.title)}`,
      ...(e.description ? [`DESCRIPTION:${esc(e.description)}`] : []),
      ...(e.url ? [`URL:${e.url}`] : []),
      "BEGIN:VALARM",
      "TRIGGER:-P7D", // nhắc trước 7 ngày
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(e.title)}`,
      "END:VALARM",
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** Tải file .ics về máy (import vào Google/Apple/Outlook Calendar). */
export function downloadIcs(filename: string, events: CalEvent[]): void {
  const blob = new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Link "Thêm vào Google Calendar" cho 1 sự kiện (không cần import file). */
export function gcalUrl(e: CalEvent): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${dateKey(e.date)}/${nextDay(e.date)}`,
    details: (e.description ?? "") + (e.url ? `\n${e.url}` : ""),
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
