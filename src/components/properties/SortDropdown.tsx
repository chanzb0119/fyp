"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  value: string;
  onSortChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort:</span>
      <Select value={value} onValueChange={onSortChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="recent">Recent</SelectItem>
          <SelectItem value="price_asc">Lowest Price</SelectItem>
          <SelectItem value="price_desc">Highest Price</SelectItem>
          <SelectItem value="size_desc">Built-up Area (large to small)</SelectItem>
          <SelectItem value="size_asc">Built-up Area (small to large)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortDropdown;