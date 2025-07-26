import { type ChangeEvent, type Dispatch } from "react"
import { createClient } from "@/utils/supabase/client";

const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const supabase = await createClient()
    if (!e.target.files || e.target.files.length === 0) {
        console.error("No file selected")
        return
    }

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error("Upload failed")
        }

        const data = await response.json()

        if (data.success) {
            await new Promise(r => setTimeout(r, 1000));
            console.log('Data:', data)
            const { data: result, error } = await supabase.storage.from('Images').createSignedUrl(data.data.path, 315569520);
            if (error) {
                throw error;
            }
            return result.signedUrl 
        } else {
            console.error("Upload failed")
        }
    } catch (error) {
        console.error("Error uploading file:", error)
    } 
}
export default uploadImage;