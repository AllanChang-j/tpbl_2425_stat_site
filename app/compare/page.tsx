"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { loadPlayersData, loadLineupsData, Player, Lineup, CompetitionType, Season, AVAILABLE_SEASONS, DEFAULT_SEASON } from "@/lib/data-service";
import { DisplayUnit, getDisplayValue, PLAYER_FIELDS, LINEUP_FIELDS, DISPLAY_UNITS } from "@/lib/constants";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

type CompareItem = Player | Lineup;

// Helper to create composite ID for selected items
function createItemId(item: CompareItem, season: Season, competition: CompetitionType, activeTab: "players" | "lineups"): string {
  const baseId = activeTab === "players" 
    ? String((item as Player).player_id)
    : `${(item as Lineup).lineup_player_ids}`;
  return `${season}_${competition}_${baseId}`;
}

// Helper to parse composite ID
// Format: "{season}_{competition}_{baseId}"
// Example: "24-25_regular_12345" or "24-25_playin_67890"
function parseItemId(id: string): { season: Season; competition: CompetitionType; baseId: string } {
  // Find the last two underscores to separate season, competition, and baseId
  const lastUnderscore = id.lastIndexOf("_");
  const secondLastUnderscore = id.lastIndexOf("_", lastUnderscore - 1);
  
  if (secondLastUnderscore >= 0 && lastUnderscore > secondLastUnderscore) {
    const season = id.substring(0, secondLastUnderscore) as Season;
    const competition = id.substring(secondLastUnderscore + 1, lastUnderscore) as CompetitionType;
    const baseId = id.substring(lastUnderscore + 1);
    return { season, competition, baseId };
  }
  
  // Fallback for old format (backward compatibility)
  return { season: DEFAULT_SEASON, competition: "regular", baseId: id };
}

// Store for selected items with metadata
type SelectedItemMetadata = {
  item: CompareItem;
  season: Season;
  competition: CompetitionType;
  id: string;
};

const COMPARE_FIELDS = [
  "PTS",
  "FGA",
  "FGM",
  "FG2_pct",
  "FG3_pct",
  "FT_pct",
  "AST",
  "ORB",
  "DRB",
  "STL",
  "BLK",
  "TOV",
  "ORtg",
  "DRtg",
  "NetRtg",
];

export default function ComparePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"players" | "lineups">("players");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [unit, setUnit] = useState<DisplayUnit>("per_game");
  const [diffBase, setDiffBase] = useState<string | null>(null);
  const [diffTarget, setDiffTarget] = useState<string | null>(null);
  
  // Data source selection (for the selection table)
  const [dataSeason, setDataSeason] = useState<Season>(DEFAULT_SEASON);
  const [dataCompetition, setDataCompetition] = useState<CompetitionType>("regular");
  const [lineupSize, setLineupSize] = useState<2 | 3 | 4 | 5>(5);
  
  // Store all loaded data by season and competition for cross-season comparison
  // Use ref to avoid dependency issues in useEffect
  const dataCacheRef = useRef<Map<string, { players: Player[]; lineups: Lineup[] }>>(new Map());
  const [dataCache, setDataCache] = useState<Map<string, { players: Player[]; lineups: Lineup[] }>>(new Map());

  // Load data for the current selection
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const cacheKey = `${dataSeason}_${dataCompetition}`;
        
        // Check cache first (using ref to avoid dependency)
        const cached = dataCacheRef.current.get(cacheKey);
        if (cached) {
          setPlayers(cached.players);
          setLineups(cached.lineups);
          setLoading(false);
          return;
        }
        
        // If not cached, fetch data
        const [playersData, lineupsData] = await Promise.all([
          loadPlayersData(dataCompetition, dataSeason),
          loadLineupsData(activeTab === "lineups" ? lineupSize : 5, dataCompetition, dataSeason),
        ]);
        setPlayers(playersData);
        setLineups(lineupsData);
        
        // Update cache (both ref and state)
        const newCacheEntry = { players: playersData, lineups: lineupsData };
        dataCacheRef.current.set(cacheKey, newCacheEntry);
        setDataCache(new Map(dataCacheRef.current));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dataSeason, dataCompetition, activeTab, lineupSize]);

  const currentData = activeTab === "players" ? players : lineups;
  const fieldMappings = activeTab === "players" ? PLAYER_FIELDS : LINEUP_FIELDS;
  const searchKey = activeTab === "players" ? "player_name" : "lineup_player_names";

  // Get selected items with metadata from cache
  const selectedItemsData = useMemo(() => {
    const items: SelectedItemMetadata[] = [];
    
    selectedItems.forEach((compositeId) => {
      const { season, competition, baseId } = parseItemId(compositeId);
      const cacheKey = `${season}_${competition}`;
      const cached = dataCacheRef.current.get(cacheKey);
      
      if (!cached) return;
      
      let item: CompareItem | undefined;
      if (activeTab === "players") {
        item = cached.players.find((p) => String(p.player_id) === baseId);
      } else {
        item = cached.lineups.find((l) => `${l.lineup_player_ids}` === baseId);
      }
      
      if (item) {
        items.push({ item, season, competition, id: compositeId });
      }
    });
    
    return items;
  }, [selectedItems, activeTab, dataCache]); // Keep dataCache in deps to trigger recalculation when cache updates

  const handleSelectionChange = (selected: Set<string>) => {
    // Convert base IDs to composite IDs for current data source
    const newSelected = new Set<string>();
    selected.forEach((baseId) => {
      const item = (activeTab === "players" 
        ? players.find((p) => String(p.player_id) === baseId)
        : lineups.find((l) => `${l.lineup_player_ids}` === baseId)) as CompareItem | undefined;
      if (item) {
        const compositeId = createItemId(item, dataSeason, dataCompetition, activeTab);
        newSelected.add(compositeId);
      }
    });
    
    // Merge with existing selections (preserve selections from other sources)
    // Remove old selections from current data source first
    const currentSourcePrefix = `${dataSeason}_${dataCompetition}_`;
    const filtered = new Set(
      Array.from(selectedItems).filter((id) => !id.startsWith(currentSourcePrefix))
    );
    
    // Add new selections
    const merged = new Set([...filtered, ...newSelected]);
    
    // Limit to 5 items total
    if (merged.size <= 5) {
      setSelectedItems(merged);
    }
  };

  const removeItem = (compositeId: string) => {
    const newSelected = new Set(selectedItems);
    newSelected.delete(compositeId);
    setSelectedItems(newSelected);
    if (diffBase === compositeId) setDiffBase(null);
    if (diffTarget === compositeId) setDiffTarget(null);
  };
  
  // Get base IDs for current data source (for DataTable selection)
  const currentDataBaseIds = useMemo(() => {
    return new Set(
      selectedItemsData
        .filter((meta) => meta.season === dataSeason && meta.competition === dataCompetition)
        .map((meta) => {
          if (activeTab === "players") {
            return String((meta.item as Player).player_id);
          } else {
            return `${(meta.item as Lineup).lineup_player_ids}`;
          }
        })
    );
  }, [selectedItemsData, dataSeason, dataCompetition, activeTab]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    return COMPARE_FIELDS.map((field) => {
      const dataPoint: Record<string, any> = {
        field: fieldMappings[field]?.zh || field,
      };
      selectedItemsData.forEach((meta, index) => {
        const value = getDisplayValue(meta.item, field, unit);
        dataPoint[`item${index}`] = typeof value === "number" ? value : 0;
      });
      return dataPoint;
    });
  }, [selectedItemsData, unit, fieldMappings]);

  // Calculate diff
  const diffData = useMemo(() => {
    if (!diffBase || !diffTarget) return null;
    const baseMeta = selectedItemsData.find((meta) => meta.id === diffBase);
    const targetMeta = selectedItemsData.find((meta) => meta.id === diffTarget);

    if (!baseMeta || !targetMeta) return null;

    const diff: Record<string, number> = {};
    COMPARE_FIELDS.forEach((field) => {
      const baseValue = getDisplayValue(baseMeta.item, field, unit);
      const targetValue = getDisplayValue(targetMeta.item, field, unit);
      if (typeof baseValue === "number" && typeof targetValue === "number") {
        diff[field] = baseValue - targetValue;
      }
    });
    return diff;
  }, [diffBase, diffTarget, selectedItemsData, unit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">比較模式</h1>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "players" | "lineups")}>
          <TabsList>
            <TabsTrigger value="players">球員</TabsTrigger>
            <TabsTrigger value="lineups">陣容</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-6">
              {/* Unit Selector */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">顯示單位:</label>
                  <Select value={unit} onValueChange={(v) => setUnit(v as DisplayUnit)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISPLAY_UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label.zh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Data Source Selectors */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">數據來源 - 賽季:</label>
                  <select
                    value={dataSeason}
                    onChange={(e) => setDataSeason(e.target.value as Season)}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                  >
                    {AVAILABLE_SEASONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">比賽類型:</label>
                  <select
                    value={dataCompetition}
                    onChange={(e) => setDataCompetition(e.target.value as CompetitionType)}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                  >
                    <option value="regular">例行賽</option>
                    <option value="playin">Play-in</option>
                    <option value="playoff">Playoff</option>
                  </select>
                </div>
                
                {activeTab === "lineups" && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">陣容大小:</label>
                    <div className="flex gap-2">
                      {([2, 3, 4, 5] as const).map((size) => (
                        <Button
                          key={size}
                          variant={lineupSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setLineupSize(size)}
                          className="h-8"
                        >
                          {size}人
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Table */}
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-xl font-semibold mb-4">選擇項目 (最多5個，可跨賽季比較)</h2>
                <DataTable
                  data={currentData}
                  columns={activeTab === "players" ? ["player_name", "team_name", "PTS", "AST", "ORtg", "DRtg"] : ["lineup_player_names", "team_name", "PTS", "PTS_allowed", "ORtg", "DRtg"]}
                  unit={unit}
                  searchKey={searchKey}
                  isSelectable
                  selectedRows={currentDataBaseIds}
                  onSelectionChange={handleSelectionChange}
                  getRowId={(row) =>
                    activeTab === "players"
                      ? String((row as Player).player_id)
                      : `${(row as Lineup).lineup_player_ids}`
                  }
                />
              </div>

              {/* Selected Items Cards */}
              {selectedItemsData.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">已選擇項目 ({selectedItemsData.length}/5)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedItemsData.map((meta, index) => {
                      const name =
                        activeTab === "players"
                          ? (meta.item as Player).player_name
                          : (meta.item as Lineup).lineup_player_names;
                      const competitionLabel = meta.competition === "regular" ? "例行賽" : meta.competition === "playin" ? "Play-in" : "Playoff";
                      return (
                        <div
                          key={meta.id}
                          className="bg-white rounded-lg border p-4 relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeItem(meta.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="mb-2">
                            <h3 className="font-semibold">{name}</h3>
                            <div className="text-xs text-gray-500 mt-1">
                              {meta.season} · {competitionLabel}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            {COMPARE_FIELDS.slice(0, 6).map((field) => {
                              const value = getDisplayValue(meta.item, field, unit);
                              return (
                                <div key={field} className="flex justify-between">
                                  <span className="text-gray-600">
                                    {fieldMappings[field]?.zh}:
                                  </span>
                                  <span className="tabular-nums font-medium">
                                    {typeof value === "number"
                                      ? value.toFixed(2)
                                      : value || "-"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Radar Chart */}
              {selectedItemsData.length > 0 && (
                <div className="bg-white rounded-lg border p-4">
                  <h2 className="text-xl font-semibold mb-4">雷達圖比較</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="field" />
                      <PolarRadiusAxis />
                      {selectedItemsData.map((meta, index) => {
                        const name =
                          activeTab === "players"
                            ? (meta.item as Player).player_name
                            : (meta.item as Lineup).lineup_player_names;
                        const competitionLabel = meta.competition === "regular" ? "例行賽" : meta.competition === "playin" ? "Play-in" : "Playoff";
                        const label = `${name} (${meta.season} ${competitionLabel})`;
                        return (
                          <Radar
                            key={meta.id}
                            name={label}
                            dataKey={`item${index}`}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            fill={`hsl(${index * 60}, 70%, 50%)`}
                            fillOpacity={0.6}
                          />
                        );
                      })}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Diff Mode */}
              {selectedItemsData.length >= 2 && (
                <div className="bg-white rounded-lg border p-4">
                  <h2 className="text-xl font-semibold mb-4">差異模式 (A - B)</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">基準 (A)</label>
                      <Select value={diffBase || ""} onValueChange={setDiffBase}>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇基準項目" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedItemsData.map((meta) => {
                            const name =
                              activeTab === "players"
                                ? (meta.item as Player).player_name
                                : (meta.item as Lineup).lineup_player_names;
                            const competitionLabel = meta.competition === "regular" ? "例行賽" : meta.competition === "playin" ? "Play-in" : "Playoff";
                            const label = `${name} (${meta.season} ${competitionLabel})`;
                            return (
                              <SelectItem key={meta.id} value={meta.id}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">目標 (B)</label>
                      <Select value={diffTarget || ""} onValueChange={setDiffTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇目標項目" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedItemsData.map((meta) => {
                            const name =
                              activeTab === "players"
                                ? (meta.item as Player).player_name
                                : (meta.item as Lineup).lineup_player_names;
                            const competitionLabel = meta.competition === "regular" ? "例行賽" : meta.competition === "playin" ? "Play-in" : "Playoff";
                            const label = `${name} (${meta.season} ${competitionLabel})`;
                            return (
                              <SelectItem key={meta.id} value={meta.id}>
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {diffData && (
                    <div className="space-y-2">
                      {Object.entries(diffData).map(([field, value]) => {
                        const isPositive = value > 0;
                        const isGood = ["PTS", "FGM", "AST", "ORB", "DRB", "STL", "BLK", "ORtg", "NetRtg", "FG2_pct", "FG3_pct", "FT_pct"].includes(field);
                        const color = isGood
                          ? (isPositive ? "text-green-600" : "text-red-600")
                          : (isPositive ? "text-red-600" : "text-green-600");
                        return (
                          <div key={field} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">{fieldMappings[field]?.zh}</span>
                            <span className={`tabular-nums font-medium ${color}`}>
                              {isPositive ? "+" : ""}{value.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

