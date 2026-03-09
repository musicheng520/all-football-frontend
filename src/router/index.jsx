import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Matches from "../pages/Matches";
import Teams from "../pages/Teams";
import Players from "../pages/Players";
import News from "../pages/News";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/matches",
        element: <Matches />,
    },
    {
        path: "/teams",
        element: <Teams />,
    },
    {
        path: "/players",
        element: <Players />,
    },
    {
        path: "/news",
        element: <News />,
    },
]);

export default router;