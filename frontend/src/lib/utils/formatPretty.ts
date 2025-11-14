export const formatPretty = (d: Date) => {
  const now = new Date().getTime();
  const diffSec = Math.round((now - d.getTime()) / 1000);

  if (diffSec < 60) return "now";
  if (diffSec < 3600) return `${Math.round(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)} hours ago`;
  if (diffSec < 30 * 86400) return `${Math.round(diffSec / 86400)} days ago`;

  const date = d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
};
