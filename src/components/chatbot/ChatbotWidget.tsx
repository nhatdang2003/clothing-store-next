"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Tạo ref cho container tin nhắn
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    // Hàm cuộn xuống cuối cùng
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    // Cuộn xuống khi có tin nhắn mới hoặc khi đang loading
    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    // Cuộn xuống khi mở chat và prevent body scroll chỉ trên mobile (nhưng không trên iOS)
    useEffect(() => {
        if (isOpen) {
            setTimeout(scrollToBottom, 100)

            // Chỉ prevent body scroll trên mobile Android (< 640px và không phải iOS)
            const isMobile = window.innerWidth < 640
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

            if (isMobile && !isIOS) {
                // Save original styles
                const originalOverflow = document.body.style.overflow
                const originalPosition = document.body.style.position
                const originalWidth = document.body.style.width

                // Apply mobile scroll lock (nhẹ hơn cho Android)
                document.body.style.overflow = 'hidden'
                document.body.style.position = 'fixed'
                document.body.style.width = '100%'

                // Cleanup function
                return () => {
                    document.body.style.overflow = originalOverflow
                    document.body.style.position = originalPosition
                    document.body.style.width = originalWidth
                }
            }
            // iOS và Desktop: không làm gì với body scroll
        } else {
            // Chỉ restore nếu là mobile Android
            const isMobile = window.innerWidth < 640
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            if (isMobile && !isIOS) {
                document.body.style.overflow = ''
                document.body.style.position = ''
                document.body.style.width = ''
            }
        }
    }, [isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const generateMessageId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: generateMessageId(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        }

        // Thêm tin nhắn của user
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai-agent', {
                method: 'POST',
                body: JSON.stringify({ query: userMessage.content })
            })
            const data = await response.json()

            setMessages(prev => [...prev, {
                id: generateMessageId(),
                role: "assistant",
                content: data.answer,
                timestamp: new Date()
            }])
        } catch (error) {
            console.error("Error sending message:", error)

            const errorMessage: Message = {
                id: generateMessageId(),
                role: "assistant",
                content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                timestamp: new Date()
            }

            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {/* Chat Window - Responsive positioning */}
            {isOpen && (
                <div
                    className="fixed inset-4 sm:absolute sm:bottom-20 sm:right-0 sm:inset-auto animate-in slide-in-from-bottom-2 duration-300"
                    style={{
                        WebkitTransform: 'translate3d(0,0,0)',
                        transform: 'translate3d(0,0,0)',
                    }}
                >
                    <Card className="w-full h-full sm:w-[350px] sm:h-[500px] md:w-[380px] md:h-[520px] shadow-2xl border sm:border border-gray-200 bg-white rounded-lg sm:rounded-lg flex flex-col">
                        {/* Header with black/white theme */}
                        <CardHeader className="bg-gradient-to-r from-gray-900 to-black text-white rounded-t-lg sm:rounded-t-lg p-4 sm:p-4 pt-4 sm:pt-4 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-5 h-5 sm:w-5 sm:h-5" />
                                    <CardTitle className="text-lg sm:text-lg font-semibold">Trợ lý thông minh</CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleChat}
                                    className="text-white hover:bg-white/20 h-8 w-8 sm:h-8 sm:w-8 p-0"
                                >
                                    <X className="w-4 h-4 sm:w-4 sm:h-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 overflow-hidden">
                            {/* Chat container with ref */}
                            <div
                                ref={chatContainerRef}
                                className="h-[calc(100vh-240px)] sm:h-full p-4 sm:p-4 overflow-y-auto overflow-x-hidden overscroll-none"
                            >
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                        <Bot className="w-12 h-12 sm:w-12 sm:h-12 mb-4 text-gray-400" />
                                        <p className="text-sm sm:text-sm px-4 leading-relaxed">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 sm:space-y-4 overflow-y-auto overflow-x-hidden overscroll-none">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    "flex gap-3 sm:gap-3 max-w-[280px] sm:max-w-[280px]",
                                                    message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                        message.role === "user"
                                                            ? "bg-black text-white"
                                                            : "bg-gray-100 text-gray-700 border border-gray-200",
                                                    )}
                                                >
                                                    {message.role === "user" ? (
                                                        <User className="w-4 h-4 sm:w-4 sm:h-4" />
                                                    ) : (
                                                        <Bot className="w-4 h-4 sm:w-4 sm:h-4" />
                                                    )}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "rounded-2xl px-4 py-3 text-sm sm:text-sm leading-relaxed",
                                                        message.role === "user"
                                                            ? "bg-black text-white rounded-br-md"
                                                            : "bg-gray-50 text-gray-800 rounded-bl-md border border-gray-100",
                                                    )}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-3 sm:gap-3 max-w-[280px] sm:max-w-[280px] mr-auto">
                                                <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <Bot className="w-4 h-4 sm:w-4 sm:h-4" />
                                                </div>
                                                <div className="bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3 text-sm sm:text-sm text-gray-800 border border-gray-100">
                                                    <div className="flex space-x-1">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.1s" }}
                                                        ></div>
                                                        <div
                                                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Invisible element to scroll to */}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter
                            className="p-0 justify-center items-center border-t border-gray-100 rounded-b-lg sm:rounded-b-lg flex-shrink-0"
                            style={{
                                // iOS keyboard fixes
                                paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                            }}
                        >
                            <form onSubmit={handleSubmit} className="flex items-center w-full gap-3 p-4">
                                <Input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 rounded-full border-gray-300 focus:border-black focus:ring-black text-base h-10 sm:h-10"
                                    disabled={isLoading}
                                    style={{
                                        fontSize: '16px',
                                        WebkitAppearance: 'none',
                                        WebkitBorderRadius: '9999px',
                                        maxHeight: '40px'
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-full bg-black hover:bg-gray-800 text-white w-10 h-10 sm:w-10 sm:h-10 p-0 transition-colors flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {/* Floating Button - Responsive sizing */}
            <div className={cn("relative", isOpen && "hidden sm:block")}>
                <Button
                    onClick={toggleChat}
                    className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                        "bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white",
                        "border-2 border-white/20",
                        isOpen && "rotate-180",
                    )}
                >
                    {isOpen ? (
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                </Button>

                {/* Notification Badge - Responsive */}
                {!isOpen && messages.length > 0 && (
                    <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                        {messages.filter((m) => m.role === "assistant").length}
                    </div>
                )}
            </div>

            {/* Overlay backdrop - Mobile: visible, Desktop: invisible but clickable */}
            {isOpen && (
                <>
                    {/* Mobile backdrop - visible */}
                    <div
                        className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
                        onClick={toggleChat}
                        style={{
                            // iOS touch fix
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            touchAction: 'manipulation'
                        }}
                    />
                    {/* Desktop backdrop - invisible but clickable */}
                    <div className="hidden sm:block fixed inset-0 bg-transparent -z-10" onClick={toggleChat} />
                </>
            )}
        </div>
    )
}
