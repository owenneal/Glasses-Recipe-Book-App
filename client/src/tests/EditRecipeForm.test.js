import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditRecipeForm from "../components/EditRecipeForm";
import { updateRecipe } from "../services/api";

jest.mock("../services/api", () => ({
  updateRecipe: jest.fn()
}));

describe("EditRecipeForm", () => {
  const recipe = {
    _id: "1",
    title: "Pancakes",
    ingredients: ["Eggs", "Milk"],
    instructions: ["Mix", "Cook"],
    public: true
  };

  test("renders pre-filled form fields", () => {
    render(<EditRecipeForm recipe={recipe} onUpdate={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByDisplayValue("Pancakes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Eggs, Milk")).toBeInTheDocument();
  });

  test("calls updateRecipe and onUpdate on submit", async () => {
    updateRecipe.mockResolvedValueOnce({ success: true });

    const onUpdate = jest.fn();
    render(<EditRecipeForm recipe={recipe} onUpdate={onUpdate} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Recipe Title/i), { target: { value: "Waffles" } });
    fireEvent.submit(screen.getByText(/Save Changes/i));

    await waitFor(() => expect(updateRecipe).toHaveBeenCalled());
    expect(onUpdate).toHaveBeenCalled();
  });

  test("shows error if update fails", async () => {
    updateRecipe.mockRejectedValueOnce(new Error("API fail"));

    render(<EditRecipeForm recipe={recipe} onUpdate={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.submit(screen.getByText(/Save Changes/i));

    await waitFor(() => screen.getByText(/Failed to update recipe/i));
  });
});
