interface InlineErrorProps {
  message: string | null;
}

export function InlineError({ message }: InlineErrorProps) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-rose-300/92">{message}</p>;
}
