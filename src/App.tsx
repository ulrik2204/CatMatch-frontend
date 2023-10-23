import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IndexPage from "./pages";
import PageContainer from "./components/PageContainer";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
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
