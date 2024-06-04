import { useState } from 'react';
import axios from 'axios'; // Ensure you've installed axios

function SendMyNumber() {
  const numberToSend = 100;
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      // Works with LocalHost
      //const response = await  axios.post('http://localhost:8000/add', { number: numberToSend }, {headers: { 'Content-Type': 'application/json' }
      const response = await  axios.post('https://avyh2v3z2o4hueu5nepvhjglke0rhedc.lambda-url.us-west-2.on.aws/add', 
                                         { number: numberToSend }, {headers: { 'Content-Type': 'application/json' }      
                          });
      setResult(response.data.result);
      }
     catch (error) {
      console.error('Error sending number:', error);
    }
    
    
    
  };

  return (
    <div>
      <button onClick={handleClick}>Send Number and Add 4</button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default SendMyNumber
