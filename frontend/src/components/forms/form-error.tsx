export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-rose-300">{message}</p>;
};

