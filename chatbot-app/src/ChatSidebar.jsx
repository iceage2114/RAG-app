import React, { useEffect, useState } from "react";
import "./App.css";

export default function ChatSidebar(props) {
    const { setId, selectedId, conversations } = props

    /*
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        fetch("http://localhost:8000/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data))
        .catch((err) => console.error("Failed to fetch conversations:", err))
    }, [])
    */

    const handleConversationClick = (conversationId) => {
        setId(conversationId)
    };

    return (
        <div className="chat-sidebar">
        <h3>Chat History</h3>
        <ul>
            {conversations.map((conv) => (
            <li 
                key={conv.id}
                onClick={() => handleConversationClick(conv.id)}
                className={selectedId === conv.id ? 'selected' : ''}
            >
                🗨️ {conv.title}
            </li>
            ))}
        </ul>
        </div>
    );
}