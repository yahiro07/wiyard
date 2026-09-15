import { cz } from "@lib/utils/cz";

export const UpperLabel = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <div
        className={cz("absolute-top-center -top-15px", "text-10px font-600")}
      >
        {label}
      </div>
      {children}
    </div>
  );
};
