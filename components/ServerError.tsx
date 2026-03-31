import { isUnauthorizedError } from "@/functions/isUnauthenticatedError";
import RefreshAccessToken from "./refreshAccessToken";

type Props = {
  error: unknown;
}

const ServerError = ({ error }: Props) => {
  if (isUnauthorizedError(error)) {
    return <RefreshAccessToken />
  }
  throw error;
}

export default ServerError;