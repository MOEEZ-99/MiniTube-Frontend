import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import PrivateRoute from "./utils/PrivateRoute";
import { Register } from "./pages/Register";
import { MyVideos } from "./pages/MyVideos";
import { Playlist } from "./pages/Playlist";
import { Subscriptions } from "./pages/Subscriptions";
import { LikedVideos } from "./pages/LikedVideos";
import { store } from './app/store'
import { Provider } from 'react-redux'
import { Profile } from "./pages/Profile";
import { Video } from "./pages/Video";
import UploadPage from "./pages/Upload";
import { CreatePlaylist } from "./pages/CreatePlaylist";
import ShowPlaylist  from "./pages/ShowPlaylist";
import { MyProfile } from "./pages/MyProfile";

function App() {
  return (
     <Provider store={store}>
            <BrowserRouter>
            <Routes>

              <Route  element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/my-videos" element={<MyVideos />} />
                <Route path="/playlists" element={<Playlist />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/liked-videos" element={<LikedVideos />} />
                <Route path="/upload-video" element={<UploadPage />} />
                <Route path="/create-playlist" element={<CreatePlaylist />} />
              </Route>

                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/show-playlist/:id" element={<ShowPlaylist />} />
              <Route path="/video/:id" element={<Video />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </BrowserRouter>
     </Provider>
  );
}

export default App;
