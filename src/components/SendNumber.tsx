import { useState } from 'react';
import axios from 'axios'; // Ensure you've installed axios

function SendMyNumber() {
  const [numberToSend, SetnumToSend] = useState(100);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      // Works with LocalHost  : FastApi address
      //const response = await  axios.post('http://localhost:8000/add', { number: numberToSend }, {headers: { 'Content-Type': 'application/json' }
      //const response = await  axios.post('https://avyh2v3z2o4hueu5nepvhjglke0rhedc.lambda-url.us-west-2.on.aws/add', 
      //                                   { number: numberToSend }, {headers: { 'Content-Type': 'application/json' }     
      // Maybe I should use Lambda ARN address instead 
      const response = await  axios.post('arn:aws:lambda:us-west-2:711141261525:function:June_03_24_Python_3_10/add', { number: numberToSend }, 
      {headers: { 'Content-Type': 'application/json' }      
                          });
                          
                          
      SetnumToSend (numberToSend);                    
                          
      setResult(response.data.result);
      }
     catch (error) {
      console.error('Error sending number:', error);
    }
    
    
    
  };

  return (
    <div>
      <button onClick={handleClick}>Send Number and Add 10</button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default SendMyNumber
