"use client";

import { useEffect, useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { loadLineupsData, getUniqueTeams, Lineup, CompetitionType, Season, AVAILABLE_SEASONS, DEFAULT_SEASON } from "@/lib/data-service";
import { DisplayUnit, getFieldKey, LINEUP_FIELDS, UNIT_INDEPENDENT_FIELDS } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageProvider";

// Get all available columns from the first data row
function getAllColumns(data: Lineup[]): string[] {
  if (data.length === 0) return [];
  const firstRow = data[0];
  // Exclude internal/display-only fields that shouldn't be shown
  const excludeFields = new Set(['lineup_player_ids', 'sec_played', 'min_played', 'sec_per_game', 'min_per_game', 'MIN_total', 'MIN_per_game']);
  return Object.keys(firstRow).filter(key => !excludeFields.has(key));
}

const DEFAULT_COLUMNS = [
  "lineup_size",
  "team_name",
  "lineup_player_names",
  "games_used",
  "stint_count",
  "possessions",
  "min_played_str",
  "min_per_game_str",
  "PTS",
  "PTS_per_game",
  "PTS_per100",
  "PTS_per36",
  "PTS_allowed",
  "PTS_allowed_per_game",
  "PTS_allowed_per100",
  "PTS_allowed_per36",
  "FGA",
  "FGA_per_game",
  "FGA_per100",
  "FGA_per36",
  "FGM",
  "FGM_per_game",
  "FGM_per100",
  "FGM_per36",
  "2PA",
  "2PA_per_game",
  "2PA_per100",
  "2PA_per36",
  "2PM",
  "2PM_per_game",
  "2PM_per100",
  "2PM_per36",
  "3PA",
  "3PA_per_game",
  "3PA_per100",
  "3PA_per36",
  "3PM",
  "3PM_per_game",
  "3PM_per100",
  "3PM_per36",
  "FTA",
  "FTA_per_game",
  "FTA_per100",
  "FTA_per36",
  "FTM",
  "FTM_per_game",
  "FTM_per100",
  "FTM_per36",
  "ORB",
  "ORB_per_game",
  "ORB_per100",
  "ORB_per36",
  "DRB",
  "DRB_per_game",
  "DRB_per100",
  "DRB_per36",
  "ORB_allowed",
  "ORB_allowed_per_game",
  "ORB_allowed_per100",
  "ORB_allowed_per36",
  "DRB_allowed",
  "DRB_allowed_per_game",
  "DRB_allowed_per100",
  "DRB_allowed_per36",
  "AST",
  "AST_per_game",
  "AST_per100",
  "AST_per36",
  "STL",
  "STL_per_game",
  "STL_per100",
  "STL_per36",
  "BLK",
  "BLK_per_game",
  "BLK_per100",
  "BLK_per36",
  "TOV",
  "TOV_per_game",
  "TOV_per100",
  "TOV_per36",
  "Fouls",
  "Fouls_per_game",
  "Fouls_per100",
  "Fouls_per36",
  "FT_allowed",
  "FT_allowed_per_game",
  "FT_allowed_per100",
  "FT_allowed_per36",
  "ORtg",
  "DRtg",
  "NetRtg",
  "PACE",
  "PM_total",
  "PM_per_game",
  "PM_per100",
  "eFG",
  "TS",
  "FG2_pct",
  "FG3_pct",
  "FT_pct",
  "TOV_pct",
  "AST_ratio",
  "ORB_pct",
  "DRB_pct",
  "TRB_pct",
  "STL_pct",
  "BLK_pct",
  "Foul_per_poss",
  "FT_allowed_rate_per100",
  "FT_rate",
];

export default function LineupsPage() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [data, setData] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);
  const [lineupSize, setLineupSize] = useState<2 | 3 | 4 | 5>(5);
  const [competition, setCompetition] = useState<CompetitionType>("regular");
  const [season, setSeason] = useState<Season>(DEFAULT_SEASON);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    unit: "per_game",
    teams: [],
    conditions: [],
    minPossessions: 0,
    minMinutes: 0,
    minGames: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const lineups = await loadLineupsData(lineupSize, competition, season);
        console.log(`Loaded lineups (size ${lineupSize}):`, lineups.length);
        if (lineups.length > 0) {
          console.log("First lineup keys:", Object.keys(lineups[0]));
        }
        setData(lineups);
      } catch (error) {
        console.error("Failed to load lineups data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lineupSize, competition, season]);

  const availableTeams = useMemo(() => getUniqueTeams(data), [data]);
  const allColumns = useMemo(() => getAllColumns(data), [data]);

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Team filter
    if (filterState.teams.length > 0) {
      filtered = filtered.filter((lineup) =>
        filterState.teams.includes(lineup.team_name)
      );
    }

    // Min thresholds
    filtered = filtered.filter((lineup) => {
      if (lineup.possessions < filterState.minPossessions) return false;
      if (lineup.min_played < filterState.minMinutes) return false;
      if (lineup.games_used < filterState.minGames) return false;
      return true;
    });

    // Custom conditions
    filterState.conditions.forEach((condition) => {
      // For unit-independent fields, always use the base field
      const fieldKey = UNIT_INDEPENDENT_FIELDS.has(condition.field)
        ? condition.field
        : getFieldKey(condition.field, filterState.unit);
      filtered = filtered.filter((lineup) => {
        const value = lineup[fieldKey] ?? lineup[condition.field];
        if (typeof value !== "number") return true;

        switch (condition.operator) {
          case ">":
            return value > condition.value;
          case "<":
            return value < condition.value;
          case ">=":
            return value >= condition.value;
          case "<=":
            return value <= condition.value;
          case "=":
            return Math.abs(value - condition.value) < 0.01;
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [data, filterState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">{isZh ? "載入中..." : "Loading..."}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {isZh ? "陣容數據" : "Lineup Stats"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{isZh ? "賽季:" : "Season:"}</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                {AVAILABLE_SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value as CompetitionType)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="regular">{isZh ? "例行賽" : "Regular Season"}</option>
              <option value="playin">Play-in</option>
              <option value="playoff">Playoff</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {isZh ? "陣容大小:" : "Lineup Size:"}
              </label>
              <div className="flex gap-2">
                {([2, 3, 4, 5] as const).map((size) => (
                  <Button
                    key={size}
                    variant={lineupSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLineupSize(size)}
                    className="h-8"
                  >
                    {isZh ? `${size}人` : `${size}`}
                  </Button>
                ))}
              </div>
            </div>
            <Sheet open={showColumnSelector} onOpenChange={setShowColumnSelector}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  {isZh ? "選擇欄位" : "Columns"} ({selectedColumns.length})
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{isZh ? "選擇顯示欄位" : "Select Columns"}</SheetTitle>
                  <SheetDescription>
                    {isZh
                      ? `選擇要在表格中顯示的欄位。已選擇 ${selectedColumns.length} 個欄位。`
                      : `Select columns to display. ${selectedColumns.length} selected.`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedColumns(allColumns)}
                    >
                      {isZh ? "全選" : "Select All"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedColumns(DEFAULT_COLUMNS)}
                    >
                      {isZh ? "預設" : "Default"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedColumns([])}
                    >
                      {isZh ? "清除" : "Clear"}
                    </Button>
                  </div>
                  {allColumns.map((col) => (
                    <div key={col} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col}`}
                        checked={selectedColumns.includes(col)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns([...selectedColumns, col]);
                          } else {
                            setSelectedColumns(selectedColumns.filter((c) => c !== col));
                          }
                        }}
                      />
                      <label
                        htmlFor={`col-${col}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {isZh
                          ? LINEUP_FIELDS[col]?.zh || col
                          : LINEUP_FIELDS[col]?.en || col}
                      </label>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <FilterBar
          availableTeams={availableTeams}
          filterState={filterState}
          onFilterChange={setFilterState}
        />
        <div className="mt-4">
          <DataTable
            data={filteredData}
            columns={selectedColumns.length > 0 ? selectedColumns : DEFAULT_COLUMNS}
            unit={filterState.unit}
            searchKey="lineup_player_names"
            getRowId={(row) => `${row.lineup_player_ids}-${row.team_name}`}
          />
        </div>
      </div>
    </div>
  );
}

