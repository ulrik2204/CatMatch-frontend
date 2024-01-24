import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import PageContainer from "./components/PageContainer";
import IndexPage from "./pages";
import AnalyticsPage from "./pages/analytics";
import LikesPage from "./pages/likes";
import SingleCatCardPage from "./pages/single";

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
    path: "/analytics",
    element: <AnalyticsPage />,
  },
  {
    path: "/single/:catId",
    element: <SingleCatCardPage />,
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
