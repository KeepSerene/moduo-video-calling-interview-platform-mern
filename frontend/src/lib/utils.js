export function getDifficultyBadgeClassName(difficulty) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}

export function getFileExtension(programmingLanguage) {
  const fileExtensionsMap = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return fileExtensionsMap[programmingLanguage.toLowerCase()] || "txt";
}

export function normalize(input) {
  // normalize input for comparison (trim whitespace, handle different spacing)
  return input
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        // remove spaces after [ and before ]
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        // normalize spaces around commas to single space after comma
        .replace(/\s*,\s*/g, ", ")
    )
    .filter((line) => line.length > 0)
    .join("\n");
}
