import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChartConfig = ({ columns, selectedAxes, onAxisChange, is3D = false }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="w-48">
        <label className="block text-sm font-medium mb-1 text-white">X Axis</label>
        <Select value={selectedAxes.x} onValueChange={(value) => onAxisChange('x', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select X Axis" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-48">
        <label className="block text-sm font-medium mb-1 text-white">Y Axis</label>
        <Select value={selectedAxes.y} onValueChange={(value) => onAxisChange('y', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Y Axis" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {is3D && (
        <div className="w-48">
          <label className="block text-sm font-medium mb-1 text-white">Z Axis</label>
          <Select value={selectedAxes.z} onValueChange={(value) => onAxisChange('z', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Z Axis" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(col => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ChartConfig;
