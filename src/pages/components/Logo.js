import Link from 'next/link';
export default function Logo(){
    return(
        // eslint-disable-next-line react/jsx-no-undef
        <Link href="/" className="flex gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span>E-Commerce Admin</span>
        </Link>
    )
}