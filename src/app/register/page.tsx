'use client';

import { Ubuntu } from "next/font/google";
import {Button} from "@headlessui/react";
import Card from "@/components/Card";
import TextButton from "@/components/TextButton";
import registerAction from "../actions/register";
import { useActionState } from "react";

const ubuntu = Ubuntu({
    weight: "500",
    subsets: ['latin'],
    display: 'swap',
})

export default function Register() {
    const [state, action, pending] = useActionState(registerAction, undefined);
    return (
        <form action={action}>
        <div className="flex flex-grow items-center justify-center mx-auto mt-36">
                <Card width="550" height="425">
                    <div className="flex flex-col items-center justify-center">
                        <label htmlFor="string" className={ubuntu.className + " p-4 text-xl text-white"}>CREATE AN ACCOUNT</label>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-mono text-white/75"
                                >
                                    Your E-Mail
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-neutral-600/30 border-2 border-neutral-600/50 border-neutral font-mono placeholder:text-gray-300 text-white/75 rounded-lg focus:outline-none block w-[350px] p-2.5 transition duration-300 ease-in placeholder-gray-400 text-gray-300 focus:border-gray-400/50"
                                    placeholder="email@email.com"
                                >
                                </input>
                            </div>
                            {state?.errors?.email && <p>{state.errors.email}</p>}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mt-6 block mb-2 text-sm font-mono text-white/75"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-neutral-600/30 border-2 border-neutral-600/50 border-neutral font-mono placeholder:text-gray-300 text-white/75 rounded-lg focus:outline-none block w-[350px] p-2.5 transition duration-300 ease-in placeholder-gray-400 text-gray-300 focus:border-gray-400/50"
                                >
                                </input>
                            </div>
                            {state?.errors?.password && (
                                <div>
                                    <p>Password must:</p>
                                    <ul>
                                        {state.errors.password.map((error) => (
                                            <li key={error}>- {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex flex-col items-center justify-center">
                                <Button disabled={pending} type="submit" className="mt-8">
                                    <TextButton heading="Register"></TextButton>
                                </Button>
                            </div>
                    </div>
                </Card>
            </div>
      </form>
    );
  }