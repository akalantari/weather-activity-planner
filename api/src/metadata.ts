/**
 * This file ensures that reflect-metadata is properly imported at the entry point.
 * TypeGraphQL and TypeDI require this for decorator metadata to function correctly.
 */
import 'reflect-metadata';