# Cloudflare Worker Setup for Groq AI (Mahi)

আপনার Groq API Key গুলো সুরক্ষিত রাখতে এবং Browser এ সরাসরি ফাঁস না করতে আমরা একটি Cloudflare Worker ব্যবহার করছি। এই Worker টি আপনার API Key গুলো গোপন রাখবে এবং Portfolio থেকে আসা অনুরোধগুলো Groq API তে পাঠিয়ে দিবে।

## ১. Cloudflare Worker তৈরি করা

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) এ লগইন করুন।
2. বাম পাশের মেনু থেকে **Workers & Pages** এ যান।
3. **Create Application** বাটনে ক্লিক করুন, তারপর **Create Worker** এ ক্লিক করুন।
4. আপনার Worker এর একটি নাম দিন (যেমন: `mohasin-ai-worker`) এবং **Deploy** এ ক্লিক করুন।
5. এবার **Edit Code** বাটনে ক্লিক করে নিচের কোডটি সেখানে পেস্ট করে দিন।

## ২. Worker কোড (JavaScript)

নিচের সম্পূর্ণ কোডটি কপি করে Worker এর `worker.js` বা `index.js` ফাইলে পেস্ট করুন:

```javascript
export default {
  async fetch(request, env, ctx) {
    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // আপনার নির্দিষ্ট ডোমেইন দিলে আরও ভালো (যেমন: https://mohasin.is-a.dev)
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Please send a POST request", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // GROQ_KEYS environment variable থেকে key গুলো নিন (Comma separated)
      const keys = env.GROQ_KEYS.split(",").map(k => k.trim());

      let lastError = null;

      // Rotate through keys
      for (const key of keys) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
              model: body.model || "llama-3.1-8b-instant",
              messages: body.messages,
              max_tokens: body.max_tokens || 600,
              temperature: body.temperature || 0.7
            })
          });

          if (response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify(data), {
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          } else {
            const err = await response.json();
            lastError = err.error?.message || "Groq API Error";
            console.error(`Key failed: ${key.substring(0, 10)}... Error: ${lastError}`);
            // If rate limited or other common errors, try next key
            continue;
          }
        } catch (e) {
          lastError = e.message;
          continue;
        }
      }

      return new Response(JSON.stringify({ error: "All keys failed. Last error: " + lastError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
```

## ৩. API Key (Secrets) সেটআপ করা

1. Worker কোড সেভ এবং ডেপ্লয় করার পর, Worker এর Dashboard এ ফিরে যান।
2. **Settings** ট্যাবে ক্লিক করুন।
3. বাম পাশের মেনু থেকে **Variables** এ যান।
4. **Environment Variables** সেকশনে **Add Variable** এ ক্লিক করুন।
5. Variable Name দিন: `GROQ_KEYS`
6. Value এর ঘরে আপনার সবগুলো API Key কমা (`,`) দিয়ে লিখে দিন। উদাহরণ:
   `gsk_key1, gsk_key2, gsk_key3`
7. **Encrypt** বাটনে ক্লিক করুন (যাতে কেউ কি গুলো দেখতে না পারে) এবং **Save and Deploy** এ ক্লিক করুন।

## ৪. Portfolio আপডেট করা

আপনার Worker এর URL টি কপি করুন (যেমন: `https://mohasin-ai-worker.yourname.workers.dev`) এবং `index.html` ফাইলের `WORKER_URL` ভেরিয়েবলে এটি বসিয়ে দিন।

এখন আপনার Portfolio পুরোপুরি নিরাপদ এবং API Key গুলো আর কেউ চুরি করতে পারবে না!
