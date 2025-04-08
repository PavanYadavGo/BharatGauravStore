export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white py-6 mt-10 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} My E-Commerce. All rights reserved.
        </p>
        <p className="mt-2">
          <a href="#" className="hover:underline dark:hover:text-blue-400">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="hover:underline ml-2 dark:hover:text-blue-400">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
}
