import React, { useState } from "react";
import "./App.css";
import { useEffect } from "react";

export default function ChatWindow({id, conversations, onRefetch}) {
    const [input, setInput] = useState("")

    const [response, setResponse] = useState("")

    const chat = (prompt) => {
        return fetch(`http://localhost:8000/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"prompt": prompt}),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Bot response:", data)
            setResponse(data)
            return data.answer || "no reponse"
        })
        .catch((err) => {
            console.error("Failed to get bot response:", err)
            return "error"
        })
    }

    const sendMessage = async () => {
        if (!input.trim() || !currentConversation) return

        setInput("");
        console.log(response)

        /* const updatedConversations = conversations.map(conv => 
            conv.id === currentConversation.id ? updatedConversation : conv
        )*/
        
        //setConversations(updatedConversations)
        
        const botResponse = await chat(input)

        const updatedConversation = {
            ...currentConversation,
            messages: [...currentConversation.messages, { sender: "user", text: input }, { sender: "bot", text: botResponse }]
        }

        setCurrentConversation(updatedConversation)

        console.log(JSON.stringify(updatedConversation))
        
        fetch(`http://localhost:8000/conversations/${currentConversation.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedConversation),
        })
        .catch((err) => console.error("Failed to update conversation:", err))
    
        onRefetch()
    };

    //const [conversations, setConversations] = useState([])
    const [currentConversation, setCurrentConversation] = useState(null)
    
    /*
    useEffect(() => {
        fetch("http://localhost:8000/conversations")
        .then((res) => res.json())
        .then((data) => {
            setConversations(data)
            console.log(data)
        })
        .catch((err) => console.error("Failed to fetch conversations:", err))
    }, []);
    */

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
                currentConversation.messages.map((message, j) => (
                    <div
                    key={j}
                    className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                    {message.text}
                    </div>
                ))
                ) : (
                <div className="no-conversation-selected">
                    <p>select conversation</p>
                </div>
                )}
            </div>
            <div className="chat-input-bar">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!currentConversation}>Send</button>
            </div>
        </div>
    );
}