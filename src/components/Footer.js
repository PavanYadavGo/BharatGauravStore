export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white py-6 mt-10 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BHARATGAURAV. All rights reserved.
        </p>
        <p className="mt-2">
          <a href="https://bharatgauravshop.com/privacy-policy" className="hover:underline dark:hover:text-blue-400">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="https://bharatgauravshop.com/terms-and-conditions" className="hover:underline ml-2 dark:hover:text-blue-400">
            Terms of Service
          </a>
          <a href="https://bharatgauravshop.com/ShippingPolicy" className="hover:underline ml-2 dark:hover:text-blue-400">
            ShippingPolicy
          </a>
          <a href="https://bharatgauravshop.com/ReturnPolicy" className="hover:underline ml-2 dark:hover:text-blue-400">
          ReturnPolicy
          </a>
          ReturnPolicy
          <a href="https://bharatgauravshop.com/RefundPolicy" className="hover:underline ml-2 dark:hover:text-blue-400">
          RefundPolicy
          </a>
        </p>
      </div>
    </footer>
  );
}
