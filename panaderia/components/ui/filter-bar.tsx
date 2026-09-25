"use client";

import { useEffect, useEffectEvent, useState, type ReactNode } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { controlClassName } from "@/components/ui/form-field";
import { useQueryParams } from "@/components/ui/use-query-params";

const SEARCH_DEBOUNCE_MS = 350;

export type FilterOption = { value: string; label: string };

export type SelectFilter = {
  param: string;
  label: string;
  allLabel: string;
  options: FilterOption[];
};

type FilterBarProps = {
  searchParam?: string;
  searchLabel: string;
  searchPlaceholder: string;
  selectFilters?: SelectFilter[];
  children?: ReactNode;
};

export function FilterBar({ searchParam = "q", searchLabel, searchPlaceholder, selectFilters = [], children }: FilterBarProps) {
  const { getParam, setParam, isPending } = useQueryParams();
  const currentSearch = getParam(searchParam);
  const [searchText, setSearchText] = useState(currentSearch);

  const applySearch = useEffectEvent(() => {
    const normalizedSearch = searchText.trim();
    if (normalizedSearch !== currentSearch) setParam(searchParam, normalizedSearch);
  });

  useEffect(() => {
    const timeout = setTimeout(applySearch, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <div role="search" className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4 lg:flex-row lg:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor={`filter-${searchParam}`} className="text-xs font-bold uppercase tracking-wide text-text-muted">
          {searchLabel}
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-text-muted" />
          <input
            id={`filter-${searchParam}`}
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={searchPlaceholder}
            className={`${controlClassName} pl-9`}
          />
          {isPending && (
            <LoaderCircle aria-label="Buscando" className="absolute inset-y-0 right-3 my-auto size-4 animate-spin text-secondary" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-end">
        {selectFilters.map((filter) => (
          <div key={filter.param} className="flex flex-col gap-1.5 lg:w-48">
            <label htmlFor={`filter-${filter.param}`} className="text-xs font-bold uppercase tracking-wide text-text-muted">
              {filter.label}
            </label>
            <select
              id={`filter-${filter.param}`}
              value={getParam(filter.param)}
              onChange={(event) => setParam(filter.param, event.target.value)}
              className={controlClassName}
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
