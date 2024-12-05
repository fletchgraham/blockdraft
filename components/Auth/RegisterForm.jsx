import AuthProviderBtns from "./AuthProviderBtns";
import RegisterWithEmail from "./RegisterWithEmail";

export default function RegisterForm() {
  return (
    <div className="items-center">
      <AuthProviderBtns />
      <p className="mb-4 text-center">or</p>
      <RegisterWithEmail />
    </div>
  );
}
