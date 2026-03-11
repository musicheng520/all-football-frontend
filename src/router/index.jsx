import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Matches from "../pages/Matches";
import Teams from "../pages/Teams";
import Players from "../pages/Players";
import News from "../pages/News";
import MatchDetail from "../pages/MatchDetail";
import TeamDetail from "../pages/TeamDetail";
import PlayerDetail from "../pages/PlayerDetail";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/matches", element: <Matches /> },
            { path: "/teams", element: <Teams /> },
            { path: "/players", element: <Players /> },
            { path: "/news", element: <News /> },
            { path: "/matches/:id", element: <MatchDetail />},
            {
                path: "/teams",
                element: <Teams/>
            },
            {
                path: "/teams/:id",
                element: <TeamDetail/>
            },
            {
                path:"/players/:id",
                element:<PlayerDetail />
            }
        ]
    }
]);

export default router;