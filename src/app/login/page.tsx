'use client';

import { Ubuntu } from "next/font/google";
import {Button} from "@headlessui/react";

const ubuntu = Ubuntu({
    weight: "500",
    subsets: ['latin'],
    display: 'swap',
})

export default function Login() {
    return (
      <div>
        <section>
            <div className="flex flex-grow items-center justify-center mx-auto">
                <div
                    className="flex flex-col items-center w-[550px] h-[425px] bg-black/25 border-2 border-neutral-600/50 rounded-xl mt-36">
                    <label htmlFor="string" className={ubuntu.className + " p-4 text-xl text-white"}>SIGN IN TO YOUR ACCOUNT</label>
                    <form className="items-center justify-center" method="POST">
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
                                className="bg-neutral-600/10 border-2 border-neutral-700/30 border-neutral font-mono placeholder:text-gray-300 text-white/75 rounded-lg focus:outline-none block w-[350px] p-2.5 transition duration-300 ease-in placeholder-gray-400 text-gray-300 focus:border-gray-500/30"
                                placeholder="email@email.com"
                            >
                            </input>
                        </div>
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
                                className="bg-neutral-600/10 border-2 border-neutral-700/30 border-neutral font-mono placeholder:text-gray-300 text-white/75 rounded-lg focus:outline-none block w-[350px] p-2.5 transition duration-300 ease-in placeholder-gray-400 text-gray-300 focus:border-gray-500/30"
                            >
                            </input>
                        </div>
                        <div className="flex items-center justify-between allign mt-6">
                            <a
                                href="#"
                                className="text-sm font-medium text-neutral-400 underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <Button
                                type="submit"
                                className={ubuntu.className + " mt-8 w-36 text-sm text-white bg-neutral-800/75 rounded-lg shadow-lg px-5 py-2.5 focus:outline-none transition duration-100 ease-in hover:bg-neutral-700/50 hover:scale-105"}
                            >
                                SIGN IN
                            </Button>
                            <div className="flex items-center justify-between allign mt-3">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-neutral-400 underline"
                                >
                                   Create Account
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/*<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-neutral rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" method="POST">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-neutral text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="email@email.com"
                    >
                    </input>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-neutral text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                    </input>
                  </div>
                  <div className="flex items-center justify-between allign">
                    <a
                      href="#"
                      className="text-sm font-medium hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>*/}
        </section>
      </div>
    );
  }