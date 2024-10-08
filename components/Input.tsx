export default function Input({
  children,
  type,
  ...props
}: {
  children?: React.ReactNode;
  type?: string;
  [key: string]: any;
}) {
  if (type === "select") return <select
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    {...props}
  >{children}</select>;
  if (type === "radio") return <input type="radio" {...props} />;
  return (
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      {...props}
      type={type}
    />
  );
}
