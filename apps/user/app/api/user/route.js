// returns user profile details

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req, { params }) {
    try{
        const { id } = params;
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
        });
    
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}