import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../../lib/mongodb';
import { Admin } from "../../../../models/Admin";
import { getServerSession } from 'next-auth';

async function isAdminEmail(email) {
    return !!(await Admin.findOne({ email }));
}

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session }) {
            if (session?.user?.email) {
                const isAdmin = await isAdminEmail(session.user.email);
                session.isAdmin = isAdmin;
            } else {
                session.isAdmin = false;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.isAdmin) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
