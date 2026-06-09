package org.example;

public class RegistrationService {

    public boolean registerUser(String email, int age)
            throws InvalidEmailException {

        // Internal assertion
        assert age >= 0 : "Age cannot be negative";

        // Null or empty check
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidEmailException(
                    "Email cannot be null or empty"
            );
        }

        // Regex validation
        String emailRegex =
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        if (!email.matches(emailRegex)) {
            throw new InvalidEmailException(
                    "Invalid email format: " + email
            );
        }

        // Age validation
        if (age < 18) {
            throw new UnderageException(
                    "User must be at least 18 years old"
            );
        }

        return true;
    }
}