export const EVENT_NAME = "Happyland Olympics";
export const EVENT_YEAR = 2026;
export const EVENT_TAGLINE = "Where the Elements Come to Play";
export const EVENT_LOCATION = "Happyland, Oklahoma";
export const EVENT_DATES = "June 12–14, 2026";

// Central Time (America/Chicago)
export const EVENT_START = "2026-06-12T19:00:00-05:00";
export const EVENT_END = "2026-06-14T12:00:00-05:00";
export const EVENT_TIMEZONE = "America/Chicago";

export const ELEMENTS = [
  { name: "Earth", color: "earth", icon: "leaf" },
  { name: "Fire", color: "fire", icon: "flame" },
  { name: "Water", color: "water", icon: "wave" },
  { name: "Air", color: "air", icon: "swirl" },
] as const;

export const SCHEDULE = [
  {
    day: "Friday",
    date: "June 12",
    title: "Arrival & Kickoff",
    color: "water" as const,
    element: "Water" as const,
    items: [
      { time: "7:00 PM", label: "Gates Open & Check-In" },
      { time: "8:00 PM", label: "Opening Ceremonies" },
      { time: "9:00 PM", label: "Welcome Bonfire & Social" },
    ],
  },
  {
    day: "Saturday",
    date: "June 13",
    title: "Main Event Day",
    color: "fire" as const,
    element: "Fire" as const,
    items: [
      { time: "8:00 AM", label: "Breakfast & Team Formation" },
      { time: "9:00 AM", label: "Olympic Events Begin" },
      { time: "12:00 PM", label: "Lunch Break" },
      { time: "1:00 PM", label: "Afternoon Competitions" },
      { time: "5:00 PM", label: "Awards Ceremony" },
      { time: "7:00 PM", label: "Victory Celebration" },
    ],
  },
  {
    day: "Sunday",
    date: "June 14",
    title: "Farewell",
    color: "earth" as const,
    element: "Earth" as const,
    items: [
      { time: "9:00 AM", label: "Farewell Brunch" },
      { time: "11:00 AM", label: "Group Photo & Goodbye" },
      { time: "12:00 PM", label: "Departure" },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Recap", href: "#recap" },
  { label: "Gallery", href: "#gallery" },
  { label: "Schedule", href: "#schedule" },
  { label: "Save the Date", href: "#save-the-date" },
];
