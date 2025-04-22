"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { accountSchema } from "@/lib/schema";
import { Input } from "./ui/input";

const CreateAccountDrawer = ({ children }) => {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false
        }
    })

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Account Type</label>
                            
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>

    )
}

export default CreateAccountDrawer