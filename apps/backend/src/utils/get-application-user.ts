import { PrismaClient } from "@generated/prisma";
export function getApplicationUser(userId: string, prisma: PrismaClient) {
	return prisma.applicationUser.findUnique({
		where: { userId },
	});
}
