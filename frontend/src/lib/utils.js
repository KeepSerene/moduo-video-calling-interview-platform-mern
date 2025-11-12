export function getDifficultyBadgeClassName(difficulty) {
  switch (difficulty?.toLowerCase() || "easy") {
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
  if (!input || typeof input !== "string") {
    return "";
  }

  return (
    input
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // Remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // Normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ", ")
          // Handle parentheses and curly braces similarly
          .replace(/\(\s+/g, "(")
          .replace(/\s+\)/g, ")")
          .replace(/\{\s+/g, "{")
          .replace(/\s+\}/g, "}")
          // Normalize multiple spaces to single space
          .replace(/\s+/g, " ")
      )
      .filter((line) => line.length > 0)
      .join("\n")
      // Remove trailing/leading whitespace from final result
      .trim()
  );
}
