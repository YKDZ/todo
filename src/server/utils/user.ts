import type { User } from "@/shared/schema/prisma";
import { UserSchema } from "@/shared/schema/prisma";
import { prisma } from "../db/prisma";
import { redis } from "../db/redis";

export const userFromSessionId = async (sessionId: string | null): Promise<User | null> => {
  if (!sessionId) return null;
  const userId = await redis.hGet(`user:session:${sessionId}`, "userId");
  if (!userId) return null;

  return await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
    })
    .then((user) => {
      return UserSchema.parse(user);
    })
    .catch(() => null);
};
