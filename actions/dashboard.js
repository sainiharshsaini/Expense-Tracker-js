"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) throw new Error("User not found");

        const balanceFloat = parseFloat(data.balance);  // convert balance to float before saving

        if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

        const existingAccounts = await db.account.findMany({  // check if this is the user's first account
            where: { userId: user.id }
        })

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

        if (shouldBeDefault) { // If the account should be default, unset other default accounts
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault
            }
        });

        // nextjs doesn't support decimals value
        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard"); // it help to re-fetch the value of this page
        return { success: true, data: serializedAccount };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getUserAccounts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
        where: {userId: user.id},
        orderBy: {createdAt: "desc"},
        include: {
            _count: {
                select: {
                    transactions: true
                }
            }
        }
    })

    const serializedAccount = accounts.map(serializeTransaction)

    return serializedAccount;
}