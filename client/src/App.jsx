import { BrowserRouter as Main, Routes, Route } from "react-router-dom"
import { Portfolio } from "./components/Portfolio/Portfolio"
import { Auth } from "./components/Auth/Auth"
import { Profile } from "./components/Profile/Profile"
import { Dashboard } from "./components/Pages/Dashboard/Dashboard"
import { Forum } from "./components/Pages/Forum/Forum"
import { Calculator } from "./components/Pages/Calculator/Calculator"
import { Ticket } from "./components/Pages/Ticket/Ticket"
import { Event } from "./components/Pages/Event/Event"
import { CreateEvent } from "./components/Pages/Event/CreateEvent"
import { Feedback } from "./components/Pages/Feedback/Feedback"
import { Suggestions } from "./components/Pages/Suggestions/Suggestions"
import { Photographers } from "./components/Pages/Photographers/Photographers"

function App() {

  return (
    <Main>
      <Routes>
        <Route exact path="/" element={<Portfolio />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/forum" element={<Forum />} />
        <Route exact path="/calculator" element={<Calculator />} />
        <Route exact path="/ticket" element={<Ticket />} />
        <Route exact path="/event" element={<Event />} />
        <Route exact path="/create-event" element={<CreateEvent />} />
        <Route exact path="/feedback" element={<Feedback />} />
        <Route exact path="/suggestions" element={<Suggestions />} />
        <Route exact path="/photographers" element={<Photographers />} />
      </Routes>
    </Main>
  )
}

export default App
