export type MockUser = {
  name: string;
  role: "owner" | "admin" | "operator" | "analyst";
  email: string;
};

export const mockUser: MockUser = {
  name: "Soshi",
  role: "owner",
  email: "soshi@astracommerce.com",
};
