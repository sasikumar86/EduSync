import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingCard({ tier, price, features, recommended }) {
    return (
        <div className={`relative p-8 bg-white rounded-2xl border ${recommended ? 'border-primary-500 shadow-xl shadow-primary-500/10 scale-105 z-10' : 'border-slate-200 shadow-sm hover:shadow-md'} flex flex-col h-full transition-all`}>
            {recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                </span>
            )}

            <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{tier}</h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">${price}</span>
                    <span className="text-slate-500 text-sm">/month</span>
                </div>
                <p className="text-slate-500 text-sm mt-3">Billed annually</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Link
                to="/contact"
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors text-center ${recommended
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
            >
                Choose Plan
            </Link>
        </div>
    );
}
