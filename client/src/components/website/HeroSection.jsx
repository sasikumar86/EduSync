import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <section ref={targetRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-primary-50">
            {/* Background Elements */}
            <div className="absolute inset-0 w-full h-full opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div style={{ opacity, scale }} className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-100/50 text-primary-700 text-sm font-semibold mb-6 border border-primary-200">
                        Reimagining School Management 🚀
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
                        Empower Your School with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                            Intelligent Automation
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        EduSync streamlines administration, enhances learning, and connects your entire school community with an all-in-one cloud platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            Start Free Trial <ChevronRight size={20} />
                        </Link>
                        <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all hover:scale-105 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                <Play size={16} className="text-primary-600 ml-1" />
                            </div>
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Hero Image/Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-16 mx-auto max-w-5xl rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden bg-white/50 backdrop-blur-xl"
                >
                    <div className="aspect-[16/9] bg-slate-100 relative group">
                        {/* Placeholder for actual dashboard screenshot */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium bg-gradient-to-br from-slate-100 to-slate-200">
                            <div className="text-center">
                                <p>Interactive Dashboard UI Preview</p>
                                <span className="text-xs opacity-60">(Video/Image Placeholder)</span>
                            </div>
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent opacity-20"></div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
