import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

export default function Chatbot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! 👋 I\'m EduSync Assistant. Ask me anything about the school — timings, fees, admissions, transport, and more!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const question = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: question }]);
        setLoading(true);
        try {
            const { data } = await api.post('/chat', { question });
            setMessages((prev) => [...prev, { role: 'bot', text: data.data.answer }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I couldn\'t process your question. Please try again.' }]);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-glass border border-surface-200 flex flex-col z-50 animate-slide-up overflow-hidden">
            {/* Header */}
            <div className="gradient-primary px-4 py-3 flex items-center justify-between shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><Bot size={18} /></div>
                    <div>
                        <p className="text-sm font-semibold">EduSync Assistant</p>
                        <p className="text-xs text-white/70">Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0"><Bot size={14} className="text-primary-600" /></div>}
                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-surface-100 text-surface-800 rounded-tl-sm'}`}>
                            {msg.text}
                        </div>
                        {msg.role === 'user' && <div className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center shrink-0"><User size={14} className="text-accent-600" /></div>}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-2 items-center">
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center"><Bot size={14} className="text-primary-600" /></div>
                        <div className="bg-surface-100 px-4 py-2 rounded-xl flex gap-1">
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-surface-200">
                <div className="flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about school..." className="flex-1 px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 outline-none bg-surface-50" />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}
                        className="p-2 gradient-primary text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
