import Papa from "papaparse";
import { z } from "zod";

export type CompetitionType = "regular" | "playin" | "playoff";
/** helper：所有數值欄位統一用這個（可吃 string/number/空值） */
const num = () => z.coerce.number().catch(0); // 空或不合法 -> 0
const numOpt = () => z.coerce.number().optional(); // 可為 undefined（用在你想保留缺值時）

// ---------------- Player ----------------
const PlayerSchema = z
  .object({
    player_id: z.string(),
    player_name: z.string(),
    team_name: z.string(),

    // sample size / time
    games_used: num(),
    stint_count: num(),
    possessions: num(),

    sec_played: num(),
    min_played: num(),
    min_played_str: z.string().optional(),

    sec_per_game: num(),
    min_per_game: num(),
    min_per_game_str: z.string().optional(),

    // counting + per units
    PTS: num(),
    PTS_per_game: numOpt(),
    PTS_per100: numOpt(),
    PTS_per36: numOpt(),

    FGA: num(),
    FGA_per_game: numOpt(),
    FGA_per100: numOpt(),
    FGA_per36: numOpt(),

    FGM: num(),
    FGM_per_game: numOpt(),
    FGM_per100: numOpt(),
    FGM_per36: numOpt(),

    "2PA": num(),
    "2PA_per_game": numOpt(),
    "2PA_per100": numOpt(),
    "2PA_per36": numOpt(),

    "2PM": num(),
    "2PM_per_game": numOpt(),
    "2PM_per100": numOpt(),
    "2PM_per36": numOpt(),

    "3PA": num(),
    "3PA_per_game": numOpt(),
    "3PA_per100": numOpt(),
    "3PA_per36": numOpt(),

    "3PM": num(),
    "3PM_per_game": numOpt(),
    "3PM_per100": numOpt(),
    "3PM_per36": numOpt(),

    FTA: num(),
    FTA_per_game: numOpt(),
    FTA_per100: numOpt(),
    FTA_per36: numOpt(),

    FTM: num(),
    FTM_per_game: numOpt(),
    FTM_per100: numOpt(),
    FTM_per36: numOpt(),

    ORB: num(),
    ORB_per_game: numOpt(),
    ORB_per100: numOpt(),
    ORB_per36: numOpt(),

    DRB: num(),
    DRB_per_game: numOpt(),
    DRB_per100: numOpt(),
    DRB_per36: numOpt(),

    AST: num(),
    AST_per_game: numOpt(),
    AST_per100: numOpt(),
    AST_per36: numOpt(),

    STL: num(),
    STL_per_game: numOpt(),
    STL_per100: numOpt(),
    STL_per36: numOpt(),

    BLK: num(),
    BLK_per_game: numOpt(),
    BLK_per100: numOpt(),
    BLK_per36: numOpt(),

    TOV: num(),
    TOV_per_game: numOpt(),
    TOV_per100: numOpt(),
    TOV_per36: numOpt(),

    Fouls: num(),
    Fouls_per_game: numOpt(),
    Fouls_per100: numOpt(),
    Fouls_per36: numOpt(),

    FT_allowed: num(),
    FT_allowed_per_game: numOpt(),
    FT_allowed_per100: numOpt(),
    FT_allowed_per36: numOpt(),

    // RAPM (你 CSV 已經有了，就直接吃)
    rapm_per100: numOpt(),
    orapm_per100: numOpt(),
    drapm_per100: numOpt(),

    // ratings / misc
    ORtg: numOpt(),
    DRtg: numOpt(),
    NetRtg: numOpt(),

    PM_total: num(),
    PM_per_game: numOpt(),
    PM_per100: numOpt(),

    PACE: numOpt(),

    eFG: numOpt(),
    TS: numOpt(),
    FG2_pct: numOpt(),
    FG3_pct: numOpt(),
    FT_pct: numOpt(),

    TOV_pct: numOpt(),
    AST_ratio: numOpt(),
    USG_pct: numOpt(),

    ORB_pct: numOpt(),
    DRB_pct: numOpt(),
    TRB_pct: numOpt(),

    STL_per100poss: numOpt(),
    BLK_per100poss: numOpt(),

    Foul_per_poss: numOpt(),
    FT_allowed_rate_per100: numOpt(),
    FT_rate: numOpt(),
  })
  .passthrough();

const LineupSchema = PlayerSchema.extend({
  lineup_size: num(),
  lineup_player_ids: z.string(),
  lineup_player_names: z.string(),

  PTS_allowed: num(),
  PTS_allowed_per_game: numOpt(),
  PTS_allowed_per100: numOpt(),
  PTS_allowed_per36: numOpt(),

  ORB_allowed: num(),
  ORB_allowed_per_game: numOpt(),
  ORB_allowed_per100: numOpt(),
  ORB_allowed_per36: numOpt(),

  DRB_allowed: num(),
  DRB_allowed_per_game: numOpt(),
  DRB_allowed_per100: numOpt(),
  DRB_allowed_per36: numOpt(),

  MIN_total: numOpt(),
  MIN_per_game: numOpt(),
}).passthrough();

// ---------------- RAPM csv (如果你還要讀獨立 rapm 檔) ----------------
const RapmSchema = z
  .object({
    player_id: z.string(),
    player_name: z.string(),
    rapm_per100: num(),
    orapm_per100: num(),
    drapm_per100: num(),
    on_court_poss: numOpt(),
    games_played: numOpt(),
    poss_per_game: numOpt(),
  })
  .passthrough();

export type Player = z.infer<typeof PlayerSchema>;
export type Lineup = z.infer<typeof LineupSchema>;
export type Rapm = z.infer<typeof RapmSchema>;

// ---------------- CSV Parser ----------------
export async function parseCSV<T>(filePath: string, schema: z.ZodSchema<T>): Promise<T[]> {
  const response = await fetch(filePath);
  if (!response.ok) throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);

  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          const validated = results.data.map((row: any, index) => {
            const parsed = schema.safeParse(row);
            if (!parsed.success) {
              console.warn(`Validation error at row ${index + 2}:`, parsed.error.issues);
              return row as T;
            }
            return { ...(row as Record<string, any>), ...parsed.data } as T;
          });

          console.log(`Loaded ${validated.length} rows from ${filePath}`);
          if (validated.length > 0) {
            console.log("Sample row keys:", Object.keys(validated[0] as Record<string, any>).slice(0, 15));
          }
          resolve(validated);
        } catch (e) {
          reject(e);
        }
      },
      error: (error: Error) => reject(error),
    });
  });
}

// ---------------- Loaders ----------------

export async function loadPlayersData(type: CompetitionType = "regular"): Promise<Player[]> {
  const fileMap: Record<CompetitionType, string> = {
    regular: "/data/players_TPBL_24-25_advanced.csv",
    playin: "/data/players_TPBL_24-25_play-in_advanced_with_rapm.csv",
    playoff: "/data/players_TPBL_24-25_playoffs_advanced_with_rapm.csv",
  };

  return parseCSV(fileMap[type], PlayerSchema);
}

export async function loadLineupsData(
  size?: 2 | 3 | 4 | 5,
  type: CompetitionType = "regular"
): Promise<Lineup[]> {
  const sizeStr = (size ?? 5).toString();

  const fileMap: Record<CompetitionType, string> = {
    regular: `/data/lineups_TPBL_24-25_size${sizeStr}.csv`,
    playin: `/data/lineups_TPBL_play-in_24-25_size${sizeStr}.csv`,
    playoff: `/data/lineups_TPBL_playoff_24-25_size${sizeStr}.csv`,
  };

  return parseCSV(fileMap[type], LineupSchema);
}

export function getUniqueTeams(data: (Player | Lineup)[]): string[] {
  const teams = new Set<string>();
  data.forEach((item) => {
    if (item.team_name) teams.add(item.team_name);
  });
  return Array.from(teams).sort();
}
