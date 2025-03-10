export async function POST(req, res) {
    try {
        console.log("sucessfully loggedout")
        return new Response(JSON.stringify({ message: "Logged out successfully" }), {
            status: 200,
            headers: {
                "Set-Cookie": "tdAuth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
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