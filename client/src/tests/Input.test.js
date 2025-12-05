import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipeInput from "../components/Input";
import { createRecipe } from "../services/api";

jest.mock("../services/api", () => ({
  createRecipe: jest.fn()
}));

describe("RecipeInput", () => {
  test("submits a new recipe", async () => {
    const mockAdd = jest.fn();
    createRecipe.mockResolvedValueOnce({ title: "Cake" });

    render(<RecipeInput onAddRecipe={mockAdd} />);

    fireEvent.change(screen.getByLabelText(/Recipe Title/i), { target: { value: "Cake" } });
    fireEvent.change(screen.getByLabelText(/Ingredients/i), { target: { value: "Flour, Sugar" } });
    fireEvent.change(screen.getByLabelText(/Cooking Instructions/i), { target: { value: "Mix. Bake." } });
    fireEvent.submit(screen.getByText(/Save Recipe/i));

    await waitFor(() => expect(mockAdd).toHaveBeenCalled());
  });
});
