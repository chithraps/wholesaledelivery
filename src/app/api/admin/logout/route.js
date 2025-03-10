export async function POST(req) {
    try {
        console.log("admin Successfully logged out");

        return new Response(JSON.stringify({ message: "Logged out successfully" }), {
            status: 200,
            headers: {
                "Set-Cookie": "adminAuth=; Path=/admin; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Logout failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
