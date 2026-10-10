import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/login", "/register"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isLoggedIn = !!req.auth;

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
