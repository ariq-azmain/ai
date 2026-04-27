import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="h-screen w-screen flex justify-centeri items-center bg-black">
            <SignUp />
        </div>
    );
}
