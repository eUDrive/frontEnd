import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';

function HomePage() {
    return (
        <div>
            <Hero />
            <Features />
            <Testimonials />
            <CTA />
        </div>
    );
}

export default HomePage;
