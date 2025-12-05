import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login";
import api from "../services/api";

jest.mock("../services/api", () => ({
  post: jest.fn()
}));

describe("Login", () => {
  test("calls API and onLogin when credentials are correct", async () => {
    const mockLogin = jest.fn();
    api.post.mockResolvedValueOnce({ data: { token: "abc", user: { email: "a@test.com" } } });

    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "a@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "1234" } });
    fireEvent.submit(screen.getByText(/Login/i));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("abc", { email: "a@test.com" }));
  });

  test("shows error message when login fails", async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
    render(<Login onLogin={jest.fn()} />);

    fireEvent.submit(screen.getByText(/Login/i));
    await waitFor(() => screen.getByText(/Invalid credentials/i));
  });
});
