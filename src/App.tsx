import { useEffect } from 'react';
import app from './api/firebase';

function App() {
  useEffect(() => {
    console.log('app', app);
  }, []);

  return (
    <div className="App">
      <h1>popple</h1>
    </div>
  );
}

export default App;
