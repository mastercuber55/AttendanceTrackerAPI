export default async function handler(msg) {

  try {
    // Sending POST request to Discord Webhook
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: msg }),
    });

    if (!response.ok)
      console.error('Failed to send message to Discord:', response.statusText);

    return console.log("Notification sent to Discord!")
  } catch (error) {
    console.error('Error:', error);
  }
}
