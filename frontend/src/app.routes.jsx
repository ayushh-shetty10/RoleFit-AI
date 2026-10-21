import { createBrowserRouter, Outlet } from "react-router";
import Login from "./services/authentication/ui/Login.jsx";
import Register from "./services/authentication/ui/Register.jsx";
import Protected from "./services/authentication/ui/Protected.jsx";
import Analyze from "./services/reports/ui/Analyze.jsx";
import ReportDetail from "./services/reports/ui/ReportDetail.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";

const RootLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: (
          <Protected>
            <Analyze />
          </Protected>
        ),
      },
      {
        path: "/interview/:interviewId",
        element: (
          <Protected>
            <ReportDetail />
          </Protected>
        ),
      },
    ],
  },
]);