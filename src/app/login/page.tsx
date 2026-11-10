import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const providers = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? ["google", "Continue with Google"]
    : null,
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? ["github", "Continue with GitHub"]
    : null,
  process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET
    ? ["facebook", "Continue with Facebook"]
    : null,
  process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET
    ? ["twitter", "Continue with X"]
    : null,
  process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
    ? ["microsoft-entra-id", "Continue with Microsoft"]
    : null,
].filter((provider): provider is [string, string] => Boolean(provider));

type LoginSearchParams = {
  registered?: string;
  verified?: string;
  checkEmail?: string;
  error?: string;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  if (await auth()) redirect("/");

  const q = await searchParams;

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="card p-4 p-lg-5">
          <h1 className="h3 fw-bold">Sign in</h1>
          <p className="muted">Access your submissions and staff workspace.</p>

          {q.registered && (
            <div className="alert alert-success">Account created. You can now sign in.</div>
          )}
          {q.verified && (
            <div className="alert alert-success">Email verified. You can now sign in.</div>
          )}
          {q.checkEmail && (
            <div className="alert alert-info">Check your email for a verification link.</div>
          )}
          {q.error === "CredentialsSignin" && (
            <div className="alert alert-danger" role="alert" aria-live="polite">
              Invalid email or password. Your account may also be inactive. Please try again.
            </div>
          )}
          {q.error && q.error !== "CredentialsSignin" && (
            <div className="alert alert-danger" role="alert">
              Sign-in failed. Please try again. If the problem continues, contact the administrator.
            </div>
          )}

          <form
            action={async (fd: FormData) => {
              "use server";

              try {
                await signIn("credentials", {
                  email: fd.get("email"),
                  password: fd.get("password"),
                  redirectTo: "/my-ideas",
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  redirect("/login?error=CredentialsSignin");
                }

                throw error;
              }
            }}
          >
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-control mb-3"
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
            />

            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-control mb-3"
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />

            <button className="btn btn-primary w-100" type="submit">
              Sign in with email
            </button>
          </form>

          {providers.length > 0 && (
            <>
              <div className="text-center text-secondary small my-3">OR CONTINUE WITH</div>
              <div className="d-grid gap-2">
                {providers.map(([id, label]) => (
                  <form
                    action={async () => {
                      "use server";
                      await signIn(id, { redirectTo: "/my-ideas" });
                    }}
                    key={id}
                  >
                    <button className="btn btn-outline-dark w-100" type="submit">
                      {label}
                    </button>
                  </form>
                ))}
              </div>
            </>
          )}

          <p className="small mt-4 mb-0">
            New to BetterSipocot? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
