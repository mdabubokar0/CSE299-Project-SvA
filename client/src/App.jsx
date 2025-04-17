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
import { Drinks } from "./components/Pages/Products/Drinks";
import { Snacks } from "./components/Pages/Products/Snacks";
import { Venues } from "./components/Pages/Products/Venues";
import { Transportation } from "./components/Pages/Products/Transportation";
import { Decorations } from "./components/Pages/Products/Decorations";
import { CreateProduct } from "./components/Pages/Products/CreateProduct";
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
        <Route exact path="/events/create" element={<CreateEvent />} />
        <Route exact path="/feedback" element={<Feedback />} />
        <Route exact path="/photographers" element={<Photographers />} />
        <Route exact path="/create-photographer" element={<CreatePhotographer />}/>
        <Route exact path="/products/drinks" element={<Drinks />} />
        <Route exact path="/products/snacks" element={<Snacks />} />
        <Route exact path="/products/venues" element={<Venues />} />
        <Route exact path="/products/transportation" element={<Transportation />} />
        <Route exact path="/products/decorations" element={<Decorations />} />
        <Route exact path="/products/create" element={<CreateProduct />} />
        <Route exact path="/users/organizers" element={<OList />} />
        <Route exact path="/users/photographers" element={<PList />} />
        <Route exact path="/users/attendees" element={<AList />} />
        <Route exact path="*" element={<Error />} />
      </Routes>
    </Main>
  );
}

export default App;
