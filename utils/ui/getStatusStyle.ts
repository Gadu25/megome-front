export const getStatusStyle = (status: string) => {
  switch (status) {
    case "active":
      return "badge-success";
    case "completed":
      return "badge-primary";
    case "pending":
      return "badge-warning";
    case "archived":
      return "badge-ghost";
    default:
      return "badge-outline";
  }
}
