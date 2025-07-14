import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import authBg2 from "../assets/authBg7.jpg";
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition(); // ⏳ Delay se race condition avoid hoti hai
      }, 800);
    };
    synth.cancel(); // 🛑 pehle se koi speech ho to band karo
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "news-headlines") {
      window.open(`https://news.google.com/topstories`, "_blank");
    }

    if (type === "github-open") {
      window.open(`https://github.com/`, "_blank");
    }

    if (type === "twitter-open") {
      window.open(`https://twitter.com/`, "_blank");
    }

    if (type === "linkedin-open") {
      window.open(`https://www.linkedin.com/`, "_blank");
    }

    if (type === "spotify-open") {
      window.open(`https://open.spotify.com/`, "_blank");
    }

    if (type === "whatsapp-web") {
      window.open(`https://web.whatsapp.com/`, "_blank");
    }

    if (type === "gmail-open") {
      window.open(`https://mail.google.com/`, "_blank");
    }

    if (type === "chatgpt-open") {
      window.open(`https://chat.openai.com/`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  const handleTextCommand = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setUserText(inputValue);
    setAiText("");
    const data = await getGeminiResponse(inputValue);
    handleCommand(data);
    setAiText(data.response);
    setUserText("");
    setInputValue("");
    setShowTextInput(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true; // flag to avoid setState on unmounted component

    // Start recognition after 1 second delay only if component still mounted
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    );
    greeting.lang = "hi-IN";

    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <>
      <div
        className="w-full h-[100vh] flex justify-center items-center flex-col gap-[15px] overflow-hidden"
        style={{
          backgroundImage: `url(${authBg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CgMenuRight
          className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(true)}
        />
        <div
          className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
            ham ? "translate-x-0" : "translate-x-full"
          } transition-transform`}
        >
          <RxCross1
            className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
            onClick={() => setHam(false)}
          />
          <button
            className="min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] "
            onClick={handleLogOut}
          >
            Log Out
          </button>
          <button
            className="min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] "
            onClick={() => navigate("/customize")}
          >
            Customize your Assistant
          </button>

          <div className="w-full h-[2px] bg-gray-400"></div>
          <h1 className="text-white font-semibold text-[19px]">History</h1>

          <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate">
            {userData.history?.map((his) => (
              <div className="text-gray-200 text-[18px] w-full h-[30px]  ">
                {his}
              </div>
            ))}
          </div>
        </div>
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] "
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block "
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>
        <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
          <img
            src={userData?.assistantImage}
            alt=""
            className="h-full object-cover"
          />
        </div>
        <h1 className="text-white text-[18px] font-semibold">
          I'm {userData?.assistantName}
        </h1>
        {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
        {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

        <h1 className="text-white text-[18px] font-semibold text-wrap">
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
      <button
        className="fixed right-2 md:right-8 bottom-20 md:bottom-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg z-50 transition-colors duration-200 w-[44vw] max-w-[120px] md:w-auto md:max-w-none text-sm md:text-lg"
        onClick={() => setShowTextInput((prev) => !prev)}
        style={{ transition: "background 0.2s" }}
      >
        {showTextInput ? "Close" : "Text"}
      </button>
      {showTextInput && (
        <form
          onSubmit={handleTextCommand}
          className="fixed right-2 md:right-8 bottom-32 md:bottom-40 bg-white rounded-xl shadow-lg flex items-center p-2 z-50 min-w-[85vw] max-w-[98vw] md:min-w-[250px] md:max-w-[90vw]"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
        >
          <input
            type="text"
            className="flex-1 outline-none px-2 py-2 rounded-l-xl text-black text-[14px] md:text-[16px] w-[40vw] md:w-auto"
            placeholder="Type your command..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white px-2 md:px-4 py-2 rounded-r-xl font-semibold text-xs md:text-base"
          >
            Send
          </button>
        </form>
      )}
      <footer
        className="w-full text-center py-2 md:py-3 bg-black/70 text-white fixed left-0 bottom-0 z-10 text-xs md:text-base tracking-wide px-1 md:px-2"
        style={{ fontSize: undefined, letterSpacing: undefined }}
      >
        © 2024 VocaYou - Personal Virtual Assistant
      </footer>
    </>
  );
}

export default Home;
