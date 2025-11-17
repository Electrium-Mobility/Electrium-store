export default function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="mx-4">
      <input
        type="checkbox"
        id={title}
        className={`mr-2 peer accent-[hsl(var(--btn-primary))]`}
      />
      <label
        htmlFor={title}
        className={`text-lg text-[hsl(var(--text-primary))] peer-checked:line-through font-semibold hover:cursor-pointer`}
      >
        {title}
      </label>
      <div
        className={`mx-6 text-[hsl(var(--text-secondary))] text-sm peer-checked:line-through`}
      >
        {children}
      </div>
    </li>
  );
}
