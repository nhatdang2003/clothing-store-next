"use client";

import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Category } from "@/types/category";
import { formatPrice } from "@/lib/utils";

export function FilterSidebar({ categories }: { categories: Category[] }) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const ratings = [5, 4, 3, 2, 1];

  useEffect(() => {
    console.log(priceRange);
  }, [priceRange]);

  useEffect(() => {
    console.log(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    console.log(selectedRatings);
  }, [selectedRatings]);

  return (
    <div className="w-full md:w-64 space-y-6">
      <div className="md:hidden">
        <button
          className="w-full bg-gray-200 p-2 rounded-md text-left"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          Filters
        </button>
      </div>
      <div
        className={`${
          isMobileFilterOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:max-h-screen md:opacity-100 overflow-hidden transition-all duration-300 ease-in-out md:block space-y-6`}
      >
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories(
                      checked
                        ? [...selectedCategories, category.id]
                        : selectedCategories.filter((c) => c !== category.id)
                    );
                  }}
                />
                <Label htmlFor={category.id.toString()} className="ml-2">
                  {category.name}
                </Label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8"
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            step={10}
            aria-label="Price Range"
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-[8px] mx-1">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-100  cursor-pointer"
              aria-label="Minimum price"
            />
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Maximum price"
            />
          </Slider.Root>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{formatPrice(priceRange[0] * 1000)}</span>
            <span>{formatPrice(priceRange[1] * 1000)}</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Ratings</h3>
          <ul className="space-y-2">
            {ratings.map((rating) => (
              <li key={rating} className="flex items-center">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={(checked) => {
                    setSelectedRatings(
                      checked
                        ? [...selectedRatings, rating]
                        : selectedRatings.filter((r) => r !== rating)
                    );
                  }}
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="ml-2 flex items-center gap-1"
                >
                  {rating}{" "}
                  <Star
                    className="h-4 sm:h-5 w-4 sm:w-5 fill-yellow-400"
                    color="yellow-400"
                  />
                </Label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
