'use server'

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const supabase = await createClient();

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name}`;

    try {
        const { data, error } = await supabase.storage
            .from('Images')
            .upload(filename, buffer, {
                cacheControl: '3600',
                upsert: false
            });
        if (error) {
            throw error;
        }
        console.log('File uploaded:', data);
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ success: false, message: 'Error saving file' }, { status: 500 });
    }
}