import React, { useEffect, useState, useRef } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient =null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('blinktalk-theme') || 'dark';
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('blinktalk-theme', theme);
    }, [theme]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [publicChats, privateChats, tab]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN",
            date: new Date().toISOString()
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(payloadData.senderName !== userData.username && !privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            default:
                console.warn("Received unknown status:", payloadData.status);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const sendValue=()=>{
        if (stompClient && userData.message.trim() !== "") {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE",
                date: new Date().toISOString()
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient && userData.message.trim() !== "") {
            var chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message,
                status:"MESSAGE",
                date: new Date().toISOString()
            };
            
            if(userData.username !== tab){
                if (!privateChats.get(tab)) {
                    privateChats.set(tab, []);
                }
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        if (userData.username.trim() !== "") {
            connect();
        }
    }

    const handleKeyPress = (event, sendFunc) => {
        if (event.key === 'Enter') {
            sendFunc();
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const getAvatarColorClass = (name) => {
        if (!name) return 'avatar-color-0';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % 8;
        return `avatar-color-${index}`;
    };

    const formatTime = (dateStr) => {
        let date = dateStr ? new Date(dateStr) : new Date();
        if (isNaN(date.getTime())) {
            date = new Date();
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <div className="sidebar-header">
                            <div className="sidebar-brand">
                                <span className="brand-icon">⚡</span>
                                <h2>BlinkTalk</h2>
                            </div>
                            <div className={`theme-toggle ${theme}`} onClick={toggleTheme}>
                                <div className="theme-toggle-track">
                                    <div className="theme-toggle-thumb">
                                        {theme === 'dark' ? '🌙' : '☀️'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul>
                            <li 
                                onClick={() => setTab("CHATROOM")} 
                                className={`member ${tab === "CHATROOM" ? "active" : ""}`}
                            >
                                <div className="member-avatar chatroom-icon">💬</div>
                                <span>Public Chatroom</span>
                            </li>
                            {[...privateChats.keys()].map((name, index) => {
                                if (name === userData.username) return null;
                                return (
                                    <li 
                                        onClick={() => setTab(name)} 
                                        className={`member ${tab === name ? "active" : ""}`} 
                                        key={index}
                                    >
                                        <div className={`member-avatar ${getAvatarColorClass(name)}`}>
                                            {getInitials(name)}
                                        </div>
                                        <span>{name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="chat-content">
                        <div className="chat-header">
                            {tab === "CHATROOM" ? (
                                <>
                                    <div className="chat-header-avatar chatroom-icon" style={{ background: 'var(--accent-gradient)' }}>💬</div>
                                    <div className="chat-header-info">
                                        <h3>Public Chatroom</h3>
                                        <span>Share ideas with everyone</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`chat-header-avatar ${getAvatarColorClass(tab)}`}>
                                        {getInitials(tab)}
                                    </div>
                                    <div className="chat-header-info">
                                        <h3>{tab}</h3>
                                        <span>Private Message</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <ul className="chat-messages">
                            {tab === "CHATROOM" ? (
                                publicChats.map((chat, index) => {
                                    if (chat.status === "JOIN") {
                                        return (
                                            <div className="join-notification" key={index}>
                                                ⚡ {chat.senderName} joined the chat
                                            </div>
                                        );
                                    }
                                    const isSelf = chat.senderName === userData.username;
                                    return (
                                        <li className={`message ${isSelf ? "self" : ""}`} key={index}>
                                            {!isSelf && (
                                                <div className={`message-avatar ${getAvatarColorClass(chat.senderName)}`}>
                                                    {getInitials(chat.senderName)}
                                                </div>
                                            )}
                                            <div className="message-bubble">
                                                <div className="message-sender">{chat.senderName}</div>
                                                <div className="message-text">{chat.message}</div>
                                                <div className="message-time">{formatTime(chat.date)}</div>
                                            </div>
                                            {isSelf && (
                                                <div className={`message-avatar ${getAvatarColorClass(chat.senderName)}`}>
                                                    {getInitials(chat.senderName)}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                (privateChats.get(tab) || []).map((chat, index) => {
                                    const isSelf = chat.senderName === userData.username;
                                    return (
                                        <li className={`message ${isSelf ? "self" : ""}`} key={index}>
                                            {!isSelf && (
                                                <div className={`message-avatar ${getAvatarColorClass(chat.senderName)}`}>
                                                    {getInitials(chat.senderName)}
                                                </div>
                                            )}
                                            <div className="message-bubble">
                                                <div className="message-sender">{chat.senderName}</div>
                                                <div className="message-text">{chat.message}</div>
                                                <div className="message-time">{formatTime(chat.date)}</div>
                                            </div>
                                            {isSelf && (
                                                <div className={`message-avatar ${getAvatarColorClass(chat.senderName)}`}>
                                                    {getInitials(chat.senderName)}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </ul>

                        <div className="send-message">
                            <input 
                                type="text" 
                                className="input-message" 
                                placeholder={tab === "CHATROOM" ? "Type a message to public chatroom..." : `Type a private message to ${tab}...`}
                                value={userData.message} 
                                onChange={handleMessage} 
                                onKeyDown={(e) => handleKeyPress(e, tab === "CHATROOM" ? sendValue : sendPrivateValue)}
                            /> 
                            <button 
                                type="button" 
                                className="send-button" 
                                onClick={tab === "CHATROOM" ? sendValue : sendPrivateValue}
                            >
                                <svg viewBox="0 0 24 24">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="register">
                    <div style={{ alignSelf: 'flex-end', marginBottom: '-10px', marginTop: '-20px' }}>
                        <div className={`theme-toggle ${theme}`} onClick={toggleTheme}>
                            <div className="theme-toggle-track">
                                <div className="theme-toggle-thumb">
                                    {theme === 'dark' ? '🌙' : '☀️'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="register-brand">
                        <span className="brand-icon">⚡</span>
                        <h1>BlinkTalk</h1>
                    </div>
                    <p className="register-subtitle">Connect and chat in real-time</p>
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        onKeyDown={(e) => handleKeyPress(e, registerUser)}
                    />
                    <button type="button" className="connect-btn" onClick={registerUser}>
                        Connect
                    </button> 
                </div>
            )}
        </div>
    )
}

export default ChatRoom