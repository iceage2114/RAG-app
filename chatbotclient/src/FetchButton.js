import React, { useState } from "react";
//let data1 = null

function FetchButton() {
  const [data, setData] = useState(null);

  const handleClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/");
      const result = await response.json();
      //console.log(result)
      setData(result);
      //data1 = result;
      //console.log(data1)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default FetchButton;
