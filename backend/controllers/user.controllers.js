import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "updateAssistantError user error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command);
    user.save();
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    console.log(gemResult);
    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("MMMM")}`,
        });
      case "get-year":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current year is ${moment().format("YYYY")}`,
        });
      case "motivation-quote":
        const quotes = [
          "Believe you can and you're halfway there.",
          "Push yourself, because no one else is going to do it for you.",
          "Your limitation—it's only your imagination.",
          "Success is not final, failure is not fatal.",
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: randomQuote,
        });
      case "set-reminder":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Reminder set: ${
            gemResult.reminder || "You have something important to remember."
          }`,
        });
      case "get-weather":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: "Fetching live weather data is under development.",
        });
      case "generate-idea":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response || "Here’s a creative idea for you!",
        });
      case "word-meaning":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response || "Here is the definition of the word.",
        });
      case "code-snippet":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:
            gemResult.response || "Here is a code snippet that might help.",
        });
      case "song-suggestion":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:
            gemResult.response ||
            "Try listening to 'Blinding Lights' by The Weeknd.",
        });
      case "meditation-tips":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:
            "Try deep breathing for 5 minutes. Focus on your breath. Let go of all thoughts.",
        });
      case "math-solver":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:
            gemResult.response || "Here is the solution to your math problem.",
        });
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
      case "news-headlines":
      case "github-open":
      case "twitter-open":
      case "linkedin-open":
      case "spotify-open":
      case "whatsapp-web":
      case "gmail-open":
      case "chatgpt-open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    return res.status(500).json({ response: "ask assistant error" });
  }
};
