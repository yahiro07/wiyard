export function cz(
  ...items: (number | false | string | null | undefined)[]
): string {
  return items.filter(Boolean).join(" ");
}
