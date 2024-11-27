"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import http from "@/services/http";

// Giả định rằng bạn có một mảng các sự kiện với URL hình ảnh
const events = [
  { id: 1, imageUrl: "/bg.webp" },
  { id: 2, imageUrl: "/bg.webp" },
  { id: 3, imageUrl: "/bg.webp" },
  { id: 4, imageUrl: "/bg.webp" },
];

export default function HomeCarousel({
  autoScrollInterval = 4000,
}: {
  autoScrollInterval?: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await http.get({ url: "/api/v1/products" });
      console.log(response);
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api || !autoScroll) return;

    const intervalId = setInterval(() => {
      if (api?.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoScrollInterval);

    return () => clearInterval(intervalId);
  }, [api, autoScroll, autoScrollInterval]);

  const scrollTo = (index: number) => api?.scrollTo(index);

  const toggleAutoScroll = () => setAutoScroll(!autoScroll);

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      setApi={setApi}
      className="w-full mx-auto relative"
    >
      <CarouselContent>
        {events.map((event, index) => (
          <CarouselItem key={event.id}>
            <Card className="border-none">
              <CardContent className="p-0 relative aspect-[2/0.8]">
                <Image
                  src={event.imageUrl}
                  alt={`Event ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/70 hover:bg-white/90"
          disabled={!api?.canScrollPrev()}
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/70 hover:bg-white/90"
          disabled={!api?.canScrollNext()}
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {events.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`w-3 h-3 rounded-full p-0 ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 rounded-full bg-white/70 hover:bg-white/90"
        onClick={toggleAutoScroll}
      >
        {autoScroll ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </Carousel>
  );
}
