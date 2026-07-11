import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

// Layout
import SiteLayout from '@/components/layout/SiteLayout';

// Pages
import Home from '@/pages/Home';
import ProductsOverview from '@/pages/products/ProductsOverview';
import ProductPage from '@/pages/products/ProductPage';
import ProductComparison from '@/pages/products/ProductComparison';
import WorkflowsOverview from '@/pages/workflows/WorkflowsOverview';
import WorkflowPage from '@/pages/workflows/WorkflowPage';
import Technology from '@/pages/Technology';
import VideoLibrary from '@/pages/resources/VideoLibrary';
import VideoDetail from '@/pages/resources/VideoDetail';
import ProductDemos from '@/pages/resources/ProductDemos';
import Tutorials from '@/pages/resources/Tutorials';
import Documentation from '@/pages/resources/Documentation';
import ReleaseNotes from '@/pages/resources/ReleaseNotes';
import FAQ from '@/pages/resources/FAQ';
import FAQSolidworks from '@/pages/resources/FAQSolidworks';
import FAQStudio from '@/pages/resources/FAQStudio';
import PricingOverview from '@/pages/pricing/PricingOverview';
import Pricing from '@/pages/pricing/Pricing';
import TrialDownloads from '@/pages/pricing/TrialDownloads';
import ProductDownloads from '@/pages/pricing/ProductDownloads';
import UpgradeInfo from '@/pages/pricing/UpgradeInfo';
import SupportOverview from '@/pages/support/SupportOverview';
import GettingStarted from '@/pages/support/GettingStarted';
import TutorialsByProduct from '@/pages/support/TutorialsByProduct';
import Installation from '@/pages/support/Installation';
import SupportReleaseNotes from '@/pages/support/SupportReleaseNotes';
import ContactSupport from '@/pages/support/ContactSupport';
import Contact from '@/pages/Contact';
import CustomerComments from '@/pages/customers/CustomerComments';
import Newsletter from '@/pages/Newsletter';
import Events from '@/pages/Events';
import SystemRequirements from '@/pages/support/SystemRequirements';
import Resellers from '@/pages/Resellers';
import LearningCenter from '@/pages/resources/LearningCenter';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        
        {/* Products */}
        <Route path="/products" element={<ProductsOverview />} />
        <Route path="/products/comparison" element={<ProductComparison />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        
        {/* Workflows */}
        <Route path="/workflows" element={<WorkflowsOverview />} />
        <Route path="/workflows/:workflowId" element={<WorkflowPage />} />
        
        {/* Technology */}
        <Route path="/technology" element={<Technology />} />
        
        {/* Resources */}
        <Route path="/resources" element={<LearningCenter />} />
        <Route path="/resources/videos" element={<VideoLibrary />} />
        <Route path="/resources/videos/:videoId" element={<VideoDetail />} />
        <Route path="/resources/demos" element={<ProductDemos />} />
        <Route path="/resources/tutorials" element={<Tutorials />} />
        <Route path="/resources/documentation" element={<Documentation />} />
        <Route path="/resources/release-notes" element={<ReleaseNotes />} />
        <Route path="/resources/faq" element={<FAQ />} />
        <Route path="/resources/faq/solidworks" element={<FAQSolidworks />} />
        <Route path="/resources/faq/studio" element={<FAQStudio />} />
        
        {/* Pricing & Downloads */}
        <Route path="/pricing" element={<PricingOverview />} />
        <Route path="/pricing/plans" element={<Pricing />} />
        <Route path="/pricing/trials" element={<TrialDownloads />} />
        <Route path="/pricing/downloads" element={<ProductDownloads />} />
        <Route path="/pricing/upgrades" element={<UpgradeInfo />} />
        
        {/* Support */}
        <Route path="/support" element={<SupportOverview />} />
        <Route path="/support/getting-started" element={<GettingStarted />} />
        <Route path="/support/tutorials" element={<TutorialsByProduct />} />
        <Route path="/support/installation" element={<Installation />} />
        <Route path="/support/release-notes" element={<SupportReleaseNotes />} />
        <Route path="/support/contact" element={<ContactSupport />} />
        <Route path="/support/system-requirements" element={<SystemRequirements />} />

        {/* Newsletter, Events & Resellers */}
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resellers" element={<Resellers />} />
        
        {/* Customer Comments */}
        <Route path="/customers/:groupId" element={<CustomerComments />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App