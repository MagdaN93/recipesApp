import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { login } from "@/app/auth/actions";

vi.mock("@/app/auth/actions", () => ({
    login: vi.fn(),
    loginAsDemo: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
});

afterEach(() => {
    cleanup();
});

describe("LoginForm", () => {
    it("shows validation errors when the form is empty", async () => { 
        render(<LoginForm />);
        fireEvent.click(screen.getByRole("button", { name: "Zaloguj" }));
        expect(await screen.findByText("Wpisz hasło")).toBeDefined();
        expect(await screen.findByText("Podaj poprawny adres email.")).toBeDefined();
        expect(login).not.toHaveBeenCalled();
    });
    it("submits the email and password to the login action", async () => {
        render(<LoginForm />);
        const user = userEvent.setup();
        await user.type(screen.getByLabelText("Email"), "jan@x.pl");
        await user.type(screen.getByLabelText("Hasło"), "secret1");
        await user.click(screen.getByRole("button", { name: "Zaloguj" }));

        await waitFor(() => expect(login).toHaveBeenCalledWith({ email: "jan@x.pl", password: "secret1" }));
    });
    it("shows the server error under the password field", async () => {
        render(<LoginForm />)
        vi.mocked(login).mockResolvedValue({ errors: { password: ["Nieprawidłowy email lub hasło"] } });
        const user = userEvent.setup();
        await user.type(screen.getByLabelText("Email"), "jan@x.pl");
        await user.type(screen.getByLabelText("Hasło"), "secret1");
        await user.click(screen.getByRole("button", { name: "Zaloguj" }));
        expect(await screen.findByText("Nieprawidłowy email lub hasło")).toBeDefined();
    });
});
