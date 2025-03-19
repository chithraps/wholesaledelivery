import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  let token = req.cookies.get("tdAuth")?.value || req.cookies.get("adminAuth")?.value;

  console.log("Verifying token... ", token);

  if (!token || token.trim() === "") {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next(); 
    }
    console.log("Unauthorized: No token provided");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    if (!token.includes(".")) throw new Error("Invalid token format");
    
    const secret = new TextEncoder().encode(process.env.JWTPRIVATEKEY);
    const { payload } = await jwtVerify(token, secret);
    
    console.log("Token Verified:", payload);
    const role = payload.role;

    
    if (req.nextUrl.pathname === "/") {
      console.log("hello")
      if (role === "truckDriver") {
        return NextResponse.redirect(new URL("/truckDriver/tdDashboard", req.url));
      }
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    // Role-based access control
    if (req.nextUrl.pathname.startsWith("/truckDriver") && role !== "truckDriver") {
      console.log("Unauthorized: Cannot access truck driver routes");
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      console.log("Unauthorized: Cannot access admin routes");
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/","/truckDriver/:path*", "/admin/:path*"],
};
