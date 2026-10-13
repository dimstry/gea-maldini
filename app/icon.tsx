import { iconResponse } from "./_brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return iconResponse(64, true);
}
