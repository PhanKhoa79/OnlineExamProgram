'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-6 py-12 bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
      {/* Animated Blobs Background */}
      <div className="absolute w-[500px] h-[500px] bg-pink-300 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-blob1 z-0" />
      <div className="absolute w-[400px] h-[400px] bg-purple-300 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-blob2 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 bg-white/70 dark:bg-gray-900/70 p-6 md:p-10 rounded-xl shadow-md backdrop-blur-lg max-w-4xl w-full">
        <div className="w-full max-w-[300px] md:max-w-[400px] flex-shrink-0">
          <Image
            src="/not-found.png"
            alt="404"
            width={400}
            height={400}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-200 px-4 py-1 rounded-full mb-2">
            Page not found
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Oh No! Error 404
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Maybe Bigfoot has broken this page. Come back to the homepage.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link href="/">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                Back to Homepage
              </button>
            </Link>

            <Link href="/support">
              <button className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition w-full sm:w-auto">
                Visit our help center
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
