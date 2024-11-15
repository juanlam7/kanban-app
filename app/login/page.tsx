import WrapperForm from "./components/WrapperForm";

export default async function LoginPage() {
  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px] text-center">
        <WrapperForm />
      </div>
    </section>
  );
}
