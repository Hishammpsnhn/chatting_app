import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react';
function App() {
  const [chat,setChat] = useState([]);
  const handle = async () => {
    let{ data }= await axios.get('/api')
    setChat(data)
    console.log(data);
  }
 
  useEffect(() => {
    handle()
  }, [])
  return (
    <div className="App">
      <h1>hello</h1>
      {
        chat.map((chat)=>{
          return <div>{chat.name}</div>
        })
      }
    </div>
  );
}

export default App;
