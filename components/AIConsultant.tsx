
import React, { useState, useRef, useEffect } from 'react';
import { askTaekwondoMentor } from '../services/geminiService';

const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: '안녕하세요! 연세효 태권도 AI 상담원입니다. 태권도 수련이나 아이 교육에 대해 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askTaekwondoMentor(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 animate-pulse"
        >
          <i className="fas fa-robot text-2xl"></i>
          <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] px-2 py-1 rounded-full border-2 border-white font-bold">AI상담</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up origin-bottom-right">
          <div className="bg-blue-700 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm">연세효 AI 상담원</h4>
                <p className="text-[10px] opacity-70">실시간 궁금증 해결</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-700 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t shrink-0 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="질문을 입력하세요..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConsultant;
