import VerifyEmailWaiting from "./VerifyEmailWaiting";

export default async function VerifyEmailWaitingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email = "", token = "" } = await searchParams;

  return <VerifyEmailWaiting email={email} token={token} />;
}
