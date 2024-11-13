import { Controller } from "./Components/Controller";
import { Modal } from "./Components/Modal";
import { useState } from "react";



function App() {
  const [_userKey, setUserKey] = useState<string>("");

  const handleSubmit = (apiKey: string) => {
    setUserKey(apiKey);
    console.log("API Key submitted");
  };

  return (
    <>
      <Modal onSubmit={handleSubmit} />
      <Controller />
    </>
  );
}

export default App;
