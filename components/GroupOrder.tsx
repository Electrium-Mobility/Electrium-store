import React from "react"
import {useEffect} from "react"

type groupProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function groupOrder( {isOpen, setIsOpen} : groupProps) {
    useEffect ( () => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]) 
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick = { () => setIsOpen (false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" ></div>
        <div className="relative w-[600px] bg-[hsl(var(--background))] text-white rounded-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-8 items-center">
                <div className="flex-1 flex justify-center">
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center text-black">
                    QR Code
                </div>
                </div>
                <div className="flex-1">
                <div className="bg-white p-3 text-black rounded-lg">
                    https://example.com
                </div>
                </div>

            </div>
        </div>
    </div>
    );
}
