"use client";

import { startTransition, useActionState, useId } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

const initial: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const uid = useId();
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-5"
    >
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email" htmlFor={`${uid}-email`}>
        <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Kata sandi" htmlFor={`${uid}-password`}>
        <Input
          id={`${uid}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Memeriksa..." : "Masuk"}
        {!pending ? <Icon name="arrow-right" className="size-4" /> : null}
      </Button>
    </form>
  );
}
