import { useState } from "react";

export type ShowOption = "all" | "role" | "email" | "status";

export function useShowFilter(initial: ShowOption = "all") {
  const [show, setShow] = useState<ShowOption>(initial);
  return { show, setShow };
}
