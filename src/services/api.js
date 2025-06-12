const BASE_URL = "https://frontend-take-home-service.fetch.com";

export const login = async ({ name, email }) => {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // REQUIRED for session cookies
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) {
    const text = await res.text(); // might return plain text error
    throw new Error(`Login failed: ${text}`);
  }
  return;
};

// make sure endpoint handles the following
// Validate the input format & if user exists: 
// data length, type, format, etc.... 
