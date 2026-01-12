"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DisplayUnit, getDisplayValue, PLAYER_FIELDS, LINEUP_FIELDS, FieldMapping, getBaseFieldName, UNIT_INDEPENDENT_FIELDS, isPercentageField, formatAsPercentage } from "@/lib/constants";
import { DataDictionary } from "./DataDictionary";

interface DataTableProps<T> {
  data: T[];
  columns: string[];
  unit: DisplayUnit;
  searchKey?: string; // Field to search by (e.g., "player_name" or "lineup_player_names")
  onRowClick?: (row: T) => void;
  isSelectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  getRowId?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  unit,
  searchKey,
  onRowClick,
  isSelectable = false,
  selectedRows,
  onSelectionChange,
  getRowId,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dictionaryField, setDictionaryField] = useState<string | null>(null);
  
  const fieldMappings = columns.some((col) => col.includes("lineup"))
    ? LINEUP_FIELDS
    : PLAYER_FIELDS;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      const searchValue = row[searchKey];
      if (typeof searchValue === "string") {
        return searchValue.toLowerCase().includes(query);
      }
      return false;
    });
  }, [data, searchQuery, searchKey]);

  // Filter columns based on current unit
  const filteredColumns = useMemo(() => {
    // Define fields that should always be shown regardless of unit
    const alwaysShowFields = new Set([
      "player_name", "team_name", "lineup_player_names", 
      "player_id", "lineup_player_ids", "lineup_size",
      "min_played_str", "min_per_game_str",
      "games_used", "stint_count", "possessions",
      "rapm_per100", "orapm_per100", "drapm_per100",
    ]);
    
    return columns.filter((col) => {
      const baseField = getBaseFieldName(col);
      
      // Always show these fields regardless of unit (check first before unit filtering)
      if (alwaysShowFields.has(col) || alwaysShowFields.has(baseField)) {
        return true;
      }
      
      // For unit-independent fields, always show the base field (no suffix)
      if (UNIT_INDEPENDENT_FIELDS.has(baseField)) {
        return col === baseField;
      }
      
      // For fields with unit suffixes, only show if they match the current unit
      if (unit === "raw") {
        // Show only base fields (no suffix) for cumulative
        return !col.includes("_per_game") && !col.includes("_per36") && !col.includes("_per100") && !col.includes("_per100poss");
      } else if (unit === "per_game") {
        // Show only _per_game fields
        return col.endsWith("_per_game");
      } else if (unit === "per36") {
        // Show only _per36 fields
        return col.endsWith("_per36");
      } else if (unit === "per100") {
        // Show only _per100 fields
        return col.endsWith("_per100") || col.endsWith("_per100poss");
      }
      return true;
    });
  }, [columns, unit]);

  // Create table columns
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // Add rank column
    cols.push({
      id: "rank",
      header: "排名",
      cell: ({ row, table }) => {
        const sortedData = table.getSortedRowModel().rows;
        const index = sortedData.findIndex((r) => r.id === row.id);
        return (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + index + 1;
      },
      enableSorting: false,
      size: 60,
    });

    // Add main columns (using filtered columns)
    filteredColumns.forEach((col) => {
      const baseField = getBaseFieldName(col);
      const fieldMapping = fieldMappings[baseField] || fieldMappings[col];
      if (!fieldMapping) return;

      cols.push({
        id: col,
        accessorKey: col,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>{fieldMapping.zh}</span>
            <button
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className="ml-1 hover:opacity-70"
            >
              {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "⇅"}
            </button>
            <button
              onClick={() => setDictionaryField(col)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <Info className="h-3 w-3" />
            </button>
          </div>
        ),
        cell: ({ row }) => {
          // Use base field name for display value lookup
          const value = getDisplayValue(row.original, baseField, unit);
          if (value === null || value === undefined) return "-";
          if (typeof value === "number") {
            // Check if this field should be displayed as percentage
            if (isPercentageField(baseField)) {
              return <span className="tabular-nums">{formatAsPercentage(value)}</span>;
            }
            // For other numeric fields, show 2 decimal places
            return <span className="tabular-nums">{value.toFixed(2)}</span>;
          }
          return value;
        },
        size: 120,
      });
    });

    return cols;
  }, [filteredColumns, unit, fieldMappings]);
  const validSorting = useMemo(() => {
    const ids = new Set(
      tableColumns.map((c) => c.id).filter(Boolean) as string[]
    );
    return sorting.filter((s) => ids.has(s.id));
  }, [sorting, tableColumns]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting: validSorting,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    getRowId: getRowId || ((row, index) => index.toString()),
  });

  const handleRowClick = (row: T) => {
    if (isSelectable && onSelectionChange && getRowId) {
      const id = getRowId(row);
      const newSelected = new Set(selectedRows || []);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        if (newSelected.size < 5) {
          newSelected.add(id);
        }
      }
      onSelectionChange(newSelected);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKey && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="搜尋..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`${
                      index < 2 ? "sticky bg-white z-10 shadow-sm" : ""
                    } ${index === 0 ? "border-r left-0" : index === 1 ? "left-[60px]" : ""}`}
                    style={{
                      left: index === 0 ? 0 : index === 1 ? 60 : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  沒有資料
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isSelected =
                  isSelectable && getRowId && selectedRows?.has(getRowId(row.original));
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-accent/50" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          index < 2 ? "sticky bg-white z-10 shadow-sm" : ""
                        } ${index === 0 ? "border-r left-0" : index === 1 ? "left-[60px]" : ""} ${
                          isSelected ? "bg-accent/50" : ""
                        }`}
                        style={{
                          left: index === 0 ? 0 : index === 1 ? 60 : undefined,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          顯示 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length
          )}{" "}
          筆，共 {filteredData.length} 筆
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一頁
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一頁
          </Button>
        </div>
      </div>

      {/* Dictionary Modal */}
      {dictionaryField && (
        <DataDictionary
          field={dictionaryField}
          mapping={fieldMappings[dictionaryField]}
          open={!!dictionaryField}
          onOpenChange={(open) => !open && setDictionaryField(null)}
        />
      )}
    </div>
  );
}

