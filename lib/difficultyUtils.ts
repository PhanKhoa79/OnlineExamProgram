/**
 * Returns appropriate color classes for difficulty levels
 * @param level - Difficulty level ("dễ" | "trung bình" | "khó")
 * @returns CSS classes for styling difficulty badges
 */
export const getDifficultyColor = (level: string): string => {
  switch (level?.toLowerCase()) {
    case "dễ":
      return "bg-green-100 text-green-800 border-green-200";
    case "trung bình":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"; 
    case "khó":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

/**
 * Returns appropriate background color for difficulty levels (for elements without border)
 * @param level - Difficulty level ("dễ" | "trung bình" | "khó")
 * @returns CSS background color classes
 */
export const getDifficultyBgColor = (level: string): string => {
  switch (level?.toLowerCase()) {
    case "dễ":
      return "bg-green-100 text-green-800";
    case "trung bình":
      return "bg-yellow-100 text-yellow-800";
    case "khó":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Returns hex color codes for difficulty levels
 * @param level - Difficulty level ("dễ" | "trung bình" | "khó")
 * @returns Object with background and text hex colors
 */
export const getDifficultyHexColors = (level: string): { bg: string; text: string } => {
  switch (level?.toLowerCase()) {
    case "dễ":
      return { bg: "#dcfce7", text: "#166534" }; // green-100, green-800
    case "trung bình":
      return { bg: "#fef3c7", text: "#92400e" }; // yellow-100, yellow-800
    case "khó":
      return { bg: "#fee2e2", text: "#991b1b" }; // red-100, red-800
    default:
      return { bg: "#f3f4f6", text: "#1f2937" }; // gray-100, gray-800
  }
};

/**
 * Returns the icon name for difficulty levels
 * @param level - Difficulty level ("dễ" | "trung bình" | "khó")
 * @returns Icon identifier string
 */
export const getDifficultyIcon = (level: string): string => {
  switch (level?.toLowerCase()) {
    case "dễ":
      return "😊"; // Easy - smiling face
    case "trung bình":
      return "😐"; // Medium - neutral face
    case "khó":
      return "😰"; // Hard - anxious face
    default:
      return "❓"; // Unknown
  }
};

/**
 * Validates if a difficulty level is valid
 * @param level - Difficulty level to validate
 * @returns Boolean indicating if the level is valid
 */
export const isValidDifficultyLevel = (level: string): boolean => {
  const validLevels = ["dễ", "trung bình", "khó"];
  return validLevels.includes(level?.toLowerCase());
};

/**
 * Returns formatted display name for difficulty level
 * @param level - Difficulty level
 * @returns Properly capitalized difficulty level name
 */
export const formatDifficultyLevel = (level: string): string => {
  if (!level) return "Chưa xác định";
  
  switch (level.toLowerCase()) {
    case "dễ":
      return "Dễ";
    case "trung bình":
      return "Trung bình";
    case "khó":
      return "Khó";
    default:
      return level;
  }
}; 