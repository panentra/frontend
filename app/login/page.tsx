import AuthForm from "../components/AuthForm";

export const metadata = {
  title: "Masuk - Panentra",
  description: "Masuk ke akun Panentra Petani atau Pembeli",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
