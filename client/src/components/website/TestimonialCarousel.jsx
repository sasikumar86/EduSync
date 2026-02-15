import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        content: "EduSync has completely transformed how we manage our school. The automated grading and attendance systems save our teachers hours every week.",
        author: "Sarah Johnson",
        role: "Principal, Green Valley High",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        content: "The best school management software we've used. The parent portal has significantly improved communication with families.",
        author: "Michael Chen",
        role: "Administrator, Tech Academy",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        content: "Support is fantastic, and the platform is incredibly intuitive. It handles everything from fees to library management seamlessly.",
        author: "Emily Davis",
        role: "Director, Future Scholars",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
];

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative max-w-4xl mx-auto px-4">
            <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4 text-primary-100">
                <Quote size={80} fill="currentColor" />
            </div>

            <div className="relative h-[300px] flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic mb-8 relative z-10">
                            "{testimonials[current].content}"
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={testimonials[current].image}
                                alt={testimonials[current].author}
                                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div>
                                <h4 className="font-bold text-slate-900">{testimonials[current].author}</h4>
                                <p className="text-slate-500 text-sm">{testimonials[current].role}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-primary-600 w-8' : 'bg-slate-300 hover:bg-primary-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
