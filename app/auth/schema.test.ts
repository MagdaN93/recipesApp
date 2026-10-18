import { describe, expect, it } from "vitest";
import { LoginSchema, RegistrationSchema } from "./schema";

const validRegistrationData = { email: 'jan@gmail.com', password: '123456', replypassword: '123456'};

describe("RegistrationSchema", () => {
    it("normalises the email", () => {
        const data = RegistrationSchema.parse({ ...validRegistrationData, email: "  Jan@X.pl " });

        expect(data.email).toBe("jan@x.pl");
    });
    it("accepts valid data", () => {
        const result = RegistrationSchema.safeParse(validRegistrationData);

        expect(result.success).toBe(true);
    });
    it("rejects an invalid email format", () => {
        const result  = RegistrationSchema.safeParse({ ...validRegistrationData, email: "jan.pl" });

        expect(result.success).toBe(false);
    });
    it("rejects a password shorter than 6 characters", () => {
        const result  = RegistrationSchema.safeParse({ ...validRegistrationData, password: "12345", replypassword: "12345" });

        expect(result.success).toBe(false);
    });
     it("accepts a password of exactly 6 characters", () => {
        const result  = RegistrationSchema.safeParse({ ...validRegistrationData, password: "123456", replypassword: "123456" });

        expect(result.success).toBe(true);
    });
    it("rejects different passwords", () => {
        const result  = RegistrationSchema.safeParse({ ...validRegistrationData, replypassword: "vfdergewr" });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path[0]).toBe("replypassword");
    });
});

const validLoginData = { email: 'jan@gmail.com', password: '123456'};

describe("LoginSchema", () => {
    it("normalises the email", () => {
        const data = LoginSchema.parse({ ...validLoginData, email: "  Jan@X.pl " });

        expect(data.email).toBe("jan@x.pl");
    });
    it("rejects an invalid email format", () => {
        const result  = LoginSchema.safeParse({ ...validLoginData, email: "jan.pl" });

        expect(result.success).toBe(false);
    });
    it("accepts valid data", () => {
        const result = LoginSchema.safeParse(validLoginData);

        expect(result.success).toBe(true);
    });
    it("rejects an empty password", () => {
        const result  = LoginSchema.safeParse({ ...validLoginData, password: "" });

        expect(result.success).toBe(false);
    });
    it("accepts a password of exactly 1 character", () => {
        const result  = LoginSchema.safeParse({ ...validLoginData, password: "1" });

        expect(result.success).toBe(true);
    });
});