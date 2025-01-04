import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

function IntroPage() {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center"
      style={{ backgroundImage: 'url("public/intro-background.jpg")' }}
    >
      <div className="w-full max-w-2xl bg-black bg-opacity-40 p-12 rounded-xl shadow-2xl relative">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h1 className="text-4xl font-bold text-white text-center">
          Welcome to The Natty Cyborg
        </h1>
        <p className="mt-4 text-white text-center">
          Your ultimate app for tracking workouts, meals, and progress!
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-full text-lg"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-200 text-black hover:bg-gray-300 rounded-full text-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
