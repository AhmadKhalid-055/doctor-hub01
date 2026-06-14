const BASE_URL = "https://doctor-hub01.vercel.app/api";

async function testRegister() {
  console.log("🔍 Testing registration on live server...");
  const email = `test_user_${Date.now()}@example.com`;
  const payload = {
    firstName: "Test",
    lastName: "User",
    email,
    password: "Password123!",
    role: "PATIENT"
  };

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Request failed:", err);
  }
}

testRegister();
