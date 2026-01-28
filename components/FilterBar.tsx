"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { DisplayUnit, DISPLAY_UNITS, NUMERIC_FIELDS, PLAYER_FIELDS } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageProvider";

export type FilterCondition = {
  field: string;
  operator: ">" | "<" | ">=" | "<=" | "=";
  value: number;
};

export type FilterState = {
  unit: DisplayUnit;
  teams: string[];
  conditions: FilterCondition[];
  minPossessions: number;
  minMinutes: number;
  minGames: number;
};

interface FilterBarProps {
  availableTeams: string[];
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ availableTeams, filterState, onFilterChange }: FilterBarProps) {
  const { language } = useLanguage();
  const [localState, setLocalState] = useState<FilterState>(filterState);

  const updateState = (updates: Partial<FilterState>) => {
    const newState = { ...localState, ...updates };
    setLocalState(newState);
    onFilterChange(newState);
  };

  const addCondition = () => {
    if (localState.conditions.length < 5) {
      updateState({
        conditions: [
          ...localState.conditions,
          { field: NUMERIC_FIELDS[0], operator: ">", value: 0 },
        ],
      });
    }
  };

  const removeCondition = (index: number) => {
    updateState({
      conditions: localState.conditions.filter((_, i) => i !== index),
    });
  };

  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    const newConditions = [...localState.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    updateState({ conditions: newConditions });
  };

  const toggleTeam = (team: string) => {
    const newTeams = localState.teams.includes(team)
      ? localState.teams.filter((t) => t !== team)
      : [...localState.teams, team];
    updateState({ teams: newTeams });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Unit Toggle */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">
          {language === "zh" ? "顯示單位:" : "Display Unit:"}
        </Label>
        <div className="flex gap-2">
          {DISPLAY_UNITS.map((unit) => (
            <Button
              key={unit.value}
              variant={localState.unit === unit.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateState({ unit: unit.value })}
              className="h-8"
            >
              {unit.label[language]}
            </Button>
          ))}
        </div>
      </div>

      {/* Team Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <Label className="text-sm font-medium">
          {language === "zh" ? "球隊:" : "Teams:"}
        </Label>
        <div className="flex gap-2 flex-wrap">
          {availableTeams.map((team) => (
            <div key={team} className="flex items-center space-x-2">
              <Checkbox
                id={`team-${team}`}
                checked={localState.teams.includes(team)}
                onCheckedChange={() => toggleTeam(team)}
              />
              <Label
                htmlFor={`team-${team}`}
                className="text-sm font-normal cursor-pointer"
              >
                {team}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Min Thresholds */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === "zh" ? "最少回合數" : "Min Possessions"}: {localState.minPossessions}
          </Label>
          <Slider
            value={[localState.minPossessions]}
            onValueChange={([value]) => updateState({ minPossessions: value })}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === "zh" ? "最少分鐘" : "Min Minutes"}: {localState.minMinutes}
          </Label>
          <Slider
            value={[localState.minMinutes]}
            onValueChange={([value]) => updateState({ minMinutes: value })}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === "zh" ? "最少場次" : "Min Games"}: {localState.minGames}
          </Label>
          <Slider
            value={[localState.minGames]}
            onValueChange={([value]) => updateState({ minGames: value })}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Custom Conditions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {language === "zh" ? "自訂條件 (最多5個):" : "Custom Filters (max 5):"}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addCondition}
            disabled={localState.conditions.length >= 5}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            {language === "zh" ? "新增條件" : "Add Filter"}
          </Button>
        </div>
        <div className="space-y-2">
          {localState.conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-2 flex-wrap">
              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(index, { field: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NUMERIC_FIELDS.map((field) => (
                    <SelectItem key={field} value={field}>
                      {(language === "zh"
                        ? PLAYER_FIELDS[field]?.zh
                        : PLAYER_FIELDS[field]?.en) || field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={condition.operator}
                onValueChange={(value) =>
                  updateCondition(index, { operator: value as FilterCondition["operator"] })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">{">"}</SelectItem>
                  <SelectItem value="<">{"<"}</SelectItem>
                  <SelectItem value=">=">{">="}</SelectItem>
                  <SelectItem value="<=">{"<="}</SelectItem>
                  <SelectItem value="=">{"="}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={condition.value}
                onChange={(e) =>
                  updateCondition(index, { value: parseFloat(e.target.value) || 0 })
                }
                className="w-[120px]"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

