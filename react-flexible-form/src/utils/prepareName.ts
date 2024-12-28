/* eslint-disable @typescript-eslint/no-explicit-any */
export const prepareName = (name: string): string => {
  // Remove leading square bracket
  // For situation like [0].prop
  if (name[0] === "[") {
    name = name.slice(1) as any;
  }

  return name.replace(/]/gi, "").replace(/\[/gi, ".").replace(/\.\./gi, ".");
};
