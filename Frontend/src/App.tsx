import { Controller } from "./Components/Controller"
import { Modal } from "./Components/Modal"
import { Header } from "./Components/Header"
import { useState } from "react";



function App() {
  const [userKey, setUserKey] = useState<string>('');

  return (
    <>
      {/* <Header setMessages={}/> */}
      <Modal userKey={userKey} />
      <Controller/>
    </>
  )
}

export default App
