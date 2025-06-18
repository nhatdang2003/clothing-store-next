"use client";

import { useEffect } from "react";

export default function ChatbotEmbed() {
    useEffect(() => {
        const script = document.createElement("script");

        script.type = "module";
        script.innerHTML = `
      import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
      Chatbot.init({
        n8nChatUrl: "https://ezstore.app.n8n.cloud/webhook/8b641d65-fc09-4125-baf2-e7ab9ebf40d0/chat", // ← sửa URL cho đúng
        theme: {
      "button": {
        "backgroundColor": "#ffffff",
        "right": 20,
        "bottom": 20,
        "size": 50,
        "iconColor": "#373434",
        "customIconSrc": "https://www.svgrepo.com/show/326553/chatbubble-outline.svg",
        "customIconSize": 60,
        "customIconBorderRadius": 15,
        "autoWindowOpen": {
          "autoOpen": false,
          "openDelay": 2
        },
        "borderRadius": "circle"
      },
            "tooltip": {
        "showTooltip": true,
        "tooltipMessage": "Nhận tư vấn ngay!",
        "tooltipBackgroundColor": "#fff9f6",
        "tooltipTextColor": "#1c1c1c",
        "tooltipFontSize": 15
      },
       "chatWindow": {
        "borderRadiusStyle": "rounded",
        "avatarBorderRadius": 17,
        "messageBorderRadius": 6,
        "showTitle": true,
        "title": "Ez Bot",
        "titleAvatarSrc": "https://www.svgrepo.com/show/333724/bot.svg",
        "welcomeMessage": "Xin chào, bạn cần tư vấn gì?",
        "errorMessage": "Có lỗi xảy ra, vui lòng thử lại sau",
        "backgroundColor": "#ffffff",
        "height": 600,
        "width": 400,
        "fontSize": 16,
        "starterPrompts": [
          "Tư vấn cho tôi các sản phẩm nổi bật của cửa hàng?",
          "Tư vấn cho tôi các sản phẩm phù hợp với tôi?"
        ],
        "starterPromptFontSize": 15,
        "renderHTML": true,
        "clearChatOnReload": true,
        "botMessage": {
          "backgroundColor": "#333333",
          "textColor": "#fafafa",
          "showAvatar": false,
          "avatarSrc": "https://www.svgrepo.com/show/333724/bot.svg"
        },
        "userMessage": {
          "backgroundColor": "#fff6f3",
          "textColor": "#050505",
          "showAvatar": true,
          "avatarSrc": "https://www.svgrepo.com/show/524199/user-circle.svg"
        },
        "textInput": {
          "placeholder": "Nhập câu hỏi ...",
          "backgroundColor": "#ffffff",
          "textColor": "#1e1e1f",
          "sendButtonColor": "#333333",
          "maxChars": 500,
          "maxCharsWarningMessage": "Vui lòng nhập dưới 500 ký tự",
          "autoFocus": false,
          "borderRadius": 6,
          "sendButtonBorderRadius": 50
        },
        "uploadsConfig": {
          "enabled": true,
          "acceptFileTypes": [
            "jpeg",
            "jpg",
            "png"
          ],
          "maxFiles": 1,
          "maxSizeInMB": 2
        }
      }
    }
    });
    `;

        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const popup = document.querySelector('n8nchatui-popup');
            if (popup && popup.shadowRoot) {
                const spans = popup.shadowRoot.querySelectorAll('span');
                spans.forEach((span) => {
                    if (span.textContent?.includes('n8nchatui.com')) {
                        span.style.setProperty('display', 'none', 'important');

                        // 👇 Thêm padding vào phần tử cha
                        const parent = span.parentElement;
                        if (parent) {
                            parent.style.paddingBottom = '16px'; // hoặc '20px', tùy ý
                        }

                        clearInterval(timer);
                    }
                });
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return null;
}
