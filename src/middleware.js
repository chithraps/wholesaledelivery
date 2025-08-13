import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  let token = req.cookies.get("tdAuth")?.value || req.cookies.get("adminAuth")?.value;

  console.log("Verifying token... ",token);
  
  if (!token || token.trim() === "") {
    console.log("Unauthorized: No token provided");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWTPRIVATEKEY);
    const { payload } = await jwtVerify(token, secret);
    
    console.log("Token Verified:", payload);

    // Role-based access control
    const role = payload.role;

    if (req.nextUrl.pathname.startsWith("/truckDriver") && role !== "truckDriver") {
      console.log("Unauthorized:  cannot access truck driver routes");
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      console.log("Unauthorized:  cannot access admin routes");
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/truckDriver/tdDashboard/:path*", "/admin/dashboard/:path*"], 
};
