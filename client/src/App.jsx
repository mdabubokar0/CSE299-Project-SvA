import { BrowserRouter as Main, Routes, Route } from "react-router-dom";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { Auth } from "./components/Auth/Auth";
import { Profile } from "./components/Profile/Profile";
import { Dashboard } from "./components/Pages/Dashboard/Dashboard";
import { Forum } from "./components/Pages/Forum/Forum";
import { Calculator } from "./components/Pages/Calculator/Calculator";
import { Ticket } from "./components/Pages/Ticket/Ticket";
import { Concert } from "./components/Pages/Event/Concerts";
import { Gaming } from "./components/Pages/Event/Gaming";
import { Anime } from "./components/Pages/Event/Anime";
import { Workshops } from "./components/Pages/Event/Workshops";
import { CreateEvent } from "./components/Pages/Event/CreateEvent";
import { Feedback } from "./components/Pages/Feedback/Feedback";
import { Photographers } from "./components/Pages/Photographers/Photographers";
import { CreatePhotographer } from "./components/Pages/Photographers/CreatePhotographer";
import { SuggestionList } from "./components/Pages/Suggestions/SuggestionList";
import { CreateSuggestion } from "./components/Pages/Suggestions/CreateSuggestion";
import { Organizers as OList } from "./components/Pages/Users/Organizers";
import { Photographers as PList } from "./components/Pages/Users/Photographers";
import { Attendees as AList } from "./components/Pages/Users/Attendees";
import { Error } from "./components/Pages/Error/Error";

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
        <Route exact path="/events/concerts" element={<Concert />} />
        <Route exact path="/events/gaming" element={<Gaming />} />
        <Route exact path="/events/anime" element={<Anime />} />
        <Route exact path="/events/workshops" element={<Workshops />} />
        <Route exact path="/create-event" element={<CreateEvent />} />
        <Route exact path="/feedback" element={<Feedback />} />
        <Route exact path="/photographers" element={<Photographers />} />
        <Route exact path="/create-photographer" element={<CreatePhotographer />}/>
        <Route exact path="/products" element={<SuggestionList />} />
        <Route exact path="/products/create" element={<CreateSuggestion />} />
        <Route exact path="/users/organizers" element={<OList />} />
        <Route exact path="/users/photographers" element={<PList />} />
        <Route exact path="/users/attendees" element={<AList />} />
        <Route exact path="*" element={<Error />} />
      </Routes>
    </Main>
  );
}

export default App;
