// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import flagsmith from "flagsmith/next-middleware";

export async function middleware(request: NextRequest) {
    const identity = request.cookies.get("user");

    if (!identity) { // redirect to homepage
        return NextResponse.redirect(new URL('/', request.url))
    }

    await flagsmith.init({
        environmentID:"VmyxnCfVjyrrRZZTt8pD95",
        identity
    })

    //redirect to an account page based on the multivariate flag
    return NextResponse.redirect(new URL(`/account/${flagsmith.getValue("colour")}`, request.url))
}

export const config = {
    matcher: '/login',
}
