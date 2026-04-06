import { track } from "@vercel/analytics";

export const analytics = {
  login: () => track("login_success"),

  register: () => track("register_success"),

  createTransaction: () => track("transaction_created"),

  deleteTransaction: () => track("transaction_deleted"),

  createCategory: () => track("category_created"),
  
  deleteCategory: () => track("category_deleted"),

  viewDashboard: () => track("view_dashboard"),

  apiError: (action: string) =>
    track("api_error", { action }),
};