import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/auth-helpers"
import { i18n } from "@/i18n-config"

export const isGoogleAuthEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

const providers = [
  ...(isGoogleAuthEnabled
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : []),
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const parsed = loginSchema.safeParse(credentials)
      if (!parsed.success) return null

      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
      if (!user?.password) return null

      const passwordsMatch = await bcrypt.compare(parsed.data.password, user.password)
      if (!passwordsMatch) return null

      return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
    },
  }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  pages: {
    signIn: `/${i18n.defaultLocale}/login`,
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id
        token.role = user.role ?? "USER"
      }
      // Recarrega o papel quando a sessao e atualizada (ex.: promovido a admin)
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({ where: { id: token.id }, select: { role: true } })
        if (fresh) token.role = fresh.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
})
