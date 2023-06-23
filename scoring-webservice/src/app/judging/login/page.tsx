import { Suspense } from "react";
import LoginAuthForm from "@/component/login-auth-form";

export default async function loginPage() {

    const loginURL = process.env.JUDGING_LOGIN_URL

    return (
        <Suspense fallback={<div>...Loading...</div>}>
            {/* @ts-expect-error Server Component */}
            <LoginAuthForm url={loginURL} />
        </Suspense>
    );
}