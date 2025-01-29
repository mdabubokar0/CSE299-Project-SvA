import { BrowserRouter as Main, Routes, Route } from "react-router-dom"
import { Portfolio } from "./components/Portfolio/Portfolio"
import { Auth } from "./components/Auth/Auth"

function App() {

  return (
    <Main>
      <Routes>
        <Route exact path="/" element={<Portfolio />} />
        <Route exact path="/auth" element={<Auth />} />
      </Routes>
    </Main>
  )
}

export default App
