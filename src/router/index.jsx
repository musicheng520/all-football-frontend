import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Matches from "../pages/Matches";
import Teams from "../pages/Teams";
import TeamPage from "../pages/Team";
import Players from "../pages/Players";
import News from "../pages/News";

import MatchDetail from "../pages/MatchDetail";
import TeamDetail from "../pages/TeamDetail";
import PlayerDetail from "../pages/PlayerDetail";
import NewsDetail from "../pages/NewsDetail";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import SearchResults from "../pages/SearchResults";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [

            { index: true, element: <Home /> },

            { path: "matches", element: <Matches /> },
            { path: "matches/:id", element: <MatchDetail /> },

            { path: "teams", element: <Teams /> },
            { path: "teams/:id", element: <TeamDetail /> },

            { path: "players", element: <Players /> },
            { path: "players/:id", element: <PlayerDetail /> },

            { path: "news", element: <News /> },
            { path: "news/:id", element: <NewsDetail /> },

            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },

            { path: "profile", element: <Profile /> },

            { path: "search", element: <SearchResults /> },
            {path: "/team", element: <TeamPage />}

        ]
    }
]);

export default router;