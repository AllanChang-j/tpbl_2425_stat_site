// Field Mappings for Players and Lineups
export type FieldMapping = {
  zh: string;
  en: string;
  formula?: string;
  definition?: string;
};

export const PLAYER_FIELDS: Record<string, FieldMapping> = {
  player_id: { zh: "球員ID", en: "Player ID" },
  player_name: { zh: "球員", en: "Player" },
  team_name: { zh: "球隊", en: "Team" },
  games_used: { zh: "出賽場次", en: "Games" },
  stint_count: { zh: "Stints數", en: "Stints" },
  possessions: { zh: "回合數", en: "Possessions" },
  possessions_per_game: { zh: "回合數（每場）", en: "Possessions / G" },
  possessions_per36: { zh: "回合數（每36分鐘）", en: "Possessions / 36" },
  sec_played: { zh: "上場秒數", en: "Seconds Played" },
  min_played: { zh: "上場分鐘", en: "Minutes Played" },
  min_played_str: { zh: "上場時間", en: "Minutes (str)" },
  sec_per_game: { zh: "每場秒數", en: "Seconds / Game" },
  min_per_game: { zh: "每場分鐘", en: "Minutes / Game" },
  min_per_game_str: { zh: "每場時間", en: "Minutes / Game (str)" },
  PTS: { zh: "得分", en: "Points" },
  PTS_per_game: { zh: "得分（每場）", en: "PTS / G" },
  PTS_per100: { zh: "得分（每100回合）", en: "PTS / 100 poss" },
  PTS_per36: { zh: "得分（每36分鐘）", en: "PTS / 36" },
  FGA: { zh: "出手", en: "FGA" },
  FGA_per_game: { zh: "出手（每場）", en: "FGA / G" },
  FGA_per100: { zh: "出手（每100回合）", en: "FGA / 100 poss" },
  FGA_per36: { zh: "出手（每36分鐘）", en: "FGA / 36" },
  FGM: { zh: "命中", en: "FGM" },
  FGM_per_game: { zh: "命中（每場）", en: "FGM / G" },
  FGM_per100: { zh: "命中（每100回合）", en: "FGM / 100 poss" },
  FGM_per36: { zh: "命中（每36分鐘）", en: "FGM / 36" },
  "2PA": { zh: "兩分出手", en: "2PA" },
  "2PA_per_game": { zh: "兩分出手（每場）", en: "2PA / G" },
  "2PA_per100": { zh: "兩分出手（每100回合）", en: "2PA / 100 poss" },
  "2PA_per36": { zh: "兩分出手（每36分鐘）", en: "2PA / 36" },
  "2PM": { zh: "兩分命中", en: "2PM" },
  "2PM_per_game": { zh: "兩分命中（每場）", en: "2PM / G" },
  "2PM_per100": { zh: "兩分命中（每100回合）", en: "2PM / 100 poss" },
  "2PM_per36": { zh: "兩分命中（每36分鐘）", en: "2PM / 36" },
  "3PA": { zh: "三分出手", en: "3PA" },
  "3PA_per_game": { zh: "三分出手（每場）", en: "3PA / G" },
  "3PA_per100": { zh: "三分出手（每100回合）", en: "3PA / 100 poss" },
  "3PA_per36": { zh: "三分出手（每36分鐘）", en: "3PA / 36" },
  "3PM": { zh: "三分命中", en: "3PM" },
  "3PM_per_game": { zh: "三分命中（每場）", en: "3PM / G" },
  "3PM_per100": { zh: "三分命中（每100回合）", en: "3PM / 100 poss" },
  "3PM_per36": { zh: "三分命中（每36分鐘）", en: "3PM / 36" },
  FTA: { zh: "罰球出手", en: "FTA" },
  FTA_per_game: { zh: "罰球出手（每場）", en: "FTA / G" },
  FTA_per100: { zh: "罰球出手（每100回合）", en: "FTA / 100 poss" },
  FTA_per36: { zh: "罰球出手（每36分鐘）", en: "FTA / 36" },
  FTM: { zh: "罰球命中", en: "FTM" },
  FTM_per_game: { zh: "罰球命中（每場）", en: "FTM / G" },
  FTM_per100: { zh: "罰球命中（每100回合）", en: "FTM / 100 poss" },
  FTM_per36: { zh: "罰球命中（每36分鐘）", en: "FTM / 36" },
  ORB: { zh: "進攻籃板", en: "ORB" },
  ORB_per_game: { zh: "進攻籃板（每場）", en: "ORB / G" },
  ORB_per100: { zh: "進攻籃板（每100回合）", en: "ORB / 100 poss" },
  ORB_per36: { zh: "進攻籃板（每36分鐘）", en: "ORB / 36" },
  DRB: { zh: "防守籃板", en: "DRB" },
  DRB_per_game: { zh: "防守籃板（每場）", en: "DRB / G" },
  DRB_per100: { zh: "防守籃板（每100回合）", en: "DRB / 100 poss" },
  DRB_per36: { zh: "防守籃板（每36分鐘）", en: "DRB / 36" },
  AST: { zh: "助攻", en: "AST" },
  AST_per_game: { zh: "助攻（每場）", en: "AST / G" },
  AST_per100: { zh: "助攻（每100回合）", en: "AST / 100 poss" },
  AST_per36: { zh: "助攻（每36分鐘）", en: "AST / 36" },
  STL: { zh: "抄截", en: "STL" },
  STL_per_game: { zh: "抄截（每場）", en: "STL / G" },
  STL_per100: { zh: "抄截（每100回合）", en: "STL / 100 poss" },
  STL_per36: { zh: "抄截（每36分鐘）", en: "STL / 36" },
  BLK: { zh: "阻攻", en: "BLK" },
  BLK_per_game: { zh: "阻攻（每場）", en: "BLK / G" },
  BLK_per100: { zh: "阻攻（每100回合）", en: "BLK / 100 poss" },
  BLK_per36: { zh: "阻攻（每36分鐘）", en: "BLK / 36" },
  TOV: { zh: "失誤", en: "TOV" },
  TOV_per_game: { zh: "失誤（每場）", en: "TOV / G" },
  TOV_per100: { zh: "失誤（每100回合）", en: "TOV / 100 poss" },
  TOV_per36: { zh: "失誤（每36分鐘）", en: "TOV / 36" },
  Fouls: { zh: "犯規", en: "Fouls" },
  Fouls_per_game: { zh: "犯規（每場）", en: "Fouls / G" },
  Fouls_per100: { zh: "犯規（每100回合）", en: "Fouls / 100 poss" },
  Fouls_per36: { zh: "犯規（每36分鐘）", en: "Fouls / 36" },
  FT_allowed: { zh: "被罰球（對手FTM）", en: "FT Allowed (Opp FTM)" },
  FT_allowed_per_game: { zh: "被罰球（每場）", en: "FT Allowed / G" },
  FT_allowed_per100: { zh: "被罰球（每100回合）", en: "FT Allowed / 100 poss" },
  FT_allowed_per36: { zh: "被罰球（每36分鐘）", en: "FT Allowed / 36" },
  rapm_per100: { zh: "RAPM", en: "RAPM " },
  orapm_per100: { zh: "進攻RAPM", en: "O-RAPM " },
  drapm_per100: { zh: "防守RAPM", en: "D-RAPM " },
  ORtg: { zh: "進攻效率", en: "Offensive Rating" },
  DRtg: { zh: "防守效率", en: "Defensive Rating" },
  NetRtg: { zh: "淨效率", en: "Net Rating" },
  PM_total: { zh: "總正負值", en: "Plus/Minus (Total)" },
  PM_per_game: { zh: "正負值（每場）", en: "+/- per Game" },
  PM_per100: { zh: "正負值（每100回合）", en: "+/- per 100 poss" },
  PACE: { zh: "節奏（Pace）", en: "Pace" },
  eFG: { zh: "有效命中率", en: "eFG%" },
  TS: { zh: "真實命中率", en: "TS%" },
  FG2_pct: { zh: "兩分命中率", en: "2P%" },
  FG3_pct: { zh: "三分命中率", en: "3P%" },
  FT_pct: { zh: "罰球命中率", en: "FT%" },
  TOV_pct: { zh: "失誤率", en: "TOV%" },
  AST_ratio: { zh: "助攻比率（AST Ratio）", en: "AST Ratio" },
  USG_pct: { zh: "使用率", en: "USG%" },
  ORB_pct: { zh: "進攻籃板率", en: "ORB%" },
  DRB_pct: { zh: "防守籃板率", en: "DRB%" },
  TRB_pct: { zh: "總籃板率", en: "TRB%" },
  STL_per100poss: { zh: "抄截（每100回合）", en: "STL / 100 poss (alt)" },
  BLK_per100poss: { zh: "阻攻（每100回合）", en: "BLK / 100 poss (alt)" },
  STL_pct: { zh: "抄截率", en: "STL%" },
  BLK_pct: { zh: "阻攻率", en: "BLK%" },
  Foul_per_poss: { zh: "每回合犯規", en: "Fouls / Poss" },
  FT_allowed_rate_per100: { zh: "被罰球率（每100回合）", en: "FT Allowed Rate / 100" },
  FT_rate: { zh: "罰球率（FT Rate）", en: "FT Rate" },
};

export const LINEUP_FIELDS: Record<string, FieldMapping> = {
  ...PLAYER_FIELDS,
  lineup_size: { zh: "陣容人數", en: "Lineup Size" },
  lineup_player_ids: { zh: "球員ID列表", en: "Player IDs" },
  lineup_player_names: { zh: "球員名單", en: "Players" },
  PTS_allowed: { zh: "失分", en: "Points Allowed" },
  PTS_allowed_per_game: { zh: "失分（每場）", en: "PTS Allowed / G" },
  PTS_allowed_per100: { zh: "失分（每100回合）", en: "PTS Allowed / 100 poss" },
  PTS_allowed_per36: { zh: "失分（每36分鐘）", en: "PTS Allowed / 36" },
  ORB_allowed: { zh: "讓對手進攻籃板", en: "Opp ORB" },
  ORB_allowed_per_game: { zh: "讓對手進攻籃板（每場）", en: "Opp ORB / G" },
  ORB_allowed_per100: { zh: "讓對手進攻籃板（每100回合）", en: "Opp ORB / 100 poss" },
  ORB_allowed_per36: { zh: "讓對手進攻籃板（每36分鐘）", en: "Opp ORB / 36" },
  DRB_allowed: { zh: "讓對手防守籃板", en: "Opp DRB" },
  DRB_allowed_per_game: { zh: "讓對手防守籃板（每場）", en: "Opp DRB / G" },
  DRB_allowed_per100: { zh: "讓對手防守籃板（每100回合）", en: "Opp DRB / 100 poss" },
  DRB_allowed_per36: { zh: "讓對手防守籃板（每36分鐘）", en: "Opp DRB / 36" },
  MIN_total: { zh: "總分鐘（陣容）", en: "Minutes (Total)" },
  MIN_per_game: { zh: "每場分鐘（陣容）", en: "Minutes / Game" },
};

export type DisplayUnit = "raw" | "per_game" | "per36" | "per100";

export const DISPLAY_UNITS: { value: DisplayUnit; label: { zh: string; en: string } }[] = [
  { value: "raw", label: { zh: "累積", en: "Cumulative" } },
  { value: "per_game", label: { zh: "每場", en: "Per Game" } },
  { value: "per36", label: { zh: "每36分鐘", en: "Per 36" } },
  { value: "per100", label: { zh: "每100回合", en: "Per 100 Poss." } },
];

// Fields that don't apply to unit conversion (percentages, ratios, rates, ratings)
// These should display the same value regardless of unit
export const UNIT_INDEPENDENT_FIELDS = new Set([
  "ORtg", "DRtg", "NetRtg", "PACE",
  "eFG", "TS", "FG2_pct", "FG3_pct", "FT_pct", "TOV_pct",
  "AST_ratio", "USG_pct", "ORB_pct", "DRB_pct", "TRB_pct",
  "STL_pct", "BLK_pct",
  "Foul_per_poss", "FT_allowed_rate_per100", "FT_rate",
  "STL_per100poss", "BLK_per100poss", // These are already per 100, but should show same value
  "lineup_size", // Lineup size is also unit-independent
  "rapm_per100", "orapm_per100", "drapm_per100",
]);

// Extract base field name by removing unit suffixes
// Check if a field should be displayed as percentage
export function isPercentageField(fieldName: string): boolean {
  const lowerField = fieldName.toLowerCase();
  return (
    lowerField.includes("rate") ||
    lowerField.includes("_pct") ||
    lowerField.includes("%") ||
    lowerField === "efg" ||
    lowerField === "ts" ||
    lowerField === "ast_ratio" // AST_ratio is also a percentage
  );
}

// Fields that are already in percentage format (0-100), don't multiply by 100
const ALREADY_PERCENTAGE_FIELDS = new Set([
  "ast_ratio",      // AST Ratio is already 0-100 format
  "usg_pct",        // USG% is already 0-100 format
  "orb_pct",        // ORB% is already 0-100 format
  "drb_pct",        // DRB% is already 0-100 format
  "trb_pct",        // TRB% is already 0-100 format
  "stl_pct",        // STL% is already 0-100 format
  "blk_pct",        // BLK% is already 0-100 format
  "fg2_pct",        // 2P% is already 0-100 format
  "fg3_pct",        // 3P% is already 0-100 format
  "ft_pct",         // FT% is already 0-100 format
  "tov_pct",        // TOV% is already 0-100 format
]);

// Format a number as percentage
// Some fields are already in percentage format (0-100), others are decimal (0-1)
export function formatAsPercentage(value: number, fieldName: string): string {
  const lowerField = fieldName.toLowerCase();
  
  // Some percentage fields come in mixed formats (0-1 or 0-100).
  // If value is <= 1, treat it as decimal and convert to percent.
  if (ALREADY_PERCENTAGE_FIELDS.has(lowerField)) {
    if (value <= 1) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return `${value.toFixed(1)}%`;
  }
  
  // Otherwise, multiply by 100 to convert from decimal (0-1) to percentage
  return `${(value * 100).toFixed(1)}%`;
}

export function getBaseFieldName(fieldName: string): string {
  // 特例：RAPM 這三個就是「固定 per100」的欄位，不要去掉 suffix
  if (fieldName === "rapm_per100" || fieldName === "orapm_per100" || fieldName === "drapm_per100") {
    return fieldName;
  }

  // 特例：poss_per_game 對應到 possessions
  if (fieldName === "poss_per_game") return "possessions";

  if (fieldName.endsWith("_per_game")) return fieldName.replace("_per_game", "");
  if (fieldName.endsWith("_per36")) return fieldName.replace("_per36", "");
  if (fieldName.endsWith("_per100")) return fieldName.replace("_per100", "");
  if (fieldName.endsWith("_per100poss")) return fieldName.replace("_per100poss", "");
  return fieldName;
}

// Get field name based on display unit
export function getFieldKey(baseField: string, unit: DisplayUnit): string {
  if (unit === "raw") {
    return baseField;
  }
  
  // Special case: possessions uses poss_per_game in data
  if (baseField === "possessions") {
    if (unit === "per_game") return "poss_per_game";
    if (unit === "per36") return "possessions_per36"; // Will be calculated if not in data
    if (unit === "per100") return "possessions_per100"; // Will be calculated if not in data
  }
  
  const suffix = unit === "per_game" ? "_per_game" : unit === "per36" ? "_per36" : "_per100";
  const fieldKey = `${baseField}${suffix}`;
  
  return fieldKey;
}

// Get display value for a field based on unit
export function getDisplayValue(
  data: Record<string, any>,
  fieldName: string,
  unit: DisplayUnit
): number | string | null {
  // First, extract the base field name (remove any existing unit suffix)
  const baseField = getBaseFieldName(fieldName);
  
  // For unit-independent fields (percentages, ratios, ratings), always show the base field value
  if (UNIT_INDEPENDENT_FIELDS.has(baseField)) {
    if (data[baseField] !== undefined && data[baseField] !== null && data[baseField] !== "") {
      return data[baseField];
    }
    if (data[fieldName] !== undefined && data[fieldName] !== null && data[fieldName] !== "") {
      return data[fieldName];
    }
    return null;
  }
  
  // Get the target field key based on the selected unit
  const targetFieldKey = getFieldKey(baseField, unit);
  
  // Try the unit-specific field first
  if (data[targetFieldKey] !== undefined && data[targetFieldKey] !== null && data[targetFieldKey] !== "") {
    return data[targetFieldKey];
  }
  
  // Special calculation for possessions_per36 if not in data
  if (baseField === "possessions" && unit === "per36" && data.possessions && data.min_played) {
    const possPer36 = (data.possessions / data.min_played) * 36;
    if (!isNaN(possPer36) && isFinite(possPer36)) {
      return possPer36;
    }
  }
  
  // Special calculation for possessions_per100 if not in data (use PACE if available)
  if (baseField === "possessions" && unit === "per100" && data.PACE) {
    // PACE is already possessions per 100, so we can use it directly
    return data.PACE;
  }
  
  // Fallback to raw (cumulative) value
  if (data[baseField] !== undefined && data[baseField] !== null && data[baseField] !== "") {
    return data[baseField];
  }
  
  return null;
}

// Numeric fields that can be used in filters
export const NUMERIC_FIELDS = Object.keys(PLAYER_FIELDS).filter((key) => {
  const field = PLAYER_FIELDS[key];
  // Exclude ID, name, team, and string fields
  return (
    !key.includes("_id") &&
    !key.includes("_name") &&
    !key.includes("_str") &&
    !key.includes("player_id") &&
    !key.includes("team_name") &&
    !key.includes("lineup_player")
  );
});

