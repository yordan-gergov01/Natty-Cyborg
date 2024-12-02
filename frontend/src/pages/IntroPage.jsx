import { Link } from "react-router";

function IntroPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to The Natty Cyborg</h1>
      <p className="mt-4 text-gray-600">
        Your ultimate app for tracking workouts, meals, and progress!
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default IntroPage;
