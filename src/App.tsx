import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IndexPage from "./pages";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
]);

const App = () => {
  return (
    <div className="bg-background text-text">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
};

export default App;
