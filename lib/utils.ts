export function cn(...inputs: (string | undefined | null | false | Record<string, boolean> | (string | undefined | null | false)[])[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .map((x) => {
      if (typeof x === "object" && x !== null) {
        return Object.entries(x)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k)
          .join(" ");
      }
      return x;
    })
    .join(" ");
}
