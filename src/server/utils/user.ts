import { UserSchema } from "@/shared/schema/prisma";
import { prisma } from "../db/prisma";

export const userFromId = async (id: string) => {
  return UserSchema.nullable().parse(
    await prisma.user.findUnique({
      where: {
        id,
      },
    }),
  );
};
