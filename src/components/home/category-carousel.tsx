"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategoryListQuery } from "@/hooks/use-category-query";
import Image from "next/image";

export default function CategoryCarousel() {
  const [api, setApi] = React.useState<any>();
  const { data: categories, isLoading, error } = useCategoryListQuery();

  React.useEffect(() => {
    console.log(categories);
  }, [categories]);

  React.useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      if (api?.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
      className="container max-w-6xl mx-auto px-4 py-8 relative"
    >
      <CarouselContent>
        {categories?.map((category: any, index: number) => {
          return (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <Card className="aspect-[4/5]">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/70 hover:bg-white/90 z-10"
        onClick={() => api?.scrollPrev()}
        disabled={!api?.canScrollPrev()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-10 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/70 hover:bg-white/90 z-10"
        onClick={() => api?.scrollNext()}
        disabled={!api?.canScrollNext()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Carousel>
  );
}
