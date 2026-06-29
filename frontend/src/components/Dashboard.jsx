// =======================
// CSS
// =======================
import "./Dashboard.css";


// =======================
// React
// =======================
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";


// =======================
// Components
// =======================
import Nav from "../components/NavDash";
import Sphere from "../components/Sphere";


// =======================
// Animation
// =======================
import gsap from "gsap";


// =======================
// Groq API
// =======================
import groq from "../groq";


// =======================
// Icons
// =======================
import {
    HiMiniSignal,
    HiMiniChartBar,
    HiMiniMicrophone,
    HiMiniExclamationCircle
} from "react-icons/hi2";


// Browser Speech Recognition object
let recognition = null;


// Store previous conversation.
// This helps AI remember what the user said earlier.
const chatHistory = [

    {

        role: "system",

        content: `
          You are SpeakQuest, an AI English Speaking Coach.

          The user's input comes from browser speech recognition.

          Your job is to:

          1. Continue the conversation naturally.
          2. Check only spoken English grammar.
          3. Ignore punctuation mistakes.
          4. Ignore capitalization mistakes.
          5. Ignore speech recognition errors if they are obvious.
          6. Count filler words like:
            - um
            - uh
            - like
            - you know
            - actually
            - basically
            - hmm
            - okay
            - ok

          Give the following information:

            - reply
            - grammarMistakes
            - fluency
            - confidence
            - fillers(number)
            - fillerWords (array of filler words used)
            - mistakes
            - correctSentence

          Rules:

            - If there are no grammar mistakes:
              grammarMistakes = 0
              mistakes = []
              correctSentence = ""

            Fluency Score:

            90-100 : Excellent
            70-89  : Good
            50-69  : Average
            Below 50 : Needs Improvement

            Return ONLY valid JSON.

            Example:
            {
             "reply":"",
             "grammarMistakes":0,
             "fluency":0,
             "confidence":0,
             "fillers":0,
             "fillerWords":[],
             "mistakes":[],
             "correctSentence":""
            }
            Do not return markdown.
            Do not explain your answer.
            Return JSON only.
            If no filler words are used:
            fillers = 0
            fillerWords = []
            `   
    }
];

const Dashboard = () => {

    // ==========================
    // References
    // ==========================
    const welcomeRef = useRef(null);

    // ==========================
    // Logged In User
    // ==========================
    const user = JSON.parse(localStorage.getItem("user"));

    // ==========================
    // Conversation
    // ==========================
    const [transcript, setTranscript] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    // ==========================
    // Analysis Scores
    // ==========================
    const [fluencyScore, setFluencyScore] = useState("--");
    const [confidenceScore, setConfidenceScore] = useState("--");
    const [grammarMistakes, setGrammarMistakes] = useState(0);
    const [fillersCount, setFillersCount] = useState(0);
    const [fillerWords, setFillerWords] = useState([]);

    // ==========================
    // Grammar Feedback
    // ==========================
    const [mistakes, setMistakes] = useState([]);
    const [correctSentence, setCorrectSentence] = useState("");

    // ==========================
    // Welcome Animation
    // ==========================
    useEffect(() => {

        gsap.fromTo(
            welcomeRef.current,

            {
                opacity: 0,
                y: -40,
                scale: 0.8
            },

            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.5
            }

        );

    }, []);

    // ==========================
    // Stop Listening & AI Voice
    // ==========================
    function stopSpeaking() {

        // Stop microphone if it is running
        if (recognition) {
            recognition.stop();
        }

        // Stop AI voice if it is speaking
        speechSynthesis.cancel();

    }


    // ==========================
    // AI Text To Speech
    // ==========================
    function speak(text) {

        // Don't speak if there is no text
        if (!text) {
            return;
        }

        const voice = new SpeechSynthesisUtterance(text);

        voice.lang = "en-US";

        speechSynthesis.speak(voice);

    }

    async function saveHistory(transcript, aiResult) {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        await axios.post("https://speakquest-backend.onrender.com/api/auth/login", {

            userId: user._id,

            transcript: transcript,

            aiReply: aiResult.reply,

            fluency: aiResult.fluency,

            confidence: aiResult.confidence,

            grammarMistakes: aiResult.grammarMistakes,

            fillers: aiResult.fillers,

            mistakes: aiResult.mistakes,

            correctSentence: aiResult.correctSentence,

        });

    }

    catch (error) {

        console.log(error);

    }

}

    // ==========================
    // Send User Message To AI
    // ==========================
    async function askAI(userMessage) {

        // Save the user's message
        chatHistory.push({

            role: "user",
            content: userMessage

        });

        try {

            // Send conversation to Groq AI
            const response = await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                messages: chatHistory

            });

            // Get AI response
            const aiMessage = response.choices[0].message.content;

            // Convert JSON string into JavaScript object
            const result = JSON.parse(aiMessage);
                        // Save AI reply in chat history
            chatHistory.push({

                role: "assistant",
                content: result.reply

            });

            // Update conversation
            setAiResponse(result.reply);

            // Update score cards
            setFluencyScore(result.fluency);
            setConfidenceScore(result.confidence);
            setGrammarMistakes(result.grammarMistakes);
            setFillersCount(result.fillers);
            setFillerWords(result.fillerWords);

            // Update grammar feedback
            setMistakes(result.mistakes);
            setCorrectSentence(result.correctSentence);

            // Return AI reply
            return result;

        }

        catch (error) {

            console.log("Groq Error :", error);

            setAiResponse("Sorry, something went wrong.");

            return "";

        }

    }
    // ==========================
    // Start Speech Recognition
    // ==========================
    function startListening() {

        // Store everything the user speaks
        let finalTranscript = "";

        // Browser Speech Recognition
        const SpeechRecognition =

            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        // Check if Speech Recognition is supported
        if (!SpeechRecognition) {

            alert("Speech Recognition is not supported in your browser.");

            return;

        }

        // Create Speech Recognition object
        recognition = new SpeechRecognition();

        // Recognition settings
        recognition.lang = "en-IN";
        recognition.continuous = true;
        recognition.interimResults = true;
        // ==========================
        // Microphone Started
        // ==========================
        recognition.onstart = function () {

            console.log("Listening...");

        };


        // ==========================
        // User Is Speaking
        // ==========================
        recognition.onresult = function (event) {

            let currentTranscript = "";

            // Combine all speech results
            for (let i = 0; i < event.results.length; i++) {

                currentTranscript += event.results[i][0].transcript;

            }

            // Save final transcript
            finalTranscript = currentTranscript;

            // Show transcript on screen
            setTranscript(currentTranscript);

        };
        // ==========================
        // User Finished Speaking
        // ==========================
        recognition.onend = async function () {

            if (!finalTranscript.trim()) {
              return;
            }

            // Get complete AI result
            const aiResult = await askAI(finalTranscript);

            // Save conversation
            await saveHistory(finalTranscript, aiResult);

            // Speak AI reply
           speak(aiResult.reply);
        };


        // ==========================
        // Speech Recognition Error
        // ==========================
        recognition.onerror = function (event) {

            console.log("Speech Error :", event.error);

        };


        // Start listening
        recognition.start();

    }

 return (
    <>
      <Nav />
      <div className="dashboard">
        <div className="welcome" ref={welcomeRef}>
          <h1 style={{color:"white", textAlign:"center"}}>
            Welcome, {user?.name}
        </h1>
        </div>
        <div className='ai'>
          <Sphere/>
          <div className="voice-buttons">
            <button onClick={startListening} className="speak">
                <HiMiniMicrophone /> Start Speaking
            </button>

            <button onClick={stopSpeaking} className="stop-btn">
              ⏹
            </button>
          </div>
         
            <div className="transcript-box">
              <h3>You</h3>
              <p>{transcript}</p>
            </div>

            <div className="ai-box">
              <h3>AI</h3>
              <p>{aiResponse}</p> 
              <h4>Grammar Mistakes</h4>
              <ul>
                {mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>


            <h4>Fillers Used</h4>

            {fillerWords.length === 0 ? (
              <p>No fillers used.</p>
            ) : (
            <ul>
               {fillerWords.map((word, index) => (
               <li key={index}>{word}</li>
            ))}
           </ul>
          )}
            <h4>Correct Sentence</h4>
            <p>{correctSentence}</p>
          </div>
        </div>
      
        <div className="track">

          <h2>Track Your Status</h2>

          <div className="card">
            <div className="icon purple">
              <HiMiniSignal />
            </div>

            <div className="content">
              <h3>Fillers Used</h3>
              <p>like, um, you know, etc.</p>
            </div>

            <div className="score">
              <span>{fillersCount}</span>
              <p>times</p>
            </div>
          </div>

          <div className="card">
            <div className="icon green">
              <HiMiniChartBar />
            </div>

            <div className="content">
              <h3>Fluency Rate</h3>
              <p>Your speaking fluency</p>
            </div>

            <div className="score">
              <span>{fluencyScore}</span>
              <p>/100</p>
            </div>
          </div>

          <div className="card">
            <div className="icon yellow">
              <HiMiniMicrophone />
            </div>

            <div className="content">
              <h3>Confidence</h3>
              <p>Confidence Score</p>
            </div>

            <div className="score">
              <span>{confidenceScore}</span>
              <p>/100</p>
            </div>
          </div>

          <div className="card">
            <div className="icon red">
              <HiMiniExclamationCircle />
            </div>

            <div className="content">
              <h3>Grammatical Mistakes</h3>
              <p>Mistakes in your speech</p>
            </div>

            <div className="score">
              <span>{grammarMistakes}</span>
              <p>mistakes</p>
            </div>
          </div>

          <div className="info-card">
            <p>
              Tracking helps you understand your
              progress and improves with time.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard;

