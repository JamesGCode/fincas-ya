async function test() {
  try {
    const loginRes = await fetch("https://app.fincasya.cloud/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password123" })
    });
    console.log("LOGIN STATUS:", loginRes.status);
    const cookies = loginRes.headers.get("set-cookie");
    console.log("COOKIES:", cookies);

    const inboxRes = await fetch("https://app.fincasya.cloud/api/inbox", {
      headers: { "Cookie": cookies || "" }
    });
    console.log("INBOX API STATUS:", inboxRes.status);
    const text = await inboxRes.text();
    console.log("INBOX API:", JSON.stringify(JSON.parse(text), null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
