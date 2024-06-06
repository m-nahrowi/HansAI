import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev=>prev+nextWord)
        },75*index)
    };

    const onSent = async () => {
        console.log("onSent triggered");
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        try {
            console.log("Sending input to runChat:", input);
            const response = await runChat(input);
            console.log("Response from runChat:", response);
            let newResponse;
            let responseArray = response.split("**");
            try {
                for (let i = 0; i < responseArray.length; i++) {
                    if (i === 0 || i % 2 !== 1) {
                        newResponse += responseArray[i];
                    } else {
                        newResponse += "<b>" + responseArray[i] + "</b>";
                    }
                }
                setResultData(newResponse);
                let newResponse2 = newResponse.replace("undefined", "");
                setResultData(newResponse2);
                let newResponse3 = newResponse2.split("*").join("</br>");
                let newResponse4 = newResponse3.split(":").join(": <br/>");
                setResultData(newResponse4);
                // let newResponseArray = newResponse3.split(" ");
                // for (let i = 0 ; i < newResponseArray.length; i++) {
                //     const nextWord = newResponseArray[i];
                //     delayPara(i, nextWord+ " ");
                // }
                // setLoading(false);
                // setInput("");
            } catch (error) {
                console.error("Error in onSent:", error);
                setResultData("There was an error processing your request.");
            } finally {
                setLoading(false);
                setInput("");
            }
        } catch (error) {
            console.error("Error in onSent:", error);
            setResultData("There was an error processing your request.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    // onSent("what is react js")

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
    };

    return (
        <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    );
};

export default ContextProvider;
