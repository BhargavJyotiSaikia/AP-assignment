package org.example;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RegistrationServiceTest {

    private RegistrationService service;

    @BeforeEach
    void setUp() {
        service = new RegistrationService();
    }

    @Test
    void testSuccessfulRegistration()
            throws InvalidEmailException {

        boolean result =
                service.registerUser(
                        "test@example.com",
                        20
                );

        assertTrue(result);
    }

    @Test
    void testInvalidEmailFormat() {

        assertThrows(
                InvalidEmailException.class,
                () -> service.registerUser(
                        "invalid-email",
                        20
                )
        );
    }

    @Test
    void testEmptyEmail() {

        assertThrows(
                InvalidEmailException.class,
                () -> service.registerUser(
                        "",
                        20
                )
        );
    }

    @Test
    void testUnderageUser() {

        assertThrows(
                UnderageException.class,
                () -> service.registerUser(
                        "test@example.com",
                        16
                )
        );
    }
}