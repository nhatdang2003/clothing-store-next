"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function SizeGuideModal() {
    const [open, setOpen] = useState(false);

    const sizeGuide = [
        { size: "S", chest: "81–86", waist: "66–71", hips: "86–91" },
        { size: "M", chest: "89–94", waist: "74–79", hips: "94–99" },
        { size: "L", chest: "97–102", waist: "81–86", hips: "102–107" },
        { size: "XL", chest: "104–109", waist: "89–94", hips: "109–114" },
        { size: "XXL", chest: "112–117", waist: "97–102", hips: "117–122" },
        { size: "XXXL", chest: "119–124", waist: "104–109", hips: "124–130" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="text-primary hover:text-primary-dark underline cursor-pointer transition-colors">
                    Hướng dẫn
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold text-primary">
                        Hướng dẫn chọn kích thước
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2">
                        Sử dụng bảng dưới đây để chọn kích thước phù hợp với số đo cơ thể bạn.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-primary">
                        <div>Kích Thước</div>
                        <div>Ngực (cm)</div>
                        <div>Eo (cm)</div>
                        <div>Hông (cm)</div>
                    </div>
                    {sizeGuide.map((item, index) => (
                        <div
                            key={item.size}
                            className={`grid grid-cols-4 gap-4 text-sm p-2 rounded-md transition-colors ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                                } hover:bg-primary/10`}
                        >
                            <div className="font-medium">{item.size}</div>
                            <div>{item.chest}</div>
                            <div>{item.waist}</div>
                            <div>{item.hips}</div>
                        </div>
                    ))}
                </div>
                <DialogClose asChild>
                    <button
                        type="button"
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Đóng</span>
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
