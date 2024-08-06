import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session, token, user }) {
            console.log('Session:', session);
            console.log('Token:', token);
            console.log('User:', user);

            // Temporarily allow everyone
            return session;
        },
    },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);

    // Temporarily allow everyone
    if (!session) {
        res.status(401);
        res.end();
        throw new Error('Not authenticated');
    }

    // If you still want to throw an error for not authenticated users
    // if (!session) {
    //     res.status(401);
    //     res.end();
    //     throw new Error('Not authenticated');
    // }

    // Remove the admin email check for now
    // if (!adminEmails.includes(session?.user?.email)) {
    //     res.status(401);
    //     res.end();
    //     throw new Error('Not admin');
    // }
}
