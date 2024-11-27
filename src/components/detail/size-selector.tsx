"use client";

import { useState } from "react";

export default function SizeSelector({ sizes }: { sizes: string[] }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Select Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`px-4 py-2 border rounded-md ${
              selectedSize === size
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
