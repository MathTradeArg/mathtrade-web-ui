/** Haystack for the ban-user table search box. */
export function banUserSearchText(user) {
  if (!user) return "";
  if (user.name) return `${user.name}`;
  return `${user.first_name || ""} ${user.last_name || ""}`.trim();
}
