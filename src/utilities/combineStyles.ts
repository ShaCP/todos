export const combineStyles = (
  styles: Record<string, string>[]
  //   stylesToCombine?: string[]
) => {
  const combinedStyles: Record<string, string> = {};

  styles.forEach((style) => {
    Object.keys(style).forEach((key) => {
      combinedStyles[key] = combinedStyles[key]
        ? combinedStyles[key] + " " + style[key]
        : style[key];
    });
  });

  return combinedStyles;
};
