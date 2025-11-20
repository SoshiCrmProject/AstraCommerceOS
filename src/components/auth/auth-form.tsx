import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ReactNode } from "react";

type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  submitLabel: string;
};

export function AuthForm({ action, children, submitLabel }: AuthFormProps) {
  return (
    <form action={action} className="space-y-4">
      {children}
      <SubmitButton label={submitLabel} />
    </form>
  );
}

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Processing..." : label}
    </button>
  );
};
