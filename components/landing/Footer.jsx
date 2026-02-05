"use client";

import { Shield, Twitter, Linkedin, Github, Youtube, Mail, ArrowRight, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="bg-[#020617] text-slate-400 py-20 border-t border-white/5">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    {/* Column 1: Brand */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
                                <Shield className="h-4 w-4 fill-current" />
                            </div>
                            <span className="font-bold tracking-tight text-xl text-white">
                                Invest<span className="text-slate-500">Pro</span>
                            </span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed max-w-sm">
                            The premier institutional terminal for professional wealth tracking and
                            sovereign-grade asset management. We prioritize audit finality and
                            identity isolation for all capital nodes.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Platform */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Protocol</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="#features" className="hover:text-blue-500 transition-colors">Services</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-blue-500 transition-colors">Verification</Link></li>
                            <li><Link href="#indices" className="hover:text-blue-500 transition-colors">Market Nodes</Link></li>
                            <li><Link href="/login" className="hover:text-blue-500 transition-colors">Terminal Access</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Governance */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Governance</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Audits</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Whitepaper</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Legal Framework</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Sync Reports</h4>
                        <p className="text-sm font-medium leading-relaxed">Subscribe to receive weekly forensic auditing digests and market volatility alerts.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Institutional email..."
                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-blue-600 transition-colors"
                            />
                            <Button size="icon" className="h-11 w-11 bg-blue-600 hover:bg-blue-700 rounded-xl">
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                            <Landmark className="w-3 h-3" />
                            Certified Institutional Partner
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            &copy; {new Date().getFullYear()} InvestPro Capital Management Protocol. All nodes verified.
                        </p>
                        <p className="text-[9px] font-medium text-slate-600 max-w-xl leading-relaxed italic">
                            Disclaimer: InvestPro is a premium tracking and settlement interface.
                            Past performance is not indicative of future results. All capital is
                            protected by the IPN-8 sovereign guarantee. Access is restricted to
                            authorized investors only.
                        </p>
                    </div>
                    <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Registry</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
