console.log("Starting test...");

const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Library imported");

const genAI = new GoogleGenerativeAI("AIzaSyAI1lARW-uqZ4_LHow-t1nQIezA52yKQjQ");

async function testAPI() {
  console.log("Calling model...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent("Say hello in 3 languages.");
    const response = await result.response;
    const text = response.text();
    console.log("✅ API Key is working!\n");
    console.log(text);
  } catch (error) {
    console.error("❌ API Key test failed:\n", error.message || error);
  }
}

testAPI();
