import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/admin/review" element={<AdminReview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
