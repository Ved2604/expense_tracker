interface Props {
  message: string;
}

export default function ErrorBanner({ message }: Props) {
  return (
    <div
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "0.75rem 1rem",
        borderRadius: 6,
        marginBottom: "1rem",
      }}
    >
      {message}
    </div>
  );
}
