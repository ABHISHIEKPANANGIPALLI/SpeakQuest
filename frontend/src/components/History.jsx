import "./History.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Nav from "../components/NavDash";

const History = () => {

    // Store all conversations
    const [history, setHistory] = useState([]);

    // Load history when page opens
    useEffect(() => {
        fetchHistory();
    }, []);

    // Get history from backend
    async function fetchHistory() {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const response = await axios.get(
                `http://localhost:5000/api/auth/api/history/${user._id}`
            );

            setHistory(response.data.history);

        }

        catch (error) {

            console.log(error);

        }

    }

    return (

        <>
            <Nav />

            <div className="history-page">

                <h1>Conversation History</h1>

                <div className="history-container">

                    {

                        history.length === 0 ?

                            <h2>No Conversation Found</h2>

                            :

                            history.map((item, index) => (

                                <div className="history-card" key={index}>

                                    <h2>Conversation {index + 1}</h2>

                                    <div className="user-message">

                                        <h4>You</h4>

                                        <p>{item.transcript}</p>

                                    </div>

                                    <div className="ai-message">

                                        <h4>SpeakQuest</h4>

                                        <p>{item.aiReply}</p>

                                    </div>

                                    <div className="score-box">

                                        <span>Fluency : {item.fluency}</span>

                                        <span>Confidence : {item.confidence}</span>

                                        <span>Grammar : {item.grammarMistakes}</span>

                                        <span>Fillers : {item.fillers}</span>

                                    </div>

                                </div>

                            ))

                    }

                </div>

            </div>

        </>

    );

};

export default History;