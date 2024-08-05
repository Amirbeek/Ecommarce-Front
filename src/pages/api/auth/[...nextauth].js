import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';

// const adminEmails = ['yumeeservice@gmail.com', 'ashomurodo@gmail.com'];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGlE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise)
  /*  callbacks: {
        async session({ session, token, user }) {
            console.log('Session:', session);
            console.log('Token:', token);
            console.log('User:', user);

            // if (adminEmails.includes(session?.user?.email)) {
            //     console.log('Admin session:', session);
            //     return session;
            // } else {
            //     console.log('Non-admin session:', session);
            //     return false;
            // }
    //     },
    // },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401);
        res.end();
        t?hr  Error('Not admin');
    }
}