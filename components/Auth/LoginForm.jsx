import AuthProviderBtns from "./AuthProviderBtns";
import LoginWithEmail from "./LoginWithEmail";

export default function LoginForm() {
  return (
    <div className="items-center">
      <AuthProviderBtns />
      <p className="mb-4 text-center">or</p>
      <LoginWithEmail />
    </div>
  );
}
