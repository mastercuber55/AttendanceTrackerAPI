const res = await fetch("https://attendancetrackerapi.netlify.app/.netlify/functions/signup", {
    method: "POST",
    body: JSON.stringify({ username: "mastercuber55", password: "cubenerd09" }),
  });
console.log(res)