export function getSortedLocations(locations) {
  return [...locations].sort(
    (left, right) => right.averageStepsPerPerson - left.averageStepsPerPerson,
  );
}

export function formatSteps(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatUpdatedAt(value) {
  if (!value) {
    return "Waiting for update";
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getRankLabel(index) {
  if (index === 0) return "1st";
  if (index === 1) return "2nd";
  if (index === 2) return "3rd";
  return `${index + 1}th`;
}
