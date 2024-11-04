import {createClient} from "@/utils/supabase/server";
import {cookies} from 'next/headers';

export interface Bike {
    bike_id: number;
    name: string;
    description: string;
    image: string | null;
    amount_stocked: number;
    rental_rate: number;
    sell_price: number;
    damage_rate: number;
    for_rent: boolean;
};

export async function getOneBike(productId: string) {
    const cookieStore = cookies();
    const supabase = await createClient();
    const {data: bike, error} = await supabase
        .from('bikes')
        .select('*')
        .eq('bike_id', productId)
        .single();

    if (error || !bike) {
        return null;
    }
    return bike as Bike;
}

export async function getManyBikes(productIds: string[]) {
    const cookieStore = cookies();
    const supabase = await createClient();
    const {data: bikes, error} = await supabase
        .from('bikes')
        .select('*')
        .in('bike_id', productIds)

    if (error || !bikes) {
        return null;
    }
    return bikes as Bike[];
}