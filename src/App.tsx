import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import About from "./pages/About";
import MrZik from "./pages/MrZik";
import Representation from "./pages/Representation";
import TalentCategories from "./pages/TalentCategories";
import Submit from "./pages/Submit";
import Academy from "./pages/Academy";
import ClassesWorkshops from "./pages/ClassesWorkshops";
import Tutorials from "./pages/Tutorials";
import Opportunities from "./pages/Opportunities";
import BookTalent from "./pages/BookTalent";
import Partnerships from "./pages/Partnerships";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SubmissionTerms from "./pages/SubmissionTerms";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import BookingSuccess from "./pages/BookingSuccess";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import Roster from "./pages/Roster";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import AdminReview from "./pages/AdminReview";
import AdminBanners from "./pages/AdminBanners";
import AdminHub from "./pages/AdminHub";
import AdminOpportunities from "./pages/AdminOpportunities";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RequireAdmin from "./components/auth/RequireAdmin";
const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/mr-zik" element={<MrZik />} />
          <Route path="/representation" element={<Representation />} />
          <Route path="/talent-categories" element={<TalentCategories />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/classes-workshops" element={<ClassesWorkshops />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/book-talent" element={<BookTalent />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/submission-terms" element={<SubmissionTerms />} />
          <Route path="/submission-success" element={<SubmissionSuccess />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/roster/:slug" element={<TalentProfile />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/admin" element={<RequireAdmin><AdminHub /></RequireAdmin>} />
          <Route path="/admin/review" element={<RequireAdmin><AdminReview /></RequireAdmin>} />
          <Route path="/admin/banners" element={<RequireAdmin><AdminBanners /></RequireAdmin>} />
          <Route path="/admin/opportunities" element={<RequireAdmin><AdminOpportunities /></RequireAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
