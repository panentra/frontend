import AuthForm from "../components/AuthForm";

export const metadata = {
  title: "Daftar Akun - Panentra",
  description: "Daftar akun baru Panentra untuk Petani atau Pembeli",
};

export default function RegisterPage() {
  return <AuthForm initialMode="register" />;
}
