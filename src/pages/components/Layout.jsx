import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from "@/pages/components/Nav"
const inter = Inter({ subsets: ["latin"] });

export default function Layout({children}) {
    const { data: session } = useSession();
    if (!session) {
        return (
            <div>
                <div className="bg-blue-900 w-screen h-screen flex items-center">
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
        <div className={'bg-blue-900 min-h-screen color-white  flex ' }>
            <Navbar/>
            <div className={'bg-white text-black flex-grow mt-1 mr-2 rounded-lg p-5 mb-0'}>
                {children}
            </div>
        </div>
    );
}
