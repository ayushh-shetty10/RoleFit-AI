import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';
import { AuthProvider } from './services/authentication/state/auth.context.jsx';
import { ReportProvider } from './services/reports/state/report.context.jsx';

function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <RouterProvider router={router} />
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;
