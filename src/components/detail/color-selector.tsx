"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function ColorSelector({ colors }: { colors: string[] }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Select Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 relative ${
              selectedColor === color ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: color.toLowerCase() }}
            onClick={() => setSelectedColor(color)}
            aria-label={color}
          >
            {selectedColor === color && (
              <Check
                className="absolute inset-0 m-auto text-white stroke-2"
                size={16}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
