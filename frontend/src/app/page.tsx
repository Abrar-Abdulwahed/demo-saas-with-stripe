"use client"
import Link from "next/link";
import Image from "next/image";
import axios from "axios"

export default function Home() {
  const handleManageSubscription = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-portal-session`,
      { customerId: 'cus_RRpKEh7at0YMnd' }
    );

    window.location.href = response.data.url;
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Main Content */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-2xl font-bold text-center sm:text-left">
          Welcome to the Subscription App
        </h1>
        <p className="text-center sm:text-left text-gray-600">
          Manage your subscriptions and explore available plans.
        </p>

        {/* Navigation Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/plans" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            View Plans
          </Link>
          <Link href="#" onClick={handleManageSubscription} className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Manage Subscriptions
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Documentation
        </a>
      </footer>
    </div>
  );
}
