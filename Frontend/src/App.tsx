import { Controller } from "./Components/Controller";
import { Modal } from "./Components/Modal";
import { useState } from "react";



function App() {
  const [userKey, setUserKey] = useState<string>("");

  const handleSubmit = (apiKey: string) => {
    setUserKey(apiKey);
    console.log("API Key submitted:", apiKey);
  };

  return (
    <>
      <Modal onSubmit={handleSubmit} />
      <Controller />
    </>
  );
}

export default App;
