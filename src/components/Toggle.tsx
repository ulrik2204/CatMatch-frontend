import { Switch } from "@headlessui/react";
import { Fragment } from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedTitle?: string;
  uncheckedTitle?: string;
  default?: boolean;
};

export default function Toggle(props: ToggleProps) {
  return (
    <Switch checked={props.checked} onChange={props.onChange} as={Fragment}>
      {({ checked }) => (
        /* Use the `checked` state to conditionally style the button. */
        <div className="flex flex-row">
          <p className={`pr-2 ${!checked ? "font-bold" : "font-light"}`}>{props.uncheckedTitle}</p>
          <button
            className={`${
              checked ? "bg-green-600" : "bg-red-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Show likes or dislikes distribution toggle</span>
            <span
              className={`${
                checked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </button>
          <p className={`pl-2 ${checked ? "font-bold" : "font-light"}`}>{props.checkedTitle}</p>
        </div>
      )}
    </Switch>
  );
}
