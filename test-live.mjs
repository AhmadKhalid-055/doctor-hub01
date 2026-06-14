const BASE_URL = "https://doctor-hub01.vercel.app/api";

async function runTests() {
  console.log("🔍 Checking database connection status...\n");
  const res = await fetch(`${BASE_URL}/debug`);
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

runTests();
