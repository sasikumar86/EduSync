import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all hover:-translate-y-1 group"
        >
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </motion.div>
    );
}
