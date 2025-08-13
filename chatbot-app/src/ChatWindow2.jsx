import React, { useState, useEffect } from "react";
import "./App.css";
import { 
    getMessageClassName, 
    createTypingIndicator, 
    createLoadingMessage, 
    createBotMessage, 
    createUserMessage, 
    formatMessagesForAI, 
    createErrorMessage,
    PLACEHOLDERS 
} from "./messageUtils";

export default function ChatWindow({id, conversations, onRefetch}) {
    console.log(id)
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [currentConversation, setCurrentConversation] = useState(null)

    const sendMessage = async () => {
        if (!input.trim() || !currentConversation) return
        
        const userMessage = createUserMessage(input)
        
        const updatedConversation = {
            ...currentConversation,
            messages: [...currentConversation.messages, userMessage]
        }
        
        setCurrentConversation(updatedConversation)
        setInput("")
        setIsLoading(true)
        
        try {
            await fetch(`http://localhost:8000/conversations/${currentConversation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedConversation),
            })

            const aiResponse = await getAIResponse(updatedConversation.messages)
            
            const botMessage = createBotMessage(aiResponse)
            const finalConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, botMessage]
            }
            
            setCurrentConversation(finalConversation)
            
            await fetch(`http://localhost:8000/conversations/${currentConversation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalConversation),
            })
            
        } catch (error) {
            console.error("Failed to send message or get AI response:", error)
            
            const errorMessage = createErrorMessage()
            const errorConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, errorMessage]
            }
            setCurrentConversation(errorConversation)
        } finally {
            setIsLoading(false)
            onRefetch()
        }
    }

    const getAIResponse = async (messages) => {
        const conversationHistory = formatMessagesForAI(messages)

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversationHistory
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        return data.response
    }

    useEffect(() => {
        if (id && conversations.length > 0) {
            const conversation = conversations.find(conv => conv.id === id)
            setCurrentConversation(conversation);
        }
    }, [id, conversations])

    return (
        <div className="chat-window">
            <div className="chat-box">
            {currentConversation ? (
                <>
                {currentConversation.messages.map((message, j) => (
                    <div
                        key={j}
                        className={getMessageClassName(message.sender, message.isLoading)}
                    >
                        {message.text}
                    </div>
                ))}
                {isLoading && (
                    <div className={getMessageClassName('bot', true)}>
                        {createTypingIndicator()}
                        {PLACEHOLDERS.LOADING_TEXT}
                    </div>
                )}
                </>
            ) : (
                <div className="no-conversation-selected">
                    <p>{PLACEHOLDERS.NO_CONVERSATION}</p>
                </div>
            )}
            </div>
            <div className="chat-input-bar">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDERS.CHAT_INPUT}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                    disabled={isLoading}
                />
                <button 
                    onClick={sendMessage} 
                    disabled={!currentConversation || isLoading}
                >
                    {isLoading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}