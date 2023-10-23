import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IndexPage from "./pages";
import PageContainer from "./components/PageContainer";
import LikesPage from "./pages/likes";
import StatsPage from "./pages/stats";
import SinglePokemonCardPage from "./pages/single";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/likes",
    element: <LikesPage />,
  },
  {
    path: "/stats",
    element: <StatsPage />,
  },
  {
    path: "/single/:idOrName",
    element: <SinglePokemonCardPage />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PageContainer>
        <RouterProvider router={router} />
      </PageContainer>
    </QueryClientProvider>
  );
};

export default App;
