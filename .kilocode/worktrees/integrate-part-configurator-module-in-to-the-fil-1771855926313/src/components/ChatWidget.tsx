import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button'; // Assuming shadcn/ui structure or generic
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatWidget: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! How can I help you regarding our machinery or services today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Send history as well for context
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await api.post('/api/chat/message', {
                message: userMsg.content,
                history: history,
                userId: user?._id
            });

            const botMsg: Message = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-xl mb-4 flex flex-col">
                    <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Saudi Horizon Support
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90" onClick={toggleChat} aria-label="Close chat">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <ScrollArea className="h-full p-4">
                            <div role="log" aria-live="polite" aria-atomic="false" className="flex flex-col gap-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-foreground'
                                            }`}>
                                            <div className="prose prose-sm dark:prose-invert break-words text-sm">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-background">
                        <div className="flex w-full gap-2">
                            <label htmlFor="chat-input" className="sr-only">Type your message</label>
                            <Input
                                id="chat-input"
                                aria-label="Type your message"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about parts, stock, or services..."
                                className="flex-1"
                            />
                            <Button onClick={sendMessage} disabled={isLoading} size="icon">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={toggleChat}
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                    aria-label="Open chat"
                    aria-expanded={false}
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}
        </div>
    );
};

export default ChatWidget;
