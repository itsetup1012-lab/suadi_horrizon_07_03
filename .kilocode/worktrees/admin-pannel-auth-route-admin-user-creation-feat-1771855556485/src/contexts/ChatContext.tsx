"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatMessage = {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
};

type ChatContextType = {
    messages: ChatMessage[];
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    sendMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

    const sendMessage = (text: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    return (
        <ChatContext.Provider value={{
            messages,
            isOpen,
            openChat,
            closeChat,
            sendMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}