import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@/util/db"
import Email from "next-auth/providers/email";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

const prisma = getPrisma()

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          }
        })
        const passwordValid = await bcrypt.compare(credentials?.password, user?.password!)
        if (passwordValid) return user;
        return null;
      }
    })
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }