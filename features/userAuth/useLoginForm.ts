import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

const baseLoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().optional(),
});

const signUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(1, "Username is required"),
});

export type LoginFormData = z.infer<typeof baseLoginFormSchema>;

const defaultValues: LoginFormData = {
  email: "",
  password: "",
  username: "",
};

export const useLoginForm = (isSignUp: boolean = false) => {
  const schema = useMemo(
    () => (isSignUp ? signUpFormSchema : baseLoginFormSchema),
    [isSignUp]
  );

  return useForm<LoginFormData>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onTouched",
  });
};
