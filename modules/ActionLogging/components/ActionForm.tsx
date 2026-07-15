"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSubmitAction } from "../hooks/useSubmitAction";
import { Button } from "@/shared/components/elements/Button";

const actionSchema = z.object({
  action: z.string().trim().min(1, "Enter a status or proposed action."),
});

type ActionFormValues = z.infer<typeof actionSchema>;

export function ActionForm({ vehicleId }: { vehicleId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActionFormValues>({ resolver: zodResolver(actionSchema) });
  const submitAction = useSubmitAction();

  async function onSubmit(values: ActionFormValues) {
    try {
      await submitAction.mutateAsync({ vehicleId, action: values.action });
      reset();
    } catch {
      // Surfaced to the user via submitAction.isError below; nothing further to do here.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          {...register("action")}
          aria-label="Status or proposed action"
          placeholder="e.g. Price Reduction Planned"
          className="flex-1 rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-sm focus:border-secondary focus:outline-none"
        />
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </div>
      {errors.action ? (
        <p role="alert" className="text-label-sm text-error">
          {errors.action.message}
        </p>
      ) : null}
      {submitAction.isError ? (
        <p role="alert" className="text-label-sm text-error">
          Failed to log action. Try again.
        </p>
      ) : null}
    </form>
  );
}
