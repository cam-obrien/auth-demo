import NextAuth from 'next-auth'
import OktaProvider from 'next-auth/providers/okta'
import axios from 'axios'

export const authOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_OAUTH2_CLIENT_ID as string,
      clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET as string,
      issuer: process.env.OKTA_OAUTH2_ISSUER as string,
    })
  ],
  secret: process.env.SECRET as string,
  callbacks: {
    async jwt({ token, account }: any) {
        if (account) {
            console.log(account)
            console.log(token)
            token.accessToken = account.access_token;
            token.idToken = account.id_token;
            token.oktaId = account.providerAccountId;
            console.log(account.sid_token)
            
        }

				// Decrypting JWT to check if expired
        var tokenParsed = JSON.parse(Buffer.from(token.idToken.split('.')[1], 'base64').toString());
        const dateNowInSeconds = new Date().getTime() / 1000
        if (dateNowInSeconds > tokenParsed.exp) {
             throw Error("expired token");
        }

        /*const res = await fetch(`https://trial-2094636.okta.com/api/v1/${JSON.stringify(token.oktaId)})`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `SSWS ${JSON.stringify(token.accessToken)}`,
  
          },
        })*/


				return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.oktaId = token.oktaId;
      return session;
    }
  },
}

export default NextAuth(authOptions)