const res = await fetch("https://attendancetrackerapi.netlify.app/.netlify/functions/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Make sure to set the correct headers
    },
    body: JSON.stringify({ username: "mastercuber55", password: "cubenerd09" }),
  });
  
  if (res.ok) {
    const data = await res.json(); // Parse the JSON response
    const token = data.token; // Extract the token from the response
    console.log("Token:", token);
  } else {
    const error = await res.json();
    console.error("Login failed:", error);
  }
  