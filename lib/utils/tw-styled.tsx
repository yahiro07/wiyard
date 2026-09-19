import { HTMLAttributes, JSX } from "react";
import { cz } from "./cz";

export const twStyled = new Proxy(
  {},
  {
    get(_, _tagName) {
      const TagName = _tagName as any;
      return (...classes: string[]) => {
        return (props: HTMLAttributes<HTMLElement>) => {
          return (
            <TagName
              {...props}
              className={cz(...classes, props.className as string)}
            />
          );
        };
      };
    },
  },
) as Record<
  string,
  (...classes: string[]) => (props: HTMLAttributes<HTMLElement>) => JSX.Element
>;
