"use client";

import { useEffect, useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { loadPlayersData, loadLineupsData, Player, Lineup } from "@/lib/data-service";
import { DisplayUnit, getDisplayValue, PLAYER_FIELDS, LINEUP_FIELDS, DISPLAY_UNITS } from "@/lib/constants";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

type CompareItem = Player | Lineup;

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

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [playersData, lineupsData] = await Promise.all([
          loadPlayersData(),
          loadLineupsData(5),
        ]);
        setPlayers(playersData);
        setLineups(lineupsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentData = activeTab === "players" ? players : lineups;
  const fieldMappings = activeTab === "players" ? PLAYER_FIELDS : LINEUP_FIELDS;
  const searchKey = activeTab === "players" ? "player_name" : "lineup_player_names";

  const selectedItemsData = useMemo(() => {
    return Array.from(selectedItems)
      .map((id) => {
        if (activeTab === "players") {
          return players.find((p) => p.player_id === id);
        } else {
          return lineups.find((l) => `${l.lineup_player_ids}` === id);
        }
      })
      .filter((item): item is CompareItem => item !== undefined);
  }, [selectedItems, activeTab, players, lineups]);

  const handleSelectionChange = (selected: Set<string>) => {
    // Limit to 5 items
    if (selected.size <= 5) {
      setSelectedItems(selected);
    }
  };

  const removeItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    newSelected.delete(id);
    setSelectedItems(newSelected);
    if (diffBase === id) setDiffBase(null);
    if (diffTarget === id) setDiffTarget(null);
  };

  // Prepare radar chart data
  const radarData = useMemo(() => {
    return COMPARE_FIELDS.map((field) => {
      const dataPoint: Record<string, any> = {
        field: fieldMappings[field]?.zh || field,
      };
      selectedItemsData.forEach((item, index) => {
        const value = getDisplayValue(item, field, unit);
        dataPoint[`item${index}`] = typeof value === "number" ? value : 0;
      });
      return dataPoint;
    });
  }, [selectedItemsData, unit, fieldMappings]);

  // Calculate diff
  const diffData = useMemo(() => {
    if (!diffBase || !diffTarget) return null;
    const baseItem = selectedItemsData.find(
      (item) =>
        (activeTab === "players"
          ? (item as Player).player_id
          : `${(item as Lineup).lineup_player_ids}`) === diffBase
    );
    const targetItem = selectedItemsData.find(
      (item) =>
        (activeTab === "players"
          ? (item as Player).player_id
          : `${(item as Lineup).lineup_player_ids}`) === diffTarget
    );

    if (!baseItem || !targetItem) return null;

    const diff: Record<string, number> = {};
    COMPARE_FIELDS.forEach((field) => {
      const baseValue = getDisplayValue(baseItem, field, unit);
      const targetValue = getDisplayValue(targetItem, field, unit);
      if (typeof baseValue === "number" && typeof targetValue === "number") {
        diff[field] = baseValue - targetValue;
      }
    });
    return diff;
  }, [diffBase, diffTarget, selectedItemsData, unit, activeTab]);

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

              {/* Selection Table */}
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-xl font-semibold mb-4">選擇項目 (最多5個)</h2>
                <DataTable
                  data={currentData}
                  columns={activeTab === "players" ? ["player_name", "team_name", "PTS", "AST", "ORtg", "DRtg"] : ["lineup_player_names", "team_name", "PTS", "PTS_allowed", "ORtg", "DRtg"]}
                  unit={unit}
                  searchKey={searchKey}
                  isSelectable
                  selectedRows={selectedItems}
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
                  <h2 className="text-xl font-semibold">已選擇項目</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedItemsData.map((item, index) => {
                      const id =
                        activeTab === "players"
                          ? (item as Player).player_id
                          : `${(item as Lineup).lineup_player_ids}`;
                      const name =
                        activeTab === "players"
                          ? (item as Player).player_name
                          : (item as Lineup).lineup_player_names;
                      return (
                        <div
                          key={id}
                          className="bg-white rounded-lg border p-4 relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeItem(id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <h3 className="font-semibold mb-2">{name}</h3>
                          <div className="space-y-1 text-sm">
                            {COMPARE_FIELDS.slice(0, 6).map((field) => {
                              const value = getDisplayValue(item, field, unit);
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
                      {selectedItemsData.map((item, index) => {
                        const name =
                          activeTab === "players"
                            ? (item as Player).player_name
                            : (item as Lineup).lineup_player_names;
                        return (
                          <Radar
                            key={index}
                            name={name}
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
                          {selectedItemsData.map((item) => {
                            const id =
                              activeTab === "players"
                                ? (item as Player).player_id
                                : `${(item as Lineup).lineup_player_ids}`;
                            const name =
                              activeTab === "players"
                                ? (item as Player).player_name
                                : (item as Lineup).lineup_player_names;
                            return (
                              <SelectItem key={id} value={id}>
                                {name}
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
                          {selectedItemsData.map((item) => {
                            const id =
                              activeTab === "players"
                                ? (item as Player).player_id
                                : `${(item as Lineup).lineup_player_ids}`;
                            const name =
                              activeTab === "players"
                                ? (item as Player).player_name
                                : (item as Lineup).lineup_player_names;
                            return (
                              <SelectItem key={id} value={id}>
                                {name}
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

