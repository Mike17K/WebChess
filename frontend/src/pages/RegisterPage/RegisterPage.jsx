import React from "react";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import DiscordLoginButton from "../../components/DiscordLoginButton/DiscordLoginButton";
import GithubLoginButton from "../../components/GithubLoginButton/GithubLoginButton";

import outerRegisterProvider from "../../hooks/outerRegisterProvider/outerRegisterProvider";

export default function LoginPage(props) {
  const [createUserCallback] = outerRegisterProvider({
    provider: "CustomForm",
  });

  function onSubmitHandle(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const password = formData.get("password");
    const passwordConf = formData.get("re-password");
    if (password !== passwordConf) {
      return;
    }

    if (!name || !password) return;

    createUserCallback({ name: name, password: password });

    e.target.reset(); // clear form
  }

  return (
    <>
      <section>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="mb-4 text-4xl font-bold">Sign Up</h1>
          <p className="text-gray-500 mb-4">Register your account</p>
          <form onSubmit={onSubmitHandle} className="flex w-1/2 flex-col">
            <table className="w-full">
              <tbody>
                <tr className="py-2">
                  <td>
                    <label htmlFor="name" className="text-gray-700">
                      User Name
                    </label>
                  </td>
                  <td >
                    <input
                      pattern="[A-Za-z0-9]+"
                      required
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Username"
                      className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
                <tr className="py-2">
                  <td >
                    <label htmlFor="password" className="text-gray-700">
                      Password
                    </label>
                  </td>
                  <td >
                    <input
                      pattern="[A-Za-z0-9]+"
                      required
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
                <tr className="py-2">
                  <td >
                    <label htmlFor="re-password" className="text-gray-700">
                      Password
                    </label>
                  </td>
                  <td >
                    <input
                      pattern="[A-Za-z0-9]+"
                      required
                      type="password"
                      id="re-password"
                      name="re-password"
                      placeholder="Password"
                      className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-gray-800 w-full text-[10px]">Already have an account? <a href="/login" className="text-blue-800 underline">log in</a><span className="w-1/2"></span></p>
            <button
              type="submit"
              className="mx-auto mt-4 w-[50%] rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-gray-500">Or Sign up with</p>
          <div className="my-4 h-1 w-3/5 border-t border-gray-300"></div>

          <div className="my-2 flex flex-col gap-2">
            <GoogleLoginButton />
            <DiscordLoginButton />
            <GithubLoginButton />
          </div>
        </div>
      </section>
    </>
  );
}
