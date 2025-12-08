import { render, screen, waitFor } from "@testing-library/react";
import Example from "../components/Example";
import { fetchExampleData } from "../services/api";

jest.mock("../services/api", () => ({
  fetchExampleData: jest.fn()
}));

describe("Example", () => {
  test("displays data when fetched", async () => {
    fetchExampleData.mockResolvedValueOnce({ msg: "Hello" });
    render(<Example />);
    await waitFor(() => screen.getByText(/Hello/i));
  });

  test("shows error on API failure", async () => {
    fetchExampleData.mockRejectedValueOnce(new Error("fail"));
    render(<Example />);
    await waitFor(() => screen.getByText(/Failed to fetch data/i));
  });
});
