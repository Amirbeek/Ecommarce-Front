import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react"; // Correct import for useState
import Navbar from "@/pages/components/Nav";
import Logo from './Logo';
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
    const [showNav, setShowNav] = useState(false);
    const { data: session } = useSession();

    if (!session) {
        return (
            <div>

                <div className="bg-bgGray w-screen h-screen flex items-center">
                    <div className="text-center w-full">
                        <button onClick={() => signIn('google')} className="bg-white p-2 rounded-lg text-black px-4">
                            Login with Google
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'bg-bgGray min-h-screen '}>
            <div className={'block md:hidden flex  p-4'}>
                <button onClick={() => setShowNav(true)} className={'text-black'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <div className={'flex grow justify-center mr-6'}>
                    <Logo />
                </div>
            </div>
            <div className={'flex'}>
                <Navbar show={showNav} />
                <div className={' text-black flex-grow  rounded-lg p-5 mb-0'}>
                    {children}
                </div>
            </div>
        </div>
    );
}
