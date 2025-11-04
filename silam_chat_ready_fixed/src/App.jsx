import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'silam_chat_history_v1';

function loadHistory(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [{role:'system', content:'You are Silam, a friendly and helpful assistant.'}];
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed)) return [{role:'system', content:'You are Silam, a friendly and helpful assistant.'}];
    return parsed;
  } catch(e){
    return [{role:'system', content:'You are Silam, a friendly and helpful assistant.'}];
  }
}

export default function App(){
  const [messages, setMessages] = useState(loadHistory());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(()=> {
    bottomRef.current?.scrollIntoView({behavior:'smooth'});
  }, [messages, loading]);

  async function send(){
                // replaced_send

    const text = input.trim();
    if(!text) return;
    const user = {role:'user', content:text};
    const newMessages = [...messages, user];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({messages:newMessages})
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({error:res.statusText}));
        setMessages(m => [...m, {role:'assistant', content:'Error: '+(err.error||err.message||res.statusText)}]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const assistantText = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'No response';
      setMessages(m => [...m, {role:'assistant', content:assistantText}]);
    } catch(e){
      setMessages(m => [...m, {role:'assistant', content:'Network error: '+e.message}]);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory(){
    localStorage.removeItem(STORAGE_KEY);
    setMessages([{role:'system', content:'You are Silam, a friendly and helpful assistant.'}]);
  }

  const themePref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  return (
    <div className={'app '+themePref}>
      <header className='header'>
        <div className='brand'>
          <div className='avatar'>S</div>
          <div>
            <div className='title'>Silam</div>
            <div className='subtitle'>Hey, I’m Silam — how can I help you today?</div>
          </div>
        </div>
        <div className='actions'>
          <button onClick={clearHistory} title='Clear chat'>Clear</button>
        </div>
      </header>

      <main className='chat'>
        {messages.filter(m=>m.role!=='system').map((m,i)=>(
          <div key={i} className={'msg '+(m.role==='assistant'?'assistant':'user')}>
            <div className='bubble'>
              <div className='role'>{m.role}</div>
              <div className='content'>{m.content}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className='composer'>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} placeholder='Type a message...' disabled={loading} />
        <button onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
      </footer>
    </div>
  );
}
