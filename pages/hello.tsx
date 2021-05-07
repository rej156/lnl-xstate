import Head from "next/head";
import { World } from "../components/World";

export default function Hello() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>
        <World></World>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <div className="flex">Footer goes here</div>
      </footer>
    </div>
  );
}
