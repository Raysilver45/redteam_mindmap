import * as motion from "motion/react-client";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full py-24 flex items-center bg-background justify-center overflow-hidden px-4">
            {/* On passe en max-w-7xl pour s'aligner sur les autres blocs */}
            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-6 font-semibold"
                >
                    Offensive security Research & Tooling
                </motion.span>

                {/* Bloc de Texte Centré */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-riant font-bold text-foreground leading-[0.80] mb-8">
                        Here to <br />
                        <span className="line-through ">ethically</span> <br />
                        <span className="text-primary font-normal italic">Pwn</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Just sharing knowledge about hacking.
                    </p>

                    {/* Boutons Centrés */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Button
                            size="lg"
                            className="group relative h-14 px-8 min-w-[230px] flex justify-center bg-primary hover:bg-primary/90 text-primary-foreground active:translate-y-[2px] transition-all rounded-lg overflow-hidden border border-primary/20 rounded-[0.5rem]"
                            asChild
                        >
                            <Link href="/publications" className="flex items-center gap-3">
                                <span className="italic font-bold tracking-wide text-lg">Read the latest post</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>

                        {/* Deuxième Bouton - Crème */}
                        <Button
                            size="lg"
                            className="group relative h-14 px-8 min-w-[230px] flex justify-center bg-[#EDE7DF] hover:bg-[#EDE7DF]/90 text-black active:translate-y-[2px] transition-all rounded-lg overflow-hidden border border-black/10 shadow-sm rounded-[0.5rem]"
                            asChild
                        >
                            <Link href="/labs" className="flex items-center gap-3">
                                <span className="italic font-bold tracking-wide text-lg">Enter the Labs</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}