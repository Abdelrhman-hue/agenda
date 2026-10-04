import { verifyingEmail } from "@/actions/verification.action"
import VerificationSuccess from "./verificationSuccess"
import VerificationError from "./VerificationError"

interface IVerifyProps {
   searchParams: Promise<{ token: string }>
}
const VerifyPage = async ({ searchParams }: IVerifyProps) => {
   const { token } = await searchParams

   const result = await verifyingEmail(token)

   if (!result.isSuccess) {
      return <VerificationError message={result.message} />
   }

   return <VerificationSuccess message={result.message} />

}

export default VerifyPage