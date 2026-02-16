import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';

// Premium Landing Components
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustBar from '../components/landing/TrustBar';
import Features from '../components/landing/Features';
import WhyStudyPulse from '../components/landing/WhyStudyPulse';
import HowItWorks from '../components/landing/HowItWorks';
import StatsRow from '../components/landing/StatsRow';
import Pricing from '../components/landing/Pricing';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [initialEmail, setInitialEmail] = useState('');

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const openAuth = (mode, email = '') => {
        setInitialEmail(email);
        setAuthMode(mode);
        setShowAuth(true);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <Navbar onOpenAuth={openAuth} />

            <main>
                <Hero onOpenAuth={openAuth} />
                <TrustBar />
                <Features />
                <WhyStudyPulse />
                <HowItWorks />
                <StatsRow />
                <Pricing onOpenAuth={openAuth} />
                <FinalCTA onOpenAuth={openAuth} />
            </main>

            <Footer />

            {showAuth && (
                <AuthModal
                    mode={authMode}
                    initialEmail={initialEmail}
                    onClose={() => setShowAuth(false)}
                    setMode={setAuthMode}
                />
            )}
        </div>
    );
};

export default Home;
