import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TUpdateUser } from "@/utils/dto"
import { updateUserSchema } from "@/utils/validation/user/update"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
   try {

      const session = await auth()


      if (!session) {
         return NextResponse.json({ message: "المستخدم غير موجود", status: "fail" }, { status: 401 })
      }

      // get user according to id from session obj
      const user = await prisma.user.findUnique({
         where: { id: session.user?.id },
         select: {
            name: true,
            email: true,
            emailVerified: true,
            phone: true,
            role: true,
            createdAt: true
         }
      })

      if (!user) {
         return NextResponse.json({ status: "fail", message: "المستخدم غير موجود" }, { status: 401 })
      }

      return NextResponse.json({ message: "المستخدم موجود", status: "success", data: { user } }, { status: 200 })

   } catch (error) {
      console.log("error from server users get method => , ", error)
      return NextResponse.json({ message: "حدث خطأ فى السيرفر", status: "error" }, { status: 500 })
   }
}

/**
 * PATCH /api/users/me
 *
 * Updates the authenticated user's profile data.
 *
 * Authentication:
 * - Required
 * - User is identified from the current session.
 *
 * Body:
 * {
 *   name?: string;
 *   phone?: string;
 * }
 *
 * Responses:
 * - 200: User updated successfully
 * - 400: Invalid request data
 * - 401: User is not authenticated
 * - 409: Data conflict
 * - 500: Internal server error
 *
 * Notes:
 * - userId must not be received from the client.
 * - Only allowed user fields can be updated.
 * - Request body must be validated before updating the database.
 */
export async function PATCH(req: NextRequest) {
   const body = (await req.json()) as TUpdateUser
   const { name, password, phone, currentPassword } =  body

   try {

      const session = await auth()

      if (!session) {
         return NextResponse.json({ message: "سجل دخول اولًا", status: "fail" }, { status: 401 })
      }

      // get user
      const userFromDB = await prisma.user.findUnique({ where: { id: session.user?.id } })
      if (!userFromDB) {
         return NextResponse.json({ message: "غير مصرح لك بالتعديل علي البيانات", status: "fail" }, { status: 401 })
      }

      // validation
      const isValid = updateUserSchema.safeParse({ name, password, phone })
      if (!isValid.success) {
         return NextResponse.json({ message: isValid.error.issues[0].message, status: "fail" }, { status: 400 })
      }

      const data = isValid.data
      const updatedData: { name?: string; phone?: string; password?: string } = {}

      if (data.name !== undefined) {
         updatedData.name = data.name
      }

      if (data.password !== undefined) {

         if (!userFromDB.password) return NextResponse.json({ message: "لا يمكن تغير كلمة المرور", status: "fail" }, { status: 400 })

         if (currentPassword === undefined) {
            return NextResponse.json({ message: "كلمة المرور الحالية غير صحيحة", status: "fail" }, { status: 400 })
         }

         // check currentpass correct or not
         const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, userFromDB.password)

         if (!isCurrentPasswordCorrect) {
            return NextResponse.json({ message: "كلمة المرور الحالية غير صحيحة", status: "fail" }, { status: 400 })
         }

         // hashing password
         const passwordHashed = await bcrypt.hash(data.password, 10)
         updatedData.password = passwordHashed

      }

      if (data.phone !== undefined) {
         updatedData.phone = data.phone
      }



      await prisma.user.update({ where: { id: userFromDB.id }, data: updatedData })


      return NextResponse.json({ message: "تم تعديل البيانات بنجاح", status: "success", data: updatedData }, { status: 200 })


   } catch (error) {
      console.log("error from update api route in users/me => ", error)
      return NextResponse.json({ message: "حدث خطأ من السيرفر", status: "error" }, { status: 500 })
   }
}