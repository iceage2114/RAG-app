import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import "./App.css";
import LoginPage from './Login';



export default function App() {
  const [id, setId] = useState(1)
  const [trigger, setTrigger] = useState(0);
  const [conversations, setConversations] = useState([])

  useEffect(() => {
      fetch("http://localhost:8000/conversations")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        setConversations(data)
      })
      .catch((err) => console.error("Failed to fetch conversations:", err))
  }, [trigger])

  const refetch = () => setTrigger(prev => prev + 1);
  
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    setLoggedIn(false)
  }

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };
  
  return (
    <div className="app-wrapper">
      { loggedIn && (
        <>
          <div className="app-header">
            <div>🤖 My AI Chatbot</div>
            <div className="logout" onClick={logout}>Logout</div>
          </div>
          <div className="app-container">
            <ChatSidebar setId={setId} selectedId={id} conversations={conversations} />
            <ChatWindow id={id} conversations={conversations} setConversations={setConversations} onRefetch={refetch} />
          </div>
        </>
      )}
      { !loggedIn && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}