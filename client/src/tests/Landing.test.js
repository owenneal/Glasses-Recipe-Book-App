import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "../components/Landing";

jest.mock("../components/Login", () => () => <div>Login Form</div>);
jest.mock("../components/Register", () => () => <div>Register Form</div>);

describe("Landing", () => {
  test("switches between login and register modes", () => {
    render(<Landing onAuth={jest.fn()} />);
    expect(screen.getByText("Login Form")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Register/i));
    expect(screen.getByText("Register Form")).toBeInTheDocument();
  });
});
