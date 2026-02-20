import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";
import Landing from "./pages/Landing";
import PublicFileView from "./pages/PubliFileView";

// Higher-order component to protect authenticated routes
const Protected = ({ children }) => (
  <>
    <SignedIn>
      <DashboardLayout>{children}</DashboardLayout>
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/share/:shareToken" element={<PublicFileView />} />

        {/* Protected authenticated routes */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/upload" element={<Protected><Upload /></Protected>} />
        <Route path="/my-files" element={<Protected><MyFiles /></Protected>} />
        <Route path="/subscriptions" element={<Protected><Subscription /></Protected>} />
        <Route path="/transactions" element={<Protected><Transactions /></Protected>} />

        {/* Fallback */}
        <Route path="/*" element={<RedirectToSignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;