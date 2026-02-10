package com.example.backend.exception;

public class DuplicateSlugException extends RuntimeException {
    public DuplicateSlugException(String slug) {
        super("Slug already exists: '" + slug + "'. Please use a unique slug.");
    }
}
