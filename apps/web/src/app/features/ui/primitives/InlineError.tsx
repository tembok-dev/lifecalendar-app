interface InlineErrorProps {
  message: string | null;
}

export function InlineError({ message }: InlineErrorProps) {
  if (!message) {
    return null;
  }
  return <p className="text-[10px] text-rose-300">{message}</p>;
}

