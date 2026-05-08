import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="h-screen w-screen flex justify-center items-center bg-black">
            <SignIn />
        </main>
    );
}
