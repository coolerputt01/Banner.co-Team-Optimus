import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Splash from "./pages/Splash";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Inbox from "./pages/Inbox";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import ProfileEdit from "./pages/ProfileEdit";
import CreateAd from "./pages/CreateAd";

// Settings sub-pages
import ManageAccount from "./pages/settings/ManageAccount";
import Privacy from "./pages/settings/Privacy";
import Safety from "./pages/settings/Safety";
import PaymentMethods from "./pages/settings/PaymentMethods";
import WithdrawalPreferences from "./pages/settings/WithdrawalPreferences";
import TaxInfo from "./pages/settings/TaxInfo";
import FreeUpSpace from "./pages/settings/FreeUpSpace";
import HelpCenter from "./pages/settings/HelpCenter";
import ReportProblem from "./pages/settings/ReportProblem";
import TermsPolicies from "./pages/settings/TermsPolicies";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Splash />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* Main app */}
            <Route path="/feed" element={<Feed />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create-ad" element={<CreateAd />} />

            {/* Settings sub-pages */}
            <Route path="/settings/manage-account" element={<ManageAccount />} />
            <Route path="/settings/privacy" element={<Privacy />} />
            <Route path="/settings/safety" element={<Safety />} />
            <Route path="/settings/payment-methods" element={<PaymentMethods />} />
            <Route path="/settings/withdrawal" element={<WithdrawalPreferences />} />
            <Route path="/settings/tax-info" element={<TaxInfo />} />
            <Route path="/settings/free-up-space" element={<FreeUpSpace />} />
            <Route path="/settings/help" element={<HelpCenter />} />
            <Route path="/settings/report" element={<ReportProblem />} />
            <Route path="/settings/terms" element={<TermsPolicies />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
