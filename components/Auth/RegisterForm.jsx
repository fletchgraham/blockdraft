import AuthProviderBtns from "./AuthProviderBtns";
import RegisterWithEmail from "./RegisterWithEmail";

export default function RegisterForm() {
  return (
    <div className="mx-auto max-w-md flex flex-col items-center mt-10">
      <h2 className="text-center text-2xl font-bold mb-5 mt-10">
        Create an account
      </h2>
      <AuthProviderBtns />
      <p className="mb-4">or</p>
      <RegisterWithEmail />
    </div>
  );
}
