import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Users, BarChart3, Shield, Globe, Clock, CheckCircle } from 'lucide-react';
import HeroSection from '../../components/website/HeroSection';
import FeatureCard from '../../components/website/FeatureCard';
import PricingCard from '../../components/website/PricingCard';
import TestimonialCarousel from '../../components/website/TestimonialCarousel';
import ChatbotWidget from '../../components/website/ChatbotWidget';
import WebsiteLayout from '../../layouts/WebsiteLayout';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const features = [
        {
            icon: Layers,
            title: "All-In-One Management",
            description: "Manage students, teachers, parents, and staff in a single unified platform. No more scattered spreadsheets.",
            delay: 0.1
        },
        {
            icon: Users,
            title: "Seamless Communication",
            description: "Instant notifications and messaging bridge the gap between school and home, keeping parents in the loop.",
            delay: 0.2
        },
        {
            icon: BarChart3,
            title: "Insightful Analytics",
            description: "Make data-driven decisions with comprehensive reports on attendance, performance, and financials.",
            delay: 0.3
        },
        {
            icon: Shield,
            title: "Bank-Grade Security",
            description: "Your data is protected with enterprise-level encryption and regular backups. Safety is our priority.",
            delay: 0.4
        },
        {
            icon: Globe,
            title: "Accessible Anywhere",
            description: "Cloud-based access allows you to manage your school from any device, anytime, anywhere.",
            delay: 0.5
        },
        {
            icon: Clock,
            title: "Time-Saving Automation",
            description: "Automate routine tasks like attendance tracking and fee collection to focus on what matters most.",
            delay: 0.6
        }
    ];

    const pricingPlans = [
        {
            tier: "Starter",
            price: "49",
            features: ["Up to 200 Students", "Basic Reporting", "Attendance Tracking", "Email Support"],
            recommended: false
        },
        {
            tier: "Professional",
            price: "149",
            features: ["Up to 1,000 Students", "Advanced Analytics", "Parent Portal", "Priority Support", "Library Module"],
            recommended: true
        },
        {
            tier: "Enterprise",
            price: "299",
            features: ["Unlimited Students", "Custom Integrations", "Dedicated Account Manager", "API Access", "Multi-School Support"],
            recommended: false
        }
    ];

    return (
        <WebsiteLayout>
            <HeroSection />

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Run Your School</h2>
                        <p className="text-lg text-slate-600">Powerful tools designed to simplify administration and enhance the learning experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section id="about" className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">About EduSync</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            EduSync specializes in creating digital solutions to manage the administrative, academic, and communication needs of educational institutions. These range from K-12 schools to large-scale universities.
                        </p>
                        <p className="text-lg text-slate-300 leading-relaxed mt-4">
                            The industry has shifted from simple record-keeping databases to complex, AI-driven ecosystems that manage everything from student mental health tracking to automated grading.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Schools Trusted", value: "2,500+" },
                            { label: "Students Managed", value: "1M+" },
                            { label: "Countries", value: "45+" },
                            { label: "Uptime", value: "99.9%" }
                        ].map((stat, index) => (
                            <div key={index} className="p-4">
                                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">{stat.value}</div>
                                <div className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2 block">Simple Pricing</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Plans for Schools of All Sizes</h2>
                        <p className="text-lg text-slate-600">Transparent pricing with no hidden fees. Scale as you grow.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <PricingCard key={index} {...plan} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Trusted by Educators Worldwide</h2>
                    <TestimonialCarousel />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10 text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your School?</h2>
                    <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">Join thousands of schools that are saving time and improving education with EduSync.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl shadow-xl hover:bg-slate-100 transition-colors">
                            Get Started for Free
                        </button>
                        <button className="px-8 py-4 bg-primary-700 text-white font-bold rounded-xl border border-primary-500 hover:bg-primary-800 transition-colors">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>

            <ChatbotWidget />
        </WebsiteLayout>
    );
}
