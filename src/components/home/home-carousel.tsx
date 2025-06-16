"use client";

import React, { useState, useEffect, useMemo } from "react";
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
// import { CAROUSEL } from "@/constants/image";
import Link from "next/link";
import { useGetImagePromotionQuery } from "@/hooks/use-promotion-query";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";

const CAROUSEL = [
    {
        "id": -1,
        "name": "Chào mừng bạn đến với cửa hàng",
        "description": "Khám phá bộ sưu tập mới nhất của chúng tôi",
        "discountRate": 0,
        "startDate": "",
        "endDate": "",
        "imageUrl": "/carousel-1.jpg"
    },
    {
        "id": -2,
        "name": " Khám phá bộ sưu tập mới nhất",
        "description": "Cập nhật xu hướng thời trang hiện đại với những thiết kế nổi bật chỉ có tại Ez Store",
        "discountRate": 0,
        "startDate": "",
        "endDate": "",
        "imageUrl": "/carousel-2.jpg"
    },
    {
        "id": -3,
        "name": "Mua sắm dễ dàng, quản lý thông minh",
        "description": "Trải nghiệm hệ thống quản lý đơn hàng và tồn kho tiện lợi dành riêng cho bạn",
        "discountRate": 0,
        "startDate": "",
        "endDate": "",
        "imageUrl": "/carousel-3.jpg"
    },
    {
        "id": -4,
        "name": "Chất lượng tạo nên thương hiệu",
        "description": "Ez Store cam kết mang đến sản phẩm chính hãng, dịch vụ hỗ trợ tận tâm và giao hàng nhanh chóng",
        "discountRate": 0,
        "startDate": "",
        "endDate": "",
        "imageUrl": "/carousel-4.jpg"
    },
]

export default function HomeCarousel({
    autoScrollInterval = 4000,
}: {
    autoScrollInterval?: number;
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const { data: images } = useGetImagePromotionQuery();

    const carousel = useMemo(() => {
        if (!images) return CAROUSEL;
        if (images?.length > 4) {
            return images;
        } else {
            return [...images, ...CAROUSEL.slice(0, 4 - images.length)];
        }
    }, [images, CAROUSEL]);

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
                {carousel.map((event: any, index: number) => (
                    <CarouselItem key={event.id}>
                        <Card className="border-none">
                            <CardContent className="p-0 relative aspect-[0.8/1] md:aspect-[2/0.8]">
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
            <div className="absolute inset-0 z-10 bg-black/30 flex flex-col items-center justify-center text-white pointer-events-none">
                <h2 className="text-3xl font-bold mb-4 text-center flex items-center gap-2">
                    {carousel[current].name}
                    {carousel[current].discountRate > 0 && (
                        <Badge variant="destructive" className="text-white font-bold text-2xl">
                            {-carousel[current].discountRate}%
                        </Badge>
                    )}
                </h2>
                <p className="text-xl mb-6 text-center">
                    {carousel[current].description}
                </p>
                {carousel[current].discountRate > 0 && (
                    <p className="mb-8 text-center italic">
                        {formatDate(carousel[current].startDate, "dd/MM/yyyy")} - {formatDate(carousel[current].endDate, "dd/MM/yyyy")}
                    </p>
                )}
                <Link href="/shop">
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 pointer-events-auto"
                    >
                        Mua ngay
                    </Button>
                </Link>
            </div>
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
                    {carousel.map((_: any, index: number) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="icon"
                            className={`w-3 h-3 rounded-full p-0 ${index === current ? "bg-white" : "bg-white/50"
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
