import axios from "axios";
import React, { useState } from "react";



type Props = {
    onSubmit: (apiKey: string) => void; // Update the prop type to accept a function with a string parameter
};



export const Modal = ({ onSubmit }: Props) => {
    const [apiKey, setApiKey] = useState<string>("");
    const [verifying, setVerifying] = useState<Boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [submitted, setSubmitted] = useState<boolean>(false)



    const submitKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setVerifying(true)

        try {
            const response = await axios.get(
                "https://api.openai.com/v1/models",
                
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            if (response.status === 200) {
                localStorage.setItem("openai-api-key", apiKey)
                onSubmit(apiKey)
                setSubmitted(true)
            }
        } catch (error) {
            setErrorMsg('Invalid API Key, please try again')
            console.log(errorMsg)
            console.log('Invalid API Key, please try again')
        } finally {
            setVerifying(false)
        }
    };


    if (submitted) {
        return null; // Return null to hide the component
    }


    return (
        
        <div
            id="authentication-modal"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed content-center z-50 flex items-center justify-center h-screen justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white">
                            Locally Store Secret Key
                        </h3>
                    </div>

                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={submitKey}>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    OpenAI API Key
                                </label>
                                <input
                                    onChange={(e) => setApiKey(e.target.value)}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />

                                {errorMsg && (
                                    <p className="text-red-500">{errorMsg}</p>
                                )}

                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {verifying ? "Verifying..." : "Access Chat Bot"}

                            </button>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Don't have API Key?
                                <a
                                    href="https://platform.openai.com/apps"
                                    className="text-blue-700 hover:underline dark:text-blue-500"
                                >
                                    OpenAI
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
