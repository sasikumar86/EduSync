import WebsiteLayout from '../../layouts/WebsiteLayout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <WebsiteLayout>
            <div className="bg-primary-600 py-20 text-white text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">We'd love to hear from you. Our team is always here to chat.</p>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-slate-900 text-white p-10 md:w-2/5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Phone</h5>
                                        <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Email</h5>
                                        <p className="text-slate-400 text-sm">hello@edusync.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold mb-1">Office</h5>
                                        <p className="text-slate-400 text-sm">
                                            123 Education Lane,<br />
                                            Tech Valley, CA 94043
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                                        <div className="w-4 h-4 bg-current opacity-50"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-10 md:w-3/5 bg-white">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" placeholder="How can we help you?" />
                            </div>

                            <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}
