// app/dashboard/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { ModeToggle } from "@/app/components/ui/mode-toggle";
import { useTheme } from "next-themes";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock data for stocks
const stocksData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: 2.5 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2750.80, change: -0.8 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 305.15, change: 1.2 },
];

type Message = {
  text: string;
  isUser: boolean;
};

export default function Dashboard() {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { theme } = useTheme();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = { text: inputMessage, isUser: true };
      const aiMessage: Message = { text: "Hello! How can I assist you with your stocks today?", isUser: false };
      setChatMessages([...chatMessages, userMessage, aiMessage]);
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock Price',
        data: [120, 130, 125, 135, 140, 150],
        borderColor: theme === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left side - Stocks and Graph */}
      <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-600/30 dark:border-gray-400/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Stocks</h2>
          <ModeToggle />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stocksData.map((stock) => (
            <div key={stock.symbol} className="bg-card text-card-foreground p-4 rounded-lg shadow border border-gray-600/30 dark:border-gray-400/30">
              <h3 className="font-bold">{stock.symbol}</h3>
              <p>{stock.name}</p>
              <p className="text-lg">${stock.price.toFixed(2)}</p>
              <p className={stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow border border-gray-600/30 dark:border-gray-400/30">
          <h3 className="text-xl font-bold mb-2">Stock Performance</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Right side - Chatbot */}
      <div className="w-1/3 bg-card text-card-foreground p-6 flex flex-col border-l border-gray-600/30 dark:border-gray-400/30">
        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto mb-4 space-y-4 border border-gray-600/30 dark:border-gray-400/30 rounded-lg p-4"
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask about your stocks..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="border-gray-600/30 dark:border-gray-400/30"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
} 