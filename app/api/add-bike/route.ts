'use server'

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { type Bike } from "@/utils/getBike";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const bike = await req.json() as Bike;

    if (!bike) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('bikes')
            .insert({
                name: bike.name,
                description: bike.description,
                image: bike.image,
                amount_stocked: bike.amount_stocked,
                rental_rate: bike.rental_rate,
                sell_price: bike.sell_price,
                damage_rate: bike.damage_rate,
            });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error}, { status: 500 });
    }
}