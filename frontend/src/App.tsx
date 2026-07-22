import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminRoutes from './components/AdminRoutes';
import { Toaster } from 'react-hot-toast';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';

function App() {
  return(
  <>
  <Toaster/>
  <Routes>
    <Route path ="/" element={<Home/>}></Route>
    <Route path ="/login" element={<Login/>}></Route>
    <Route path = "/register" element = {<Register/>}> </Route>
    <Route path = "/admin" element = {<AdminRoutes><Admin/></AdminRoutes>}></Route>
    <Route path="/admin/add-event" element={<AdminRoutes><AddEvent /></AdminRoutes>} />
    <Route path="/admin/edit-event/:id" element={<AdminRoutes><EditEvent /></AdminRoutes>} />
    <Route path="/event/:id" element={<EventDetail />} />
    <Route path="/my-bookings" element={<MyBookings />} />
  </Routes>
  </>
  )
}

export default App
