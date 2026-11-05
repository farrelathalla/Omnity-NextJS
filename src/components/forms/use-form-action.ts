"use client";

import { startTransition, useActionState, type FormEvent } from "react";

/**
 * Server-action form without React 19's automatic field reset (which would wipe
 * what the visitor typed whenever validation fails): submit by hand inside a transition.
 */
export function useFormAction<S>(
  action: (prev: Awaited<S>, fd: FormData) => S | Promise<S>,
  initial: Awaited<S>,
) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  };
  return { state, pending, onSubmit };
}
