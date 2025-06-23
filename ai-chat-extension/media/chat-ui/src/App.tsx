
import React, { useEffect, useState } from 'react';
import './App.css';
declare const vscode: any;

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.command === 'fileList') setFiles(msg.data);
      if (msg.command === 'fileContent') setMessages(prev => [...prev, `📎 Attached file content:\n\n${msg.data}`]);
    });
  }, []);

  const handleSubmit = () => {
    setMessages(prev => [...prev, `🙋‍♂️ ${input}`]);
    if (input.includes('@')) vscode.postMessage({ command: 'getFiles' });
    else sendToAI(input);
    setInput('');
  };

  const sendToAI = async (text: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }]
      })
    });
    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || '[No response]';
    setMessages(prev => [...prev, `🤖 ${reply}`]);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => <div key={i} className="message">{msg}</div>)}
      </div>
      <div className="input-area">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button onClick={handleSubmit}>Send</button>
      </div>
      {files.length > 0 && <div className="file-picker">
        <h4>Select a file:</h4>
        {files.map((file, i) => (
          <div key={i} onClick={() => vscode.postMessage({ command: 'readFile', filename: file })}>{file}</div>
        ))}
      </div>}
    </div>
  );
}

export default App;
